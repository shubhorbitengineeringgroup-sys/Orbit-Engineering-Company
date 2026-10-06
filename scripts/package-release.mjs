import { constants } from 'node:fs';
import { copyFile, lstat, mkdir, open, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { parse } from '@babel/parser';
import { blockedPublicPath } from './security-policy.mjs';

// Local packaging only. Never changes dist, uploads files, or replaces an older release.
const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const dist = contained(root, await realpath(path.resolve(root, process.env.RELEASE_BUILD_DIR || 'dist')));
const releaseRoot = path.join(root, '.qa', 'releases');
const MAX_ZIP_BYTES = 2_000_000_000; // Stay below ZIP32 and common upload/extraction limits.
const textExtensions = new Set(['.html', '.js', '.css', '.svg', '.json', '.webmanifest', '.xml', '.txt']);
const fileExtension = /\.[a-z0-9]{1,12}$/i;
const reasons = new Map();
const references = new Map();
const dynamicPrefixes = new Set();

function contained(base, destination) {
  const relative = path.relative(base, destination);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Path escapes ${base}: ${destination}`);
  }
  return destination;
}

async function safeDirectory(directory) {
  contained(root, directory);
  let current = root;
  for (const component of path.relative(root, directory).split(path.sep).filter(Boolean)) {
    current = contained(root, path.join(current, component));
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Unsafe output directory: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await mkdir(current);
    }
    contained(root, await realpath(current));
  }
}

async function walk(directory, base = directory) {
  if ((await lstat(directory)).isSymbolicLink()) throw new Error(`Symbolic links are not packaged: ${directory}`);
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = contained(base, path.join(directory, entry.name));
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not packaged: ${absolute}`);
    if (entry.isDirectory()) found.push(...await walk(absolute, base));
    else if (entry.isFile()) found.push(path.relative(base, absolute).split(path.sep).join('/'));
    else throw new Error(`Unsupported filesystem entry: ${absolute}`);
  }
  return found.sort();
}

const allFiles = await walk(dist);
for (const file of allFiles) {
  if (!['.htaccess', 'web.config', '.nojekyll'].includes(file) && blockedPublicPath(file)) throw new Error(`Non-public file in build; regenerate before packaging: ${file}`);
}
const available = new Set(allFiles);
const seo = JSON.parse(await readFile(path.join(dist, 'seo-manifest.json'), 'utf8'));
const origin = new URL(seo.siteOrigin).origin;
const basePath = seo.basePath || '/';
const basePrefix = basePath.replace(/\/$/, '');
const pages = new Set(seo.pages.map(page => page.path));
const decodeHtml = value => value.replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)))
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&(?:amp|quot|apos|lt|gt);/g, entity => ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }[entity]));

function retain(file, reason) {
  if (!available.has(file)) throw new Error(`Missing required production file: ${file} (${reason})`);
  if (!reasons.has(file)) reasons.set(file, new Set());
  reasons.get(file).add(reason);
}

function reference(value, from, { relative = false, allowPrefix = true } = {}) {
  if (typeof value !== 'string' || !value || value === '//' || /^(?:data:|blob:|mailto:|tel:|javascript:|#)/i.test(value)) return;
  let url;
  try {
    if (!value.startsWith('/') && !/^https?:/i.test(value) && !relative) return;
    url = new URL(decodeHtml(value), origin + basePath + from);
  } catch { throw new Error(`Invalid URL in ${from}: ${value}`); }
  if (url.origin !== origin) return;
  let pathname = decodeURIComponent(url.pathname);
  if (basePrefix && pathname.startsWith(basePrefix + '/')) pathname = pathname.slice(basePrefix.length);
  if (pathname.includes('\\') || pathname.includes('\0')) throw new Error(`Unsafe reference in ${from}: ${value}`);
  const file = pathname.slice(1);
  contained(dist, path.resolve(dist, file));
  if (pathname === '/' || pages.has(pathname.replace(/\/+$/, '')) || pathname === '/404') return;
  if (allowPrefix && pathname.endsWith('/') && allFiles.some(candidate => candidate.startsWith(file))) {
    dynamicPrefixes.add(file);
    return;
  }
  // Runtime asset references have file extensions. Plain application labels/regexes
  // beginning with '/' are not fetch targets and clean routes are already preserved.
  if (!fileExtension.test(pathname)) return;
  if (!references.has(file)) references.set(file, new Set());
  references.get(file).add(from);
  retain(file, `referenced by ${from}`);
}

function visit(node, callback) {
  if (!node || typeof node !== 'object') return;
  if (node.type) callback(node);
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'extra', 'comments', 'tokens'].includes(key)) continue;
    if (Array.isArray(value)) value.forEach(child => visit(child, callback));
    else if (value && typeof value === 'object') visit(value, callback);
  }
}

function cssReferences(text, from) {
  for (const match of text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
    reference(match[1] ?? match[2] ?? match[3], from, { relative: true });
  }
  for (const match of text.matchAll(/@import\s+["']([^"']+)["']/gi)) reference(match[1], from, { relative: true });
}

function dynamicDirectory(prefix, file) {
  if (prefix === basePrefix || prefix === basePath || prefix === '/') return;
  if (!prefix?.startsWith('/') || prefix.startsWith('//')) return;
  if (basePrefix && prefix.startsWith(basePrefix + '/')) prefix = prefix.slice(basePrefix.length);
  const directory = prefix.slice(1, prefix.lastIndexOf('/') + 1);
  if (!directory || !allFiles.some(candidate => candidate.startsWith(directory))) {
    throw new Error(`Cannot safely resolve dynamic production URL in ${file}: ${prefix}`);
  }
  dynamicPrefixes.add(directory);
}

function scan(text, file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.js') {
    visit(parse(text, { sourceType: 'module' }), node => {
      if (node.type === 'StringLiteral') reference(node.value, file);
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) {
        reference(node.source.value, file, { relative: true });
      }
      if (node.type === 'CallExpression' && node.callee.type === 'Import' && node.arguments[0]?.type === 'StringLiteral') {
        reference(node.arguments[0].value, file, { relative: true });
      }
      if (node.type === 'NewExpression' && node.callee.name === 'URL' && node.arguments[0]?.type === 'StringLiteral') {
        reference(node.arguments[0].value, file, { relative: true });
      }
      if (node.type === 'BinaryExpression' && node.operator === '+' && node.left.type === 'StringLiteral') {
        const prefix = node.left.value;
        if (!fileExtension.test(prefix)) dynamicDirectory(prefix, file);
      }
      if (node.type === 'TemplateLiteral') {
        if (!node.expressions.length) reference(node.quasis[0].value.cooked, file);
        else dynamicDirectory(node.quasis[0].value.cooked, file);
      }
    });
    return;
  }
  if (extension === '.css') { cssReferences(text, file); return; }
  if (extension === '.html' || extension === '.svg') {
    for (const match of text.matchAll(/\b(src|href|poster|data|content)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      reference(match[2] ?? match[3], file, { relative: match[1].toLowerCase() !== 'content', allowPrefix: false });
    }
    for (const match of text.matchAll(/\bsrcset\s*=\s*"([^"]+)"/gi)) {
      for (const candidate of decodeHtml(match[1]).split(',')) reference(candidate.trim().split(/\s+/)[0], file, { relative: true });
    }
    cssReferences(text, file);
    // Includes structured-data image URLs and absolute social-share images.
    for (const match of text.matchAll(/"([^"\n]*(?:\/images\/|\/assets\/|\/logos\/)[^"\n]*)"/g)) reference(match[1], file);
    return;
  }
  if (extension === '.json' || extension === '.webmanifest') {
    const json = JSON.parse(text);
    const walkJson = (value, key = '') => {
      if (typeof value === 'string') reference(value, file, { relative: ['src', 'href', 'url', 'image', 'icon', 'logo'].includes(key) });
      else if (Array.isArray(value)) value.forEach(child => walkJson(child, key));
      else if (value && typeof value === 'object') Object.entries(value).forEach(([childKey, child]) => walkJson(child, childKey));
    };
    walkJson(json);
  }
}

for (const file of allFiles) {
  if (file.startsWith('assets/')) retain(file, 'complete Vite assets directory; includes eager-glob fallbacks');
  // Keep every generated width: a gallery may choose a srcSet candidate only
  // after interaction, so initial HTML alone cannot prove a width is unused.
  if (file.startsWith('images/responsive/')) retain(file, 'complete responsive images directory; includes every generated srcSet width');
  if (file.endsWith('.html')) retain(file, 'generated page or HTML verification file');
  if (!file.includes('/') && /\.(?:xml|txt|webmanifest)$/i.test(file)) retain(file, 'root discovery or verification file');
  if (file.startsWith('.well-known/')) retain(file, 'well-known public discovery/verification file');
}
for (const file of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'llms.txt', 'seo-manifest.json']) retain(file, 'required SEO runtime');
if (available.has('.htaccess')) retain('.htaccess', 'Apache clean routes, redirects, caching and real 404 handling');
if (available.has('web.config')) retain('web.config', 'IIS static security, clean routes, redirects and real 404 handling');
for (const file of ['.nojekyll', '_headers', '_redirects', 'CNAME']) if (available.has(file)) retain(file, 'target hosting configuration');
for (const page of seo.pages) retain(page.outputFile || (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`), `rendered route ${page.path}`);
if (seo.indexNowKeyLocation) reference(seo.indexNowKeyLocation, 'seo-manifest.json');

// Follow dependencies until no new files remain. Vite assets and responsive
// image widths stay together, including currently dormant interactive variants.
const scanned = new Set();
while (true) {
  const next = [...reasons.keys()].find(file => !scanned.has(file));
  if (!next) break;
  scanned.add(next);
  if (textExtensions.has(path.extname(next).toLowerCase())) scan(await readFile(path.join(dist, next), 'utf8'), next);
  for (const prefix of dynamicPrefixes) for (const file of allFiles) if (file.startsWith(prefix)) retain(file, `conservative dynamic URL prefix /${prefix}`);
}

const selected = [...reasons.keys()].sort();
let sourceBytes = 0;
for (const file of allFiles) sourceBytes += (await lstat(path.join(dist, file))).size;
let payloadBytes = 0;
for (const file of selected) payloadBytes += (await lstat(path.join(dist, file))).size;
if (payloadBytes > MAX_ZIP_BYTES || selected.length > 65535) throw new Error('Release exceeds the portable ZIP32/2 GB limits.');

await safeDirectory(releaseRoot);
const id = `orbit-seo-release-${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}-${process.pid}`;
const release = contained(releaseRoot, path.join(releaseRoot, id));
await mkdir(release); // A collision is an error; older releases are never overwritten.
const site = contained(release, path.join(release, 'site'));
await safeDirectory(site);
const entries = [];
for (const file of selected) {
  const destination = contained(site, path.join(site, file));
  await safeDirectory(path.dirname(destination));
  await copyFile(contained(dist, path.join(dist, file)), destination, constants.COPYFILE_EXCL);
  const data = await readFile(destination);
  entries.push({ path: file, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), reasons: [...reasons.get(file)] });
}

// Standard ZIP (DEFLATE + UTF-8), with no dependency on PowerShell or zip CLIs.
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  return value >>> 0;
});
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
const zipPath = contained(release, path.join(release, 'orbitengineering-production.zip'));
const zip = await open(zipPath, 'wx');
let offset = 0;
const centralEntries = [];
const now = new Date();
const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
async function append(data) {
  if (offset + data.length > MAX_ZIP_BYTES) throw new Error('Archive exceeds the portable 2 GB limit.');
  let written = 0;
  while (written < data.length) written += (await zip.write(data, written, data.length - written, offset + written)).bytesWritten;
  offset += data.length;
}
try {
  for (const entry of entries) {
    const data = await readFile(contained(site, path.join(site, entry.path)));
    const name = Buffer.from(entry.path, 'utf8');
    if (name.length > 65535) throw new Error(`ZIP filename too long: ${entry.path}`);
    const compressed = deflateRawSync(data, { level: 6 });
    const crc = crc32(data);
    const localOffset = offset;
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(8, 8); header.writeUInt16LE(dosTime, 10); header.writeUInt16LE(dosDate, 12);
    header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(name.length, 26);
    await append(header); await append(name); await append(compressed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10); central.writeUInt16LE(dosTime, 12); central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28); central.writeUInt32LE(localOffset, 42);
    centralEntries.push(Buffer.concat([central, name]));
  }
  const centralOffset = offset;
  for (const entry of centralEntries) await append(entry);
  const centralLength = offset - centralOffset;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralLength, 12); end.writeUInt32LE(centralOffset, 16);
  await append(end);
} finally { await zip.close(); }

const manifest = {
  siteOrigin: origin,
  generatedAt: new Date().toISOString(),
  source: path.relative(root, dist).split(path.sep).join('/'),
  target: seo.target || 'generic',
  basePath, urlStyle: seo.urlStyle || 'clean', indexable: seo.indexable !== false,
  routeCount: seo.pages.length,
  files: entries,
  publicReferences: Object.fromEntries([...references].sort(([a], [b]) => a.localeCompare(b)).map(([file, from]) => [file, [...from]])),
  omitted: allFiles.filter(file => !reasons.has(file)).map(file => ({ path: file, reason: 'No production HTML/JS/CSS/SVG/JSON reference; not a route, build asset, discovery or verification file' })),
  totals: { sourceFiles: allFiles.length, releaseFiles: selected.length, sourceBytes, payloadBytes, omittedBytes: sourceBytes - payloadBytes, zipBytes: offset },
  archive: { filename: path.basename(zipPath), sha256: createHash('sha256').update(await readFile(zipPath)).digest('hex') },
  hosting: { publicConfiguration: ['.htaccess', 'web.config', '.nojekyll', '_headers', '_redirects', 'CNAME'].filter(file => available.has(file)),
    guide: 'docs/HOSTING.md', infrastructureArtifacts: `builds/${seo.target || 'generic'}-hosting`,
    note: 'Choose the configuration for the selected provider. Administrator/edge templates stay outside the public ZIP. Actual hosting settings, TLS, headers and error responses require validation after deployment.' },
};
await writeFile(contained(release, path.join(release, 'asset-manifest.json')), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
await writeFile(contained(release, path.join(release, 'README.txt')), `Orbit Engineering prepared release\n\nUpload/extract orbitengineering-production.zip contents into the selected static web root, or upload the CONTENTS of site/. ZIP files sit at its root; there is no site/ wrapper. Include hidden .htaccess or .nojekyll when present. Keep this README, asset-manifest.json and administrator hosting templates outside the public web root.\n\nTarget: ${seo.target || 'generic'}\nOrigin: ${origin}\nBase path: ${basePath}\nIndexable: ${seo.indexable !== false}\nRendered routes: ${seo.pages.length}\nFiles: ${selected.length}\nPayload: ${payloadBytes} bytes\nZIP: ${offset} bytes\n\nSee docs/HOSTING.md, docs/SEO-RELEASE.md and docs/SEO-MIGRATION.md in the source repository for provider configuration, legacy CMS cleanup and post-deployment validation. Use builds/${seo.target || 'generic'}-hosting only as administrator/edge configuration. This artifact does not publish the site or verify Google/Bing ownership.\n`, { flag: 'wx' });
console.log(JSON.stringify({ release, site, zip: zipPath, manifest: path.join(release, 'asset-manifest.json'), ...manifest.totals, routeCount: seo.pages.length }, null, 2));
