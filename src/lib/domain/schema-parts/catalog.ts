import answerMaterialEvidenceContractJson from '../../../../specs/001-build-abc-textbook/contracts/answer-material-evidence.schema.json' with { type: 'json' };
import catalogContractJson from '../../../../specs/001-build-abc-textbook/contracts/catalog.schema.json' with { type: 'json' };
import glossaryContractJson from '../../../../specs/001-build-abc-textbook/contracts/glossary.schema.json' with { type: 'json' };
import prerequisiteBaselineContractJson from '../../../../specs/001-build-abc-textbook/contracts/prerequisite-baseline.schema.json' with { type: 'json' };
import placementPolicyContractJson from '../../../../specs/001-build-abc-textbook/contracts/problem-placement-decision-table.schema.json' with { type: 'json' };
import { z } from 'zod';

import { defineContractSchema, strictObject } from '../contract-schema.js';

export const EntityIdSchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u);
export const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
export const OffsetDateTimeSchema = z.iso.datetime({ offset: true });
export const SafePathSchema = z
  .string()
  .regex(/^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))(?!.*\/\/)[A-Za-z0-9._/-]+$/u);
export const ProblemLabelSchema = z.string().regex(/^[A-Za-z][A-Za-z0-9+_-]*$/u);
export const ContestIdSchema = z.string().regex(/^abc[0-9]{3,}$/u);
export const ProblemIdSchema = z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u);

const nonEmptyText = z.string().trim().min(1);
const entityIds = z.array(EntityIdSchema);

export const ContestSchema = strictObject({
  id: ContestIdSchema,
  number: z.number().int().min(212),
  title: nonEmptyText,
  startedAt: OffsetDateTimeSchema,
  endedAt: OffsetDateTimeSchema,
  officialUrl: z.url({ protocol: /^https$/u, hostname: /^atcoder\.jp$/u }),
  officialTaskOrder: z.array(ProblemLabelSchema).min(1),
  taskOrderSourceRevisionId: EntityIdSchema,
  checkedAt: OffsetDateTimeSchema,
});

export const AdvancedSlotRegistrySchema = strictObject({
  version: z.literal('1.0.0'),
  labels: z.array(ProblemLabelSchema),
  firstSeenContestByLabel: z.record(ProblemLabelSchema, ContestIdSchema),
  orderEvidenceSourceRevisionIds: z.array(EntityIdSchema),
  digest: Sha256Schema,
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
  explanationId: EntityIdSchema.nullable(),
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
  aliases: z.array(nonEmptyText),
  formerNames: z.array(nonEmptyText),
  lifecycle: z.enum(['active', 'deprecated']),
  replacementTagIds: entityIds,
});

export const LearningOutcomeSchema = strictObject({
  id: EntityIdSchema,
  statement: nonEmptyText,
  prerequisiteOutcomeIds: entityIds,
  scopeIds: entityIds,
  assessmentIds: entityIds.min(1),
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
  tagIds: entityIds.min(1),
  learningOutcomeIds: entityIds.min(1),
  docPath: SafePathSchema,
  exampleIds: entityIds.min(1),
  problemIds: z.array(ProblemIdSchema).min(1),
  assessmentIds: entityIds.min(1),
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
  primaryExplanationId: EntityIdSchema.nullable(),
  sharedOutcomeIds: entityIds,
  comparison: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])),
  additionalElement: nonEmptyText.nullable(),
  rationale: nonEmptyText,
  evidenceIds: entityIds.min(1),
});

export const ExplanationSchema = strictObject({
  id: EntityIdSchema,
  problemId: ProblemIdSchema,
  kind: z.enum(['full', 'similar', 'supplement']),
  primaryExplanationId: EntityIdSchema.nullable(),
  differenceSummary: nonEmptyText.nullable(),
  docPath: SafePathSchema,
  learningOutcomeIds: entityIds.min(1),
  baselineId: EntityIdSchema,
  baselineVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  additionalPrerequisiteUnitIds: entityIds,
  excludedTopics: z.array(nonEmptyText),
  tagIds: entityIds.min(1),
  sourceRevisionIds: entityIds.min(1),
  claimIds: entityIds.min(1),
  exampleIds: entityIds.min(1),
  skillName: nonEmptyText,
  skillVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  skillDigest: Sha256Schema,
  revision: z.number().int().positive(),
  sections: z.record(z.string(), nonEmptyText),
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
  explanationIds: entityIds,
  claimIds: entityIds,
  exampleIds: entityIds,
  exerciseIds: entityIds,
  answerMaterialIds: entityIds,
  learningUnitIds: entityIds,
  derivedIndexPaths: z.array(SafePathSchema),
  verificationStatus: z.enum(['pending', 'verified', 'failed']),
});

export const TechnicalClaimSchema = strictObject({
  id: EntityIdSchema,
  text: nonEmptyText,
  sourceRevisionIds: entityIds.min(1),
  authorId: EntityIdSchema,
  verificationStatus: z.enum(['verified', 'unverified', 'stale', 'contradicted']),
});

export const ReproducibleExampleSchema = strictObject({
  id: EntityIdSchema,
  learningOutcomeIds: entityIds.min(1),
  ownerExplanationIds: entityIds,
  ownerLearningUnitIds: entityIds,
  environment: nonEmptyText,
  input: nonEmptyText,
  procedure: z.array(nonEmptyText).min(1),
  expectedResult: nonEmptyText,
  verificationStatus: z.enum(['pending', 'passed', 'failed']),
});

export const ExerciseSchema = strictObject({
  id: EntityIdSchema,
  problemId: ProblemIdSchema.nullable(),
  learningOutcomeIds: entityIds.min(1),
  prerequisiteIds: entityIds,
  attainmentCondition: nonEmptyText,
  assessmentId: EntityIdSchema,
  answerMaterialId: EntityIdSchema,
});

export const AssessmentSchema = strictObject({
  id: EntityIdSchema,
  learningOutcomeIds: entityIds.min(1),
  method: nonEmptyText,
  successCondition: nonEmptyText,
});

export const AnswerMaterialSchema = strictObject({
  id: EntityIdSchema,
  exerciseId: EntityIdSchema,
  reasoningOrVerification: nonEmptyText,
  procedure: z.array(nonEmptyText).min(1),
  expectedResult: nonEmptyText,
  verificationStatus: z.enum(['pending', 'passed', 'failed']),
});

export const CatalogContract = defineContractSchema('catalog.schema.json', catalogContractJson);
export const GlossaryContract = defineContractSchema('glossary.schema.json', glossaryContractJson);
export const PrerequisiteBaselineContract = defineContractSchema(
  'prerequisite-baseline.schema.json',
  prerequisiteBaselineContractJson,
);
export const ProblemPlacementDecisionTableContract = defineContractSchema(
  'problem-placement-decision-table.schema.json',
  placementPolicyContractJson,
);
export const AnswerMaterialEvidenceContract = defineContractSchema(
  'answer-material-evidence.schema.json',
  answerMaterialEvidenceContractJson,
);

export const CatalogSchema = CatalogContract.schema;
export const GlossarySchema = GlossaryContract.schema;
export const PrerequisiteBaselineSchema = PrerequisiteBaselineContract.schema;
export const ProblemPlacementDecisionTableSchema = ProblemPlacementDecisionTableContract.schema;
