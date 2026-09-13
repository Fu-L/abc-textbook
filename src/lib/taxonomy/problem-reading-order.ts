import { deterministicTopologicalOrder } from '../validation/validate.js';

export const PROBLEM_READING_ORDER_REASON =
  'Unitごとに採用解法を比較した導入・発展順を優先する。未指定の問題はその後に置き、機構rank、前提の深さ、必要技能数、主技能の複合数、補助技能数、代表問題順位、Problem IDを補助規則にする。技能集合の包含は問題間の前提にせず、contest番号や出題枠は難易度の代用にしない。';

/** Editorial sequences compare state meaning and the extra argument needed at each step.
 * These are local to a Unit, not global difficulty scores or prerequisite edges.
 */
export const UNIT_PROBLEM_READING_ORDER: Readonly<Record<string, readonly string[]>> = {
  // 総量判定 → 区間を保つ可否判定 → 問い合わせ・幾何 → 敵対配分・区分積分。
  'unit-monotone-search': ['abc270-e', 'abc395-f', 'abc381-e', 'abc292-f', 'abc373-e', 'abc303-f'],
  // 通常の矩形 → 周期prefix → 区間寄与 → 区分一次式 → 斜方向の差分。
  'unit-prefix-aggregate': ['abc278-e', 'abc300-f', 'abc430-f', 'abc268-e', 'abc260-g'],
  // 単一集合 → 二集合の固定境界 → 隣接関係 → 窓と可変個数の境界。
  'unit-ordered-set-multiset': [
    'abc330-e',
    'abc306-e',
    'abc281-e',
    'abc308-g',
    'abc444-e',
    'abc314-g',
  ],
  'unit-z-algorithm': ['abc430-e', 'abc284-f', 'abc257-g', 'abc434-f'],
  // 二分割・対応付け → 消去 → 多次元の分割 → 構文解析と履歴集計。
  'unit-dp-interval-composition': [
    'abc252-g',
    'abc217-f',
    'abc325-g',
    'abc233-g',
    'abc292-g',
    'abc262-g',
    'abc400-f',
    'abc298-g',
    'abc261-g',
    'abc238-ex',
  ],
  // 局所集約 → 境界状態 → 個数配列・複合条件 → 差分による増分更新。
  'unit-rooted-tree-aggregation': [
    'abc239-e',
    'abc309-e',
    'abc409-e',
    'abc391-e',
    'abc263-f',
    'abc394-f',
    'abc312-g',
    'abc378-f',
    'abc447-f',
    'abc397-e',
    'abc259-f',
    'abc459-e',
    'abc287-f',
    'abc416-f',
    'abc248-g',
    'abc246-g',
    'abc293-ex',
    'abc264-ex',
  ],
  // 固定幅の接続 → 色 → 帯状の使用済みフラグ → 任意partitionの正規化。
  'unit-frontier-profile-dp': ['abc248-f', 'abc379-g', 'abc309-g', 'abc296-ex'],
  'unit-mo-offline-range': ['abc242-g', 'abc293-g', 'abc463-g', 'abc384-g', 'abc405-g'],
  'unit-max-flow-min-cut': [
    'abc241-g',
    'abc225-g',
    'abc239-g',
    'abc259-g',
    'abc318-g',
    'abc326-g',
    'abc347-g',
    'abc397-g',
    'abc332-g',
    'abc227-h',
  ],
  'unit-bipartite-matching': [
    'abc401-g',
    'abc274-g',
    'abc461-g',
    'abc317-g',
    'abc437-g',
    'abc445-g',
    'abc424-g',
    'abc313-ex',
    'abc318-f',
    'abc374-g',
  ],
  'unit-euclidean-floor-sum': ['abc443-g', 'abc283-ex', 'abc313-g', 'abc372-g', 'abc402-g'],
};

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
  unitId?: string,
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
    const reviewedOrder = UNIT_PROBLEM_READING_ORDER[unitId ?? ''] ?? [];
    const reviewedRank = reviewedOrder.indexOf(entry.problem.problemId);
    const representativeRank = representativeProblemIds.indexOf(entry.problem.problemId);
    return [
      reviewedRank < 0 ? reviewedOrder.length : reviewedRank,
      PROBLEM_MECHANISM_RANK[entry.problem.problemId] ?? 1,
      entry.depth,
      entry.required.size,
      1 + entry.problem.additionalPrimaryOutcomeIds.length,
      entry.problem.supportingOutcomeIds.length,
      representativeRank < 0 ? representativeProblemIds.length : representativeRank,
    ];
  }).map(({ id }) => id);
};
