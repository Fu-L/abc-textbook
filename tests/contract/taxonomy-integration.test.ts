import { describe, expect, it } from 'vitest';

import {
  finalTaxonomyDigest,
  validateTaxonomyIntegration,
  type FinalTaxonomyBuild,
  type IntegrationEntry,
} from '../../src/lib/preview/taxonomy-integration.js';

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
    ] satisfies readonly IntegrationEntry[],
    finalEntityIds: ['tag-bfs', 'unit-bfs', 'unit-dijkstra'],
    placementProblemIds: ['abc212-e', 'abc213-f'],
  };
  return {
    ...subject,
    taxonomyDigest: finalTaxonomyDigest(subject),
  };
};

describe('US2 preview-to-final taxonomy integration contract', () => {
  const previewEntityIds = ['preview-tag-bfs', 'preview-unit-search'];
  const inventoryProblemIds = ['abc212-e', 'abc213-f'];

  it('maps every provisional entity exactly once through promote/merge/split/retire', () => {
    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, buildFixture()),
    ).toEqual([]);

    const incomplete = buildFixture();
    const [first] = incomplete.integrationEntries;
    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
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
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
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
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...mergedBuild,
        taxonomyDigest: finalTaxonomyDigest(mergedBuild),
      }),
    ).toEqual([]);
  });

  it('regenerates final taxonomy from the complete Inventory without provisional IDs', () => {
    const build = buildFixture();
    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...build,
        finalEntityIds: [...build.finalEntityIds, 'provisional-tag-leftover'],
      }),
    ).toEqual(
      expect.arrayContaining(['final_taxonomy_not_deduplicated', 'final_taxonomy_digest_stale']),
    );
  });

  it('binds final taxonomy acceptance to a passed preview and its policy subject', () => {
    const build = buildFixture();
    expect(validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, build)).toEqual([]);

    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...build,
        previewSnapshotDigest: 'c'.repeat(64),
      }),
    ).toContain('final_taxonomy_digest_stale');

    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...build,
        previewSnapshotStatus: 'on_hold',
      }),
    ).toEqual(
      expect.arrayContaining(['preview_snapshot_not_passed', 'final_taxonomy_digest_stale']),
    );

    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...build,
        policy: { ...build.policy, version: '2.0.0' },
      }),
    ).toContain('final_taxonomy_digest_stale');
  });

  it('requires one reachable placement for every inventory Problem', () => {
    const build = buildFixture();
    expect(
      validateTaxonomyIntegration(previewEntityIds, inventoryProblemIds, {
        ...build,
        placementProblemIds: ['abc212-e'],
      }),
    ).toEqual(
      expect.arrayContaining(['placement_reachability_incomplete', 'final_taxonomy_digest_stale']),
    );
  });
});
