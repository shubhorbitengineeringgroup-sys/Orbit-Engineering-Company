import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const env = { ...loadEnv('production', root, ''), ...process.env };
const key = env.INDEXNOW_KEY?.trim();
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Set a stable INDEXNOW_KEY in .env.local, build and deploy before submitting.');
const manifest = JSON.parse(await readFile(new URL('../dist/seo-manifest.json', import.meta.url), 'utf8'));
if (manifest.indexable === false) throw new Error('Preview builds must not be submitted for indexing.');
const keyLocation = `${manifest.siteOrigin}${manifest.basePath || '/'}${key}.txt`;
if (manifest.indexNowKeyLocation !== keyLocation) throw new Error('Rebuild and deploy with the configured key before submission.');
const proof = await fetch(keyLocation, { signal: AbortSignal.timeout(20000) });
if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('The published IndexNow ownership file is missing or incorrect. Deploy this build first.');
const result = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host: new URL(manifest.siteOrigin).hostname, key, keyLocation, urlList: manifest.pages.map(page => page.url) }), signal: AbortSignal.timeout(20000) });
if (result.status !== 200 && result.status !== 202) throw new Error(`IndexNow rejected submission (HTTP ${result.status}).`);
console.log(`Submitted ${manifest.pages.length} URLs to IndexNow (HTTP ${result.status}). Submission does not guarantee indexing or rankings.`);
