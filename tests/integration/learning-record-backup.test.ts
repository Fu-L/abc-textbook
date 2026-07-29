import { describe, expect, it } from 'vitest';

import { exportLearningRecords } from '../../src/lib/learning-records/export.js';
import { applyLearningRecordImport } from '../../src/lib/learning-records/import-apply.js';
import { previewLearningRecordImport } from '../../src/lib/learning-records/import-preview.js';
import type { LearningRecord } from '../../src/lib/learning-records/types.js';
import { InMemoryLearningRecordDatabase } from '../fixtures/in-memory-learning-record-database.js';

const record = (index: number, overrides: Partial<LearningRecord> = {}): LearningRecord => ({
  problemId: `abc${String(500 + index)}-e`,
  status: 'completed',
  statusUpdatedAt: '2026-07-29T10:00:00+09:00',
  needsReview: false,
  needsReviewUpdatedAt: '2026-07-29T10:00:00+09:00',
  ...overrides,
});

describe('learning record backup and restore', () => {
  it('exports and restores 100+ privacy-minimal records', async () => {
    const records = Array.from({ length: 120 }, (_, index) => record(index));
    const ids = new Set(records.map(({ problemId }) => problemId));
    const source = new InMemoryLearningRecordDatabase(records);
    const backup = await exportLearningRecords(source, {
      catalogVersion: '2026.07.1',
      catalogProblemIds: ids,
      exportedAt: '2026-07-29T10:30:00+09:00',
    });
    expect(JSON.stringify(backup)).not.toMatch(/account|sync|telemetry/iu);
    const target = new InMemoryLearningRecordDatabase();
    const preview = previewLearningRecordImport(backup, [], ids);
    expect(preview.counts.new).toBe(120);
    await applyLearningRecordImport(target, preview, 'newer-wins');
    expect(target.records.size).toBe(120);
  });

  it('round-trips full orphaned records across catalog versions', async () => {
    const orphan = record(0, {
      status: 'in_progress',
      statusUpdatedAt: '2026-07-29T08:00:00-04:00',
      needsReview: true,
      needsReviewUpdatedAt: '2026-07-29T21:30:00+09:00',
    });
    const backup = await exportLearningRecords(new InMemoryLearningRecordDatabase([orphan]), {
      catalogVersion: '2026.07.1',
      catalogProblemIds: new Set(),
      exportedAt: '2026-07-29T22:00:00+09:00',
    });
    expect(backup.records).toEqual([orphan]);
    expect(backup.orphanedProblemIds).toEqual([orphan.problemId]);
    const target = new InMemoryLearningRecordDatabase();
    const preview = previewLearningRecordImport(backup, [], new Set());
    expect(preview.items[0]?.classification).toBe('unknown_problem_id');
    await applyLearningRecordImport(target, preview, 'newer-wins');
    expect(target.records.get(orphan.problemId)).toEqual(orphan);
  });

  it.each([
    {
      name: 'an orphan ID without its full record',
      override: { orphanedProblemIds: ['abc501-e'] },
    },
    {
      name: 'an unknown top-level property',
      override: { unexpected: true },
    },
  ])('blocks apply for $name', ({ override }) => {
    const input = {
      schemaVersion: '1.0.0',
      exportedAt: '2026-07-29T12:30:00+09:00',
      catalogVersionAtExport: '2026.07.1',
      records: [record(0)],
      orphanedProblemIds: [],
      ...override,
    };
    const preview = previewLearningRecordImport(input, [], new Set([record(0).problemId]));
    expect(preview.applicable).toBe(false);
    expect(preview.items[0]).toMatchObject({
      problemId: 'abc000-invalid-envelope',
      classification: 'invalid_item',
      reason: 'unsupported_or_missing_backup_schema',
    });
  });

  it.each([
    { name: 'a missing records collection', input: { schemaVersion: '1.0.0' } },
    {
      name: 'a non-array records collection',
      input: {
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T12:30:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records: 'invalid',
        orphanedProblemIds: [],
      },
    },
  ])('blocks apply for $name', ({ input }) => {
    const preview = previewLearningRecordImport(input, [], new Set());
    expect(preview.applicable).toBe(false);
    expect(preview.items[0]).toMatchObject({
      problemId: 'abc000-invalid-envelope',
      classification: 'invalid_item',
    });
  });

  it('classifies all five outcomes and merges newer components independently with local tie wins', () => {
    const local = record(0, {
      status: 'in_progress',
      statusUpdatedAt: '2026-07-29T11:00:00+09:00',
      needsReview: true,
      needsReviewUpdatedAt: '2026-07-29T10:00:00+09:00',
    });
    const input = {
      schemaVersion: '1.0.0',
      exportedAt: '2026-07-29T12:30:00+09:00',
      catalogVersionAtExport: '2026.07.1',
      orphanedProblemIds: [],
      records: [
        record(0, { needsReview: false, needsReviewUpdatedAt: '2026-07-29T12:00:00+09:00' }),
        record(1),
        record(2),
        { problemId: 'abc503-e', status: 'broken' },
      ],
    };
    const preview = previewLearningRecordImport(
      input,
      [local, record(2)],
      new Set(['abc500-e', 'abc502-e', 'abc503-e']),
    );
    expect(preview.items.map(({ classification }) => classification)).toEqual([
      'updated',
      'unknown_problem_id',
      'same',
      'invalid_item',
    ]);
    expect(preview.items[0]?.components).toEqual([
      expect.objectContaining({ component: 'status', source: 'local' }),
      expect.objectContaining({ component: 'needsReview', source: 'backup' }),
    ]);
  });

  it('rolls back the whole restore transaction after an injected failure', async () => {
    const incoming = [record(0), record(1), record(2)];
    const target = new InMemoryLearningRecordDatabase();
    target.failOnPutNumber = 2;
    const preview = previewLearningRecordImport(
      {
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T12:30:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records: incoming,
        orphanedProblemIds: [],
      },
      [],
      new Set(incoming.map(({ problemId }) => problemId)),
    );
    await expect(applyLearningRecordImport(target, preview, 'backup-wins')).rejects.toThrow(
      'すべて取り消しました',
    );
    expect(target.records.size).toBe(0);
  });

  it('re-reads the latest local record inside the apply transaction', async () => {
    const oldLocal = record(0, { statusUpdatedAt: '2026-07-29T10:00:00+09:00' });
    const incoming = record(0, {
      status: 'in_progress',
      statusUpdatedAt: '2026-07-29T11:00:00+09:00',
    });
    const preview = previewLearningRecordImport(
      {
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T12:30:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records: [incoming],
        orphanedProblemIds: [],
      },
      [oldLocal],
      new Set([incoming.problemId]),
    );
    const newerLocal = record(0, {
      status: 'completed',
      statusUpdatedAt: '2026-07-29T12:00:00+09:00',
    });
    const target = new InMemoryLearningRecordDatabase([newerLocal]);
    await applyLearningRecordImport(target, preview, 'newer-wins');
    expect(target.records.get(incoming.problemId)?.status).toBe('completed');
  });
});
