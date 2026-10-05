interface ProblemContentInput {
  readonly problemIds: readonly string[];
  readonly documents: readonly { readonly problemId: string; readonly docPath: string }[];
  readonly placements: readonly {
    readonly problemId: string;
    readonly primaryOutcomeId: string;
    readonly additionalPrimaryOutcomeIds: readonly string[];
    readonly supportingOutcomeIds: readonly string[];
  }[];
  readonly units: readonly {
    readonly id: string;
    readonly parentId?: string | null | undefined;
    readonly problemIds?: readonly string[] | undefined;
    readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
    readonly directProblemIds?: readonly string[] | undefined;
    readonly relatedProblemIds?: readonly string[] | undefined;
  }[];
}

/** References only. T160 consumes this mapping when switching the shared public pipeline. */
export const buildProblemContent = (input: ProblemContentInput) => {
  const fail = (reason: string): never => {
    throw new Error(`PROBLEM_CONTENT_${reason}`);
  };
  const unique = (values: readonly string[], reason: string) => {
    if (new Set(values).size !== values.length) fail(reason);
  };
  unique(input.problemIds, 'DUPLICATE_PROBLEM');
  unique(
    input.documents.map((d) => d.problemId),
    'DUPLICATE_DOCUMENT',
  );
  unique(
    input.documents.map((d) => d.docPath),
    'SHARED_DOCUMENT_PATH',
  );
  unique(
    input.placements.map((p) => p.problemId),
    'DUPLICATE_PLACEMENT',
  );
  unique(
    input.units.map((u) => u.id),
    'DUPLICATE_UNIT',
  );
  const problemIds = new Set(input.problemIds);
  for (const items of [input.documents, input.placements]) {
    if (items.length !== problemIds.size || items.some((p) => !problemIds.has(p.problemId)))
      fail('CORPUS_COVERAGE');
  }
  const owners = new Map<string, string>();
  const homes = new Map<string, { unitId: string; order: number }>();
  for (const unit of input.units) {
    for (const outcomeId of unit.ownedLearningOutcomeIds ?? []) {
      if (owners.has(outcomeId)) fail(`OUTCOME_OWNER:${outcomeId}`);
      owners.set(outcomeId, unit.id);
    }
    unique(unit.relatedProblemIds ?? [], `DUPLICATE_RELATED:${unit.id}`);
    for (const id of unit.relatedProblemIds ?? [])
      if (!problemIds.has(id) || unit.directProblemIds?.includes(id))
        fail(`RELATED_MEMBERSHIP:${id}`);
    for (const [index, id] of (unit.directProblemIds ?? []).entries()) {
      if (!problemIds.has(id) || homes.has(id)) fail(`HOME_MEMBERSHIP:${id}`);
      homes.set(id, { unitId: unit.id, order: index + 1 });
    }
  }
  const documents = new Map(input.documents.map((d) => [d.problemId, d]));
  const placements = new Map(input.placements.map((p) => [p.problemId, p]));
  return [...problemIds].sort().map((problemId) => {
    const document = documents.get(problemId);
    const placement = placements.get(problemId);
    const home = homes.get(problemId);
    if (!document || !placement || !home) return fail(`MISSING:${problemId}`);
    if (owners.get(placement.primaryOutcomeId) !== home.unitId) fail(`PRIMARY_OWNER:${problemId}`);
    if (
      !document.docPath.startsWith('src/content/docs/problems/') ||
      !document.docPath.endsWith('.md')
    )
      fail(`DOCUMENT_PATH:${problemId}`);
    const ownerIds = (ids: readonly string[]) =>
      [
        ...new Set(
          ids.map((id) => {
            const owner = owners.get(id);
            return owner ?? fail(`OUTCOME_MISSING:${id}`);
          }),
        ),
      ]
        .filter((id) => id !== home.unitId)
        .sort();
    const additionalPrimaryUnitIds = ownerIds(placement.additionalPrimaryOutcomeIds);
    const ancestors = new Set<string>([home.unitId]);
    let parentId = input.units.find((u) => u.id === home.unitId)?.parentId;
    while (parentId) {
      if (ancestors.has(parentId)) fail(`PARENT_CYCLE:${parentId}`);
      ancestors.add(parentId);
      const parent = input.units.find((u) => u.id === parentId);
      if (!parent) fail(`PARENT_MISSING:${parentId}`);
      parentId = parent?.parentId;
    }
    const coverageUnitIds = input.units
      .filter(
        (u) => u.id !== home.unitId && (u.problemIds?.includes(problemId) ?? ancestors.has(u.id)),
      )
      .map((u) => u.id)
      .sort();
    const requiredRelated = ownerIds([
      ...placement.additionalPrimaryOutcomeIds,
      ...placement.supportingOutcomeIds,
    ]);
    const relatedUnitIds = input.units
      .filter((u) => u.relatedProblemIds?.includes(problemId))
      .map((u) => u.id)
      .sort();
    if (requiredRelated.some((id) => !ancestors.has(id) && !relatedUnitIds.includes(id)))
      fail(`RELATED_COVERAGE:${problemId}`);
    return {
      problemId,
      documentPath: document.docPath,
      route: `/problems/${problemId}/`,
      homeUnitId: home.unitId,
      homeOrder: home.order,
      coverageUnitIds,
      additionalPrimaryUnitIds,
      relatedUnitIds,
    };
  });
};
