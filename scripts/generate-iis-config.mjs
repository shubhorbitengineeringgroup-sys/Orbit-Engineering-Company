import assert from 'node:assert/strict';
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { privateFilePattern, securityHeaders } from './security-policy.mjs';

// Local artifact only. IIS URL Rewrite 2.0 and delegated sections are prerequisites.
// Run after prerendering and the public-build inspection in generate-hosting-config.mjs.
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(dist, 'seo-manifest.json'), 'utf8'));
const hosting = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const origin = new URL(manifest.siteOrigin);
assert(origin.protocol === 'https:' && origin.origin === manifest.siteOrigin && !origin.username && !origin.password,
  'IIS generation requires one canonical HTTPS origin without credentials, path, query or fragment.');
assert(/^[a-z0-9.-]+(?::[0-9]+)?$/i.test(origin.host), 'Unsupported canonical hostname.');
assert(hosting.cleanUrls === true && hosting.trailingSlash === false && !hosting.rewrites?.length,
  'IIS generation requires clean static routes without an SPA fallback.');
assert.deepEqual(Object.fromEntries(hosting.headers.find(rule => rule.source === '/(.*)')?.headers.map(({ key, value }) => [key, value]) || []),
  { ...securityHeaders, 'Cache-Control': 'public, max-age=0, must-revalidate' }, 'Vercel headers differ from the shared production security/cache policy.');

const xml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
const regex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const validRoute = route => route === '/' || /^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+$/.test(route);
const routes = manifest.pages.map(page => page.path);
assert(routes.includes('/') && !routes.includes('/404') && new Set(routes).size === routes.length && routes.every(validRoute),
  'Invalid or duplicate rendered routes.');
const migrations = hosting.redirects.filter(rule => !rule.has);
assert(migrations.length && migrations.every(rule => validRoute(rule.source) && rule.source !== '/'
  && routes.includes(rule.destination) && rule.source !== rule.destination && rule.permanent === true), 'Invalid migration redirect.');
assert(new Set(migrations.map(rule => rule.source)).size === migrations.length
  && migrations.every(rule => !routes.includes(rule.source)), 'Duplicate or shadowing migration source.');
assert(hosting.redirects.filter(rule => rule.has).every(rule => rule.source === '/:path*'
  && rule.has.length === 1 && rule.has[0].type === 'host' && rule.permanent === true), 'Unsupported conditional redirect.');
for (const route of [...routes, '/404']) await access(path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}.html`));
const errorPage = await readFile(path.join(dist, '404.html'), 'utf8');
assert(/name="robots"[^>]*content="noindex, follow"/.test(errorPage) && !errorPage.includes('rel="canonical"'),
  'The static error page must be noindex without an indexable canonical URL.');

const rule = (name, pattern, action, conditions = []) => [
  `        <rule name="${xml(name)}" stopProcessing="true">`,
  `          <match url="${xml(pattern)}" ignoreCase="false" />`,
  ...(conditions.length ? ['          <conditions logicalGrouping="MatchAll">',
    ...conditions.map(condition => `            <add ${condition} />`), '          </conditions>'] : []),
  `          <action ${action} />`,
  '        </rule>',
];
const redirect = destination => `type="Redirect" url="${xml(destination)}" appendQueryString="true" redirectType="Permanent"`;
const headers = Object.entries(securityHeaders).flatMap(([name, value]) => [
  `        <remove name="${xml(name)}" />`,
  `        <add name="${xml(name)}" value="${xml(value)}" />`,
]);
if (manifest.indexable === false) headers.push('        <remove name="X-Robots-Tag" />', '        <add name="X-Robots-Tag" value="noindex, follow" />');
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};
// Request Filtering runs before rewriting: allow clean URLs with no extension.
// StaticFileModule only serves the explicit MIME types below; no wildcard MIME map.
const deniedExtensions = ['.config', '.php', '.phtml', '.phar', '.asp', '.aspx', '.asax', '.ashx', '.asmx', '.axd',
  '.cs', '.vb', '.cshtml', '.vbhtml', '.jsp', '.jspx', '.cgi', '.fcgi', '.shtml', '.shtm', '.stm',
  '.pl', '.py', '.rb', '.sh', '.bat', '.cmd', '.ps1', '.sql', '.db', '.bak', '.log', '.pem', '.key', '.map', '.md'];
const hiddenSegments = ['web.config', '.git', '.svn', '.hg', '.env', '.qa', '.codex', '.agents',
  'src', 'scripts', 'node_modules', 'dist-ssr'];
const canonicalPath = 'input="{UNENCODED_URL}" pattern="^(/[^?]*)(?:\\?.*)?$"';

const lines = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<!-- Generated by scripts/generate-iis-config.mjs. Do not edit build output. -->',
  `<!-- Canonical origin: ${xml(origin.origin)}; IIS 8.5+ with URL Rewrite 2.0. -->`,
  '<!-- Deploy into a clean domain-root directory. See docs/SECURITY-IIS-DEPLOYMENT.md. -->',
  '<configuration>',
  '  <system.webServer>',
  '    <directoryBrowse enabled="false" />',
  '    <defaultDocument enabled="false" />',
  '    <handlers accessPolicy="Read">',
  '      <clear />',
  '      <add name="OrbitStaticOnly" path="*" verb="GET,HEAD" modules="StaticFileModule" resourceType="File" requireAccess="Read" />',
  '    </handlers>',
  '    <security>',
  '      <requestFiltering allowDoubleEscaping="false">',
  '        <verbs allowUnlisted="false" applyToWebDAV="true">',
  '          <clear />',
  '          <add verb="GET" allowed="true" />',
  '          <add verb="HEAD" allowed="true" />',
  '        </verbs>',
  '        <requestLimits maxAllowedContentLength="0" maxUrl="4096" maxQueryString="2048" />',
  '        <fileExtensions allowUnlisted="true" applyToWebDAV="true">',
  ...deniedExtensions.flatMap(extension => [`          <remove fileExtension="${extension}" />`, `          <add fileExtension="${extension}" allowed="false" />`]),
  '        </fileExtensions>',
  '        <hiddenSegments applyToWebDAV="true">',
  ...hiddenSegments.flatMap(segment => [`          <remove segment="${segment}" />`, `          <add segment="${segment}" />`]),
  '        </hiddenSegments>',
  '        <denyUrlSequences>',
  ...['..', ':', '\\'].flatMap(sequence => [`          <remove sequence="${xml(sequence)}" />`, `          <add sequence="${xml(sequence)}" />`]),
  '        </denyUrlSequences>',
  '      </requestFiltering>',
  '    </security>',
  '    <staticContent>',
  '      <clear />',
  ...Object.entries(types).map(([extension, type]) => `      <mimeMap fileExtension="${extension}" mimeType="${xml(type)}" />`),
  '      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="00:00:00" />',
  '    </staticContent>',
  '    <httpProtocol>',
  '      <customHeaders>',
  '        <remove name="X-Powered-By" />',
  ...headers,
  '      </customHeaders>',
  '    </httpProtocol>',
  '    <httpErrors errorMode="Custom" existingResponse="Replace">',
  '      <clear />',
  '      <error statusCode="404" subStatusCode="-1" path="404.html" prefixLanguageFilePath="" responseMode="File" />',
  '    </httpErrors>',
  '    <rewrite>',
  '      <rules>',
  '        <clear />',
  '        <!-- Reject source files, executable double extensions and PATH_INFO before file serving. -->',
  ...rule('Orbit block non-public paths', privateFilePattern.source,
    'type="CustomResponse" statusCode="404" subStatusCode="0" statusReason="Not Found" statusDescription="Not found."',
    []).map(line => line.includes('<match ') ? line.replace('ignoreCase="false"', 'ignoreCase="true"') : line),
  '        <!-- Existing HTTP-01 proof tokens must remain reachable on port 80 before canonical redirects. -->',
  ...rule('Orbit existing ACME proof', '^\\.well-known/acme-challenge/[A-Za-z0-9_-]+$', 'type="None"',
    ['input="{REQUEST_FILENAME}" matchType="IsFile"']),
  '        <!-- Permanent is HTTP 301 on IIS URL Rewrite; 308 is unsupported. -->',
  ...migrations.flatMap((migration, index) => rule(`Orbit legacy ${index + 1}`,
    `^${regex(migration.source.slice(1))}/*$`, redirect(origin.origin + migration.destination))),
  ...rule('Orbit explicit index HTML', '^index\\.html$', redirect(origin.origin + '/'),
    ['input="{UNENCODED_URL}" pattern="^/index\\.html(?:\\?|$)"']),
  ...routes.filter(route => route !== '/').flatMap((route, index) => [
    ...rule(`Orbit explicit HTML ${index + 1}`, `^${regex(route.slice(1))}\\.html$`, redirect(origin.origin + route),
      [`input="{UNENCODED_URL}" pattern="${xml(`^/${regex(route.slice(1))}\\.html(?:\\?|$)`)}"`]),
    ...rule(`Orbit trailing slash ${index + 1}`, `^${regex(route.slice(1))}/+$`, redirect(origin.origin + route)),
  ]),
  '        <!-- The redirect host is fixed; never concatenate the untrusted Host header. -->',
  ...rule('Orbit canonical hostname', '.*', redirect(origin.origin + '{C:1}'),
    [`input="{HTTP_HOST}" pattern="${xml(`^${regex(origin.host)}$`)}" ignoreCase="true" negate="true"`, canonicalPath]),
  '        <!-- Only a provider-set non-HTTP server variable can attest trusted proxy HTTPS. -->',
  '        <!-- Missing marker is not trusted; direct TLS uses HTTPS=ON. -->',
  ...rule('Orbit enforce HTTPS', '.*', redirect(origin.origin + '{C:1}'),
    ['input="{HTTPS}" pattern="^ON$" ignoreCase="true" negate="true"',
      'input="{ORBIT_TRUSTED_HTTPS}" pattern="^1$" negate="true"', canonicalPath]),
  ...rule('Orbit direct error route', '^404(?:\\.html)?/*$',
    'type="CustomResponse" statusCode="404" subStatusCode="0" statusReason="Not Found" statusDescription="Not found."'),
  ...rule('Orbit homepage', '^$', 'type="Rewrite" url="index.html" appendQueryString="true"'),
  ...routes.filter(route => route !== '/').flatMap((route, index) => rule(`Orbit rendered route ${index + 1}`,
    `^${regex(route.slice(1))}$`, `type="Rewrite" url="${xml(route.slice(1))}.html" appendQueryString="true"`)),
  '        <!-- Clean /products and /solutions must be rewritten before any directory handling. -->',
  ...rule('Orbit existing static file', '.*', 'type="None"', ['input="{REQUEST_FILENAME}" matchType="IsFile"']),
  ...rule('Orbit unknown route', '.*',
    'type="CustomResponse" statusCode="404" subStatusCode="0" statusReason="Not Found" statusDescription="Not found."'),
  '      </rules>',
  '      <outboundRules>',
  '        <clear />',
  '        <rule name="Orbit noindex errors" preCondition="Orbit404">',
  '          <match serverVariable="RESPONSE_X_ROBOTS_TAG" pattern=".*" />',
  '          <action type="Rewrite" value="noindex, follow" />',
  '        </rule>',
  '        <rule name="Orbit no-store errors" preCondition="OrbitError">',
  '          <match serverVariable="RESPONSE_CACHE_CONTROL" pattern=".*" />',
  '          <action type="Rewrite" value="no-store" />',
  '        </rule>',
  '        <rule name="Orbit immutable assets" preCondition="OrbitViteAsset">',
  '          <match serverVariable="RESPONSE_CACHE_CONTROL" pattern=".*" />',
  '          <action type="Rewrite" value="public, max-age=31536000, immutable" />',
  '        </rule>',
  '        <rule name="Orbit revalidate HTML" preCondition="OrbitHTML">',
  '          <match serverVariable="RESPONSE_CACHE_CONTROL" pattern=".*" />',
  '          <action type="Rewrite" value="public, max-age=0, must-revalidate" />',
  '        </rule>',
  '        <preConditions>',
  '          <preCondition name="Orbit404"><add input="{RESPONSE_STATUS}" pattern="^404$" /></preCondition>',
  '          <preCondition name="OrbitError"><add input="{RESPONSE_STATUS}" pattern="^[45][0-9][0-9]$" /></preCondition>',
  '          <preCondition name="OrbitViteAsset" logicalGrouping="MatchAll">',
  '            <add input="{RESPONSE_STATUS}" pattern="^200$" />',
  '            <add input="{URL}" pattern="^/assets/" />',
  '          </preCondition>',
  '          <preCondition name="OrbitHTML" logicalGrouping="MatchAll">',
  '            <add input="{RESPONSE_STATUS}" pattern="^200$" />',
  '            <add input="{RESPONSE_CONTENT_TYPE}" pattern="^text/html" />',
  '          </preCondition>',
  '        </preConditions>',
  '      </outboundRules>',
  '    </rewrite>',
  '  </system.webServer>',
  '  <!-- Extensionless HTTP-01 proofs are plain text only in this exact directory. -->',
  '  <location path=".well-known/acme-challenge">',
  '    <system.webServer>',
  '      <staticContent>',
  '        <remove fileExtension="." />',
  '        <mimeMap fileExtension="." mimeType="text/plain" />',
  '      </staticContent>',
  '    </system.webServer>',
  '  </location>',
  '</configuration>',
  '',
];
const configuration = lines.join('\n');
const destination = path.join(dist, 'web.config');
if (process.argv.includes('--check')) {
  assert.equal(await readFile(destination, 'utf8'), configuration, 'dist/web.config is stale; regenerate it after prerendering.');
  console.log(`IIS configuration matches ${routes.length} rendered routes, ${migrations.length} permanent redirects and the shared security policy.`);
} else {
  await writeFile(destination, configuration);
  console.log(`Generated dist/web.config for IIS: ${routes.length} clean routes, ${migrations.length} permanent redirects, static-only handlers and security headers.`);
}
