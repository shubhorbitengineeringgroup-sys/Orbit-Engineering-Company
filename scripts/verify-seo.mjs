import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { responsiveImages } from '../src/data/responsiveImages.js';

const dist = path.resolve(process.env.SEO_BUILD_DIR || fileURLToPath(new URL('../dist/', import.meta.url)));
const manifest = JSON.parse(await readFile(path.join(dist, 'seo-manifest.json'), 'utf8'));
const pages = new Map(manifest.pages.map(page => [page.path, page]));
const prefix = (manifest.basePath || '/').replace(/\/$/, '');
const stripBase = value => prefix && value.startsWith(prefix + '/') ? value.slice(prefix.length) : value;
const titles = new Set();
const descriptions = new Set();
const links = new Map();
const decode = text => text.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&(?:amp|lt|gt|quot|apos);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }[entity]));
const matches = (text, pattern) => [...text.matchAll(pattern)];
let checkedAssets = new Set();

async function checkImageAsset(value, context) {
  assert(value.startsWith('/images/') || value === '/logo.png', `${context}: unsupported responsive image URL`);
  const asset = path.resolve(dist, '.' + decodeURIComponent(value));
  const relative = path.relative(dist, asset);
  assert(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), `${context}: image outside output`);
  if (!checkedAssets.has(value)) {
    await access(asset).catch(() => { throw new Error(`${context}: missing image ${value}`); });
    checkedAssets.add(value);
  }
}

// Check every selectable candidate, including variants a desktop browser does
// not fetch. This also catches stale mappings after a source image is replaced.
for (const [original, image] of Object.entries(responsiveImages)) {
  assert(image.width > 0 && image.height > 0 && image.srcSet, `${original}: invalid image dimensions or candidates`);
  await checkImageAsset(original, original);
  await checkImageAsset(image.src, original);
  let previousWidth = 0;
  for (const candidate of image.srcSet.split(', ')) {
    const match = candidate.match(/^(\/\S+) (\d+)w$/);
    assert(match && Number(match[2]) > previousWidth, `${original}: malformed or unordered srcset`);
    previousWidth = Number(match[2]);
    await checkImageAsset(match[1], original);
  }
}

for (const [route, page] of pages) {
  const file = path.join(dist, page.outputFile || (route === '/' ? 'index.html' : `${route.slice(1)}.html`));
  const html = await readFile(file, 'utf8');
  assert(!/(?:digi-follower|dg-ads\.com|buy-follower|nabfollower|akun demo slot|toto macau)/i.test(html), `${route}: unrelated live-site spam must not enter this build`);
  assert(!html.includes('<!--app-html-->') && !html.includes('<!--seo-head-->'), `${route}: unrendered placeholder`);
  const title = matches(html, /<title[^>]*>([\s\S]*?)<\/title>/g);
  assert.equal(title.length, 1, `${route}: requires exactly one title`);
  assert.equal(decode(title[0][1]), page.title, `${route}: unexpected title`);
  assert(!titles.has(page.title), `${route}: duplicate title`); titles.add(page.title);
  const description = matches(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/g);
  assert.equal(description.length, 1, `${route}: requires one description`);
  assert(description[0][1].length > 50, `${route}: missing useful description`);
  assert(!descriptions.has(description[0][1]), `${route}: duplicate description`); descriptions.add(description[0][1]);
  const canonical = matches(html, /<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g);
  assert.equal(canonical.length, 1, `${route}: requires one canonical`);
  assert.equal(decode(canonical[0][1]), page.url, `${route}: incorrect canonical`);
  assert.equal(matches(html, /<h1(?:\s|>)/g).length, 1, `${route}: requires one primary heading`);
  assert.equal(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), manifest.indexable === false, `${route}: incorrect indexing policy`);
  assert(/<meta[^>]*property="og:url"[^>]*content="/.test(html) && /<meta[^>]*name="twitter:card"/.test(html), `${route}: missing share metadata`);
  const json = matches(html, /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
  assert.equal(json.length, 1, `${route}: requires a JSON-LD graph`);
  const schema = JSON.parse(json[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert(schema['@graph'].some(node => node['@type'] === 'WebSite'), `${route}: missing website entity`);
  const business = schema['@graph'].find(node => node['@type'] === 'ProfessionalService');
  assert.equal(business?.name, 'Orbit Engineering');
  assert.equal(business.address.postalCode, '462043');
  assert(business.address.streetAddress.startsWith('Ground Floor, B-32/A'), `${route}: inconsistent address`);
  const child = schema['@graph'].find(node => node.name === 'Orbit Engineering Solutions');
  assert.equal(child?.parentOrganization?.['@id'], business['@id'], `${route}: child relationship missing`);
  assert(!json[0][1].includes('aggregateRating'), `${route}: unsupported review markup`);
  const body = html.split('<body')[1];
  const text = decode(body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' '));
  assert(text.split(/\s+/).length > 100, `${route}: initial HTML has too little content`);
  if (page.type === 'service') {
    assert(schema['@graph'].some(node => node['@type'] === 'Service'), `${route}: missing service entity`);
    const faq = schema['@graph'].find(node => node['@type'] === 'FAQPage');
    for (const question of faq?.mainEntity || []) {
      assert(text.includes(question.name), `${route}: schema FAQ question is not visible`);
      assert(text.includes(question.acceptedAnswer.text), `${route}: schema FAQ answer is not visible`);
    }
  }
  const destinations = new Set();
  for (const [, value] of matches(html, /<a\b[^>]*href="([^"]+)"/g)) {
    const href = decode(value);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = new URL(href, manifest.siteOrigin);
    assert(!prefix || target.pathname === prefix || target.pathname.startsWith(prefix + '/'), `${route}: local link outside base path ${href}`);
    const routePath = stripBase(target.pathname).replace(/\/+$/, '') || '/';
    if (pages.has(routePath)) { destinations.add(routePath); continue; }
    const asset = path.resolve(dist, '.' + decodeURIComponent(stripBase(target.pathname)));
    const relativeAsset = path.relative(dist, asset);
    assert(relativeAsset !== '..' && !relativeAsset.startsWith('..' + path.sep) && !path.isAbsolute(relativeAsset), `${route}: link outside output`);
    await access(asset).catch(() => { throw new Error(`${route}: broken internal link ${href}`); });
  }
  for (const [, value] of matches(html, /(?:src|href)="(\/[^"#?]+)"/g)) {
    const local = decode(value);
    assert(!prefix || local === prefix || local.startsWith(prefix + '/'), `${route}: asset/link outside project prefix ${local}`);
    const logical = stripBase(local);
    if (/^\/(?:assets|images|logos)\//.test(logical) || /^\/logo(?:-icon)?\.(svg|png)$/.test(logical)) {
      await access(path.join(dist, decodeURIComponent(logical.slice(1)))).catch(() => { throw new Error(`${route}: missing prefixed asset ${local}`); });
    }
  }
  links.set(route, destinations);
  for (const [, value] of matches(html, /(?:src|href)="(\/(?:assets|images|logos)\/[^"#?]+|\/logo(?:-icon)?\.(?:svg|png))"/g)) {
    if (!checkedAssets.has(value)) { await access(path.join(dist, decodeURIComponent(value.slice(1)))).catch(() => { throw new Error(`${route}: missing local asset ${value}`); }); checkedAssets.add(value); }
  }
}
const reached = new Set(['/']);
const queue = ['/'];
for (let i = 0; i < queue.length; i++) for (const next of links.get(queue[i]) || []) if (!reached.has(next)) { reached.add(next); queue.push(next); }
assert.equal(reached.size, pages.size, `Unlinked pages: ${[...pages.keys()].filter(route => !reached.has(route)).join(', ')}`);
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/g).map(match => decode(match[1]));
assert.equal(sitemapUrls.length, manifest.indexable === false ? 0 : pages.size);
assert.deepEqual(new Set(sitemapUrls), new Set(manifest.indexable === false ? [] : manifest.pages.map(page => page.url)));
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert(robots.includes('User-agent: *') && robots.includes('Allow: /') && !robots.includes('Disallow: /'));
if (manifest.indexable !== false) assert(robots.includes(`${manifest.siteOrigin}${manifest.basePath || '/'}sitemap.xml`));
const notFound = await readFile(path.join(dist, '404.html'), 'utf8');
assert(/name="robots"[^>]*content="noindex, follow"/.test(notFound));
assert(!notFound.includes('rel="canonical"'));
const hosting = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
assert(hosting.cleanUrls === true && hosting.trailingSlash === false && !hosting.rewrites?.length, 'Hosting must serve real static HTML and real 404s.');
for (const redirect of hosting.redirects.filter(rule => !rule.has)) {
  assert(pages.has(redirect.destination), `Redirect destination is not a rendered page: ${redirect.destination}`);
  assert(redirect.source !== redirect.destination && redirect.permanent, `Invalid migration redirect: ${redirect.source}`);
}
console.log(`SEO checks passed: ${pages.size} rendered, linked pages; unique metadata; valid matching JSON-LD; ${checkedAssets.size} local assets; sitemap, robots and noindex 404.`);
