# Orbit Engineering SEO launch and growth guide

Reviewed: 6 October 2026. Owner-confirmed primary production URL: **https://orbitengineering.com**.

The goal is more qualified enquiries for **Orbit Engineering**, the primary brand, and its child company **Orbit Engineering Solutions**, through branded, water engineering, automation and local searches. Technical improvements make pages accessible and understandable; rankings also depend on evidence, demand, competition and the searcher's location. Google does not guarantee crawling, indexing or ranking, even for compliant sites. No implementation can guarantee first place for every competitor/client name or availability on every network. [Google: how Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)

**Hindi pointer:** SEO ke liye **Google Search Console** connect karein. Google Cloud Console alag product hai. Pehle correct business details, phir verification, sitemap aur regular monitoring.

## 1. Confirm the business facts before launch

The owner has selected `https://orbitengineering.com/` for the main Orbit Engineering website. Both bare and `www` hostnames currently expose the legacy parent website; configure a permanent redirect to the selected bare HTTPS origin. `orbitengineerings.com` belongs to the child company Orbit Engineering Solutions and is not the main canonical origin. Preserve legitimate child-company references and existing email addresses; a domain change does not create new email inboxes.

Use the owner-confirmed brand/address and the existing repository contact details below consistently in `src/config/siteConfig.js`, visible contact information and structured data:

- Primary brand: Orbit Engineering; child company: Orbit Engineering Solutions. The child company is not a competitor.
- Ground Floor, B-32/A Priyadarshini Colony, Sant Asharam Nagar Phase-1, Bagsewaniya, Bhopal, Madhya Pradesh 462043.
- Main phone: +91 70241 28029. Secondary: +91 9039075049.
- WhatsApp: +91 9039075048; email: info@orbitengineerings.com.
- Monday–Saturday, 10:00 AM–7:00 PM; Sunday closed.

**Update older listings:** the old [production contact page](https://orbitengineerings.com/contact/) states First Floor, Shalimar Enclave, 12/2, E-3, Arera Colony, Bhopal 462016. The owner has now confirmed the Ground Floor B-32/A address above; deploy it and correct older listings, map details and cached business citations. The old about page also mentions Char Imli, Arera Colony and Katara Hills offices; do not publish them as additional current branches without confirmation. Keep the map pin accurate and do not invent coordinates.

The legacy [parent contact page](https://www.orbitengineering.com/page/contact) supports the B-32/A Bhopal location and main mobile +91 7024128029. It also lists an old landline, other mobiles and parent-domain email addresses; its footer inconsistently prints 7024128028. Retain current repository phone/email details until the owner reconciles the old contact records. `Orbit Engineering Co.` is an observed legacy name; use it as historical/alternate brand context without inventing a legal-company suffix.

**Live content cleanup:** the current [parent homepage](https://orbitengineering.com/) contains unrelated follower/advertising links, and the [legacy electronic-controller URL](https://www.orbitengineering.com/web/page/products/temperature/controllers---electronic) also exposes gambling-related links. Those are observed content issues; their cause has not been established. No matching promotional strings were found in the current `src`, `public` or `index.html` scan. Publishing the clean repository must be accompanied by checking the old hosting/CMS, stored content and cache, so the unwanted material cannot continue to be served or reappear. Review Search Console Security Issues and Manual Actions, correct any actual findings, and request review only where the dashboard requires it. **External legacy-host cleanup and account/security review remain pending; this repository does not repair an inaccessible old CMS.** See [migration and cleanup evidence](SEO-MIGRATION.md).

Before promoting claims, confirm the founding date, ISO certificates and validity, project values/counts, beneficiary figures, staff numbers and customer reviews against records. The repository's figures and logos are first-party content, not proof. Publish real project photographs or label illustrations clearly. Distinguish a direct client, subcontract role, equipment integration and authorized reseller status. A link to a manufacturer's official website does not prove an Orbit partnership.

## 2. Build and deploy the generated site

The implementation provides separate HTML for clean page URLs, page-specific metadata/canonicals, structured data, a sitemap, robots rules and a `noindex` error page. Search crawlers and visitors with unavailable JavaScript can receive the main page content from the initial HTML.

Set production build variables in the hosting dashboard, then rebuild:

| Variable | Value / purpose |
| --- | --- |
| `VITE_SITE_URL` | `https://orbitengineering.com`; canonical and sitemap origin |
| `VITE_GOOGLE_SITE_VERIFICATION` | Actual HTML-tag verification token from Search Console, if using that method |
| `VITE_BING_SITE_VERIFICATION` | Actual `msvalidate.01` token from Bing, if using HTML-tag verification |
| `INDEXNOW_KEY` | Optional owner-controlled IndexNow key; see step 6 |

Do not paste an entire verification tag into a token variable. These values are read during the build; changing the hosting environment requires a new build. Leave unused verification variables unset. Never place account credentials or private API secrets in `VITE_*` variables.

Run `npm run build`; publish the complete `dist` directory. On Vercel, retain the supplied `vercel.json` clean URL and redirect rules. On other hosts, serve each generated route's HTML directly, keep assets/files accessible and configure a real HTTP 404 for unknown paths. A universal rewrite of every URL to `/index.html` creates incorrect page responses and soft 404s.

The legacy parent navigation uses `/page/profile`, `/page/contact` and numerous `/web/page/products/...` and `/web/page/solution/...` paths. Apply the evidence-based [migration map](SEO-MIGRATION.md), including the correct case and historic misspellings. The child-company site's `/services/` and `/projects/` paths are a separate domain's routes; their ownership does not authorize replacing its whole site. Existing compatibility aliases on the new site consolidate services/projects into `/solutions`. Old `#products`, `#solutions`, etc. are handled by the site's compatibility navigation; fragments cannot be redirected by the server. Consult Search Console and server logs for additional legacy URLs before removing them.

Before switching production traffic, verify:

- Every URL in `/sitemap.xml` returns HTTP 200 and the correct page HTML when opened directly or refreshed.
- View Source contains the meaningful heading, page content, canonical, unique title/description and JSON-LD before JavaScript runs.
- `/robots.txt`, `/sitemap.xml`, images, JavaScript and CSS are publicly reachable; there is no accidental production `noindex` header.
- An invented URL returns HTTP 404 and the error page; it must not return HTTP 200 with the homepage.
- Redirects reach one final canonical URL, without chains or loops; phone, email, WhatsApp, navigation and quote actions still work on mobile.
- Validate JSON-LD in [Schema Markup Validator](https://validator.schema.org/) and supported Google features in [Rich Results Test](https://search.google.com/test/rich-results). Organization/service markup can be useful without producing a Google rich result.

Protect previews with the hosting provider's access controls or preview-only `noindex`; keep production crawlable. Check the deployed host, not just the local build. CDN, firewall, geo/IP restrictions and bot challenges can still block a technically correct site. [Google: developer SEO checks](https://developers.google.com/search/docs/fundamentals/get-started-developers)

## 3. Connect Google Search Console and Bing

1. Open [Google Search Console](https://search.google.com/search-console). Add a **Domain property** for `orbitengineering.com` and install the exact DNS record Google provides. This covers protocols and subdomains; do not remove the verification record afterwards.
2. If DNS access is unavailable, use a URL-prefix property for `https://orbitengineering.com/`, choose HTML tag and set `VITE_GOOGLE_SITE_VERIFICATION` to its `content` value. Rebuild/deploy, check View Source, then verify. An HTML token cannot verify a Domain property. [Google ownership verification](https://support.google.com/webmasters/answer/9008080)
3. Submit `https://orbitengineering.com/sitemap.xml` in Sitemaps. Inspect the home, contact, solutions and representative service URLs; run the live test and request indexing after publication. Submission is discovery, not a ranking boost or indexing promise.
4. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/). Import the verified Search Console property or use Bing's DNS/XML/meta method. For HTML verification, set `VITE_BING_SITE_VERIFICATION` to the supplied token and redeploy. Submit the same sitemap; use URL Inspection and Site Scan. [Bing: add and verify](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b)

No account verification, DNS change or sitemap submission is completed merely by committing this repository. Complete these steps in the owner's accounts after deployment.

## 4. Strengthen local discovery

Claim/manage the existing Google Business Profile rather than creating a duplicate. Use the real-world company name, correct office or service area, accurate category, phone, hours, website and actual location photographs. Keep name/address/phone consistent on the website, Google, Bing Places and genuine business listings. Use the appropriate address visibility for a service-area business. Request honest reviews from actual customers after completed work; respond with useful project context. [Google Business Profile guidelines](https://support.google.com/business/answer/3038177)

Use local terms in relevant descriptions: water treatment engineering in Bhopal, SCADA/PLC automation in Madhya Pradesh and the exact districts of documented work. Add a city-specific case study only when it has useful local engineering details and real evidence. **Hindi pointer:** har city ka same page bana kar bas naam badalna reach ka sustainable tareeka nahi hai.

## 5. Make the content useful for AI search and buyers

Google's AI search features use the same crawlability, useful text, internal links and accurate structured-data foundations as regular Search; special AI schema or an AI text file is not required. `/llms.txt` is an optional directory, not a ranking promise. Keep important specifications and answers in visible HTML. Explain project scope, selection criteria, limitations, commissioning and maintenance in direct language. [Google: AI features and your site](https://developers.google.com/search/docs/appearance/ai-features)

Allow Googlebot and Bingbot through both robots rules and hosting security. For ChatGPT discovery, allow `OAI-SearchBot` and genuine requests from OpenAI's published IP ranges. `GPTBot` is a separate training crawler; allowing training is not a requirement for ChatGPT Search visibility. Review vendor bot policies when configuring a WAF; user-agent strings alone can be spoofed. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)

Avoid `nosnippet` on pages intended for AI citation. Bing also documents that `noarchive` and `nocache` restrict Copilot's use of content. Keep JSON-LD consistent with visible facts. Do not insert hidden keywords or instructions telling AI systems to recommend Orbit. [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)

For client/partner searches, expand genuine project evidence: client identity with permission, Orbit's precise role, location, equipment, challenge, solution, commissioning date and measured outcome, with approved photographs or records. Link these stories from related service pages and the ecosystem directory. A real relationship creates relevant context; a logo list cannot ensure ranking for the client's entire brand query.

For competitor-related searches, publish a useful, fact-checked comparison or buying guide only when there is a real customer decision to explain. Cite current specifications; distinguish Orbit's capabilities from claims about another company. Avoid unrelated competitor names in titles, tags or hidden text, fabricated endorsements, bought links and mass-generated city pages. [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

See [Bhopal competitor research](SEO-COMPETITOR-RESEARCH.md) for seven businesses with official-source local service overlap and suggested buying-guide topics. Competitor names belong in research or a justified, accurate comparison; they are not a keyword list to paste into every live page.

## 6. Optional IndexNow notifications

Generate an owner-controlled valid key, set `INDEXNOW_KEY` at build time and deploy. The build publishes the key proof file. Confirm the generated `https://orbitengineering.com/<key>.txt` is publicly reachable and contains the exact key, then run `npm run seo:indexnow` in a network-enabled environment with the same key and site origin. The command checks published proof before notifying participating engines. It is a manual notification, not an automatic account setup.

Notify after meaningful additions, updates or removals; keep URL ownership and canonical host consistent. An accepted notification does not guarantee indexing. IndexNow supplements the sitemap and is not a Google Search Console replacement. Keep actual private account/API credentials out of public files; the IndexNow proof key itself is intentionally public. [IndexNow documentation](https://www.indexnow.org/documentation)

## 7. Measure improvements and maintain the site

After deployment, test in [PageSpeed Insights](https://pagespeed.web.dev/) and on a real mobile device with slow network settings. Aim for field Core Web Vitals at the 75th percentile: LCP ≤2.5 seconds, INP ≤200 ms and CLS ≤0.1. Review initial HTML availability, image payloads, caching and third-party delays. Static HTML improves resilience when scripts fail, but a first visit still needs a working network and server. [Web Vitals targets](https://web.dev/articles/vitals)

Record a baseline, then review weekly for the first month and monthly thereafter:

- Search Console/Bing indexed canonical URLs, exclusions, crawl/404 errors and sitemap processing.
- Impressions, clicks and enquiries for Orbit Engineering / Orbit Engineering Solutions, local service terms and real project/client terms; compare country, device and page.
- AI/citation reporting where available in the verified dashboards, plus meaningful referred enquiries. [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
- Real customer outcomes: calls, qualified forms, WhatsApp enquiries, quotations and awarded projects. Add analytics to the owner's actual property when ready; the repository does not create analytics accounts.
- Broken assets/links, certificate expiry, office details, project status and outdated specifications. Regenerate the build and sitemap whenever page content changes; use truthful modification dates.

Use the first 30 days to establish indexing and correct business listings. Over the next 60–90 days, publish a small number of strong case studies and technical buying guides, improve pages gaining relevant impressions and obtain earned references from real industry relationships. Set targets from observed demand and enquiry quality; do not treat an arbitrary ranking promise as a launch acceptance test.
