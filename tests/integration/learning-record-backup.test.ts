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
  it.each(['2026.07.1', '2026.10.09-r10'])(
    'exports and restores 100+ records with catalog %s',
    async (catalogVersion) => {
      const records = Array.from({ length: 120 }, (_, index) =>
        record(index, {
          status: index % 2 ? 'in_progress' : 'completed',
          statusUpdatedAt: '2026-07-29T08:00:00-04:00',
          needsReview: index % 3 === 0,
          needsReviewUpdatedAt: '2026-07-29T21:30:00+09:00',
        }),
      );
      const ids = new Set(records.map(({ problemId }) => problemId));
      const source = new InMemoryLearningRecordDatabase(records);
      const backup = await exportLearningRecords(source, {
        catalogVersion,
        catalogProblemIds: ids,
        exportedAt: '2026-07-29T10:30:00+09:00',
      });
      expect(backup.catalogVersionAtExport).toBe(catalogVersion);
      expect(Object.keys(backup).sort()).toEqual(
        [
          'schemaVersion',
          'exportedAt',
          'catalogVersionAtExport',
          'records',
          'orphanedProblemIds',
        ].sort(),
      );
      expect(backup.schemaVersion).toBe('1.0.0');
      expect(JSON.stringify(backup)).not.toMatch(/account|sync|telemetry/iu);
      const target = new InMemoryLearningRecordDatabase();
      const preview = previewLearningRecordImport(backup, [], ids);
      expect(preview.counts.new).toBe(120);
      await applyLearningRecordImport(target, preview, 'newer-wins');
      expect(target.records.size).toBe(120);
      expect([...target.records.values()]).toEqual(records);
      // A rollback makes formerly known IDs orphaned; re-adding them must recover the same records.
      const withdrawnIds = new Set([...ids].slice(0, 100));
      const afterWithdrawal = await exportLearningRecords(target, {
        catalogVersion,
        catalogProblemIds: withdrawnIds,
        exportedAt: '2026-07-30T10:30:00+09:00',
      });
      expect(afterWithdrawal.orphanedProblemIds).toHaveLength(20);
      const restored = new InMemoryLearningRecordDatabase();
      const withdrawalPreview = previewLearningRecordImport(afterWithdrawal, [], withdrawnIds);
      expect(withdrawalPreview.counts.unknown_problem_id).toBe(20);
      await applyLearningRecordImport(restored, withdrawalPreview, 'newer-wins');
      expect([...restored.records.values()]).toEqual(records);
      const readded = await exportLearningRecords(restored, {
        catalogVersion,
        catalogProblemIds: ids,
        exportedAt: '2026-07-31T10:30:00+09:00',
      });
      expect(readded.records).toEqual(records);
      expect(readded.orphanedProblemIds).toEqual([]);
    },
  );

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
        record(4),
      ],
    };
    const preview = previewLearningRecordImport(
      input,
      [local, record(2)],
      new Set(['abc500-e', 'abc502-e', 'abc503-e', 'abc504-e']),
    );
    expect(preview.items.map(({ classification }) => classification)).toEqual([
      'updated',
      'unknown_problem_id',
      'same',
      'invalid_item',
      'new',
    ]);
    expect(preview.items[0]?.components).toEqual([
      expect.objectContaining({ component: 'status', source: 'local' }),
      expect.objectContaining({ component: 'needsReview', source: 'backup' }),
    ]);
  });

  it.each(['2026.07.1', '2026.10.09-r10'])(
    'rolls back overwrites and additions for catalog %s after restore failure',
    async (catalogVersionAtExport) => {
      const incoming = [record(0), record(1), record(2)];
      const original = record(0, {
        status: 'in_progress',
        needsReview: true,
        needsReviewUpdatedAt: null,
      });
      const untouched = record(99);
      const target = new InMemoryLearningRecordDatabase([original, untouched]);
      // The first two writes must overwrite record(0) and add record(1) before failure.
      target.failOnPutNumber = 3;
      const preview = previewLearningRecordImport(
        {
          schemaVersion: '1.0.0',
          exportedAt: '2026-07-29T12:30:00+09:00',
          catalogVersionAtExport,
          records: incoming,
          orphanedProblemIds: [],
        },
        [original, untouched],
        new Set(incoming.map(({ problemId }) => problemId)),
      );
      expect(preview.items.map(({ classification }) => classification)).toEqual([
        'updated',
        'new',
        'new',
      ]);
      await expect(applyLearningRecordImport(target, preview, 'backup-wins')).rejects.toThrow(
        'すべて取り消しました',
      );
      expect([...target.records.values()]).toEqual([original, untouched]);
    },
  );

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

  it.each([
    { policy: 'newer-wins' as const, expectedStatus: 'in_progress' },
    { policy: 'backup-wins' as const, expectedStatus: 'completed' },
  ])(
    'resolves equal-timestamp different values with $policy',
    async ({ policy, expectedStatus }) => {
      const local = record(0, {
        status: 'in_progress',
        statusUpdatedAt: '2026-07-29T11:00:00+09:00',
      });
      const incoming = record(0, {
        status: 'completed',
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
        [local],
        new Set([incoming.problemId]),
      );
      expect(preview.items[0]).toMatchObject({
        classification: 'updated',
        components: [
          {
            component: 'status',
            source: 'local',
            reason: 'timestamp_tie_local_preserved',
            result: 'in_progress',
          },
          expect.objectContaining({ component: 'needsReview', source: 'same' }),
        ],
      });
      const target = new InMemoryLearningRecordDatabase([local]);
      await applyLearningRecordImport(target, preview, policy);
      expect(target.records.get(incoming.problemId)?.status).toBe(expectedStatus);
    },
  );

  it('backup-wins re-applies an item that changed after an identical preview', async () => {
    const incoming = record(0);
    const preview = previewLearningRecordImport(
      {
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T12:30:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records: [incoming],
        orphanedProblemIds: [],
      },
      [incoming],
      new Set([incoming.problemId]),
    );
    expect(preview.items[0]?.classification).toBe('same');
    const changedAfterPreview = record(0, {
      status: 'in_progress',
      statusUpdatedAt: incoming.statusUpdatedAt,
    });
    const target = new InMemoryLearningRecordDatabase([changedAfterPreview]);
    await applyLearningRecordImport(target, preview, 'backup-wins');
    expect(target.records.get(incoming.problemId)).toEqual(incoming);
  });
});
