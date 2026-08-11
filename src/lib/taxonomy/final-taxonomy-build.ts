import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

import {
  buildTechniqueInventoryAuthoringEvidence,
  buildTechniqueInventoryEvidence,
  defaultCorpusInventoryLayout,
  loadTechniqueInventoryCorpus,
  type LoadedTechniqueInventoryCorpus,
  type TechniqueInventoryAuthoringEvidence,
  type TechniqueInventoryEvidence,
} from '../corpus/technique-inventory.js';
import { canonicalDigest, canonicalJson, digestWithoutField } from '../domain/canonical-json.js';
import {
  FinalProblemPlacementProjectionSchema,
  FinalTaxonomyBuildSchema,
  FinalTaxonomyCandidateSchema,
  PreMaterializationCorrectionImpactSchema,
  ProblemAnalysisClaimRefSchema,
  ProblemAnalysisRecordSchema,
  ReviewEvidenceReferenceSchema,
  TaxonomyIntegrationMapSchema,
} from '../domain/schema-parts/catalog.js';
import {
  ContentWorkManifestSchema,
  HumanContentReviewEvidenceSchema,
} from '../domain/schema-parts/review-evidence.js';
import {
  assertPreviewSnapshotIntegrity,
  type PreviewSnapshot,
} from '../preview/preview-snapshot.js';
import type { PreviewSnapshotReference } from '../preview/preview-snapshot-repository.js';
import { validateContentWorkManifest } from '../validation/content-work-manifest.js';
import {
  validateHumanContentReview,
  type TrustedReviewCheckInventory,
} from '../validation/human-content-review.js';
import { deterministicTopologicalOrder } from '../validation/validate.js';
import {
  FINAL_TAXONOMY_REVIEW_CHECKS as SHARED_FINAL_TAXONOMY_REVIEW_CHECKS,
  FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
  validateFinalTaxonomyReviewCheckResults,
} from './final-taxonomy-review.js';
import {
  FINAL_LEARNING_UNIT_CANDIDATES,
  FINAL_LEARNING_UNIT_ORDER_POLICY,
  FINAL_TAXONOMY_OUTCOMES,
  FINAL_TAXONOMY_TAGS,
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  PREVIEW_FINAL_TAXONOMY_DECISIONS,
  CURATED_PRIMARY_OVERRIDES,
  buildFullCorpusPrimaryDecisionTable,
  validateFinalTaxonomyPolicy,
  type FinalPrimaryDecision,
  type MetadataLearningUnitCandidate,
  type OwnerQualifiedClaimReference,
  type PreviewFinalDecision,
} from './final-taxonomy-policy.js';
import type { z } from 'zod';

export const FINAL_TAXONOMY_PROBLEM_COUNT = 868;
export const FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT = 12;

export class FinalTaxonomyBuildError extends Error {
  readonly code: string;
  readonly artifactPath: string | null;

  constructor(code: string, message: string, artifactPath: string | null = null) {
    super(`${code}: ${message}`);
    this.code = code;
    this.artifactPath = artifactPath;
    this.name = 'FinalTaxonomyBuildError';
  }
}

export interface FinalTaxonomyBuildLayout {
  readonly repositoryRoot: string;
  readonly inventoryEvidencePath: string;
  readonly authoringEvidencePath: string;
  readonly previewReferenceRoot: string;
  readonly provisionalIntegrationPath: string;
  readonly workManifestPath: string;
  readonly reviewCheckResultsPath: string;
  readonly reviewEvidencePath: string;
  readonly outputPath: string;
}

export const defaultFinalTaxonomyBuildLayout = (
  repositoryRoot = process.cwd(),
): FinalTaxonomyBuildLayout => ({
  repositoryRoot,
  inventoryEvidencePath: 'docs/verification/bootstrap/technique-inventory.json',
  authoringEvidencePath: 'docs/verification/bootstrap/technique-inventory-authoring.json',
  previewReferenceRoot: 'docs/verification/previews/initial-v1/preview-join',
  provisionalIntegrationPath: 'docs/verification/previews/initial-v1/taxonomy-integration.json',
  workManifestPath: 'docs/work-manifests/initial/us2/final-taxonomy/manifest.json',
  reviewCheckResultsPath: FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
  reviewEvidencePath: 'docs/reviews/human-content/bootstrap/us2/final-taxonomy-review.json',
  outputPath: 'staging/taxonomy/initial/final-taxonomy-build.json',
});

type ProblemAnalysisRecord = z.infer<typeof ProblemAnalysisRecordSchema>;
export type FinalTaxonomyBuild = z.infer<typeof FinalTaxonomyBuildSchema>;
export type FinalTaxonomyCandidate = z.infer<typeof FinalTaxonomyCandidateSchema>;
export type FinalProblemPlacementProjection = z.infer<typeof FinalProblemPlacementProjectionSchema>;
export type PreMaterializationCorrectionImpact = z.infer<
  typeof PreMaterializationCorrectionImpactSchema
>;
export type TaxonomyIntegrationMap = z.infer<typeof TaxonomyIntegrationMapSchema>;
export type TaxonomyIntegrationEntry = TaxonomyIntegrationMap['entries'][number];
export type FrozenProvisionalTaxonomyEvidence = TaxonomyIntegrationMap['provisionalEvidence'];
export type ProblemAnalysisClaimRef = z.infer<typeof ProblemAnalysisClaimRefSchema>;
export type ReviewEvidenceReference = z.infer<typeof ReviewEvidenceReferenceSchema>;
type ContentWorkManifest = z.infer<typeof ContentWorkManifestSchema>;
type HumanContentReviewEvidence = z.infer<typeof HumanContentReviewEvidenceSchema>;

export interface LoadedFinalTaxonomySourceContext {
  readonly layout: FinalTaxonomyBuildLayout;
  readonly inventoryEvidence: TechniqueInventoryEvidence;
  readonly authoringEvidence: TechniqueInventoryAuthoringEvidence;
  readonly previewReferencePath: string;
  readonly previewReference: PreviewSnapshotReference;
  readonly previewSnapshot: PreviewSnapshot;
  readonly previewTransaction: Readonly<Record<string, unknown>>;
  readonly provisionalEvidence: FrozenProvisionalTaxonomyEvidence;
  readonly records: readonly ProblemAnalysisRecord[];
  readonly knownSourceRevisionIds: readonly string[];
  readonly referencedSourceRevisionIds: readonly string[];
  readonly corpus: LoadedTechniqueInventoryCorpus;
  readonly workManifest: ContentWorkManifest;
  readonly reviewEvidence: unknown;
  readonly reviewCheckResults: unknown;
}

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = <Value extends string>(values: readonly Value[]): Value[] =>
  [...new Set(values)].sort(compareCodeUnits);

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const requirePlainObject = (
  value: unknown,
  code: string,
  artifactPath: string,
): Readonly<Record<string, unknown>> => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    throw new FinalTaxonomyBuildError(code, 'Expected a JSON object.', artifactPath);
  }
  return value as Readonly<Record<string, unknown>>;
};

const assertRepositoryRelativePath = (relativePath: string): void => {
  if (
    relativePath.length === 0 ||
    path.isAbsolute(relativePath) ||
    relativePath
      .split(/[\\/]/u)
      .some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_PATH_INVALID', relativePath);
  }
};

const resolveRepositoryFile = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<string> => {
  assertRepositoryRelativePath(relativePath);
  const resolvedRoot = await realpath(repositoryRoot);
  const lexicalPath = path.resolve(resolvedRoot, relativePath);
  const relative = path.relative(resolvedRoot, lexicalPath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_PATH_ESCAPE', relativePath, relativePath);
  }
  const metadata = await lstat(lexicalPath).catch((error: unknown) => {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null;
    throw error;
  });
  if (metadata === null) {
    throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_INPUT_MISSING', relativePath, relativePath);
  }
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_INPUT_UNSAFE', relativePath, relativePath);
  }
  return lexicalPath;
};

const readRepositoryJson = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<unknown> => {
  const absolutePath = await resolveRepositoryFile(repositoryRoot, relativePath);
  try {
    return JSON.parse(await readFile(absolutePath, 'utf8')) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_JSON_INVALID', error.message, relativePath);
    }
    throw error;
  }
};

const readOptionalRepositoryJson = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<unknown> => {
  try {
    return await readRepositoryJson(repositoryRoot, relativePath);
  } catch (error) {
    if (error instanceof FinalTaxonomyBuildError && error.code === 'FINAL_TAXONOMY_INPUT_MISSING') {
      return null;
    }
    throw error;
  }
};

const parseInventoryEvidence = (
  value: unknown,
  artifactPath: string,
): TechniqueInventoryEvidence => {
  const object = requirePlainObject(value, 'T044_EVIDENCE_INVALID', artifactPath);
  if (
    object.schemaVersion !== '1.0.0' ||
    object.evidenceId !== 'bootstrap-technique-inventory' ||
    object.status !== 'passed' ||
    typeof object.inventoryDigest !== 'string' ||
    typeof object.corpusDigest !== 'string' ||
    typeof object.evidenceDigest !== 'string'
  ) {
    throw new FinalTaxonomyBuildError(
      'T044_EVIDENCE_NOT_ACCEPTED',
      'The complete inventory evidence must be the passed bootstrap evidence.',
      artifactPath,
    );
  }
  if (digestWithoutField(object, 'evidenceDigest') !== object.evidenceDigest) {
    throw new FinalTaxonomyBuildError(
      'T044_EVIDENCE_DIGEST_MISMATCH',
      'The complete inventory evidence digest is stale.',
      artifactPath,
    );
  }
  return value as TechniqueInventoryEvidence;
};

const parseAuthoringEvidence = (
  value: unknown,
  artifactPath: string,
): TechniqueInventoryAuthoringEvidence => {
  const object = requirePlainObject(value, 'AUTHORING_EVIDENCE_INVALID', artifactPath);
  if (
    object.schemaVersion !== '2.0.0' ||
    object.evidenceId !== 'bootstrap-technique-inventory-authoring' ||
    object.status !== 'passed' ||
    typeof object.inventoryDigest !== 'string' ||
    typeof object.evidenceDigest !== 'string'
  ) {
    throw new FinalTaxonomyBuildError(
      'AUTHORING_EVIDENCE_NOT_ACCEPTED',
      'The authoring evidence must be the passed bootstrap evidence.',
      artifactPath,
    );
  }
  if (digestWithoutField(object, 'evidenceDigest') !== object.evidenceDigest) {
    throw new FinalTaxonomyBuildError(
      'AUTHORING_EVIDENCE_DIGEST_MISMATCH',
      'The authoring evidence digest is stale.',
      artifactPath,
    );
  }
  return value as TechniqueInventoryAuthoringEvidence;
};

const parsePreviewReference = (value: unknown, artifactPath: string): PreviewSnapshotReference => {
  const object = requirePlainObject(value, 'PREVIEW_REFERENCE_INVALID', artifactPath);
  if (
    object.previewId !== 'initial-v1' ||
    object.status !== 'passed' ||
    typeof object.joinDigest !== 'string' ||
    typeof object.canonicalSnapshotPath !== 'string' ||
    typeof object.canonicalSnapshotDigest !== 'string' ||
    typeof object.transactionId !== 'string'
  ) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_REFERENCE_NOT_PASSED',
      'T154 must provide one passed initial-v1 snapshot reference.',
      artifactPath,
    );
  }
  return value as PreviewSnapshotReference;
};

const loadPassedPreviewReference = async (
  layout: FinalTaxonomyBuildLayout,
): Promise<{ readonly path: string; readonly reference: PreviewSnapshotReference }> => {
  assertRepositoryRelativePath(layout.previewReferenceRoot);
  const root = await realpath(layout.repositoryRoot);
  const absoluteDirectory = path.resolve(root, layout.previewReferenceRoot);
  const relative = path.relative(root, absoluteDirectory);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_PATH_ESCAPE',
      layout.previewReferenceRoot,
      layout.previewReferenceRoot,
    );
  }
  const metadata = await lstat(absoluteDirectory);
  if (metadata.isSymbolicLink() || !metadata.isDirectory()) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_REFERENCE_ROOT_UNSAFE',
      layout.previewReferenceRoot,
      layout.previewReferenceRoot,
    );
  }
  const names = (await readdir(absoluteDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map(({ name }) => name)
    .sort(compareCodeUnits);
  const passed: { readonly path: string; readonly reference: PreviewSnapshotReference }[] = [];
  for (const name of names) {
    const relativePath = `${layout.previewReferenceRoot}/${name}`;
    const value = await readRepositoryJson(layout.repositoryRoot, relativePath);
    const object = requirePlainObject(value, 'PREVIEW_REFERENCE_INVALID', relativePath);
    if (object.previewId === 'initial-v1' && object.status === 'passed') {
      const reference = parsePreviewReference(value, relativePath);
      if (name !== `${reference.joinDigest}.json`) {
        throw new FinalTaxonomyBuildError(
          'PREVIEW_REFERENCE_FILENAME_MISMATCH',
          name,
          relativePath,
        );
      }
      passed.push({ path: relativePath, reference });
    }
  }
  if (passed.length !== 1) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_REFERENCE_CARDINALITY_INVALID',
      `Expected exactly one passed T154 reference, found ${String(passed.length)}.`,
      layout.previewReferenceRoot,
    );
  }
  const result = passed[0];
  if (!result) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_REFERENCE_CARDINALITY_INVALID',
      'The passed T154 reference is missing.',
      layout.previewReferenceRoot,
    );
  }
  return result;
};

const parsePreviewSnapshot = (
  value: unknown,
  reference: PreviewSnapshotReference,
): PreviewSnapshot => {
  const object = requirePlainObject(
    value,
    'PREVIEW_SNAPSHOT_INVALID',
    reference.canonicalSnapshotPath,
  );
  if (
    object.previewId !== reference.previewId ||
    object.joinDigest !== reference.joinDigest ||
    object.status !== 'passed' ||
    !Array.isArray(object.problemIds) ||
    !Array.isArray(object.sourceRevisionIds) ||
    !Array.isArray(object.componentDigests) ||
    !Array.isArray(object.checkResultIds) ||
    !Array.isArray(object.reviewEvidenceIds) ||
    !Array.isArray(object.holdReasons)
  ) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_SNAPSHOT_NOT_PASSED',
      'The referenced canonical T154 snapshot must be complete and passed.',
      reference.canonicalSnapshotPath,
    );
  }
  const snapshot = value as PreviewSnapshot;
  try {
    assertPreviewSnapshotIntegrity(snapshot, reference.joinDigest);
  } catch (error) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_SNAPSHOT_JOIN_DIGEST_MISMATCH',
      error instanceof Error ? error.message : String(error),
      reference.canonicalSnapshotPath,
    );
  }
  if (canonicalDigest(snapshot) !== reference.canonicalSnapshotDigest) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_SNAPSHOT_CANONICAL_DIGEST_MISMATCH',
      'The snapshot reference does not bind the canonical snapshot value.',
      reference.canonicalSnapshotPath,
    );
  }
  return snapshot;
};

/**
 * Keep the byte-semantics of the T045/T046 evidence frozen even after the v2
 * integration map wraps it. The final taxonomy never treats this evidence as
 * a classification seed.
 */
export const parseFrozenProvisionalTaxonomyEvidence = (
  value: unknown,
  artifactPath: string,
): FrozenProvisionalTaxonomyEvidence => {
  const outer = requirePlainObject(value, 'PROVISIONAL_INTEGRATION_INVALID', artifactPath);
  const raw = Object.hasOwn(outer, 'provisionalEvidence') ? outer.provisionalEvidence : value;
  const object = requirePlainObject(raw, 'PROVISIONAL_INTEGRATION_INVALID', artifactPath);
  const parsed = TaxonomyIntegrationMapSchema.shape.provisionalEvidence.safeParse(raw);
  if (!parsed.success) {
    throw new FinalTaxonomyBuildError(
      'PROVISIONAL_INTEGRATION_NOT_FROZEN',
      parsed.error.message,
      artifactPath,
    );
  }
  if (digestWithoutField(object, 'integrationDigest') !== parsed.data.integrationDigest) {
    throw new FinalTaxonomyBuildError(
      'PROVISIONAL_INTEGRATION_DIGEST_MISMATCH',
      'The frozen integration evidence digest is stale.',
      artifactPath,
    );
  }
  const candidates = parsed.data.candidates;
  const candidateIds = candidates.map(({ previewEntityId }) => previewEntityId);
  const expectedKinds = ['tag', 'outcome', 'unit'] as const;
  if (
    candidates.length !== FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT ||
    new Set(candidateIds).size !== candidates.length ||
    expectedKinds.some(
      (kind) => candidates.filter((candidate) => candidate.previewEntityKind === kind).length !== 4,
    )
  ) {
    throw new FinalTaxonomyBuildError(
      'PROVISIONAL_ENTITY_COVERAGE_INVALID',
      'The frozen map must contain four tags, four outcomes, and four units exactly once.',
      artifactPath,
    );
  }
  return parsed.data;
};

const assertAcceptedEvidenceMatchesCorpus = (
  acceptedInventory: TechniqueInventoryEvidence,
  acceptedAuthoring: TechniqueInventoryAuthoringEvidence,
  corpus: LoadedTechniqueInventoryCorpus,
): void => {
  const recomputedInventory = buildTechniqueInventoryEvidence(corpus);
  if (canonicalJson(recomputedInventory) !== canonicalJson(acceptedInventory)) {
    throw new FinalTaxonomyBuildError(
      'T044_EVIDENCE_STALE',
      'The accepted T044 evidence no longer matches the complete corpus.',
    );
  }
  const recomputedAuthoring = buildTechniqueInventoryAuthoringEvidence(
    corpus,
    acceptedAuthoring.skill,
  );
  if (canonicalJson(recomputedAuthoring) !== canonicalJson(acceptedAuthoring)) {
    throw new FinalTaxonomyBuildError(
      'AUTHORING_EVIDENCE_STALE',
      'The accepted authoring evidence no longer matches the complete corpus.',
    );
  }
};

const validateFullCorpusRecordSet = (
  inventoryEvidence: TechniqueInventoryEvidence,
  authoringEvidence: TechniqueInventoryAuthoringEvidence,
  records: readonly ProblemAnalysisRecord[],
): void => {
  const problemIds = records.map(({ problemId }) => problemId);
  const assignmentIds = authoringEvidence.assignments.map(({ problemId }) => problemId);
  if (
    records.length !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    inventoryEvidence.scope.problemCount !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    inventoryEvidence.scope.inventoryCount !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    inventoryEvidence.scope.reviewedInventoryCount !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    inventoryEvidence.scope.draftInventoryCount !== 0 ||
    authoringEvidence.problemCount !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    authoringEvidence.sourceBoundProblemCount !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    authoringEvidence.reviewStatusCounts.reviewed !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    authoringEvidence.reviewStatusCounts.draft !== 0 ||
    authoringEvidence.reviewStatusCounts.changes_requested !== 0 ||
    authoringEvidence.unresolvedProblemIds.length !== 0 ||
    authoringEvidence.diagnosticCodes.length !== 0 ||
    new Set(problemIds).size !== problemIds.length ||
    !sameOrderedValues(sortedUnique(problemIds), sortedUnique(assignmentIds)) ||
    records.some(
      ({ reviewStatus, reviewFindings }) =>
        reviewStatus !== 'reviewed' || reviewFindings.length > 0,
    )
  ) {
    throw new FinalTaxonomyBuildError(
      'FULL_CORPUS_INVENTORY_NOT_ACCEPTED',
      'Final taxonomy requires exactly 868 source-bound, reviewed, conflict-free records.',
    );
  }
};

/** Load and independently revalidate all immutable inputs before policy synthesis. */
export const loadFinalTaxonomySourceContext = async (
  layout: FinalTaxonomyBuildLayout = defaultFinalTaxonomyBuildLayout(),
): Promise<LoadedFinalTaxonomySourceContext> => {
  const [
    inventoryValue,
    authoringValue,
    provisionalValue,
    workManifest,
    reviewCheckResults,
    reviewEvidence,
  ] = await Promise.all([
    readRepositoryJson(layout.repositoryRoot, layout.inventoryEvidencePath),
    readRepositoryJson(layout.repositoryRoot, layout.authoringEvidencePath),
    readRepositoryJson(layout.repositoryRoot, layout.provisionalIntegrationPath),
    readRepositoryJson(layout.repositoryRoot, layout.workManifestPath),
    readOptionalRepositoryJson(layout.repositoryRoot, layout.reviewCheckResultsPath),
    readOptionalRepositoryJson(layout.repositoryRoot, layout.reviewEvidencePath),
  ]);
  const inventoryEvidence = parseInventoryEvidence(inventoryValue, layout.inventoryEvidencePath);
  const authoringEvidence = parseAuthoringEvidence(authoringValue, layout.authoringEvidencePath);
  const corpus = await loadTechniqueInventoryCorpus(
    defaultCorpusInventoryLayout(layout.repositoryRoot),
  );
  assertAcceptedEvidenceMatchesCorpus(inventoryEvidence, authoringEvidence, corpus);
  const records = corpus.inventory
    .map(({ entity }) => ProblemAnalysisRecordSchema.parse(entity))
    .sort((left, right) => compareCodeUnits(left.problemId, right.problemId));
  validateFullCorpusRecordSet(inventoryEvidence, authoringEvidence, records);

  const loadedPreviewReference = await loadPassedPreviewReference(layout);
  const previewReference = loadedPreviewReference.reference;
  const previewSnapshot = parsePreviewSnapshot(
    await readRepositoryJson(layout.repositoryRoot, previewReference.canonicalSnapshotPath),
    previewReference,
  );
  const previewTransactionPath = `staging/previews/${previewReference.previewId}/transactions/${previewReference.joinDigest}.json`;
  const previewTransactionValue = await readOptionalRepositoryJson(
    layout.repositoryRoot,
    previewTransactionPath,
  );
  if (previewTransactionValue === null) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_TRANSACTION_NOT_VERIFIED',
      'The verified T154 transaction is required by the final taxonomy build.',
      previewTransactionPath,
    );
  }
  const previewTransaction = requirePlainObject(
    previewTransactionValue,
    'PREVIEW_TRANSACTION_INVALID',
    previewTransactionPath,
  );
  if (
    previewTransaction.transactionId !== previewReference.transactionId ||
    previewTransaction.previewId !== previewReference.previewId ||
    previewTransaction.joinDigest !== previewReference.joinDigest ||
    previewTransaction.canonicalSnapshotPath !== previewReference.canonicalSnapshotPath ||
    previewTransaction.canonicalSnapshotDigest !== previewReference.canonicalSnapshotDigest ||
    previewTransaction.phase !== 'verified' ||
    previewTransaction.recoveryReason !== null
  ) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_TRANSACTION_NOT_VERIFIED',
      'The available T154 transaction does not verify the referenced canonical snapshot.',
      previewTransactionPath,
    );
  }
  const provisionalEvidence = parseFrozenProvisionalTaxonomyEvidence(
    provisionalValue,
    layout.provisionalIntegrationPath,
  );
  const parsedWorkManifest = ContentWorkManifestSchema.safeParse(workManifest);
  if (!parsedWorkManifest.success) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_WORK_MANIFEST_INVALID',
      parsedWorkManifest.error.message,
      layout.workManifestPath,
    );
  }
  try {
    validateContentWorkManifest(parsedWorkManifest.data);
  } catch (error) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_WORK_MANIFEST_INVALID',
      error instanceof Error ? error.message : String(error),
      layout.workManifestPath,
    );
  }
  if (
    previewSnapshot.provisionalTaxonomyDigest !== provisionalEvidence.taxonomyDigest ||
    previewSnapshot.holdReasons.length !== 0
  ) {
    throw new FinalTaxonomyBuildError(
      'PREVIEW_EVIDENCE_CHAIN_MISMATCH',
      'The passed T154 snapshot does not bind the frozen provisional taxonomy.',
      previewReference.canonicalSnapshotPath,
    );
  }
  const knownSourceRevisionIds = sortedUnique(corpus.sources.map(({ entity }) => entity.id));
  const referencedSourceRevisionIds = sortedUnique(
    records.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
  );
  const knownSources = new Set(knownSourceRevisionIds);
  if (
    referencedSourceRevisionIds.some((sourceRevisionId) => !knownSources.has(sourceRevisionId)) ||
    referencedSourceRevisionIds.length !== authoringEvidence.normalizedSourceSet.sourceRevisionCount
  ) {
    throw new FinalTaxonomyBuildError(
      'INVENTORY_SOURCE_CLOSURE_INVALID',
      'The source set must equal the evidence-backed source closure of the 868 records.',
    );
  }
  return {
    layout,
    inventoryEvidence,
    authoringEvidence,
    previewReferencePath: loadedPreviewReference.path,
    previewReference,
    previewSnapshot,
    previewTransaction,
    provisionalEvidence,
    records,
    knownSourceRevisionIds,
    referencedSourceRevisionIds,
    corpus,
    workManifest: parsedWorkManifest.data,
    reviewEvidence,
    reviewCheckResults,
  };
};

type SemanticIntegrationEntry<Entry = TaxonomyIntegrationEntry> = Entry extends unknown
  ? Omit<Entry, 'reviewEvidenceId' | 'status'>
  : never;
type SemanticCorrectionImpact = Omit<
  PreMaterializationCorrectionImpact,
  'impactSubjectDigest' | 'verificationStatus'
>;

export interface FinalTaxonomyAssemblyInput {
  readonly id?: string;
  readonly policy: Pick<
    FinalTaxonomyBuild['policy'],
    'name' | 'version' | 'inputScope' | 'rulesDigest'
  >;
  readonly finalCandidates: readonly FinalTaxonomyCandidate[];
  readonly placements: readonly FinalProblemPlacementProjection[];
  readonly integrationEntries: readonly SemanticIntegrationEntry[];
  readonly correctionImpacts: readonly SemanticCorrectionImpact[];
  /** Policy concepts that are useful as supporting labels but too broad to own a Problem shard. */
  readonly nonPrimaryTagIds?: readonly string[];
  readonly nonPrimaryOutcomeIds?: readonly string[];
}

export interface FinalTaxonomySemanticGates {
  readonly nonPrimaryTagIds?: readonly string[];
  readonly nonPrimaryOutcomeIds?: readonly string[];
}

export interface FinalTaxonomyDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly entityId?: string;
}

export const FINAL_TAXONOMY_REVIEW_CHECKS = SHARED_FINAL_TAXONOMY_REVIEW_CHECKS;

const candidateKindRank: Readonly<Record<FinalTaxonomyCandidate['kind'], number>> = {
  tag: 0,
  outcome: 1,
  unit: 2,
};

const claimRefKey = (reference: ProblemAnalysisClaimRef): string =>
  `${reference.problemId}\u0000${reference.claimPath}\u0000${reference.evidenceIds.join('\u0000')}`;

const normalizeClaimRef = (reference: ProblemAnalysisClaimRef): ProblemAnalysisClaimRef =>
  ProblemAnalysisClaimRefSchema.parse({
    ...reference,
    evidenceIds: sortedUnique(reference.evidenceIds),
    sourceRevisionIds: sortedUnique(reference.sourceRevisionIds),
  });

const normalizeClaimRefs = (
  references: readonly ProblemAnalysisClaimRef[],
): ProblemAnalysisClaimRef[] => {
  const byReference = new Map<string, ProblemAnalysisClaimRef>();
  for (const reference of references.map(normalizeClaimRef)) {
    byReference.set(
      `${claimRefKey(reference)}\u0000${reference.sourceRevisionIds.join('\u0000')}`,
      reference,
    );
  }
  return [...byReference.values()].sort((left, right) =>
    compareCodeUnits(claimRefKey(left), claimRefKey(right)),
  );
};

const normalizeFinalCandidate = (candidate: FinalTaxonomyCandidate): FinalTaxonomyCandidate => {
  const common = {
    ...candidate,
    sourceRevisionIds: sortedUnique(candidate.sourceRevisionIds),
    evidenceRefs: normalizeClaimRefs(candidate.evidenceRefs),
  };
  switch (candidate.kind) {
    case 'tag':
      return FinalTaxonomyCandidateSchema.parse({
        ...common,
        entity: {
          ...candidate.entity,
          prerequisiteTagIds: sortedUnique(candidate.entity.prerequisiteTagIds),
          learningOutcomeIds: sortedUnique(candidate.entity.learningOutcomeIds),
          representativeProblemIds: sortedUnique(candidate.entity.representativeProblemIds),
          aliases: sortedUnique(candidate.entity.aliases),
          formerNames: sortedUnique(candidate.entity.formerNames),
          replacementTagIds: sortedUnique(candidate.entity.replacementTagIds),
        },
      });
    case 'outcome':
      return FinalTaxonomyCandidateSchema.parse({
        ...common,
        entity: {
          ...candidate.entity,
          prerequisiteOutcomeIds: sortedUnique(candidate.entity.prerequisiteOutcomeIds),
          scopeIds: sortedUnique(candidate.entity.scopeIds),
        },
      });
    case 'unit':
      return FinalTaxonomyCandidateSchema.parse({
        ...common,
        entity: {
          ...candidate.entity,
          additionalPrerequisiteUnitIds: sortedUnique(
            candidate.entity.additionalPrerequisiteUnitIds,
          ),
          excludedTopics: sortedUnique(candidate.entity.excludedTopics),
          sourceRevisionIds: sortedUnique(candidate.entity.sourceRevisionIds),
          tagIds: sortedUnique(candidate.entity.tagIds),
          learningOutcomeIds: sortedUnique(candidate.entity.learningOutcomeIds),
          problemIds: sortedUnique(candidate.entity.problemIds),
        },
      });
  }
};

const normalizePlacement = (
  placement: FinalProblemPlacementProjection,
): FinalProblemPlacementProjection =>
  FinalProblemPlacementProjectionSchema.parse({
    ...placement,
    sharedOutcomeIds: sortedUnique(placement.sharedOutcomeIds),
    evidenceIds: sortedUnique(placement.evidenceIds),
    primaryTagIds: sortedUnique(placement.primaryTagIds),
    supportingTagIds: sortedUnique(placement.supportingTagIds),
    supportingOutcomeIds: sortedUnique(placement.supportingOutcomeIds),
    learningUnitIds: sortedUnique(placement.learningUnitIds),
    adHocElements: sortedUnique(placement.adHocElements),
    analysisEvidenceRefs: normalizeClaimRefs(placement.analysisEvidenceRefs),
  });

const normalizeSemanticIntegrationEntry = (
  entry: SemanticIntegrationEntry,
): SemanticIntegrationEntry => {
  const common = {
    ...entry,
    finalEntityIds: sortedUnique(entry.finalEntityIds),
    affectedProblemIds: sortedUnique(entry.affectedProblemIds),
    evidenceRefs: normalizeClaimRefs(entry.evidenceRefs),
    correctionImpactIds: sortedUnique(entry.correctionImpactIds),
    reviewPolicy: {
      ...entry.reviewPolicy,
      riskReasons: sortedUnique(entry.reviewPolicy.riskReasons),
    },
  };
  switch (entry.action) {
    case 'promote':
      return {
        ...common,
        action: 'promote',
        splitProblemAssignments: [],
        decisionEvidence: {
          ...entry.decisionEvidence,
          representativeProblemIds: sortedUnique(entry.decisionEvidence.representativeProblemIds),
        },
        legacyDisposition: {
          ...entry.legacyDisposition,
          aliases: sortedUnique(entry.legacyDisposition.aliases),
        },
      };
    case 'merge':
      return {
        ...common,
        action: 'merge',
        splitProblemAssignments: [],
        decisionEvidence: entry.decisionEvidence,
        legacyDisposition: {
          ...entry.legacyDisposition,
          aliases: sortedUnique(entry.legacyDisposition.aliases),
        },
      };
    case 'split':
      return {
        ...common,
        action: 'split',
        splitProblemAssignments: entry.splitProblemAssignments
          .map((assignment) => ({
            ...assignment,
            problemIds: sortedUnique(assignment.problemIds),
            evidenceRefs: normalizeClaimRefs(assignment.evidenceRefs),
            representativeProblemIds: sortedUnique(assignment.representativeProblemIds),
          }))
          .sort((left, right) => compareCodeUnits(left.finalEntityId, right.finalEntityId)),
        decisionEvidence: entry.decisionEvidence,
        legacyDisposition: {
          ...entry.legacyDisposition,
          targets: entry.legacyDisposition.targets
            .map((target) => ({ ...target, aliases: sortedUnique(target.aliases) }))
            .sort((left, right) => compareCodeUnits(left.finalEntityId, right.finalEntityId)),
        },
      };
    case 'retire':
      return {
        ...common,
        action: 'retire',
        splitProblemAssignments: [],
        decisionEvidence: {
          ...entry.decisionEvidence,
          reassignedProblemIds: sortedUnique(entry.decisionEvidence.reassignedProblemIds),
        },
        legacyDisposition: {
          ...entry.legacyDisposition,
          replacementEntityIds: sortedUnique(entry.legacyDisposition.replacementEntityIds),
        },
      };
  }
};

const assessmentKey = (
  assessment: PreMaterializationCorrectionImpact['surfaceAssessments'][number],
): string =>
  assessment.ownerType === 'problem'
    ? `problem:${assessment.problemId}:${assessment.surface}`
    : assessment.ownerType === 'learning_unit_candidate'
      ? `unit:${assessment.learningUnitId}:${assessment.surface}`
      : `index:${assessment.path}`;

const normalizeSemanticImpact = (impact: SemanticCorrectionImpact): SemanticCorrectionImpact => ({
  ...impact,
  integrationPreviewEntityIds: sortedUnique(impact.integrationPreviewEntityIds),
  sourceRevisionIds: sortedUnique(impact.sourceRevisionIds),
  affectedProblemIds: sortedUnique(impact.affectedProblemIds),
  affectedLearningUnitCandidateIds: sortedUnique(impact.affectedLearningUnitCandidateIds),
  surfaceAssessments: impact.surfaceAssessments
    .map((assessment) => ({
      ...assessment,
      evidenceRefs: normalizeClaimRefs(assessment.evidenceRefs),
    }))
    .sort((left, right) => compareCodeUnits(assessmentKey(left), assessmentKey(right))),
  affectedLearningUnitOrderIds: sortedUnique(impact.affectedLearningUnitOrderIds),
  derivedIndexPaths: sortedUnique(impact.derivedIndexPaths),
});

export const buildFinalTaxonomyTrustedReviewInventory = (
  context: LoadedFinalTaxonomySourceContext,
  subjectDigest: string,
): TrustedReviewCheckInventory => {
  const declaredCheckIds = sortedUnique(
    context.workManifest.reviewUnits.flatMap(({ checkIds }) => checkIds),
  );
  const commandById = new Map<string, string>(
    FINAL_TAXONOMY_REVIEW_CHECKS.map((check) => [check.checkId, check.command]),
  );
  if (
    !sameOrderedValues(declaredCheckIds, sortedUnique([...commandById.keys()])) ||
    context.workManifest.taskId !== 'T159' ||
    context.workManifest.reviewPolicy.requiredMode !== 'third_party' ||
    !context.workManifest.reviewPolicy.riskReasons.includes('major_classification_change')
  ) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_REVIEW_INVENTORY_INVALID',
      'The fixed T159 manifest does not declare the exact trusted check and risk inventory.',
    );
  }
  return {
    subjectDigest,
    inventoryDigest: context.workManifest.digest,
    reviewPolicy: context.workManifest.reviewPolicy,
    workManifest: {
      learningOutcomeIds: context.workManifest.learningOutcomeIds,
      reviewUnits: context.workManifest.reviewUnits.map((unit) => ({
        reviewUnitId: unit.reviewUnitId,
        subjectPaths: unit.paths,
        learningOutcomeIds: unit.learningOutcomeIds,
        owner: unit.owner,
      })),
    },
    applicableChecks: declaredCheckIds.map((checkId) => ({
      checkId,
      command: commandById.get(checkId) ?? '',
    })),
    reviewItems: context.workManifest.reviewUnits.map((unit) => ({
      reviewItemId: `human-review-item-${unit.reviewUnitId.toLowerCase()}`,
      reviewUnitId: unit.reviewUnitId,
      kind: 'outcome_coverage' as const,
      subjectPaths: unit.paths,
      authorIds: [unit.owner],
      learningOutcomeIds: unit.learningOutcomeIds,
    })),
  };
};

interface CurrentReviewResult {
  readonly evidence: HumanContentReviewEvidence;
  readonly reference: ReviewEvidenceReference;
}

const currentReviewResult = (
  context: LoadedFinalTaxonomySourceContext,
  layout: FinalTaxonomyBuildLayout,
  subjectDigest: string,
): CurrentReviewResult | null => {
  if (context.reviewEvidence === null || context.reviewCheckResults === null) return null;
  const parsed = HumanContentReviewEvidenceSchema.safeParse(context.reviewEvidence);
  if (!parsed.success) return null;
  try {
    validateHumanContentReview(
      parsed.data,
      buildFinalTaxonomyTrustedReviewInventory(context, subjectDigest),
    );
  } catch {
    return null;
  }
  if (!parsed.data.aggregatePassed || parsed.data.subjectDigest !== subjectDigest) {
    return null;
  }
  let aggregateDigest: string;
  try {
    const checkResults = validateFinalTaxonomyReviewCheckResults(context.reviewCheckResults, {
      taxonomySubjectDigest: subjectDigest,
      reviewerId: parsed.data.reviewer.personId,
      artifactPath: layout.reviewCheckResultsPath,
    });
    aggregateDigest = canonicalDigest(checkResults);
  } catch {
    return null;
  }
  if (
    parsed.data.applicableChecks.some(
      ({ resultPath, resultDigest }) =>
        resultPath !== layout.reviewCheckResultsPath || resultDigest !== aggregateDigest,
    )
  ) {
    return null;
  }
  const reference = ReviewEvidenceReferenceSchema.parse({
    evidenceId: parsed.data.id,
    path: layout.reviewEvidencePath,
    digest: parsed.data.evidenceDigest,
    subjectDigest,
    authorIds: sortedUnique(parsed.data.authors.map(({ personId }) => personId)),
    reviewerIds: [parsed.data.reviewer.personId],
    reviewMode: parsed.data.reviewMode,
    aggregatePassed: true,
  });
  return { evidence: parsed.data, reference };
};

const taxonomyReviewSubject = (build: {
  readonly inputs: FinalTaxonomyBuild['inputs'];
  readonly policy: FinalTaxonomyBuild['policy'];
  readonly integrationSubjectDigest: string;
  readonly finalCandidates: readonly FinalTaxonomyCandidate[];
  readonly tagPrerequisites: readonly {
    readonly nodeId: string;
    readonly prerequisiteId: string;
  }[];
  readonly learningUnitPrerequisites: readonly {
    readonly nodeId: string;
    readonly prerequisiteId: string;
  }[];
  readonly standardOrder: readonly string[];
  readonly placements: readonly FinalProblemPlacementProjection[];
  readonly correctionImpacts: readonly (SemanticCorrectionImpact & {
    readonly impactSubjectDigest: string;
  })[];
  readonly sourceRevisionIds: readonly string[];
}) => ({
  inputs: build.inputs,
  policy: build.policy,
  integrationSubjectDigest: build.integrationSubjectDigest,
  finalCandidates: build.finalCandidates,
  tagPrerequisites: build.tagPrerequisites,
  learningUnitPrerequisites: build.learningUnitPrerequisites,
  standardOrder: build.standardOrder,
  placements: build.placements,
  correctionImpacts: build.correctionImpacts,
  sourceRevisionIds: build.sourceRevisionIds,
});

const evidenceSourceUnion = (input: {
  readonly finalCandidates: readonly FinalTaxonomyCandidate[];
  readonly placements: readonly FinalProblemPlacementProjection[];
  readonly integrationEntries: readonly SemanticIntegrationEntry[];
  readonly correctionImpacts: readonly SemanticCorrectionImpact[];
}): string[] =>
  sortedUnique([
    ...input.finalCandidates.flatMap(({ evidenceRefs }) =>
      evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
    ...input.placements.flatMap(({ analysisEvidenceRefs }) =>
      analysisEvidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
    ...input.integrationEntries.flatMap(({ evidenceRefs }) =>
      evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
    ...input.integrationEntries.flatMap(({ splitProblemAssignments }) =>
      splitProblemAssignments.flatMap(({ evidenceRefs }) =>
        evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
      ),
    ),
    ...input.correctionImpacts.flatMap(({ surfaceAssessments }) =>
      surfaceAssessments.flatMap(({ evidenceRefs }) =>
        evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
      ),
    ),
  ]);

const integrationSubject = (input: {
  readonly inventoryDigest: string;
  readonly previewSnapshotDigest: string;
  readonly provisionalEvidence: FrozenProvisionalTaxonomyEvidence;
  readonly entries: readonly SemanticIntegrationEntry[];
}) => ({
  schemaVersion: '2.0.0' as const,
  evidenceId: 'final-taxonomy-integration-initial-v1',
  previewId: 'initial-v1',
  inventoryDigest: input.inventoryDigest,
  previewSnapshotDigest: input.previewSnapshotDigest,
  provisionalEvidence: input.provisionalEvidence,
  entries: input.entries,
  canonicalMaterializationAllowed: false as const,
});

const buildIntegrationMap = (
  context: LoadedFinalTaxonomySourceContext,
  entries: readonly SemanticIntegrationEntry[],
  reviewEvidenceId: string | null,
): TaxonomyIntegrationMap => {
  const subject = integrationSubject({
    inventoryDigest: context.inventoryEvidence.inventoryDigest,
    previewSnapshotDigest: context.previewReference.joinDigest,
    provisionalEvidence: context.provisionalEvidence,
    entries,
  });
  const status = reviewEvidenceId === null ? ('proposed' as const) : ('accepted' as const);
  const completeEntries = TaxonomyIntegrationMapSchema.shape.entries.parse(
    entries.map((entry) => ({ ...entry, reviewEvidenceId, status })),
  );
  const withoutDigest = {
    ...subject,
    entries: completeEntries,
    status,
    integrationSubjectDigest: canonicalDigest(subject),
  };
  return TaxonomyIntegrationMapSchema.parse({
    ...withoutDigest,
    integrationDigest: canonicalDigest(withoutDigest),
  });
};

const attachImpactState = (
  impacts: readonly SemanticCorrectionImpact[],
  reviewed: boolean,
): PreMaterializationCorrectionImpact[] =>
  impacts.map((impact) => {
    const impactSubjectDigest = canonicalDigest(impact);
    return PreMaterializationCorrectionImpactSchema.parse({
      ...impact,
      verificationStatus: reviewed ? 'reviewed' : 'pending',
      impactSubjectDigest,
    });
  });

/**
 * Assemble the canonical v2 wrapper. The semantic subject is computed before
 * review state is attached, so proposal and accepted builds bind one subject.
 */
export const assembleFinalTaxonomyBuild = (
  context: LoadedFinalTaxonomySourceContext,
  input: FinalTaxonomyAssemblyInput,
  layout: FinalTaxonomyBuildLayout = context.layout,
): FinalTaxonomyBuild => {
  const initiallyNormalizedCandidates = input.finalCandidates.map(normalizeFinalCandidate);
  const unitCandidates = initiallyNormalizedCandidates.filter(
    (candidate): candidate is Extract<FinalTaxonomyCandidate, { kind: 'unit' }> =>
      candidate.kind === 'unit',
  );
  const orderedUnits = deterministicTopologicalOrder(
    unitCandidates.map((candidate) => ({
      id: candidate.entity.id,
      prerequisiteIds: sortedUnique([
        ...candidate.entity.additionalPrerequisiteUnitIds,
        ...(candidate.entity.parentId === null ? [] : [candidate.entity.parentId]),
      ]),
      candidate,
    })),
    ({ candidate }) => [
      candidate.entity.stageRank,
      candidate.entity.difficultyRank,
      candidate.entity.representativeRank,
    ],
  );
  const globalIndexByUnitId = new Map(orderedUnits.map(({ id }, globalIndex) => [id, globalIndex]));
  const finalCandidates = initiallyNormalizedCandidates
    .map((candidate) =>
      candidate.kind === 'unit'
        ? FinalTaxonomyCandidateSchema.parse({
            ...candidate,
            entity: {
              ...candidate.entity,
              globalIndex: globalIndexByUnitId.get(candidate.entity.id),
            },
          })
        : candidate,
    )
    .sort(
      (left, right) =>
        candidateKindRank[left.kind] - candidateKindRank[right.kind] ||
        compareCodeUnits(left.entity.id, right.entity.id),
    );
  const standardOrder = orderedUnits.map(({ id }) => id);
  const tagPrerequisites = finalCandidates
    .flatMap((candidate) =>
      candidate.kind === 'tag'
        ? candidate.entity.prerequisiteTagIds.map((prerequisiteId) => ({
            nodeId: candidate.entity.id,
            prerequisiteId,
          }))
        : [],
    )
    .sort(
      (left, right) =>
        compareCodeUnits(left.nodeId, right.nodeId) ||
        compareCodeUnits(left.prerequisiteId, right.prerequisiteId),
    );
  const learningUnitPrerequisites = unitCandidates
    .flatMap(({ entity }) =>
      entity.additionalPrerequisiteUnitIds.map((prerequisiteId) => ({
        nodeId: entity.id,
        prerequisiteId,
      })),
    )
    .sort(
      (left, right) =>
        compareCodeUnits(left.nodeId, right.nodeId) ||
        compareCodeUnits(left.prerequisiteId, right.prerequisiteId),
    );
  const placements = input.placements
    .map(normalizePlacement)
    .sort((left, right) => compareCodeUnits(left.problemId, right.problemId));
  const integrationEntries = input.integrationEntries
    .map(normalizeSemanticIntegrationEntry)
    .sort((left, right) => compareCodeUnits(left.previewEntityId, right.previewEntityId));
  const semanticImpacts = input.correctionImpacts
    .map(normalizeSemanticImpact)
    .sort((left, right) => compareCodeUnits(left.id, right.id));
  const sourceRevisionIds = evidenceSourceUnion({
    finalCandidates,
    placements,
    integrationEntries,
    correctionImpacts: semanticImpacts,
  });
  const inputs: FinalTaxonomyBuild['inputs'] = {
    inventory: {
      evidencePath: layout.inventoryEvidencePath,
      evidenceDigest: context.inventoryEvidence.evidenceDigest,
      inventoryDigest: context.inventoryEvidence.inventoryDigest,
      corpusDigest: context.inventoryEvidence.corpusDigest,
      authoringEvidencePath: layout.authoringEvidencePath,
      authoringEvidenceDigest: context.authoringEvidence.evidenceDigest,
      authoringInventoryDigest: context.authoringEvidence.inventoryDigest,
      normalizedSourceSetDigest: context.authoringEvidence.normalizedSourceSet.digest,
    },
    previewSnapshot: {
      path: context.previewReference.canonicalSnapshotPath,
      referencePath: context.previewReferencePath,
      joinDigest: context.previewReference.joinDigest,
      canonicalSnapshotDigest: context.previewReference.canonicalSnapshotDigest,
      transactionId: context.previewReference.transactionId,
      status: 'passed',
    },
    integrationMapPath: layout.provisionalIntegrationPath,
  };
  const policy: FinalTaxonomyBuild['policy'] = {
    ...input.policy,
    requiredReviewMode: context.workManifest.reviewPolicy.requiredMode,
    riskReasons: sortedUnique(context.workManifest.reviewPolicy.riskReasons),
    authoringSkillName: context.authoringEvidence.skill.name,
    authoringSkillVersion: context.authoringEvidence.skill.version,
    authoringSkillDigest: context.authoringEvidence.skill.digest,
    writingPolicyPath: context.authoringEvidence.skill.writingPolicyPath,
    writingPolicyDigest: context.authoringEvidence.skill.writingPolicyDigest,
    sourceNormalizationVersion: context.authoringEvidence.skill.sourceNormalizationVersion,
    workManifestPath: layout.workManifestPath,
    workManifestDigest: context.workManifest.digest,
  };
  const proposalIntegration = buildIntegrationMap(context, integrationEntries, null);
  const proposalImpacts = attachImpactState(semanticImpacts, false);
  const semanticImpactSubjects = proposalImpacts.map((proposalImpact) => {
    const { verificationStatus, ...impact } = proposalImpact;
    void verificationStatus;
    return impact;
  });
  const taxonomySubjectDigest = canonicalDigest(
    taxonomyReviewSubject({
      inputs,
      policy,
      integrationSubjectDigest: proposalIntegration.integrationSubjectDigest,
      finalCandidates,
      tagPrerequisites,
      learningUnitPrerequisites,
      standardOrder,
      placements,
      correctionImpacts: semanticImpactSubjects,
      sourceRevisionIds,
    }),
  );
  const review = currentReviewResult(context, layout, taxonomySubjectDigest);
  const integrationMap = buildIntegrationMap(
    context,
    integrationEntries,
    review?.evidence.id ?? null,
  );
  const correctionImpacts = attachImpactState(semanticImpacts, review !== null);
  const accepted = review !== null;
  const withoutBuildDigest = {
    schemaVersion: '2.0.0' as const,
    id: input.id ?? 'final-taxonomy-build-initial',
    generatedAt: review?.evidence.generatedAt ?? context.workManifest.createdAt,
    inputs,
    policy,
    integrationMap,
    integrationMapDigest: integrationMap.integrationDigest,
    finalCandidates,
    tagPrerequisites,
    learningUnitPrerequisites,
    standardOrder,
    placements,
    correctionImpacts,
    sourceRevisionIds,
    reviewEvidenceRefs: review === null ? [] : [review.reference],
    taxonomySubjectDigest,
    taxonomyDigest: canonicalDigest(finalCandidates),
    tagDagDigest: canonicalDigest(tagPrerequisites),
    learningUnitDagDigest: canonicalDigest(learningUnitPrerequisites),
    orderDigest: canonicalDigest(standardOrder),
    placementDigest: canonicalDigest(placements),
    correctionImpactDigest: canonicalDigest(correctionImpacts),
    status: accepted ? ('accepted' as const) : ('proposed' as const),
    acceptedAt: review?.evidence.generatedAt ?? null,
    holdReasons: accepted ? [] : ['CURRENT_SUBJECT_THIRD_PARTY_REVIEW_MISSING_OR_STALE'],
    canonicalMaterializationAllowed: accepted,
  };
  const build = FinalTaxonomyBuildSchema.parse({
    ...withoutBuildDigest,
    buildDigest: canonicalDigest(withoutBuildDigest),
  });
  assertFinalTaxonomyBuildAgainstContext(context, build, {
    ...(input.nonPrimaryTagIds === undefined ? {} : { nonPrimaryTagIds: input.nonPrimaryTagIds }),
    ...(input.nonPrimaryOutcomeIds === undefined
      ? {}
      : { nonPrimaryOutcomeIds: input.nonPrimaryOutcomeIds }),
  });
  return build;
};

const policyClaimReference = (reference: OwnerQualifiedClaimReference): ProblemAnalysisClaimRef => {
  if (
    !reference.claimPath.startsWith('/') ||
    reference.evidenceRefs.some(({ owner }) => owner.problemId !== reference.owner.problemId)
  ) {
    throw new FinalTaxonomyBuildError(
      'POLICY_CLAIM_REFERENCE_INVALID',
      `${reference.owner.problemId}:${reference.claimPath} is not an owner-qualified canonical JSON Pointer.`,
    );
  }
  return ProblemAnalysisClaimRefSchema.parse({
    problemId: reference.owner.problemId,
    claimPath: reference.claimPath,
    evidenceIds: sortedUnique(reference.evidenceRefs.map(({ evidenceId }) => evidenceId)),
    sourceRevisionIds: sortedUnique(
      reference.evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
  });
};

const decisionEvidenceRefs = (decision: FinalPrimaryDecision): ProblemAnalysisClaimRef[] =>
  normalizeClaimRefs([
    ...decision.decisionBasis.map(policyClaimReference),
    ...decision.supportingTagDecisions.flatMap(({ decisionBasis }) =>
      decisionBasis.map(policyClaimReference),
    ),
    ...decision.claimDispositions.map(({ claimRef }) => policyClaimReference(claimRef)),
    ...decision.adHocElements.map(({ claimRef }) => policyClaimReference(claimRef)),
  ]);

const targetEvidenceRefsForDecision = (
  decision: FinalPrimaryDecision,
  targetId: string,
  kind: PreviewFinalDecision['previewEntityKind'],
): ProblemAnalysisClaimRef[] => {
  const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
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
  if (kind === 'tag') {
    const dispositionRefs = decision.claimDispositions
      .filter(({ tagIds }) => tagIds.includes(targetId))
      .map(({ claimRef }) => policyClaimReference(claimRef));
    if (decision.primaryTagIds.includes(targetId)) {
      return normalizeClaimRefs([
        ...decision.decisionBasis.map(policyClaimReference),
        ...dispositionRefs,
      ]);
    }
    const supporting = decision.supportingTagDecisions.find(({ tagId }) => tagId === targetId);
    if (supporting) {
      return normalizeClaimRefs([
        ...supporting.decisionBasis.map(policyClaimReference),
        ...dispositionRefs,
      ]);
    }
    return NON_PRIMARY_TAG_IDS.includes(targetId) &&
      [...decision.primaryTagIds, ...decision.supportingTagIds].some((tagId) =>
        tagHasAncestor(tagId, targetId),
      )
      ? normalizeClaimRefs(decision.decisionBasis.map(policyClaimReference))
      : [];
  }
  if (kind === 'outcome') {
    if (
      decision.primaryOutcomeId === targetId ||
      decision.additionalPrimaryOutcomeIds.includes(targetId)
    ) {
      return normalizeClaimRefs(decision.decisionBasis.map(policyClaimReference));
    }
    const directSupporting = normalizeClaimRefs(
      decision.supportingTagDecisions
        .filter(({ outcomeIds }) => outcomeIds.includes(targetId))
        .flatMap(({ decisionBasis }) => decisionBasis.map(policyClaimReference)),
    );
    if (directSupporting.length > 0) return directSupporting;
    const outcome = FINAL_TAXONOMY_OUTCOMES.find(({ id }) => id === targetId);
    return outcome !== undefined &&
      NON_PRIMARY_OUTCOME_IDS.includes(targetId) &&
      [...decision.primaryTagIds, ...decision.supportingTagIds].some((tagId) =>
        outcome.scopeTagIds.some((scopeTagId) => tagHasAncestor(tagId, scopeTagId)),
      )
      ? normalizeClaimRefs(decision.decisionBasis.map(policyClaimReference))
      : [];
  }
  const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
  const primarySupportsUnit =
    outcomeById.get(decision.primaryOutcomeId)?.learningUnitCandidateIds.includes(targetId) ===
      true ||
    decision.additionalPrimaryOutcomeIds.some(
      (outcomeId) =>
        outcomeById.get(outcomeId)?.learningUnitCandidateIds.includes(targetId) === true,
    ) ||
    decision.primaryTagIds.some(
      (tagId) => tagById.get(tagId)?.learningUnitCandidateIds.includes(targetId) === true,
    );
  const references = [
    ...(primarySupportsUnit ? decision.decisionBasis : []),
    ...decision.supportingTagDecisions.flatMap((supporting) => {
      const tagSupports =
        tagById.get(supporting.tagId)?.learningUnitCandidateIds.includes(targetId) === true;
      const outcomeSupports = supporting.outcomeIds.some(
        (outcomeId) =>
          outcomeById.get(outcomeId)?.learningUnitCandidateIds.includes(targetId) === true,
      );
      return tagSupports || outcomeSupports ? supporting.decisionBasis : [];
    }),
  ];
  return normalizeClaimRefs(references.map(policyClaimReference));
};

const representativeDecisionRefs = (
  decisions: readonly FinalPrimaryDecision[],
  targetId: string,
  kind: PreviewFinalDecision['previewEntityKind'],
  maximum = 3,
): ProblemAnalysisClaimRef[] =>
  normalizeClaimRefs(
    decisions.slice(0, maximum).flatMap((decision) => {
      const targetReferences = targetEvidenceRefsForDecision(decision, targetId, kind);
      const dispositionReference =
        kind === 'tag'
          ? decision.claimDispositions.find(({ tagIds }) => tagIds.includes(targetId))?.claimRef
          : undefined;
      const preferredPath =
        kind === 'outcome' &&
        [decision.primaryOutcomeId, ...decision.additionalPrimaryOutcomeIds].includes(targetId)
          ? '/outcomeCandidates/0'
          : kind === 'tag' && dispositionReference === undefined
            ? '/reasoningPath/algorithmConnection'
            : undefined;
      const reference = dispositionReference
        ? policyClaimReference(dispositionReference)
        : (targetReferences.find(({ claimPath }) => claimPath === preferredPath) ??
          targetReferences[0]);
      return reference === undefined ? [] : [reference];
    }),
  );

const sourcesForRefs = (references: readonly ProblemAnalysisClaimRef[]): string[] =>
  sortedUnique(references.flatMap(({ sourceRevisionIds }) => sourceRevisionIds));

const adHocProjectionText = (element: {
  readonly text: string;
  readonly reusablePerspective: string;
}): string => `${element.text}（再利用可能な見方: ${element.reusablePerspective}）`;

const humanSurfaceAliases = (values: readonly string[]): string[] =>
  sortedUnique(values.filter((value) => !value.includes('->')));

const decisionsByProblemId = (
  decisions: readonly FinalPrimaryDecision[],
): ReadonlyMap<string, FinalPrimaryDecision> =>
  new Map(decisions.map((decision) => [decision.problemId, decision]));

const claimRefsForProblems = (
  problemIds: readonly string[],
  decisionByProblemId: ReadonlyMap<string, FinalPrimaryDecision>,
): ProblemAnalysisClaimRef[] =>
  normalizeClaimRefs(
    problemIds.flatMap((problemId) => {
      const decision = decisionByProblemId.get(problemId);
      if (!decision) {
        throw new FinalTaxonomyBuildError('POLICY_REPRESENTATIVE_PROBLEM_UNKNOWN', problemId, null);
      }
      return decisionEvidenceRefs(decision);
    }),
  );

const claimRefsForTargetProblems = (
  problemIds: readonly string[],
  targetId: string,
  kind: PreviewFinalDecision['previewEntityKind'],
  decisionByProblemId: ReadonlyMap<string, FinalPrimaryDecision>,
): ProblemAnalysisClaimRef[] =>
  normalizeClaimRefs(
    problemIds.flatMap((problemId) => {
      const decision = decisionByProblemId.get(problemId);
      if (!decision) {
        throw new FinalTaxonomyBuildError('POLICY_REPRESENTATIVE_PROBLEM_UNKNOWN', problemId, null);
      }
      const references = targetEvidenceRefsForDecision(decision, targetId, kind);
      if (references.length === 0) {
        throw new FinalTaxonomyBuildError(
          'POLICY_TARGET_EVIDENCE_MISSING',
          `${problemId}/${targetId}`,
        );
      }
      return references;
    }),
  );

const supportingOutcomeIdsForDecision = (decision: FinalPrimaryDecision): string[] =>
  sortedUnique([...decision.additionalPrimaryOutcomeIds, ...decision.supportingOutcomeIds]).filter(
    (outcomeId) => outcomeId !== decision.primaryOutcomeId,
  );

const policyDecisionSupportIsValid = (decision: FinalPrimaryDecision): boolean => {
  const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
  const knownOutcomeIds = new Set(FINAL_TAXONOMY_OUTCOMES.map(({ id }) => id));
  const supportingTagIds = decision.supportingTagDecisions.map(({ tagId }) => tagId);
  const supportingOutcomeIds = decision.supportingTagDecisions.flatMap(
    ({ outcomeIds }) => outcomeIds,
  );
  const primaryOutcomeIds = [decision.primaryOutcomeId, ...decision.additionalPrimaryOutcomeIds];
  return (
    sameOrderedValues(sortedUnique(decision.supportingTagIds), sortedUnique(supportingTagIds)) &&
    sameOrderedValues(
      sortedUnique(decision.supportingOutcomeIds),
      sortedUnique(supportingOutcomeIds),
    ) &&
    new Set(supportingTagIds).size === supportingTagIds.length &&
    new Set(supportingOutcomeIds).size === supportingOutcomeIds.length &&
    new Set(primaryOutcomeIds).size === primaryOutcomeIds.length &&
    primaryOutcomeIds.every(
      (outcomeId) =>
        knownOutcomeIds.has(outcomeId) &&
        decision.primaryTagIds.some(
          (tagId) => tagById.get(tagId)?.learningOutcomeIds.includes(outcomeId) === true,
        ),
    ) &&
    decision.supportingTagDecisions.every(
      ({ tagId, outcomeIds, selectionRationale, decisionBasis }) => {
        const tag = tagById.get(tagId);
        return (
          tag !== undefined &&
          selectionRationale.trim().length > 0 &&
          decisionBasis.length > 0 &&
          outcomeIds.every(
            (outcomeId) =>
              knownOutcomeIds.has(outcomeId) && tag.learningOutcomeIds.includes(outcomeId),
          )
        );
      },
    )
  );
};

/**
 * A placement names only Units that directly explain one of its assigned Tags or
 * Outcomes. Ancestors receive descendant Problem coverage for ordering and reuse
 * checks, but are not invented as additional semantic assignments.
 */
const directLearningUnitIdsForDecision = (decision: FinalPrimaryDecision): string[] => {
  const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
  const assignedOutcomeIds = [
    decision.primaryOutcomeId,
    ...supportingOutcomeIdsForDecision(decision),
  ];
  const directUnitIds = sortedUnique([
    ...decision.learningUnitCandidateIds,
    ...assignedOutcomeIds.flatMap(
      (outcomeId) => outcomeById.get(outcomeId)?.learningUnitCandidateIds ?? [],
    ),
  ]);
  if (directUnitIds.length === 0) {
    throw new FinalTaxonomyBuildError(
      'POLICY_LEARNING_UNIT_ASSIGNMENT_MISSING',
      decision.problemId,
    );
  }
  return directUnitIds;
};

const learningUnitAndAncestorIds = (
  unitId: string,
  unitsById: ReadonlyMap<string, MetadataLearningUnitCandidate>,
): string[] => {
  const result: string[] = [];
  const visited = new Set<string>();
  let currentId: string | null = unitId;
  while (currentId !== null) {
    if (visited.has(currentId)) {
      throw new FinalTaxonomyBuildError('POLICY_LEARNING_UNIT_PARENT_CYCLE', unitId);
    }
    visited.add(currentId);
    const current = unitsById.get(currentId);
    if (!current) {
      throw new FinalTaxonomyBuildError('POLICY_LEARNING_UNIT_UNKNOWN', currentId);
    }
    result.push(currentId);
    currentId = current.parentId;
  }
  return result;
};

const materializePolicyLearningUnits = (
  decisions: readonly FinalPrimaryDecision[],
): MetadataLearningUnitCandidate[] => {
  const unitsById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));
  const problemsByUnitId = new Map<string, string[]>();
  for (const decision of decisions) {
    for (const directUnitId of decision.learningUnitCandidateIds) {
      for (const coveredUnitId of learningUnitAndAncestorIds(directUnitId, unitsById)) {
        const problemIds = problemsByUnitId.get(coveredUnitId) ?? [];
        problemIds.push(decision.problemId);
        problemsByUnitId.set(coveredUnitId, problemIds);
      }
    }
  }
  return FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => ({
    ...unit,
    problemIds: sortedUnique(problemsByUnitId.get(unit.id) ?? []),
  }));
};

const finalCandidatesFromPolicy = (
  decisions: readonly FinalPrimaryDecision[],
): FinalTaxonomyCandidate[] => {
  const materializedUnits = materializePolicyLearningUnits(decisions);
  const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
  const decisionByProblemId = new Map(decisions.map((decision) => [decision.problemId, decision]));
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
  const tagCandidates = FINAL_TAXONOMY_TAGS.map((tag): FinalTaxonomyCandidate => {
    const representativeDecisions = tag.representativeProblemIds.map((problemId) => {
      const decision = decisionByProblemId.get(problemId);
      if (!decision) {
        throw new FinalTaxonomyBuildError(
          'TAG_REPRESENTATIVE_PROBLEM_MISSING',
          `${tag.id}/${problemId}`,
        );
      }
      const usesTag = decision.primaryTagIds.some(
        (tagId) => tagId === tag.id || (tag.parentId === null && tagHasAncestor(tagId, tag.id)),
      );
      if (!usesTag) {
        throw new FinalTaxonomyBuildError(
          'TAG_REPRESENTATIVE_ASSIGNMENT_MISMATCH',
          `${tag.id}/${problemId}`,
        );
      }
      return decision;
    });
    const evidenceRefs = representativeDecisionRefs(
      representativeDecisions,
      tag.id,
      'tag',
      representativeDecisions.length,
    );
    return FinalTaxonomyCandidateSchema.parse({
      kind: 'tag',
      entity: {
        id: tag.id,
        name: tag.name,
        definition: tag.definition,
        parentId: tag.parentId,
        prerequisiteTagIds: tag.prerequisiteTagIds,
        learningOutcomeIds: tag.learningOutcomeIds,
        representativeProblemIds: tag.representativeProblemIds,
        aliases: tag.aliases,
        formerNames: tag.formerNames,
        lifecycle: 'active',
        replacementTagIds: [],
      },
      sourceRevisionIds: sourcesForRefs(evidenceRefs),
      evidenceRefs,
      materializationTask: 'T047',
    });
  });
  const outcomeCandidates = FINAL_TAXONOMY_OUTCOMES.map((outcome): FinalTaxonomyCandidate => {
    const supportingDecisions = decisions.filter((decision) =>
      [decision.primaryOutcomeId, ...supportingOutcomeIdsForDecision(decision)].includes(
        outcome.id,
      ),
    );
    const descendantDecisions =
      supportingDecisions.length === 0 && NON_PRIMARY_OUTCOME_IDS.includes(outcome.id)
        ? decisions.filter((decision) =>
            [...decision.primaryTagIds, ...decision.supportingTagIds].some((tagId) =>
              outcome.scopeTagIds.some((scopeTagId) => tagHasAncestor(tagId, scopeTagId)),
            ),
          )
        : [];
    const representativeDecisions =
      supportingDecisions.length > 0 ? supportingDecisions : descendantDecisions;
    const evidenceRefs =
      supportingDecisions.length > 0
        ? representativeDecisionRefs(supportingDecisions, outcome.id, 'outcome')
        : normalizeClaimRefs(descendantDecisions.slice(0, 3).flatMap(decisionEvidenceRefs));
    return FinalTaxonomyCandidateSchema.parse({
      kind: 'outcome',
      entity: {
        id: outcome.id,
        statement: outcome.statement,
        prerequisiteOutcomeIds: outcome.prerequisiteOutcomeIds,
        scopeIds: sortedUnique([
          ...outcome.scopeTagIds,
          ...outcome.learningUnitCandidateIds,
          ...representativeDecisions.map(({ problemId }) => problemId),
        ]),
      },
      sourceRevisionIds: sourcesForRefs(evidenceRefs),
      evidenceRefs,
      materializationTask: 'T048',
    });
  });
  const unitCandidates = materializedUnits.map((unit): FinalTaxonomyCandidate => {
    const supportingDecisions = decisions.filter((decision) =>
      unit.problemIds.includes(decision.problemId),
    );
    const evidenceRefs = normalizeClaimRefs(
      supportingDecisions.slice(0, 3).flatMap((decision) => {
        const targetReferences = targetEvidenceRefsForDecision(decision, unit.id, 'unit');
        return targetReferences.length > 0 ? targetReferences : decisionEvidenceRefs(decision);
      }),
    );
    return FinalTaxonomyCandidateSchema.parse({
      kind: 'unit',
      entity: {
        id: unit.id,
        kind: unit.kind,
        title: unit.title,
        parentId: unit.parentId,
        baselineId: 'prereq-abc-advanced-v1',
        baselineVersion: '1.0.0',
        additionalPrerequisiteUnitIds: unit.additionalPrerequisiteUnitIds,
        excludedTopics: unit.excludedTopics,
        sourceRevisionIds: sourcesForRefs(evidenceRefs),
        tagIds: unit.tagIds,
        learningOutcomeIds: unit.learningOutcomeIds,
        problemIds: unit.problemIds,
        stageRank: unit.stageRank,
        difficultyRank: unit.difficultyRank,
        representativeRank: unit.representativeRank,
        globalIndex: 0,
        orderReason: unit.orderReason,
      },
      sourceRevisionIds: sourcesForRefs(evidenceRefs),
      evidenceRefs,
      materializationTask: 'T050',
    });
  });
  return [...tagCandidates, ...outcomeCandidates, ...unitCandidates];
};

const placementsFromPolicy = (
  decisions: readonly FinalPrimaryDecision[],
): FinalProblemPlacementProjection[] => {
  return decisions.map((decision) => {
    const supportingOutcomeIds = supportingOutcomeIdsForDecision(decision);
    const learningUnitIds = directLearningUnitIdsForDecision(decision);
    const evidenceRefs = decisionEvidenceRefs(decision);
    const evidenceIds = sortedUnique(evidenceRefs.flatMap(({ evidenceIds: ids }) => ids));
    return FinalProblemPlacementProjectionSchema.parse({
      id: `placement-${decision.problemId}`,
      problemId: decision.problemId,
      policyVersion: '1.0.0',
      kind: 'full',
      primaryProblemId: null,
      sharedOutcomeIds: [],
      comparison: {
        method:
          '採用手法はこのProblem固有の根拠とともにfull配置へ保持し、別Problemとの手法同一性を仮定しない。',
        proof:
          '正当性の論証はこのProblemのclaimを参照し、別Problemと証明が同値だという省略比較を行わない。',
        complexity:
          '計算量はこのProblemの制約に対する成立性を個別に保ち、漸近量の一致だけで統合しない。',
        constraints: '公式制約と実行可能性の境界をこのProblem固有の判断材料として保持する。',
        prerequisites:
          '必要な前提は割り当てたTagとLearning Unit、および独立した前提DAGから明示する。',
        implementation:
          '実装上の注意と問題固有の洞察をadHocElementsへ残し、共通分類によって脱落させない。',
      },
      additionalElement: null,
      rationale: [
        `決定種別=${decision.decisionKind}`,
        `著者判断状態=${decision.acceptanceStatus}`,
        `曖昧性=${decision.ambiguityStatus}`,
        `スコア差=${decision.scoreGap === null ? '非適用' : String(decision.scoreGap)}`,
        `未解決競合Tag=${decision.competingTagIds.join(',') || 'なし'}`,
        `一致した意味次元=${decision.matchedSemanticDimensions.join(',') || '個別判断'}`,
        `選択理由: ${decision.selectionRationale}`,
        ...decision.supportingTagDecisions.map(
          ({ tagId, outcomeIds, selectionRationale }) =>
            `補助Tag=${tagId}; 補助Outcome=${outcomeIds.join(',') || 'なし'}; 選択理由: ${selectionRationale}`,
        ),
      ].join('; '),
      evidenceIds,
      primaryTagIds: decision.primaryTagIds,
      supportingTagIds: decision.supportingTagIds,
      primaryOutcomeId: decision.primaryOutcomeId,
      supportingOutcomeIds,
      learningUnitIds,
      presentationUnitId: decision.presentationUnitId,
      adHocElements: decision.adHocElements.map(adHocProjectionText),
      claimDispositions: decision.claimDispositions.map(
        ({ claimRef, kind, tagIds, rationale }) => ({
          claimRef: policyClaimReference(claimRef),
          kind,
          tagIds,
          rationale,
        }),
      ),
      analysisEvidenceRefs: evidenceRefs,
    });
  });
};

const semanticIntegrationEntriesFromPolicy = (
  decisions: readonly PreviewFinalDecision[],
  primaryDecisions: readonly FinalPrimaryDecision[],
): SemanticIntegrationEntry[] => {
  const decisionByProblemId = decisionsByProblemId(primaryDecisions);
  return decisions.map((decision): SemanticIntegrationEntry => {
    const affectedProblemIds = sortedUnique(decision.affectedProblemIds);
    const policyRepresentativeIds = sortedUnique(
      decision.action === 'split'
        ? decision.splitAssignments.flatMap(
            ({ representativeProblemIds }) => representativeProblemIds,
          )
        : decision.representativeProblemIds,
    );
    const expectedEvidenceOwners = sortedUnique([
      ...affectedProblemIds,
      ...policyRepresentativeIds,
    ]);
    if (
      !sameOrderedValues(expectedEvidenceOwners, sortedUnique(decision.evidenceOwnerProblemIds))
    ) {
      throw new FinalTaxonomyBuildError(
        'POLICY_INTEGRATION_EVIDENCE_OWNER_SCOPE_MISMATCH',
        decision.previewEntityId,
      );
    }
    const correctionImpactIds = [`impact-${decision.previewEntityId}`];
    const reviewPolicy = {
      requiredMode: 'third_party' as const,
      riskReasons: ['major_classification_change' as const],
    };
    const base = {
      previewEntityId: decision.previewEntityId,
      previewEntityKind: decision.previewEntityKind,
      finalEntityIds: sortedUnique(decision.finalEntityIds),
      affectedProblemIds,
      rationale: decision.rationale,
      correctionImpactIds,
      reviewPolicy,
    };
    switch (decision.action) {
      case 'promote': {
        const targetId = decision.finalEntityIds[0];
        if (!targetId) {
          throw new FinalTaxonomyBuildError(
            'POLICY_PROMOTE_TARGET_MISSING',
            decision.previewEntityId,
          );
        }
        const representativeProblemIds = sortedUnique(decision.representativeProblemIds);
        return {
          ...base,
          action: 'promote',
          evidenceRefs: claimRefsForTargetProblems(
            sortedUnique([...affectedProblemIds, ...representativeProblemIds]),
            targetId,
            decision.previewEntityKind,
            decisionByProblemId,
          ),
          splitProblemAssignments: [],
          decisionEvidence: {
            fullInventoryComparison: decision.rationale,
            representativeProblemIds,
          },
          legacyDisposition: {
            kind: 'redirect',
            fromPreviewEntityId: decision.previewEntityId,
            toFinalEntityId: targetId,
            aliases: humanSurfaceAliases(decision.aliasesOrRedirects),
          },
        };
      }
      case 'merge': {
        const targetId = decision.finalEntityIds[0];
        if (!targetId) {
          throw new FinalTaxonomyBuildError(
            'POLICY_MERGE_TARGET_MISSING',
            decision.previewEntityId,
          );
        }
        const representativeProblemIds = sortedUnique(decision.representativeProblemIds);
        return {
          ...base,
          action: 'merge',
          evidenceRefs: claimRefsForTargetProblems(
            sortedUnique([...affectedProblemIds, ...representativeProblemIds]),
            targetId,
            decision.previewEntityKind,
            decisionByProblemId,
          ),
          splitProblemAssignments: [],
          decisionEvidence: {
            equivalenceOrContainmentProof: decision.rationale,
            representativeProblemIds,
          },
          legacyDisposition: {
            kind: 'redirect',
            fromPreviewEntityId: decision.previewEntityId,
            toFinalEntityId: targetId,
            aliases: humanSurfaceAliases(decision.aliasesOrRedirects),
          },
        };
      }
      case 'split': {
        const assignments = decision.splitAssignments.map((assignment) => {
          if (assignment.problemIds.some((problemId) => !affectedProblemIds.includes(problemId))) {
            throw new FinalTaxonomyBuildError(
              'POLICY_SPLIT_ASSIGNMENT_SCOPE_INVALID',
              `${decision.previewEntityId}/${assignment.finalEntityId}`,
            );
          }
          const affectedAssignments = sortedUnique(assignment.problemIds);
          const representativeProblemIds = sortedUnique(assignment.representativeProblemIds);
          return {
            finalEntityId: assignment.finalEntityId,
            problemIds: affectedAssignments,
            evidenceRefs: claimRefsForTargetProblems(
              representativeProblemIds,
              assignment.finalEntityId,
              decision.previewEntityKind,
              decisionByProblemId,
            ),
            representativeProblemIds,
          };
        });
        return {
          ...base,
          action: 'split',
          evidenceRefs: claimRefsForProblems(affectedProblemIds, decisionByProblemId),
          splitProblemAssignments: assignments,
          decisionEvidence: { completeReclassificationProof: decision.rationale },
          legacyDisposition: {
            kind: 'split_aliases',
            fromPreviewEntityId: decision.previewEntityId,
            targets: decision.finalEntityIds.map((finalEntityId) => ({
              finalEntityId,
              aliases: humanSurfaceAliases(decision.aliasesOrRedirects),
            })),
            ambiguousRedirectOmittedReason:
              'A split preview entity has no single canonical redirect target.',
          },
        };
      }
      case 'retire':
        return {
          ...base,
          action: 'retire',
          finalEntityIds: [],
          evidenceRefs: claimRefsForProblems(affectedProblemIds, decisionByProblemId),
          splitProblemAssignments: [],
          decisionEvidence: {
            retirementRationale: decision.rationale,
            reassignedProblemIds: affectedProblemIds,
          },
          legacyDisposition: {
            kind: 'retired',
            previewEntityId: decision.previewEntityId,
            replacementEntityIds: [],
            retirementReason: decision.rationale,
          },
        };
    }
  });
};

const affectedUnitIdsForEntry = (
  entry: SemanticIntegrationEntry,
  candidates: readonly FinalTaxonomyCandidate[],
): string[] => {
  const units = candidates.filter(
    (candidate): candidate is Extract<FinalTaxonomyCandidate, { kind: 'unit' }> =>
      candidate.kind === 'unit',
  );
  return units
    .filter(({ entity }) =>
      entry.previewEntityKind === 'unit'
        ? entry.finalEntityIds.includes(entity.id)
        : entry.previewEntityKind === 'tag'
          ? entity.tagIds.some((id) => entry.finalEntityIds.includes(id))
          : entity.learningOutcomeIds.some((id) => entry.finalEntityIds.includes(id)),
    )
    .map(({ entity }) => entity.id)
    .sort(compareCodeUnits);
};

const semanticImpactsFromEntries = (
  entries: readonly SemanticIntegrationEntry[],
  candidates: readonly FinalTaxonomyCandidate[],
  decisionByProblemId: ReadonlyMap<string, FinalPrimaryDecision>,
): SemanticCorrectionImpact[] => {
  const problemSurfaces = [
    'body',
    'example',
    'exercise',
    'answer',
    'placement',
    'derived_index',
  ] as const;
  const unitSurfaces = [
    'body',
    'example',
    'exercise',
    'answer',
    'standard_order',
    'derived_index',
  ] as const;
  const problemSurfaceRationale = (
    surface: (typeof problemSurfaces)[number],
    previewEntityId: string,
  ): string => {
    switch (surface) {
      case 'body':
        return `T050以降の本文で${previewEntityId}の仮名称を最終Tag・Outcome・Unitへ置換し、Problem固有の導出は保持する。`;
      case 'example':
        return `T050の例で最終Outcomeの到達能力を観察できるか確認し、仮分類だけを前提にした説明を残さない。`;
      case 'exercise':
        return `T050の演習対応を最終Learning Unitへ接続し、対象Problemの分類変更を課題設計へ反映する。`;
      case 'answer':
        return `T050の解答検証で最終Outcomeとad-hoc要素の双方が失われていないことを確認する。`;
      case 'placement':
        return `T049で${previewEntityId}からの最終配置を確定し、primary/supporting分類とfull判定をmaterializeする。`;
      case 'derived_index':
        return `T049でProblem索引の仮entity参照を最終IDへ更新し、placement digestとの一致を検証する。`;
    }
  };
  const unitSurfaceRationale = (
    surface: (typeof unitSurfaces)[number],
    previewEntityId: string,
  ): string => {
    switch (surface) {
      case 'body':
        return `T050で${previewEntityId}の統合判断に沿うUnit本文境界を作り、含める概念とexcludedTopicsを反映する。`;
      case 'example':
        return `T050でUnitの各最終Outcomeを発動できる共置例を配置し、代表Problemの根拠と照合する。`;
      case 'exercise':
        return `T050でUnitの最終Tag・Outcomeを測る演習を配置し、split/merge後の責務を混同しない。`;
      case 'answer':
        return `T050で演習解答がUnitの最終到達条件を検証し、仮taxonomyの到達条件を引き継がないことを確認する。`;
      case 'standard_order':
        return `T048で追加前提DAGと親子順制約を別々に適用し、このUnitの標準順位置を再計算する。`;
      case 'derived_index':
        return `T049でUnit索引を最終ID・Problem集合・Outcome集合から再生成し、仮entityを正本入力にしない。`;
    }
  };
  const unitById = new Map(
    candidates.flatMap((candidate) =>
      candidate.kind === 'unit' ? [[candidate.entity.id, candidate.entity] as const] : [],
    ),
  );
  return entries.map((entry) => {
    const affectedLearningUnitCandidateIds = affectedUnitIdsForEntry(entry, candidates);
    const representativeProblemIds =
      entry.action === 'split'
        ? entry.splitProblemAssignments.flatMap(({ representativeProblemIds: ids }) => ids)
        : entry.action === 'promote' || entry.action === 'merge'
          ? entry.decisionEvidence.representativeProblemIds
          : [];
    const evidenceOwnerProblemIds = sortedUnique([
      ...entry.affectedProblemIds,
      ...representativeProblemIds,
    ]);
    const evidenceRefs = claimRefsForProblems(evidenceOwnerProblemIds, decisionByProblemId);
    const derivedIndexPaths = ['src/content/indexes/taxonomy.json'];
    const surfaceAssessments: SemanticCorrectionImpact['surfaceAssessments'] = [
      ...entry.affectedProblemIds.flatMap((problemId) =>
        problemSurfaces.map((surface) => {
          const problemEvidenceRefs = claimRefsForProblems([problemId], decisionByProblemId);
          return {
            ownerType: 'problem' as const,
            problemId,
            surface,
            disposition: 'materialize_change' as const,
            rationale: problemSurfaceRationale(surface, entry.previewEntityId),
            evidenceRefs: problemEvidenceRefs,
          };
        }),
      ),
      ...affectedLearningUnitCandidateIds.flatMap((learningUnitId) =>
        unitSurfaces.map((surface) => {
          const unit = unitById.get(learningUnitId);
          const relevantProblemIds = evidenceOwnerProblemIds.filter((problemId) =>
            unit?.problemIds.includes(problemId),
          );
          if (relevantProblemIds.length === 0) {
            throw new FinalTaxonomyBuildError(
              'CORRECTION_IMPACT_UNIT_EVIDENCE_MISSING',
              `${entry.previewEntityId}/${learningUnitId}`,
            );
          }
          return {
            ownerType: 'learning_unit_candidate' as const,
            learningUnitId,
            surface,
            disposition: 'materialize_change' as const,
            rationale: unitSurfaceRationale(surface, entry.previewEntityId),
            evidenceRefs: claimRefsForProblems(relevantProblemIds, decisionByProblemId),
          };
        }),
      ),
      ...derivedIndexPaths.map((derivedPath) => ({
        ownerType: 'derived_index' as const,
        path: derivedPath,
        surface: 'index' as const,
        disposition: 'materialize_change' as const,
        rationale:
          `T049で${entry.previewEntityId}のredirect/split/retire判断を派生taxonomy索引へ反映し、` +
          '全868 Problemのplacement closureと照合する。',
        evidenceRefs,
      })),
    ];
    return {
      id: entry.correctionImpactIds[0] ?? `impact-${entry.previewEntityId}`,
      integrationPreviewEntityIds: [entry.previewEntityId],
      sourceRevisionIds: sourcesForRefs(
        surfaceAssessments.flatMap(({ evidenceRefs: refs }) => refs),
      ),
      changeSummary: entry.rationale,
      affectedProblemIds: entry.affectedProblemIds,
      affectedLearningUnitCandidateIds,
      surfaceAssessments,
      affectedLearningUnitOrderIds: affectedLearningUnitCandidateIds,
      derivedIndexPaths,
      canonicalMaterializationTask: 'T049',
      coverageStatus: 'complete',
    };
  });
};

export const finalTaxonomyPolicyRulesDigest = (): string =>
  canonicalDigest({
    tags: FINAL_TAXONOMY_TAGS,
    outcomes: FINAL_TAXONOMY_OUTCOMES,
    learningUnits: FINAL_LEARNING_UNIT_CANDIDATES,
    orderPolicy: FINAL_LEARNING_UNIT_ORDER_POLICY,
    primaryOverrides: CURATED_PRIMARY_OVERRIDES,
    previewDecisions: PREVIEW_FINAL_TAXONOMY_DECISIONS,
    nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
    nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
  });

/** Build the deterministic full-corpus proposal strictly from policy + accepted Inventory. */
export const buildFinalTaxonomyFromPolicy = (
  context: LoadedFinalTaxonomySourceContext,
): FinalTaxonomyBuild => {
  const policyDiagnostics = validateFinalTaxonomyPolicy();
  if (policyDiagnostics.length > 0) {
    throw new FinalTaxonomyBuildError('FINAL_TAXONOMY_POLICY_INVALID', policyDiagnostics.join(','));
  }
  const table = buildFullCorpusPrimaryDecisionTable(context.records);
  if (table.decisions.length !== FINAL_TAXONOMY_PROBLEM_COUNT) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_DECISION_COVERAGE_INVALID',
      String(table.decisions.length),
    );
  }
  if (
    table.decisions.some(
      (decision) =>
        decision.competingTagIds.length > 0 ||
        (decision.decisionKind === 'curated_semantic_override'
          ? decision.ambiguityStatus !== 'curated_override'
          : decision.ambiguityStatus !== 'proposed_assignment') ||
        decision.scoreGap !== null,
    )
  ) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_AMBIGUOUS_DECISION',
      'Every primary decision must distinguish a reviewed curated override from an explicit, still-proposed Inventory assignment.',
    );
  }
  if (table.decisions.some((decision) => !policyDecisionSupportIsValid(decision))) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_SUPPORT_DECISION_INVALID',
      'Supporting Tags and Outcomes require exact target-specific rationale and claim evidence.',
    );
  }
  const candidates = finalCandidatesFromPolicy(table.decisions);
  const placements = placementsFromPolicy(table.decisions);
  const entries = semanticIntegrationEntriesFromPolicy(
    PREVIEW_FINAL_TAXONOMY_DECISIONS,
    table.decisions,
  );
  const impacts = semanticImpactsFromEntries(
    entries,
    candidates,
    decisionsByProblemId(table.decisions),
  );
  const candidateOutcomeIds = candidates.flatMap((candidate) =>
    candidate.kind === 'outcome' ? [candidate.entity.id] : [],
  );
  if (
    !sameOrderedValues(
      sortedUnique(candidateOutcomeIds),
      sortedUnique(context.workManifest.learningOutcomeIds),
    )
  ) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_MANIFEST_OUTCOME_SCOPE_MISMATCH',
      'The fixed review manifest must cover every final Outcome exactly.',
    );
  }
  return assembleFinalTaxonomyBuild(context, {
    policy: {
      name: 'full-corpus-taxonomy-recompute',
      version: table.policyVersion,
      inputScope: 'accepted-t044-complete-technique-inventory',
      rulesDigest: finalTaxonomyPolicyRulesDigest(),
    },
    finalCandidates: candidates,
    placements,
    integrationEntries: entries,
    correctionImpacts: impacts,
    nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
    nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
  });
};

const valueAtClaimPath = (record: ProblemAnalysisRecord, claimPath: string): unknown => {
  let current: unknown = record;
  if (!claimPath.startsWith('/')) return undefined;
  for (const encodedSegment of claimPath.slice(1).split('/')) {
    if (/~(?![01])/u.test(encodedSegment)) return undefined;
    const segment = encodedSegment.replace(/~1/gu, '/').replace(/~0/gu, '~');
    if (current === null || typeof current !== 'object') return undefined;
    if (Array.isArray(current)) {
      if (!/^(?:0|[1-9]\d*)$/u.test(segment)) return undefined;
      const index = Number(segment);
      if (!Number.isSafeInteger(index) || index < 0) return undefined;
      current = current[index];
    } else {
      current = Reflect.get(current, segment);
    }
  }
  return current;
};

const validateClaimReference = (
  reference: ProblemAnalysisClaimRef,
  recordsById: ReadonlyMap<string, ProblemAnalysisRecord>,
): FinalTaxonomyDiagnostic[] => {
  const record = recordsById.get(reference.problemId);
  if (!record) {
    return [
      {
        code: 'ANALYSIS_EVIDENCE_OWNER_UNKNOWN',
        message: `${reference.problemId} does not own ${reference.claimPath}.`,
        entityId: reference.problemId,
      },
    ];
  }
  const claim = valueAtClaimPath(record, reference.claimPath);
  if (claim === null || typeof claim !== 'object' || Array.isArray(claim)) {
    return [
      {
        code: 'ANALYSIS_CLAIM_POINTER_STALE',
        message: `${reference.problemId}${reference.claimPath} does not resolve.`,
        entityId: reference.problemId,
      },
    ];
  }
  const claimEvidenceIds = (claim as Readonly<Record<string, unknown>>).evidenceIds;
  if (
    !Array.isArray(claimEvidenceIds) ||
    claimEvidenceIds.some((evidenceId) => typeof evidenceId !== 'string') ||
    !sameOrderedValues(
      sortedUnique(reference.evidenceIds),
      sortedUnique(
        claimEvidenceIds.filter(
          (evidenceId): evidenceId is string => typeof evidenceId === 'string',
        ),
      ),
    )
  ) {
    return [
      {
        code: 'ANALYSIS_CLAIM_EVIDENCE_MISMATCH',
        message: `${reference.problemId}${reference.claimPath} has stale evidence IDs.`,
        entityId: reference.problemId,
      },
    ];
  }
  const evidenceById = new Map(record.evidence.map((evidence) => [evidence.id, evidence]));
  const expectedSourceIds = sortedUnique(
    reference.evidenceIds.flatMap(
      (evidenceId) => evidenceById.get(evidenceId)?.sourceRevisionIds ?? [],
    ),
  );
  if (
    reference.evidenceIds.some((evidenceId) => !evidenceById.has(evidenceId)) ||
    !sameOrderedValues(expectedSourceIds, sortedUnique(reference.sourceRevisionIds))
  ) {
    return [
      {
        code: 'ANALYSIS_CLAIM_SOURCE_MISMATCH',
        message: `${reference.problemId}${reference.claimPath} has stale Source Revisions.`,
        entityId: reference.problemId,
      },
    ];
  }
  return [];
};

const allBuildClaimReferences = (build: FinalTaxonomyBuild): ProblemAnalysisClaimRef[] => [
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

export const validateFinalTaxonomyBuildAgainstContext = (
  context: LoadedFinalTaxonomySourceContext,
  value: unknown,
  gates: FinalTaxonomySemanticGates = {},
): readonly FinalTaxonomyDiagnostic[] => {
  const parsed = FinalTaxonomyBuildSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues.map((issue) => ({
      code: 'FINAL_TAXONOMY_SCHEMA_INVALID',
      message: `${issue.path.join('.')}: ${issue.message}`,
    }));
  }
  const build = parsed.data;
  const diagnostics: FinalTaxonomyDiagnostic[] = [];
  const add = (code: string, message: string, entityId?: string): void => {
    diagnostics.push(entityId === undefined ? { code, message } : { code, message, entityId });
  };
  if (
    build.inputs.inventory.evidencePath !== context.layout.inventoryEvidencePath ||
    build.inputs.inventory.evidenceDigest !== context.inventoryEvidence.evidenceDigest ||
    build.inputs.inventory.inventoryDigest !== context.inventoryEvidence.inventoryDigest ||
    build.inputs.inventory.corpusDigest !== context.inventoryEvidence.corpusDigest ||
    build.inputs.inventory.authoringEvidencePath !== context.layout.authoringEvidencePath ||
    build.inputs.inventory.authoringEvidenceDigest !== context.authoringEvidence.evidenceDigest ||
    build.inputs.inventory.authoringInventoryDigest !== context.authoringEvidence.inventoryDigest ||
    build.inputs.inventory.normalizedSourceSetDigest !==
      context.authoringEvidence.normalizedSourceSet.digest
  ) {
    add('FINAL_TAXONOMY_INPUT_EVIDENCE_MISMATCH', 'The T044/authoring evidence binding is stale.');
  }
  if (
    build.inputs.previewSnapshot.path !== context.previewReference.canonicalSnapshotPath ||
    build.inputs.previewSnapshot.referencePath !== context.previewReferencePath ||
    build.inputs.previewSnapshot.joinDigest !== context.previewReference.joinDigest ||
    build.inputs.previewSnapshot.canonicalSnapshotDigest !==
      context.previewReference.canonicalSnapshotDigest ||
    build.inputs.previewSnapshot.transactionId !== context.previewReference.transactionId
  ) {
    add('FINAL_TAXONOMY_PREVIEW_BINDING_MISMATCH', 'The passed T154 snapshot binding is stale.');
  }
  if (
    canonicalJson(build.integrationMap.provisionalEvidence) !==
      canonicalJson(context.provisionalEvidence) ||
    build.integrationMap.inventoryDigest !== context.inventoryEvidence.inventoryDigest ||
    build.integrationMap.previewSnapshotDigest !== context.previewReference.joinDigest ||
    build.inputs.integrationMapPath !== context.layout.provisionalIntegrationPath
  ) {
    add(
      'FINAL_TAXONOMY_PROVISIONAL_EVIDENCE_MISMATCH',
      'The integration map does not preserve the frozen preview evidence.',
    );
  }
  if (
    build.policy.authoringSkillName !== context.authoringEvidence.skill.name ||
    build.policy.authoringSkillVersion !== context.authoringEvidence.skill.version ||
    build.policy.authoringSkillDigest !== context.authoringEvidence.skill.digest ||
    build.policy.writingPolicyPath !== context.authoringEvidence.skill.writingPolicyPath ||
    build.policy.writingPolicyDigest !== context.authoringEvidence.skill.writingPolicyDigest ||
    build.policy.sourceNormalizationVersion !==
      context.authoringEvidence.skill.sourceNormalizationVersion ||
    build.policy.workManifestPath !== context.layout.workManifestPath ||
    build.policy.workManifestDigest !== context.workManifest.digest ||
    build.policy.requiredReviewMode !== context.workManifest.reviewPolicy.requiredMode ||
    !sameOrderedValues(
      sortedUnique(build.policy.riskReasons),
      sortedUnique(context.workManifest.reviewPolicy.riskReasons),
    ) ||
    build.policy.name !== 'full-corpus-taxonomy-recompute' ||
    build.policy.version !== '1.0.0' ||
    build.policy.inputScope !== 'accepted-t044-complete-technique-inventory' ||
    build.policy.rulesDigest !== finalTaxonomyPolicyRulesDigest()
  ) {
    add('FINAL_TAXONOMY_POLICY_BINDING_MISMATCH', 'The authoring/policy provenance is stale.');
  }
  const recordIds = context.records.map(({ problemId }) => problemId);
  const placementIds = build.placements.map(({ problemId }) => problemId);
  if (
    placementIds.length !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    !sameOrderedValues(sortedUnique(recordIds), sortedUnique(placementIds))
  ) {
    add(
      'FINAL_TAXONOMY_PROBLEM_COVERAGE_INVALID',
      'Placements must exactly cover the accepted 868-Problem inventory.',
    );
  }
  const recordsById = new Map(context.records.map((record) => [record.problemId, record]));
  for (const reference of allBuildClaimReferences(build)) {
    diagnostics.push(...validateClaimReference(reference, recordsById));
  }
  const knownSourceIds = new Set(context.knownSourceRevisionIds);
  for (const sourceRevisionId of build.sourceRevisionIds) {
    if (!knownSourceIds.has(sourceRevisionId)) {
      add(
        'FINAL_TAXONOMY_SOURCE_UNKNOWN',
        `Unknown Source Revision ${sourceRevisionId}.`,
        sourceRevisionId,
      );
    }
  }
  if (
    !sameOrderedValues(
      sortedUnique(build.sourceRevisionIds),
      sortedUnique(context.referencedSourceRevisionIds),
    )
  ) {
    add(
      'FINAL_TAXONOMY_SOURCE_CLOSURE_INCOMPLETE',
      `The build must use the exact ${String(context.referencedSourceRevisionIds.length)}-revision evidence closure, distinct from the ${String(context.knownSourceRevisionIds.length)} known corpus revisions.`,
    );
  }
  const placementByProblemId = new Map(
    build.placements.map((placement) => [placement.problemId, placement]),
  );
  const standardOrderIndex = new Map(build.standardOrder.map((unitId, index) => [unitId, index]));
  for (const placement of build.placements) {
    const record = recordsById.get(placement.problemId);
    if (placement.kind !== 'full') {
      add(
        'FINAL_TAXONOMY_ABBREVIATED_PLACEMENT_UNPROVEN',
        'T159 defaults to full without a complete seven-dimension equivalence proof.',
        placement.problemId,
      );
    }
    if (
      placement.analysisEvidenceRefs.some(
        (reference) => reference.problemId !== placement.problemId,
      )
    ) {
      add(
        'PLACEMENT_EVIDENCE_OWNER_MISMATCH',
        'Placement evidence must be owned by the placed Problem.',
        placement.problemId,
      );
    }
    const expectedAdHoc = sortedUnique(
      record?.problemSpecificInsights.map(({ insight, reusablePerspective }) =>
        adHocProjectionText({ text: insight, reusablePerspective }),
      ) ?? [],
    );
    if (!sameOrderedValues(expectedAdHoc, sortedUnique(placement.adHocElements))) {
      add(
        'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE',
        'Every problem-specific insight must remain visible as an ad-hoc element.',
        placement.problemId,
      );
    }
    const expectedDispositionPaths = sortedUnique([
      ...(record?.typicalTechniques.map((_, index) => `/typicalTechniques/${String(index)}`) ?? []),
      ...(record?.prerequisiteCandidates.map(
        (_, index) => `/prerequisiteCandidates/${String(index)}`,
      ) ?? []),
    ]);
    const dispositionPaths = sortedUnique(
      placement.claimDispositions.map(({ claimRef }) => claimRef.claimPath),
    );
    if (!sameOrderedValues(expectedDispositionPaths, dispositionPaths)) {
      add(
        'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE',
        'Every typical Technique and prerequisite claim requires an explicit disposition.',
        placement.problemId,
      );
    }
    const assignedTagIds = new Set([...placement.primaryTagIds, ...placement.supportingTagIds]);
    if (
      placement.claimDispositions.some(
        ({ claimRef, kind, tagIds }) =>
          claimRef.problemId !== placement.problemId ||
          tagIds.some((tagId) => !assignedTagIds.has(tagId)) ||
          (kind === 'primary' &&
            tagIds.some((tagId) => !placement.primaryTagIds.includes(tagId))) ||
          (kind === 'supporting' &&
            tagIds.some((tagId) => !placement.supportingTagIds.includes(tagId))),
      )
    ) {
      add(
        'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INVALID',
        'Claim dispositions must be owned by the Problem and use its declared primary/supporting Tags.',
        placement.problemId,
      );
    }
    const evidenceRefKeys = new Set(
      placement.analysisEvidenceRefs.map(
        ({ problemId, claimPath }) => `${problemId}\u0000${claimPath}`,
      ),
    );
    if (
      placement.claimDispositions.some(
        ({ claimRef }) => !evidenceRefKeys.has(`${claimRef.problemId}\u0000${claimRef.claimPath}`),
      )
    ) {
      add(
        'PLACEMENT_INVENTORY_CLAIM_EVIDENCE_INCOMPLETE',
        'Every claim disposition must remain in the placement evidence closure.',
        placement.problemId,
      );
    }
    const presentationIndex = standardOrderIndex.get(placement.presentationUnitId);
    if (
      presentationIndex === undefined ||
      placement.learningUnitIds.some(
        (unitId) =>
          (standardOrderIndex.get(unitId) ?? Number.POSITIVE_INFINITY) > presentationIndex,
      )
    ) {
      add(
        'PLACEMENT_PRESENTED_BEFORE_PREREQUISITE_UNIT',
        'The presentation Unit must follow every primary and supporting Unit used by the Problem.',
        placement.problemId,
      );
    }
  }
  const tagCandidates = build.finalCandidates.filter(
    (candidate): candidate is Extract<FinalTaxonomyCandidate, { kind: 'tag' }> =>
      candidate.kind === 'tag',
  );
  const outcomeCandidates = build.finalCandidates.filter(
    (candidate): candidate is Extract<FinalTaxonomyCandidate, { kind: 'outcome' }> =>
      candidate.kind === 'outcome',
  );
  const unitCandidates = build.finalCandidates.filter(
    (candidate): candidate is Extract<FinalTaxonomyCandidate, { kind: 'unit' }> =>
      candidate.kind === 'unit',
  );
  const candidateById = new Map(
    build.finalCandidates.map((candidate) => [candidate.entity.id, candidate]),
  );
  const rootTagIds = new Set(
    tagCandidates.filter(({ entity }) => entity.parentId === null).map(({ entity }) => entity.id),
  );
  const nonPrimaryTagIds = new Set([...(gates.nonPrimaryTagIds ?? []), ...rootTagIds]);
  const genericOutcomeIds = new Set(gates.nonPrimaryOutcomeIds ?? []);
  const tagById = new Map(tagCandidates.map(({ entity }) => [entity.id, entity]));
  const outcomeById = new Map(outcomeCandidates.map(({ entity }) => [entity.id, entity]));
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
  const placementUsesCandidate = (
    placement: (typeof build.placements)[number],
    kind: 'tag' | 'outcome' | 'unit',
    targetId: string,
  ): boolean => {
    if (kind === 'tag') {
      const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
      return (
        assignedTagIds.includes(targetId) ||
        (nonPrimaryTagIds.has(targetId) &&
          assignedTagIds.some((tagId) => tagHasAncestor(tagId, targetId)))
      );
    }
    if (kind === 'outcome') {
      if ([placement.primaryOutcomeId, ...placement.supportingOutcomeIds].includes(targetId)) {
        return true;
      }
      const target = outcomeById.get(targetId);
      const assignedTagIds = [...placement.primaryTagIds, ...placement.supportingTagIds];
      return (
        genericOutcomeIds.has(targetId) &&
        target?.scopeIds.some(
          (scopeId) =>
            rootTagIds.has(scopeId) &&
            assignedTagIds.some((tagId) => tagHasAncestor(tagId, scopeId)),
        ) === true
      );
    }
    return placement.learningUnitIds.includes(targetId);
  };
  for (const placement of build.placements) {
    for (const tagId of placement.primaryTagIds) {
      if (nonPrimaryTagIds.has(tagId)) {
        add(
          'ROOT_OR_GENERIC_TAG_USED_AS_PRIMARY',
          `${tagId} cannot be a primary Tag.`,
          placement.problemId,
        );
      }
    }
    if (genericOutcomeIds.has(placement.primaryOutcomeId)) {
      add(
        'GENERIC_OUTCOME_USED_AS_PRIMARY',
        `${placement.primaryOutcomeId} cannot own a Problem shard.`,
        placement.problemId,
      );
    }
  }
  for (const { entity: tag } of tagCandidates) {
    const assignedProblems = build.placements.filter((placement) =>
      [...placement.primaryTagIds, ...placement.supportingTagIds].includes(tag.id),
    );
    if (tag.parentId !== null && assignedProblems.length < 2) {
      add(
        'TAG_REUSE_SUPPORT_INSUFFICIENT',
        `${tag.id} has fewer than two semantically classified Problems.`,
        tag.id,
      );
    }
    for (const problemId of tag.representativeProblemIds) {
      const placement = placementByProblemId.get(problemId);
      const usesTagAsPrimary =
        placement?.primaryTagIds.some(
          (tagId) => tagId === tag.id || (tag.parentId === null && tagHasAncestor(tagId, tag.id)),
        ) ?? false;
      if (!usesTagAsPrimary) {
        add(
          'TAG_REPRESENTATIVE_MISMATCH',
          `${problemId} does not use representative Tag ${tag.id} as its primary abstraction.`,
          tag.id,
        );
      }
    }
  }
  for (const { entity: outcome } of outcomeCandidates) {
    const supportingProblemCount = build.placements.filter((placement) =>
      placementUsesCandidate(placement, 'outcome', outcome.id),
    ).length;
    if (supportingProblemCount < 2) {
      add(
        'OUTCOME_REUSE_SUPPORT_INSUFFICIENT',
        `${outcome.id} has fewer than two semantically classified Problems.`,
        outcome.id,
      );
    }
  }
  for (const { entity: unit } of unitCandidates) {
    if (unit.kind !== 'chapter' && new Set(unit.problemIds).size < 2) {
      add(
        'LEARNING_UNIT_REUSE_SUPPORT_INSUFFICIENT',
        `${unit.id} has fewer than two Problems.`,
        unit.id,
      );
    }
  }
  const integrationByPreviewId = new Map(
    build.integrationMap.entries.map((entry) => [entry.previewEntityId, entry]),
  );
  for (const impact of build.correctionImpacts) {
    const allowedIndexEvidenceOwners = new Set(
      impact.integrationPreviewEntityIds.flatMap((previewEntityId) => {
        const entry = integrationByPreviewId.get(previewEntityId);
        if (!entry) return [];
        const representativeProblemIds =
          entry.action === 'split'
            ? entry.splitProblemAssignments.flatMap(
                ({ representativeProblemIds }) => representativeProblemIds,
              )
            : entry.action === 'promote' || entry.action === 'merge'
              ? entry.decisionEvidence.representativeProblemIds
              : [];
        return [...entry.affectedProblemIds, ...representativeProblemIds];
      }),
    );
    const surfaceSourceIds = sortedUnique(
      impact.surfaceAssessments.flatMap(({ evidenceRefs }) =>
        evidenceRefs.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
      ),
    );
    if (!sameOrderedValues(surfaceSourceIds, sortedUnique(impact.sourceRevisionIds))) {
      add(
        'CORRECTION_IMPACT_SOURCE_CLOSURE_MISMATCH',
        'Impact Source Revisions must equal its surface evidence closure.',
        impact.id,
      );
    }
    for (const assessment of impact.surfaceAssessments) {
      if (assessment.evidenceRefs.length === 0) {
        add(
          'CORRECTION_IMPACT_EVIDENCE_MISSING',
          'Every impact surface requires owner-relevant evidence.',
          impact.id,
        );
        continue;
      }
      if (
        assessment.ownerType === 'problem' &&
        assessment.evidenceRefs.some(({ problemId }) => problemId !== assessment.problemId)
      ) {
        add(
          'CORRECTION_IMPACT_PROBLEM_EVIDENCE_OWNER_MISMATCH',
          `${assessment.problemId}/${assessment.surface} contains unrelated evidence.`,
          impact.id,
        );
      } else if (assessment.ownerType === 'learning_unit_candidate') {
        const unit = candidateById.get(assessment.learningUnitId);
        if (
          unit?.kind !== 'unit' ||
          assessment.evidenceRefs.some(
            ({ problemId }) => !unit.entity.problemIds.includes(problemId),
          )
        ) {
          add(
            'CORRECTION_IMPACT_UNIT_EVIDENCE_OWNER_MISMATCH',
            `${assessment.learningUnitId}/${assessment.surface} contains unrelated evidence.`,
            impact.id,
          );
        }
      } else if (
        assessment.ownerType === 'derived_index' &&
        assessment.evidenceRefs.some(({ problemId }) => !allowedIndexEvidenceOwners.has(problemId))
      ) {
        add(
          'CORRECTION_IMPACT_INDEX_EVIDENCE_OWNER_MISMATCH',
          `${assessment.path} contains undeclared evidence owners.`,
          impact.id,
        );
      }
    }
  }
  for (const entry of build.integrationMap.entries) {
    const declaredRepresentatives =
      entry.action === 'promote' || entry.action === 'merge'
        ? entry.decisionEvidence.representativeProblemIds
        : entry.action === 'split'
          ? entry.splitProblemAssignments.flatMap(
              ({ representativeProblemIds }) => representativeProblemIds,
            )
          : [];
    const allowedEvidenceOwners = new Set([
      ...entry.affectedProblemIds,
      ...declaredRepresentatives,
    ]);
    const evidenceOwners = new Set(entry.evidenceRefs.map(({ problemId }) => problemId));
    const requiredEntryEvidenceOwners =
      entry.action === 'split'
        ? entry.affectedProblemIds
        : [...entry.affectedProblemIds, ...declaredRepresentatives];
    if (
      requiredEntryEvidenceOwners.some((problemId) => !evidenceOwners.has(problemId)) ||
      entry.evidenceRefs.some((reference) => !allowedEvidenceOwners.has(reference.problemId))
    ) {
      add(
        'INTEGRATION_EVIDENCE_OWNER_MISMATCH',
        `${entry.previewEntityId} evidence must cover every affected Problem and explicitly declare every cross-corpus representative.`,
        entry.previewEntityId,
      );
    }
    if (entry.action === 'split') {
      for (const assignment of entry.splitProblemAssignments) {
        const allowedAssignmentOwners = new Set([
          ...assignment.problemIds,
          ...assignment.representativeProblemIds,
        ]);
        const assignmentEvidenceOwners = new Set(
          assignment.evidenceRefs.map(({ problemId }) => problemId),
        );
        if (
          assignment.problemIds.some((problemId) => !assignmentEvidenceOwners.has(problemId)) ||
          assignment.representativeProblemIds.some(
            (problemId) => !assignmentEvidenceOwners.has(problemId),
          ) ||
          assignment.evidenceRefs.some(({ problemId }) => !allowedAssignmentOwners.has(problemId))
        ) {
          add(
            'INTEGRATION_SPLIT_EVIDENCE_OWNER_MISMATCH',
            `${entry.previewEntityId}/${assignment.finalEntityId} lacks exact owner-relevant evidence.`,
            entry.previewEntityId,
          );
        }
      }
    }
    if (entry.action === 'promote' || entry.action === 'merge' || entry.action === 'split') {
      const representativeAssignments =
        entry.action === 'promote' || entry.action === 'merge'
          ? entry.decisionEvidence.representativeProblemIds.map((problemId) => ({
              problemId,
              finalEntityId: entry.finalEntityIds[0],
            }))
          : entry.splitProblemAssignments.flatMap((assignment) =>
              assignment.representativeProblemIds.map((problemId) => ({
                problemId,
                finalEntityId: assignment.finalEntityId,
              })),
            );
      for (const { problemId, finalEntityId } of representativeAssignments) {
        const placement = placementByProblemId.get(problemId);
        if (
          finalEntityId === undefined ||
          placement === undefined ||
          !candidateById.has(finalEntityId) ||
          !placementUsesCandidate(placement, entry.previewEntityKind, finalEntityId)
        ) {
          add(
            'INTEGRATION_REPRESENTATIVE_MISMATCH',
            `${problemId} does not use ${finalEntityId ?? '<missing>'}.`,
            entry.previewEntityId,
          );
        }
      }
    }
    if (entry.action === 'promote' || entry.action === 'merge') {
      const targetId = entry.finalEntityIds[0];
      for (const problemId of entry.affectedProblemIds) {
        const placement = placementByProblemId.get(problemId);
        if (
          targetId === undefined ||
          placement === undefined ||
          !placementUsesCandidate(placement, entry.previewEntityKind, targetId)
        ) {
          add(
            'INTEGRATION_TARGET_NOT_PLACED',
            `${problemId} is not assigned to ${targetId ?? '<missing>'}.`,
            entry.previewEntityId,
          );
        }
      }
    }
  }
  const review = currentReviewResult(context, context.layout, build.taxonomySubjectDigest);
  const expectedStatus = review === null ? ('proposed' as const) : ('accepted' as const);
  const expectedTimestamp = review?.evidence.generatedAt ?? context.workManifest.createdAt;
  const expectedHoldReasons =
    review === null ? ['CURRENT_SUBJECT_THIRD_PARTY_REVIEW_MISSING_OR_STALE'] : [];
  if (
    build.status !== expectedStatus ||
    build.generatedAt !== expectedTimestamp ||
    build.acceptedAt !== (review?.evidence.generatedAt ?? null) ||
    build.canonicalMaterializationAllowed !== (review !== null) ||
    !sameOrderedValues(build.holdReasons, expectedHoldReasons) ||
    build.integrationMap.status !== expectedStatus ||
    build.integrationMap.entries.some(
      (entry) =>
        entry.status !== expectedStatus || entry.reviewEvidenceId !== (review?.evidence.id ?? null),
    ) ||
    build.correctionImpacts.some(
      ({ verificationStatus }) => verificationStatus !== (review === null ? 'pending' : 'reviewed'),
    )
  ) {
    add(
      'FINAL_TAXONOMY_REVIEW_STATE_STALE',
      'Build, integration, impact, timestamp, and hold state must match the sole current review.',
    );
  }
  if (
    build.status === 'accepted' &&
    (review === null ||
      build.reviewEvidenceRefs.length !== 1 ||
      canonicalJson(build.reviewEvidenceRefs[0]) !== canonicalJson(review.reference))
  ) {
    add(
      'CURRENT_SUBJECT_REVIEW_INVALID',
      'Accepted taxonomy requires the sole current, policy-selected review evidence.',
    );
  }
  return diagnostics.sort(
    (left, right) =>
      compareCodeUnits(left.code, right.code) ||
      compareCodeUnits(left.entityId ?? '', right.entityId ?? '') ||
      compareCodeUnits(left.message, right.message),
  );
};

export function assertFinalTaxonomyBuildAgainstContext(
  context: LoadedFinalTaxonomySourceContext,
  value: unknown,
  gates: FinalTaxonomySemanticGates = {},
): asserts value is FinalTaxonomyBuild {
  const diagnostics = validateFinalTaxonomyBuildAgainstContext(context, value, gates);
  if (diagnostics.length > 0) {
    throw new FinalTaxonomyBuildError(
      'FINAL_TAXONOMY_BUILD_INVALID',
      diagnostics.map(({ code, entityId }) => `${code}${entityId ? `:${entityId}` : ''}`).join(','),
    );
  }
}

export const FINAL_TAXONOMY_VERIFICATION_PATH = 'docs/verification/bootstrap/final-taxonomy.json';

export interface FinalTaxonomyVerificationEvidence {
  readonly schemaVersion: '1.0.0';
  readonly evidenceId: 'bootstrap-final-taxonomy';
  readonly taskId: 'T159';
  readonly generatedAt: string;
  readonly status: 'passed' | 'on_hold';
  readonly buildPath: string;
  readonly integrationMapPath: string;
  readonly reviewCheckResultsPath: string;
  readonly reviewEvidencePath: string;
  readonly taxonomySubjectDigest: string;
  readonly buildDigest: string;
  readonly integrationMapDigest: string;
  readonly taxonomyDigest: string;
  readonly tagDagDigest: string;
  readonly learningUnitDagDigest: string;
  readonly orderDigest: string;
  readonly placementDigest: string;
  readonly correctionImpactDigest: string;
  readonly problemCount: number;
  readonly sourceRevisionCount: number;
  readonly knownCorpusSourceRevisionCount: number;
  readonly candidateCounts: {
    readonly tags: number;
    readonly outcomes: number;
    readonly units: number;
  };
  readonly correctionImpactCount: number;
  readonly reviewEvidenceRefs: readonly ReviewEvidenceReference[];
  readonly canonicalMaterializationAllowed: boolean;
  readonly holdReasons: readonly string[];
  readonly diagnosticCodes: readonly string[];
  readonly evidenceDigest: string;
}

const finalCandidateCounts = (
  build: FinalTaxonomyBuild,
): FinalTaxonomyVerificationEvidence['candidateCounts'] => ({
  tags: build.finalCandidates.filter(({ kind }) => kind === 'tag').length,
  outcomes: build.finalCandidates.filter(({ kind }) => kind === 'outcome').length,
  units: build.finalCandidates.filter(({ kind }) => kind === 'unit').length,
});

/** Mutable current-state evidence; review artifacts bind taxonomySubjectDigest directly. */
export const createFinalTaxonomyVerificationEvidence = (
  context: LoadedFinalTaxonomySourceContext,
  build: FinalTaxonomyBuild,
): FinalTaxonomyVerificationEvidence => {
  const diagnostics = validateFinalTaxonomyBuildAgainstContext(context, build, {
    nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
    nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
  });
  const withoutDigest = {
    schemaVersion: '1.0.0' as const,
    evidenceId: 'bootstrap-final-taxonomy' as const,
    taskId: 'T159' as const,
    generatedAt: build.generatedAt,
    status:
      build.status === 'accepted' && diagnostics.length === 0
        ? ('passed' as const)
        : ('on_hold' as const),
    buildPath: context.layout.outputPath,
    integrationMapPath: context.layout.provisionalIntegrationPath,
    reviewCheckResultsPath: context.layout.reviewCheckResultsPath,
    reviewEvidencePath: context.layout.reviewEvidencePath,
    taxonomySubjectDigest: build.taxonomySubjectDigest,
    buildDigest: build.buildDigest,
    integrationMapDigest: build.integrationMapDigest,
    taxonomyDigest: build.taxonomyDigest,
    tagDagDigest: build.tagDagDigest,
    learningUnitDagDigest: build.learningUnitDagDigest,
    orderDigest: build.orderDigest,
    placementDigest: build.placementDigest,
    correctionImpactDigest: build.correctionImpactDigest,
    problemCount: build.placements.length,
    sourceRevisionCount: build.sourceRevisionIds.length,
    knownCorpusSourceRevisionCount: context.knownSourceRevisionIds.length,
    candidateCounts: finalCandidateCounts(build),
    correctionImpactCount: build.correctionImpacts.length,
    reviewEvidenceRefs: build.reviewEvidenceRefs,
    canonicalMaterializationAllowed: build.canonicalMaterializationAllowed,
    holdReasons: build.holdReasons,
    diagnosticCodes: diagnostics.map(({ code }) => code),
  };
  return {
    ...withoutDigest,
    evidenceDigest: canonicalDigest(withoutDigest),
  };
};
