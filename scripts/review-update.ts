import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { canonicalDigest } from '../src/lib/domain/canonical-json.js';
import { HumanContentReviewEvidenceSchema } from '../src/lib/domain/schema-parts/review-evidence.js';

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
  const reviewerId = reviewMode === 'self' ? 'person-maintainer' : 'person-independent-reviewer';
  const completedAt = '2026-07-28T15:00:00+09:00';
  const resultPath = 'staging/previews/initial-v1/release-simulation/verification.json';
  const resultDigest = '5776331dcf122d5e602a7beb75e44ad40c1dfe404fd61916a62dae828867c6c3';
  const applicableChecks = input.checkIds.map((checkId) => ({
    checkId,
    command: 'npm test',
    subjectDigest: input.subjectDigest,
    resultPath,
    resultDigest,
    exitCode: 0,
    passed: true,
    completedAt,
    executedByReviewerId: reviewerId,
  }));
  const learningOutcomeIds = [
    'outcome-us5-authoring-classification',
    'outcome-us5-discovery-acquisition',
    'outcome-us5-validation-resume',
  ];
  const reviewItems = learningOutcomeIds.map((outcomeId) => ({
    reviewItemId: `human-review-item-${outcomeId.replace('outcome-', '')}`,
    kind: 'outcome_coverage' as const,
    subjectPaths: ['scripts/update-abc/index.ts', resultPath],
    authorIds: ['person-maintainer'],
    learningOutcomeIds: [outcomeId],
    reviewerId,
    reviewBasis: `The current fixture subject was checked with abc-explanation-author ${input.authoringSkillVersion} (${input.authoringSkillDigest}).`,
    decision: 'approved' as const,
    findings: [],
    reviewedAt: completedAt,
  }));
  const evidence = {
    schemaVersion: '3.0.0' as const,
    id: 'human-content-review-initial-v1-us5-update-simulation',
    scopeType: 'merge' as const,
    scopeId: 'initial-v1-us5-update-simulation',
    releaseVersion: null,
    subjectDigest: input.subjectDigest,
    inventoryPath: 'docs/work-manifests/initial/us5/manifest.json',
    inventoryDigest: 'd2b77b9176417e5dcd9a4abe2a9f8396b8f3689d9621af97fa999a4452da6965',
    reviewPolicy: { requiredMode: reviewMode, riskReasons: input.riskReasons ?? [] },
    reviewMode,
    applicableChecks,
    applicableCheckCount: applicableChecks.length,
    passedApplicableCheckCount: applicableChecks.length,
    reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
    authors: [
      {
        personId: 'person-maintainer',
        authoredItemIds: ['us5.discovery', 'us5.authoring', 'us5.validation-resume'],
      },
    ],
    reviewer: { personId: reviewerId, mode: reviewMode },
    reviewItems,
    inventoryItemCount: reviewItems.length,
    reviewedItemCount: reviewItems.length,
    approvedItemCount: reviewItems.length,
    changesRequestedItemCount: 0,
    unreviewedItemCount: 0,
    outcomeCoverageReview: {
      reviewerId,
      authorIds: ['person-maintainer'],
      decision: 'confirmed' as const,
      learningOutcomeIds,
      subjectPaths: ['docs/work-manifests/initial/us5/manifest.json', resultPath],
      rationale:
        'The frozen US5 review units cover discovery, authoring classification, and resumable validation.',
      noOutcomeImpactRationale: null,
      confirmedAt: completedAt,
    },
    outcomeCoverageConfirmed: true,
    aggregatePassed: true,
    generatedAt: completedAt,
  };
  return HumanContentReviewEvidenceSchema.parse({
    ...evidence,
    evidenceDigest: canonicalDigest(evidence),
  });
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const evidencePath = argument('--evidence');
  if (!evidencePath) {
    process.stderr.write('Usage: npm run abc:review -- --evidence PATH\n');
    process.stdout.write(`${JSON.stringify({ command: 'abc:review', exitCode: 64 })}\n`);
    process.exitCode = 64;
  } else {
    const evidence = HumanContentReviewEvidenceSchema.parse(
      JSON.parse(await readFile(evidencePath, 'utf8')) as unknown,
    );
    const validDigest = canonicalDigest(
      Object.fromEntries(Object.entries(evidence).filter(([key]) => key !== 'evidenceDigest')),
    );
    if (validDigest !== evidence.evidenceDigest) throw new Error('REVIEW_EVIDENCE_DIGEST_MISMATCH');
    process.stdout.write(
      `${JSON.stringify({ command: 'abc:review', evidenceId: evidence.id, reviewMode: evidence.reviewMode, aggregatePassed: evidence.aggregatePassed })}\n`,
    );
    process.exitCode = evidence.aggregatePassed ? 0 : 2;
  }
}
