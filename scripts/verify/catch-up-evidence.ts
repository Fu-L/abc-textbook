import { readFile } from 'node:fs/promises';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { UserTimingEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { auditInputSubject, fileSha, assertAuditEvidence } from './initial-release-evidence.js';

const json = async (file: string) => JSON.parse(await readFile(file, 'utf8')) as unknown;
try {
  const report = (await json('docs/verification/initial-release/post-catch-up.json')) as {
    status: string;
    releaseCommit: string;
    inputSubject: { digest: string };
    sourceProjectionDigest: string;
    evidenceDigest: string;
    checks: { taskId: string; path: string; digest: string }[];
    reviewInventory: { path: string; digest: string };
    sc012: { protocolPath: string; results: { path: string; digest: string }[] };
  };
  const projection = await loadFullPublicProjection();
  if (
    report.status !== 'passed' ||
    !/^[a-f0-9]{40}$/u.test(report.releaseCommit) ||
    digestWithoutField(report, 'evidenceDigest') !== report.evidenceDigest ||
    report.inputSubject.digest !== (await auditInputSubject()).digest ||
    report.sourceProjectionDigest !== projection.digest
  )
    throw new Error('POST_CATCH_UP_STALE');
  for (const check of report.checks) {
    if (fileSha(await readFile(check.path)) !== check.digest)
      throw new Error('POST_CATCH_UP_REPORT_DIGEST');
    assertAuditEvidence(
      await json(check.path),
      check.taskId,
      report.inputSubject.digest,
      projection.digest,
    );
  }
  const review = (await json(report.reviewInventory.path)) as {
    releaseCommit: string;
    evidenceDigest: string;
    humanApproval: boolean;
    unresolvedFindingCount: number;
    items: { ownerType: string }[];
  };
  if (
    review.releaseCommit !== report.releaseCommit ||
    review.evidenceDigest !== report.reviewInventory.digest ||
    digestWithoutField(review, 'evidenceDigest') !== review.evidenceDigest ||
    review.humanApproval ||
    review.unresolvedFindingCount ||
    review.items.length !== projection.problemDocuments.size + projection.unitDocuments.size
  )
    throw new Error('POST_CATCH_UP_REVIEW_INVENTORY');
  const protocol = UserTimingEvidenceSchema.parse(await json(report.sc012.protocolPath));
  if (
    protocol.documentKind !== 'user_timing_protocol' ||
    digestWithoutField(protocol, 'protocolDigest') !== protocol.protocolDigest ||
    protocol.actorRole !== 'automated_browser'
  )
    throw new Error('POST_CATCH_UP_TIMING_PROTOCOL');
  for (const reference of report.sc012.results) {
    const result = UserTimingEvidenceSchema.parse(await json(reference.path));
    if (
      result.documentKind !== 'user_timing_result' ||
      !result.passed ||
      result.releaseDigest !== projection.catalog.release.contentSnapshotDigest ||
      result.protocolDigest !== protocol.protocolDigest ||
      canonicalDigest(result) !== reference.digest ||
      digestWithoutField(result, 'resultDigest') !== result.resultDigest ||
      result.durationMs > 30000 ||
      result.durationMs !== result.completedMonotonicMs - result.startedMonotonicMs ||
      result.additionalNavigationCount ||
      !result.statusUpdatedAtPreserved ||
      !result.reviewUpdatedAtPreserved ||
      result.routeEquivalence.inventoryCount !== projection.problemDocuments.size ||
      result.routeEquivalence.failedRouteCount ||
      result.routeEquivalence.passedRouteCount !== projection.problemDocuments.size
    )
      throw new Error('POST_CATCH_UP_TIMING_RESULT');
    for (const raw of result.rawFiles) {
      const bytes = await readFile(raw.path);
      if (bytes.length !== raw.byteLength || fileSha(bytes) !== raw.sha256)
        throw new Error('POST_CATCH_UP_TIMING_RAW');
    }
  }
  console.log(
    JSON.stringify({
      status: 'passed',
      releaseCommit: report.releaseCommit,
      problems: projection.catalog.problems.length,
      humanApproval: false,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
