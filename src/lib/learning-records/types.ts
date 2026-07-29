import type { LearningRecordSchema } from '../domain/schema-parts/learning.js';
import type { z } from 'zod';

export type LearningRecord = z.infer<typeof LearningRecordSchema>;
export type LearningStatus = LearningRecord['status'];

export interface LearningRecordTransaction {
  get(problemId: string): Promise<LearningRecord | undefined>;
  getAll(): Promise<LearningRecord[]>;
  put(record: LearningRecord): Promise<void>;
  done: Promise<void>;
  abort(): void;
}

export interface LearningRecordDatabase {
  transaction(mode: 'readonly' | 'readwrite'): LearningRecordTransaction;
  close(): void;
}
