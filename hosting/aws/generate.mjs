import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { securityHeaders, privateFilePattern } from '../../scripts/security-policy.mjs';

const ref = name => ({ Ref: name });
const sub = value => ({ 'Fn::Sub': value });
const getAtt = (resource, attribute) => ({ 'Fn::GetAtt': [resource, attribute] });
const choose = (condition, yes, no) => ({ 'Fn::If': [condition, yes, no] });
const absent = ref('AWS::NoValue');
const equals = (left, right) => ({ 'Fn::Equals': [left, right] });
const not = condition => ({ 'Fn::Not': [condition] });

function responsePolicy(cacheControl, noindex = false, overrideCacheControl = true) {
  const native = new Set(['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Strict-Transport-Security']);
  const custom = Object.entries(securityHeaders).filter(([name]) => !native.has(name)).map(([Header, Value]) => ({ Header, Value, Override: true }));
  custom.push({ Header: 'Cache-Control', Value: cacheControl, Override: overrideCacheControl });
  if (noindex) custom.push({ Header: 'X-Robots-Tag', Value: 'noindex, follow', Override: true });
  assert(custom.length <= 10, 'CloudFront permits at most 10 custom response headers.');
  assert(securityHeaders['Content-Security-Policy'].length <= 1783, 'CloudFront native CSP header exceeds its 1783-character quota.');
  const hsts = securityHeaders['Strict-Transport-Security'];
  assert(/^max-age=\d+$/.test(hsts), 'Review AWS HSTS mapping after changes to shared policy.');
  return {
    CustomHeadersConfig: { Items: custom },
    SecurityHeadersConfig: {
      ContentSecurityPolicy: { ContentSecurityPolicy: securityHeaders['Content-Security-Policy'], Override: true },
      ContentTypeOptions: { Override: true },
      FrameOptions: { FrameOption: securityHeaders['X-Frame-Options'], Override: true },
      ReferrerPolicy: { ReferrerPolicy: securityHeaders['Referrer-Policy'], Override: true },
      StrictTransportSecurity: { AccessControlMaxAgeSec: Number(hsts.split('=')[1]), IncludeSubdomains: false, Preload: false, Override: true },
    },
  };
}

// AWS runtime 2.0 has no Node APIs. Emit plain JavaScript and fail the build if
// the function exceeds CloudFront's fixed 10 KB quota.
export function createViewerRequest({ manifest, redirects }) {
  assert((manifest.basePath || '/') === '/' && (manifest.urlStyle || 'clean') === 'clean', 'AWS profile requires root hosting with clean URLs.');
  const origin = new URL(manifest.siteOrigin);
  assert(origin.protocol === 'https:' && !origin.port && origin.origin === manifest.siteOrigin,
    'AWS manifest must contain one HTTPS origin on the standard HTTPS port.');
  const routes = {};
  for (const page of manifest.pages) {
    assert(page.path === '/' || /^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(page.path), `Unsafe AWS route: ${page.path}`);
    const file = page.outputFile || (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);
    assert(file === (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`), `AWS route file mismatch: ${file}`);
    routes[page.path] = `/${file}`;
  }
  assert(routes['/'] && Object.keys(routes).length === manifest.pages.length, 'Duplicate/missing AWS routes.');
  const migrations = {};
  for (const rule of redirects.filter(rule => !rule.has)) {
    assert(rule.permanent === true && !routes[rule.source] && routes[rule.destination], 'Invalid AWS migration.');
    assert(!migrations[rule.source], 'Duplicate AWS migration.');
    migrations[rule.source] = rule.destination;
  }
  const functionHeaders = Object.fromEntries(Object.entries(securityHeaders).map(([name, value]) => [name.toLowerCase(), { value }]));
  if (manifest.indexable === false) functionHeaders['x-robots-tag'] = { value: 'noindex, follow' };
  const code = `// Generated from the route manifest and shared production security policy.
var canonicalDomain = '__CANONICAL_DOMAIN__';
var routes = ${JSON.stringify(routes)};
var migrations = ${JSON.stringify(migrations)};
var security = ${JSON.stringify(functionHeaders)};
var privatePath = new RegExp(${JSON.stringify(privateFilePattern.source)}, 'i');
function fail(status) {
  var headers = {};
  for (var name in security) headers[name] = security[name];
  headers['cache-control'] = {value:'no-store'};
  headers['x-robots-tag'] = {value:'noindex, follow'};
  if (status === 405) headers.allow = {value:'GET, HEAD'};
  return {statusCode:status, headers:headers};
}
function component(value) {
  return encodeURIComponent(String(value)).replace(/%25([0-9A-Fa-f]{2})/g, '%$1');
}
function query(request) {
  var parts = [];
  var entries = request.querystring || {};
  for (var key in entries) {
    var values = entries[key].multiValue || [entries[key]];
    for (var i = 0; i < values.length; i++) parts.push(component(key) + '=' + component(values[i].value || ''));
  }
  return parts.length ? '?' + parts.join('&') : '';
}
function redirect(request, destination) {
  var headers = {};
  for (var name in security) headers[name] = security[name];
  headers.location = {value:(canonicalDomain ? 'https://' + canonicalDomain : '') + encodeURI(destination) + query(request)};
  headers['cache-control'] = {value:'no-cache, max-age=0, must-revalidate'};
  return {statusCode:308, statusDescription:'Permanent Redirect', headers:headers};
}
function handler(event) {
  var request = event.request;
  if (request.method !== 'GET' && request.method !== 'HEAD') return fail(405);
  var raw = request.uri || '/';
  if (/%(?:2f|5c)/i.test(raw)) return fail(400);
  var uri;
  try { uri = decodeURIComponent(raw); } catch (error) { return fail(400); }
  if (uri.charAt(0) !== '/' || uri.indexOf('//') >= 0 || /[\\\\%?#\\x00-\\x1f\\x7f]/.test(uri) || /(?:^|\\/)\\.{1,2}(?:\\/|$)/.test(uri)) return fail(400);
  if (privatePath.test(uri)) return fail(403);
  var clean = uri === '/' ? '/' : uri.replace(/\\/+$/, '');
  if (Object.prototype.hasOwnProperty.call(migrations, clean)) return redirect(request, migrations[clean]);
  if (clean === '/index.html') return redirect(request, '/');
  if (clean.length > 5 && clean.slice(-5) === '.html' && Object.prototype.hasOwnProperty.call(routes, clean.slice(0,-5))) return redirect(request, clean.slice(0,-5));
  if (Object.prototype.hasOwnProperty.call(routes, clean) && clean !== uri) return redirect(request, clean);
  var host = request.headers.host && request.headers.host.value;
  if (canonicalDomain && host !== canonicalDomain) return redirect(request, uri);
  // Fetching a missing private-origin object triggers the distribution's branded
  // 404 error page with status 404. An error URL must never become a 200 page.
  if (clean === '/404' || clean === '/404.html') request.uri = '/__orbit_missing__/404';
  else if (Object.prototype.hasOwnProperty.call(routes, clean)) request.uri = routes[clean];
  // Unknown paths/assets pass through to S3 and its real 403/404 error handling.
  // There is deliberately no SPA fallback to index.html.
  return request;
}
`;
  assert(Buffer.byteLength(code.replace('__CANONICAL_DOMAIN__', 'a'.repeat(253)), 'utf8') <= 10 * 1024,
    'AWS viewer-request function exceeds CloudFront 10 KB after its longest allowed domain substitution.');
  return code;
}

export function createTemplate({ manifest, redirects }) {
  const code = createViewerRequest({ manifest, redirects });
  const functionCode = code.replace('__CANONICAL_DOMAIN__', '${CanonicalDomain}');
  const associations = [{ EventType: 'viewer-request', FunctionARN: getAtt('RouteFunction', 'FunctionARN') }];
  const behavior = (cache, headers) => ({
    TargetOriginId: 'PrivateS3', ViewerProtocolPolicy: 'redirect-to-https', AllowedMethods: ['GET', 'HEAD'], CachedMethods: ['GET', 'HEAD'],
    Compress: true, CachePolicyId: ref(cache), ResponseHeadersPolicyId: ref(headers), FunctionAssociations: associations,
  });
  const policy = (name, ttl) => ({ Type: 'AWS::CloudFront::CachePolicy', Properties: { CachePolicyConfig: {
    Name: sub(`\${AWS::StackName}-${name}`), MinTTL: 0, DefaultTTL: ttl, MaxTTL: ttl,
    ParametersInCacheKeyAndForwardedToOrigin: {
      EnableAcceptEncodingGzip: true, EnableAcceptEncodingBrotli: true,
      HeadersConfig: { HeaderBehavior: 'none' }, CookiesConfig: { CookieBehavior: 'none' }, QueryStringsConfig: { QueryStringBehavior: 'none' },
    },
  } } });
  return {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: 'Orbit static site: private S3, CloudFront OAC, HTTPS, clean SSG routes, real 404s and shared security headers. Generated locally; not deployed.',
    Metadata: { BuildOrigin: manifest.siteOrigin, BuildBasePath: manifest.basePath || '/', BuildUrlStyle: manifest.urlStyle || 'clean', Indexable: manifest.indexable ?? true, RouteCount: manifest.pages.length },
    Parameters: {
      CanonicalDomain: { Type: 'String', Default: '', AllowedPattern: '^$|^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$', Description: 'Optional canonical hostname only, such as orbitengineering.com. Empty uses the generated CloudFront domain without a host redirect.' },
      AlternateDomain: { Type: 'String', Default: '', AllowedPattern: '^$|^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$', Description: 'Optional additional HTTPS hostname, e.g. www.orbitengineering.com; redirects to CanonicalDomain. Certificate must cover both.' },
      CertificateArn: { Type: 'String', Default: '', AllowedPattern: '^$|^arn:aws:acm:us-east-1:[0-9]{12}:certificate/[a-fA-F0-9-]{36}$', Description: 'Issued ACM certificate ARN in us-east-1; required when CanonicalDomain is set.' },
      PriceClass: { Type: 'String', Default: 'PriceClass_200', AllowedValues: ['PriceClass_100', 'PriceClass_200', 'PriceClass_All'], Description: '200 includes Indian edge locations. Choose with cost/latency needs.' },
      WebAclArn: { Type: 'String', Default: '', Description: 'Optional existing AWS WAFv2 global (CloudFront/us-east-1) Web ACL ARN. Empty does not create WAF or rate-limit rules.' },
    },
    Rules: {
      CustomDomainRequiresCertificate: { Assertions: [{ Assert: { 'Fn::Or': [equals(ref('CanonicalDomain'), ''), not(equals(ref('CertificateArn'), ''))] }, AssertDescription: 'A custom domain requires an issued us-east-1 ACM certificate.' }] },
      AlternateRequiresCanonical: { Assertions: [{ Assert: { 'Fn::Or': [equals(ref('AlternateDomain'), ''), not(equals(ref('CanonicalDomain'), ''))] }, AssertDescription: 'An alternate hostname requires CanonicalDomain.' }] },
      CertificateRequiresDomain: { Assertions: [{ Assert: { 'Fn::Or': [equals(ref('CertificateArn'), ''), not(equals(ref('CanonicalDomain'), ''))] }, AssertDescription: 'Set CanonicalDomain when supplying a custom certificate.' }] },
    },
    Conditions: { HasDomain: not(equals(ref('CanonicalDomain'), '')), HasAlternate: not(equals(ref('AlternateDomain'), '')), HasWaf: not(equals(ref('WebAclArn'), '')) },
    Resources: {
      SiteBucket: { Type: 'AWS::S3::Bucket', DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain', Properties: {
        PublicAccessBlockConfiguration: { BlockPublicAcls: true, IgnorePublicAcls: true, BlockPublicPolicy: true, RestrictPublicBuckets: true },
        OwnershipControls: { Rules: [{ ObjectOwnership: 'BucketOwnerEnforced' }] },
        BucketEncryption: { ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } }] },
        VersioningConfiguration: { Status: 'Enabled' },
      } },
      OriginAccessControl: { Type: 'AWS::CloudFront::OriginAccessControl', Properties: { OriginAccessControlConfig: {
        Name: sub('${AWS::StackName}-oac'), Description: 'Signed HTTPS access to the private S3 REST endpoint', OriginAccessControlOriginType: 's3', SigningBehavior: 'always', SigningProtocol: 'sigv4',
      } } },
      RouteFunction: { Type: 'AWS::CloudFront::Function', Properties: { Name: sub('${AWS::StackName}-routes'), AutoPublish: true, FunctionConfig: { Comment: 'Static clean routes, canonical/legacy redirects and private-path rejection', Runtime: 'cloudfront-js-2.0' }, FunctionCode: sub(functionCode) } },
      HtmlCachePolicy: policy('html-no-cache', 0), AssetCachePolicy: policy('hashed-assets', 31536000),
      SecurityHeaders: { Type: 'AWS::CloudFront::ResponseHeadersPolicy', Properties: { ResponseHeadersPolicyConfig: { Name: sub('${AWS::StackName}-html-security'), ...responsePolicy('no-cache, max-age=0, must-revalidate', manifest.indexable === false) } } },
      // Keep uploaded immutable metadata for real hashed objects. Missing
      // objects must not inherit a year-long browser cache from this behavior.
      AssetHeaders: { Type: 'AWS::CloudFront::ResponseHeadersPolicy', Properties: { ResponseHeadersPolicyConfig: { Name: sub('${AWS::StackName}-asset-security'), ...responsePolicy('public, max-age=0, must-revalidate', manifest.indexable === false, false) } } },
      ErrorHeaders: { Type: 'AWS::CloudFront::ResponseHeadersPolicy', Properties: { ResponseHeadersPolicyConfig: { Name: sub('${AWS::StackName}-error-security'), ...responsePolicy('no-store', true) } } },
      Distribution: { Type: 'AWS::CloudFront::Distribution', Properties: { DistributionConfig: {
        Enabled: true, IPV6Enabled: true, HttpVersion: 'http2and3', PriceClass: ref('PriceClass'), Comment: 'Orbit Engineering static production website',
        Aliases: choose('HasDomain', [ref('CanonicalDomain'), choose('HasAlternate', ref('AlternateDomain'), absent)], absent),
        ViewerCertificate: choose('HasDomain', { AcmCertificateArn: ref('CertificateArn'), SslSupportMethod: 'sni-only', MinimumProtocolVersion: 'TLSv1.2_2021' }, { CloudFrontDefaultCertificate: true }),
        WebACLId: choose('HasWaf', ref('WebAclArn'), absent),
        Origins: [{ Id: 'PrivateS3', DomainName: getAtt('SiteBucket', 'RegionalDomainName'), OriginAccessControlId: ref('OriginAccessControl'), S3OriginConfig: { OriginAccessIdentity: '' } }],
        DefaultCacheBehavior: behavior('HtmlCachePolicy', 'SecurityHeaders'),
        CacheBehaviors: [{ PathPattern: 'assets/*', ...behavior('AssetCachePolicy', 'AssetHeaders') }, { PathPattern: '404*', ...behavior('HtmlCachePolicy', 'ErrorHeaders') }],
        CustomErrorResponses: [403, 404].map(ErrorCode => ({ ErrorCode, ResponseCode: 404, ResponsePagePath: '/404.html', ErrorCachingMinTTL: 0 })),
      } } },
      SiteBucketPolicy: { Type: 'AWS::S3::BucketPolicy', Properties: { Bucket: ref('SiteBucket'), PolicyDocument: { Version: '2012-10-17', Statement: [
        { Sid: 'CloudFrontReadOnly', Effect: 'Allow', Principal: { Service: 'cloudfront.amazonaws.com' }, Action: 's3:GetObject', Resource: sub('${SiteBucket.Arn}/*'), Condition: { StringEquals: { 'AWS:SourceArn': sub('arn:${AWS::Partition}:cloudfront::${AWS::AccountId}:distribution/${Distribution}') } } },
        { Sid: 'DenyInsecureTransport', Effect: 'Deny', Principal: '*', Action: 's3:*', Resource: [getAtt('SiteBucket', 'Arn'), sub('${SiteBucket.Arn}/*')], Condition: { Bool: { 'aws:SecureTransport': 'false' } } },
      ] } } },
    },
    Outputs: {
      BucketName: { Value: ref('SiteBucket'), Description: 'Upload only the verified public release payload to this private bucket.' },
      DistributionId: { Value: ref('Distribution') },
      DistributionDomain: { Value: getAtt('Distribution', 'DomainName') },
      SiteUrl: { Value: choose('HasDomain', sub('https://${CanonicalDomain}'), { 'Fn::Join': ['', ['https://', getAtt('Distribution', 'DomainName')]] }) },
      BuildOrigin: { Value: manifest.siteOrigin, Description: 'SEO origin embedded in this build. Rebuild before upload if SiteUrl differs.' },
    },
  };
}

export async function generateAwsHosting({ manifest, redirects, outputDirectory }) {
  const code = createViewerRequest({ manifest, redirects });
  const template = createTemplate({ manifest, redirects });
  const uploadPolicy = {
    Version: '2012-10-17', Statement: [
      { Sid: 'ListOnlyWebsiteBucket', Effect: 'Allow', Action: ['s3:ListBucket', 's3:GetBucketLocation'], Resource: 'arn:aws:s3:::REPLACE_WEBSITE_BUCKET' },
      { Sid: 'UploadOnlyWebsiteObjects', Effect: 'Allow', Action: ['s3:PutObject', 's3:AbortMultipartUpload'], Resource: 'arn:aws:s3:::REPLACE_WEBSITE_BUCKET/*' },
      { Sid: 'InvalidateOnlyWebsiteDistribution', Effect: 'Allow', Action: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation'], Resource: 'arn:aws:cloudfront::REPLACE_ACCOUNT_ID:distribution/REPLACE_DISTRIBUTION_ID' },
    ],
  };
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'cloudformation.json'), JSON.stringify(template, null, 2) + '\n');
  await writeFile(path.join(outputDirectory, 'viewer-request.js'), code);
  await writeFile(path.join(outputDirectory, 'upload-policy.example.json'), JSON.stringify(uploadPolicy, null, 2) + '\n');
  return { files: ['cloudformation.json', 'viewer-request.js', 'upload-policy.example.json'], functionBytes: Buffer.byteLength(code), routes: manifest.pages.length };
}
