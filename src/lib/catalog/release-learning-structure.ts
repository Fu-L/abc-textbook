import { buildProblemOutcomeCoverage } from '../authoring/verify-problem-corpus.js';
import { canonicalJson } from '../domain/canonical-json.js';
import { CanonicalLearningPrerequisitesSchema } from '../domain/schema-parts/catalog.js';
import { deterministicTopologicalOrder } from '../validation/validate.js';

interface LearningStructure {
  readonly tags: readonly { readonly id: string; readonly prerequisiteTagIds: readonly string[] }[];
  readonly outcomes: readonly {
    readonly id: string;
    readonly prerequisiteOutcomeIds: readonly string[];
  }[];
  readonly units: readonly {
    readonly id: string;
    readonly kind: string;
    readonly parentId: string | null;
    readonly contentPhase?: string | undefined;
    readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
    readonly problemIds: readonly string[];
    readonly directProblemIds?: readonly string[] | undefined;
  }[];
  readonly problems: readonly { readonly id: string }[];
  readonly placements: readonly {
    readonly problemId: string;
    readonly primaryOutcomeId: string;
    readonly additionalPrimaryOutcomeIds: readonly string[];
    readonly supportingOutcomeIds: readonly string[];
    readonly primaryTagIds: readonly string[];
    readonly supportingTagIds: readonly string[];
  }[];
  readonly prerequisites: unknown;
  readonly chapters: readonly { readonly id: string; readonly unitIds: readonly string[] }[];
}
const same = (a: readonly string[], b: readonly string[]) =>
  canonicalJson([...a].sort()) === canonicalJson([...b].sort());

/** Ordering never selects a Problem's home and is never required to be topological. */
export const validateReleaseLearningStructure = (input: LearningStructure) => {
  const prerequisites = CanonicalLearningPrerequisitesSchema.parse(input.prerequisites);
  for (const [entities, edges] of [
    [input.tags, prerequisites.tagPrerequisites],
    [input.outcomes, prerequisites.learningOutcomePrerequisites],
    [input.units, prerequisites.learningUnitPrerequisites],
  ] as const) {
    const ids = new Set(entities.map((entity) => entity.id));
    if (
      ids.size !== entities.length ||
      edges.some((edge) => !ids.has(edge.nodeId) || !ids.has(edge.prerequisiteId))
    )
      throw new Error('RELEASE_DAG_UNKNOWN');
    deterministicTopologicalOrder(
      entities.map((entity) => ({
        id: entity.id,
        prerequisiteIds: edges
          .filter((edge) => edge.nodeId === entity.id)
          .map((edge) => edge.prerequisiteId),
      })),
    );
  }
  for (const [entities, edges, field] of [
    [input.tags, prerequisites.tagPrerequisites, 'prerequisiteTagIds'],
    [input.outcomes, prerequisites.learningOutcomePrerequisites, 'prerequisiteOutcomeIds'],
  ] as const) {
    for (const entity of entities) {
      const declared =
        field === 'prerequisiteTagIds' && 'prerequisiteTagIds' in entity
          ? entity.prerequisiteTagIds
          : 'prerequisiteOutcomeIds' in entity
            ? entity.prerequisiteOutcomeIds
            : [];
      if (
        !same(
          declared,
          edges.filter((edge) => edge.nodeId === entity.id).map((edge) => edge.prerequisiteId),
        )
      )
        throw new Error(`RELEASE_DAG_ENTITY_DRIFT:${entity.id}`);
    }
  }
  deterministicTopologicalOrder(
    input.units.map((unit) => ({
      id: unit.id,
      prerequisiteIds: unit.parentId ? [unit.parentId] : [],
    })),
  );
  const order = input.chapters.flatMap((chapter) => [chapter.id, ...chapter.unitIds]);
  if (
    new Set(order).size !== order.length ||
    !same(
      order,
      input.units.map((unit) => unit.id),
    )
  )
    throw new Error('RELEASE_EDITORIAL_ORDER');
  const byId = new Map(input.units.map((unit) => [unit.id, unit]));
  for (const chapter of input.chapters) {
    if (byId.get(chapter.id)?.kind !== 'chapter') throw new Error('RELEASE_EDITORIAL_CHAPTER');
    for (const id of chapter.unitIds) {
      let unit = byId.get(id);
      while (unit?.parentId) unit = byId.get(unit.parentId);
      if (unit?.id !== chapter.id) throw new Error(`RELEASE_CHAPTER_MEMBERSHIP:${id}`);
    }
  }
  if (input.units.some((unit) => unit.contentPhase !== 'full_authoring'))
    throw new Error('RELEASE_UNIT_HANDOFF');
  if (
    !same(
      input.problems.map((problem) => problem.id),
      input.placements.map((placement) => placement.problemId),
    )
  )
    throw new Error('RELEASE_PLACEMENT_COVERAGE');
  const coverage = buildProblemOutcomeCoverage(input);
  const owners = new Map(coverage.map((entry) => [entry.outcomeId, entry.ownerUnitId]));
  const directOwners = new Map<string, string[]>();
  for (const unit of input.units)
    for (const problemId of unit.directProblemIds ?? [])
      directOwners.set(problemId, [...(directOwners.get(problemId) ?? []), unit.id]);
  if ([...directOwners.keys()].some((id) => !input.problems.some((problem) => problem.id === id)))
    throw new Error('RELEASE_PROBLEM_HOME_UNKNOWN');
  for (const placement of input.placements) {
    const home = owners.get(placement.primaryOutcomeId);
    const allOutcomes = [
      placement.primaryOutcomeId,
      ...placement.additionalPrimaryOutcomeIds,
      ...placement.supportingOutcomeIds,
    ];
    if (
      allOutcomes.some((id) => !owners.has(id)) ||
      [...placement.primaryTagIds, ...placement.supportingTagIds].some(
        (id) => !input.tags.some((tag) => tag.id === id),
      ) ||
      !same(directOwners.get(placement.problemId) ?? [], home ? [home] : [])
    )
      throw new Error(`RELEASE_PROBLEM_HOME:${placement.problemId}`);
  }
  return coverage;
};
