import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  classifyCanonicalTaxonomyOutput,
  findUnexpectedCanonicalTaxonomyOutputs,
} from '../../scripts/corpus/canonical-taxonomy-managed-outputs.js';

const expectedPaths = new Set([
  'src/content/tags/tag-expected.json',
  'src/content/learning-outcomes/outcome-expected.json',
  'src/content/learning-units/unit-expected.json',
  'src/content/docs/learn/chapter/unit-expected.md',
]);

describe('canonical taxonomy managed output set', () => {
  let repositoryRoot: string;

  beforeEach(async () => {
    repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'canonical-output-set-'));
  });

  afterEach(async () => {
    await rm(repositoryRoot, { recursive: true, force: true });
  });

  it('preserves changed bytes only after an explicit full-authoring handoff', () => {
    const fullAuthoringUnitIds = new Set(['unit-owned']);

    expect(
      classifyCanonicalTaxonomyOutput({
        actualBytes: 'same',
        expectedBytes: 'same',
        handoffUnitId: 'unit-generated',
        fullAuthoringUnitIds,
      }),
    ).toBe('verified');
    expect(
      classifyCanonicalTaxonomyOutput({
        actualBytes: 'authored',
        expectedBytes: 'skeleton',
        handoffUnitId: 'unit-owned',
        fullAuthoringUnitIds,
      }),
    ).toBe('preserved');
    expect(
      classifyCanonicalTaxonomyOutput({
        actualBytes: 'changed-without-handoff',
        expectedBytes: 'skeleton',
        handoffUnitId: 'unit-generated',
        fullAuthoringUnitIds,
      }),
    ).toBe('drift');
    expect(
      classifyCanonicalTaxonomyOutput({
        actualBytes: 'changed-policy',
        expectedBytes: 'canonical-policy',
        fullAuthoringUnitIds,
      }),
    ).toBe('drift');
  });

  it('reports every stale managed file recursively in deterministic order', async () => {
    const files = [
      'src/content/tags/tag-expected.json',
      'src/content/tags/archive/tag-stale.json',
      'src/content/learning-outcomes/outcome-stale.json',
      'src/content/learning-units/unit-stale.json',
      'src/content/docs/learn/chapter/unit-expected.md',
      'src/content/docs/learn/chapter/archive/stale.md',
    ];
    for (const relativePath of files) {
      const absolutePath = path.join(repositoryRoot, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, 'fixture\n');
    }

    await expect(
      findUnexpectedCanonicalTaxonomyOutputs(repositoryRoot, expectedPaths),
    ).resolves.toEqual([
      'src/content/docs/learn/chapter/archive/stale.md',
      'src/content/learning-outcomes/outcome-stale.json',
      'src/content/learning-units/unit-stale.json',
      'src/content/tags/archive/tag-stale.json',
    ]);
  });

  it('ignores .gitkeep and files outside each managed extension', async () => {
    const files = [
      'src/content/tags/.gitkeep',
      'src/content/tags/notes.md',
      'src/content/learning-outcomes/README.md',
      'src/content/learning-units/unit-expected.json.bak',
      'src/content/docs/learn/.gitkeep',
      'src/content/docs/learn/chapter/search-index.json',
    ];
    for (const relativePath of files) {
      const absolutePath = path.join(repositoryRoot, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, 'fixture\n');
    }

    await expect(
      findUnexpectedCanonicalTaxonomyOutputs(repositoryRoot, expectedPaths),
    ).resolves.toEqual([]);
  });

  it('rejects symlink traversal anywhere below a managed root', async () => {
    const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'canonical-output-outside-'));
    try {
      const managedRoot = path.join(repositoryRoot, 'src/content/docs/learn');
      await mkdir(managedRoot, { recursive: true });
      await symlink(outsideRoot, path.join(managedRoot, 'escaped'));

      await expect(
        findUnexpectedCanonicalTaxonomyOutputs(repositoryRoot, expectedPaths),
      ).rejects.toMatchObject({ code: 'CANONICAL_MATERIALIZATION_MANAGED_PATH_UNSAFE' });
    } finally {
      await rm(outsideRoot, { recursive: true, force: true });
    }
  });
});
