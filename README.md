# Orbit Engineering website

React/Vite website for Orbit Engineering and its child company Orbit Engineering Solutions. The production build renders every public route to real HTML before hydrating the interactive interface.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The preview serves `dist` at `http://127.0.0.1:4173`, including clean URLs, permanent legacy redirects and real 404 responses. Deploy the complete `dist` directory. Vercel uses the supplied `vercel.json`; other hosts must serve each generated HTML page and return HTTP 404 for missing paths.

See [portable hosting preparation](docs/HOSTING.md) for GitHub Pages, Vercel, AWS, cPanel/Apache, IIS, Nginx, Netlify and Cloudflare. Choose the matching `build:*` profile before packaging; Pages supports repository prefixes, while Netlify/Cloudflare use directory URLs. Hosting examples are generated under ignored `builds/<target>-hosting/` and stay outside the public webroot. Nothing publishes automatically through these local commands.

Use `.env.example` for public canonical-domain and Google Search Console/Bing verification settings. Put local values in ignored `.env.local`; rebuild after changes. Never put private credentials in `VITE_*` variables.

`npm run build` generates page metadata, JSON-LD, `sitemap.xml`, `robots.txt`, an optional `llms.txt` discovery file and Apache/IIS hosting configurations, then checks rendered content, link reachability and local assets. Run `npm run seo:check` to repeat the selected profile's checks (including Apache/IIS configuration freshness for those builds). Browser checks require a running production preview and installed Chrome:

```sh
node scripts/qa-seo-browser.mjs
```

`SEO_PREVIEW_URL` and `CHROME_PATH` may override the browser check defaults. Reports and screenshots go to ignored `.qa/`.

See [SEO rollout and external account setup](docs/SEO-ROLLOUT.md) and [Bhopal competitor research](docs/SEO-COMPETITOR-RESEARCH.md). Optional IndexNow submission is explicit via `npm run seo:indexnow`, after configuring a stable public ownership key, rebuilding and deploying its proof file. A build never submits URLs automatically.

Edit business/contact facts in `src/config/siteConfig.js`, service guides in `src/data/seoContent.js`, products in `src/data/products.js`, and route metadata/schema in `src/config/seo.js`. Add only verifiable claims and keep schema consistent with visible content.

Responsive WebP variants are saved locally in `public/images/responsive` and mapped by `src/data/responsiveImages.js`. Builds need no image service or Python runtime. After replacing one of the source images, refresh variants with `python scripts/optimize-images.py` using Python 3 and Pillow with WebP support. Originals are preserved. `ResponsiveImage` renders a normal image with intrinsic dimensions and `srcset`; supply `sizes` when the rendered slot is known, and retain full resolution for tall cropped hero scenes.

For a future manual release, run `npm run seo:release` after building. It creates a checked ZIP and matching folder under ignored `.qa/releases`, preserving every Vite asset and omitting only proven unused public files. See [release packaging](docs/SEO-RELEASE.md) and [Apache prerequisites](docs/SEO-APACHE-DEPLOYMENT.md). These commands prepare local files; they never deploy or submit URLs.

See [security review and live findings](docs/SECURITY-REVIEW.md) before release. The build validates shared browser security headers and rejects private/executable files; developer asset notes remain in source and are omitted from the public build. [IIS deployment](docs/SECURITY-IIS-DEPLOYMENT.md) covers the generated `web.config`. Live hosting/CMS cleanup, certificate renewal and deployed configuration require the host administrator's verification.
