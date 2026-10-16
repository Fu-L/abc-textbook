import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { projectionImplementationDigest } from '../../scripts/verify/full-projection-evidence.js';

describe('full projection evidence writer', () => {
  it('binds rendering code, styles, build config, and locked dependencies without hashing output evidence', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'projection-implementation-'));
    try {
      for (const directory of ['src', 'scripts', 'docs']) await mkdir(path.join(root, directory));
      const inputs = [
        'package.json',
        'package-lock.json',
        'astro.config.mjs',
        'tsconfig.json',
        'tsconfig.client.json',
        'src/page.astro',
        'src/style.css',
        'scripts/verify.ts',
      ];
      for (const file of inputs) await writeFile(path.join(root, file), 'original');
      const original = await projectionImplementationDigest(root);
      await writeFile(path.join(root, 'docs/evidence.json'), 'generated build evidence');
      expect(await projectionImplementationDigest(root)).toBe(original);
      for (const file of inputs) {
        await writeFile(path.join(root, file), 'changed');
        expect(await projectionImplementationDigest(root), file).not.toBe(original);
        await writeFile(path.join(root, file), 'original');
      }
      await writeFile(path.join(root, 'src/new.tsx'), 'new renderer');
      expect(await projectionImplementationDigest(root)).not.toBe(original);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
