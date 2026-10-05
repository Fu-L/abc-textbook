import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import type { FinalProblemPlacementProjection } from '../taxonomy/final-taxonomy-build.js';

export const PROBLEM_SHARD_ROOT = 'docs/work-manifests/initial/problem-authoring-units';
export const PROBLEM_SHARD_INDEX_PATH = `${PROBLEM_SHARD_ROOT}/index.json`;
export const PROBLEM_SHARD_DOMAINS = [
  'graph-search',
  'dynamic-programming',
  'data-structures',
  'mathematics',
  'string-geometry',
  'hybrid',
] as const;
export type ProblemShardDomain = (typeof PROBLEM_SHARD_DOMAINS)[number];
export const SHARD_CHECKS = [
  'source',
  'structure',
  'example',
  'answer',
  'link',
  'accessibility',
  'review',
] as const;
const CHAPTER_DISPATCH: Readonly<Record<string, ProblemShardDomain>> = {
  'unit-chapter-graph': 'graph-search',
  'unit-chapter-tree': 'graph-search',
  'unit-chapter-dynamic-programming': 'dynamic-programming',
  'unit-chapter-query': 'data-structures',
  'unit-chapter-number-theory': 'mathematics',
  'unit-chapter-combinatorics-algebra': 'mathematics',
  'unit-chapter-string': 'string-geometry',
  'unit-chapter-geometry-optimization': 'string-geometry',
  'unit-chapter-modeling': 'hybrid',
};
export interface ProblemShard {
  readonly shardId: string;
  readonly primaryOutcomeId: string;
  readonly domain: ProblemShardDomain;
  readonly taskId: string;
  readonly problemIds: readonly string[];
  readonly homeUnitId: string;
  readonly dependencyShardIds: readonly string[];
  readonly prerequisiteOutcomeIds: readonly string[];
  readonly documentPaths: readonly string[];
  readonly workPath: string;
  readonly previewPath: string;
  readonly requiredChecks: readonly string[];
  readonly reviewPolicy: { readonly requiredMode: 'self'; readonly riskReasons: readonly string[] };
}
export interface ProblemShardIndex {
  readonly schemaVersion: '1.0.0';
  readonly algorithm: 'semantic-primary-official-order-chunks-8-v1';
  readonly frozenAt: string;
  readonly inputs: Readonly<Record<string, string>>;
  readonly problemCount: number;
  readonly shards: readonly ProblemShard[];
  readonly indexDigest: string;
}
export interface ProblemShardIndexInput {
  readonly contests: readonly {
    readonly id: string;
    readonly number: number;
    readonly officialTaskIds: readonly string[];
  }[];
  readonly problems: readonly {
    readonly id: string;
    readonly contestId: string;
    readonly officialTaskId: string;
  }[];
  readonly placements: readonly Pick<
    FinalProblemPlacementProjection,
    'problemId' | 'primaryOutcomeId' | 'additionalPrimaryOutcomeIds' | 'supportingOutcomeIds'
  >[];
  readonly units: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
  }[];
  readonly outcomes: readonly {
    readonly id: string;
    readonly prerequisiteOutcomeIds: readonly string[];
  }[];
  readonly frozenAt: string;
  readonly inputs: Readonly<Record<string, string>>;
}
const fail: (code: string, id: string) => never = (code, id) => {
  throw new Error(`${code}:${id}`);
};
export const buildProblemShardIndex = (input: ProblemShardIndexInput): ProblemShardIndex => {
  const contests = new Map(input.contests.map((c) => [c.id, c]));
  const units = new Map(input.units.map((u) => [u.id, u]));
  const outcomes = new Map(input.outcomes.map((o) => [o.id, o]));
  const owners = new Map<string, string>();
  for (const unit of input.units)
    for (const outcome of unit.ownedLearningOutcomeIds ?? []) {
      if (owners.has(outcome)) fail('SHARD_OUTCOME_MULTIPLE_OWNERS', outcome);
      owners.set(outcome, unit.id);
    }
  const chapter = (unitId: string): ProblemShardDomain => {
    const seen = new Set<string>();
    let current: string | null = unitId;
    while (current !== null) {
      if (seen.has(current)) fail('SHARD_UNIT_CYCLE', current);
      seen.add(current);
      const domain = CHAPTER_DISPATCH[current];
      if (domain) return domain;
      const unit = units.get(current);
      if (!unit) fail('SHARD_UNIT_MISSING', current);
      current = unit.parentId;
    }
    return fail('SHARD_DISPATCH_UNDEFINED', unitId);
  };
  const ranks = new Map<string, readonly [number, number]>();
  for (const problem of input.problems) {
    if (ranks.has(problem.id)) fail('SHARD_PROBLEM_DUPLICATE', problem.id);
    const contest = contests.get(problem.contestId);
    const position = contest?.officialTaskIds.indexOf(problem.officialTaskId) ?? -1;
    if (!contest || position < 0) fail('SHARD_OFFICIAL_ORDER_MISSING', problem.id);
    ranks.set(problem.id, [contest.number, position]);
  }
  const groups = new Map<string, string[]>();
  const placed = new Set<string>();
  for (const placement of input.placements) {
    if (placed.has(placement.problemId)) fail('SHARD_PLACEMENT_DUPLICATE', placement.problemId);
    if (!ranks.has(placement.problemId)) fail('SHARD_PROBLEM_UNKNOWN', placement.problemId);
    placed.add(placement.problemId);
    if (!outcomes.has(placement.primaryOutcomeId))
      fail('SHARD_OUTCOME_UNKNOWN', placement.primaryOutcomeId);
    const group = groups.get(placement.primaryOutcomeId) ?? [];
    group.push(placement.problemId);
    groups.set(placement.primaryOutcomeId, group);
  }
  if (placed.size !== ranks.size)
    fail('SHARD_PROBLEM_UNASSIGNED', [...ranks.keys()].find((id) => !placed.has(id)) ?? '');
  const shards: ProblemShard[] = [];
  for (const [outcomeId, ids] of [...groups].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    ids.sort((a, b) => {
      const x = ranks.get(a) ?? fail('SHARD_ORDER_MISSING', a);
      const y = ranks.get(b) ?? fail('SHARD_ORDER_MISSING', b);
      return x[0] - y[0] || x[1] - y[1];
    });
    const homeUnitId = owners.get(outcomeId);
    if (!homeUnitId) fail('SHARD_OUTCOME_OWNER_MISSING', outcomeId);
    const domain = chapter(homeUnitId);
    for (let start = 0; start < ids.length; start += 8) {
      const shardId = `${outcomeId}-shard-${String(start / 8 + 1).padStart(3, '0')}`;
      const local = `${domain}/${outcomeId}/${shardId}`;
      const problemIds = ids.slice(start, start + 8);
      shards.push({
        shardId,
        primaryOutcomeId: outcomeId,
        domain,
        taskId: `T${String(66 + PROBLEM_SHARD_DOMAINS.indexOf(domain)).padStart(3, '0')}`,
        problemIds,
        homeUnitId,
        prerequisiteOutcomeIds: (
          outcomes.get(outcomeId) ?? fail('SHARD_OUTCOME_UNKNOWN', outcomeId)
        ).prerequisiteOutcomeIds,
        dependencyShardIds: [],
        documentPaths: problemIds.map((id) => `src/content/docs/problems/${local}/${id}.md`),
        workPath: `${PROBLEM_SHARD_ROOT}/${local}`,
        previewPath: `staging/previews/problem-authoring-unit-shards/${local}`,
        requiredChecks: SHARD_CHECKS,
        reviewPolicy: { requiredMode: 'self', riskReasons: [] },
      });
    }
  }
  // Dependencies describe the prerequisite explanations, not a replacement reading order.
  const withDependencies = shards.map((shard) => ({
    ...shard,
    dependencyShardIds: shards
      .filter((other) => shard.prerequisiteOutcomeIds.includes(other.primaryOutcomeId))
      .map((other) => other.shardId),
  }));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const byId = new Map(withDependencies.map((s) => [s.shardId, s]));
  const visit = (id: string): void => {
    if (visiting.has(id)) fail('SHARD_DEPENDENCY_CYCLE', id);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of (byId.get(id) ?? fail('SHARD_DEPENDENCY_UNKNOWN', id)).dependencyShardIds)
      visit(dep);
    visiting.delete(id);
    visited.add(id);
  };
  withDependencies.forEach((s) => {
    visit(s.shardId);
  });
  const index = {
    schemaVersion: '1.0.0' as const,
    algorithm: 'semantic-primary-official-order-chunks-8-v1' as const,
    frozenAt: input.frozenAt,
    inputs: input.inputs,
    problemCount: ranks.size,
    shards: withDependencies,
    indexDigest: '',
  };
  return { ...index, indexDigest: digestWithoutField(index, 'indexDigest') };
};
export const assertProblemShardIndex = (
  actual: ProblemShardIndex,
  expected: ProblemShardIndex,
): void => {
  if (
    digestWithoutField(actual as unknown as Record<string, unknown>, 'indexDigest') !==
      actual.indexDigest ||
    canonicalDigest(actual) !== canonicalDigest(expected)
  )
    throw new Error(
      'SHARD_INDEX_DRIFT: Regenerate through an explicit correction; frozen membership/order/digest cannot be edited.',
    );
};
