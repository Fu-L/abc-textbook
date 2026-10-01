import { describe, expect, it } from 'vitest';

import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { FinalTaxonomyBuildSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import {
  FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT,
  buildFinalTaxonomyFromPolicy,
  loadFinalTaxonomySourceContext,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';

const loaded = loadFinalTaxonomySourceContext().then((context) => ({
  context,
  build: buildFinalTaxonomyFromPolicy(context),
}));

const assignedEntityIds = (
  placement: Awaited<typeof loaded>['build']['placements'][number],
  kind: 'tag' | 'outcome' | 'unit',
  ownerUnitIdsByOutcomeId: ReadonlyMap<string, string[]>,
): readonly string[] =>
  kind === 'tag'
    ? [...placement.primaryTagIds, ...placement.supportingTagIds]
    : kind === 'outcome'
      ? [
          placement.primaryOutcomeId,
          ...placement.additionalPrimaryOutcomeIds,
          ...placement.supportingOutcomeIds,
        ]
      : [
          placement.primaryOutcomeId,
          ...placement.additionalPrimaryOutcomeIds,
          ...placement.supportingOutcomeIds,
        ].flatMap((outcomeId) => ownerUnitIdsByOutcomeId.get(outcomeId) ?? []);

describe('T159 frozen preview integration and correction impact', () => {
  it('maps all 12 frozen entities without changing their evidence projection', async () => {
    const { context, build } = await loaded;
    const integration = build.integrationMap;
    const ownerUnitIdsByOutcomeId = new Map<string, string[]>();
    for (const candidate of build.finalCandidates) {
      if (candidate.kind !== 'unit') continue;
      for (const outcomeId of candidate.entity.ownedLearningOutcomeIds) {
        const owners = ownerUnitIdsByOutcomeId.get(outcomeId) ?? [];
        owners.push(candidate.entity.id);
        ownerUnitIdsByOutcomeId.set(outcomeId, owners);
      }
    }

    expect(integration.entries).toHaveLength(FINAL_TAXONOMY_PREVIEW_ENTITY_COUNT);
    expect(integration.provisionalEvidence).toEqual(context.provisionalEvidence);
    expect(canonicalJson(integration.provisionalEvidence)).toBe(
      canonicalJson(context.provisionalEvidence),
    );
    expect(integration.entries.map(({ previewEntityId }) => previewEntityId).sort()).toEqual(
      context.provisionalEvidence.candidates.map(({ previewEntityId }) => previewEntityId).sort(),
    );
    expect(
      integration.entries.every(
        ({ legacyDisposition }) =>
          legacyDisposition.kind === 'retired' ||
          (legacyDisposition.kind === 'redirect'
            ? legacyDisposition.aliases.every((alias) => !alias.includes('->'))
            : legacyDisposition.targets.every(({ aliases }) =>
                aliases.every((alias) => !alias.includes('->')),
              )),
      ),
    ).toBe(true);
  }, 30_000);

  it('allows composite Tag overlap but requires exact affected union and disjoint Outcome splits', async () => {
    const { build } = await loaded;
    const placementByProblemId = new Map(
      build.placements.map((placement) => [placement.problemId, placement]),
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
    for (const entry of build.integrationMap.entries) {
      if (entry.action !== 'split') continue;
      const flattenedProblemIds = entry.splitProblemAssignments.flatMap(
        ({ problemIds }) => problemIds,
      );
      expect(new Set(flattenedProblemIds)).toEqual(new Set(entry.affectedProblemIds));
      if (entry.previewEntityKind === 'outcome') {
        expect(new Set(flattenedProblemIds).size).toBe(flattenedProblemIds.length);
      }
      for (const assignment of entry.splitProblemAssignments) {
        const evidenceOwners = new Set(assignment.evidenceRefs.map(({ problemId }) => problemId));
        expect(
          [...assignment.problemIds, ...assignment.representativeProblemIds].every((problemId) =>
            evidenceOwners.has(problemId),
          ),
        ).toBe(true);
        for (const problemId of assignment.representativeProblemIds) {
          const placement = placementByProblemId.get(problemId);
          if (placement === undefined) throw new Error(`Missing placement for ${problemId}.`);
          expect(
            assignedEntityIds(placement, entry.previewEntityKind, ownerUnitIdsByOutcomeId),
          ).toContain(assignment.finalEntityId);
        }
      }
    }
    const shortestPathTag = build.integrationMap.entries.find(
      ({ previewEntityId }) => previewEntityId === 'provisional-tag-shortest-path-structure',
    );
    expect(shortestPathTag?.action).toBe('split');
    if (shortestPathTag?.action === 'split') {
      expect(
        shortestPathTag.splitProblemAssignments
          .filter(({ problemIds }) => problemIds.includes('abc218-f'))
          .map(({ finalEntityId }) => finalEntityId),
      ).toEqual(['tag-shortest-path-certificate', 'tag-witness-impact-localization']);
    }
    const multiplicativeOutcome = build.integrationMap.entries.find(
      ({ previewEntityId }) =>
        previewEntityId === 'outcome-provisional-multiplicative-order-counting',
    );
    expect(multiplicativeOutcome?.finalEntityIds).toEqual([
      'outcome-count-through-cyclic-exponents',
      'outcome-find-period-by-multiplicative-order',
    ]);
  }, 30_000);

  it('uses owner-exact evidence for every complete downstream impact surface', async () => {
    const { build } = await loaded;
    const unitById = new Map(
      build.finalCandidates.flatMap((candidate) =>
        candidate.kind === 'unit' ? [[candidate.entity.id, candidate.entity] as const] : [],
      ),
    );
    expect(build.correctionImpacts).toHaveLength(build.integrationMap.entries.length);
    for (const impact of build.correctionImpacts) {
      expect(impact.coverageStatus).toBe('complete');
      expect(impact.verificationStatus).toBe(build.status === 'accepted' ? 'reviewed' : 'pending');
      for (const problemId of impact.affectedProblemIds) {
        const assessments = impact.surfaceAssessments.filter(
          (assessment) => assessment.ownerType === 'problem' && assessment.problemId === problemId,
        );
        expect(assessments.map(({ surface }) => surface).sort()).toEqual(
          ['answer', 'body', 'derived_index', 'example', 'exercise', 'placement'].sort(),
        );
        expect(
          assessments.every(({ evidenceRefs }) =>
            evidenceRefs.every(({ problemId: ownerId }) => ownerId === problemId),
          ),
        ).toBe(true);
      }
      for (const learningUnitId of impact.affectedLearningUnitCandidateIds) {
        const unit = unitById.get(learningUnitId);
        const assessments = impact.surfaceAssessments.filter(
          (assessment) =>
            assessment.ownerType === 'learning_unit_candidate' &&
            assessment.learningUnitId === learningUnitId,
        );
        expect(assessments.map(({ surface }) => surface).sort()).toEqual(
          ['answer', 'body', 'derived_index', 'example', 'exercise', 'prerequisite_graph'].sort(),
        );
        expect(
          assessments.every(
            ({ evidenceRefs }) =>
              evidenceRefs.length > 0 &&
              evidenceRefs.every(
                ({ problemId }) =>
                  unit !== undefined &&
                  [...unit.problemIds, ...unit.relatedProblemIds].includes(problemId),
              ),
          ),
        ).toBe(true);
      }
      const indexAssessments = impact.surfaceAssessments.filter(
        ({ ownerType }) => ownerType === 'derived_index',
      );
      expect(indexAssessments).toHaveLength(impact.derivedIndexPaths.length);
      const taskPatternBySurface = {
        'problem:body': /T066–T071.*T075/u,
        'problem:example': /T066–T071.*T072.*T074–T075/u,
        'problem:exercise': /T066–T071.*T075/u,
        'problem:answer': /T066–T071.*T074–T075・T078/u,
        'problem:placement': /T049/u,
        'problem:derived_index': /T160.*T049/u,
        'learning_unit_candidate:body': /T050/u,
        'learning_unit_candidate:example': /T050/u,
        'learning_unit_candidate:exercise': /T050/u,
        'learning_unit_candidate:answer': /T050/u,
        'learning_unit_candidate:prerequisite_graph': /T048.*DAG/u,
        'learning_unit_candidate:derived_index': /T160/u,
        'derived_index:index': /T160.*T049/u,
      } as const;
      for (const assessment of impact.surfaceAssessments) {
        const key =
          `${assessment.ownerType}:${assessment.surface}` as keyof typeof taskPatternBySurface;
        expect(assessment.rationale, key).toMatch(taskPatternBySurface[key]);
      }
    }
  }, 30_000);

  it('rejects incomplete integration mapping and primary Outcome home drift', async () => {
    const { build } = await loaded;

    const missingEntry = structuredClone(build);
    missingEntry.integrationMap.entries.pop();
    expect(FinalTaxonomyBuildSchema.safeParse(missingEntry).success).toBe(false);

    const incompleteSplit = structuredClone(build);
    const splitEntry = incompleteSplit.integrationMap.entries.find(
      (entry) => entry.action === 'split',
    );
    if (splitEntry?.action === 'split') {
      const firstAssignment = splitEntry.splitProblemAssignments[0];
      if (firstAssignment === undefined) throw new Error('Expected one split assignment.');
      firstAssignment.problemIds = [];
    }
    expect(FinalTaxonomyBuildSchema.safeParse(incompleteSplit).success).toBe(false);

    const missingTarget = structuredClone(build);
    const targetEntry = missingTarget.integrationMap.entries.find(
      (entry) =>
        (entry.action === 'promote' || entry.action === 'merge') &&
        entry.previewEntityKind === 'unit',
    );
    const targetPlacement = missingTarget.placements.find(({ problemId }) =>
      targetEntry?.affectedProblemIds.includes(problemId),
    );
    if (targetEntry && targetPlacement) {
      const homeUnit = missingTarget.finalCandidates.find(
        (candidate) =>
          candidate.kind === 'unit' &&
          candidate.entity.ownedLearningOutcomeIds.includes(targetPlacement.primaryOutcomeId),
      );
      if (homeUnit?.kind === 'unit') {
        homeUnit.entity.directProblemIds = homeUnit.entity.directProblemIds.filter(
          (id) => id !== targetPlacement.problemId,
        );
      }
    }
    expect(FinalTaxonomyBuildSchema.safeParse(missingTarget).success).toBe(false);
  }, 30_000);
});
