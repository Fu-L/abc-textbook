import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';

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

  it('fails closed when evidence omits a check required by the trusted context', async () => {
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
    const contextPath = 'docs/verification/trusted-review-context.json';
    await writeJson(contextPath, {
      subjectDigest,
      inventoryDigest: sha('b'),
      workManifest: {
        learningOutcomeIds: [],
        reviewUnits: [
          {
            reviewUnitId: 'RU-T024-catalog',
            subjectPaths: ['src/content/docs/index.md'],
            learningOutcomeIds: [],
            owner: 'person-author',
          },
        ],
      },
      applicableChecks: [
        { checkId: check.checkId, command: check.command },
        { checkId: 'check-lint', command: 'npm run lint' },
      ],
      reviewItems: [
        {
          reviewItemId: 'human-review-item-catalog',
          reviewUnitId: 'RU-T024-catalog',
          kind: 'non_automatable_claim',
          subjectPaths: ['src/content/docs/index.md'],
          authorIds: ['person-author'],
          learningOutcomeIds: [],
        },
      ],
    });
    await writeJson('catalog.json', {});

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
        '--trusted-review-context',
        contextPath,
      ],
      { cwd: repositoryRoot },
    ).catch((value: unknown) => value as { code: number; stderr: string });

    expect(error.stderr).toMatch(/REVIEWER_CHECK_INVENTORY_INVALID/u);
    expect(error).toMatchObject({ code: 2 });
  });
});
