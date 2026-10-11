import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  CanonicalProblemPlacementPolicySchema,
  LearningOutcomeSchema,
  ProblemAnalysisRecordSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  validatePlacementAnalysisCoverage,
  validatePlacementOutcomeRoles,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';

const readJson = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(file, 'utf8')) as unknown;
const policy = CanonicalProblemPlacementPolicySchema.parse(
  await readJson('src/content/policies/problem-placements.json'),
);
const original = policy.placements.find((p) => p.problemId === 'abc212-e');
if (!original) throw new Error('Missing placement fixture');
const analysis = ProblemAnalysisRecordSchema.parse(
  await readJson('src/content/technique-inventory/shard-04/abc212-e.json'),
);
const outcomes = new Map(
  await Promise.all(
    [
      'outcome-subtract-exception-transitions',
      'outcome-compute-convolution-or-correlation',
      'outcome-compute-in-modular-arithmetic',
    ].map(
      async (id) =>
        [
          id,
          LearningOutcomeSchema.parse(await readJson(`src/content/learning-outcomes/${id}.json`)),
        ] as const,
    ),
  ),
);
type Placement = typeof original;

const disposition = (placement: Placement, claimPath = '/typicalTechniques/0') => {
  const claim = placement.claimDispositions.find((d) => d.claimRef.claimPath === claimPath);
  if (!claim) throw new Error(`Missing disposition fixture: ${claimPath}`);
  return claim;
};

const supportingPlacement = (): Placement => {
  const placement = structuredClone(original);
  placement.supportingTagIds = ['tag-modular-arithmetic'];
  placement.supportingOutcomeIds = ['outcome-compute-in-modular-arithmetic'];
  const claim = placement.claimDispositions.find(
    (d) => d.claimRef.claimPath === '/prerequisiteCandidates/1',
  );
  if (!claim) throw new Error('Missing prerequisite fixture');
  claim.kind = 'supporting';
  claim.tagIds = ['tag-modular-arithmetic'];
  return placement;
};

describe('shared placement content validation', () => {
  it('accepts complete analysis and aligned roles, including a supporting prerequisite', () => {
    for (const placement of [original, supportingPlacement()]) {
      expect(validatePlacementAnalysisCoverage(placement, analysis)).toEqual([]);
      expect(validatePlacementOutcomeRoles(placement, outcomes)).toEqual([]);
    }
  });

  it.each<[string, (p: Placement) => void]>([
    [
      'primary Outcome outside the primary Tag',
      (p) => {
        p.primaryOutcomeId = 'outcome-compute-convolution-or-correlation';
      },
    ],
    [
      'additional primary Outcome outside the primary Tags',
      (p) => {
        p.additionalPrimaryOutcomeIds.push('outcome-compute-convolution-or-correlation');
      },
    ],
    [
      'primary Tag without a primary Outcome',
      (p) => {
        p.primaryTagIds.push('tag-convolution');
      },
    ],
    [
      'supporting Outcome without a supporting Tag',
      (p) => {
        p.supportingTagIds = [];
      },
    ],
    [
      'supporting Tag without a supporting Outcome',
      (p) => {
        p.supportingOutcomeIds = [];
      },
    ],
  ])('rejects %s', (_, mutate) => {
    const placement = supportingPlacement();
    mutate(placement);
    expect(validatePlacementOutcomeRoles(placement, outcomes)).toEqual([
      expect.objectContaining({ code: 'PLACEMENT_OUTCOME_ROLE_MISMATCH' }),
    ]);
  });

  it.each<[string, string, (p: Placement) => void]>([
    [
      'a missing rolling-DP decision',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE',
      (p) => {
        p.claimDispositions = p.claimDispositions.filter(
          (d) => d.claimRef.claimPath !== '/typicalTechniques/1',
        );
      },
    ],
    [
      'a missing prerequisite decision',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE',
      (p) => {
        p.claimDispositions = p.claimDispositions.filter(
          (d) => d.claimRef.claimPath !== '/prerequisiteCandidates/0',
        );
      },
    ],
    [
      'an extra non-implementation decision',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE',
      (p) => {
        const claim = structuredClone(disposition(p));
        claim.claimRef.claimPath = '/outcomeCandidates/0';
        p.claimDispositions.push(claim);
      },
    ],
    [
      'a duplicate decision',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_CONFLICT',
      (p) => {
        p.claimDispositions.push(structuredClone(disposition(p)));
      },
    ],
    [
      'a baseline and Tag-bearing role for the same claim',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_CONFLICT',
      (p) => {
        const claim = structuredClone(disposition(p));
        claim.kind = 'baseline';
        claim.tagIds = [];
        p.claimDispositions.push(claim);
      },
    ],
    [
      'a supporting decision on a primary Tag',
      'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INVALID',
      (p) => {
        disposition(p).kind = 'supporting';
      },
    ],
    [
      'a missing primary Tag decision',
      'PLACEMENT_PRIMARY_TAG_DISPOSITION_MISSING',
      (p) => {
        disposition(p).kind = 'same_tag';
      },
    ],
    [
      'a missing supporting Tag decision',
      'PLACEMENT_SUPPORTING_TAG_DISPOSITION_MISSING',
      (p) => {
        const claim = disposition(p, '/prerequisiteCandidates/1');
        claim.kind = 'baseline';
        claim.tagIds = [];
      },
    ],
    [
      'a missing evidence reference',
      'PLACEMENT_INVENTORY_CLAIM_EVIDENCE_INCOMPLETE',
      (p) => {
        p.analysisEvidenceRefs = p.analysisEvidenceRefs.filter(
          (r) => r.claimPath !== '/prerequisiteCandidates/0',
        );
      },
    ],
    [
      'a lost problem-specific insight',
      'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE',
      (p) => {
        p.adHocElements = [];
      },
    ],
  ])('rejects %s', (_, code, mutate) => {
    const placement = supportingPlacement();
    mutate(placement);
    expect(validatePlacementAnalysisCoverage(placement, analysis)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code })]),
    );
  });
});
