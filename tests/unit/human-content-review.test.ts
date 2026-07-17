import { describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { HumanContentReviewEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { validateHumanContentReview } from '../../src/lib/validation/human-content-review.js';

const sha = (character: string): string => character.repeat(64);
const trustedInventory = {
  subjectDigest: sha('a'),
  inventoryDigest: sha('c'),
  applicableChecks: [{ checkId: 'check-contracts', command: 'npm run test:contract' }],
} as const;

const makeEvidence = (input?: {
  readonly decision?: 'approved' | 'changes_requested';
  readonly findingResolved?: boolean;
}): Record<string, unknown> => {
  const decision = input?.decision ?? 'approved';
  const applicableChecks = [
    {
      checkId: 'check-contracts',
      command: 'npm run test:contract',
      subjectDigest: sha('a'),
      resultPath: 'docs/judgments/merge/phase-two/check.json',
      resultDigest: sha('b'),
      exitCode: 0,
      passed: true,
      completedAt: '2026-07-17T12:00:00+09:00',
      executedByReviewerId: 'person-reviewer',
    },
  ];
  const evidence: Record<string, unknown> = {
    schemaVersion: '2.0.0',
    id: 'human-content-review-phase-two',
    scopeType: 'merge',
    scopeId: 'phase-two',
    releaseVersion: null,
    subjectDigest: sha('a'),
    inventoryPath: 'docs/judgments/merge/phase-two/human-review-inventory.json',
    inventoryDigest: sha('c'),
    rawEvidenceManifestPath: 'docs/judgments/merge/phase-two/human-review-raw/manifest.json',
    rawEvidenceManifestDigest: sha('d'),
    rawEvidenceCount: 1,
    artifactPath: 'docs/judgments/merge/phase-two/human-review.json',
    applicableChecks,
    applicableCheckCount: 1,
    passedApplicableCheckCount: 1,
    reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
    authors: [{ personId: 'person-author', authoredItemIds: ['claim-one'] }],
    reviewers: [
      {
        personId: 'person-reviewer',
        role: 'independent_human_content_reviewer',
        independenceDeclaration: 'I did not author the reviewed item.',
        countedAsOwnerApproval: false,
      },
    ],
    reviewItems: [
      {
        reviewItemId: 'human-review-item-claim-one',
        kind: 'non_automatable_claim',
        subjectPaths: ['src/content/docs/index.md'],
        authorIds: ['person-author'],
        learningOutcomeIds: [],
        reviewerId: 'person-reviewer',
        reviewBasis: 'Compared the claim with its official source.',
        decision,
        findings:
          input?.findingResolved === undefined
            ? []
            : [
                {
                  findingId: 'human-review-finding-one',
                  severity: 'advisory',
                  description: 'Clarify the boundary case.',
                  resolved: input.findingResolved,
                  evidenceRefs: ['source-one'],
                },
              ],
        reviewedAt: '2026-07-17T12:30:00+09:00',
      },
    ],
    inventoryItemCount: 1,
    reviewedItemCount: 1,
    approvedItemCount: decision === 'approved' ? 1 : 0,
    changesRequestedItemCount: decision === 'changes_requested' ? 1 : 0,
    unreviewedItemCount: 0,
    outcomeCoverageReview: {
      reviewerId: 'person-reviewer',
      authorIds: ['person-author'],
      decision: 'no_outcome_impact_confirmed',
      learningOutcomeIds: [],
      subjectPaths: ['src/content/docs/index.md'],
      rationale: 'The wording change does not alter an observable outcome.',
      noOutcomeImpactRationale: 'No learning outcome changes.',
      confirmedAt: '2026-07-17T12:30:00+09:00',
    },
    outcomeCoverageConfirmed: true,
    aggregatePassed: true,
    generatedAt: '2026-07-17T12:31:00+09:00',
    evidenceDigest: '',
  };
  evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');
  return evidence;
};

describe('human content review gate', () => {
  it('accepts a complete independently approved review', () => {
    expect(HumanContentReviewEvidenceSchema.safeParse(makeEvidence()).success).toBe(true);
    expect(() => {
      validateHumanContentReview(makeEvidence(), trustedInventory);
    }).not.toThrow();
  });

  it('rejects aggregate success with changes requested or unresolved findings', () => {
    expect(
      HumanContentReviewEvidenceSchema.safeParse(makeEvidence({ decision: 'changes_requested' }))
        .success,
    ).toBe(false);
    expect(() => {
      validateHumanContentReview(makeEvidence({ findingResolved: false }), trustedInventory);
    }).toThrow(/REVIEW_INCOMPLETE/u);
  });

  it('uses the strict shared RFC 3339 validator in runtime contracts', () => {
    const evidence = makeEvidence();
    evidence.generatedAt = '2026-02-30T12:31:00+09:00';
    evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');
    expect(HumanContentReviewEvidenceSchema.safeParse(evidence).success).toBe(false);
  });

  it('rejects omitted, duplicated, or differently scoped trusted checks', () => {
    const evidence = makeEvidence();
    const inventoryWithRequiredLint = {
      ...trustedInventory,
      applicableChecks: [
        ...trustedInventory.applicableChecks,
        { checkId: 'check-lint', command: 'npm run lint' },
      ],
    };
    expect(() => {
      validateHumanContentReview(evidence, inventoryWithRequiredLint);
    }).toThrow(/REVIEWER_CHECK_INVENTORY_INVALID/u);

    const duplicated = structuredClone(evidence);
    const checks = duplicated.applicableChecks as Record<string, unknown>[];
    const [firstCheck] = checks;
    if (!firstCheck) throw new Error('Fixture check is missing.');
    checks.push(structuredClone(firstCheck));
    duplicated.applicableCheckCount = 2;
    duplicated.passedApplicableCheckCount = 2;
    duplicated.reviewerExecutedCheckSetDigest = canonicalDigest(checks);
    duplicated.evidenceDigest = digestWithoutField(duplicated, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(duplicated, trustedInventory);
    }).toThrow(/REVIEWER_CHECK_INVENTORY_INVALID/u);

    expect(() => {
      validateHumanContentReview(evidence, {
        ...trustedInventory,
        subjectDigest: sha('f'),
      });
    }).toThrow(/REVIEWER_CHECK_INVENTORY_INVALID/u);
  });
});
