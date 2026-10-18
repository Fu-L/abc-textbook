import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { buildCanonicalCatalog } from '../../src/lib/catalog/build-catalog.js';
import {
  validateClaimReference,
  validatePlacementAnalysisCoverage,
  validatePlacementOutcomeRoles,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';

/** Validate all canonical input, including the three DAGs, before deriving the index.
 * The caller must write and check that index without changing this temporary input. */
export const validateSmallBatchCandidate = async (input: {
  repositoryRoot: string;
  targetProblemIds: readonly string[];
  lastContestId: string;
  problemCount: number;
}) => {
  const projection = await loadFullPublicProjection({
    repositoryRoot: input.repositoryRoot,
    usePreparedRelease: false,
    verifyDerivedFiles: false,
  });
  if (
    projection.catalog.problems.length !== input.problemCount ||
    projection.catalog.release.lastContestId !== input.lastContestId
  )
    throw new Error('BATCH_RANGE_MISMATCH');
  const outcomes = new Map(projection.catalog.learningOutcomes.map((o) => [o.id, o]));
  for (const problemId of input.targetProblemIds) {
    const analysis = projection.catalog.techniqueInventory.find((p) => p.problemId === problemId);
    if (analysis?.reviewStatus !== 'reviewed' || analysis.reviewFindings.length)
      throw new Error(`ANALYSIS_INCOMPLETE:${problemId}`);
    const document = projection.problemDocuments.get(problemId);
    const placement = projection.policy.placements.find((p) => p.problemId === problemId);
    if (
      !document ||
      !placement ||
      !document.unit.learningOutcomeIds.includes(placement.primaryOutcomeId)
    )
      throw new Error(`AUTHORING_OUTCOME_MISMATCH:${problemId}`);
    const records = new Map([[problemId, analysis]]);
    for (const reference of [
      ...placement.analysisEvidenceRefs,
      ...placement.claimDispositions.map((d) => d.claimRef),
    ]) {
      if (reference.problemId !== problemId) throw new Error(`PLACEMENT_CLAIM_OWNER:${problemId}`);
      const finding = validateClaimReference(reference, records)[0];
      if (finding) throw new Error(`${finding.code}:${finding.message}`);
    }
    const findings = [
      ...validatePlacementOutcomeRoles(placement, outcomes),
      ...validatePlacementAnalysisCoverage(placement, analysis),
    ];
    const finding = findings[0];
    if (finding) throw new Error(`${finding.code}:${problemId}:${finding.message}`);
  }
  buildCanonicalCatalog(projection.catalog);
  return projection;
};

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
