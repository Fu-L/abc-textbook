import { readFile } from 'node:fs/promises';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { loadAcceptedUpdates } from '../update-abc/catch-up.js';
import { auditCompleteness, auditOptionalBlocks, auditSources } from './initial-release-audits.js';

try {
  if (process.argv.length > 2) throw new Error('Usage: verify:catch-up');
  const accepted = await loadAcceptedUpdates();
  if (!accepted) throw new Error('CATCH_UP_NOT_ACCEPTED');
  const projection = await loadFullPublicProjection();
  const reviews = accepted.receipts.flatMap((receipt) =>
    receipt.items.map((item) => ({
      problemId: item.packet.problemId,
      documentDigest: item.documentDigest,
      ...item.review,
    })),
  );
  const bootstrap = JSON.parse(
    await readFile('docs/verification/bootstrap/problem-authoring-units.json', 'utf8'),
  ) as { problemCount: number };
  if (
    projection.catalog.problems.length !== bootstrap.problemCount + accepted.documents.length ||
    projection.catalog.release.updateIds.length !== accepted.policy.updates.length + 1 ||
    new Set(reviews.map((item) => item.problemId)).size !== accepted.documents.length
  )
    throw new Error('CATCH_UP_RELEASE_COVERAGE');
  const report = {
    schemaVersion: '1.0.0',
    status: 'passed',
    cutoffAt: accepted.policy.cutoffAt,
    policyDigest: accepted.policy.digest,
    projectionDigest: projection.digest,
    bootstrapProblems: bootstrap.problemCount,
    catchUpProblems: accepted.documents.length,
    updateIds: projection.catalog.release.updateIds,
    completeness: auditCompleteness(projection.catalog),
    sources: auditSources(projection),
    optional: auditOptionalBlocks(projection),
    reviewCount: reviews.length,
    reviewDigest: canonicalDigest(reviews),
    humanApproval: false,
  };
  console.log(JSON.stringify(report));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
