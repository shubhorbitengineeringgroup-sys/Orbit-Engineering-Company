# Vercel preparation

The source and hosting profile are prepared locally; no Vercel project, Git integration, domain or deployment has been created. Importing a repository and clicking Deploy are future publishing actions. Use [the hosting guide](HOSTING.md) to choose the canonical production origin and complete the common production checks.

## Build locally without publishing

Use Node.js 22 and the committed lockfile:

```sh
npm ci
node scripts/build-target.mjs --target=vercel --site-url=https://YOUR-DOMAIN.example --out-dir=.qa/vercel-release --indexable=false
```

Use the actual HTTPS production origin when ready. Omit `--base-path` or set it to `/`; this profile serves the site at the domain root. Set `--indexable=true` for the final intended public release. Rebuild after a domain change so canonical URLs, JSON-LD, robots and the sitemap agree.

## Settings for a future Vercel project

Keep the project root at this repository's root so Vercel can read the root `vercel.json`. Configure these settings before a deliberate deployment:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Node.js | 22.x |
| Install command | `npm ci` |
| Build command | `npm run build:vercel` |
| Output directory | `dist` |
| Production `VITE_SITE_URL` | The selected HTTPS production origin, with no path, query or credentials |
| Production `VITE_INDEXABLE` | `true` only when the public release is ready |
| Preview/Development `VITE_INDEXABLE` | `false` |
| Preview `VITE_SITE_URL` | Keep the selected production origin for canonical metadata |

The target build recognizes Vercel Preview/Development environments and forces noindex metadata. Set the preview value explicitly too, so a local imitation of a preview has the same result. `VITE_` values are public browser configuration; never put account tokens, private keys, passwords or backend secrets in them. Optional Google/Bing ownership tokens are public proof strings, not private credentials.

The root `vercel.json` explicitly sets the framework, install/build commands and output directory. Keep project settings consistent with it; see [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build) and [Vite support](https://vercel.com/docs/frameworks/frontend/vite).

## Routing, headers and publication control

The root `vercel.json` supplies clean URLs, slash normalization, legacy redirects and browser security headers. Every real route has its own prerendered HTML. Preserve true 404 responses: do not add a catch-all rewrite to `/index.html`, which would turn nonexistent pages into successful pages and create SEO problems. When changing the canonical domain, generate the production profile and copy `builds/vercel-hosting/vercel.json` to the repository root before connecting/deploying it. Review the www/bare-host redirect and select the same primary domain in Vercel. The generated redirect does not create DNS or verify domain ownership. A preview artifact includes global noindex headers; regenerate with `--indexable=true` before using its configuration for an intended public production release.

The repository and generated Vercel configuration set `git.deploymentEnabled=false`, so commits do not request automatic Git deployments while hosting is deferred. Remove or intentionally change that setting only when ready to enable them. This does not disable a separately invoked manual CLI/deploy hook. Until ready to publish, keep any project integration disconnected as well. A GitHub validation workflow does not deploy to Vercel. [Vercel Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration)

Use Vercel Deployment Protection for private previews when available on the selected plan. A noindex response only guides cooperative crawlers; it does not stop visitors. Vercel normally adds an HTTP noindex header to Preview URLs, but documents an exception for custom domains on non-production branches. Check the actual header and HTML metadata on every preview hostname. [Vercel preview indexing behavior](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)

The strict CSP permits the site's required fonts, maps and images. Keep the optional Vercel Toolbar disabled unless its required origins are separately reviewed and allowed; an injected toolbar/analytics script may otherwise be blocked. Do not relax CSP with a wildcard or `unsafe-eval` to silence console errors. Enabling a new third-party service requires an intentional policy update and browser verification.

## Eventual release verification

Check homepage and nested routes, actual HTTP 404s, legacy redirects, canonical/OG/JSON-LD domain, sitemap, robots, mobile images, forms, maps and font loading. Inspect CSP and other security headers on real routes, errors and assets. HTML and assets revalidate in the browser; Vercel's edge can still cache static content. The conservative asset rule avoids forcing a year-long browser cache onto a missing asset response. Keep the preceding successful release available for rollback and perform a clean deploy so retired CMS files are unreachable.

MFA, project membership, domain/DNS access, billing limits, certificate renewal and edge abuse protection remain hosting-account responsibilities. [The shared security review](SECURITY-REVIEW.md) records the local audit and remaining live-hosting work. No prepared configuration is a guarantee that a future account or deployment is secure.
