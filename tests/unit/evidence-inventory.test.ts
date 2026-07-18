import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  calculateApprovableDigest,
  calculateCandidatePayloadDigest,
  calculateContentSubjectDigest,
} from '../../src/lib/validation/release-state.js';
import { calculateContentWorkManifestScopeDigest } from '../../src/lib/validation/content-work-manifest.js';
import {
  CatalogEvidenceInventoryError,
  deriveCatalogEvidenceTrustContext,
  loadCatalogEvidenceCanonicalSources,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../../src/lib/catalog/evidence-inventory.js';

const execFileAsync = promisify(execFile);
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
    const contentFiles = [{ path: 'catalog.json', sha256: sha('d'), byteLength: 123 }];
    const subjectDigest = calculateContentSubjectDigest(contentFiles);
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
      inventoryDigest: '',
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
    const manifestScope = {
      taskId: 'T024',
      requiredRequirementIds: ['FR-026'],
      learningOutcomeIds: [],
      reviewUnits: [
        {
          reviewUnitId: 'RU-T024-catalog',
          changeKind: 'documentation',
          paths: ['src/content/docs/index.md'],
          itemIds: ['human-review-item-catalog'],
          requirementIds: ['FR-026'],
          learningOutcomeIds: [],
          outcomeImpact: { kind: 'none', rationale: 'No learner outcome changes.' },
          dependencyReviewUnitIds: [],
          checkIds: [check.checkId],
          evidenceRoles: ['non_automatable_claim'],
          maintenanceBenefit: null,
          owner: 'person-author',
          status: 'complete',
        },
      ],
    };
    const workManifest: Record<string, unknown> = {
      schemaVersion: '1.0.0',
      manifestId: 'work-manifest-T024-catalog',
      ...manifestScope,
      scopeDigest: calculateContentWorkManifestScopeDigest(manifestScope),
      digest: '',
      changeKind: 'documentation',
      outcomeImpact: { kind: 'none', rationale: 'No learner outcome changes.' },
      maintenanceBenefit: null,
      state: 'complete',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T11:00:00+09:00',
    };
    workManifest.digest = digestWithoutField(workManifest, 'digest');
    const candidateFiles = [{ path: 'catalog.json', sha256: sha('e'), byteLength: 456 }];
    const releaseCandidate: Record<string, unknown> = {
      schemaVersion: '2.0.0',
      candidateId: 'release-candidate-2026.07.17-aaaaaaaaaaaa',
      releaseKind: 'initial',
      targetReleaseVersion: '2026.07.17',
      baseReleaseVersion: null,
      cutoffAt: '2026-07-17T09:00:00+09:00',
      orderedUpdateIds: ['update-foundation'],
      fixtureMode: false,
      advancedSlotRegistryDigest: sha('f'),
      workManifestDigest: workManifest.digest,
      catalogContentSnapshotDigest: subjectDigest,
      contentFiles,
      contentSubjectDigest: subjectDigest,
      preJudgmentCheckRefs: [
        {
          checkId: check.checkId,
          checkType: 'automated',
          subjectDigest,
          command: check.command,
          exitCode: 0,
          resultPath: checkPath,
          resultDigest: checkDigest,
          completedAt: check.completedAt,
        },
      ],
      humanContentReviewEvidenceRefs: [
        {
          evidenceId: review.id,
          path: reviewPath,
          digest: sha('9'),
          subjectDigest,
          reviewerExecutedCheckSetDigest: review.reviewerExecutedCheckSetDigest,
          aggregatePassed: true,
        },
      ],
      blockingFindings: [],
      candidateFiles,
      candidatePayloadDigest: calculateCandidatePayloadDigest(candidateFiles),
      approvableDigest: '',
      ownerApproval: null,
      publicationEffectiveAt: '2026-07-17T13:00:00+09:00',
      publicationWindowEndsAt: '2026-07-17T14:00:00+09:00',
      state: 'READY_TO_PUBLISH',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T12:45:00+09:00',
    };
    releaseCandidate.approvableDigest = calculateApprovableDigest(releaseCandidate as never);
    releaseCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: releaseCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
    const catalog = {
      release: {
        version: '2026.07.17',
        releaseKind: 'initial',
        cutoffAt: '2026-07-17T09:00:00+09:00',
        manifestDigest: workManifest.digest,
        contentFileInventoryDigest: subjectDigest,
        contentSnapshotDigest: subjectDigest,
        updateIds: ['update-foundation'],
        advancedSlotRegistryDigest: sha('f'),
      },
    };
    const canonicalSources = { catalog, workManifest, releaseCandidate };
    const derivedContext = deriveCatalogEvidenceTrustContext(canonicalSources);
    review.inventoryDigest = derivedContext.inventoryDigest;
    review.evidenceDigest = digestWithoutField(review, 'evidenceDigest');
    const reviewDigest = await writeJson(reviewPath, review);
    const candidateReviewRefs = releaseCandidate.humanContentReviewEvidenceRefs as {
      digest: string;
    }[];
    if (candidateReviewRefs[0]) candidateReviewRefs[0].digest = reviewDigest;
    releaseCandidate.approvableDigest = calculateApprovableDigest(releaseCandidate as never);
    releaseCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: releaseCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
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
    return {
      inventoryPath,
      inventory,
      checkPath,
      check,
      reviewPath,
      review,
      canonicalSources,
    };
  };

  it('builds trusted metadata from the result and review files', async () => {
    const fixture = await makeFixture();

    const trusted = await loadTrustedCatalogReleaseEvidenceInventory(
      fixture.inventoryPath,
      fixture.canonicalSources,
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
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        fixture.canonicalSources,
        repositoryRoot,
      ),
    ).rejects.toThrow(/EVIDENCE_FILE_NOT_FOUND/u);

    const staging = structuredClone(fixture.inventory) as {
      checks: { resultPath: string }[];
    };
    const stagingCheck = staging.checks[0];
    if (!stagingCheck) throw new Error('Fixture check is missing.');
    stagingCheck.resultPath = 'staging/check.json';
    await writeJson(fixture.inventoryPath, staging);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        fixture.canonicalSources,
        repositoryRoot,
      ),
    ).rejects.toThrow(/STAGING_PUBLICATION_BOUNDARY/u);

    const digestMismatch = structuredClone(fixture.inventory) as {
      checks: { resultDigest: string }[];
    };
    const mismatchedCheck = digestMismatch.checks[0];
    if (!mismatchedCheck) throw new Error('Fixture check is missing.');
    mismatchedCheck.resultDigest = sha('f');
    await writeJson(fixture.inventoryPath, digestMismatch);
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        fixture.canonicalSources,
        repositoryRoot,
      ),
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
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        fixture.canonicalSources,
        repositoryRoot,
      ),
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
      loadTrustedCatalogReleaseEvidenceInventory(
        refreshed.inventoryPath,
        refreshed.canonicalSources,
        repositoryRoot,
      ),
    ).rejects.toThrow(/REVIEW_INCOMPLETE/u);
  });

  it('exposes a typed loader error for invalid inventory JSON', async () => {
    const inventoryPath = 'docs/verification/invalid-inventory.json';
    await writeFile(path.join(repositoryRoot, inventoryPath), '{"unexpected":true}\n', 'utf8');

    const error = await loadTrustedCatalogReleaseEvidenceInventory(
      inventoryPath,
      (await makeFixture()).canonicalSources,
      repositoryRoot,
    ).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(CatalogEvidenceInventoryError);
    expect((error as CatalogEvidenceInventoryError).code).toBe('EVIDENCE_INVENTORY_SCHEMA_INVALID');
  });

  it('rejects an arbitrary inventory digest and a catalog bound to another manifest', async () => {
    const fixture = await makeFixture();
    const forgedReview = structuredClone(fixture.review);
    forgedReview.inventoryDigest = sha('b');
    forgedReview.evidenceDigest = digestWithoutField(forgedReview, 'evidenceDigest');
    const forgedReviewDigest = await writeJson(fixture.reviewPath, forgedReview);
    const forgedInventory = structuredClone(fixture.inventory) as {
      reviews: { digest: string }[];
    };
    if (forgedInventory.reviews[0]) forgedInventory.reviews[0].digest = forgedReviewDigest;
    await writeJson(fixture.inventoryPath, forgedInventory);
    const forgedSources = structuredClone(fixture.canonicalSources);
    const candidate = forgedSources.releaseCandidate as Record<string, unknown> & {
      humanContentReviewEvidenceRefs: { digest: string }[];
    };
    if (candidate.humanContentReviewEvidenceRefs[0]) {
      candidate.humanContentReviewEvidenceRefs[0].digest = forgedReviewDigest;
    }
    candidate.approvableDigest = calculateApprovableDigest(candidate as never);
    candidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: candidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        forgedSources,
        repositoryRoot,
      ),
    ).rejects.toThrow(/REVIEWER_CHECK_INVENTORY_INVALID/u);

    const otherManifestSources = structuredClone(fixture.canonicalSources);
    (otherManifestSources.catalog.release as Record<string, unknown>).manifestDigest = sha('0');
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        otherManifestSources,
        repositoryRoot,
      ),
    ).rejects.toThrow(/CANONICAL_RELEASE_CONTEXT_MISMATCH/u);
  });

  it('derives required checks and review items from the canonical manifest', async () => {
    const fixture = await makeFixture();
    const contextWithRequiredLint = structuredClone(fixture.canonicalSources);
    const lintManifest = contextWithRequiredLint.workManifest as Record<string, unknown> & {
      reviewUnits: { checkIds: string[] }[];
    };
    lintManifest.reviewUnits[0]?.checkIds.push('check-lint');
    lintManifest.scopeDigest = calculateContentWorkManifestScopeDigest(lintManifest as never);
    lintManifest.digest = digestWithoutField(lintManifest, 'digest');
    (contextWithRequiredLint.catalog.release as Record<string, unknown>).manifestDigest =
      lintManifest.digest;
    const lintCandidate = contextWithRequiredLint.releaseCandidate;
    lintCandidate.workManifestDigest = lintManifest.digest;
    lintCandidate.approvableDigest = calculateApprovableDigest(lintCandidate as never);
    lintCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: lintCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        contextWithRequiredLint,
        repositoryRoot,
      ),
    ).rejects.toThrow(/MANIFEST_CHECK_INVENTORY_MISMATCH/u);

    const contextWithChangedClaim = structuredClone(fixture.canonicalSources);
    const changedManifest = contextWithChangedClaim.workManifest as Record<string, unknown> & {
      reviewUnits: Record<string, unknown>[];
    };
    changedManifest.reviewUnits.push({
      reviewUnitId: 'RU-T024-added-claim',
      changeKind: 'documentation',
      paths: ['src/content/docs/added-claim.md'],
      itemIds: ['human-review-item-added-claim'],
      requirementIds: ['FR-026'],
      learningOutcomeIds: [],
      outcomeImpact: { kind: 'none', rationale: 'No learner outcome changes.' },
      dependencyReviewUnitIds: [],
      checkIds: ['check-catalog'],
      evidenceRoles: ['non_automatable_claim'],
      maintenanceBenefit: null,
      owner: 'person-author',
      status: 'complete',
    });
    changedManifest.scopeDigest = calculateContentWorkManifestScopeDigest(changedManifest as never);
    changedManifest.digest = digestWithoutField(changedManifest, 'digest');
    (contextWithChangedClaim.catalog.release as Record<string, unknown>).manifestDigest =
      changedManifest.digest;
    const changedCandidate = contextWithChangedClaim.releaseCandidate;
    changedCandidate.workManifestDigest = changedManifest.digest;
    changedCandidate.approvableDigest = calculateApprovableDigest(changedCandidate as never);
    changedCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: changedCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
    await expect(
      loadTrustedCatalogReleaseEvidenceInventory(
        fixture.inventoryPath,
        contextWithChangedClaim,
        repositoryRoot,
      ),
    ).rejects.toThrow(/REVIEWER_CHECK_INVENTORY_INVALID/u);
  });

  it('requires a version-controlled manifest from the canonical manifest root', async () => {
    const fixture = await makeFixture();
    await writeJson(
      'docs/work-manifests/catalog/manifest.json',
      fixture.canonicalSources.workManifest,
    );
    await expect(
      loadCatalogEvidenceCanonicalSources(fixture.canonicalSources.catalog, repositoryRoot),
    ).rejects.toThrow(/WORK_MANIFEST_NOT_VERSION_CONTROLLED/u);
  });

  it('requires every canonical update and rejects candidate file inventories not rebuilt from disk', async () => {
    const fixture = await makeFixture();
    const manifestPath = 'docs/work-manifests/catalog/manifest.json';
    await writeJson(manifestPath, fixture.canonicalSources.workManifest);
    await writeJson(
      'staging/release-candidates/release-candidate.json',
      fixture.canonicalSources.releaseCandidate,
    );
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['add', manifestPath], { cwd: repositoryRoot });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '-m',
        'freeze manifest',
      ],
      { cwd: repositoryRoot },
    );
    await expect(
      loadCatalogEvidenceCanonicalSources(fixture.canonicalSources.catalog, repositoryRoot),
    ).rejects.toThrow(/CANONICAL_PUBLICATION_UPDATE_MISSING/u);

    await writeJson('staging/updates/update-foundation.json', {
      schemaVersion: '2.0.0',
      updateId: 'update-foundation',
      kind: 'bootstrap',
      baseReleaseVersion: null,
      contestId: null,
      sourceSetFingerprint: sha('1'),
      advancedSlotLabels: ['E'],
      targetProblemIds: ['abc212-x45'],
      operations: [
        {
          operationId: 'operation-add-abc212-x45',
          entityType: 'problem',
          entityId: 'abc212-x45',
          action: 'add',
          path: 'src/content/problems/abc212-x45.json',
          beforeDigest: null,
          afterDigest: sha('a'),
          affectedProblemIds: ['abc212-x45'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-x45',
          slotLabel: 'E',
          resultType: 'explanation_draft',
          draftPath: 'src/content/docs/index.md',
          packetPath: null,
          templatePath: null,
          reasonCode: null,
          reason: null,
          retryCondition: null,
        },
      ],
      correctionImpactIds: [],
      validationSummary: {
        checkIds: ['check-catalog'],
        problemResults: [
          { problemId: 'abc212-x45', passed: true, findingCodes: [], remediation: null },
        ],
        blockingFindingCount: 0,
        aggregatePassed: true,
        resultDigest: sha('2'),
      },
      state: 'ELIGIBLE_FOR_BATCH',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T11:00:00+09:00',
      fixtureMode: false,
    });
    await mkdir(path.join(repositoryRoot, 'src/content/docs'), { recursive: true });
    await writeFile(path.join(repositoryRoot, 'src/content/docs/index.md'), '# Changed\n', 'utf8');
    await expect(
      loadCatalogEvidenceCanonicalSources(fixture.canonicalSources.catalog, repositoryRoot),
    ).rejects.toThrow(/RELEASE_CANDIDATE_DIGEST_MISMATCH/u);

    const content = '# Changed\n';
    const canonicalCandidate = structuredClone(fixture.canonicalSources.releaseCandidate) as Record<
      string,
      unknown
    > & {
      preJudgmentCheckRefs: { subjectDigest: string }[];
      humanContentReviewEvidenceRefs: { subjectDigest: string }[];
    };
    canonicalCandidate.contentFiles = [
      {
        path: 'src/content/docs/index.md',
        sha256: createHash('sha256').update(content).digest('hex'),
        byteLength: Buffer.byteLength(content),
      },
    ];
    const actualSubjectDigest = calculateContentSubjectDigest(
      canonicalCandidate.contentFiles as readonly unknown[],
    );
    canonicalCandidate.contentSubjectDigest = actualSubjectDigest;
    canonicalCandidate.preJudgmentCheckRefs.forEach((check) => {
      check.subjectDigest = actualSubjectDigest;
    });
    canonicalCandidate.humanContentReviewEvidenceRefs.forEach((review) => {
      review.subjectDigest = actualSubjectDigest;
    });
    canonicalCandidate.approvableDigest = calculateApprovableDigest(canonicalCandidate as never);
    canonicalCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: canonicalCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
    };
    await writeJson('staging/release-candidates/release-candidate.json', canonicalCandidate);
    const canonicalCatalog = structuredClone(fixture.canonicalSources.catalog) as {
      release: { contentFileInventoryDigest: string };
    };
    canonicalCatalog.release.contentFileInventoryDigest = actualSubjectDigest;
    await expect(
      loadCatalogEvidenceCanonicalSources(canonicalCatalog, repositoryRoot),
    ).resolves.toMatchObject({
      releaseCandidate: { contentSubjectDigest: actualSubjectDigest },
    });
  });
});
