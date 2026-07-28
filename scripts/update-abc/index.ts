import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { acquireOfficialMetadata } from './acquire.js';
import { prepareAuthoringResults } from './author.js';
import { classifyTechniques } from './classify.js';
import { discoverContests } from './discover.js';
import { stagePublicationUpdate } from './stage.js';
import type { DiscoverableContest } from './types.js';
import { validatePreparedUpdate } from './validate.js';

export interface PipelineOptions {
  readonly fixture: string;
  readonly repositoryRoot?: string;
  readonly failAt?: 'acquire' | 'author' | 'validate';
  readonly resumeUpdateId?: string;
}

export interface PipelineResult {
  readonly command: 'abc:update';
  readonly updateId: string;
  readonly contestId: string;
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
}

const initialFixtureContest = (): DiscoverableContest => ({
  contestId: 'abc256',
  startsAt: '2022-06-18T21:00:00+09:00',
  endsAt: '2022-06-18T22:40:00+09:00',
  tasks: [
    { label: 'D', sourceRevisionId: 'source-abc256-d-fixture' },
    { label: 'E', sourceRevisionId: 'source-abc256-e-fixture' },
    {
      label: 'F',
      sourceRevisionId:
        'source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965',
    },
  ],
});

const emptyCounts = () => ({ authoring_unit_draft: 0, authoring_required: 0, blocked: 0 });

export const runUpdatePipeline = async (options: PipelineOptions): Promise<PipelineResult> => {
  const started = performance.now();
  if (options.fixture !== 'initial-v1')
    throw new Error('Only the initial-v1 fixture is available before T154.');
  const [contest] = discoverContests({
    contests: [initialFixtureContest()],
    mode: 'latest-ended',
    now: '2026-07-29T12:00:00+09:00',
  });
  if (!contest) throw new Error('The initial-v1 fixture did not produce an ended Contest.');
  const acquired = await acquireOfficialMetadata(
    contest,
    options.failAt === 'acquire'
      ? { loadSource: () => Promise.reject(new Error('Injected acquisition failure.')) }
      : {},
  );
  const identitySeed = {
    fixture: options.fixture,
    contestId: contest.contestId,
    sourceSetFingerprint: acquired.sourceSetFingerprint,
  };
  const updateId = options.resumeUpdateId ?? `update-${canonicalDigest(identitySeed).slice(0, 24)}`;
  if (acquired.status === 'on_hold')
    return finish(
      updateId,
      contest.contestId,
      acquired.advancedSlotLabels,
      emptyCounts(),
      ['discover'],
      [acquired.hold?.code ?? 'SOURCE_UNAVAILABLE'],
      started,
      1,
    );

  const skill = {
    name: 'abc-explanation-author' as const,
    version: '1.1.1',
    digest: '6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa',
  };
  const authoring = prepareAuthoringResults({
    skill,
    targets: acquired.problemIds.flatMap((problemId, index) => {
      const slotLabel = acquired.advancedSlotLabels[index];
      if (slotLabel === undefined) return [];
      return [
        {
          problemId,
          slotLabel,
          ...(options.failAt === 'author'
            ? {}
            : {
                draftPath: `staging/previews/initial-v1/release-simulation/drafts/${problemId}.json`,
              }),
        },
      ];
    }),
  });
  const operations = acquired.problemIds.map((problemId) => ({
    entityType: 'problem' as const,
    entityId: problemId,
    action: 'add' as const,
    path: `staging/previews/initial-v1/release-simulation/problems/${problemId}.json`,
    beforeDigest: null,
    afterDigest: canonicalDigest({ problemId, fixture: options.fixture }),
    affectedProblemIds: [problemId],
  }));
  const staged = stagePublicationUpdate({
    previewId: options.fixture,
    contestId: contest.contestId,
    sourceSetFingerprint: acquired.sourceSetFingerprint,
    targetProblemIds: acquired.problemIds,
    operations,
  });
  void classifyTechniques(
    acquired.problemIds.map((problemId) => ({
      problemId,
      techniqueKey: 'existing-preview-technique',
    })),
    {
      'existing-preview-technique': {
        tagId: 'tag-preview',
        outcomeId: 'outcome-preview',
        unitId: 'unit-preview',
      },
    },
  );
  const validation = validatePreparedUpdate({
    problems: acquired.problemIds.map((problemId) => ({
      problemId,
      sourceAvailable: true,
      explanationComplete: options.failAt !== 'validate',
      examplesValid: true,
      placementIds: [`placement-${problemId}`],
      crossReferencesValid: true,
    })),
    taxonomyEdges: [],
    reachableProblemIds: acquired.problemIds,
    indexedProblemIds: acquired.problemIds,
    catalogProblemIds: acquired.problemIds,
  });
  const resultCounts = authoring.reduce(
    (counts, result) => ({ ...counts, [result.resultType]: counts[result.resultType] + 1 }),
    emptyCounts(),
  );
  const holdReasons = [
    ...authoring
      .filter(({ resultType }) => resultType !== 'authoring_unit_draft')
      .map(({ reasonCode }) => reasonCode ?? 'AUTHORING_REQUIRED'),
    ...validation.problemResults.flatMap(({ findingCodes }) => findingCodes),
  ];
  return finish(
    options.resumeUpdateId ?? staged.updateId,
    contest.contestId,
    acquired.advancedSlotLabels,
    resultCounts,
    ['discover', 'acquire', 'stage', 'author', 'classify', 'validate'],
    holdReasons,
    started,
    validation.blockingFindingCount,
  );
};

const finish = (
  updateId: string,
  contestId: string,
  labels: readonly string[],
  resultCounts: PipelineResult['resultCounts'],
  completedSteps: readonly string[],
  holdReasons: readonly string[],
  started: number,
  blockingFindingCount: number,
): PipelineResult => {
  const stable = {
    command: 'abc:update' as const,
    updateId,
    contestId,
    advancedSlotLabels: labels,
    resultCounts,
    state: holdReasons.length === 0 ? ('ELIGIBLE_FOR_BATCH' as const) : ('ON_HOLD' as const),
    blockingFindingCount,
    resultPath: `staging/previews/initial-v1/release-simulation/${updateId}/manifest.json`,
    completedSteps,
    holdReasons: [...new Set(holdReasons)].sort(),
  };
  return {
    ...stable,
    durationMs: Math.round(performance.now() - started),
    subjectDigest: canonicalDigest(stable),
  };
};

export const resumeUpdate = (
  previous: PipelineResult,
  options: Omit<PipelineOptions, 'resumeUpdateId'>,
): Promise<PipelineResult> => runUpdatePipeline({ ...options, resumeUpdateId: previous.updateId });

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const fixture = argument('--fixture');
  const resume = argument('--resume');
  if (!fixture) {
    process.stderr.write(
      'Usage: npm run abc:update -- --fixture initial-v1 [--resume UPDATE_ID]\n',
    );
    process.stdout.write(`${JSON.stringify({ command: 'abc:update', exitCode: 64 })}\n`);
    process.exitCode = 64;
  } else {
    const result = await runUpdatePipeline({
      fixture,
      ...(resume ? { resumeUpdateId: resume } : {}),
    });
    process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exitCode = result.state === 'ELIGIBLE_FOR_BATCH' ? 0 : 2;
  }
}

void readFile;
void path;
