import { stableContestId } from '../domain/identity.js';

export const BOOTSTRAP_FIRST_CONTEST_NUMBER = 212;
export const BOOTSTRAP_LAST_CONTEST_NUMBER = 466;

export interface CorpusBatch {
  readonly id: string;
  readonly firstContestNumber: number;
  readonly lastContestNumber: number;
}

export interface OfficialContestGapDefinition {
  readonly number: number;
  readonly contestId: string;
  readonly status: 'officially_unheld';
  readonly evidenceUrl: string;
  readonly evidenceAssertion: string;
}

/**
 * AtCoder intentionally skipped ABC316. The official ABC350 A statement names
 * the omission explicitly; a missing task-list response alone is not evidence.
 */
export const officialContestGapDefinitions = Object.freeze([
  {
    number: 316,
    contestId: 'abc316',
    status: 'officially_unheld',
    evidenceUrl: 'https://atcoder.jp/contests/abc350/tasks/abc350_a',
    evidenceAssertion: 'ABC316 was not held on AtCoder.',
  },
] as const satisfies readonly OfficialContestGapDefinition[]);

export const corpusBatches = Object.freeze([
  { id: 'abc212-abc263', firstContestNumber: 212, lastContestNumber: 263 },
  { id: 'abc264-abc315', firstContestNumber: 264, lastContestNumber: 315 },
  { id: 'abc316-abc367', firstContestNumber: 316, lastContestNumber: 367 },
  { id: 'abc368-abc419', firstContestNumber: 368, lastContestNumber: 419 },
  { id: 'abc420-abc466', firstContestNumber: 420, lastContestNumber: 466 },
] as const satisfies readonly CorpusBatch[]);

export type CorpusBatchId = (typeof corpusBatches)[number]['id'];

export class CorpusBatchError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CorpusBatchError';
  }
}

export const contestNumbersForBatch = (batch: CorpusBatch): readonly number[] =>
  Object.freeze(
    Array.from(
      { length: batch.lastContestNumber - batch.firstContestNumber + 1 },
      (_unused, index) => batch.firstContestNumber + index,
    ),
  );

export const contestIdsForBatch = (batch: CorpusBatch): readonly string[] =>
  Object.freeze(contestNumbersForBatch(batch).map(stableContestId));

export const officialContestGapsForBatch = (
  batch: CorpusBatch,
): readonly OfficialContestGapDefinition[] =>
  Object.freeze(
    officialContestGapDefinitions.filter(
      ({ number }) => number >= batch.firstContestNumber && number <= batch.lastContestNumber,
    ),
  );

export const heldContestNumbersForBatch = (batch: CorpusBatch): readonly number[] => {
  const gaps = new Set(officialContestGapsForBatch(batch).map(({ number }) => number));
  return Object.freeze(contestNumbersForBatch(batch).filter((number) => !gaps.has(number)));
};

export const getCorpusBatch = (batchId: string): CorpusBatch => {
  const batch = corpusBatches.find(({ id }) => id === batchId);
  if (!batch) {
    throw new CorpusBatchError(
      'UNKNOWN_CORPUS_BATCH',
      `${batchId}; expected one of ${corpusBatches.map(({ id }) => id).join(', ')}`,
    );
  }
  return batch;
};

export const assertBootstrapBatchPartition = (
  batches: readonly CorpusBatch[] = corpusBatches,
): void => {
  const expected = Array.from(
    { length: BOOTSTRAP_LAST_CONTEST_NUMBER - BOOTSTRAP_FIRST_CONTEST_NUMBER + 1 },
    (_unused, index) => BOOTSTRAP_FIRST_CONTEST_NUMBER + index,
  );
  const actual = batches.flatMap(contestNumbersForBatch);
  if (
    actual.length !== expected.length ||
    actual.some((contestNumber, index) => contestNumber !== expected[index])
  ) {
    throw new CorpusBatchError(
      'CORPUS_BATCH_PARTITION_INVALID',
      `Batches must partition ABC ${String(BOOTSTRAP_FIRST_CONTEST_NUMBER)}-${String(BOOTSTRAP_LAST_CONTEST_NUMBER)} exactly once.`,
    );
  }
};
