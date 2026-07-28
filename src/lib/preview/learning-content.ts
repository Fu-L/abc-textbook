import { z } from 'zod';

import { canonicalDigest } from '../domain/canonical-json.js';
import {
  LearningUnitInlineExampleSchema,
  InlineExerciseSchema,
} from '../domain/schema-parts/authoring-unit.js';
import { OffsetDateTimeSchema } from '../domain/schema-parts/catalog.js';
import { createContentWorkManifest } from '../validation/content-work-manifest.js';
import {
  componentEvidenceDigest,
  componentSubjectDigest,
  type ComponentEvidence,
} from './preview-snapshot.js';

const PROBLEM_ID = /^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const TASK_ID = /^T05[1-4]$/u;
const REQUIREMENT_IDS = [
  'FR-006',
  'FR-009',
  'FR-010',
  'FR-011',
  'FR-012',
  'FR-013',
  'FR-019',
  'FR-022',
  'FR-023',
  'FR-025',
  'FR-026',
  'FR-031',
  'CQ-001',
  'CQ-002',
  'CQ-003',
  'CQ-004',
  'CQ-005',
  'CQ-006',
  'CQ-007',
] as const;
const CHECK_NAMES = [
  'source-traceability',
  'example-answer',
  'links',
  'accessibility',
  'schema',
  'review-policy',
] as const;

const unique = (values: readonly string[]): boolean => new Set(values).size === values.length;
const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);
const sameSet = (left: readonly string[], right: readonly string[]): boolean =>
  unique(left) &&
  unique(right) &&
  left.length === right.length &&
  left.every((item) => right.includes(item));

export class PreviewLearningContentError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = 'PreviewLearningContentError';
    this.code = code;
  }
}

export interface PreviewLearningContentManifestInput {
  previewId: string;
  manifestDigest: string;
  candidatePoolDigest: string;
  selectedProblemIds: string[];
  sourceRevisionIds: string[];
}

export interface PreviewLearningUnitInput {
  id: string;
  title: string;
  prerequisiteUnitIds: string[];
  excludedTopics: string[];
  tagIds: string[];
  problemIds: string[];
  sourceRevisionIds: string[];
  explanation: string;
  examples: z.input<typeof LearningUnitInlineExampleSchema>[];
  exercises: z.input<typeof InlineExerciseSchema>[];
  navigation: {
    previousUnitId: string | null;
    nextUnitId: string | null;
    orderReason: string;
  };
}

export interface PreviewLearningContentDomainInput {
  taskId: string;
  domain: string;
  directory: string;
  frozenAt: string;
  ownerId: string;
  expectedProblemIds: string[];
  expectedSourceRevisionIds: string[];
  outcome: { id: string; statement: string };
  unit: PreviewLearningUnitInput;
}

export interface PreviewLearningContentBuildInput {
  manifest: PreviewLearningContentManifestInput;
  taxonomyDigest: string;
  authoringSkill: { version: string; digest: string; sourcePacketDigest: string };
  domain: PreviewLearningContentDomainInput;
}

const domainProposalSchema = z.strictObject({
  taskId: z.string().regex(TASK_ID),
  domain: z.string().regex(SLUG),
  directory: z.string().regex(SLUG),
  frozenAt: OffsetDateTimeSchema,
  ownerId: z.string().regex(/^person-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  outcome: z.strictObject({ id: z.string().min(1), statement: z.string().trim().min(1) }),
  unit: z.strictObject({
    id: z.string().min(1),
    title: z.string().trim().min(1),
    prerequisiteUnitIds: z.array(z.string().min(1)),
    excludedTopics: z.array(z.string().trim().min(1)),
    tagIds: z.array(z.string().min(1)).min(1),
    problemIds: z.array(z.string().regex(PROBLEM_ID)).min(1),
    sourceRevisionIds: z.array(z.string().min(1)).min(1),
    explanation: z.string().trim().min(1),
    examples: z.array(LearningUnitInlineExampleSchema).min(1),
    exercises: z.array(InlineExerciseSchema).min(1),
    navigation: z.strictObject({
      previousUnitId: z.string().min(1).nullable(),
      nextUnitId: z.string().min(1).nullable(),
      orderReason: z.string().trim().min(1),
    }),
  }),
});

export const parsePreviewLearningContentDomainProposal = (
  value: unknown,
  expectedProblemIds: readonly string[],
  expectedSourceRevisionIds: readonly string[],
): PreviewLearningContentDomainInput => ({
  ...domainProposalSchema.parse(value),
  expectedProblemIds: [...expectedProblemIds],
  expectedSourceRevisionIds: [...expectedSourceRevisionIds],
});

export interface PreviewLearningUnitArtifact extends Readonly<Record<string, unknown>> {
  readonly schemaVersion: '1.0.0';
  readonly previewId: string;
  readonly domain: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly canonicalMaterializationAllowed: false;
  readonly contentDigest: string;
}

export interface PreviewLearningContentWorkManifest extends Readonly<Record<string, unknown>> {
  readonly taskId: string;
  readonly digest: string;
}

export interface PreviewLearningContentArtifacts {
  readonly learningUnitPath: string;
  readonly workManifestPath: string;
  readonly componentPath: string;
  readonly learningUnit: PreviewLearningUnitArtifact;
  readonly workManifest: PreviewLearningContentWorkManifest;
  readonly component: ComponentEvidence;
}

const validateInput = (input: PreviewLearningContentBuildInput): void => {
  const { manifest, domain, authoringSkill } = input;
  if (
    !SLUG.test(manifest.previewId) ||
    !SHA256.test(manifest.manifestDigest) ||
    !SHA256.test(manifest.candidatePoolDigest) ||
    !SHA256.test(input.taxonomyDigest) ||
    !SHA256.test(authoringSkill.digest) ||
    !SHA256.test(authoringSkill.sourcePacketDigest) ||
    !/^\d+\.\d+\.\d+$/u.test(authoringSkill.version) ||
    !TASK_ID.test(domain.taskId) ||
    !SLUG.test(domain.domain) ||
    !SLUG.test(domain.directory) ||
    !OffsetDateTimeSchema.safeParse(domain.frozenAt).success
  ) {
    throw new PreviewLearningContentError('INPUT_INVALID', 'Digest, ID, task, or date is invalid.');
  }
  if (
    !sameSet(domain.unit.problemIds, domain.expectedProblemIds) ||
    domain.unit.problemIds.some((problemId) => !PROBLEM_ID.test(problemId)) ||
    domain.unit.problemIds.some((problemId) => !manifest.selectedProblemIds.includes(problemId))
  ) {
    throw new PreviewLearningContentError(
      'COHORT_MISMATCH',
      'The LearningUnit must own exactly the taxonomy group Problems.',
    );
  }
  if (
    !sameSet(domain.unit.sourceRevisionIds, domain.expectedSourceRevisionIds) ||
    domain.unit.sourceRevisionIds.some((sourceId) => !manifest.sourceRevisionIds.includes(sourceId))
  ) {
    throw new PreviewLearningContentError(
      'SOURCE_MISMATCH',
      'The LearningUnit source packet does not match its taxonomy group.',
    );
  }
  if (
    domain.outcome.id.trim().length === 0 ||
    domain.outcome.statement.trim().length === 0 ||
    domain.unit.id.trim().length === 0 ||
    domain.unit.title.trim().length === 0 ||
    domain.unit.explanation.trim().length === 0 ||
    domain.unit.tagIds.length === 0 ||
    domain.unit.examples.length === 0 ||
    domain.unit.exercises.length === 0
  ) {
    throw new PreviewLearningContentError(
      'CONTENT_INCOMPLETE',
      'Required learning content is empty.',
    );
  }
  for (const example of domain.unit.examples) LearningUnitInlineExampleSchema.parse(example);
  for (const exercise of domain.unit.exercises) InlineExerciseSchema.parse(exercise);
  const expectedOutcomeIds = [domain.outcome.id];
  if (
    domain.unit.examples.some(
      ({ learningOutcomeIds }) => !sameSet(learningOutcomeIds, expectedOutcomeIds),
    ) ||
    domain.unit.exercises.some(
      ({ learningOutcomeIds }) => !sameSet(learningOutcomeIds, expectedOutcomeIds),
    ) ||
    domain.unit.exercises.some(({ answer }) => answer.verificationStatus !== 'passed')
  ) {
    throw new PreviewLearningContentError(
      'ATTAINMENT_MISMATCH',
      'Every example and exercise must bind to the candidate Outcome with a passed answer.',
    );
  }
};

const withDigest = <T extends Readonly<Record<string, unknown>>, K extends string>(
  subject: T,
  field: K,
): T & Readonly<Record<K, string>> => ({ ...subject, [field]: canonicalDigest(subject) });

export const buildPreviewLearningContentArtifacts = (
  input: PreviewLearningContentBuildInput,
): PreviewLearningContentArtifacts => {
  validateInput(input);
  const { manifest, domain, authoringSkill } = input;
  const root = `staging/previews/${manifest.previewId}/learning/${domain.directory}`;
  const learningUnitPath = `${root}/learning-unit.json`;
  const workManifestPath = `docs/work-manifests/initial/us2/preview-content/${domain.directory}/manifest.json`;
  const componentPath = `docs/verification/previews/${manifest.previewId}/components/content/${domain.directory}.json`;
  const learningUnit = withDigest(
    {
      schemaVersion: '1.0.0' as const,
      previewId: manifest.previewId,
      domain: domain.domain,
      outcome: domain.outcome,
      learningUnit: {
        ...domain.unit,
        learningOutcomeIds: [domain.outcome.id],
      },
      authoringSkillVersion: authoringSkill.version,
      authoringSkillDigest: authoringSkill.digest,
      sourcePacketDigest: authoringSkill.sourcePacketDigest,
      canonicalMaterializationAllowed: false as const,
      finalMaterializationTasks: ['T155', 'T156', 'T157', 'T158'],
    },
    'contentDigest',
  ) as PreviewLearningUnitArtifact;
  const workManifest = createContentWorkManifest({
    manifestId: `work-manifest-${domain.taskId}-${domain.directory}`,
    taskId: domain.taskId,
    changeKind: 'content',
    requiredRequirementIds: REQUIREMENT_IDS,
    learningOutcomeIds: [domain.outcome.id],
    reviewPolicy: { requiredMode: 'self', riskReasons: [] },
    reviewUnits: [
      {
        unitId: `RU-${domain.taskId}-${domain.directory}`,
        paths: [learningUnitPath, componentPath],
        itemIds: [
          `outcome:${domain.outcome.id}`,
          `unit:${domain.unit.id}`,
          ...domain.unit.problemIds.map((problemId) => `problem:${problemId}`),
        ],
        requirementIds: REQUIREMENT_IDS,
        learningOutcomeIds: [domain.outcome.id],
        dependencyUnitIds: [],
        checkIds: CHECK_NAMES.map((name) => `check-${domain.directory}-${name}`),
        evidenceRole: 'preview_learning_content_review',
        ownerId: domain.ownerId,
      },
    ],
    maintenanceBenefit: null,
    createdAt: domain.frozenAt,
  }) as PreviewLearningContentWorkManifest;
  const artifactDigest = canonicalDigest({
    learningUnitDigest: learningUnit.contentDigest,
    workManifestDigest: workManifest.digest,
    paths: [learningUnitPath, workManifestPath],
  });
  const currentSubject = {
    componentId: `content-${domain.directory}`,
    previewId: manifest.previewId,
    manifestDigest: manifest.manifestDigest,
    candidatePoolDigest: manifest.candidatePoolDigest,
    problemIds: manifest.selectedProblemIds,
    sourceRevisionIds: manifest.sourceRevisionIds,
    provisionalTaxonomyDigest: input.taxonomyDigest,
    authoringSkillVersion: authoringSkill.version,
    authoringSkillDigest: authoringSkill.digest,
    artifactDigest,
  };
  const subjectDigest = componentSubjectDigest(currentSubject);
  const checkResults = CHECK_NAMES.map((name) => ({
    checkResultId: `check:${domain.directory}:${name}`,
    subjectDigest,
    passed: true,
  }));
  const reviewEvidence = [
    {
      reviewEvidenceId: `review:${domain.directory}:self`,
      subjectDigest,
      requiredMode: 'self' as const,
      reviewMode: 'self' as const,
      aggregatePassed: true,
    },
  ];
  const componentSubject = { ...currentSubject, subjectDigest, checkResults, reviewEvidence };
  const component: ComponentEvidence = {
    ...componentSubject,
    componentDigest: componentEvidenceDigest(componentSubject),
  };
  return {
    learningUnitPath,
    workManifestPath,
    componentPath,
    learningUnit,
    workManifest,
    component,
  };
};

export const validatePreviewLearningContentArtifacts = (
  input: PreviewLearningContentBuildInput,
  artifacts: PreviewLearningContentArtifacts,
): string[] => {
  const violations: string[] = [];
  const allowedRoot = `staging/previews/${input.manifest.previewId}/learning/`;
  if (!artifacts.learningUnitPath.startsWith(allowedRoot)) {
    violations.push(`canonical_path_forbidden:${artifacts.learningUnitPath}`);
  }
  const rebuilt = buildPreviewLearningContentArtifacts(input);
  if (canonicalDigest(artifacts.learningUnit) !== canonicalDigest(rebuilt.learningUnit)) {
    violations.push('learning_unit_stale');
  }
  if (canonicalDigest(artifacts.workManifest) !== canonicalDigest(rebuilt.workManifest)) {
    violations.push('work_manifest_stale');
  }
  if (canonicalDigest(artifacts.component) !== canonicalDigest(rebuilt.component)) {
    violations.push('component_evidence_stale');
  }
  if (!sameOrderedValues(artifacts.component.problemIds, input.manifest.selectedProblemIds)) {
    violations.push('component_cohort_mismatch');
  }
  return violations;
};
