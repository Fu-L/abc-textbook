import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it, vi } from 'vitest';

import * as acquisition from '../../scripts/update-abc/acquire.js';
import * as publicProjection from '../../src/lib/catalog/full-public-projection.js';
import {
  contentHashes,
  copySmallBatchCandidate,
  createSmallBatchFixture,
} from '../fixtures/small-batch.js';

const required = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('Missing isolation fixture');
  return value;
};

it('reuses only suite-owned preparation and isolates nested inputs and candidate bytes', async () => {
  const roots: string[] = [];
  const candidate = async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-fixture-isolation-'));
    roots.push(root);
    return root;
  };
  const loads = vi.spyOn(publicProjection, 'loadFullPublicProjection');
  const acquisitions = vi.spyOn(acquisition, 'acquireMetadataRange');
  try {
    const fixture = await createSmallBatchFixture();
    const first = await fixture.smallBatchInput(await candidate());
    const continuous = await fixture.smallBatchInput(await candidate(), 468);
    await fixture.authorSmallBatch(first);
    await fixture.authorSmallBatch(continuous);
    const firstBytes = await contentHashes(first.candidateRoot);
    const continuousBytes = await contentHashes(continuous.candidateRoot);
    const original = structuredClone(first);

    // Corrupt objects as well as files, including files a validator could add.
    first.baseCatalog.problems.reverse();
    first.baseCatalog.learningUnits[0]?.directProblemIds?.reverse();
    first.baseMetadata.changeSummary.addedProblemIds.push('abc467-e');
    Object.assign(required(first.metadataBatch.problems[0]), { title: 'corrupted task' });
    Object.assign(required(first.metadataBatch.sourceRevisions[0]), {
      fingerprint: '0'.repeat(64),
    });
    Object.assign(required(first.metrics.problems['abc467-e']), { difficulty: 0, point: 0 });
    for (const file of [
      'policies/problem-placements.json',
      'learning-units/unit-dp-transition-optimization.json',
      'docs/problems/abc467-e.md',
      'problems/leftover.json',
    ]) {
      await writeFile(path.join(first.candidateRoot, 'src/content', file), 'corrupted');
    }

    // Reverse the ranges on the next requests. Both must start clean.
    const continuousAgain = await fixture.smallBatchInput(await candidate(), 468);
    const again = await fixture.smallBatchInput(await candidate());
    expect(again).toEqual({ ...original, candidateRoot: again.candidateRoot });
    expect(again.metrics.problems['abc467-e']?.difficulty).toBeNull();
    expect(again.metrics.problems['abc467-e']?.point).toBeNull();
    await fixture.authorSmallBatch(continuousAgain);
    await fixture.authorSmallBatch(again);
    expect(await contentHashes(continuousAgain.candidateRoot)).toEqual(continuousBytes);
    expect(await contentHashes(again.candidateRoot)).toEqual(firstBytes);
    expect(loads.mock.calls).toEqual([
      [{ repositoryRoot: process.cwd(), usePreparedRelease: false }],
    ]);
    expect(acquisitions.mock.calls.map(([input]) => input.lastContestNumber)).toEqual([467, 468]);
    const loaded = required(loads.mock.results[0]);
    const current = await (loaded.value as ReturnType<
      typeof publicProjection.loadFullPublicProjection
    >);
    expect(again.baseCatalog).toEqual(current.catalog);

    // Forks of the authored seed are independently editable, including nested input.
    const fork = copySmallBatchCandidate(again, await candidate());
    const document = 'src/content/docs/problems/abc467-e.md';
    await writeFile(path.join(fork.candidateRoot, document), 'broken fork');
    Object.assign(required(fork.metadataBatch.problems[0]), { title: 'broken fork' });
    expect(await contentHashes(again.candidateRoot)).toEqual(firstBytes);
    const nextFork = copySmallBatchCandidate(again, await candidate());
    expect(nextFork.metadataBatch).toEqual(again.metadataBatch);
    expect(await contentHashes(nextFork.candidateRoot)).toEqual(firstBytes);
    expect(await readFile(path.join(nextFork.candidateRoot, document), 'utf8')).not.toBe(
      'broken fork',
    );

    // A new suite must load again; no module/process-wide catalog cache.
    await createSmallBatchFixture();
    expect(loads).toHaveBeenCalledTimes(2);
  } finally {
    loads.mockRestore();
    acquisitions.mockRestore();
    await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  }
}, 300_000);
