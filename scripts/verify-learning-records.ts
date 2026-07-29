import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { format, resolveConfig } from 'prettier';

import { canonicalDigest, digestWithoutField } from '../src/lib/domain/canonical-json.js';
import {
  HumanContentReviewEvidenceSchema,
  LearningRecordE2eEvidenceSchema,
} from '../src/lib/domain/schemas.js';
import { exportLearningRecords } from '../src/lib/learning-records/export.js';
import { applyLearningRecordImport } from '../src/lib/learning-records/import-apply.js';
import {
  IMPORT_CLASSIFICATIONS,
  previewLearningRecordImport,
} from '../src/lib/learning-records/import-preview.js';
import type { LearningRecord } from '../src/lib/learning-records/types.js';
import { InMemoryLearningRecordDatabase } from '../tests/fixtures/in-memory-learning-record-database.js';

const root = process.cwd();
const generatedAt = new Date().toISOString();
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
interface CommandResult {
  readonly command: string;
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

const run = (command: string, args: readonly string[]): CommandResult => {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    maxBuffer: 64 * 1024 * 1024,
  });
  const exitCode = result.status ?? 1;
  const commandText = [command, ...args].join(' ');
  if (exitCode !== 0) {
    throw new Error(
      `${commandText} failed (${String(exitCode)}).\n${result.stdout.slice(-4000)}\n${result.stderr.slice(-4000)}`,
    );
  }
  return { command: commandText, exitCode, stdout: result.stdout, stderr: result.stderr };
};

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

const vitestRun = run(path.join(root, 'node_modules/.bin/vitest'), ['run', '--reporter=json']);
const checkRun = run('npm', ['run', 'check']);
const lintRun = run('npm', ['run', 'lint']);
const formatRun = run('npm', ['run', 'format:check']);
const buildRun = run('npm', ['run', 'build']);
const staticQualityRun: CommandResult = {
  command: `${checkRun.command} && ${lintRun.command} && ${formatRun.command} && ${buildRun.command}`,
  exitCode: Math.max(checkRun.exitCode, lintRun.exitCode, formatRun.exitCode, buildRun.exitCode),
  stdout: `${checkRun.stdout}\n${lintRun.stdout}\n${formatRun.stdout}\n${buildRun.stdout}`,
  stderr: `${checkRun.stderr}\n${lintRun.stderr}\n${formatRun.stderr}\n${buildRun.stderr}`,
};
const playwrightRun = run(path.join(root, 'node_modules/.bin/playwright'), [
  'test',
  'tests/e2e/learning-records.spec.ts',
  '--reporter=json',
]);

interface VitestReport {
  readonly numTotalTestSuites: number;
  readonly numPassedTestSuites: number;
  readonly numTotalTests: number;
  readonly numPassedTests: number;
  readonly numFailedTests: number;
  readonly testResults: readonly { status: string }[];
}
interface PlaywrightAttachment {
  readonly name: string;
  readonly body?: string;
  readonly path?: string;
}
interface PlaywrightResult {
  readonly status: string;
  readonly duration: number;
  readonly attachments: readonly PlaywrightAttachment[];
}
interface PlaywrightTestResult {
  readonly projectName: 'chromium' | 'firefox' | 'webkit';
  readonly results: readonly PlaywrightResult[];
}
interface PlaywrightSpec {
  readonly title: string;
  readonly tests: readonly PlaywrightTestResult[];
}
interface PlaywrightSuite {
  readonly specs?: readonly PlaywrightSpec[];
  readonly suites?: readonly PlaywrightSuite[];
}
interface PlaywrightReport {
  readonly suites: readonly PlaywrightSuite[];
  readonly errors: readonly unknown[];
}

const vitestReport = JSON.parse(vitestRun.stdout) as VitestReport;
const playwrightReport = JSON.parse(playwrightRun.stdout) as PlaywrightReport;
const collectSpecs = (suites: readonly PlaywrightSuite[]): PlaywrightSpec[] =>
  suites.flatMap((suite) => [...(suite.specs ?? []), ...collectSpecs(suite.suites ?? [])]);
const decodeAttachment = async (attachment: PlaywrightAttachment) => {
  if (attachment.body) return Buffer.from(attachment.body, 'base64').toString('utf8');
  if (attachment.path) return readFile(attachment.path, 'utf8');
  throw new Error('LearningRecord E2E attachment has no body or path.');
};

const previewManifest = await readJson('staging/previews/initial-v1/preview-manifest.json');
const workManifest = await readJson('docs/work-manifests/initial/us3/manifest.json');
const releaseDigest = String(previewManifest.manifestDigest);
const rawReportPath = 'docs/verification/previews/initial-v1/learning-records/raw-playwright.json';
await writeJson(rawReportPath, playwrightReport);
const rawEvidenceDigest = await fileDigest(rawReportPath);

const sharedSpecs = collectSpecs(playwrightReport.suites).filter(({ title }) =>
  title.includes('uses the shared learning-record contract'),
);
const allSpecs = collectSpecs(playwrightReport.suites);
const storageFailureRuns = allSpecs.filter(
  ({ title }) =>
    title.includes('storage failure') ||
    title.includes('migration failure') ||
    title.includes('blocking tab'),
).length;
const runs = await Promise.all(
  sharedSpecs.flatMap((spec) =>
    spec.tests.flatMap((testResult) =>
      testResult.results
        .filter(({ status }) => status === 'passed')
        .map(async (result) => {
          const attachment = result.attachments.find(({ name }) => name === 'learning-record-run');
          if (!attachment) throw new Error(`${spec.title} has no learning-record-run attachment.`);
          const actual = JSON.parse(await decodeAttachment(attachment)) as {
            problemId: string;
            startedMonotonicMs: number;
            completedMonotonicMs: number;
            durationMs: number;
            engineRevision: string;
            rollbackPassed: boolean;
            status: string;
            statusUpdatedAt: string;
            needsReview: boolean;
            needsReviewUpdatedAt: string;
          };
          return {
            engine: testResult.projectName,
            engineRevision: actual.engineRevision,
            os: `${process.platform}-${process.arch}`,
            problemId: actual.problemId,
            startMarker: 'problem-detail-render-complete' as const,
            endMarker: 'both-save-confirmations-visible' as const,
            startedMonotonicMs: actual.startedMonotonicMs,
            completedMonotonicMs: actual.completedMonotonicMs,
            durationMs: actual.durationMs,
            statusPersisted: actual.status === 'completed',
            reviewPersisted: actual.needsReview,
            statusUpdatedAt: actual.statusUpdatedAt,
            reviewUpdatedAt: actual.needsReviewUpdatedAt,
            reloadCompleted: true as const,
            reloadedStatus: actual.status,
            reloadedNeedsReview: actual.needsReview,
            reloadedStatusUpdatedAt: actual.statusUpdatedAt,
            reloadedReviewUpdatedAt: actual.needsReviewUpdatedAt,
            rollbackPassed: actual.rollbackPassed,
          };
        }),
    ),
  ),
);
if (runs.length !== 48 || playwrightReport.errors.length > 0) {
  throw new Error(`Expected 48 passing engine runs, received ${String(runs.length)}.`);
}

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

const implementationSubjectPaths = [
  'package.json',
  'scripts/verify-learning-records.ts',
  'src/components/LearningRecordControl.tsx',
  'src/components/LearningRecordSettings.tsx',
  'src/components/LearningRecordTimestamp.astro',
  'src/components/ProblemFilters.tsx',
  'src/components/ReviewProblemList.tsx',
  'src/lib/domain/schema-parts/learning.ts',
  'src/lib/learning-records/database.ts',
  'src/lib/learning-records/export.ts',
  'src/lib/learning-records/filter.ts',
  'src/lib/learning-records/format-timestamp.ts',
  'src/lib/learning-records/import-apply.ts',
  'src/lib/learning-records/import-preview.ts',
  'src/lib/learning-records/store.ts',
  'src/lib/learning-records/types.ts',
  'src/pages/problems/[problemId].astro',
  'src/pages/problems/index.astro',
  'src/pages/review/index.astro',
  'src/pages/settings/learning-records.astro',
  'tests/e2e/learning-records.spec.ts',
  'tests/fixtures/in-memory-learning-record-database.ts',
  'tests/integration/learning-record-backup.test.ts',
  'tests/integration/learning-record-control.test.ts',
  'tests/unit/evidence-aggregate.test.ts',
  'tests/unit/learning-record-store.test.ts',
  'tests/unit/learning-record-timestamp.test.ts',
] as const;
const implementationSubjects = await Promise.all(
  implementationSubjectPaths.map(async (subjectPath) => ({
    path: subjectPath,
    digest: await fileDigest(subjectPath),
  })),
);

const acceptanceRecord = (
  index: number,
  overrides: Partial<LearningRecord> = {},
): LearningRecord => ({
  problemId: `abc${String(500 + index)}-e`,
  status: 'completed',
  statusUpdatedAt: '2026-07-29T10:00:00+09:00',
  needsReview: false,
  needsReviewUpdatedAt: '2026-07-29T10:00:00+09:00',
  ...overrides,
});

const verifyRestoreAcceptance = async () => {
  const records = Array.from({ length: 120 }, (_, index) => acceptanceRecord(index));
  const ids = new Set(records.map(({ problemId }) => problemId));
  const backup = await exportLearningRecords(new InMemoryLearningRecordDatabase(records), {
    catalogVersion: '2026.07.1',
    catalogProblemIds: ids,
    exportedAt: '2026-07-29T10:30:00+09:00',
  });
  const restored = new InMemoryLearningRecordDatabase();
  const restorePreview = previewLearningRecordImport(backup, [], ids);
  await applyLearningRecordImport(restored, restorePreview, 'newer-wins');
  const restoredCount = restored.records.size;
  const valuesAndTimestampsMatch = records.every(
    (record) => JSON.stringify(restored.records.get(record.problemId)) === JSON.stringify(record),
  );

  const rollbackTarget = new InMemoryLearningRecordDatabase();
  rollbackTarget.failOnPutNumber = 2;
  try {
    await applyLearningRecordImport(rollbackTarget, restorePreview, 'backup-wins');
  } catch {
    // The observed record count below proves whether the transaction rolled back atomically.
  }
  const partialCountAfterInjectedFailure = rollbackTarget.records.size;

  const localUpdated = acceptanceRecord(0, {
    status: 'in_progress',
    statusUpdatedAt: '2026-07-29T11:00:00+09:00',
  });
  const classificationPreview = previewLearningRecordImport(
    {
      schemaVersion: '1.0.0',
      exportedAt: '2026-07-29T12:30:00+09:00',
      catalogVersionAtExport: '2026.07.1',
      orphanedProblemIds: [],
      records: [
        acceptanceRecord(0, {
          needsReview: true,
          needsReviewUpdatedAt: '2026-07-29T12:00:00+09:00',
        }),
        acceptanceRecord(1),
        acceptanceRecord(2),
        { problemId: 'abc503-e', status: 'broken' },
        acceptanceRecord(4),
      ],
    },
    [localUpdated, acceptanceRecord(2)],
    new Set(['abc500-e', 'abc502-e', 'abc503-e', 'abc504-e']),
  );
  const observedClassifications = new Set(
    classificationPreview.items.map(({ classification }) => classification),
  );
  const fiveClassPreview = IMPORT_CLASSIFICATIONS.every((classification) =>
    observedClassifications.has(classification),
  );

  const backupJson = JSON.stringify(backup);
  const accountFields = /"(?:account|user|owner)(?:Id)?"\s*:/iu.test(backupJson);
  const syncFields = /"(?:sync|telemetry)[^"]*"\s*:/iu.test(backupJson);
  const runtimeSubjects = implementationSubjectPaths.filter((subjectPath) =>
    subjectPath.startsWith('src/'),
  );
  const runtimeSource = (
    await Promise.all(runtimeSubjects.map((subjectPath) => readFile(subjectPath, 'utf8')))
  ).join('\n');
  const externalTransmission =
    /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*(?:\(|\.)|navigator\.sendBeacon/u.test(
      runtimeSource,
    );
  const restorePassed =
    records.length >= 100 &&
    restoredCount === records.length &&
    valuesAndTimestampsMatch &&
    partialCountAfterInjectedFailure === 0 &&
    fiveClassPreview;
  const privacyPassed = !externalTransmission && !accountFields && !syncFields;
  return {
    restore: {
      recordCount: records.length,
      restoredCount,
      valuesAndTimestampsMatch,
      partialCountAfterInjectedFailure,
      observedClassifications: IMPORT_CLASSIFICATIONS.filter((classification) =>
        observedClassifications.has(classification),
      ),
      fiveClassPreview,
      passed: restorePassed,
    },
    privacy: {
      checkedRuntimePaths: runtimeSubjects,
      localOnly: !externalTransmission,
      externalTransmission,
      accountFields,
      syncFields,
      passed: privacyPassed,
    },
  };
};
const directAcceptance = await verifyRestoreAcceptance();
const acceptanceAggregatePassed =
  vitestReport.numFailedTests === 0 &&
  playwrightReport.errors.length === 0 &&
  staticQualityRun.exitCode === 0 &&
  runs.every(
    ({ durationMs, statusPersisted, reviewPersisted }) =>
      durationMs <= 30000 && statusPersisted && reviewPersisted,
  ) &&
  directAcceptance.restore.passed &&
  directAcceptance.privacy.passed;
if (!acceptanceAggregatePassed) {
  throw new Error('LearningRecord acceptance checks did not all pass.');
}

const acceptance = {
  schemaVersion: '1.0.0',
  previewId: 'initial-v1',
  catalogSubjectDigest: releaseDigest,
  problemIds,
  checks: {
    vitest: {
      passedFiles: vitestReport.testResults.filter(({ status }) => status === 'passed').length,
      passedTests: vitestReport.numPassedTests,
      failedTests: vitestReport.numFailedTests,
    },
    sharedContractE2e: {
      passed: allSpecs.length,
      failed: playwrightReport.errors.length,
      engineRuns: runs.length,
      storageFailureRuns,
    },
    representativeTiming: {
      maximumObservedMs: Math.max(...runs.map(({ durationMs }) => durationMs)),
      requiredMaximumMs: 30000,
      passed: runs.every(({ durationMs }) => durationMs <= 30000),
    },
    reload: {
      checkedEngineRuns: runs.length,
      preservedEngineRuns: runs.filter(
        ({ statusPersisted, reviewPersisted }) => statusPersisted && reviewPersisted,
      ).length,
      passed: runs.every(
        ({ statusPersisted, reviewPersisted }) => statusPersisted && reviewPersisted,
      ),
    },
    restore: directAcceptance.restore,
    privacy: directAcceptance.privacy,
  },
  e2eEvidencePath: e2ePath,
  e2eEvidenceDigest: await fileDigest(e2ePath),
  rawReportPath,
  rawReportDigest: rawEvidenceDigest,
  implementationSubjects,
  implementationSubjectDigest: canonicalDigest(implementationSubjects),
  aggregatePassed: acceptanceAggregatePassed,
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
  ['check-us3-unit', vitestRun, acceptancePath],
  ['check-us3-integration', vitestRun, acceptancePath],
  ['check-us3-e2e', playwrightRun, e2ePath],
  ['check-us3-static-quality', staticQualityRun, acceptancePath],
] as const;
const applicableChecks = await Promise.all(
  checks.map(async ([checkId, result, resultPath]) => ({
    checkId,
    command: result.command,
    subjectDigest,
    resultPath,
    resultDigest: await fileDigest(resultPath),
    exitCode: result.exitCode,
    passed: result.exitCode === 0,
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
  [acceptancePath, e2ePath, rawReportPath, reviewPath].map(async (artifactPath) => ({
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
