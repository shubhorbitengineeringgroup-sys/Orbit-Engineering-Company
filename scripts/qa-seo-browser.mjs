import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

// Run after npm run build and the production preview is listening.
// SEO_PREVIEW_URL and CHROME_PATH may override the local defaults.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.qa');
const preview = new URL(process.env.SEO_PREVIEW_URL || 'http://127.0.0.1:4173');
const timeout = 12000;
const report = { startedAt: new Date().toISOString(), preview: preview.origin, checks: [], routes: [], console: [], pageErrors: [], requestFailures: [], screenshots: [], blockedThirdParty: [], intentionallyBlockedScripts: [] };
await mkdir(output, { recursive: true });

let browser;
let browserProfile;
let phase = 'setup';
const blockedThirdParty = new Set();
const intentionallyBlockedScripts = new Set();
const expected = new Map();

async function check(name, action) {
  phase = name;
  try {
    const result = await action();
    report.checks.push({ name, status: 'passed', ...(result ? { result } : {}) });
    console.log(`PASS ${name}`);
    return true;
  } catch (error) {
    report.checks.push({ name, status: 'failed', error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
    return false;
  }
}

async function makePage({ javaScript = true, blockScripts = false, mobile = false } = {}) {
  const page = await browser.newPage();
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);
  await page.setViewport({ width: mobile ? 390 : 1440, height: mobile ? 844 : 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setJavaScriptEnabled(javaScript);
  await page.setRequestInterception(true);
  page.on('request', request => {
    let url;
    try { url = new URL(request.url()); } catch { return void request.continue(); }
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== preview.origin) {
      blockedThirdParty.add(url.origin);
      return void request.abort('blockedbyclient');
    }
    if (blockScripts && request.resourceType() === 'script') {
      intentionallyBlockedScripts.add(url.pathname);
      return void request.abort('failed');
    }
    return void request.continue();
  });
  page.on('console', message => {
    if (!['error', 'warn'].includes(message.type())) return;
    const text = message.text();
    // Controlled third-party/script aborts emit Chrome resource diagnostics.
    const resourceDiagnostic = /^Failed to load resource: net::ERR_(BLOCKED_BY_CLIENT|FAILED|ABORTED)/.test(text);
    if (!resourceDiagnostic) report.console.push({ phase, type: message.type(), text });
  });
  page.on('pageerror', error => report.pageErrors.push({ phase, text: error.message }));
  page.on('requestfailed', request => {
    const url = new URL(request.url());
    if (url.origin !== preview.origin || (blockScripts && request.resourceType() === 'script')) return;
    const error = request.failure()?.errorText || 'Unknown request failure';
    // Images still in flight may be cancelled when the next route is visited.
    if (error === 'net::ERR_ABORTED' && ['image', 'font', 'other'].includes(request.resourceType())) return;
    report.requestFailures.push({ phase, url: url.pathname, type: request.resourceType(), error });
  });
  if (javaScript && !blockScripts) await page.evaluateOnNewDocument(() => {
    window.__seoQaHeadChanges = 0;
    new MutationObserver(records => {
      if (records.some(record => record.target === document.head && [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1 && node.hasAttribute('data-seo')))) window.__seoQaHeadChanges += 1;
    }).observe(document, { subtree: true, childList: true });
  });
  return page;
}

async function settleFrame(page) {
  // Disabled document JavaScript also prevents asynchronous polling callbacks.
  // A browser screenshot flushes a real paint without executing application JS.
  if (!page.isJavaScriptEnabled()) return void await page.screenshot({ type: 'png' });
  // Wait for two paints, not an arbitrary sleep or third-party network idle.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function waitForHeading(page) {
  await page.waitForFunction(() => {
    const heading = document.querySelector('main h1');
    if (!heading || !heading.getBoundingClientRect().width || !heading.getBoundingClientRect().height) return false;
    for (let node = heading; node instanceof Element; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    }
    return true;
  }, { polling: 'raf' });
}

async function readMetadata(page) {
  return page.evaluate(() => {
    const normal = value => value.replace(/\s+/g, ' ').trim();
    const h1s = [...document.querySelectorAll('main h1')];
    const heading = h1s[0];
    const visible = element => {
      if (!element || !element.getBoundingClientRect().width || !element.getBoundingClientRect().height) return false;
      for (let node = element; node instanceof Element; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    return {
      title: document.title,
      titleCount: document.head.querySelectorAll('title').length,
      canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(node => node.href),
      h1s: h1s.map(node => normal(node.textContent)),
      h1Visible: visible(heading),
      mainTextLength: normal(document.querySelector('main')?.innerText || '').length,
      path: location.pathname,
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    };
  });
}

function assertMetadata(actual, route) {
  const reference = expected.get(route.path);
  assert.equal(actual.titleCount, 1, 'Exactly one title must exist');
  assert.equal(actual.title, route.title, 'Title must equal the build manifest');
  assert.deepEqual(actual.canonicals, [route.url], 'Canonical must equal the build manifest');
  assert.deepEqual(actual.h1s, reference.h1s, 'H1 must equal the original prerendered HTML');
  assert.equal(actual.h1s.length, 1, 'Exactly one main H1 must exist');
  assert.equal(actual.h1Visible, true, 'Main heading must be visibly rendered');
  assert.ok(actual.mainTextLength > 200, 'Main content must remain readable');
  assert.equal(actual.path, route.path, 'The clean route must remain in the address bar');
}

async function visit(page, route, { hydration = true } = {}) {
  const response = await page.goto(new URL(route.path, preview).href, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, `Route ${route.path} must return HTTP 200`);
  if (hydration) await page.waitForFunction(() => window.__seoQaHeadChanges > 0);
  await settleFrame(page);
  if (page.isJavaScriptEnabled()) await waitForHeading(page);
  const actual = await readMetadata(page);
  assertMetadata(actual, route);
  return actual;
}

async function waitForRoute(page, route) {
  await page.waitForFunction(reference => location.pathname === reference.path && document.title === reference.title && document.querySelector('link[rel="canonical"]')?.href === reference.url, {}, route);
  await settleFrame(page);
  await waitForHeading(page);
  assertMetadata(await readMetadata(page), route);
}

async function screenshot(page, filename) {
  // Only above-the-fold images are needed for deterministic viewport screenshots.
  await page.waitForFunction(() => [...document.images].filter(image => {
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && image.currentSrc && new URL(image.currentSrc).origin === location.origin;
  }).every(image => image.complete));
  await page.screenshot({ path: path.join(output, filename) });
  report.screenshots.push(`.qa/${filename}`);
}

try {
  const manifest = JSON.parse(await readFile(path.join(root, 'dist', 'seo-manifest.json'), 'utf8'));
  assert.ok(Array.isArray(manifest.pages) && manifest.pages.length, 'Build manifest must contain routes');
  const routes = manifest.pages;
  const routeByPath = new Map(routes.map(route => [route.path, route]));
  const home = routeByPath.get('/');
  const service = routes.find(route => route.type === 'service');
  const category = routes.find(route => route.type === 'category');
  const guide = routes.find(route => route.type === 'guide' || /^\/(guides|resources|insights)\//.test(route.path));
  assert.ok(home && service && category, 'Home, service and category routes must be present');
  report.routeCount = routes.length;
  report.guideRoute = guide?.path || null;

  phase = 'Preview reachability';
  const previewResponse = await fetch(new URL('/', preview), { method: 'HEAD', signal: AbortSignal.timeout(5000), redirect: 'manual' });
  assert.equal(previewResponse.status, 200, 'Start the production preview before browser QA');

  browserProfile = await mkdtemp(path.join(output, 'chrome-seo-'));
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', userDataDir: browserProfile, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await makePage();
  for (const route of routes) {
    const relative = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
    const raw = await readFile(path.join(root, 'dist', relative), 'utf8');
    const reference = await page.evaluate(html => {
      const document = new DOMParser().parseFromString(html, 'text/html');
      return { title: document.title, canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(node => node.getAttribute('href')), h1s: [...document.querySelectorAll('main h1')].map(node => node.textContent.replace(/\s+/g, ' ').trim()) };
    }, raw);
    assert.equal(reference.title, route.title, `Raw title mismatch for ${route.path}`);
    assert.deepEqual(reference.canonicals, [route.url], `Raw canonical mismatch for ${route.path}`);
    assert.equal(reference.h1s.length, 1, `Raw H1 count for ${route.path}`);
    expected.set(route.path, reference);
  }

  await check('Missing route HTTP 404 and noindex HTML', async () => {
    const response = await fetch(new URL('/qa-intentional-missing-page', preview), { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 404);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/i);
    assert.match(response.headers.get('content-type') || '', /text\/html/i);
    const missing = await page.evaluate(html => {
      const document = new DOMParser().parseFromString(html, 'text/html');
      return { robots: document.querySelector('meta[name="robots"]')?.content, canonicalCount: document.querySelectorAll('link[rel="canonical"]').length, h1: document.querySelector('main h1')?.textContent };
    }, await response.text());
    assert.match(missing.robots || '', /noindex/i);
    assert.equal(missing.canonicalCount, 0);
    assert.equal(missing.h1, 'Page not found');
  });

  await check('robots.txt and sitemap.xml HTTP content', async () => {
    const robots = await fetch(new URL('/robots.txt', preview), { signal: AbortSignal.timeout(5000) });
    assert.equal(robots.status, 200);
    assert.match(robots.headers.get('content-type') || '', /text\/plain/i);
    const robotsText = await robots.text();
    assert.match(robotsText, /User-agent:\s*\*/i);
    assert.match(robotsText, /Allow:\s*\//i);
    assert.ok(robotsText.includes(`Sitemap: ${manifest.siteOrigin}/sitemap.xml`));
    const sitemap = await fetch(new URL('/sitemap.xml', preview), { signal: AbortSignal.timeout(5000) });
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.headers.get('content-type') || '', /(?:application|text)\/xml/i);
    const sitemapText = await sitemap.text();
    const locations = await page.evaluate(xml => [...new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('loc')].map(node => node.textContent), sitemapText);
    assert.deepEqual(locations.sort(), routes.map(route => route.url).sort());
    const discovery = await fetch(new URL('/llms.txt', preview), { signal: AbortSignal.timeout(5000) });
    assert.equal(discovery.status, 200);
    const discoveryText = await discovery.text();
    assert.ok(discoveryText.includes(manifest.siteOrigin));
    if (guide) assert.ok(discoveryText.includes(guide.path), 'Discovery file should link the published guide');
    return { sitemapRoutes: locations.length };
  });

  const hosting = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
  const literalRedirects = hosting.redirects.filter(rule => !rule.has && !rule.source.includes(':')).map(rule => [rule.source, rule.destination]);
  const redirectChecks = new Map([...literalRedirects, ['/services/', '/solutions'], ['/projects/', '/solutions'], ['/about.html', '/about'], ['/about/', '/about']]);
  report.redirectCount = redirectChecks.size;
  for (const [alias, destination] of redirectChecks) await check(`HTTP redirect ${alias}`, async () => {
    let url = new URL(alias, preview);
    const visited = new Set();
    const statuses = [];
    for (let hop = 0; hop < 5; hop++) {
      assert.ok(!visited.has(url.href), 'Redirect must not loop');
      visited.add(url.href);
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
      statuses.push(response.status);
      if (response.status === 200) {
        assert.equal(url.pathname, destination);
        assert.equal(url.origin, preview.origin);
        assert.ok(statuses.length > 1, 'Alias must redirect to a clean route');
        const targetRoute = routeByPath.get(destination);
        assert.ok(targetRoute, 'Migration destination must be an indexable rendered route');
        const targetHtml = await page.evaluate(html => {
          const document = new DOMParser().parseFromString(html, 'text/html');
          return { title: document.title, canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(node => node.getAttribute('href')), h1s: [...document.querySelectorAll('main h1')].map(node => node.textContent.replace(/\s+/g, ' ').trim()) };
        }, await response.text());
        assert.equal(targetHtml.title, targetRoute.title);
        assert.deepEqual(targetHtml.canonicals, [targetRoute.url]);
        assert.deepEqual(targetHtml.h1s, expected.get(destination).h1s);
        return { destination, statuses };
      }
      assert.ok([301, 302, 303, 307, 308].includes(response.status), 'Alias must return an HTTP redirect');
      const location = response.headers.get('location');
      assert.ok(location, 'Redirect must supply Location');
      url = new URL(location, url);
      assert.equal(url.origin, preview.origin, 'Preview redirects must stay local');
    }
    throw new Error('Too many redirect hops');
  });

  for (const route of routes) {
    const passed = await check(`Hydration ${route.path}`, async () => {
      const before = report.console.length + report.pageErrors.length;
      const actual = await visit(page, route);
      assert.equal(report.console.length + report.pageErrors.length, before, 'Browser console or page error occurred during hydration');
      return { h1: actual.h1s[0], mainTextLength: actual.mainTextLength };
    });
    report.routes.push({ path: route.path, hydrated: passed });
  }

  await check('Desktop home screenshot', async () => { await visit(page, home); await screenshot(page, 'seo-home-desktop.png'); });
  await check('Responsive hero and compact logo downloads', async () => {
    await visit(page, home);
    await page.waitForFunction(() => [...document.querySelectorAll('header img, .home-entry-hero img')].filter(image => image.getBoundingClientRect().width > 0).every(image => image.complete && image.naturalWidth > 0));
    const actual = await page.evaluate(() => ({
      logo: document.querySelector('header img').currentSrc,
      hero: document.querySelector('.home-entry-hero img').currentSrc,
      resources: performance.getEntriesByType('resource').map(entry => new URL(entry.name).pathname),
    }));
    assert(new URL(actual.logo).pathname.startsWith('/images/responsive/logo-128-'), 'DPR 1 navbar must choose the compact logo');
    assert(new URL(actual.hero).pathname.startsWith('/images/responsive/water_treatment_plant-1024-'), 'Full-height hero must retain its full source resolution');
    assert(!actual.resources.includes('/logo.png') && !actual.resources.includes('/images/water_treatment_plant.jpg'), 'Responsive selection must not also download the original images');
    const logoBytes = (await readFile(path.join(root, 'dist', new URL(actual.logo).pathname.slice(1)))).length;
    const heroBytes = (await readFile(path.join(root, 'dist', new URL(actual.hero).pathname.slice(1)))).length;
    assert(logoBytes < 15000 && heroBytes < 150000, 'Image byte budget regressed');
    return { logoBytes, heroBytes };
  });
  await check('Clean SPA navigation and back/forward', async () => {
    await visit(page, home);
    const token = await page.evaluate(() => { window.__seoQaNavigationToken = crypto.randomUUID(); return window.__seoQaNavigationToken; });
    for (const routePath of ['/products', '/solutions', '/about']) {
      await page.click(`header nav[aria-label="Main navigation"] a[href="${routePath}"]`);
      await waitForRoute(page, routeByPath.get(routePath));
      assert.equal(await page.evaluate(() => window.__seoQaNavigationToken), token, 'A normal internal click must retain the hydrated document');
    }
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await waitForRoute(page, routeByPath.get('/solutions'));
    await page.goForward({ waitUntil: 'domcontentloaded' });
    await waitForRoute(page, routeByPath.get('/about'));
    assert.equal(await page.evaluate(() => window.__seoQaNavigationToken), token);
  });

  await check('Legacy /#about bookmark', async () => {
    await page.goto(new URL('/#about', preview).href, { waitUntil: 'domcontentloaded' });
    await waitForRoute(page, routeByPath.get('/about'));
    assert.equal(new URL(page.url()).hash, '', 'Legacy bookmark should become the clean /about route');
  });

  await check('Consultation CTA and Escape dismissal', async () => {
    await visit(page, home);
    assert.equal(await page.$eval('header a[aria-label="Get in Touch"]', node => node.getAttribute('href')), '/contact');
    await page.click('header a[aria-label="Get in Touch"]');
    await page.waitForSelector('dialog.orbit-quote[open]', { visible: true });
    assert.equal(new URL(page.url()).pathname, '/', 'Enhanced contact CTA should open the consultation dialog');
    await page.keyboard.press('Escape');
    await page.waitForSelector('dialog.orbit-quote[open]', { hidden: true });
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  const representativePaths = [...new Set(['/', '/about', '/products', '/solutions', '/ecosystem', '/contact', service.path, category.path, ...(guide ? [guide.path] : [])])];
  for (const routePath of representativePaths) await check(`390px layout ${routePath}`, async () => {
    const actual = await visit(page, routeByPath.get(routePath));
    assert.ok(actual.overflow <= 1, `Horizontal overflow is ${actual.overflow}px`);
    if (routePath === '/') await screenshot(page, 'seo-home-mobile.png');
    if (routePath === service.path) await screenshot(page, 'seo-service-mobile.png');
    if (routePath === category.path) await screenshot(page, 'seo-category-mobile.png');
    return { overflow: actual.overflow };
  });
  await check('Mobile hidden decoration avoids image download', async () => {
    await visit(page, home);
    await screenshot(page, 'seo-home-mobile.png');
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => new URL(entry.name).pathname));
    assert(!resources.some(resource => resource.includes('building_facade')), 'Hidden desktop decoration must not download on mobile');
  });
  await page.close();

  const noJs = await makePage({ javaScript: false, mobile: true });
  for (const route of routes) {
    const passed = await check(`No JavaScript ${route.path}`, async () => {
      const actual = await visit(noJs, route, { hydration: false });
      return { mainTextLength: actual.mainTextLength };
    });
    report.routes.find(item => item.path === route.path).noJavaScript = passed;
  }

  await check('No-JS service FAQ details', async () => {
    await visit(noJs, service, { hydration: false });
    assert.equal(await noJs.$eval('main .seo-faq details', node => node.open), false);
    await noJs.click('main .seo-faq details summary');
    assert.equal(await noJs.$eval('main .seo-faq details', node => node.open), true, 'Native FAQ must open without JavaScript');
    assert.ok(await noJs.$eval('main .seo-faq details', node => node.innerText.length > node.querySelector('summary').innerText.length), 'Expanded FAQ answer must become visible');
  });

  await check('No-JS mobile navigation', async () => {
    await visit(noJs, home, { hydration: false });
    assert.equal(await noJs.$eval('header details', node => node.open), false);
    await noJs.click('header details summary');
    assert.equal(await noJs.$eval('header details', node => node.open), true, 'Native menu must open without JavaScript');
    await Promise.all([noJs.waitForNavigation({ waitUntil: 'domcontentloaded' }), noJs.click('#mobile-navigation a[href="/products"]')]);
    await settleFrame(noJs);
    assertMetadata(await readMetadata(noJs), routeByPath.get('/products'));
  });

  await check('No-JS contact CTA fallback', async () => {
    await visit(noJs, home, { hydration: false });
    await Promise.all([noJs.waitForNavigation({ waitUntil: 'domcontentloaded' }), noJs.click('header a[aria-label="Get in Touch"]')]);
    await settleFrame(noJs);
    assertMetadata(await readMetadata(noJs), routeByPath.get('/contact'));
  });
  await noJs.close();

  await check('400kbps mobile HTML fallback', async () => {
    const slow = await makePage({ javaScript: false, mobile: true });
    try {
      slow.setDefaultNavigationTimeout(30000);
      const session = await slow.createCDPSession();
      await session.send('Network.enable');
      await session.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 50 * 1024, uploadThroughput: 10 * 1024, connectionType: 'cellular3g' });
      const actual = await visit(slow, home, { hydration: false });
      assert.ok(actual.overflow <= 1 && actual.h1Visible, 'Throttled initial HTML must remain readable on mobile');
      return { downloadKbps: 400, latencyMs: 300, mainTextLength: actual.mainTextLength };
    } finally { await slow.close(); }
  });

  const failedJs = await makePage({ blockScripts: true, mobile: true });
  for (const route of [home, service]) await check(`JavaScript assets fail ${route.path}`, async () => {
    const actual = await visit(failedJs, route, { hydration: false });
    assert.ok(actual.overflow <= 1, 'HTML fallback must fit a mobile viewport');
    if (route.path === '/') await screenshot(failedJs, 'seo-home-script-blocked.png');
    return { mainTextLength: actual.mainTextLength };
  });
  await failedJs.close();

  await check('No hydration warnings or application console errors', async () => {
    assert.deepEqual(report.console, [], 'Console warnings/errors, including recoverable React hydration mismatches, must be resolved');
    assert.deepEqual(report.pageErrors, [], 'Uncaught browser exceptions must be resolved');
    assert.deepEqual(report.requestFailures, [], 'Local build assets must load successfully');
  });
} catch (error) {
  report.checks.push({ name: phase, status: 'failed', error: error.stack || error.message });
  console.error(error.message);
} finally {
  if (browser) await browser.close();
  if (browserProfile && path.dirname(browserProfile) === output && path.basename(browserProfile).startsWith('chrome-seo-')) await rm(browserProfile, { recursive: true, force: true, maxRetries: 3 }).catch(error => { report.profileCleanupWarning = error.message; });
  report.finishedAt = new Date().toISOString();
  report.blockedThirdParty = [...blockedThirdParty].sort();
  report.intentionallyBlockedScripts = [...intentionallyBlockedScripts].sort();
  report.passed = report.checks.filter(check => check.status === 'passed').length;
  report.failed = report.checks.filter(check => check.status === 'failed').length;
  await writeFile(path.join(output, 'seo-browser.json'), JSON.stringify(report, null, 2));
  console.log(`SEO browser QA: ${report.passed} passed, ${report.failed} failed. Report: .qa/seo-browser.json`);
  if (report.failed) process.exitCode = 1;
}
