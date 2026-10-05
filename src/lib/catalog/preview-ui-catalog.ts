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
    problemIds: z.array(z.string().min(1)).min(1),
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

export {
  withBase,
  canonicalUiRoutes as canonicalPreviewRoutes,
  UiCatalogSchema as PreviewUiCatalogSchema,
} from './ui-catalog.js';
import { buildUiCatalog, type UiCatalog, type UiProblem } from './ui-catalog.js';
export type PreviewUiCatalog = UiCatalog;
export type PreviewProblem = UiProblem;
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

export const buildPreviewUiCatalog = (
  source: PreviewUiCatalogSource = frozenPreviewUiCatalogSource,
): PreviewUiCatalog => {
  const tagFor = (id: string) => source.groups.filter((group) => group.problemIds.includes(id));
  return buildUiCatalog({
    scopeId: source.previewId,
    subjectDigest: source.subjectDigest,
    publicationBoundary: source.publicationBoundary,
    selectedProblemIds: source.selectedProblemIds,
    contests: source.contests.map((contest) => ({ ...contest, route: '/contests/' })),
    problems: source.problems.map((problem) => ({
      ...problem,
      publicationState: source.problemPublicationState,
    })),
    placements: source.problems.map((problem) => {
      const [primary, ...supporting] = tagFor(problem.id);
      const placement = primary?.placements.find((item) => item.problemId === problem.id);
      if (!primary || !placement) throw new Error(`Incomplete preview mapping: ${problem.id}`);
      return {
        problemId: problem.id,
        homeUnitId: primary.unit.id,
        primaryTagId: primary.tag.id,
        supportingTagIds: supporting.map((group) => group.tag.id),
        primaryOutcomeId: primary.outcome.id,
        additionalPrimaryOutcomeIds: [],
        supportingOutcomeIds: supporting.map((group) => group.outcome.id),
        explanationSummary: placement.classificationRationale,
        similarProblemIds: primary.problemIds.filter((id) => id !== problem.id),
      };
    }),
    tags: source.groups.map((group) => ({
      id: group.tag.id,
      name: group.tag.name,
      definition: group.tag.definition,
      aliases: [group.domain],
      route: `/tags/${group.tag.id}/`,
      problemIds: group.problemIds,
      representativeProblemIds: group.tag.representativeProblemIds,
    })),
    learningUnits: source.groups.map((group) => ({
      id: group.unit.id,
      title: group.unit.title,
      outcome: group.outcome.statement,
      parentTitles: ['ABC上級問題体系化教科書', domainTitle(group.domain)],
      prerequisiteUnitIds: group.unit.prerequisiteUnitIds,
      route: `/learn/${group.unit.id}/`,
      problemIds: group.unit.problemIds,
      parentId: null,
      childUnitIds: [],
      relatedProblemIds: [],
      coverageProblemIds: group.unit.problemIds,
      ownedTagIds: [group.tag.id],
    })),
    releaseHistory: [
      {
        version: source.releaseVersion,
        state: source.publicationBoundary,
        route: `/updates/${source.releaseVersion}/`,
        subjectDigest: source.subjectDigest,
        problemCount: source.problems.length,
        evidencePaths: [
          'docs/verification/previews/initial-v1/cohort-selection.json',
          'docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json',
        ],
      },
    ],
  });
};

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

export const futureProblemCompatibilityCatalog = buildPreviewUiCatalog({
  previewId: 'future-problem-fixture',
  subjectDigest: frozenPreviewUiCatalogSource.subjectDigest,
  publicationBoundary: 'private-preview',
  problemPublicationState: 'preview',
  releaseVersion: 'future-problem-fixture',
  selectedProblemIds: ['abc999-i'],
  contests: futureCompatibilityCatalog.contests.map((contest) =>
    contestSchema.parse({
      ...contest,
      startedAt: '2026-07-27T20:00:00+09:00',
      endedAt: '2026-07-27T21:40:00+09:00',
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
    }),
  ),
  problems: [
    problemSourceSchema.parse({
      id: 'abc999-i',
      contestId: 'abc999',
      slotLabel: 'I',
      officialTaskId: 'abc999_i',
      title: 'Future I Projection Fixture',
      officialUrl: 'https://atcoder.jp/contests/abc999/tasks/abc999_i',
      constraintsSummary: 'Fixture constraints for future I projection.',
      difficultyEvidence: null,
      sourceRevisionIds: ['source-fixture-abc999-i-problem'],
      checkedAt: '2026-07-27T22:00:00+09:00',
    }),
  ],
  groups: [
    groupSchema.parse({
      domain: 'future-slot',
      problemIds: ['abc999-i'],
      tag: {
        id: 'provisional-tag-future-slot',
        name: '将来問題記号',
        definition: '将来追加される問題記号を通常の投影で扱うための契約fixture。',
        prerequisiteTagIds: [],
        outcomeIds: ['outcome-provisional-future-slot'],
        representativeProblemIds: ['abc999-i'],
      },
      outcome: {
        id: 'outcome-provisional-future-slot',
        statement: '将来問題記号を既存のrouteと検索projectionで扱える。',
        prerequisiteOutcomeIds: [],
      },
      unit: {
        id: 'provisional-unit-future-slot',
        title: '将来問題記号の互換性',
        prerequisiteUnitIds: [],
        problemIds: ['abc999-i'],
        sourceRevisionIds: ['source-fixture-abc999-i-problem'],
        tagIds: ['provisional-tag-future-slot'],
        outcomeIds: ['outcome-provisional-future-slot'],
      },
      placements: [
        {
          problemId: 'abc999-i',
          classificationRationale: 'I問題も同じ投影境界を通ることを確認するfixture。',
        },
      ],
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
