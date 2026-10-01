/** Unit type does not imply its prerequisites or sidebar position. */
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
