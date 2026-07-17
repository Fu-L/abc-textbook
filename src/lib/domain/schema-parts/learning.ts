import { z } from 'zod';

import { defineZodContractSchema, strictObject } from '../contract-schema.js';
import { OffsetDateTimeSchema, ProblemIdSchema } from './catalog.js';

export const LearningRecordSchema = strictObject({
  problemId: ProblemIdSchema,
  status: z.enum(['unstarted', 'in_progress', 'completed']),
  statusUpdatedAt: OffsetDateTimeSchema.nullable(),
  needsReview: z.boolean(),
  needsReviewUpdatedAt: OffsetDateTimeSchema.nullable(),
});

export const LearningRecordBackupSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  exportedAt: OffsetDateTimeSchema,
  catalogVersionAtExport: z.string().regex(/^\d{4}\.\d{2}\.\d+$/u),
  records: z.array(LearningRecordSchema),
  orphanedProblemIds: z.array(ProblemIdSchema),
});

export const LearningRecordPreviewItemSchema = strictObject({
  problemId: ProblemIdSchema,
  classification: z.enum(['new', 'updated', 'same', 'unknown_problem_id', 'invalid_item']),
  reason: z.string().min(1),
});

export const LearningRecordImportPreviewSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  items: z.array(LearningRecordPreviewItemSchema),
  counts: z.record(
    z.enum(['new', 'updated', 'same', 'unknown_problem_id', 'invalid_item']),
    z.number().int().nonnegative(),
  ),
  applicable: z.boolean(),
});

export const LearningRecordMergePolicySchema = z.enum(['newer-wins', 'backup-wins', 'cancel']);

export const LearningRecordContract = defineZodContractSchema(
  'learning-record.schema.json',
  LearningRecordBackupSchema,
  {
    $id: 'https://abc-textbook.local/schemas/learning-record.schema.json',
    title: 'ABC Textbook Learning Record Backup',
  },
);
