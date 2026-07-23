import { canonicalDigest } from '../domain/canonical-json.js';

export type IntegrationAction = 'promote' | 'merge' | 'split' | 'retire';

export interface IntegrationEntry {
  readonly previewEntityId: string;
  readonly action: IntegrationAction;
  readonly finalEntityIds: readonly string[];
  readonly affectedProblemIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly correctionImpactId: string;
}

export interface FinalTaxonomyBuildInput {
  readonly inventoryDigest: string;
  readonly previewSnapshotDigest: string;
  readonly previewSnapshotStatus: 'passed' | 'on_hold';
  readonly policy: {
    readonly name: string;
    readonly version: string;
    readonly inputScope: string;
  };
  readonly integrationEntries: readonly IntegrationEntry[];
  readonly finalEntityIds: readonly string[];
  readonly placementProblemIds: readonly string[];
}

export interface FinalTaxonomyBuild extends FinalTaxonomyBuildInput {
  readonly taxonomyDigest: string;
}

export const taxonomyDigestSubject = (
  build: FinalTaxonomyBuildInput | FinalTaxonomyBuild,
): FinalTaxonomyBuildInput => ({
  inventoryDigest: build.inventoryDigest,
  previewSnapshotDigest: build.previewSnapshotDigest,
  previewSnapshotStatus: build.previewSnapshotStatus,
  policy: build.policy,
  integrationEntries: build.integrationEntries,
  finalEntityIds: build.finalEntityIds,
  placementProblemIds: build.placementProblemIds,
});

export const finalTaxonomyDigest = (build: FinalTaxonomyBuildInput | FinalTaxonomyBuild): string =>
  canonicalDigest(taxonomyDigestSubject(build));

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

/**
 * Validate the production acceptance boundary between preview taxonomy and final taxonomy.
 * The final digest includes every input that is allowed to affect acceptance.
 */
export const validateTaxonomyIntegration = (
  previewEntityIds: readonly string[],
  inventoryProblemIds: readonly string[],
  build: FinalTaxonomyBuild,
): string[] => {
  const violations: string[] = [];
  if (build.previewSnapshotStatus !== 'passed') {
    violations.push('preview_snapshot_not_passed');
  }

  const mappedIds = build.integrationEntries.map(({ previewEntityId }) => previewEntityId);
  if (
    !sameSet(mappedIds, previewEntityIds) ||
    new Set(previewEntityIds).size !== previewEntityIds.length
  ) {
    violations.push('integration_mapping_incomplete');
  }

  for (const entry of build.integrationEntries) {
    const validFinalEntityCount =
      entry.action === 'retire'
        ? entry.finalEntityIds.length === 0
        : entry.action === 'split'
          ? entry.finalEntityIds.length >= 2
          : entry.finalEntityIds.length === 1;
    if (!validFinalEntityCount) {
      violations.push(`invalid_action_cardinality:${entry.previewEntityId}`);
    }
    if (entry.evidenceIds.length === 0 || entry.correctionImpactId.trim().length === 0) {
      violations.push(`integration_evidence_missing:${entry.previewEntityId}`);
    }
    if (entry.finalEntityIds.some((id) => !build.finalEntityIds.includes(id))) {
      violations.push(`final_entity_missing:${entry.previewEntityId}`);
    }
    if (entry.affectedProblemIds.some((id) => !inventoryProblemIds.includes(id))) {
      violations.push(`unknown_affected_problem:${entry.previewEntityId}`);
    }
  }

  if (
    new Set(build.finalEntityIds).size !== build.finalEntityIds.length ||
    build.finalEntityIds.some((id) => /^(?:preview|provisional)-/u.test(id))
  ) {
    violations.push('final_taxonomy_not_deduplicated');
  }
  if (!sameSet(build.placementProblemIds, inventoryProblemIds)) {
    violations.push('placement_reachability_incomplete');
  }
  if (build.taxonomyDigest !== finalTaxonomyDigest(build)) {
    violations.push('final_taxonomy_digest_stale');
  }
  return violations;
};
