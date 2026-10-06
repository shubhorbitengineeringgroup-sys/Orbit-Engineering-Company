# Portable hosting and production preparation

Prepared on 7 October 2026. Nothing has been published, provisioned or connected to a hosting account by this work. The same React site can be built for the providers below, with provider-specific routes and policy files. A local build cannot certify the future account, server or public edge configuration.

## Choose a profile

| Host | Build command | Public output and configuration | Detailed setup |
| --- | --- | --- | --- |
| GitHub Pages | `npm run build:pages` | Directory HTML, `.nojekyll`, custom `404.html`, meta CSP; repository prefix supported | [Pages](HOSTING-GITHUB-PAGES.md) |
| Vercel | `npm run build:vercel` | Flat prerendered HTML; repository-root `vercel.json` | [Vercel](HOSTING-VERCEL.md) |
| AWS S3 + CloudFront | `npm run build:aws` | Flat HTML; private S3/OAC, CloudFormation, edge routing and response policies | [AWS](HOSTING-AWS.md) |
| cPanel / Apache / compatible LiteSpeed | `npm run build:apache` | Flat HTML plus generated `.htaccess` | [Apache prerequisites](SEO-APACHE-DEPLOYMENT.md) |
| IIS / Windows hosting | `npm run build:iis` | Flat HTML plus generated `web.config` | [IIS prerequisites](SECURITY-IIS-DEPLOYMENT.md) |
| Nginx / Linux VPS | `npm run build:nginx` | Flat HTML; administrator Nginx templates outside webroot | [Nginx](HOSTING-NGINX.md) |
| Netlify | `npm run build:netlify` | Directory HTML plus `_headers` and `_redirects`; root `netlify.toml` | See below |
| Cloudflare Pages | `npm run build:cloudflare` | Directory HTML plus `_headers` and `_redirects` | See below |
| Other static host | `npm run build` | Flat HTML plus Apache/IIS files; additional edge templates | Match the server capabilities first |

These commands overwrite the generated `dist` and `dist-ssr` folders. Builds must run sequentially. Only `dist` is the public site. `builds/<target>-hosting/` contains administrator/edge templates and manifests; keep it outside the public webroot. Node.js 22 with `npm ci` and the lockfile is the prepared CI/provider environment. A Node 24 local build also passed.

## Select domain, path and indexing before building

Use one canonical HTTPS origin, on port 443, without a path/query/credentials. The checked-in default is `https://orbitengineering.com`; rebuild for a different domain. Public settings are documented in `.env.example`. Never place private secrets in `VITE_*`: their values can be included in browser JavaScript.

```sh
npm ci
node scripts/build-target.mjs --target=vercel --site-url=https://YOUR-DOMAIN.example --indexable=false --out-dir=.qa/vercel-release
node scripts/build-target.mjs --target=github-pages --site-url=https://OWNER.github.io --base-path=/REPOSITORY/ --indexable=false --out-dir=.qa/pages-release
```

Replace the example domain/account/repository before use. Root hosting and Pages custom domains use `/`. Only the Pages profile supports a repository prefix. It prefixes navigation, assets, metadata and sitemap URLs. Pages/Netlify/Cloudflare use trailing-slash canonical routes; other profiles use clean routes without a trailing slash.

Use `--indexable=false` for test copies. It generates noindex metadata, an empty sitemap and no IndexNow proof. Crawling stays allowed so search engines can see the noindex instruction. This is not access protection: use provider authentication/access controls for private previews. Vercel Preview/Development and Netlify non-production build contexts force noindex even if the flag is true. Set Cloudflare Preview `VITE_INDEXABLE=false` separately in its dashboard. For the intended public release, rebuild with `--indexable=true` after selecting the correct production domain and context.

The optional `--out-dir` must name a dedicated folder inside this workspace. A previous generated build is archived rather than silently replaced; unrelated existing folders are rejected. Input/output symlinks, public credentials, executable/source/backups and source maps fail the build. Source design notes stay in source and are omitted from publication.

## Netlify and Cloudflare Pages

Use the repository root, Node 22, the matching build command from the table and publish directory `dist`. Only upload/build the matching provider profile: the generic output does not include their `_headers`/`_redirects` files. Native directory routing agrees with the canonical URLs and avoids a Pretty URLs slash mismatch. Keep the top-level `404.html`: Cloudflare otherwise assumes SPA behavior when no custom 404 exists. Netlify has a non-forced `/* /404.html 404` final rule so real files win and unknown routes keep an error status. Never replace it with `/* /index.html 200`.

The prepared `netlify.toml` defaults indexing to false. Set `VITE_SITE_URL` to the chosen production origin, enable `VITE_INDEXABLE=true` only for the production context when ready, and retain false for branch/deploy previews. Netlify's build context is also checked by the build script. Cloudflare uses separate Production/Preview environment values. Connecting either provider to Git may create deployments; do that only when you intend to publish. Keep automated branch deployments disabled/disconnected until then.

The generated rules provide the shared security headers and 22 legacy permanent redirects. Set the canonical primary domain and its alternate-host redirect in the provider dashboard; policy files do not create DNS or ownership. Disable optional automatic script injection/analytics until its origins are reviewed against CSP.

Header cache patterns are disjoint because both providers can combine matching header values. Pages, mutable imagery and assets revalidate in the browser; the provider can still cache assets at its edge. The conservative asset policy also avoids a year-long cache for a missing filename. The `/404.html` header rule does not prove that an arbitrary missing request receives an HTTP noindex/no-store header: its HTML has noindex, and its actual status and headers must be checked at the deployed edge. Redirect and generated error responses can have provider-controlled headers. Functions or proxies need their own response policies if added later.

Primary references: [Netlify headers](https://docs.netlify.com/manage/routing/headers/), [Netlify routing](https://docs.netlify.com/manage/routing/overview/), [Cloudflare headers](https://developers.cloudflare.com/pages/configuration/headers/), [Cloudflare serving and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Important Pages limits

GitHub Pages cannot apply the full HTTP security-header or server redirect configurations supplied for other hosts. Its profile uses supported meta CSP restrictions and directory pages. The 22 legacy aliases are noindex HTML refresh pages, not HTTP 301/308 redirects. If preserving legacy migration redirects or full frame/header protection is required, use an edge with those capabilities or another host. See the [Pages guide](HOSTING-GITHUB-PAGES.md) for exact limits, custom-domain ownership and HTTPS setup.

## Prepare an upload without publishing

```sh
npm run seo:check
npm run seo:release
```

Run after the chosen profile build. The release command writes a ZIP, a matching `site/` folder, file SHA-256 manifest and instructions under ignored `.qa/releases/`. Upload only the ZIP contents or `site/` contents. Include `.htaccess`/`.nojekyll` when present. Keep the release manifest/README, source, SSR output, hosting infrastructure examples and secrets outside the webroot. Vercel reads its root configuration from the source repository; when changing domains, review/copy the generated `builds/vercel-hosting/vercel.json` before a future deployment.

For cPanel, upload into a fresh document root and include hidden `.htaccess`; confirm Apache/LiteSpeed rewrite, header and error-document support with the provider. IIS needs the documented rewrite module and delegated configuration. Nginx needs real paths/certificates substituted and a successful `nginx -t`. AWS needs the selected account/region/domain/certificate and actual CloudFormation validation before a future stack creation. Those server/cloud runtimes are unavailable locally and have not been provisioned or validated against an account.

The app is static. Enquiry buttons create WhatsApp/email drafts; there is no authenticated API, database, upload endpoint or server-side contact delivery service. Adding those later needs separate validation, authentication, rate limiting and secret management. The two original PDF brochures were not supplied; the UI omits their missing links and offers brochure requests instead.

## Future release checks

1. Review the lockfile, source and generated provider settings. Enable MFA, limit deployment/DNS permissions, protect the production branch/environment, and keep the web worker read-only. Provider/OS patching, WAF/abuse controls, logging and backups remain administrator responsibilities.
2. Use HTTPS, verify domain ownership and scheduled certificate renewal, choose one canonical hostname and redirect its alternate. Remove retired DNS targets when leaving a provider. Keep preview hosts private or noindex.
3. Deploy a clean release. Do not overlay the new static site on old PHP/CMS files. Use provider atomic releases where available; for S3/manual uploads publish assets before HTML, keep previous asset versions for active visitors, and retain an external rollback copy.
4. Check the actual site before announcing it:

```sh
npm run hosting:check -- --url=https://YOUR-DOMAIN.example --manifest=dist/seo-manifest.json
```

This read-only command checks all 35 expected routes, canonical metadata, indexing, policy headers where supported, robots/sitemap reachability and missing-page/asset HTTP 404s. Use the manifest from the exact deployed build; Pages prefixes are included automatically. It exits nonzero on failures. It does not authenticate, submit URLs or change hosting. Provider-controlled error headers may require a specific edge fix if the check fails.

Also verify legacy 301/308 targets and preserved queries, HTTP-to-HTTPS and alternate-host redirects, direct nested refresh, correct JS/CSS MIME types, assets, fonts/maps, mobile navigation/modals, enquiry drafts and console CSP errors. Confirm expected private-file/method restrictions where the provider supports them. Check robots/sitemap contents and search ownership; submit URLs only after the intended public release. [SEO migration](SEO-MIGRATION.md) covers existing indexed URLs.

The previous passive live-host review found missing security headers, suspicious unrelated content and a certificate due to expire on 17 October 2026. Those live findings are recorded in [the security review](SECURITY-REVIEW.md); local preparation has not repaired the current host. Investigate and clean that environment before reusing it.

## Local evidence and CI

Root and `/orbit-test/` Pages builds passed SEO/public-file checks. Browser QA passed 70 direct routes and 32 mobile/desktop representative layouts, hydrated navigation/back/forward/refresh, images and dialogs, with no unexpected runtime/hydration/CSP/resource errors. Missing PDF checks are recorded as unavailable. AWS routing/template fixtures passed 223 checks, including encoded-space filenames, private-path rejection and a safe fallback for missing-asset caching. Native IIS/Nginx/CloudFormation and provider-managed runtime behavior still require deployment-time verification.

The validation workflow checks root, Pages, Netlify and Cloudflare builds plus AWS routing fixtures, with no publishing step. Both workflow files passed actionlint. The Pages workflow is manual only and defaults both publish/indexability to false; deployment permissions are isolated in its publish job and its named environment should be protected by the repository owner. No build submits IndexNow or changes an external account. See [Pages workflow details](HOSTING-GITHUB-PAGES.md).
