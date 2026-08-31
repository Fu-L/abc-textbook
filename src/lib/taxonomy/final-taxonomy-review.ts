import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { z } from 'zod';

import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import {
  FinalTaxonomyBuildSchema,
  OffsetDateTimeSchema,
  TaxonomyIntegrationMapSchema,
} from '../domain/schema-parts/catalog.js';
import {
  ContentWorkManifestSchema,
  HumanContentReviewEvidenceSchema,
} from '../domain/schema-parts/review-evidence.js';
import { validateContentWorkManifest } from '../validation/content-work-manifest.js';
import {
  validateHumanContentReview,
  type TrustedReviewCheckInventory,
} from '../validation/human-content-review.js';

export const FINAL_TAXONOMY_PROBLEM_COUNT = 868;
export const FINAL_TAXONOMY_REVIEW_CHECKS = Object.freeze([
  {
    checkId: 'check-corpus-final-taxonomy',
    command:
      'npx vitest run tests/contract/final-taxonomy-build.test.ts tests/unit/final-taxonomy-policy.test.ts',
  },
  {
    checkId: 'check-current-final-taxonomy-output',
    command: 'npm run corpus:final-taxonomy',
  },
  {
    checkId: 'check-human-content-review',
    command: 'npx vitest run tests/unit/human-content-review.test.ts',
  },
  { checkId: 'check-schema-parity', command: 'npm run schema:check' },
  {
    checkId: 'check-taxonomy-integration',
    command: 'npx vitest run tests/contract/final-taxonomy-integration.test.ts',
  },
] as const);
export const FINAL_TAXONOMY_WORK_MANIFEST_PATH =
  'docs/work-manifests/initial/us2/final-taxonomy/manifest.json';
export const FINAL_TAXONOMY_PROPOSED_BUILD_PATH =
  'staging/taxonomy/initial/final-taxonomy-build.json';
export const FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH =
  'docs/verification/bootstrap/final-taxonomy-check-results.json';
export const FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH =
  'docs/reviews/human-content/bootstrap/us2/final-taxonomy-review.json';
export const FINAL_TAXONOMY_REVIEW_EVIDENCE_ID =
  'human-content-review-bootstrap-us2-final-taxonomy';

export const FINAL_TAXONOMY_INTEGRATION_PATH =
  'docs/verification/previews/initial-v1/taxonomy-integration.json';
const FINAL_TAXONOMY_REVIEW_UNIT_ID = 'RU-T159-final-taxonomy';
const FINAL_TAXONOMY_REVIEW_ITEM_ID = 'human-review-item-ru-t159-final-taxonomy';

type FinalTaxonomyBuild = z.infer<typeof FinalTaxonomyBuildSchema>;
type TaxonomyIntegrationMap = z.infer<typeof TaxonomyIntegrationMapSchema>;
type ContentWorkManifest = z.infer<typeof ContentWorkManifestSchema>;
type HumanContentReviewEvidence = z.infer<typeof HumanContentReviewEvidenceSchema>;
type ReviewCheck = (typeof FINAL_TAXONOMY_REVIEW_CHECKS)[number];

export class FinalTaxonomyReviewError extends Error {
  readonly code: string;
  readonly artifactPath: string | null;

  constructor(code: string, message: string, artifactPath: string | null = null) {
    super(`${code}: ${message}`);
    this.code = code;
    this.artifactPath = artifactPath;
    this.name = 'FinalTaxonomyReviewError';
  }
}

export interface FinalTaxonomyReviewCheckResult {
  readonly checkId: string;
  readonly command: string;
  readonly completedAt: string;
  readonly exitCode: 0;
  readonly passed: true;
  readonly stdoutDigest: string;
  readonly stderrDigest: string;
}

export interface FinalTaxonomyReviewCheckResults {
  readonly schemaVersion: '1.0.0';
  readonly taskId: 'T159';
  readonly taxonomySubjectDigest: string;
  readonly reviewerId: string;
  readonly results: readonly FinalTaxonomyReviewCheckResult[];
}

export interface FinalTaxonomyCheckExecution {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export type FinalTaxonomyCheckRunner = (
  check: ReviewCheck,
  repositoryRoot: string,
) => Promise<FinalTaxonomyCheckExecution>;

export type FinalTaxonomyGeneratedSubjectLoader = (repositoryRoot: string) => Promise<string>;

export interface FinalTaxonomyReviewResult {
  readonly evidence: HumanContentReviewEvidence;
  readonly evidencePath: typeof FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH;
  readonly checkResultsPath: typeof FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH;
  readonly written: boolean;
}

const sha256Pattern = /^[a-f0-9]{64}$/u;
const personIdPattern = /^person-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const sha256Bytes = (value: string): string =>
  createHash('sha256').update(value, 'utf8').digest('hex');
const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;
const sortedUnique = (values: readonly string[]): string[] =>
  [...new Set(values)].sort(compareCodeUnits);
const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedRight = [...right].sort(compareCodeUnits);
  return (
    left.length === right.length &&
    [...left].sort(compareCodeUnits).every((value, index) => value === sortedRight[index])
  );
};
const isPlainObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const resolveRepositoryPath = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<string> => {
  if (relativePath.length === 0 || path.isAbsolute(relativePath)) {
    throw new FinalTaxonomyReviewError('FINAL_TAXONOMY_REVIEW_PATH_INVALID', relativePath);
  }
  const resolvedRoot = await realpath(repositoryRoot);
  const absolutePath = path.resolve(resolvedRoot, relativePath);
  const relative = path.relative(resolvedRoot, absolutePath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new FinalTaxonomyReviewError('FINAL_TAXONOMY_REVIEW_PATH_ESCAPE', relativePath);
  }
  return absolutePath;
};

const readRepositoryJson = async (
  repositoryRoot: string,
  relativePath: string,
  optional = false,
): Promise<unknown> => {
  const absolutePath = await resolveRepositoryPath(repositoryRoot, relativePath);
  try {
    return JSON.parse(await readFile(absolutePath, 'utf8')) as unknown;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT' && optional)
      return null;
    if (error instanceof SyntaxError) {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_JSON_INVALID',
        error.message,
        relativePath,
      );
    }
    throw error;
  }
};

const writeRepositoryJson = async (
  repositoryRoot: string,
  relativePath: string,
  value: unknown,
  noOverwrite = false,
): Promise<void> => {
  const absolutePath = await resolveRepositoryPath(repositoryRoot, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  try {
    await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: 'utf8',
      flag: noOverwrite ? 'wx' : 'w',
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_OUTPUT_EXISTS',
        relativePath,
        relativePath,
      );
    }
    throw error;
  }
};

const parseProposedBuild = (value: unknown): FinalTaxonomyBuild => {
  const parsed = FinalTaxonomyBuildSchema.safeParse(value);
  if (!parsed.success) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_PROPOSAL_SCHEMA_INVALID',
      parsed.error.message,
      FINAL_TAXONOMY_PROPOSED_BUILD_PATH,
    );
  }
  if (
    parsed.data.status !== 'proposed' ||
    parsed.data.acceptedAt !== null ||
    parsed.data.canonicalMaterializationAllowed ||
    parsed.data.reviewEvidenceRefs.length !== 0
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_REQUIRES_PROPOSAL',
      'Human review must bind the pre-review proposal.',
      FINAL_TAXONOMY_PROPOSED_BUILD_PATH,
    );
  }
  return parsed.data;
};

const parseWorkManifest = (value: unknown): ContentWorkManifest => {
  const parsed = ContentWorkManifestSchema.safeParse(value);
  if (!parsed.success) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_WORK_MANIFEST_SCHEMA_INVALID',
      parsed.error.message,
      FINAL_TAXONOMY_WORK_MANIFEST_PATH,
    );
  }
  try {
    validateContentWorkManifest(parsed.data);
  } catch (error) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_WORK_MANIFEST_INVALID',
      error instanceof Error ? error.message : String(error),
      FINAL_TAXONOMY_WORK_MANIFEST_PATH,
    );
  }
  return parsed.data;
};

const parseIntegrationMap = (value: unknown): TaxonomyIntegrationMap => {
  const parsed = TaxonomyIntegrationMapSchema.safeParse(value);
  if (!parsed.success) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_INTEGRATION_SCHEMA_INVALID',
      parsed.error.message,
      FINAL_TAXONOMY_INTEGRATION_PATH,
    );
  }
  return parsed.data;
};

const assertManifestAndProposalCoverage = (
  manifest: ContentWorkManifest,
  build: FinalTaxonomyBuild,
): void => {
  const reviewUnit = manifest.reviewUnits[0];
  const outcomeIds = build.finalCandidates
    .flatMap((candidate) => (candidate.kind === 'outcome' ? [candidate.entity.id] : []))
    .sort(compareCodeUnits);
  const expectedCheckIds = FINAL_TAXONOMY_REVIEW_CHECKS.map(({ checkId }) => checkId);
  if (
    manifest.taskId !== 'T159' ||
    manifest.manifestId !== 'work-manifest-T159-final-taxonomy' ||
    !manifest.reviewPolicy.riskReasons.includes('major_classification_change') ||
    manifest.reviewUnits.length !== 1 ||
    reviewUnit?.reviewUnitId !== FINAL_TAXONOMY_REVIEW_UNIT_ID ||
    reviewUnit.owner.length === 0 ||
    !reviewUnit.evidenceRoles.includes('final_taxonomy_review') ||
    !sameStringSet(reviewUnit.paths, [
      FINAL_TAXONOMY_INTEGRATION_PATH,
      FINAL_TAXONOMY_PROPOSED_BUILD_PATH,
    ]) ||
    !sameStringSet(reviewUnit.checkIds, expectedCheckIds) ||
    !sameStringSet(reviewUnit.learningOutcomeIds, manifest.learningOutcomeIds) ||
    !sameStringSet(outcomeIds, manifest.learningOutcomeIds) ||
    build.placements.length !== FINAL_TAXONOMY_PROBLEM_COUNT ||
    build.policy.workManifestPath !== FINAL_TAXONOMY_WORK_MANIFEST_PATH ||
    build.policy.workManifestDigest !== manifest.digest ||
    build.policy.requiredReviewMode !== manifest.reviewPolicy.requiredMode ||
    build.policy.highRiskSelfReviewReason !== manifest.reviewPolicy.highRiskSelfReviewReason ||
    build.inputs.integrationMapPath !== FINAL_TAXONOMY_INTEGRATION_PATH
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_SCOPE_INVALID',
      'The proposal does not match the fixed T159 manifest and 868-Problem scope.',
    );
  }
};

const loadFixedContext = async (
  repositoryRoot: string,
): Promise<{
  readonly build: FinalTaxonomyBuild;
  readonly manifest: ContentWorkManifest;
}> => {
  const [buildValue, integrationValue, manifestValue] = await Promise.all([
    readRepositoryJson(repositoryRoot, FINAL_TAXONOMY_PROPOSED_BUILD_PATH),
    readRepositoryJson(repositoryRoot, FINAL_TAXONOMY_INTEGRATION_PATH),
    readRepositoryJson(repositoryRoot, FINAL_TAXONOMY_WORK_MANIFEST_PATH),
  ]);
  const build = parseProposedBuild(buildValue);
  const integrationMap = parseIntegrationMap(integrationValue);
  const manifest = parseWorkManifest(manifestValue);
  assertManifestAndProposalCoverage(manifest, build);
  if (canonicalJson(integrationMap) !== canonicalJson(build.integrationMap)) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_INTEGRATION_MISMATCH',
      'The saved integration map is not the integration map embedded in the proposal.',
      FINAL_TAXONOMY_INTEGRATION_PATH,
    );
  }
  return { build, manifest };
};

export const resolveFinalTaxonomyReviewCheckInvocation = (
  check: ReviewCheck,
): { readonly executable: string; readonly args: readonly string[] } => {
  switch (check.checkId) {
    case 'check-corpus-final-taxonomy':
      return {
        executable: 'npx',
        args: [
          'vitest',
          'run',
          'tests/contract/final-taxonomy-build.test.ts',
          'tests/unit/final-taxonomy-policy.test.ts',
        ],
      };
    case 'check-current-final-taxonomy-output':
      return { executable: 'npm', args: ['run', 'corpus:final-taxonomy'] };
    case 'check-taxonomy-integration':
      return {
        executable: 'npx',
        args: ['vitest', 'run', 'tests/contract/final-taxonomy-integration.test.ts'],
      };
    case 'check-human-content-review':
      return {
        executable: 'npx',
        args: ['vitest', 'run', 'tests/unit/human-content-review.test.ts'],
      };
    case 'check-schema-parity':
      return { executable: 'npm', args: ['run', 'schema:check'] };
  }
};

export const runFinalTaxonomyReviewCheck: FinalTaxonomyCheckRunner = async (
  check,
  repositoryRoot,
) => {
  const invocation = resolveFinalTaxonomyReviewCheckInvocation(check);
  return await new Promise<FinalTaxonomyCheckExecution>((resolve, reject) => {
    const child = spawn(invocation.executable, invocation.args, {
      cwd: repositoryRoot,
      env: process.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
};

const createCheckResult = (input: {
  readonly check: ReviewCheck;
  readonly completedAt: string;
  readonly execution: FinalTaxonomyCheckExecution;
}): FinalTaxonomyReviewCheckResult => {
  if (input.execution.exitCode !== 0) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_CHECK_FAILED',
      `${input.check.checkId} exited with ${String(input.execution.exitCode)}.`,
    );
  }
  return {
    checkId: input.check.checkId,
    command: input.check.command,
    completedAt: input.completedAt,
    exitCode: 0,
    passed: true,
    stdoutDigest: sha256Bytes(input.execution.stdout),
    stderrDigest: sha256Bytes(input.execution.stderr),
  };
};

export const validateFinalTaxonomyReviewCheckResults = (
  value: unknown,
  input: {
    readonly taxonomySubjectDigest: string;
    readonly reviewerId: string;
    readonly artifactPath?: string;
  },
): FinalTaxonomyReviewCheckResults => {
  const artifactPath = input.artifactPath ?? FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH;
  if (!isPlainObject(value) || !Array.isArray(value.results)) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_INVALID',
      'Expected one aggregate check-results object.',
      artifactPath,
    );
  }
  const resultById = new Map<string, Readonly<Record<string, unknown>>>();
  for (const candidate of value.results) {
    if (!isPlainObject(candidate) || typeof candidate.checkId !== 'string') {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_INVALID',
        'Each aggregate result must identify one check.',
        artifactPath,
      );
    }
    resultById.set(candidate.checkId, candidate);
  }
  if (
    value.schemaVersion !== '1.0.0' ||
    value.taskId !== 'T159' ||
    value.taxonomySubjectDigest !== input.taxonomySubjectDigest ||
    value.reviewerId !== input.reviewerId ||
    value.results.length !== FINAL_TAXONOMY_REVIEW_CHECKS.length ||
    resultById.size !== FINAL_TAXONOMY_REVIEW_CHECKS.length
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_STALE',
      'Aggregate check results do not match the current subject and reviewer.',
      artifactPath,
    );
  }
  for (const check of FINAL_TAXONOMY_REVIEW_CHECKS) {
    const result = resultById.get(check.checkId);
    if (
      result?.command !== check.command ||
      result.exitCode !== 0 ||
      result.passed !== true ||
      !OffsetDateTimeSchema.safeParse(result.completedAt).success ||
      typeof result.stdoutDigest !== 'string' ||
      !sha256Pattern.test(result.stdoutDigest) ||
      typeof result.stderrDigest !== 'string' ||
      !sha256Pattern.test(result.stderrDigest)
    ) {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_STALE',
        check.checkId,
        artifactPath,
      );
    }
  }
  return value as unknown as FinalTaxonomyReviewCheckResults;
};

const createTrustedReviewInventory = (
  manifest: ContentWorkManifest,
  subjectDigest: string,
): TrustedReviewCheckInventory => ({
  subjectDigest,
  inventoryDigest: manifest.digest,
  reviewPolicy: manifest.reviewPolicy,
  workManifest: {
    learningOutcomeIds: manifest.learningOutcomeIds,
    reviewUnits: manifest.reviewUnits.map((unit) => ({
      reviewUnitId: unit.reviewUnitId,
      subjectPaths: unit.paths,
      learningOutcomeIds: unit.learningOutcomeIds,
      owner: unit.owner,
    })),
  },
  applicableChecks: FINAL_TAXONOMY_REVIEW_CHECKS.map(({ checkId, command }) => ({
    checkId,
    command,
  })),
  reviewItems: manifest.reviewUnits.map((unit) => ({
    reviewItemId: `human-review-item-${unit.reviewUnitId.toLowerCase()}`,
    reviewUnitId: unit.reviewUnitId,
    kind: 'outcome_coverage' as const,
    subjectPaths: unit.paths,
    authorIds: [unit.owner],
    learningOutcomeIds: unit.learningOutcomeIds,
  })),
});

const createHumanReviewEvidence = (input: {
  readonly build: FinalTaxonomyBuild;
  readonly manifest: ContentWorkManifest;
  readonly reviewerId: string;
  readonly reviewBasis: string;
  readonly reviewedAt: string;
  readonly checkResults: FinalTaxonomyReviewCheckResults;
}): HumanContentReviewEvidence => {
  const reviewMode = input.manifest.reviewPolicy.requiredMode;
  const reviewItems = input.manifest.reviewUnits.map((unit) => ({
    reviewItemId: `human-review-item-${unit.reviewUnitId.toLowerCase()}`,
    kind: 'outcome_coverage' as const,
    subjectPaths: [...unit.paths].sort(compareCodeUnits),
    authorIds: [unit.owner],
    learningOutcomeIds: [...unit.learningOutcomeIds].sort(compareCodeUnits),
    reviewerId: input.reviewerId,
    reviewBasis: input.reviewBasis,
    decision: 'approved' as const,
    findings: [],
    reviewedAt: input.reviewedAt,
  }));
  if (reviewItems.length !== 1 || reviewItems[0]?.reviewItemId !== FINAL_TAXONOMY_REVIEW_ITEM_ID) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_ITEM_INVALID',
      'The fixed T159 review item changed.',
    );
  }
  const aggregateDigest = canonicalDigest(input.checkResults);
  const resultById = new Map(input.checkResults.results.map((result) => [result.checkId, result]));
  const applicableChecks = FINAL_TAXONOMY_REVIEW_CHECKS.map((check) => {
    const result = resultById.get(check.checkId);
    if (result === undefined) {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_STALE',
        check.checkId,
      );
    }
    return {
      checkId: check.checkId,
      command: check.command,
      subjectDigest: input.build.taxonomySubjectDigest,
      resultPath: FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
      resultDigest: aggregateDigest,
      exitCode: 0,
      passed: true,
      completedAt: result.completedAt,
      executedByReviewerId: input.reviewerId,
    };
  });
  const authors = sortedUnique(input.manifest.reviewUnits.map(({ owner }) => owner)).map(
    (personId) => ({
      personId,
      authoredItemIds: reviewItems
        .filter((item) => item.authorIds.includes(personId))
        .map(({ reviewItemId }) => reviewItemId),
    }),
  );
  const withoutDigest = {
    schemaVersion: '3.0.0' as const,
    id: FINAL_TAXONOMY_REVIEW_EVIDENCE_ID,
    scopeType: 'merge' as const,
    scopeId: 'bootstrap-us2-final-taxonomy',
    releaseVersion: null,
    subjectDigest: input.build.taxonomySubjectDigest,
    inventoryPath: FINAL_TAXONOMY_WORK_MANIFEST_PATH,
    inventoryDigest: input.manifest.digest,
    reviewPolicy: input.manifest.reviewPolicy,
    reviewMode,
    applicableChecks,
    applicableCheckCount: applicableChecks.length,
    passedApplicableCheckCount: applicableChecks.length,
    reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
    authors,
    reviewer: { personId: input.reviewerId, mode: reviewMode },
    reviewItems,
    inventoryItemCount: reviewItems.length,
    reviewedItemCount: reviewItems.length,
    approvedItemCount: reviewItems.length,
    changesRequestedItemCount: 0,
    unreviewedItemCount: 0,
    outcomeCoverageReview: {
      reviewerId: input.reviewerId,
      authorIds: authors.map(({ personId }) => personId),
      decision: 'confirmed' as const,
      learningOutcomeIds: [...input.manifest.learningOutcomeIds].sort(compareCodeUnits),
      subjectPaths: sortedUnique(input.manifest.reviewUnits.flatMap(({ paths }) => paths)),
      rationale: input.reviewBasis,
      noOutcomeImpactRationale: null,
      confirmedAt: input.reviewedAt,
    },
    outcomeCoverageConfirmed: true,
    aggregatePassed: true,
    generatedAt: input.reviewedAt,
  };
  const evidence = HumanContentReviewEvidenceSchema.parse({
    ...withoutDigest,
    evidenceDigest: canonicalDigest(withoutDigest),
  });
  validateHumanContentReview(
    evidence,
    createTrustedReviewInventory(input.manifest, input.build.taxonomySubjectDigest),
  );
  return evidence;
};

const validateExistingEvidence = async (input: {
  readonly repositoryRoot: string;
  readonly value: unknown;
  readonly build: FinalTaxonomyBuild;
  readonly manifest: ContentWorkManifest;
  readonly reviewerId: string;
  readonly reviewBasis: string;
}): Promise<HumanContentReviewEvidence> => {
  const parsed = HumanContentReviewEvidenceSchema.safeParse(input.value);
  if (!parsed.success) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_EVIDENCE_INVALID',
      parsed.error.message,
      FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
    );
  }
  const evidence = parsed.data;
  validateHumanContentReview(
    evidence,
    createTrustedReviewInventory(input.manifest, input.build.taxonomySubjectDigest),
  );
  const aggregate = validateFinalTaxonomyReviewCheckResults(
    await readRepositoryJson(input.repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH),
    {
      taxonomySubjectDigest: input.build.taxonomySubjectDigest,
      reviewerId: input.reviewerId,
    },
  );
  const aggregateDigest = canonicalDigest(aggregate);
  if (
    evidence.reviewer.personId !== input.reviewerId ||
    evidence.reviewMode !== input.manifest.reviewPolicy.requiredMode ||
    evidence.reviewItems.some(({ reviewBasis }) => reviewBasis !== input.reviewBasis) ||
    evidence.applicableChecks.some(
      ({ resultPath, resultDigest }) =>
        resultPath !== FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH || resultDigest !== aggregateDigest,
    )
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_EVIDENCE_CONFLICT',
      'Existing evidence cannot be replaced by a different reviewer, basis, subject, or result.',
      FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
    );
  }
  return evidence;
};

export const loadCurrentGeneratedFinalTaxonomySubjectDigest: FinalTaxonomyGeneratedSubjectLoader =
  async (repositoryRoot) => {
    const {
      buildFinalTaxonomyFromPolicy,
      defaultFinalTaxonomyBuildLayout,
      loadFinalTaxonomySourceContext,
    } = await import('./final-taxonomy-build.js');
    const context = await loadFinalTaxonomySourceContext(
      defaultFinalTaxonomyBuildLayout(repositoryRoot),
    );
    return buildFinalTaxonomyFromPolicy(context).taxonomySubjectDigest;
  };

const assertCurrentGeneratedSubjectMatchesProposal = async (input: {
  readonly repositoryRoot: string;
  readonly proposal: FinalTaxonomyBuild;
  readonly loadGeneratedSubject: FinalTaxonomyGeneratedSubjectLoader;
}): Promise<void> => {
  const generatedSubjectDigest = await input.loadGeneratedSubject(input.repositoryRoot);
  if (generatedSubjectDigest !== input.proposal.taxonomySubjectDigest) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_GENERATED_SUBJECT_MISMATCH',
      'The saved proposal is not the subject generated by the current taxonomy sources.',
      FINAL_TAXONOMY_PROPOSED_BUILD_PATH,
    );
  }
};

export const reviewFinalTaxonomy = async (input: {
  readonly reviewerId: string;
  readonly approve: boolean;
  readonly reviewBasis: string;
  readonly repositoryRoot?: string;
  readonly runCheck?: FinalTaxonomyCheckRunner;
  readonly loadGeneratedSubject?: FinalTaxonomyGeneratedSubjectLoader;
  readonly now?: () => string;
}): Promise<FinalTaxonomyReviewResult> => {
  if (!input.approve) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_EXPLICIT_APPROVAL_REQUIRED',
      'Pass --approve only after completing the human review.',
    );
  }
  if (!personIdPattern.test(input.reviewerId)) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEWER_ID_INVALID',
      'A human person-* reviewer ID is required.',
    );
  }
  const reviewBasis = input.reviewBasis.trim();
  if (reviewBasis.length === 0) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_BASIS_REQUIRED',
      'A nonempty human review basis is required.',
    );
  }
  const repositoryRoot = await realpath(input.repositoryRoot ?? process.cwd());
  const initial = await loadFixedContext(repositoryRoot);
  const authorIds = sortedUnique(initial.manifest.reviewUnits.map(({ owner }) => owner));
  const reviewerIdentityIsInvalid =
    initial.manifest.reviewPolicy.requiredMode === 'self'
      ? !authorIds.includes(input.reviewerId)
      : authorIds.includes(input.reviewerId);
  if (reviewerIdentityIsInvalid) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEWER_IDENTITY_INVALID',
      'Self review requires a manifest owner; third-party review requires another person.',
    );
  }
  const loadGeneratedSubject =
    input.loadGeneratedSubject ?? loadCurrentGeneratedFinalTaxonomySubjectDigest;
  await assertCurrentGeneratedSubjectMatchesProposal({
    repositoryRoot,
    proposal: initial.build,
    loadGeneratedSubject,
  });

  const existingEvidence = await readRepositoryJson(
    repositoryRoot,
    FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
    true,
  );
  if (existingEvidence !== null) {
    const evidence = await validateExistingEvidence({
      repositoryRoot,
      value: existingEvidence,
      build: initial.build,
      manifest: initial.manifest,
      reviewerId: input.reviewerId,
      reviewBasis,
    });
    return {
      evidence,
      evidencePath: FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
      checkResultsPath: FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
      written: false,
    };
  }

  const runCheck = input.runCheck ?? runFinalTaxonomyReviewCheck;
  const now = input.now ?? (() => new Date().toISOString());
  const results: FinalTaxonomyReviewCheckResult[] = [];
  for (const check of FINAL_TAXONOMY_REVIEW_CHECKS) {
    const execution = await runCheck(check, repositoryRoot);
    const completedAt = now();
    if (!OffsetDateTimeSchema.safeParse(completedAt).success) {
      throw new FinalTaxonomyReviewError('FINAL_TAXONOMY_REVIEW_TIME_INVALID', completedAt);
    }
    results.push(createCheckResult({ check, completedAt, execution }));
  }

  const current = await loadFixedContext(repositoryRoot);
  if (
    current.build.taxonomySubjectDigest !== initial.build.taxonomySubjectDigest ||
    current.manifest.digest !== initial.manifest.digest
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_SUBJECT_CHANGED',
      'The proposed taxonomy subject or work manifest changed during review.',
    );
  }
  await assertCurrentGeneratedSubjectMatchesProposal({
    repositoryRoot,
    proposal: current.build,
    loadGeneratedSubject,
  });
  const checkResults = validateFinalTaxonomyReviewCheckResults(
    {
      schemaVersion: '1.0.0',
      taskId: 'T159',
      taxonomySubjectDigest: current.build.taxonomySubjectDigest,
      reviewerId: input.reviewerId,
      results,
    },
    {
      taxonomySubjectDigest: current.build.taxonomySubjectDigest,
      reviewerId: input.reviewerId,
    },
  );
  const reviewedAt = now();
  if (!OffsetDateTimeSchema.safeParse(reviewedAt).success) {
    throw new FinalTaxonomyReviewError('FINAL_TAXONOMY_REVIEW_TIME_INVALID', reviewedAt);
  }
  const evidence = createHumanReviewEvidence({
    build: current.build,
    manifest: current.manifest,
    reviewerId: input.reviewerId,
    reviewBasis,
    reviewedAt,
    checkResults,
  });
  await writeRepositoryJson(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH, checkResults);
  await writeRepositoryJson(repositoryRoot, FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH, evidence, true);
  return {
    evidence,
    evidencePath: FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
    checkResultsPath: FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
    written: true,
  };
};

export const readFinalTaxonomyReviewBasisFile = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<string> => {
  const absolutePath = await resolveRepositoryPath(repositoryRoot, relativePath);
  const value = (await readFile(absolutePath, 'utf8')).trim();
  if (value.length === 0) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_BASIS_REQUIRED',
      'The review basis file is empty.',
      relativePath,
    );
  }
  return value;
};
