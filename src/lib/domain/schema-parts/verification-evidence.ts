import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import {
  AnswerMaterialEvidenceContract,
  ContestIdSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  SafePathSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);
const portablePath = z
  .string()
  .regex(
    /^(?!.*(?:^|\/)(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.[A-Za-z0-9._-]+)?(?:\/|$))(?:[A-Za-z0-9._-]*[A-Za-z0-9_-])(?:\/[A-Za-z0-9._-]*[A-Za-z0-9_-])*$/iu,
  );
const unique = uniqueArray;

const environment = strictObject({
  os: text,
  cpu: text,
  physicalCores: z.number().int().min(4),
  memoryGiB: z.number().min(16),
  storage: z.literal('local-ssd'),
  powerSource: z.literal('ac'),
  concurrentHighLoad: z.literal(false),
  nodeVersion: text,
  npmVersion: text,
  chromiumRevision: text,
});
const fixture = strictObject({
  kind: z.enum(['seed', 'release-cutoff', 'design-limit']),
  generatorVersion: text,
  seed: text.nullable(),
  cutoffAt: OffsetDateTimeSchema.nullable(),
  schemaVersion: text,
  contestCount: z.number().int().positive(),
  problemCount: z.number().int().positive(),
  tagCount: z.number().int().positive(),
  learningUnitCount: z.number().int().positive(),
  fileListDigest: Sha256Schema,
  catalogDigest: Sha256Schema,
}).superRefine((item, context) => {
  const valid =
    item.kind === 'seed'
      ? item.seed !== null &&
        item.cutoffAt === null &&
        item.contestCount === 255 &&
        item.problemCount <= 1020
      : item.kind === 'release-cutoff'
        ? item.seed === null && item.cutoffAt !== null
        : item.seed !== null &&
          item.cutoffAt === null &&
          item.problemCount === 1500 &&
          item.tagCount === 500 &&
          item.learningUnitCount === 1000;
  if (!valid) context.addIssue({ code: 'custom', message: 'Fixture fields conflict with kind.' });
});
const buildRun = strictObject({
  fixtureKind: z.enum(['seed', 'release-cutoff', 'design-limit']),
  fixtureDigest: Sha256Schema,
  run: z.number().int().min(1).max(3),
  durationMs: z.number().min(0).max(300000),
  rawEvidenceDigest: Sha256Schema,
  passed: z.literal(true),
});
export const PerformanceEvidenceSchema = strictObject({
  schemaVersion: z.literal('1.1.0'),
  releaseDigest: Sha256Schema,
  environment,
  fixtures: z.array(fixture).length(3),
  buildRuns: z.array(buildRun).length(9),
  filterMeasurement: strictObject({
    fixtureDigest: Sha256Schema,
    startMarker: z.literal('before-input-event'),
    endMarker: z.literal('count-and-list-dom-committed'),
    warmupCount: z.literal(10),
    sampleCount: z.literal(30),
    p95Ms: z.number().min(0).max(100),
    sampleDigest: Sha256Schema,
    rawEvidenceDigest: Sha256Schema,
    passed: z.literal(true),
  }),
  successfulUpdateMeasurement: strictObject({
    fixtureDigest: Sha256Schema,
    contestId: ContestIdSchema,
    startMarker: z.literal('command-start'),
    endMarker: z.literal('successful-command-exit-after-all-authoring-results-persisted'),
    startedMonotonicMs: z.number().nonnegative(),
    completedMonotonicMs: z.number().nonnegative(),
    durationMs: z.number().min(0).max(900000),
    problemResultCount: z.number().int().positive(),
    authoringResultCounts: strictObject({
      authoring_unit_draft: z.number().int().positive(),
      authoring_required: z.literal(0),
      blocked: z.literal(0),
    }),
    rawEvidenceDigest: Sha256Schema,
    exitCode: z.literal(0),
    passed: z.literal(true),
  }),
  generatedAt: OffsetDateTimeSchema,
});

const routeChunkDecision = strictObject({
  route: z.string().regex(/^\//u),
  chunkPath: portablePath.regex(/\.(?:js|mjs)$/u),
  chunkDigest: Sha256Schema,
  containsLearningRecordBundle: z.boolean(),
  allowed: z.boolean(),
  decisionRule: z.enum([
    'allowed_learning_record_route_delivery',
    'no_learning_record_bundle',
    'forbidden_route_delivery',
  ]),
  rationale: text,
}).superRefine((decision, context) => {
  const allowedRoute =
    decision.route === '/problems/' ||
    /^\/problems\/abc\d{3,}-[a-z][a-z0-9+_-]*\/$/u.test(decision.route) ||
    ['/contests/', '/review/', '/settings/learning-records/'].includes(decision.route);
  const valid = !decision.containsLearningRecordBundle
    ? decision.allowed && decision.decisionRule === 'no_learning_record_bundle'
    : decision.allowed
      ? allowedRoute && decision.decisionRule === 'allowed_learning_record_route_delivery'
      : decision.decisionRule === 'forbidden_route_delivery';
  if (!valid)
    context.addIssue({ code: 'custom', message: 'Route chunk decision is inconsistent.' });
});
export const ClientBundleEvidenceSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  releaseDigest: Sha256Schema,
  toolVersion: text,
  buildManifestVersion: text,
  buildManifestDigest: Sha256Schema,
  rawArtifactPath: portablePath,
  rawArtifactDigest: Sha256Schema,
  checkedDecisionCount: z.number().int().positive(),
  violationCount: z.number().int().nonnegative(),
  routeChunkDecisions: unique(routeChunkDecision).min(1),
  aggregatePassed: z.boolean(),
  generatedAt: OffsetDateTimeSchema,
})
  .superRefine((evidence, context) => {
    const violations = evidence.routeChunkDecisions.filter((decision) => !decision.allowed).length;
    if (
      evidence.checkedDecisionCount !== evidence.routeChunkDecisions.length ||
      evidence.violationCount !== violations ||
      evidence.aggregatePassed !== (violations === 0)
    ) {
      context.addIssue({ code: 'custom', message: 'Client bundle aggregate is stale.' });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: {
          properties: {
            violationCount: { const: 0 },
            routeChunkDecisions: { items: { properties: { allowed: { const: true } } } },
          },
        },
      },
    ],
  });

const filesystemTestKinds = [
  'writer_lock',
  'global_lock',
  'same_filesystem_switch',
  'cross_filesystem_rejection',
  'conflict',
  'rollback_before_receipt',
  'state_recovery_after_receipt',
  'receipt_no_overwrite',
  'rerun_no_op',
] as const;

export const FilesystemPublishEvidenceSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  releaseDigest: Sha256Schema,
  host: strictObject({
    osFamily: text,
    osVersion: text,
    filesystem: text,
    toolVersions: z.record(z.string(), text),
  }),
  tests: z
    .array(
      strictObject({
        testId: text,
        kind: z.enum(filesystemTestKinds),
        passed: z.boolean(),
        rawPath: text,
        rawDigest: Sha256Schema,
      }),
    )
    .length(filesystemTestKinds.length),
  rawEvidenceManifestDigest: Sha256Schema,
  aggregatePassed: z.boolean(),
  generatedAt: OffsetDateTimeSchema,
})
  .superRefine((evidence, context) => {
    const ids = evidence.tests.map(({ testId }) => testId);
    const kinds = evidence.tests.map(({ kind }) => kind);
    if (
      new Set(ids).size !== ids.length ||
      new Set(kinds).size !== filesystemTestKinds.length ||
      filesystemTestKinds.some((kind) => !kinds.includes(kind)) ||
      evidence.aggregatePassed !== evidence.tests.every(({ passed }) => passed)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Filesystem evidence coverage/aggregate is stale.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: { properties: { tests: { items: { properties: { passed: { const: true } } } } } },
      },
    ],
  });

export const InstructionQualityEvidenceSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  releaseDigest: Sha256Schema,
  inventoryDigest: Sha256Schema,
  inventoryCount: z.number().int().positive(),
  checkedCount: z.number().int().positive(),
  items: z
    .array(
      strictObject({
        itemId: text,
        category: z.enum([
          'textbook',
          'explanation',
          'exercise',
          'answer',
          'ui',
          'cli',
          'operations',
        ]),
        path: text,
        contentDigest: Sha256Schema,
        learningOutcomeIds: z.array(text),
        automatedPassed: z.boolean(),
        requiresHumanReview: z.boolean(),
        humanReviewItemId: z.string().nullable(),
      }),
    )
    .min(1),
  automatedResultDigest: Sha256Schema,
  humanReviewEvidenceIds: unique(text),
  blockingFindingCount: z.number().int().nonnegative(),
  aggregatePassed: z.boolean(),
  generatedAt: OffsetDateTimeSchema,
})
  .superRefine((evidence, context) => {
    const ids = evidence.items.map(({ itemId }) => itemId);
    const requiredHumanReviewIds = evidence.items.flatMap((item) =>
      item.requiresHumanReview && item.humanReviewItemId ? [item.humanReviewItemId] : [],
    );
    const complete =
      evidence.inventoryCount === evidence.items.length &&
      evidence.checkedCount === evidence.items.length &&
      new Set(ids).size === ids.length &&
      evidence.items.every(
        (item) =>
          item.automatedPassed && item.requiresHumanReview === (item.humanReviewItemId !== null),
      ) &&
      (requiredHumanReviewIds.length === 0 || evidence.humanReviewEvidenceIds.length > 0) &&
      evidence.blockingFindingCount === 0;
    if (evidence.aggregatePassed !== complete) {
      context.addIssue({ code: 'custom', message: 'Instruction quality aggregate is stale.' });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: {
          properties: {
            blockingFindingCount: { const: 0 },
            items: { items: { properties: { automatedPassed: { const: true } } } },
          },
        },
      },
    ],
  });

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

const executableExampleKey = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u);
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
    exampleKey: executableExampleKey,
    ...executableExampleEvidenceFields,
  }),
  strictObject({
    ownerType: z.literal('learning_unit'),
    learningUnitId: EntityIdSchema,
    exampleKey: executableExampleKey,
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

export { AnswerMaterialEvidenceContract as AnswerMaterialVerificationEvidenceContract };
export const AnswerMaterialEvidenceSchema = AnswerMaterialEvidenceContract.schema;
const contract = (fileName: `${string}.schema.json`, schema: z.ZodType, title: string) =>
  defineZodContractSchema(fileName, schema, {
    $id: `https://abc-textbook.local/schemas/${fileName}`,
    title,
  });
export const PerformanceEvidenceContract = contract(
  'performance-evidence.schema.json',
  PerformanceEvidenceSchema,
  'ABC Textbook Performance Evidence',
);
export const ExecutableExampleEvidenceContract = contract(
  'executable-example-evidence.schema.json',
  ExecutableExampleEvidenceSchema,
  'ABC Textbook Executable Example Evidence',
);
export const InstructionQualityEvidenceContract = contract(
  'instruction-quality-evidence.schema.json',
  InstructionQualityEvidenceSchema,
  'ABC Textbook Instruction Quality Evidence',
);
export const ClientBundleEvidenceContract = contract(
  'client-bundle-evidence.schema.json',
  ClientBundleEvidenceSchema,
  'ABC Textbook Client Bundle Evidence',
);
export const FilesystemPublishEvidenceContract = contract(
  'filesystem-publish-evidence.schema.json',
  FilesystemPublishEvidenceSchema,
  'ABC Textbook Filesystem Publish Evidence',
);
export const LearningRecordE2eEvidenceContract = contract(
  'learning-record-e2e-evidence.schema.json',
  LearningRecordE2eEvidenceSchema,
  'ABC Textbook Learning Record E2E Evidence',
);
