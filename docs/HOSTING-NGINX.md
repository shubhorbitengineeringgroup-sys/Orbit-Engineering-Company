# Nginx hosting preparation

This adapter prepares a static site for a Linux VM, VPS or container running Nginx. It requires a root build (`basePath=/`) and generates exact routes from the build's SEO manifest. Both clean URLs and directory URLs are supported. It does not deploy, provision a server, request certificates or change DNS.

The generated `nginx-site.conf.example` and `nginx-security-headers.conf` belong in an administrator-controlled configuration directory outside the public webroot. The root hosting generator calls `generateNginxHosting({ manifest, redirects, outputDirectory })` after prerendering. Rebuild these files whenever the origin, URL style or routes change.

## Before enabling the example

1. Use a supported Nginx package and install its MIME definitions. The configuration needs SSL, rewrite and headers modules and support for TLS 1.2/1.3.
2. Copy only the verified public release files to a new document root. Keep source, credentials, hosting examples and old PHP/CMS files outside that directory. Give the worker read access; the web worker should not be able to write the site's files or configuration.
3. Replace every `/REPLACE_*` marker with a real absolute path: public release root, administrator configuration directory, MIME file, TLS full chain and private key. Keep the key outside the document root with suitable owner-only permissions.
4. Obtain a certificate for the exact generated `server_name` using the hosting provider or a maintained ACME client. HTTP serves only existing token filenames under `/.well-known/acme-challenge/` before its fixed HTTPS redirect. Ensure the renewal client's token webroot matches the site's document root and verify automatic renewal separately. DNS challenges also work.
5. Put the example in the `http {}` context, normally through `sites-available`/`sites-enabled` or a distribution-specific include. Review conflicting default/legacy server blocks; remove PHP, FastCGI and old CMS routes from this static site's block. Configure unmatched hostnames in a separate provider-managed default server. Any alternate hostname needs DNS, a matching certificate and its own fixed canonical redirect block.
6. Run `nginx -t` against the complete installed configuration before a reload. The generated template has not been run against your Nginx installation. Do not reload if the syntax, certificate, file access or include checks fail.
7. Set DNS only when the server and certificate are ready, then perform the checks below. Keep the previous release available outside the document root for rollback.

This example terminates TLS directly at Nginx. For a CDN or load balancer, the provider must adapt the listener and trust boundary explicitly; enabling arbitrary `X-Forwarded-Proto` trust can let clients influence redirects or create loops. Use the provider's fixed canonical origin and verified upstream configuration.

## Behavior included

Known page URLs read their exact prerendered file. Alternate `.html`/trailing slash URLs and legacy routes return permanent 308 redirects to a fixed HTTPS origin while retaining query strings. Missing pages and assets return the prerendered error document with a true 404 status, `noindex, follow` and `no-store`. There is no home-page or SPA fallback.

The shared private-file policy denies dotfiles, source directories, secrets, backups and executable extensions, including double extensions and PATH_INFO. Only GET and HEAD are accepted. Public assets are served as static files; no interpreter or upstream application is configured. Directory listing is disabled. Hashed JavaScript/CSS files receive an immutable cache policy; pages and other public assets revalidate.

Security headers come from `scripts/security-policy.mjs`. Nginx normally stops inheriting the parent's `add_header` directives when a location defines its own headers, so every location adding a cache or robots header repeats the security-header include. Retain that include when editing the example. See the official [headers module](https://nginx.org/en/docs/http/ngx_http_headers_module.html) for inheritance and `always` behavior.

## Verify after a future deployment

Use the actual selected origin and URL style:

```sh
curl -I https://YOUR_HOST/
curl -I https://YOUR_HOST/about
curl -I 'http://YOUR_HOST/about?source=hosting-check'
curl -I https://YOUR_HOST/does-not-exist
curl -I https://YOUR_HOST/assets/does-not-exist.js
curl -I https://YOUR_HOST/.env
curl -I https://YOUR_HOST/old.php/extra
curl -I https://YOUR_HOST/image.php.jpg
curl -I -X POST https://YOUR_HOST/contact
```

Check expected 200/308/404/403/405 statuses, redirect targets and retained queries. A directory build canonicalizes `/about` to `/about/`. Verify the 404 response includes the security headers plus robots/cache headers; missing JavaScript must not return HTML with status 200. Open the site in a browser and verify fonts, imagery, navigation, modal dialogs, maps, enquiry drafts, mobile layouts and CSP console output. Confirm the certificate hostname, expiry and scheduled renewal; confirm TLS and browser response headers at the public edge when a CDN is involved.

These files prepare application-level hosting behavior. Server patching, SSH/admin access, MFA, backups, availability and DNS/TLS operation still depend on the chosen provider and account configuration.

Primary references: Nginx [location and error handling](https://nginx.org/en/docs/http/ngx_http_core_module.html), [rewrite/return directives](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html), and [TLS module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html).
