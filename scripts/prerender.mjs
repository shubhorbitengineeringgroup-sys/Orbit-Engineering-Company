import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { render, seoPages, SITE_ORIGIN, BASE_PATH, URL_STYLE, INDEXABLE, sitePath } from '../dist-ssr/entry-server.js';
import { contentSecurityPolicy } from './security-policy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const template = await readFile(path.join(output, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) throw new Error('Missing static render placeholders.');
const escapeXml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
const target = process.env.DEPLOY_TARGET || 'generic';
const pageFile = route => route === '/' ? 'index.html' : route === '/404' ? '404.html' : URL_STYLE === 'directory' ? `${route.slice(1)}/index.html` : `${route.slice(1)}.html`;
const url = route => SITE_ORIGIN + sitePath(route);
const pagesCsp = contentSecurityPolicy.split('; ').filter(directive => !directive.startsWith('frame-ancestors ')).join('; ');

for (const page of [...seoPages, { path: '/404' }]) {
  const { html, head } = render(page.path);
  const destination = path.join(output, pageFile(page.path));
  await mkdir(path.dirname(destination), { recursive: true });
  let result = template.replace('<!--seo-head-->', () => head).replace('<!--app-html-->', () => html);
  if (target === 'github-pages') result = result.replace(/(<meta charset="UTF-8"\s*\/?>)/i, `$1\n    <meta http-equiv="Content-Security-Policy" content="${escapeXml(pagesCsp)}" />`);
  await writeFile(destination, result);
}

// No synthetic lastmod: publish it only when actual page change dates are known.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${(INDEXABLE ? seoPages : []).map(page => `  <url><loc>${escapeXml(url(page.path))}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(output, 'sitemap.xml'), sitemap);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${INDEXABLE ? '\nSitemap: ' + url('/sitemap.xml') + '\n' : '\n# Preview: pages carry noindex metadata; crawling is allowed to see it.\n'}`);
const llms = `# Orbit Engineering\n\n> Water infrastructure, industrial automation and instrumentation engineering in Bhopal, Madhya Pradesh, India. Orbit Engineering Solutions is a child company of Orbit Engineering.\n\nThis optional discovery file points to public source pages. Use the linked pages for the full details.\n\n## Company and contact\n\n- [Home](${SITE_ORIGIN}/)\n- [About Orbit Engineering](${SITE_ORIGIN}/about)\n- [Contact and office address](${SITE_ORIGIN}/contact)\n- [Clients and technology ecosystem](${SITE_ORIGIN}/ecosystem)\n\n## Engineering solutions\n\n${seoPages.filter(page => page.type === 'service').map(page => `- [${page.service.shortTitle}](${SITE_ORIGIN}${page.path}): ${page.description}`).join('\n')}\n\n## Product categories\n\n${seoPages.filter(page => page.type === 'category').map(page => `- [${page.category.name}](${SITE_ORIGIN}${page.path})`).join('\n')}\n\n## Buying guides\n\n${seoPages.filter(page => page.type === 'guide').map(page => `- [${page.guide.shortTitle}](${SITE_ORIGIN}${page.path}): ${page.description}`).join('\n')}\n`;
await writeFile(path.join(output, 'llms.txt'), INDEXABLE ? llms.replace(/\]\((https:\/\/[^)]+)\)/g, (match, href) => `](${url(new URL(href).pathname)})`) : '# Preview build\n\nThis build is not intended for search indexing.\n');

const env = { ...loadEnv('production', root, ''), ...process.env };
const key = env.INDEXNOW_KEY?.trim();
if (key && !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('INDEXNOW_KEY must contain 8–128 letters, digits or hyphens.');
if (key && INDEXABLE) await writeFile(path.join(output, `${key}.txt`), key);
await writeFile(path.join(output, 'seo-manifest.json'), JSON.stringify({ application: 'orbit-engineering', target, siteOrigin: SITE_ORIGIN, basePath: BASE_PATH, urlStyle: URL_STYLE, indexable: INDEXABLE, errorFile: '404.html', generatedAt: new Date().toISOString(), ...(key && INDEXABLE ? { indexNowKeyLocation: url(`/${key}.txt`) } : {}), pages: seoPages.map(page => ({ path: page.path, outputFile: pageFile(page.path), url: url(page.path), title: page.title, type: page.type || 'page' })) }, null, 2));
console.log(`Generated ${seoPages.length} ${INDEXABLE ? 'indexable' : 'noindex preview'} HTML pages, a noindex 404 page, sitemap.xml, robots.txt and llms.txt.`);
