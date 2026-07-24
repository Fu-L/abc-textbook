import { canonicalDigest } from '../domain/canonical-json.js';

export type PreviewStatus = 'on_hold' | 'passed';
export type PreviewReviewMode = 'self' | 'third_party';

export interface ComponentCheckResult {
  readonly checkResultId: string;
  readonly subjectDigest: string;
  readonly passed: boolean;
}

export interface ComponentReviewEvidence {
  readonly reviewEvidenceId: string;
  readonly subjectDigest: string;
  readonly requiredMode: PreviewReviewMode;
  readonly reviewMode: PreviewReviewMode;
  readonly aggregatePassed: boolean;
}

export interface ComponentEvidence {
  readonly componentId: string;
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly candidatePoolDigest: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly provisionalTaxonomyDigest: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly subjectDigest: string;
  /** Digest of the generated artifact represented by this evidence. */
  readonly artifactDigest: string;
  readonly checkResults: readonly ComponentCheckResult[];
  readonly reviewEvidence: readonly ComponentReviewEvidence[];
  readonly componentDigest: string;
}

export interface PreviewJoinRequirements {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly candidatePoolDigest: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly provisionalTaxonomyDigest: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly subjectDigest: string;
  readonly requiredCheckResultIds: readonly string[];
  readonly requiredReviewEvidenceIds: readonly string[];
  /** Review mode frozen by the preview manifest for each required evidence ID. */
  readonly requiredReviewModes: Readonly<Record<string, PreviewReviewMode>>;
}

export const requiredPreviewComponentIds = [
  'metadata-inventory-taxonomy',
  'content-graph-search',
  'content-dynamic-programming',
  'content-data-structures',
  'content-mathematics',
  'learning-records',
  'ui-search',
  'update-simulation',
] as const;

export type ComponentEvidenceSubject = Omit<ComponentEvidence, 'componentDigest'>;

export const componentEvidenceDigest = (component: ComponentEvidenceSubject): string =>
  canonicalDigest(component);

export interface PreviewSnapshot {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly candidatePoolDigest: string;
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly provisionalTaxonomyDigest: string;
  readonly componentDigests: readonly string[];
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly checkResultIds: readonly string[];
  readonly reviewEvidenceIds: readonly string[];
  readonly joinDigest: string;
  readonly status: PreviewStatus;
  readonly holdReasons: readonly string[];
}

export type PreviewSnapshotDigestSubject = Omit<PreviewSnapshot, 'joinDigest'>;

export const previewSnapshotDigestSubject = (
  snapshot: PreviewSnapshot | PreviewSnapshotDigestSubject,
): PreviewSnapshotDigestSubject => ({
  previewId: snapshot.previewId,
  manifestDigest: snapshot.manifestDigest,
  candidatePoolDigest: snapshot.candidatePoolDigest,
  problemIds: snapshot.problemIds,
  sourceRevisionIds: snapshot.sourceRevisionIds,
  provisionalTaxonomyDigest: snapshot.provisionalTaxonomyDigest,
  componentDigests: snapshot.componentDigests,
  authoringSkillVersion: snapshot.authoringSkillVersion,
  authoringSkillDigest: snapshot.authoringSkillDigest,
  checkResultIds: snapshot.checkResultIds,
  reviewEvidenceIds: snapshot.reviewEvidenceIds,
  status: snapshot.status,
  holdReasons: snapshot.holdReasons,
});

export const previewSnapshotJoinDigest = (
  snapshot: PreviewSnapshot | PreviewSnapshotDigestSubject,
): string => canonicalDigest(previewSnapshotDigestSubject(snapshot));

export class PreviewSnapshotIntegrityError extends Error {
  constructor() {
    super('CANONICAL_SNAPSHOT_DIGEST_MISMATCH');
    this.name = 'PreviewSnapshotIntegrityError';
  }
}

export const assertPreviewSnapshotIntegrity = (
  snapshot: PreviewSnapshot,
  pathJoinDigest: string,
): void => {
  if (
    snapshot.joinDigest !== pathJoinDigest ||
    previewSnapshotJoinDigest(snapshot) !== pathJoinDigest
  ) {
    throw new PreviewSnapshotIntegrityError();
  }
};

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const sameUniqueSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

const componentIdsAreComplete = (componentIds: readonly string[]): boolean => {
  const uniqueIds = new Set(componentIds);
  return (
    uniqueIds.size === componentIds.length &&
    requiredPreviewComponentIds.every((componentId) => uniqueIds.has(componentId)) &&
    componentIds.every((componentId) =>
      requiredPreviewComponentIds.includes(
        componentId as (typeof requiredPreviewComponentIds)[number],
      ),
    )
  );
};

/** Join component evidence only against the separately frozen preview requirements. */
export const joinPreviewComponents = (
  components: readonly ComponentEvidence[],
  requirements: PreviewJoinRequirements,
): PreviewSnapshot => {
  if (components.length === 0) throw new Error('Preview component evidence is empty.');

  const holdReasons: string[] = [];
  const componentIds = components.map(({ componentId }) => componentId);
  if (!componentIdsAreComplete(componentIds)) holdReasons.push('COMPONENT_SET_INCOMPLETE');

  const checkResults = components.flatMap(({ checkResults: results }) => results);
  const reviewEvidence = components.flatMap(({ reviewEvidence: evidence }) => evidence);

  for (const component of components) {
    const { componentDigest, ...subject } = component;
    if (componentDigest !== componentEvidenceDigest(subject)) {
      holdReasons.push(`COMPONENT_DIGEST_STALE:${component.componentId}`);
    }
    if (
      component.previewId !== requirements.previewId ||
      !sameOrderedValues(component.problemIds, requirements.problemIds)
    ) {
      holdReasons.push(`COHORT_MISMATCH:${component.componentId}`);
    }
    if (component.manifestDigest !== requirements.manifestDigest) {
      holdReasons.push(`MANIFEST_MISMATCH:${component.componentId}`);
    }
    if (component.candidatePoolDigest !== requirements.candidatePoolDigest) {
      holdReasons.push(`CANDIDATE_POOL_MISMATCH:${component.componentId}`);
    }
    if (!sameUniqueSet(component.sourceRevisionIds, requirements.sourceRevisionIds)) {
      holdReasons.push(`SOURCE_REVISIONS_MISMATCH:${component.componentId}`);
    }
    if (component.provisionalTaxonomyDigest !== requirements.provisionalTaxonomyDigest) {
      holdReasons.push(`PROVISIONAL_TAXONOMY_MISMATCH:${component.componentId}`);
    }
    if (
      component.authoringSkillVersion !== requirements.authoringSkillVersion ||
      component.authoringSkillDigest !== requirements.authoringSkillDigest
    ) {
      holdReasons.push(`AUTHORING_SKILL_MISMATCH:${component.componentId}`);
    }
    if (component.subjectDigest !== requirements.subjectDigest) {
      holdReasons.push(`STALE_SUBJECT:${component.componentId}`);
    }
  }

  if (
    !sameUniqueSet(
      checkResults.map(({ checkResultId }) => checkResultId),
      requirements.requiredCheckResultIds,
    )
  ) {
    holdReasons.push('CHECK_RESULT_SET_INCOMPLETE');
  }
  for (const result of checkResults) {
    if (result.subjectDigest !== requirements.subjectDigest) {
      holdReasons.push(`STALE_CHECK_RESULT:${result.checkResultId}`);
    }
    if (!result.passed) holdReasons.push(`CHECK_FAILED:${result.checkResultId}`);
  }

  if (
    !sameUniqueSet(
      reviewEvidence.map(({ reviewEvidenceId }) => reviewEvidenceId),
      requirements.requiredReviewEvidenceIds,
    )
  ) {
    holdReasons.push('REVIEW_EVIDENCE_SET_INCOMPLETE');
  }
  for (const evidence of reviewEvidence) {
    const expectedMode = requirements.requiredReviewModes[evidence.reviewEvidenceId];
    if (
      expectedMode === undefined ||
      evidence.requiredMode !== expectedMode ||
      evidence.reviewMode !== expectedMode
    ) {
      holdReasons.push(`REVIEW_POLICY_MISMATCH:${evidence.reviewEvidenceId}`);
    }
    if (evidence.subjectDigest !== requirements.subjectDigest || !evidence.aggregatePassed) {
      holdReasons.push(`CURRENT_REVIEW_MISSING:${evidence.reviewEvidenceId}`);
    }
  }

  const snapshotSubject: PreviewSnapshotDigestSubject = {
    previewId: requirements.previewId,
    manifestDigest: requirements.manifestDigest,
    candidatePoolDigest: requirements.candidatePoolDigest,
    problemIds: requirements.problemIds,
    sourceRevisionIds: requirements.sourceRevisionIds,
    provisionalTaxonomyDigest: requirements.provisionalTaxonomyDigest,
    componentDigests: components.map(({ componentDigest }) => componentDigest),
    authoringSkillVersion: requirements.authoringSkillVersion,
    authoringSkillDigest: requirements.authoringSkillDigest,
    checkResultIds: requirements.requiredCheckResultIds,
    reviewEvidenceIds: requirements.requiredReviewEvidenceIds,
    holdReasons,
    status: holdReasons.length === 0 ? 'passed' : 'on_hold',
  };
  return { ...snapshotSubject, joinDigest: previewSnapshotJoinDigest(snapshotSubject) };
};
