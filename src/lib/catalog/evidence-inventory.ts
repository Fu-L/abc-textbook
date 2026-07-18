import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { z } from 'zod';

import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { strictObject } from '../domain/contract-schema.js';
import {
  EntityIdSchema,
  OffsetDateTimeSchema,
  ProblemIdSchema,
  SafePathSchema,
  Sha256Schema,
} from '../domain/schema-parts/catalog.js';
import { HumanContentReviewEvidenceSchema as ReviewEvidenceSchema } from '../domain/schema-parts/review-evidence.js';
import { ContentWorkManifestSchema } from '../domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema, ReleaseCandidateSchema } from '../domain/schema-parts/release.js';
import {
  calculateApprovableDigest,
  calculateCandidatePayloadDigest,
  calculateContentSubjectDigest,
  ReleaseTransitionError,
  validatePublicationUpdate,
  validateReleaseCandidate,
} from '../validation/release-state.js';
import {
  type ContentWorkManifestScope,
  validateContentWorkManifest,
  WorkManifestError,
} from '../validation/content-work-manifest.js';
import {
  HumanReviewError,
  type TrustedReviewCheckInventory,
  validateHumanContentReview,
} from '../validation/human-content-review.js';
import {
  CatalogPublicationBoundaryError,
  resolvePublicEvidencePath,
} from './publication-boundary.js';
import type { TrustedCatalogReleaseEvidenceInventory } from './build-catalog.js';

const text = z.string().trim().min(1);

export class CatalogEvidenceInventoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = 'CatalogEvidenceInventoryError';
    this.code = code;
  }
}

/** The small, versioned envelope written by each release check. */
export const CatalogReleaseCheckResultSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  checkId: EntityIdSchema,
  command: text,
  subjectDigest: Sha256Schema,
  exitCode: z.number().int(),
  passed: z.boolean(),
  completedAt: OffsetDateTimeSchema,
});

const CatalogCheckReferenceSchema = strictObject({
  checkId: EntityIdSchema,
  command: text,
  subjectDigest: Sha256Schema,
  resultPath: SafePathSchema,
  resultDigest: Sha256Schema,
  exitCode: z.number().int(),
  passed: z.boolean(),
  completedAt: OffsetDateTimeSchema,
});

const CatalogReviewReferenceSchema = strictObject({
  evidenceId: EntityIdSchema,
  path: SafePathSchema,
  digest: Sha256Schema,
  subjectDigest: Sha256Schema,
  authorIds: z.array(EntityIdSchema).min(1),
  reviewerIds: z.array(EntityIdSchema).min(1),
  aggregatePassed: z.boolean(),
});

export interface CatalogEvidenceCanonicalSources {
  readonly catalog: unknown;
  readonly workManifest: unknown;
  readonly releaseCandidate: unknown;
}

const execFileAsync = promisify(execFile);

export interface CatalogEvidenceTrustOptions {
  /** A protected commit captured before the content change began. */
  readonly baseCommit: string;
}

interface ContentFileInventoryEntry {
  readonly path: string;
  readonly sha256: string;
  readonly byteLength: number;
}

const runGit = async (
  args: readonly string[],
  repositoryRoot: string,
  encoding: 'utf8' | 'buffer' = 'utf8',
): Promise<string | Buffer> => {
  const result = await execFileAsync('git', [...args], {
    cwd: repositoryRoot,
    encoding,
  });
  return result.stdout;
};

const resolveTrustedBaseCommit = async (
  baseCommit: string | undefined,
  repositoryRoot: string,
): Promise<string> => {
  if (!baseCommit || !/^[0-9a-f]{40}$/iu.test(baseCommit)) {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_COMMIT_REQUIRED',
      'A full protected base commit different from HEAD is required.',
    );
  }
  let headCommit: string;
  let resolvedBaseCommit: string;
  try {
    headCommit = String(await runGit(['rev-parse', 'HEAD^{commit}'], repositoryRoot)).trim();
    resolvedBaseCommit = String(
      await runGit(['rev-parse', `${baseCommit}^{commit}`], repositoryRoot),
    ).trim();
    await runGit(['merge-base', '--is-ancestor', resolvedBaseCommit, 'HEAD'], repositoryRoot);
  } catch {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_COMMIT_INVALID',
      'The protected base commit must resolve and be an ancestor of HEAD.',
    );
  }
  if (resolvedBaseCommit !== baseCommit.toLowerCase() || resolvedBaseCommit === headCommit) {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_COMMIT_INVALID',
      'The protected base commit must be an immutable commit before HEAD, not HEAD itself.',
    );
  }
  return resolvedBaseCommit;
};

const listFiles = async (root: string): Promise<string[]> => {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(root, entry.name);
      return entry.isDirectory() ? listFiles(target) : entry.isFile() ? [target] : [];
    }),
  );
  return nested.flat().sort();
};

const readJsonFile = async (filePath: string, code: string): Promise<unknown> => {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as unknown;
  } catch {
    throw new CatalogEvidenceInventoryError(code, `Cannot read valid JSON from ${filePath}.`);
  }
};

const toManifestScope = (
  manifest: z.infer<typeof ContentWorkManifestSchema>,
): ContentWorkManifestScope => ({
  taskId: manifest.taskId,
  requiredRequirementIds: manifest.requiredRequirementIds,
  learningOutcomeIds: manifest.learningOutcomeIds,
  reviewUnits: manifest.reviewUnits,
});

const readCommittedManifestScope = async (
  manifestPath: string,
  repositoryRoot: string,
  baseCommit: string,
): Promise<ContentWorkManifestScope> => {
  const relativePath = path.relative(repositoryRoot, manifestPath).replaceAll(path.sep, '/');
  let stdout: string | Buffer;
  try {
    stdout = await runGit(['show', `${baseCommit}:${relativePath}`], repositoryRoot);
  } catch {
    throw new CatalogEvidenceInventoryError(
      'WORK_MANIFEST_NOT_VERSION_CONTROLLED',
      `${relativePath} must be committed before content changes are released.`,
    );
  }
  let committed: unknown;
  try {
    committed = JSON.parse(String(stdout)) as unknown;
  } catch {
    throw new CatalogEvidenceInventoryError(
      'WORK_MANIFEST_SCHEMA_INVALID',
      `${relativePath} is not valid JSON in the protected base commit.`,
    );
  }
  const parsed = ContentWorkManifestSchema.safeParse(committed);
  if (!parsed.success) {
    throw new CatalogEvidenceInventoryError('WORK_MANIFEST_SCHEMA_INVALID', parsed.error.message);
  }
  return toManifestScope(parsed.data);
};

const calculateBaseContentFileInventory = async (
  repositoryRoot: string,
  baseCommit: string,
): Promise<ContentFileInventoryEntry[]> => {
  let output: string | Buffer;
  try {
    output = await runGit(
      ['ls-tree', '-r', '--name-only', baseCommit, '--', 'src/content'],
      repositoryRoot,
    );
  } catch {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_CONTENT_UNREADABLE',
      'The protected base commit content tree could not be read.',
    );
  }
  const relativePaths = String(output)
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean);
  return Promise.all(
    relativePaths.map(async (relativePath) => {
      let raw: string | Buffer;
      try {
        raw = await runGit(['show', `${baseCommit}:${relativePath}`], repositoryRoot, 'buffer');
      } catch {
        throw new CatalogEvidenceInventoryError(
          'TRUSTED_BASE_CONTENT_UNREADABLE',
          `Cannot read ${relativePath} from the protected base commit.`,
        );
      }
      const bytes = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
      return {
        path: relativePath,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        byteLength: bytes.byteLength,
      };
    }),
  );
};

const calculateActualContentFileInventory = async (
  repositoryRoot: string,
): Promise<ContentFileInventoryEntry[]> =>
  Promise.all(
    (await listFiles(path.join(repositoryRoot, 'src/content'))).map(async (filePath) => {
      const bytes = await readFile(filePath);
      return {
        path: path.relative(repositoryRoot, filePath).replaceAll(path.sep, '/'),
        sha256: createHash('sha256').update(bytes).digest('hex'),
        byteLength: bytes.byteLength,
      };
    }),
  );

const deriveTrustedProblemOwnership = (
  operation: z.infer<typeof PublicationUpdateSchema>['operations'][number],
): readonly string[] => {
  const candidates = new Set<string>();
  const problemIdPattern = /abc[0-9]{3,}-[a-z][a-z0-9+_-]*/giu;
  for (const source of [operation.entityId, operation.path]) {
    for (const match of source.matchAll(problemIdPattern)) {
      const candidate = match[0];
      if (ProblemIdSchema.safeParse(candidate).success) candidates.add(candidate.toLowerCase());
    }
  }
  if (operation.entityType === 'problem' && ProblemIdSchema.safeParse(operation.entityId).success) {
    candidates.add(operation.entityId.toLowerCase());
  }
  if (candidates.size === 0) {
    throw new CatalogEvidenceInventoryError(
      'PUBLICATION_UPDATE_OWNERSHIP_UNDERIVED',
      `Cannot derive Problem ownership from ${operation.operationId} and its trusted content path.`,
    );
  }
  return [...candidates].sort();
};

const sameOrderedStrings = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

/** Resolve release records only from fixed canonical roots and rebuild trusted inventories. */
export const loadCatalogEvidenceCanonicalSources = async (
  catalog: unknown,
  repositoryRoot = process.cwd(),
  options?: CatalogEvidenceTrustOptions,
): Promise<CatalogEvidenceCanonicalSources> => {
  const baseCommit = await resolveTrustedBaseCommit(options?.baseCommit, repositoryRoot);
  const catalogResult = z
    .object({
      release: z.object({
        version: z.string(),
        releaseKind: z.enum(['initial', 'incremental']),
        cutoffAt: z.string(),
        manifestDigest: Sha256Schema,
        contentFileInventoryDigest: Sha256Schema,
        contentSnapshotDigest: Sha256Schema,
        updateIds: z.array(EntityIdSchema),
        advancedSlotRegistryDigest: Sha256Schema,
      }),
    })
    .safeParse(catalog);
  if (!catalogResult.success) {
    throw new CatalogEvidenceInventoryError(
      'CATALOG_RELEASE_CONTEXT_INVALID',
      catalogResult.error.message,
    );
  }
  const release = catalogResult.data.release;
  const manifestMatches: {
    path: string;
    value: z.infer<typeof ContentWorkManifestSchema>;
  }[] = [];
  for (const filePath of await listFiles(path.join(repositoryRoot, 'docs/work-manifests'))) {
    if (!filePath.endsWith('.json')) continue;
    const parsed = ContentWorkManifestSchema.safeParse(
      await readJsonFile(filePath, 'WORK_MANIFEST_JSON_INVALID'),
    );
    if (parsed.success && parsed.data.digest === release.manifestDigest) {
      manifestMatches.push({ path: filePath, value: parsed.data });
    }
  }
  if (manifestMatches.length !== 1) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_WORK_MANIFEST_NOT_UNIQUE',
      'release.manifestDigest must resolve exactly one manifest under docs/work-manifests.',
    );
  }
  const manifestMatch = manifestMatches[0];
  if (!manifestMatch) {
    throw new CatalogEvidenceInventoryError('CANONICAL_WORK_MANIFEST_NOT_UNIQUE', 'No manifest.');
  }
  const committedScope = await readCommittedManifestScope(
    manifestMatch.path,
    repositoryRoot,
    baseCommit,
  );
  try {
    validateContentWorkManifest(manifestMatch.value, committedScope);
  } catch (error) {
    if (error instanceof WorkManifestError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }

  const candidateMatches: z.infer<typeof ReleaseCandidateSchema>[] = [];
  for (const filePath of await listFiles(path.join(repositoryRoot, 'staging/release-candidates'))) {
    if (!filePath.endsWith('.json')) continue;
    const parsed = ReleaseCandidateSchema.safeParse(
      await readJsonFile(filePath, 'RELEASE_CANDIDATE_JSON_INVALID'),
    );
    if (
      parsed.success &&
      parsed.data.targetReleaseVersion === release.version &&
      parsed.data.releaseKind === release.releaseKind &&
      parsed.data.cutoffAt === release.cutoffAt &&
      parsed.data.advancedSlotRegistryDigest === release.advancedSlotRegistryDigest &&
      parsed.data.workManifestDigest === release.manifestDigest &&
      parsed.data.catalogContentSnapshotDigest === release.contentSnapshotDigest &&
      parsed.data.contentSubjectDigest === release.contentFileInventoryDigest &&
      sameOrderedStrings(parsed.data.orderedUpdateIds, release.updateIds)
    ) {
      candidateMatches.push(parsed.data);
    }
  }
  if (candidateMatches.length !== 1) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_RELEASE_CANDIDATE_NOT_UNIQUE',
      'Release scope must resolve exactly one candidate under staging/release-candidates.',
    );
  }
  const candidate = candidateMatches[0];
  if (!candidate) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_RELEASE_CANDIDATE_NOT_UNIQUE',
      'No candidate.',
    );
  }

  const updates = new Map<string, z.infer<typeof PublicationUpdateSchema>>();
  for (const filePath of await listFiles(path.join(repositoryRoot, 'staging/updates'))) {
    if (!filePath.endsWith('.json')) continue;
    const parsed = PublicationUpdateSchema.safeParse(
      await readJsonFile(filePath, 'PUBLICATION_UPDATE_JSON_INVALID'),
    );
    if (parsed.success && candidate.orderedUpdateIds.includes(parsed.data.updateId)) {
      if (updates.has(parsed.data.updateId)) {
        throw new CatalogEvidenceInventoryError(
          'CANONICAL_PUBLICATION_UPDATE_DUPLICATE',
          parsed.data.updateId,
        );
      }
      updates.set(parsed.data.updateId, parsed.data);
    }
  }
  if (
    updates.size !== candidate.orderedUpdateIds.length ||
    candidate.orderedUpdateIds.some((id) => updates.get(id)?.state !== 'ELIGIBLE_FOR_BATCH')
  ) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_PUBLICATION_UPDATE_MISSING',
      'Every ordered update must exist once under staging/updates and be eligible.',
    );
  }
  const actualContentFiles = await calculateActualContentFileInventory(repositoryRoot);
  const baseContentFiles = await calculateBaseContentFileInventory(repositoryRoot, baseCommit);
  try {
    validateReleaseCandidate(candidate, {
      updates: candidate.orderedUpdateIds.map((id) => ({
        updateId: id,
        state: 'ELIGIBLE_FOR_BATCH',
        baseReleaseVersion: updates.get(id)?.baseReleaseVersion ?? null,
        targetReleaseVersion: candidate.targetReleaseVersion,
      })),
      contentFiles: actualContentFiles,
    });
  } catch (error) {
    if (error instanceof ReleaseTransitionError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
  const operationPaths = new Set<string>();
  const operationIds = new Set<string>();
  for (const update of updates.values()) {
    const operationOwnership = update.operations.map((operation) => ({
      operationId: operation.operationId,
      affectedProblemIds: deriveTrustedProblemOwnership(operation),
      entityType: operation.entityType,
      entityId: operation.entityId,
      action: operation.action,
      path: operation.path,
      beforeDigest: operation.beforeDigest,
      afterDigest: operation.afterDigest,
    }));
    try {
      validatePublicationUpdate(update, {
        operationOwnership,
        baseFiles: baseContentFiles,
        currentFiles: actualContentFiles,
      });
    } catch (error) {
      if (error instanceof ReleaseTransitionError) {
        throw new CatalogEvidenceInventoryError(error.code, error.message);
      }
      throw error;
    }
    for (const operation of update.operations) {
      if (operationIds.has(operation.operationId)) {
        throw new CatalogEvidenceInventoryError(
          'CANONICAL_PUBLICATION_UPDATE_DUPLICATE_OPERATION',
          operation.operationId,
        );
      }
      operationIds.add(operation.operationId);
      if (operationPaths.has(operation.path)) {
        throw new CatalogEvidenceInventoryError(
          'CANONICAL_PUBLICATION_UPDATE_DUPLICATE_PATH',
          operation.path,
        );
      }
      operationPaths.add(operation.path);
    }
  }
  const baseByPath = new Map(baseContentFiles.map((file) => [file.path, file] as const));
  const currentByPath = new Map(actualContentFiles.map((file) => [file.path, file] as const));
  const changedPaths = new Set(
    [...new Set([...baseByPath.keys(), ...currentByPath.keys()])].filter(
      (filePath) => baseByPath.get(filePath)?.sha256 !== currentByPath.get(filePath)?.sha256,
    ),
  );
  if (!sameStringSet([...changedPaths], [...operationPaths])) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_PUBLICATION_UPDATE_DIFF_INCOMPLETE',
      'Publication updates must exactly cover the protected-base to current content diff.',
    );
  }
  return { catalog, workManifest: manifestMatch.value, releaseCandidate: candidate };
};

const reviewKinds = [
  'outcome_coverage',
  'non_automatable_claim',
  'non_automatable_example',
] as const;

/** Derive the trust context exclusively from canonical, mutually-bound release records. */
export const deriveCatalogEvidenceTrustContext = (
  sources: CatalogEvidenceCanonicalSources,
): TrustedReviewCheckInventory => {
  const manifestResult = ContentWorkManifestSchema.safeParse(sources.workManifest);
  if (!manifestResult.success) {
    throw new CatalogEvidenceInventoryError(
      'WORK_MANIFEST_SCHEMA_INVALID',
      manifestResult.error.message,
    );
  }
  try {
    validateContentWorkManifest(manifestResult.data);
  } catch (error) {
    if (error instanceof WorkManifestError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
  const candidateResult = ReleaseCandidateSchema.safeParse(sources.releaseCandidate);
  if (!candidateResult.success) {
    throw new CatalogEvidenceInventoryError(
      'RELEASE_CANDIDATE_INVALID',
      candidateResult.error.message,
    );
  }
  const catalogResult = z
    .object({
      release: z.object({
        version: z.string(),
        releaseKind: z.string(),
        cutoffAt: z.string(),
        manifestDigest: Sha256Schema,
        contentFileInventoryDigest: Sha256Schema,
        contentSnapshotDigest: Sha256Schema,
        updateIds: z.array(EntityIdSchema),
        advancedSlotRegistryDigest: Sha256Schema,
      }),
    })
    .safeParse(sources.catalog);
  if (!catalogResult.success) {
    throw new CatalogEvidenceInventoryError(
      'CATALOG_RELEASE_CONTEXT_INVALID',
      catalogResult.error.message,
    );
  }
  const manifest = manifestResult.data;
  const candidate = candidateResult.data;
  const release = catalogResult.data.release;
  if (
    manifest.digest !== release.manifestDigest ||
    candidate.targetReleaseVersion !== release.version ||
    candidate.releaseKind !== release.releaseKind ||
    candidate.cutoffAt !== release.cutoffAt ||
    candidate.advancedSlotRegistryDigest !== release.advancedSlotRegistryDigest ||
    candidate.workManifestDigest !== release.manifestDigest ||
    candidate.catalogContentSnapshotDigest !== release.contentSnapshotDigest ||
    candidate.contentSubjectDigest !== release.contentFileInventoryDigest ||
    !sameOrderedStrings(candidate.orderedUpdateIds, release.updateIds)
  ) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_RELEASE_CONTEXT_MISMATCH',
      'Catalog, Work Manifest, and Release Candidate do not describe one immutable release.',
    );
  }
  if (
    candidate.fixtureMode ||
    !['READY_TO_PUBLISH', 'PUBLISHED'].includes(candidate.state) ||
    candidate.contentSubjectDigest !== calculateContentSubjectDigest(candidate.contentFiles) ||
    candidate.candidatePayloadDigest === null ||
    candidate.candidatePayloadDigest !==
      calculateCandidatePayloadDigest(candidate.candidateFiles) ||
    candidate.approvableDigest === null ||
    candidate.approvableDigest !==
      calculateApprovableDigest({
        workManifestDigest: candidate.workManifestDigest,
        catalogContentSnapshotDigest: candidate.catalogContentSnapshotDigest,
        contentSubjectDigest: candidate.contentSubjectDigest,
        candidatePayloadDigest: candidate.candidatePayloadDigest,
        preJudgmentCheckRefs: candidate.preJudgmentCheckRefs,
        humanContentReviewEvidenceRefs: candidate.humanContentReviewEvidenceRefs,
        blockingFindings: candidate.blockingFindings,
      })
  ) {
    throw new CatalogEvidenceInventoryError(
      'RELEASE_CANDIDATE_DIGEST_MISMATCH',
      'Release Candidate is not a final, internally consistent canonical record.',
    );
  }

  const requiredCheckIds = [
    ...new Set(manifest.reviewUnits.flatMap((unit) => unit.checkIds)),
  ].sort();
  const candidateChecks = new Map(
    candidate.preJudgmentCheckRefs.map((check) => [check.checkId, check] as const),
  );
  if (
    candidateChecks.size !== candidate.preJudgmentCheckRefs.length ||
    !sameOrderedStrings(requiredCheckIds, [...candidateChecks.keys()].sort())
  ) {
    throw new CatalogEvidenceInventoryError(
      'MANIFEST_CHECK_INVENTORY_MISMATCH',
      'Release Candidate checks must exactly cover Work Manifest check IDs.',
    );
  }
  const applicableChecks = requiredCheckIds.map((checkId) => {
    const check = candidateChecks.get(checkId);
    if (!check)
      throw new CatalogEvidenceInventoryError('MANIFEST_CHECK_INVENTORY_MISMATCH', checkId);
    return { checkId, command: check.command };
  });
  const reviewItems = manifest.reviewUnits.flatMap((unit) => {
    const kinds = unit.evidenceRoles.filter((role): role is (typeof reviewKinds)[number] =>
      reviewKinds.includes(role as (typeof reviewKinds)[number]),
    );
    if (kinds.length !== 1) {
      throw new CatalogEvidenceInventoryError(
        'MANIFEST_REVIEW_ROLE_INVALID',
        `${unit.reviewUnitId} must declare exactly one human-review evidence role.`,
      );
    }
    const kind = kinds[0];
    if (!kind)
      throw new CatalogEvidenceInventoryError('MANIFEST_REVIEW_ROLE_INVALID', unit.reviewUnitId);
    return unit.itemIds.map((reviewItemId) => ({
      reviewItemId,
      reviewUnitId: unit.reviewUnitId,
      kind,
      subjectPaths: unit.paths,
      authorIds: [unit.owner],
      learningOutcomeIds: unit.learningOutcomeIds,
    }));
  });
  const inventoryDigest = canonicalDigest({
    manifestDigest: manifest.digest,
    subjectDigest: candidate.contentSubjectDigest,
    applicableChecks,
    reviewItems,
  });
  return {
    subjectDigest: candidate.contentSubjectDigest,
    inventoryDigest,
    workManifest: {
      learningOutcomeIds: manifest.learningOutcomeIds,
      reviewUnits: manifest.reviewUnits.map((unit) => ({
        reviewUnitId: unit.reviewUnitId,
        subjectPaths: unit.paths,
        learningOutcomeIds: unit.learningOutcomeIds,
        owner: unit.owner,
      })),
    },
    applicableChecks,
    reviewItems,
  };
};

export const CatalogReleaseEvidenceInventorySchema = strictObject({
  subjectDigest: Sha256Schema,
  checks: z.array(CatalogCheckReferenceSchema).min(1),
  reviews: z.array(CatalogReviewReferenceSchema).min(1),
}).superRefine((inventory, context) => {
  const checkIds = inventory.checks.map(({ checkId }) => checkId);
  const resultPaths = inventory.checks.map(({ resultPath }) => resultPath);
  const evidenceIds = inventory.reviews.map(({ evidenceId }) => evidenceId);
  const reviewPaths = inventory.reviews.map(({ path }) => path);
  const assertUnique = (values: readonly string[], path: string, message: string): void => {
    if (new Set(values).size !== values.length) {
      context.addIssue({ code: 'custom', path: [path], message });
    }
  };
  assertUnique(checkIds, 'checks', 'Release check IDs must be unique.');
  assertUnique(resultPaths, 'checks', 'Release check result paths must be unique.');
  assertUnique(evidenceIds, 'reviews', 'Human review evidence IDs must be unique.');
  assertUnique(reviewPaths, 'reviews', 'Human review evidence paths must be unique.');
});

type CheckReference = z.infer<typeof CatalogCheckReferenceSchema>;
type CheckResult = z.infer<typeof CatalogReleaseCheckResultSchema>;
type ReviewReference = z.infer<typeof CatalogReviewReferenceSchema>;
type ReviewEvidence = z.infer<typeof ReviewEvidenceSchema>;

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return (
    sortedLeft.length === sortedRight.length &&
    sortedLeft.every((value, index) => value === sortedRight[index])
  );
};

const digestBytes = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex');

const readJson = async (resolvedPath: string, code: string): Promise<unknown> => {
  let contents: string;
  try {
    contents = await readFile(resolvedPath, 'utf8');
  } catch {
    throw new CatalogEvidenceInventoryError(code, `Cannot read ${resolvedPath}.`);
  }
  try {
    return JSON.parse(contents) as unknown;
  } catch {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_JSON_INVALID',
      `Invalid JSON: ${resolvedPath}.`,
    );
  }
};

const readPublicEvidenceFile = async (
  inputPath: string,
  repositoryRoot: string,
): Promise<{ readonly resolvedPath: string; readonly value: unknown; readonly digest: string }> => {
  let resolvedPath: string;
  try {
    resolvedPath = await resolvePublicEvidencePath(inputPath, repositoryRoot);
  } catch (error) {
    if (error instanceof CatalogPublicationBoundaryError) throw error;
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_PATH_RESOLUTION_FAILED',
      error instanceof Error ? error.message : String(error),
    );
  }
  let bytes: Uint8Array;
  try {
    bytes = await readFile(resolvedPath);
  } catch {
    throw new CatalogEvidenceInventoryError('EVIDENCE_FILE_NOT_FOUND', inputPath);
  }
  return {
    resolvedPath,
    value: await readJson(resolvedPath, 'EVIDENCE_FILE_NOT_READABLE'),
    digest: digestBytes(bytes),
  };
};

const checkMetadataMatches = (
  expected: CheckReference,
  actual: CheckResult,
  digest: string,
): void => {
  if (digest !== expected.resultDigest) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_RESULT_DIGEST_MISMATCH',
      `${expected.checkId} does not match ${expected.resultPath}.`,
    );
  }
  if (
    actual.checkId !== expected.checkId ||
    actual.command !== expected.command ||
    actual.subjectDigest !== expected.subjectDigest ||
    actual.exitCode !== expected.exitCode ||
    actual.passed !== expected.passed ||
    actual.completedAt !== expected.completedAt
  ) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_RESULT_METADATA_MISMATCH',
      `${expected.checkId} metadata is not reproduced by its result file.`,
    );
  }
  if (actual.exitCode !== 0 || !actual.passed) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_RESULT_FAILED',
      `${expected.checkId} did not produce a passing result.`,
    );
  }
};

const verifyCheckReference = async (
  reference: CheckReference,
  repositoryRoot: string,
): Promise<TrustedCatalogReleaseEvidenceInventory['checks'][number]> => {
  const file = await readPublicEvidenceFile(reference.resultPath, repositoryRoot);
  const parsed = CatalogReleaseCheckResultSchema.safeParse(file.value);
  if (!parsed.success) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_RESULT_SCHEMA_INVALID',
      `${reference.resultPath}: ${parsed.error.message}`,
    );
  }
  checkMetadataMatches(reference, parsed.data, file.digest);
  return {
    checkId: parsed.data.checkId,
    command: parsed.data.command,
    subjectDigest: parsed.data.subjectDigest,
    resultPath: reference.resultPath,
    resultDigest: file.digest,
    exitCode: parsed.data.exitCode,
    passed: parsed.data.passed,
    completedAt: parsed.data.completedAt,
  };
};

const reviewCheckReference = (
  check: ReviewEvidence['applicableChecks'][number],
): CheckReference => ({
  checkId: check.checkId,
  command: check.command,
  subjectDigest: check.subjectDigest,
  resultPath: check.resultPath,
  resultDigest: check.resultDigest,
  exitCode: check.exitCode,
  passed: check.passed,
  completedAt: check.completedAt,
});

const sameCheckReference = (
  left: TrustedCatalogReleaseEvidenceInventory['checks'][number],
  right: TrustedCatalogReleaseEvidenceInventory['checks'][number],
): boolean =>
  left.checkId === right.checkId &&
  left.command === right.command &&
  left.subjectDigest === right.subjectDigest &&
  left.resultPath === right.resultPath &&
  left.resultDigest === right.resultDigest &&
  left.exitCode === right.exitCode &&
  left.passed === right.passed &&
  left.completedAt === right.completedAt;

const validateReviewCompleteness = (evidence: ReviewEvidence): void => {
  const authorIds = evidence.authors.map(({ personId }) => personId);
  const reviewerIds = evidence.reviewers.map(({ personId }) => personId);
  const itemIds = evidence.reviewItems.map(({ reviewItemId }) => reviewItemId);
  const itemPaths = [...new Set(evidence.reviewItems.flatMap((item) => item.subjectPaths))];
  const itemOutcomeIds = [
    ...new Set(evidence.reviewItems.flatMap((item) => item.learningOutcomeIds)),
  ];
  const itemAuthorIds = [...new Set(evidence.reviewItems.flatMap((item) => item.authorIds))];
  const gateReviewerId = evidence.outcomeCoverageReview.reviewerId;
  const allChecksPassed = evidence.applicableChecks.every(
    (check) =>
      check.subjectDigest === evidence.subjectDigest &&
      check.executedByReviewerId === gateReviewerId &&
      check.exitCode === 0 &&
      check.passed,
  );
  const checkSetDigest = canonicalDigest(
    evidence.applicableChecks
      .map(
        ({
          checkId,
          command,
          subjectDigest,
          resultPath,
          resultDigest,
          exitCode,
          passed,
          completedAt,
          executedByReviewerId,
        }) => ({
          checkId,
          command,
          subjectDigest,
          resultPath,
          resultDigest,
          exitCode,
          passed,
          completedAt,
          executedByReviewerId,
        }),
      )
      .sort((left, right) => left.checkId.localeCompare(right.checkId)),
  );
  const countsAreComplete =
    evidence.applicableCheckCount === evidence.applicableChecks.length &&
    evidence.passedApplicableCheckCount === evidence.applicableChecks.length &&
    evidence.inventoryItemCount === evidence.reviewItems.length &&
    evidence.reviewedItemCount === evidence.reviewItems.length &&
    evidence.approvedItemCount === evidence.reviewItems.length &&
    evidence.changesRequestedItemCount === 0 &&
    evidence.unreviewedItemCount === 0 &&
    evidence.reviewItems.length > 0 &&
    evidence.reviewItems.every(
      (item) => item.decision === 'approved' && item.findings.every((finding) => finding.resolved),
    );
  const authorsAndReviewersAreValid =
    new Set(authorIds).size === authorIds.length &&
    new Set(reviewerIds).size === reviewerIds.length &&
    !authorIds.some((authorId) => reviewerIds.includes(authorId)) &&
    reviewerIds.includes(gateReviewerId) &&
    !authorIds.includes(gateReviewerId);
  const itemsAreOwnedAndReviewed =
    new Set(itemIds).size === itemIds.length &&
    evidence.reviewItems.every(
      (item) =>
        item.authorIds.every((authorId) => authorIds.includes(authorId)) &&
        reviewerIds.includes(item.reviewerId) &&
        !item.authorIds.includes(item.reviewerId),
    ) &&
    evidence.authors.every(
      (author) =>
        new Set(author.authoredItemIds).size === author.authoredItemIds.length &&
        author.authoredItemIds.every((itemId) => itemIds.includes(itemId)),
    ) &&
    evidence.reviewItems.every((item) =>
      authorIds.some((authorId) => item.authorIds.includes(authorId)),
    );
  const coverageIsIndependent =
    sameStringSet(evidence.outcomeCoverageReview.subjectPaths, itemPaths) &&
    sameStringSet(evidence.outcomeCoverageReview.learningOutcomeIds, itemOutcomeIds) &&
    sameStringSet(evidence.outcomeCoverageReview.authorIds, itemAuthorIds) &&
    evidence.outcomeCoverageReview.authorIds.every((authorId) => authorIds.includes(authorId)) &&
    !evidence.outcomeCoverageReview.authorIds.includes(gateReviewerId);

  if (
    !allChecksPassed ||
    checkSetDigest !== evidence.reviewerExecutedCheckSetDigest ||
    !countsAreComplete ||
    !authorsAndReviewersAreValid ||
    !itemsAreOwnedAndReviewed ||
    !coverageIsIndependent ||
    !evidence.outcomeCoverageConfirmed ||
    !evidence.aggregatePassed
  ) {
    throw new CatalogEvidenceInventoryError(
      'HUMAN_REVIEW_INCOMPLETE',
      `${evidence.id} does not contain a complete passing review.`,
    );
  }
};

const verifyReviewReference = async (
  reference: ReviewReference,
  repositoryRoot: string,
  trustedChecks: readonly TrustedCatalogReleaseEvidenceInventory['checks'][number][],
  trustedReviewInventory: TrustedReviewCheckInventory,
): Promise<TrustedCatalogReleaseEvidenceInventory['reviews'][number]> => {
  const file = await readPublicEvidenceFile(reference.path, repositoryRoot);
  if (file.digest !== reference.digest) {
    throw new CatalogEvidenceInventoryError(
      'HUMAN_REVIEW_DIGEST_MISMATCH',
      `${reference.evidenceId} does not match ${reference.path}.`,
    );
  }
  const parsed = ReviewEvidenceSchema.safeParse(file.value);
  if (!parsed.success) {
    throw new CatalogEvidenceInventoryError(
      'HUMAN_REVIEW_SCHEMA_INVALID',
      `${reference.path}: ${parsed.error.message}`,
    );
  }
  const evidence = parsed.data;
  if (
    evidence.id !== reference.evidenceId ||
    evidence.subjectDigest !== reference.subjectDigest ||
    evidence.aggregatePassed !== reference.aggregatePassed ||
    !sameStringSet(
      reference.authorIds,
      evidence.authors.map(({ personId }) => personId),
    ) ||
    !sameStringSet(
      reference.reviewerIds,
      evidence.reviewers.map(({ personId }) => personId),
    ) ||
    digestWithoutField(evidence, 'evidenceDigest') !== evidence.evidenceDigest
  ) {
    throw new CatalogEvidenceInventoryError(
      'HUMAN_REVIEW_REFERENCE_MISMATCH',
      `${reference.evidenceId} does not reproduce its catalog reference.`,
    );
  }
  try {
    validateHumanContentReview(evidence, trustedReviewInventory);
  } catch (error) {
    if (error instanceof HumanReviewError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
  validateReviewCompleteness(evidence);
  const reviewChecks = await Promise.all(
    evidence.applicableChecks.map((check) =>
      verifyCheckReference(reviewCheckReference(check), repositoryRoot),
    ),
  );
  if (
    reviewChecks.length !== trustedChecks.length ||
    trustedChecks.some(
      (trustedCheck) =>
        !reviewChecks.some((reviewCheck) => sameCheckReference(trustedCheck, reviewCheck)),
    )
  ) {
    throw new CatalogEvidenceInventoryError(
      'HUMAN_REVIEW_CHECK_INVENTORY_MISMATCH',
      `${reference.evidenceId} does not cover the trusted release check inventory.`,
    );
  }
  return {
    evidenceId: evidence.id,
    path: reference.path,
    digest: file.digest,
    subjectDigest: evidence.subjectDigest,
    authorIds: evidence.authors.map(({ personId }) => personId),
    reviewerIds: evidence.reviewers.map(({ personId }) => personId),
    aggregatePassed: evidence.aggregatePassed,
  };
};

export const loadTrustedCatalogReleaseEvidenceInventory = async (
  inventoryPath: string,
  canonicalSources: CatalogEvidenceCanonicalSources,
  repositoryRoot = process.cwd(),
): Promise<TrustedCatalogReleaseEvidenceInventory> => {
  const trustedContext = deriveCatalogEvidenceTrustContext(canonicalSources);
  const inventoryFile = await readPublicEvidenceFile(inventoryPath, repositoryRoot);
  const parsed = CatalogReleaseEvidenceInventorySchema.safeParse(inventoryFile.value);
  if (!parsed.success) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_INVENTORY_SCHEMA_INVALID',
      `${inventoryPath}: ${parsed.error.message}`,
    );
  }

  const checks = await Promise.all(
    parsed.data.checks.map((check) => verifyCheckReference(check, repositoryRoot)),
  );
  const reviews = await Promise.all(
    parsed.data.reviews.map((review) =>
      verifyReviewReference(review, repositoryRoot, checks, trustedContext),
    ),
  );
  const candidate = ReleaseCandidateSchema.parse(canonicalSources.releaseCandidate);
  if (
    candidate.preJudgmentCheckRefs.length !== checks.length ||
    candidate.preJudgmentCheckRefs.some((reference) => {
      const check = checks.find(({ checkId }) => checkId === reference.checkId);
      return (
        check?.command !== reference.command ||
        check.subjectDigest !== reference.subjectDigest ||
        check.resultPath !== reference.resultPath ||
        check.resultDigest !== reference.resultDigest ||
        check.exitCode !== reference.exitCode ||
        check.completedAt !== reference.completedAt
      );
    }) ||
    candidate.humanContentReviewEvidenceRefs.length !== reviews.length ||
    candidate.humanContentReviewEvidenceRefs.some((reference) => {
      const review = reviews.find(({ evidenceId }) => evidenceId === reference.evidenceId);
      return (
        review?.path !== reference.path ||
        review.digest !== reference.digest ||
        review.subjectDigest !== reference.subjectDigest ||
        review.aggregatePassed !== reference.aggregatePassed
      );
    })
  ) {
    throw new CatalogEvidenceInventoryError(
      'RELEASE_CANDIDATE_EVIDENCE_MISMATCH',
      'Release Candidate evidence references must exactly match verified evidence files.',
    );
  }
  const subjectDigests = [
    ...checks.map(({ subjectDigest }) => subjectDigest),
    ...reviews.map(({ subjectDigest }) => subjectDigest),
  ];
  const subjectDigest = subjectDigests[0];
  if (
    subjectDigest === undefined ||
    subjectDigests.some((digest) => digest !== subjectDigest) ||
    parsed.data.subjectDigest !== subjectDigest ||
    trustedContext.subjectDigest !== subjectDigest
  ) {
    throw new CatalogEvidenceInventoryError(
      'EVIDENCE_SUBJECT_MISMATCH',
      'All evidence files and the inventory must use one current subject digest.',
    );
  }
  return { subjectDigest, checks, reviews };
};
