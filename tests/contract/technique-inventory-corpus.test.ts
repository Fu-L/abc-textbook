import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { refreezeVerifiedPreviewCohort } from '../../src/lib/corpus/cohort.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  buildPreviewTechniqueInventoryComponent,
  buildTechniqueInventoryEvidence,
  candidatePoolMetadataBatchDigest,
  defaultCorpusInventoryLayout,
  FrozenPreviewCohortSchema,
  loadTechniqueInventoryCorpus,
  techniqueInventoryShardId,
  techniqueInventoryShardIds,
  techniqueInventoryShardNumber,
  validateTechniqueInventoryCorpus,
  type FrozenPreviewCohort,
  type LoadedTechniqueInventoryCorpus,
  type PreviewCandidatePool,
} from '../../src/lib/corpus/technique-inventory.js';
import { corpusBatches } from '../../src/lib/corpus/batches.js';
import {
  previewSelectionRulesDigest,
  type PreviewSelectionRules,
} from '../../src/lib/preview/cohort-selection.js';

const sha = (value: string): string => canonicalDigest({ value });
const checkedAt = '2026-07-24T12:00:00+09:00';

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = (values: readonly string[]): string[] =>
  [...new Set(values)].sort(compareCodeUnits);

const batchIdForContest = (contestNumber: number): string => {
  const batch = corpusBatches.find(
    ({ firstContestNumber, lastContestNumber }) =>
      contestNumber >= firstContestNumber && contestNumber <= lastContestNumber,
  );
  if (!batch) throw new Error(`No batch for ABC ${String(contestNumber)}.`);
  return batch.id;
};

const problemSourceId = (problemId: string): string => `source-${problemId}-problem`;
const taskListSourceId = (contestId: string): string => `source-${contestId}-tasks`;
const editorialIndexSourceId = (contestId: string): string => `source-${contestId}-editorial-index`;

const inventoryItem = (problemId: string, sourceRevisionId: string) => ({
  problemId,
  sourceRevisionIds: [sourceRevisionId],
  coreMethod: `Derive the invariant needed by ${problemId}.`,
  proofIdeas: ['Prove that each transition preserves the stated invariant.'],
  asymptoticComplexity: { time: 'O(N log N)', space: 'O(N)' },
  prerequisiteCandidates: ['Asymptotic analysis'],
  implementationConcerns: ['Check the smallest valid input.'],
  outcomeCandidates: ['Select and justify the invariant before implementation.'],
  adHocElements: [],
  authorId: 'person-maintainer',
  reviewStatus: 'reviewed' as const,
});

const makeValidCorpus = (): LoadedTechniqueInventoryCorpus => {
  const contests: LoadedTechniqueInventoryCorpus['contests'][number][] = [];
  const contestGaps: LoadedTechniqueInventoryCorpus['contestGaps'][number][] = [];
  const contestSlots: LoadedTechniqueInventoryCorpus['contestSlots'][number][] = [];
  const problems: LoadedTechniqueInventoryCorpus['problems'][number][] = [];
  const sources: LoadedTechniqueInventoryCorpus['sources'][number][] = [];
  const inventory: LoadedTechniqueInventoryCorpus['inventory'][number][] = [];

  for (let number = 212; number <= 466; number += 1) {
    const contestId = `abc${String(number)}`;
    const batchId = batchIdForContest(number);
    if (number === 316) {
      contestGaps.push({
        path: `src/content/contest-gaps/${batchId}/${contestId}.json`,
        entity: {
          number,
          contestId,
          status: 'officially_unheld',
          evidenceUrl: 'https://atcoder.jp/contests/abc350/tasks/abc350_a',
          evidenceAssertion: 'ABC316 was not held on AtCoder.',
          checkedAt,
          termsCheckedAt: checkedAt,
          fingerprint: sha('abc316-official-gap'),
        },
      });
      continue;
    }
    const hasEx = number === 300;
    const officialTaskOrder = ['A', 'B', 'C', 'D', 'E', ...(hasEx ? ['Ex'] : [])];
    const officialTaskIds = [
      `${contestId}_a`,
      `${contestId}_b`,
      `${contestId}_c`,
      `${contestId}_d`,
      `${contestId}_e`,
      ...(hasEx ? [`${contestId}_h`] : []),
    ];
    const orderSourceId = taskListSourceId(contestId);
    contests.push({
      path: `src/content/contests/${batchId}/${contestId}.json`,
      entity: {
        id: contestId,
        number,
        title: `AtCoder Beginner Contest ${String(number)}`,
        startedAt: '2025-01-01T12:00:00+09:00',
        endedAt: '2025-01-01T13:40:00+09:00',
        officialUrl: `https://atcoder.jp/contests/${contestId}`,
        officialTaskOrder,
        officialTaskIds,
        taskOrderSourceRevisionId: orderSourceId,
        checkedAt,
      },
    });
    sources.push({
      path: `src/content/sources/${batchId}/${orderSourceId}.json`,
      entity: {
        id: orderSourceId,
        url: `https://atcoder.jp/contests/${contestId}/tasks`,
        sourceKind: 'official_contest',
        contestId,
        officialTaskId: null,
        checkedAt,
        fingerprint: sha(`${contestId}-tasks`),
        termsCheckedAt: checkedAt,
      },
    });
    sources.push({
      path: `src/content/sources/${batchId}/${editorialIndexSourceId(contestId)}.json`,
      entity: {
        id: editorialIndexSourceId(contestId),
        url: `https://atcoder.jp/contests/${contestId}/editorial`,
        sourceKind: 'official_editorial',
        contestId,
        officialTaskId: null,
        checkedAt,
        fingerprint: sha(`${contestId}-editorial-index`),
        termsCheckedAt: checkedAt,
      },
    });

    for (const label of ['E', 'Ex']) {
      const exists = label === 'E' || hasEx;
      const officialOrder = exists ? officialTaskOrder.indexOf(label) : null;
      const officialTaskId =
        officialOrder === null ? null : (officialTaskIds[officialOrder] ?? null);
      const problemId = exists ? `${contestId}-${label.toLowerCase()}` : null;
      contestSlots.push({
        path: `src/content/problem-slots/${batchId}/${contestId}-${label.toLowerCase()}.json`,
        entity: {
          contestId,
          label,
          officialTaskId,
          officialOrder,
          availability: exists ? 'exists' : 'official_absent',
          catalogStatus: 'uncollected',
          holdReason: null,
          problemId,
          sourceRevisionId: orderSourceId,
          checkedAt,
        },
      });
      if (!problemId || !officialTaskId) continue;
      const sourceId = problemSourceId(problemId);
      problems.push({
        path: `src/content/problems/${batchId}/${problemId}.json`,
        entity: {
          id: problemId,
          contestId,
          slotLabel: label,
          officialTaskId,
          title: `${contestId} ${label}`,
          officialUrl: `https://atcoder.jp/contests/${contestId}/tasks/${officialTaskId}`,
          constraintsSummary: null,
          difficultyEvidence: null,
          sourceRevisionIds: [sourceId],
          checkedAt,
          publicationStatus: 'uncollected',
          primaryTagIds: [],
          secondaryTagIds: [],
          adHocElements: [],
          placementId: null,
        },
      });
      sources.push({
        path: `src/content/sources/${batchId}/${sourceId}.json`,
        entity: {
          id: sourceId,
          url: `https://atcoder.jp/contests/${contestId}/tasks/${officialTaskId}`,
          sourceKind: 'official_problem',
          contestId,
          officialTaskId,
          checkedAt,
          fingerprint: sha(`${contestId}-${officialTaskId}`),
          termsCheckedAt: checkedAt,
        },
      });
      const item = inventoryItem(problemId, sourceId);
      const shardId = techniqueInventoryShardId(problemId);
      inventory.push({
        path: `src/content/technique-inventory/${shardId}/${problemId}.json`,
        shardId,
        entity: item,
      });
    }
  }

  const metadataOnly = { contests, contestSlots, problems, sources };
  const metadataBatchDigest = candidatePoolMetadataBatchDigest(metadataOnly);
  const allowedDomains = [
    'data-structures-algorithm-design',
    'dynamic-programming',
    'graph-search',
    'mathematics-combinatorics',
  ];
  const rangeProblems = problems
    .filter(({ entity }) => {
      const number = Number(entity.contestId.slice(3));
      return number >= 212 && number <= 263;
    })
    .sort((left, right) => compareCodeUnits(left.entity.id, right.entity.id));
  const candidates: PreviewCandidatePool['candidates'][number][] = rangeProblems.map(
    ({ entity: problem }, index) => {
      const domain = allowedDomains[Math.floor(index / 2) % allowedDomains.length];
      if (!domain) throw new Error('Domain fixture is incomplete.');
      const outcomeId = `candidate-outcome-${domain}`;
      const sourceRevisionId = problem.sourceRevisionIds[0];
      if (!sourceRevisionId) throw new Error('Problem source fixture is incomplete.');
      return {
        problemId: problem.id,
        contestNumber: Number(problem.contestId.slice(3)),
        officialTaskOrder: 4,
        advancedLabel: problem.slotLabel,
        officialTaskId: problem.officialTaskId,
        sourceRevisionIds: [sourceRevisionId],
        candidateDomains: [domain],
        candidateOutcomeIds: [outcomeId],
        classifications: [
          {
            domain,
            outcomeId,
            sourceRevisionIds: [sourceRevisionId],
            rationale: 'The official task source supports this lightweight fixture classification.',
          },
        ],
        selectionEligible: true,
        exclusionReason: null,
        fixtureId: null,
      };
    },
  );
  const fixtureCandidate: PreviewCandidatePool['candidates'][number] = {
    problemId: 'abc999-f',
    contestNumber: 999,
    officialTaskOrder: 5,
    advancedLabel: 'F',
    officialTaskId: 'abc999_f',
    sourceRevisionIds: ['fixture-source-abc999-f'],
    candidateDomains: ['graph-search'],
    candidateOutcomeIds: ['candidate-outcome-graph-search'],
    classifications: [
      {
        domain: 'graph-search',
        outcomeId: 'candidate-outcome-graph-search',
        sourceRevisionIds: ['fixture-source-abc999-f'],
        rationale: 'A declared fixture supplies future-label coverage.',
      },
    ],
    selectionEligible: true,
    exclusionReason: null,
    fixtureId: 'future-label-fixture',
  };
  candidates.push(fixtureCandidate);
  candidates.sort(
    (left, right) =>
      left.contestNumber - right.contestNumber ||
      left.officialTaskOrder - right.officialTaskOrder ||
      compareCodeUnits(left.problemId, right.problemId),
  );
  const candidatePoolSubject = {
    schemaVersion: '1.0.0' as const,
    previewId: 'initial-v1' as const,
    batchId: 'abc212-abc263' as const,
    metadataBatchDigest,
    allowedDomains,
    sourceRevisionIds: sortedUnique(
      candidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
    candidates,
  };
  const candidatePool: PreviewCandidatePool = {
    ...candidatePoolSubject,
    candidatePoolDigest: canonicalDigest(candidatePoolSubject),
  };
  const selectionRules = {
    seedRange: {
      firstContestNumber: 212,
      lastContestNumber: 466,
      requireContinuity: true,
    },
    scopeRule: {
      anchorLabel: 'D',
      relation: 'after_in_official_task_order',
      labelRegistry: 'dynamic_official_order_union',
      requireOfficialStateForEveryRegistryLabel: true,
    },
    cohortRules: {
      domains: [
        'graph-search',
        'dynamic-programming',
        'data-structures-algorithm-design',
        'mathematics-combinatorics',
      ],
      minimumProblemsPerDomain: 2,
      minimumProblemsPerOutcome: 2,
      minimumProblemCount: 8,
      minimumContestCount: 3,
      minimumAdvancedLabelCount: 2,
      stableSortKeys: ['contestNumber', 'officialTaskOrder', 'problemId'],
      allowFixtureSupplement: true,
      requireFixtureBoundaryDeclaration: true,
    },
    publicationBoundary: {
      allowedPreviewRoots: ['staging/previews/initial-v1', 'docs/verification/previews/initial-v1'],
      forbiddenPublicRoots: [
        'src/content/tags',
        'src/content/learning-outcomes',
        'src/content/learning-units',
        'src/content/releases',
      ],
    },
  } satisfies PreviewSelectionRules;
  const previewManifest: FrozenPreviewCohort = FrozenPreviewCohortSchema.parse(
    refreezeVerifiedPreviewCohort({
      pool: candidatePool,
      selectionRules,
      frozenRulesDigest: previewSelectionRulesDigest(selectionRules),
    }),
  );
  const selectedProblemIds = previewManifest.selectedProblemIds;
  const canonicalInventoryById = new Map(inventory.map(({ entity }) => [entity.problemId, entity]));
  const previewInventory = selectedProblemIds.map((problemId) => {
    const item =
      canonicalInventoryById.get(problemId) ?? inventoryItem(problemId, 'fixture-source-abc999-f');
    return {
      path: `staging/previews/initial-v1/technique-inventory/${problemId}.json`,
      entity: item,
    };
  });
  const previewComponent = buildPreviewTechniqueInventoryComponent({
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

const writeJson = async (root: string, relativePath: string, value: unknown): Promise<void> => {
  const absolutePath = path.join(root, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`);
};

const materializeCorpus = async (
  root: string,
  corpus: LoadedTechniqueInventoryCorpus,
): Promise<void> => {
  const writes: Promise<unknown>[] = [];
  for (const loaded of [
    ...corpus.contests,
    ...corpus.contestGaps,
    ...corpus.contestSlots,
    ...corpus.problems,
    ...corpus.sources,
    ...corpus.inventory,
    ...corpus.previewInventory,
  ]) {
    writes.push(writeJson(root, loaded.path, loaded.entity));
  }
  for (const shardId of techniqueInventoryShardIds) {
    writes.push(
      mkdir(path.join(root, 'src/content/technique-inventory', shardId), { recursive: true }),
    );
  }
  for (const batch of corpusBatches) {
    writes.push(mkdir(path.join(root, 'src/content/contest-gaps', batch.id), { recursive: true }));
  }
  writes.push(
    writeJson(root, 'staging/previews/initial-v1/candidate-pool.json', corpus.candidatePool),
    writeJson(root, 'staging/previews/initial-v1/preview-manifest.json', corpus.previewManifest),
    writeJson(
      root,
      'docs/verification/previews/initial-v1/components/technique-inventory.json',
      corpus.previewComponent,
    ),
  );
  await Promise.all(writes);
};

const runInventoryCli = async (
  args: readonly string[],
): Promise<{ readonly exitCode: number; readonly stdout: string; readonly stderr: string }> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', 'scripts/corpus/verify-inventory.ts', ...args],
      { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] },
    );
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
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`verify-inventory terminated by ${signal}.`));
        return;
      }
      resolve({ exitCode: code ?? 70, stdout, stderr });
    });
  });

describe('T038-T044 corpus Technique Inventory contract', () => {
  const validCorpus = makeValidCorpus();
  let repositoryRoot = '';

  beforeAll(async () => {
    repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'abc-inventory-corpus-'));
    await materializeCorpus(repositoryRoot, validCorpus);
  });

  afterAll(async () => {
    if (repositoryRoot) await rm(repositoryRoot, { recursive: true, force: true });
  });

  it('freezes the portable SHA-256 six-way Problem-ID shard rule', () => {
    expect(techniqueInventoryShardIds).toEqual([
      'shard-00',
      'shard-01',
      'shard-02',
      'shard-03',
      'shard-04',
      'shard-05',
    ]);
    expect(
      ['abc212-e', 'abc300-ex', 'abc466-h'].map((problemId) => [
        problemId,
        techniqueInventoryShardNumber(problemId),
        techniqueInventoryShardId(problemId),
      ]),
    ).toEqual([
      ['abc212-e', 4, 'shard-04'],
      ['abc300-ex', 3, 'shard-03'],
      ['abc466-h', 5, 'shard-05'],
    ]);
  });

  it('strictly loads one entity per JSON file and builds byte-stable PASS evidence', async () => {
    const loaded = await loadTechniqueInventoryCorpus(defaultCorpusInventoryLayout(repositoryRoot));
    const first = buildTechniqueInventoryEvidence(loaded);
    const second = buildTechniqueInventoryEvidence(loaded);

    expect(first.diagnostics).toEqual([]);
    expect(first.status).toBe('passed');
    expect(first.scope.contestCount).toBe(254);
    expect(first.scope.officialContestGapNumbers).toEqual([316]);
    expect(first.scope.advancedSlotLabels).toEqual(['E', 'Ex']);
    expect(first.scope.problemCount).toBe(255);
    expect(first.scope.inventoryCount).toBe(255);
    expect(first.shards).toHaveLength(6);
    expect(first).toEqual(second);
    expect(first.evidenceDigest).toMatch(/^[a-f0-9]{64}$/u);
  });

  it('rejects unknown fields instead of accepting a loose metadata envelope', async () => {
    const contestPath = path.join(repositoryRoot, 'src/content/contests/abc212-abc263/abc212.json');
    const original = JSON.parse(await readFile(contestPath, 'utf8')) as Record<string, unknown>;
    await writeFile(contestPath, `${JSON.stringify({ ...original, unexpected: true })}\n`);
    await expect(
      loadTechniqueInventoryCorpus(defaultCorpusInventoryLayout(repositoryRoot)),
    ).rejects.toMatchObject({ code: 'CORPUS_SCHEMA_INVALID' });
    await writeFile(contestPath, `${JSON.stringify(original, null, 2)}\n`);
  });

  it('rejects partial joins and wrong deterministic shard ownership', () => {
    const missing = { ...validCorpus, inventory: validCorpus.inventory.slice(1) };
    expect(validateTechniqueInventoryCorpus(missing).map(({ code }) => code)).toContain(
      'TECHNIQUE_INVENTORY_MISSING',
    );

    const first = validCorpus.inventory[0];
    if (!first) throw new Error('Inventory fixture is empty.');
    const wrongShard = techniqueInventoryShardIds.find((shardId) => shardId !== first.shardId);
    if (!wrongShard) throw new Error('Shard fixture is incomplete.');
    const misplaced = {
      ...validCorpus,
      inventory: [{ ...first, shardId: wrongShard }, ...validCorpus.inventory.slice(1)],
    };
    expect(validateTechniqueInventoryCorpus(misplaced).map(({ code }) => code)).toContain(
      'TECHNIQUE_INVENTORY_SHARD_MISMATCH',
    );
  });

  it('rejects incomplete official-state matrices and source-locator substitution', () => {
    const missingAbsentState = {
      ...validCorpus,
      contestSlots: validCorpus.contestSlots.filter(
        ({ entity }) => !(entity.contestId === 'abc212' && entity.label === 'Ex'),
      ),
    };
    expect(validateTechniqueInventoryCorpus(missingAbsentState).map(({ code }) => code)).toContain(
      'CONTEST_SLOT_STATE_MISSING',
    );

    const firstInventory = validCorpus.inventory[0];
    const otherSource = validCorpus.sources.find(
      ({ entity }) =>
        entity.sourceKind === 'official_problem' &&
        entity.id !== firstInventory?.entity.sourceRevisionIds[0],
    );
    if (!firstInventory || !otherSource) throw new Error('Source fixture is incomplete.');
    const wrongSource = {
      ...validCorpus,
      inventory: [
        {
          ...firstInventory,
          entity: { ...firstInventory.entity, sourceRevisionIds: [otherSource.entity.id] },
        },
        ...validCorpus.inventory.slice(1),
      ],
    };
    const codes = validateTechniqueInventoryCorpus(wrongSource).map(({ code }) => code);
    expect(codes).toContain('TECHNIQUE_INVENTORY_OFFICIAL_PROBLEM_SOURCE_MISSING');
    expect(codes).toContain('TECHNIQUE_INVENTORY_SOURCE_LOCATOR_MISMATCH');

    const firstProblem = validCorpus.problems[0];
    const contestWideSource = validCorpus.sources.find(
      ({ entity }) =>
        entity.contestId === firstProblem?.entity.contestId &&
        entity.sourceKind === 'official_contest',
    );
    if (!firstProblem || !contestWideSource)
      throw new Error('Problem source fixture is incomplete.');
    const broadenedProblem = {
      ...validCorpus,
      problems: [
        {
          ...firstProblem,
          entity: {
            ...firstProblem.entity,
            sourceRevisionIds: [
              ...firstProblem.entity.sourceRevisionIds,
              contestWideSource.entity.id,
            ],
          },
        },
        ...validCorpus.problems.slice(1),
      ],
    };
    const broadenedCodes = validateTechniqueInventoryCorpus(broadenedProblem).map(
      ({ code }) => code,
    );
    expect(broadenedCodes).toContain('PROBLEM_SOURCE_LOCATOR_MISMATCH');
    expect(broadenedCodes).toContain('PROBLEM_OFFICIAL_SOURCE_SET_INVALID');
  });

  it('accepts multiple task-bound Official editorial revisions for a split editorial', () => {
    const firstProblem = validCorpus.problems[0];
    if (!firstProblem) throw new Error('Problem fixture is incomplete.');
    const editorialSources = [1, 2].map((part) => ({
      path: `src/content/sources/${firstProblem.entity.contestId}/editorial-part-${String(part)}.json`,
      entity: {
        id: `source-${firstProblem.entity.id}-editorial-part-${String(part)}`,
        url: `https://atcoder.jp/contests/${firstProblem.entity.contestId}/editorial/${String(1000 + part)}`,
        sourceKind: 'official_editorial' as const,
        contestId: firstProblem.entity.contestId,
        officialTaskId: firstProblem.entity.officialTaskId,
        checkedAt,
        fingerprint: sha(`editorial-part-${String(part)}`),
        termsCheckedAt: checkedAt,
      },
    }));
    const splitEditorialCorpus = {
      ...validCorpus,
      problems: [
        {
          ...firstProblem,
          entity: {
            ...firstProblem.entity,
            sourceRevisionIds: [
              ...firstProblem.entity.sourceRevisionIds,
              ...editorialSources.map(({ entity }) => entity.id),
            ],
          },
        },
        ...validCorpus.problems.slice(1),
      ],
      sources: [...validCorpus.sources, ...editorialSources],
    };

    const codes = validateTechniqueInventoryCorpus(splitEditorialCorpus).map(({ code }) => code);
    expect(codes).not.toContain('PROBLEM_SOURCE_LOCATOR_MISMATCH');
    expect(codes).not.toContain('PROBLEM_OFFICIAL_SOURCE_SET_INVALID');
  });

  it('rejects stale cohort inputs and preview-only canonical leakage', () => {
    const staleManifest = {
      ...validCorpus,
      previewManifest: {
        ...validCorpus.previewManifest,
        candidatePoolDigest: sha('stale-pool'),
      },
    };
    const staleCodes = validateTechniqueInventoryCorpus(staleManifest).map(({ code }) => code);
    expect(staleCodes).toContain('PREVIEW_MANIFEST_DIGEST_STALE');
    expect(staleCodes).toContain('PREVIEW_MANIFEST_INPUT_DIGEST_MISMATCH');

    const firstInventory = validCorpus.inventory[0];
    if (!firstInventory) throw new Error('Inventory fixture is empty.');
    const leaked = {
      ...validCorpus,
      inventory: [
        {
          ...firstInventory,
          entity: {
            ...firstInventory.entity,
            coreMethod: 'staging/previews/initial-v1 must not become a canonical method.',
          },
        },
        ...validCorpus.inventory.slice(1),
      ],
    };
    expect(validateTechniqueInventoryCorpus(leaked).map(({ code }) => code)).toContain(
      'PREVIEW_LEAKAGE_IN_CANONICAL_INVENTORY',
    );

    const staleComponent = {
      ...validCorpus,
      previewComponent: {
        ...validCorpus.previewComponent,
        artifactDigest: sha('stale-preview-inventory'),
      },
    };
    const componentCodes = validateTechniqueInventoryCorpus(staleComponent).map(({ code }) => code);
    expect(componentCodes).toContain('PREVIEW_INVENTORY_COMPONENT_ARTIFACT_STALE');
    expect(componentCodes).toContain('PREVIEW_INVENTORY_COMPONENT_DIGEST_STALE');
  });

  it('rejects an internally consistent eligible subset that is not the deterministic optimum', () => {
    const selectedCandidate = validCorpus.candidatePool.candidates.find(
      ({ fixtureId, selectionEligible }) => fixtureId === null && selectionEligible,
    );
    if (!selectedCandidate) throw new Error('Eligible candidate fixture is missing.');
    const selectedProblemIds = [selectedCandidate.problemId];
    const { manifestDigest: previousDigest, ...previousSubject } = validCorpus.previewManifest;
    void previousDigest;
    const manipulatedSubject = {
      ...previousSubject,
      selectedProblemIds,
      sourceRevisionIds: selectedCandidate.sourceRevisionIds,
      fixtureBoundaries: [],
      excludedProblemIds: validCorpus.candidatePool.candidates
        .map(({ problemId }) => problemId)
        .filter((problemId) => !selectedProblemIds.includes(problemId)),
    };
    const manipulatedManifest: FrozenPreviewCohort = {
      ...manipulatedSubject,
      manifestDigest: canonicalDigest(manipulatedSubject),
    };
    const manipulated = {
      ...validCorpus,
      previewManifest: manipulatedManifest,
      previewInventory: validCorpus.previewInventory.filter(
        ({ entity }) => entity.problemId === selectedCandidate.problemId,
      ),
    };

    expect(validateTechniqueInventoryCorpus(manipulated).map(({ code }) => code)).toContain(
      'PREVIEW_COHORT_DETERMINISTIC_SELECTION_MISMATCH',
    );
  });

  it('independently rejects broadened or evidence-free candidate classifications', () => {
    const target = validCorpus.candidatePool.candidates.find(({ fixtureId }) => fixtureId === null);
    const crossTaskSource = validCorpus.sources.find(
      ({ entity }) =>
        entity.sourceKind === 'official_problem' && entity.id !== target?.sourceRevisionIds[0],
    );
    if (!target || !crossTaskSource) throw new Error('Candidate source fixture is incomplete.');
    const broadenedCandidates = validCorpus.candidatePool.candidates.map((candidate) =>
      candidate.problemId === target.problemId
        ? {
            ...candidate,
            sourceRevisionIds: sortedUnique([
              ...candidate.sourceRevisionIds,
              crossTaskSource.entity.id,
            ]),
            classifications: candidate.classifications.map((classification) => ({
              ...classification,
              sourceRevisionIds: [crossTaskSource.entity.id],
            })),
          }
        : candidate,
    );
    const broadenedSubject = {
      ...validCorpus.candidatePool,
      sourceRevisionIds: sortedUnique(
        broadenedCandidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
      ),
      candidates: broadenedCandidates,
    };
    const { candidatePoolDigest: previousPoolDigest, ...broadenedWithoutDigest } = broadenedSubject;
    void previousPoolDigest;
    const broadened = {
      ...validCorpus,
      candidatePool: {
        ...broadenedWithoutDigest,
        candidatePoolDigest: canonicalDigest(broadenedWithoutDigest),
      },
    };
    const broadenedCodes = validateTechniqueInventoryCorpus(broadened).map(({ code }) => code);
    expect(broadenedCodes).toContain('CANDIDATE_PROBLEM_SOURCE_SET_MISMATCH');
    expect(broadenedCodes).toContain('CANDIDATE_SOURCE_LOCATOR_MISMATCH');

    const emptyCandidates = validCorpus.candidatePool.candidates.map((candidate) =>
      candidate.problemId === target.problemId
        ? {
            ...candidate,
            candidateDomains: [],
            candidateOutcomeIds: [],
            classifications: [],
          }
        : candidate,
    );
    const { candidatePoolDigest: oldDigest, ...poolWithoutDigest } = validCorpus.candidatePool;
    void oldDigest;
    const emptySubject = { ...poolWithoutDigest, candidates: emptyCandidates };
    const evidenceFree = {
      ...validCorpus,
      candidatePool: {
        ...emptySubject,
        candidatePoolDigest: canonicalDigest(emptySubject),
      },
    };
    expect(validateTechniqueInventoryCorpus(evidenceFree).map(({ code }) => code)).toContain(
      'CANDIDATE_CLASSIFICATION_MISSING',
    );
  });

  it('rejects shallow, placeholder, duplicate-method, and non-asymptotic inventory prose', () => {
    const first = validCorpus.inventory[0];
    const second = validCorpus.inventory[1];
    if (!first || !second) throw new Error('Inventory quality fixture is incomplete.');
    const duplicateMethod = first.entity.coreMethod;
    const degraded = {
      ...validCorpus,
      inventory: validCorpus.inventory.map((loaded, index) =>
        index === 0
          ? {
              ...loaded,
              entity: {
                ...loaded.entity,
                coreMethod: 'TODO: 公式解説参照',
                proofIdeas: ['short'],
                outcomeCandidates: ['unknown'],
                asymptoticComplexity: { time: 'linear', space: 'constant' },
              },
            }
          : index === 1 || index === 2
            ? { ...loaded, entity: { ...loaded.entity, coreMethod: duplicateMethod } }
            : loaded,
      ),
    };
    const qualityCodes = validateTechniqueInventoryCorpus(degraded).map(({ code }) => code);
    expect(qualityCodes).toContain('TECHNIQUE_INVENTORY_ANALYSIS_TOO_SHALLOW');
    expect(qualityCodes).toContain('TECHNIQUE_INVENTORY_COMPLEXITY_NOT_EXPLICIT');
    expect(qualityCodes).toContain('TECHNIQUE_INVENTORY_PLACEHOLDER_TEXT');
    expect(qualityCodes).toContain('TECHNIQUE_INVENTORY_CORE_METHOD_DUPLICATE');
  });

  it('keeps --check mutation-free and makes explicit --write atomic and idempotent', async () => {
    const commonArgs = ['--repository-root', repositoryRoot] as const;
    const missing = await runInventoryCli(['--check', ...commonArgs]);
    expect(missing.exitCode).toBe(2);
    expect(missing.stderr).toContain('CORPUS_EVIDENCE_MISSING');

    const firstWrite = await runInventoryCli(['--write', ...commonArgs]);
    expect(firstWrite.exitCode).toBe(0);
    const evidencePath = path.join(
      repositoryRoot,
      'docs/verification/bootstrap/technique-inventory.json',
    );
    const firstBytes = await readFile(evidencePath, 'utf8');

    const secondWrite = await runInventoryCli(['--write', ...commonArgs]);
    expect(secondWrite.exitCode).toBe(0);
    await expect(readFile(evidencePath, 'utf8')).resolves.toBe(firstBytes);

    const check = await runInventoryCli(['--check', ...commonArgs]);
    expect(check.exitCode).toBe(0);
    await writeFile(evidencePath, `${firstBytes.trimEnd()} \n`);
    const stale = await runInventoryCli(['--check', ...commonArgs]);
    expect(stale.exitCode).toBe(2);
    expect(stale.stderr).toContain('CORPUS_EVIDENCE_STALE');

    const usage = await runInventoryCli(commonArgs);
    expect(usage.exitCode).toBe(64);
    const unownedOutput = await runInventoryCli([
      '--write',
      ...commonArgs,
      '--output',
      'staging/previews/initial-v1/preview-manifest.json',
    ]);
    expect(unownedOutput.exitCode).toBe(64);
    expect(unownedOutput.stderr).toContain('OUTPUT_PATH_NOT_OWNED');
  });
});
