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
}).superRefine((backup, context) => {
  const recordIds = backup.records.map(({ problemId }) => problemId);
  const orphanIds = backup.orphanedProblemIds;
  if (new Set(recordIds).size !== recordIds.length) {
    context.addIssue({
      code: 'custom',
      path: ['records'],
      message: 'Problem records must be unique.',
    });
  }
  if (new Set(orphanIds).size !== orphanIds.length) {
    context.addIssue({
      code: 'custom',
      path: ['orphanedProblemIds'],
      message: 'Orphan IDs must be unique.',
    });
  }
  const overlap = recordIds.find((problemId) => orphanIds.includes(problemId));
  if (overlap) {
    context.addIssue({
      code: 'custom',
      message: `${overlap} cannot be both a record and an orphan.`,
    });
  }
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
}).superRefine((preview, context) => {
  const ids = preview.items.map(({ problemId }) => problemId);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({
      code: 'custom',
      path: ['items'],
      message: 'Preview Problem IDs must be unique.',
    });
  }
  for (const classification of [
    'new',
    'updated',
    'same',
    'unknown_problem_id',
    'invalid_item',
  ] as const) {
    const actual = preview.items.filter((item) => item.classification === classification).length;
    if (preview.counts[classification] !== actual) {
      context.addIssue({
        code: 'custom',
        path: ['counts', classification],
        message: 'Preview count is stale.',
      });
    }
  }
  if (
    preview.applicable &&
    preview.items.some(({ classification }) => classification === 'invalid_item')
  ) {
    context.addIssue({
      code: 'custom',
      path: ['applicable'],
      message: 'Invalid items make a preview inapplicable.',
    });
  }
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
