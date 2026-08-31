import { describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  HumanContentReviewEvidenceSchema,
  MergeReviewEvidenceSchema,
} from '../../src/lib/domain/schema-parts/review-evidence.js';
import {
  validateHumanContentReview,
  validateMergeReviewEvidence,
} from '../../src/lib/validation/human-content-review.js';

const sha = (character: string): string => character.repeat(64);
type RiskReason = 'official_source_conflict' | 'original_proof' | 'major_classification_change';
const trustedInventory = {
  subjectDigest: sha('a'),
  inventoryDigest: sha('c'),
  reviewPolicy: { requiredMode: 'self', riskReasons: [] },
  workManifest: {
    learningOutcomeIds: [],
    reviewUnits: [
      {
        reviewUnitId: 'RU-T024-foundation',
        subjectPaths: ['src/content/docs/index.md'],
        learningOutcomeIds: [],
        owner: 'person-author',
      },
    ],
  },
  applicableChecks: [{ checkId: 'check-contracts', command: 'npm run test:contract' }],
  reviewItems: [
    {
      reviewItemId: 'human-review-item-claim-one',
      reviewUnitId: 'RU-T024-foundation',
      kind: 'non_automatable_claim',
      subjectPaths: ['src/content/docs/index.md'],
      authorIds: ['person-author'],
      learningOutcomeIds: [],
    },
  ],
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
      executedByReviewerId: 'person-author',
    },
  ];
  const evidence: Record<string, unknown> = {
    schemaVersion: '3.0.0',
    id: 'human-content-review-phase-two',
    scopeType: 'merge',
    scopeId: 'phase-two',
    releaseVersion: null,
    subjectDigest: sha('a'),
    inventoryPath: 'docs/judgments/merge/phase-two/human-review-inventory.json',
    inventoryDigest: sha('c'),
    reviewPolicy: { requiredMode: 'self', riskReasons: [] },
    reviewMode: 'self',
    applicableChecks,
    applicableCheckCount: 1,
    passedApplicableCheckCount: 1,
    reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
    authors: [{ personId: 'person-author', authoredItemIds: ['human-review-item-claim-one'] }],
    reviewer: { personId: 'person-author', mode: 'self' },
    reviewItems: [
      {
        reviewItemId: 'human-review-item-claim-one',
        kind: 'non_automatable_claim',
        subjectPaths: ['src/content/docs/index.md'],
        authorIds: ['person-author'],
        learningOutcomeIds: [],
        reviewerId: 'person-author',
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
      reviewerId: 'person-author',
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

const makeThirdPartyEvidence = (riskReason: RiskReason): Record<string, unknown> => {
  const evidence = makeEvidence();
  evidence.reviewPolicy = { requiredMode: 'third_party', riskReasons: [riskReason] };
  evidence.reviewMode = 'third_party';
  evidence.reviewer = { personId: 'person-reviewer', mode: 'third_party' };
  const [check] = evidence.applicableChecks as { executedByReviewerId: string }[];
  if (!check) throw new Error('Fixture check is missing.');
  check.executedByReviewerId = 'person-reviewer';
  const [item] = evidence.reviewItems as { reviewerId: string }[];
  if (!item) throw new Error('Fixture review item is missing.');
  item.reviewerId = 'person-reviewer';
  const coverage = evidence.outcomeCoverageReview as { reviewerId: string };
  coverage.reviewerId = 'person-reviewer';
  evidence.reviewerExecutedCheckSetDigest = canonicalDigest(evidence.applicableChecks);
  evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');
  return evidence;
};

const highRiskTrustedInventory = (riskReason: RiskReason) =>
  ({
    ...trustedInventory,
    reviewPolicy: { requiredMode: 'third_party', riskReasons: [riskReason] },
  }) as const;

const highRiskSelfTrustedInventory = (riskReason: RiskReason) =>
  ({
    ...trustedInventory,
    reviewPolicy: {
      requiredMode: 'self',
      riskReasons: [riskReason],
      highRiskSelfReviewReason: 'solo_maintainer',
    },
  }) as const;

const makeHighRiskSelfEvidence = (riskReason: RiskReason): Record<string, unknown> => {
  const evidence = makeEvidence();
  evidence.reviewPolicy = {
    requiredMode: 'self',
    riskReasons: [riskReason],
    highRiskSelfReviewReason: 'solo_maintainer',
  };
  evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');
  return evidence;
};

const makeMergeEvidence = (): Record<string, unknown> => {
  const evidence: Record<string, unknown> = {
    schemaVersion: '3.0.0',
    id: 'merge-review-phase-two',
    changeId: 'change-phase-two',
    logicalChangeSubjectDigest: sha('a'),
    subjectFiles: [{ path: 'src/content/docs/index.md', sha256: sha('1'), byteLength: 1 }],
    excludedArtifacts: [],
    workManifestPath: 'docs/judgments/merge/phase-two/work-manifest.json',
    workManifestDigest: sha('2'),
    learningOutcomeIds: [],
    outcomeImpact: { kind: 'none', rationale: 'No observable outcome changes.' },
    reviewMode: 'self',
    reviewerId: 'person-author',
    applicableChecks: [
      {
        checkId: 'check-contracts',
        executedByReviewerId: 'person-author',
        command: 'npm run test:contract',
        subjectDigest: sha('a'),
        resultPath: 'docs/judgments/merge/phase-two/check.json',
        resultDigest: sha('3'),
        rawResultPath: 'docs/judgments/merge/phase-two/check-raw.json',
        rawResultDigest: sha('4'),
        exitCode: 0,
        completedAt: '2026-07-17T12:00:00+09:00',
      },
    ],
    notApplicableChecks: [],
    humanContentReviewEvidenceId: 'human-review-phase-two',
    humanContentReviewEvidencePath: 'docs/judgments/merge/phase-two/human-review.json',
    humanContentReviewEvidenceDigest: sha('5'),
    constitutionCheck: {
      constitutionPath: '.specify/memory/constitution.md',
      constitutionVersion: '2.0.0',
      constitutionDigest: sha('6'),
      dependentTemplates: [
        { path: '.specify/templates/plan-template.md', sha256: sha('7'), byteLength: 1 },
      ],
      violationCount: 0,
      passed: true,
      checkedAt: '2026-07-17T12:00:00+09:00',
    },
    unresolvedBlockingFindingCount: 0,
    mergeApproved: true,
    reviewedAt: '2026-07-17T12:30:00+09:00',
    evidenceDigest: '',
  };
  evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');
  return evidence;
};

const trustedMergeContext = {
  subjectDigest: sha('a'),
  workManifestPath: 'docs/judgments/merge/phase-two/work-manifest.json',
  workManifestDigest: sha('2'),
  humanReview: {
    id: 'human-review-phase-two',
    digest: sha('5'),
    subjectDigest: sha('a'),
    aggregatePassed: true,
    reviewerId: 'person-author',
    reviewMode: 'self',
  },
  constitutionVersion: '2.0.0',
  constitutionDigest: sha('6'),
  reviewerId: 'person-author',
  checks: [{ checkId: 'check-contracts', command: 'npm run test:contract', applicable: true }],
} as const;

describe('human content review gate', () => {
  it('accepts a complete owner self-review without an external person ID', () => {
    expect(HumanContentReviewEvidenceSchema.safeParse(makeEvidence()).success).toBe(true);
    expect(() => {
      validateHumanContentReview(makeEvidence(), trustedInventory);
    }).not.toThrow();
  });

  it('requires third-party review only for a fixed high-risk policy', () => {
    const riskReasons: RiskReason[] = [
      'official_source_conflict',
      'original_proof',
      'major_classification_change',
    ];
    for (const riskReason of riskReasons) {
      expect(() => {
        validateHumanContentReview(makeEvidence(), highRiskTrustedInventory(riskReason));
      }).toThrow(/REVIEW_POLICY_MISMATCH/u);
      expect(() => {
        validateHumanContentReview(
          makeThirdPartyEvidence(riskReason),
          highRiskTrustedInventory(riskReason),
        );
      }).not.toThrow();
    }
  });

  it('accepts digest-bound high-risk self-review only for an explicit solo maintainer policy', () => {
    const evidence = makeHighRiskSelfEvidence('major_classification_change');
    expect(HumanContentReviewEvidenceSchema.safeParse(evidence).success).toBe(true);
    expect(() => {
      validateHumanContentReview(
        evidence,
        highRiskSelfTrustedInventory('major_classification_change'),
      );
    }).not.toThrow();

    const missingReason = makeEvidence();
    missingReason.reviewPolicy = {
      requiredMode: 'self',
      riskReasons: ['major_classification_change'],
    };
    missingReason.evidenceDigest = digestWithoutField(missingReason, 'evidenceDigest');
    expect(HumanContentReviewEvidenceSchema.safeParse(missingReason).success).toBe(false);

    const wrongReviewer = makeHighRiskSelfEvidence('major_classification_change');
    wrongReviewer.reviewer = { personId: 'person-reviewer', mode: 'self' };
    const [check] = wrongReviewer.applicableChecks as { executedByReviewerId: string }[];
    const [item] = wrongReviewer.reviewItems as { reviewerId: string }[];
    if (!check || !item) throw new Error('Fixture review inventory is missing.');
    check.executedByReviewerId = 'person-reviewer';
    item.reviewerId = 'person-reviewer';
    const coverage = wrongReviewer.outcomeCoverageReview as { reviewerId: string };
    coverage.reviewerId = 'person-reviewer';
    wrongReviewer.reviewerExecutedCheckSetDigest = canonicalDigest(wrongReviewer.applicableChecks);
    wrongReviewer.evidenceDigest = digestWithoutField(wrongReviewer, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(
        wrongReviewer,
        highRiskSelfTrustedInventory('major_classification_change'),
      );
    }).toThrow(/REVIEWER_IDENTITY_INVALID/u);
  });

  it('rejects a review mode that does not match the fixed policy', () => {
    const evidence = makeThirdPartyEvidence('original_proof');
    evidence.reviewPolicy = { requiredMode: 'self', riskReasons: [] };
    evidence.evidenceDigest = digestWithoutField(evidence, 'evidenceDigest');

    expect(HumanContentReviewEvidenceSchema.safeParse(evidence).success).toBe(false);
    expect(() => {
      validateHumanContentReview(evidence, trustedInventory);
    }).toThrow(/HUMAN_REVIEW_SCHEMA_INVALID/u);
  });

  it('requires current successful checks, constitution, and human review for merge approval', () => {
    expect(() => {
      validateMergeReviewEvidence(makeMergeEvidence(), trustedMergeContext);
    }).not.toThrow();

    const failedCheck = makeMergeEvidence();
    const [check] = failedCheck.applicableChecks as { exitCode: number }[];
    if (!check) throw new Error('Fixture check is missing.');
    check.exitCode = 1;
    failedCheck.evidenceDigest = digestWithoutField(failedCheck, 'evidenceDigest');
    expect(MergeReviewEvidenceSchema.safeParse(failedCheck).success).toBe(false);
    expect(() => {
      validateMergeReviewEvidence(failedCheck, trustedMergeContext);
    }).toThrow(/MERGE_REVIEW_SCHEMA_INVALID/u);

    expect(() => {
      validateMergeReviewEvidence(makeMergeEvidence(), {
        ...trustedMergeContext,
        humanReview: { ...trustedMergeContext.humanReview, aggregatePassed: false },
      });
    }).toThrow(/MERGE_HUMAN_REVIEW_INCOMPLETE/u);
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

  it('binds review items and authors to the trusted inventory', () => {
    const replacedAuthor = makeEvidence();
    const [item] = replacedAuthor.reviewItems as { authorIds: string[] }[];
    if (!item) throw new Error('Fixture item is missing.');
    item.authorIds = ['person-reviewer'];
    replacedAuthor.evidenceDigest = digestWithoutField(replacedAuthor, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(replacedAuthor, trustedInventory);
    }).toThrow(/REVIEW_ITEM_INVENTORY_INVALID/u);

    const duplicateItem = makeEvidence();
    const items = duplicateItem.reviewItems as Record<string, unknown>[];
    const [firstItem] = items;
    if (!firstItem) throw new Error('Fixture item is missing.');
    items.push(structuredClone(firstItem));
    duplicateItem.inventoryItemCount = 2;
    duplicateItem.reviewedItemCount = 2;
    duplicateItem.approvedItemCount = 2;
    duplicateItem.evidenceDigest = digestWithoutField(duplicateItem, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(duplicateItem, trustedInventory);
    }).toThrow(/REVIEW_ITEM_INVENTORY_INVALID/u);

    const omittedItem = makeEvidence();
    omittedItem.reviewItems = [];
    omittedItem.inventoryItemCount = 0;
    omittedItem.reviewedItemCount = 0;
    omittedItem.approvedItemCount = 0;
    omittedItem.evidenceDigest = digestWithoutField(omittedItem, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(omittedItem, trustedInventory);
    }).toThrow(/REVIEW_ITEM_INVENTORY_INVALID/u);
  });

  it('binds outcome coverage and merge checks to the trusted manifest inventory', () => {
    const replacedCoverage = makeEvidence();
    const coverage = replacedCoverage.outcomeCoverageReview as Record<string, unknown>;
    coverage.decision = 'confirmed';
    coverage.learningOutcomeIds = ['outcome-untrusted'];
    coverage.noOutcomeImpactRationale = null;
    replacedCoverage.evidenceDigest = digestWithoutField(replacedCoverage, 'evidenceDigest');
    expect(() => {
      validateHumanContentReview(replacedCoverage, trustedInventory);
    }).toThrow(/OUTCOME_COVERAGE_INVENTORY_INVALID/u);

    expect(() => {
      validateMergeReviewEvidence(makeMergeEvidence(), {
        ...trustedMergeContext,
        checks: [
          ...trustedMergeContext.checks,
          { checkId: 'check-lint', command: 'npm run lint', applicable: true },
        ],
      });
    }).toThrow(/MERGE_CHECK_INVENTORY_INVALID/u);

    const trustedWithManifestOutcome = {
      ...trustedInventory,
      workManifest: {
        ...trustedInventory.workManifest,
        learningOutcomeIds: ['outcome-one'],
        reviewUnits: [
          {
            ...trustedInventory.workManifest.reviewUnits[0],
            learningOutcomeIds: ['outcome-one'],
          },
        ],
      },
      reviewItems: [
        {
          ...trustedInventory.reviewItems[0],
          learningOutcomeIds: ['outcome-one'],
        },
      ],
    } as const;
    expect(() => {
      validateHumanContentReview(makeEvidence(), trustedWithManifestOutcome);
    }).toThrow(/REVIEW_ITEM_INVENTORY_INVALID/u);
  });
});
