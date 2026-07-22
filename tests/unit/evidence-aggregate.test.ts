import { describe, expect, it } from 'vitest';

import {
  LearningRecordBackupSchema,
  LearningRecordImportPreviewSchema,
} from '../../src/lib/domain/schema-parts/learning.js';
import {
  ClientBundleEvidenceSchema,
  InstructionQualityEvidenceSchema,
} from '../../src/lib/domain/schema-parts/verification-evidence.js';
import { validateInstructionQualityEvidence } from '../../src/lib/validation/instruction-quality.js';

const sha = (character: string): string => character.repeat(64);
const at = '2026-07-17T12:00:00+09:00';

describe('fail-closed evidence aggregates', () => {
  it('rejects duplicate/overlapping backup records and stale restore previews', () => {
    const record = {
      problemId: 'abc212-e',
      status: 'unstarted',
      statusUpdatedAt: null,
      needsReview: false,
      needsReviewUpdatedAt: null,
    } as const;
    expect(
      LearningRecordBackupSchema.safeParse({
        schemaVersion: '1.0.0',
        exportedAt: at,
        catalogVersionAtExport: '2026.07.17',
        records: [record, { ...record, status: 'completed' }],
        orphanedProblemIds: [],
      }).success,
    ).toBe(false);
    expect(
      LearningRecordBackupSchema.safeParse({
        schemaVersion: '1.0.0',
        exportedAt: at,
        catalogVersionAtExport: '2026.07.17',
        records: [record],
        orphanedProblemIds: ['abc212-e'],
      }).success,
    ).toBe(false);
    expect(
      LearningRecordImportPreviewSchema.safeParse({
        schemaVersion: '1.0.0',
        items: [{ problemId: 'abc212-e', classification: 'invalid_item', reason: 'invalid' }],
        counts: { new: 0, updated: 0, same: 0, unknown_problem_id: 0, invalid_item: 0 },
        applicable: true,
      }).success,
    ).toBe(false);
  });

  it('recomputes client bundle violations and success', () => {
    const evidence = {
      schemaVersion: '1.0.0',
      releaseDigest: sha('a'),
      toolVersion: '1.0.0',
      buildManifestVersion: '1.0.0',
      buildManifestDigest: sha('b'),
      rawArtifactPath: 'docs/verification/bundle.json',
      rawArtifactDigest: sha('c'),
      checkedDecisionCount: 1,
      violationCount: 0,
      routeChunkDecisions: [
        {
          route: '/admin/',
          chunkPath: 'dist/admin.js',
          chunkDigest: sha('d'),
          containsLearningRecordBundle: true,
          allowed: false,
          decisionRule: 'forbidden_route_delivery',
          rationale: 'Learning records are forbidden on this route.',
        },
      ],
      aggregatePassed: true,
      generatedAt: at,
    };
    expect(ClientBundleEvidenceSchema.safeParse(evidence).success).toBe(false);
  });

  it('rejects stale instruction inventory and unresolved quality gates', () => {
    const evidence = {
      schemaVersion: '2.0.0',
      releaseDigest: sha('a'),
      inventoryDigest: sha('b'),
      inventoryCount: 1,
      checkedCount: 1,
      items: [
        {
          itemId: 'item-one',
          category: 'textbook',
          path: 'src/content/docs/one.md',
          contentDigest: sha('c'),
          learningOutcomeIds: ['outcome-one'],
          automatedPassed: false,
          requiresHumanReview: false,
          humanReviewItemId: null,
        },
      ],
      automatedResultDigest: sha('d'),
      humanReviewEvidenceIds: [],
      blockingFindingCount: 0,
      aggregatePassed: true,
      generatedAt: at,
    };
    expect(InstructionQualityEvidenceSchema.safeParse(evidence).success).toBe(false);
  });

  it('binds instruction quality evidence to a trusted non-empty inventory', () => {
    const trustedInventory = {
      releaseDigest: sha('a'),
      inventoryDigest: sha('b'),
      items: [
        {
          itemId: 'item-one',
          category: 'textbook' as const,
          path: 'src/content/docs/one.md',
          contentDigest: sha('c'),
          learningOutcomeIds: ['outcome-one'],
          requiresHumanReview: true,
          humanReviewItemId: 'human-review-item-one',
        },
      ],
      humanReviewEvidence: [
        {
          evidenceId: 'human-content-review-one',
          reviewItemIds: ['human-review-item-one'],
          aggregatePassed: true as const,
        },
      ],
    };
    const evidence = {
      schemaVersion: '2.0.0',
      releaseDigest: sha('a'),
      inventoryDigest: sha('b'),
      inventoryCount: 1,
      checkedCount: 1,
      items: [
        {
          itemId: 'item-one',
          category: 'textbook',
          path: 'src/content/docs/one.md',
          contentDigest: sha('c'),
          learningOutcomeIds: ['outcome-one'],
          automatedPassed: true,
          requiresHumanReview: true,
          humanReviewItemId: 'human-review-item-one',
        },
      ],
      automatedResultDigest: sha('d'),
      humanReviewEvidenceIds: ['human-content-review-one'],
      blockingFindingCount: 0,
      aggregatePassed: true,
      generatedAt: at,
    };
    expect(() => {
      validateInstructionQualityEvidence(evidence, trustedInventory);
    }).not.toThrow();

    const emptySelfDeclared = { ...evidence, inventoryCount: 0, checkedCount: 0, items: [] };
    expect(InstructionQualityEvidenceSchema.safeParse(emptySelfDeclared).success).toBe(false);
    expect(() => {
      validateInstructionQualityEvidence(emptySelfDeclared, trustedInventory);
    }).toThrow(/INSTRUCTION_QUALITY_SCHEMA_INVALID/u);
  });
});
