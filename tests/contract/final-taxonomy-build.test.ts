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
      expect(
        [...new Set(placement.claimDispositions.map(({ claimRef }) => claimRef.claimPath))].sort(),
      ).toEqual(expectedDispositionPaths);
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
    ).toThrow(/PLACEMENT_PRIMARY_HOME_UNIT_INVALID/u);
  }, 30_000);
});
