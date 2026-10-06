# Website security review — 6–7 October 2026

The local React site has been reviewed and hardened. These changes are prepared in source and the production build; **they have not been deployed to the live domain**. There is no guarantee against every attack. Hosting accounts, operating systems, legacy applications and availability require separate controls.

## Live findings requiring attention

Four read-only HEAD requests at 17:02 UTC checked HTTP/HTTPS on the bare and www hostnames. Both HTTPS endpoints returned 200 and reported `Microsoft-IIS/8.5`. Neither response included CSP, frame protection, nosniff, HSTS, referrer policy or permissions policy. Both HTTP endpoints redirected to their corresponding HTTPS hostname. The server header suggests IIS; it does not prove the underlying OS version or hosting topology. Evidence: `.qa/live-security-headers.json`.

TLS certificate validation succeeded on both hostnames. The certificate presented during this check expires **17 October 2026 at 23:59:59 GMT**. Confirm the provider's renewal is enabled and test the renewed certificate before that date; this check cannot see renewal scheduling.

The [live homepage](https://orbitengineering.com/) still contains unrelated promotional links. No such content was found in the reviewed local source. This is a concrete content-integrity concern, but does not establish how the links were introduced or prove compromise. Preserve relevant logs and an old-site backup, investigate templates/database/uploads/caches, review administrator access, and retire the old application before switching to a clean static release. Existing [migration findings](SEO-MIGRATION.md) contain the original observations. No linked promotional destinations were followed.

## Implemented changes

| Area | Change and practical effect |
| --- | --- |
| Browser policy | Shared enforced CSP permits the actual local scripts, Google Fonts, Google Maps and required Unsplash image. Arbitrary inline scripts, inline event handlers, eval, external scripts, workers, objects, base URL changes and native form submissions are blocked. React style attributes remain permitted for layout and animations. |
| Framing and isolation | `frame-ancestors 'none'`, X-Frame-Options DENY, nosniff, one-year HSTS without unverified subdomain/preload coverage, permissions restrictions, opener/resource isolation and referrer policy. |
| Deployment | Vercel headers and generated Apache/IIS rules use the same policy. Apache/IIS require the provider's staging/runtime checks; the local Node preview exercises the browser policy. |
| Private files | Build checks reject private files, source directories, executable scripts, backups, databases, keys and source maps. Generated hosting configuration is retained. Development Markdown asset notes are omitted from dist while the source notes are preserved. Release packaging rejects an unsafe build. |
| Old executables | Apache/IIS rules deny legacy scripts before the existing-file bypass, including PATH_INFO and double-extension requests such as `old.php.jpg`. This does not remove old files or clean a legacy database. |
| Preview | Rejects malformed encoding, traversal/dot segments, decoded separators/control characters and Windows stream paths. Uses path-relative and resolved-path containment, returns 400/403 instead of exposing files, and restricts requests to GET/HEAD. |
| Forms | Field length limits and map referrer privacy improved. Both forms already render escaped React text and encode outgoing WhatsApp/mailto content. They keep drafts only in component memory; no server submission, upload, database, authentication or browser persistence was found. |
| Tooling | Vite updated from 5.4.x to 6.4.4, with patched esbuild and source-map-js. Existing previews were restarted with Vite 6.4.4 on their same loopback ports. The development server is explicitly bound to 127.0.0.1. |

Static CSP is defense in depth. Same-origin scripts remain trusted; a stolen hosting account or malicious published build can defeat that boundary. Do not add untrusted uploads or arbitrary third-party scripts to this origin. Any future real enquiry API needs independent server validation, abuse controls and authorization appropriate to its behavior.

## Verification and remaining dependency findings

`npm run build` passed after the dependency update, including all 35 prerendered pages, matching JSON-LD/metadata and local assets. Browser evidence is saved in `.qa/security-results.json`:

- 32 raw HTTP attack/redirect cases, all 35 rendered routes, GET/HEAD/POST behavior and asset caching checked.
- 16 page/viewport combinations at 390 and 1440 pixels had no horizontal overflow, runtime errors or unexpected CSP violations.
- Injected inline script, event-handler script, script from a different local origin and unwanted form submission were rejected by the browser. No request for the injected external script reached the test server.
- Embedding the site in a separate-origin iframe was blocked. Chrome displayed its rejected-frame page.
- Malicious-looking form text stayed literal and encoded in the prepared URL. No WhatsApp/email message was sent by the tests.
- Story chapter controls, image decoding, image viewer and Escape focus restoration worked under the production policy. Google Inter fonts and the Google Maps embed loaded.

No credential candidates were found by the scoped source scan; this is not proof that all external accounts are secure. No exploitable frontend XSS was identified in the inspected reachable source. The application has no SQL database endpoint to assess for SQL injection.

`npm audit --omit=dev` reports **0 known production dependency vulnerabilities**. Full audit decreased from 10 to **7 development dependency entries** (5 high, 2 moderate), representing two root issues in Tailwind 3's build dependency tree. They are not shipped as a public server/API. They are still recorded and should be rechecked when patches become available:

- [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): no patched braces release available at review time; use trusted build patterns/source and do not run repository builds on arbitrary submitted source.
- [selector parser CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf): patched in a newer major; the advisory states ordinary build use on trusted local sources is unaffected. Forcing npm's suggested fix would migrate the site's styling to Tailwind 4 and needs separate visual validation.

Audit reports are `.qa/dependency-security-audit-before.json`, `.qa/dependency-security-audit-after.json` and `.qa/dependency-security-production-after.json`. Audit counts refer to known advisories at check time, not a guarantee of absence of vulnerabilities. Vite advisory fixes: [Windows deny bypass](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), [NTLM disclosure](https://github.com/advisories/GHSA-v6wh-96g9-6wx3), [dependency map traversal](https://github.com/advisories/GHSA-4w7w-66w2-5vf9).

Completion checks repeated the dependency audits with the same production 0 / development 7 result (`.qa/dependency-security-production-final.json`, `.qa/dependency-security-audit-final.json`). The final build and both configuration consistency checks passed. IIS XML/structural checks passed; an accidental private configuration fixture was rejected by the build guard. Nine supplementary HTTP checks passed against the completed preview, including denied `web.config`, .NET handlers and executable double extensions (`.qa/security-final-results.json`). The checked release includes both hosting artifacts and excludes source notes/private files. IIS/Apache runtime verification remains a provider task.

## Deployment requirements

Deploy a clean static release into a separate controlled web root. Keep source, `.env`, `node_modules`, dist-ssr, release manifests and the old application outside it. Never serve the Vite development server publicly. The IIS artifact is described in [IIS deployment](SECURITY-IIS-DEPLOYMENT.md); Apache requirements are in [Apache deployment](SEO-APACHE-DEPLOYMENT.md). Nginx needs equivalent provider configuration.

Before publishing, the hosting administrator must confirm supported server/OS versions and patches, HTTPS/certificate renewal, least-privilege deployment access, account MFA and recoverable backups. Investigate the unrelated live content and remove access to the retired CMS/application across all served hosts. Edge rate limits/DDoS protection are hosting controls; local CSP cannot provide them.

If the reported IIS 8.5 is actually running Windows Server 2012 R2, Microsoft lists **13 October 2026** as the end of its Extended Security Updates. Confirm the actual OS and ESU status with the provider and move to a supported patched platform if this applies. The response banner alone cannot establish the OS or support contract. [Microsoft servicing status](https://learn.microsoft.com/en-us/windows/release-health/status-windows-8.1-and-windows-server-2012-r2)

After deployment, check response headers on real routes, errors and assets; test rejection of private/executable paths, 404 pages, legacy redirects, fonts/maps, forms, mobile layouts and caching. IIS filtering commonly rejects private requests with a 404 substatus, while Apache/preview use 403. The live header snapshot above is a pre-deployment baseline. Apache and IIS are not installed in this workspace, so their runtime behavior remains to be validated on the selected host. No hosting account or deployment credentials have been supplied in this review.

Policy references: [OWASP HTTP headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [MDN script CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src), [Apache multiple-extension handlers](https://httpd.apache.org/docs/2.4/mod/mod_mime.html#multipleext).
