import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  canonicalDigest,
  canonicalJson,
  digestWithoutField,
} from '../../src/lib/domain/canonical-json.js';
import { FinalTaxonomyBuildSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import {
  FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT,
  FINAL_TAXONOMY_PROBLEM_COUNT,
  assembleFinalTaxonomyBuild,
  assertFrozenProvisionalEvidenceBoundToPreview,
  buildFinalTaxonomyFromPolicy,
  createFinalTaxonomyVerificationEvidence,
  defaultFinalTaxonomyBuildLayout,
  loadFinalTaxonomySourceContext,
  primaryOutcomeOwnerUnitId,
  validateFinalTaxonomyBuildAgainstContext,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';
import { FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH } from '../../src/lib/taxonomy/final-taxonomy-review.js';
import {
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  SINGLE_PROBLEM_OUTCOME_IDS,
  SINGLE_PROBLEM_TAG_IDS,
  SINGLE_PROBLEM_UNIT_IDS,
} from '../../src/lib/taxonomy/final-taxonomy-policy.js';

const loadedContext = loadFinalTaxonomySourceContext();
const loadedBuild = loadedContext.then((context) => ({
  context,
  build: buildFinalTaxonomyFromPolicy(context),
}));
const loadBuild = async () => {
  const { context, build } = await loadedBuild;
  // Reuse the expensive 868-Problem baseline without sharing mutable test data.
  return { context, build: structuredClone(build) };
};

describe('T159 deterministic full-corpus taxonomy build', () => {
  it('builds one schema-valid, source-closed placement for every accepted Problem', async () => {
    const { context, build } = await loadBuild();

    expect(FinalTaxonomyBuildSchema.parse(build)).toEqual(build);
    expect(build.inputs.placementDecisionTable).toEqual({
      path: context.layout.placementDecisionTablePath,
      version: context.placementDecisionTable.version,
      digest: context.placementDecisionTable.digest,
    });
    expect(
      validateFinalTaxonomyBuildAgainstContext(context, build, {
        nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
        nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
        singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
        singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
        singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
      }),
    ).toEqual([]);
    expect(build.placements).toHaveLength(FINAL_TAXONOMY_PROBLEM_COUNT);
    expect(new Set(build.placements.map(({ problemId }) => problemId)).size).toBe(
      FINAL_TAXONOMY_PROBLEM_COUNT,
    );
    const placementByProblemId = new Map(
      build.placements.map((placement) => [placement.problemId, placement]),
    );
    const unitOwnerByOutcomeId = new Map(
      build.finalCandidates
        .filter((candidate) => candidate.kind === 'unit')
        .flatMap(({ entity }) =>
          entity.ownedLearningOutcomeIds.map((id) => [id, entity.id] as const),
        ),
    );
    expect(placementByProblemId.get('abc218-f')).toMatchObject({
      primaryOutcomeId: 'outcome-localize-change-impact-by-witness',
      additionalPrimaryOutcomeIds: ['outcome-build-shortest-path-certificate'],
    });
    expect(unitOwnerByOutcomeId.get('outcome-localize-change-impact-by-witness')).toBe(
      'unit-change-impact-localization',
    );
    expect(placementByProblemId.get('abc335-g')).toMatchObject({
      primaryOutcomeId: 'outcome-count-through-cyclic-exponents',
      additionalPrimaryOutcomeIds: ['outcome-find-period-by-multiplicative-order'],
    });
    expect(placementByProblemId.get('abc335-g')?.supportingOutcomeIds).toContain(
      'outcome-invert-divisor-lattice-by-mobius',
    );
    expect(placementByProblemId.get('abc419-g')).toMatchObject({
      primaryTagIds: ['tag-cycle-space-basis', 'tag-near-tree-kernelization'],
      primaryOutcomeId: 'outcome-kernelize-near-tree-graph',
      additionalPrimaryOutcomeIds: ['outcome-use-cycle-space-basis'],
    });
    expect(unitOwnerByOutcomeId.get('outcome-kernelize-near-tree-graph')).toBe(
      'unit-near-tree-kernelization',
    );
    const nearTreeTag = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'tag' && candidate.entity.id === 'tag-near-tree-kernelization',
    );
    const nearTreeUnit = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'unit' && candidate.entity.id === 'unit-near-tree-kernelization',
    );
    const cycleSpaceOutcome = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'outcome' && candidate.entity.id === 'outcome-use-cycle-space-basis',
    );
    expect(nearTreeTag?.entity).toMatchObject({
      prerequisiteTagIds: ['tag-cycle-space-basis', 'tag-graph-core-peeling'],
    });
    expect(nearTreeUnit?.entity.id).toBe('unit-near-tree-kernelization');
    expect(cycleSpaceOutcome?.evidenceRefs).toEqual([
      expect.objectContaining({
        problemId: 'abc419-g',
        claimPath: '/outcomeCandidates/1',
      }),
    ]);
    const prefixMatchOutcome = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'outcome' && candidate.entity.id === 'outcome-build-prefix-match-state',
    );
    expect(prefixMatchOutcome?.kind).toBe('outcome');
    if (prefixMatchOutcome?.kind !== 'outcome') {
      throw new Error('Expected the prefix-match Outcome candidate.');
    }
    expect(prefixMatchOutcome.entity).toMatchObject({
      statement:
        '既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。',
    });
    expect(prefixMatchOutcome.entity.scopeIds).toEqual(
      expect.arrayContaining(['tag-z-algorithm-prefix-matching', 'unit-z-algorithm']),
    );
    expect(prefixMatchOutcome.entity.statement).not.toMatch(/failure link/iu);

    const heavyPathTag = build.finalCandidates.find(
      (candidate) => candidate.kind === 'tag' && candidate.entity.id === 'tag-heavy-path-tree-dp',
    );
    const heavyPathOutcome = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'outcome' &&
        candidate.entity.id === 'outcome-accelerate-tree-dp-by-heavy-path',
    );
    const heavyPathUnit = build.finalCandidates.find(
      (candidate) => candidate.kind === 'unit' && candidate.entity.id === 'unit-heavy-path-tree-dp',
    );
    expect(heavyPathTag?.entity).toMatchObject({
      prerequisiteTagIds: ['tag-convolution', 'tag-rooted-tree-aggregation'],
    });
    expect(heavyPathOutcome?.entity).toMatchObject({
      prerequisiteOutcomeIds: [
        'outcome-aggregate-rooted-tree',
        'outcome-compute-convolution-or-correlation',
      ],
    });
    expect(heavyPathUnit?.kind === 'unit' ? heavyPathUnit.entity.parentId : undefined).toBe(
      'unit-chapter-tree',
    );
    expect(build.learningUnitPrerequisites).toEqual(
      expect.arrayContaining([
        { nodeId: 'unit-heavy-path-tree-dp', prerequisiteId: 'unit-polynomial-convolution' },
        { nodeId: 'unit-heavy-path-tree-dp', prerequisiteId: 'unit-rooted-tree-aggregation' },
      ]),
    );
    expect(build.placements.every(({ kind }) => kind === 'full')).toBe(true);
    expect(build.integrationMap.entries).toHaveLength(FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT);
    expect(build.sourceRevisionIds).toHaveLength(1738);
    expect(context.referencedSourceRevisionIds).toHaveLength(1738);
    expect(context.knownSourceRevisionIds).toHaveLength(2246);
    expect(build.sourceRevisionIds).toEqual(context.referencedSourceRevisionIds);
    expect(build.inputs.inventory.authoringInventoryDigest).toBe(
      context.authoringEvidence.inventoryDigest,
    );
    expect(build.inputs.inventory.normalizedSourceSetDigest).toBe(
      context.authoringEvidence.normalizedSourceSet.digest,
    );
    expect(build.inputs.inventory.inventoryDigest).not.toBe(
      build.inputs.inventory.authoringInventoryDigest,
    );
  }, 60_000);

  it('homes every Problem in the unique owner Unit of its primary Outcome', async () => {
    const { build } = await loadBuild();
    expect(FinalTaxonomyBuildSchema.safeParse({ ...build, standardOrder: [] }).success).toBe(false);
    expect(
      FinalTaxonomyBuildSchema.safeParse({ ...build, orderDigest: '0'.repeat(64) }).success,
    ).toBe(false);
    const units = build.finalCandidates
      .filter((candidate) => candidate.kind === 'unit')
      .map(({ entity }) => entity);
    const outcomeOwnerUnitIds = new Map<string, string[]>();
    for (const unit of units) {
      for (const outcomeId of unit.ownedLearningOutcomeIds) {
        const ownerIds = outcomeOwnerUnitIds.get(outcomeId) ?? [];
        ownerIds.push(unit.id);
        outcomeOwnerUnitIds.set(outcomeId, ownerIds);
      }
    }
    for (const placement of build.placements) {
      const ownerIds = outcomeOwnerUnitIds.get(placement.primaryOutcomeId) ?? [];
      expect(ownerIds, placement.problemId).toHaveLength(1);
      const homeUnit = units.find(({ id }) => id === ownerIds[0]);
      expect(primaryOutcomeOwnerUnitId(placement), placement.problemId).toBe(ownerIds[0]);
      expect(homeUnit?.directProblemIds, placement.problemId).toContain(placement.problemId);
      expect(placement).not.toHaveProperty('learningUnitIds');
      expect(placement).not.toHaveProperty('presentationUnitId');
    }

    const byProblem = new Map(
      build.placements.map((placement) => [placement.problemId, placement]),
    );
    expect(byProblem.get('abc301-e')?.primaryOutcomeId).toBe(
      'outcome-enumerate-subset-state-space',
    );
    expect(byProblem.get('abc375-g')?.primaryOutcomeId).toBe(
      'outcome-identify-bridges-and-articulations',
    );
    const unitById = new Map(units.map((unit) => [unit.id, unit]));
    const shortestPathOwnerIds = outcomeOwnerUnitIds.get('outcome-model-and-compute-shortest-path');
    expect(shortestPathOwnerIds).toEqual(['unit-weighted-shortest-path']);
    for (const [problemId, homeUnitId, outcomeId] of [
      ['abc301-e', 'unit-dp-subset-state', 'outcome-enumerate-subset-state-space'],
      ['abc375-g', 'unit-lowlink-critical-structure', 'outcome-identify-bridges-and-articulations'],
    ] as const) {
      const placement = byProblem.get(problemId);
      expect(placement?.supportingOutcomeIds, problemId).toContain(
        'outcome-model-and-compute-shortest-path',
      );
      expect(outcomeOwnerUnitIds.get(outcomeId), problemId).toEqual([homeUnitId]);
      expect(unitById.get(homeUnitId)?.directProblemIds, problemId).toContain(problemId);
      expect(
        unitById.get('unit-weighted-shortest-path')?.directProblemIds,
        problemId,
      ).not.toContain(problemId);
      expect(unitById.get('unit-weighted-shortest-path')?.relatedProblemIds, problemId).toContain(
        problemId,
      );
    }
    expect(build.placements.every(({ kind }) => kind === 'full')).toBe(true);
  }, 60_000);

  it('derives the home solely from the primary Outcome when cross-reference roles change', async () => {
    const { build } = await loadBuild();
    const placement = build.placements.find(({ problemId }) => problemId === 'abc301-e');
    if (placement === undefined) throw new Error('Expected ABC301 E placement.');
    const home = primaryOutcomeOwnerUnitId(placement);
    const variants = [
      {
        ...placement,
        supportingOutcomeIds: ['outcome-prove-and-search-threshold'],
      },
      {
        ...placement,
        additionalPrimaryOutcomeIds: ['outcome-prove-and-search-threshold'],
      },
    ];
    expect(variants.map(primaryOutcomeOwnerUnitId)).toEqual([home, home]);
    expect(primaryOutcomeOwnerUnitId(placement)).toBe(home);
  }, 60_000);

  it('keeps placements stable when the Unit DAG gains an independent prerequisite', async () => {
    const { context, build } = await loadBuild();
    const extraEdge = {
      nodeId: 'unit-dp-subset-state',
      prerequisiteId: 'unit-dp-grid-table',
    };
    expect(build.learningUnitPrerequisites).not.toContainEqual(extraEdge);
    vi.resetModules();
    vi.doMock('../../src/lib/taxonomy/final-taxonomy-policy.js', async (importOriginal) => {
      const actual = await importOriginal<{
        FINAL_LEARNING_UNIT_PREREQUISITES: readonly {
          nodeId: string;
          prerequisiteId: string;
        }[];
      }>();
      return {
        ...actual,
        FINAL_LEARNING_UNIT_PREREQUISITES: [...actual.FINAL_LEARNING_UNIT_PREREQUISITES, extraEdge],
      };
    });
    try {
      const { buildFinalTaxonomyFromPolicy: buildWithExtraEdge } =
        await import('../../src/lib/taxonomy/final-taxonomy-build.js');
      const changed = buildWithExtraEdge(context);
      expect(changed.learningUnitPrerequisites).toContainEqual(extraEdge);
      expect(changed.learningUnitDagDigest).not.toBe(build.learningUnitDagDigest);
      expect(changed.placementDigest).toBe(build.placementDigest);
      expect(changed.placements).toEqual(build.placements);
    } finally {
      vi.doUnmock('../../src/lib/taxonomy/final-taxonomy-policy.js');
      vi.resetModules();
    }
  }, 60_000);

  it('keeps the placement digest stable when Unit DAG edges are enumerated in reverse', async () => {
    const { context, build } = await loadBuild();
    vi.resetModules();
    vi.doMock('../../src/lib/taxonomy/final-taxonomy-policy.js', async (importOriginal) => {
      const actual = await importOriginal<{
        FINAL_LEARNING_UNIT_PREREQUISITES: readonly {
          nodeId: string;
          prerequisiteId: string;
        }[];
      }>();
      return {
        ...actual,
        FINAL_LEARNING_UNIT_PREREQUISITES: [...actual.FINAL_LEARNING_UNIT_PREREQUISITES].reverse(),
      };
    });
    try {
      const { buildFinalTaxonomyFromPolicy: buildWithReversedEdges } =
        await import('../../src/lib/taxonomy/final-taxonomy-build.js');
      const changed = buildWithReversedEdges(context);
      expect(changed.learningUnitPrerequisites).toEqual(build.learningUnitPrerequisites);
      expect(changed.learningUnitDagDigest).toBe(build.learningUnitDagDigest);
      expect(changed.placementDigest).toBe(build.placementDigest);
    } finally {
      vi.doUnmock('../../src/lib/taxonomy/final-taxonomy-policy.js');
      vi.resetModules();
    }
  }, 60_000);

  it('rejects a placement decision table changed after the accepted build input was bound', async () => {
    const { context, build } = await loadBuild();
    const diagnostics = validateFinalTaxonomyBuildAgainstContext(
      {
        ...context,
        placementDecisionTable: {
          ...context.placementDecisionTable,
          digest: '0'.repeat(64),
        },
      },
      build,
      {
        nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
        nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
        singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
        singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
        singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
      },
    );

    expect(diagnostics.map(({ code }) => code)).toContain(
      'FINAL_TAXONOMY_PLACEMENT_POLICY_BINDING_MISMATCH',
    );
  }, 60_000);

  it('materializes unique direct Unit owners and exact descendant navigation rollups', async () => {
    const { build } = await loadBuild();
    const normalizeIds = (ids: readonly string[]): string[] => [...new Set(ids)].sort();
    const tagCandidates = build.finalCandidates.filter(
      (candidate): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'tag' }> =>
        candidate.kind === 'tag',
    );
    const outcomeCandidates = build.finalCandidates.filter(
      (
        candidate,
      ): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'outcome' }> =>
        candidate.kind === 'outcome',
    );
    const unitCandidates = build.finalCandidates.filter(
      (candidate): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'unit' }> =>
        candidate.kind === 'unit',
    );
    const unitIds = new Set(unitCandidates.map(({ entity }) => entity.id));
    const tagIds = new Set(tagCandidates.map(({ entity }) => entity.id));
    const unitById = new Map(unitCandidates.map(({ entity }) => [entity.id, entity]));
    const ownerUnitIdsForTag = (tagId: string): string[] =>
      unitCandidates
        .filter(({ entity }) => entity.ownedTagIds.includes(tagId))
        .map(({ entity }) => entity.id);
    const ownerUnitIdsForOutcome = (outcomeId: string): string[] =>
      unitCandidates
        .filter(({ entity }) => entity.ownedLearningOutcomeIds.includes(outcomeId))
        .map(({ entity }) => entity.id);
    const unitIsSameOrDescendant = (unitId: string, ancestorId: string): boolean => {
      const visited = new Set<string>();
      let currentId: string | null = unitId;
      while (currentId !== null && !visited.has(currentId)) {
        if (currentId === ancestorId) return true;
        visited.add(currentId);
        currentId = unitById.get(currentId)?.parentId ?? null;
      }
      return false;
    };

    for (const { entity: tag } of tagCandidates) {
      expect(ownerUnitIdsForTag(tag.id), tag.id).toHaveLength(1);
    }
    for (const { entity: outcome } of outcomeCandidates) {
      const ownerUnitIds = ownerUnitIdsForOutcome(outcome.id);
      const scopedUnitIds = outcome.scopeIds.filter((scopeId) => unitIds.has(scopeId));
      const scopedTagOwnerUnitIds = outcome.scopeIds
        .filter((scopeId) => tagIds.has(scopeId))
        .flatMap(ownerUnitIdsForTag);
      expect(ownerUnitIds, outcome.id).toHaveLength(1);
      expect(normalizeIds(scopedUnitIds), outcome.id).toEqual(ownerUnitIds);
      expect(normalizeIds(scopedTagOwnerUnitIds), outcome.id).toEqual(ownerUnitIds);
    }
    for (const { entity: unit } of unitCandidates) {
      const children = unitCandidates.filter(({ entity }) => entity.parentId === unit.id);
      const expectedDirectProblemIds = build.placements
        .filter((placement) => ownerUnitIdsForOutcome(placement.primaryOutcomeId).includes(unit.id))
        .map(({ problemId }) => problemId);
      expect(normalizeIds(unit.directProblemIds), unit.id).toEqual(
        normalizeIds(expectedDirectProblemIds),
      );
      expect(normalizeIds(unit.problemIds), unit.id).toEqual(
        normalizeIds([
          ...unit.directProblemIds,
          ...children.flatMap(({ entity }) => entity.problemIds),
        ]),
      );
      expect(
        unit.relatedProblemIds.some((id) => unit.problemIds.includes(id)),
        unit.id,
      ).toBe(false);
      const expectedRelatedProblemIds = build.placements
        .filter((placement) => {
          const homeUnitId = ownerUnitIdsForOutcome(placement.primaryOutcomeId)[0];
          if (homeUnitId === undefined || unitIsSameOrDescendant(homeUnitId, unit.id)) return false;
          return [...placement.additionalPrimaryOutcomeIds, ...placement.supportingOutcomeIds].some(
            (outcomeId) =>
              ownerUnitIdsForOutcome(outcomeId).some((ownerId) =>
                unitIsSameOrDescendant(ownerId, unit.id),
              ),
          );
        })
        .map(({ problemId }) => problemId);
      expect(normalizeIds(unit.relatedProblemIds), `${unit.id}/relatedProblemIds`).toEqual(
        normalizeIds(expectedRelatedProblemIds),
      );
      expect(Array.isArray(unit.ownedTagIds), unit.id).toBe(true);
      expect(Array.isArray(unit.ownedLearningOutcomeIds), unit.id).toBe(true);
      expect(normalizeIds(unit.tagIds), `${unit.id}/tagIds`).toEqual(
        normalizeIds([...unit.ownedTagIds, ...children.flatMap(({ entity }) => entity.tagIds)]),
      );
      expect(normalizeIds(unit.learningOutcomeIds), `${unit.id}/learningOutcomeIds`).toEqual(
        normalizeIds([
          ...unit.ownedLearningOutcomeIds,
          ...children.flatMap(({ entity }) => entity.learningOutcomeIds),
        ]),
      );
      if (unit.ownedTagIds.length === 0 && unit.ownedLearningOutcomeIds.length === 0) {
        expect(children.length, unit.id).toBeGreaterThan(0);
      }
    }
    for (const placement of build.placements) {
      expect(ownerUnitIdsForOutcome(placement.primaryOutcomeId), placement.problemId).toHaveLength(
        1,
      );
      expect(placement).not.toHaveProperty('learningUnitIds');
      expect(placement).not.toHaveProperty('presentationUnitId');
    }
  }, 60_000);

  it('is byte-stable and does not use preview candidates to synthesize canonical taxonomy', async () => {
    const { context, build } = await loadBuild();
    const reversedContext = { ...context, records: [...context.records].reverse() };
    const reversedBuild = buildFinalTaxonomyFromPolicy(reversedContext);

    expect(canonicalJson(reversedBuild)).toBe(canonicalJson(build));
    expect(reversedBuild.buildDigest).toBe(build.buildDigest);
    expect(build.generatedAt).toBe(
      build.status === 'accepted'
        ? build.reviewEvidenceRefs.length === 1
          ? build.acceptedAt
          : null
        : context.workManifest.createdAt,
    );
    expect(build.taxonomyDigest).toBe(canonicalDigest(build.finalCandidates));
    expect(build.tagDagDigest).toBe(canonicalDigest(build.tagPrerequisites));
    expect(build.learningUnitDagDigest).toBe(canonicalDigest(build.learningUnitPrerequisites));
    expect(build.placementDigest).toBe(canonicalDigest(build.placements));
  }, 60_000);

  it('propagates the manifest third-party review policy to every integration entry', async () => {
    const context = await loadedContext;
    const thirdPartyContext = {
      ...context,
      workManifest: {
        ...context.workManifest,
        reviewPolicy: {
          requiredMode: 'third_party' as const,
          riskReasons: ['major_classification_change' as const],
        },
      },
    };

    const build = buildFinalTaxonomyFromPolicy(thirdPartyContext);

    expect(build.integrationMap.entries).not.toHaveLength(0);
    expect(
      build.integrationMap.entries.every(
        (entry) =>
          entry.reviewPolicy.requiredMode === 'third_party' &&
          entry.reviewPolicy.riskReasons.includes('major_classification_change') &&
          entry.reviewPolicy.highRiskSelfReviewReason === undefined,
      ),
    ).toBe(true);
  }, 60_000);

  it('binds the exact T154 metadata component and provisional integration, not only its taxonomy digest', async () => {
    const context = await loadedContext;
    const changedCandidates = context.provisionalEvidence.candidates.map((candidate, index) =>
      index === 0
        ? { ...candidate, rationale: `${candidate.rationale} Changed after T154.` }
        : candidate,
    );
    const changedEvidenceWithoutDigest = {
      ...context.provisionalEvidence,
      candidates: changedCandidates,
    };
    const changedEvidence = {
      ...changedEvidenceWithoutDigest,
      integrationDigest: digestWithoutField(changedEvidenceWithoutDigest, 'integrationDigest'),
    };
    const binding = {
      previewSnapshot: context.previewSnapshot,
      previewSnapshotPath: context.previewReference.canonicalSnapshotPath,
      metadataComponentPath: context.layout.provisionalMetadataComponentPath,
      provisionalIntegrationPath: context.layout.provisionalIntegrationPath,
    } as const;

    expect(() => {
      assertFrozenProvisionalEvidenceBoundToPreview({
        ...binding,
        metadataComponent: context.provisionalMetadataComponent,
        provisionalEvidence: context.provisionalEvidence,
      });
    }).not.toThrow();

    expect(() => {
      assertFrozenProvisionalEvidenceBoundToPreview({
        ...binding,
        metadataComponent: context.provisionalMetadataComponent,
        provisionalEvidence: changedEvidence,
      });
    }).toThrow(/PREVIEW_PROVISIONAL_INTEGRATION_DIGEST_MISMATCH/u);

    expect(() => {
      assertFrozenProvisionalEvidenceBoundToPreview({
        ...binding,
        metadataComponent: {
          ...context.provisionalMetadataComponent,
          integrationDigest: changedEvidence.integrationDigest,
        },
        provisionalEvidence: changedEvidence,
      });
    }).toThrow(/PREVIEW_METADATA_COMPONENT_DIGEST_MISMATCH/u);
  }, 60_000);

  it('rejects a changed T154 metadata component through the source-context loader', async () => {
    const layout = defaultFinalTaxonomyBuildLayout();
    const temporaryRoot = await mkdtemp(
      path.join(layout.repositoryRoot, '.final-taxonomy-metadata-test-'),
    );
    try {
      const sourcePath = path.join(layout.repositoryRoot, layout.provisionalMetadataComponentPath);
      const metadata = JSON.parse(await readFile(sourcePath, 'utf8')) as Record<string, unknown>;
      const changedMetadataPath = path.join(temporaryRoot, 'metadata-inventory-taxonomy.json');
      await writeFile(
        changedMetadataPath,
        `${JSON.stringify({ ...metadata, proposalDigest: '0'.repeat(64) }, null, 2)}\n`,
        'utf8',
      );
      const changedMetadataRelativePath = path.relative(layout.repositoryRoot, changedMetadataPath);

      await expect(
        loadFinalTaxonomySourceContext({
          ...layout,
          provisionalMetadataComponentPath: changedMetadataRelativePath,
        }),
      ).rejects.toThrow(/PREVIEW_METADATA_COMPONENT_DIGEST_MISMATCH/u);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  }, 60_000);

  it('preserves decision audit data, ad-hoc insights, reuse gates, and curriculum prerequisites independently of navigation', async () => {
    const { context, build } = await loadBuild();
    const recordsById = new Map(context.records.map((record) => [record.problemId, record]));
    const placementByProblemId = new Map(
      build.placements.map((placement) => [placement.problemId, placement]),
    );
    const rootTagIds = new Set(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'tag' && candidate.entity.parentId === null ? [candidate.entity.id] : [],
      ),
    );
    const parentTagIdByTagId = new Map(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'tag' ? [[candidate.entity.id, candidate.entity.parentId] as const] : [],
      ),
    );
    const isSameOrDescendantTag = (tagId: string, ancestorTagId: string): boolean => {
      let currentTagId: string | null = tagId;
      while (currentTagId !== null) {
        if (currentTagId === ancestorTagId) return true;
        currentTagId = parentTagIdByTagId.get(currentTagId) ?? null;
      }
      return false;
    };
    for (const placement of build.placements) {
      expect(placement.primaryTagIds.some((id) => rootTagIds.has(id))).toBe(false);
      expect(placement.primaryTagIds.some((id) => NON_PRIMARY_TAG_IDS.includes(id))).toBe(false);
      expect(NON_PRIMARY_OUTCOME_IDS).not.toContain(placement.primaryOutcomeId);
      expect(placement.rationale).toMatch(/選択理由: .+/u);
      expect(placement.comparison.method).toMatch(/採用手法/u);
      const record = recordsById.get(placement.problemId);
      const expectedDispositionPaths = [
        ...(record?.typicalTechniques.map((_, index) => `/typicalTechniques/${String(index)}`) ??
          []),
        ...(record?.prerequisiteCandidates.map(
          (_, index) => `/prerequisiteCandidates/${String(index)}`,
        ) ?? []),
      ].sort();
      const actualDispositionPaths = [
        ...new Set(placement.claimDispositions.map(({ claimRef }) => claimRef.claimPath)),
      ].sort();
      expect(actualDispositionPaths).toEqual(expect.arrayContaining(expectedDispositionPaths));
      for (const extraPath of actualDispositionPaths.filter(
        (claimPath) => !expectedDispositionPaths.includes(claimPath),
      )) {
        expect(extraPath).toMatch(/^\/implementationConcerns\/(0|[1-9]\d*)$/u);
      }
      expect(placement.adHocElements).toEqual(
        record?.problemSpecificInsights
          .map(
            ({ insight, reusablePerspective }) =>
              `${insight}（再利用可能な見方: ${reusablePerspective}）`,
          )
          .sort(),
      );
    }
    for (const candidate of build.finalCandidates) {
      if (candidate.kind === 'tag' && candidate.entity.parentId !== null) {
        expect(candidate.entity.aliases.length).toBeGreaterThan(0);
        const assigned = build.placements.filter((placement) =>
          [...placement.primaryTagIds, ...placement.supportingTagIds].includes(candidate.entity.id),
        );
        expect(assigned.length).toBeGreaterThanOrEqual(
          SINGLE_PROBLEM_TAG_IDS.includes(candidate.entity.id) ? 1 : 2,
        );
        for (const problemId of candidate.entity.representativeProblemIds) {
          expect(
            [
              ...(placementByProblemId.get(problemId)?.primaryTagIds ?? []),
              ...(placementByProblemId.get(problemId)?.supportingTagIds ?? []),
            ].some((tagId) => isSameOrDescendantTag(tagId, candidate.entity.id)),
          ).toBe(true);
        }
      } else if (candidate.kind === 'outcome') {
        expect(candidate.materializationTask).toBe('T048');
        const directAssignments = build.placements.filter((placement) =>
          [
            placement.primaryOutcomeId,
            ...placement.additionalPrimaryOutcomeIds,
            ...placement.supportingOutcomeIds,
          ].includes(candidate.entity.id),
        );
        const primaryAssignments = directAssignments.filter(
          (placement) =>
            placement.primaryOutcomeId === candidate.entity.id ||
            placement.additionalPrimaryOutcomeIds.includes(candidate.entity.id),
        );
        if (primaryAssignments.length > 0) {
          const primaryProblemIds = new Set(
            primaryAssignments.map((placement) => placement.problemId),
          );
          expect(
            candidate.evidenceRefs.some(({ problemId }) => primaryProblemIds.has(problemId)),
          ).toBe(true);
        }
        if (NON_PRIMARY_OUTCOME_IDS.includes(candidate.entity.id)) {
          expect(directAssignments).toEqual([]);
          expect(candidate.evidenceRefs.length).toBeGreaterThan(0);
        } else if (SINGLE_PROBLEM_OUTCOME_IDS.includes(candidate.entity.id)) {
          expect(directAssignments).toHaveLength(1);
        } else {
          expect(directAssignments.length).toBeGreaterThanOrEqual(2);
        }
      } else if (candidate.kind === 'unit' && candidate.entity.kind !== 'chapter') {
        const problemCount = new Set([
          ...candidate.entity.problemIds,
          ...candidate.entity.relatedProblemIds,
        ]).size;
        if (SINGLE_PROBLEM_UNIT_IDS.includes(candidate.entity.id)) {
          expect(problemCount).toBe(1);
        } else {
          expect(problemCount).toBeGreaterThanOrEqual(2);
        }
        expect(candidate.entity.excludedTopics.length).toBeGreaterThan(0);
      }
    }
    const modularArithmeticOutcome = build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'outcome' &&
        candidate.entity.id === 'outcome-compute-in-modular-arithmetic',
    );
    expect(modularArithmeticOutcome?.evidenceRefs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          problemId: 'abc228-e',
          claimPath: '/outcomeCandidates/0',
        }),
      ]),
    );
    const outcomeById = new Map(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'outcome' ? [[candidate.entity.id, candidate] as const] : [],
      ),
    );
    const ownerUnitIdsByOutcomeId = new Map<string, string[]>();
    for (const candidate of build.finalCandidates) {
      if (candidate.kind !== 'unit') continue;
      for (const outcomeId of candidate.entity.ownedLearningOutcomeIds) {
        const owners = ownerUnitIdsByOutcomeId.get(outcomeId) ?? [];
        owners.push(candidate.entity.id);
        ownerUnitIdsByOutcomeId.set(outcomeId, owners);
      }
    }
    const rationales = build.finalCandidates.flatMap((candidate) =>
      candidate.kind === 'unit' ? [candidate.entity.learningRationale] : [],
    );
    expect(new Set(rationales).size).toBe(rationales.length);
    for (const placement of build.placements) {
      const primaryOwnerIds = ownerUnitIdsByOutcomeId.get(placement.primaryOutcomeId) ?? [];
      expect(primaryOwnerIds, placement.problemId).toHaveLength(1);
      expect(
        build.finalCandidates.some(
          (candidate) =>
            candidate.kind === 'unit' &&
            candidate.entity.id === primaryOwnerIds[0] &&
            candidate.entity.directProblemIds.includes(placement.problemId),
        ),
      ).toBe(true);
      expect(placement).not.toHaveProperty('learningUnitIds');
      expect(placement).not.toHaveProperty('presentationUnitId');
      for (const outcomeId of [
        ...placement.additionalPrimaryOutcomeIds,
        ...placement.supportingOutcomeIds,
      ]) {
        expect(outcomeById.has(outcomeId), `${placement.problemId}/${outcomeId}`).toBe(true);
      }
    }
    const canonicalOutcomeIds = new Set(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'outcome' ? [candidate.entity.id] : [],
      ),
    );
    expect(
      build.placements.every((placement) =>
        [
          placement.primaryOutcomeId,
          ...placement.additionalPrimaryOutcomeIds,
          ...placement.supportingOutcomeIds,
        ].every((outcomeId) => canonicalOutcomeIds.has(outcomeId)),
      ),
    ).toBe(true);
  }, 60_000);

  it('binds review artifacts directly to the subject digest and stays on hold until acceptance', async () => {
    const { context, build } = await loadBuild();
    const verification = createFinalTaxonomyVerificationEvidence(context, build);

    expect(verification.taxonomySubjectDigest).toBe(build.taxonomySubjectDigest);
    expect(verification.reviewCheckResultsPath).toBe(FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH);
    expect(verification.status).toBe(build.status === 'accepted' ? 'passed' : 'on_hold');
    expect(verification.canonicalMaterializationAllowed).toBe(build.status === 'accepted');
  }, 60_000);

  it('rejects unknown references, cyclic prerequisite graphs, unclassified Problems, incomplete impacts, and a non-owner home', async () => {
    const { context, build } = await loadBuild();

    const unknownReference = structuredClone(build);
    const firstPlacement = unknownReference.placements[0];
    if (firstPlacement === undefined) throw new Error('Expected at least one placement.');
    firstPlacement.primaryTagIds = ['tag-unknown-final'];
    expect(FinalTaxonomyBuildSchema.safeParse(unknownReference).success).toBe(false);

    const tagCycle = structuredClone(build);
    const tags = tagCycle.finalCandidates.filter((candidate) => candidate.kind === 'tag');
    const firstTag = tags[0];
    const secondTag = tags[1];
    if (firstTag === undefined || secondTag === undefined) {
      throw new Error('Expected at least two Tag candidates.');
    }
    firstTag.entity.prerequisiteTagIds = [secondTag.entity.id];
    secondTag.entity.prerequisiteTagIds = [firstTag.entity.id];
    expect(FinalTaxonomyBuildSchema.safeParse(tagCycle).success).toBe(false);

    const unitCycle = structuredClone(build);
    const [firstUnit, secondUnit] = unitCycle.finalCandidates
      .filter((candidate) => candidate.kind === 'unit')
      .slice(0, 2)
      .map(({ entity }) => entity.id);
    if (firstUnit === undefined || secondUnit === undefined) {
      throw new Error('Expected at least two Unit candidates.');
    }
    unitCycle.learningUnitPrerequisites = [
      { nodeId: firstUnit, prerequisiteId: secondUnit },
      { nodeId: secondUnit, prerequisiteId: firstUnit },
    ];
    unitCycle.learningUnitDagDigest = canonicalDigest(unitCycle.learningUnitPrerequisites);
    expect(FinalTaxonomyBuildSchema.safeParse(unitCycle).error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['learningUnitPrerequisites'],
          message: 'Learning Unit DAG is stale.',
        }),
      ]),
    );

    const unclassified = structuredClone(build);
    unclassified.placements.pop();
    expect(FinalTaxonomyBuildSchema.safeParse(unclassified).success).toBe(false);

    const incompleteImpact = structuredClone(build);
    const firstImpact = incompleteImpact.correctionImpacts[0];
    if (firstImpact === undefined) throw new Error('Expected at least one correction impact.');
    firstImpact.surfaceAssessments.pop();
    expect(FinalTaxonomyBuildSchema.safeParse(incompleteImpact).success).toBe(false);

    const wrongHome = structuredClone(build);
    const placement = wrongHome.placements.find(({ problemId }) => problemId === 'abc212-g');
    if (placement === undefined) throw new Error('Expected the abc212-g placement.');
    const homeUnit = wrongHome.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'unit' &&
        candidate.entity.ownedLearningOutcomeIds.includes(placement.primaryOutcomeId),
    );
    if (homeUnit?.kind !== 'unit') throw new Error('Expected the primary Outcome owner Unit.');
    homeUnit.entity.directProblemIds = homeUnit.entity.directProblemIds.filter(
      (id) => id !== placement.problemId,
    );
    const integrationEntries = wrongHome.integrationMap.entries.map((entry) => {
      const { reviewEvidenceId: _reviewEvidenceId, status: _status, ...semanticEntry } = entry;
      void _reviewEvidenceId;
      void _status;
      return semanticEntry;
    });
    const correctionImpacts = wrongHome.correctionImpacts.map((impact) => {
      const {
        impactSubjectDigest: _impactSubjectDigest,
        verificationStatus: _verificationStatus,
        ...semanticImpact
      } = impact;
      void _impactSubjectDigest;
      void _verificationStatus;
      return semanticImpact;
    });
    expect(() =>
      assembleFinalTaxonomyBuild(context, {
        policy: {
          name: wrongHome.policy.name,
          version: wrongHome.policy.version,
          inputScope: wrongHome.policy.inputScope,
          rulesDigest: wrongHome.policy.rulesDigest,
        },
        finalCandidates: wrongHome.finalCandidates,
        placements: wrongHome.placements,
        integrationEntries,
        correctionImpacts,
        nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
        nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
        singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
        singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
        singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
      }),
    ).toThrow();
  }, 60_000);
});
