import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { FrozenPreviewCohortSchema } from '../corpus/technique-inventory.js';
import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { previewComponentOutputDigest } from './preview-chain.js';
import {
  componentEvidenceDigest,
  componentSubjectDigest,
  previewSnapshotJoinDigest,
  type PreviewSnapshot,
  type PreviewSnapshotDigestSubject,
} from './preview-snapshot.js';

const previewManifestPath = 'staging/previews/initial-v1/preview-manifest.json';
const authoringSkillManifestPath =
  'docs/verification/authoring-skill/initial-v1/skill-manifest.json';

export const FROZEN_PREVIEW_METADATA_COMPONENT_PATH =
  'docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json';

const componentPaths = {
  'metadata-inventory-taxonomy': FROZEN_PREVIEW_METADATA_COMPONENT_PATH,
  'content-graph-search':
    'docs/verification/previews/initial-v1/components/content/graph-search.json',
  'content-dynamic-programming':
    'docs/verification/previews/initial-v1/components/content/dynamic-programming.json',
  'content-data-structures':
    'docs/verification/previews/initial-v1/components/content/data-structures.json',
  'content-mathematics':
    'docs/verification/previews/initial-v1/components/content/mathematics.json',
  'learning-records': 'docs/verification/previews/initial-v1/components/learning-records.json',
  'ui-search': 'docs/verification/previews/initial-v1/components/ui-search.json',
  'update-simulation': 'docs/verification/previews/initial-v1/components/update-simulation.json',
} as const;

type FrozenComponentId = keyof typeof componentPaths;

const frozenComponentIds = Object.keys(componentPaths) as FrozenComponentId[];

/** T154 is deliberately closed over these ten frozen inputs. */
export const frozenPreviewInputPaths = [
  previewManifestPath,
  authoringSkillManifestPath,
  ...frozenComponentIds.map((componentId) => componentPaths[componentId]),
] as const;

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const nonEmptyString = z.string().min(1);
const stringArray = z.array(nonEmptyString);

const checkResultSchema = z.strictObject({
  checkResultId: nonEmptyString,
  subjectDigest: digest,
  passed: z.boolean(),
});

const reviewEvidenceSchema = z.strictObject({
  reviewEvidenceId: nonEmptyString,
  subjectDigest: digest,
  requiredMode: z.enum(['self', 'third_party']),
  reviewMode: z.enum(['self', 'third_party']),
  aggregatePassed: z.boolean(),
});

const structuredComponentSchema = z.strictObject({
  componentId: nonEmptyString,
  previewId: nonEmptyString,
  manifestDigest: digest,
  candidatePoolDigest: digest,
  problemIds: stringArray,
  sourceRevisionIds: stringArray,
  provisionalTaxonomyDigest: digest,
  authoringSkillVersion: nonEmptyString,
  authoringSkillDigest: digest,
  artifactDigest: digest,
  subjectDigest: digest,
  checkResults: z.array(checkResultSchema),
  reviewEvidence: z.array(reviewEvidenceSchema),
  status: z.enum(['on_hold', 'passed']),
  holdReasons: stringArray,
  componentDigest: digest,
});

export const FrozenPreviewMetadataComponentSchema = z.strictObject({
  componentId: z.literal('metadata-inventory-taxonomy'),
  previewId: nonEmptyString,
  manifestDigest: digest,
  problemIds: stringArray,
  inputDigest: digest,
  artifactDigest: digest,
  outputDigest: digest,
  status: z.enum(['on_hold', 'passed']),
  inventoryComponentDigest: digest,
  classificationsDigest: digest,
  proposalDigest: digest,
  taxonomyDigest: digest,
  integrationDigest: digest,
  workManifestDigest: digest,
  inputPaths: stringArray,
  artifactPaths: stringArray,
});

const artifactFileSchema = z.strictObject({ path: nonEmptyString, digest });
const reviewReferenceSchema = z.strictObject({
  path: nonEmptyString,
  digest,
  subjectDigest: digest,
  reviewMode: z.enum(['self', 'third_party']),
  aggregatePassed: z.boolean(),
});

const reviewedComponentSchema = z.strictObject({
  componentId: z.enum(['learning-records', 'ui-search']),
  previewId: nonEmptyString,
  manifestDigest: digest,
  problemIds: stringArray,
  inputDigest: digest,
  artifactDigest: digest,
  outputDigest: digest,
  catalogSubjectDigest: digest,
  status: z.enum(['on_hold', 'passed']),
  workManifestPath: nonEmptyString,
  workManifestDigest: digest,
  artifactFiles: z.array(artifactFileSchema),
  reviewEvidence: reviewReferenceSchema,
});

const authoringSkillManifestSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  manifestId: z.literal('abc-explanation-author-initial-v1'),
  status: z.literal('frozen'),
  authoringSkillName: z.literal('abc-explanation-author'),
  authoringSkillVersion: nonEmptyString,
  authoringSkillDigest: digest,
  sourceNormalizationVersion: nonEmptyString,
  artifacts: z.array(artifactFileSchema).min(1),
  sourcePacket: z.object({
    path: nonEmptyString,
    digest,
    inputProblemIds: stringArray,
    inputSourceRevisionIds: stringArray,
    allowedUses: stringArray,
  }),
  inputContract: z.object({
    requiredFields: stringArray,
    insufficientInputStatus: z.enum(['authoring_required', 'blocked']),
    requireOfficialProblemRevision: z.boolean(),
    requireClaimSourceAllowedUse: z.boolean(),
    requireClaimSourceTaskMatch: z.boolean(),
    rejectSkillSubjectMismatch: z.boolean(),
  }),
  outputContract: z.object({
    schemaPath: nonEmptyString,
    writingPolicyPath: nonEmptyString,
    resultStatuses: stringArray,
    fullRequiredSections: stringArray,
    abbreviatedRequiredSections: stringArray,
    coLocatedBlocks: stringArray,
    publishableVerification: z.object({
      claims: z.literal('verified'),
      executableExamples: z.literal('passed'),
      answers: z.literal('passed'),
    }),
  }),
  reviewPolicy: z.object({
    defaultMode: z.literal('self'),
    highRiskMode: z.literal('third_party'),
    highRiskReasons: stringArray,
  }),
  consumers: stringArray,
});

const structuredCheckIds: Readonly<
  Record<
    | 'content-graph-search'
    | 'content-dynamic-programming'
    | 'content-data-structures'
    | 'content-mathematics'
    | 'update-simulation',
    readonly string[]
  >
> = {
  'content-graph-search': [
    'check:graph-search:source-traceability',
    'check:graph-search:example-answer',
    'check:graph-search:links',
    'check:graph-search:accessibility',
    'check:graph-search:schema',
    'check:graph-search:review-policy',
  ],
  'content-dynamic-programming': [
    'check:dynamic-programming:source-traceability',
    'check:dynamic-programming:example-answer',
    'check:dynamic-programming:links',
    'check:dynamic-programming:accessibility',
    'check:dynamic-programming:schema',
    'check:dynamic-programming:review-policy',
  ],
  'content-data-structures': [
    'check:data-structures:source-traceability',
    'check:data-structures:example-answer',
    'check:data-structures:links',
    'check:data-structures:accessibility',
    'check:data-structures:schema',
    'check:data-structures:review-policy',
  ],
  'content-mathematics': [
    'check:mathematics:source-traceability',
    'check:mathematics:example-answer',
    'check:mathematics:links',
    'check:mathematics:accessibility',
    'check:mathematics:schema',
    'check:mathematics:review-policy',
  ],
  'update-simulation': [
    'check:update:discovery',
    'check:update:authoring',
    'check:update:validation',
    'check:update:idempotency',
    'check:update:staging-closure',
  ],
};

const structuredReviewIds = {
  'content-graph-search': ['review:graph-search:self'],
  'content-dynamic-programming': ['review:dynamic-programming:self'],
  'content-data-structures': ['review:data-structures:self'],
  'content-mathematics': ['review:mathematics:self'],
  'update-simulation': ['review:update-simulation:self'],
} as const;

const frozenEnvelopeCheckIds = {
  'metadata-inventory-taxonomy': ['check-preview-taxonomy', 'check-taxonomy-integration'],
  'learning-records': [
    'check-us3-unit',
    'check-us3-integration',
    'check-us3-e2e',
    'check-us3-static-quality',
  ],
  'ui-search': [
    'check-us4-contracts',
    'check-us4-e2e',
    'check-us4-base-path',
    'check-us4-links',
    'check-us4-static-quality',
  ],
} as const;

const reviewedComponentReviewIds = {
  'learning-records': 'human-content-review-initial-v1-us3',
  'ui-search': 'human-content-review-initial-v1-us4',
} as const;

const requiredCheckResultIds = frozenComponentIds.flatMap((componentId) => {
  if (componentId in structuredCheckIds) {
    return structuredCheckIds[componentId as keyof typeof structuredCheckIds];
  }
  return frozenEnvelopeCheckIds[componentId as keyof typeof frozenEnvelopeCheckIds];
});

const requiredReviewEvidenceIds = frozenComponentIds.flatMap((componentId) => {
  if (componentId in structuredReviewIds) {
    return structuredReviewIds[componentId as keyof typeof structuredReviewIds];
  }
  if (componentId in reviewedComponentReviewIds) {
    return [reviewedComponentReviewIds[componentId as keyof typeof reviewedComponentReviewIds]];
  }
  return [];
});

const expectedMetadataInputPaths = [
  'staging/previews/initial-v1/candidate-classifications.json',
  'docs/work-manifests/initial/us2/taxonomy/proposal.json',
] as const;

const expectedMetadataArtifactPaths = [
  'staging/previews/initial-v1/taxonomy/index.json',
  'staging/previews/initial-v1/taxonomy/groups/mathematics-combinatorics.json',
  'staging/previews/initial-v1/taxonomy/groups/dynamic-programming.json',
  'staging/previews/initial-v1/taxonomy/groups/graph-search.json',
  'staging/previews/initial-v1/taxonomy/groups/data-structures-algorithm-design.json',
  'docs/verification/previews/initial-v1/taxonomy-integration.json',
  'docs/work-manifests/initial/us2/taxonomy/manifest.json',
] as const;

const reviewedComponentRequirements = {
  'learning-records': {
    workManifestPath: 'docs/work-manifests/initial/us3/manifest.json',
    reviewPath: 'docs/reviews/human-content/previews/initial-v1/us3/learning-records-review.json',
    artifactPaths: [
      'docs/verification/previews/initial-v1/learning-records/acceptance.json',
      'docs/verification/previews/initial-v1/learning-records/e2e.json',
      'docs/verification/previews/initial-v1/learning-records/raw-playwright.json',
      'docs/reviews/human-content/previews/initial-v1/us3/learning-records-review.json',
    ],
  },
  'ui-search': {
    workManifestPath: 'docs/work-manifests/initial/us4/manifest.json',
    reviewPath: 'docs/reviews/human-content/previews/initial-v1/us4/ui-search-review.json',
    artifactPaths: [
      'docs/verification/previews/initial-v1/ui-search/acceptance.json',
      'docs/verification/previews/initial-v1/ui-search/routes-links.json',
      'docs/reviews/human-content/previews/initial-v1/us4/ui-search-review.json',
    ],
  },
} as const;

const requiredDomains = [
  'graph-search',
  'dynamic-programming',
  'data-structures-algorithm-design',
  'mathematics-combinatorics',
] as const;

const requiredSkillInputFields = [
  'problemId',
  'learningOutcomeIds',
  'baseline',
  'additionalPrerequisiteUnitIds',
  'excludedTopics',
  'tagIds',
  'constraints',
  'placementCandidate',
  'technicalClaims',
  'sources',
  'skill',
] as const;

const requiredAllowedUses = [
  'constraint_reference',
  'technical_claim',
  'example_verification',
  'answer_verification',
] as const;

const requiredSkillArtifacts = [
  '.agents/skills/abc-explanation-author/SKILL.md',
  '.agents/skills/abc-explanation-author/references/writing-policy.md',
  '.agents/skills/abc-explanation-author/templates/full-explanation.md',
] as const;

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

type JsonLoadResult =
  | { readonly state: 'loaded'; readonly value: unknown }
  | { readonly state: 'missing' }
  | { readonly state: 'invalid' };

const loadJson = async (repositoryRoot: string, relativePath: string): Promise<JsonLoadResult> => {
  try {
    return {
      state: 'loaded',
      value: JSON.parse(await readFile(path.join(repositoryRoot, relativePath), 'utf8')) as unknown,
    };
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return { state: 'missing' };
    if (error instanceof SyntaxError) return { state: 'invalid' };
    throw error;
  }
};

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const sameUniqueSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

const containsAll = (values: readonly string[], required: readonly string[]): boolean =>
  required.every((value) => values.includes(value));

const placeholderDigest = (componentId: FrozenComponentId, state: 'missing' | 'invalid'): string =>
  canonicalDigest({ componentId, path: componentPaths[componentId], state });

const pushCommonComponentHolds = (
  holds: string[],
  component: {
    readonly componentId: string;
    readonly previewId: string;
    readonly manifestDigest: string;
    readonly problemIds: readonly string[];
  },
  expectedId: FrozenComponentId,
  manifest: z.infer<typeof FrozenPreviewCohortSchema>,
): void => {
  if (component.componentId !== expectedId) holds.push(`COMPONENT_ID_MISMATCH:${expectedId}`);
  if (
    component.previewId !== manifest.previewId ||
    !sameOrderedValues(component.problemIds, manifest.selectedProblemIds)
  ) {
    holds.push(`COHORT_MISMATCH:${expectedId}`);
  }
  if (component.manifestDigest !== manifest.manifestDigest) {
    holds.push(`MANIFEST_MISMATCH:${expectedId}`);
  }
};

const validateManifest = (
  manifest: z.infer<typeof FrozenPreviewCohortSchema>,
  holds: string[],
): void => {
  if (digestWithoutField(manifest, 'manifestDigest') !== manifest.manifestDigest) {
    holds.push('MANIFEST_DIGEST_STALE');
  }
  const contestIds = manifest.selectedProblemIds.map((problemId) => problemId.split('-')[0] ?? '');
  const labels = manifest.selectedProblemIds.map((problemId) => problemId.split('-')[1] ?? '');
  if (
    manifest.selectedProblemIds.length < manifest.cohortRules.minimumProblemCount ||
    new Set(contestIds).size < manifest.cohortRules.minimumContestCount ||
    new Set(labels).size < manifest.cohortRules.minimumAdvancedLabelCount ||
    !sameUniqueSet(manifest.cohortRules.domains, requiredDomains)
  ) {
    holds.push('COHORT_REQUIREMENTS_NOT_MET');
  }
  if (
    !sameUniqueSet(manifest.publicationBoundary.allowedPreviewRoots, [
      'staging/previews/initial-v1',
      'docs/verification/previews/initial-v1',
    ]) ||
    !containsAll(manifest.publicationBoundary.forbiddenPublicRoots, [
      'src/content/tags',
      'src/content/learning-outcomes',
      'src/content/learning-units',
      'src/content/releases',
    ])
  ) {
    holds.push('PUBLICATION_BOUNDARY_INVALID');
  }
};

class FrozenPreviewManifestError extends Error {
  constructor(code: string) {
    super(code);
    this.name = 'FrozenPreviewManifestError';
  }
}

/**
 * Revalidate and join the immutable initial-v1 evidence envelopes.
 * Referenced artifact paths are intentionally not opened here: their digests were frozen by
 * the component producers, while T154 is the closed join over those component envelopes.
 */
export const buildFrozenPreviewSnapshot = async (
  repositoryRoot = process.cwd(),
): Promise<PreviewSnapshot> => {
  const manifestLoad = await loadJson(repositoryRoot, previewManifestPath);
  if (manifestLoad.state !== 'loaded') throw new FrozenPreviewManifestError('MANIFEST_UNAVAILABLE');
  const parsedManifest = FrozenPreviewCohortSchema.safeParse(manifestLoad.value);
  if (!parsedManifest.success) throw new FrozenPreviewManifestError('MANIFEST_INVALID');
  const manifest = parsedManifest.data;
  const holds: string[] = [];
  validateManifest(manifest, holds);

  const skillLoad = await loadJson(repositoryRoot, authoringSkillManifestPath);
  const parsedSkill =
    skillLoad.state === 'loaded'
      ? authoringSkillManifestSchema.safeParse(skillLoad.value)
      : { success: false as const };
  let authoringSkillVersion = 'unavailable';
  let authoringSkillDigest = '0'.repeat(64);
  if (!parsedSkill.success) {
    holds.push(
      skillLoad.state === 'missing'
        ? 'AUTHORING_SKILL_MANIFEST_MISSING'
        : 'AUTHORING_SKILL_MANIFEST_INVALID',
    );
  } else {
    const skill = parsedSkill.data;
    authoringSkillVersion = skill.authoringSkillVersion;
    authoringSkillDigest = skill.authoringSkillDigest;
    const artifactPaths = skill.artifacts.map(({ path: artifactPath }) => artifactPath);
    if (
      !skill.consumers.includes('T154') ||
      skill.sourcePacket.path !== 'src/content/sources/authoring/initial-v1.json' ||
      !containsAll(skill.inputContract.requiredFields, requiredSkillInputFields) ||
      !containsAll(skill.sourcePacket.allowedUses, requiredAllowedUses) ||
      !containsAll(artifactPaths, requiredSkillArtifacts) ||
      new Set(artifactPaths).size !== artifactPaths.length ||
      artifactPaths.some((artifactPath) => artifactPath === 'prompt.md')
    ) {
      holds.push('AUTHORING_SKILL_MANIFEST_INVALID');
    }
    if (
      !sameOrderedValues(skill.sourcePacket.inputProblemIds, manifest.selectedProblemIds) ||
      !sameUniqueSet(skill.sourcePacket.inputSourceRevisionIds, manifest.sourceRevisionIds)
    ) {
      holds.push('AUTHORING_INPUT_PACKET_INCOMPLETE');
    }
  }

  const loadedComponents = await Promise.all(
    frozenComponentIds.map(async (componentId) => ({
      componentId,
      load: await loadJson(repositoryRoot, componentPaths[componentId]),
    })),
  );
  const componentDigests = new Map<FrozenComponentId, string>();

  const metadataLoad = loadedComponents.find(
    ({ componentId }) => componentId === 'metadata-inventory-taxonomy',
  )?.load;
  const parsedMetadata =
    metadataLoad?.state === 'loaded'
      ? FrozenPreviewMetadataComponentSchema.safeParse(metadataLoad.value)
      : { success: false as const };
  let provisionalTaxonomyDigest = '0'.repeat(64);
  if (!metadataLoad || metadataLoad.state === 'missing') {
    holds.push('COMPONENT_MISSING:metadata-inventory-taxonomy');
    componentDigests.set(
      'metadata-inventory-taxonomy',
      placeholderDigest('metadata-inventory-taxonomy', 'missing'),
    );
  } else if (!parsedMetadata.success) {
    holds.push('COMPONENT_INVALID:metadata-inventory-taxonomy');
    componentDigests.set(
      'metadata-inventory-taxonomy',
      placeholderDigest('metadata-inventory-taxonomy', 'invalid'),
    );
  } else {
    const component = parsedMetadata.data;
    provisionalTaxonomyDigest = component.taxonomyDigest;
    componentDigests.set('metadata-inventory-taxonomy', canonicalDigest(component));
    pushCommonComponentHolds(holds, component, 'metadata-inventory-taxonomy', manifest);
    const componentSubject = {
      componentId: component.componentId,
      previewId: component.previewId,
      manifestDigest: component.manifestDigest,
      problemIds: component.problemIds,
      inputDigest: component.inputDigest,
      artifactDigest: component.artifactDigest,
    };
    if (previewComponentOutputDigest(componentSubject) !== component.outputDigest) {
      holds.push('COMPONENT_DIGEST_STALE:metadata-inventory-taxonomy');
    }
    if (component.inputDigest !== manifest.manifestDigest) {
      holds.push('STALE_SUBJECT:metadata-inventory-taxonomy');
    }
    if (
      !sameUniqueSet(component.inputPaths, expectedMetadataInputPaths) ||
      !sameUniqueSet(component.artifactPaths, expectedMetadataArtifactPaths)
    ) {
      holds.push('COMPONENT_INPUT_PACKET_INCOMPLETE:metadata-inventory-taxonomy');
    }
    if (component.status !== 'passed') {
      holds.push('COMPONENT_STATUS_NOT_PASSED:metadata-inventory-taxonomy');
    }
  }

  for (const { componentId, load } of loadedComponents) {
    if (componentId === 'metadata-inventory-taxonomy') continue;
    if (load.state === 'missing') {
      holds.push(`COMPONENT_MISSING:${componentId}`);
      componentDigests.set(componentId, placeholderDigest(componentId, 'missing'));
      continue;
    }
    if (load.state === 'invalid') {
      holds.push(`COMPONENT_INVALID:${componentId}`);
      componentDigests.set(componentId, placeholderDigest(componentId, 'invalid'));
      continue;
    }

    if (componentId === 'learning-records' || componentId === 'ui-search') {
      const parsed = reviewedComponentSchema.safeParse(load.value);
      if (!parsed.success) {
        holds.push(`COMPONENT_INVALID:${componentId}`);
        componentDigests.set(componentId, placeholderDigest(componentId, 'invalid'));
        continue;
      }
      const component = parsed.data;
      componentDigests.set(componentId, canonicalDigest(component));
      pushCommonComponentHolds(holds, component, componentId, manifest);
      const requirements = reviewedComponentRequirements[componentId];
      const componentSubject = {
        componentId: component.componentId,
        previewId: component.previewId,
        manifestDigest: component.manifestDigest,
        problemIds: component.problemIds,
        inputDigest: component.inputDigest,
        artifactDigest: component.artifactDigest,
      };
      const expectedOutputDigest =
        componentId === 'learning-records'
          ? canonicalDigest({
              releaseDigest: component.manifestDigest,
              artifactFiles: component.artifactFiles,
              subjectDigest: component.reviewEvidence.subjectDigest,
            })
          : previewComponentOutputDigest(componentSubject);
      if (
        expectedOutputDigest !== component.outputDigest ||
        (componentId === 'learning-records' &&
          canonicalDigest(component.artifactFiles) !== component.artifactDigest)
      ) {
        holds.push(`COMPONENT_DIGEST_STALE:${componentId}`);
      }
      const artifactPaths = component.artifactFiles.map(({ path: artifactPath }) => artifactPath);
      const frozenReviewDigest = component.artifactFiles.find(
        ({ path: artifactPath }) => artifactPath === requirements.reviewPath,
      )?.digest;
      if (
        component.inputDigest !== manifest.manifestDigest ||
        component.catalogSubjectDigest !== manifest.manifestDigest
      ) {
        holds.push(`STALE_SUBJECT:${componentId}`);
      }
      if (
        component.workManifestPath !== requirements.workManifestPath ||
        !sameUniqueSet(artifactPaths, requirements.artifactPaths)
      ) {
        holds.push(`COMPONENT_INPUT_PACKET_INCOMPLETE:${componentId}`);
      }
      if (
        component.reviewEvidence.path !== requirements.reviewPath ||
        component.reviewEvidence.digest !== frozenReviewDigest ||
        component.reviewEvidence.reviewMode !== 'self' ||
        !component.reviewEvidence.aggregatePassed
      ) {
        holds.push(`CURRENT_REVIEW_MISSING:${componentId}`);
      }
      if (component.status !== 'passed') holds.push(`COMPONENT_STATUS_NOT_PASSED:${componentId}`);
      continue;
    }

    const parsed = structuredComponentSchema.safeParse(load.value);
    if (!parsed.success) {
      holds.push(`COMPONENT_INVALID:${componentId}`);
      componentDigests.set(componentId, placeholderDigest(componentId, 'invalid'));
      continue;
    }
    const component = parsed.data;
    componentDigests.set(componentId, canonicalDigest(component));
    pushCommonComponentHolds(holds, component, componentId, manifest);
    const { componentDigest, ...componentSubject } = component;
    const {
      subjectDigest,
      checkResults,
      reviewEvidence,
      status,
      holdReasons,
      ...baseCurrentSubject
    } = componentSubject;
    const currentSubject =
      componentId === 'update-simulation'
        ? { ...baseCurrentSubject, status, holdReasons }
        : baseCurrentSubject;
    const currentSubjectDigest = componentSubjectDigest(currentSubject);
    if (componentEvidenceDigest(componentSubject) !== componentDigest) {
      holds.push(`COMPONENT_DIGEST_STALE:${componentId}`);
    }
    if (subjectDigest !== currentSubjectDigest) holds.push(`STALE_SUBJECT:${componentId}`);
    if (component.candidatePoolDigest !== manifest.candidatePoolDigest) {
      holds.push(`CANDIDATE_POOL_MISMATCH:${componentId}`);
    }
    if (!sameUniqueSet(component.sourceRevisionIds, manifest.sourceRevisionIds)) {
      holds.push(`SOURCE_REVISIONS_MISMATCH:${componentId}`);
    }
    if (component.provisionalTaxonomyDigest !== provisionalTaxonomyDigest) {
      holds.push(`PROVISIONAL_TAXONOMY_MISMATCH:${componentId}`);
    }
    if (
      component.authoringSkillVersion !== authoringSkillVersion ||
      component.authoringSkillDigest !== authoringSkillDigest
    ) {
      holds.push(`AUTHORING_SKILL_MISMATCH:${componentId}`);
    }
    const expectedChecks = structuredCheckIds[componentId];
    const expectedReviews = structuredReviewIds[componentId];
    if (
      !sameUniqueSet(
        checkResults.map(({ checkResultId }) => checkResultId),
        expectedChecks,
      )
    ) {
      holds.push(`CHECK_RESULT_SET_INCOMPLETE:${componentId}`);
    }
    for (const result of checkResults) {
      if (result.subjectDigest !== currentSubjectDigest) {
        holds.push(`STALE_CHECK_RESULT:${result.checkResultId}`);
      }
      if (!result.passed) holds.push(`CHECK_FAILED:${result.checkResultId}`);
    }
    if (
      !sameUniqueSet(
        reviewEvidence.map(({ reviewEvidenceId }) => reviewEvidenceId),
        expectedReviews,
      )
    ) {
      holds.push(`REVIEW_EVIDENCE_SET_INCOMPLETE:${componentId}`);
    }
    for (const evidence of reviewEvidence) {
      if (
        evidence.subjectDigest !== currentSubjectDigest ||
        evidence.requiredMode !== 'self' ||
        evidence.reviewMode !== 'self' ||
        !evidence.aggregatePassed
      ) {
        holds.push(`CURRENT_REVIEW_MISSING:${evidence.reviewEvidenceId}`);
      }
    }
    if (component.status !== 'passed' || component.holdReasons.length > 0) {
      holds.push(`COMPONENT_STATUS_NOT_PASSED:${componentId}`);
    }
  }

  const uniqueHolds = [...new Set(holds)];
  const snapshotSubject: PreviewSnapshotDigestSubject = {
    previewId: manifest.previewId,
    manifestDigest: manifest.manifestDigest,
    candidatePoolDigest: manifest.candidatePoolDigest,
    problemIds: manifest.selectedProblemIds,
    sourceRevisionIds: manifest.sourceRevisionIds,
    provisionalTaxonomyDigest,
    componentDigests: frozenComponentIds.map(
      (componentId) =>
        componentDigests.get(componentId) ?? placeholderDigest(componentId, 'invalid'),
    ),
    authoringSkillVersion,
    authoringSkillDigest,
    checkResultIds: requiredCheckResultIds,
    reviewEvidenceIds: requiredReviewEvidenceIds,
    status: uniqueHolds.length === 0 ? 'passed' : 'on_hold',
    holdReasons: uniqueHolds,
  };
  return { ...snapshotSubject, joinDigest: previewSnapshotJoinDigest(snapshotSubject) };
};
