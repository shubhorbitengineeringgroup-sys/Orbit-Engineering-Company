# Apache deployment for Orbit Engineering

The production build includes `dist/.htaccess`, generated from `dist/seo-manifest.json` and `vercel.json`. It serves the same rendered routes and 22 migration redirects as the Vercel setup. The manifest supplies the actual configured HTTPS origin; the production default is **https://orbitengineering.com**. This file is a deployment artifact, not evidence of live deployment or cleanup.

The live hosting platform has not been confirmed. Use this configuration only when the provider confirms Apache 2.4+ (or explicitly confirms equivalent `.htaccess` support). Nginx does not read `.htaccess`. Existing PHP/CMS files, server-level rules, proxy behavior and caches must be inspected separately. Do not merge a legacy PHP front-controller rule or an `index.html` catch-all into this configuration.

## Build and server prerequisites

Run `npm run build` after confirming `VITE_SITE_URL=https://orbitengineering.com`. For an already rendered build, run `node scripts/generate-hosting-config.mjs`; `node scripts/generate-hosting-config.mjs --check` verifies that the generated file still matches the build and migration configuration.

Publish the **contents** of `dist` to the site's domain document root. Include hidden files: an upload using a `dist/*` shell glob may omit `.htaccess`. Keep the generated HTML, nested route HTML, `assets`, images, `robots.txt`, `sitemap.xml`, `llms.txt`, verification files and `.htaccess` together. Do not upload source code, `.env` files, `dist-ssr`, `node_modules` or the old CMS into the new static release. Keep a recoverable copy of the old site and server rules before replacing its public release.

The provider must enable `mod_rewrite`, `mod_headers`, `mod_mime` and `mod_dir`, and permit the relevant `FileInfo`, `Indexes` and `Options` overrides. A typical provider-managed directory policy is `AllowOverride FileInfo Indexes Options`; the host must confirm any tighter policy permits these exact directives. If overrides or modules are unavailable, install equivalent rules in the provider's virtual host configuration. Unsupported directives can produce HTTP 500, so verify a staging release first. [Apache override documentation](https://httpd.apache.org/docs/2.4/mod/core.html#allowoverride)

Provision a valid certificate for **both** `orbitengineering.com` and `www.orbitengineering.com` before redirects. A certificate failure happens before the browser can follow a redirect. A temporary preview should use the local static preview; the production `.htaccess` intentionally redirects alternate hosts to the configured production origin.

## HTTPS when a CDN or load balancer terminates TLS

For direct Apache TLS, the generated file uses Apache's `HTTPS=on`. If a trusted CDN or reverse proxy handles HTTPS and connects to Apache over HTTP, the provider must set the internal request environment variable **`ORBIT_TRUSTED_HTTPS=1`** only for verified external HTTPS requests. The generated rules also recognize the `REDIRECT_ORBIT_TRUSTED_HTTPS` variable created during internal redirects. Configure this **before** enabling the production file, or a proxy-origin HTTP connection can cause a redirect loop. [Apache rewrite variables](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html#rewritecond)

Do not trust arbitrary client `X-Forwarded-Proto` or `Forwarded` headers. Ask the provider to use its documented trusted-proxy configuration, sanitize/replace forwarded headers at the edge, and restrict origin access where supported. The default generated file does not grant HTTPS status based on those headers.

For a private reverse proxy on the **same machine**, the administrator can adapt this virtual-host example. It intentionally trusts only the connection peer at loopback; replace that trust boundary with the provider's actual verified proxy addresses when appropriate. It needs `mod_setenvif`, and the proxy must overwrite `X-Forwarded-Proto` with its actual connection scheme:

```apache
# Provider-managed virtual host configuration; not a universal CDN setting.
SetEnvIfExpr "(%{CONN_REMOTE_ADDR} -ipmatch '127.0.0.1/32' || %{CONN_REMOTE_ADDR} -ipmatch '::1/128') && req('X-Forwarded-Proto') == 'https'" ORBIT_TRUSTED_HTTPS=1
```

Use `CONN_REMOTE_ADDR` for the real connection peer if `mod_remoteip` changes the apparent visitor address. Do not substitute all private ranges or all internet addresses. Some providers already set `HTTPS=on` for trusted proxy requests; in that case, no extra marker is needed. Full TLS between the edge and Apache also avoids an HTTP-origin loop. [Apache expressions](https://httpd.apache.org/docs/2.4/expr.html), [SetEnvIfExpr](https://httpd.apache.org/docs/2.4/mod/mod_setenvif.html#setenvifexpr)

## Route, error and cache behavior

Legacy paths redirect directly to their canonical replacements using HTTP 308 and keep the query string. Known `/about.html`, `/about/` and similar rendered variants redirect to their clean URL. `THE_REQUEST` guards distinguish an explicit HTML request from an internal rewrite; `[END]` finishes internal processing so clean routes do not redirect back to themselves. `/products` and `/solutions` are mapped explicitly even though they also have nested HTML directories. [Apache rewrite flags](https://httpd.apache.org/docs/2.4/rewrite/flags.html)

Existing static files remain accessible. Unknown routes and `/404` return HTTP **404**, with the rendered noindex `404.html` body; there is no homepage fallback. `ErrorDocument` uses a local path, preserving the error status. Existing Vite assets under `/assets/` receive one-year immutable caching; HTML revalidates and error responses use `no-store`. The configuration sets content types, `nosniff` and the same referrer policy as `vercel.json`. [ErrorDocument behavior](https://httpd.apache.org/docs/2.4/mod/core.html#errordocument), [Apache response headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)

The generated file preserves any static files already present, so a release into a separate clean directory is safer than overlaying the old CMS. Retire old PHP routes, uploaded unwanted content and cached copies through the provider's controlled release process; this build cannot inspect or sanitize an inaccessible hosting account. See [migration findings](SEO-MIGRATION.md) for the observed unrelated live content and cleanup work.

The security refresh adds enforced CSP, frame protection, HSTS and the shared policy in `scripts/security-policy.mjs`. Private/source paths and legacy executable extensions (including PATH_INFO and double extensions) are denied before the file bypass. Development Markdown notes are removed from build output; private/executable artifacts fail the build. These rules restrict access rather than deleting or investigating existing CMS data. See [security review](SECURITY-REVIEW.md). Both fonts and Maps remain allowed; native form posts are disabled because enquiries deliberately open an encoded WhatsApp/email draft.

## Acceptance checks before search submissions

Run the host's syntax/configuration check, then make HTTP requests against the actual staging/server release. Apache is not installed in this development workspace; build-time generation and static checks do not establish Apache runtime compatibility.

| Request / check | Expected result |
| --- | --- |
| `https://orbitengineering.com/` | HTTP 200, rendered content and one canonical URL |
| `/products`, `/solutions`, `/solutions/scada-plc-automation-bhopal` | HTTP 200, route-specific rendered content, no slash or HTML redirect loop |
| `/about.html?ref=check`, `/about/?ref=check` | HTTP 308 directly to `https://orbitengineering.com/about?ref=check` |
| `/page/profile?ref=check` | HTTP 308 directly to `https://orbitengineering.com/about?ref=check` |
| HTTP and `www` versions of the homepage / known routes | HTTPS bare-host canonical destination; no loop through the CDN |
| `/definitely-missing-route`, `/404`, missing `/assets/` file | HTTP 404, noindex error body, no immutable cache header |
| An existing nested image or asset whose filename contains a space | HTTP 200, matching content type; encoded path survives host/scheme redirect |
| Existing hashed `/assets/` JS and CSS | HTTP 200, correct MIME, `public, max-age=31536000, immutable` |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, actual ownership proof files | HTTP 200, correct public content |
| Home and legacy pages after host/CDN cache purge | No unrelated promotional content; no old CMS responses |

For example, use `curl.exe -I` to inspect status, `Location`, MIME and cache headers, and `curl.exe -L --max-redirs 5` to detect loops. Also retrieve the HTML with JavaScript disabled. Check all 22 migration destinations and representative nested pages, not only the homepage. Submit the sitemap to the owner's verified Google Search Console and Bing Webmaster Tools properties only after the live checks pass. See the [SEO rollout checklist](SEO-ROLLOUT.md).
