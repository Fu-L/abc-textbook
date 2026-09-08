import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  CanonicalLearningOrderSchema,
  CanonicalProblemPlacementPolicySchema,
  CorrectionImpactSchema,
  FinalTaxonomyBuildSchema,
  LearningOutcomeSchema,
  LearningUnitSchema,
  TechniqueTagSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  buildCanonicalTaxonomyMaterialization,
  validateCanonicalMaterialization,
} from '../../src/lib/taxonomy/canonical-taxonomy-materialization.js';
import { loadFinalTaxonomySourceContext } from '../../src/lib/taxonomy/final-taxonomy-build.js';
import { SINGLE_PROBLEM_TAG_IDS } from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import { CANONICAL_GUIDED_EXAMPLES } from '../../src/lib/taxonomy/canonical-guided-examples.js';

const BUILD_PATH = 'staging/taxonomy/initial/final-taxonomy-build.json';

const loadMaterializationInput = async () => {
  const [context, buildJson] = await Promise.all([
    loadFinalTaxonomySourceContext(),
    readFile(BUILD_PATH, 'utf8'),
  ]);
  const build = FinalTaxonomyBuildSchema.parse(JSON.parse(buildJson) as unknown);
  return {
    build,
    records: context.records,
    problems: context.corpus.problems.map(({ entity }) => entity),
    sources: context.corpus.sources.map(({ entity }) => entity),
    placementDecisionTable: context.placementDecisionTable,
    singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
  };
};

describe('T047–T050 canonical taxonomy materialization', () => {
  it('uses explicit teaching choices even when a simpler guide is only a supporting placement', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    expect(Object.keys(CANONICAL_GUIDED_EXAMPLES).sort()).toEqual(
      result.learningOutcomes.map(({ value }) => value.id).sort(),
    );
    const expected = {
      'unit-dp-subset-state': 'ABC232 F',
      'unit-potential-dsu': 'ABC328 F',
      'unit-rational-approximation': 'ABC333 G',
      'unit-sequence-fingerprint': 'ABC331 F',
      'unit-binary-trie': 'ABC425 G',
      'unit-dp-game-value': 'ABC349 E',
      'unit-chapter-modeling': 'ABC214 E',
    };
    for (const [unitId, problemLabel] of Object.entries(expected)) {
      const unit = result.learningUnits.find(({ value }) => value.id === unitId);
      expect(
        unit?.value.examples.find(({ learningUnitRole }) => learningUnitRole === 'guided_outcome')
          ?.input,
        unitId,
      ).toContain(problemLabel);
      expect(unit?.document).toContain('選定理由:');
    }
  }, 30_000);

  it('materializes every accepted candidate and placement without re-synthesizing taxonomy', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const expectedCounts = input.build.finalCandidates.reduce(
      (counts, candidate) => ({ ...counts, [candidate.kind]: counts[candidate.kind] + 1 }),
      { tag: 0, outcome: 0, unit: 0 },
    );

    expect(result.tags).toHaveLength(expectedCounts.tag);
    expect(result.learningOutcomes).toHaveLength(expectedCounts.outcome);
    expect(result.learningUnits).toHaveLength(expectedCounts.unit);
    expect(result.problemPlacementPolicy.placements).toHaveLength(input.build.placements.length);
    expect(result.tags.map(({ value }) => value)).toEqual(
      input.build.finalCandidates
        .filter((candidate) => candidate.kind === 'tag')
        .map(({ entity }) => entity),
    );
    expect(result.learningOutcomes.map(({ value }) => value)).toEqual(
      input.build.finalCandidates
        .filter((candidate) => candidate.kind === 'outcome')
        .map(({ entity }) => entity),
    );

    for (const { value } of result.tags) expect(TechniqueTagSchema.parse(value)).toEqual(value);
    for (const { value } of result.learningOutcomes) {
      expect(LearningOutcomeSchema.parse(value)).toEqual(value);
    }
    for (const { value } of result.learningUnits) {
      expect(LearningUnitSchema.parse(value)).toEqual(value);
      expect(value.contentPhase).toBe('canonical_skeleton');
    }
    for (const { document } of result.learningUnits) {
      expect(document).not.toContain('staging/');
      expect(document).toContain(input.build.id);
      expect(document).toContain(input.build.buildDigest);
    }
    expect(CanonicalLearningOrderSchema.parse(result.learningOrder)).toEqual(result.learningOrder);
    expect(CanonicalProblemPlacementPolicySchema.parse(result.problemPlacementPolicy)).toEqual(
      result.problemPlacementPolicy,
    );
    expect(validateCanonicalMaterialization(input, result)).toEqual([]);
  }, 30_000);

  it('hands full-authoring bytes off without relaxing canonical taxonomy invariants', async () => {
    const input = await loadMaterializationInput();
    const result = structuredClone(buildCanonicalTaxonomyMaterialization(input));
    const unit = result.learningUnits.find(({ value }) => value.exercises.length > 0);
    if (unit === undefined) throw new Error('Expected one canonical LearningUnit.');

    unit.value.contentPhase = 'full_authoring';
    unit.value.exercises = unit.value.exercises.map((exercise) => ({
      ...exercise,
      answer: {
        ...exercise.answer,
        reasoningOrVerification: `${exercise.answer.reasoningOrVerification} 査読済みの補足。`,
        verificationStatus: 'passed',
      },
    }));
    const authoredResult = {
      ...result,
      learningUnits: result.learningUnits.map((output) =>
        output.value.id === unit.value.id
          ? { ...output, document: `${output.document}\n<!-- full authoring handoff -->\n` }
          : output,
      ),
    };
    expect(validateCanonicalMaterialization(input, authoredResult)).toEqual([]);

    const canonicalTitle = unit.value.title;
    unit.value.title = `${canonicalTitle}（誤変更）`;
    expect(validateCanonicalMaterialization(input, authoredResult)).toContain(
      `UNIT_TAXONOMY_DRIFT:${unit.value.id}`,
    );
    unit.value.title = canonicalTitle;
    unit.value.sourceRevisionIds.push('source-revision-unknown');
    expect(validateCanonicalMaterialization(input, authoredResult)).toContain(
      `UNIT_SOURCE_UNKNOWN:${unit.value.id}`,
    );
  }, 30_000);

  it('authors each Outcome once and gives every container one separate curriculum-routing check', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const unitIds = new Set(result.learningUnits.map(({ value }) => value.id));
    const outcomeIds = result.learningOutcomes.map(({ value }) => value.id);
    const tagIds = result.tags.map(({ value }) => value.id);
    const guidedOwnerCounts = new Map<string, number>();
    const attainmentOwnerCounts = new Map<string, number>();
    const outcomeOwnerCounts = new Map<string, number>();
    const tagOwnerCounts = new Map<string, number>();
    const increment = (counts: Map<string, number>, id: string): void => {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    };
    let routingUnitCount = 0;
    let totalExampleCount = 0;
    let totalExerciseCount = 0;

    for (const output of result.learningUnits) {
      const children = result.learningUnits.filter(
        ({ value }) => value.parentId === output.value.id,
      );
      const ownedOutcomeIds = output.value.ownedLearningOutcomeIds ?? [];
      const guidedExamples = output.value.examples.filter(
        ({ learningUnitRole }) => learningUnitRole === 'guided_outcome',
      );
      const routingExamples = output.value.examples.filter(
        ({ learningUnitRole }) => learningUnitRole === 'curriculum_routing',
      );
      const attainmentExercises = output.value.exercises.filter(
        ({ learningUnitRole }) => learningUnitRole === 'outcome_attainment',
      );
      const routingExercises = output.value.exercises.filter(
        ({ learningUnitRole }) => learningUnitRole === 'curriculum_routing',
      );
      const routedOutcomeIds = [
        ...new Set(children.flatMap(({ value }) => value.learningOutcomeIds)),
      ].sort();
      totalExampleCount += output.value.examples.length;
      totalExerciseCount += output.value.exercises.length;
      for (const tagId of output.value.ownedTagIds ?? []) increment(tagOwnerCounts, tagId);
      for (const outcomeId of ownedOutcomeIds) increment(outcomeOwnerCounts, outcomeId);
      for (const example of guidedExamples) {
        expect(example.learningOutcomeIds).toHaveLength(1);
        const outcomeId = example.learningOutcomeIds[0];
        if (outcomeId === undefined)
          throw new Error(`Missing guided Outcome for ${output.value.id}.`);
        expect(example.key).toBe(`guided-${outcomeId}`);
        increment(guidedOwnerCounts, outcomeId);
      }
      for (const exercise of attainmentExercises) {
        expect(exercise.learningOutcomeIds).toHaveLength(1);
        const outcomeId = exercise.learningOutcomeIds[0];
        if (outcomeId === undefined) {
          throw new Error(`Missing attainment Outcome for ${output.value.id}.`);
        }
        expect(exercise.key).toBe(`attainment-${outcomeId}`);
        increment(attainmentOwnerCounts, outcomeId);
      }

      expect(output.value.docPath).toBe(output.documentPath);
      expect(output.value.ownedTagIds).toBeDefined();
      expect(output.value.ownedLearningOutcomeIds).toBeDefined();
      expect(guidedExamples).toHaveLength(ownedOutcomeIds.length);
      expect(attainmentExercises).toHaveLength(ownedOutcomeIds.length);
      expect(output.value.examples).toHaveLength(
        ownedOutcomeIds.length + (children.length ? 1 : 0),
      );
      expect(output.value.exercises).toHaveLength(
        ownedOutcomeIds.length + (children.length ? 1 : 0),
      );
      expect(guidedExamples.flatMap(({ learningOutcomeIds }) => learningOutcomeIds).sort()).toEqual(
        [...ownedOutcomeIds].sort(),
      );
      expect(
        attainmentExercises.flatMap(({ learningOutcomeIds }) => learningOutcomeIds).sort(),
      ).toEqual([...ownedOutcomeIds].sort());
      expect(output.document).toContain('## この単元でできるようになること');
      expect(output.document).toContain('\ndraft: true\n');
      expect(output.document).toContain('## 発動条件と見分け方');
      expect(output.document).toContain('## ガイド例');
      expect(output.document).toContain('## 到達確認');
      expect(output.document).toContain('## 解答と自己評価基準');
      expect(output.document).toContain('## 根拠');
      expect(output.document).not.toContain('objectPatterns');
      expect(output.document).not.toContain('triggerPatterns');
      expect(output.document).not.toMatch(/。。|。の適用可能範囲|。 発動条件/u);
      if (ownedOutcomeIds.length > 0) {
        expect(output.document).toContain('#### このOutcomeを支える根拠');
      } else {
        expect(output.document).not.toContain('#### このOutcomeを支える根拠');
      }
      for (const exercise of output.value.exercises) {
        expect(exercise.answer.verificationStatus).toBe('pending');
      }
      for (const exercise of attainmentExercises) {
        expect(exercise.assessment.method).toMatch(/転移題材|発動条件を一つ選んで否定/u);
      }
      if (children.length > 0) {
        routingUnitCount += 1;
        expect(routingExamples).toHaveLength(1);
        expect(routingExercises).toHaveLength(1);
        expect(routingExamples[0]).toMatchObject({
          key: 'curriculum-routing',
          learningUnitRole: 'curriculum_routing',
          learningOutcomeIds: routedOutcomeIds,
          kind: 'illustrative',
          verificationStatus: 'not_applicable',
        });
        expect(routingExercises[0]).toMatchObject({
          key: 'curriculum-routing',
          learningUnitRole: 'curriculum_routing',
          learningOutcomeIds: routedOutcomeIds,
          answer: { verificationStatus: 'pending' },
        });
        expect(output.document).toContain('## 下位単元と学習順');
        expect(output.document).toContain('## 下位単元を使い分ける比較例');
        expect(output.document).toContain('### 学習経路の選択');
        expect(output.document).toContain('これは T057 の学習経路レビュー前');
        for (const child of children) {
          const childDocumentName = child.documentPath.split('/').at(-1);
          expect(childDocumentName).toBeDefined();
          if (childDocumentName === undefined) throw new Error('Expected a child document name.');
          expect(output.document).toContain(`./${childDocumentName}`);
        }
      } else {
        expect(routingExamples).toEqual([]);
        expect(routingExercises).toEqual([]);
        expect(output.document).not.toContain('## 下位単元を使い分ける比較例');
      }
      for (const prerequisiteId of output.value.additionalPrerequisiteUnitIds) {
        expect(unitIds.has(prerequisiteId)).toBe(true);
      }
    }

    expect(outcomeIds).toHaveLength(200);
    expect(tagIds).toHaveLength(197);
    expect(result.learningUnits).toHaveLength(220);
    expect(
      result.learningUnits.filter(({ value }) => value.ownedLearningOutcomeIds?.length === 0),
    ).toHaveLength(24);
    expect(
      result.learningUnits.filter(({ value }) => {
        const hasChildren = result.learningUnits.some(
          ({ value: candidate }) => candidate.parentId === value.id,
        );
        return hasChildren && (value.ownedLearningOutcomeIds?.length ?? 0) > 0;
      }),
    ).toHaveLength(21);
    expect(
      result.learningUnits
        .filter(({ value }) => value.ownedLearningOutcomeIds?.length === 2)
        .map(({ value }) => value.id)
        .sort(),
    ).toEqual([
      'unit-bipartite-matching',
      'unit-dp-sequence-interval',
      'unit-dsu-components',
      'unit-integer-boundary-blocks',
    ]);
    expect(routingUnitCount).toBe(45);
    expect(totalExampleCount).toBe(245);
    expect(totalExerciseCount).toBe(245);
    for (const outcomeId of outcomeIds) {
      expect(outcomeOwnerCounts.get(outcomeId), `${outcomeId}/owner`).toBe(1);
      expect(guidedOwnerCounts.get(outcomeId), `${outcomeId}/guided`).toBe(1);
      expect(attainmentOwnerCounts.get(outcomeId), `${outcomeId}/attainment`).toBe(1);
    }
    for (const tagId of tagIds) expect(tagOwnerCounts.get(tagId), tagId).toBe(1);

    const dynamicProduct = result.learningUnits.find(
      ({ value }) => value.id === 'unit-dynamic-modular-product',
    );
    expect(dynamicProduct?.value.ownedLearningOutcomeIds).toEqual([
      'outcome-maintain-modular-product-under-factor-updates',
    ]);
    expect(dynamicProduct?.value.examples[0]?.learningUnitRole).toBe('guided_outcome');
    expect(dynamicProduct?.value.examples[0]?.input).toContain('ABC411 E');
    expect(dynamicProduct?.value.exercises[0]?.assessment.method).toContain('ABC405 G');
    expect(dynamicProduct?.document).toContain(
      '現在区間へのadd/removeごとに値の頻度と所属bucketの頻度和・逆階乗積をO(1)更新',
    );
    const modularArithmetic = result.learningUnits.find(
      ({ value }) => value.id === 'unit-modular-arithmetic',
    );
    expect(modularArithmetic?.value.ownedLearningOutcomeIds).not.toContain(
      'outcome-maintain-modular-product-under-factor-updates',
    );
    const modularFoundations = result.learningUnits.find(
      ({ value }) => value.id === 'unit-modular-product-foundations',
    );
    expect(modularFoundations?.value.ownedLearningOutcomeIds).toEqual([]);
    expect(modularFoundations?.value.examples).toHaveLength(1);
    expect(modularFoundations?.value.examples[0]?.learningUnitRole).toBe('curriculum_routing');
    expect(modularFoundations?.document).toContain('./dynamic-modular-product.md');
  }, 30_000);

  it('preserves the two accepted DAGs, Outcome closure, and deterministic standard order', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const outcomeIds = new Set(result.learningOutcomes.map(({ value }) => value.id));

    expect(result.learningOrder.tagPrerequisites).toEqual(input.build.tagPrerequisites);
    expect(result.learningOrder.learningUnitPrerequisites).toEqual(
      input.build.learningUnitPrerequisites,
    );
    expect(result.learningOrder.standardOrder).toEqual(input.build.standardOrder);
    expect(result.learningOrder.standardOrder).toEqual(
      result.learningUnits
        .map(({ value }) => value)
        .sort((left, right) => left.globalIndex - right.globalIndex)
        .map(({ id }) => id),
    );
    for (const placement of result.problemPlacementPolicy.placements) {
      expect(outcomeIds.has(placement.primaryOutcomeId)).toBe(true);
      expect(
        [...placement.additionalPrimaryOutcomeIds, ...placement.supportingOutcomeIds].every((id) =>
          outcomeIds.has(id),
        ),
      ).toBe(true);
    }
  }, 30_000);

  it('materializes every preview taxonomy change as a complete but pending CorrectionImpact mapping', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);

    expect(result.problemPlacementPolicy.previewTaxonomyChanges).toEqual(
      input.build.correctionImpacts,
    );
    expect(result.problemPlacementPolicy.correctionImpacts).toHaveLength(
      input.build.correctionImpacts.length,
    );
    for (const impact of result.problemPlacementPolicy.correctionImpacts) {
      expect(CorrectionImpactSchema.parse(impact)).toEqual(impact);
      expect(impact.verificationStatus).toBe('pending');
      expect(impact.affectedContentLocators.length).toBeGreaterThan(0);
      const previewImpact = input.build.correctionImpacts.find(({ id }) => id === impact.id);
      expect(previewImpact).toBeDefined();
      expect(impact.sourceRevisionIds).toEqual(previewImpact?.sourceRevisionIds);
      expect(impact.sourceRevisionIds).toContain(impact.sourceRevisionId);
      const candidateById = new Map(
        input.build.finalCandidates.map((candidate) => [candidate.entity.id, candidate]),
      );
      const impactedOutcomeIds = new Set(
        input.build.integrationMap.entries
          .filter(({ correctionImpactIds }) => correctionImpactIds.includes(impact.id))
          .flatMap(({ finalEntityIds }) => finalEntityIds)
          .flatMap((entityId) => {
            const candidate = candidateById.get(entityId);
            if (candidate === undefined) return [];
            return candidate.kind === 'outcome'
              ? [candidate.entity.id]
              : candidate.entity.learningOutcomeIds;
          }),
      );
      for (const assessment of previewImpact?.surfaceAssessments ?? []) {
        if (assessment.ownerType === 'problem' && assessment.surface === 'placement') {
          expect(impact.affectedContentLocators).toContainEqual({
            ownerType: 'problem_placement',
            problemId: assessment.problemId,
            path: 'src/content/policies/problem-placements.json',
          });
        }
      }
      for (const locator of impact.affectedContentLocators) {
        if (locator.ownerType !== 'learning_unit' || locator.path === 'content') continue;
        const unit = result.learningUnits.find(
          ({ value }) => value.id === locator.learningUnitId,
        )?.value;
        expect(unit).toBeDefined();
        const exampleMatch = /^examples\.(.+)$/u.exec(locator.path);
        const exerciseMatch = /^exercises\.([^.]+)(?:\.answer)?$/u.exec(locator.path);
        if (exampleMatch !== null) {
          const example = unit?.examples.find(({ key }) => key === exampleMatch[1]);
          expect(example).toBeDefined();
          expect(
            example?.learningOutcomeIds.some((outcomeId) => impactedOutcomeIds.has(outcomeId)),
          ).toBe(true);
          if (example?.learningUnitRole === 'guided_outcome') {
            expect(
              example.learningOutcomeIds.every((outcomeId) =>
                unit?.ownedLearningOutcomeIds?.includes(outcomeId),
              ),
            ).toBe(true);
          } else {
            expect(example?.learningUnitRole).toBe('curriculum_routing');
          }
        } else if (exerciseMatch !== null) {
          const exercise = unit?.exercises.find(({ key }) => key === exerciseMatch[1]);
          expect(exercise).toBeDefined();
          expect(
            exercise?.learningOutcomeIds.some((outcomeId) => impactedOutcomeIds.has(outcomeId)),
          ).toBe(true);
          if (exercise?.learningUnitRole === 'outcome_attainment') {
            expect(
              exercise.learningOutcomeIds.every((outcomeId) =>
                unit?.ownedLearningOutcomeIds?.includes(outcomeId),
              ),
            ).toBe(true);
          } else {
            expect(exercise?.learningUnitRole).toBe('curriculum_routing');
          }
        } else {
          throw new Error(`Unexpected LearningUnit locator: ${locator.path}`);
        }
      }
    }
  }, 30_000);

  it('detects an extra CorrectionImpact locator even when required surfaces remain covered', async () => {
    const input = await loadMaterializationInput();
    const result = structuredClone(buildCanonicalTaxonomyMaterialization(input));
    const impact = result.problemPlacementPolicy.correctionImpacts[0];
    const problem = input.problems.at(-1);
    if (impact === undefined || problem === undefined) {
      throw new Error('Expected one canonical CorrectionImpact and Problem.');
    }
    impact.affectedContentLocators.push({
      ownerType: 'problem',
      problemId: problem.id,
      path: 'sections.reasoning',
    });
    result.problemPlacementPolicy.correctionImpactDigest = canonicalDigest(
      result.problemPlacementPolicy.correctionImpacts,
    );

    expect(validateCanonicalMaterialization(input, result)).toContain('CORRECTION_IMPACT_DRIFT');
  }, 30_000);

  it('rejects every missing preview surface mapping even with a recalculated digest', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    type Policy = typeof result.problemPlacementPolicy;
    type PreviewImpact = Policy['previewTaxonomyChanges'][number];
    type SurfaceAssessment = PreviewImpact['surfaceAssessments'][number];
    const expectedCaseKeys = [
      'problem:body',
      'problem:example',
      'problem:exercise',
      'problem:answer',
      'problem:placement',
      'problem:derived_index',
      'learning_unit_candidate:body',
      'learning_unit_candidate:example',
      'learning_unit_candidate:exercise',
      'learning_unit_candidate:answer',
      'learning_unit_candidate:standard_order',
      'learning_unit_candidate:derived_index',
      'derived_index:index',
    ];
    const representativeCases = new Map<
      string,
      { readonly previewImpact: PreviewImpact; readonly assessment: SurfaceAssessment }
    >();
    for (const previewImpact of result.problemPlacementPolicy.previewTaxonomyChanges) {
      for (const assessment of previewImpact.surfaceAssessments) {
        const key = `${assessment.ownerType}:${assessment.surface}`;
        if (!representativeCases.has(key)) {
          representativeCases.set(key, { previewImpact, assessment });
        }
      }
    }
    expect([...representativeCases.keys()].sort()).toEqual([...expectedCaseKeys].sort());

    for (const caseKey of expectedCaseKeys) {
      const representative = representativeCases.get(caseKey);
      if (representative === undefined) throw new Error(`Missing ${caseKey} assessment case.`);
      const { previewImpact, assessment } = representative;
      const policy = structuredClone(result.problemPlacementPolicy);
      const canonicalImpact = policy.correctionImpacts.find(({ id }) => id === previewImpact.id);
      if (canonicalImpact === undefined) {
        throw new Error(`Expected canonical CorrectionImpact ${previewImpact.id}.`);
      }
      let expectedMessage: string;
      if (assessment.ownerType === 'problem') {
        expectedMessage = `Canonical CorrectionImpact ${previewImpact.id} omits ${assessment.problemId}'s ${assessment.surface} surface.`;
        if (assessment.surface === 'placement') {
          canonicalImpact.affectedContentLocators = canonicalImpact.affectedContentLocators.filter(
            (locator) =>
              locator.ownerType !== 'problem_placement' ||
              locator.problemId !== assessment.problemId,
          );
        } else if (assessment.surface === 'derived_index') {
          canonicalImpact.derivedIndexPaths = canonicalImpact.derivedIndexPaths.slice(1);
        } else {
          const path =
            assessment.surface === 'body'
              ? 'sections.reasoning'
              : assessment.surface === 'example'
                ? 'examples.taxonomy-integration'
                : assessment.surface === 'exercise'
                  ? 'exercises.taxonomy-integration'
                  : 'exercises.taxonomy-integration.answer';
          canonicalImpact.affectedContentLocators = canonicalImpact.affectedContentLocators.filter(
            (locator) =>
              locator.ownerType !== 'problem' ||
              locator.problemId !== assessment.problemId ||
              locator.path !== path,
          );
        }
      } else if (assessment.ownerType === 'learning_unit_candidate') {
        expectedMessage = `Canonical CorrectionImpact ${previewImpact.id} omits ${assessment.learningUnitId}'s ${assessment.surface} surface.`;
        if (assessment.surface === 'standard_order') {
          canonicalImpact.affectedLearningUnitOrderIds =
            canonicalImpact.affectedLearningUnitOrderIds.filter(
              (unitId) => unitId !== assessment.learningUnitId,
            );
        } else if (assessment.surface === 'derived_index') {
          canonicalImpact.derivedIndexPaths = canonicalImpact.derivedIndexPaths.slice(1);
        } else {
          canonicalImpact.affectedContentLocators = canonicalImpact.affectedContentLocators.filter(
            (locator) => {
              if (
                locator.ownerType !== 'learning_unit' ||
                locator.learningUnitId !== assessment.learningUnitId
              ) {
                return true;
              }
              if (assessment.surface === 'body') return locator.path !== 'content';
              if (assessment.surface === 'example') return !locator.path.startsWith('examples.');
              if (assessment.surface === 'exercise') {
                return !/^exercises\.[^.]+$/u.test(locator.path);
              }
              return !/^exercises\.[^.]+\.answer$/u.test(locator.path);
            },
          );
        }
      } else {
        expectedMessage = `Canonical CorrectionImpact ${previewImpact.id} omits ${assessment.path}'s derived-index surface.`;
        canonicalImpact.derivedIndexPaths = canonicalImpact.derivedIndexPaths.filter(
          (path) => path !== assessment.path,
        );
      }
      policy.correctionImpactDigest = canonicalDigest(policy.correctionImpacts);

      const validation = CanonicalProblemPlacementPolicySchema.safeParse(policy);
      expect(validation.success, caseKey).toBe(false);
      if (!validation.success) {
        expect(
          validation.error.issues.map(({ message }) => message),
          caseKey,
        ).toContain(expectedMessage);
      }
    }
  }, 30_000);

  it('keeps canonical CorrectionImpact verification pending after mapping validation', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const policy = structuredClone(result.problemPlacementPolicy);
    const firstImpact = policy.correctionImpacts[0];
    if (firstImpact === undefined) throw new Error('Expected a canonical CorrectionImpact.');
    firstImpact.verificationStatus = 'verified';
    policy.correctionImpactDigest = canonicalDigest(policy.correctionImpacts);

    const validation = CanonicalProblemPlacementPolicySchema.safeParse(policy);
    expect(validation.success).toBe(false);
    if (!validation.success) {
      expect(validation.error.issues.map(({ message }) => message)).toContain(
        `Canonical CorrectionImpact ${firstImpact.id} must remain pending until its target content and derived indexes are verified.`,
      );
    }
  }, 30_000);

  it('fails closed for an unaccepted build, preview namespace, and unreviewed singleton Tag', async () => {
    const input = await loadMaterializationInput();

    expect(() =>
      buildCanonicalTaxonomyMaterialization({
        ...input,
        build: {
          ...input.build,
          status: 'proposed',
          acceptedAt: null,
          canonicalMaterializationAllowed: false,
        },
      }),
    ).toThrow(/CANONICAL_BUILD_NOT_ACCEPTED/u);

    const firstTagIndex = input.build.finalCandidates.findIndex(
      (candidate) => candidate.kind === 'tag',
    );
    const firstTag = input.build.finalCandidates[firstTagIndex];
    expect(firstTag?.kind).toBe('tag');
    if (firstTag?.kind !== 'tag') throw new Error('Expected a Tag candidate.');
    const previewCandidates = [...input.build.finalCandidates];
    previewCandidates[firstTagIndex] = {
      ...firstTag,
      entity: { ...firstTag.entity, id: 'tag-preview-copy' },
    };
    expect(() =>
      buildCanonicalTaxonomyMaterialization({
        ...input,
        build: { ...input.build, finalCandidates: previewCandidates },
      }),
    ).toThrow(/CANONICAL_PREVIEW_ENTITY_REJECTED/u);

    const singleton = input.build.finalCandidates.find(
      (candidate) =>
        candidate.kind === 'tag' && candidate.entity.representativeProblemIds.length === 1,
    );
    expect(singleton?.kind).toBe('tag');
    if (singleton?.kind !== 'tag') throw new Error('Expected a singleton Tag candidate.');
    expect(SINGLE_PROBLEM_TAG_IDS).toContain(singleton.entity.id);
    expect(() =>
      buildCanonicalTaxonomyMaterialization({
        ...input,
        singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS.filter((id) => id !== singleton.entity.id),
      }),
    ).toThrow(/CANONICAL_SINGLE_PROBLEM_TAG_REJECTED/u);
  }, 30_000);
});
