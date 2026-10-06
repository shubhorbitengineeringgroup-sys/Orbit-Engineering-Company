import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityHeaders, blockedPublicPath } from './security-policy.mjs';

const root = await realpath(process.env.PREVIEW_DIR ? path.resolve(process.env.PREVIEW_DIR) : fileURLToPath(new URL('../dist/', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
const hosting = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'seo-manifest.json'), 'utf8'));
const cleanRoutes = new Set([...manifest.pages.map(page => page.path), '/404']);
const prefix = (manifest.basePath || '/').replace(/\/$/, '');
const directoryStyle = manifest.urlStyle === 'directory';
const pageFiles = new Map(manifest.pages.map(page => [page.path, page.outputFile || (page.path === '/' ? 'index.html' : page.path.slice(1) + '.html')]));
const redirects = { '/index.html': '/', ...Object.fromEntries(hosting.redirects.filter(rule => !rule.has && !rule.source.includes(':')).map(rule => [rule.source, rule.destination])) };
const port = Number(process.env.PORT || 4173);

function contained(file) {
  const relative = path.relative(root, file);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

http.createServer(async (request, response) => {
  // Pages lacks configurable response headers; simulate its meta CSP rather than fake protections.
  if (manifest.target !== 'github-pages') for (const [key, value] of Object.entries(securityHeaders)) response.setHeader(key, value);
  if (manifest.indexable === false) response.setHeader('X-Robots-Tag', 'noindex, follow');
  response.setHeader('Cache-Control', 'no-store');
  const finish = (status, message = '') => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return finish(405, 'Method not allowed.');
    }
    // Reject unsafe targets before URL normalization can hide dot segments.
    const rawPath = request.url.split('?')[0];
    let pathname;
    try { pathname = decodeURIComponent(rawPath); } catch { return finish(400, 'Invalid request path.'); }
    if (!pathname.startsWith('/') || pathname.startsWith('//') || /[\\\x00-\x1f\x7f#?:]/.test(pathname)
      || pathname.split('/').some(part => part === '.' || part === '..')) return finish(400, 'Invalid request path.');
    if (blockedPublicPath(pathname)) return finish(403, 'Forbidden.');
    if (prefix) {
      if (pathname === prefix) pathname = '/';
      else if (pathname.startsWith(prefix + '/')) pathname = pathname.slice(prefix.length);
      else return finish(404, 'Not found outside this site base path.');
    }
    const query = new URL(request.url, 'http://localhost').search;
    const redirect = destination => {
      response.writeHead(308, { Location: encodeURI(prefix + destination) + query });
      response.end();
    };
    const logicalPath = pathname.replace(/\/+$/, '') || '/';
    if (directoryStyle && pathname !== '/' && cleanRoutes.has(logicalPath) && !pathname.endsWith('/')) return redirect(pathname + '/');
    if (!directoryStyle && pathname !== '/' && pathname.endsWith('/') && cleanRoutes.has(logicalPath)) return redirect(logicalPath);
    if (!directoryStyle && Object.hasOwn(redirects, pathname)) return redirect(redirects[pathname]);
    if (!directoryStyle && pathname.endsWith('.html') && cleanRoutes.has(pathname.slice(0, -5))) return redirect(pathname.slice(0, -5));
    const relative = pageFiles.get(logicalPath) || (logicalPath === '/404' ? '404.html' : directoryStyle && pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1) + (path.extname(pathname) || directoryStyle ? '' : '.html'));
    let file = path.resolve(root, relative);
    if (!contained(file)) return finish(403, 'Forbidden.');
    let status = logicalPath === '/404' ? 404 : 200;
    try {
      file = await realpath(file);
      if (!contained(file)) return finish(403, 'Forbidden.');
      if (!(await stat(file)).isFile()) throw new Error('Not a file');
    }
    catch { file = path.join(root, '404.html'); status = 404; }
    const body = await readFile(file);
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': body.length };
    if (status === 404) headers['X-Robots-Tag'] = 'noindex, follow';
    else headers['Cache-Control'] = pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate';
    response.writeHead(status, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { finish(500, 'Could not read the built site.'); }
}).listen(port, '127.0.0.1', () => console.log(`Static production preview: http://127.0.0.1:${port}`));
