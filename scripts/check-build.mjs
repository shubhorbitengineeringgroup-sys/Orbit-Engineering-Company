import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { inspectPublicBuild } from './public-build.mjs';
const manifest = JSON.parse(await readFile('dist/seo-manifest.json', 'utf8'));
await inspectPublicBuild('dist', { check: true });
const checks = ['scripts/verify-seo.mjs', ...(['generic','apache','iis'].includes(manifest.target || 'generic') ? ['scripts/generate-hosting-config.mjs','scripts/generate-iis-config.mjs'] : [])];
for (const script of checks) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, '--check'], { stdio: 'inherit', windowsHide: true });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error('Build verification failed.')));
  });
}
