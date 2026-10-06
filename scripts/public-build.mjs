import assert from 'node:assert/strict';
import { readdir, lstat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { blockedPublicPath } from './security-policy.mjs';
export async function inspectPublicBuild(dist, { check = false } = {}) {
  assert(!(await lstat(dist)).isSymbolicLink(), 'Public build must not be a symbolic link.');
  const generated = new Set(['.htaccess', 'web.config', '.nojekyll']);
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      const relative = path.relative(dist, target).split(path.sep).join('/');
      assert(!entry.isSymbolicLink(), `Symbolic link must not be published: ${relative}`);
      if (entry.isFile() && relative.toLowerCase().endsWith('.md')) {
        assert(!check, `Non-public asset notes remain in build: ${relative}`);
        await unlink(target); continue;
      }
      assert(generated.has(relative) || !blockedPublicPath(relative), `Private or executable file must not be published: ${relative}`);
      if (entry.isDirectory()) await walk(target);
    }
  }
  await walk(dist);
}
