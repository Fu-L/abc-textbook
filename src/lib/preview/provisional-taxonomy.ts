import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import { OffsetDateTimeSchema } from '../domain/schema-parts/catalog.js';
import { createContentWorkManifest } from '../validation/content-work-manifest.js';
import {
  previewComponentOutputDigest,
  validatePreviewChain,
  type PreviewComponent,
} from './preview-chain.js';
import { z } from 'zod';

const ACTIONS = ['promote', 'merge', 'split', 'retire'] as const;
const PROBLEM_ID = /^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ALLOWED_PREVIEW_ROOT = 'staging/previews/';
const REQUIRED_REQUIREMENT_IDS = [
  'FR-007',
  'FR-008',
  'FR-009',
  'FR-010',
  'FR-013',
  'SC-002',
  'SC-004',
  'SC-020',
] as const;
const PREVIEW_CONTENT_DIRECTORY_BY_DOMAIN: ReadonlyMap<string, string> = new Map([
  ['graph-search', 'graph-search'],
  ['dynamic-programming', 'dynamic-programming'],
  ['data-structures-algorithm-design', 'data-structures'],
  ['mathematics-combinatorics', 'mathematics'],
] as const);

export type ProvisionalIntegrationAction = (typeof ACTIONS)[number];
export type ProvisionalTaxonomyEntityKind = 'tag' | 'outcome' | 'unit';

export class ProvisionalTaxonomyError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'ProvisionalTaxonomyError';
  }
}

export interface ProvisionalTaxonomyManifestInput {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly selectedProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly expectedDomains: readonly string[];
  readonly minimumProblemsPerOutcome: number;
}

export interface ProvisionalInventoryItemInput {
  readonly problemId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly outcomeCandidates: readonly string[];
  readonly reviewStatus: 'draft' | 'reviewed' | 'changes_requested';
}

export interface ProvisionalCandidateClassificationInput {
  readonly problemId: string;
  readonly classifications: readonly {
    readonly domain: string;
    readonly outcomeId: string;
    readonly rationale: string;
  }[];
}

export interface ProvisionalTaxonomyProposalGroup {
  readonly slug: string;
  readonly domain: string;
  readonly candidateOutcomeId: string;
  readonly problemIds: readonly string[];
  readonly tagName: string;
  readonly tagDefinition: string;
  readonly outcomeStatement: string;
  readonly unitTitle: string;
  readonly rationale: string;
}

export interface ProvisionalTaxonomyProposal {
  readonly schemaVersion: '1.0.0';
  readonly previewId: string;
  readonly ownerId: string;
  readonly frozenAt: string;
  readonly groups: readonly ProvisionalTaxonomyProposalGroup[];
}

const nonEmptyText = z.string().trim().min(1);
const candidateClassificationSchema = z.strictObject({
  problemId: z.string().regex(PROBLEM_ID),
  classifications: z
    .array(
      z.strictObject({
        domain: z.string().regex(SLUG),
        outcomeId: z.string().regex(/^outcome-candidate-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
        rationale: nonEmptyText,
      }),
    )
    .length(1),
});
const candidateClassificationsDocumentSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  defaultExclusionReason: nonEmptyText,
  candidates: z.array(candidateClassificationSchema).min(1),
});
const proposalGroupSchema = z.strictObject({
  slug: z.string().regex(SLUG),
  domain: z.string().regex(SLUG),
  candidateOutcomeId: z.string().regex(/^outcome-candidate-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  problemIds: z.array(z.string().regex(PROBLEM_ID)).min(1),
  tagName: nonEmptyText,
  tagDefinition: nonEmptyText,
  outcomeStatement: nonEmptyText,
  unitTitle: nonEmptyText,
  rationale: nonEmptyText,
});
const provisionalTaxonomyProposalSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  ownerId: z.string().regex(/^person-[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  frozenAt: OffsetDateTimeSchema,
  groups: z.array(proposalGroupSchema).min(1),
});

export const parseProvisionalCandidateClassificationsDocument = (
  value: unknown,
): readonly ProvisionalCandidateClassificationInput[] =>
  candidateClassificationsDocumentSchema.parse(value).candidates;

export const parseProvisionalTaxonomyProposal = (value: unknown): ProvisionalTaxonomyProposal =>
  provisionalTaxonomyProposalSchema.parse(value);

export const previewContentDirectoryForDomain = (domain: string): string => {
  const directory = PREVIEW_CONTENT_DIRECTORY_BY_DOMAIN.get(domain);
  if (!directory) {
    throw new ProvisionalTaxonomyError(
      'PROPOSAL_INVALID',
      `No preview-content directory is configured for ${domain}.`,
    );
  }
  return directory;
};

export interface ProvisionalTaxonomyBuildInput {
  readonly manifest: ProvisionalTaxonomyManifestInput;
  readonly inventoryComponent: PreviewComponent;
  readonly inventoryItems: readonly ProvisionalInventoryItemInput[];
  readonly classifications: readonly ProvisionalCandidateClassificationInput[];
  readonly proposal: ProvisionalTaxonomyProposal;
}

interface ProvisionalTag {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly prerequisiteTagIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly representativeProblemIds: readonly string[];
}

interface ProvisionalOutcome {
  readonly id: string;
  readonly statement: string;
  readonly prerequisiteOutcomeIds: readonly string[];
  readonly problemIds: readonly string[];
}

interface ProvisionalUnit {
  readonly id: string;
  readonly title: string;
  readonly prerequisiteUnitIds: readonly string[];
  readonly tagIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
}

interface ProvisionalPlacement {
  readonly problemId: string;
  readonly tagIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly unitIds: readonly string[];
  readonly classificationRationale: string;
  readonly sourceRevisionIds: readonly string[];
}

export interface ProvisionalTaxonomyGroupArtifact {
  readonly schemaVersion: '1.0.0';
  readonly previewId: string;
  readonly domain: string;
  readonly candidateOutcomeId: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly tag: ProvisionalTag;
  readonly outcome: ProvisionalOutcome;
  readonly unit: ProvisionalUnit;
  readonly placements: readonly ProvisionalPlacement[];
  readonly rationale: string;
  readonly groupDigest: string;
}

export interface ProvisionalTaxonomyGroupReference {
  readonly domain: string;
  readonly path: string;
  readonly digest: string;
  readonly artifact: ProvisionalTaxonomyGroupArtifact;
}

export interface ProvisionalTaxonomyArtifact {
  readonly schemaVersion: '1.0.0';
  readonly previewId: string;
  readonly namespace: string;
  readonly manifestDigest: string;
  readonly inventoryComponentDigest: string;
  readonly classificationsDigest: string;
  readonly proposalDigest: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly groupRefs: readonly Omit<ProvisionalTaxonomyGroupReference, 'artifact'>[];
  readonly tags: readonly ProvisionalTag[];
  readonly outcomes: readonly ProvisionalOutcome[];
  readonly units: readonly ProvisionalUnit[];
  readonly placements: readonly ProvisionalPlacement[];
  readonly standardUnitOrder: readonly string[];
  readonly canonicalMaterializationAllowed: false;
  readonly finalSynthesisTask: 'T159';
  readonly taxonomyDigest: string;
}

interface ProvisionalActionAssessment {
  readonly action: ProvisionalIntegrationAction;
  readonly criterion: string;
  readonly evidenceRequiredAtT159: readonly string[];
}

interface ProvisionalIntegrationCandidate {
  readonly previewEntityId: string;
  readonly previewEntityKind: ProvisionalTaxonomyEntityKind;
  readonly affectedProblemIds: readonly string[];
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly affectedSurfaces: readonly string[];
  readonly actionAssessments: readonly ProvisionalActionAssessment[];
  readonly provisionalRecommendation: 'promote';
  readonly finalDecision: null;
  readonly finalEntityIds: readonly [];
  readonly reviewPolicy: {
    readonly requiredMode: 'third_party';
    readonly riskReasons: readonly ['major_classification_change'];
  };
}

export interface ProvisionalTaxonomyIntegrationEvidence {
  readonly schemaVersion: '1.0.0';
  readonly evidenceId: string;
  readonly previewId: string;
  readonly status: 'evidence_frozen';
  readonly taxonomyDigest: string;
  readonly inventoryComponentDigest: string;
  readonly classificationsDigest: string;
  readonly proposalDigest: string;
  readonly finalDecisionTask: 'T159';
  readonly canonicalMaterializationAllowed: false;
  readonly candidates: readonly ProvisionalIntegrationCandidate[];
  readonly integrationDigest: string;
}

interface ProvisionalReviewUnit {
  readonly reviewUnitId: string;
  readonly itemIds: readonly string[];
  readonly paths: readonly string[];
}

export interface ProvisionalTaxonomyWorkManifest extends Readonly<Record<string, unknown>> {
  readonly digest: string;
  readonly reviewUnits: readonly ProvisionalReviewUnit[];
}

export interface ProvisionalTaxonomyComponent extends PreviewComponent {
  readonly status: 'passed';
  readonly inventoryComponentDigest: string;
  readonly classificationsDigest: string;
  readonly proposalDigest: string;
  readonly taxonomyDigest: string;
  readonly integrationDigest: string;
  readonly workManifestDigest: string;
  readonly inputPaths: readonly string[];
  readonly artifactPaths: readonly string[];
}

export interface ProvisionalTaxonomyArtifacts {
  readonly groups: readonly ProvisionalTaxonomyGroupReference[];
  readonly taxonomy: ProvisionalTaxonomyArtifact;
  readonly integration: ProvisionalTaxonomyIntegrationEvidence;
  readonly workManifest: ProvisionalTaxonomyWorkManifest;
  readonly component: ProvisionalTaxonomyComponent;
}

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

const runtimeField = (value: object, key: PropertyKey): unknown =>
  Reflect.get(value, key) as unknown;

const requireText = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new ProvisionalTaxonomyError('PROPOSAL_INVALID', field);
};

const classificationFor = (
  input: ProvisionalTaxonomyBuildInput,
  problemId: string,
): ProvisionalCandidateClassificationInput['classifications'][number] => {
  const owner = input.classifications.filter((candidate) => candidate.problemId === problemId);
  const classification = owner[0]?.classifications[0];
  if (owner.length !== 1 || owner[0]?.classifications.length !== 1 || !classification) {
    throw new ProvisionalTaxonomyError(
      'CLASSIFICATION_CARDINALITY',
      `${problemId} must have exactly one preview classification.`,
    );
  }
  return classification;
};

const validateInput = (input: ProvisionalTaxonomyBuildInput): void => {
  const proposalResult = provisionalTaxonomyProposalSchema.safeParse(input.proposal);
  const classificationsResult = z
    .array(candidateClassificationSchema)
    .min(1)
    .safeParse(input.classifications);
  if (
    !proposalResult.success ||
    !classificationsResult.success ||
    input.proposal.previewId !== input.manifest.previewId ||
    !SLUG.test(input.manifest.previewId) ||
    input.proposal.groups.length === 0
  ) {
    throw new ProvisionalTaxonomyError('PROPOSAL_INVALID', 'Preview ID or groups are invalid.');
  }
  const manifestProblems = input.manifest.selectedProblemIds;
  if (
    manifestProblems.length === 0 ||
    new Set(manifestProblems).size !== manifestProblems.length ||
    manifestProblems.some((problemId) => !PROBLEM_ID.test(problemId))
  ) {
    throw new ProvisionalTaxonomyError('MANIFEST_PROBLEM_COVERAGE', 'Invalid cohort problem IDs.');
  }
  const sortedItems = [...input.inventoryItems].sort((left, right) =>
    compareText(left.problemId, right.problemId),
  );
  const expectedInventoryArtifactDigest = canonicalDigest({ items: sortedItems });
  if (
    validatePreviewChain([input.inventoryComponent]).length > 0 ||
    input.inventoryComponent.componentId !== 'technique-inventory' ||
    input.inventoryComponent.previewId !== input.manifest.previewId ||
    input.inventoryComponent.manifestDigest !== input.manifest.manifestDigest ||
    !sameOrderedValues(input.inventoryComponent.problemIds, manifestProblems) ||
    input.inventoryComponent.artifactDigest !== expectedInventoryArtifactDigest
  ) {
    throw new ProvisionalTaxonomyError(
      'INVENTORY_COMPONENT_STALE',
      'The inventory component does not match the frozen cohort and inventory bytes.',
    );
  }
  const inventoryProblemIds = sortedItems.map(({ problemId }) => problemId);
  if (!sameSet(inventoryProblemIds, manifestProblems)) {
    throw new ProvisionalTaxonomyError(
      'INVENTORY_PROBLEM_COVERAGE',
      'Inventory items must cover the frozen cohort exactly once.',
    );
  }
  if (sortedItems.some(({ reviewStatus }) => reviewStatus !== 'reviewed')) {
    throw new ProvisionalTaxonomyError(
      'INVENTORY_REVIEW_INCOMPLETE',
      'Every preview inventory item must be reviewed.',
    );
  }
  const inventorySources = sortedItems.flatMap(({ sourceRevisionIds }) => sourceRevisionIds);
  if (!sameSet(inventorySources, input.manifest.sourceRevisionIds)) {
    throw new ProvisionalTaxonomyError(
      'INVENTORY_SOURCE_COVERAGE',
      'Inventory Source Revisions must match the frozen cohort.',
    );
  }
  const slugs = input.proposal.groups.map(({ slug }) => slug);
  if (new Set(slugs).size !== slugs.length || slugs.some((slug) => !SLUG.test(slug))) {
    throw new ProvisionalTaxonomyError('PROPOSAL_INVALID', 'Group slugs must be unique.');
  }
  const domains = input.proposal.groups.map(({ domain }) => domain);
  if (
    new Set(domains).size !== domains.length ||
    domains.some((domain) => !SLUG.test(domain)) ||
    !sameSet(domains, input.manifest.expectedDomains)
  ) {
    throw new ProvisionalTaxonomyError(
      'PROPOSAL_INVALID',
      'Group domains must be unique safe path segments.',
    );
  }
  const proposedProblems = input.proposal.groups.flatMap(({ problemIds }) => problemIds);
  if (new Set(proposedProblems).size !== proposedProblems.length) {
    throw new ProvisionalTaxonomyError(
      'PROBLEM_OVERLAP',
      'A preview Problem can belong to only one candidate Outcome review unit.',
    );
  }
  if (!sameSet(proposedProblems, manifestProblems)) {
    throw new ProvisionalTaxonomyError(
      'PROBLEM_COVERAGE',
      'Proposal groups must cover every frozen Problem exactly once.',
    );
  }
  const inventoryByProblem = new Map(sortedItems.map((item) => [item.problemId, item]));
  for (const group of input.proposal.groups) {
    requireText(group.tagName, `${group.slug}.tagName`);
    requireText(group.tagDefinition, `${group.slug}.tagDefinition`);
    requireText(group.outcomeStatement, `${group.slug}.outcomeStatement`);
    requireText(group.unitTitle, `${group.slug}.unitTitle`);
    requireText(group.rationale, `${group.slug}.rationale`);
    if (group.problemIds.length < input.manifest.minimumProblemsPerOutcome) {
      throw new ProvisionalTaxonomyError(
        'PROBLEM_COVERAGE',
        `${group.slug} needs at least two representative Problems.`,
      );
    }
    for (const problemId of group.problemIds) {
      const item = inventoryByProblem.get(problemId);
      const classification = classificationFor(input, problemId);
      if (
        !item ||
        item.outcomeCandidates.length === 0 ||
        classification.domain !== group.domain ||
        classification.outcomeId !== group.candidateOutcomeId
      ) {
        throw new ProvisionalTaxonomyError(
          'CLASSIFICATION_MISMATCH',
          `${problemId} does not support ${group.candidateOutcomeId}.`,
        );
      }
    }
  }
};

const withDigest = <T extends Readonly<Record<string, unknown>>, K extends string>(
  subject: T,
  field: K,
): T & Readonly<Record<K, string>> => ({ ...subject, [field]: canonicalDigest(subject) });

const actionAssessments = (): readonly ProvisionalActionAssessment[] => [
  {
    action: 'promote',
    criterion: '全Inventoryでも定義・成果・前提が独立した再利用可能なentityとして維持される。',
    evidenceRequiredAtT159: ['full-inventory-comparison', 'representative-problem-coverage'],
  },
  {
    action: 'merge',
    criterion: '全Inventoryで別候補の定義・成果・前提に包含され、独立entityでは重複になる。',
    evidenceRequiredAtT159: ['equivalence-or-containment-proof', 'alias-and-redirect-impact'],
  },
  {
    action: 'split',
    criterion: '全Inventoryで複数の独立成果へ分かれ、各分割先に代表Problemと前提根拠がある。',
    evidenceRequiredAtT159: ['complete-problem-reclassification', 'per-target-representatives'],
  },
  {
    action: 'retire',
    criterion: '全Inventoryでは再利用可能な典型ではなく、ad-hocまたは他成果の一部に留まる。',
    evidenceRequiredAtT159: ['retirement-rationale', 'affected-problem-reassignment'],
  },
];

const entityId = (kind: ProvisionalTaxonomyEntityKind, slug: string): string =>
  kind === 'outcome' ? `outcome-provisional-${slug}` : `provisional-${kind}-${slug}`;

const buildGroup = (
  input: ProvisionalTaxonomyBuildInput,
  group: ProvisionalTaxonomyProposalGroup,
): ProvisionalTaxonomyGroupArtifact => {
  const inventoryByProblem = new Map(
    input.inventoryItems.map((inventoryItem) => [inventoryItem.problemId, inventoryItem]),
  );
  const sourceRevisionIds = group.problemIds.flatMap(
    (problemId) => inventoryByProblem.get(problemId)?.sourceRevisionIds ?? [],
  );
  const tagId = entityId('tag', group.slug);
  const outcomeId = entityId('outcome', group.slug);
  const unitId = entityId('unit', group.slug);
  const tag: ProvisionalTag = {
    id: tagId,
    name: group.tagName,
    definition: group.tagDefinition,
    prerequisiteTagIds: [],
    outcomeIds: [outcomeId],
    representativeProblemIds: group.problemIds,
  };
  const outcome: ProvisionalOutcome = {
    id: outcomeId,
    statement: group.outcomeStatement,
    prerequisiteOutcomeIds: [],
    problemIds: group.problemIds,
  };
  const unit: ProvisionalUnit = {
    id: unitId,
    title: group.unitTitle,
    prerequisiteUnitIds: [],
    tagIds: [tagId],
    outcomeIds: [outcomeId],
    problemIds: group.problemIds,
    sourceRevisionIds,
  };
  const placements = group.problemIds.map((problemId): ProvisionalPlacement => {
    const item = inventoryByProblem.get(problemId);
    if (!item) {
      throw new ProvisionalTaxonomyError('INVENTORY_PROBLEM_COVERAGE', problemId);
    }
    return {
      problemId,
      tagIds: [tagId],
      outcomeIds: [outcomeId],
      unitIds: [unitId],
      classificationRationale: classificationFor(input, problemId).rationale,
      sourceRevisionIds: item.sourceRevisionIds,
    };
  });
  return withDigest(
    {
      schemaVersion: '1.0.0' as const,
      previewId: input.manifest.previewId,
      domain: group.domain,
      candidateOutcomeId: group.candidateOutcomeId,
      problemIds: group.problemIds,
      sourceRevisionIds,
      tag,
      outcome,
      unit,
      placements,
      rationale: group.rationale,
    },
    'groupDigest',
  );
};

const buildIntegrationCandidate = (
  kind: ProvisionalTaxonomyEntityKind,
  id: string,
  problemIds: readonly string[],
  groupPath: string,
  domain: string,
  rationale: string,
  sourceRevisionIds: readonly string[],
): ProvisionalIntegrationCandidate => ({
  previewEntityId: id,
  previewEntityKind: kind,
  affectedProblemIds: problemIds,
  rationale,
  evidenceIds: [
    ...sourceRevisionIds,
    ...problemIds.map((problemId) => `classification-${problemId}`),
  ],
  affectedSurfaces: [
    groupPath,
    `docs/work-manifests/initial/us2/preview-content/${previewContentDirectoryForDomain(domain)}/`,
  ],
  actionAssessments: actionAssessments(),
  provisionalRecommendation: 'promote',
  finalDecision: null,
  finalEntityIds: [],
  reviewPolicy: {
    requiredMode: 'third_party',
    riskReasons: ['major_classification_change'],
  },
});

export const buildProvisionalTaxonomyArtifacts = (
  input: ProvisionalTaxonomyBuildInput,
): ProvisionalTaxonomyArtifacts => {
  validateInput(input);
  const orderedGroups = input.proposal.groups.map((group) => buildGroup(input, group));
  const groups = orderedGroups.map((artifact): ProvisionalTaxonomyGroupReference => ({
    domain: artifact.domain,
    path: `staging/previews/${input.manifest.previewId}/taxonomy/groups/${artifact.domain}.json`,
    digest: artifact.groupDigest,
    artifact,
  }));
  const selectedClassifications = input.manifest.selectedProblemIds.map((problemId) => ({
    problemId,
    classification: classificationFor(input, problemId),
  }));
  const classificationsDigest = canonicalDigest({ classifications: selectedClassifications });
  const proposalDigest = canonicalDigest(input.proposal);
  const taxonomy = withDigest(
    {
      schemaVersion: '1.0.0' as const,
      previewId: input.manifest.previewId,
      namespace: `staging/previews/${input.manifest.previewId}/taxonomy`,
      manifestDigest: input.manifest.manifestDigest,
      inventoryComponentDigest: input.inventoryComponent.outputDigest,
      classificationsDigest,
      proposalDigest,
      problemIds: input.manifest.selectedProblemIds,
      sourceRevisionIds: input.manifest.sourceRevisionIds,
      groupRefs: groups.map(({ domain, path, digest }) => ({ domain, path, digest })),
      tags: orderedGroups.map(({ tag }) => tag),
      outcomes: orderedGroups.map(({ outcome }) => outcome),
      units: orderedGroups.map(({ unit }) => unit),
      placements: orderedGroups.flatMap(({ placements }) => placements),
      standardUnitOrder: orderedGroups.map(({ unit }) => unit.id),
      canonicalMaterializationAllowed: false as const,
      finalSynthesisTask: 'T159' as const,
    },
    'taxonomyDigest',
  );
  const candidates = groups.flatMap(({ artifact, path }) => [
    buildIntegrationCandidate(
      'tag',
      artifact.tag.id,
      artifact.problemIds,
      path,
      artifact.domain,
      artifact.rationale,
      artifact.sourceRevisionIds,
    ),
    buildIntegrationCandidate(
      'outcome',
      artifact.outcome.id,
      artifact.problemIds,
      path,
      artifact.domain,
      artifact.rationale,
      artifact.sourceRevisionIds,
    ),
    buildIntegrationCandidate(
      'unit',
      artifact.unit.id,
      artifact.problemIds,
      path,
      artifact.domain,
      artifact.rationale,
      artifact.sourceRevisionIds,
    ),
  ]);
  const integration = withDigest(
    {
      schemaVersion: '1.0.0' as const,
      evidenceId: `preview-${input.manifest.previewId}-taxonomy-integration`,
      previewId: input.manifest.previewId,
      status: 'evidence_frozen' as const,
      taxonomyDigest: taxonomy.taxonomyDigest,
      inventoryComponentDigest: input.inventoryComponent.outputDigest,
      classificationsDigest,
      proposalDigest,
      finalDecisionTask: 'T159' as const,
      canonicalMaterializationAllowed: false as const,
      candidates,
    },
    'integrationDigest',
  );
  const outcomeIds = orderedGroups.map(({ outcome }) => outcome.id);
  const workManifest = createContentWorkManifest({
    manifestId: 'work-manifest-T046-preview-taxonomy',
    taskId: 'T046',
    changeKind: 'mixed',
    requiredRequirementIds: REQUIRED_REQUIREMENT_IDS,
    learningOutcomeIds: outcomeIds,
    reviewPolicy: {
      requiredMode: 'third_party',
      riskReasons: ['major_classification_change'],
    },
    reviewUnits: groups.map(({ artifact, path }) => ({
      unitId: `RU-T046-${artifact.domain}`,
      paths: [path],
      itemIds: [
        `tag:${artifact.tag.id}`,
        `outcome:${artifact.outcome.id}`,
        `unit:${artifact.unit.id}`,
        ...artifact.problemIds.map((problemId) => `problem:${problemId}`),
      ],
      requirementIds: REQUIRED_REQUIREMENT_IDS,
      learningOutcomeIds: [artifact.outcome.id],
      dependencyUnitIds: [],
      checkIds: ['check-preview-taxonomy', 'check-taxonomy-integration'],
      evidenceRole: 'provisional_taxonomy_review',
      ownerId: input.proposal.ownerId,
    })),
    maintenanceBenefit:
      'Outcome-scoped, non-overlapping review units keep preview taxonomy evidence reusable by T051-T054 while T159 remains the sole final taxonomy decision owner.',
    createdAt: input.proposal.frozenAt,
  }) as ProvisionalTaxonomyWorkManifest;
  const taxonomyPath = `staging/previews/${input.manifest.previewId}/taxonomy/index.json`;
  const integrationPath = `docs/verification/previews/${input.manifest.previewId}/taxonomy-integration.json`;
  const workManifestPath = 'docs/work-manifests/initial/us2/taxonomy/manifest.json';
  const inputPaths = [
    `staging/previews/${input.manifest.previewId}/candidate-classifications.json`,
    'docs/work-manifests/initial/us2/taxonomy/proposal.json',
  ];
  const artifactPaths = [
    taxonomyPath,
    ...groups.map(({ path }) => path),
    integrationPath,
    workManifestPath,
  ];
  const artifactDigest = canonicalDigest({
    inventoryComponentDigest: input.inventoryComponent.outputDigest,
    classificationsDigest,
    proposalDigest,
    taxonomyDigest: taxonomy.taxonomyDigest,
    groupDigests: groups.map(({ digest }) => digest),
    integrationDigest: integration.integrationDigest,
    workManifestDigest: workManifest.digest,
    artifactPaths,
  });
  const componentSubject = {
    componentId: 'metadata-inventory-taxonomy',
    previewId: input.manifest.previewId,
    manifestDigest: input.manifest.manifestDigest,
    problemIds: input.manifest.selectedProblemIds,
    inputDigest: input.manifest.manifestDigest,
    artifactDigest,
  };
  const component: ProvisionalTaxonomyComponent = {
    ...componentSubject,
    outputDigest: previewComponentOutputDigest(componentSubject),
    status: 'passed',
    inventoryComponentDigest: input.inventoryComponent.outputDigest,
    classificationsDigest,
    proposalDigest,
    taxonomyDigest: taxonomy.taxonomyDigest,
    integrationDigest: integration.integrationDigest,
    workManifestDigest: workManifest.digest,
    inputPaths,
    artifactPaths,
  };
  return { groups, taxonomy, integration, workManifest, component };
};

export const validateProvisionalTaxonomyArtifacts = (
  input: ProvisionalTaxonomyBuildInput,
  artifacts: ProvisionalTaxonomyArtifacts,
): string[] => {
  const violations: string[] = [];
  for (const { path } of artifacts.groups) {
    if (!path.startsWith(ALLOWED_PREVIEW_ROOT)) violations.push(`canonical_path_forbidden:${path}`);
  }
  if (
    runtimeField(artifacts.taxonomy, 'canonicalMaterializationAllowed') !== false ||
    runtimeField(artifacts.integration, 'canonicalMaterializationAllowed') !== false ||
    runtimeField(artifacts.taxonomy, 'finalSynthesisTask') !== 'T159' ||
    runtimeField(artifacts.integration, 'finalDecisionTask') !== 'T159'
  ) {
    violations.push('final_taxonomy_boundary_violated');
  }
  for (const candidate of artifacts.integration.candidates) {
    const finalEntityIds = runtimeField(candidate, 'finalEntityIds');
    if (
      runtimeField(candidate, 'finalDecision') !== null ||
      !Array.isArray(finalEntityIds) ||
      finalEntityIds.length > 0 ||
      !sameOrderedValues(
        candidate.actionAssessments.map(({ action }) => action),
        ACTIONS,
      )
    ) {
      violations.push(`integration_evidence_incomplete:${candidate.previewEntityId}`);
    }
  }
  const reviewProblems = artifacts.workManifest.reviewUnits.flatMap(({ itemIds }) =>
    itemIds.filter((itemId) => itemId.startsWith('problem:')).map((itemId) => itemId.slice(8)),
  );
  if (!sameSet(reviewProblems, input.manifest.selectedProblemIds)) {
    violations.push('review_unit_problem_coverage_mismatch');
  }
  try {
    const expected = buildProvisionalTaxonomyArtifacts(input);
    if (canonicalJson(expected) !== canonicalJson(artifacts))
      violations.push('artifact_digest_mismatch');
  } catch (error) {
    violations.push(
      error instanceof ProvisionalTaxonomyError
        ? `input_invalid:${error.code}`
        : 'input_invalid:unknown',
    );
  }
  return violations;
};
