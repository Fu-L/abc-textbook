import { z } from 'zod';

import { defineZodContractSchema, strictObject } from '../contract-schema.js';
import {
  ContentBlockKeySchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  SafePathSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);

const learningRecordRun = strictObject({
  engine: z.enum(['chromium', 'firefox', 'webkit']),
  engineRevision: text,
  os: text,
  problemId: ProblemIdSchema,
  startMarker: z.literal('problem-detail-render-complete'),
  endMarker: z.literal('both-save-confirmations-visible'),
  startedMonotonicMs: z.number().nonnegative(),
  completedMonotonicMs: z.number().nonnegative(),
  durationMs: z.number().min(0).max(30000),
  statusPersisted: z.literal(true),
  reviewPersisted: z.literal(true),
  statusUpdatedAt: OffsetDateTimeSchema,
  reviewUpdatedAt: OffsetDateTimeSchema,
  reloadCompleted: z.literal(true),
  reloadedStatus: z.literal('completed'),
  reloadedNeedsReview: z.literal(true),
  reloadedStatusUpdatedAt: OffsetDateTimeSchema,
  reloadedReviewUpdatedAt: OffsetDateTimeSchema,
  rollbackPassed: z.literal(true),
});
export const LearningRecordE2eEvidenceSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  releaseDigest: Sha256Schema,
  automatedEngineMatrixVersion: text,
  catalogVersion: text,
  runs: z
    .array(learningRecordRun)
    .min(45)
    .refine((runs) =>
      ['chromium', 'firefox', 'webkit'].every(
        (engine) => runs.filter((run) => run.engine === engine).length >= 15,
      ),
    ),
  rawEvidenceDigest: Sha256Schema,
  aggregatePassed: z.literal(true),
  generatedAt: OffsetDateTimeSchema,
});

export type ExecutableExampleEvidenceLocator =
  | {
      ownerType: 'problem';
      problemId: string;
      exampleKey: string;
    }
  | {
      ownerType: 'learning_unit';
      learningUnitId: string;
      exampleKey: string;
    };
const executableExampleEvidenceFields = {
  subjectDigest: Sha256Schema,
  releaseDigest: Sha256Schema,
  environment: text,
  command: text,
  expectedResult: z.string().min(1),
  actualResult: z.string().min(1),
  exitCode: z.number().int(),
  passed: z.boolean(),
  executedAt: OffsetDateTimeSchema,
  resultDigest: Sha256Schema,
  evidencePath: SafePathSchema,
};
const executableExampleItem = z.union([
  strictObject({
    ownerType: z.literal('problem'),
    problemId: ProblemIdSchema,
    exampleKey: ContentBlockKeySchema,
    ...executableExampleEvidenceFields,
  }),
  strictObject({
    ownerType: z.literal('learning_unit'),
    learningUnitId: EntityIdSchema,
    exampleKey: ContentBlockKeySchema,
    ...executableExampleEvidenceFields,
  }),
]);

export type ExecutableExampleEvidenceItem = z.infer<typeof executableExampleItem>;

export const executableExampleEvidenceLocatorKey = (
  item: ExecutableExampleEvidenceLocator,
): string =>
  item.ownerType === 'problem'
    ? `problem:${item.problemId}:${item.exampleKey}`
    : `learning_unit:${item.learningUnitId}:${item.exampleKey}`;

export const ExecutableExampleEvidenceSchema = strictObject({
  schemaVersion: z.literal('3.0.0'),
  releaseDigest: Sha256Schema,
  subjectDigest: Sha256Schema,
  inventoryDigest: Sha256Schema,
  inventoryCount: z.number().int().positive(),
  checkedCount: z.number().int().positive(),
  passedCount: z.number().int().nonnegative(),
  failedCount: z.number().int().nonnegative(),
  aggregatePassed: z.boolean(),
  items: z.array(executableExampleItem).min(1),
  generatedAt: OffsetDateTimeSchema,
})
  .superRefine((evidence, context) => {
    const ids = evidence.items.map(executableExampleEvidenceLocatorKey);
    const passed = evidence.items.filter((item) => item.passed).length;
    if (new Set(ids).size !== ids.length)
      context.addIssue({
        code: 'custom',
        path: ['items'],
        message: 'Example locators must be unique.',
      });
    if (
      evidence.inventoryCount !== evidence.items.length ||
      evidence.checkedCount !== evidence.items.length ||
      evidence.passedCount !== passed ||
      evidence.failedCount !== evidence.items.length - passed ||
      evidence.aggregatePassed !== (passed === evidence.items.length)
    )
      context.addIssue({ code: 'custom', message: 'Executable example aggregate is stale.' });
    evidence.items.forEach((item, index) => {
      if (
        item.subjectDigest !== evidence.subjectDigest ||
        item.releaseDigest !== evidence.releaseDigest ||
        (item.passed && item.exitCode !== 0)
      )
        context.addIssue({
          code: 'custom',
          path: ['items', index],
          message: 'Example scope/result is inconsistent.',
        });
    });
  })
  .meta({
    allOf: [
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: {
          properties: {
            failedCount: { const: 0 },
            items: { items: { properties: { passed: { const: true }, exitCode: { const: 0 } } } },
          },
        },
      },
    ],
  });

export type ExecutableExampleEvidence = z.infer<typeof ExecutableExampleEvidenceSchema>;

const contract = (fileName: `${string}.schema.json`, schema: z.ZodType, title: string) =>
  defineZodContractSchema(fileName, schema, {
    $id: `https://abc-textbook.local/schemas/${fileName}`,
    title,
  });
export const ExecutableExampleEvidenceContract = contract(
  'executable-example-evidence.schema.json',
  ExecutableExampleEvidenceSchema,
  'ABC Textbook Executable Example Evidence',
);
export const LearningRecordE2eEvidenceContract = contract(
  'learning-record-e2e-evidence.schema.json',
  LearningRecordE2eEvidenceSchema,
  'ABC Textbook Learning Record E2E Evidence',
);
