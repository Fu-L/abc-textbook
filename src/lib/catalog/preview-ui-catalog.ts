import { z } from 'zod';

import contest212 from '../../content/contests/abc212-abc263/abc212.json';
import contest215 from '../../content/contests/abc212-abc263/abc215.json';
import contest218 from '../../content/contests/abc212-abc263/abc218.json';
import contest222 from '../../content/contests/abc212-abc263/abc222.json';
import contest223 from '../../content/contests/abc212-abc263/abc223.json';
import contest232 from '../../content/contests/abc212-abc263/abc232.json';
import contest252 from '../../content/contests/abc212-abc263/abc252.json';
import contest256 from '../../content/contests/abc212-abc263/abc256.json';
import problem212G from '../../content/problems/abc212-abc263/abc212-g.json';
import problem215E from '../../content/problems/abc212-abc263/abc215-e.json';
import problem218F from '../../content/problems/abc212-abc263/abc218-f.json';
import problem222G from '../../content/problems/abc212-abc263/abc222-g.json';
import problem223F from '../../content/problems/abc212-abc263/abc223-f.json';
import problem232E from '../../content/problems/abc212-abc263/abc232-e.json';
import problem252E from '../../content/problems/abc212-abc263/abc252-e.json';
import problem256F from '../../content/problems/abc212-abc263/abc256-f.json';
import previewManifest from '../../../staging/previews/initial-v1/preview-manifest.json';
import dataStructures from '../../../staging/previews/initial-v1/taxonomy/groups/data-structures-algorithm-design.json';
import dynamicProgramming from '../../../staging/previews/initial-v1/taxonomy/groups/dynamic-programming.json';
import graphSearch from '../../../staging/previews/initial-v1/taxonomy/groups/graph-search.json';
import mathematics from '../../../staging/previews/initial-v1/taxonomy/groups/mathematics-combinatorics.json';
import {
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from './advanced-slot-registry.js';

const routeSchema = z.string().regex(/^\/(?:[a-z0-9-]+\/)*(?:[a-z0-9-]+\/)?$/u);
const contestSchema = z
  .object({
    id: z.string().regex(/^abc\d{3,}$/u),
    number: z.number().int(),
    title: z.string().min(1),
    startedAt: z.string().min(1),
    endedAt: z.string().min(1),
    officialUrl: z.url(),
    officialTaskOrder: z.array(z.string().min(1)),
    officialTaskIds: z.array(z.string().min(1)),
    taskOrderSourceRevisionId: z.string().min(1),
    checkedAt: z.string().min(1),
    slotStateOverrides: z.record(z.string(), z.enum(['unknown', 'withdrawn'])).optional(),
  })
  .loose();
const problemSourceSchema = z
  .strictObject({
    id: z.string().min(1),
    contestId: z.string().min(1),
    slotLabel: z.string().min(1),
    officialTaskId: z.string().min(1),
    title: z.string().min(1),
    officialUrl: z.url(),
    constraintsSummary: z.string().min(1),
    difficultyEvidence: z.string().nullable(),
    sourceRevisionIds: z.array(z.string().min(1)).min(1),
    checkedAt: z.string().min(1),
  })
  .loose();
const groupSchema = z
  .strictObject({
    domain: z.string().min(1),
    problemIds: z.array(z.string().min(1)).min(2),
    tag: z
      .strictObject({
        id: z.string().min(1),
        name: z.string().min(1),
        definition: z.string().min(1),
        prerequisiteTagIds: z.array(z.string()),
        outcomeIds: z.array(z.string().min(1)).min(1),
        representativeProblemIds: z.array(z.string().min(1)),
      })
      .loose(),
    outcome: z
      .strictObject({
        id: z.string().min(1),
        statement: z.string().min(1),
        prerequisiteOutcomeIds: z.array(z.string()),
      })
      .loose(),
    unit: z
      .strictObject({
        id: z.string().min(1),
        title: z.string().min(1),
        prerequisiteUnitIds: z.array(z.string()),
        problemIds: z.array(z.string().min(1)),
        sourceRevisionIds: z.array(z.string().min(1)).min(1),
        tagIds: z.array(z.string().min(1)).min(1),
        outcomeIds: z.array(z.string().min(1)).min(1),
      })
      .loose(),
    placements: z.array(
      z
        .strictObject({
          problemId: z.string().min(1),
          classificationRationale: z.string().min(1),
        })
        .loose(),
    ),
  })
  .loose();

const previewProblemSchema = z.strictObject({
  id: z.string().min(1),
  contestId: z.string().min(1),
  contestNumber: z.number().int(),
  label: z.string().min(1),
  title: z.string().min(1),
  officialUrl: z.url(),
  checkedAt: z.string().min(1),
  constraintsSummary: z.string().min(1),
  publicationState: z.enum(['preview', 'published']),
  route: routeSchema,
  explanationAnchor: z.string().startsWith('#'),
  tagIds: z.array(z.string().min(1)).min(1),
  primaryTagId: z.string().min(1),
  supportingTagIds: z.array(z.string().min(1)),
  learningUnitId: z.string().min(1),
  learningOutcomeId: z.string().min(1),
  similarProblemIds: z.array(z.string().min(1)).min(1),
  explanationSummary: z.string().min(1),
  sourceRevisionIds: z.array(z.string().min(1)).min(1),
});

export const PreviewUiCatalogSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.string().min(1),
  subjectDigest: z.string().regex(/^[a-f0-9]{64}$/u),
  publicationBoundary: z.enum(['private-preview', 'public']),
  registry: z.strictObject({
    labels: z.array(z.string().min(1)).min(1),
    digest: z.string().regex(/^[a-f0-9]{64}$/u),
  }),
  contests: z.array(
    z.strictObject({
      id: z.string().min(1),
      number: z.number().int(),
      title: z.string().min(1),
      officialUrl: z.url(),
      route: routeSchema,
    }),
  ),
  cells: z.array(
    z.strictObject({
      contestId: z.string().min(1),
      label: z.string().min(1),
      state: z.enum(['preview', 'unpublished', 'official_absent', 'unknown', 'withdrawn']),
      stateLabel: z.string().min(1),
      problemId: z.string().nullable(),
      officialTaskId: z.string().nullable(),
    }),
  ),
  problems: z.array(previewProblemSchema),
  tags: z.array(
    z.strictObject({
      id: z.string().min(1),
      name: z.string().min(1),
      definition: z.string().min(1),
      aliases: z.array(z.string()),
      route: routeSchema,
      problemIds: z.array(z.string().min(1)),
    }),
  ),
  learningUnits: z.array(
    z.strictObject({
      id: z.string().min(1),
      title: z.string().min(1),
      outcome: z.string().min(1),
      parentTitles: z.array(z.string().min(1)),
      prerequisiteUnitIds: z.array(z.string()),
      route: routeSchema,
      problemIds: z.array(z.string().min(1)),
    }),
  ),
  releaseHistory: z.array(
    z.strictObject({
      version: z.string().min(1),
      state: z.enum(['private-preview', 'public']),
      route: routeSchema,
      subjectDigest: z.string().regex(/^[a-f0-9]{64}$/u),
      problemCount: z.number().int().nonnegative(),
      evidencePaths: z.array(z.string().min(1)).min(1),
    }),
  ),
});

export type PreviewUiCatalog = z.infer<typeof PreviewUiCatalogSchema>;
export type PreviewProblem = z.infer<typeof previewProblemSchema>;
type SourceContest = z.infer<typeof contestSchema>;
type SourceProblem = z.infer<typeof problemSourceSchema>;
type SourceGroup = z.infer<typeof groupSchema>;

export interface PreviewUiCatalogSource {
  readonly previewId: string;
  readonly subjectDigest: string;
  readonly publicationBoundary: 'private-preview' | 'public';
  readonly problemPublicationState: 'preview' | 'published';
  readonly releaseVersion: string;
  readonly selectedProblemIds: readonly string[];
  readonly contests: readonly SourceContest[];
  readonly problems: readonly SourceProblem[];
  readonly groups: readonly SourceGroup[];
}

const sourceContests = [
  contest212,
  contest215,
  contest218,
  contest222,
  contest223,
  contest232,
  contest252,
  contest256,
].map((contest) => contestSchema.parse(contest));
const sourceProblems = [
  problem212G,
  problem215E,
  problem218F,
  problem222G,
  problem223F,
  problem232E,
  problem252E,
  problem256F,
].map((problem) => problemSourceSchema.parse(problem));
const groups = [graphSearch, dynamicProgramming, dataStructures, mathematics].map((group) =>
  groupSchema.parse(group),
);

export const frozenPreviewUiCatalogSource: PreviewUiCatalogSource = {
  previewId: 'initial-v1',
  subjectDigest: previewManifest.manifestDigest,
  publicationBoundary: 'private-preview',
  problemPublicationState: 'preview',
  releaseVersion: 'initial-v1',
  selectedProblemIds: previewManifest.selectedProblemIds,
  contests: sourceContests,
  problems: sourceProblems,
  groups,
};

const stateLabel = {
  official_absent: '公式問題なし',
  preview: '収録済み',
  unpublished: '未収録',
  unknown: '確認不能',
  withdrawn: '公式取り下げ',
} as const;

export const withBase = (pathname: string, base: string): string => {
  const normalizedBase = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/gu, '')}`;
  const normalizedPath = `/${pathname.replace(/^\/+|\/+$/gu, '')}`;
  const isFile = /\/[^/]+\.[a-z0-9]+$/iu.test(normalizedPath);
  return `${normalizedBase}${normalizedPath === '/' || isFile ? normalizedPath : `${normalizedPath}/`}`;
};

export const buildPreviewUiCatalog = (
  source: PreviewUiCatalogSource = frozenPreviewUiCatalogSource,
): PreviewUiCatalog => {
  const manifestProblemIds = new Set(source.selectedProblemIds);
  if (
    source.problems.length !== manifestProblemIds.size ||
    source.problems.some(({ id }) => !manifestProblemIds.has(id))
  ) {
    throw new Error('The UI projection does not match the frozen initial-v1 problem cohort.');
  }

  const registry = buildAdvancedSlotRegistry({
    contests: source.contests.map((contest) => ({
      contestId: contest.id,
      advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: contest.taskOrderSourceRevisionId,
    })),
  });
  const groupsByProblem = new Map<string, SourceGroup[]>();
  for (const group of source.groups) {
    for (const problemId of group.problemIds) {
      groupsByProblem.set(problemId, [...(groupsByProblem.get(problemId) ?? []), group]);
    }
  }
  const problems = source.problems
    .map((problem): PreviewProblem => {
      const contest = source.contests.find(({ id }) => id === problem.contestId);
      const problemGroups = groupsByProblem.get(problem.id) ?? [];
      const [primaryGroup, ...supportingGroups] = problemGroups;
      const placement = primaryGroup?.placements.find(({ problemId }) => problemId === problem.id);
      if (!contest || !primaryGroup || !placement)
        throw new Error(`Incomplete preview mapping: ${problem.id}`);
      return {
        id: problem.id,
        contestId: problem.contestId,
        contestNumber: contest.number,
        label: problem.slotLabel,
        title: problem.title,
        officialUrl: problem.officialUrl,
        checkedAt: problem.checkedAt,
        constraintsSummary: problem.constraintsSummary,
        publicationState: source.problemPublicationState,
        route: `/problems/${problem.id}/`,
        explanationAnchor: '#explanation',
        tagIds: problemGroups.map(({ tag }) => tag.id),
        primaryTagId: primaryGroup.tag.id,
        supportingTagIds: supportingGroups.map(({ tag }) => tag.id),
        learningUnitId: primaryGroup.unit.id,
        learningOutcomeId: primaryGroup.outcome.id,
        similarProblemIds: primaryGroup.problemIds.filter((id) => id !== problem.id),
        explanationSummary: placement.classificationRationale,
        sourceRevisionIds: problem.sourceRevisionIds,
      };
    })
    .sort(
      (left, right) =>
        left.contestNumber - right.contestNumber || left.label.localeCompare(right.label),
    );

  const cells = source.contests.flatMap((contest) =>
    materializeContestSlotStates(
      registry.labels,
      {
        contestId: contest.id,
        advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
        sourceRevisionId: contest.taskOrderSourceRevisionId,
        officialTaskOrder: contest.officialTaskOrder,
        officialTaskIds: contest.officialTaskIds,
      },
      contest.slotStateOverrides,
    ).map((slot) => {
      const previewProblem = problems.find(
        (problem) => problem.contestId === contest.id && problem.label === slot.label,
      );
      const state = previewProblem
        ? 'preview'
        : slot.availability === 'exists'
          ? 'unpublished'
          : slot.availability;
      return {
        contestId: contest.id,
        label: slot.label,
        state,
        stateLabel: stateLabel[state],
        problemId: previewProblem?.id ?? null,
        officialTaskId: slot.officialTaskId,
      } as const;
    }),
  );

  return PreviewUiCatalogSchema.parse({
    schemaVersion: '1.0.0',
    previewId: source.previewId,
    subjectDigest: source.subjectDigest,
    publicationBoundary: source.publicationBoundary,
    registry: { labels: registry.labels, digest: registry.digest },
    contests: source.contests.map((contest) => ({
      id: contest.id,
      number: contest.number,
      title: contest.title,
      officialUrl: contest.officialUrl,
      route: '/contests/',
    })),
    cells,
    problems,
    tags: source.groups.map((group) => ({
      id: group.tag.id,
      name: group.tag.name,
      definition: group.tag.definition,
      aliases: [group.domain],
      route: `/tags/${group.tag.id}/`,
      problemIds: group.problemIds,
    })),
    learningUnits: source.groups.map((group) => ({
      id: group.unit.id,
      title: group.unit.title,
      outcome: group.outcome.statement,
      parentTitles: ['ABC上級問題体系化教科書', domainTitle(group.domain)],
      prerequisiteUnitIds: group.unit.prerequisiteUnitIds,
      route: `/learn/${group.unit.id}/`,
      problemIds: group.unit.problemIds,
    })),
    releaseHistory: [
      {
        version: source.releaseVersion,
        state: source.publicationBoundary,
        route: `/updates/${source.releaseVersion}/`,
        subjectDigest: source.subjectDigest,
        problemCount: problems.length,
        evidencePaths: [
          'docs/verification/previews/initial-v1/cohort-selection.json',
          'docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json',
        ],
      },
    ],
  });
};

export const canonicalPreviewRoutes = (catalog: PreviewUiCatalog): string[] => [
  '/',
  '/learn/',
  ...catalog.learningUnits.map(({ route }) => route),
  '/tags/',
  ...catalog.tags.map(({ route }) => route),
  '/problems/',
  ...catalog.problems.map(({ route }) => route),
  '/contests/',
  '/updates/',
  ...catalog.releaseHistory.map(({ route }) => route),
  '/data/catalog.json',
  '/sitemap.xml',
  '/feed.xml',
];

export const previewCatalog = buildPreviewUiCatalog();

/** Contract fixture proving future labels and unavailable states use the production projection. */
export const futureCompatibilityCatalog = buildPreviewUiCatalog({
  previewId: 'future-slot-fixture',
  subjectDigest: frozenPreviewUiCatalogSource.subjectDigest,
  publicationBoundary: 'private-preview',
  problemPublicationState: 'preview',
  releaseVersion: 'future-slot-fixture',
  selectedProblemIds: [],
  problems: [],
  groups: [],
  contests: [
    contestSchema.parse({
      id: 'abc999',
      number: 999,
      title: 'Future slot compatibility fixture',
      startedAt: '2026-07-27T20:00:00+09:00',
      endedAt: '2026-07-27T21:40:00+09:00',
      officialUrl: 'https://atcoder.jp/contests/abc999',
      officialTaskOrder: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I'],
      officialTaskIds: [
        'abc999_a',
        'abc999_b',
        'abc999_c',
        'abc999_d',
        'abc999_e',
        'abc999_f',
        'abc999_g',
        'abc999_i',
      ],
      taskOrderSourceRevisionId: 'source-fixture-abc999-task-list',
      checkedAt: '2026-07-27T22:00:00+09:00',
      slotStateOverrides: { G: 'unknown' },
    }),
  ],
});

export const findPreviewProblem = (
  problemId: string,
  catalog: PreviewUiCatalog = previewCatalog,
): PreviewProblem | undefined => catalog.problems.find(({ id }) => id === problemId);

export const getProblemGroup = (problemId: string, catalog: PreviewUiCatalog = previewCatalog) => {
  const problem = findPreviewProblem(problemId, catalog);
  if (!problem) return undefined;
  return {
    tag: catalog.tags.find(({ id }) => id === problem.primaryTagId),
    unit: catalog.learningUnits.find(({ id }) => id === problem.learningUnitId),
  };
};

function domainTitle(domain: string): string {
  return (
    {
      'data-structures-algorithm-design': 'データ構造・アルゴリズム設計',
      'dynamic-programming': '動的計画法',
      'graph-search': 'グラフ・探索',
      'mathematics-combinatorics': '数学・組合せ',
    }[domain] ?? domain
  );
}
