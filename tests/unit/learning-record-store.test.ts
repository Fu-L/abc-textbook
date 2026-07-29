import { describe, expect, it } from 'vitest';

import {
  defaultLearningRecord,
  LEARNING_RECORD_DATABASE_VERSION,
  migrateLegacyLearningRecord,
} from '../../src/lib/learning-records/database.js';
import {
  getLearningRecord,
  updateLearningStatus,
  updateNeedsReview,
} from '../../src/lib/learning-records/store.js';
import { InMemoryLearningRecordDatabase } from '../fixtures/in-memory-learning-record-database.js';

describe('learning record database contract', () => {
  it('has a versioned schema and a catalog-independent default keyed only by Problem ID', () => {
    expect(LEARNING_RECORD_DATABASE_VERSION).toBeGreaterThan(1);
    expect(defaultLearningRecord('abc212-g')).toEqual({
      problemId: 'abc212-g',
      status: 'unstarted',
      statusUpdatedAt: null,
      needsReview: false,
      needsReviewUpdatedAt: null,
    });
  });

  it('migrates a legacy record while keeping its Problem ID and timestamp', () => {
    expect(
      migrateLegacyLearningRecord({
        problemId: 'abc212-g',
        completed: true,
        needsReview: true,
        updatedAt: '2026-07-29T09:00:00+09:00',
      }),
    ).toEqual({
      problemId: 'abc212-g',
      status: 'completed',
      statusUpdatedAt: '2026-07-29T09:00:00+09:00',
      needsReview: true,
      needsReviewUpdatedAt: '2026-07-29T09:00:00+09:00',
    });
  });

  it('preserves independent fields across separate atomic actions and reload', async () => {
    const database = new InMemoryLearningRecordDatabase();
    await updateLearningStatus(
      database,
      'abc212-g',
      'completed',
      () => '2026-07-29T09:01:00+09:00',
    );
    await updateNeedsReview(database, 'abc212-g', true, () => '2026-07-29T09:02:00+09:00');
    expect(await getLearningRecord(database, 'abc212-g')).toEqual({
      problemId: 'abc212-g',
      status: 'completed',
      statusUpdatedAt: '2026-07-29T09:01:00+09:00',
      needsReview: true,
      needsReviewUpdatedAt: '2026-07-29T09:02:00+09:00',
    });
    expect(database.transactionModes).toEqual(['readwrite', 'readwrite', 'readonly']);
  });
});
