import { mkdir, mkdtemp, realpath, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  hasStagingPathSegment,
  resolvePublicCatalogInput,
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
});
