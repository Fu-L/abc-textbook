import { LearningRecordSchema } from '../domain/schema-parts/learning.js';
import { defaultLearningRecord } from './database.js';
import type { LearningRecord, LearningRecordDatabase, LearningStatus } from './types.js';

export type LearningRecordClock = () => string;

const systemClock: LearningRecordClock = () => new Date().toISOString();

const abortIfActive = (transaction: { abort(): void }) => {
  try {
    transaction.abort();
  } catch {
    // The browser may already have aborted the transaction after a request failure.
  }
};

export async function getLearningRecord(
  database: LearningRecordDatabase,
  problemId: string,
): Promise<LearningRecord> {
  const transaction = database.transaction('readonly');
  const record = await transaction.get(problemId);
  await transaction.done;
  return record ? LearningRecordSchema.parse(record) : defaultLearningRecord(problemId);
}

export async function listLearningRecords(
  database: LearningRecordDatabase,
): Promise<LearningRecord[]> {
  const transaction = database.transaction('readonly');
  const records = await transaction.getAll();
  await transaction.done;
  return records.map((record) => LearningRecordSchema.parse(record));
}

export async function updateLearningStatus(
  database: LearningRecordDatabase,
  problemId: string,
  status: LearningStatus,
  clock: LearningRecordClock = systemClock,
): Promise<LearningRecord> {
  const transaction = database.transaction('readwrite');
  try {
    const current = (await transaction.get(problemId)) ?? defaultLearningRecord(problemId);
    const next = LearningRecordSchema.parse({ ...current, status, statusUpdatedAt: clock() });
    await transaction.put(next);
    await transaction.done;
    return next;
  } catch (error) {
    abortIfActive(transaction);
    throw error;
  }
}

export async function updateNeedsReview(
  database: LearningRecordDatabase,
  problemId: string,
  needsReview: boolean,
  clock: LearningRecordClock = systemClock,
): Promise<LearningRecord> {
  const transaction = database.transaction('readwrite');
  try {
    const current = (await transaction.get(problemId)) ?? defaultLearningRecord(problemId);
    const next = LearningRecordSchema.parse({
      ...current,
      needsReview,
      needsReviewUpdatedAt: clock(),
    });
    await transaction.put(next);
    await transaction.done;
    return next;
  } catch (error) {
    abortIfActive(transaction);
    throw error;
  }
}
