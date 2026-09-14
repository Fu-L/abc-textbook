import { deterministicTopologicalOrder } from '../validation/validate.js';

/** Reading preferences, not additional knowledge prerequisites. */
export const CONCEPT_READING_CHAINS: readonly (readonly string[])[] = [
  ['unit-dp-sequence', 'unit-dp-lis', 'unit-dp-prefix-partition'],
  [
    'unit-weighted-shortest-path',
    'unit-shortest-path-reconstruction',
    'unit-difference-constraints',
  ],
  ['unit-dsu-components', 'unit-scc-condensation', 'unit-lowlink-critical-structure'],
  ['unit-gcd-structure', 'unit-gcd-diophantine', 'unit-modular-congruence'],
  ['unit-rational-approximation', 'unit-stern-brocot-ancestry'],
];

interface OrderedUnit {
  readonly id: string;
  readonly prerequisiteIds: readonly string[];
  readonly stageRank: number;
  readonly difficultyRank: number;
  readonly representativeRank: number;
}

/** Continue a concept at its anchor's priority, subject to all actual prerequisites. */
export const orderCurriculumUnits = <T extends OrderedUnit>(units: readonly T[]): T[] => {
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const idRank = new Map([...byId.keys()].sort().map((id, index) => [id, index]));
  return deterministicTopologicalOrder(units, (unit) => {
    const chain = CONCEPT_READING_CHAINS.find((ids) => ids.includes(unit.id));
    const anchor = byId.get(chain?.[0] ?? '') ?? unit;
    return [
      anchor.stageRank,
      anchor.difficultyRank,
      anchor.representativeRank,
      idRank.get(anchor.id) ?? 0,
      chain?.indexOf(unit.id) ?? 0,
    ];
  });
};

/** Navigation containers introduce a topic; only teaching Units occupy curriculum positions. */
export interface CurriculumUnit {
  readonly id: string;
  readonly kind?: string | undefined;
  readonly parentId: string | null;
  readonly ownedTagIds?: readonly string[] | undefined;
  readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
  readonly directProblemIds?: readonly string[] | undefined;
}

export const isCurriculumUnit = (unit: CurriculumUnit): boolean =>
  unit.kind !== 'chapter' &&
  (unit.ownedTagIds === undefined ||
    unit.ownedTagIds.length > 0 ||
    (unit.ownedLearningOutcomeIds?.length ?? 0) > 0 ||
    (unit.directProblemIds?.length ?? 0) > 0);

/** A container's navigation position is the earliest teaching descendant's position. */
export const unitNavigationIndices = (
  units: readonly CurriculumUnit[],
  standardOrder: readonly string[],
): Map<string, number> => {
  const indices = new Map(standardOrder.map((id, index) => [id, index]));
  const visit = (id: string, path = new Set<string>()): number => {
    const known = indices.get(id);
    if (known !== undefined) return known;
    if (path.has(id)) throw new Error(`UNIT_NAVIGATION_CYCLE:${id}`);
    const next = new Set([...path, id]);
    const position = Math.min(
      standardOrder.length,
      ...units.filter((unit) => unit.parentId === id).map((unit) => visit(unit.id, next)),
    );
    indices.set(id, position);
    return position;
  };
  for (const unit of units) visit(unit.id);
  return indices;
};
