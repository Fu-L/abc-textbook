import { canonicalDigest } from '../domain/canonical-json.js';

export interface PreviewCohortRules {
  readonly domains: readonly string[];
  readonly minimumProblemsPerDomain: number;
  readonly minimumProblemsPerOutcome: number;
  readonly minimumProblemCount: number;
  readonly minimumContestCount: number;
  readonly minimumAdvancedLabelCount: number;
  readonly stableSortKeys: readonly string[];
  readonly allowFixtureSupplement: boolean;
  readonly requireFixtureBoundaryDeclaration: boolean;
}

export interface PreviewCohortCandidate {
  readonly problemId: string;
  readonly contestNumber: number;
  readonly officialTaskOrder: number;
  readonly advancedLabel: string;
  readonly candidateDomains: readonly string[];
  readonly candidateOutcomeIds: readonly string[];
}

export interface PreviewSelectionRules {
  readonly seedRange: {
    readonly firstContestNumber: number;
    readonly lastContestNumber: number;
    readonly requireContinuity: boolean;
  };
  readonly scopeRule: {
    readonly anchorLabel: string;
    readonly relation: string;
    readonly labelRegistry: string;
    readonly requireOfficialStateForEveryRegistryLabel: boolean;
  };
  readonly cohortRules: PreviewCohortRules;
  readonly publicationBoundary: {
    readonly allowedPreviewRoots: readonly string[];
    readonly forbiddenPublicRoots: readonly string[];
  };
}

export const previewSelectionRulesDigest = (rules: PreviewSelectionRules): string =>
  canonicalDigest(rules);

/**
 * Check independent cohort constraints, including the outcome-level minimum.
 * Outcome coverage is counted by distinct Problem ID, so one Problem cannot
 * satisfy the same outcome twice through duplicated candidate metadata.
 */
export const validateCohortSelection = (
  candidates: readonly PreviewCohortCandidate[],
  rules: PreviewCohortRules,
): string[] => {
  const domainCounts = new Map(rules.domains.map((domain) => [domain, 0]));
  const outcomeProblems = new Map<string, Set<string>>();
  const violations: string[] = [];
  const problemIds = new Set<string>();
  const uniqueCandidates: PreviewCohortCandidate[] = [];

  for (const candidate of candidates) {
    if (problemIds.has(candidate.problemId)) {
      violations.push(`duplicate_problem_id:${candidate.problemId}`);
      continue;
    }
    problemIds.add(candidate.problemId);
    uniqueCandidates.push(candidate);
    const candidateDomains = new Set(candidate.candidateDomains);
    for (const domain of rules.domains) {
      if (candidateDomains.has(domain)) {
        domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
      }
    }

    if (candidate.candidateOutcomeIds.length === 0) {
      violations.push(`candidate_outcome_missing:${candidate.problemId}`);
    }
    for (const outcomeId of new Set(candidate.candidateOutcomeIds)) {
      const problems = outcomeProblems.get(outcomeId) ?? new Set<string>();
      problems.add(candidate.problemId);
      outcomeProblems.set(outcomeId, problems);
    }
  }

  violations.push(
    ...(problemIds.size < rules.minimumProblemCount ? ['problem_count'] : []),
    ...(new Set(uniqueCandidates.map(({ contestNumber }) => contestNumber)).size <
    rules.minimumContestCount
      ? ['contest_count']
      : []),
    ...(new Set(uniqueCandidates.map(({ advancedLabel }) => advancedLabel)).size <
    rules.minimumAdvancedLabelCount
      ? ['advanced_label_count']
      : []),
    ...rules.domains.flatMap((domain) =>
      (domainCounts.get(domain) ?? 0) < rules.minimumProblemsPerDomain ? [`domain:${domain}`] : [],
    ),
    ...[...outcomeProblems.entries()].flatMap(([outcomeId, problems]) =>
      problems.size < rules.minimumProblemsPerOutcome ? [`outcome:${outcomeId}`] : [],
    ),
  );
  return violations;
};
