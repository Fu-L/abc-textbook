import type { PreviewSelectionRules } from '../preview/cohort-selection.js';

export type PolicyDocumentKind = 'robots' | 'terms' | 'generative-ai';

export interface ApprovedPolicyDocument {
  readonly id: string;
  readonly kind: PolicyDocumentKind;
  readonly url: string;
  readonly approvedFingerprint: string;
}

export interface PolicyApprovalManifest {
  readonly schemaVersion: '1.0.0';
  readonly documents: readonly ApprovedPolicyDocument[];
}

export interface VerifiedPolicyDocument {
  readonly id: string;
  readonly kind: PolicyDocumentKind;
  readonly url: string;
  readonly fingerprint: string;
  readonly approvedFingerprint: string;
}

export interface VerifiedPolicyBundle {
  readonly checkedAt: string;
  readonly documents: readonly VerifiedPolicyDocument[];
  readonly digest: string;
}

export interface OfficialPageRequest {
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly signal: AbortSignal;
}

export interface OfficialPageResponse {
  readonly status: number;
  readonly url: string;
  readonly contentType: string;
  readonly body: string;
}

export type OfficialPageTransport = (request: OfficialPageRequest) => Promise<OfficialPageResponse>;

export interface OfficialTaskMetadata {
  readonly label: string;
  readonly officialOrder: number;
  readonly officialTaskId: string;
  readonly title: string;
  readonly officialUrl: string;
  readonly timeLimit: string;
  readonly memoryLimit: string;
}

export interface OfficialContestMetadata {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly officialUrl: string;
  readonly officialTaskListUrl: string;
  readonly officialTaskOrder: readonly string[];
  readonly tasks: readonly OfficialTaskMetadata[];
  readonly taskOrderSourceRevisionId: string;
  readonly checkedAt: string;
}

export interface OfficialContestGapMetadata {
  readonly number: number;
  readonly contestId: string;
  readonly status: 'officially_unheld';
  readonly evidenceUrl: string;
  readonly evidenceAssertion: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
  readonly fingerprint: string;
}

export interface CorpusSourceRevision {
  readonly id: string;
  readonly url: string;
  readonly sourceKind: 'official_problem' | 'official_editorial' | 'official_contest';
  readonly contestId: string;
  readonly officialTaskId: string | null;
  readonly checkedAt: string;
  readonly fingerprint: string;
  readonly termsCheckedAt: string;
}

export interface CorpusProblemMetadata {
  readonly id: string;
  readonly contestId: string;
  readonly slotLabel: string;
  readonly officialTaskId: string;
  readonly officialOrder: number;
  readonly title: string;
  readonly officialUrl: string;
  readonly constraintsSummary: string;
  readonly sourceRevisionIds: readonly string[];
  readonly checkedAt: string;
}

export interface CorpusMetadataBatchSubject {
  readonly schemaVersion: '1.0.0';
  readonly batchId: string;
  readonly firstContestNumber: number;
  readonly lastContestNumber: number;
  readonly checkedAt: string;
  readonly policy: VerifiedPolicyBundle;
  readonly contests: readonly OfficialContestMetadata[];
  readonly contestGaps: readonly OfficialContestGapMetadata[];
  readonly problems: readonly CorpusProblemMetadata[];
  readonly sourceRevisions: readonly CorpusSourceRevision[];
  readonly metadataBatchDigest: string;
}

export interface CorpusMetadataBatch extends CorpusMetadataBatchSubject {
  readonly digest: string;
}

export interface CandidateClassificationEvidence {
  readonly domain: string;
  readonly outcomeId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly rationale: string;
}

export interface PreviewCohortCandidateInput {
  readonly problemId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly classifications: readonly CandidateClassificationEvidence[];
  readonly selectionEligible: boolean;
  readonly exclusionReason: string | null;
  readonly fixtureId: string | null;
}

export interface PreviewCohortCandidate {
  readonly problemId: string;
  readonly contestNumber: number;
  readonly officialTaskOrder: number;
  readonly advancedLabel: string;
  readonly officialTaskId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly candidateDomains: readonly string[];
  readonly candidateOutcomeIds: readonly string[];
  readonly classifications: readonly CandidateClassificationEvidence[];
  readonly selectionEligible: boolean;
  readonly exclusionReason: string | null;
  readonly fixtureId: string | null;
}

export interface PreviewCandidatePoolSubject {
  readonly schemaVersion: '1.0.0';
  readonly previewId: 'initial-v1';
  readonly batchId: 'abc212-abc263';
  readonly metadataBatchDigest: string;
  readonly allowedDomains: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly candidates: readonly PreviewCohortCandidate[];
}

export interface PreviewCandidatePool extends PreviewCandidatePoolSubject {
  readonly candidatePoolDigest: string;
}

export interface FrozenCohortRules {
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

export interface FrozenPreviewCohortSubject {
  readonly schemaVersion: '1.0.0';
  readonly previewId: 'initial-v1';
  readonly phase: 'cohort_frozen';
  readonly seedRange: PreviewSelectionRules['seedRange'];
  readonly scopeRule: PreviewSelectionRules['scopeRule'];
  readonly cohortRules: PreviewSelectionRules['cohortRules'];
  readonly publicationBoundary: PreviewSelectionRules['publicationBoundary'];
  readonly frozenRulesDigest: string;
  readonly candidatePoolDigest: string;
  readonly metadataBatchDigest: string;
  readonly selectedProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly fixtureBoundaries: readonly {
    readonly fixtureId: string;
    readonly problemIds: readonly string[];
  }[];
  readonly excludedProblemIds: readonly string[];
}

export interface FrozenPreviewCohort extends FrozenPreviewCohortSubject {
  readonly manifestDigest: string;
}
