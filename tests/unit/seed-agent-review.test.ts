import { beforeAll, describe, expect, it } from 'vitest';
import { digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import {
  createSeedReleaseManifest,
  INITIAL_RELEASE_CHECKS,
} from '../../src/lib/catalog/seed-release.js';
import { deriveCatalogEvidenceTrustContext } from '../../src/lib/catalog/evidence-inventory.js';
import {
  SeedAgentQualityReviewSchema,
  validateSeedAgentQualityReview,
  seedAgentReviewReference,
} from '../../src/lib/validation/seed-agent-review.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { buildReleaseHistory } from '../../src/lib/catalog/build-release-history.js';

describe('owner-authorized initial release agent review', () => {
  let context: Parameters<typeof validateSeedAgentQualityReview>[1];
  let makeEvidence: () => ReturnType<typeof SeedAgentQualityReviewSchema.parse>;
  beforeAll(async () => {
    const { catalog } = await loadFullPublicProjection({ usePreparedRelease: false });
    const manifest = ContentWorkManifestSchema.parse(
      createSeedReleaseManifest(catalog, catalog.release.validatedAt, true),
    );
    catalog.release.manifestDigest = manifest.digest;
    const checks = INITIAL_RELEASE_CHECKS.map(([checkId, command], index) => ({
      checkId,
      command,
      subjectDigest: catalog.release.contentFileInventoryDigest,
      resultPath: `tests/fixtures/seed-agent-review/${checkId}.json`,
      resultDigest: (index === 0 ? 'a' : 'b').repeat(64),
      passed: true,
      exitCode: 0,
      completedAt: '2026-10-07T14:00:00Z',
    }));
    catalog.release.validationSummary = {
      checkCount: checks.length,
      passedCheckCount: checks.length,
      blockingFindingCount: 0,
      evidenceDigests: checks.map((check) => check.resultDigest),
      checks,
    };
    const inventory = deriveCatalogEvidenceTrustContext({ catalog, workManifest: manifest });
    context = { catalog, manifest, inventory, checks: catalog.release.validationSummary.checks };
    const ref = (path: string) => ({ path, digest: 'a'.repeat(64) });
    makeEvidence = () => {
      const unsigned = {
        schemaVersion: '1.0.0',
        id: 'agent-content-review-initial-release',
        acceptanceMode: 'agent_quality_review',
        scope: 'ABC212–466 initial release',
        ownerInstruction: '人間の了承は不要です。',
        humanApprovalClaimed: false,
        generatedAt: '2026-10-07T14:00:00Z',
        subjectDigest: inventory.subjectDigest,
        workManifestDigest: manifest.digest,
        inventoryDigest: inventory.inventoryDigest,
        reviewPolicy: manifest.reviewPolicy,
        auditMatrix: ref('docs/verification/initial-release/matrix.json'),
        auditInputSubjectDigest: 'a'.repeat(64),
        sourceProjectionDigest: 'b'.repeat(64),
        checkResultRefs: context.checks.map((check) => ({
          path: check.resultPath,
          digest: check.resultDigest,
        })),
        constitution: ref('.specify/memory/constitution.md'),
        dependentTemplates: [ref('.specify/templates/spec-template.md')],
        lineage: [
          ref('docs/verification/bootstrap/us1.json'),
          ref('docs/verification/bootstrap/learning-unit-content.json'),
        ],
        mathematicalRegressions: ref(
          'docs/verification/initial-release/mathematical-regressions.txt',
        ),
        reviewItems: inventory.reviewItems.map((item) => ({
          ...item,
          decision: 'approved',
          reviewBasis:
            'Synthetic test fixture: accepted content preservation and complete current-subject evidence.',
        })),
        outcomeCoverageIds: manifest.learningOutcomeIds,
        blockingFindingCount: 0,
        aggregatePassed: true,
      };
      return SeedAgentQualityReviewSchema.parse({
        ...unsigned,
        evidenceDigest: digestWithoutField(unsigned, 'evidenceDigest'),
      });
    };
  }, 60_000);

  it('accepts full seed coverage as agent review with both risks and no human approval claim', () => {
    const evidence = validateSeedAgentQualityReview(makeEvidence(), context);
    expect(evidence.reviewItems).toHaveLength(232);
    expect(evidence.outcomeCoverageIds).toHaveLength(242);
    expect(evidence.humanApprovalClaimed).toBe(false);
  });

  it('rejects missing items, empty bases, lost risks and duplicated outcome coverage', () => {
    const missing = makeEvidence();
    missing.reviewItems.pop();
    expect(() => validateSeedAgentQualityReview(missing, context)).toThrow();
    const empty = makeEvidence();
    const firstItem = empty.reviewItems[0];
    if (!firstItem) throw new Error('Test review item missing');
    firstItem.reviewBasis = ' ';
    empty.evidenceDigest = digestWithoutField(empty, 'evidenceDigest');
    expect(() => validateSeedAgentQualityReview(empty, context)).toThrow();
    const lostRisk = makeEvidence();
    lostRisk.reviewPolicy.riskReasons.pop();
    lostRisk.evidenceDigest = digestWithoutField(lostRisk, 'evidenceDigest');
    expect(() => validateSeedAgentQualityReview(lostRisk, context)).toThrow(
      'INITIAL_AGENT_REVIEW_BINDING',
    );
    const duplicated = makeEvidence();
    const firstOutcome = duplicated.outcomeCoverageIds[0];
    if (!firstOutcome) throw new Error('Test outcome missing');
    duplicated.outcomeCoverageIds[1] = firstOutcome;
    duplicated.evidenceDigest = digestWithoutField(duplicated, 'evidenceDigest');
    expect(() => validateSeedAgentQualityReview(duplicated, context)).toThrow(
      'INITIAL_AGENT_REVIEW_BINDING',
    );
  });

  it('rejects stale check bindings, swapped item paths and use in an incremental release', () => {
    const stale = makeEvidence();
    const firstCheck = stale.checkResultRefs[0];
    if (!firstCheck) throw new Error('Test check missing');
    firstCheck.digest = 'c'.repeat(64);
    stale.evidenceDigest = digestWithoutField(stale, 'evidenceDigest');
    expect(() => validateSeedAgentQualityReview(stale, context)).toThrow(
      'INITIAL_AGENT_REVIEW_BINDING',
    );
    const swapped = makeEvidence();
    const swappedItem = swapped.reviewItems[0];
    if (!swappedItem) throw new Error('Test review item missing');
    swappedItem.subjectPaths = ['src/content/unrelated.md'];
    swapped.evidenceDigest = digestWithoutField(swapped, 'evidenceDigest');
    expect(() => validateSeedAgentQualityReview(swapped, context)).toThrow(
      'INITIAL_AGENT_REVIEW_ITEM_COVERAGE',
    );
    const incremental = structuredClone(context.catalog);
    incremental.release.releaseKind = 'incremental';
    expect(() =>
      validateSeedAgentQualityReview(makeEvidence(), { ...context, catalog: incremental }),
    ).toThrow('INITIAL_RELEASE_SCOPE_MISMATCH');
  });

  it('retains agent acceptance in actual-host history and rejects an unreviewed or expanded catalog', () => {
    const catalog = structuredClone(context.catalog);
    catalog.release.humanContentReviewEvidenceRefs = [];
    catalog.release.agentQualityReviewEvidenceRef = seedAgentReviewReference(
      makeEvidence(),
      'd'.repeat(64),
    );
    catalog.release.publicationStatus = 'published';
    const metadata = {
      schemaVersion: '1.0.0',
      version: catalog.release.version,
      commit: 'a'.repeat(40),
      cutoffAt: catalog.release.cutoffAt,
      validationResultsUrl: 'https://github.com/example/test/actions/runs/1',
      changeSummary: {
        updateIds: catalog.release.updateIds,
        addedProblemIds: catalog.release.addedProblemIds,
        changedProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
      },
    };
    expect(CatalogSchema.safeParse(catalog).success).toBe(true);
    const history = buildReleaseHistory([{ metadata, catalog }]);
    expect(history[0]?.agentQualityReviewEvidenceRef?.acceptanceMode).toBe('agent_quality_review');
    expect(history[0]?.reviewEvidenceRefs).toEqual([]);
    delete catalog.release.agentQualityReviewEvidenceRef;
    expect(() => buildReleaseHistory([{ metadata, catalog }])).toThrow();
    const expanded = structuredClone(context.catalog);
    expanded.release.agentQualityReviewEvidenceRef = seedAgentReviewReference(
      makeEvidence(),
      'd'.repeat(64),
    );
    expanded.release.lastContestId = 'abc467';
    expect(CatalogSchema.safeParse(expanded).success).toBe(false);
  });
});
