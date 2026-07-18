import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import { stableProblemId } from '../identity.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../date-time.js';
import {
  ContestIdSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  ProblemLabelSchema,
  SafePathSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);
const releaseVersion = z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u);
const uniqueIds = uniqueArray(EntityIdSchema);

export const AuthoringResultSchema = strictObject({
  problemId: z.string().min(1),
  result: z.enum(['explanation_draft', 'authoring_required', 'blocked']),
  explanationId: EntityIdSchema.nullable(),
  inputPacketPath: z.string().min(1).nullable(),
  holdCode: z.string().min(1).nullable(),
  retryCondition: z.string().min(1).nullable(),
});

const PublicationOperationSchema = strictObject({
  operationId: EntityIdSchema,
  entityType: z.enum([
    'contest',
    'contest_slot',
    'problem',
    'technique_inventory',
    'tag',
    'learning_outcome',
    'learning_unit',
    'placement',
    'explanation',
    'claim',
    'example',
    'exercise',
    'assessment',
    'answer_material',
    'source',
    'correction_impact',
  ]),
  entityId: EntityIdSchema,
  action: z.enum(['add', 'replace', 'remove']),
  path: SafePathSchema,
  beforeDigest: Sha256Schema.nullable(),
  afterDigest: Sha256Schema.nullable(),
  /**
   * The immutable Problem ownership resolved for this operation.  Non-Problem
   * operations can affect more than one Problem, so deriving the update scope
   * from `entityType === "problem"` is not sufficient.
   */
  affectedProblemIds: uniqueArray(ProblemIdSchema).min(1),
});

const PublicationAuthoringResultSchema = strictObject({
  problemId: ProblemIdSchema,
  slotLabel: ProblemLabelSchema,
  resultType: z.enum(['explanation_draft', 'authoring_required', 'blocked']),
  draftPath: SafePathSchema.nullable(),
  packetPath: SafePathSchema.nullable(),
  templatePath: SafePathSchema.nullable(),
  reasonCode: z.string().nullable(),
  reason: z.string().nullable(),
  retryCondition: z.string().nullable(),
}).superRefine((result, context) => {
  const valid =
    result.resultType === 'explanation_draft'
      ? result.draftPath !== null && result.reasonCode === null && result.reason === null
      : result.resultType === 'authoring_required'
        ? result.packetPath !== null &&
          result.templatePath !== null &&
          Boolean(result.reason?.trim())
        : Boolean(
            result.reasonCode?.trim() && result.reason?.trim() && result.retryCondition?.trim(),
          );
  if (!valid)
    context.addIssue({
      code: 'custom',
      message: 'Authoring result fields conflict with resultType.',
    });
});

const PublicationValidationSummarySchema = strictObject({
  checkIds: uniqueIds.min(1),
  problemResults: z.array(
    strictObject({
      problemId: ProblemIdSchema,
      passed: z.boolean(),
      findingCodes: z.array(text),
      remediation: z.string().nullable(),
    }),
  ),
  blockingFindingCount: z.number().int().nonnegative(),
  aggregatePassed: z.boolean(),
  resultDigest: Sha256Schema,
});

export const PublicationUpdateSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  updateId: EntityIdSchema,
  kind: z.enum(['contest_addition', 'correction', 'taxonomy', 'bootstrap']),
  baseReleaseVersion: releaseVersion.nullable(),
  contestId: ContestIdSchema.nullable(),
  sourceSetFingerprint: Sha256Schema,
  advancedSlotLabels: uniqueArray(ProblemLabelSchema),
  /** The immutable set of Problems whose content or taxonomy is affected by this update. */
  targetProblemIds: uniqueArray(ProblemIdSchema),
  operations: z.array(PublicationOperationSchema),
  authoringResults: z.array(PublicationAuthoringResultSchema),
  correctionImpactIds: uniqueIds,
  validationSummary: PublicationValidationSummarySchema,
  state: z.enum(['PREPARING', 'ON_HOLD', 'ELIGIBLE_FOR_BATCH']),
  createdAt: OffsetDateTimeSchema,
  updatedAt: OffsetDateTimeSchema,
  fixtureMode: z.boolean(),
})
  .superRefine((update, context) => {
    const operationIds = update.operations.map(({ operationId }) => operationId);
    if (new Set(operationIds).size !== operationIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['operations'],
        message: 'Operation IDs must be unique.',
      });
    }
    if (update.kind === 'correction' && update.correctionImpactIds.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['correctionImpactIds'],
        message: 'Correction updates must enumerate at least one Correction Impact.',
      });
    }
    if (update.kind !== 'correction' && update.correctionImpactIds.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['correctionImpactIds'],
        message: 'Only correction updates may enumerate Correction Impacts.',
      });
    }
    const problemOperationIds = update.operations
      .filter((operation) => operation.entityType === 'problem')
      .map(({ entityId }) => entityId);
    const operationAffectedProblemIds = update.operations.flatMap(
      ({ affectedProblemIds }) => affectedProblemIds,
    );
    const uniqueOperationAffectedProblemIds = [...new Set(operationAffectedProblemIds)];
    const targetProblemIds = [...update.targetProblemIds].sort();
    const contestId = update.contestId;
    const contestProblemIds =
      update.kind === 'contest_addition' && contestId !== null
        ? update.advancedSlotLabels.map((label) => stableProblemId(contestId, label))
        : [];
    const sameIdSet = (left: readonly string[], right: readonly string[]): boolean => {
      const leftSorted = [...left].sort();
      const rightSorted = [...right].sort();
      return (
        leftSorted.length === rightSorted.length &&
        leftSorted.every((problemId, index) => problemId === rightSorted[index])
      );
    };
    if (
      update.kind === 'contest_addition' &&
      (targetProblemIds.length !== contestProblemIds.length ||
        !sameIdSet(targetProblemIds, contestProblemIds) ||
        !sameIdSet(problemOperationIds, targetProblemIds) ||
        !sameIdSet(uniqueOperationAffectedProblemIds, targetProblemIds))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['targetProblemIds'],
        message: 'Contest targets must exactly match advanced slot labels.',
      });
    }
    const targetSet = new Set(targetProblemIds);
    if (
      new Set(problemOperationIds).size !== problemOperationIds.length ||
      problemOperationIds.some((problemId) => !targetSet.has(problemId)) ||
      operationAffectedProblemIds.some((problemId) => !targetSet.has(problemId)) ||
      !sameIdSet(uniqueOperationAffectedProblemIds, targetProblemIds)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['targetProblemIds'],
        message:
          'Operation affected Problem IDs must exactly match targetProblemIds, and every Problem operation must name itself.',
      });
    }
    for (const operation of update.operations) {
      if (
        operation.entityType === 'problem' &&
        !sameIdSet(operation.affectedProblemIds, [operation.entityId])
      ) {
        context.addIssue({
          code: 'custom',
          path: ['operations'],
          message: 'A Problem operation must affect exactly its own Problem ID.',
        });
      }
    }
    const authoringIds = update.authoringResults.map(({ problemId }) => problemId);
    const validationIds = update.validationSummary.problemResults.map(({ problemId }) => problemId);
    const sameTargets = (ids: readonly string[]): boolean =>
      ids.length === targetProblemIds.length &&
      new Set(ids).size === ids.length &&
      [...ids].sort().every((id, index) => id === targetProblemIds[index]);
    if (
      update.state === 'ELIGIBLE_FOR_BATCH' &&
      (targetProblemIds.length === 0 ||
        !sameTargets(authoringIds) ||
        !sameTargets(validationIds) ||
        update.authoringResults.some((result) => result.resultType !== 'explanation_draft') ||
        !update.validationSummary.aggregatePassed ||
        update.validationSummary.blockingFindingCount !== 0 ||
        update.validationSummary.problemResults.some(
          (result) => !result.passed || result.findingCodes.length > 0,
        ))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['state'],
        message: 'ELIGIBLE_FOR_BATCH requires every authoring and validation result to pass.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { state: { const: 'ELIGIBLE_FOR_BATCH' } }, required: ['state'] },
        then: {
          properties: {
            authoringResults: {
              minItems: 1,
              items: { properties: { resultType: { const: 'explanation_draft' } } },
            },
            validationSummary: {
              properties: {
                aggregatePassed: { const: true },
                blockingFindingCount: { const: 0 },
                problemResults: {
                  items: {
                    properties: { passed: { const: true }, findingCodes: { maxItems: 0 } },
                  },
                },
              },
            },
          },
        },
      },
    ],
  });

const CandidateFileSchema = strictObject({
  path: SafePathSchema,
  sha256: Sha256Schema,
  byteLength: z.number().int().nonnegative(),
});
const CandidateCheckRefSchema = strictObject({
  checkId: EntityIdSchema,
  checkType: z.enum([
    'automated',
    'human_content_review',
    'learner_outcome',
    'user_timing',
    'other',
  ]),
  subjectDigest: Sha256Schema,
  command: text,
  exitCode: z.literal(0),
  resultPath: SafePathSchema,
  resultDigest: Sha256Schema,
  completedAt: OffsetDateTimeSchema,
});
const CandidateReviewRefSchema = strictObject({
  evidenceId: EntityIdSchema,
  path: SafePathSchema,
  digest: Sha256Schema,
  subjectDigest: Sha256Schema,
  reviewerExecutedCheckSetDigest: Sha256Schema,
  aggregatePassed: z.literal(true),
});
const CandidateFindingSchema = strictObject({
  code: text,
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  entityId: z.string().nullable(),
  message: text,
  resolved: z.boolean(),
});
const OwnerApprovalSchema = strictObject({
  ownerId: EntityIdSchema,
  approvedDigest: Sha256Schema,
  approvedAt: OffsetDateTimeSchema,
});

export const ReleaseCandidateSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  candidateId: z.string().regex(/^release-candidate-\d{4}\.\d{2}\.\d+-[a-f0-9]{12,64}$/u),
  releaseKind: z.enum(['initial', 'incremental']),
  targetReleaseVersion: releaseVersion,
  baseReleaseVersion: releaseVersion.nullable(),
  cutoffAt: OffsetDateTimeSchema,
  orderedUpdateIds: uniqueIds.min(1),
  fixtureMode: z.boolean(),
  advancedSlotRegistryDigest: Sha256Schema,
  contentFiles: z.array(CandidateFileSchema),
  contentSubjectDigest: Sha256Schema,
  preJudgmentCheckRefs: z.array(CandidateCheckRefSchema),
  humanContentReviewEvidenceRefs: z.array(CandidateReviewRefSchema),
  blockingFindings: z.array(CandidateFindingSchema),
  candidateFiles: z.array(CandidateFileSchema),
  candidatePayloadDigest: Sha256Schema.nullable(),
  approvableDigest: Sha256Schema.nullable(),
  ownerApproval: OwnerApprovalSchema.nullable(),
  publicationEffectiveAt: OffsetDateTimeSchema.nullable(),
  publicationWindowEndsAt: OffsetDateTimeSchema.nullable(),
  state: z.enum([
    'DRAFTED',
    'VALIDATING',
    'AWAITING_REVIEW',
    'AWAITING_OWNER_APPROVAL',
    'AWAITING_FINAL_VALIDATION',
    'READY_TO_PUBLISH',
    'ON_HOLD',
    'PUBLISHED',
    'EXPIRED',
  ]),
  createdAt: OffsetDateTimeSchema,
  updatedAt: OffsetDateTimeSchema,
})
  .superRefine((candidate, context) => {
    for (const [path, files] of [
      ['contentFiles', candidate.contentFiles],
      ['candidateFiles', candidate.candidateFiles],
    ] as const) {
      if (new Set(files.map((file) => file.path)).size !== files.length) {
        context.addIssue({ code: 'custom', path: [path], message: 'File paths must be unique.' });
      }
    }
    if (!['READY_TO_PUBLISH', 'PUBLISHED'].includes(candidate.state)) return;
    const complete =
      candidate.contentFiles.length > 0 &&
      !candidate.fixtureMode &&
      candidate.candidateFiles.length > 0 &&
      candidate.preJudgmentCheckRefs.length > 0 &&
      candidate.preJudgmentCheckRefs.every(
        (check) => check.subjectDigest === candidate.contentSubjectDigest,
      ) &&
      candidate.humanContentReviewEvidenceRefs.length > 0 &&
      candidate.humanContentReviewEvidenceRefs.every(
        (review) => review.subjectDigest === candidate.contentSubjectDigest,
      ) &&
      candidate.blockingFindings.every((finding) => finding.resolved) &&
      candidate.candidatePayloadDigest !== null &&
      candidate.approvableDigest !== null &&
      candidate.ownerApproval !== null &&
      candidate.ownerApproval.approvedDigest === candidate.approvableDigest &&
      candidate.publicationEffectiveAt !== null &&
      candidate.publicationWindowEndsAt !== null &&
      compareOffsetDateTimes(
        parseOffsetDateTime(candidate.publicationEffectiveAt),
        parseOffsetDateTime(candidate.publicationWindowEndsAt),
      ) <= 0;
    if (!complete) {
      context.addIssue({
        code: 'custom',
        path: ['state'],
        message: 'Publishable state requires a fixed, approved, fully validated candidate.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: {
          properties: { state: { enum: ['READY_TO_PUBLISH', 'PUBLISHED'] } },
          required: ['state'],
        },
        then: {
          properties: {
            contentFiles: { minItems: 1 },
            fixtureMode: { const: false },
            preJudgmentCheckRefs: { minItems: 1 },
            humanContentReviewEvidenceRefs: { minItems: 1 },
            candidateFiles: { minItems: 1 },
            candidatePayloadDigest: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            approvableDigest: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            ownerApproval: { type: 'object' },
            publicationEffectiveAt: { type: 'string' },
            publicationWindowEndsAt: { type: 'string' },
          },
        },
      },
    ],
  });

export const ImmutableReleaseSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  version: releaseVersion,
  cutoffAt: OffsetDateTimeSchema,
  contentSnapshotDigest: Sha256Schema,
  updateIds: uniqueIds.min(1),
  publishedAt: OffsetDateTimeSchema,
}).readonly();
export const ReleaseSchema = ImmutableReleaseSchema;

export const PublishReceiptSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  receiptId: z.string().regex(/^publish-receipt-\d{4}\.\d{2}\.\d+-[a-f0-9]{12,64}$/u),
  receiptPath: z.string().regex(/^docs\/verification\/publish-receipts\/\d{4}\.\d{2}\.\d+\.json$/u),
  candidateId: z.string().regex(/^release-candidate-\d{4}\.\d{2}\.\d+-[a-f0-9]{12,64}$/u),
  releaseVersion,
  contentSnapshotDigest: Sha256Schema,
  candidatePayloadDigest: Sha256Schema,
  approvableDigest: Sha256Schema,
  publicationEffectiveAt: OffsetDateTimeSchema,
  publicationWindowEndsAt: OffsetDateTimeSchema,
  actualAtomicSwapAt: OffsetDateTimeSchema,
  osFamily: z.enum(['windows', 'macos', 'linux']),
  osVersion: text,
  filesystem: text,
  toolVersions: z.record(z.string(), text).refine((value) => Object.keys(value).length > 0),
  previousReleaseVersion: releaseVersion.nullable(),
  newReleaseVersion: releaseVersion,
  result: z.literal('published'),
  rawEvidenceDigest: Sha256Schema,
  recordedAt: OffsetDateTimeSchema,
});

const contract = (fileName: `${string}.schema.json`, schema: z.ZodType, title: string) =>
  defineZodContractSchema(fileName, schema, {
    $id: `https://abc-textbook.local/schemas/${fileName}`,
    title,
  });

export const UpdateManifestContract = contract(
  'update-manifest.schema.json',
  PublicationUpdateSchema,
  'ABC Textbook Publication Update',
);
export const ReleaseCandidateContract = contract(
  'release-candidate.schema.json',
  ReleaseCandidateSchema,
  'ABC Textbook Release Candidate',
);
export const PublishReceiptContract = contract(
  'publish-receipt.schema.json',
  PublishReceiptSchema,
  'ABC Textbook Publish Receipt',
);
