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
import { validatePreparedUpdate, validateSmallBatchCandidate } from './validate.js';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { cp, mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import { materializeObservedMetadataBatch } from '../../src/lib/corpus/materialization.js';
import {
  validateAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_METRICS_PATH,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import {
  CatalogSchema,
  CanonicalProblemPlacementPolicySchema,
  LearningUnitSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  loadFullPublicProjection,
  TAXONOMY_INDEX_PATH,
  verifyFullPublicProjectionDerivedFiles,
} from '../../src/lib/catalog/full-public-projection.js';
import { projectCatalogContent } from '../../src/lib/catalog/build-catalog.js';
import { discoverMetadataBatch } from './discover.js';
import { bootstrapPreviewSeed, readContentFiles, writeChangedContent } from './stage.js';
import { requireBatchDocuments } from './author.js';
import { batchUnitMembership } from './classify.js';
import { insertUnitProblemLinks, validateInsertedProblemOrder } from './unit-order.js';
import { validatePlacementOutcomeRoles } from '../../src/lib/taxonomy/final-taxonomy-build.js';
import type { SmallBatchOptions, SmallBatchResult } from './types.js';
import {
  parseKeyValueArguments,
  requiredArgument,
  readJson as readCliJson,
  CorpusCliError,
} from '../corpus/cli-support.js';

const jsonBytes = (value: unknown): Buffer => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const decode = (bytes: Buffer | undefined): unknown => {
  if (!bytes) throw new Error('CONTENT_INPUT_MISSING');
  return JSON.parse(bytes.toString('utf8')) as unknown;
};

/** Prepare observed metadata, then validate Codex's authored copy before applying
 * derived changes. A held batch never becomes a completed candidate. */
export async function runSmallBatchUpdate(options: SmallBatchOptions): Promise<SmallBatchResult> {
  const base = CatalogSchema.parse(options.baseCatalog);
  const summary = {
    command: 'abc:update' as const,
    addedProblemIds: [] as string[],
    lastContestId: base.release.lastContestId,
    cutoffAt: base.release.cutoffAt,
  };
  let temporary: string | undefined;
  let applying = false;
  try {
    const root = await realpath(options.repositoryRoot);
    const candidate = await realpath(options.candidateRoot);
    if (
      candidate === root ||
      candidate.startsWith(`${root}${path.sep}`) ||
      root.startsWith(`${candidate}${path.sep}`)
    )
      throw new Error(
        'CANDIDATE_COPY_REQUIRED: Use a separate editable copy outside the base checkout.',
      );
    const range = z
      .object({
        batchId: z.string(),
        firstContestNumber: z.number().int(),
        lastContestNumber: z.number().int(),
      })
      .parse(options.metadataBatch);
    const batch = {
      id: range.batchId,
      firstContestNumber: range.firstContestNumber,
      lastContestNumber: range.lastContestNumber,
    };
    verifyCorpusMetadataBatch(options.metadataBatch, batch);
    const artifact = options.metadataBatch as CorpusMetadataBatch;
    const scope = discoverMetadataBatch({
      baseCatalog: base,
      baseMetadata: options.baseMetadata,
      ...batch,
    });
    if (
      scope.batch &&
      (scope.batch.firstContestNumber !== Number(base.release.lastContestId.slice(3)) + 1 ||
        scope.batch.id !== batch.id)
    )
      throw new Error(
        'BATCH_RANGE_MISMATCH: Acquire the contiguous extension of the published base.',
      );
    const observed = materializeObservedMetadataBatch(artifact);
    summary.addedProblemIds = observed.problems.map((p) => p.id);
    const batchMetrics = validateAtCoderProblemsSnapshot(options.metrics, observed.problems);
    const baseline = await loadFullPublicProjection({
      repositoryRoot: root,
      usePreparedRelease: false,
    });
    const content = (catalog: typeof base) =>
      Object.fromEntries(
        Object.entries(projectCatalogContent(catalog)).filter(([key]) => key !== 'release'),
      );
    if (canonicalDigest(content(baseline.catalog)) !== canonicalDigest(content(base)))
      throw new Error(
        'BASE_CONTENT_MISMATCH: Use the checkout corresponding to the published base.',
      );
    const before = await readContentFiles(root);
    const files = await readContentFiles(candidate);
    const writes = new Map<string, Buffer>();
    const metadataPaths = new Set<string>();
    const add = (file: string, value: unknown) => {
      metadataPaths.add(file);
      const bytes = jsonBytes(value);
      const existing = files.get(file);
      if (existing && canonicalDigest(decode(existing)) !== canonicalDigest(value))
        throw new Error(`ACQUIRED_INPUT_CONFLICT:${file}`);
      if (!existing) {
        files.set(file, bytes);
        writes.set(file, bytes);
      }
    };
    const prefix = observed.batchId;
    for (const [kind, entries] of [
      ['contests', observed.contests],
      ['contest-gaps', observed.contestGaps],
      ['sources', observed.sources],
    ] as const)
      for (const entry of entries)
        add(
          `src/content/${kind}/${prefix}/${'id' in entry ? entry.id : entry.contestId}.json`,
          entry,
        );
    for (const slot of observed.contestSlots)
      add(`src/content/problem-slots/${prefix}/${slot.problemId ?? ''}.json`, slot);
    for (const problem of observed.problems) {
      const file = `src/content/problems/${prefix}/${problem.id}.json`;
      metadataPaths.add(file);
      const existing = files.get(file);
      if (existing) {
        const current = decode(existing) as Record<string, unknown>;
        if (
          canonicalDigest(
            Object.fromEntries(
              Object.entries(problem).filter(
                ([key]) =>
                  ![
                    'primaryTagIds',
                    'secondaryTagIds',
                    'adHocElements',
                    'placementId',
                    'publicationStatus',
                    'difficultyEvidence',
                  ].includes(key),
              ),
            ),
          ) !==
          canonicalDigest(
            Object.fromEntries(
              Object.entries(current).filter(
                ([key]) =>
                  ![
                    'primaryTagIds',
                    'secondaryTagIds',
                    'adHocElements',
                    'placementId',
                    'publicationStatus',
                    'difficultyEvidence',
                  ].includes(key),
              ),
            ),
          )
        )
          throw new Error(`ACQUIRED_INPUT_CONFLICT:${file}`);
      } else add(file, problem);
    }
    const previousMetrics = validateAtCoderProblemsSnapshot(
      decode(before.get(ATCODER_PROBLEMS_METRICS_PATH)),
      baseline.catalog.problems,
    );
    const mergedMetrics = {
      ...previousMetrics,
      problems: { ...previousMetrics.problems, ...batchMetrics.problems },
    };
    // Preserve the old snapshot date/values. New Problem difficultyEvidence below
    // records this batch's metrics date without claiming old entries were refetched.
    const currentMetrics = decode(files.get(ATCODER_PROBLEMS_METRICS_PATH));
    if (
      ![previousMetrics, mergedMetrics].some(
        (value) => canonicalDigest(value) === canonicalDigest(currentMetrics),
      )
    )
      throw new Error('OUTSIDE_BATCH_METRICS');
    files.set(ATCODER_PROBLEMS_METRICS_PATH, jsonBytes(mergedMetrics));
    writes.set(ATCODER_PROBLEMS_METRICS_PATH, jsonBytes(mergedMetrics));
    if (!scope.batch) {
      // A published rerun is accepted only when the acquired identities and metrics
      // still describe the existing Problems; it never becomes another addition.
      for (const problem of observed.problems) {
        const existing = base.problems.find((p) => p.id === problem.id);
        if (
          existing?.officialTaskId !== problem.officialTaskId ||
          canonicalDigest(previousMetrics.problems[problem.id]) !==
            canonicalDigest(batchMetrics.problems[problem.id])
        )
          throw new Error(`ACQUIRED_INPUT_CONFLICT:${problem.id}`);
      }
      for (const source of observed.sources)
        if (
          canonicalDigest(base.sources.find((s) => s.id === source.id) ?? null) !==
          canonicalDigest(source)
        )
          throw new Error(`ACQUIRED_INPUT_CONFLICT:${source.id}`);
      return { ...summary, addedProblemIds: [], status: 'unchanged', writtenPaths: [], holds: [] };
    }
    if (options.mode === 'prepare') {
      // Check every existing base byte before installing a new acquisition.
      for (const [file, bytes] of before)
        if (file !== ATCODER_PROBLEMS_METRICS_PATH && !files.get(file)?.equals(bytes)) {
          // An identical rerun may already contain authored batch placements/Unit links.
          if (
            !['src/content/policies/problem-placements.json', TAXONOMY_INDEX_PATH].includes(file) &&
            !file.startsWith('src/content/learning-units/') &&
            !file.startsWith('src/content/docs/learn/')
          )
            throw new Error(`OUTSIDE_BATCH_CHANGE:${file}`);
        }
      applying = true;
      return {
        ...summary,
        status: 'on_hold',
        writtenPaths: await writeChangedContent(candidate, writes),
        holds: [
          {
            code: 'AUTHORING_REQUIRED',
            reason:
              'Metadata is ready; complete every batch explanation, analysis, placement and Unit problem order.',
            retryCondition:
              'Edit the candidate copy, including directProblemIds/relatedProblemIds in affected Units, then run abc:update with --mode validate.',
          },
        ],
      };
    }
    const documents = requireBatchDocuments(files, summary.addedProblemIds);
    const policyPath = 'src/content/policies/problem-placements.json';
    const policy = CanonicalProblemPlacementPolicySchema.parse(decode(files.get(policyPath)));
    const policyContext = (value: typeof policy) =>
      Object.fromEntries(
        Object.entries(value).filter(([key]) => !['placements', 'placementDigest'].includes(key)),
      );
    if (
      canonicalDigest(policyContext(policy)) !== canonicalDigest(policyContext(baseline.policy)) ||
      canonicalDigest(policy.placements.slice(0, baseline.policy.placements.length)) !==
        canonicalDigest(baseline.policy.placements)
    )
      throw new Error('OUTSIDE_BATCH_PLACEMENT');
    for (const placement of baseline.policy.placements)
      if (
        canonicalDigest(policy.placements.find((p) => p.problemId === placement.problemId)) !==
        canonicalDigest(placement)
      )
        throw new Error(`OUTSIDE_BATCH_PLACEMENT:${placement.problemId}`);
    const memberships = batchUnitMembership({
      placements: policy.placements,
      units: baseline.catalog.learningUnits,
      problemIds: summary.addedProblemIds,
    });
    // Diagnose an invalid semantic role before asking for order in its alleged home.
    const outcomes = new Map(
      baseline.catalog.learningOutcomes.map((outcome) => [outcome.id, outcome]),
    );
    for (const { placement } of memberships) {
      const finding = validatePlacementOutcomeRoles(placement, outcomes)[0];
      if (finding) throw new Error(`${finding.code}:${placement.problemId}:${finding.message}`);
    }
    const allowed = new Set([
      policyPath,
      ATCODER_PROBLEMS_METRICS_PATH,
      TAXONOMY_INDEX_PATH,
      ...metadataPaths,
      ...documents.map((document) => document.file),
    ]);
    for (const [file, bytes] of files)
      if (
        !before.has(file) &&
        file.startsWith('src/content/technique-inventory/') &&
        file.endsWith('.json')
      ) {
        if (!summary.addedProblemIds.includes((decode(bytes) as { problemId: string }).problemId))
          throw new Error(`OUTSIDE_BATCH_CHANGE:${file}`);
        allowed.add(file);
      }
    for (const member of memberships) {
      const file = `src/content/problems/${prefix}/${member.problemId}.json`;
      files.set(
        file,
        jsonBytes({
          ...(decode(files.get(file)) as Record<string, unknown>),
          primaryTagIds: member.placement.primaryTagIds,
          secondaryTagIds: member.placement.supportingTagIds,
          placementId: member.placement.id,
          adHocElements: member.placement.adHocElements,
          publicationStatus: 'published',
          difficultyEvidence: `AtCoder Problems (${batchMetrics.checkedAt}): difficulty=${String(batchMetrics.problems[member.problemId]?.difficulty ?? '未推定')}; point=${String(batchMetrics.problems[member.problemId]?.point ?? '不明')}`,
        }),
      );
    }
    for (const original of baseline.catalog.learningUnits) {
      const direct = memberships.filter((m) => m.home === original.id).map((m) => m.problemId);
      const related = memberships
        .filter((m) => m.related.includes(original.id))
        .map((m) => m.problemId);
      const coverage = memberships
        .filter((m) => m.coverage.includes(original.id))
        .map((m) => m.problemId);
      if (!direct.length && !related.length && !coverage.length) continue;
      const file = [...before.keys()].find(
        (file) =>
          file.startsWith('src/content/learning-units/') &&
          file.endsWith('.json') &&
          (decode(before.get(file)) as { id: string }).id === original.id,
      );
      if (!file) throw new Error(`UNIT_MISSING:${original.id}`);
      const authoredInput = decode(files.get(file));
      const authored = LearningUnitSchema.parse(authoredInput);
      const context = (unit: object) =>
        Object.fromEntries(
          Object.entries(unit).filter(
            ([key]) => !['problemIds', 'directProblemIds', 'relatedProblemIds'].includes(key),
          ),
        );
      if (canonicalDigest(context(authoredInput as object)) !== canonicalDigest(context(original)))
        throw new Error(`UNIT_CONTENT_CONFLICT:${file}`);
      const directOrder = validateInsertedProblemOrder(
        original.directProblemIds ?? [],
        direct,
        authored.directProblemIds ?? [],
        `${original.id}:directProblemIds`,
      );
      const relatedOrder = validateInsertedProblemOrder(
        original.relatedProblemIds ?? [],
        related,
        authored.relatedProblemIds ?? [],
        `${original.id}:relatedProblemIds`,
      );
      const unit = LearningUnitSchema.parse({
        ...original,
        // Coverage is a derived membership closure, not the Unit's reading order.
        problemIds:
          canonicalDigest(authored.problemIds) === canonicalDigest(original.problemIds)
            ? [...original.problemIds, ...coverage]
            : validateInsertedProblemOrder(
                original.problemIds,
                coverage,
                authored.problemIds,
                `${original.id}:problemIds`,
              ),
        ...(direct.length ? { directProblemIds: directOrder } : {}),
        ...(related.length ? { relatedProblemIds: relatedOrder } : {}),
      });
      const unitBytes = jsonBytes(unit);
      files.set(file, unitBytes);
      allowed.add(file);
      const links = (ids: readonly string[], role: string) =>
        new Map(
          ids.map((id) => {
            const problem = observed.problems.find((p) => p.id === id);
            const placement = memberships.find((m) => m.problemId === id)?.placement;
            const outcomeId =
              role === '主題'
                ? placement?.primaryOutcomeId
                : [
                    ...(placement?.additionalPrimaryOutcomeIds ?? []),
                    ...(placement?.supportingOutcomeIds ?? []),
                  ].find((id) => original.ownedLearningOutcomeIds?.includes(id));
            const outcome = baseline.catalog.learningOutcomes.find((o) => o.id === outcomeId);
            return [
              id,
              `- [${id.toUpperCase().replace('-', ' ')}「${problem?.title ?? id}」](/problems/${id}/) — ${role}: ${outcome?.statement ?? ''}`,
            ];
          }),
        );
      if (direct.length || related.length) {
        const originalText = before.get(unit.docPath)?.toString('utf8');
        if (!originalText) throw new Error(`UNIT_DOCUMENT_MISSING:${original.id}`);
        let text = originalText;
        if (direct.length)
          text = insertUnitProblemLinks({
            text,
            heading: '問題一覧',
            previous: original.directProblemIds ?? [],
            ordered: directOrder,
            links: links(direct, '主題'),
            unitId: original.id,
          });
        if (related.length)
          text = insertUnitProblemLinks({
            text,
            heading: '関連問題',
            previous: original.relatedProblemIds ?? [],
            ordered: relatedOrder,
            links: links(related, '関連'),
            unitId: original.id,
          });
        const textBytes = Buffer.from(text);
        if (
          !files.get(unit.docPath)?.equals(before.get(unit.docPath) ?? Buffer.alloc(0)) &&
          !files.get(unit.docPath)?.equals(textBytes)
        )
          throw new Error(`UNIT_CONTENT_CONFLICT:${unit.docPath}`);
        files.set(unit.docPath, textBytes);
        allowed.add(unit.docPath);
      }
    }
    for (const file of files.keys())
      if (!before.has(file) && !allowed.has(file)) throw new Error(`OUTSIDE_BATCH_CHANGE:${file}`);
    for (const [file, bytes] of before) {
      if (!allowed.has(file) && !files.get(file)?.equals(bytes))
        throw new Error(`OUTSIDE_BATCH_CHANGE:${file}`);
    }
    temporary = await mkdtemp(path.join(tmpdir(), 'abc-update-validation-'));
    await cp(path.join(candidate, 'src/content'), path.join(temporary, 'src/content'), {
      recursive: true,
    });
    await writeChangedContent(temporary, files);
    const projection = await validateSmallBatchCandidate({
      repositoryRoot: temporary,
      targetProblemIds: summary.addedProblemIds,
      problemCount: base.problems.length + observed.problems.length,
      lastContestId: `abc${String(batch.lastContestNumber)}`,
    });
    const taxonomyBytes = jsonBytes(projection.taxonomyIndex);
    files.set(TAXONOMY_INDEX_PATH, taxonomyBytes);
    allowed.add(TAXONOMY_INDEX_PATH);
    // The canonical input was validated above. Only the derived index changes now;
    // verify its actual file before applying any generated bytes to the candidate.
    await writeFile(path.join(temporary, TAXONOMY_INDEX_PATH), taxonomyBytes);
    await verifyFullPublicProjectionDerivedFiles({
      repositoryRoot: temporary,
      taxonomyIndex: projection.taxonomyIndex,
    });
    applying = true;
    return {
      ...summary,
      status: 'passed',
      lastContestId: projection.catalog.release.lastContestId,
      cutoffAt: projection.catalog.release.cutoffAt,
      writtenPaths: await writeChangedContent(
        candidate,
        new Map([...files].filter(([file]) => allowed.has(file))),
      ),
      holds: [],
    };
  } catch (error) {
    if (applying || (error instanceof Error && 'syscall' in error)) throw error;
    return {
      ...summary,
      status: 'on_hold',
      writtenPaths: [],
      holds: [
        {
          code:
            error instanceof z.ZodError
              ? 'SCHEMA_INVALID'
              : error instanceof Error
                ? (error.message.split(':')[0] ?? 'VALIDATION_FAILED')
                : 'VALIDATION_FAILED',
          reason: error instanceof Error ? error.message : String(error),
          retryCondition:
            'Resolve the reported input/content finding and rerun the same bounded batch.',
        },
      ],
    };
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true });
  }
}

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

  const authoring = prepareAuthoringResults({
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
  if (process.argv.includes('--mode')) {
    try {
      const values = parseKeyValueArguments(process.argv.slice(2), [
        '--mode',
        '--repository-root',
        '--candidate-root',
        '--base-catalog',
        '--base-metadata',
        '--metadata-batch',
        '--metrics',
      ]);
      const mode = requiredArgument(values, '--mode');
      if (mode !== 'prepare' && mode !== 'validate')
        throw new CorpusCliError('ARGUMENTS_INVALID', '--mode must be prepare or validate.');
      const result = await runSmallBatchUpdate({
        mode,
        repositoryRoot: path.resolve(values.get('--repository-root') ?? process.cwd()),
        candidateRoot: path.resolve(requiredArgument(values, '--candidate-root')),
        baseCatalog: await readCliJson(requiredArgument(values, '--base-catalog')),
        baseMetadata: await readCliJson(requiredArgument(values, '--base-metadata')),
        metadataBatch: await readCliJson(requiredArgument(values, '--metadata-batch')),
        metrics: await readCliJson(requiredArgument(values, '--metrics')),
      });
      process.stdout.write(`${JSON.stringify(result)}\n`);
      process.exitCode = result.status === 'on_hold' ? 2 : 0;
    } catch (error) {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode =
        error instanceof CorpusCliError ? 64 : error instanceof z.ZodError ? 2 : 70;
    }
  } else {
    const fixture = argument('--fixture');
    const resumeId = argument('--resume');
    if (!fixture) {
      process.stderr.write(
        'Usage: npm run abc:update -- --mode prepare|validate --candidate-root DIR --base-catalog FILE --base-metadata FILE --metadata-batch FILE --metrics FILE [--repository-root DIR]\nLegacy fixture: --fixture initial-v1 [--resume UPDATE_ID]\n',
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
