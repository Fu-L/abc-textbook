import { canonicalDigest } from '../src/lib/domain/canonical-json.js';

export const createPreviewUpdateReview = (input: {
  readonly subjectDigest: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly checkIds: readonly string[];
  readonly riskReasons?: readonly string[];
}) => {
  const reviewMode =
    input.riskReasons && input.riskReasons.length > 0
      ? ('third_party' as const)
      : ('self' as const);
  const evidence = {
    schemaVersion: '1.0.0',
    reviewId: 'review-initial-v1-us5-update-simulation',
    previewId: 'initial-v1',
    subjectDigest: input.subjectDigest,
    reviewPolicy: { requiredMode: reviewMode, riskReasons: input.riskReasons ?? [] },
    reviewMode,
    reviewerId: reviewMode === 'self' ? 'person-maintainer' : 'person-independent-reviewer',
    authoringSkill: {
      name: 'abc-explanation-author',
      version: input.authoringSkillVersion,
      digest: input.authoringSkillDigest,
    },
    applicableChecks: input.checkIds.map((checkId) => ({
      checkId,
      subjectDigest: input.subjectDigest,
      passed: true,
    })),
    blockingFindingCount: 0,
    aggregatePassed: true,
  };
  return { ...evidence, evidenceDigest: canonicalDigest(evidence) };
};
