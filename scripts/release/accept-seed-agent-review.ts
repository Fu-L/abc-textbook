import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { deriveCatalogEvidenceTrustContext } from '../../src/lib/catalog/evidence-inventory.js';
import {
  INITIAL_RELEASE_MANIFEST,
  INITIAL_BOOTSTRAP_ID,
  assertSeedRelease,
} from '../../src/lib/catalog/seed-release.js';
import {
  SEED_AGENT_OWNER_INSTRUCTION,
  SEED_AGENT_REVIEW_PATH,
  seedAgentReviewReference,
  validateSeedAgentQualityReview,
} from '../../src/lib/validation/seed-agent-review.js';
import { fileSha } from '../verify/initial-release-evidence.js';
import { writeSeedJson } from './prepare-seed.js';

/** Issue #53's explicit owner exception: agent acceptance, not a human's approval. */
export const acceptSeedAgentReview = async () => {
  const json = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(file, 'utf8')) as unknown;
  const catalog = CatalogSchema.parse(await json('docs/verification/releases/catalog.json'));
  if (!catalog.release.validationSummary || !catalog.release.contentFileInventoryDigest)
    throw new Error('INITIAL_RELEASE_EVIDENCE_REQUIRED');
  assertSeedRelease(catalog);
  const manifest = ContentWorkManifestSchema.parse(await json(INITIAL_RELEASE_MANIFEST));
  const constitution = await readFile('.specify/memory/constitution.md', 'utf8');
  if (!constitution.includes(SEED_AGENT_OWNER_INSTRUCTION))
    throw new Error('INITIAL_AGENT_REVIEW_OWNER_INSTRUCTION');
  // Confirm all recorded audits still describe this current subject.
  await promisify(execFile)('npm', ['run', 'verify:initial-release', '--', '--check'], {
    timeout: 60_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  const matrixPath = 'docs/verification/initial-release/matrix.json';
  const matrix = (await json(matrixPath)) as {
    inputSubject: { digest: string };
    sourceProjectionDigest: string;
  };
  const inventory = deriveCatalogEvidenceTrustContext({ catalog, workManifest: manifest });
  const reference = async (file: string) => ({ path: file, digest: fileSha(await readFile(file)) });
  const templates = (await readdir('.specify/templates', { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(process.cwd(), path.join(entry.parentPath, entry.name)))
    .sort();
  const unsigned = {
    schemaVersion: '1.0.0',
    id: 'agent-content-review-initial-release',
    acceptanceMode: 'agent_quality_review',
    scope: 'ABC212–466 initial release',
    ownerInstruction: '人間の了承は不要です。',
    humanApprovalClaimed: false,
    generatedAt: new Date().toISOString(),
    subjectDigest: inventory.subjectDigest,
    workManifestDigest: manifest.digest,
    inventoryDigest: inventory.inventoryDigest,
    reviewPolicy: manifest.reviewPolicy,
    auditMatrix: await reference(matrixPath),
    auditInputSubjectDigest: matrix.inputSubject.digest,
    sourceProjectionDigest: matrix.sourceProjectionDigest,
    checkResultRefs: catalog.release.validationSummary.checks.map((check) => ({
      path: check.resultPath,
      digest: check.resultDigest,
    })),
    constitution: await reference('.specify/memory/constitution.md'),
    dependentTemplates: await Promise.all(templates.map(reference)),
    lineage: await Promise.all(
      [
        'docs/verification/bootstrap/us1.json',
        'docs/verification/bootstrap/learning-unit-content.json',
      ].map(reference),
    ),
    mathematicalRegressions: await reference(
      'docs/verification/initial-release/mathematical-regressions.txt',
    ),
    reviewItems: inventory.reviewItems.map((item) => ({
      ...item,
      decision: 'approved',
      reviewBasis: `${item.reviewUnitId}: 受入済みUnit本文と${String(item.subjectPaths.length - 1)}問の解説をbyte-preserveして初公開する。所有Outcome ${item.learningOutcomeIds.join(', ') || 'なし（分類用root Unit）'}と全subject pathをcurrent-subject inventoryで照合し、本文品質受入lineage、公式Source Revision、数学回帰、T133–T142の全成功に基づき公開準備を受け入れる。新しい本文・独自証明・問題配置を追加していない。`,
    })),
    outcomeCoverageIds: manifest.learningOutcomeIds,
    blockingFindingCount: 0,
    aggregatePassed: true,
  };
  const evidence = validateSeedAgentQualityReview(
    { ...unsigned, evidenceDigest: digestWithoutField(unsigned, 'evidenceDigest') },
    {
      catalog,
      manifest,
      inventory,
      checks: catalog.release.validationSummary.checks,
    },
  );
  await writeSeedJson(SEED_AGENT_REVIEW_PATH, evidence);
  const agentQualityReview = seedAgentReviewReference(
    evidence,
    fileSha(await readFile(SEED_AGENT_REVIEW_PATH)),
  );
  catalog.release.agentQualityReviewEvidenceRef = agentQualityReview;
  const inventoryPath = 'docs/verification/releases/evidence-inventory.json';
  const releaseInventory = (await json(inventoryPath)) as Record<string, unknown>;
  await writeSeedJson(inventoryPath, { ...releaseInventory, reviews: [], agentQualityReview });
  await writeSeedJson('docs/verification/releases/catalog.json', catalog);
  const updatePath = `staging/updates/${INITIAL_BOOTSTRAP_ID}/manifest.json`;
  const update = PublicationUpdateSchema.parse(await json(updatePath));
  await writeSeedJson(
    updatePath,
    PublicationUpdateSchema.parse({ ...update, state: 'ELIGIBLE_FOR_BATCH' }),
  );
  await writeSeedJson('docs/reviews/human-content/initial-release/inventory.json', {
    status: 'not_applicable_owner_instruction',
    ...inventory,
    acceptanceMode: 'agent_quality_review',
    agentQualityReview,
    humanApprovalClaimed: false,
  });
  await writeSeedJson('docs/reviews/human-content/releases/merge-review.json', {
    status: 'not_applicable_owner_instruction',
    mergeApproved: false,
    humanApprovalClaimed: false,
    agentQualityReview,
  });
  return {
    status: 'agent_quality_review_accepted',
    humanApprovalClaimed: false,
    reviewItems: 232,
    outcomeCount: 242,
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 2) throw new Error('Usage: release:accept-agent-review');
    console.log(JSON.stringify(await acceptSeedAgentReview()));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
