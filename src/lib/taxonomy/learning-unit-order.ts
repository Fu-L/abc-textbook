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
