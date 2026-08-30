import { z } from 'zod';

import { defineZodContractSchema, strictObject, uniqueArray } from '../contract-schema.js';
import { canonicalDigest, canonicalJson, digestWithoutField } from '../canonical-json.js';
import { compareOffsetDateTimes, isOffsetDateTime, parseOffsetDateTime } from '../date-time.js';
import {
  InlineExerciseSchema,
  LearningUnitInlineExampleSchema,
  ProblemAuthoringUnitSchema,
} from './authoring-unit.js';
import {
  ContentBlockKeyPattern,
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
export const OfficialTaskIdSchema = z.string().regex(/^abc[0-9]{3,}_[a-z0-9_]+$/u);
const localBlockPath = (namespace: 'claims' | 'examples' | 'exercises') =>
  z.string().regex(new RegExp(`^${namespace}\\.${ContentBlockKeyPattern}$`, 'u'));
const exerciseDetailPath = z
  .string()
  .regex(new RegExp(`^exercises\\.${ContentBlockKeyPattern}\\.(?:assessment|answer)$`, 'u'));

/**
 * Correction targets use the same explicit owner model as execution evidence.
 * The path remains document-local and is resolved against the selected owner.
 */
export const CorrectionImpactContentLocatorSchema = z.discriminatedUnion('ownerType', [
  strictObject({
    ownerType: z.literal('problem'),
    problemId: ProblemIdSchema,
    path: z.union([
      z.string().regex(new RegExp(`^sections\\.${ContentBlockKeyPattern}$`, 'u')),
      localBlockPath('claims'),
      localBlockPath('examples'),
      localBlockPath('exercises'),
      exerciseDetailPath,
    ]),
  }),
  strictObject({
    ownerType: z.literal('learning_unit'),
    learningUnitId: EntityIdSchema,
    path: z.union([
      z.literal('content'),
      localBlockPath('examples'),
      localBlockPath('exercises'),
      exerciseDetailPath,
    ]),
  }),
]);

export type AtCoderContestResource = 'contest' | 'tasks' | 'task' | 'editorial' | 'editorial_item';

export interface AtCoderContestResourceUrl {
  readonly contestId: string;
  readonly resource: AtCoderContestResource;
  readonly taskId: string | null;
  readonly editorialItemId: string | null;
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
    /^\/contests\/(?<contestId>abc[0-9]{3,})(?:\/(?<section>tasks|editorial)(?:\/(?<resourceId>[a-z0-9_]+))?)?$/u.exec(
      pathname,
    );
  if (!match?.groups) return null;
  const section = match.groups.section;
  const contestId = match.groups.contestId;
  const resourceId = match.groups.resourceId ?? null;
  const taskId = section === 'tasks' ? resourceId : null;
  const editorialItemId = section === 'editorial' ? resourceId : null;
  if (!contestId) return null;
  if (taskId !== null && !taskId.startsWith(`${contestId}_`)) return null;
  if (editorialItemId !== null && !/^[0-9]+$/u.test(editorialItemId)) return null;
  const resource: AtCoderContestResource =
    section === 'tasks'
      ? taskId
        ? 'task'
        : 'tasks'
      : section === 'editorial'
        ? editorialItemId
          ? 'editorial_item'
          : 'editorial'
        : 'contest';
  return {
    contestId,
    resource,
    taskId,
    editorialItemId,
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
  officialTaskIds: uniqueArray(OfficialTaskIdSchema).min(5),
  taskOrderSourceRevisionId: EntityIdSchema,
  checkedAt: OffsetDateTimeSchema,
}).superRefine((contest, context) => {
  const officialUrl =
    parseAtCoderContestResourceUrl(contest.officialUrl) ??
    ({ contestId: '', resource: 'contest', taskId: null, editorialItemId: null } as const);
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
  if (contest.officialTaskIds.length !== contest.officialTaskOrder.length) {
    context.addIssue({
      code: 'custom',
      path: ['officialTaskIds'],
      message: 'Contest labels and official task IDs must form a complete ordered mapping.',
    });
  }
  for (const [index, officialTaskId] of contest.officialTaskIds.entries()) {
    if (!officialTaskId.startsWith(`${contest.id}_`)) {
      context.addIssue({
        code: 'custom',
        path: ['officialTaskIds', index],
        message: 'Every official task ID must belong to its Contest.',
      });
    }
  }
});

export const OfficialContestGapMetadataSchema = strictObject({
  number: z.number().int().min(212),
  contestId: ContestIdSchema,
  status: z.literal('officially_unheld'),
  evidenceUrl: z.url({ protocol: /^https$/u, hostname: /^atcoder\.jp$/u }),
  evidenceAssertion: nonEmptyText,
  checkedAt: OffsetDateTimeSchema,
  termsCheckedAt: OffsetDateTimeSchema,
  fingerprint: Sha256Schema,
}).superRefine((gap, context) => {
  if (gap.contestId !== `abc${String(gap.number)}`) {
    context.addIssue({
      code: 'custom',
      path: ['contestId'],
      message: 'Contest gap ID must agree with its number.',
    });
  }
  const evidence = parseAtCoderContestResourceUrl(gap.evidenceUrl);
  if (evidence?.resource !== 'task') {
    context.addIssue({
      code: 'custom',
      path: ['evidenceUrl'],
      message: 'Contest gap evidence must be an official AtCoder task URL.',
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
  officialTaskId: OfficialTaskIdSchema.nullable(),
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
      if (slot.officialTaskId === null) {
        context.addIssue({
          code: 'custom',
          path: ['officialTaskId'],
          message: 'exists requires an official task ID.',
        });
      }
    } else if (slot.problemId !== null) {
      context.addIssue({
        code: 'custom',
        path: ['problemId'],
        message: 'Only exists may reference a problem.',
      });
    }
    if (slot.availability === 'official_absent') {
      if (slot.officialOrder !== null) {
        context.addIssue({
          code: 'custom',
          path: ['officialOrder'],
          message: 'official_absent requires a null order.',
        });
      }
      if (slot.officialTaskId !== null) {
        context.addIssue({
          code: 'custom',
          path: ['officialTaskId'],
          message: 'official_absent cannot name an official task ID.',
        });
      }
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
            officialTaskId: { type: 'string', pattern: '^abc[0-9]{3,}_[a-z0-9_]+$' },
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
            officialTaskId: { type: 'null' },
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
  officialTaskId: OfficialTaskIdSchema,
  title: nonEmptyText,
  officialUrl: z.url(),
  constraintsSummary: nonEmptyText.nullable(),
  difficultyEvidence: nonEmptyText.nullable(),
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
})
  .superRefine((problem, context) => {
    const officialUrl =
      parseAtCoderContestResourceUrl(problem.officialUrl) ??
      ({ contestId: '', resource: 'contest', taskId: null, editorialItemId: null } as const);
    if (
      officialUrl.contestId !== problem.contestId ||
      officialUrl.resource !== 'task' ||
      officialUrl.taskId !== problem.officialTaskId ||
      !problem.officialTaskId.startsWith(`${problem.contestId}_`)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['officialUrl'],
        message: 'Problem officialUrl must match its AtCoder contest and task label.',
      });
    }
    const permitsIncompleteAnalysis =
      problem.publicationStatus === 'uncollected' || problem.publicationStatus === 'on_hold';
    if (!permitsIncompleteAnalysis && problem.constraintsSummary === null) {
      context.addIssue({
        code: 'custom',
        path: ['constraintsSummary'],
        message: 'Analyzed Problems require a constraints summary.',
      });
    }
    if (!permitsIncompleteAnalysis && problem.difficultyEvidence === null) {
      context.addIssue({
        code: 'custom',
        path: ['difficultyEvidence'],
        message: 'Analyzed Problems require difficulty evidence.',
      });
    }
  })
  .meta({
    allOf: [
      {
        if: {
          properties: {
            publicationStatus: {
              enum: ['drafting', 'published', 'correction_pending'],
            },
          },
          required: ['publicationStatus'],
        },
        then: {
          properties: {
            constraintsSummary: { type: 'string', minLength: 1 },
            difficultyEvidence: { type: 'string', minLength: 1 },
          },
        },
      },
    ],
  });

export const ProblemAnalysisEvidenceSchema = strictObject({
  id: EntityIdSchema,
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  rationale: nonEmptyText,
});

export const SourceBackedAnalysisClaimSchema = strictObject({
  text: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
});

const ReasoningApproachSchema = strictObject({
  approach: nonEmptyText,
  decision: z.enum(['adopted', 'rejected']),
  decisionReason: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
});

const TypicalTechniqueCandidateSchema = strictObject({
  name: nonEmptyText,
  trigger: nonEmptyText,
  application: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
});

const ProblemSpecificInsightSchema = strictObject({
  insight: nonEmptyText,
  reusablePerspective: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
});

/**
 * The source-backed analysis record written before taxonomy and explanation authoring.
 * It records a reproducible route from observations to an algorithm; it does not decide
 * final Tags, Outcomes, Units, or full/similar/supplement placement.
 */
export const ProblemAnalysisRecordSchema = strictObject({
  problemId: ProblemIdSchema,
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  evidence: z.array(ProblemAnalysisEvidenceSchema).min(1),
  reasoningPath: strictObject({
    observations: z.array(SourceBackedAnalysisClaimSchema).min(1),
    candidateApproaches: z.array(ReasoningApproachSchema).min(1),
    keyInsights: z.array(SourceBackedAnalysisClaimSchema).min(1),
    algorithmConnection: SourceBackedAnalysisClaimSchema,
  }),
  typicalTechniques: z.array(TypicalTechniqueCandidateSchema),
  typicalTechniqueOmissionReason: SourceBackedAnalysisClaimSchema.optional(),
  problemSpecificInsights: z.array(ProblemSpecificInsightSchema),
  problemSpecificInsightOmissionReason: SourceBackedAnalysisClaimSchema.optional(),
  asymptoticComplexity: strictObject({
    time: nonEmptyText.optional(),
    space: nonEmptyText.optional(),
    evidenceIds: uniqueArray(EntityIdSchema).min(1),
  })
    .refine((complexity) => complexity.time !== undefined || complexity.space !== undefined, {
      message: 'At least one problem-specific complexity bound is required when present.',
    })
    .optional(),
  prerequisiteCandidates: z.array(SourceBackedAnalysisClaimSchema),
  implementationConcerns: z.array(SourceBackedAnalysisClaimSchema),
  outcomeCandidates: z.array(SourceBackedAnalysisClaimSchema).min(1),
  reviewAdvice: z.array(SourceBackedAnalysisClaimSchema).min(1),
  authorId: EntityIdSchema,
  reviewStatus: z.enum(['draft', 'reviewed', 'changes_requested']),
  reviewFindings: z.array(nonEmptyText),
}).superRefine((record, context) => {
  const evidenceIdSets = [
    ...record.reasoningPath.observations.map(({ evidenceIds }) => evidenceIds),
    ...record.reasoningPath.candidateApproaches.map(({ evidenceIds }) => evidenceIds),
    ...record.reasoningPath.keyInsights.map(({ evidenceIds }) => evidenceIds),
    record.reasoningPath.algorithmConnection.evidenceIds,
    ...record.typicalTechniques.map(({ evidenceIds }) => evidenceIds),
    ...(record.typicalTechniqueOmissionReason === undefined
      ? []
      : [record.typicalTechniqueOmissionReason.evidenceIds]),
    ...record.problemSpecificInsights.map(({ evidenceIds }) => evidenceIds),
    ...(record.problemSpecificInsightOmissionReason === undefined
      ? []
      : [record.problemSpecificInsightOmissionReason.evidenceIds]),
    ...(record.asymptoticComplexity === undefined ? [] : [record.asymptoticComplexity.evidenceIds]),
    ...record.prerequisiteCandidates.map(({ evidenceIds }) => evidenceIds),
    ...record.implementationConcerns.map(({ evidenceIds }) => evidenceIds),
    ...record.outcomeCandidates.map(({ evidenceIds }) => evidenceIds),
    ...record.reviewAdvice.map(({ evidenceIds }) => evidenceIds),
  ];
  const declaredEvidenceIds = new Set(record.evidence.map(({ id }) => id));
  if (declaredEvidenceIds.size !== record.evidence.length) {
    context.addIssue({
      code: 'custom',
      path: ['evidence'],
      message: 'Problem analysis evidence IDs must be unique within a record.',
    });
  }
  const citedEvidenceIds = new Set(evidenceIdSets.flat());
  for (const evidenceId of citedEvidenceIds) {
    if (!declaredEvidenceIds.has(evidenceId)) {
      context.addIssue({
        code: 'custom',
        path: ['evidence'],
        message: `Claim references undeclared evidence ${evidenceId}.`,
      });
    }
  }
  for (const evidenceId of declaredEvidenceIds) {
    if (!citedEvidenceIds.has(evidenceId)) {
      context.addIssue({
        code: 'custom',
        path: ['evidence'],
        message: `Declared evidence ${evidenceId} is not used by any analysis claim.`,
      });
    }
  }

  const citedSourceIds = new Set(
    record.evidence.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
  );
  const declaredSourceIds = new Set(record.sourceRevisionIds);
  for (const sourceRevisionId of citedSourceIds) {
    if (!declaredSourceIds.has(sourceRevisionId)) {
      context.addIssue({
        code: 'custom',
        path: ['sourceRevisionIds'],
        message: `Evidence source ${sourceRevisionId} is not declared by this analysis record.`,
      });
    }
  }
  for (const sourceRevisionId of declaredSourceIds) {
    if (!citedSourceIds.has(sourceRevisionId)) {
      context.addIssue({
        code: 'custom',
        path: ['sourceRevisionIds'],
        message: `Declared Source Revision ${sourceRevisionId} is not used by any analysis claim.`,
      });
    }
  }

  const approachDecisions = new Set(
    record.reasoningPath.candidateApproaches.map(({ decision }) => decision),
  );
  if (record.reviewStatus === 'reviewed' && !approachDecisions.has('adopted')) {
    context.addIssue({
      code: 'custom',
      path: ['reasoningPath', 'candidateApproaches'],
      message: 'Reviewed analysis requires an adopted candidate approach.',
    });
  }
  const optionalSections = [
    {
      path: 'typicalTechniques',
      values: record.typicalTechniques,
      omissionReason: record.typicalTechniqueOmissionReason,
    },
    {
      path: 'problemSpecificInsights',
      values: record.problemSpecificInsights,
      omissionReason: record.problemSpecificInsightOmissionReason,
    },
  ] as const;
  for (const section of optionalSections) {
    if (section.values.length > 0 && section.omissionReason !== undefined) {
      context.addIssue({
        code: 'custom',
        path: [section.path],
        message: `${section.path} cannot have an omission reason when substantive items exist.`,
      });
    }
    if (
      record.reviewStatus === 'reviewed' &&
      section.values.length === 0 &&
      section.omissionReason === undefined
    ) {
      context.addIssue({
        code: 'custom',
        path: [section.path],
        message: `Reviewed analysis must explain why ${section.path} is empty.`,
      });
    }
  }
  if (record.reviewStatus === 'changes_requested' && record.reviewFindings.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['reviewFindings'],
      message: 'Changes-requested analysis requires at least one unresolved review finding.',
    });
  }
  if (record.reviewStatus !== 'changes_requested' && record.reviewFindings.length > 0) {
    context.addIssue({
      code: 'custom',
      path: ['reviewFindings'],
      message: 'Only changes-requested analysis may retain unresolved review findings.',
    });
  }
});

/** @deprecated Use ProblemAnalysisRecordSchema for new code. */
export const TechniqueInventoryItemSchema = ProblemAnalysisRecordSchema;

export const TechniqueTagSemanticSignatureSchema = strictObject({
  objectPatterns: uniqueArray(nonEmptyText).min(1),
  triggerPatterns: uniqueArray(nonEmptyText).min(1),
  invariantPatterns: uniqueArray(nonEmptyText).min(1),
  goalPatterns: uniqueArray(nonEmptyText).min(1),
  excludedPatterns: uniqueArray(nonEmptyText),
  minimumDimensions: z.number().int().min(1).max(4),
  requireObjectForStrictRecall: z.boolean(),
});

export const TechniqueTagRelationTypeSchema = z.enum([
  'contrast',
  'specialization',
  'analogy',
  'often_combined',
  'implementation_substrate',
]);

export const SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES = [
  'contrast',
  'analogy',
  'often_combined',
] as const;

export const TechniqueTagRelationSchema = strictObject({
  tagId: EntityIdSchema,
  type: TechniqueTagRelationTypeSchema,
  rationale: nonEmptyText,
});

export const TechniqueTagSchema = strictObject({
  id: EntityIdSchema,
  name: nonEmptyText,
  definition: nonEmptyText,
  parentId: EntityIdSchema.nullable(),
  prerequisiteTagIds: entityIds,
  semanticSignature: TechniqueTagSemanticSignatureSchema,
  relatedTags: uniqueArray(TechniqueTagRelationSchema),
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
    if (tag.relatedTags.some(({ tagId }) => tagId === tag.id)) {
      context.addIssue({
        code: 'custom',
        path: ['relatedTags'],
        message: 'A tag cannot relate to itself.',
      });
    }
    const relationKeys = tag.relatedTags.map(({ tagId, type }) => `${tagId}\u0000${type}`);
    if (new Set(relationKeys).size !== relationKeys.length) {
      context.addIssue({
        code: 'custom',
        path: ['relatedTags'],
        message: 'Tag relations must be unique by target and type.',
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
  examples: uniqueArray(LearningUnitInlineExampleSchema).min(1),
  exercises: uniqueArray(InlineExerciseSchema).min(1),
  stageRank: z.number().int().nonnegative(),
  difficultyRank: z.number().int().nonnegative(),
  representativeRank: z.number().int().nonnegative(),
  globalIndex: z.number().int().nonnegative(),
  orderReason: nonEmptyText,
}).superRefine((unit, context) => {
  for (const field of ['examples', 'exercises'] as const) {
    const keys = unit[field].map(({ key }) => key);
    if (new Set(keys).size !== keys.length) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `${field} local keys must be unique inside a Learning Unit.`,
      });
    }
  }
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
  officialTaskId: OfficialTaskIdSchema.nullable(),
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
      ? officialUrl.resource === 'task' && officialUrl.taskId === source.officialTaskId
      : source.sourceKind === 'official_editorial'
        ? (officialUrl.resource === 'editorial' && source.officialTaskId === null) ||
          (officialUrl.resource === 'editorial_item' && source.officialTaskId !== null)
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
  if (
    source.officialTaskId !== null &&
    (source.contestId === null || !source.officialTaskId.startsWith(`${source.contestId}_`))
  ) {
    context.addIssue({
      code: 'custom',
      path: ['officialTaskId'],
      message: 'Source officialTaskId must belong to its Contest.',
    });
  }
  if (
    (source.sourceKind === 'official_contest' || source.sourceKind === 'other_official') &&
    source.officialTaskId !== null
  ) {
    context.addIssue({
      code: 'custom',
      path: ['officialTaskId'],
      message: `${source.sourceKind} cannot be bound to an official task ID.`,
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
  affectedContentLocators: uniqueArray(CorrectionImpactContentLocatorSchema).min(1),
  affectedLearningUnitOrderIds: uniqueArray(EntityIdSchema),
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

export const ReviewEvidenceReferenceSchema = strictObject({
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
  humanContentReviewEvidenceRefs: z.array(ReviewEvidenceReferenceSchema).min(1),
  changelogPath: SafePathSchema,
});

export const CatalogSchema = strictObject({
  schemaVersion: z.literal('3.0.0'),
  release: CatalogReleaseSchema,
  advancedSlotRegistry: AdvancedSlotRegistrySchema,
  contests: z.array(ContestSchema),
  contestGaps: z.array(OfficialContestGapMetadataSchema),
  contestSlots: z.array(ContestSlotRecordSchema),
  problems: z.array(ProblemSchema),
  techniqueInventory: z.array(ProblemAnalysisRecordSchema),
  tags: z.array(TechniqueTagSchema),
  learningOutcomes: z.array(LearningOutcomeSchema),
  learningUnits: z.array(LearningUnitSchema),
  placements: z.array(ProblemPlacementSchema),
  authoringUnits: z.array(ProblemAuthoringUnitSchema),
  sources: z.array(SourceRevisionSchema),
  correctionImpacts: z.array(CorrectionImpactSchema),
});

const FinalTagIdSchema = z.string().regex(/^tag-[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const FinalOutcomeIdSchema = z.string().regex(/^outcome-[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const FinalLearningUnitIdSchema = z.string().regex(/^unit-[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const TaxonomyEntityKindSchema = z.enum(['tag', 'outcome', 'unit']);
const IntegrationActionSchema = z.enum(['promote', 'merge', 'split', 'retire']);
const FinalTaxonomyStatusSchema = z.enum(['proposed', 'accepted', 'rejected']);
const semverForTaxonomy = z.string().regex(/^\d+\.\d+\.\d+$/u);

const problemAnalysisClaimPointer =
  /^\/(?:reasoningPath\/(?:observations|candidateApproaches|keyInsights)\/[0-9]+|reasoningPath\/algorithmConnection|typicalTechniques\/[0-9]+|typicalTechniqueOmissionReason|problemSpecificInsights\/[0-9]+|problemSpecificInsightOmissionReason|asymptoticComplexity|prerequisiteCandidates\/[0-9]+|implementationConcerns\/[0-9]+|outcomeCandidates\/[0-9]+|reviewAdvice\/[0-9]+)$/u;

/** A digest-stable pointer into one frozen ProblemAnalysisRecord. */
export const ProblemAnalysisClaimRefSchema = strictObject({
  problemId: ProblemIdSchema,
  claimPath: z.string().regex(problemAnalysisClaimPointer),
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
});

const InventoryClaimDispositionKindSchema = z.enum([
  'primary',
  'supporting',
  'same_tag',
  'baseline',
  'problem_specific',
]);

/** The explicit taxonomy treatment of one Technique Inventory claim. */
export const InventoryClaimDispositionSchema = strictObject({
  claimRef: ProblemAnalysisClaimRefSchema,
  kind: InventoryClaimDispositionKindSchema,
  tagIds: uniqueArray(FinalTagIdSchema),
  rationale: nonEmptyText,
}).superRefine((disposition, context) => {
  const requiresTag = ['primary', 'supporting', 'same_tag'].includes(disposition.kind);
  if (requiresTag !== disposition.tagIds.length > 0) {
    context.addIssue({
      code: 'custom',
      path: ['tagIds'],
      message: 'Only primary, supporting, and same-tag claim dispositions name a final Tag.',
    });
  }
});

const TaxonomyReviewPolicySchema = strictObject({
  requiredMode: ContentReviewModeSchema,
  riskReasons: uniqueArray(ContentReviewRiskReasonSchema),
}).superRefine((policy, context) => {
  if (policy.riskReasons.length > 0 !== (policy.requiredMode === 'third_party')) {
    context.addIssue({
      code: 'custom',
      path: ['requiredMode'],
      message: 'Third-party review is required exactly when taxonomy risk reasons exist.',
    });
  }
});

/** T159 fixes Unit identity, prerequisites, reachability, and order without authoring T050 body blocks. */
export const LearningUnitTaxonomyCandidateSchema = strictObject({
  id: FinalLearningUnitIdSchema,
  kind: z.enum(['chapter', 'section', 'subsection']),
  title: nonEmptyText,
  parentId: FinalLearningUnitIdSchema.nullable(),
  baselineId: EntityIdSchema,
  baselineVersion: semverForTaxonomy,
  additionalPrerequisiteUnitIds: uniqueArray(FinalLearningUnitIdSchema),
  excludedTopics: uniqueArray(nonEmptyText),
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  tagIds: uniqueArray(FinalTagIdSchema).min(1),
  learningOutcomeIds: uniqueArray(FinalOutcomeIdSchema).min(1),
  problemIds: uniqueArray(ProblemIdSchema).min(1),
  stageRank: z.number().int().nonnegative(),
  difficultyRank: z.number().int().nonnegative(),
  representativeRank: z.number().int().nonnegative(),
  globalIndex: z.number().int().nonnegative(),
  orderReason: nonEmptyText,
}).superRefine((unit, context) => {
  if (unit.parentId === unit.id) {
    context.addIssue({
      code: 'custom',
      path: ['parentId'],
      message: 'A Learning Unit candidate cannot parent itself.',
    });
  }
  if (unit.additionalPrerequisiteUnitIds.includes(unit.id)) {
    context.addIssue({
      code: 'custom',
      path: ['additionalPrerequisiteUnitIds'],
      message: 'A Learning Unit candidate cannot require itself.',
    });
  }
});

const FinalTaxonomyCandidateCommon = {
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  evidenceRefs: uniqueArray(ProblemAnalysisClaimRefSchema).min(1),
} satisfies z.ZodRawShape;

export const FinalTaxonomyCandidateSchema = z
  .discriminatedUnion('kind', [
    strictObject({
      kind: z.literal('tag'),
      entity: TechniqueTagSchema,
      ...FinalTaxonomyCandidateCommon,
      materializationTask: z.literal('T047'),
    }),
    strictObject({
      kind: z.literal('outcome'),
      entity: LearningOutcomeSchema,
      ...FinalTaxonomyCandidateCommon,
      materializationTask: z.literal('T048'),
    }),
    strictObject({
      kind: z.literal('unit'),
      entity: LearningUnitTaxonomyCandidateSchema,
      ...FinalTaxonomyCandidateCommon,
      materializationTask: z.literal('T050'),
    }),
  ])
  .superRefine((candidate, context) => {
    const validId =
      candidate.kind === 'tag'
        ? FinalTagIdSchema.safeParse(candidate.entity.id).success
        : candidate.kind === 'outcome'
          ? FinalOutcomeIdSchema.safeParse(candidate.entity.id).success
          : FinalLearningUnitIdSchema.safeParse(candidate.entity.id).success;
    if (!validId) {
      context.addIssue({
        code: 'custom',
        path: ['entity', 'id'],
        message: `Final ${candidate.kind} IDs must use their canonical namespace.`,
      });
    }
  });

const PlacementComparisonSchema = strictObject({
  method: nonEmptyText,
  proof: nonEmptyText,
  complexity: nonEmptyText,
  constraints: nonEmptyText,
  prerequisites: nonEmptyText,
  implementation: nonEmptyText,
});
/** Canonical placement decision plus the exact T049 taxonomy projection. */
export const FinalProblemPlacementProjectionSchema = strictObject({
  id: EntityIdSchema,
  problemId: ProblemIdSchema,
  policyVersion: semverForTaxonomy,
  kind: z.enum(['full', 'similar', 'supplement']),
  primaryProblemId: ProblemIdSchema.nullable(),
  sharedOutcomeIds: uniqueArray(FinalOutcomeIdSchema),
  comparison: PlacementComparisonSchema,
  additionalElement: nonEmptyText.nullable(),
  rationale: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
  primaryTagIds: uniqueArray(FinalTagIdSchema).min(1),
  supportingTagIds: uniqueArray(FinalTagIdSchema),
  primaryOutcomeId: FinalOutcomeIdSchema,
  additionalPrimaryOutcomeIds: uniqueArray(FinalOutcomeIdSchema),
  supportingOutcomeIds: uniqueArray(FinalOutcomeIdSchema),
  learningUnitIds: uniqueArray(FinalLearningUnitIdSchema).min(1),
  presentationUnitId: FinalLearningUnitIdSchema,
  adHocElements: uniqueArray(nonEmptyText),
  claimDispositions: uniqueArray(InventoryClaimDispositionSchema).min(1),
  analysisEvidenceRefs: uniqueArray(ProblemAnalysisClaimRefSchema).min(1),
}).superRefine((placement, context) => {
  const isFull = placement.kind === 'full';
  const isSimilar = placement.kind === 'similar';
  if (isFull !== (placement.primaryProblemId === null)) {
    context.addIssue({
      code: 'custom',
      path: ['primaryProblemId'],
      message: 'Only full placement omits a primary Problem.',
    });
  }
  if (placement.primaryProblemId === placement.problemId) {
    context.addIssue({
      code: 'custom',
      path: ['primaryProblemId'],
      message: 'A placement cannot use its own Problem as the primary Problem.',
    });
  }
  if (isFull !== (placement.sharedOutcomeIds.length === 0)) {
    context.addIssue({
      code: 'custom',
      path: ['sharedOutcomeIds'],
      message: 'Only abbreviated placements declare shared Outcomes.',
    });
  }
  if ((isSimilar || isFull) !== (placement.additionalElement === null)) {
    context.addIssue({
      code: 'custom',
      path: ['additionalElement'],
      message: 'Only supplement placement declares one additional element.',
    });
  }
  if (placement.primaryTagIds.some((id) => placement.supportingTagIds.includes(id))) {
    context.addIssue({
      code: 'custom',
      path: ['supportingTagIds'],
      message: 'Primary and supporting Tag assignments must be disjoint.',
    });
  }
  const primaryOutcomeIds = [placement.primaryOutcomeId, ...placement.additionalPrimaryOutcomeIds];
  if (
    placement.additionalPrimaryOutcomeIds.includes(placement.primaryOutcomeId) ||
    placement.supportingOutcomeIds.some((outcomeId) => primaryOutcomeIds.includes(outcomeId))
  ) {
    context.addIssue({
      code: 'custom',
      path: ['supportingOutcomeIds'],
      message: 'Primary and supporting Outcome assignments must be disjoint.',
    });
  }
  if (!placement.learningUnitIds.includes(placement.presentationUnitId)) {
    context.addIssue({
      code: 'custom',
      path: ['presentationUnitId'],
      message: 'The presentation Unit must be one of the placement learning Units.',
    });
  }
  const assignedOutcomeIds = [...primaryOutcomeIds, ...placement.supportingOutcomeIds];
  if (placement.sharedOutcomeIds.some((id) => !assignedOutcomeIds.includes(id))) {
    context.addIssue({
      code: 'custom',
      path: ['sharedOutcomeIds'],
      message: 'Shared Outcomes must be assigned to the abbreviated Problem.',
    });
  }
});

const ImpactDispositionSchema = z.enum(['materialize_change', 'verified_unaffected']);
const ImpactEvidenceFields = {
  disposition: ImpactDispositionSchema,
  rationale: nonEmptyText,
  evidenceRefs: uniqueArray(ProblemAnalysisClaimRefSchema).min(1),
} satisfies z.ZodRawShape;
const ProblemImpactSurfaceSchema = z.enum([
  'body',
  'example',
  'exercise',
  'answer',
  'placement',
  'derived_index',
]);
const LearningUnitImpactSurfaceSchema = z.enum([
  'body',
  'example',
  'exercise',
  'answer',
  'standard_order',
  'derived_index',
]);
const PreMaterializationImpactAssessmentSchema = z.discriminatedUnion('ownerType', [
  strictObject({
    ownerType: z.literal('problem'),
    problemId: ProblemIdSchema,
    surface: ProblemImpactSurfaceSchema,
    ...ImpactEvidenceFields,
  }),
  strictObject({
    ownerType: z.literal('learning_unit_candidate'),
    learningUnitId: FinalLearningUnitIdSchema,
    surface: LearningUnitImpactSurfaceSchema,
    ...ImpactEvidenceFields,
  }),
  strictObject({
    ownerType: z.literal('derived_index'),
    path: SafePathSchema,
    surface: z.literal('index'),
    ...ImpactEvidenceFields,
  }),
]);

const sameFinalTaxonomySet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

/** T159 impact inventory; T049 later expands changed surfaces to canonical content locators. */
export const PreMaterializationCorrectionImpactSchema = strictObject({
  id: EntityIdSchema,
  integrationPreviewEntityIds: uniqueArray(EntityIdSchema).min(1),
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  changeSummary: nonEmptyText,
  affectedProblemIds: uniqueArray(ProblemIdSchema).min(1),
  affectedLearningUnitCandidateIds: uniqueArray(FinalLearningUnitIdSchema),
  surfaceAssessments: uniqueArray(PreMaterializationImpactAssessmentSchema).min(1),
  affectedLearningUnitOrderIds: uniqueArray(FinalLearningUnitIdSchema),
  derivedIndexPaths: uniqueArray(SafePathSchema).min(1),
  canonicalMaterializationTask: z.literal('T049'),
  coverageStatus: z.literal('complete'),
  verificationStatus: z.enum(['pending', 'reviewed']),
  impactSubjectDigest: Sha256Schema,
}).superRefine((impact, context) => {
  const requiredProblemSurfaces = ProblemImpactSurfaceSchema.options;
  const requiredUnitSurfaces = LearningUnitImpactSurfaceSchema.options;
  const assessmentKeys = impact.surfaceAssessments.map((assessment) =>
    assessment.ownerType === 'problem'
      ? `problem:${assessment.problemId}:${assessment.surface}`
      : assessment.ownerType === 'learning_unit_candidate'
        ? `unit:${assessment.learningUnitId}:${assessment.surface}`
        : `index:${assessment.path}`,
  );
  if (new Set(assessmentKeys).size !== assessmentKeys.length) {
    context.addIssue({
      code: 'custom',
      path: ['surfaceAssessments'],
      message: 'Pre-materialization impact assessments must be unique by owner and surface.',
    });
  }
  for (const problemId of impact.affectedProblemIds) {
    const surfaces = impact.surfaceAssessments.flatMap((assessment) =>
      assessment.ownerType === 'problem' && assessment.problemId === problemId
        ? [assessment.surface]
        : [],
    );
    if (!sameFinalTaxonomySet(surfaces, requiredProblemSurfaces)) {
      context.addIssue({
        code: 'custom',
        path: ['surfaceAssessments'],
        message: `Affected Problem ${problemId} must assess every content, placement, and index surface.`,
      });
    }
  }
  for (const learningUnitId of impact.affectedLearningUnitCandidateIds) {
    const surfaces = impact.surfaceAssessments.flatMap((assessment) =>
      assessment.ownerType === 'learning_unit_candidate' &&
      assessment.learningUnitId === learningUnitId
        ? [assessment.surface]
        : [],
    );
    if (!sameFinalTaxonomySet(surfaces, requiredUnitSurfaces)) {
      context.addIssue({
        code: 'custom',
        path: ['surfaceAssessments'],
        message: `Affected Learning Unit ${learningUnitId} must assess every content, order, and index surface.`,
      });
    }
  }
  if (
    impact.surfaceAssessments.some(
      (assessment) =>
        (assessment.ownerType === 'problem' &&
          !impact.affectedProblemIds.includes(assessment.problemId)) ||
        (assessment.ownerType === 'learning_unit_candidate' &&
          !impact.affectedLearningUnitCandidateIds.includes(assessment.learningUnitId)),
    )
  ) {
    context.addIssue({
      code: 'custom',
      path: ['surfaceAssessments'],
      message: 'Impact assessment owners must be declared by the impact scope.',
    });
  }
  if (
    impact.affectedLearningUnitOrderIds.some(
      (id) => !impact.affectedLearningUnitCandidateIds.includes(id),
    )
  ) {
    context.addIssue({
      code: 'custom',
      path: ['affectedLearningUnitOrderIds'],
      message: 'Order impacts must belong to affected Learning Unit candidates.',
    });
  }
  const assessedIndexPaths = impact.surfaceAssessments.flatMap((assessment) =>
    assessment.ownerType === 'derived_index' ? [assessment.path] : [],
  );
  if (!sameFinalTaxonomySet(assessedIndexPaths, impact.derivedIndexPaths)) {
    context.addIssue({
      code: 'custom',
      path: ['derivedIndexPaths'],
      message: 'Every derived index path must have exactly one impact assessment.',
    });
  }
  const impactSubject = Object.fromEntries(
    Object.entries(impact).filter(
      ([field]) => !['impactSubjectDigest', 'verificationStatus'].includes(field),
    ),
  );
  if (impact.impactSubjectDigest !== canonicalDigest(impactSubject)) {
    context.addIssue({
      code: 'custom',
      path: ['impactSubjectDigest'],
      message: 'Pre-materialization correction impact subject digest is stale.',
    });
  }
});

const ProvisionalActionAssessmentSchema = strictObject({
  action: IntegrationActionSchema,
  criterion: nonEmptyText,
  evidenceRequiredAtT159: uniqueArray(EntityIdSchema).min(1),
});
const ProvisionalIntegrationCandidateSchema = strictObject({
  previewEntityId: EntityIdSchema,
  previewEntityKind: TaxonomyEntityKindSchema,
  affectedProblemIds: uniqueArray(ProblemIdSchema).min(1),
  rationale: nonEmptyText,
  evidenceIds: uniqueArray(EntityIdSchema).min(1),
  affectedSurfaces: uniqueArray(nonEmptyText).min(1),
  actionAssessments: z.array(ProvisionalActionAssessmentSchema).length(4),
  provisionalRecommendation: z.literal('promote'),
  finalDecision: z.null(),
  finalEntityIds: uniqueArray(EntityIdSchema).length(0),
  reviewPolicy: TaxonomyReviewPolicySchema,
}).superRefine((candidate, context) => {
  if (
    !sameFinalTaxonomySet(
      candidate.actionAssessments.map(({ action }) => action),
      IntegrationActionSchema.options,
    )
  ) {
    context.addIssue({
      code: 'custom',
      path: ['actionAssessments'],
      message: 'Provisional evidence must assess every integration action once.',
    });
  }
});
const FrozenProvisionalIntegrationEvidenceSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  evidenceId: EntityIdSchema,
  previewId: EntityIdSchema,
  status: z.literal('evidence_frozen'),
  taxonomyDigest: Sha256Schema,
  inventoryComponentDigest: Sha256Schema,
  classificationsDigest: Sha256Schema,
  proposalDigest: Sha256Schema,
  finalDecisionTask: z.literal('T159'),
  canonicalMaterializationAllowed: z.literal(false),
  candidates: z.array(ProvisionalIntegrationCandidateSchema).min(1),
  integrationDigest: Sha256Schema,
});

const SplitProblemAssignmentSchema = strictObject({
  finalEntityId: EntityIdSchema,
  problemIds: uniqueArray(ProblemIdSchema).min(1),
  evidenceRefs: uniqueArray(ProblemAnalysisClaimRefSchema).min(1),
  representativeProblemIds: uniqueArray(ProblemIdSchema).min(1),
});
const RedirectLegacyDispositionSchema = strictObject({
  kind: z.literal('redirect'),
  fromPreviewEntityId: EntityIdSchema,
  toFinalEntityId: EntityIdSchema,
  aliases: uniqueArray(nonEmptyText),
});
const SplitLegacyDispositionSchema = strictObject({
  kind: z.literal('split_aliases'),
  fromPreviewEntityId: EntityIdSchema,
  targets: z
    .array(
      strictObject({
        finalEntityId: EntityIdSchema,
        aliases: uniqueArray(nonEmptyText),
      }),
    )
    .min(2),
  ambiguousRedirectOmittedReason: nonEmptyText,
});
const RetiredLegacyDispositionSchema = strictObject({
  kind: z.literal('retired'),
  previewEntityId: EntityIdSchema,
  replacementEntityIds: uniqueArray(EntityIdSchema),
  retirementReason: nonEmptyText,
});
const IntegrationEntryCommon = {
  previewEntityId: EntityIdSchema,
  previewEntityKind: TaxonomyEntityKindSchema,
  affectedProblemIds: uniqueArray(ProblemIdSchema).min(1),
  rationale: nonEmptyText,
  evidenceRefs: uniqueArray(ProblemAnalysisClaimRefSchema).min(1),
  correctionImpactIds: uniqueArray(EntityIdSchema).min(1),
  reviewPolicy: TaxonomyReviewPolicySchema,
  reviewEvidenceId: EntityIdSchema.nullable(),
  status: FinalTaxonomyStatusSchema,
} satisfies z.ZodRawShape;
const PromoteIntegrationEntrySchema = strictObject({
  ...IntegrationEntryCommon,
  action: z.literal('promote'),
  finalEntityIds: uniqueArray(EntityIdSchema).length(1),
  splitProblemAssignments: z.array(SplitProblemAssignmentSchema).length(0),
  decisionEvidence: strictObject({
    fullInventoryComparison: nonEmptyText,
    representativeProblemIds: uniqueArray(ProblemIdSchema).min(1),
  }),
  legacyDisposition: RedirectLegacyDispositionSchema,
});
const MergeIntegrationEntrySchema = strictObject({
  ...IntegrationEntryCommon,
  action: z.literal('merge'),
  finalEntityIds: uniqueArray(EntityIdSchema).length(1),
  splitProblemAssignments: z.array(SplitProblemAssignmentSchema).length(0),
  decisionEvidence: strictObject({
    equivalenceOrContainmentProof: nonEmptyText,
    representativeProblemIds: uniqueArray(ProblemIdSchema).min(1),
  }),
  legacyDisposition: RedirectLegacyDispositionSchema,
});
const SplitIntegrationEntrySchema = strictObject({
  ...IntegrationEntryCommon,
  action: z.literal('split'),
  finalEntityIds: uniqueArray(EntityIdSchema).min(2),
  splitProblemAssignments: z.array(SplitProblemAssignmentSchema).min(2),
  decisionEvidence: strictObject({ completeReclassificationProof: nonEmptyText }),
  legacyDisposition: SplitLegacyDispositionSchema,
});
const RetireIntegrationEntrySchema = strictObject({
  ...IntegrationEntryCommon,
  action: z.literal('retire'),
  finalEntityIds: uniqueArray(EntityIdSchema).length(0),
  splitProblemAssignments: z.array(SplitProblemAssignmentSchema).length(0),
  decisionEvidence: strictObject({
    retirementRationale: nonEmptyText,
    reassignedProblemIds: uniqueArray(ProblemIdSchema).min(1),
  }),
  legacyDisposition: RetiredLegacyDispositionSchema,
});
const TaxonomyIntegrationEntrySchema = z.discriminatedUnion('action', [
  PromoteIntegrationEntrySchema,
  MergeIntegrationEntrySchema,
  SplitIntegrationEntrySchema,
  RetireIntegrationEntrySchema,
]);

const taxonomyIntegrationSubject = (integration: {
  readonly schemaVersion: '2.0.0';
  readonly evidenceId: string;
  readonly previewId: string;
  readonly inventoryDigest: string;
  readonly previewSnapshotDigest: string;
  readonly provisionalEvidence: z.infer<typeof FrozenProvisionalIntegrationEvidenceSchema>;
  readonly entries: readonly z.infer<typeof TaxonomyIntegrationEntrySchema>[];
  readonly canonicalMaterializationAllowed: false;
}) => ({
  schemaVersion: integration.schemaVersion,
  evidenceId: integration.evidenceId,
  previewId: integration.previewId,
  inventoryDigest: integration.inventoryDigest,
  previewSnapshotDigest: integration.previewSnapshotDigest,
  provisionalEvidence: integration.provisionalEvidence,
  entries: integration.entries.map((entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(([field]) => !['reviewEvidenceId', 'status'].includes(field)),
    ),
  ),
  canonicalMaterializationAllowed: integration.canonicalMaterializationAllowed,
});

export const TaxonomyIntegrationMapSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  evidenceId: EntityIdSchema,
  previewId: EntityIdSchema,
  inventoryDigest: Sha256Schema,
  previewSnapshotDigest: Sha256Schema,
  provisionalEvidence: FrozenProvisionalIntegrationEvidenceSchema,
  entries: z.array(TaxonomyIntegrationEntrySchema).min(1),
  status: FinalTaxonomyStatusSchema,
  canonicalMaterializationAllowed: z.literal(false),
  integrationSubjectDigest: Sha256Schema,
  integrationDigest: Sha256Schema,
}).superRefine((integration, context) => {
  const candidateIds = integration.provisionalEvidence.candidates.map(
    ({ previewEntityId }) => previewEntityId,
  );
  const entryIds = integration.entries.map(({ previewEntityId }) => previewEntityId);
  if (
    integration.previewId !== integration.provisionalEvidence.previewId ||
    !sameFinalTaxonomySet(candidateIds, entryIds)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['entries'],
      message: 'The final integration map must cover every frozen preview entity exactly once.',
    });
  }
  const candidateById = new Map(
    integration.provisionalEvidence.candidates.map((candidate) => [
      candidate.previewEntityId,
      candidate,
    ]),
  );
  for (const entry of integration.entries) {
    const candidate = candidateById.get(entry.previewEntityId);
    if (
      candidate?.previewEntityKind !== entry.previewEntityKind ||
      !sameFinalTaxonomySet(candidate.affectedProblemIds, entry.affectedProblemIds)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Integration scope changed for ${entry.previewEntityId}.`,
      });
    }
    if (
      candidate?.reviewPolicy.requiredMode === 'third_party' &&
      entry.reviewPolicy.requiredMode !== 'third_party'
    ) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Integration review policy was weakened for ${entry.previewEntityId}.`,
      });
    }
    if (
      candidate?.reviewPolicy.riskReasons.some(
        (reason) => !entry.reviewPolicy.riskReasons.includes(reason),
      )
    ) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Integration risk reasons are incomplete for ${entry.previewEntityId}.`,
      });
    }
    if ((entry.status === 'accepted') !== (entry.reviewEvidenceId !== null)) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Only an accepted integration decision may reference completed review evidence for ${entry.previewEntityId}.`,
      });
    }
    if (entry.action === 'split') {
      const assignedFinalIds = entry.splitProblemAssignments.map(
        ({ finalEntityId }) => finalEntityId,
      );
      const assignedProblemIds = entry.splitProblemAssignments.flatMap(
        ({ problemIds }) => problemIds,
      );
      const assignedProblemUnion = [...new Set(assignedProblemIds)];
      const outcomeAssignmentsOverlap =
        entry.previewEntityKind === 'outcome' &&
        assignedProblemUnion.length !== assignedProblemIds.length;
      if (
        !sameFinalTaxonomySet(assignedFinalIds, entry.finalEntityIds) ||
        !sameFinalTaxonomySet(assignedProblemUnion, entry.affectedProblemIds) ||
        outcomeAssignmentsOverlap
      ) {
        context.addIssue({
          code: 'custom',
          path: ['entries'],
          message: `Split assignments are incomplete for ${entry.previewEntityId}.`,
        });
      }
      if (
        entry.legacyDisposition.fromPreviewEntityId !== entry.previewEntityId ||
        !sameFinalTaxonomySet(
          entry.legacyDisposition.targets.map(({ finalEntityId }) => finalEntityId),
          entry.finalEntityIds,
        )
      ) {
        context.addIssue({
          code: 'custom',
          path: ['entries'],
          message: `Split aliases are incomplete for ${entry.previewEntityId}.`,
        });
      }
    } else if (entry.action === 'retire') {
      if (
        !sameFinalTaxonomySet(
          entry.decisionEvidence.reassignedProblemIds,
          entry.affectedProblemIds,
        ) ||
        entry.legacyDisposition.previewEntityId !== entry.previewEntityId
      ) {
        context.addIssue({
          code: 'custom',
          path: ['entries'],
          message: `Retirement coverage is incomplete for ${entry.previewEntityId}.`,
        });
      }
    } else if (
      entry.legacyDisposition.fromPreviewEntityId !== entry.previewEntityId ||
      entry.legacyDisposition.toFinalEntityId !== entry.finalEntityIds[0]
    ) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Legacy redirect is stale for ${entry.previewEntityId}.`,
      });
    }

    const representativeProblemIds =
      entry.action === 'split'
        ? entry.splitProblemAssignments.flatMap(
            ({ representativeProblemIds: assignmentRepresentatives }) => assignmentRepresentatives,
          )
        : entry.action === 'promote' || entry.action === 'merge'
          ? entry.decisionEvidence.representativeProblemIds
          : [];
    const allowedEvidenceOwnerIds = new Set([
      ...entry.affectedProblemIds,
      ...representativeProblemIds,
    ]);
    const evidenceOwnerIds = [
      ...entry.evidenceRefs.map(({ problemId }) => problemId),
      ...(entry.action === 'split'
        ? entry.splitProblemAssignments.flatMap(({ evidenceRefs }) =>
            evidenceRefs.map(({ problemId }) => problemId),
          )
        : []),
    ];
    if (
      evidenceOwnerIds.some((problemId) => !allowedEvidenceOwnerIds.has(problemId)) ||
      entry.affectedProblemIds.some((problemId) => !evidenceOwnerIds.includes(problemId))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['entries'],
        message: `Integration evidence ownership is incomplete for ${entry.previewEntityId}.`,
      });
    }
  }
  if (
    integration.status === 'accepted' &&
    integration.entries.some(({ status }) => status !== 'accepted')
  ) {
    context.addIssue({
      code: 'custom',
      path: ['status'],
      message: 'An accepted integration map requires every decision to be accepted.',
    });
  }
  if (
    integration.integrationSubjectDigest !==
    canonicalDigest(taxonomyIntegrationSubject(integration))
  ) {
    context.addIssue({
      code: 'custom',
      path: ['integrationSubjectDigest'],
      message: 'Taxonomy integration review subject digest is stale.',
    });
  }
  if (digestWithoutField(integration, 'integrationDigest') !== integration.integrationDigest) {
    context.addIssue({
      code: 'custom',
      path: ['integrationDigest'],
      message: 'Taxonomy integration digest is stale.',
    });
  }
});

const TaxonomyPrerequisiteEdgeSchema = strictObject({
  nodeId: EntityIdSchema,
  prerequisiteId: EntityIdSchema,
});
const FinalTaxonomyInputsSchema = strictObject({
  inventory: strictObject({
    evidencePath: SafePathSchema,
    evidenceDigest: Sha256Schema,
    inventoryDigest: Sha256Schema,
    corpusDigest: Sha256Schema,
    authoringEvidencePath: SafePathSchema,
    authoringEvidenceDigest: Sha256Schema,
    authoringInventoryDigest: Sha256Schema,
    normalizedSourceSetDigest: Sha256Schema,
  }),
  previewSnapshot: strictObject({
    path: SafePathSchema,
    referencePath: SafePathSchema,
    joinDigest: Sha256Schema,
    canonicalSnapshotDigest: Sha256Schema,
    transactionId: z.string().regex(/^preview-snapshot:[a-z0-9]+(?:-[a-z0-9]+)*:[a-f0-9]{64}$/u),
    status: z.literal('passed'),
  }),
  integrationMapPath: SafePathSchema,
});
const FinalTaxonomyPolicySchema = strictObject({
  name: nonEmptyText,
  version: semverForTaxonomy,
  inputScope: nonEmptyText,
  rulesDigest: Sha256Schema,
  requiredReviewMode: ContentReviewModeSchema,
  riskReasons: uniqueArray(ContentReviewRiskReasonSchema),
  authoringSkillName: nonEmptyText,
  authoringSkillVersion: semverForTaxonomy,
  authoringSkillDigest: Sha256Schema,
  writingPolicyPath: SafePathSchema,
  writingPolicyDigest: Sha256Schema,
  sourceNormalizationVersion: semverForTaxonomy,
  workManifestPath: SafePathSchema,
  workManifestDigest: Sha256Schema,
}).superRefine((policy, context) => {
  if (policy.riskReasons.length > 0 !== (policy.requiredReviewMode === 'third_party')) {
    context.addIssue({
      code: 'custom',
      path: ['requiredReviewMode'],
      message: 'Final taxonomy review mode must follow the declared risk reasons.',
    });
  }
});

const finalTaxonomyCandidateId = (
  candidate: z.infer<typeof FinalTaxonomyCandidateSchema>,
): string => candidate.entity.id;

const finalTaxonomyEdgeKey = (edge: { readonly nodeId: string; readonly prerequisiteId: string }) =>
  `${edge.nodeId}\u0000${edge.prerequisiteId}`;

const finalTaxonomyGraphHasCycle = (
  nodeIds: readonly string[],
  edges: readonly { readonly nodeId: string; readonly prerequisiteId: string }[],
): boolean => {
  const dependencies = new Map(nodeIds.map((id) => [id, [] as string[]]));
  for (const { nodeId, prerequisiteId } of edges) dependencies.get(nodeId)?.push(prerequisiteId);
  const states = new Map<string, 'visiting' | 'visited'>();
  const visit = (nodeId: string): boolean => {
    if (states.get(nodeId) === 'visiting') return true;
    if (states.get(nodeId) === 'visited') return false;
    states.set(nodeId, 'visiting');
    if ((dependencies.get(nodeId) ?? []).some(visit)) return true;
    states.set(nodeId, 'visited');
    return false;
  };
  return nodeIds.some(visit);
};

const deterministicFinalLearningUnitOrder = (
  units: readonly z.infer<typeof LearningUnitTaxonomyCandidateSchema>[],
  edges: readonly { readonly nodeId: string; readonly prerequisiteId: string }[],
): string[] => {
  const remaining = new Map(
    units.map((unit) => [
      unit.id,
      new Set(
        edges
          .filter(({ nodeId }) => nodeId === unit.id)
          .map(({ prerequisiteId }) => prerequisiteId),
      ),
    ]),
  );
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const result: string[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining.entries()]
      .filter(([, dependencies]) => dependencies.size === 0)
      .map(([id]) => unitById.get(id))
      .filter(
        (unit): unit is z.infer<typeof LearningUnitTaxonomyCandidateSchema> => unit !== undefined,
      )
      .sort(
        (left, right) =>
          left.stageRank - right.stageRank ||
          left.difficultyRank - right.difficultyRank ||
          left.representativeRank - right.representativeRank ||
          (left.id < right.id ? -1 : left.id > right.id ? 1 : 0),
      );
    const selected = ready[0];
    if (selected === undefined) return [];
    result.push(selected.id);
    remaining.delete(selected.id);
    for (const dependencies of remaining.values()) dependencies.delete(selected.id);
  }
  return result;
};

export const FinalTaxonomyBuildSchema = strictObject({
  schemaVersion: z.literal('2.0.0'),
  id: EntityIdSchema,
  generatedAt: OffsetDateTimeSchema,
  inputs: FinalTaxonomyInputsSchema,
  policy: FinalTaxonomyPolicySchema,
  integrationMap: TaxonomyIntegrationMapSchema,
  integrationMapDigest: Sha256Schema,
  finalCandidates: z.array(FinalTaxonomyCandidateSchema).min(3),
  tagPrerequisites: uniqueArray(TaxonomyPrerequisiteEdgeSchema),
  learningUnitPrerequisites: uniqueArray(TaxonomyPrerequisiteEdgeSchema),
  standardOrder: uniqueArray(FinalLearningUnitIdSchema).min(1),
  placements: z.array(FinalProblemPlacementProjectionSchema).min(1),
  correctionImpacts: z.array(PreMaterializationCorrectionImpactSchema).min(1),
  sourceRevisionIds: uniqueArray(EntityIdSchema).min(1),
  reviewEvidenceRefs: uniqueArray(ReviewEvidenceReferenceSchema).max(1),
  taxonomySubjectDigest: Sha256Schema,
  taxonomyDigest: Sha256Schema,
  tagDagDigest: Sha256Schema,
  learningUnitDagDigest: Sha256Schema,
  orderDigest: Sha256Schema,
  placementDigest: Sha256Schema,
  correctionImpactDigest: Sha256Schema,
  status: FinalTaxonomyStatusSchema,
  acceptedAt: OffsetDateTimeSchema.nullable(),
  holdReasons: uniqueArray(nonEmptyText),
  canonicalMaterializationAllowed: z.boolean(),
  buildDigest: Sha256Schema,
}).superRefine((build, context) => {
  const candidatesByKind = {
    tag: build.finalCandidates.filter(
      (candidate): candidate is Extract<typeof candidate, { kind: 'tag' }> =>
        candidate.kind === 'tag',
    ),
    outcome: build.finalCandidates.filter(
      (candidate): candidate is Extract<typeof candidate, { kind: 'outcome' }> =>
        candidate.kind === 'outcome',
    ),
    unit: build.finalCandidates.filter(
      (candidate): candidate is Extract<typeof candidate, { kind: 'unit' }> =>
        candidate.kind === 'unit',
    ),
  };
  if (Object.values(candidatesByKind).some((candidates) => candidates.length === 0)) {
    context.addIssue({
      code: 'custom',
      path: ['finalCandidates'],
      message: 'Final taxonomy requires at least one Tag, Outcome, and Learning Unit candidate.',
    });
  }
  const finalIds = build.finalCandidates.map(finalTaxonomyCandidateId);
  if (
    new Set(finalIds).size !== finalIds.length ||
    finalIds.some((id) => /(?:^|-)(?:preview|provisional)(?:-|$)/u.test(id))
  ) {
    context.addIssue({
      code: 'custom',
      path: ['finalCandidates'],
      message: 'Final taxonomy IDs must be globally unique and cannot use preview namespaces.',
    });
  }
  const tagIds = candidatesByKind.tag.map(({ entity }) => entity.id);
  const outcomeIds = candidatesByKind.outcome.map(({ entity }) => entity.id);
  const unitIds = candidatesByKind.unit.map(({ entity }) => entity.id);
  const problemIds = build.placements.map(({ problemId }) => problemId);
  const tagIdSet = new Set(tagIds);
  const outcomeIdSet = new Set(outcomeIds);
  const unitIdSet = new Set(unitIds);
  const problemIdSet = new Set(problemIds);
  const sourceIdSet = new Set(build.sourceRevisionIds);
  const tagById = new Map(candidatesByKind.tag.map(({ entity }) => [entity.id, entity]));
  const outcomeById = new Map(candidatesByKind.outcome.map(({ entity }) => [entity.id, entity]));
  const tagHasAncestor = (tagId: string, ancestorId: string): boolean => {
    const visited = new Set<string>();
    let currentId: string | null = tagId;
    while (currentId !== null && !visited.has(currentId)) {
      if (currentId === ancestorId) return true;
      visited.add(currentId);
      currentId = tagById.get(currentId)?.parentId ?? null;
    }
    return false;
  };
  if (
    new Set(problemIds).size !== problemIds.length ||
    new Set(build.placements.map(({ id }) => id)).size !== build.placements.length
  ) {
    context.addIssue({
      code: 'custom',
      path: ['placements'],
      message: 'Every Problem and placement ID must occur exactly once.',
    });
  }

  const allEvidenceRefs = [
    ...build.finalCandidates.flatMap(({ evidenceRefs }) => evidenceRefs),
    ...build.placements.flatMap(({ analysisEvidenceRefs }) => analysisEvidenceRefs),
    ...build.integrationMap.entries.flatMap(({ evidenceRefs }) => evidenceRefs),
    ...build.integrationMap.entries.flatMap(({ splitProblemAssignments }) =>
      splitProblemAssignments.flatMap(({ evidenceRefs }) => evidenceRefs),
    ),
    ...build.correctionImpacts.flatMap(({ surfaceAssessments }) =>
      surfaceAssessments.flatMap(({ evidenceRefs }) => evidenceRefs),
    ),
  ];
  const usedSourceIds = [
    ...new Set(allEvidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds)),
  ];
  if (!sameFinalTaxonomySet(build.sourceRevisionIds, usedSourceIds)) {
    context.addIssue({
      code: 'custom',
      path: ['sourceRevisionIds'],
      message:
        'Final taxonomy Source Revisions must exactly equal the source-backed evidence union.',
    });
  }
  for (const candidate of build.finalCandidates) {
    const evidenceSourceIds = [
      ...new Set(candidate.evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds)),
    ];
    if (!sameFinalTaxonomySet(candidate.sourceRevisionIds, evidenceSourceIds)) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Candidate ${candidate.entity.id} has stale Source Revision coverage.`,
      });
    }
    if (candidate.sourceRevisionIds.some((id) => !sourceIdSet.has(id))) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Candidate ${candidate.entity.id} references an unknown Source Revision.`,
      });
    }
  }

  for (const { entity: tag } of candidatesByKind.tag) {
    if (
      tag.lifecycle !== 'active' ||
      tag.replacementTagIds.length > 0 ||
      (tag.parentId !== null && !tagIdSet.has(tag.parentId)) ||
      tag.prerequisiteTagIds.some((id) => !tagIdSet.has(id)) ||
      tag.relatedTags.some(({ tagId }) => !tagIdSet.has(tagId)) ||
      tag.learningOutcomeIds.some((id) => !outcomeIdSet.has(id)) ||
      tag.representativeProblemIds.some((id) => !problemIdSet.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Final Tag ${tag.id} has an invalid lifecycle or reference.`,
      });
    }
  }
  for (const { entity: tag } of candidatesByKind.tag) {
    for (const relation of tag.relatedTags) {
      if (
        SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES.includes(
          relation.type as (typeof SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES)[number],
        ) &&
        !tagById
          .get(relation.tagId)
          ?.relatedTags.some(
            (reverse) => reverse.tagId === tag.id && reverse.type === relation.type,
          )
      ) {
        context.addIssue({
          code: 'custom',
          path: ['finalCandidates'],
          message: `Symmetric Tag relation ${tag.id}/${relation.type}/${relation.tagId} is missing its reverse edge.`,
        });
      }
    }
  }
  for (const { entity: outcome } of candidatesByKind.outcome) {
    const knownScopeIds = new Set([...tagIds, ...unitIds, ...problemIds]);
    if (
      outcome.prerequisiteOutcomeIds.some((id) => !outcomeIdSet.has(id)) ||
      outcome.scopeIds.some((id) => !knownScopeIds.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Final Outcome ${outcome.id} has an unknown reference.`,
      });
    }
  }
  for (const candidate of candidatesByKind.unit) {
    const unit = candidate.entity;
    if (
      !sameFinalTaxonomySet(unit.sourceRevisionIds, candidate.sourceRevisionIds) ||
      (unit.kind !== 'chapter' && unit.problemIds.length < 1) ||
      (unit.parentId !== null && !unitIdSet.has(unit.parentId)) ||
      unit.additionalPrerequisiteUnitIds.some((id) => !unitIdSet.has(id)) ||
      unit.tagIds.some((id) => !tagIdSet.has(id)) ||
      unit.learningOutcomeIds.some((id) => !outcomeIdSet.has(id)) ||
      unit.problemIds.some((id) => !problemIdSet.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Final Learning Unit ${unit.id} has an unknown or stale reference.`,
      });
    }
  }

  const expectedTagEdges = candidatesByKind.tag.flatMap(({ entity }) =>
    entity.prerequisiteTagIds.map((prerequisiteId) => ({ nodeId: entity.id, prerequisiteId })),
  );
  const expectedUnitEdges = candidatesByKind.unit.flatMap(({ entity }) =>
    entity.additionalPrerequisiteUnitIds.map((prerequisiteId) => ({
      nodeId: entity.id,
      prerequisiteId,
    })),
  );
  if (
    !sameFinalTaxonomySet(
      build.tagPrerequisites.map(finalTaxonomyEdgeKey),
      expectedTagEdges.map(finalTaxonomyEdgeKey),
    ) ||
    build.tagPrerequisites.some(
      ({ nodeId, prerequisiteId }) => !tagIdSet.has(nodeId) || !tagIdSet.has(prerequisiteId),
    ) ||
    finalTaxonomyGraphHasCycle(tagIds, build.tagPrerequisites)
  ) {
    context.addIssue({ code: 'custom', path: ['tagPrerequisites'], message: 'Tag DAG is stale.' });
  }
  if (
    !sameFinalTaxonomySet(
      build.learningUnitPrerequisites.map(finalTaxonomyEdgeKey),
      expectedUnitEdges.map(finalTaxonomyEdgeKey),
    ) ||
    build.learningUnitPrerequisites.some(
      ({ nodeId, prerequisiteId }) => !unitIdSet.has(nodeId) || !unitIdSet.has(prerequisiteId),
    ) ||
    finalTaxonomyGraphHasCycle(unitIds, build.learningUnitPrerequisites)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['learningUnitPrerequisites'],
      message: 'Learning Unit DAG is stale.',
    });
  }
  const auxiliaryGraphs = [
    candidatesByKind.tag.flatMap(({ entity }) =>
      entity.parentId === null ? [] : [{ nodeId: entity.id, prerequisiteId: entity.parentId }],
    ),
    candidatesByKind.outcome.flatMap(({ entity }) =>
      entity.prerequisiteOutcomeIds.map((prerequisiteId) => ({
        nodeId: entity.id,
        prerequisiteId,
      })),
    ),
    candidatesByKind.unit.flatMap(({ entity }) =>
      entity.parentId === null ? [] : [{ nodeId: entity.id, prerequisiteId: entity.parentId }],
    ),
  ] as const;
  if (
    finalTaxonomyGraphHasCycle(tagIds, auxiliaryGraphs[0]) ||
    finalTaxonomyGraphHasCycle(outcomeIds, auxiliaryGraphs[1]) ||
    finalTaxonomyGraphHasCycle(unitIds, auxiliaryGraphs[2])
  ) {
    context.addIssue({
      code: 'custom',
      path: ['finalCandidates'],
      message: 'A final taxonomy hierarchy or Outcome prerequisite graph contains a cycle.',
    });
  }

  const unitParentEdges = candidatesByKind.unit.flatMap(({ entity }) =>
    entity.parentId === null ? [] : [{ nodeId: entity.id, prerequisiteId: entity.parentId }],
  );
  const expectedOrder = deterministicFinalLearningUnitOrder(
    candidatesByKind.unit.map(({ entity }) => entity),
    [...build.learningUnitPrerequisites, ...unitParentEdges],
  );
  if (
    !sameFinalTaxonomySet(build.standardOrder, unitIds) ||
    build.standardOrder.some((id, index) => expectedOrder[index] !== id) ||
    candidatesByKind.unit.some(
      ({ entity }) => build.standardOrder[entity.globalIndex] !== entity.id,
    )
  ) {
    context.addIssue({
      code: 'custom',
      path: ['standardOrder'],
      message: 'Learning Unit order or globalIndex is stale.',
    });
  }

  const unitProblemIds = [
    ...new Set(candidatesByKind.unit.flatMap(({ entity }) => entity.problemIds)),
  ];
  if (!sameFinalTaxonomySet(problemIds, unitProblemIds)) {
    context.addIssue({
      code: 'custom',
      path: ['placements'],
      message: 'Placement and Learning Unit Problem coverage must match.',
    });
  }
  const placementByProblemId = new Map(
    build.placements.map((placement) => [placement.problemId, placement]),
  );
  const unitById = new Map(candidatesByKind.unit.map(({ entity }) => [entity.id, entity]));
  for (const { entity: tag } of candidatesByKind.tag) {
    const representativePlacements = tag.representativeProblemIds.flatMap((problemId) => {
      const placement = placementByProblemId.get(problemId);
      return placement === undefined ? [] : [placement];
    });
    if (
      representativePlacements.length !== tag.representativeProblemIds.length ||
      representativePlacements.some((placement) => {
        const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
        return tag.parentId === null
          ? !assignedTagIds.some((tagId) => tagHasAncestor(tagId, tag.id))
          : !assignedTagIds.includes(tag.id);
      }) ||
      (tag.parentId === null &&
        build.placements.some((placement) => placement.primaryTagIds.includes(tag.id)))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['finalCandidates'],
        message: `Tag ${tag.id} does not have reusable representative placement coverage.`,
      });
    }
  }
  for (const placement of build.placements) {
    if (
      placement.primaryTagIds.some((id) => !tagIdSet.has(id)) ||
      placement.supportingTagIds.some((id) => !tagIdSet.has(id)) ||
      !outcomeIdSet.has(placement.primaryOutcomeId) ||
      placement.additionalPrimaryOutcomeIds.some((id) => !outcomeIdSet.has(id)) ||
      placement.supportingOutcomeIds.some((id) => !outcomeIdSet.has(id)) ||
      placement.learningUnitIds.some((id) => !unitIdSet.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['placements'],
        message: `Placement ${placement.id} has an unknown taxonomy reference.`,
      });
      continue;
    }
    const assignedUnits = placement.learningUnitIds.flatMap((id) => {
      const unit = unitById.get(id);
      return unit === undefined ? [] : [unit];
    });
    const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
    const primaryOutcomeIds = [
      placement.primaryOutcomeId,
      ...placement.additionalPrimaryOutcomeIds,
    ];
    const assignedOutcomeIds = [...primaryOutcomeIds, ...placement.supportingOutcomeIds];
    if (
      primaryOutcomeIds.some(
        (outcomeId) =>
          !outcomeById
            .get(outcomeId)
            ?.scopeIds.some((tagId) => placement.primaryTagIds.includes(tagId)),
      ) ||
      placement.primaryTagIds.some((tagId) =>
        primaryOutcomeIds.every(
          (outcomeId) => !outcomeById.get(outcomeId)?.scopeIds.includes(tagId),
        ),
      ) ||
      placement.supportingOutcomeIds.some(
        (outcomeId) =>
          !outcomeById
            .get(outcomeId)
            ?.scopeIds.some((tagId) => placement.supportingTagIds.includes(tagId)),
      ) ||
      placement.supportingTagIds.some((tagId) =>
        placement.supportingOutcomeIds.every(
          (outcomeId) => !outcomeById.get(outcomeId)?.scopeIds.includes(tagId),
        ),
      )
    ) {
      context.addIssue({
        code: 'custom',
        path: ['placements'],
        message: `Placement ${placement.id} has inconsistent primary/supporting Outcome roles.`,
      });
    }
    if (
      assignedUnits.some((unit) => !unit.problemIds.includes(placement.problemId)) ||
      assignedTagIds.some((id) => !assignedUnits.some((unit) => unit.tagIds.includes(id))) ||
      assignedOutcomeIds.some(
        (id) => !assignedUnits.some((unit) => unit.learningOutcomeIds.includes(id)),
      )
    ) {
      context.addIssue({
        code: 'custom',
        path: ['placements'],
        message: `Placement ${placement.id} is not reachable through its Learning Units.`,
      });
    }
    if (placement.primaryProblemId !== null) {
      const primary = placementByProblemId.get(placement.primaryProblemId);
      const primaryOutcomeIds =
        primary === undefined
          ? []
          : [
              primary.primaryOutcomeId,
              ...primary.additionalPrimaryOutcomeIds,
              ...primary.supportingOutcomeIds,
            ];
      if (
        primary?.kind !== 'full' ||
        placement.sharedOutcomeIds.some(
          (id) => !assignedOutcomeIds.includes(id) || !primaryOutcomeIds.includes(id),
        )
      ) {
        context.addIssue({
          code: 'custom',
          path: ['placements'],
          message: `Abbreviated placement ${placement.id} has an invalid primary Problem.`,
        });
      }
    }
  }

  const candidateKindById = new Map(
    build.finalCandidates.map((candidate) => [candidate.entity.id, candidate.kind]),
  );
  const unitHasAncestor = (unitId: string, ancestorId: string): boolean => {
    const visited = new Set<string>();
    let currentId: string | null = unitId;
    while (currentId !== null && !visited.has(currentId)) {
      if (currentId === ancestorId) return true;
      visited.add(currentId);
      currentId = unitById.get(currentId)?.parentId ?? null;
    }
    return false;
  };
  const placementUsesTarget = (
    placement: (typeof build.placements)[number] | undefined,
    kind: 'tag' | 'outcome' | 'unit',
    targetId: string,
  ): boolean => {
    if (placement === undefined) return false;
    if (kind === 'tag') {
      const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
      const target = tagById.get(targetId);
      return (
        assignedTagIds.includes(targetId) ||
        (target?.parentId === null &&
          assignedTagIds.some((tagId) => tagHasAncestor(tagId, targetId)))
      );
    }
    if (kind === 'outcome') {
      if (
        [
          placement.primaryOutcomeId,
          ...placement.additionalPrimaryOutcomeIds,
          ...placement.supportingOutcomeIds,
        ].includes(targetId)
      ) {
        return true;
      }
      const target = outcomeById.get(targetId);
      const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
      return (
        target?.scopeIds.some(
          (scopeId) =>
            tagById.get(scopeId)?.parentId === null &&
            assignedTagIds.some((tagId) => tagHasAncestor(tagId, scopeId)),
        ) === true
      );
    }
    return placement.learningUnitIds.some((unitId) => unitHasAncestor(unitId, targetId));
  };
  for (const entry of build.integrationMap.entries) {
    if (
      entry.finalEntityIds.some((id) => candidateKindById.get(id) !== entry.previewEntityKind) ||
      entry.affectedProblemIds.some((id) => !problemIdSet.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['integrationMap'],
        message: `Integration entry ${entry.previewEntityId} has an unknown final target or Problem.`,
      });
    }
    if (entry.action === 'split') {
      for (const assignment of entry.splitProblemAssignments) {
        for (const problemId of assignment.problemIds) {
          const placement = placementByProblemId.get(problemId);
          const assignedIds =
            entry.previewEntityKind === 'tag'
              ? placement === undefined
                ? []
                : [...placement.primaryTagIds, ...placement.supportingTagIds]
              : entry.previewEntityKind === 'outcome'
                ? placement === undefined
                  ? []
                  : [
                      placement.primaryOutcomeId,
                      ...placement.additionalPrimaryOutcomeIds,
                      ...placement.supportingOutcomeIds,
                    ]
                : (placement?.learningUnitIds ?? []);
          const usesAssignedTarget =
            entry.previewEntityKind === 'unit'
              ? placementUsesTarget(placement, 'unit', assignment.finalEntityId)
              : assignedIds.includes(assignment.finalEntityId);
          if (!usesAssignedTarget) {
            context.addIssue({
              code: 'custom',
              path: ['integrationMap'],
              message: `Split target ${assignment.finalEntityId} is missing from ${problemId}.`,
            });
          }
        }
      }
    }
    const representativeAssignments =
      entry.action === 'split'
        ? entry.splitProblemAssignments.map(({ finalEntityId, representativeProblemIds }) => ({
            finalEntityId,
            representativeProblemIds,
          }))
        : entry.action === 'promote' || entry.action === 'merge'
          ? [
              {
                finalEntityId: entry.finalEntityIds[0],
                representativeProblemIds: entry.decisionEvidence.representativeProblemIds,
              },
            ]
          : [];
    for (const { finalEntityId, representativeProblemIds } of representativeAssignments) {
      for (const problemId of representativeProblemIds) {
        const placement = placementByProblemId.get(problemId);
        if (
          finalEntityId === undefined ||
          !placementUsesTarget(placement, entry.previewEntityKind, finalEntityId)
        ) {
          context.addIssue({
            code: 'custom',
            path: ['integrationMap'],
            message: `Representative ${problemId} does not use target ${finalEntityId ?? '<missing>'}.`,
          });
        }
      }
    }
  }

  const impactIds = build.correctionImpacts.map(({ id }) => id);
  const referencedImpactIds = build.integrationMap.entries.flatMap(
    ({ correctionImpactIds }) => correctionImpactIds,
  );
  if (!sameFinalTaxonomySet(impactIds, referencedImpactIds)) {
    context.addIssue({
      code: 'custom',
      path: ['correctionImpacts'],
      message: 'Correction impact IDs must exactly cover the integration map.',
    });
  }
  for (const impact of build.correctionImpacts) {
    const owningEntries = build.integrationMap.entries.filter(({ correctionImpactIds }) =>
      correctionImpactIds.includes(impact.id),
    );
    const expectedPreviewIds = owningEntries.map(({ previewEntityId }) => previewEntityId);
    const expectedProblemIds = [
      ...new Set(owningEntries.flatMap(({ affectedProblemIds }) => affectedProblemIds)),
    ];
    if (
      !sameFinalTaxonomySet(impact.integrationPreviewEntityIds, expectedPreviewIds) ||
      !sameFinalTaxonomySet(impact.affectedProblemIds, expectedProblemIds) ||
      impact.sourceRevisionIds.some((id) => !sourceIdSet.has(id)) ||
      impact.affectedLearningUnitCandidateIds.some((id) => !unitIdSet.has(id))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['correctionImpacts'],
        message: `Correction impact ${impact.id} has stale integration scope.`,
      });
    }
  }

  if (
    build.inputs.inventory.inventoryDigest !== build.integrationMap.inventoryDigest ||
    build.inputs.previewSnapshot.joinDigest !== build.integrationMap.previewSnapshotDigest ||
    build.integrationMapDigest !== build.integrationMap.integrationDigest
  ) {
    context.addIssue({
      code: 'custom',
      path: ['inputs'],
      message: 'Final taxonomy input digests do not match the integration map.',
    });
  }
  const subject = {
    inputs: build.inputs,
    policy: build.policy,
    integrationSubjectDigest: build.integrationMap.integrationSubjectDigest,
    finalCandidates: build.finalCandidates,
    tagPrerequisites: build.tagPrerequisites,
    learningUnitPrerequisites: build.learningUnitPrerequisites,
    standardOrder: build.standardOrder,
    placements: build.placements,
    correctionImpacts: build.correctionImpacts.map((impact) =>
      Object.fromEntries(
        Object.entries(impact).filter(([field]) => field !== 'verificationStatus'),
      ),
    ),
    sourceRevisionIds: build.sourceRevisionIds,
  };
  const expectedSubjectDigest = canonicalDigest(subject);
  if (
    build.taxonomySubjectDigest !== expectedSubjectDigest ||
    build.reviewEvidenceRefs.some(
      (reference) =>
        reference.subjectDigest !== expectedSubjectDigest ||
        reference.reviewMode !== build.policy.requiredReviewMode,
    )
  ) {
    context.addIssue({
      code: 'custom',
      path: ['reviewEvidenceRefs'],
      message: 'Current-subject review evidence is missing or uses the wrong review mode.',
    });
  }
  const expectedDigests = {
    integrationMapDigest: build.integrationMap.integrationDigest,
    taxonomyDigest: canonicalDigest(build.finalCandidates),
    tagDagDigest: canonicalDigest(build.tagPrerequisites),
    learningUnitDagDigest: canonicalDigest(build.learningUnitPrerequisites),
    orderDigest: canonicalDigest(build.standardOrder),
    placementDigest: canonicalDigest(build.placements),
    correctionImpactDigest: canonicalDigest(build.correctionImpacts),
  };
  for (const [field, expected] of Object.entries(expectedDigests)) {
    if (build[field as keyof typeof expectedDigests] !== expected) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `${field} is stale.`,
      });
    }
  }
  const accepted = build.status === 'accepted';
  const acceptedReviewEvidenceId = build.reviewEvidenceRefs[0]?.evidenceId;
  if (
    accepted !== (build.acceptedAt !== null) ||
    accepted !== build.canonicalMaterializationAllowed ||
    (accepted &&
      (build.reviewEvidenceRefs.length !== 1 ||
        build.holdReasons.length > 0 ||
        build.integrationMap.status !== 'accepted' ||
        build.integrationMap.entries.some(
          ({ reviewEvidenceId }) => reviewEvidenceId !== acceptedReviewEvidenceId,
        ) ||
        build.correctionImpacts.some(
          ({ verificationStatus }) => verificationStatus !== 'reviewed',
        ) ||
        build.policy.requiredReviewMode !==
          (build.policy.riskReasons.length > 0 ? 'third_party' : 'self'))) ||
    (build.status === 'rejected' && build.holdReasons.length === 0)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['status'],
      message: 'Final taxonomy acceptance fields are inconsistent.',
    });
  }
  if (digestWithoutField(build, 'buildDigest') !== build.buildDigest) {
    context.addIssue({
      code: 'custom',
      path: ['buildDigest'],
      message: 'Final taxonomy build digest is stale.',
    });
  }
});

export const CatalogContract = defineZodContractSchema(
  'catalog.schema.json',
  CatalogSchema,
  {
    $id: 'https://abc-textbook.local/schemas/catalog.schema.json',
    title: 'ABC Textbook Catalog',
    description:
      'ABC212以降を開催済みContestと公式欠番証跡で連続被覆し、各公式問題一覧でDより後に並ぶ全問題、全コーパスTechnique Inventory、典型体系、学習単位、公開履歴を表す。problem labelは固定E〜H enumではなく公式task orderから導出する。',
  },
  {
    ProblemAnalysisClaimRef: ProblemAnalysisClaimRefSchema,
    LearningUnitTaxonomyCandidate: LearningUnitTaxonomyCandidateSchema,
    FinalTaxonomyCandidate: FinalTaxonomyCandidateSchema,
    FinalProblemPlacementProjection: FinalProblemPlacementProjectionSchema,
    PreMaterializationCorrectionImpact: PreMaterializationCorrectionImpactSchema,
    TaxonomyIntegrationMap: TaxonomyIntegrationMapSchema,
    FinalTaxonomyBuild: FinalTaxonomyBuildSchema,
  },
);

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
