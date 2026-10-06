# GitHub Pages preparation

This repository is prepared for GitHub Pages; no repository setting, DNS record or live site has been changed. Publishing is a separate decision. Start with the [hosting guide](HOSTING.md) and select one public canonical domain before generating production files.

## Local builds

Use Node.js 22 and the committed package lock. These commands generate files locally and do not contact a deployment account:

```sh
npm ci
node scripts/build-target.mjs --target=github-pages --site-url=https://OWNER.github.io --base-path=/REPOSITORY/ --out-dir=.qa/pages-project --indexable=false
```

Replace `OWNER` and `REPOSITORY` with the actual account and repository. For an account site named `OWNER.github.io`, use `--base-path=/`. For a configured custom domain, use that HTTPS origin and `--base-path=/`:

```sh
node scripts/build-target.mjs --target=github-pages --site-url=https://YOUR-DOMAIN.example --base-path=/ --out-dir=.qa/pages-domain --indexable=false
```

For the final public production build, change `--indexable=false` to `--indexable=true`. Indexability is a publication setting; `noindex` is not password protection. Keep duplicate test copies unindexed and rebuild whenever the canonical domain or repository path changes.

The profile generates real `index.html` files for route directories, the custom `404.html` and `.nojekyll`. Its canonical URLs use trailing slashes. It prefixes navigation, image/script/style URLs and metadata for repository subpaths. Upload only the generated site's contents; source, `node_modules`, `.env`, SSR output and `.qa` evidence do not belong in the published site.

## Prepared workflows

[Production readiness checks](../.github/workflows/production-validate.yml) runs validation on pull requests or an explicit manual run. It builds both root-path and repository-path profiles, checks known production dependency advisories and retains artifacts. It does not publish.

[GitHub Pages manual build or publish](../.github/workflows/github-pages-manual.yml) runs only through **Actions → Run workflow** on the repository's default branch. Both `publish` and `indexable` default to false. With `publish=false`, it uploads an inspection artifact and skips deployment. With `publish=true`, a separate job publishes the checked artifact; enable `indexable` only when this is the intended public site.

Before using the manual Pages workflow, including its inspection-only mode, choose **Settings → Pages → Build and deployment → GitHub Actions** and configure the correct domain. The workflow reads the existing Pages origin/base path; it does not enable Pages, create DNS or use a personal access token. Local commands and the validation-only workflow need no Pages setup. Create/protect the `github-pages` environment, restrict permitted deployment branches, and require a reviewer if your GitHub plan supports that rule. Use repository branch protection for changes to code, the lockfile and workflows.

Build jobs use read-only permission and do not persist checkout credentials. The Pages build also has `pages: read` to read configured site metadata in private repositories; only the deployment job has Pages/OIDC write permission. Actions are pinned to full official release commit hashes verified on 7 October 2026. Recheck releases/advisories periodically and review future pin updates. See [GitHub workflow permissions and Pages deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [GitHub secure workflow guidance](https://docs.github.com/en/actions/reference/security/secure-use).

## Platform limits to accept before choosing Pages

GitHub Pages does not apply Vercel configuration, `.htaccess`, IIS rules or a `_headers` file. The Pages profile includes an early CSP meta element for supported browser restrictions. That cannot supply HTTP-only frame protection, HSTS, permissions policy, MIME protection or cache headers; `frame-ancestors` requires an HTTP header. A provider/edge that supports response headers is needed for that additional protection. [MDN CSP delivery](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)

Pages also cannot execute the project's legacy 301/308 redirects. Existing indexed legacy URLs need redirects at a controllable edge or a different host; a custom 404 page or client navigation does not transfer the same migration signal. Do not add a blanket SPA fallback that turns every missing page into HTTP 200. Verify direct refresh on a nested route and a genuine missing-page 404 after publishing. The prepared directory pages avoid dependence on an SPA rewrite.

For a custom domain, verify ownership, add it in Pages settings before changing DNS, and enable **Enforce HTTPS** once available. Do not assume a `CNAME` file configures an Actions-based site: GitHub documents that the custom-domain setting is authoritative. Avoid wildcard DNS and remove unused hosting DNS when retiring a site. [GitHub custom-domain setup and takeover protection](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

After an eventual publish, perform the shared production smoke checks in [the hosting guide](HOSTING.md). Security-header checks must report Pages' known platform limitations rather than pretending they passed.
