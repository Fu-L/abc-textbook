import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { deriveCatalogEvidenceTrustContext } from '../../src/lib/catalog/evidence-inventory.js';
import {
  calculateApprovableDigest,
  calculateCandidatePayloadDigest,
  calculateContentSubjectDigest,
} from '../../src/lib/validation/release-state.js';
import { calculateContentWorkManifestScopeDigest } from '../../src/lib/validation/content-work-manifest.js';

const execFileAsync = promisify(execFile);
const sha = (character: string): string => character.repeat(64);

describe('catalog validation CLI evidence boundary', () => {
  let repositoryRoot: string;

  beforeEach(async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-cli-evidence-'));
    await mkdir(path.join(repositoryRoot, 'staging'));
  });

  afterEach(async () => {
    await rm(repositoryRoot, { recursive: true, force: true });
  });

  const writeJson = async (relativePath: string, value: unknown): Promise<string> => {
    const contents = `${JSON.stringify(value, null, 2)}\n`;
    const absolutePath = path.join(repositoryRoot, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, contents, 'utf8');
    return createHash('sha256').update(contents).digest('hex');
  };

  it('fails closed when evidence omits a check required by the canonical manifest', async () => {
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
          checkIds: ['check-catalog', 'check-lint'],
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
        {
          checkId: 'check-lint',
          checkType: 'automated',
          subjectDigest,
          command: 'npm run lint',
          exitCode: 0,
          resultPath: 'docs/verification/check-lint.json',
          resultDigest: sha('8'),
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
        contentSnapshotDigest: subjectDigest,
        updateIds: ['update-foundation'],
        advancedSlotRegistryDigest: sha('f'),
      },
    };
    review.inventoryDigest = deriveCatalogEvidenceTrustContext({
      catalog,
      workManifest,
      releaseCandidate,
    }).inventoryDigest;
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
    await writeJson(inventoryPath, {
      subjectDigest,
      checks: [
        {
          checkId: check.checkId,
          command: check.command,
          subjectDigest,
          resultPath: checkPath,
          resultDigest: checkDigest,
          exitCode: 0,
          passed: true,
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
    });
    const manifestPath = 'docs/verification/work-manifest.json';
    const candidatePath = 'staging/release-candidate.json';
    await writeJson(manifestPath, workManifest);
    await writeJson(candidatePath, releaseCandidate);
    await writeJson('catalog.json', catalog);

    const scriptPath = path.resolve('scripts/catalog-validate.ts');
    const tsxLoaderPath = path.resolve('node_modules/tsx/dist/loader.mjs');
    const error = await execFileAsync(
      process.execPath,
      [
        '--import',
        tsxLoaderPath,
        scriptPath,
        '--input',
        'catalog.json',
        '--evidence-inventory',
        inventoryPath,
        '--work-manifest',
        manifestPath,
        '--release-candidate',
        candidatePath,
      ],
      { cwd: repositoryRoot },
    ).catch((value: unknown) => value as { code: number; stderr: string });

    expect(error.stderr).toMatch(/REVIEWER_CHECK_INVENTORY_INVALID/u);
    expect(error).toMatchObject({ code: 2 });
  });
});
