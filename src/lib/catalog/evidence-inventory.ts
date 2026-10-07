import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { z } from 'zod';

import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { strictObject } from '../domain/contract-schema.js';
import {
  CatalogSchema,
  ContentReviewModeSchema,
  EntityIdSchema,
  OffsetDateTimeSchema,
  SafePathSchema,
  Sha256Schema,
} from '../domain/schema-parts/catalog.js';
import {
  ExecutableExampleEvidenceSchema,
  executableExampleEvidenceLocatorKey,
} from '../domain/schema-parts/verification-evidence.js';
import { HumanContentReviewEvidenceSchema as ReviewEvidenceSchema } from '../domain/schema-parts/review-evidence.js';
import { ContentWorkManifestSchema } from '../domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../domain/schema-parts/release.js';
import {
  PublicationUpdateError,
  validatePublicationUpdate,
} from '../validation/publication-update.js';
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
  resolvePublicCatalogInput,
  resolvePublicEvidencePath,
} from './publication-boundary.js';
import {
  deriveExecutableExampleInventory,
  executableExampleInventoryDigest,
  type TrustedCatalogReleaseEvidenceInventory,
} from './build-catalog.js';
import {
  buildTrustedPublicationDiff,
  parseTrustedCatalog,
  TrustedCatalogDiffError,
} from './trusted-diff.js';
import { loadFullPublicProjection } from './full-public-projection.js';
import {
  assertSeedRelease,
  createSeedReleaseManifest,
  INITIAL_RELEASE_MANIFEST,
  INITIAL_BOOTSTRAP_ID,
} from './seed-release.js';
import { canonicalJson } from '../domain/canonical-json.js';

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
  reviewMode: ContentReviewModeSchema,
  aggregatePassed: z.boolean(),
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

const CatalogExecutableExampleEvidenceReferenceSchema = strictObject({
  path: SafePathSchema,
  digest: Sha256Schema,
  /** Executable evidence is scoped to the logical Catalog snapshot, not file inventory. */
  subjectDigest: Sha256Schema,
});

export interface CatalogEvidenceCanonicalSources {
  readonly catalog: unknown;
  readonly workManifest: unknown;
}

const execFileAsync = promisify(execFile);

export interface CatalogEvidenceTrustOptions {
  /** The public catalog file whose current bytes are being validated. */
  readonly catalogPath: string;
  /** Preparation inspection only; never supplied by production validation. */
  readonly allowHeldBootstrap?: boolean;
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
    // Full catalogs and canonical content indexes exceed execFile's 1 MiB default.
    // Keep the same full-corpus allowance as the release history reader.
    maxBuffer: 128 * 1024 * 1024,
  });
  return result.stdout;
};

const resolveTrustedBaseCommit = async (repositoryRoot: string): Promise<string> => {
  const githubBaseRef = process.env.GITHUB_BASE_REF?.trim();
  const baseRef = githubBaseRef
    ? `refs/remotes/origin/${githubBaseRef}`
    : 'refs/remotes/origin/main';
  if (
    !/^refs\/remotes\/[A-Za-z0-9._-]+\/[A-Za-z0-9._/-]+$/u.test(baseRef) ||
    baseRef.includes('..') ||
    baseRef.includes('@{') ||
    baseRef.endsWith('/')
  ) {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_REF_INVALID',
      'A protected remote-tracking base ref is required.',
    );
  }
  let headCommit: string;
  let protectedBaseCommit: string;
  try {
    headCommit = String(await runGit(['rev-parse', 'HEAD^{commit}'], repositoryRoot)).trim();
    protectedBaseCommit = String(
      await runGit(
        ['rev-parse', '--verify', '--end-of-options', `${baseRef}^{commit}`],
        repositoryRoot,
      ),
    ).trim();
    await runGit(['merge-base', '--is-ancestor', protectedBaseCommit, 'HEAD'], repositoryRoot);
  } catch {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_REF_INVALID',
      `${baseRef} must resolve to a protected commit reachable from HEAD.`,
    );
  }
  if (protectedBaseCommit === headCommit) {
    throw new CatalogEvidenceInventoryError(
      'TRUSTED_BASE_REF_INVALID',
      'The protected base ref must point to a commit before HEAD, not HEAD itself.',
    );
  }
  return protectedBaseCommit;
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
  reviewPolicy: manifest.reviewPolicy,
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

const relativeRepositoryPath = async (
  filePath: string,
  repositoryRoot: string,
): Promise<string> => {
  const resolvedRepositoryRoot = await realpath(repositoryRoot);
  const relativePath = path.relative(resolvedRepositoryRoot, filePath).replaceAll(path.sep, '/');
  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith('../') ||
    path.isAbsolute(relativePath)
  ) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_PATH_INVALID',
      `${filePath} must be inside the repository.`,
    );
  }
  return relativePath;
};

const readCommittedCatalog = async (
  catalogPath: string,
  repositoryRoot: string,
  baseCommit: string,
  releaseKind: 'initial' | 'incremental',
): Promise<z.infer<typeof CatalogSchema> | undefined> => {
  const relativePath = await relativeRepositoryPath(catalogPath, repositoryRoot);
  let stdout: string | Buffer;
  try {
    stdout = await runGit(['show', `${baseCommit}:${relativePath}`], repositoryRoot);
  } catch {
    try {
      await runGit(['cat-file', '-e', `${baseCommit}:${relativePath}`], repositoryRoot);
    } catch {
      if (releaseKind === 'initial') return undefined;
      throw new CatalogEvidenceInventoryError(
        'TRUSTED_BASE_CATALOG_REQUIRED',
        `${relativePath} must exist in the protected base Catalog for an incremental release.`,
      );
    }
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_JSON_INVALID',
      `${relativePath} could not be read from the protected base commit.`,
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(String(stdout)) as unknown;
  } catch {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_SCHEMA_INVALID',
      `${relativePath} is not valid JSON in the protected base commit.`,
    );
  }
  try {
    return parseTrustedCatalog(value, `${relativePath} at ${baseCommit}`);
  } catch (error) {
    if (error instanceof TrustedCatalogDiffError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
};

const readCurrentCatalog = async (
  catalog: unknown,
  catalogPath: string,
  repositoryRoot: string,
): Promise<z.infer<typeof CatalogSchema>> => {
  let resolvedPath: string;
  try {
    resolvedPath = await resolvePublicCatalogInput(catalogPath, repositoryRoot);
  } catch (error) {
    if (error instanceof CatalogPublicationBoundaryError) throw error;
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_PATH_INVALID',
      error instanceof Error ? error.message : String(error),
    );
  }
  const fileValue = await readJsonFile(resolvedPath, 'CANONICAL_CATALOG_JSON_INVALID');
  const expectedDigest = canonicalDigest(catalog);
  const actualDigest = canonicalDigest(fileValue);
  if (expectedDigest !== actualDigest) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_INPUT_MISMATCH',
      `${catalogPath} does not reproduce the catalog input supplied to the validator.`,
    );
  }
  try {
    return parseTrustedCatalog(fileValue, catalogPath);
  } catch (error) {
    if (error instanceof TrustedCatalogDiffError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
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
  const files: ContentFileInventoryEntry[] = [];
  for (let offset = 0; offset < relativePaths.length; offset += 32)
    files.push(
      ...(await Promise.all(
        relativePaths.slice(offset, offset + 32).map(async (relativePath) => {
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
      )),
    );
  return files;
};

export const calculateActualContentFileInventory = async (
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

const sameOrderedStrings = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

/** Resolve release records only from fixed canonical roots and rebuild trusted inventories. */
export const loadCatalogEvidenceCanonicalSources = async (
  catalog: unknown,
  repositoryRoot = process.cwd(),
  options?: CatalogEvidenceTrustOptions,
): Promise<CatalogEvidenceCanonicalSources> => {
  if (!options?.catalogPath) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_PATH_REQUIRED',
      'A repository-bound public catalog path is required to rebuild the trusted Catalog diff.',
    );
  }
  const baseCommit = await resolveTrustedBaseCommit(repositoryRoot);
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
  const currentCatalog = await readCurrentCatalog(catalog, options.catalogPath, repositoryRoot);
  let resolvedCatalogPath: string;
  try {
    resolvedCatalogPath = await resolvePublicCatalogInput(options.catalogPath, repositoryRoot);
  } catch (error) {
    if (error instanceof CatalogPublicationBoundaryError) throw error;
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_CATALOG_PATH_INVALID',
      error instanceof Error ? error.message : String(error),
    );
  }
  const baseCatalog = await readCommittedCatalog(
    resolvedCatalogPath,
    repositoryRoot,
    baseCommit,
    release.releaseKind,
  );
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
  const isSeedBootstrap =
    !baseCatalog &&
    release.releaseKind === 'initial' &&
    release.updateIds.length === 1 &&
    release.updateIds[0] === INITIAL_BOOTSTRAP_ID;
  let initialBaseCatalog;
  let initialProjectionDigest: string | undefined;
  if (isSeedBootstrap) {
    assertSeedRelease(currentCatalog);
    await runGit(['diff', '--exit-code', baseCommit, 'HEAD', '--', 'src/content'], repositoryRoot);
    const projection = await loadFullPublicProjection({
      repositoryRoot,
      usePreparedRelease: false,
    });
    initialBaseCatalog = projection.catalog;
    initialProjectionDigest = projection.digest;
    for (const key of [
      'contests',
      'contestGaps',
      'contestSlots',
      'problems',
      'techniqueInventory',
      'tags',
      'learningOutcomes',
      'learningUnits',
      'placements',
      'authoringUnits',
      'sources',
      'correctionImpacts',
    ] as const)
      if (canonicalJson(currentCatalog[key]) !== canonicalJson(projection.catalog[key]))
        throw new CatalogEvidenceInventoryError('INITIAL_CANONICAL_DRIFT', key);
    if (path.relative(repositoryRoot, manifestMatch.path) !== INITIAL_RELEASE_MANIFEST)
      throw new CatalogEvidenceInventoryError('INITIAL_MANIFEST_PATH', manifestMatch.path);
  }
  const committedScope = isSeedBootstrap
    ? ContentWorkManifestSchema.parse(
        createSeedReleaseManifest(
          currentCatalog,
          manifestMatch.value.createdAt,
          manifestMatch.value.reviewPolicy.highRiskSelfReviewReason === 'solo_maintainer',
        ),
      )
    : await readCommittedManifestScope(manifestMatch.path, repositoryRoot, baseCommit);
  try {
    validateContentWorkManifest(manifestMatch.value, committedScope);
  } catch (error) {
    if (error instanceof WorkManifestError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }

  const updates = new Map<string, z.infer<typeof PublicationUpdateSchema>>();
  for (const filePath of await listFiles(path.join(repositoryRoot, 'staging/updates'))) {
    if (!filePath.endsWith('.json')) continue;
    const parsed = PublicationUpdateSchema.safeParse(
      await readJsonFile(filePath, 'PUBLICATION_UPDATE_JSON_INVALID'),
    );
    if (parsed.success && release.updateIds.includes(parsed.data.updateId)) {
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
    updates.size !== release.updateIds.length ||
    release.updateIds.some(
      (id) =>
        updates.get(id)?.state !== 'ELIGIBLE_FOR_BATCH' &&
        !(isSeedBootstrap && options.allowHeldBootstrap && updates.get(id)?.state === 'ON_HOLD'),
    )
  ) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_PUBLICATION_UPDATE_MISSING',
      'Every ordered update must exist once under staging/updates and be eligible.',
    );
  }
  const orderedUpdates = release.updateIds.map((updateId) => {
    const update = updates.get(updateId);
    if (!update) {
      throw new CatalogEvidenceInventoryError('CANONICAL_PUBLICATION_UPDATE_MISSING', updateId);
    }
    return update;
  });
  if (isSeedBootstrap) {
    const bootstrap = orderedUpdates[0];
    if (
      bootstrap?.kind !== 'bootstrap' ||
      bootstrap.fixtureMode ||
      bootstrap.operations.length ||
      bootstrap.sourceSetFingerprint !== initialProjectionDigest ||
      canonicalJson(
        bootstrap.authoringResults.map((result) => [result.problemId, result.draftPath]).sort(),
      ) !==
        canonicalJson(
          currentCatalog.authoringUnits.map((unit) => [unit.problemId, unit.docPath]).sort(),
        )
    )
      throw new CatalogEvidenceInventoryError(
        'INITIAL_BOOTSTRAP_BINDING',
        'Bootstrap must bind the unchanged accepted seed and every authored document.',
      );
  }
  const expectedBaseReleaseVersion =
    release.releaseKind === 'initial' ? null : (baseCatalog?.release.version ?? null);
  if (orderedUpdates.some((update) => update.baseReleaseVersion !== expectedBaseReleaseVersion)) {
    throw new CatalogEvidenceInventoryError(
      'PUBLICATION_UPDATE_BASE_RELEASE_MISMATCH',
      'Every release update must name the protected-base Catalog version.',
    );
  }
  const actualContentFiles = await calculateActualContentFileInventory(repositoryRoot);
  const baseContentFiles = await calculateBaseContentFileInventory(repositoryRoot, baseCommit);
  if (canonicalDigest(actualContentFiles) !== release.contentFileInventoryDigest) {
    throw new CatalogEvidenceInventoryError(
      'RELEASE_CONTENT_INVENTORY_MISMATCH',
      'release.contentFileInventoryDigest must be rebuilt from the current content files.',
    );
  }
  const operationPaths = new Set<string>();
  const operationIds = new Set<string>();
  let trustedDiff: ReturnType<typeof buildTrustedPublicationDiff>;
  try {
    trustedDiff = buildTrustedPublicationDiff(
      orderedUpdates,
      initialBaseCatalog ?? baseCatalog,
      currentCatalog,
      {
        baseFiles: baseContentFiles,
        currentFiles: actualContentFiles,
      },
    );
  } catch (error) {
    if (error instanceof TrustedCatalogDiffError) {
      throw new CatalogEvidenceInventoryError(error.code, error.message);
    }
    throw error;
  }
  const trustedUpdates = new Map(trustedDiff.updates.map((update) => [update.updateId, update]));
  for (const update of orderedUpdates) {
    const trustedUpdate = trustedUpdates.get(update.updateId);
    if (!trustedUpdate) {
      throw new CatalogEvidenceInventoryError(
        'PUBLICATION_UPDATE_TRUSTED_DIFF_MISSING',
        update.updateId,
      );
    }
    try {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: baseContentFiles,
        currentFiles: actualContentFiles,
        ...(isSeedBootstrap
          ? { initialPublicationProblemIds: currentCatalog.problems.map((problem) => problem.id) }
          : {}),
      });
    } catch (error) {
      if (error instanceof PublicationUpdateError) {
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
  return { catalog, workManifest: manifestMatch.value };
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
  const catalogResult = CatalogSchema.safeParse(sources.catalog);
  if (!catalogResult.success) {
    throw new CatalogEvidenceInventoryError(
      'CATALOG_RELEASE_CONTEXT_INVALID',
      catalogResult.error.message,
    );
  }
  const manifest = manifestResult.data;
  const release = catalogResult.data.release;
  if (manifest.digest !== release.manifestDigest) {
    throw new CatalogEvidenceInventoryError(
      'CANONICAL_RELEASE_CONTEXT_MISMATCH',
      'Catalog and Work Manifest do not describe one release.',
    );
  }

  const requiredCheckIds = [
    ...new Set(manifest.reviewUnits.flatMap((unit) => unit.checkIds)),
  ].sort();
  const releaseChecks = new Map(
    release.validationSummary.checks.map((check) => [check.checkId, check] as const),
  );
  if (
    releaseChecks.size !== release.validationSummary.checks.length ||
    !sameOrderedStrings(requiredCheckIds, [...releaseChecks.keys()].sort())
  ) {
    throw new CatalogEvidenceInventoryError(
      'MANIFEST_CHECK_INVENTORY_MISMATCH',
      'Catalog release checks must exactly cover Work Manifest check IDs.',
    );
  }
  const applicableChecks = requiredCheckIds.map((checkId) => {
    const check = releaseChecks.get(checkId);
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
    subjectDigest: release.contentFileInventoryDigest,
    reviewPolicy: manifest.reviewPolicy,
    applicableChecks,
    reviewItems,
  });
  return {
    subjectDigest: release.contentFileInventoryDigest,
    inventoryDigest,
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
    applicableChecks,
    reviewItems,
  };
};

export const CatalogReleaseEvidenceInventorySchema = strictObject({
  subjectDigest: Sha256Schema,
  checks: z.array(CatalogCheckReferenceSchema).min(1),
  reviews: z.array(CatalogReviewReferenceSchema).min(1),
  executableExampleEvidence: CatalogExecutableExampleEvidenceReferenceSchema.optional(),
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
type ExecutableExampleReference = z.infer<typeof CatalogExecutableExampleEvidenceReferenceSchema>;
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
  const reviewerIds = [evidence.reviewer.personId];
  const itemIds = evidence.reviewItems.map(({ reviewItemId }) => reviewItemId);
  const itemPaths = [...new Set(evidence.reviewItems.flatMap((item) => item.subjectPaths))];
  const itemOutcomeIds = [
    ...new Set(evidence.reviewItems.flatMap((item) => item.learningOutcomeIds)),
  ];
  const itemAuthorIds = [...new Set(evidence.reviewItems.flatMap((item) => item.authorIds))];
  const reviewerId = evidence.reviewer.personId;
  const allChecksPassed = evidence.applicableChecks.every(
    (check) =>
      check.subjectDigest === evidence.subjectDigest &&
      check.executedByReviewerId === reviewerId &&
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
    (evidence.reviewMode === 'self'
      ? authorIds.includes(reviewerId)
      : !authorIds.includes(reviewerId));
  const itemsAreOwnedAndReviewed =
    new Set(itemIds).size === itemIds.length &&
    evidence.reviewItems.every(
      (item) =>
        item.authorIds.every((authorId) => authorIds.includes(authorId)) &&
        item.reviewerId === reviewerId &&
        (evidence.reviewMode === 'self' || !item.authorIds.includes(item.reviewerId)),
    ) &&
    evidence.authors.every(
      (author) =>
        new Set(author.authoredItemIds).size === author.authoredItemIds.length &&
        author.authoredItemIds.every((itemId) => itemIds.includes(itemId)),
    ) &&
    evidence.reviewItems.every((item) =>
      authorIds.some((authorId) => item.authorIds.includes(authorId)),
    );
  const coverageIsComplete =
    sameStringSet(evidence.outcomeCoverageReview.subjectPaths, itemPaths) &&
    sameStringSet(evidence.outcomeCoverageReview.learningOutcomeIds, itemOutcomeIds) &&
    sameStringSet(evidence.outcomeCoverageReview.authorIds, itemAuthorIds) &&
    evidence.outcomeCoverageReview.authorIds.every((authorId) => authorIds.includes(authorId)) &&
    evidence.outcomeCoverageReview.reviewerId === reviewerId &&
    (evidence.reviewMode === 'self' ||
      !evidence.outcomeCoverageReview.authorIds.includes(reviewerId));

  if (
    !allChecksPassed ||
    checkSetDigest !== evidence.reviewerExecutedCheckSetDigest ||
    !countsAreComplete ||
    !authorsAndReviewersAreValid ||
    !itemsAreOwnedAndReviewed ||
    !coverageIsComplete ||
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
    !sameStringSet(reference.reviewerIds, [evidence.reviewer.personId]) ||
    reference.reviewMode !== evidence.reviewMode ||
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
    reviewerIds: [evidence.reviewer.personId],
    reviewMode: evidence.reviewMode,
    aggregatePassed: evidence.aggregatePassed,
  };
};

const verifyExecutableExampleReference = async (
  reference: ExecutableExampleReference,
  catalog: z.infer<typeof CatalogSchema>,
  repositoryRoot: string,
): Promise<NonNullable<TrustedCatalogReleaseEvidenceInventory['executableExampleEvidence']>> => {
  const expectedInventory = deriveExecutableExampleInventory(catalog);
  const expectedKeys = expectedInventory.map(executableExampleEvidenceLocatorKey);
  const expectedSubjectDigest = catalog.release.contentSnapshotDigest;
  if (reference.subjectDigest !== expectedSubjectDigest) {
    throw new CatalogEvidenceInventoryError(
      'EXECUTABLE_EXAMPLE_EVIDENCE_SUBJECT_MISMATCH',
      `${reference.path} is not scoped to the current Catalog snapshot.`,
    );
  }
  const file = await readPublicEvidenceFile(reference.path, repositoryRoot);
  if (file.digest !== reference.digest) {
    throw new CatalogEvidenceInventoryError(
      'EXECUTABLE_EXAMPLE_EVIDENCE_DIGEST_MISMATCH',
      `${reference.path} does not match its release inventory reference.`,
    );
  }
  const parsed = ExecutableExampleEvidenceSchema.safeParse(file.value);
  if (!parsed.success) {
    throw new CatalogEvidenceInventoryError(
      'EXECUTABLE_EXAMPLE_EVIDENCE_SCHEMA_INVALID',
      `${reference.path}: ${parsed.error.message}`,
    );
  }
  const evidence = parsed.data;
  const actualKeys = evidence.items.map(executableExampleEvidenceLocatorKey);
  if (
    evidence.subjectDigest !== expectedSubjectDigest ||
    evidence.inventoryDigest !== executableExampleInventoryDigest(catalog) ||
    evidence.inventoryCount !== expectedInventory.length ||
    evidence.checkedCount !== expectedInventory.length ||
    !evidence.aggregatePassed ||
    evidence.items.length !== expectedInventory.length ||
    !evidence.items.every((item) => item.passed && item.subjectDigest === expectedSubjectDigest) ||
    !sameStringSet(actualKeys, expectedKeys)
  ) {
    throw new CatalogEvidenceInventoryError(
      'EXECUTABLE_EXAMPLE_EVIDENCE_INVENTORY_MISMATCH',
      `${reference.path} does not exactly cover the Catalog executable-example inventory.`,
    );
  }
  return { path: reference.path, digest: file.digest, evidence };
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
  const catalogResult = CatalogSchema.safeParse(canonicalSources.catalog);
  if (!catalogResult.success) {
    throw new CatalogEvidenceInventoryError(
      'CATALOG_SCHEMA_INVALID',
      `Canonical Catalog: ${catalogResult.error.message}`,
    );
  }
  const expectedExecutableExampleCount = deriveExecutableExampleInventory(
    catalogResult.data,
  ).length;
  let executableExampleEvidence:
    NonNullable<TrustedCatalogReleaseEvidenceInventory['executableExampleEvidence']> | undefined;
  if (parsed.data.executableExampleEvidence) {
    if (expectedExecutableExampleCount === 0) {
      throw new CatalogEvidenceInventoryError(
        'EXECUTABLE_EXAMPLE_EVIDENCE_UNEXPECTED',
        'The release inventory references executable evidence but the Catalog has no executable examples.',
      );
    }
    executableExampleEvidence = await verifyExecutableExampleReference(
      parsed.data.executableExampleEvidence,
      catalogResult.data,
      repositoryRoot,
    );
  } else if (expectedExecutableExampleCount > 0) {
    throw new CatalogEvidenceInventoryError(
      'EXECUTABLE_EXAMPLE_EVIDENCE_REQUIRED',
      'The release inventory must reference evidence for every executable example.',
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
  const release = CatalogSchema.parse(canonicalSources.catalog).release;
  if (
    release.validationSummary.checks.length !== checks.length ||
    release.validationSummary.checks.some((reference) => {
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
    release.humanContentReviewEvidenceRefs.length !== reviews.length ||
    release.humanContentReviewEvidenceRefs.some((reference) => {
      const review = reviews.find(({ evidenceId }) => evidenceId === reference.evidenceId);
      return (
        review?.path !== reference.path ||
        review.digest !== reference.digest ||
        review.subjectDigest !== reference.subjectDigest ||
        review.reviewMode !== reference.reviewMode ||
        review.aggregatePassed !== reference.aggregatePassed
      );
    })
  ) {
    throw new CatalogEvidenceInventoryError(
      'RELEASE_EVIDENCE_MISMATCH',
      'Catalog release evidence references must exactly match verified evidence files.',
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
  return {
    subjectDigest,
    checks,
    reviews,
    ...(executableExampleEvidence ? { executableExampleEvidence } : {}),
  };
};
