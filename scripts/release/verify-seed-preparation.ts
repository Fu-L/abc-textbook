import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { z } from 'zod';
import type { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  loadCatalogEvidenceCanonicalSources,
  CatalogReleaseCheckResultSchema,
} from '../../src/lib/catalog/evidence-inventory.js';
import {
  assertSeedRelease,
  INITIAL_RELEASE_CHECKS,
  seedReleaseSummary,
} from '../../src/lib/catalog/seed-release.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { auditCompleteness } from '../verify/initial-release-audits.js';
import {
  AUDIT_TASKS,
  auditInputSubject,
  assertAuditEvidence,
  fileSha,
} from '../verify/initial-release-evidence.js';
import type { ReleaseCommitContext } from './commit-snapshot.js';

/** Read-only preparation validation. This result never authorizes merge/deploy. */
export const verifySeedPreparation = async (
  context: ReleaseCommitContext,
  catalog: z.infer<typeof CatalogSchema>,
  catalogPath: string,
) => {
  const root = context.repositoryRoot;
  const json = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(root, file), 'utf8')) as unknown;
  assertSeedRelease(catalog);
  if (catalog.release.publicationStatus !== 'prepared')
    throw new Error('INITIAL_PREPARATION_STATUS');
  if (
    catalog.release.changelogPath !== 'docs/verification/releases/change-summary.json' ||
    canonicalJson(await json(catalog.release.changelogPath)) !==
      canonicalJson(seedReleaseSummary(catalog))
  )
    throw new Error('INITIAL_PREPARATION_SUMMARY');
  await loadCatalogEvidenceCanonicalSources(catalog, root, {
    catalogPath,
    allowHeldBootstrap: true,
  });
  const projection = await loadFullPublicProjection({ repositoryRoot: root });
  auditCompleteness(catalog);
  const subject = await auditInputSubject(root);
  const matrix = (await json('docs/verification/initial-release/matrix.json')) as {
    status: string;
    inputSubject: { digest: string };
    evidenceDigest: string;
    reports: { taskId: string; path: string; digest: string }[];
    browserResults: { path: string; digest: string };
    testResults: { path: string; digest: string };
  };
  const { evidenceDigest, ...unsigned } = matrix;
  if (
    matrix.status !== 'passed' ||
    matrix.inputSubject.digest !== subject.digest ||
    canonicalDigest(unsigned) !== evidenceDigest ||
    matrix.reports.length !== 10
  )
    throw new Error('INITIAL_PREPARATION_AUDIT_STALE');
  for (const [index, [taskId, name]] of AUDIT_TASKS.entries()) {
    const file = `docs/verification/initial-release/${name}.json`;
    assertAuditEvidence(await json(file), taskId, subject.digest, projection.digest);
    const report = matrix.reports[index];
    if (
      report?.path !== file ||
      report.taskId !== taskId ||
      report.digest !== fileSha(await readFile(path.join(root, file)))
    )
      throw new Error('INITIAL_PREPARATION_AUDIT_REPORT');
  }
  for (const raw of [matrix.browserResults, matrix.testResults])
    if (raw.digest !== fileSha(await readFile(path.join(root, raw.path))))
      throw new Error('INITIAL_PREPARATION_RAW_STALE');
  const inventory = (await json('docs/verification/releases/evidence-inventory.json')) as {
    subjectDigest: string;
    checks: { checkId: string; resultPath: string; resultDigest: string }[];
    reviews: unknown[];
  };
  if (
    inventory.subjectDigest !== catalog.release.contentFileInventoryDigest ||
    canonicalJson(inventory.checks) !== canonicalJson(catalog.release.validationSummary.checks) ||
    inventory.checks.length !== INITIAL_RELEASE_CHECKS.length
  )
    throw new Error('INITIAL_PREPARATION_CHECKS');
  for (const [id, command] of INITIAL_RELEASE_CHECKS) {
    const reference = inventory.checks.find((check) => check.checkId === id);
    if (!reference) throw new Error('INITIAL_PREPARATION_CHECK_MISSING');
    const bytes = await readFile(path.join(root, reference.resultPath));
    const check = CatalogReleaseCheckResultSchema.parse(
      JSON.parse(bytes.toString('utf8')) as unknown,
    );
    if (
      fileSha(bytes) !== reference.resultDigest ||
      check.command !== command ||
      !check.passed ||
      check.exitCode !== 0 ||
      check.subjectDigest !== inventory.subjectDigest
    )
      throw new Error('INITIAL_PREPARATION_CHECK_STALE');
  }
  const sc012 = (await json('docs/verification/learner-outcomes/initial-release/sc-012.json')) as {
    subjectDigest: string;
    routeInventory: string[];
    rawResult: { path: string; digest: string };
    observations: { browser: string; problemId: string; preserved: boolean; durationMs: number }[];
  };
  const rawObservations: unknown[] = [];
  const collect = (value: unknown): void => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    const record = value as Record<string, unknown>;
    if (record.name === 'sc012-observation' && typeof record.body === 'string')
      rawObservations.push(JSON.parse(Buffer.from(record.body, 'base64').toString('utf8')));
    Object.values(record).forEach(collect);
  };
  collect(await json(matrix.browserResults.path));
  const expectedObservations = ['chromium', 'firefox', 'webkit'].flatMap((browser) =>
    ['abc212-e', 'abc315-ex', 'abc466-f', 'abc466-g'].map((id) => `${browser}:${id}`),
  );
  if (
    sc012.subjectDigest !== inventory.subjectDigest ||
    sc012.routeInventory.length !== 868 ||
    canonicalJson(sc012.routeInventory) !==
      canonicalJson(catalog.problems.map((problem) => `/problems/${problem.id}/`)) ||
    canonicalJson(sc012.rawResult) !== canonicalJson(matrix.browserResults) ||
    canonicalJson(sc012.observations) !== canonicalJson(rawObservations) ||
    canonicalJson(sc012.observations.map((item) => `${item.browser}:${item.problemId}`).sort()) !==
      canonicalJson(expectedObservations.sort()) ||
    sc012.observations.some(
      (item) => !item.preserved || item.durationMs < 0 || item.durationMs > 30_000,
    )
  )
    throw new Error('INITIAL_PREPARATION_SC012');
  return {
    command: 'verify:release',
    mode: 'preparation',
    commit: context.commit,
    protectedBaseCommit: context.baseCommit,
    aggregatePassed: true,
    productionReleaseApproved: false,
    cutoffAt: catalog.release.cutoffAt,
    version: catalog.release.version,
    problemCount: 868,
    productionGateRequirements: [
      'policy-selected-review',
      'protected-main-required-checks',
      'host-project-and-origin',
    ],
    checks: [
      'real-protected-base-diff',
      'accepted-seed-and-shard-join',
      'bootstrap-only-summary',
      'T133-T142-current-subject',
      'SC-012-automated-controls-and-persistence',
    ],
  };
};
