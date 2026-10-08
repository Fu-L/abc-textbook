import { z } from 'zod';
import { canonicalJson, digestWithoutField } from '../domain/canonical-json.js';
import { strictObject } from '../domain/contract-schema.js';
import { Sha256Schema, OffsetDateTimeSchema } from '../domain/schema-parts/catalog.js';
import type {
  CatalogSchema,
  SeedAgentQualityReviewReference,
} from '../domain/schema-parts/catalog.js';
import type { ContentWorkManifestSchema } from '../domain/schema-parts/review-evidence.js';
import type { TrustedReviewCheckInventory } from './human-content-review.js';
import type { TrustedCatalogReleaseEvidenceInventory } from '../catalog/build-catalog.js';
import { assertSeedRelease } from '../catalog/seed-release.js';

export const SEED_AGENT_REVIEW_PATH =
  'docs/reviews/agent-content/initial-release/release-review.json';
// Both legacy evidence writers and readers recognize the current Codex-only governance.
export const SEED_AGENT_OWNER_INSTRUCTION = '### III. Codex-Only Work Guided by a Manual';

const fileReference = strictObject({ path: z.string().min(1), digest: Sha256Schema });
const agentItem = strictObject({
  reviewItemId: z.string().min(1),
  reviewUnitId: z.string().min(1),
  kind: z.enum(['outcome_coverage', 'non_automatable_claim', 'non_automatable_example']),
  subjectPaths: z.array(z.string()).min(1),
  authorIds: z.array(z.string()).min(1),
  learningOutcomeIds: z.array(z.string()),
  decision: z.literal('approved'),
  reviewBasis: z.string().trim().min(1),
});
export const SeedAgentQualityReviewSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  id: z.literal('agent-content-review-initial-release'),
  acceptanceMode: z.literal('agent_quality_review'),
  scope: z.literal('ABC212–466 initial release'),
  ownerInstruction: z.literal('人間の了承は不要です。'),
  humanApprovalClaimed: z.literal(false),
  generatedAt: OffsetDateTimeSchema,
  subjectDigest: Sha256Schema,
  workManifestDigest: Sha256Schema,
  inventoryDigest: Sha256Schema,
  reviewPolicy: strictObject({
    requiredMode: z.literal('self'),
    riskReasons: z.array(z.enum(['original_proof', 'major_classification_change'])),
    highRiskSelfReviewReason: z.literal('solo_maintainer'),
  }),
  auditMatrix: fileReference,
  auditInputSubjectDigest: Sha256Schema,
  sourceProjectionDigest: Sha256Schema,
  checkResultRefs: z.array(fileReference).min(1),
  constitution: fileReference,
  dependentTemplates: z.array(fileReference).min(1),
  lineage: z.array(fileReference).min(1),
  mathematicalRegressions: fileReference,
  reviewItems: z.array(agentItem).length(232),
  outcomeCoverageIds: z.array(z.string()).length(242),
  blockingFindingCount: z.literal(0),
  aggregatePassed: z.literal(true),
  evidenceDigest: Sha256Schema,
});

/** This exception is seed-only and cannot attest to a human's actions or approvals. */
export const validateSeedAgentQualityReview = (
  value: unknown,
  input: {
    readonly catalog: z.infer<typeof CatalogSchema>;
    readonly manifest: z.infer<typeof ContentWorkManifestSchema>;
    readonly inventory: TrustedReviewCheckInventory;
    readonly checks: TrustedCatalogReleaseEvidenceInventory['checks'];
  },
) => {
  const evidence = SeedAgentQualityReviewSchema.parse(value);
  assertSeedRelease(input.catalog);
  const { manifest, inventory, checks } = input;
  if (
    evidence.evidenceDigest !== digestWithoutField(evidence, 'evidenceDigest') ||
    evidence.subjectDigest !== inventory.subjectDigest ||
    evidence.workManifestDigest !== manifest.digest ||
    evidence.inventoryDigest !== inventory.inventoryDigest ||
    canonicalJson(evidence.reviewPolicy) !== canonicalJson(manifest.reviewPolicy) ||
    canonicalJson([...evidence.reviewPolicy.riskReasons].sort()) !==
      canonicalJson(['major_classification_change', 'original_proof']) ||
    canonicalJson(evidence.checkResultRefs) !==
      canonicalJson(
        checks.map((check) => ({ path: check.resultPath, digest: check.resultDigest })),
      ) ||
    checks.some((check) => !check.passed || check.exitCode !== 0) ||
    evidence.auditMatrix.path !== 'docs/verification/initial-release/matrix.json' ||
    evidence.constitution.path !== '.specify/memory/constitution.md' ||
    evidence.mathematicalRegressions.path !==
      'docs/verification/initial-release/mathematical-regressions.txt' ||
    canonicalJson(evidence.lineage.map((file) => file.path).sort()) !==
      canonicalJson([
        'docs/verification/bootstrap/learning-unit-content.json',
        'docs/verification/bootstrap/us1.json',
      ]) ||
    canonicalJson([...evidence.outcomeCoverageIds].sort()) !==
      canonicalJson([...manifest.learningOutcomeIds].sort()) ||
    new Set(evidence.outcomeCoverageIds).size !== evidence.outcomeCoverageIds.length
  )
    throw new Error('INITIAL_AGENT_REVIEW_BINDING');
  const actualItems = evidence.reviewItems.map(({ decision, reviewBasis, ...item }) => {
    void decision;
    void reviewBasis;
    return item;
  });
  if (canonicalJson(actualItems) !== canonicalJson(inventory.reviewItems))
    throw new Error('INITIAL_AGENT_REVIEW_ITEM_COVERAGE');
  return evidence;
};

export const seedAgentReviewReference = (
  value: z.infer<typeof SeedAgentQualityReviewSchema>,
  digest: string,
): SeedAgentQualityReviewReference => ({
  evidenceId: value.id,
  path: SEED_AGENT_REVIEW_PATH,
  digest,
  subjectDigest: value.subjectDigest,
  acceptanceMode: 'agent_quality_review',
  aggregatePassed: true,
});
