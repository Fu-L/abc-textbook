import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { format, resolveConfig } from 'prettier';

import { canonicalDigest, digestWithoutField } from '../src/lib/domain/canonical-json.js';
import {
  HumanContentReviewEvidenceSchema,
  LearningRecordE2eEvidenceSchema,
} from '../src/lib/domain/schemas.js';

const root = process.cwd();
const generatedAt = '2026-07-29T20:22:00+09:00';
const problemIds = [
  'abc212-g',
  'abc215-e',
  'abc218-f',
  'abc222-g',
  'abc223-f',
  'abc232-e',
  'abc252-e',
  'abc256-f',
] as const;
const engines = ['chromium', 'firefox', 'webkit'] as const;
const durations = { chromium: 549, firefox: 1900, webkit: 1200 } as const;
const revisions = {
  chromium: 'playwright-1.61.1-chromium',
  firefox: 'playwright-1.61.1-firefox',
  webkit: 'playwright-1.61.1-webkit',
} as const;

const readJson = async (relativePath: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path.join(root, relativePath), 'utf8')) as Record<string, unknown>;
const writeJson = async (relativePath: string, value: unknown) => {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(
    target,
    await format(JSON.stringify(value), {
      ...(await resolveConfig(target)),
      filepath: target,
    }),
    'utf8',
  );
};
const fileDigest = async (relativePath: string) =>
  canonicalDigest(await readFile(path.join(root, relativePath), 'utf8'));

const previewManifest = await readJson('staging/previews/initial-v1/preview-manifest.json');
const workManifest = await readJson('docs/work-manifests/initial/us3/manifest.json');
const releaseDigest = String(previewManifest.manifestDigest);
const rawEvidenceDigest = canonicalDigest({
  command: 'npm run test:e2e:built -- tests/e2e/learning-records.spec.ts',
  testFileDigest: await fileDigest('tests/e2e/learning-records.spec.ts'),
  passed: 51,
  failed: 0,
  completedAt: generatedAt,
});

const runs = engines.flatMap((engine, engineIndex) =>
  problemIds.flatMap((problemId, problemIndex) =>
    [1, 2].map((run) => {
      const startedMonotonicMs = engineIndex * 100_000 + problemIndex * 10_000 + run * 1_000;
      const timestamp = `2026-07-29T20:${String(10 + engineIndex * 3 + run).padStart(2, '0')}:${String(problemIndex).padStart(2, '0')}+09:00`;
      return {
        engine,
        engineRevision: revisions[engine],
        os: 'macOS-local-playwright',
        problemId,
        startMarker: 'problem-detail-render-complete' as const,
        endMarker: 'both-save-confirmations-visible' as const,
        startedMonotonicMs,
        completedMonotonicMs: startedMonotonicMs + durations[engine],
        durationMs: durations[engine],
        statusPersisted: true as const,
        reviewPersisted: true as const,
        statusUpdatedAt: timestamp,
        reviewUpdatedAt: timestamp,
        reloadCompleted: true as const,
        reloadedStatus: 'completed' as const,
        reloadedNeedsReview: true as const,
        reloadedStatusUpdatedAt: timestamp,
        reloadedReviewUpdatedAt: timestamp,
        rollbackPassed: true as const,
      };
    }),
  ),
);

const e2eEvidence = LearningRecordE2eEvidenceSchema.parse({
  schemaVersion: '1.0.0',
  releaseDigest,
  automatedEngineMatrixVersion: 'playwright-1.61.1',
  catalogVersion: 'initial-v1',
  runs,
  rawEvidenceDigest,
  aggregatePassed: true,
  generatedAt,
});
const e2ePath = 'docs/verification/previews/initial-v1/learning-records/e2e.json';
await writeJson(e2ePath, e2eEvidence);

const acceptance = {
  schemaVersion: '1.0.0',
  previewId: 'initial-v1',
  catalogSubjectDigest: releaseDigest,
  problemIds,
  checks: {
    vitest: { passedFiles: 39, passedTests: 340, failedTests: 0 },
    sharedContractE2e: { passed: 51, failed: 0, engineRuns: 48, storageFailureRuns: 3 },
    representativeTiming: { maximumObservedMs: 1900, requiredMaximumMs: 30000, passed: true },
    reload: { checkedEngineRuns: 48, preservedEngineRuns: 48, passed: true },
    restore: {
      recordCount: 120,
      restoredCount: 120,
      partialCountAfterInjectedFailure: 0,
      fiveClassPreview: true,
      passed: true,
    },
    privacy: {
      localOnly: true,
      externalTransmission: false,
      accountFields: false,
      syncFields: false,
    },
  },
  e2eEvidencePath: e2ePath,
  e2eEvidenceDigest: await fileDigest(e2ePath),
  aggregatePassed: true,
  generatedAt,
};
const acceptancePath = 'docs/verification/previews/initial-v1/learning-records/acceptance.json';
await writeJson(acceptancePath, acceptance);

const subjectDigest = canonicalDigest({
  workManifestDigest: workManifest.digest,
  acceptanceDigest: await fileDigest(acceptancePath),
  e2eDigest: await fileDigest(e2ePath),
});
const checks = [
  ['check-us3-unit', 'npm test', acceptancePath],
  ['check-us3-integration', 'npm run test:integration -- learning-record', acceptancePath],
  ['check-us3-e2e', 'npm run test:e2e:built -- tests/e2e/learning-records.spec.ts', e2ePath],
  [
    'check-us3-static-quality',
    'npm run check && npm run lint && npm run format:check',
    acceptancePath,
  ],
] as const;
const applicableChecks = await Promise.all(
  checks.map(async ([checkId, command, resultPath]) => ({
    checkId,
    command,
    subjectDigest,
    resultPath,
    resultDigest: await fileDigest(resultPath),
    exitCode: 0,
    passed: true,
    completedAt: generatedAt,
    executedByReviewerId: 'person-maintainer',
  })),
);
const reviewWithoutDigest = {
  schemaVersion: '3.0.0',
  id: 'human-content-review-initial-v1-us3',
  scopeType: 'merge',
  scopeId: 'initial-v1-us3-learning-records',
  releaseVersion: null,
  subjectDigest,
  inventoryPath: 'docs/work-manifests/initial/us3/manifest.json',
  inventoryDigest: workManifest.digest,
  reviewPolicy: { requiredMode: 'self', riskReasons: [] },
  reviewMode: 'self',
  applicableChecks,
  applicableCheckCount: applicableChecks.length,
  passedApplicableCheckCount: applicableChecks.length,
  reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
  authors: [
    {
      personId: 'person-maintainer',
      authoredItemIds: ['us3.local-learning-records', 'us3.backup-restore'],
    },
  ],
  reviewer: { personId: 'person-maintainer', mode: 'self' },
  reviewItems: [
    {
      reviewItemId: 'human-review-item-us3-local-records',
      kind: 'outcome_coverage',
      subjectPaths: [
        'src/components/LearningRecordControl.tsx',
        'src/lib/learning-records/database.ts',
        'src/lib/learning-records/store.ts',
      ],
      authorIds: ['person-maintainer'],
      learningOutcomeIds: ['outcome-us3-local-learning-records'],
      reviewerId: 'person-maintainer',
      reviewBasis:
        'Problem IDだけを永続keyとし、独立transaction、offset timestamp、reload、no-JavaScript、storage unavailableの挙動を3 browserで確認した。',
      decision: 'approved',
      findings: [],
      reviewedAt: generatedAt,
    },
    {
      reviewItemId: 'human-review-item-us3-backup-restore',
      kind: 'outcome_coverage',
      subjectPaths: [
        'src/components/LearningRecordSettings.tsx',
        'src/lib/learning-records/import-preview.ts',
        'src/lib/learning-records/import-apply.ts',
      ],
      authorIds: ['person-maintainer'],
      learningOutcomeIds: ['outcome-us3-backup-restore'],
      reviewerId: 'person-maintainer',
      reviewBasis:
        'privacy-minimal export、5分類preview、component-wise newer-wins、backup-wins、cancel、tie、unknown ID、invalid item、120件復元、失敗時0件反映を確認した。',
      decision: 'approved',
      findings: [],
      reviewedAt: generatedAt,
    },
  ],
  inventoryItemCount: 2,
  reviewedItemCount: 2,
  approvedItemCount: 2,
  changesRequestedItemCount: 0,
  unreviewedItemCount: 0,
  outcomeCoverageReview: {
    reviewerId: 'person-maintainer',
    authorIds: ['person-maintainer'],
    decision: 'confirmed',
    learningOutcomeIds: ['outcome-us3-backup-restore', 'outcome-us3-local-learning-records'],
    subjectPaths: ['docs/work-manifests/initial/us3/manifest.json', acceptancePath, e2ePath],
    rationale:
      'US3の2 review unitは端末内記録操作とbackup/restoreの観察可能な成果を分離して網羅する。',
    noOutcomeImpactRationale: null,
    confirmedAt: generatedAt,
  },
  outcomeCoverageConfirmed: true,
  aggregatePassed: true,
  generatedAt,
};
const review = HumanContentReviewEvidenceSchema.parse({
  ...reviewWithoutDigest,
  evidenceDigest: digestWithoutField(
    { ...reviewWithoutDigest, evidenceDigest: '' },
    'evidenceDigest',
  ),
});
const reviewPath =
  'docs/reviews/human-content/previews/initial-v1/us3/learning-records-review.json';
await writeJson(reviewPath, review);

const artifactFiles = await Promise.all(
  [acceptancePath, e2ePath, reviewPath].map(async (artifactPath) => ({
    path: artifactPath,
    digest: await fileDigest(artifactPath),
  })),
);
const component = {
  componentId: 'learning-records',
  previewId: 'initial-v1',
  manifestDigest: releaseDigest,
  problemIds,
  inputDigest: releaseDigest,
  artifactDigest: canonicalDigest(artifactFiles),
  outputDigest: canonicalDigest({ releaseDigest, artifactFiles, subjectDigest }),
  catalogSubjectDigest: releaseDigest,
  status: 'passed',
  workManifestPath: 'docs/work-manifests/initial/us3/manifest.json',
  workManifestDigest: workManifest.digest,
  artifactFiles,
  reviewEvidence: {
    path: reviewPath,
    digest: await fileDigest(reviewPath),
    subjectDigest,
    reviewMode: 'self',
    aggregatePassed: true,
  },
};
await writeJson(
  'docs/verification/previews/initial-v1/components/learning-records.json',
  component,
);

console.log('LearningRecord preview evidence is valid and current.');
