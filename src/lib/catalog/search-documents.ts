import type { UiCatalog } from './ui-catalog.js';

export interface SearchDocument {
  readonly entityId: string;
  readonly entityKind: 'problem' | 'technique-tag' | 'learning-unit' | 'contest' | 'release';
  readonly route: string;
  readonly title: string;
  readonly terms: readonly string[];
}

export const buildSearchDocuments = (catalog: UiCatalog): readonly SearchDocument[] => [
  ...catalog.problems.map((problem) => ({
    entityId: problem.id,
    entityKind: 'problem' as const,
    route: problem.route,
    title: `${problem.id.toUpperCase()} — ${problem.title}`,
    terms: [problem.title, problem.id, `ABC ${String(problem.contestNumber)}`, problem.label],
  })),
  ...catalog.tags.map((tag) => ({
    entityId: tag.id,
    entityKind: 'technique-tag' as const,
    route: tag.route,
    title: tag.name,
    terms: [tag.name, ...tag.aliases],
  })),
  ...catalog.learningUnits.map((unit) => ({
    entityId: unit.id,
    entityKind: 'learning-unit' as const,
    route: unit.route,
    title: unit.title,
    terms: [unit.title, ...unit.parentTitles],
  })),
  ...catalog.contests.map((contest) => ({
    entityId: contest.id,
    entityKind: 'contest' as const,
    route: contest.route,
    title: `ABC ${String(contest.number)}`,
    terms: [contest.id, `ABC ${String(contest.number)}`, contest.title],
  })),
  ...catalog.releaseHistory.map((release) => ({
    entityId: release.version,
    entityKind: 'release' as const,
    route: release.route,
    title: release.version,
    terms: [release.version, release.state],
  })),
];
