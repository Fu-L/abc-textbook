import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import { canonicalJson, digestWithoutField } from '../canonical-json.js';
import { compareOffsetDateTimes, isOffsetDateTime, parseOffsetDateTime } from '../date-time.js';
import { ProblemAuthoringUnitSchema } from './authoring-unit.js';
import {
  ContentReviewModeSchema,
  ContentReviewRiskReasonSchema,
  ContestIdSchema,
  EntityIdSchema,
  OffsetDateTimeSchema as StructuralOffsetDateTimeSchema,
  ProblemIdSchema,
  ProblemLabelSchema,
  SafePathSchema,
  Sha256Schema,
} from './content-common.js';

export * from './content-common.js';
export * from './authoring-unit.js';

export {
  ContentReviewModeSchema,
  ContentReviewRiskReasonSchema,
  ContestIdSchema,
  EntityIdSchema,
  ProblemIdSchema,
  ProblemLabelSchema,
  SafePathSchema,
  Sha256Schema,
};
export const OffsetDateTimeSchema = StructuralOffsetDateTimeSchema.refine(
  isOffsetDateTime,
  'Invalid RFC 3339 date-time.',
);

const nonEmptyText = z.string().trim().min(1);
const entityIds = z.array(EntityIdSchema);
const authoringUnitLocalKeyPattern = '[a-z][a-z0-9]*(?:-[a-z0-9]+)*';
/**
 * A correction locator is owner-qualified because local keys are only unique
 * inside one ProblemAuthoringUnit document.
 */
export const CorrectionImpactSectionLocatorSchema = z
  .string()
  .regex(
    new RegExp(
      `^abc[0-9]{3,}-[a-z][a-z0-9+_-]*:(?:sections\\.${authoringUnitLocalKeyPattern}|claims\\.${authoringUnitLocalKeyPattern}|examples\\.${authoringUnitLocalKeyPattern}|exercises\\.${authoringUnitLocalKeyPattern}(?:\\.(?:assessment|answer))?)$`,
      'u',
    ),
  );

export type AtCoderContestResource = 'contest' | 'tasks' | 'task' | 'editorial';

export interface AtCoderContestResourceUrl {
  readonly contestId: string;
  readonly resource: AtCoderContestResource;
  readonly taskId: string | null;
}

/** Parse only HTTPS AtCoder contest URLs used as authoritative source links. */
export const parseAtCoderContestResourceUrl = (value: string): AtCoderContestResourceUrl | null => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'atcoder.jp' ||
    url.username !== '' ||
    url.password !== '' ||
    url.port !== ''
  ) {
    return null;
  }
  const pathname = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) || '/' : url.pathname;
  const match =
    /^\/contests\/(?<contestId>abc[0-9]{3,})(?:\/(?<section>tasks|editorial)(?:\/(?<taskId>[a-z0-9_]+))?)?$/u.exec(
      pathname,
    );
  if (!match?.groups) return null;
  const section = match.groups.section;
  const contestId = match.groups.contestId;
  const taskId = match.groups.taskId ?? null;
  if (!contestId || (section === 'editorial' && taskId !== null)) return null;
  if (taskId !== null && !taskId.startsWith(`${contestId}_`)) return null;
  const resource: AtCoderContestResource =
    section === 'tasks'
      ? taskId
        ? 'task'
        : 'tasks'
      : section === 'editorial'
        ? 'editorial'
        : 'contest';
  return {
    contestId,
    resource,
    taskId,
  };
};

const compareOffsetDateTimeStrings = (left: string, right: string): number =>
  compareOffsetDateTimes(parseOffsetDateTime(left), parseOffsetDateTime(right));

export const ContestSchema = strictObject({
  id: ContestIdSchema,
  number: z.number().int().min(212),
  title: nonEmptyText,
  startedAt: OffsetDateTimeSchema,
  endedAt: OffsetDateTimeSchema,
  officialUrl: z.url({ protocol: /^https$/u, hostname: /^atcoder\.jp$/u }),
  officialTaskOrder: uniqueArray(ProblemLabelSchema)
    .min(5)
    .refine(
      (labels) =>
        new Set(labels.map((label) => label.toLocaleLowerCase('en-US'))).size === labels.length &&
        labels.includes('D'),
    )
    .meta({ uniqueItems: true, contains: { const: 'D' } }),
  taskOrderSourceRevisionId: EntityIdSchema,
  checkedAt: OffsetDateTimeSchema,
}).superRefine((contest, context) => {
  const officialUrl =
    parseAtCoderContestResourceUrl(contest.officialUrl) ??
    ({ contestId: '', resource: 'contest', taskId: null } as const);
  if (officialUrl.contestId !== contest.id || officialUrl.resource !== 'contest') {
    context.addIssue({
      code: 'custom',
      path: ['officialUrl'],
      message: 'Contest officialUrl must be the matching HTTPS AtCoder contest page.',
    });
  }
  if (compareOffsetDateTimeStrings(contest.startedAt, contest.endedAt) >= 0) {
    context.addIssue({
      code: 'custom',
      path: ['endedAt'],
      message: 'Contest must end after it starts.',
    });
  }
});

export const AdvancedSlotRegistrySchema = strictObject({
  version: z.literal('1.0.0'),
  labels: uniqueArray(ProblemLabelSchema).min(1),
  firstSeenContestByLabel: z.record(ProblemLabelSchema, ContestIdSchema),
  orderEvidenceSourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  digest: Sha256Schema,
}).superRefine((registry, context) => {
  if (
    new Set(registry.labels.map((label) => label.toLocaleLowerCase('en-US'))).size !==
    registry.labels.length
  ) {
    context.addIssue({ code: 'custom', message: 'Registry labels must be unique.' });
  }
  if (
    new Set(registry.orderEvidenceSourceRevisionIds).size !==
    registry.orderEvidenceSourceRevisionIds.length
  ) {
    context.addIssue({ code: 'custom', message: 'Order evidence revisions must be unique.' });
  }
  const firstSeenLabels = Object.keys(registry.firstSeenContestByLabel).sort();
  if (canonicalJson(firstSeenLabels) !== canonicalJson([...registry.labels].sort())) {
    context.addIssue({
      code: 'custom',
      message: 'Every registry label needs exactly one first-seen contest.',
    });
  }
  if (digestWithoutField(registry, 'digest') !== registry.digest) {
    context.addIssue({ code: 'custom', message: 'Registry digest is stale.' });
  }
});

export const ContestSlotRecordSchema = strictObject({
  contestId: ContestIdSchema,
  label: ProblemLabelSchema,
  officialOrder: z.number().int().nonnegative().nullable(),
  availability: z.enum(['exists', 'official_absent', 'unknown', 'withdrawn']),
  catalogStatus: z.enum(['uncollected', 'drafting', 'on_hold', 'published', 'correction_pending']),
  holdReason: nonEmptyText.nullable(),
  problemId: ProblemIdSchema.nullable(),
  sourceRevisionId: EntityIdSchema,
  checkedAt: OffsetDateTimeSchema,
})
  .superRefine((slot, context) => {
    if (slot.availability === 'exists') {
      if (slot.officialOrder === null) {
        context.addIssue({
          code: 'custom',
          path: ['officialOrder'],
          message: 'exists requires an official order.',
        });
      }
      if (slot.problemId === null) {
        context.addIssue({
          code: 'custom',
          path: ['problemId'],
          message: 'exists requires a problem.',
        });
      }
    } else if (slot.problemId !== null) {
      context.addIssue({
        code: 'custom',
        path: ['problemId'],
        message: 'Only exists may reference a problem.',
      });
    }
    if (slot.availability === 'official_absent' && slot.officialOrder !== null) {
      context.addIssue({
        code: 'custom',
        path: ['officialOrder'],
        message: 'official_absent requires a null order.',
      });
    }
    if (
      (slot.availability === 'unknown' || slot.catalogStatus === 'on_hold') &&
      slot.holdReason === null
    ) {
      context.addIssue({
        code: 'custom',
        path: ['holdReason'],
        message: 'unknown/on_hold requires a hold reason.',
      });
    }
    const allowedNonExistingStatuses: Readonly<Record<string, readonly string[]>> = {
      official_absent: ['uncollected', 'on_hold'],
      unknown: ['on_hold'],
      withdrawn: ['on_hold'],
    };
    const allowedStatuses = allowedNonExistingStatuses[slot.availability];
    if (allowedStatuses && !allowedStatuses.includes(slot.catalogStatus)) {
      context.addIssue({
        code: 'custom',
        path: ['catalogStatus'],
        message: `${slot.availability} cannot use ${slot.catalogStatus} catalog status.`,
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { availability: { const: 'exists' } }, required: ['availability'] },
        then: {
          properties: {
            officialOrder: { type: 'integer', minimum: 0 },
            problemId: { type: 'string', pattern: '^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$' },
          },
        },
        else: { properties: { problemId: { type: 'null' } } },
      },
      {
        if: {
          properties: { availability: { const: 'official_absent' } },
          required: ['availability'],
        },
        then: {
          properties: {
            officialOrder: { type: 'null' },
            catalogStatus: { enum: ['uncollected', 'on_hold'] },
          },
        },
      },
      {
        if: { properties: { availability: { const: 'unknown' } }, required: ['availability'] },
        then: {
          properties: {
            catalogStatus: { const: 'on_hold' },
            holdReason: { type: 'string', minLength: 1 },
          },
        },
      },
      {
        if: { properties: { availability: { const: 'withdrawn' } }, required: ['availability'] },
        then: { properties: { catalogStatus: { const: 'on_hold' } } },
      },
      {
        if: { properties: { catalogStatus: { const: 'on_hold' } }, required: ['catalogStatus'] },
        then: { properties: { holdReason: { type: 'string', minLength: 1 } } },
      },
    ],
  });

export const ProblemSchema = strictObject({
  id: ProblemIdSchema,
  contestId: ContestIdSchema,
  slotLabel: ProblemLabelSchema,
  title: nonEmptyText,
  officialUrl: z.url(),
  constraintsSummary: nonEmptyText,
  difficultyEvidence: nonEmptyText,
  sourceRevisionIds: entityIds.min(1),
  checkedAt: OffsetDateTimeSchema,
  publicationStatus: z.enum([
    'uncollected',
    'drafting',
    'on_hold',
    'published',
    'correction_pending',
  ]),
  primaryTagIds: entityIds,
  secondaryTagIds: entityIds,
  adHocElements: z.array(nonEmptyText),
  placementId: EntityIdSchema.nullable(),
}).superRefine((problem, context) => {
  const officialUrl =
    parseAtCoderContestResourceUrl(problem.officialUrl) ??
    ({ contestId: '', resource: 'contest', taskId: null } as const);
  const expectedTaskId = `${problem.contestId}_${problem.slotLabel.toLocaleLowerCase('en-US')}`;
  if (
    officialUrl.contestId !== problem.contestId ||
    officialUrl.resource !== 'task' ||
    officialUrl.taskId !== expectedTaskId
  ) {
    context.addIssue({
      code: 'custom',
      path: ['officialUrl'],
      message: 'Problem officialUrl must match its AtCoder contest and task label.',
    });
  }
});

export const TechniqueInventoryItemSchema = strictObject({
  problemId: ProblemIdSchema,
  sourceRevisionIds: entityIds.min(1),
  coreMethod: nonEmptyText,
  proofIdeas: z.array(nonEmptyText).min(1),
  asymptoticComplexity: strictObject({ time: nonEmptyText, space: nonEmptyText }),
  prerequisiteCandidates: z.array(nonEmptyText),
  implementationConcerns: z.array(nonEmptyText),
  outcomeCandidates: z.array(nonEmptyText).min(1),
  adHocElements: z.array(nonEmptyText),
  authorId: EntityIdSchema,
  reviewStatus: z.enum(['draft', 'reviewed', 'changes_requested']),
});

export const TechniqueTagSchema = strictObject({
  id: EntityIdSchema,
  name: nonEmptyText,
  definition: nonEmptyText,
  parentId: EntityIdSchema.nullable(),
  prerequisiteTagIds: entityIds,
  learningOutcomeIds: entityIds.min(1),
  representativeProblemIds: z.array(ProblemIdSchema).min(1),
  aliases: uniqueArray(nonEmptyText),
  formerNames: uniqueArray(nonEmptyText),
  lifecycle: z.enum(['active', 'deprecated']),
  replacementTagIds: uniqueArray(EntityIdSchema),
})
  .superRefine((tag, context) => {
    if (tag.lifecycle === 'deprecated' && tag.replacementTagIds.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['replacementTagIds'],
        message: 'Deprecated tags require at least one replacement tag.',
      });
    }
    if (tag.lifecycle === 'active' && tag.replacementTagIds.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['replacementTagIds'],
        message: 'Active tags cannot declare replacement tags.',
      });
    }
    if (tag.replacementTagIds.includes(tag.id)) {
      context.addIssue({
        code: 'custom',
        path: ['replacementTagIds'],
        message: 'A tag cannot replace itself.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { lifecycle: { const: 'deprecated' } }, required: ['lifecycle'] },
        then: { properties: { replacementTagIds: { minItems: 1 } } },
        else: { properties: { replacementTagIds: { maxItems: 0 } } },
      },
    ],
  });

export const LearningOutcomeSchema = strictObject({
  id: EntityIdSchema,
  statement: nonEmptyText,
  prerequisiteOutcomeIds: entityIds,
  scopeIds: entityIds,
});

export const LearningUnitSchema = strictObject({
  id: EntityIdSchema,
  kind: z.enum(['chapter', 'section', 'subsection']),
  title: nonEmptyText,
  parentId: EntityIdSchema.nullable(),
  baselineId: EntityIdSchema,
  baselineVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  additionalPrerequisiteUnitIds: entityIds,
  excludedTopics: z.array(nonEmptyText),
  sourceRevisionIds: entityIds.min(1),
  tagIds: entityIds.min(1),
  learningOutcomeIds: entityIds.min(1),
  docPath: SafePathSchema,
  problemIds: z.array(ProblemIdSchema).min(1),
  examples: z.array(
    strictObject({
      key: EntityIdSchema,
      learningOutcomeIds: entityIds.min(1),
      kind: z.enum(['executable', 'pseudocode', 'illustrative']),
      language: nonEmptyText,
      omissions: z.array(nonEmptyText),
      environment: nonEmptyText,
      input: nonEmptyText,
      procedure: z.array(nonEmptyText).min(1),
      expectedResult: nonEmptyText,
      verificationStatus: z.enum(['pending', 'passed', 'not_applicable', 'failed']),
    }),
  ),
  stageRank: z.number().int().nonnegative(),
  difficultyRank: z.number().int().nonnegative(),
  representativeRank: z.number().int().nonnegative(),
  globalIndex: z.number().int().nonnegative(),
  orderReason: nonEmptyText,
});

export const ProblemPlacementSchema = strictObject({
  id: EntityIdSchema,
  problemId: ProblemIdSchema,
  policyVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  kind: z.enum(['full', 'similar', 'supplement']),
  primaryProblemId: ProblemIdSchema.nullable(),
  sharedOutcomeIds: entityIds,
  comparison: strictObject({
    method: nonEmptyText,
    proof: nonEmptyText,
    complexity: nonEmptyText,
    constraints: nonEmptyText,
    prerequisites: nonEmptyText,
    implementation: nonEmptyText,
  }),
  additionalElement: nonEmptyText.nullable(),
  rationale: nonEmptyText,
  evidenceIds: entityIds.min(1),
})
  .superRefine((placement, context) => {
    const isFull = placement.kind === 'full';
    const isSimilar = placement.kind === 'similar';
    if (isFull && placement.primaryProblemId !== null) {
      context.addIssue({
        code: 'custom',
        path: ['primaryProblemId'],
        message: 'Full placement cannot reference a primary Problem.',
      });
    }
    if (!isFull && placement.primaryProblemId === null) {
      context.addIssue({
        code: 'custom',
        path: ['primaryProblemId'],
        message: 'Similar and supplement placements require a primary Problem.',
      });
    }
    if (isFull && placement.sharedOutcomeIds.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['sharedOutcomeIds'],
        message: 'Full placement cannot declare shared outcomes.',
      });
    }
    if (!isFull && placement.sharedOutcomeIds.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['sharedOutcomeIds'],
        message: 'Abbreviated placements require shared outcomes.',
      });
    }
    if (isSimilar && placement.additionalElement !== null) {
      context.addIssue({
        code: 'custom',
        path: ['additionalElement'],
        message: 'Similar placement cannot declare an additional element.',
      });
    }
    if (placement.kind === 'supplement' && placement.additionalElement === null) {
      context.addIssue({
        code: 'custom',
        path: ['additionalElement'],
        message: 'Supplement placement requires exactly one additional element.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { kind: { const: 'full' } }, required: ['kind'] },
        then: {
          properties: {
            primaryProblemId: { type: 'null' },
            sharedOutcomeIds: { maxItems: 0 },
            additionalElement: { type: 'null' },
          },
        },
      },
      {
        if: {
          properties: { kind: { const: 'similar' } },
          required: ['kind'],
        },
        then: {
          properties: {
            primaryProblemId: {
              type: 'string',
              pattern: '^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$',
            },
            sharedOutcomeIds: { minItems: 1 },
            additionalElement: { type: 'null' },
          },
        },
      },
      {
        if: {
          properties: { kind: { const: 'supplement' } },
          required: ['kind'],
        },
        then: {
          properties: {
            primaryProblemId: {
              type: 'string',
              pattern: '^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$',
            },
            sharedOutcomeIds: { minItems: 1 },
            additionalElement: { type: 'string', minLength: 1 },
          },
        },
      },
    ],
  });

export const SourceRevisionSchema = strictObject({
  id: EntityIdSchema,
  url: z.url(),
  sourceKind: z.enum([
    'official_problem',
    'official_editorial',
    'official_contest',
    'other_official',
  ]),
  contestId: ContestIdSchema.nullable(),
  checkedAt: OffsetDateTimeSchema,
  fingerprint: Sha256Schema,
  termsCheckedAt: OffsetDateTimeSchema,
}).superRefine((source, context) => {
  const officialUrl = parseAtCoderContestResourceUrl(source.url);
  const requiresContest = source.sourceKind !== 'other_official' || source.contestId !== null;
  if (!officialUrl || (requiresContest && source.contestId === null)) {
    context.addIssue({
      code: 'custom',
      path: ['url'],
      message: 'Source URL must be a supported HTTPS AtCoder contest resource.',
    });
    return;
  }
  if (source.contestId !== null && officialUrl.contestId !== source.contestId) {
    context.addIssue({
      code: 'custom',
      path: ['contestId'],
      message: 'Source contestId must match the AtCoder URL.',
    });
  }
  const validResource =
    source.sourceKind === 'official_problem'
      ? officialUrl.resource === 'task'
      : source.sourceKind === 'official_editorial'
        ? officialUrl.resource === 'editorial'
        : source.sourceKind === 'official_contest'
          ? officialUrl.resource === 'contest' || officialUrl.resource === 'tasks'
          : true;
  if (!validResource) {
    context.addIssue({
      code: 'custom',
      path: ['sourceKind'],
      message: `${source.sourceKind} must use its matching AtCoder URL path.`,
    });
  }
});

export const SourceRecordSchema = strictObject({
  id: EntityIdSchema,
  canonicalUrl: z.url(),
  sourceKind: z.enum([
    'official_problem',
    'official_editorial',
    'official_contest',
    'other_official',
  ]),
  revisionIds: entityIds.min(1),
  correctionImpactIds: entityIds,
});

export const CorrectionImpactSchema = strictObject({
  id: EntityIdSchema,
  sourceRevisionId: EntityIdSchema,
  changeSummary: nonEmptyText,
  authoringUnitProblemIds: uniqueArray(ProblemIdSchema).min(1),
  affectedSectionKeys: uniqueArray(CorrectionImpactSectionLocatorSchema).min(1),
  learningUnitIds: entityIds,
  derivedIndexPaths: z.array(SafePathSchema),
  verificationStatus: z.enum(['pending', 'verified', 'failed']),
});

const TaxonomyChangeSchema = strictObject({
  kind: z.enum(['added', 'renamed', 'merged', 'split', 'deprecated']),
  entityId: EntityIdSchema,
  summary: nonEmptyText,
});

const ReleaseCheckSchema = strictObject({
  checkId: EntityIdSchema,
  command: nonEmptyText,
  subjectDigest: Sha256Schema,
  resultPath: SafePathSchema,
  resultDigest: Sha256Schema,
  exitCode: z.number().int(),
  passed: z.boolean(),
  completedAt: OffsetDateTimeSchema,
});

const ReleaseValidationSummarySchema = strictObject({
  checkCount: z.number().int().nonnegative(),
  passedCheckCount: z.number().int().nonnegative(),
  blockingFindingCount: z.number().int().nonnegative(),
  evidenceDigests: uniqueArray(Sha256Schema),
  checks: z.array(ReleaseCheckSchema).min(1),
}).superRefine((summary, context) => {
  const checkIds = summary.checks.map(({ checkId }) => checkId);
  const resultDigests = summary.checks.map(({ resultDigest }) => resultDigest);
  const sorted = (values: readonly string[]): string[] => [...values].sort();
  if (new Set(checkIds).size !== checkIds.length) {
    context.addIssue({
      code: 'custom',
      path: ['checks'],
      message: 'Release check IDs must be unique.',
    });
  }
  if (new Set(resultDigests).size !== resultDigests.length) {
    context.addIssue({
      code: 'custom',
      path: ['checks'],
      message: 'Release check result digests must be unique.',
    });
  }
  if (
    summary.checkCount !== summary.checks.length ||
    summary.passedCheckCount !==
      summary.checks.filter((check) => check.passed && check.exitCode === 0).length ||
    sorted(summary.evidenceDigests).join('\n') !== sorted(resultDigests).join('\n')
  ) {
    context.addIssue({
      code: 'custom',
      message: 'Release check counts and evidence digests must be derived from checks.',
    });
  }
});

const EvidenceReferenceSchema = strictObject({
  evidenceId: EntityIdSchema,
  path: SafePathSchema,
  digest: Sha256Schema,
  subjectDigest: Sha256Schema,
  authorIds: uniqueArray(EntityIdSchema).min(1),
  reviewerIds: uniqueArray(EntityIdSchema).min(1),
  reviewMode: ContentReviewModeSchema,
  aggregatePassed: z.literal(true),
}).superRefine((reference, context) => {
  if (
    reference.reviewMode === 'third_party' &&
    reference.authorIds.some((authorId) => reference.reviewerIds.includes(authorId))
  ) {
    context.addIssue({
      code: 'custom',
      path: ['reviewerIds'],
      message: 'Third-party review authors and reviewers must be disjoint.',
    });
  }
});

export const CatalogReleaseSchema = strictObject({
  version: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u),
  releaseKind: z.enum(['initial', 'incremental']),
  cutoffAt: OffsetDateTimeSchema,
  validatedAt: OffsetDateTimeSchema,
  publicationEffectiveAt: OffsetDateTimeSchema,
  manifestDigest: Sha256Schema,
  /** Digest of the on-disk canonical content file inventory approved by release evidence. */
  contentFileInventoryDigest: Sha256Schema,
  /** Digest of the normalized logical catalog projection, including immutable release scope. */
  contentSnapshotDigest: Sha256Schema,
  updateIds: entityIds.min(1),
  advancedSlotRegistryDigest: Sha256Schema,
  firstContestId: ContestIdSchema,
  lastContestId: ContestIdSchema,
  contestCount: z.number().int().positive(),
  problemCount: z.number().int().positive(),
  slotRecordCount: z.number().int().positive(),
  addedProblemIds: z.array(ProblemIdSchema),
  changedProblemIds: z.array(ProblemIdSchema),
  heldProblemIds: z.array(ProblemIdSchema),
  withdrawnProblemIds: z.array(ProblemIdSchema),
  taxonomyChanges: z.array(TaxonomyChangeSchema),
  validationSummary: ReleaseValidationSummarySchema,
  humanContentReviewEvidenceRefs: z.array(EvidenceReferenceSchema).min(1),
  changelogPath: SafePathSchema,
});

export const CatalogSchema = strictObject({
  schemaVersion: z.literal('3.0.0'),
  release: CatalogReleaseSchema,
  advancedSlotRegistry: AdvancedSlotRegistrySchema,
  contests: z.array(ContestSchema),
  contestSlots: z.array(ContestSlotRecordSchema),
  problems: z.array(ProblemSchema),
  techniqueInventory: z.array(TechniqueInventoryItemSchema),
  tags: z.array(TechniqueTagSchema),
  learningOutcomes: z.array(LearningOutcomeSchema),
  learningUnits: z.array(LearningUnitSchema),
  placements: z.array(ProblemPlacementSchema),
  authoringUnits: z.array(ProblemAuthoringUnitSchema),
  sources: z.array(SourceRevisionSchema),
  correctionImpacts: z.array(CorrectionImpactSchema),
});

export const CatalogContract = defineZodContractSchema('catalog.schema.json', CatalogSchema, {
  $id: 'https://abc-textbook.local/schemas/catalog.schema.json',
  title: 'ABC Textbook Catalog',
  description:
    'ABC212以降の各公式問題一覧でDより後に並ぶ全問題、全コーパスTechnique Inventory、典型体系、学習単位、公開履歴を表す。problem labelは固定E〜H enumではなく公式task orderから導出する。',
});

const semver = z.string().regex(/^\d+\.\d+\.\d+$/u);
const portablePath = z
  .string()
  .regex(
    /^(?!.*(?:^|\/)(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.[A-Za-z0-9._-]+)?(?:\/|$))(?:[A-Za-z0-9._-]*[A-Za-z0-9_-])(?:\/[A-Za-z0-9._-]*[A-Za-z0-9_-])*$/iu,
  );
const uniqueText = (schema: z.ZodType<string> = nonEmptyText) => uniqueArray(schema);

export const GlossarySchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  version: semver,
  language: z.literal('ja'),
  terms: z.array(
    strictObject({
      id: z.string().regex(/^term-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
      canonicalName: nonEmptyText,
      aliases: uniqueText(),
      definition: nonEmptyText,
      prerequisiteTermIds: uniqueText(z.string().regex(/^term-[a-z0-9]+(?:-[a-z0-9]+)*$/u)),
      firstUseUnitId: z.string().regex(/^unit-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
      scope: z.enum(['global', 'genre', 'unit']),
      sourceRevisionIds: uniqueText().min(1),
    }),
  ),
  digest: Sha256Schema,
}).superRefine((policy, context) => {
  if (digestWithoutField(policy, 'digest') !== policy.digest) {
    context.addIssue({ code: 'custom', path: ['digest'], message: 'Glossary digest is stale.' });
  }
});

export const PrerequisiteBaselineSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  id: z.string().regex(/^prereq-[a-z0-9]+(?:-[a-z0-9]+)*-v\d+$/u),
  version: semver,
  name: nonEmptyText,
  language: z.literal('ja'),
  skills: z
    .array(
      strictObject({
        id: z.string().regex(/^skill-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
        observableStatement: nonEmptyText,
        verificationMethod: nonEmptyText,
      }),
    )
    .min(1),
  excludedSkills: z.array(strictObject({ name: nonEmptyText, rationale: nonEmptyText })),
  sourceRevisionIds: uniqueText().min(1),
  checkedAt: OffsetDateTimeSchema,
  digest: Sha256Schema,
}).superRefine((policy, context) => {
  if (digestWithoutField(policy, 'digest') !== policy.digest) {
    context.addIssue({
      code: 'custom',
      path: ['digest'],
      message: 'Prerequisite baseline digest is stale.',
    });
  }
});

const placementAttribute = z.enum([
  'primary_authoring_unit_valid',
  'algorithm_same',
  'proof_same',
  'complexity_same',
  'constraints_difference_documented',
  'prerequisites_same',
  'implementation_difference_documented',
  'learning_outcomes_same',
  'additional_learning_count',
  'evidence_complete',
  'conflict_free',
]);
const placementCondition = strictObject({
  attribute: placementAttribute,
  operator: z.enum(['eq', 'not_eq', 'lt', 'lte', 'gt', 'gte']),
  value: z.union([z.boolean(), z.number().int().nonnegative(), nonEmptyText]),
});
const placementEvidence = z.enum([
  'independent_full_authoring_unit',
  'primary_problem_id',
  'shared_learning_outcome_ids',
  'algorithm_comparison',
  'proof_comparison',
  'complexity_comparison',
  'constraint_comparison',
  'prerequisite_comparison',
  'implementation_comparison',
  'simplification_reason',
  'additional_learning',
  'answer',
  'source_revision_ids',
  'verification_evidence',
]);
const placementRule = <R extends 'full' | 'similar' | 'supplement'>(
  result: R,
  priority: 1 | 2 | 3,
  fallback: boolean,
  minimum: number,
  maximum?: number,
) =>
  strictObject({
    result: z.literal(result),
    priority: z.literal(priority),
    fallback: z.literal(fallback),
    clauses: z
      .array(strictObject({ all: z.array(placementCondition).min(1) }))
      .min(minimum)
      .max(maximum ?? Number.MAX_SAFE_INTEGER),
    requiredEvidence: uniqueArray(placementEvidence).min(1),
  });
export const ProblemPlacementDecisionTableSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  id: z.string().regex(/^placement-policy-v\d+$/u),
  version: semver,
  defaultMode: z.literal('full'),
  comparisonDimensions: z
    .array(
      z.enum([
        'algorithm',
        'proof',
        'complexity',
        'constraints',
        'prerequisites',
        'implementation',
        'learning_outcomes',
      ]),
    )
    .length(7)
    .refine((items) => new Set(items).size === 7)
    .meta({ uniqueItems: true }),
  inputAttributes: z.tuple([
    z.literal('primary_authoring_unit_valid'),
    z.literal('algorithm_same'),
    z.literal('proof_same'),
    z.literal('complexity_same'),
    z.literal('constraints_difference_documented'),
    z.literal('prerequisites_same'),
    z.literal('implementation_difference_documented'),
    z.literal('learning_outcomes_same'),
    z.literal('additional_learning_count'),
    z.literal('evidence_complete'),
    z.literal('conflict_free'),
  ]),
  evaluationOrder: z.tuple([z.literal('similar'), z.literal('supplement'), z.literal('full')]),
  exclusiveResult: z.literal(true),
  modeRules: strictObject({
    full: placementRule('full', 3, true, 0, 0),
    similar: placementRule('similar', 1, false, 1),
    supplement: placementRule('supplement', 2, false, 1),
  }),
  ambiguousAction: z.literal('on_hold'),
  digest: Sha256Schema,
}).superRefine((policy, context) => {
  if (digestWithoutField(policy, 'digest') !== policy.digest) {
    context.addIssue({
      code: 'custom',
      path: ['digest'],
      message: 'Problem placement policy digest is stale.',
    });
  }
});

const answerMaterialEvidenceItem = strictObject({
  problemId: ProblemIdSchema,
  exerciseKey: z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u),
  contentDigest: Sha256Schema,
  learningOutcomeIds: uniqueText(z.string().regex(/^outcome-[a-z0-9]+(?:-[a-z0-9]+)*$/u)).min(1),
  prerequisiteIds: uniqueText(),
  attainmentCondition: nonEmptyText,
  sourceRefs: uniqueText().min(1),
  sourceVersion: nonEmptyText,
  method: z.enum(['automated', 'documented-procedure', 'human-review']),
  automationDecision: z.enum(['automated', 'not-practical']),
  automationRationale: nonEmptyText.nullable(),
  procedure: nonEmptyText,
  command: nonEmptyText.nullable(),
  exitCode: z.number().int().nullable(),
  expectedResult: nonEmptyText,
  observedResult: nonEmptyText,
  verifiedAt: OffsetDateTimeSchema,
  status: z.enum(['passed', 'failed']),
  observedResultDigest: Sha256Schema,
  evidencePath: portablePath,
  evidenceDigest: Sha256Schema,
  humanReviewEvidenceIds: uniqueText(),
})
  .superRefine((item, context) => {
    const automated = item.method === 'automated';
    const valid = automated
      ? item.automationDecision === 'automated' &&
        item.automationRationale === null &&
        item.command !== null &&
        item.exitCode !== null
      : item.automationDecision === 'not-practical' &&
        item.automationRationale !== null &&
        item.command === null &&
        item.exitCode === null &&
        item.humanReviewEvidenceIds.length > 0;
    if (!valid || (automated && item.status === 'passed' && item.exitCode !== 0))
      context.addIssue({
        code: 'custom',
        message: 'Answer material evidence method fields are inconsistent.',
      });
  })
  .meta({
    allOf: [
      {
        if: { properties: { method: { const: 'automated' } }, required: ['method'] },
        then: {
          properties: {
            automationDecision: { const: 'automated' },
            automationRationale: { type: 'null' },
            command: { type: 'string', minLength: 1 },
            exitCode: { type: 'integer' },
          },
        },
        else: {
          properties: {
            automationDecision: { const: 'not-practical' },
            automationRationale: { type: 'string', minLength: 1 },
            command: { type: 'null' },
            exitCode: { type: 'null' },
            humanReviewEvidenceIds: { minItems: 1 },
          },
        },
      },
      {
        if: {
          properties: { method: { const: 'automated' }, status: { const: 'passed' } },
          required: ['method', 'status'],
        },
        then: { properties: { exitCode: { const: 0 } } },
      },
    ],
  });
const AnswerMaterialEvidenceSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  releaseDigest: Sha256Schema,
  inventoryDigest: Sha256Schema,
  inventoryCount: z.number().int().positive(),
  checkedCount: z.number().int().positive(),
  passedCount: z.number().int().nonnegative(),
  failedCount: z.number().int().nonnegative(),
  aggregatePassed: z.boolean(),
  items: z.array(answerMaterialEvidenceItem).min(1),
  generatedAt: OffsetDateTimeSchema,
})
  .superRefine((evidence, context) => {
    const passed = evidence.items.filter(({ status }) => status === 'passed').length;
    if (
      evidence.inventoryCount !== evidence.items.length ||
      evidence.checkedCount !== evidence.items.length ||
      evidence.passedCount !== passed ||
      evidence.failedCount !== evidence.items.length - passed ||
      evidence.aggregatePassed !== (passed === evidence.items.length)
    )
      context.addIssue({ code: 'custom', message: 'Answer material evidence aggregate is stale.' });
  })
  .meta({
    allOf: [
      {
        if: { properties: { aggregatePassed: { const: true } }, required: ['aggregatePassed'] },
        then: {
          properties: {
            failedCount: { const: 0 },
            items: { items: { properties: { status: { const: 'passed' } } } },
          },
        },
        else: { properties: { failedCount: { minimum: 1 } } },
      },
    ],
  });

const policyContract = (fileName: `${string}.schema.json`, schema: z.ZodType, title: string) =>
  defineZodContractSchema(fileName, schema, {
    $id: `https://abc-textbook.local/schemas/${fileName}`,
    title,
  });
export const GlossaryContract = policyContract(
  'glossary.schema.json',
  GlossarySchema,
  'ABC Textbook Glossary',
);
export const PrerequisiteBaselineContract = policyContract(
  'prerequisite-baseline.schema.json',
  PrerequisiteBaselineSchema,
  'ABC Textbook Prerequisite Baseline',
);
export const ProblemPlacementDecisionTableContract = policyContract(
  'problem-placement-decision-table.schema.json',
  ProblemPlacementDecisionTableSchema,
  'ABC Textbook Problem Placement Decision Table',
);
export const AnswerMaterialEvidenceContract = policyContract(
  'answer-material-evidence.schema.json',
  AnswerMaterialEvidenceSchema,
  'ABC Textbook Answer Material Evidence',
);
