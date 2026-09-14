import { deterministicTopologicalOrder } from '../validation/validate.js';

export const PROBLEM_READING_ORDER_REASON =
  '基本から応用へ進むため、ABCの問題アルファベット順（E→F→G→H/Ex）を基準とする。現corpusではDifficulty・配点が揃っていないため推測値は作らない。同じ出題枠ではProblem ID順とし、contest番号自体に難易度の意味は持たせない。教育的に不自然な箇所だけUnit内の例外で補正し、技能数や本文中の例示順は難易度の代用にしない。';

/** Reorder only listed problems in their existing positions. Unlisted problems
 * keep their positions; this is not a complete hand-written syllabus.
 */
export const UNIT_PROBLEM_READING_ORDER: Readonly<Record<string, readonly string[]>> = {
  // 同じG枠でも、商と余りによる標準の格子点集計を重み付き・複合の一般化より先に学ぶ。
  'unit-euclidean-floor-sum': ['abc443-g', 'abc313-g', 'abc372-g', 'abc402-g'],
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

export const orderProblemsByPrerequisites = (
  problems: readonly ReadingProblem[],
  skills: readonly Skill[],
  unitId?: string,
): string[] => {
  const knownSkills = new Set(deterministicTopologicalOrder(skills).map(({ id }) => id));
  for (const problem of problems) {
    for (const id of [
      ...problem.primaryTagIds,
      ...problem.supportingTagIds,
      problem.primaryOutcomeId,
      ...problem.additionalPrimaryOutcomeIds,
      ...problem.supportingOutcomeIds,
    ]) {
      if (!knownSkills.has(id)) throw new Error(`PROBLEM_ORDER_UNKNOWN_SKILL:${id}`);
    }
  }
  const ordered = deterministicTopologicalOrder(
    problems.map(({ problemId }) => ({ id: problemId, prerequisiteIds: [] })),
    ({ id }) => {
      const slot = id.split('-')[1]?.toLowerCase() ?? '';
      return [slot === 'ex' ? 7 : slot.charCodeAt(0) - 'a'.charCodeAt(0)];
    },
  ).map(({ id }) => id);
  const exceptions = (UNIT_PROBLEM_READING_ORDER[unitId ?? ''] ?? []).filter((id) =>
    ordered.includes(id),
  );
  const exceptionSet = new Set(exceptions);
  let next = 0;
  return ordered.map((id) => (exceptionSet.has(id) ? (exceptions[next++] ?? id) : id));
};
