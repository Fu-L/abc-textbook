import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  CatalogEvidenceInventoryError,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../../src/lib/catalog/evidence-inventory.js';

const sha = (character: string): string => character.repeat(64);
const fileDigest = (value: string): string =>
  createHash('sha256').update(value, 'utf8').digest('hex');

describe('catalog release evidence inventory', () => {
  let repositoryRoot: string;

  beforeEach(async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-evidence-'));
    await mkdir(path.join(repositoryRoot, 'docs/verification'), { recursive: true });
    await mkdir(path.join(repositoryRoot, 'docs/reviews/human-content'), { recursive: true });
    await mkdir(path.join(repositoryRoot, 'staging'), { recursive: true });
  });

  afterEach(async () => {
    await rm(repositoryRoot, { recursive: true, force: true });
  });

  const writeJson = async (relativePath: string, value: unknown): Promise<string> => {
    const contents = `${JSON.stringify(value, null, 2)}\n`;
    const absolutePath = path.join(repositoryRoot, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, contents, 'utf8');
    return fileDigest(contents);
  };

  const makeFixture = async () => {
    const subjectDigest = sha('a');
    const checkPath = 'docs/verification/check-catalog.json';
    const check = {
      schemaVersion: '1.0.0',
      checkId: 'check-catalog',
      command: 'npm run test:contract',
      subjectDigest,
      exitCode: 0,
      passed: true,
      completedAt: '2026-07-17T12:00:00+09:00',
    };
    const checkDigest = await writeJson(checkPath, check);
    const applicableChecks = [
      {
        checkId: check.checkId,
        command: check.command,
        subjectDigest: check.subjectDigest,
        exitCode: check.exitCode,
        passed: check.passed,
        completedAt: check.completedAt,
        resultPath: checkPath,
        resultDigest: checkDigest,
        executedByReviewerId: 'person-reviewer',
      },
    ];
    const reviewPath = 'docs/reviews/human-content/review-catalog.json';
    const review: Record<string, unknown> = {
      schemaVersion: '2.0.0',
      id: 'human-content-review-catalog',
      scopeType: 'release_candidate',
      scopeId: 'release-candidate-2026.07.17-aaaaaaaaaaaa',
      releaseVersion: '2026.07.17',
      subjectDigest,
      inventoryPath: 'docs/verification/review-inventory.json',
      inventoryDigest: sha('b'),
      rawEvidenceManifestPath: 'docs/verification/review-raw-manifest.json',
      rawEvidenceManifestDigest: sha('c'),
      rawEvidenceCount: 1,
      artifactPath: reviewPath,
      applicableChecks,
      applicableCheckCount: 1,
      passedApplicableCheckCount: 1,
      reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
      authors: [{ personId: 'person-author', authoredItemIds: ['human-review-item-catalog'] }],
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
          reviewItemId: 'human-review-item-catalog',
          kind: 'non_automatable_claim',
          subjectPaths: ['src/content/docs/index.md'],
          authorIds: ['person-author'],
          learningOutcomeIds: [],
          reviewerId: 'person-reviewer',
          reviewBasis: 'Compared the claim with its source.',
          decision: 'approved',
          findings: [],
          reviewedAt: '2026-07-17T12:30:00+09:00',
        },
      ],
      inventoryItemCount: 1,
      reviewedItemCount: 1,
      approvedItemCount: 1,
      changesRequestedItemCount: 0,
      unreviewedItemCount: 0,
      outcomeCoverageReview: {
        reviewerId: 'person-reviewer',
        authorIds: ['person-author'],
        decision: 'no_outcome_impact_confirmed',
        learningOutcomeIds: [],
        subjectPaths: ['src/content/docs/index.md'],
        rationale: 'The content does not change an observable learning outcome.',
        noOutcomeImpactRationale: 'No learning outcome changes.',
        confirmedAt: '2026-07-17T12:30:00+09:00',
      },
      outcomeCoverageConfirmed: true,
      aggregatePassed: true,
      generatedAt: '2026-07-17T12:31:00+09:00',
      evidenceDigest: '',
    };
    review.evidenceDigest = digestWithoutField(review, 'evidenceDigest');
    const reviewDigest = await writeJson(reviewPath, review);
    const inventoryPath = 'docs/verification/release-evidence-inventory.json';
    const inventory = {
      subjectDigest,
      checks: [
        {
          checkId: check.checkId,
          command: check.command,
          subjectDigest,
          resultPath: checkPath,
          resultDigest: checkDigest,
          exitCode: check.exitCode,
          passed: check.passed,
          completedAt: check.completedAt,
        },
      ],
      reviews: [
        {
          evidenceId: review.id,
          path: reviewPath,
          digest: reviewDigest,
          subjectDigest,
          authorIds: ['person-author'],
          reviewerIds: ['person-reviewer'],
          aggregatePassed: true,
        },
      ],
    };
    await writeJson(inventoryPath, inventory);
    return { inventoryPath, inventory, checkPath, check, reviewPath, review };
  };

  it('builds trusted metadata from the result and review files', async () => {
    const fixture = await makeFixture();

    const trusted = await loadTrustedCatalogReleaseEvidenceInventory(
      fixture.inventoryPath,
      repositoryRoot,
    );

    expect(trusted.subjectDigest).toBe(fixture.inventory.subjectDigest);
    expect(trusted.checks[0]).toMatchObject({
      checkId: fixture.check.checkId,
      resultPath: fixture.checkPath,
      passed: true,
    });
    expect(trusted.reviews[0]).toMatchObject({
      evidenceId: fixture.review.id,
      path: fixture.reviewPath,
      authorIds: ['person-author'],
      reviewerIds: ['person-reviewer'],
      aggregatePassed: true,
    });
  });

  it('rejects missing, staging, and digest-mismatched result files', async () => {
    const fixture = await makeFixture();
    const missing = structuredClone(fixture.inventory) as {
      checks: { resultPath: string }[];
    };
    const missingCheck = missing.checks[0];
    if (!missingCheck) throw new Error('Fixture check is missing.');
    missingCheck.resultPath = 'docs/verification/missing.json';
    await writeJson(fixture.inventoryPath, missing);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(fixture.inventoryPath, repositoryRoot),
    ).rejects.toThrow(/EVIDENCE_FILE_NOT_FOUND/u);

    const staging = structuredClone(fixture.inventory) as {
      checks: { resultPath: string }[];
    };
    const stagingCheck = staging.checks[0];
    if (!stagingCheck) throw new Error('Fixture check is missing.');
    stagingCheck.resultPath = 'staging/check.json';
    await writeJson(fixture.inventoryPath, staging);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(fixture.inventoryPath, repositoryRoot),
    ).rejects.toThrow(/STAGING_PUBLICATION_BOUNDARY/u);

    const digestMismatch = structuredClone(fixture.inventory) as {
      checks: { resultDigest: string }[];
    };
    const mismatchedCheck = digestMismatch.checks[0];
    if (!mismatchedCheck) throw new Error('Fixture check is missing.');
    mismatchedCheck.resultDigest = sha('f');
    await writeJson(fixture.inventoryPath, digestMismatch);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(fixture.inventoryPath, repositoryRoot),
    ).rejects.toThrow(/EVIDENCE_RESULT_DIGEST_MISMATCH/u);
  });

  it('rejects schema-invalid results and incomplete reviews', async () => {
    const fixture = await makeFixture();
    const invalidResultDigest = await writeJson(fixture.checkPath, {
      schemaVersion: '1.0.0',
      checkId: fixture.check.checkId,
    });
    const invalidInventory = structuredClone(fixture.inventory) as {
      checks: { resultDigest: string }[];
    };
    const invalidCheck = invalidInventory.checks[0];
    if (!invalidCheck) throw new Error('Fixture check is missing.');
    invalidCheck.resultDigest = invalidResultDigest;
    await writeJson(fixture.inventoryPath, invalidInventory);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(fixture.inventoryPath, repositoryRoot),
    ).rejects.toThrow(/EVIDENCE_RESULT_SCHEMA_INVALID/u);

    const refreshed = await makeFixture();
    const incompleteReview = structuredClone(refreshed.review);
    incompleteReview.aggregatePassed = false;
    incompleteReview.evidenceDigest = digestWithoutField(incompleteReview, 'evidenceDigest');
    const incompleteReviewDigest = await writeJson(refreshed.reviewPath, incompleteReview);
    const incompleteInventory = structuredClone(refreshed.inventory) as {
      reviews: { digest: string; aggregatePassed: boolean }[];
    };
    const incompleteReviewReference = incompleteInventory.reviews[0];
    if (!incompleteReviewReference) throw new Error('Fixture review is missing.');
    incompleteReviewReference.digest = incompleteReviewDigest;
    incompleteReviewReference.aggregatePassed = false;
    await writeJson(refreshed.inventoryPath, incompleteInventory);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(refreshed.inventoryPath, repositoryRoot),
    ).rejects.toThrow(/HUMAN_REVIEW_INCOMPLETE/u);
  });

  it('exposes a typed loader error for invalid inventory JSON', async () => {
    const inventoryPath = 'docs/verification/invalid-inventory.json';
    await writeFile(path.join(repositoryRoot, inventoryPath), '{"unexpected":true}\n', 'utf8');

    const error = await loadTrustedCatalogReleaseEvidenceInventory(
      inventoryPath,
      repositoryRoot,
    ).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(CatalogEvidenceInventoryError);
    expect((error as CatalogEvidenceInventoryError).code).toBe('EVIDENCE_INVENTORY_SCHEMA_INVALID');
  });
});
