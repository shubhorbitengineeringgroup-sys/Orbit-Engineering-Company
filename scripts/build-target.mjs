import { spawn } from 'node:child_process';
import { readFile, mkdir, cp, realpath, lstat, readdir, rmdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { inspectPublicBuild } from './public-build.mjs';
import { generateStaticHosting } from './generate-static-hosting.mjs';
import { generateAwsHosting } from '../hosting/aws/generate.mjs';
import { generateNginxHosting } from '../hosting/nginx/generate.mjs';
const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const options = {};
for (const argument of process.argv.slice(2)) {
  const match = argument.match(/^--(target|site-url|base-path|out-dir|indexable)=(.+)$/);
  if (!match) throw new Error(`Unsupported option: ${argument}; use --name=value.`);
  if (options[match[1]]) throw new Error(`Duplicate option: ${match[1]}`);
  options[match[1]] = match[2];
}
const targets = ['generic', 'github-pages', 'vercel', 'apache', 'iis', 'aws', 'nginx', 'netlify', 'cloudflare'];
const target = options.target || 'generic';
if (!targets.includes(target)) throw new Error('Unknown hosting target.');
const loaded = { ...loadEnv('production', root, ''), ...process.env };
const origin = new URL(options['site-url'] || loaded.VITE_SITE_URL || 'https://orbitengineering.com');
if (origin.protocol !== 'https:' || origin.port || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) throw new Error('Site URL must be a public HTTPS origin on port 443 without a path/query/credentials.');
const requestedBase = options['base-path'] || (target === 'github-pages' ? loaded.VITE_BASE_PATH || '/' : '/');
const basePath = requestedBase.endsWith('/') ? requestedBase : requestedBase + '/';
if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(basePath) || basePath.split('/').some(segment => ['.', '..'].includes(segment))) throw new Error('Base path must be / or /repository/ with safe segments.');
if (target !== 'github-pages' && basePath !== '/') throw new Error('Use github-pages profile for a directory/project prefix; other prepared server profiles deploy at the domain root.');
const indexFlag = options.indexable || loaded.VITE_INDEXABLE || 'true';
if (!['true', 'false'].includes(indexFlag)) throw new Error('indexable must be true or false.');
const providerPreview = (target === 'vercel' && loaded.VERCEL_ENV && loaded.VERCEL_ENV !== 'production')
  || (target === 'netlify' && loaded.CONTEXT && loaded.CONTEXT !== 'production');
const indexable = indexFlag === 'true' && !providerPreview;
const output = path.resolve(root, options['out-dir'] || 'dist');
const relativeOutput = path.relative(root, output);
if (!relativeOutput || relativeOutput === '..' || relativeOutput.startsWith('..' + path.sep) || path.isAbsolute(relativeOutput)
  || ['src', 'public', 'scripts', 'hosting', 'docs', '.git', 'node_modules'].includes(relativeOutput.split(path.sep)[0])) throw new Error('Output must be a dedicated build folder inside this workspace.');
const dist = path.join(root, 'dist');
async function safeDestination(directory) {
  let current = root;
  for (const segment of path.relative(root, directory).split(path.sep)) {
    current = path.join(current, segment);
    try { const info = await lstat(current); if (info.isSymbolicLink() || !info.isDirectory()) throw new Error('Output must contain only real directories.'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await mkdir(current); }
  }
}
async function assertNoSymlinks(directory) {
  if ((await lstat(directory)).isSymbolicLink()) throw new Error('Build input/output cannot contain symbolic links.');
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error('Build input/output cannot contain symbolic links.');
    if (entry.isDirectory()) await assertNoSymlinks(path.join(directory, entry.name));
  }
}
async function run(arguments_, env = process.env) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, arguments_, { cwd: root, env, stdio: 'inherit', windowsHide: true });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build command failed (${code}).`)));
  });
}
const env = { ...process.env, DEPLOY_TARGET: target, VITE_SITE_URL: origin.origin, VITE_BASE_PATH: basePath,
  VITE_URL_STYLE: ['github-pages', 'netlify', 'cloudflare'].includes(target) ? 'directory' : 'clean', VITE_INDEXABLE: String(indexable) };
await safeDestination(dist);
await safeDestination(path.join(root, 'dist-ssr'));
await assertNoSymlinks(path.join(root, 'public'));
await assertNoSymlinks(dist);
await assertNoSymlinks(path.join(root, 'dist-ssr'));
await run(['node_modules/vite/bin/vite.js', 'build'], env);
await run(['node_modules/vite/bin/vite.js', 'build', '--ssr', 'src/entry-server.jsx', '--outDir', 'dist-ssr'], env);
await run(['scripts/prerender.mjs'], env);
await inspectPublicBuild(dist);
if (['generic', 'apache', 'iis'].includes(target)) {
  await run(['scripts/generate-hosting-config.mjs'], env);
  await run(['scripts/generate-iis-config.mjs'], env);
}
const manifest = JSON.parse(await readFile(path.join(dist, 'seo-manifest.json'), 'utf8'));
const redirects = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8')).redirects;
const artifactDirectory = path.join(root, 'builds', `${target}-hosting`);
await safeDestination(artifactDirectory);
await assertNoSymlinks(artifactDirectory);
await generateStaticHosting({ manifest, redirects, outputDirectory: artifactDirectory, publicDirectory: dist });
if (!['github-pages', 'netlify', 'cloudflare'].includes(target)) {
  await generateAwsHosting({ manifest, redirects, outputDirectory: artifactDirectory });
}
if (target !== 'github-pages') {
  await generateNginxHosting({ manifest, redirects, outputDirectory: artifactDirectory });
}
await run(['scripts/verify-seo.mjs'], env);
await inspectPublicBuild(dist, { check: true });
if (output !== dist) {
  await safeDestination(path.dirname(output));
  try {
    if ((await lstat(output)).isSymbolicLink()) throw new Error('Output cannot be a symbolic link.');
    if ((await readdir(output)).length === 0) await rmdir(output);
    else {
      const previous = JSON.parse(await readFile(path.join(output, 'seo-manifest.json'), 'utf8'));
      if (previous.application !== 'orbit-engineering') throw new Error('Existing output is not a managed build; choose another directory.');
      const previousPath = output + '.previous-' + Date.now();
      await rename(output, previousPath);
      console.log(`Archived previous generated build: ${path.relative(root, previousPath)}`);
    }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await cp(dist, output, { recursive: true, force: false, errorOnExist: true });
}
console.log(JSON.stringify({ target, publicDirectory: output, hostingArtifacts: artifactDirectory, siteOrigin: origin.origin, basePath, indexable, routes: manifest.pages.length }, null, 2));
