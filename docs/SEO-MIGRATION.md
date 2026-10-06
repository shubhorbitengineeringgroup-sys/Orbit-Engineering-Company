# Orbit Engineering legacy URL migration

Audited on **6 October 2026** using the main company's official domain and its navigation links. The owner selected **https://orbitengineering.com/** as the canonical production origin. **Orbit Engineering Solutions / orbitengineerings.com is the child company**, not a competitor and not the canonical origin for this parent site.

The old homepage links mostly use `www.orbitengineering.com`. Both hostnames were retrievable during this audit; a redirect from `www` to bare was not established. Configure one HTTPS origin and ensure old links resolve to the appropriate replacement. Navigation contains no evidence for the guessed `/profile.html` or `/contact.html` paths; do not invent them as necessary redirects.

## Recommended permanent redirects

Use HTTP 301 or 308 redirects to these paths on `https://orbitengineering.com`. Paths below were observed from official navigation. These are recommendations for the deployed server; writing documentation alone does not activate them.

| Old path | Replacement path | Evidence / relevance |
| --- | --- | --- |
| `/page/profile` | `/about` | [Legacy company profile](https://www.orbitengineering.com/page/profile) |
| `/page/Representations` | `/ecosystem` | [Legacy representations page](https://www.orbitengineering.com/page/Representations); keep this observed case |
| `/page/qualityandqccreditation` | `/about` | [Legacy quality page](https://www.orbitengineering.com/page/qualityandqccreditation); preserve the historical misspelling |
| `/page/enquiry` | `/contact` | [Legacy enquiry form](https://www.orbitengineering.com/page/enquiry) |
| `/page/contact` | `/contact` | [Legacy contact page](https://www.orbitengineering.com/page/contact) |
| `/web/page/products/pressure/pressure-transmitter` | `/products/pressure-transmitters` | [Pressure instruments](https://www.orbitengineering.com/web/page/products/pressure/pressure-transmitter) |
| `/web/page/products/level/level-switches` | `/products/level-switches` | [Level switches](https://www.orbitengineering.com/web/page/products/level/level-switches) |
| `/web/page/products/level/level-transmitters` | `/products/level-transmitters` | [Level transmitters](https://www.orbitengineering.com/web/page/products/level/level-transmitters) |
| `/web/page/products/liquid-analysis/online-analysis` | `/products/water-quality` | [Online liquid analysis](https://www.orbitengineering.com/web/page/products/liquid-analysis/online-analysis) includes chlorine, pH and related measurement; the new category is narrower, so preserve useful omitted product material if still offered |
| `/web/page/products/automation/rtu` | `/products/automation` | [RTU page](https://www.orbitengineering.com/web/page/products/automation/rtu); new category lists an RTU |
| `/web/page/products/automation/iot` | `/products/automation` | [IoT page](https://www.orbitengineering.com/web/page/products/automation/iot); new category lists telemetry gateways |
| `/web/page/products/automation/scada` | `/products/automation` | [SCADA page](https://www.orbitengineering.com/web/page/products/automation/scada); new category lists SCADA |
| `/web/page/products/automation/plc` | `/products/automation` | [PLC page](https://www.orbitengineering.com/web/page/products/automation/plc); new category lists PLC panels |
| `/web/page/products/flow/flow-meter` | `/products/flow-meters` | [Flow-meter catalogue](https://www.orbitengineering.com/web/page/products/flow/flow-meter) |
| `/web/page/solution/turnkey-automation` | `/solutions/scada-plc-automation-bhopal` | [Automation service](https://www.orbitengineering.com/web/page/solution/turnkey-automation) describes water controls, telemetry and instruments |
| `/web/page/products/automation/dcs` | `/products/automation` | Exact official navigation href verified; body retrieval failed. New category lists a DCS controller. Confirm the deployed old path and replacement before release. |
| `/web/page/solution/field-instrument-installation-and-commissioning-service` | `/solutions/installation-commissioning-madhya-pradesh` | Exact official navigation href and service label verified; body retrieval failed. Clear service-intent match; verify the deployed redirect. |

The exact `/web/page/products/flow/mechanical-meter` href is also in the old **Flow** navigation; its body was unavailable. The supplied Vercel configuration maps it to `/products/flow-meters` because the new catalogue includes water meters. This is a lower-confidence category-level match; confirm the old content during release validation and preserve a more specific equivalent if needed.

The new buying guide at `/guides/choosing-water-treatment-automation-partner-bhopal` has no observed legacy equivalent; no old URL should be redirected to it solely to create search traffic.

## Old content requiring a preservation decision

Do not send every removed URL to the homepage. When an old product/service remains offered, migrate useful content to a true equivalent. If it is permanently discontinued without an equivalent, return a real 404/410 with useful navigation. Google warns that irrelevant redirects can be treated as soft 404s. [Google URL migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

- [Prepaid metering system](https://www.orbitengineering.com/web/page/solution/prepaid-metering-system) describes **electricity** metering, tariffs and load limits. It is not equivalent to the new prepaid water meter entry.
- [Thermal camera station](https://www.orbitengineering.com/web/page/solution/thermal-camera-station) describes thermal/body-temperature monitoring. A general CCTV category does not preserve that purpose.
- [Other product](https://www.orbitengineering.com/web/page/product/other-product) includes thermal cameras and instrument communicators. Do not treat its generic URL as proof that it matches the new product directory.
- [Portable liquid analysis](https://www.orbitengineering.com/web/page/products/liquid-analysis/portables), [wireless instruments](https://www.orbitengineering.com/web/page/products/pressure/wireless), [pressure switches](https://www.orbitengineering.com/web/page/products/pressure/pressure-switches), [flow switches](https://www.orbitengineering.com/web/page/products/flow/flow-switch), [recorders](https://www.orbitengineering.com/web/page/products/monitoring/recorder) and [standalone HMI](https://www.orbitengineering.com/web/page/products/monitoring/hmi) need a closer catalogue match before automatic redirects.
- Temperature, humidity, air-velocity, moisture, dew-point and tracking-system pages have no confirmed equivalent in the current new categories. Assess whether these real product/service lines should remain rather than redirecting them to water treatment.

Use old sitemap exports, server logs, analytics and Search Console links to extend this initial map. Include real downloadable catalogues and image URLs receiving traffic. Test slash, case, protocol and hostname variants, avoid redirect chains, and keep useful permanent redirects for at least a year. Monitor old/new indexing and 404 traffic after publication. [Google migration checklist](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## Live unrelated-content findings

The retrieved [parent homepage](https://orbitengineering.com/) contains many unrelated follower/advertising links between its mission text and products. The [electronic temperature-controller URL](https://www.orbitengineering.com/web/page/products/temperature/controllers---electronic) contains gambling-related links and a homepage-like body rather than useful controller information. These are actual observed content problems. The audit does **not** establish how they were introduced or prove that the site was hacked.

A search of the current repository's `src`, `public` and `index.html` found none of the observed promotional strings. This supports deploying the clean source, but does not prove that the old CMS/database, account access or hosting environment is clean. No shortened promotional links were followed, no external destinations were audited, and no live-host cleanup was performed. **Legacy hosting/CMS remediation and security review remain external pending work.** The code changes do not establish that these checks are complete.

Before relaunch:

1. Preserve an old-site backup and relevant logs for investigation. Identify whether the unwanted links exist in templates, stored content, server files or cached responses.
2. Publish the clean build from a controlled source. Remove the unwanted material from every still-served legacy page and cache. If retiring the old CMS, ensure it is not reachable under another hostname or path that can keep serving the same content.
3. Have the hosting administrator review accounts, installed CMS components, updates and suspicious changes, and address the actual cause found. Do not assume a particular vulnerability without evidence.
4. Check Search Console **Security Issues** and **Manual Actions**. Follow the listed remediation/review process if there is a finding; absence of a report is not a substitute for checking the live content. [Google Security Issues report](https://support.google.com/webmasters/answer/9044101)
5. Recheck public HTML on both hostnames, representative legacy URLs and the new site before submitting the sitemap and requesting recrawl. Correct affected routes rather than blocking crawlers from seeing the cleaned pages.

## Contact reconciliation

The legacy [parent contact page](https://www.orbitengineering.com/page/contact) lists the B-32/A Bhopal location and **+91 7024128029**, matching the repository's primary mobile. It also lists landline **0755-4059085**, mobiles **8817770367 / 9893091450**, and **sales@orbitengineering.com / mktiwari@orbitengineering.com**. Its footer says **7024128028**, an internal discrepancy. Keep the current repository contacts unless the owner confirms replacements; changing the website's canonical domain does not authorize creating or asserting new email inboxes.

Use the owner-confirmed address everywhere: **Ground Floor, B-32/A Priyadarshini Colony, Sant Asharam Nagar Phase-1, Bagsewaniya, Bhopal, Madhya Pradesh 462043**. `Orbit Engineering Co.` is a real legacy site label; do not infer a legal entity registration or add `Inc.` merely from old copy.
