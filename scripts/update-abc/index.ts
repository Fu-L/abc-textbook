import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { prepareAuthoringResults } from './author.js';
import { classifyTechniques } from './classify.js';
import { stagePublicationUpdate } from './stage.js';
import { validatePreparedUpdate } from './validate.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
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
}

interface SourcePacket {
  readonly problemInputs: readonly {
    readonly problemId: string;
    readonly sourceRevisionIds: readonly string[];
  }[];
  readonly sources: readonly { readonly sourceRevisionId: string; readonly path: string }[];
}

interface LearningArtifact {
  readonly learningUnit: {
    readonly problemIds: readonly string[];
    readonly explanation: string;
    readonly examples: readonly unknown[];
  };
}

interface TaxonomyIndex {
  readonly problemIds: readonly string[];
  readonly placements: readonly {
    readonly problemId: string;
    readonly placementId?: string;
    readonly id?: string;
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

  const inventoryEntries = await Promise.all(
    manifest.selectedProblemIds.map(async (problemId) => {
      const inventoryPath = `staging/previews/initial-v1/technique-inventory/${problemId}.json`;
      await readJson<unknown>(root, inventoryPath);
      return { problemId };
    }),
  );
  const staged = stagePublicationUpdate({
    previewId: options.fixture,
    contestId: null,
    sourceSetFingerprint: manifest.metadataBatchDigest,
    targetProblemIds: manifest.selectedProblemIds,
    operations: [
      {
        entityType: 'placement' as const,
        entityId: 'preview-placement-index',
        action: 'add' as const,
        path: 'staging/previews/initial-v1/taxonomy/index.json',
        beforeDigest: null,
        afterDigest: canonicalDigest(taxonomy),
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
  const placementByProblem = new Map(
    taxonomy.placements.map((placement) => [
      placement.problemId,
      placement.placementId ?? placement.id ?? `placement-${placement.problemId}`,
    ]),
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
      const placementId = placementByProblem.get(problemId);
      return {
        problemId,
        sourceAvailable,
        explanationComplete:
          options.failAt !== 'validate' && Boolean(owner?.learningUnit.explanation.trim()),
        examplesValid: Boolean(owner && owner.learningUnit.examples.length > 0),
        placementIds: placementId === undefined ? [] : [placementId],
        crossReferencesValid:
          taxonomy.problemIds.includes(problemId) &&
          inventoryEntries.some((entry) => entry.problemId === problemId),
      };
    }),
  );
  void classifyTechniques(
    inventoryEntries.map(({ problemId }) => ({
      problemId,
      techniqueKey: 'frozen-preview-taxonomy',
    })),
    {
      'frozen-preview-taxonomy': {
        tagId: 'provisional-tag-frozen',
        outcomeId: 'outcome-provisional-frozen',
        unitId: 'provisional-unit-frozen',
      },
    },
  );
  const validation = validatePreparedUpdate({
    problems,
    taxonomyEdges: [],
    reachableProblemIds: taxonomy.problemIds,
    indexedProblemIds: taxonomy.problemIds,
    catalogProblemIds: manifest.selectedProblemIds,
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
    if (canonicalDigest(existing) !== canonicalDigest(result.publicationUpdate))
      throw new Error('IMMUTABLE_UPDATE_CONFLICT');
  });
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
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
