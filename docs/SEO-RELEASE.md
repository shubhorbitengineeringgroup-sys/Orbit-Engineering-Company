# Production release for orbitengineering.com

Current user instruction: prepare and verify locally; do not deploy. The commands below only create local artifacts for a future authorized release.

The release script prepares an uploadable ZIP and a matching `site/` directory from the existing production build. It performs no publishing, DNS changes or account verification.

```powershell
npm run build
npm run seo:release
```

Choose a [provider-specific build](HOSTING.md) instead of `npm run build` when using Pages, Vercel, AWS, Netlify or Cloudflare. Do not run the generic build after preparing a provider profile, as that would replace its URL layout and policy files. The final command prints absolute paths under `.qa/releases/orbit-seo-release-<timestamp>-<process>/`:

- `orbitengineering-production.zip`: extract its contents directly into the selected static website root. Files sit at the archive root, with no extra `site/` folder.
- `site/`: the same website files, ready to copy. Upload its **contents**, including the hidden `.htaccess` or `.nojekyll` when present.
- `asset-manifest.json`: per-file sizes, SHA-256 hashes, inclusion reasons, referenced assets and omitted-file inventory. Keep this manifest outside the public web root.
- `README.txt`: the release summary; keep it outside the public web root.

The packager preserves every generated HTML route, the full Vite `assets/` directory, the full generated `images/responsive/` directory with every `srcSet` width, required sitemap/robots/LLM discovery files, SEO manifest, root verification files and `.well-known/` files. Keeping all responsive variants prevents an interactive gallery from requesting an omitted image size after the initial page load. It follows production HTML, JavaScript, CSS, SVG and JSON asset references, including images used by interactive catalogue and gallery states. Dynamic asset directory prefixes retain their entire directory conservatively. An unresolved referenced production file causes packaging to fail. `npm run seo:release` first checks the existing build's SEO and Apache configuration, then packages it; it does not rebuild or publish.

Only unreferenced public files are omitted, including old visual QA screenshots and unused public media. Eager-glob original/cutout/optimized variants in Vite `assets/` are retained together for safe runtime compatibility. This reduces unnecessary deployment files; it does not recompress or alter the website's runtime assets, and does not itself change browser loading speed. Source files, `public/`, `dist/`, credentials and older releases are never modified or deleted.

The ZIP uses standard UTF-8 filenames and DEFLATE compression using Node's built-in APIs. It needs no new package installation or external ZIP utility; the existing build's Babel parser inspects JavaScript references. It rejects symbolic links, path escapes, missing referenced files, more than 65,535 files and payload/archive sizes above 2 GB. A new release directory is created on every run, so no previous release is replaced.

The packager also preserves the selected profile's `.nojekyll`, `_headers`, `_redirects` and optional `CNAME`, plus route directory files. Its output records target, base path and indexability. Administrator templates under `builds/<target>-hosting/` are kept outside the public ZIP. `RELEASE_BUILD_DIR` may select a previously checked build folder inside this workspace for packaging; the default remains `dist`. Verify that folder's SEO before packaging it.

## Hosting handoff

Use the selected host's routing configuration. If the build contains Apache `.htaccess`, confirm `AllowOverride` and the required Apache modules are enabled, and deploy that hidden file. On Vercel, keep the repository's `vercel.json` configuration; uploading static files alone does not install Vercel routing settings. Other hosts need equivalent clean URL handling, canonical/legacy redirects, caching and a real 404 response.

Before replacing the old site, preserve a host backup and apply the [migration/legacy cleanup guide](SEO-MIGRATION.md). The archive contains the clean new build; it cannot remove old CMS/database content or cached spam that is still being served by the old hosting environment. Avoid leaving the old CMS reachable through another hostname or URL after the switch.

After publication, verify every sitemap URL returns its own rendered HTML with HTTP 200, unknown URLs return HTTP 404, old URLs redirect to appropriate new pages, images/catalogue PDFs/scripts remain accessible, and bare HTTPS is the final canonical origin. Check `.htaccess` is applied as configuration and is not publicly downloadable. Then connect the owner's Google Search Console and Bing Webmaster Tools accounts and submit the sitemap using the [SEO rollout guide](SEO-ROLLOUT.md).

Verification tags and the optional IndexNow proof depend on production build variables. Set real owner-provided tokens before the final build; package again after rebuilding. The script includes a proof file listed by the SEO manifest, and fails if that file is missing.
