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
import {
  deriveExecutableExampleInventory,
  executableExampleInventoryDigest,
} from '../../src/lib/catalog/build-catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

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

  it('fails closed for a normal weekly-update fixture when evidence omits a required check', async () => {
    const contentPath = 'src/content/docs/index.md';
    const baseContent = '# Catalog fixture base\n';
    const content = '# Catalog fixture\n';
    await mkdir(path.join(repositoryRoot, 'src/content/docs'), { recursive: true });
    await writeFile(path.join(repositoryRoot, contentPath), baseContent, 'utf8');
    const contentFiles = [
      {
        path: contentPath,
        sha256: createHash('sha256').update(content).digest('hex'),
        byteLength: Buffer.byteLength(content),
      },
    ];
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
        executedByReviewerId: 'person-author',
      },
    ];
    const reviewPath = 'docs/reviews/human-content/review-catalog.json';
    const review: Record<string, unknown> = {
      schemaVersion: '3.0.0',
      id: 'human-content-review-catalog',
      scopeType: 'release_candidate',
      scopeId: 'release-candidate-2026.07.17-aaaaaaaaaaaa',
      releaseVersion: '2026.07.17',
      subjectDigest,
      inventoryPath: 'docs/verification/review-inventory.json',
      inventoryDigest: '',
      reviewPolicy: { requiredMode: 'self', riskReasons: [] } as const,
      reviewMode: 'self',
      applicableChecks,
      applicableCheckCount: 1,
      passedApplicableCheckCount: 1,
      reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
      authors: [{ personId: 'person-author', authoredItemIds: ['human-review-item-catalog'] }],
      reviewer: { personId: 'person-author', mode: 'self' },
      reviewItems: [
        {
          reviewItemId: 'human-review-item-catalog',
          kind: 'non_automatable_claim',
          subjectPaths: ['src/content/docs/index.md'],
          authorIds: ['person-author'],
          learningOutcomeIds: [],
          reviewerId: 'person-author',
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
        reviewerId: 'person-author',
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
      reviewPolicy: { requiredMode: 'self', riskReasons: [] } as const,
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
      schemaVersion: '2.0.0',
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
      releaseKind: 'incremental',
      targetReleaseVersion: '2026.07.17',
      baseReleaseVersion: '2026.07.16',
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
          reviewMode: 'self',
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
    const catalog = makeTrustedCatalog({
      releaseKind: 'incremental',
      manifestDigest: workManifest.digest,
      contentFileInventoryDigest: subjectDigest,
      contentSnapshotDigest: subjectDigest,
      updateIds: ['update-foundation'],
    });
    const baseCatalog = structuredClone(catalog);
    const explanation = catalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;
    releaseCandidate.advancedSlotRegistryDigest = String(
      (catalog.release as Record<string, unknown>).advancedSlotRegistryDigest,
    );
    releaseCandidate.approvableDigest = calculateApprovableDigest(releaseCandidate as never);
    releaseCandidate.ownerApproval = {
      ownerId: 'owner-release',
      approvedDigest: releaseCandidate.approvableDigest,
      approvedAt: '2026-07-17T12:50:00+09:00',
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
    const executableExampleEvidencePath = 'docs/verification/executable-examples.json';
    const executableInventory = deriveExecutableExampleInventory(catalog);
    const executableExampleEvidence = {
      schemaVersion: '3.0.0' as const,
      releaseDigest: sha('a'),
      subjectDigest: catalog.release.contentSnapshotDigest,
      inventoryDigest: executableExampleInventoryDigest(catalog),
      inventoryCount: executableInventory.length,
      checkedCount: executableInventory.length,
      passedCount: executableInventory.length,
      failedCount: 0,
      aggregatePassed: true,
      items: executableInventory.map((item, index) => ({
        ...item,
        subjectDigest: catalog.release.contentSnapshotDigest,
        releaseDigest: sha('a'),
        environment: 'Node.js fixture',
        command: 'node fixture.js',
        expectedResult: '1',
        actualResult: '1',
        exitCode: 0,
        passed: true,
        executedAt: '2026-07-17T12:30:00+09:00',
        resultDigest: sha(String(index + 1)),
        evidencePath: executableExampleEvidencePath,
      })),
      generatedAt: '2026-07-17T12:31:00+09:00',
    };
    const executableExampleEvidenceDigest = await writeJson(
      executableExampleEvidencePath,
      executableExampleEvidence,
    );
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
          reviewerIds: ['person-author'],
          reviewMode: 'self',
          aggregatePassed: true,
        },
      ],
      executableExampleEvidence: {
        path: executableExampleEvidencePath,
        digest: executableExampleEvidenceDigest,
        subjectDigest: catalog.release.contentSnapshotDigest,
      },
    });
    const manifestPath = 'docs/work-manifests/catalog/manifest.json';
    const candidatePath = 'staging/release-candidates/release-candidate.json';
    await writeJson(manifestPath, workManifest);
    await writeJson(candidatePath, releaseCandidate);
    await writeJson('staging/updates/update-foundation.json', {
      schemaVersion: '2.0.0',
      updateId: 'update-foundation',
      kind: 'taxonomy',
      baseReleaseVersion: '2026.07.16',
      contestId: null,
      sourceSetFingerprint: sha('1'),
      advancedSlotLabels: [],
      targetProblemIds: ['abc212-x45'],
      operations: [
        {
          operationId: 'operation-replace-explanation',
          entityType: 'authoring_unit',
          entityId: 'abc212-x45',
          action: 'replace',
          path: contentPath,
          beforeDigest: createHash('sha256').update(baseContent).digest('hex'),
          afterDigest: createHash('sha256').update(content).digest('hex'),
          affectedEntities: [
            {
              entityType: 'authoring_unit',
              entityId: 'abc212-x45',
              action: 'replace',
            },
          ],
          affectedProblemIds: ['abc212-x45'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-x45',
          slotLabel: 'E',
          resultType: 'authoring_unit_draft',
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
    await writeJson('catalog.json', baseCatalog);
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['add', 'catalog.json', contentPath], { cwd: repositoryRoot });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '--allow-empty',
        '-m',
        'freeze base',
      ],
      { cwd: repositoryRoot },
    );
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
    const { stdout: baseCommit } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
    });
    await execFileAsync('git', ['update-ref', 'refs/remotes/origin/main', baseCommit.trim()], {
      cwd: repositoryRoot,
    });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '--allow-empty',
        '-m',
        'current release state',
      ],
      { cwd: repositoryRoot },
    );
    await writeFile(path.join(repositoryRoot, contentPath), content, 'utf8');
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
      ],
      { cwd: repositoryRoot },
    ).catch((value: unknown) => value as { code: number; stderr: string });

    expect(error.stderr).toMatch(/REVIEWER_CHECK_INVENTORY_INVALID/u);
    expect(error).toMatchObject({ code: 2 });
  });
});
