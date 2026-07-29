import type {
  LearningRecord,
  LearningRecordDatabase,
  LearningRecordTransaction,
} from '../../src/lib/learning-records/types.js';

export class InMemoryLearningRecordDatabase implements LearningRecordDatabase {
  readonly records = new Map<string, LearningRecord>();
  failOnPutNumber: number | null = null;
  transactionModes: ('readonly' | 'readwrite')[] = [];

  constructor(records: readonly LearningRecord[] = []) {
    records.forEach((record) => this.records.set(record.problemId, structuredClone(record)));
  }

  transaction(mode: 'readonly' | 'readwrite'): LearningRecordTransaction {
    this.transactionModes.push(mode);
    const snapshot = new Map(
      [...this.records].map(([key, value]) => [key, structuredClone(value)]),
    );
    let putCount = 0;
    let aborted = false;
    return {
      get: (problemId) => Promise.resolve(structuredClone(this.records.get(problemId))),
      getAll: () =>
        Promise.resolve([...this.records.values()].map((record) => structuredClone(record))),
      put: (record) => {
        putCount += 1;
        if (this.failOnPutNumber === putCount)
          return Promise.reject(new Error('injected put failure'));
        this.records.set(record.problemId, structuredClone(record));
        return Promise.resolve();
      },
      get done() {
        return aborted ? Promise.reject(new Error('transaction aborted')) : Promise.resolve();
      },
      abort: () => {
        aborted = true;
        this.records.clear();
        snapshot.forEach((value, key) => this.records.set(key, value));
      },
    };
  }

  close() {
    return undefined;
  }
}
