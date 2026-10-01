import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import {
  ContentReviewModeSchema,
  ContentReviewRiskReasonSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  ProblemLabelSchema,
  SafePathSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);
const unique = uniqueArray;
const portablePath = z
  .string()
  .regex(
    /^(?!.*(?:^|\/)(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.[A-Za-z0-9._-]+)?(?:\/|$))(?:[A-Za-z0-9._-]*[A-Za-z0-9_-])(?:\/[A-Za-z0-9._-]*[A-Za-z0-9_-])*$/iu,
  );
const personId = z.string().regex(/^person-[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const outcomeId = z.string().regex(/^outcome-[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const state = z.enum(['planned', 'in_progress', 'verified', 'complete', 'blocked']);
const changeKind = z.enum([
  'content',
  'schema',
  'domain',
  'tooling',
  'abstraction',
  'documentation',
  'test',
  'operations',
  'mixed',
]);
const outcomeImpact = strictObject({
  kind: z.enum(['affects_learning_outcomes', 'none']),
  rationale: text,
});
const reviewPolicy = strictObject({
  requiredMode: ContentReviewModeSchema,
  riskReasons: unique(ContentReviewRiskReasonSchema),
  highRiskSelfReviewReason: z.literal('solo_maintainer').optional(),
}).superRefine((policy, context) => {
  const isHighRisk = policy.riskReasons.length > 0;
  const isSoloMaintainerSelfReview = policy.highRiskSelfReviewReason === 'solo_maintainer';
  const valid =
    (!isHighRisk && policy.requiredMode === 'self' && !isSoloMaintainerSelfReview) ||
    (isHighRisk && policy.requiredMode === 'third_party' && !isSoloMaintainerSelfReview) ||
    (isHighRisk && policy.requiredMode === 'self' && isSoloMaintainerSelfReview);
  if (!valid) {
    context.addIssue({
      code: 'custom',
      path: ['requiredMode'],
      message:
        'High-risk self-review requires the explicit solo-maintainer reason; other high-risk changes require third-party review.',
    });
  }
});

const reviewUnit = strictObject({
  reviewUnitId: z.string().regex(/^RU-T\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  changeKind,
  itemIds: unique(z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/u)).min(1),
  requirementIds: unique(z.string().regex(/^(?:FR|SC|CQ)-\d{3}$/u)).min(1),
  learningOutcomeIds: unique(outcomeId),
  outcomeImpact,
  paths: unique(portablePath).min(1),
  dependencyReviewUnitIds: unique(z.string().regex(/^RU-T\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/u)),
  checkIds: unique(z.string().regex(/^check-[a-z0-9]+(?:-[a-z0-9]+)*$/u)).min(1),
  evidenceRoles: unique(z.string().regex(/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/u)).min(1),
  maintenanceBenefit: text.nullable(),
  owner: personId,
  status: state,
}).superRefine((unit, context) => {
  if (['tooling', 'abstraction'].includes(unit.changeKind) && unit.maintenanceBenefit === null)
    context.addIssue({
      code: 'custom',
      path: ['maintenanceBenefit'],
      message: 'Tooling/abstraction requires a maintenance benefit.',
    });
  if (unit.changeKind === 'content' && unit.learningOutcomeIds.length === 0)
    context.addIssue({
      code: 'custom',
      path: ['learningOutcomeIds'],
      message: 'Content requires learning outcomes.',
    });
  const expectedImpact =
    unit.learningOutcomeIds.length === 0 ? 'none' : 'affects_learning_outcomes';
  if (unit.outcomeImpact.kind !== expectedImpact)
    context.addIssue({
      code: 'custom',
      path: ['outcomeImpact'],
      message: 'Outcome impact conflicts with outcome IDs.',
    });
});

export const ContentWorkManifestSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  manifestId: z.string().regex(/^work-manifest-T\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/u),
  taskId: z.string().regex(/^T\d{3}$/u),
  scopeDigest: Sha256Schema,
  digest: Sha256Schema,
  changeKind,
  requiredRequirementIds: unique(z.string().regex(/^(?:FR|SC|CQ)-\d{3}$/u)).min(1),
  learningOutcomeIds: unique(outcomeId),
  outcomeImpact,
  reviewPolicy,
  reviewUnits: z.array(reviewUnit).min(1),
  maintenanceBenefit: text.nullable(),
  state,
  createdAt: OffsetDateTimeSchema,
  updatedAt: OffsetDateTimeSchema,
});

const applicableCheck = strictObject({
  checkId: z.string().regex(/^check-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  command: text,
  subjectDigest: Sha256Schema,
  resultPath: portablePath,
  resultDigest: Sha256Schema,
  exitCode: z.number().int(),
  passed: z.boolean(),
  completedAt: OffsetDateTimeSchema,
  executedByReviewerId: personId,
});
const reviewFinding = strictObject({
  findingId: z.string().regex(/^human-review-finding-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  severity: z.enum(['blocking', 'advisory']),
  description: text,
  resolved: z.boolean(),
  evidenceRefs: unique(text).min(1),
});
const reviewItem = strictObject({
  reviewItemId: z.string().regex(/^human-review-item-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  kind: z.enum(['outcome_coverage', 'non_automatable_claim', 'non_automatable_example']),
  subjectPaths: unique(portablePath).min(1),
  authorIds: unique(personId).min(1),
  learningOutcomeIds: unique(outcomeId),
  reviewerId: personId,
  reviewBasis: text,
  decision: z.enum(['approved', 'changes_requested']),
  findings: z.array(reviewFinding),
  reviewedAt: OffsetDateTimeSchema,
}).superRefine((item, context) => {
  if (item.kind === 'outcome_coverage' && item.learningOutcomeIds.length === 0)
    context.addIssue({
      code: 'custom',
      path: ['learningOutcomeIds'],
      message: 'Outcome coverage requires an outcome.',
    });
  if (
    item.decision === 'approved' &&
    item.findings.some((finding) => finding.severity === 'blocking' && !finding.resolved)
  )
    context.addIssue({
      code: 'custom',
      path: ['findings'],
      message: 'Approved items cannot have unresolved blocking findings.',
    });
});
const outcomeCoverageReview = strictObject({
  reviewerId: personId,
  authorIds: unique(personId).min(1),
  decision: z.enum(['confirmed', 'no_outcome_impact_confirmed']),
  learningOutcomeIds: unique(outcomeId),
  subjectPaths: unique(portablePath).min(1),
  rationale: text,
  noOutcomeImpactRationale: text.nullable(),
  confirmedAt: OffsetDateTimeSchema,
}).superRefine((review, context) => {
  const valid =
    review.decision === 'confirmed'
      ? review.learningOutcomeIds.length > 0 && review.noOutcomeImpactRationale === null
      : review.learningOutcomeIds.length === 0 && review.noOutcomeImpactRationale !== null;
  if (!valid)
    context.addIssue({
      code: 'custom',
      message: 'Outcome coverage fields conflict with decision.',
    });
});

export const HumanContentReviewEvidenceSchema = strictObject({
  schemaVersion: z.literal('3.0.0'),
  id: z.string().regex(/^human-content-review-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  scopeType: z.enum(['merge', 'release']),
  scopeId: text,
  releaseVersion: z
    .string()
    .regex(/^\d{4}\.\d{2}\.\d{2}$/u)
    .nullable(),
  subjectDigest: Sha256Schema,
  inventoryPath: portablePath,
  inventoryDigest: Sha256Schema,
  reviewPolicy,
  reviewMode: ContentReviewModeSchema,
  applicableChecks: z.array(applicableCheck).min(1),
  applicableCheckCount: z.number().int().positive(),
  passedApplicableCheckCount: z.number().int().nonnegative(),
  reviewerExecutedCheckSetDigest: Sha256Schema,
  authors: z.array(strictObject({ personId, authoredItemIds: unique(text).min(1) })).min(1),
  reviewer: strictObject({ personId, mode: ContentReviewModeSchema }),
  reviewItems: z.array(reviewItem),
  inventoryItemCount: z.number().int().nonnegative(),
  reviewedItemCount: z.number().int().nonnegative(),
  approvedItemCount: z.number().int().nonnegative(),
  changesRequestedItemCount: z.number().int().nonnegative(),
  unreviewedItemCount: z.number().int().nonnegative(),
  outcomeCoverageReview,
  outcomeCoverageConfirmed: z.boolean(),
  aggregatePassed: z.boolean(),
  generatedAt: OffsetDateTimeSchema,
  evidenceDigest: Sha256Schema,
})
  .superRefine((evidence, context) => {
    const mergePaths = evidence.scopeType === 'merge';
    if (mergePaths !== (evidence.releaseVersion === null))
      context.addIssue({
        code: 'custom',
        path: ['releaseVersion'],
        message: 'Release version conflicts with scope.',
      });
    if (
      evidence.reviewer.mode !== evidence.reviewMode ||
      evidence.reviewMode !== evidence.reviewPolicy.requiredMode ||
      (evidence.aggregatePassed &&
        (!evidence.outcomeCoverageConfirmed ||
          evidence.changesRequestedItemCount !== 0 ||
          evidence.unreviewedItemCount !== 0 ||
          evidence.applicableChecks.some((check) => !check.passed || check.exitCode !== 0) ||
          evidence.reviewItems.some((item) => item.decision !== 'approved')))
    )
      context.addIssue({
        code: 'custom',
        path: ['aggregatePassed'],
        message: 'Aggregate success requires every review and check to pass.',
      });
  })
  .meta({
    allOf: [
      {
        oneOf: [
          {
            properties: {
              reviewPolicy: {
                properties: { requiredMode: { const: 'self' } },
                required: ['requiredMode'],
              },
              reviewMode: { const: 'self' },
            },
            required: ['reviewPolicy', 'reviewMode'],
          },
          {
            properties: {
              reviewPolicy: {
                properties: { requiredMode: { const: 'third_party' } },
                required: ['requiredMode'],
              },
              reviewMode: { const: 'third_party' },
            },
            required: ['reviewPolicy', 'reviewMode'],
          },
        ],
      },
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: {
          properties: {
            outcomeCoverageConfirmed: { const: true },
            changesRequestedItemCount: { const: 0 },
            unreviewedItemCount: { const: 0 },
            applicableChecks: {
              items: { properties: { exitCode: { const: 0 }, passed: { const: true } } },
            },
            reviewItems: { items: { properties: { decision: { const: 'approved' } } } },
          },
        },
      },
    ],
  });

const fileEntry = strictObject({
  path: SafePathSchema,
  sha256: Sha256Schema,
  byteLength: z.number().int().nonnegative(),
});
export const MergeReviewEvidenceSchema = strictObject({
  schemaVersion: z.literal('3.0.0'),
  id: EntityIdSchema,
  changeId: EntityIdSchema,
  logicalChangeSubjectDigest: Sha256Schema,
  subjectFiles: z.array(fileEntry).min(1),
  excludedArtifacts: z.array(fileEntry),
  workManifestPath: SafePathSchema,
  workManifestDigest: Sha256Schema,
  learningOutcomeIds: unique(EntityIdSchema),
  outcomeImpact,
  reviewMode: ContentReviewModeSchema,
  reviewerId: EntityIdSchema,
  applicableChecks: z
    .array(
      strictObject({
        checkId: EntityIdSchema,
        executedByReviewerId: EntityIdSchema,
        command: text,
        subjectDigest: Sha256Schema,
        resultPath: SafePathSchema,
        resultDigest: Sha256Schema,
        rawResultPath: SafePathSchema,
        rawResultDigest: Sha256Schema,
        exitCode: z.number().int(),
        completedAt: OffsetDateTimeSchema,
      }),
    )
    .min(1),
  notApplicableChecks: z.array(strictObject({ checkId: EntityIdSchema, rationale: text })),
  humanContentReviewEvidenceId: EntityIdSchema,
  humanContentReviewEvidencePath: SafePathSchema,
  humanContentReviewEvidenceDigest: Sha256Schema,
  constitutionCheck: strictObject({
    constitutionPath: z.literal('.specify/memory/constitution.md'),
    constitutionVersion: z.literal('3.0.0'),
    constitutionDigest: Sha256Schema,
    dependentTemplates: z.array(fileEntry).min(1),
    violationCount: z.number().int().nonnegative(),
    passed: z.boolean(),
    checkedAt: OffsetDateTimeSchema,
  }),
  unresolvedBlockingFindingCount: z.number().int().nonnegative(),
  mergeApproved: z.boolean(),
  reviewedAt: OffsetDateTimeSchema,
  evidenceDigest: Sha256Schema,
})
  .superRefine((evidence, context) => {
    const applicableIds = evidence.applicableChecks.map(({ checkId }) => checkId);
    const notApplicableIds = evidence.notApplicableChecks.map(({ checkId }) => checkId);
    if (
      new Set(applicableIds).size !== applicableIds.length ||
      new Set(notApplicableIds).size !== notApplicableIds.length ||
      applicableIds.some((id) => notApplicableIds.includes(id))
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Check classifications must be unique and disjoint.',
      });
    }
    if (
      evidence.mergeApproved &&
      (evidence.applicableChecks.some((check) => check.exitCode !== 0) ||
        !evidence.constitutionCheck.passed ||
        evidence.constitutionCheck.violationCount !== 0 ||
        evidence.unresolvedBlockingFindingCount !== 0)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['mergeApproved'],
        message: 'Merge approval requires all checks and findings to pass.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { mergeApproved: { const: true } }, required: ['mergeApproved'] },
        then: {
          properties: {
            applicableChecks: { items: { properties: { exitCode: { const: 0 } } } },
            constitutionCheck: {
              properties: { passed: { const: true }, violationCount: { const: 0 } },
            },
            unresolvedBlockingFindingCount: { const: 0 },
          },
        },
      },
    ],
  });

const learnerRubricItem = strictObject({ itemId: EntityIdSchema, description: text });
const learnerProtocol = strictObject({
  protocolId: EntityIdSchema,
  releaseDigest: Sha256Schema,
  fixedAt: OffsetDateTimeSchema,
  sc009Items: z
    .array(
      strictObject({
        itemId: EntityIdSchema,
        order: z.number().int().positive(),
        problemId: EntityIdSchema,
        slotLabel: ProblemLabelSchema,
        primaryGenre: text,
        expectedElements: z.array(text).min(4),
        rubricId: EntityIdSchema,
      }),
    )
    .min(5),
  sc010Items: z
    .array(
      strictObject({
        itemId: EntityIdSchema,
        order: z.number().int().positive(),
        currentUnitId: EntityIdSchema,
        primaryGenre: z.enum([
          'graph',
          'dynamic-programming',
          'data-structure',
          'mathematics',
          'other',
        ]),
        expectedNextUnitId: EntityIdSchema,
        expectedPrerequisiteIds: z.array(EntityIdSchema),
        expectedProblemId: EntityIdSchema,
        rubricId: EntityIdSchema,
      }),
    )
    .min(5)
    .optional(),
  rubrics: z
    .array(
      strictObject({
        rubricId: EntityIdSchema,
        blockingItemIds: unique(EntityIdSchema).min(1),
        items: z.array(learnerRubricItem).min(1),
      }),
    )
    .min(1),
  passingRatio: z.literal(0.8),
});
const criterionResult = strictObject({
  criterionId: z.enum(['SC-009', 'SC-010']),
  protocolId: EntityIdSchema,
  releaseDigest: Sha256Schema,
  itemResults: z
    .array(
      strictObject({
        itemId: EntityIdSchema,
        rawAnswerPath: SafePathSchema,
        rawAnswerDigest: Sha256Schema,
        rubricDecisions: z
          .array(
            strictObject({
              rubricItemId: EntityIdSchema,
              decision: z.enum(['pass', 'fail']),
              rationale: text,
            }),
          )
          .min(1),
        allBlockingPassed: z.boolean(),
        evidenceNotes: text,
      }),
    )
    .min(5),
  passedItemCount: z.number().int().nonnegative(),
  totalItemCount: z.number().int().min(5),
  passRatio: z.number().min(0).max(1),
  passed: z.boolean(),
});
export const LearnerOutcomeEvidenceSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  evidenceId: EntityIdSchema,
  releaseVersion: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u),
  releaseDigest: Sha256Schema,
  operatorId: EntityIdSchema,
  protocol: learnerProtocol,
  results: z
    .array(criterionResult)
    .min(1)
    .max(2)
    .refine(
      (items) =>
        items.some(({ criterionId }) => criterionId === 'SC-009') &&
        new Set(items.map(({ criterionId }) => criterionId)).size === items.length,
      'SC-009 is required; legacy SC-010 evidence is optional and criteria must be unique.',
    )
    .meta({
      contains: {
        properties: { criterionId: { const: 'SC-009' } },
        required: ['criterionId'],
      },
      minContains: 1,
      maxContains: 1,
    }),
  rawManifest: strictObject({
    path: SafePathSchema,
    digest: Sha256Schema,
    fileCount: z.number().int().positive(),
    files: z.array(fileEntry).min(1),
  }),
  aggregatePassed: z.boolean(),
  generatedAt: OffsetDateTimeSchema,
});

const directActions = z
  .array(z.enum(['set_status_completed', 'set_needs_review_true']))
  .length(2)
  .refine((items) => new Set(items).size === 2);
const componentFile = strictObject({
  path: z.string().regex(/^(?:src\/components|src\/lib\/learning-records)\/.+\.(?:astro|ts|tsx)$/u),
  digest: Sha256Schema,
  byteLength: z.number().int().positive(),
});
const actionContract = strictObject({
  contractId: z.literal('learning-record-direct-actions'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/u),
  path: portablePath,
  digest: Sha256Schema,
  requiredActions: directActions,
});
const routeEquivalenceProtocol = strictObject({
  inventoryPath: portablePath,
  inventoryDigest: Sha256Schema,
  inventoryCount: z.number().int().positive(),
  sharedComponents: z.array(componentFile).min(1),
  sharedComponentSetDigest: Sha256Schema,
  actionContract,
  representativeProblemId: ProblemIdSchema,
  expectedCheckedRouteCount: z.number().int().positive(),
});
const routeCheck = strictObject({
  problemId: ProblemIdSchema,
  routePath: text,
  routeDigest: Sha256Schema,
  sharedComponentSetDigest: Sha256Schema,
  actionContractDigest: Sha256Schema,
  sharedComponentRendered: z.boolean(),
  requiredActions: directActions,
  checkResultPath: portablePath,
  checkResultDigest: Sha256Schema,
  status: z.enum(['passed', 'failed']),
  checkedAt: OffsetDateTimeSchema,
});
const routeEquivalenceResult = strictObject({
  inventoryPath: portablePath,
  inventoryDigest: Sha256Schema,
  inventoryCount: z.number().int().positive(),
  sharedComponents: z.array(componentFile).min(1),
  sharedComponentSetDigest: Sha256Schema,
  actionContract,
  representativeProblemId: ProblemIdSchema,
  routeChecks: z.array(routeCheck).min(1),
  checkedRouteCount: z.number().int().nonnegative(),
  passedRouteCount: z.number().int().nonnegative(),
  failedRouteCount: z.number().int().nonnegative(),
  aggregatePassed: z.boolean(),
  failureReasons: unique(text),
});
const timingBase = {
  schemaVersion: z.literal('1.1.0'),
  criterionId: z.literal('SC-012'),
  releaseVersion: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u),
  releaseDigest: Sha256Schema,
  revision: z.number().int().positive(),
  actorRole: z.literal('sole_operator_learner'),
  problemId: ProblemIdSchema,
};
const timingProtocol = strictObject({
  ...timingBase,
  documentKind: z.literal('user_timing_protocol'),
  artifactPath: portablePath,
  routeEquivalence: routeEquivalenceProtocol,
  fixedAt: OffsetDateTimeSchema,
  measurementStartsAfter: OffsetDateTimeSchema,
  startMarker: z.literal('problem-detail-render-complete'),
  endMarker: z.literal('both-save-confirmations-visible'),
  requiredOperations: directActions,
  additionalNavigationAllowed: z.literal(false),
  externalInstructionsAllowed: z.literal(false),
  clockKind: z.literal('monotonic'),
  maximumDurationMs: z.literal(30000),
  reloadAssertions: z
    .array(
      z.enum([
        'status_completed',
        'needs_review_true',
        'status_updated_at_preserved',
        'review_updated_at_preserved',
      ]),
    )
    .length(4),
  protocolDigest: Sha256Schema,
});
const timingResult = strictObject({
  ...timingBase,
  documentKind: z.literal('user_timing_result'),
  artifactPath: portablePath,
  protocolPath: portablePath,
  protocolDigest: Sha256Schema,
  routeEquivalence: routeEquivalenceResult,
  startMarker: z.literal('problem-detail-render-complete'),
  endMarker: z.literal('both-save-confirmations-visible'),
  startedMonotonicMs: z.number().nonnegative(),
  completedMonotonicMs: z.number().nonnegative(),
  durationMs: z.number().nonnegative(),
  operations: z
    .array(
      strictObject({
        operation: z.enum(['set_status_completed', 'set_needs_review_true']),
        completedMonotonicMs: z.number().nonnegative(),
        saveConfirmationObserved: z.boolean(),
        persistedUpdatedAt: OffsetDateTimeSchema,
      }),
    )
    .length(2),
  additionalNavigationCount: z.number().int().nonnegative(),
  externalInstructionUsed: z.boolean(),
  reloadCompleted: z.boolean(),
  reloadedStatus: z.enum(['not_started', 'in_progress', 'completed']),
  reloadedNeedsReview: z.boolean(),
  reloadedStatusUpdatedAt: OffsetDateTimeSchema,
  reloadedReviewUpdatedAt: OffsetDateTimeSchema,
  statusUpdatedAtPreserved: z.boolean(),
  reviewUpdatedAtPreserved: z.boolean(),
  passed: z.boolean(),
  failureReasons: unique(text),
  rawFiles: z
    .array(
      strictObject({
        path: portablePath,
        sha256: Sha256Schema,
        byteLength: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  rawEvidenceDigest: Sha256Schema,
  generatedAt: OffsetDateTimeSchema,
  resultDigest: Sha256Schema,
});
export const UserTimingEvidenceSchema = z.discriminatedUnion('documentKind', [
  timingProtocol,
  timingResult,
]);

const contract = (fileName: `${string}.schema.json`, schema: z.ZodType, title: string) =>
  defineZodContractSchema(fileName, schema, {
    $id: `https://abc-textbook.local/schemas/${fileName}`,
    title,
  });
export const ContentWorkManifestContract = contract(
  'content-work-manifest.schema.json',
  ContentWorkManifestSchema,
  'ABC Textbook Content Work Manifest',
);
export const HumanContentReviewEvidenceContract = contract(
  'human-content-review-evidence.schema.json',
  HumanContentReviewEvidenceSchema,
  'ABC Textbook Self or Third-Party Content Review Evidence',
);
export const MergeReviewEvidenceContract = contract(
  'merge-review.schema.json',
  MergeReviewEvidenceSchema,
  'ABC Textbook Merge Review Evidence',
);
export const LearnerOutcomeEvidenceContract = contract(
  'learner-outcome-evidence.schema.json',
  LearnerOutcomeEvidenceSchema,
  'ABC Textbook Learner Outcome Evidence',
);
export const UserTimingEvidenceContract = contract(
  'user-timing-evidence.schema.json',
  UserTimingEvidenceSchema,
  'ABC Textbook Sole User Timing Evidence',
);
