import { describe, expect, it } from 'vitest';

import {
  LearningRecordBackupSchema,
  LearningRecordImportPreviewSchema,
} from '../../src/lib/domain/schema-parts/learning.js';
const at = '2026-07-17T12:00:00+09:00';

describe('backup and restore aggregates', () => {
  it('rejects duplicate/lost orphan backup records and stale restore previews', () => {
    const record = {
      problemId: 'abc212-e',
      status: 'unstarted',
      statusUpdatedAt: null,
      needsReview: false,
      needsReviewUpdatedAt: null,
    } as const;
    expect(
      LearningRecordBackupSchema.safeParse({
        schemaVersion: '1.0.0',
        exportedAt: at,
        catalogVersionAtExport: '2026.07.17',
        records: [record, { ...record, status: 'completed' }],
        orphanedProblemIds: [],
      }).success,
    ).toBe(false);
    expect(
      LearningRecordBackupSchema.safeParse({
        schemaVersion: '1.0.0',
        exportedAt: at,
        catalogVersionAtExport: '2026.07.17',
        records: [],
        orphanedProblemIds: ['abc212-e'],
      }).success,
    ).toBe(false);
    expect(
      LearningRecordBackupSchema.safeParse({
        schemaVersion: '1.0.0',
        exportedAt: at,
        catalogVersionAtExport: '2026.07.17',
        records: [record],
        orphanedProblemIds: ['abc212-e'],
      }).success,
    ).toBe(true);
    expect(
      LearningRecordImportPreviewSchema.safeParse({
        schemaVersion: '1.0.0',
        items: [{ problemId: 'abc212-e', classification: 'invalid_item', reason: 'invalid' }],
        counts: { new: 0, updated: 0, same: 0, unknown_problem_id: 0, invalid_item: 0 },
        applicable: true,
      }).success,
    ).toBe(false);
  });
});
