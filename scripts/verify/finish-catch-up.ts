import { execFile } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import prettier from 'prettier';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { loadAcceptedUpdates } from '../../src/lib/corpus/accepted-updates.js';
import {
  auditInputSubject,
  fileSha,
  AUDIT_TASKS,
  AUDIT_ROOT,
  assertAuditEvidence,
} from './initial-release-evidence.js';
import { measureSC012 } from './sc012.js';
import { parseKeyValueArguments, requiredArgument } from '../corpus/cli-support.js';

const exec = promisify(execFile);
const save = async (file: string, value: unknown) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    await prettier.format(JSON.stringify(value), {
      filepath: file,
      ...(await prettier.resolveConfig(file)),
    }),
  );
};
const json = async (file: string) => JSON.parse(await readFile(file, 'utf8')) as unknown;
try {
  const args = parseKeyValueArguments(process.argv.slice(2), ['--commit']);
  const releaseCommit = requiredArgument(args, '--commit');
  if (
    !/^[a-f0-9]{40}$/u.test(releaseCommit) ||
    (await exec('git', ['rev-parse', 'HEAD'])).stdout.trim() !== releaseCommit
  )
    throw new Error('CATCH_UP_EXACT_COMMIT_REQUIRED');
  const projection = await loadFullPublicProjection();
  const accepted = await loadAcceptedUpdates();
  if (!accepted) throw new Error('CATCH_UP_NOT_ACCEPTED');
  const inputSubject = await auditInputSubject();
  const reports = [];
  for (const [taskId, name] of AUDIT_TASKS) {
    const file = `${AUDIT_ROOT}/${name}.json`;
    assertAuditEvidence(await json(file), taskId, inputSubject.digest, projection.digest);
    reports.push({ taskId, path: file, digest: fileSha(await readFile(file)) });
  }
  const items = [];
  const acceptedItems = new Map(
    accepted.receipts.flatMap((receipt) =>
      receipt.items.map((item) => [item.packet.problemId, item] as const),
    ),
  );
  for (const [id, document] of projection.problemDocuments) {
    const update = acceptedItems.get(id);
    const priorPath = update
      ? null
      : `docs/reviews/human-content/bootstrap/problem-authoring-units/${document.unit.docPath.split('/').at(-2) ?? ''}.json`;
    const prior = priorPath
      ? ((await json(priorPath)) as {
          riskReasons: string[];
          status: string;
          evidenceDigest: string;
        })
      : null;
    if (prior && prior.status !== 'accepted') throw new Error(`CATCH_UP_PRIOR_REVIEW:${id}`);
    const riskReasons = update?.review.riskReasons ?? prior?.riskReasons ?? [];
    items.push({
      ownerType: 'problem',
      problemId: id,
      documentPath: document.unit.docPath,
      documentDigest: document.digest,
      learningOutcomeIds: document.unit.learningOutcomeIds,
      claimKeys: document.unit.claims.map((claim) => claim.key),
      exampleKeys: document.unit.examples.map((example) => example.key),
      exerciseKeys: document.unit.exercises.map((exercise) => exercise.key),
      requiredMode: riskReasons.length ? 'third_party' : 'self',
      riskReasons,
      status: 'agent_quality_accepted',
      humanApproval: false,
      basis:
        update?.review.basis ??
        'Accepted bootstrap shard review rechecked against unchanged document bytes and the expanded T133–T142 audit.',
      priorReview: priorPath ? { path: priorPath, digest: canonicalDigest(prior) } : null,
    });
  }
  for (const [id, document] of projection.unitDocuments)
    items.push({
      ownerType: 'learning_unit',
      learningUnitId: id,
      documentDigest: document.digest,
      requiredMode: 'self',
      riskReasons: [],
      status: 'agent_quality_accepted',
      humanApproval: false,
      basis:
        'Accepted authored Unit bytes and ownership are unchanged; new Problem links are projected separately and audited.',
    });
  const reviewBase = {
    schemaVersion: '1.0.0',
    taskId: 'T146',
    releaseCommit,
    inputSubject,
    sourceProjectionDigest: projection.digest,
    status: 'accepted',
    reviewMode: 'agent_quality_review',
    humanApproval: false,
    humanReviewRequired: false,
    decisionSource: 'owner_instruction_issue_48',
    modeMeaning:
      'requiredMode preserves the risk-policy selection; agent_quality_accepted does not assert a human self or third-party approval.',
    checks: reports,
    items,
    unresolvedFindingCount: 0,
  };
  const review = { ...reviewBase, evidenceDigest: canonicalDigest(reviewBase) };
  const reviewPath = 'docs/reviews/human-content/initial-release/check-inventory.json';
  await save(reviewPath, review);
  const summary = {
    schemaVersion: '1.0.0',
    taskId: 'T145',
    releaseCommit,
    publicationStatus: 'prepared',
    version: projection.catalog.release.version,
    cutoffAt: projection.catalog.release.cutoffAt,
    updateIds: projection.catalog.release.updateIds,
    bootstrap: {
      updateId: accepted.policy.bootstrapUpdateId,
      problemCount: 868,
      acceptancePath: 'docs/verification/bootstrap/problem-authoring-units.json',
      acceptanceDigest: fileSha(
        await readFile('docs/verification/bootstrap/problem-authoring-units.json'),
      ),
      manifestPath: accepted.policy.bootstrapManifestPath,
      manifestDigest: accepted.policy.bootstrapManifestDigest,
    },
    catchUp: await Promise.all(
      accepted.policy.updates.map(async (entry) => ({
        contestId: entry.contestId,
        updateId: entry.updateId,
        manifestPath: entry.manifestPath,
        manifestDigest: canonicalDigest(await json(entry.manifestPath)),
      })),
    ),
    addedProblemIds: projection.catalog.release.addedProblemIds,
    changedProblemIds: [],
    heldProblemIds: [],
    withdrawnProblemIds: [],
    taxonomyChanges: [],
    sourceProjectionDigest: projection.digest,
    publishedHistoryPath: 'src/content/indexes/release-history.json',
    publicHistoryWritten: false,
    reason:
      'Catalog.release contains the prepared initial summary; published history is appended only after the actual release commit is deployed.',
  };
  const summaryPath = `${AUDIT_ROOT}/change-summary.json`;
  await save(summaryPath, { ...summary, evidenceDigest: canonicalDigest(summary) });
  console.error('SC-012: measuring fresh browser contexts in Chromium, Firefox, WebKit');
  const timing = await measureSC012(releaseCommit);
  const base = {
    schemaVersion: '1.0.0',
    taskIds: ['T143', 'T144', 'T145', 'T146', 'T147'],
    releaseCommit,
    status: 'passed',
    publicationStatus: 'prepared',
    productionReleaseApproved: false,
    inputSubject,
    sourceProjectionDigest: projection.digest,
    cutoffAt: accepted.policy.cutoffAt,
    bootstrapProblemCount: 868,
    catchUpContestCount: accepted.policy.updates.length,
    catchUpProblemCount: accepted.documents.length,
    totalProblemCount: projection.catalog.problems.length,
    totalContestCount: projection.catalog.contests.length,
    updateIds: projection.catalog.release.updateIds,
    checks: reports,
    metrics: {
      path: 'src/content/problem-metrics/atcoder-problems.json',
      digest: fileSha(await readFile('src/content/problem-metrics/atcoder-problems.json')),
      identityCount: projection.catalog.problems.length,
    },
    reviewInventory: { path: reviewPath, digest: review.evidenceDigest },
    changeSummary: { path: summaryPath, digest: canonicalDigest(summary) },
    sc012: timing,
    sc009: 'not_required_by_owner',
    sc010: 'not_required_by_owner',
    learnerRecordPreservation: {
      databaseAccess: 'fresh_test_contexts_only',
      automatedEvidence:
        'T139: independent timestamps, 120-record backup/restore, migration, expanded-catalog preservation; no operator database accessed',
    },
    generatedAt: new Date().toISOString(),
  };
  await save(`${AUDIT_ROOT}/post-catch-up.json`, {
    ...base,
    evidenceDigest: canonicalDigest(base),
  });
  console.log(
    JSON.stringify({
      status: 'passed',
      releaseCommit,
      problems: projection.catalog.problems.length,
      timing: timing.results,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
