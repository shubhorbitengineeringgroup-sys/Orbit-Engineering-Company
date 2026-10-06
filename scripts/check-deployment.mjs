import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { securityHeaders } from './security-policy.mjs';

// Read-only smoke check. Does not upload, authenticate, submit URLs or change DNS.
const options = {};
for (const argument of process.argv.slice(2)) {
  const match = argument.match(/^--(url|manifest)=(.+)$/);
  if (!match || options[match[1]]) throw new Error('Use --url=https://HOST and optional --manifest=dist/seo-manifest.json.');
  options[match[1]] = match[2];
}
assert(options.url, 'Supply the deployed HTTPS origin with --url=.');
const origin = new URL(options.url);
assert(!origin.username && !origin.password && !origin.search && !origin.hash && origin.pathname === '/', 'Supply an origin, not a page URL.');
assert(origin.protocol === 'https:' || (origin.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)), 'HTTP is allowed only for a loopback preview.');
const manifest = JSON.parse(await readFile(options.manifest || 'dist/seo-manifest.json', 'utf8'));
assert(Array.isArray(manifest.pages) && manifest.pages.length, 'Build manifest has no routes.');
const failures = [];
let checked = 0;
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
async function get(pathname, { html = false, status = 200, canonical, noindex = false } = {}) {
  try {
    const response = await fetch(new URL(pathname, origin), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, status, `${pathname}: expected HTTP ${status}, received ${response.status}`);
    if (html) {
      assert(response.headers.get('content-type')?.includes('text/html'), `${pathname}: wrong HTML content type`);
      if (manifest.target !== 'github-pages') for (const [key, value] of Object.entries(securityHeaders)) {
        assert.equal(response.headers.get(key), value, `${pathname}: missing or changed ${key}`);
      }
      const text = await response.text();
      if (canonical) assert.equal(decode(text.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] || ''), canonical, `${pathname}: canonical does not match the selected build`);
      if (noindex) assert(/<meta\b[^>]*name="robots"[^>]*content="noindex, follow"/.test(text), `${pathname}: expected noindex metadata`);
      else assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(text), `${pathname}: production page is noindex`);
      if (manifest.target === 'github-pages') assert(/http-equiv="Content-Security-Policy"/.test(text), `${pathname}: Pages meta CSP missing`);
    } else await response.arrayBuffer();
    checked++;
  } catch (error) { failures.push(error.message); }
}
// Four concurrent read-only requests keep the check bounded without flooding a host.
const routes = [...manifest.pages];
await Promise.all(Array.from({ length: Math.min(4, routes.length) }, async () => {
  while (routes.length) {
    const page = routes.shift();
    await get(new URL(page.url).pathname, { html: true, canonical: page.url, noindex: manifest.indexable === false });
  }
}));
const base = manifest.basePath || '/';
await get(base + 'orbit-hosting-check-missing-page', { html: true, status: 404, noindex: true });
await get(base + 'assets/orbit-hosting-check-missing.js', { status: 404 });
await get(base + 'robots.txt');
await get(base + 'sitemap.xml');
console.log(JSON.stringify({ origin: origin.origin, target: manifest.target, basePath: base, checked, failures,
  limitations: ['This smoke check does not certify account, DNS, OS, TLS renewal, WAF, legacy redirects or browser interaction security.',
    ...(manifest.target === 'github-pages' ? ['Pages HTTP security-header support is limited; this check verifies its meta CSP.'] : [])] }, null, 2));
if (failures.length) process.exitCode = 1;
