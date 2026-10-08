import type { z } from 'zod';
import { canonicalJson } from '../domain/canonical-json.js';
import type { CatalogSchema } from '../domain/schema-parts/catalog.js';
import { createContentWorkManifest } from '../validation/content-work-manifest.js';

export const INITIAL_RELEASE_CUTOFF = '2026-07-12T00:00:00+09:00';
export const INITIAL_BOOTSTRAP_ID = 'update-bootstrap-full-corpus';
export const INITIAL_RELEASE_MANIFEST = 'docs/work-manifests/initial/release/manifest.json';
export const INITIAL_RELEASE_CHECKS = [
  ['check-initial-corpus', 'npm run verify:initial-release -- --check'],
  [
    'check-initial-sc012',
    'node node_modules/@playwright/test/cli.js test --workers=3 --reporter=json',
  ],
] as const;

type Catalog = z.infer<typeof CatalogSchema>;

/** Initial publication scope is independent of the protected-base file diff. */
export const assertSeedRelease = (catalog: Catalog): void => {
  const release = catalog.release;
  if (
    release.releaseKind !== 'initial' ||
    release.cutoffAt !== INITIAL_RELEASE_CUTOFF ||
    release.firstContestId !== 'abc212' ||
    release.lastContestId !== 'abc466' ||
    catalog.contests.length !== 254 ||
    catalog.contestGaps.length !== 1 ||
    catalog.contestGaps[0]?.number !== 316 ||
    catalog.problems.length !== 868 ||
    catalog.tags.length !== 213 ||
    catalog.learningUnits.length !== 232 ||
    catalog.learningOutcomes.length !== 242 ||
    canonicalJson(release.updateIds) !== canonicalJson([INITIAL_BOOTSTRAP_ID]) ||
    canonicalJson([...release.addedProblemIds].sort()) !==
      canonicalJson(catalog.problems.map((problem) => problem.id).sort()) ||
    release.changedProblemIds.length ||
    release.withdrawnProblemIds.length ||
    release.heldProblemIds.length ||
    release.taxonomyChanges.length
  )
    throw new Error('INITIAL_RELEASE_SCOPE_MISMATCH');
};

export const seedReleaseSummary = (catalog: Catalog) => ({
  publicationStatus: 'prepared',
  version: catalog.release.version,
  cutoffAt: catalog.release.cutoffAt,
  updateIds: [INITIAL_BOOTSTRAP_ID],
  addedProblemIds: catalog.release.addedProblemIds,
  changedProblemIds: [],
  withdrawnProblemIds: [],
  taxonomyChanges: [],
  hostPublicationHistory: [],
});

/** Reconstructed from accepted owners, rather than a caller's selected subset. */
export const createSeedReleaseManifest = (
  catalog: Catalog,
  createdAt: string,
  soloMaintainer = false,
) =>
  createContentWorkManifest({
    manifestId: 'work-manifest-T162-seed-release',
    taskId: 'T162',
    changeKind: 'operations',
    requiredRequirementIds: ['FR-001', 'FR-026', 'FR-027', 'FR-030', 'SC-001', 'SC-012'],
    learningOutcomeIds: catalog.learningOutcomes.map((outcome) => outcome.id),
    reviewPolicy: {
      requiredMode: soloMaintainer ? 'self' : 'third_party',
      riskReasons: ['original_proof', 'major_classification_change'],
      ...(soloMaintainer ? { highRiskSelfReviewReason: 'solo_maintainer' as const } : {}),
    },
    maintenanceBenefit: null,
    createdAt,
    reviewUnits: catalog.learningUnits.map((unit) => ({
      unitId: `RU-T162-${unit.id}`,
      ownerId: 'person-maintainer',
      paths: [
        unit.docPath,
        ...catalog.authoringUnits
          .filter((problem) => unit.directProblemIds?.includes(problem.problemId))
          .map((problem) => problem.docPath),
      ],
      itemIds: [`human-review-item-${unit.id}`],
      requirementIds: ['FR-001', 'FR-026', 'FR-027', 'FR-030', 'SC-001', 'SC-012'],
      learningOutcomeIds: unit.ownedLearningOutcomeIds ?? unit.learningOutcomeIds,
      dependencyUnitIds: [],
      checkIds: INITIAL_RELEASE_CHECKS.map(([id]) => id),
      evidenceRole: (unit.ownedLearningOutcomeIds ?? unit.learningOutcomeIds).length
        ? 'outcome_coverage'
        : 'non_automatable_claim',
    })),
  });
