import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { buildAdvancedSlotRegistry } from '../catalog/advanced-slot-registry.js';
import { parseAtCoderContestResourceUrl } from '../domain/schema-parts/catalog.js';
import {
  ContestSchema,
  ContestSlotRecordSchema,
  OfficialContestGapMetadataSchema,
  ProblemSchema,
  SourceRevisionSchema,
  TechniqueInventoryItemSchema,
} from '../domain/schema-parts/catalog.js';
import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { normalizeProblemLabel, stableContestId, stableProblemId } from '../domain/identity.js';
import { previewComponentOutputDigest } from '../preview/preview-chain.js';
import { refreezeVerifiedPreviewCohort } from './cohort.js';
import {
  BOOTSTRAP_FIRST_CONTEST_NUMBER,
  BOOTSTRAP_LAST_CONTEST_NUMBER,
  corpusBatches,
  officialContestGapDefinitions,
} from './batches.js';
import { reviewedProblemComplexity } from './technique-authoring.js';

const SHARD_COUNT = 6;
const SHARD_VERSION = 'sha256-first-uint32be-mod-6-v1';
const SHA_256 = /^[a-f0-9]{64}$/u;
const PREVIEW_ENTITY_ID = /^(?:preview|provisional)-/u;
const STAGING_PATH = /(?:^|[/\\])staging(?:[/\\]|$)/iu;

type Contest = z.infer<typeof ContestSchema>;
type ContestSlotRecord = z.infer<typeof ContestSlotRecordSchema>;
type Problem = z.infer<typeof ProblemSchema>;
type SourceRevision = z.infer<typeof SourceRevisionSchema>;
type TechniqueInventoryItem = z.infer<typeof TechniqueInventoryItemSchema>;

const nonEmptyText = z.string().trim().min(1);
const sha256 = z.string().regex(SHA_256);
const uniqueStrings = <Schema extends z.ZodType<string>>(schema: Schema) =>
  z.array(schema).superRefine((values, context) => {
    if (new Set(values).size !== values.length) {
      context.addIssue({ code: 'custom', message: 'Values must be unique.' });
    }
  });

const CandidateClassificationSchema = z.strictObject({
  domain: nonEmptyText,
  outcomeId: nonEmptyText,
  sourceRevisionIds: uniqueStrings(nonEmptyText).min(1),
  rationale: nonEmptyText,
});

const PreviewCohortCandidateSchema = z.strictObject({
  problemId: z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u),
  contestNumber: z.number().int().min(BOOTSTRAP_FIRST_CONTEST_NUMBER),
  officialTaskOrder: z.number().int().nonnegative(),
  advancedLabel: nonEmptyText,
  officialTaskId: z.string().regex(/^abc[0-9]{3,}_[a-z0-9_]+$/u),
  sourceRevisionIds: uniqueStrings(nonEmptyText),
  candidateDomains: uniqueStrings(nonEmptyText),
  candidateOutcomeIds: uniqueStrings(nonEmptyText),
  classifications: z.array(CandidateClassificationSchema),
  selectionEligible: z.boolean(),
  exclusionReason: nonEmptyText.nullable(),
  fixtureId: nonEmptyText.nullable(),
});

export const PreviewCandidatePoolSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  batchId: z.literal('abc212-abc263'),
  metadataBatchDigest: sha256,
  allowedDomains: uniqueStrings(nonEmptyText).min(1),
  sourceRevisionIds: uniqueStrings(nonEmptyText),
  candidates: z.array(PreviewCohortCandidateSchema),
  candidatePoolDigest: sha256,
});

const PreviewSeedRangeSchema = z.strictObject({
  firstContestNumber: z.literal(BOOTSTRAP_FIRST_CONTEST_NUMBER),
  lastContestNumber: z.literal(BOOTSTRAP_LAST_CONTEST_NUMBER),
  requireContinuity: z.literal(true),
});

const PreviewScopeRuleSchema = z.strictObject({
  anchorLabel: z.literal('D'),
  relation: z.literal('after_in_official_task_order'),
  labelRegistry: z.literal('dynamic_official_order_union'),
  requireOfficialStateForEveryRegistryLabel: z.literal(true),
});

const PreviewCohortRulesSchema = z.strictObject({
  domains: uniqueStrings(nonEmptyText).min(1),
  minimumProblemsPerDomain: z.number().int().positive(),
  minimumProblemsPerOutcome: z.number().int().positive(),
  minimumProblemCount: z.number().int().positive(),
  minimumContestCount: z.number().int().positive(),
  minimumAdvancedLabelCount: z.number().int().positive(),
  stableSortKeys: z.tuple([
    z.literal('contestNumber'),
    z.literal('officialTaskOrder'),
    z.literal('problemId'),
  ]),
  allowFixtureSupplement: z.boolean(),
  requireFixtureBoundaryDeclaration: z.boolean(),
});

const PreviewPublicationBoundarySchema = z.strictObject({
  allowedPreviewRoots: uniqueStrings(nonEmptyText).min(1),
  forbiddenPublicRoots: uniqueStrings(nonEmptyText).min(1),
});

export const FrozenPreviewCohortSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  phase: z.literal('cohort_frozen'),
  seedRange: PreviewSeedRangeSchema,
  scopeRule: PreviewScopeRuleSchema,
  cohortRules: PreviewCohortRulesSchema,
  publicationBoundary: PreviewPublicationBoundarySchema,
  frozenRulesDigest: sha256,
  candidatePoolDigest: sha256,
  metadataBatchDigest: sha256,
  selectedProblemIds: uniqueStrings(z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u)).min(1),
  sourceRevisionIds: uniqueStrings(nonEmptyText).min(1),
  fixtureBoundaries: z.array(
    z.strictObject({
      fixtureId: nonEmptyText,
      problemIds: uniqueStrings(z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u)).min(1),
    }),
  ),
  excludedProblemIds: uniqueStrings(z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u)),
  manifestDigest: sha256,
});

export const PreviewTechniqueInventoryComponentSchema = z.strictObject({
  componentId: z.literal('technique-inventory'),
  previewId: z.literal('initial-v1'),
  manifestDigest: sha256,
  problemIds: uniqueStrings(z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u)).min(1),
  inputDigest: sha256,
  artifactDigest: sha256,
  outputDigest: sha256,
});

export type PreviewCandidatePool = z.infer<typeof PreviewCandidatePoolSchema>;
export type FrozenPreviewCohort = z.infer<typeof FrozenPreviewCohortSchema>;
export type PreviewTechniqueInventoryComponent = z.infer<
  typeof PreviewTechniqueInventoryComponentSchema
>;

export interface CorpusInventoryLayout {
  readonly repositoryRoot: string;
  readonly contestRoots: readonly string[];
  readonly contestGapRoots: readonly string[];
  readonly contestSlotRoots: readonly string[];
  readonly problemRoots: readonly string[];
  readonly sourceRoots: readonly string[];
  readonly inventoryRoot: string;
  readonly previewInventoryRoot: string;
  readonly candidatePoolPath: string;
  readonly previewManifestPath: string;
  readonly previewComponentPath: string;
}

export const defaultCorpusInventoryLayout = (
  repositoryRoot = process.cwd(),
): CorpusInventoryLayout => ({
  repositoryRoot,
  contestRoots: corpusBatches.map(({ id }) => `src/content/contests/${id}`),
  contestGapRoots: corpusBatches.map(({ id }) => `src/content/contest-gaps/${id}`),
  contestSlotRoots: corpusBatches.map(({ id }) => `src/content/problem-slots/${id}`),
  problemRoots: corpusBatches.map(({ id }) => `src/content/problems/${id}`),
  sourceRoots: corpusBatches.map(({ id }) => `src/content/sources/${id}`),
  inventoryRoot: 'src/content/technique-inventory',
  previewInventoryRoot: 'staging/previews/initial-v1/technique-inventory',
  candidatePoolPath: 'staging/previews/initial-v1/candidate-pool.json',
  previewManifestPath: 'staging/previews/initial-v1/preview-manifest.json',
  previewComponentPath: 'docs/verification/previews/initial-v1/components/technique-inventory.json',
});

export class CorpusInventoryLoadError extends Error {
  readonly code: string;
  readonly artifactPath: string | null;

  constructor(code: string, message: string, artifactPath: string | null = null) {
    super(`${code}: ${message}`);
    this.code = code;
    this.artifactPath = artifactPath;
    this.name = 'CorpusInventoryLoadError';
  }
}

export interface LoadedEntity<Entity> {
  readonly path: string;
  readonly entity: Entity;
}

export interface LoadedInventoryEntity extends LoadedEntity<TechniqueInventoryItem> {
  readonly shardId: string;
}

export interface LoadedTechniqueInventoryCorpus {
  readonly contests: readonly LoadedEntity<Contest>[];
  readonly contestGaps: readonly LoadedEntity<z.infer<typeof OfficialContestGapMetadataSchema>>[];
  readonly contestSlots: readonly LoadedEntity<ContestSlotRecord>[];
  readonly problems: readonly LoadedEntity<Problem>[];
  readonly sources: readonly LoadedEntity<SourceRevision>[];
  readonly inventory: readonly LoadedInventoryEntity[];
  readonly previewInventory: readonly LoadedEntity<TechniqueInventoryItem>[];
  readonly candidatePool: PreviewCandidatePool;
  readonly previewManifest: FrozenPreviewCohort;
  readonly previewComponent: PreviewTechniqueInventoryComponent;
}

export interface CorpusInventoryDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly entityId: string | null;
}

export interface TechniqueInventoryShardEvidence {
  readonly shardId: string;
  readonly problemCount: number;
  readonly problemIds: readonly string[];
  readonly problemIdsDigest: string;
  readonly contentDigest: string;
}

export interface TechniqueInventoryEvidence {
  readonly schemaVersion: '1.0.0';
  readonly evidenceId: 'bootstrap-technique-inventory';
  readonly status: 'passed' | 'failed';
  readonly shardAlgorithm: typeof SHARD_VERSION;
  readonly scope: {
    readonly firstContestNumber: number;
    readonly lastContestNumber: number;
    readonly contestCount: number;
    readonly officialContestGapNumbers: readonly number[];
    readonly advancedSlotLabels: readonly string[];
    readonly slotCount: number;
    readonly problemCount: number;
    readonly sourceRevisionCount: number;
    readonly inventoryCount: number;
    readonly reviewedInventoryCount: number;
    readonly draftInventoryCount: number;
  };
  readonly cohort: {
    readonly previewId: 'initial-v1';
    readonly candidatePoolDigest: string;
    readonly metadataBatchDigest: string;
    readonly manifestDigest: string;
    readonly selectedProblemIds: readonly string[];
    readonly selectedCanonicalProblemCount: number;
    readonly selectedFixtureProblemCount: number;
    readonly previewInventoryDigest: string;
    readonly previewComponentDigest: string;
  };
  readonly metadataDigest: string;
  readonly inventoryDigest: string;
  readonly corpusDigest: string;
  readonly shards: readonly TechniqueInventoryShardEvidence[];
  readonly diagnostics: readonly CorpusInventoryDiagnostic[];
  readonly evidenceDigest: string;
}

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = (values: readonly string[]): string[] =>
  [...new Set(values)].sort(compareCodeUnits);

const sameOrderedValues = <Value>(left: readonly Value[], right: readonly Value[]): boolean =>
  left.length === right.length && left.every((value, index) => Object.is(value, right[index]));

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean =>
  sameOrderedValues(sortedUnique(left), sortedUnique(right));

const withoutManifestDigest = <Value extends { readonly manifestDigest: string }>(
  value: Value,
): Omit<Value, 'manifestDigest'> => {
  const { manifestDigest: _manifestDigest, ...subject } = value;
  void _manifestDigest;
  return subject;
};

/**
 * Stable six-way sharding for T038-T043.
 *
 * Normalize the stable Problem ID to NFC, SHA-256 its UTF-8 bytes, interpret the
 * first four digest bytes as an unsigned big-endian integer, then take modulo 6.
 * The rule never depends on file order, process hash seeds, or locale behavior.
 */
export const techniqueInventoryShardNumber = (problemId: string): number => {
  const parsedProblemId = ProblemSchema.shape.id.parse(problemId);
  const digest = createHash('sha256').update(parsedProblemId.normalize('NFC'), 'utf8').digest();
  return digest.readUInt32BE(0) % SHARD_COUNT;
};

export const techniqueInventoryShardId = (problemId: string): string =>
  `shard-${techniqueInventoryShardNumber(problemId).toString().padStart(2, '0')}`;

export const techniqueInventoryShardIds = Object.freeze(
  Array.from(
    { length: SHARD_COUNT },
    (_unused, index) => `shard-${index.toString().padStart(2, '0')}`,
  ),
);

const assertRepositoryRelativePath = (value: string): void => {
  if (
    value.length === 0 ||
    path.isAbsolute(value) ||
    value.split(/[\\/]/u).some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new CorpusInventoryLoadError(
      'CORPUS_PATH_INVALID',
      `Expected a normalized repository-relative path: ${value}`,
      value,
    );
  }
};

const resolveInsideRepository = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<{ readonly absolutePath: string; readonly relativePath: string }> => {
  assertRepositoryRelativePath(relativePath);
  const resolvedRoot = await realpath(repositoryRoot);
  const absolutePath = path.resolve(resolvedRoot, relativePath);
  const relative = path.relative(resolvedRoot, absolutePath);
  if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw new CorpusInventoryLoadError(
      'CORPUS_PATH_ESCAPE',
      `${relativePath} escapes the repository.`,
      relativePath,
    );
  }
  try {
    const resolvedTarget = await realpath(absolutePath);
    const targetRelative = path.relative(resolvedRoot, resolvedTarget);
    if (
      targetRelative === '..' ||
      targetRelative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(targetRelative)
    ) {
      throw new CorpusInventoryLoadError(
        'CORPUS_PATH_ESCAPE',
        `${relativePath} resolves outside the repository.`,
        relativePath,
      );
    }
    if (resolvedTarget !== absolutePath) {
      throw new CorpusInventoryLoadError(
        'CORPUS_SYMLINK_REJECTED',
        `Symlinked path components are not accepted: ${relativePath}`,
        relativePath,
      );
    }
  } catch (error) {
    if (error instanceof CorpusInventoryLoadError) throw error;
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new CorpusInventoryLoadError(
        'CORPUS_PATH_RESOLUTION_FAILED',
        error instanceof Error ? error.message : String(error),
        relativePath,
      );
    }
  }
  return { absolutePath, relativePath: relative.split(path.sep).join('/') };
};

const assertNotSymlink = async (absolutePath: string, relativePath: string): Promise<void> => {
  let stats;
  try {
    stats = await lstat(absolutePath);
  } catch (error) {
    throw new CorpusInventoryLoadError(
      'CORPUS_PATH_MISSING',
      error instanceof Error ? error.message : String(error),
      relativePath,
    );
  }
  if (stats.isSymbolicLink()) {
    throw new CorpusInventoryLoadError(
      'CORPUS_SYMLINK_REJECTED',
      `Symlinks are not accepted: ${relativePath}`,
      relativePath,
    );
  }
};

const readJson = async (absolutePath: string, relativePath: string): Promise<unknown> => {
  await assertNotSymlink(absolutePath, relativePath);
  let text: string;
  try {
    text = await readFile(absolutePath, 'utf8');
  } catch (error) {
    throw new CorpusInventoryLoadError(
      'CORPUS_FILE_READ_FAILED',
      error instanceof Error ? error.message : String(error),
      relativePath,
    );
  }
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new CorpusInventoryLoadError(
      'CORPUS_JSON_INVALID',
      error instanceof Error ? error.message : String(error),
      relativePath,
    );
  }
};

const parseJson = async <Schema extends z.ZodType>(
  absolutePath: string,
  relativePath: string,
  schema: Schema,
): Promise<z.output<Schema>> => {
  const parsed = schema.safeParse(await readJson(absolutePath, relativePath));
  if (!parsed.success) {
    throw new CorpusInventoryLoadError('CORPUS_SCHEMA_INVALID', parsed.error.message, relativePath);
  }
  return parsed.data;
};

const walkJsonFiles = async (
  absoluteRoot: string,
  relativeRoot: string,
): Promise<readonly { readonly absolutePath: string; readonly relativePath: string }[]> => {
  await assertNotSymlink(absoluteRoot, relativeRoot);
  const rootStats = await lstat(absoluteRoot);
  if (!rootStats.isDirectory()) {
    throw new CorpusInventoryLoadError('CORPUS_ROOT_NOT_DIRECTORY', relativeRoot, relativeRoot);
  }
  const files: { absolutePath: string; relativePath: string }[] = [];
  const visit = async (absoluteDirectory: string, relativeDirectory: string): Promise<void> => {
    const entries = (await readdir(absoluteDirectory, { withFileTypes: true })).sort(
      (left, right) => compareCodeUnits(left.name, right.name),
    );
    for (const entry of entries) {
      const absoluteEntry = path.join(absoluteDirectory, entry.name);
      const relativeEntry = `${relativeDirectory}/${entry.name}`;
      if (entry.isSymbolicLink()) {
        throw new CorpusInventoryLoadError('CORPUS_SYMLINK_REJECTED', relativeEntry, relativeEntry);
      }
      if (entry.isDirectory()) {
        await visit(absoluteEntry, relativeEntry);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push({ absolutePath: absoluteEntry, relativePath: relativeEntry });
      } else if (!(entry.isFile() && entry.name === '.gitkeep')) {
        throw new CorpusInventoryLoadError('CORPUS_UNEXPECTED_ENTRY', relativeEntry, relativeEntry);
      }
    }
  };
  await visit(absoluteRoot, relativeRoot);
  return files;
};

const assertFlatFile = (root: string, file: string): void => {
  const relative = path.posix.relative(root, file);
  if (relative.includes('/')) {
    throw new CorpusInventoryLoadError(
      'CORPUS_NESTING_REJECTED',
      `Canonical entity roots accept JSON files directly under the batch directory: ${file}`,
      file,
    );
  }
};

const loadEntityRoots = async <Schema extends z.ZodType>(
  repositoryRoot: string,
  roots: readonly string[],
  schema: Schema,
  expectedFileName: (entity: z.output<Schema>) => string,
): Promise<readonly LoadedEntity<z.output<Schema>>[]> => {
  const loaded: LoadedEntity<z.output<Schema>>[] = [];
  for (const root of roots) {
    const resolved = await resolveInsideRepository(repositoryRoot, root);
    for (const file of await walkJsonFiles(resolved.absolutePath, resolved.relativePath)) {
      assertFlatFile(resolved.relativePath, file.relativePath);
      const entity = await parseJson(file.absolutePath, file.relativePath, schema);
      const expected = expectedFileName(entity);
      if (path.posix.basename(file.relativePath) !== expected) {
        throw new CorpusInventoryLoadError(
          'CORPUS_FILENAME_MISMATCH',
          `${file.relativePath} must be named ${expected}.`,
          file.relativePath,
        );
      }
      loaded.push({
        path: file.relativePath,
        entity,
      });
    }
  }
  return loaded;
};

const assertCanonicalBatchRoots = (kind: string, roots: readonly string[]): void => {
  const expected = corpusBatches.map(({ id }) => id).sort(compareCodeUnits);
  const actual = roots
    .map((root) => {
      assertRepositoryRelativePath(root);
      return root.split(/[\\/]/u).at(-1) ?? '';
    })
    .sort(compareCodeUnits);
  if (!sameOrderedValues(actual, expected)) {
    throw new CorpusInventoryLoadError(
      'CORPUS_BATCH_ROOT_SET_INVALID',
      `${kind}: expected=[${expected.join(',')}], actual=[${actual.join(',')}]`,
    );
  }
};

const loadCanonicalInventory = async (
  repositoryRoot: string,
  inventoryRoot: string,
): Promise<readonly LoadedInventoryEntity[]> => {
  const resolved = await resolveInsideRepository(repositoryRoot, inventoryRoot);
  await assertNotSymlink(resolved.absolutePath, resolved.relativePath);
  const rootEntries = (await readdir(resolved.absolutePath, { withFileTypes: true })).sort(
    (left, right) => compareCodeUnits(left.name, right.name),
  );
  const expected = new Set(techniqueInventoryShardIds);
  const actualDirectories = new Set(
    rootEntries.filter((entry) => entry.isDirectory()).map(({ name }) => name),
  );
  const missing = techniqueInventoryShardIds.filter((shardId) => !actualDirectories.has(shardId));
  const extra = [...actualDirectories].filter((shardId) => !expected.has(shardId));
  if (missing.length > 0 || extra.length > 0) {
    throw new CorpusInventoryLoadError(
      'INVENTORY_SHARD_SET_INVALID',
      `missing=[${missing.join(',')}], extra=[${extra.join(',')}]`,
      inventoryRoot,
    );
  }
  for (const entry of rootEntries) {
    if (entry.isSymbolicLink()) {
      throw new CorpusInventoryLoadError(
        'CORPUS_SYMLINK_REJECTED',
        `${inventoryRoot}/${entry.name}`,
        `${inventoryRoot}/${entry.name}`,
      );
    }
    if (!entry.isDirectory() && !(entry.isFile() && entry.name === '.gitkeep')) {
      throw new CorpusInventoryLoadError(
        'CORPUS_UNEXPECTED_ENTRY',
        `${inventoryRoot}/${entry.name}`,
        `${inventoryRoot}/${entry.name}`,
      );
    }
  }

  const loaded: LoadedInventoryEntity[] = [];
  for (const shardId of techniqueInventoryShardIds) {
    const absoluteShard = path.join(resolved.absolutePath, shardId);
    const relativeShard = `${resolved.relativePath}/${shardId}`;
    await assertNotSymlink(absoluteShard, relativeShard);
    const entries = (await readdir(absoluteShard, { withFileTypes: true })).sort((left, right) =>
      compareCodeUnits(left.name, right.name),
    );
    for (const entry of entries) {
      const relativeFile = `${relativeShard}/${entry.name}`;
      if (entry.isSymbolicLink() || entry.isDirectory()) {
        throw new CorpusInventoryLoadError(
          entry.isSymbolicLink() ? 'CORPUS_SYMLINK_REJECTED' : 'INVENTORY_NESTING_REJECTED',
          relativeFile,
          relativeFile,
        );
      }
      if (entry.name === '.gitkeep') continue;
      if (!entry.isFile() || !entry.name.endsWith('.json')) {
        throw new CorpusInventoryLoadError('CORPUS_UNEXPECTED_ENTRY', relativeFile, relativeFile);
      }
      const entity = await parseJson(
        path.join(absoluteShard, entry.name),
        relativeFile,
        TechniqueInventoryItemSchema,
      );
      if (entry.name !== `${entity.problemId}.json`) {
        throw new CorpusInventoryLoadError(
          'INVENTORY_FILENAME_MISMATCH',
          `${relativeFile} must be named ${entity.problemId}.json.`,
          relativeFile,
        );
      }
      loaded.push({ path: relativeFile, shardId, entity });
    }
  }
  return loaded;
};

const loadPreviewInventory = async (
  repositoryRoot: string,
  previewInventoryRoot: string,
): Promise<readonly LoadedEntity<TechniqueInventoryItem>[]> => {
  const resolved = await resolveInsideRepository(repositoryRoot, previewInventoryRoot);
  const loaded: LoadedEntity<TechniqueInventoryItem>[] = [];
  for (const file of await walkJsonFiles(resolved.absolutePath, resolved.relativePath)) {
    assertFlatFile(resolved.relativePath, file.relativePath);
    const entity = await parseJson(
      file.absolutePath,
      file.relativePath,
      TechniqueInventoryItemSchema,
    );
    if (path.basename(file.relativePath) !== `${entity.problemId}.json`) {
      throw new CorpusInventoryLoadError(
        'INVENTORY_FILENAME_MISMATCH',
        `${file.relativePath} must be named ${entity.problemId}.json.`,
        file.relativePath,
      );
    }
    loaded.push({ path: file.relativePath, entity });
  }
  return loaded;
};

const loadSingleJson = async <Schema extends z.ZodType>(
  repositoryRoot: string,
  relativePath: string,
  schema: Schema,
): Promise<z.output<Schema>> => {
  const resolved = await resolveInsideRepository(repositoryRoot, relativePath);
  return parseJson(resolved.absolutePath, resolved.relativePath, schema);
};

export const buildPreviewTechniqueInventoryComponent = (input: {
  readonly manifest: FrozenPreviewCohort;
  readonly previewInventory: readonly TechniqueInventoryItem[];
}): PreviewTechniqueInventoryComponent => {
  const items = [...input.previewInventory].sort((left, right) =>
    compareCodeUnits(left.problemId, right.problemId),
  );
  const subject = {
    componentId: 'technique-inventory' as const,
    previewId: 'initial-v1' as const,
    manifestDigest: input.manifest.manifestDigest,
    problemIds: input.manifest.selectedProblemIds,
    inputDigest: input.manifest.manifestDigest,
    artifactDigest: canonicalDigest({ items }),
  };
  return {
    ...subject,
    outputDigest: previewComponentOutputDigest(subject),
  };
};

export interface LoadTechniqueInventoryCorpusOptions {
  /** Build the T038 component in memory so an explicit writer can atomically commit it. */
  readonly synthesizePreviewComponent?: boolean;
}

/** Load every T032-T044 artifact through strict, unknown-field-rejecting schemas. */
export const loadTechniqueInventoryCorpus = async (
  layout: CorpusInventoryLayout,
  options: LoadTechniqueInventoryCorpusOptions = {},
): Promise<LoadedTechniqueInventoryCorpus> => {
  assertCanonicalBatchRoots('contests', layout.contestRoots);
  assertCanonicalBatchRoots('contest gaps', layout.contestGapRoots);
  assertCanonicalBatchRoots('contest slots', layout.contestSlotRoots);
  assertCanonicalBatchRoots('problems', layout.problemRoots);
  assertCanonicalBatchRoots('sources', layout.sourceRoots);
  const [
    contests,
    contestGaps,
    contestSlots,
    problems,
    sources,
    inventory,
    previewInventory,
    candidatePool,
    previewManifest,
    loadedPreviewComponent,
  ] = await Promise.all([
    loadEntityRoots(
      layout.repositoryRoot,
      layout.contestRoots,
      ContestSchema,
      ({ id }) => `${id}.json`,
    ),
    loadEntityRoots(
      layout.repositoryRoot,
      layout.contestGapRoots,
      OfficialContestGapMetadataSchema,
      ({ contestId }) => `${contestId}.json`,
    ),
    loadEntityRoots(
      layout.repositoryRoot,
      layout.contestSlotRoots,
      ContestSlotRecordSchema,
      ({ contestId, label }) => `${contestId}-${normalizeProblemLabel(label)}.json`,
    ),
    loadEntityRoots(
      layout.repositoryRoot,
      layout.problemRoots,
      ProblemSchema,
      ({ id }) => `${id}.json`,
    ),
    loadEntityRoots(
      layout.repositoryRoot,
      layout.sourceRoots,
      SourceRevisionSchema,
      ({ id }) => `${id}.json`,
    ),
    loadCanonicalInventory(layout.repositoryRoot, layout.inventoryRoot),
    loadPreviewInventory(layout.repositoryRoot, layout.previewInventoryRoot),
    loadSingleJson(layout.repositoryRoot, layout.candidatePoolPath, PreviewCandidatePoolSchema),
    loadSingleJson(layout.repositoryRoot, layout.previewManifestPath, FrozenPreviewCohortSchema),
    options.synthesizePreviewComponent
      ? Promise.resolve(null)
      : loadSingleJson(
          layout.repositoryRoot,
          layout.previewComponentPath,
          PreviewTechniqueInventoryComponentSchema,
        ),
  ]);
  const previewComponent =
    loadedPreviewComponent ??
    buildPreviewTechniqueInventoryComponent({
      manifest: previewManifest,
      previewInventory: previewInventory.map(({ entity }) => entity),
    });
  return {
    contests,
    contestGaps,
    contestSlots,
    problems,
    sources,
    inventory,
    previewInventory,
    candidatePool,
    previewManifest,
    previewComponent,
  };
};

const entityValues = <Entity>(items: readonly LoadedEntity<Entity>[]): readonly Entity[] =>
  items.map(({ entity }) => entity);

const duplicateValues = (values: readonly string[]): readonly string[] => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter((entry) => entry[1] > 1)
    .map(([value]) => value)
    .sort(compareCodeUnits);
};

const compareCandidates = (
  left: PreviewCandidatePool['candidates'][number],
  right: PreviewCandidatePool['candidates'][number],
): number =>
  left.contestNumber - right.contestNumber ||
  left.officialTaskOrder - right.officialTaskOrder ||
  compareCodeUnits(left.problemId, right.problemId);

const compareContests = (left: Contest, right: Contest): number =>
  left.number - right.number || compareCodeUnits(left.id, right.id);

const compareSlots = (left: ContestSlotRecord, right: ContestSlotRecord): number =>
  compareCodeUnits(left.contestId, right.contestId) ||
  (left.officialOrder ?? Number.MAX_SAFE_INTEGER) -
    (right.officialOrder ?? Number.MAX_SAFE_INTEGER) ||
  compareCodeUnits(left.label, right.label);

const compareProblems = (left: Problem, right: Problem): number =>
  compareCodeUnits(left.id, right.id);

const compareSources = (left: SourceRevision, right: SourceRevision): number =>
  compareCodeUnits(left.id, right.id);

const compareInventory = (left: TechniqueInventoryItem, right: TechniqueInventoryItem): number =>
  compareCodeUnits(left.problemId, right.problemId);

const expectedBatchId = (contestId: string): string | null => {
  const contestNumber = Number(contestId.slice(3));
  return (
    corpusBatches.find(
      ({ firstContestNumber, lastContestNumber }) =>
        contestNumber >= firstContestNumber && contestNumber <= lastContestNumber,
    )?.id ?? null
  );
};

const pathHasBatch = (artifactPath: string, batchId: string): boolean =>
  artifactPath.split('/').includes(batchId);

/**
 * Recompute the T032 candidate-pool metadata subject from canonical observed data.
 * Derived final-registry `official_absent` rows are deliberately excluded.
 */
export const candidatePoolMetadataBatchDigest = (
  corpus: Pick<
    LoadedTechniqueInventoryCorpus,
    'contests' | 'contestSlots' | 'problems' | 'sources'
  >,
): string => {
  const contests = entityValues(corpus.contests)
    .filter(({ number }) => number >= 212 && number <= 263)
    .sort(compareContests);
  const contestIds = new Set(contests.map(({ id }) => id));
  const contestSlots = entityValues(corpus.contestSlots)
    .filter((slot) => contestIds.has(slot.contestId) && slot.availability !== 'official_absent')
    .sort(compareSlots);
  const problems = entityValues(corpus.problems)
    .filter(({ contestId }) => contestIds.has(contestId))
    .sort(compareProblems);
  const sources = entityValues(corpus.sources)
    .filter(({ contestId }) => contestId !== null && contestIds.has(contestId))
    .sort(compareSources);
  return canonicalDigest({
    batchId: 'abc212-abc263',
    contests,
    contestSlots,
    problems,
    sources,
  });
};

const containsPreviewLeakage = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return PREVIEW_ENTITY_ID.test(value) || STAGING_PATH.test(value);
  }
  if (Array.isArray(value)) return value.some(containsPreviewLeakage);
  if (value !== null && typeof value === 'object') {
    return Object.values(value as Readonly<Record<string, unknown>>).some(containsPreviewLeakage);
  }
  return false;
};

const PLACEHOLDER_TEXT =
  /(?:\b(?:todo|tbd|unknown|unclear)\b|不明|要確認|公式解説(?:を)?参照|see\s+(?:the\s+)?official\s+editorial)/iu;
const ASYMPTOTIC_NOTATION = /(?:O|Θ)\s*\([^()\r\n]+\)/u;
const codePointLength = (value: string): number => Array.from(value.trim()).length;
const hasShallowInventoryAnalysis = (item: TechniqueInventoryItem): boolean =>
  codePointLength(item.coreMethod) < 20 ||
  item.proofIdeas.some((proofIdea) => codePointLength(proofIdea) < 15) ||
  item.outcomeCandidates.some((outcome) => codePointLength(outcome) < 15);
const hasExplicitAsymptoticComplexity = (item: TechniqueInventoryItem): boolean => {
  const complexity = item.asymptoticComplexity;
  if (!complexity) return true;
  return (
    (complexity.time === undefined || ASYMPTOTIC_NOTATION.test(complexity.time)) &&
    (complexity.space === undefined || ASYMPTOTIC_NOTATION.test(complexity.space))
  );
};
const hasOnlyReviewedProblemComplexity = (item: TechniqueInventoryItem): boolean => {
  const expectedTime = reviewedProblemComplexity(item.problemId);
  const complexity = item.asymptoticComplexity;
  if (expectedTime === undefined) return complexity === undefined;
  return (
    complexity !== undefined &&
    complexity.space === undefined &&
    complexity.time?.startsWith(`${expectedTime}（公式解法全体。`) === true
  );
};
const hasInventoryPlaceholder = (item: TechniqueInventoryItem): boolean =>
  PLACEHOLDER_TEXT.test(JSON.stringify(item));

const inventorySourceIsProblemBound = (source: SourceRevision, problem: Problem): boolean =>
  source.sourceKind === 'official_problem' &&
  source.contestId === problem.contestId &&
  source.officialTaskId === problem.officialTaskId;

const sourceIsConsistentWithProblem = (source: SourceRevision, problem: Problem): boolean =>
  source.contestId === problem.contestId && source.officialTaskId === problem.officialTaskId;

/** Recompute every semantic T044 gate from the loaded tree. */
export const validateTechniqueInventoryCorpus = (
  corpus: LoadedTechniqueInventoryCorpus,
): readonly CorpusInventoryDiagnostic[] => {
  const diagnostics: CorpusInventoryDiagnostic[] = [];
  const add = (code: string, message: string, entityId: string | null = null): void => {
    diagnostics.push({ code, message, entityId });
  };
  const contests = entityValues(corpus.contests);
  const contestGaps = entityValues(corpus.contestGaps);
  const slots = entityValues(corpus.contestSlots);
  const problems = entityValues(corpus.problems);
  const sources = entityValues(corpus.sources);
  const inventory = corpus.inventory.map(({ entity }) => entity);
  const previewInventory = entityValues(corpus.previewInventory);

  for (const duplicate of duplicateValues(contests.map(({ id }) => id))) {
    add('DUPLICATE_CONTEST_ID', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(contestGaps.map(({ contestId }) => contestId))) {
    add('DUPLICATE_CONTEST_GAP_ID', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(
    slots.map(({ contestId, label }) => `${contestId}:${label}`),
  )) {
    add('DUPLICATE_CONTEST_SLOT', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(problems.map(({ id }) => id))) {
    add('DUPLICATE_PROBLEM_ID', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(sources.map(({ id }) => id))) {
    add('DUPLICATE_SOURCE_REVISION_ID', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(inventory.map(({ problemId }) => problemId))) {
    add('DUPLICATE_TECHNIQUE_INVENTORY_PROBLEM', duplicate, duplicate);
  }
  for (const duplicate of duplicateValues(previewInventory.map(({ problemId }) => problemId))) {
    add('DUPLICATE_PREVIEW_INVENTORY_PROBLEM', duplicate, duplicate);
  }

  const contestById = new Map(contests.map((contest) => [contest.id, contest]));
  const slotByKey = new Map(slots.map((slot) => [`${slot.contestId}:${slot.label}`, slot]));
  const problemById = new Map(problems.map((problem) => [problem.id, problem]));
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const inventoryByProblemId = new Map(inventory.map((item) => [item.problemId, item]));
  const previewInventoryByProblemId = new Map(
    previewInventory.map((item) => [item.problemId, item]),
  );

  for (const loaded of corpus.contests) {
    const batchId = expectedBatchId(loaded.entity.id);
    if (batchId === null || !pathHasBatch(loaded.path, batchId)) {
      add('CORPUS_BATCH_PATH_MISMATCH', loaded.path, loaded.entity.id);
    }
    if (containsPreviewLeakage(loaded.entity) || STAGING_PATH.test(loaded.path)) {
      add('PREVIEW_LEAKAGE_IN_CANONICAL_CONTEST', loaded.path, loaded.entity.id);
    }
  }
  for (const loaded of corpus.contestGaps) {
    const batchId = expectedBatchId(loaded.entity.contestId);
    if (batchId === null || !pathHasBatch(loaded.path, batchId)) {
      add('CORPUS_BATCH_PATH_MISMATCH', loaded.path, loaded.entity.contestId);
    }
    if (containsPreviewLeakage(loaded.entity) || STAGING_PATH.test(loaded.path)) {
      add('PREVIEW_LEAKAGE_IN_CONTEST_GAP_EVIDENCE', loaded.path, loaded.entity.contestId);
    }
  }
  for (const loaded of corpus.contestSlots) {
    const batchId = expectedBatchId(loaded.entity.contestId);
    const entityId = `${loaded.entity.contestId}:${loaded.entity.label}`;
    if (batchId === null || !pathHasBatch(loaded.path, batchId)) {
      add('CORPUS_BATCH_PATH_MISMATCH', loaded.path, entityId);
    }
    if (containsPreviewLeakage(loaded.entity) || STAGING_PATH.test(loaded.path)) {
      add('PREVIEW_LEAKAGE_IN_CANONICAL_CONTEST_SLOT', loaded.path, entityId);
    }
  }
  for (const loaded of corpus.problems) {
    const batchId = expectedBatchId(loaded.entity.contestId);
    if (batchId === null || !pathHasBatch(loaded.path, batchId)) {
      add('CORPUS_BATCH_PATH_MISMATCH', loaded.path, loaded.entity.id);
    }
  }
  for (const loaded of corpus.sources) {
    const contestId = loaded.entity.contestId;
    const batchId = contestId === null ? null : expectedBatchId(contestId);
    if (batchId === null || !pathHasBatch(loaded.path, batchId)) {
      add('CORPUS_BATCH_PATH_MISMATCH', loaded.path, loaded.entity.id);
    }
    if (containsPreviewLeakage(loaded.entity) || STAGING_PATH.test(loaded.path)) {
      add('PREVIEW_LEAKAGE_IN_CANONICAL_SOURCE', loaded.path, loaded.entity.id);
    }
  }

  const expectedContestNumbers = Array.from(
    {
      length: BOOTSTRAP_LAST_CONTEST_NUMBER - BOOTSTRAP_FIRST_CONTEST_NUMBER + 1,
    },
    (_unused, index) => BOOTSTRAP_FIRST_CONTEST_NUMBER + index,
  );
  const actualContestNumbers = [...contests, ...contestGaps]
    .sort((left, right) => left.number - right.number)
    .map(({ number }) => number);
  if (
    !sameOrderedValues(actualContestNumbers.map(String), expectedContestNumbers.map(String)) ||
    contests.some(({ id, number }) => id !== stableContestId(number))
  ) {
    add(
      'CONTEST_RANGE_INCOMPLETE',
      `Expected every Contest from ABC ${String(BOOTSTRAP_FIRST_CONTEST_NUMBER)} through ${String(BOOTSTRAP_LAST_CONTEST_NUMBER)} exactly once.`,
    );
  }
  const expectedGapByNumber = new Map<number, (typeof officialContestGapDefinitions)[number]>(
    officialContestGapDefinitions.map((definition) => [definition.number, definition]),
  );
  if (contestGaps.length !== officialContestGapDefinitions.length) {
    add(
      'OFFICIAL_CONTEST_GAP_EVIDENCE_INCOMPLETE',
      `Expected ${String(officialContestGapDefinitions.length)} official gap records; received ${String(contestGaps.length)}.`,
    );
  }
  for (const gap of contestGaps) {
    const expected = expectedGapByNumber.get(gap.number);
    const batchId = expectedBatchId(gap.contestId);
    const batchContests = contests.filter(
      ({ id }) => batchId !== null && expectedBatchId(id) === batchId,
    );
    const batchSources = sources.filter(
      ({ contestId }) =>
        contestId !== null && batchId !== null && expectedBatchId(contestId) === batchId,
    );
    if (
      gap.contestId !== expected?.contestId ||
      gap.evidenceUrl !== expected.evidenceUrl ||
      gap.evidenceAssertion !== expected.evidenceAssertion ||
      !batchContests.every(({ checkedAt }) => checkedAt === gap.checkedAt) ||
      !batchSources.every(({ termsCheckedAt }) => termsCheckedAt === gap.termsCheckedAt)
    ) {
      add('OFFICIAL_CONTEST_GAP_EVIDENCE_INVALID', gap.contestId, gap.contestId);
    }
  }
  for (const contest of contests) {
    if (expectedGapByNumber.has(contest.number)) {
      add('OFFICIAL_CONTEST_GAP_MATERIALIZED_AS_CONTEST', contest.id, contest.id);
    }
  }

  let registryLabels: readonly string[] = [];
  try {
    registryLabels = buildAdvancedSlotRegistry({
      contests: [...contests].sort(compareContests).map((contest) => ({
        contestId: contest.id,
        advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
        sourceRevisionId: contest.taskOrderSourceRevisionId,
      })),
    }).labels;
  } catch (error) {
    add('ADVANCED_SLOT_REGISTRY_INVALID', error instanceof Error ? error.message : String(error));
  }

  for (const source of sources) {
    const contest = source.contestId === null ? undefined : contestById.get(source.contestId);
    if (!contest) {
      add('SOURCE_REVISION_CONTEST_ORPHAN', source.id, source.id);
      continue;
    }
    if (
      source.officialTaskId !== null &&
      !contest.officialTaskIds.includes(source.officialTaskId)
    ) {
      add('SOURCE_REVISION_TASK_MAPPING_MISMATCH', source.officialTaskId, source.id);
    }
  }
  const referencedSourceIds = new Set([
    ...contests.map(({ taskOrderSourceRevisionId }) => taskOrderSourceRevisionId),
    ...problems.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ...sources
      .filter(
        ({ sourceKind, officialTaskId }) =>
          sourceKind === 'official_editorial' && officialTaskId === null,
      )
      .map(({ id }) => id),
  ]);
  for (const source of sources) {
    if (!referencedSourceIds.has(source.id)) {
      add('SOURCE_REVISION_ORPHAN', source.id, source.id);
    }
  }

  for (const contest of contests) {
    const dIndex = contest.officialTaskOrder.indexOf('D');
    if (dIndex < 0 || contest.officialTaskIds.length !== contest.officialTaskOrder.length) {
      add('OFFICIAL_TASK_MAPPING_INVALID', contest.id, contest.id);
      continue;
    }
    const taskOrderSource = sourceById.get(contest.taskOrderSourceRevisionId);
    const taskOrderSourceUrl = taskOrderSource
      ? parseAtCoderContestResourceUrl(taskOrderSource.url)
      : null;
    if (
      taskOrderSource?.sourceKind !== 'official_contest' ||
      taskOrderSource.contestId !== contest.id ||
      taskOrderSourceUrl?.resource !== 'tasks'
    ) {
      add('CONTEST_TASK_ORDER_SOURCE_MISMATCH', contest.taskOrderSourceRevisionId, contest.id);
    }
    const editorialIndexSources = sources.filter((source) => {
      const locator = parseAtCoderContestResourceUrl(source.url);
      return (
        source.contestId === contest.id &&
        source.sourceKind === 'official_editorial' &&
        source.officialTaskId === null &&
        locator?.resource === 'editorial'
      );
    });
    if (editorialIndexSources.length !== 1) {
      add(
        'CONTEST_EDITORIAL_INDEX_SOURCE_INVALID',
        `Expected one editorial index source; received ${String(editorialIndexSources.length)}.`,
        contest.id,
      );
    }
    for (const label of registryLabels) {
      const key = `${contest.id}:${label}`;
      const slot = slotByKey.get(key);
      if (!slot) {
        add('CONTEST_SLOT_STATE_MISSING', key, key);
        continue;
      }
      const officialOrder = contest.officialTaskOrder.indexOf(label);
      const officialTaskId =
        officialOrder < 0 ? null : (contest.officialTaskIds[officialOrder] ?? null);
      if (officialOrder < 0) {
        if (
          slot.availability !== 'official_absent' ||
          slot.officialOrder !== null ||
          slot.officialTaskId !== null ||
          slot.problemId !== null
        ) {
          add('CONTEST_SLOT_ABSENCE_MISMATCH', key, key);
        }
      } else if (slot.availability === 'unknown') {
        add('OFFICIAL_STATE_UNRESOLVED', key, key);
      } else if (
        slot.availability === 'official_absent' ||
        slot.officialOrder !== officialOrder ||
        slot.officialTaskId !== officialTaskId
      ) {
        add('CONTEST_SLOT_OFFICIAL_MISMATCH', key, key);
      }
      const slotSource = sourceById.get(slot.sourceRevisionId);
      const slotSourceUrl = slotSource ? parseAtCoderContestResourceUrl(slotSource.url) : null;
      if (
        slotSource?.contestId !== contest.id ||
        slotSource.sourceKind !== 'official_contest' ||
        slotSourceUrl?.resource !== 'tasks'
      ) {
        add('CONTEST_SLOT_SOURCE_MISMATCH', slot.sourceRevisionId, key);
      }
    }
  }

  for (const slot of slots) {
    if (!contestById.has(slot.contestId)) {
      add('CONTEST_SLOT_ORPHAN', `${slot.contestId}:${slot.label}`, slot.contestId);
    }
    if (!registryLabels.includes(slot.label)) {
      add('CONTEST_SLOT_LABEL_NOT_REGISTERED', slot.label, `${slot.contestId}:${slot.label}`);
    }
  }

  const expectedProblemIds = new Set(
    slots.flatMap((slot) =>
      slot.availability === 'exists' && slot.problemId !== null ? [slot.problemId] : [],
    ),
  );
  for (const expectedProblemId of expectedProblemIds) {
    if (!problemById.has(expectedProblemId)) {
      add('PROBLEM_MISSING_FOR_OFFICIAL_SLOT', expectedProblemId, expectedProblemId);
    }
  }
  for (const problem of problems) {
    if (!expectedProblemIds.has(problem.id)) {
      add('PROBLEM_WITHOUT_OFFICIAL_SLOT', problem.id, problem.id);
    }
    let expectedId: string;
    try {
      expectedId = stableProblemId(problem.contestId, problem.slotLabel);
    } catch {
      expectedId = '';
    }
    if (problem.id !== expectedId) {
      add('UNSTABLE_PROBLEM_ID', `${problem.id} != ${expectedId}`, problem.id);
    }
    const slot = slotByKey.get(`${problem.contestId}:${problem.slotLabel}`);
    if (
      slot?.problemId !== problem.id ||
      slot.officialTaskId !== problem.officialTaskId ||
      slot.officialOrder === null
    ) {
      add('PROBLEM_SLOT_MISMATCH', problem.id, problem.id);
    }
    const problemSources = problem.sourceRevisionIds.flatMap((sourceId) => {
      const source = sourceById.get(sourceId);
      return source ? [source] : [];
    });
    if (problemSources.length !== problem.sourceRevisionIds.length) {
      add('PROBLEM_SOURCE_MISSING', problem.id, problem.id);
    }
    if (!problemSources.some((source) => inventorySourceIsProblemBound(source, problem))) {
      add('PROBLEM_OFFICIAL_SOURCE_MISSING', problem.id, problem.id);
    }
    if (problemSources.some((source) => !sourceIsConsistentWithProblem(source, problem))) {
      add('PROBLEM_SOURCE_LOCATOR_MISMATCH', problem.id, problem.id);
    }
    const officialProblemSources = problemSources.filter(
      ({ sourceKind }) => sourceKind === 'official_problem',
    );
    const officialEditorialSources = problemSources.filter(
      ({ sourceKind }) => sourceKind === 'official_editorial',
    );
    if (
      new Set(problem.sourceRevisionIds).size !== problem.sourceRevisionIds.length ||
      officialProblemSources.length !== 1 ||
      problemSources.length !== officialProblemSources.length + officialEditorialSources.length
    ) {
      add('PROBLEM_OFFICIAL_SOURCE_SET_INVALID', problem.id, problem.id);
    }
    if (containsPreviewLeakage(problem)) {
      add('PREVIEW_LEAKAGE_IN_CANONICAL_PROBLEM', problem.id, problem.id);
    }
  }

  const problemIds = new Set(problems.map(({ id }) => id));
  const inventoryIds = new Set(inventory.map(({ problemId }) => problemId));
  for (const problemId of problemIds) {
    if (!inventoryIds.has(problemId)) {
      add('TECHNIQUE_INVENTORY_MISSING', problemId, problemId);
    }
  }
  for (const problemId of inventoryIds) {
    if (!problemIds.has(problemId)) {
      add('TECHNIQUE_INVENTORY_ORPHAN', problemId, problemId);
    }
  }
  const coreMethodOwners = new Map<string, string[]>();
  for (const item of inventory) {
    const normalizedCoreMethod = item.coreMethod.trim().normalize('NFC');
    const owners = coreMethodOwners.get(normalizedCoreMethod) ?? [];
    owners.push(item.problemId);
    coreMethodOwners.set(normalizedCoreMethod, owners);
  }
  for (const [coreMethod, ownerIds] of coreMethodOwners) {
    if (ownerIds.length > 1) {
      for (const problemId of ownerIds) {
        add('TECHNIQUE_INVENTORY_CORE_METHOD_DUPLICATE', coreMethod, problemId);
      }
    }
  }
  for (const loaded of corpus.inventory) {
    const item = loaded.entity;
    const expectedShard = techniqueInventoryShardId(item.problemId);
    if (loaded.shardId !== expectedShard) {
      add(
        'TECHNIQUE_INVENTORY_SHARD_MISMATCH',
        `${loaded.path} belongs in ${expectedShard}.`,
        item.problemId,
      );
    }
    const problem = problemById.get(item.problemId);
    if (!problem) continue;
    const itemSources = item.sourceRevisionIds.flatMap((sourceId) => {
      const source = sourceById.get(sourceId);
      return source ? [source] : [];
    });
    if (itemSources.length !== item.sourceRevisionIds.length) {
      add('TECHNIQUE_INVENTORY_SOURCE_MISSING', item.problemId, item.problemId);
    }
    if (!itemSources.some((source) => inventorySourceIsProblemBound(source, problem))) {
      add('TECHNIQUE_INVENTORY_OFFICIAL_PROBLEM_SOURCE_MISSING', item.problemId, item.problemId);
    }
    if (itemSources.some((source) => !sourceIsConsistentWithProblem(source, problem))) {
      add('TECHNIQUE_INVENTORY_SOURCE_LOCATOR_MISMATCH', item.problemId, item.problemId);
    }
    if (item.sourceRevisionIds.some((sourceId) => !problem.sourceRevisionIds.includes(sourceId))) {
      add('TECHNIQUE_INVENTORY_SOURCE_SET_MISMATCH', item.problemId, item.problemId);
    }
    if (item.reviewStatus === 'changes_requested') {
      add('TECHNIQUE_INVENTORY_CHANGES_REQUESTED', item.reviewStatus, item.problemId);
    }
    if (hasShallowInventoryAnalysis(item)) {
      add(
        'TECHNIQUE_INVENTORY_ANALYSIS_TOO_SHALLOW',
        'coreMethod/proofIdeas/outcomeCandidates do not meet the minimum substantive length.',
        item.problemId,
      );
    }
    if (!hasExplicitAsymptoticComplexity(item)) {
      add(
        'TECHNIQUE_INVENTORY_COMPLEXITY_NOT_EXPLICIT',
        JSON.stringify(item.asymptoticComplexity),
        item.problemId,
      );
    }
    if (!hasOnlyReviewedProblemComplexity(item)) {
      add(
        'TECHNIQUE_INVENTORY_COMPLEXITY_POLICY_MISMATCH',
        JSON.stringify(item.asymptoticComplexity),
        item.problemId,
      );
    }
    if (hasInventoryPlaceholder(item)) {
      add(
        'TECHNIQUE_INVENTORY_PLACEHOLDER_TEXT',
        'Placeholder or editorial-reference-only text is not accepted.',
        item.problemId,
      );
    }
    if (containsPreviewLeakage(item) || STAGING_PATH.test(loaded.path)) {
      add('PREVIEW_LEAKAGE_IN_CANONICAL_INVENTORY', loaded.path, item.problemId);
    }
  }

  const expectedMetadataBatchDigest = candidatePoolMetadataBatchDigest(corpus);
  const pool = corpus.candidatePool;
  if (pool.candidatePoolDigest !== digestWithoutField(pool, 'candidatePoolDigest')) {
    add('CANDIDATE_POOL_DIGEST_STALE', pool.candidatePoolDigest);
  }
  if (pool.metadataBatchDigest !== expectedMetadataBatchDigest) {
    add(
      'CANDIDATE_POOL_METADATA_DIGEST_MISMATCH',
      `${pool.metadataBatchDigest} != ${expectedMetadataBatchDigest}`,
    );
  }
  if (!sameOrderedValues(pool.candidates, [...pool.candidates].sort(compareCandidates))) {
    add('CANDIDATE_POOL_ORDER_INVALID', 'Candidates must use the frozen stable order.');
  }
  if (!sameOrderedValues(pool.allowedDomains, sortedUnique(pool.allowedDomains))) {
    add('CANDIDATE_POOL_DOMAIN_ORDER_INVALID', 'Allowed domains must be sorted and unique.');
  }
  const outcomeDomains = new Map<string, string>();
  for (const candidate of pool.candidates) {
    if (candidate.selectionEligible === (candidate.exclusionReason !== null)) {
      add('CANDIDATE_ELIGIBILITY_INVALID', candidate.problemId, candidate.problemId);
    }
    for (const values of [
      candidate.sourceRevisionIds,
      candidate.candidateDomains,
      candidate.candidateOutcomeIds,
    ]) {
      if (!sameOrderedValues(values, sortedUnique(values))) {
        add('CANDIDATE_ARRAY_ORDER_INVALID', candidate.problemId, candidate.problemId);
      }
    }
    if (candidate.selectionEligible && candidate.classifications.length === 0) {
      add('CANDIDATE_CLASSIFICATION_MISSING', candidate.problemId, candidate.problemId);
    }
    const expectedCandidateDomains = sortedUnique(
      candidate.classifications.map(({ domain }) => domain),
    );
    const expectedCandidateOutcomeIds = sortedUnique(
      candidate.classifications.map(({ outcomeId }) => outcomeId),
    );
    if (
      !sameOrderedValues(candidate.candidateDomains, expectedCandidateDomains) ||
      !sameOrderedValues(candidate.candidateOutcomeIds, expectedCandidateOutcomeIds)
    ) {
      add('CANDIDATE_CLASSIFICATION_PROJECTION_MISMATCH', candidate.problemId, candidate.problemId);
    }
    const problem = problemById.get(candidate.problemId);
    if (candidate.fixtureId === null) {
      if (
        !problem ||
        Number(problem.contestId.slice(3)) !== candidate.contestNumber ||
        problem.slotLabel !== candidate.advancedLabel ||
        problem.officialTaskId !== candidate.officialTaskId ||
        slotByKey.get(`${problem.contestId}:${problem.slotLabel}`)?.officialOrder !==
          candidate.officialTaskOrder
      ) {
        add('CANDIDATE_METADATA_MISMATCH', candidate.problemId, candidate.problemId);
      }
      if (problem && !sameStringSet(candidate.sourceRevisionIds, problem.sourceRevisionIds)) {
        add('CANDIDATE_PROBLEM_SOURCE_SET_MISMATCH', candidate.problemId, candidate.problemId);
      }
    }
    const candidateSources = candidate.sourceRevisionIds.flatMap((sourceId) => {
      const source = sourceById.get(sourceId);
      return source ? [source] : [];
    });
    if (
      candidate.fixtureId === null &&
      (candidateSources.length !== candidate.sourceRevisionIds.length ||
        (problem !== undefined &&
          candidateSources.some((source) => !sourceIsConsistentWithProblem(source, problem))))
    ) {
      add('CANDIDATE_SOURCE_LOCATOR_MISMATCH', candidate.problemId, candidate.problemId);
    }
    const classificationKeys = new Set<string>();
    for (const classification of candidate.classifications) {
      const classificationKey = `${classification.domain}\0${classification.outcomeId}`;
      const previousOutcomeDomain = outcomeDomains.get(classification.outcomeId);
      if (
        !pool.allowedDomains.includes(classification.domain) ||
        !candidate.candidateDomains.includes(classification.domain) ||
        !candidate.candidateOutcomeIds.includes(classification.outcomeId) ||
        !sameOrderedValues(
          classification.sourceRevisionIds,
          sortedUnique(classification.sourceRevisionIds),
        ) ||
        !classification.sourceRevisionIds.every((sourceId) =>
          candidate.sourceRevisionIds.includes(sourceId),
        ) ||
        classificationKeys.has(classificationKey) ||
        (previousOutcomeDomain !== undefined && previousOutcomeDomain !== classification.domain)
      ) {
        add('CANDIDATE_CLASSIFICATION_EVIDENCE_MISMATCH', candidate.problemId, candidate.problemId);
      }
      classificationKeys.add(classificationKey);
      outcomeDomains.set(classification.outcomeId, classification.domain);
    }
  }
  const poolSourceIds = sortedUnique(
    pool.candidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
  );
  if (!sameOrderedValues(pool.sourceRevisionIds, poolSourceIds)) {
    add('CANDIDATE_POOL_SOURCE_SET_MISMATCH', 'Top-level sourceRevisionIds are not derived.');
  }
  const realCandidateIds = sortedUnique(
    pool.candidates.filter(({ fixtureId }) => fixtureId === null).map(({ problemId }) => problemId),
  );
  const rangeProblemIds = sortedUnique(
    problems
      .filter(({ contestId }) => {
        const number = Number(contestId.slice(3));
        return number >= 212 && number <= 263;
      })
      .map(({ id }) => id),
  );
  if (!sameOrderedValues(realCandidateIds, rangeProblemIds)) {
    add('CANDIDATE_POOL_PROBLEM_COVERAGE_MISMATCH', 'ABC212-263 coverage is incomplete.');
  }

  const manifest = corpus.previewManifest;
  if (manifest.manifestDigest !== digestWithoutField(manifest, 'manifestDigest')) {
    add('PREVIEW_MANIFEST_DIGEST_STALE', manifest.manifestDigest);
  }
  if (
    manifest.candidatePoolDigest !== pool.candidatePoolDigest ||
    manifest.metadataBatchDigest !== pool.metadataBatchDigest
  ) {
    add('PREVIEW_MANIFEST_INPUT_DIGEST_MISMATCH', manifest.previewId);
  }
  const candidateByProblemId = new Map(
    pool.candidates.map((candidate) => [candidate.problemId, candidate]),
  );
  try {
    const refrozen = refreezeVerifiedPreviewCohort({
      pool,
      selectionRules: {
        seedRange: manifest.seedRange,
        scopeRule: manifest.scopeRule,
        cohortRules: manifest.cohortRules,
        publicationBoundary: manifest.publicationBoundary,
      },
      frozenRulesDigest: manifest.frozenRulesDigest,
    });
    if (
      canonicalDigest(withoutManifestDigest(refrozen)) !==
      digestWithoutField(manifest, 'manifestDigest')
    ) {
      add(
        'PREVIEW_COHORT_DETERMINISTIC_SELECTION_MISMATCH',
        'The frozen manifest does not equal the deterministic optimum for its candidate pool and rules.',
        manifest.previewId,
      );
    }
  } catch (error) {
    add(
      'PREVIEW_COHORT_REFREEZE_FAILED',
      error instanceof Error ? error.message : String(error),
      manifest.previewId,
    );
  }
  if (
    !manifest.cohortRules.allowFixtureSupplement &&
    manifest.selectedProblemIds.some(
      (problemId) => candidateByProblemId.get(problemId)?.fixtureId !== null,
    )
  ) {
    add('PREVIEW_FIXTURE_SUPPLEMENT_FORBIDDEN', manifest.previewId, manifest.previewId);
  }
  for (const selectedProblemId of manifest.selectedProblemIds) {
    const candidate = candidateByProblemId.get(selectedProblemId);
    if (!candidate?.selectionEligible) {
      add('PREVIEW_COHORT_SELECTION_INVALID', selectedProblemId, selectedProblemId);
    }
  }
  const expectedExcluded = sortedUnique(
    pool.candidates
      .map(({ problemId }) => problemId)
      .filter((problemId) => !manifest.selectedProblemIds.includes(problemId)),
  );
  if (!sameStringSet(manifest.excludedProblemIds, expectedExcluded)) {
    add('PREVIEW_COHORT_EXCLUSION_SET_MISMATCH', manifest.previewId);
  }
  const expectedSelectedSources = sortedUnique(
    manifest.selectedProblemIds.flatMap(
      (problemId) => candidateByProblemId.get(problemId)?.sourceRevisionIds ?? [],
    ),
  );
  if (!sameStringSet(manifest.sourceRevisionIds, expectedSelectedSources)) {
    add('PREVIEW_COHORT_SOURCE_SET_MISMATCH', manifest.previewId);
  }
  const expectedFixtureBoundaries = new Map<string, string[]>();
  for (const problemId of manifest.selectedProblemIds) {
    const fixtureId = candidateByProblemId.get(problemId)?.fixtureId;
    if (fixtureId) {
      const ids = expectedFixtureBoundaries.get(fixtureId) ?? [];
      ids.push(problemId);
      expectedFixtureBoundaries.set(fixtureId, ids);
    } else if (!problemIds.has(problemId)) {
      add('PREVIEW_COHORT_PROBLEM_NOT_IN_FULL_CORPUS', problemId, problemId);
    }
  }
  const actualFixtureBoundaries = new Map(
    manifest.fixtureBoundaries.map(({ fixtureId, problemIds: ids }) => [
      fixtureId,
      sortedUnique(ids),
    ]),
  );
  if (
    expectedFixtureBoundaries.size !== actualFixtureBoundaries.size ||
    [...expectedFixtureBoundaries].some(
      ([fixtureId, ids]) =>
        !sameOrderedValues(sortedUnique(ids), actualFixtureBoundaries.get(fixtureId) ?? []),
    )
  ) {
    add('PREVIEW_FIXTURE_BOUNDARY_MISMATCH', manifest.previewId);
  }
  if (
    !sameStringSet(
      previewInventory.map(({ problemId }) => problemId),
      manifest.selectedProblemIds,
    )
  ) {
    add('PREVIEW_INVENTORY_COHORT_MISMATCH', manifest.previewId);
  }
  for (const selectedProblemId of manifest.selectedProblemIds) {
    const candidate = candidateByProblemId.get(selectedProblemId);
    const previewItem = previewInventoryByProblemId.get(selectedProblemId);
    const canonicalItem = inventoryByProblemId.get(selectedProblemId);
    if (candidate?.fixtureId === null && previewItem && canonicalItem) {
      if (canonicalDigest(previewItem) !== canonicalDigest(canonicalItem)) {
        add('PREVIEW_CANONICAL_INVENTORY_MISMATCH', selectedProblemId, selectedProblemId);
      }
    }
  }

  for (const item of previewInventory) {
    const candidate = candidateByProblemId.get(item.problemId);
    if (!candidate || !sameStringSet(item.sourceRevisionIds, candidate.sourceRevisionIds)) {
      add('PREVIEW_TECHNIQUE_INVENTORY_SOURCE_SET_MISMATCH', item.problemId, item.problemId);
    }
    if (item.reviewStatus !== 'reviewed') {
      add('PREVIEW_TECHNIQUE_INVENTORY_NOT_REVIEWED', item.reviewStatus, item.problemId);
    }
    if (hasShallowInventoryAnalysis(item)) {
      add('PREVIEW_TECHNIQUE_INVENTORY_ANALYSIS_TOO_SHALLOW', item.problemId, item.problemId);
    }
    if (!hasExplicitAsymptoticComplexity(item)) {
      add('PREVIEW_TECHNIQUE_INVENTORY_COMPLEXITY_NOT_EXPLICIT', item.problemId, item.problemId);
    }
    if (hasInventoryPlaceholder(item)) {
      add('PREVIEW_TECHNIQUE_INVENTORY_PLACEHOLDER_TEXT', item.problemId, item.problemId);
    }
  }

  const parsedComponent = PreviewTechniqueInventoryComponentSchema.safeParse(
    Reflect.get(corpus, 'previewComponent'),
  );
  if (!parsedComponent.success) {
    add('PREVIEW_INVENTORY_COMPONENT_MISSING', 'technique-inventory');
  } else {
    const component = parsedComponent.data;
    const expectedComponent = buildPreviewTechniqueInventoryComponent({
      manifest,
      previewInventory,
    });
    if (
      component.manifestDigest !== manifest.manifestDigest ||
      component.inputDigest !== manifest.manifestDigest ||
      !sameOrderedValues(component.problemIds, manifest.selectedProblemIds)
    ) {
      add('PREVIEW_INVENTORY_COMPONENT_COHORT_MISMATCH', component.componentId);
    }
    if (component.artifactDigest !== expectedComponent.artifactDigest) {
      add('PREVIEW_INVENTORY_COMPONENT_ARTIFACT_STALE', component.artifactDigest);
    }
    const { outputDigest: _outputDigest, ...componentSubject } = component;
    void _outputDigest;
    if (
      component.outputDigest !== previewComponentOutputDigest(componentSubject) ||
      component.outputDigest !== expectedComponent.outputDigest
    ) {
      add('PREVIEW_INVENTORY_COMPONENT_DIGEST_STALE', component.outputDigest);
    }
  }

  return diagnostics.sort(
    (left, right) =>
      compareCodeUnits(left.code, right.code) ||
      compareCodeUnits(left.entityId ?? '', right.entityId ?? '') ||
      compareCodeUnits(left.message, right.message),
  );
};

const evidenceSubject = (
  evidence: Omit<TechniqueInventoryEvidence, 'evidenceDigest'>,
): Omit<TechniqueInventoryEvidence, 'evidenceDigest'> => evidence;

/** Build the immutable, timestamp-free T044 evidence subject deterministically. */
export const buildTechniqueInventoryEvidence = (
  corpus: LoadedTechniqueInventoryCorpus,
): TechniqueInventoryEvidence => {
  const contests = [...entityValues(corpus.contests)].sort(compareContests);
  const contestGaps = [...entityValues(corpus.contestGaps)].sort(
    (left, right) => left.number - right.number,
  );
  const slots = [...entityValues(corpus.contestSlots)].sort(compareSlots);
  const problems = [...entityValues(corpus.problems)].sort(compareProblems);
  const sources = [...entityValues(corpus.sources)].sort(compareSources);
  const inventory = corpus.inventory.map(({ entity }) => entity).sort(compareInventory);
  const previewInventory = [...entityValues(corpus.previewInventory)].sort(compareInventory);
  const advancedSlotLabels = (() => {
    try {
      return buildAdvancedSlotRegistry({
        contests: contests.map((contest) => ({
          contestId: contest.id,
          advancedLabels: contest.officialTaskOrder.slice(
            contest.officialTaskOrder.indexOf('D') + 1,
          ),
          sourceRevisionId: contest.taskOrderSourceRevisionId,
        })),
      }).labels;
    } catch {
      return sortedUnique(
        contests.flatMap((contest) =>
          contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
        ),
      );
    }
  })();
  const diagnostics = validateTechniqueInventoryCorpus(corpus);
  const metadataSubject = { contests, contestGaps, contestSlots: slots, problems, sources };
  const inventorySubject = { problemIds: problems.map(({ id }) => id), items: inventory };
  const metadataDigest = canonicalDigest(metadataSubject);
  const inventoryDigest = canonicalDigest(inventorySubject);
  const corpusDigest = canonicalDigest({
    shardAlgorithm: SHARD_VERSION,
    metadataDigest,
    inventoryDigest,
  });
  const shards = techniqueInventoryShardIds.map((shardId) => {
    const items = corpus.inventory
      .filter((item) => item.shardId === shardId)
      .map(({ entity }) => entity)
      .sort(compareInventory);
    const problemIds = items.map(({ problemId }) => problemId);
    return {
      shardId,
      problemCount: items.length,
      problemIds,
      problemIdsDigest: canonicalDigest({ problemIds }),
      contentDigest: canonicalDigest({ items }),
    };
  });
  const fixtureProblemIds = new Set(
    corpus.previewManifest.fixtureBoundaries.flatMap(({ problemIds }) => problemIds),
  );
  const parsedPreviewComponent = PreviewTechniqueInventoryComponentSchema.safeParse(
    Reflect.get(corpus, 'previewComponent'),
  );
  const subject = evidenceSubject({
    schemaVersion: '1.0.0',
    evidenceId: 'bootstrap-technique-inventory',
    status: diagnostics.length === 0 ? 'passed' : 'failed',
    shardAlgorithm: SHARD_VERSION,
    scope: {
      firstContestNumber: BOOTSTRAP_FIRST_CONTEST_NUMBER,
      lastContestNumber: BOOTSTRAP_LAST_CONTEST_NUMBER,
      contestCount: contests.length,
      officialContestGapNumbers: contestGaps.map(({ number }) => number),
      advancedSlotLabels,
      slotCount: slots.length,
      problemCount: problems.length,
      sourceRevisionCount: sources.length,
      inventoryCount: inventory.length,
      reviewedInventoryCount: inventory.filter(({ reviewStatus }) => reviewStatus === 'reviewed')
        .length,
      draftInventoryCount: inventory.filter(({ reviewStatus }) => reviewStatus === 'draft').length,
    },
    cohort: {
      previewId: 'initial-v1',
      candidatePoolDigest: corpus.candidatePool.candidatePoolDigest,
      metadataBatchDigest: corpus.candidatePool.metadataBatchDigest,
      manifestDigest: corpus.previewManifest.manifestDigest,
      selectedProblemIds: corpus.previewManifest.selectedProblemIds,
      selectedCanonicalProblemCount: corpus.previewManifest.selectedProblemIds.filter(
        (problemId) => !fixtureProblemIds.has(problemId),
      ).length,
      selectedFixtureProblemCount: fixtureProblemIds.size,
      previewInventoryDigest: canonicalDigest({ items: previewInventory }),
      previewComponentDigest: parsedPreviewComponent.success
        ? parsedPreviewComponent.data.outputDigest
        : canonicalDigest({ missing: 'preview-technique-inventory-component' }),
    },
    metadataDigest,
    inventoryDigest,
    corpusDigest,
    shards,
    diagnostics,
  });
  return { ...subject, evidenceDigest: canonicalDigest(subject) };
};

export const verifyTechniqueInventoryCorpus = async (
  layout: CorpusInventoryLayout = defaultCorpusInventoryLayout(),
  options: LoadTechniqueInventoryCorpusOptions = {},
): Promise<TechniqueInventoryEvidence> =>
  buildTechniqueInventoryEvidence(await loadTechniqueInventoryCorpus(layout, options));
