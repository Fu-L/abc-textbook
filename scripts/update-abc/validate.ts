import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

interface ProblemValidationInput {
  readonly problemId: string;
  readonly sourceAvailable: boolean;
  readonly explanationComplete: boolean;
  readonly examplesValid: boolean;
  readonly placementIds: readonly string[];
  readonly crossReferencesValid: boolean;
}

export interface PreparedValidationInput {
  readonly problems: readonly ProblemValidationInput[];
  readonly taxonomyEdges: readonly (readonly [string, string])[];
  readonly reachableProblemIds: readonly string[];
  readonly indexedProblemIds: readonly string[];
  readonly catalogProblemIds: readonly string[];
}

const hasCycle = (edges: readonly (readonly [string, string])[]): boolean => {
  const graph = new Map<string, string[]>();
  for (const [from, to] of edges) graph.set(from, [...(graph.get(from) ?? []), to]);
  const active = new Set<string>();
  const done = new Set<string>();
  const visit = (node: string): boolean => {
    if (active.has(node)) return true;
    if (done.has(node)) return false;
    active.add(node);
    if ((graph.get(node) ?? []).some(visit)) return true;
    active.delete(node);
    done.add(node);
    return false;
  };
  return [...graph.keys()].some(visit);
};

export const validatePreparedUpdate = (input: PreparedValidationInput) => {
  const cycle = hasCycle(input.taxonomyEdges);
  const reachable = new Set(input.reachableProblemIds);
  const indexed = new Set(input.indexedProblemIds);
  const catalog = new Set(input.catalogProblemIds);
  const problemResults = input.problems.map((problem) => {
    const findingCodes: string[] = [];
    if (!problem.sourceAvailable) findingCodes.push('SOURCE_UNAVAILABLE');
    if (!problem.explanationComplete) findingCodes.push('EXPLANATION_INCOMPLETE');
    if (!problem.examplesValid) findingCodes.push('EXAMPLE_NOT_REPRODUCIBLE');
    if (problem.placementIds.length === 0) findingCodes.push('PLACEMENT_MISSING');
    if (cycle) findingCodes.push('DEPENDENCY_CYCLE');
    if (!reachable.has(problem.problemId)) findingCodes.push('PROBLEM_UNREACHABLE');
    if (!indexed.has(problem.problemId)) findingCodes.push('INDEX_MISSING');
    if (!catalog.has(problem.problemId)) findingCodes.push('CATALOG_MISSING');
    if (!problem.crossReferencesValid) findingCodes.push('CROSS_REFERENCE_INVALID');
    return {
      problemId: problem.problemId,
      passed: findingCodes.length === 0,
      findingCodes,
      remediation:
        findingCodes.length === 0 ? null : 'Resolve every finding and resume validation.',
    };
  });
  const blockingFindingCount = problemResults.reduce(
    (count, result) => count + result.findingCodes.length,
    0,
  );
  const summary = {
    checkIds: [
      'source',
      'explanation',
      'example',
      'placement',
      'dag',
      'order',
      'catalog',
      'index',
      'cross-reference',
    ],
    problemResults,
    blockingFindingCount,
    aggregatePassed: blockingFindingCount === 0,
  };
  return { ...summary, resultDigest: canonicalDigest(summary) };
};
