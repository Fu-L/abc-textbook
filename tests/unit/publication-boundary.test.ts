import { mkdir, mkdtemp, realpath, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  hasStagingPathSegment,
  resolvePublicCatalogInput,
  resolvePublicEvidencePath,
} from '../../src/lib/catalog/publication-boundary.js';

describe('catalog publication boundary', () => {
  it.each([
    'staging/catalog.json',
    '/repo/staging/catalog.json',
    'staging\\catalog.json',
    'C:\\repo\\staging\\catalog.json',
    'C:/repo/STAGING/catalog.json',
  ])('recognizes staging across path formats: %s', (sourcePath) => {
    expect(hasStagingPathSegment(sourcePath)).toBe(true);
  });

  it('resolves real paths and rejects a public symlink into staging', async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-boundary-'));
    const stagingRoot = path.join(repositoryRoot, 'staging');
    const publicRoot = path.join(repositoryRoot, 'src', 'content');
    await mkdir(stagingRoot, { recursive: true });
    await mkdir(publicRoot, { recursive: true });
    const stagedCatalog = path.join(stagingRoot, 'catalog.json');
    const publicCatalog = path.join(publicRoot, 'catalog.json');
    const aliasCatalog = path.join(publicRoot, 'staged-alias.json');
    await writeFile(stagedCatalog, '{}', 'utf8');
    await writeFile(publicCatalog, '{}', 'utf8');
    await symlink(stagedCatalog, aliasCatalog);

    await expect(
      resolvePublicCatalogInput('src/content/catalog.json', repositoryRoot),
    ).resolves.toBe(await realpath(publicCatalog));
    await expect(
      resolvePublicCatalogInput('src/content/staged-alias.json', repositoryRoot),
    ).rejects.toThrow(/STAGING_PUBLICATION_BOUNDARY/u);
  });

  it('loads initial agent evidence and keeps constitution inputs separate from public evidence', async () => {
    const repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-agent-boundary-'));
    const agentPath = 'docs/reviews/agent-content/initial-release/release-review.json';
    const laterPath = 'docs/reviews/agent-content/incremental/review.json';
    const constitutionPath = '.specify/memory/constitution.md';
    await mkdir(path.join(repositoryRoot, 'staging'), { recursive: true });
    for (const file of [agentPath, laterPath, constitutionPath]) {
      await mkdir(path.dirname(path.join(repositoryRoot, file)), { recursive: true });
      await writeFile(path.join(repositoryRoot, file), '{}');
    }
    await expect(resolvePublicEvidencePath(agentPath, repositoryRoot)).resolves.toBe(
      await realpath(path.join(repositoryRoot, agentPath)),
    );
    await expect(resolvePublicCatalogInput(constitutionPath, repositoryRoot)).resolves.toBe(
      await realpath(path.join(repositoryRoot, constitutionPath)),
    );
    await expect(resolvePublicEvidencePath(constitutionPath, repositoryRoot)).rejects.toThrow(
      'EVIDENCE_OUTSIDE_PUBLIC_ROOT',
    );
    await expect(resolvePublicEvidencePath(laterPath, repositoryRoot)).rejects.toThrow(
      'EVIDENCE_OUTSIDE_PUBLIC_ROOT',
    );
  });
});
