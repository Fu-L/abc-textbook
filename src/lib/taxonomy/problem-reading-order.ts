import { deterministicTopologicalOrder } from '../validation/validate.js';

export const PROBLEM_READING_ORDER_REASON =
  '技能集合の包含は問題間の前提にしない。問題は、解法の基本性、前提の深さ、必要技能数、主技能の複合数、補助技能数の順で基礎形を優先する。同順位では代表問題順位、最後にProblem IDで決定する。難易度の独立した数値評価が未収集のため、contest番号や出題枠は難易度の代用にしない。';

/** Reviewed mechanism complexity, independent of difficulty or an example/assessment role.
 * Unlisted Problems use the ordinary level; these overrides distinguish direct formulations
 * from continuous distributions, mixed transforms, or additional counting decompositions.
 */
export const PROBLEM_MECHANISM_RANK: Readonly<Record<string, number>> = {
  'abc367-e': -2,
  'abc216-f': -2,
  'abc314-f': -2,
  'abc294-g': -2,
  'abc354-e': -2,
  'abc275-e': -1,
  'abc298-e': -1,
  'abc273-f': -1,
  'abc236-e': -1,
  'abc327-e': -1,
  'abc321-f': 2,
  'abc235-ex': 2,
  'abc298-ex': 2,
  'abc255-g': 2,
  'abc219-h': 2,
  'abc300-e': 0,
  'abc263-e': 0,
  'abc266-e': 0,
  'abc291-g': 0,
  'abc340-f': 0,
  'abc234-f': 0,
  'abc358-e': 0,
  'abc348-g': 1,
  'abc226-h': 2,
  'abc265-ex': 2,
  'abc307-ex': 2,
};

interface Skill {
  readonly id: string;
  readonly prerequisiteIds: readonly string[];
}
interface ReadingProblem {
  readonly problemId: string;
  readonly primaryTagIds: readonly string[];
  readonly supportingTagIds: readonly string[];
  readonly primaryOutcomeId: string;
  readonly additionalPrimaryOutcomeIds: readonly string[];
  readonly supportingOutcomeIds: readonly string[];
}

/** Editorial mechanism ranks precede complexity hints; skill inclusion is not precedence. */
export const orderProblemsByPrerequisites = (
  problems: readonly ReadingProblem[],
  skills: readonly Skill[],
  representativeProblemIds: readonly string[] = [],
): string[] => {
  const closure = new Map<string, Set<string>>();
  const depth = new Map<string, number>();
  for (const skill of deterministicTopologicalOrder(skills)) {
    closure.set(
      skill.id,
      new Set([skill.id, ...skill.prerequisiteIds.flatMap((id) => [...(closure.get(id) ?? [])])]),
    );
    depth.set(
      skill.id,
      Math.max(0, ...skill.prerequisiteIds.map((id) => (depth.get(id) ?? 0) + 1)),
    );
  }
  const entries = problems.map((problem) => {
    const ids = [
      ...problem.primaryTagIds,
      ...problem.supportingTagIds,
      problem.primaryOutcomeId,
      ...problem.additionalPrimaryOutcomeIds,
      ...problem.supportingOutcomeIds,
    ];
    for (const id of ids)
      if (!closure.has(id)) throw new Error(`PROBLEM_ORDER_UNKNOWN_SKILL:${id}`);
    return {
      problem,
      required: new Set(ids.flatMap((id) => [...(closure.get(id) ?? [])])),
      depth: Math.max(0, ...ids.map((id) => depth.get(id) ?? 0)),
    };
  });
  const nodes = entries.map((entry) => ({
    id: entry.problem.problemId,
    prerequisiteIds: [],
    entry,
  }));
  return deterministicTopologicalOrder(nodes, ({ entry }) => {
    const representativeRank = representativeProblemIds.indexOf(entry.problem.problemId);
    return [
      PROBLEM_MECHANISM_RANK[entry.problem.problemId] ?? 1,
      entry.depth,
      entry.required.size,
      1 + entry.problem.additionalPrimaryOutcomeIds.length,
      entry.problem.supportingOutcomeIds.length,
      representativeRank < 0 ? representativeProblemIds.length : representativeRank,
    ];
  }).map(({ id }) => id);
};
