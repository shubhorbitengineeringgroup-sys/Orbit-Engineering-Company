# Secure static deployment on IIS

The 6 October 2026 read-only live header check reported `Microsoft-IIS/8.5` on the company's bare and `www` HTTPS hosts. That header identifies what the public server advertises; the hosting provider must confirm its actual platform, installed modules and patch status. The new build supplies `dist/web.config` through `scripts/generate-iis-config.mjs`. This artifact does not deploy the site or clean the old hosting account.

## Provider prerequisites

Use a separate clean directory as the domain-root site/application. Preserve the old release and relevant logs outside the public root, then retire its CMS, executable files, virtual directories, child applications, upload endpoints and cached responses. Upload only the generated static release, including `web.config`, HTML, images, assets and public discovery/verification files. Source code, environment files, development dependencies and backups must stay outside the public directory.

The provider must supply IIS Static Content and Request Filtering plus **Microsoft URL Rewrite 2.0**. It must permit these site-level sections: `handlers`, `directoryBrowse`, `defaultDocument`, `staticContent`, `httpProtocol`, `httpErrors`, `security/requestFiltering` and `rewrite`. Locked sections or a missing module can produce HTTP 500.19; the administrator must install equivalent site-level settings or delegate the required sections before release. Clearing local rewrite rules cannot remove server-level global rules or separate child applications. Review those explicitly. [IIS configuration delegation](https://learn.microsoft.com/en-us/iis/manage/managing-your-configuration-settings/understanding-iis-configuration-delegation)

Run the site in a dedicated application pool with **No Managed Code**, remove unnecessary WebDAV/ASP/ASP.NET/PHP support for this static application, and grant its identity read access to the release directory without upload/write access. Keep deployment write access in a separate authenticated account. IIS handler permissions define how a request is processed; filesystem ACLs remain an administrator responsibility. [IIS handler configuration](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/handlers/add)

Confirm the underlying OS and security-update coverage, rather than relying on the server banner. If this is Windows Server 2012 R2, its Extended Security Updates end **13 October 2026**; arrange a supported platform with the provider if applicable. [Microsoft servicing status](https://learn.microsoft.com/en-us/windows/release-health/status-windows-8.1-and-windows-server-2012-r2)

## What the generated configuration does

The artifact clears inherited handler mappings and installs only `StaticFileModule` for GET/HEAD reads. Request Filtering denies other methods, request bodies, double escaping, private/source segments and executable extensions. A shared rewrite pattern also rejects executable double extensions, backups and PATH_INFO. MIME mappings are explicitly listed for HTML, JavaScript, CSS, public JSON/XML/text, images, fonts, PDF and MP4; directory listing is disabled. Clean URLs require Request Filtering to allow unlisted extensions before rewriting. Filtering rejections commonly use 404 substatus codes, such as 404.6 for a denied verb. [IIS Request Filtering](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/requestfiltering/), [HTTP verb filtering](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/security/requestfiltering/verbs/), [MIME mappings](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/mimemap)

All 35 rendered routes and 22 legacy destinations come from the current build manifest and Vercel migration data. Redirects use **HTTP 301**: Microsoft URL Rewrite does not support 308. Explicit HTML and trailing-slash requests redirect to known clean routes. The destination hostname is fixed to the configured HTTPS origin; incoming Host values are never used as the destination. Query strings are preserved. Check encoded asset paths, including filenames containing spaces, on the actual server. [URL Rewrite configuration](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference)

Unknown routes, missing assets and `/404` return 404. Native `httpErrors` inserts the contents of the site-relative `404.html` using **File** mode with an empty language-prefix path and `existingResponse="Replace"`; the original error status remains the response status. This does not execute the error page as an application URL or redirect the visitor. Custom error mode avoids detailed server diagnostics. The provider must verify that its delegated error-file resolution reads this release's `404.html`. [IIS HTTP errors](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/httperrors/), [Error-file settings](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/httperrors/error)

Headers come from `scripts/security-policy.mjs`; each custom header is removed before being added to avoid collection inheritance collisions. The file removes the inherited `X-Powered-By` custom header. It deliberately does not use `removeServerHeader`, which was introduced in IIS 10 and is unsupported by IIS 8.5. Header suppression is not a replacement for patching Windows/IIS. [Custom headers](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/httpprotocol/customheaders/)

Outbound header rules mark 404 responses `noindex, follow`, apply `no-store` to errors, revalidate successful HTML and cache successful Vite assets for one year. They rewrite headers only, without changing HTML content. Verify these rules on native error and cache responses as well as successful pages. [Response-header rewriting](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/modifying-http-response-headers)

## TLS and trusted proxies

Provision valid certificates and HTTPS bindings for both the bare and `www` hosts before installing redirects. The browser verifies the certificate before it follows a redirect. The local October 6 check validated TLS but reported an October 17, 2026 certificate expiry; the provider must verify renewal for both hostnames. This build cannot renew the certificate.

For HTTP-01 renewal, the generated file permits existing base64url tokens in `/.well-known/acme-challenge/` before host/HTTPS redirects and supplies a narrowly scoped plain-text MIME mapping for extensionless tokens. There is no global wildcard MIME mapping. The provider must configure its renewal client to write into the actual challenge directory, preserve that directory across release switches, and keep port 80 reachable. The application pool remains read-only; only the trusted renewal/deployment identity needs write access. Test a temporary non-secret token at the HTTP URL on both hostnames, then remove it and run the provider's renewal dry run. A config artifact cannot confirm the hosting account's renewal method or scheduling. [Let's Encrypt HTTP-01](https://letsencrypt.org/docs/challenge-types/)

Direct IIS TLS is trusted only when IIS supplies `HTTPS=ON`. If a CDN/load balancer terminates HTTPS and reaches IIS over HTTP, the provider must set the non-HTTP server variable **`ORBIT_TRUSTED_HTTPS=1`** only for verified external HTTPS requests, and leave it empty/0 otherwise. Set this in trusted server-level configuration after validating the real connection peer and edge scheme; register the variable if required by the host. Alternatively, use verified TLS between proxy and origin. An absent marker is not trusted and HTTP-origin requests redirect, which can loop if the provider has not configured the trust boundary.

Do not implement this marker using an arbitrary client `X-Forwarded-Proto`/`Forwarded` header. A trusted proxy must sanitize forwarded headers and origin access must be restricted to verified proxy connections. The generated file neither sets the marker nor reads those client headers. Only the administrator can establish this trust. [Server variables and allowed changes](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/setting-http-request-headers-and-iis-server-variables)

## Release verification

Generate after the rendered build and public-file inspection with `node scripts/generate-iis-config.mjs`. Run `node scripts/generate-iis-config.mjs --check` to detect stale output. These local checks validate artifact consistency, not IIS runtime behavior. This workspace has not run the generated file on a configured IIS server.

Before switching the public release, have the provider inspect effective IIS settings and test a staging copy through its actual TLS/proxy path. A staging hostname requires an intentionally configured staging build origin; the production file redirects other hosts to the production origin.

| Request/check | Expected result |
| --- | --- |
| `/`, `/about`, `/products`, `/solutions`, one nested product/service page | 200, correct prerendered body, CSP and other shared headers, correct MIME |
| `/about.html?ref=check`, `/about/?ref=check` | 301 directly to the fixed HTTPS `/about?ref=check` |
| All 22 observed legacy paths | 301 to their mapped canonical destinations, without a redirect chain |
| HTTP and `www` versions | Fixed bare-host HTTPS origin, preserved path/query and no proxy loop |
| Missing route, missing `/assets/` file, `/404`, `/404.html` | 404 with this release's rendered error body, noindex, no-store |
| Existing JS/CSS/WebP/AVIF/PDF and a filename containing spaces | 200 with correct MIME; encoded filename survives host/scheme redirects |
| `/.env`, `/.git/config`, `/web.config`, `/src/main.jsx`, `/old.php/a`, `/old.php.jpg`, `/backup.sql.gz` | Rejected; no private file body or executable response |
| POST, PUT, DELETE, TRACE or a GET with a request body | Rejected by filtering; no write/execute handler |
| Unknown Host, untrusted forwarded-protocol headers, alternate origin access | Never reflected into a redirect destination or trusted as HTTPS |
| Browser interactions and fonts/Maps on desktop/mobile | Functional, with no unexpected CSP violations |

Test the rendered 404 body and original HTTP status together: a redirect or a 200 error page fails the release check. Inspect duplicate/missing headers and host/CDN cache behavior. Remove unwanted legacy material and purge caches, then recheck both hostnames and representative old pages. The observed unrelated content and possible account/CMS cause remain hosting-administrator work; see [legacy findings](SEO-MIGRATION.md).
