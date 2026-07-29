import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

export interface TechniqueCandidate {
  readonly problemId: string;
  readonly techniqueKey: string;
}

export interface FrozenClassificationCandidate {
  readonly problemId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly classifications: readonly {
    readonly domain: string;
    readonly outcomeId: string;
    readonly sourceRevisionIds: readonly string[];
    readonly rationale: string;
  }[];
}

export interface FrozenTaxonomyGroup {
  readonly domain: string;
  readonly candidateOutcomeId: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly tag: { readonly id: string; readonly prerequisiteTagIds: readonly string[] };
  readonly outcome: { readonly id: string; readonly prerequisiteOutcomeIds: readonly string[] };
  readonly unit: { readonly id: string; readonly prerequisiteUnitIds: readonly string[] };
  readonly placements: readonly {
    readonly problemId: string;
    readonly placementId?: string;
    readonly id?: string;
    readonly tagIds: readonly string[];
    readonly outcomeIds: readonly string[];
    readonly unitIds: readonly string[];
    readonly sourceRevisionIds: readonly string[];
    readonly classificationRationale: string;
    readonly [key: string]: unknown;
  }[];
}

interface FrozenTaxonomyTag {
  readonly id: string;
  readonly prerequisiteTagIds: readonly string[];
  readonly [key: string]: unknown;
}

interface FrozenTaxonomyOutcome {
  readonly id: string;
  readonly prerequisiteOutcomeIds: readonly string[];
  readonly [key: string]: unknown;
}

interface FrozenTaxonomyUnit {
  readonly id: string;
  readonly prerequisiteUnitIds: readonly string[];
  readonly [key: string]: unknown;
}

export interface FrozenTaxonomyIndex {
  readonly problemIds: readonly string[];
  readonly tags: readonly FrozenTaxonomyTag[];
  readonly outcomes: readonly FrozenTaxonomyOutcome[];
  readonly units: readonly FrozenTaxonomyUnit[];
  readonly placements: FrozenTaxonomyGroup['placements'];
  readonly standardUnitOrder: readonly string[];
}

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedRight = [...right].sort();
  return (
    left.length === right.length &&
    [...left].sort().every((value, index) => value === sortedRight[index])
  );
};

export const deriveFrozenClassification = (input: {
  readonly selectedProblemIds: readonly string[];
  readonly candidates: readonly FrozenClassificationCandidate[];
  readonly groups: readonly FrozenTaxonomyGroup[];
  readonly index: FrozenTaxonomyIndex;
}) => {
  const candidateByProblem = new Map(
    input.candidates.map((candidate) => [candidate.problemId, candidate]),
  );
  const groupByCandidateOutcome = new Map(
    input.groups.map((group) => [group.candidateOutcomeId, group]),
  );
  const existingTaxonomy = Object.fromEntries(
    input.groups.map((group) => [
      group.candidateOutcomeId,
      { tagId: group.tag.id, outcomeId: group.outcome.id, unitId: group.unit.id },
    ]),
  );
  const candidates = input.selectedProblemIds.flatMap((problemId) => {
    const candidate = candidateByProblem.get(problemId);
    if (!candidate || candidate.classifications.length === 0)
      return [{ problemId, techniqueKey: '' }];
    return candidate.classifications.map(({ outcomeId }) => ({
      problemId,
      techniqueKey: outcomeId,
    }));
  });
  const classified = classifyTechniques(candidates, existingTaxonomy);
  const uniqueIds = (values: readonly string[]): boolean => new Set(values).size === values.length;
  const tagIds = input.index.tags.map(({ id }) => id);
  const outcomeIds = input.index.outcomes.map(({ id }) => id);
  const unitIds = input.index.units.map(({ id }) => id);
  const knownTagIds = new Set(tagIds);
  const knownOutcomeIds = new Set(outcomeIds);
  const knownUnitIds = new Set(unitIds);
  const unitOrder = new Map(input.index.standardUnitOrder.map((id, index) => [id, index]));
  const entityMatchesIndex = input.groups.every((group) => {
    const tag = input.index.tags.find(({ id }) => id === group.tag.id);
    const outcome = input.index.outcomes.find(({ id }) => id === group.outcome.id);
    const unit = input.index.units.find(({ id }) => id === group.unit.id);
    return (
      tag !== undefined &&
      outcome !== undefined &&
      unit !== undefined &&
      canonicalDigest(tag) === canonicalDigest(group.tag) &&
      canonicalDigest(outcome) === canonicalDigest(group.outcome) &&
      canonicalDigest(unit) === canonicalDigest(group.unit) &&
      group.placements.every((placement) => {
        const indexed = input.index.placements.find(
          ({ problemId }) => problemId === placement.problemId,
        );
        return indexed !== undefined && canonicalDigest(indexed) === canonicalDigest(placement);
      })
    );
  });
  const groupPlacementProblemIds = input.groups.flatMap((group) =>
    group.placements.map(({ problemId }) => problemId),
  );
  const groupDeclarationsAreComplete = input.groups.every((group) =>
    sameSet(
      group.problemIds,
      group.placements.map(({ problemId }) => problemId),
    ),
  );
  const tagsResolve = input.index.tags.every((tag) =>
    tag.prerequisiteTagIds.every((id) => knownTagIds.has(id)),
  );
  const outcomesResolve = input.index.outcomes.every((outcome) =>
    outcome.prerequisiteOutcomeIds.every((id) => knownOutcomeIds.has(id)),
  );
  const unitsResolve = input.index.units.every((unit) => {
    const unitPosition = unitOrder.get(unit.id);
    return unit.prerequisiteUnitIds.every((id) => {
      const prerequisitePosition = unitOrder.get(id);
      return (
        knownUnitIds.has(id) &&
        prerequisitePosition !== undefined &&
        unitPosition !== undefined &&
        prerequisitePosition < unitPosition
      );
    });
  });
  const prerequisitesResolve = tagsResolve && outcomesResolve && unitsResolve;
  const taxonomyValid =
    uniqueIds(tagIds) &&
    uniqueIds(outcomeIds) &&
    uniqueIds(unitIds) &&
    uniqueIds(input.groups.map(({ candidateOutcomeId }) => candidateOutcomeId)) &&
    uniqueIds(groupPlacementProblemIds) &&
    sameSet(input.index.problemIds, input.selectedProblemIds) &&
    sameSet(
      input.index.placements.map(({ problemId }) => problemId),
      input.selectedProblemIds,
    ) &&
    sameSet(groupPlacementProblemIds, input.selectedProblemIds) &&
    sameSet(input.index.standardUnitOrder, unitIds) &&
    entityMatchesIndex &&
    groupDeclarationsAreComplete &&
    prerequisitesResolve;
  const validProblemIds = new Set<string>();
  for (const problemId of input.selectedProblemIds) {
    const candidate = candidateByProblem.get(problemId);
    if (candidate?.classifications.length !== 1) continue;
    const classification = candidate.classifications[0];
    if (!classification) continue;
    const group = groupByCandidateOutcome.get(classification.outcomeId);
    const placement = group?.placements.find((item) => item.problemId === problemId);
    const groupSourceRevisionIds = group
      ? [...new Set(group.placements.flatMap((item) => item.sourceRevisionIds))]
      : [];
    if (
      group &&
      placement &&
      group.domain === classification.domain &&
      group.problemIds.includes(problemId) &&
      sameSet(group.sourceRevisionIds, groupSourceRevisionIds) &&
      sameSet(candidate.sourceRevisionIds, classification.sourceRevisionIds) &&
      sameSet(classification.sourceRevisionIds, placement.sourceRevisionIds) &&
      sameSet(placement.tagIds, [group.tag.id]) &&
      sameSet(placement.outcomeIds, [group.outcome.id]) &&
      sameSet(placement.unitIds, [group.unit.id]) &&
      placement.classificationRationale === classification.rationale
    ) {
      if (taxonomyValid) validProblemIds.add(problemId);
    }
  }
  const taxonomyEdges: (readonly [string, string])[] = input.groups.flatMap((group) => [
    ...group.tag.prerequisiteTagIds.map((id) => [id, group.tag.id] as const),
    ...group.outcome.prerequisiteOutcomeIds.map((id) => [id, group.outcome.id] as const),
    ...group.unit.prerequisiteUnitIds.map((id) => [id, group.unit.id] as const),
  ]);
  return {
    ...classified,
    validProblemIds: [...validProblemIds].sort(),
    taxonomyEdges,
    taxonomyValid,
  };
};

export const classifyTechniques = (
  candidates: readonly TechniqueCandidate[],
  existingTaxonomy: Readonly<
    Record<string, { readonly tagId: string; readonly outcomeId: string; readonly unitId: string }>
  >,
): { mappings: readonly object[]; proposals: readonly object[] } => {
  const mappings: object[] = [];
  const proposals: object[] = [];
  for (const candidate of candidates) {
    const existing = existingTaxonomy[candidate.techniqueKey];
    if (existing) mappings.push({ ...candidate, ...existing });
    else proposals.push({ ...candidate, status: 'preview_only', publishable: false });
  }
  return { mappings, proposals };
};
