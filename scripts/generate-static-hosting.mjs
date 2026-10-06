import { writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { securityHeaders } from './security-policy.mjs';
export async function generateStaticHosting({ manifest, redirects, outputDirectory, publicDirectory }) {
  await mkdir(outputDirectory, { recursive: true });
  // Both providers may combine repeated header values. Use disjoint cache
  // patterns, so assets never inherit two different max-age directives.
  const pagePaths = [...new Set(manifest.pages.flatMap(page => [new URL(page.url).pathname, '/' + page.outputFile]))];
  const rootFiles = (await readdir(publicDirectory, { withFileTypes: true })).filter(entry => entry.isFile() && /\.(?:txt|xml|svg|png|webmanifest|json)$/i.test(entry.name)).map(entry => '/' + entry.name);
  const cachePaths = [...new Set([...pagePaths, '/images/*', '/logos/*', ...rootFiles])];
  const headers = ['/*', ...Object.entries(securityHeaders).map(([key, value]) => `  ${key}: ${value}`),
    ...(!manifest.indexable ? ['  X-Robots-Tag: noindex, follow'] : []), '',
    // Native 404s can match this wildcard too. Keep browser revalidation;
    // provider edge caching remains available without a year-long error cache.
    '/assets/*', '  Cache-Control: public, max-age=0, must-revalidate', '',
    ...cachePaths.flatMap(urlPath => [urlPath, '  Cache-Control: public, max-age=0, must-revalidate', '']),
    '/404.html', '  X-Robots-Tag: noindex, follow', '  Cache-Control: no-store', ''].join('\n');
  if (cachePaths.length + 3 > 100) throw new Error('Review Cloudflare Pages 100 header-rule limit after adding routes.');
  const legacy = redirects.filter(rule => !rule.has).map(rule => {
    const page = manifest.pages.find(page => page.path === rule.destination);
    if (!page) throw new Error('Unrendered migration destination');
    return `${rule.source} ${new URL(page.url).pathname} 301`;
  });
  const cloudflare = [...legacy, ''].join('\n');
  const netlify = [...legacy, '/* /404.html 404', ''].join('\n');
  await writeFile(path.join(outputDirectory, 'cloudflare-headers.txt'), headers);
  await writeFile(path.join(outputDirectory, 'cloudflare-redirects.txt'), cloudflare);
  await writeFile(path.join(outputDirectory, 'netlify-headers.txt'), headers);
  await writeFile(path.join(outputDirectory, 'netlify-redirects.txt'), netlify);
  const host = new URL(manifest.siteOrigin).hostname;
  const alternateHost = host.startsWith('www.') ? host.slice(4) : `www.${host}`;
  const vercel = {
    git: { deploymentEnabled: false },
    framework: 'vite', installCommand: 'npm ci', buildCommand: 'npm run build:vercel', outputDirectory: 'dist',
    cleanUrls: true, trailingSlash: false,
    redirects: [{ source: '/:path*', has: [{ type: 'host', value: alternateHost }], destination: `${manifest.siteOrigin}/:path*`, permanent: true }, ...redirects.filter(rule => !rule.has)],
    headers: [
      { source: '/(.*)', headers: [...Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ...(!manifest.indexable ? [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] : [])] },
      { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] },
      { source: '/404', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }, { key: 'Cache-Control', value: 'no-store' }] },
    ],
  };
  if (manifest.urlStyle === 'clean') await writeFile(path.join(outputDirectory, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
  if (['netlify', 'cloudflare'].includes(manifest.target)) {
    await writeFile(path.join(publicDirectory, '_headers'), headers);
    await writeFile(path.join(publicDirectory, '_redirects'), manifest.target === 'netlify' ? netlify : cloudflare);
  }
  if (manifest.target === 'github-pages') {
    await writeFile(path.join(publicDirectory, '.nojekyll'), '');
    const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    for (const rule of redirects.filter(rule => !rule.has)) {
      const destination = manifest.pages.find(page => page.path === rule.destination)?.url;
      if (!destination) throw new Error('Unrendered migration destination');
      const directory = path.join(publicDirectory, rule.source.slice(1));
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=${escape(destination)}"><link rel="canonical" href="${escape(destination)}"><title>Page moved | Orbit Engineering</title></head><body><p>This page has moved. <a href="${escape(destination)}">Continue to Orbit Engineering</a>.</p></body></html>\n`);
    }
  }
  await writeFile(path.join(outputDirectory, 'hosting-manifest.json'), JSON.stringify({ target: manifest.target, basePath: manifest.basePath, urlStyle: manifest.urlStyle, siteOrigin: manifest.siteOrigin, indexable: manifest.indexable, routes: manifest.pages.length, redirectCount: legacy.length }, null, 2));
}
