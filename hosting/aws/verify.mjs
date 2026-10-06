import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { securityHeaders } from '../../scripts/security-policy.mjs';
import { createTemplate, createViewerRequest } from './generate.mjs';

// Local checks exercise routing/security decisions in the emitted function.
// This is not AWS CloudFormation validation or a CloudFront runtime test.
export function verifyAwsHosting({ manifest, redirects }) {
  const source = createViewerRequest({ manifest, redirects });
  const domain = new URL(manifest.siteOrigin).hostname;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(source.replace('__CANONICAL_DOMAIN__', domain), sandbox, { timeout: 1000 });
  const invoke = (uri, { method = 'GET', host = domain, querystring = {} } = {}) => sandbox.handler({ request: { uri, method, headers: { host: { value: host } }, querystring } });
  let checks = 0;
  for (const page of manifest.pages) {
    const file = page.outputFile || (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);
    for (const method of ['GET', 'HEAD']) {
      assert.equal(invoke(page.path, { method }).uri, `/${file}`);
      checks++;
    }
    assert.equal(invoke(`/${file}`).headers.location.value, manifest.siteOrigin + page.path);
    checks++;
    if (page.path !== '/') {
      assert.equal(invoke(page.path + '/').headers.location.value, manifest.siteOrigin + page.path);
      checks++;
    }
  }
  const migrations = redirects.filter(rule => !rule.has);
  for (const rule of migrations) {
    for (const suffix of ['', '/']) {
      const response = invoke(rule.source + suffix);
      assert.equal(response.statusCode, 308);
      assert.equal(response.headers.location.value, manifest.siteOrigin + rule.destination);
      checks++;
    }
  }
  for (const uri of ['/.env', '/.env%20', '/%2egit/config', '/src/App.jsx', '/scripts/build.js', '/old.php/file', '/image.jpg.bak', '/certificate.pem', '/assets/app.js.map']) {
    const response = invoke(uri);
    assert.equal(response.statusCode, 403, uri);
    for (const [name, value] of Object.entries(securityHeaders)) assert.equal(response.headers[name.toLowerCase()].value, value);
    checks++;
  }
  for (const uri of ['//evil.example/a', '/../about', '/a/./b', '/%252eenv', '/about%0d%0a', '/assets/Scada%202-qqY5mJNi.png%0d%0a', '/about%00', '/assets%2ffile.js', '/%5cfile', '/%ZZ', '/a\\b']) {
    assert.equal(invoke(uri).statusCode, 400, uri);
    checks++;
  }
  assert.equal(invoke('/about', { method: 'POST' }).statusCode, 405);
  assert.equal(invoke('/does-not-exist').uri, '/does-not-exist');
  assert.equal(invoke('/assets/index-abc123.js').uri, '/assets/index-abc123.js');
  const spacedAsset = '/assets/Scada%202-qqY5mJNi.png';
  assert.equal(invoke(spacedAsset).uri, spacedAsset);
  assert.equal(invoke(spacedAsset, { host: 'alias.example.com' }).headers.location.value, manifest.siteOrigin + spacedAsset);
  assert.equal(invoke('/404').uri, '/__orbit_missing__/404');
  assert.equal(invoke('/404.html').uri, '/__orbit_missing__/404');
  assert.equal(invoke('/about', { host: 'alias.example.com' }).headers.location.value, `${manifest.siteOrigin}/about`);
  assert.equal(invoke('/about/', { querystring: { utm_source: { value: 'a%20b' }, tag: { multiValue: [{ value: 'one' }, { value: 'two' }] } } }).headers.location.value,
    `${manifest.siteOrigin}/about?utm_source=a%20b&tag=one&tag=two`);
  checks += 9;
  const noDomain = {};
  vm.createContext(noDomain);
  vm.runInContext(source.replace('__CANONICAL_DOMAIN__', ''), noDomain, { timeout: 1000 });
  const request = { uri: '/about', method: 'GET', headers: { host: { value: 'd123.example.cloudfront.net' } }, querystring: {} };
  assert.equal(noDomain.handler({ request }).uri, '/about.html');
  checks++;
  const template = createTemplate({ manifest, redirects });
  const resources = template.Resources;
  assert.deepEqual(resources.SiteBucket.Properties.PublicAccessBlockConfiguration,
    { BlockPublicAcls: true, IgnorePublicAcls: true, BlockPublicPolicy: true, RestrictPublicBuckets: true });
  assert.equal(resources.OriginAccessControl.Properties.OriginAccessControlConfig.SigningBehavior, 'always');
  assert.equal(resources.SiteBucketPolicy.Properties.PolicyDocument.Statement[0].Action, 's3:GetObject');
  assert.equal(resources.HtmlCachePolicy.Properties.CachePolicyConfig.MaxTTL, 0);
  assert.equal(resources.AssetCachePolicy.Properties.CachePolicyConfig.DefaultTTL, 31536000);
  const assetCacheHeader = resources.AssetHeaders.Properties.ResponseHeadersPolicyConfig.CustomHeadersConfig.Items.find(item => item.Header === 'Cache-Control');
  assert.equal(assetCacheHeader.Value, 'public, max-age=0, must-revalidate');
  assert.equal(assetCacheHeader.Override, false, 'Preserve real asset metadata without forcing immutable browser caching on missing objects.');
  const distribution = resources.Distribution.Properties.DistributionConfig;
  assert.deepEqual(distribution.DefaultCacheBehavior.AllowedMethods, ['GET', 'HEAD']);
  assert.equal(distribution.DefaultCacheBehavior.ViewerProtocolPolicy, 'redirect-to-https');
  assert.deepEqual(distribution.CustomErrorResponses.map(item => [item.ErrorCode, item.ResponseCode, item.ResponsePagePath]), [[403, 404, '/404.html'], [404, 404, '/404.html']]);
  checks += 10;
  return { routes: manifest.pages.length, migrations: migrations.length, checks, functionBytes: Buffer.byteLength(source), maximumFunctionBytes: 10240, awsDeploymentTested: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const manifest = JSON.parse(await readFile(path.join(root, 'dist/seo-manifest.json'), 'utf8'));
  const { redirects } = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
  console.log(JSON.stringify(verifyAwsHosting({ manifest, redirects }), null, 2));
}
