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
});
