import { describe, expect, it } from 'vitest';

import { updateLearningStatus, updateNeedsReview } from '../../src/lib/learning-records/store.js';
import { InMemoryLearningRecordDatabase } from '../fixtures/in-memory-learning-record-database.js';

describe('learning record control actions', () => {
  it('does not overwrite the other component or its offset-qualified timestamp', async () => {
    const database = new InMemoryLearningRecordDatabase();
    const status = await updateLearningStatus(
      database,
      'abc218-f',
      'in_progress',
      () => '2026-07-29T10:00:00+09:00',
    );
    const review = await updateNeedsReview(
      database,
      'abc218-f',
      true,
      () => '2026-07-29T10:01:00+09:00',
    );
    expect(status.needsReviewUpdatedAt).toBeNull();
    expect(review.status).toBe('in_progress');
    expect(review.statusUpdatedAt).toBe('2026-07-29T10:00:00+09:00');
  });

  it('rolls back an action that cannot be persisted', async () => {
    const database = new InMemoryLearningRecordDatabase();
    database.failOnPutNumber = 1;
    await expect(updateLearningStatus(database, 'abc218-f', 'completed')).rejects.toThrow();
    expect(database.records.size).toBe(0);
  });
});
