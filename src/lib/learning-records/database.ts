import { openDB, type DBSchema, type IDBPDatabase, type IDBPTransaction } from 'idb';

import { LearningRecordSchema } from '../domain/schema-parts/learning.js';
import type { LearningRecord, LearningRecordDatabase, LearningRecordTransaction } from './types.js';

export const LEARNING_RECORD_DATABASE_NAME = 'abc-textbook-learning-records';
export const LEARNING_RECORD_DATABASE_VERSION = 2;
export const LEARNING_RECORD_STORE_NAME = 'learning-records';

interface LearningRecordDbSchema extends DBSchema {
  'learning-records': {
    key: string;
    value: LearningRecord;
  };
}

interface LegacyLearningRecord {
  problemId?: unknown;
  status?: unknown;
  completed?: unknown;
  updatedAt?: unknown;
  statusUpdatedAt?: unknown;
  needsReview?: unknown;
  needsReviewUpdatedAt?: unknown;
}

export function defaultLearningRecord(problemId: string): LearningRecord {
  return LearningRecordSchema.parse({
    problemId,
    status: 'unstarted',
    statusUpdatedAt: null,
    needsReview: false,
    needsReviewUpdatedAt: null,
  });
}

export function migrateLegacyLearningRecord(value: LegacyLearningRecord): LearningRecord {
  const legacyTimestamp = typeof value.updatedAt === 'string' ? value.updatedAt : null;
  return LearningRecordSchema.parse({
    problemId: value.problemId,
    status:
      value.status === 'unstarted' || value.status === 'in_progress' || value.status === 'completed'
        ? value.status
        : value.completed === true
          ? 'completed'
          : 'unstarted',
    statusUpdatedAt:
      typeof value.statusUpdatedAt === 'string' ? value.statusUpdatedAt : legacyTimestamp,
    needsReview: value.needsReview === true,
    needsReviewUpdatedAt:
      typeof value.needsReviewUpdatedAt === 'string'
        ? value.needsReviewUpdatedAt
        : value.needsReview === true
          ? legacyTimestamp
          : null,
  });
}

class BrowserTransaction implements LearningRecordTransaction {
  readonly done: Promise<void>;

  constructor(
    private readonly transaction: IDBPTransaction<
      LearningRecordDbSchema,
      ['learning-records'],
      'readonly' | 'readwrite'
    >,
  ) {
    this.done = transaction.done;
  }

  async get(problemId: string) {
    return this.transaction.objectStore(LEARNING_RECORD_STORE_NAME).get(problemId);
  }

  async getAll() {
    return this.transaction.objectStore(LEARNING_RECORD_STORE_NAME).getAll();
  }

  async put(record: LearningRecord) {
    const store = this.transaction.objectStore(LEARNING_RECORD_STORE_NAME);
    if (!store.put) throw new Error('読み取り専用transactionには保存できません。');
    await store.put(record);
  }

  abort() {
    this.transaction.abort();
  }
}

class BrowserLearningRecordDatabase implements LearningRecordDatabase {
  constructor(private readonly database: IDBPDatabase<LearningRecordDbSchema>) {}

  transaction(mode: 'readonly' | 'readwrite') {
    return new BrowserTransaction(
      this.database.transaction(LEARNING_RECORD_STORE_NAME, mode, { durability: 'strict' }),
    );
  }

  close() {
    this.database.close();
  }
}

export interface OpenLearningRecordDatabaseOptions {
  readonly name?: string;
}

export async function openLearningRecordDatabase(
  options: OpenLearningRecordDatabaseOptions = {},
): Promise<LearningRecordDatabase> {
  const indexedDbApi: unknown = Reflect.get(globalThis, 'indexedDB');
  if (!indexedDbApi) throw new Error('このブラウザーでは端末内の学習記録を利用できません。');

  const database = await openDB<LearningRecordDbSchema>(
    options.name ?? LEARNING_RECORD_DATABASE_NAME,
    LEARNING_RECORD_DATABASE_VERSION,
    {
      upgrade(database, oldVersion, _newVersion, transaction) {
        const store = database.objectStoreNames.contains(LEARNING_RECORD_STORE_NAME)
          ? transaction.objectStore(LEARNING_RECORD_STORE_NAME)
          : database.createObjectStore(LEARNING_RECORD_STORE_NAME, { keyPath: 'problemId' });
        if (oldVersion > 0 && oldVersion < LEARNING_RECORD_DATABASE_VERSION) {
          void (async () => {
            let cursor = await store.openCursor();
            while (cursor) {
              await cursor.update(migrateLegacyLearningRecord(cursor.value));
              cursor = await cursor.continue();
            }
          })();
        }
      },
      blocked() {
        throw new Error('別のタブがデータベース更新を妨げています。ほかのタブを閉じてください。');
      },
    },
  );
  return new BrowserLearningRecordDatabase(database);
}
