import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { prepareAuthoringResults } from './author.js';
import { acquireOfficialMetadata } from './acquire.js';
import {
  deriveFrozenClassification,
  type FrozenClassificationCandidate,
  type FrozenTaxonomyGroup,
  type FrozenTaxonomyIndex,
} from './classify.js';
import { discoverContests } from './discover.js';
import { bootstrapPreviewSeed } from './bootstrap.js';
import { validatePreparedUpdate } from './validate.js';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';

export interface PipelineOptions {
  readonly fixture: string;
  readonly repositoryRoot?: string;
  readonly failAt?: 'author' | 'validate';
  readonly resume?: { readonly updateId: string; readonly sourceSetFingerprint: string };
}

export interface PipelineResult {
  readonly command: 'abc:update';
  readonly updateId: string;
  readonly contestId: null;
  readonly advancedSlotLabels: readonly string[];
  readonly resultCounts: Readonly<
    Record<'authoring_unit_draft' | 'authoring_required' | 'blocked', number>
  >;
  readonly state: 'ELIGIBLE_FOR_BATCH' | 'ON_HOLD';
  readonly blockingFindingCount: number;
  readonly durationMs: number;
  readonly resultPath: string;
  readonly completedSteps: readonly string[];
  readonly holdReasons: readonly string[];
  readonly subjectDigest: string;
  readonly sourceSetFingerprint: string;
  readonly publicationUpdate: unknown;
}

interface PreviewManifest {
  readonly selectedProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly metadataBatchDigest: string;
  readonly candidatePoolDigest: string;
}

interface CandidatePool {
  readonly candidates: readonly FrozenClassificationCandidate[];
  readonly candidatePoolDigest: string;
}

interface ContestArtifact {
  readonly id: string;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly officialTaskOrder: readonly string[];
  readonly taskOrderSourceRevisionId: string;
}

interface SourcePacket {
  readonly problemInputs: readonly {
    readonly problemId: string;
    readonly sourceRevisionIds: readonly string[];
  }[];
  readonly sources: readonly { readonly sourceRevisionId: string; readonly path: string }[];
}

interface ProblemArtifact {
  readonly id: string;
}

interface InventoryArtifact {
  readonly problemId: string;
  readonly sourceRevisionIds: readonly string[];
}

interface LearningArtifact {
  readonly learningUnit: {
    readonly problemIds: readonly string[];
    readonly id: string;
    readonly prerequisiteUnitIds: readonly string[];
    readonly explanation: string;
    readonly examples: readonly unknown[];
  };
}

interface TaxonomyIndex extends FrozenTaxonomyIndex {
  readonly groupRefs: readonly {
    readonly domain: string;
    readonly path: string;
    readonly digest: string;
  }[];
}

const readJson = async <T>(root: string, relativePath: string): Promise<T> =>
  JSON.parse(await readFile(path.join(root, relativePath), 'utf8')) as T;

const exists = async (root: string, relativePath: string): Promise<boolean> => {
  try {
    await readFile(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
};

const slotLabel = (problemId: string): string =>
  problemId.slice(problemId.lastIndexOf('-') + 1).toUpperCase();
const counts = () => ({ authoring_unit_draft: 0, authoring_required: 0, blocked: 0 });

const preparePipeline = async (options: PipelineOptions): Promise<PipelineResult> => {
  const started = performance.now();
  if (options.fixture !== 'initial-v1')
    throw new Error('Only the initial-v1 fixture is available before T154.');
  const root = options.repositoryRoot ?? process.cwd();
  const manifest = await readJson<PreviewManifest>(
    root,
    'staging/previews/initial-v1/preview-manifest.json',
  );
  const packetPath = 'src/content/sources/authoring/initial-v1.json';
  const packet = await readJson<SourcePacket>(root, packetPath);
  const candidatePool = await readJson<CandidatePool>(
    root,
    'staging/previews/initial-v1/candidate-pool.json',
  );
  if (candidatePool.candidatePoolDigest !== manifest.candidatePoolDigest) {
    throw new Error('CANDIDATE_POOL_DIGEST_MISMATCH');
  }
  if (
    digestWithoutField(
      candidatePool as unknown as Record<string, unknown>,
      'candidatePoolDigest',
    ) !== candidatePool.candidatePoolDigest
  ) {
    throw new Error('CANDIDATE_POOL_DIGEST_STALE');
  }
  const taxonomy = await readJson<TaxonomyIndex>(
    root,
    'staging/previews/initial-v1/taxonomy/index.json',
  );
  const learningPaths = [
    'staging/previews/initial-v1/learning/graph-search/learning-unit.json',
    'staging/previews/initial-v1/learning/dynamic-programming/learning-unit.json',
    'staging/previews/initial-v1/learning/data-structures/learning-unit.json',
    'staging/previews/initial-v1/learning/mathematics/learning-unit.json',
  ];
  const learning = await Promise.all(
    learningPaths.map((candidate) => readJson<LearningArtifact>(root, candidate)),
  );
  const taxonomyGroups = await Promise.all(
    taxonomy.groupRefs.map(async ({ domain, path: groupPath, digest }) => {
      const group = await readJson<FrozenTaxonomyGroup & { readonly groupDigest: string }>(
        root,
        groupPath,
      );
      if (
        group.domain !== domain ||
        group.groupDigest !== digest ||
        digestWithoutField(group as unknown as Record<string, unknown>, 'groupDigest') !== digest
      )
        throw new Error(`TAXONOMY_GROUP_DIGEST_MISMATCH:${groupPath}`);
      return group;
    }),
  );
  const contestIds = [
    ...new Set(
      manifest.selectedProblemIds.map((problemId) => problemId.slice(0, problemId.indexOf('-'))),
    ),
  ];
  const contestEntries = await Promise.all(
    contestIds.map(async (contestId) => {
      const contestPath = `src/content/contests/abc212-abc263/${contestId}.json`;
      const artifact = await readJson<ContestArtifact>(root, contestPath);
      return { contestId, contestPath, artifact };
    }),
  );
  const contests = contestEntries.map(({ artifact }) => ({
    contestId: artifact.id,
    startsAt: artifact.startedAt,
    endsAt: artifact.endedAt,
    tasks: artifact.officialTaskOrder.map((label) => ({
      label,
      sourceRevisionId: artifact.taskOrderSourceRevisionId,
    })),
  }));
  const discovered = discoverContests({
    contests,
    mode: 'explicit-range',
    firstContestNumber: 212,
    lastContestNumber: 256,
    now: '2026-07-28T15:00:00+09:00',
  });
  const acquired = await Promise.all(discovered.map((contest) => acquireOfficialMetadata(contest)));
  const acquiredProblemIds = new Set(acquired.flatMap((result) => result.problemIds));
  if (
    acquired.some((result) => result.status === 'on_hold') ||
    manifest.selectedProblemIds.some((problemId) => !acquiredProblemIds.has(problemId))
  ) {
    throw new Error('PREVIEW_DISCOVERY_SCOPE_MISMATCH');
  }

  const inventoryEntries = await Promise.all(
    manifest.selectedProblemIds.map(async (problemId) => {
      const inventoryPath = `staging/previews/initial-v1/technique-inventory/${problemId}.json`;
      const inventory = await readJson<InventoryArtifact>(root, inventoryPath);
      if (inventory.problemId !== problemId)
        throw new Error(`INVENTORY_PROBLEM_ID_MISMATCH:${problemId}`);
      return { problemId, inventoryPath, inventory };
    }),
  );
  const problemEntries = await Promise.all(
    manifest.selectedProblemIds.map(async (problemId) => {
      const problemPath = `src/content/problems/abc212-abc263/${problemId}.json`;
      const problem = await readJson<ProblemArtifact>(root, problemPath);
      if (problem.id !== problemId) throw new Error(`PROBLEM_ID_MISMATCH:${problemId}`);
      return { problemId, problemPath, problem };
    }),
  );
  const sourceProblemIds = new Map<string, string[]>();
  for (const problemInput of packet.problemInputs) {
    for (const sourceRevisionId of problemInput.sourceRevisionIds) {
      const owners = sourceProblemIds.get(sourceRevisionId) ?? [];
      owners.push(problemInput.problemId);
      sourceProblemIds.set(sourceRevisionId, owners);
    }
  }
  const sourceEntries = await Promise.all(
    packet.sources.map(async ({ sourceRevisionId, path: sourcePath }) => ({
      sourceRevisionId,
      sourcePath,
      source: await readJson<unknown>(root, sourcePath),
      affectedProblemIds: sourceProblemIds.get(sourceRevisionId) ?? [],
    })),
  );
  const staged = bootstrapPreviewSeed({
    previewId: options.fixture,
    problemIds: manifest.selectedProblemIds,
    snapshotDigest: manifest.metadataBatchDigest,
    artifacts: [
      ...contestEntries.map(({ contestId, contestPath, artifact }) => ({
        entityType: 'contest' as const,
        entityId: contestId,
        path: contestPath,
        digest: canonicalDigest(artifact),
        affectedProblemIds: manifest.selectedProblemIds.filter((problemId) =>
          problemId.startsWith(`${contestId}-`),
        ),
      })),
      ...problemEntries.map(({ problemId, problemPath, problem }) => ({
        entityType: 'problem' as const,
        entityId: problemId,
        path: problemPath,
        digest: canonicalDigest(problem),
        affectedProblemIds: [problemId],
      })),
      ...sourceEntries.map(({ sourceRevisionId, sourcePath, source, affectedProblemIds }) => ({
        entityType: 'source' as const,
        entityId: sourceRevisionId,
        path: sourcePath,
        digest: canonicalDigest(source),
        affectedProblemIds,
      })),
      ...inventoryEntries.map(({ problemId, inventoryPath, inventory }) => ({
        entityType: 'technique_inventory' as const,
        entityId: `inventory-${problemId}`,
        path: inventoryPath,
        digest: canonicalDigest(inventory),
        affectedProblemIds: [problemId],
      })),
      ...learning.map((artifact, index) => ({
        entityType: 'learning_unit' as const,
        entityId: `preview-learning-${['graph-search', 'dynamic-programming', 'data-structures', 'mathematics'][index] ?? String(index)}`,
        path: learningPaths[index] ?? '',
        digest: canonicalDigest(artifact),
        affectedProblemIds: artifact.learningUnit.problemIds,
      })),
      {
        entityType: 'placement' as const,
        entityId: 'preview-placement-index',
        path: 'staging/previews/initial-v1/taxonomy/index.json',
        digest: canonicalDigest(taxonomy),
        affectedProblemIds: manifest.selectedProblemIds,
      },
    ],
  });
  if (
    options.resume &&
    (options.resume.updateId !== staged.updateId ||
      options.resume.sourceSetFingerprint !== staged.sourceSetFingerprint)
  ) {
    throw new Error('RESUME_INPUT_MISMATCH');
  }

  const skill = {
    name: 'abc-explanation-author' as const,
    version: '1.1.1',
    digest: '6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa',
  };
  const authoring = prepareAuthoringResults({
    skill,
    targets: manifest.selectedProblemIds.map((problemId) =>
      options.failAt === 'author'
        ? {
            problemId,
            slotLabel: slotLabel(problemId),
            block: {
              code: 'GENERATOR_UNAVAILABLE',
              reason: 'Injected authoring failure.',
              retryCondition: 'Resume without failure injection.',
            },
          }
        : {
            problemId,
            slotLabel: slotLabel(problemId),
            packetPath,
            templatePath: '.agents/skills/abc-explanation-author/templates/full-explanation.md',
          },
    ),
  });
  const classification = deriveFrozenClassification({
    selectedProblemIds: manifest.selectedProblemIds,
    candidates: candidatePool.candidates,
    groups: taxonomyGroups,
    index: taxonomy,
  });
  const validClassificationIds = new Set(classification.validProblemIds);
  const placementByProblem = new Map(
    taxonomy.placements.map((placement) => [placement.problemId, placement]),
  );
  const sourceById = new Map(
    packet.sources.map((source) => [source.sourceRevisionId, source.path]),
  );
  const problems = await Promise.all(
    manifest.selectedProblemIds.map(async (problemId) => {
      const problemInput = packet.problemInputs.find((input) => input.problemId === problemId);
      const sourceAvailable =
        problemInput !== undefined &&
        (
          await Promise.all(
            problemInput.sourceRevisionIds.map(async (sourceId) => {
              const sourcePath = sourceById.get(sourceId);
              return sourcePath !== undefined && exists(root, sourcePath);
            }),
          )
        ).every(Boolean);
      const owner = learning.find((artifact) =>
        artifact.learningUnit.problemIds.includes(problemId),
      );
      const placement = placementByProblem.get(problemId);
      const inventory = inventoryEntries.find((entry) => entry.problemId === problemId);
      const candidate = candidatePool.candidates.find((entry) => entry.problemId === problemId);
      const indexedUnit = taxonomy.units.find(({ id }) => id === owner?.learningUnit.id);
      return {
        problemId,
        sourceAvailable,
        explanationComplete:
          options.failAt !== 'validate' && Boolean(owner?.learningUnit.explanation.trim()),
        examplesValid: Boolean(owner && owner.learningUnit.examples.length > 0),
        placementIds:
          placement === undefined
            ? []
            : [placement.placementId ?? placement.id ?? `placement-${problemId}`],
        crossReferencesValid:
          validClassificationIds.has(problemId) &&
          inventory !== undefined &&
          candidate !== undefined &&
          problemInput !== undefined &&
          owner !== undefined &&
          placement !== undefined &&
          taxonomy.problemIds.includes(problemId) &&
          placement.unitIds.includes(owner.learningUnit.id) &&
          indexedUnit !== undefined &&
          canonicalDigest(indexedUnit.prerequisiteUnitIds) ===
            canonicalDigest(owner.learningUnit.prerequisiteUnitIds) &&
          candidate.sourceRevisionIds.length === problemInput.sourceRevisionIds.length &&
          candidate.sourceRevisionIds.every((sourceId) =>
            problemInput.sourceRevisionIds.includes(sourceId),
          ) &&
          candidate.sourceRevisionIds.length === inventory.inventory.sourceRevisionIds.length &&
          candidate.sourceRevisionIds.every((sourceId) =>
            inventory.inventory.sourceRevisionIds.includes(sourceId),
          ),
      };
    }),
  );
  const reachableProblemIds = [
    ...new Set(learning.flatMap(({ learningUnit }) => learningUnit.problemIds)),
  ];
  const indexedProblemIds = [...new Set(taxonomy.placements.map(({ problemId }) => problemId))];
  const catalogProblemIds = problemEntries.map(({ problemId }) => problemId);
  const validation = validatePreparedUpdate({
    problems,
    taxonomyEdges: classification.taxonomyEdges,
    reachableProblemIds,
    indexedProblemIds,
    catalogProblemIds,
  });
  const resultCounts = authoring.reduce(
    (result, item) => ({ ...result, [item.resultType]: result[item.resultType] + 1 }),
    counts(),
  );
  const holdReasons = [
    ...new Set([
      ...authoring
        .filter((item) => item.resultType !== 'authoring_unit_draft')
        .map((item) => item.reasonCode ?? 'AUTHORING_REQUIRED'),
      ...validation.problemResults.flatMap((item) => item.findingCodes),
    ]),
  ].sort();
  const state = holdReasons.length === 0 ? ('ELIGIBLE_FOR_BATCH' as const) : ('ON_HOLD' as const);
  const now = '2026-07-28T15:00:00+09:00';
  const publicationUpdate = PublicationUpdateSchema.parse({
    schemaVersion: '2.0.0',
    updateId: staged.updateId,
    kind: 'bootstrap',
    baseReleaseVersion: null,
    contestId: null,
    sourceSetFingerprint: staged.sourceSetFingerprint,
    advancedSlotLabels: [...new Set(manifest.selectedProblemIds.map(slotLabel))].sort(),
    targetProblemIds: staged.targetProblemIds,
    operations: staged.operations.map((operation) => ({
      ...operation,
      affectedEntities: [
        {
          entityType: operation.entityType,
          entityId: operation.entityId,
          action: operation.action,
        },
      ],
    })),
    authoringResults: authoring.map(
      ({ authoringSkillVersion: _version, authoringSkillDigest: _digest, ...result }) => {
        void _version;
        void _digest;
        return result;
      },
    ),
    correctionImpactIds: [],
    validationSummary: validation,
    state,
    createdAt: now,
    updatedAt: now,
    fixtureMode: true,
  });
  const stable = {
    command: 'abc:update' as const,
    updateId: staged.updateId,
    contestId: null,
    advancedSlotLabels: publicationUpdate.advancedSlotLabels,
    resultCounts,
    state,
    blockingFindingCount: validation.blockingFindingCount,
    resultPath: `staging/previews/initial-v1/release-simulation/${staged.updateId}/manifest.json`,
    completedSteps: ['discover', 'acquire', 'stage', 'author', 'classify', 'validate'],
    holdReasons,
    sourceSetFingerprint: staged.sourceSetFingerprint,
  };
  return {
    ...stable,
    durationMs: Math.round(performance.now() - started),
    subjectDigest: canonicalDigest(stable),
    publicationUpdate,
  };
};

export const runUpdatePipeline = preparePipeline;

export const resumeUpdate = (
  previous: PipelineResult,
  options: Omit<PipelineOptions, 'resume'>,
): Promise<PipelineResult> =>
  preparePipeline({
    ...options,
    resume: { updateId: previous.updateId, sourceSetFingerprint: previous.sourceSetFingerprint },
  });

export const persistPublicationUpdate = async (
  result: PipelineResult,
  root = process.cwd(),
): Promise<void> => {
  PublicationUpdateSchema.parse(result.publicationUpdate);
  const destination = path.join(root, result.resultPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(result.publicationUpdate, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
  }).catch(async (error: unknown) => {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error;
    const existing = JSON.parse(await readFile(destination, 'utf8')) as unknown;
    if (canonicalDigest(existing) === canonicalDigest(result.publicationUpdate)) return;
    const previous = PublicationUpdateSchema.parse(existing);
    const next = PublicationUpdateSchema.parse(result.publicationUpdate);
    if (
      previous.updateId !== next.updateId ||
      previous.sourceSetFingerprint !== next.sourceSetFingerprint ||
      canonicalDigest(previous.targetProblemIds) !== canonicalDigest(next.targetProblemIds)
    ) {
      throw new Error('RESUME_INPUT_MISMATCH');
    }
    await writeFile(destination, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  });
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const contestId = argument('--contest');
  if (contestId) {
    try {
      const { prepareCanonicalUpdate, writeUpdateJson, CATCH_UP_ROOT, INITIAL_CUTOFF } =
        await import('./catch-up.js');
      const result = await prepareCanonicalUpdate({
        contestId,
        metadataPath: argument('--metadata') ?? `${CATCH_UP_ROOT}/metadata/${contestId}.json`,
        authoringPath: argument('--authoring') ?? `${CATCH_UP_ROOT}/authoring/${contestId}.json`,
        cutoffAt: argument('--cutoff') ?? INITIAL_CUTOFF,
      });
      await writeUpdateJson(
        `${CATCH_UP_ROOT}/${result.update.updateId}/manifest.json`,
        result.update,
      );
      console.log(
        JSON.stringify({
          command: 'abc:update',
          state: result.update.state,
          updateId: result.update.updateId,
          contestId,
          targetProblemIds: result.update.targetProblemIds,
          fixtureMode: false,
        }),
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 2;
    }
  } else {
    const fixture = argument('--fixture');
    const resumeId = argument('--resume');
    if (!fixture) {
      process.stderr.write(
        'Usage: npm run abc:update -- --fixture initial-v1 [--resume UPDATE_ID]\n',
      );
      process.stdout.write(`${JSON.stringify({ command: 'abc:update', exitCode: 64 })}\n`);
      process.exitCode = 64;
    } else {
      let resume: PipelineOptions['resume'];
      if (resumeId) {
        const saved = PublicationUpdateSchema.parse(
          await readJson<unknown>(
            process.cwd(),
            `staging/previews/initial-v1/release-simulation/${resumeId}/manifest.json`,
          ),
        );
        resume = { updateId: saved.updateId, sourceSetFingerprint: saved.sourceSetFingerprint };
      }
      const result = await preparePipeline({ fixture, ...(resume ? { resume } : {}) });
      await persistPublicationUpdate(result);
      const { publicationUpdate: _publicationUpdate, ...summary } = result;
      void _publicationUpdate;
      process.stdout.write(`${JSON.stringify(summary)}\n`);
      process.exitCode = result.state === 'ELIGIBLE_FOR_BATCH' ? 0 : 2;
    }
  }
}
