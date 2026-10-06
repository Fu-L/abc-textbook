import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  projectionBuildDigest,
  projectionImplementationDigest,
  verifyProjectionEvidence,
} from '../../scripts/verify/full-projection-evidence.js';

const snapshot = (
  artifactInventory = [{ path: 'dist/index.html', digest: 'a'.repeat(64), byteLength: 10 }],
) => {
  const sourceProjectionDigest = 'b'.repeat(64);
  const artifactDigest = canonicalDigest(artifactInventory);
  return {
    sourceProjectionDigest,
    implementationDigest: 'c'.repeat(64),
    fullProjectionDigest: projectionBuildDigest(sourceProjectionDigest, artifactDigest),
    artifactDigest,
    artifactInventory,
    build: { base: '/', site: 'https://example.invalid/' },
    routes: ['/', '/problems/abc212-g/'],
    counts: { problems: 1 },
    searchDocumentsDigest: 'd'.repeat(64),
  };
};

describe('full projection evidence across build environments', () => {
  it('accepts an independently validated build with different bundler and native search artifacts', () => {
    const frozen = snapshot();
    const current = snapshot([
      { path: 'dist/index.html', digest: 'e'.repeat(64), byteLength: 11 },
      { path: 'dist/_astro/client.linux.js', digest: 'f'.repeat(64), byteLength: 12 },
      { path: 'dist/pagefind/pagefind.ja.pf_meta', digest: '1'.repeat(64), byteLength: 13 },
    ]);
    expect(verifyProjectionEvidence(frozen, current).changedArtifacts).toEqual([
      'dist/_astro/client.linux.js',
      'dist/index.html',
      'dist/pagefind/pagefind.ja.pf_meta',
    ]);
    expect(verifyProjectionEvidence(frozen, frozen).changedArtifacts).toEqual([]);
  });

  it.each([
    { sourceProjectionDigest: 'e'.repeat(64) },
    { implementationDigest: 'e'.repeat(64) },
    { build: { base: '/book', site: 'https://example.invalid/' } },
    { routes: ['/'] },
    { counts: { problems: 2 } },
    { searchDocumentsDigest: 'e'.repeat(64) },
  ])('rejects stale source, rendering, publication, and coverage evidence: %j', (change) => {
    const current = { ...snapshot(), ...change };
    current.fullProjectionDigest = projectionBuildDigest(
      current.sourceProjectionDigest,
      current.artifactDigest,
    );
    expect(() => verifyProjectionEvidence(snapshot(), current)).toThrow('EVIDENCE_STALE');
  });

  it.each(['frozen', 'current'])('rejects corrupt %s artifact evidence', (subject) => {
    for (const change of [
      { artifactDigest: 'e'.repeat(64) },
      { fullProjectionDigest: 'e'.repeat(64) },
      { artifactInventory: [{ ...snapshot().artifactInventory[0], byteLength: 11 }] },
    ]) {
      const corrupt = { ...snapshot(), ...change };
      expect(() =>
        verifyProjectionEvidence(
          subject === 'frozen' ? corrupt : snapshot(),
          subject === 'current' ? corrupt : snapshot(),
        ),
      ).toThrow('EVIDENCE_CORRUPT');
    }
  });

  it('rejects duplicate artifact paths even when their hashes are internally consistent', () => {
    const duplicate = snapshot([...snapshot().artifactInventory, ...snapshot().artifactInventory]);
    expect(() => verifyProjectionEvidence(duplicate, duplicate)).toThrow('EVIDENCE_CORRUPT');
  });

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
