import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import { stableProblemId } from '../identity.js';
import {
  ContestIdSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  ProblemLabelSchema,
  SafePathSchema,
  ReleaseVersionSchema,
  Sha256Schema,
} from './catalog.js';

const text = z.string().trim().min(1);
const releaseVersion = ReleaseVersionSchema;
const uniqueIds = uniqueArray(EntityIdSchema);

export const AuthoringResultSchema = strictObject({
  problemId: z.string().min(1),
  result: z.enum(['authoring_unit_draft', 'authoring_required', 'blocked']),
  authoringUnitProblemId: ProblemIdSchema.nullable(),
  inputPacketPath: z.string().min(1).nullable(),
  holdCode: z.string().min(1).nullable(),
  retryCondition: z.string().min(1).nullable(),
});

const PublicationEntityTypeSchema = z.enum([
  'contest',
  'contest_gap',
  'contest_slot',
  'problem',
  'technique_inventory',
  'tag',
  'learning_outcome',
  'learning_unit',
  'placement',
  'authoring_unit',
  'source',
  'correction_impact',
]);

const PublicationEntityDiffSchema = strictObject({
  entityType: PublicationEntityTypeSchema,
  entityId: EntityIdSchema,
  action: z.enum(['add', 'replace', 'remove']),
});

const PublicationOperationSchema = strictObject({
  operationId: EntityIdSchema,
  /** A Catalog entity that owns this path and anchors the file transition. */
  entityType: PublicationEntityTypeSchema,
  entityId: EntityIdSchema,
  /** The action of the file transition, independent of Catalog entity actions. */
  action: z.enum(['add', 'replace', 'remove']),
  path: SafePathSchema,
  beforeDigest: Sha256Schema.nullable(),
  afterDigest: Sha256Schema.nullable(),
  /** Canonical Catalog projection diffs whose changed source set includes this path. */
  affectedEntities: uniqueArray(PublicationEntityDiffSchema),
  /**
   * The immutable Problem ownership resolved for this operation.  Non-Problem
   * operations can affect more than one Problem, so deriving the update scope
   * from `entityType === "problem"` is not sufficient.
   */
  affectedProblemIds: uniqueArray(ProblemIdSchema),
});

const PublicationAuthoringResultSchema = strictObject({
  problemId: ProblemIdSchema,
  slotLabel: ProblemLabelSchema,
  resultType: z.enum(['authoring_unit_draft', 'authoring_required', 'blocked']),
  draftPath: SafePathSchema.nullable(),
  packetPath: SafePathSchema.nullable(),
  templatePath: SafePathSchema.nullable(),
  reasonCode: z.string().nullable(),
  reason: z.string().nullable(),
  retryCondition: z.string().nullable(),
}).superRefine((result, context) => {
  const valid =
    result.resultType === 'authoring_unit_draft'
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
    const operationPaths = update.operations.map(({ path }) => path);
    if (new Set(operationPaths).size !== operationPaths.length) {
      context.addIssue({
        code: 'custom',
        path: ['operations'],
        message: 'Each file transition path must be represented by exactly one operation.',
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
      (update.kind !== 'bootstrap' &&
        !sameIdSet(uniqueOperationAffectedProblemIds, targetProblemIds))
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
        update.authoringResults.some((result) => result.resultType !== 'authoring_unit_draft') ||
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
              items: { properties: { resultType: { const: 'authoring_unit_draft' } } },
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

const GitCommitSchema = z
  .string()
  .regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u, 'A full Git commit object ID is required.');
const ValidationResultsUrlSchema = z
  .url()
  .regex(/^https:\/\//u, 'Validation results must use HTTPS.')
  .meta({ format: 'uri' });

export const ReleaseChangeSummarySchema = strictObject({
  updateIds: uniqueIds.min(1),
  addedProblemIds: uniqueArray(ProblemIdSchema),
  changedProblemIds: uniqueArray(ProblemIdSchema),
  withdrawnProblemIds: uniqueArray(ProblemIdSchema),
  taxonomyChanges: uniqueArray(text),
}).superRefine((summary, context) => {
  const categorizedProblemIds = [
    ...summary.addedProblemIds,
    ...summary.changedProblemIds,
    ...summary.withdrawnProblemIds,
  ];
  if (new Set(categorizedProblemIds).size !== categorizedProblemIds.length) {
    context.addIssue({
      code: 'custom',
      message: 'A Problem may appear in only one release change category.',
    });
  }
});

/**
 * The deployment-facing release record. Git owns snapshot identity and history;
 * validation and content evidence remain in their dedicated versioned artifacts.
 */
export const ReleaseMetadataSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  version: releaseVersion,
  cutoffAt: OffsetDateTimeSchema,
  commit: GitCommitSchema,
  changeSummary: ReleaseChangeSummarySchema,
  validationResultsUrl: ValidationResultsUrlSchema,
}).readonly();
export type ReleaseMetadata = z.infer<typeof ReleaseMetadataSchema>;
export const ReleaseSchema = ReleaseMetadataSchema;

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
export const ReleaseMetadataContract = contract(
  'release-metadata.schema.json',
  ReleaseMetadataSchema,
  'ABC Textbook Git Release Metadata',
);
