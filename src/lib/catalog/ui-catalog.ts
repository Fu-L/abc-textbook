import { z } from 'zod';
import {
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from './advanced-slot-registry.js';
const routeSchema = z.string().regex(/^\/(?:[a-z0-9-]+\/)*(?:[a-z0-9-]+\/)?$/u);
const uiProblemSchema = z.strictObject({
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
  primaryTagIds: z.array(z.string()).default([]),
  supportingTagIds: z.array(z.string().min(1)),
  learningUnitId: z.string().min(1),
  learningOutcomeId: z.string().min(1),
  similarProblemIds: z.array(z.string().min(1)),
  relatedProblemIds: z.array(z.string()).default([]),
  explanationSummary: z.string().min(1),
  sourceRevisionIds: z.array(z.string().min(1)).min(1),
  additionalPrimaryOutcomeIds: z.array(z.string()).default([]),
  supportingOutcomeIds: z.array(z.string()).default([]),
});

export const UiCatalogSchema = z.strictObject({
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
      state: z.enum([
        'preview',
        'published',
        'unpublished',
        'official_absent',
        'unknown',
        'withdrawn',
      ]),
      stateLabel: z.string().min(1),
      problemId: z.string().nullable(),
      officialTaskId: z.string().nullable(),
    }),
  ),
  problems: z.array(uiProblemSchema),
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
      parentId: z.string().nullable().default(null),
      childUnitIds: z.array(z.string()).default([]),
      relatedProblemIds: z.array(z.string()).default([]),
      coverageProblemIds: z.array(z.string()).default([]),
      ownedTagIds: z.array(z.string()).default([]),
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

export type UiCatalog = z.infer<typeof UiCatalogSchema>;
export type UiProblem = z.infer<typeof uiProblemSchema>;
const stateLabel = {
  official_absent: '公式問題なし',
  preview: '収録済み',
  published: '収録済み',
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

export const canonicalUiRoutes = (catalog: UiCatalog): string[] => [
  '/',
  '/learn/',
  ...catalog.learningUnits.map(({ route }) => route),
  '/tags/',
  ...catalog.tags.map(({ route }) => route),
  '/problems/',
  ...catalog.problems.map(({ route }) => route),
  '/contests/',
  ...catalog.contests.map(({ route }) => route).filter((route) => route !== '/contests/'),
  '/updates/',
  ...catalog.releaseHistory.map(({ route }) => route),
  '/data/catalog.json',
  '/sitemap.xml',
  '/feed.xml',
];

export interface UiCatalogSource {
  readonly scopeId: string;
  readonly subjectDigest: string;
  readonly publicationBoundary: UiCatalog['publicationBoundary'];
  readonly selectedProblemIds: readonly string[];
  readonly contests: readonly {
    readonly id: string;
    readonly number: number;
    readonly title: string;
    readonly officialUrl: string;
    readonly route: string;
    readonly officialTaskOrder: readonly string[];
    readonly officialTaskIds: readonly string[];
    readonly taskOrderSourceRevisionId: string;
    readonly slotStateOverrides?: Readonly<Record<string, 'unknown' | 'withdrawn'>> | undefined;
  }[];
  readonly problems: readonly {
    readonly id: string;
    readonly contestId: string;
    readonly slotLabel: string;
    readonly title: string;
    readonly officialUrl: string;
    readonly checkedAt: string;
    readonly constraintsSummary: string;
    readonly publicationState: UiProblem['publicationState'];
    readonly sourceRevisionIds: readonly string[];
  }[];
  readonly placements: readonly {
    readonly problemId: string;
    readonly homeUnitId: string;
    readonly primaryTagId: string;
    readonly supportingTagIds: readonly string[];
    readonly primaryTagIds?: readonly string[] | undefined;
    readonly primaryOutcomeId: string;
    readonly additionalPrimaryOutcomeIds: readonly string[];
    readonly supportingOutcomeIds: readonly string[];
    readonly explanationSummary: string;
    readonly similarProblemIds?: readonly string[] | undefined;
    readonly relatedProblemIds?: readonly string[] | undefined;
  }[];
  readonly tags: readonly UiCatalog['tags'][number][];
  readonly learningUnits: readonly UiCatalog['learningUnits'][number][];
  readonly releaseHistory: readonly UiCatalog['releaseHistory'][number][];
}

/** Both the frozen preview adapter and canonical content enter this single projection. */
export const buildUiCatalog = (source: UiCatalogSource): UiCatalog => {
  const ids = new Set(source.selectedProblemIds);
  if (
    ids.size !== source.selectedProblemIds.length ||
    source.problems.length !== ids.size ||
    source.problems.some((problem) => !ids.has(problem.id))
  )
    throw new Error('UI_PROBLEM_SCOPE_MISMATCH');
  const contests = new Map(source.contests.map((contest) => [contest.id, contest]));
  const placements = new Map(
    source.placements.map((placement) => [placement.problemId, placement]),
  );
  const registry = buildAdvancedSlotRegistry({
    contests: source.contests.map((contest) => ({
      contestId: contest.id,
      advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: contest.taskOrderSourceRevisionId,
    })),
  });
  const problems = source.problems
    .map((problem): UiProblem => {
      const contest = contests.get(problem.contestId);
      const placement = placements.get(problem.id);
      const unit = source.learningUnits.find((item) => item.id === placement?.homeUnitId);
      if (!contest || !placement || !unit) throw new Error(`UI_MAPPING_MISSING:${problem.id}`);
      return {
        id: problem.id,
        contestId: problem.contestId,
        contestNumber: contest.number,
        label: problem.slotLabel,
        title: problem.title,
        officialUrl: problem.officialUrl,
        checkedAt: problem.checkedAt,
        constraintsSummary: problem.constraintsSummary,
        publicationState: problem.publicationState,
        route: `/problems/${problem.id}/`,
        explanationAnchor: '#explanation',
        primaryTagId: placement.primaryTagId,
        primaryTagIds: [...(placement.primaryTagIds ?? [placement.primaryTagId])],
        supportingTagIds: [...placement.supportingTagIds],
        tagIds: [
          ...(placement.primaryTagIds ?? [placement.primaryTagId]),
          ...placement.supportingTagIds,
        ],
        learningUnitId: unit.id,
        learningOutcomeId: placement.primaryOutcomeId,
        additionalPrimaryOutcomeIds: [...placement.additionalPrimaryOutcomeIds],
        supportingOutcomeIds: [...placement.supportingOutcomeIds],
        similarProblemIds: [...(placement.similarProblemIds ?? [])],
        relatedProblemIds: [...(placement.relatedProblemIds ?? [])],
        explanationSummary: placement.explanationSummary,
        sourceRevisionIds: [...problem.sourceRevisionIds],
      };
    })
    .sort(
      (a, b) =>
        a.contestNumber - b.contestNumber ||
        (contests.get(a.contestId)?.officialTaskOrder.indexOf(a.label) ?? 0) -
          (contests.get(b.contestId)?.officialTaskOrder.indexOf(b.label) ?? 0),
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
      const problem = problems.find(
        (item) => item.contestId === contest.id && item.label === slot.label,
      );
      const state =
        slot.availability === 'unknown' || slot.availability === 'withdrawn'
          ? slot.availability
          : problem
            ? problem.publicationState
            : slot.availability === 'exists'
              ? 'unpublished'
              : slot.availability;
      return {
        contestId: contest.id,
        label: slot.label,
        state,
        stateLabel: stateLabel[state],
        problemId: state === 'published' || state === 'preview' ? (problem?.id ?? null) : null,
        officialTaskId: slot.officialTaskId,
      };
    }),
  );
  return UiCatalogSchema.parse({
    schemaVersion: '1.0.0',
    previewId: source.scopeId,
    subjectDigest: source.subjectDigest,
    publicationBoundary: source.publicationBoundary,
    registry: { labels: registry.labels, digest: registry.digest },
    contests: source.contests.map(({ id, number, title, officialUrl, route }) => ({
      id,
      number,
      title,
      officialUrl,
      route,
    })),
    cells,
    problems,
    tags: source.tags,
    learningUnits: source.learningUnits,
    releaseHistory: source.releaseHistory,
  });
};

export const requireCatalogEntity = <T>(value: T | undefined, id: string): T => {
  if (value === undefined) throw new Error(`UI_ENTITY_MISSING:${id}`);
  return value;
};
