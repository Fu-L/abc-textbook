import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

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
const loadBuild = async () => {
  const context = await loadedContext;
  return { context, build: buildFinalTaxonomyFromPolicy(context) };
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
    expect(placementByProblemId.get('abc218-f')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-build-shortest-path-certificate',
    ]);
    expect(placementByProblemId.get('abc218-f')?.supportingOutcomeIds).not.toContain(
      'outcome-build-shortest-path-certificate',
    );
    expect(placementByProblemId.get('abc335-g')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-find-period-by-multiplicative-order',
    ]);
    expect(placementByProblemId.get('abc419-g')).toMatchObject({
      primaryTagIds: ['tag-cycle-space-basis', 'tag-near-tree-kernelization'],
      primaryOutcomeId: 'outcome-kernelize-near-tree-graph',
      additionalPrimaryOutcomeIds: ['outcome-use-cycle-space-basis'],
      presentationUnitId: 'unit-near-tree-kernelization',
    });
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
    expect(nearTreeUnit?.entity).toMatchObject({
      additionalPrerequisiteUnitIds: ['unit-cycle-space-basis', 'unit-graph-core'],
    });
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
      prerequisiteTagIds: ['tag-rooted-tree-aggregation'],
    });
    expect(heavyPathOutcome?.entity).toMatchObject({
      prerequisiteOutcomeIds: ['outcome-aggregate-rooted-tree'],
    });
    expect(heavyPathUnit?.entity).toMatchObject({
      parentId: 'unit-tree-aggregation',
      additionalPrerequisiteUnitIds: ['unit-rooted-tree-aggregation'],
    });
    const orderIndex = new Map(build.standardOrder.map((unitId, index) => [unitId, index]));
    expect(orderIndex.get('unit-rooted-tree-aggregation')).toBeLessThan(
      orderIndex.get('unit-heavy-path-tree-dp') ?? -1,
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
  }, 30_000);

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
  }, 30_000);

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
    const orderIndex = new Map(build.standardOrder.map((unitId, index) => [unitId, index]));
    const ownerUnitIdsForTag = (tagId: string): string[] =>
      unitCandidates
        .filter(({ entity }) => entity.ownedTagIds.includes(tagId))
        .map(({ entity }) => entity.id);
    const ownerUnitIdsForOutcome = (outcomeId: string): string[] =>
      unitCandidates
        .filter(({ entity }) => entity.ownedLearningOutcomeIds.includes(outcomeId))
        .map(({ entity }) => entity.id);

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
      const primaryOutcomeIds = [
        placement.primaryOutcomeId,
        ...placement.additionalPrimaryOutcomeIds,
      ];
      const assignedOutcomeIds = [...primaryOutcomeIds, ...placement.supportingOutcomeIds];
      const primaryOwnerUnitIds = normalizeIds(primaryOutcomeIds.flatMap(ownerUnitIdsForOutcome));
      const assignedOwnerUnitIds = normalizeIds(assignedOutcomeIds.flatMap(ownerUnitIdsForOutcome));
      const expectedPresentationUnitId = [...primaryOwnerUnitIds]
        .sort(
          (left, right) =>
            (orderIndex.get(left) ?? Number.POSITIVE_INFINITY) -
              (orderIndex.get(right) ?? Number.POSITIVE_INFINITY) || left.localeCompare(right),
        )
        .at(-1);
      expect(normalizeIds(placement.learningUnitIds), placement.problemId).toEqual(
        assignedOwnerUnitIds,
      );
      expect(placement.presentationUnitId, placement.problemId).toBe(expectedPresentationUnitId);
    }
  }, 30_000);

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
    expect(build.orderDigest).toBe(canonicalDigest(build.standardOrder));
    expect(build.placementDigest).toBe(canonicalDigest(build.placements));
  }, 30_000);

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
  }, 30_000);

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
  }, 30_000);

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
  }, 30_000);

  it('preserves decision audit data, ad-hoc insights, reuse gates, and parent-before-child order', async () => {
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
        const problemCount = new Set(candidate.entity.problemIds).size;
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
    const orderIndex = new Map(build.standardOrder.map((id, index) => [id, index]));
    const learningUnitIds = new Set(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'unit' ? [candidate.entity.id] : [],
      ),
    );
    const outcomeById = new Map(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'outcome' ? [[candidate.entity.id, candidate] as const] : [],
      ),
    );
    const unitOrderReasons = build.finalCandidates.flatMap((candidate) =>
      candidate.kind === 'unit' ? [candidate.entity.orderReason] : [],
    );
    expect(new Set(unitOrderReasons).size).toBe(unitOrderReasons.length);
    for (const candidate of build.finalCandidates) {
      if (candidate.kind === 'unit' && candidate.entity.parentId !== null) {
        expect(orderIndex.get(candidate.entity.parentId)).toBeLessThan(
          orderIndex.get(candidate.entity.id) ?? -1,
        );
      }
    }
    for (const placement of build.placements) {
      const presentationIndex = orderIndex.get(placement.presentationUnitId) ?? -1;
      const primaryLearningUnitIds = [
        placement.primaryOutcomeId,
        ...placement.additionalPrimaryOutcomeIds,
      ].flatMap(
        (outcomeId) =>
          outcomeById
            .get(outcomeId)
            ?.entity.scopeIds.filter((scopeId) => learningUnitIds.has(scopeId)) ?? [],
      );
      expect(primaryLearningUnitIds.length).toBeGreaterThan(0);
      expect(
        primaryLearningUnitIds.every(
          (unitId) => (orderIndex.get(unitId) ?? Number.POSITIVE_INFINITY) <= presentationIndex,
        ),
      ).toBe(true);
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
  }, 30_000);

  it('binds review artifacts directly to the subject digest and stays on hold until acceptance', async () => {
    const { context, build } = await loadBuild();
    const verification = createFinalTaxonomyVerificationEvidence(context, build);

    expect(verification.taxonomySubjectDigest).toBe(build.taxonomySubjectDigest);
    expect(verification.reviewCheckResultsPath).toBe(FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH);
    expect(verification.status).toBe(build.status === 'accepted' ? 'passed' : 'on_hold');
    expect(verification.canonicalMaterializationAllowed).toBe(build.status === 'accepted');
  }, 30_000);

  it('rejects unknown references, cycles, order drift, unclassified Problems, incomplete impacts, and supporting Home ownership', async () => {
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

    const orderDrift = structuredClone(build);
    orderDrift.standardOrder.reverse();
    expect(FinalTaxonomyBuildSchema.safeParse(orderDrift).success).toBe(false);

    const unclassified = structuredClone(build);
    unclassified.placements.pop();
    expect(FinalTaxonomyBuildSchema.safeParse(unclassified).success).toBe(false);

    const incompleteImpact = structuredClone(build);
    const firstImpact = incompleteImpact.correctionImpacts[0];
    if (firstImpact === undefined) throw new Error('Expected at least one correction impact.');
    firstImpact.surfaceAssessments.pop();
    expect(FinalTaxonomyBuildSchema.safeParse(incompleteImpact).success).toBe(false);

    const supportingUnitAsHome = structuredClone(build);
    const cyclicExponentPlacement = supportingUnitAsHome.placements.find(
      ({ problemId }) => problemId === 'abc212-g',
    );
    if (cyclicExponentPlacement === undefined) {
      throw new Error('Expected the abc212-g placement.');
    }
    expect(cyclicExponentPlacement.learningUnitIds).toContain('unit-divisor-mobius-inversion');
    cyclicExponentPlacement.presentationUnitId = 'unit-divisor-mobius-inversion';
    const integrationEntries = supportingUnitAsHome.integrationMap.entries.map((entry) => {
      const { reviewEvidenceId: _reviewEvidenceId, status: _status, ...semanticEntry } = entry;
      void _reviewEvidenceId;
      void _status;
      return semanticEntry;
    });
    const correctionImpacts = supportingUnitAsHome.correctionImpacts.map((impact) => {
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
          name: supportingUnitAsHome.policy.name,
          version: supportingUnitAsHome.policy.version,
          inputScope: supportingUnitAsHome.policy.inputScope,
          rulesDigest: supportingUnitAsHome.policy.rulesDigest,
        },
        finalCandidates: supportingUnitAsHome.finalCandidates,
        placements: supportingUnitAsHome.placements,
        integrationEntries,
        correctionImpacts,
        nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
        nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
        singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
        singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
        singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
      }),
    ).toThrow(/must bind assigned Outcomes|PLACEMENT_PRIMARY_HOME_UNIT_INVALID/u);
  }, 30_000);
});
