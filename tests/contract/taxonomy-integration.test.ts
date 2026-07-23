import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

type IntegrationAction = 'promote' | 'merge' | 'split' | 'retire';

interface IntegrationEntry {
  readonly previewEntityId: string;
  readonly action: IntegrationAction;
  readonly finalEntityIds: readonly string[];
  readonly affectedProblemIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly correctionImpactId: string;
}

interface FinalTaxonomyBuild {
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
  readonly taxonomyDigest: string;
}

const taxonomyDigestSubject = (build: FinalTaxonomyBuild) => ({
  inventoryDigest: build.inventoryDigest,
  previewSnapshotDigest: build.previewSnapshotDigest,
  previewSnapshotStatus: build.previewSnapshotStatus,
  policy: build.policy,
  integrationEntries: build.integrationEntries,
  finalEntityIds: build.finalEntityIds,
  placementProblemIds: build.placementProblemIds,
});

const integrationViolations = (
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
    new Set(mappedIds).size !== mappedIds.length ||
    previewEntityIds.some((id) => !mappedIds.includes(id)) ||
    mappedIds.some((id) => !previewEntityIds.includes(id))
  ) {
    violations.push('integration_mapping_incomplete');
  }
  for (const entry of build.integrationEntries) {
    const expectedFinalCount = entry.action === 'retire' ? 0 : entry.action === 'split' ? 2 : 1;
    if (
      (entry.action === 'split' && entry.finalEntityIds.length < expectedFinalCount) ||
      (entry.action !== 'split' && entry.finalEntityIds.length !== expectedFinalCount)
    ) {
      violations.push(`invalid_action_cardinality:${entry.previewEntityId}`);
    }
    if (entry.evidenceIds.length === 0 || entry.correctionImpactId.length === 0) {
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
  if (
    new Set(build.placementProblemIds).size !== inventoryProblemIds.length ||
    inventoryProblemIds.some((id) => !build.placementProblemIds.includes(id))
  ) {
    violations.push('placement_reachability_incomplete');
  }
  if (build.taxonomyDigest !== canonicalDigest(taxonomyDigestSubject(build))) {
    violations.push('final_taxonomy_digest_stale');
  }
  return violations;
};

const buildFixture = (): FinalTaxonomyBuild => {
  const subject = {
    inventoryDigest: 'a'.repeat(64),
    previewSnapshotDigest: 'b'.repeat(64),
    previewSnapshotStatus: 'passed' as const,
    policy: {
      name: 'full-corpus-taxonomy-recompute',
      version: '1.0.0',
      inputScope: 'complete-technique-inventory',
    },
    integrationEntries: [
      {
        previewEntityId: 'preview-tag-bfs',
        action: 'promote' as const,
        finalEntityIds: ['tag-bfs'],
        affectedProblemIds: ['abc212-e'],
        evidenceIds: ['evidence-bfs'],
        correctionImpactId: 'correction-impact-bfs',
      },
      {
        previewEntityId: 'preview-unit-search',
        action: 'split' as const,
        finalEntityIds: ['unit-bfs', 'unit-dijkstra'],
        affectedProblemIds: ['abc212-e', 'abc213-f'],
        evidenceIds: ['evidence-search-split'],
        correctionImpactId: 'correction-impact-search-split',
      },
    ],
    finalEntityIds: ['tag-bfs', 'unit-bfs', 'unit-dijkstra'],
    placementProblemIds: ['abc212-e', 'abc213-f'],
  };
  return {
    ...subject,
    taxonomyDigest: canonicalDigest(subject),
  };
};

describe('US2 preview-to-final taxonomy integration contract', () => {
  const previewEntityIds = ['preview-tag-bfs', 'preview-unit-search'];
  const inventoryProblemIds = ['abc212-e', 'abc213-f'];

  it('maps every provisional entity exactly once through promote/merge/split/retire', () => {
    expect(integrationViolations(previewEntityIds, inventoryProblemIds, buildFixture())).toEqual(
      [],
    );

    const incomplete = buildFixture();
    const [first] = incomplete.integrationEntries;
    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...incomplete,
        integrationEntries: first ? [first] : [],
      }),
    ).toContain('integration_mapping_incomplete');
  });

  it('enforces action cardinality and source-backed CorrectionImpact evidence', () => {
    const build = buildFixture();
    const [first, second] = build.integrationEntries;
    if (!first || !second) throw new Error('Integration fixture is incomplete.');
    const invalidEntry = {
      ...second,
      action: 'split' as const,
      finalEntityIds: ['unit-bfs'],
      evidenceIds: [],
    };
    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        integrationEntries: [first, invalidEntry],
      }),
    ).toEqual(
      expect.arrayContaining([
        'invalid_action_cardinality:preview-unit-search',
        'integration_evidence_missing:preview-unit-search',
      ]),
    );
  });

  it('accepts merge and retire only with their exact target cardinality', () => {
    const build = buildFixture();
    const [first, second] = build.integrationEntries;
    if (!first || !second) throw new Error('Integration fixture is incomplete.');
    const merged = {
      ...first,
      action: 'merge' as const,
      finalEntityIds: ['tag-bfs'],
    };
    const retired = {
      ...second,
      action: 'retire' as const,
      finalEntityIds: [],
    };
    const mergedBuild = {
      ...build,
      integrationEntries: [merged, retired],
      finalEntityIds: ['tag-bfs'],
    };
    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...mergedBuild,
        taxonomyDigest: canonicalDigest(taxonomyDigestSubject(mergedBuild)),
      }),
    ).toEqual([]);
  });

  it('regenerates final taxonomy from the complete Inventory without provisional IDs', () => {
    const build = buildFixture();
    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        finalEntityIds: [...build.finalEntityIds, 'provisional-tag-leftover'],
      }),
    ).toEqual(
      expect.arrayContaining(['final_taxonomy_not_deduplicated', 'final_taxonomy_digest_stale']),
    );
  });

  it('binds final taxonomy acceptance to a passed preview and its policy subject', () => {
    const build = buildFixture();
    expect(integrationViolations(previewEntityIds, inventoryProblemIds, build)).toEqual([]);

    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        previewSnapshotDigest: 'c'.repeat(64),
      }),
    ).toContain('final_taxonomy_digest_stale');

    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        previewSnapshotStatus: 'on_hold',
      }),
    ).toEqual(
      expect.arrayContaining(['preview_snapshot_not_passed', 'final_taxonomy_digest_stale']),
    );

    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        policy: { ...build.policy, version: '2.0.0' },
      }),
    ).toContain('final_taxonomy_digest_stale');
  });

  it('requires one reachable placement for every inventory Problem', () => {
    const build = buildFixture();
    expect(
      integrationViolations(previewEntityIds, inventoryProblemIds, {
        ...build,
        placementProblemIds: ['abc212-e'],
      }),
    ).toEqual(
      expect.arrayContaining(['placement_reachability_incomplete', 'final_taxonomy_digest_stale']),
    );
  });
});
