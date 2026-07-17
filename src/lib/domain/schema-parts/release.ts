import { z } from 'zod';

import { defineZodContractSchema, strictObject } from '../contract-schema.js';
import {
  ContestIdSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemLabelSchema,
  SafePathSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);
const releaseVersion = z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u);
const uniqueIds = z.array(EntityIdSchema).meta({ uniqueItems: true });

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
});

const PublicationAuthoringResultSchema = strictObject({
  problemId: EntityIdSchema,
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
      problemId: EntityIdSchema,
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
  advancedSlotLabels: z.array(ProblemLabelSchema).meta({ uniqueItems: true }),
  operations: z.array(PublicationOperationSchema),
  authoringResults: z.array(PublicationAuthoringResultSchema),
  correctionImpactIds: uniqueIds,
  validationSummary: PublicationValidationSummarySchema,
  state: z.enum(['PREPARING', 'ON_HOLD', 'ELIGIBLE_FOR_BATCH']),
  createdAt: OffsetDateTimeSchema,
  updatedAt: OffsetDateTimeSchema,
  fixtureMode: z.boolean(),
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
  candidateId: EntityIdSchema,
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
