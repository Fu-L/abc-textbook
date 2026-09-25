import { isCurriculumUnit } from '../../src/lib/taxonomy/curriculum-unit.js';
import { readFile } from 'node:fs/promises';

import { describe, expect, it, vi } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  CanonicalLearningPrerequisitesSchema,
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
import { TEXTBOOK_CHAPTERS, textbookIndex } from '../../src/lib/taxonomy/textbook-order.js';
import {
  UNIT_LEARNING_TARGETS,
  unitLearningTarget,
} from '../../src/lib/taxonomy/unit-learning-targets.js';

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
  it('keeps display order, semantic hierarchy, and direct prerequisite edges separate', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const byId = new Map(result.learningUnits.map((output) => [output.value.id, output]));
    const orderedIds = TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]);
    expect([...orderedIds].sort()).toEqual([...byId.keys()].sort());
    expect(Object.keys(UNIT_LEARNING_TARGETS).sort()).toEqual([...byId.keys()].sort());
    for (const id of orderedIds) {
      const target = unitLearningTarget(id);
      expect(byId.get(id)?.document).toContain(`**${target.color}（${target.rating}）**`);
      expect(target.reason.length).toBeGreaterThan(0);
      expect(byId.get(id)?.document).toContain(target.reason);
    }

    expect(byId.get('unit-dp-transition-optimization')?.document).toContain('全体から例外を引く');
    expect(byId.get('unit-polynomial-multipoint-evaluation')?.document).toContain('chirp-z');

    const candidateById = new Map(
      input.build.finalCandidates
        .filter((candidate) => candidate.kind === 'unit')
        .map(({ entity }) => [entity.id, entity]),
    );
    for (const { nodeId, prerequisiteId } of result.learningPrerequisites
      .learningUnitPrerequisites) {
      const dependent = byId.get(nodeId);
      const prerequisite = byId.get(prerequisiteId);
      if (!dependent || !prerequisite)
        throw new Error(`Missing prerequisite edge: ${nodeId}/${prerequisiteId}`);
      expect(dependent.document).toContain(`[${prerequisite.value.title}](/learn/`);
      expect(prerequisite.document).toContain(`[${dependent.value.title}](/learn/`);
      const isLater = textbookIndex(prerequisiteId) > textbookIndex(nodeId);
      const nodeChapter = TEXTBOOK_CHAPTERS.find(
        ({ id, unitIds }) => id === nodeId || (unitIds as readonly string[]).includes(nodeId),
      )?.id;
      const prerequisiteChapter = TEXTBOOK_CHAPTERS.find(
        ({ id, unitIds }) =>
          id === prerequisiteId || (unitIds as readonly string[]).includes(prerequisiteId),
      )?.id;
      const expectedLabel = isLater
        ? `（${nodeChapter === prerequisiteChapter ? '後の節' : '後の章'}）`
        : '';
      const prerequisiteLine = dependent.document
        .split('\n')
        .find((line) => line.startsWith('直接の前提単元:'));
      expect(prerequisiteLine, `${nodeId} -> ${prerequisiteId}`).toContain(
        `[${prerequisite.value.title}](/learn/${prerequisite.documentPath.replace(/^src\/content\/docs\/learn\//u, '').replace(/(?:\/index)?\.md$/u, '')}/)${expectedLabel}`,
      );
    }

    for (const chapter of TEXTBOOK_CHAPTERS) {
      const chapterDocument = byId.get(chapter.id)?.document ?? '';
      let previousLinkPosition = -1;
      for (const id of chapter.unitIds) {
        const output = byId.get(id);
        if (output === undefined) throw new Error(`Missing Unit: ${id}`);
        const { value: unit, document } = output;
        let root = unit;
        while (root.parentId !== null) {
          const parent = byId.get(root.parentId)?.value;
          if (parent === undefined) throw new Error(`Missing parent: ${root.parentId}`);
          root = parent;
        }
        expect(root.id, id).toBe(chapter.id);
        expect(document).toContain(`  order: ${String(textbookIndex(id))}\n`);
        const targetLabel = isCurriculumUnit(unit) ? '習得対象の目安' : '導入対象の目安';
        expect(document).toContain(`${targetLabel}:`);
        const linkPosition = chapterDocument.indexOf(`- [${unit.title}](`);
        expect(linkPosition, id).toBeGreaterThan(previousLinkPosition);
        previousLinkPosition = linkPosition;
        const accepted = candidateById.get(id);
        if (accepted === undefined) throw new Error(`Missing accepted Unit: ${id}`);
        expect([...(unit.directProblemIds ?? [])].sort()).toEqual(
          [...accepted.directProblemIds].sort(),
        );
        if (accepted.directProblemIds.length > 0) {
          expect(document).toContain('\n- [');
          expect(document).not.toContain('\n1. [');
        }
        expect(unit.relatedProblemIds).toEqual(accepted.relatedProblemIds);
        expect(document).not.toContain('## 標準履修順');
        expect(document).not.toMatch(/第\d+単元|前:|次:/u);
      }
    }
    expect(textbookIndex('unit-segment-tree-beats')).toBeLessThan(
      textbookIndex('unit-dp-state-design'),
    );
    expect(textbookIndex('unit-bipartite-structure')).toBe(
      textbookIndex('unit-transitive-closure') + 1,
    );
    expect(textbookIndex('unit-bipartite-structure')).toBeLessThan(
      textbookIndex('unit-shortest-path-certificates'),
    );
    expect(byId.get('unit-chapter-combinatorics-algebra')?.document).toContain(
      '    - [subset convolution]',
    );
    expect(unitLearningTarget('unit-dp-state-design').color).toBe('緑色');
    expect(unitLearningTarget('unit-frontier-profile-dp').color).toBe('黄色');
    expect(byId.get('unit-chapter-modeling')?.document).toContain('## 本書の読み方');
    expect(byId.get('unit-chapter-modeling')?.document).toContain('## 本書の読み方');
    expect(byId.get('unit-chapter-modeling')?.document).toContain('編集上の案内');
  }, 30_000);

  it('keeps placement data independent of a changed textbook display order', async () => {
    const input = await loadMaterializationInput();
    const original = buildCanonicalTaxonomyMaterialization(input);
    vi.resetModules();
    vi.doMock('../../src/lib/taxonomy/textbook-order.js', async (importOriginal) => {
      const actual = await importOriginal<{ textbookIndex: typeof textbookIndex }>();
      const first = 'unit-dp-grid-table';
      const second = 'unit-dp-sequence-interval';
      return {
        ...actual,
        textbookIndex: (id: string) =>
          actual.textbookIndex(id === first ? second : id === second ? first : id),
      };
    });
    try {
      const { buildCanonicalTaxonomyMaterialization: buildWithChangedOrder } =
        await import('../../src/lib/taxonomy/canonical-taxonomy-materialization.js');
      const changed = buildWithChangedOrder(input);
      expect(changed.problemPlacementPolicy.placementDigest).toBe(
        original.problemPlacementPolicy.placementDigest,
      );
      expect(changed.learningUnits.map(({ value }) => [value.id, value.directProblemIds])).toEqual(
        original.learningUnits.map(({ value }) => [value.id, value.directProblemIds]),
      );
      expect(
        changed.learningUnits.find(({ value }) => value.id === 'unit-dp-grid-table')?.document,
      ).not.toBe(
        original.learningUnits.find(({ value }) => value.id === 'unit-dp-grid-table')?.document,
      );
    } finally {
      vi.doUnmock('../../src/lib/taxonomy/textbook-order.js');
      vi.resetModules();
    }
  }, 30_000);

  it('describes the primary skill as the lesson and supporting skills as prerequisites', async () => {
    const result = buildCanonicalTaxonomyMaterialization(await loadMaterializationInput());
    const byId = new Map(result.learningUnits.map(({ value, document }) => [value.id, document]));
    for (const [unitId, problemLabel, requiredSentence, forbiddenPhrase] of [
      ['unit-dp-subset-state', 'ABC301 E', 'BFSで重要地点間の距離を前計算し', '部分集合DPを既習'],
      ['unit-dp-subset-state', 'ABC338 F', '訪問順を部分集合DPで学ぶ', '部分集合DPを既習'],
      ['unit-lowlink-critical-structure', 'ABC375 G', 'lowlinkによる橋判定を学び', 'lowlinkを既習'],
      ['unit-max-flow-min-cut', 'ABC437 G', '容量へ写す最大流のモデルを学ぶ', '最大流を既習'],
    ] as const) {
      const line = byId
        .get(unitId)
        ?.split('\n')
        .find((entry) => entry.startsWith(`- [${problemLabel}「`));
      expect(line, `${unitId}/${problemLabel}`).toContain(requiredSentence);
      expect(line).not.toContain(forbiddenPhrase);
    }
  }, 30_000);

  it('fixes unique presentation and descendant coverage without prescribed teaching blocks', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const occurrences = new Map<string, string[]>();
    const ownerUnitByOutcomeId = new Map<string, string>();
    for (const { value } of result.learningUnits) {
      for (const outcomeId of value.ownedLearningOutcomeIds ?? []) {
        expect(ownerUnitByOutcomeId.has(outcomeId), outcomeId).toBe(false);
        ownerUnitByOutcomeId.set(outcomeId, value.id);
      }
    }
    for (const { value: unit, document } of result.learningUnits) {
      expect(unit.examples).toEqual([]);
      expect(unit.exercises).toEqual([]);
      expect(document).toContain('## 概要');
      expect(document).toContain('### このUnitでは扱わないもの');
      expect(document).toContain('## 問題一覧');
      expect(document).not.toContain('出題枠順');
      const problemSection = document.split('## 問題一覧').at(1)?.split('## 関連問題').at(0) ?? '';
      const listedIds = [...problemSection.matchAll(/^- \[ABC(\d+) (E|F|G|H|Ex)「/gmu)].map(
        (match) => {
          const [, contest, slot] = match;
          if (contest === undefined || slot === undefined) throw new Error('Invalid problem link');
          return `abc${contest}-${slot.toLowerCase()}`;
        },
      );
      expect(listedIds).toEqual(unit.directProblemIds);
      expect(document).not.toMatch(/ガイド例|到達確認|自己評価|curriculum/u);
      for (const id of unit.directProblemIds ?? [])
        occurrences.set(id, [...(occurrences.get(id) ?? []), unit.id]);
      const children = result.learningUnits.filter(({ value }) => value.parentId === unit.id);
      expect([...unit.problemIds].sort()).toEqual(
        [
          ...new Set([
            ...(unit.directProblemIds ?? []),
            ...children.flatMap(({ value }) => value.problemIds),
          ]),
        ].sort(),
      );
    }
    for (const placement of input.build.placements) {
      const homeUnitId = ownerUnitByOutcomeId.get(placement.primaryOutcomeId);
      expect(homeUnitId, placement.problemId).toBeDefined();
      expect(occurrences.get(placement.problemId)).toEqual([homeUnitId]);
      expect(placement).not.toHaveProperty('learningUnitIds');
      expect(placement).not.toHaveProperty('presentationUnitId');
    }
    expect(occurrences.size).toBe(868);
    expect(result.learningOutcomes).toHaveLength(225);
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
      expect(value).not.toHaveProperty('globalIndex');
      expect(LearningUnitSchema.safeParse({ ...value, globalIndex: 0 }).success).toBe(false);
      expect(value.contentPhase).toBe('canonical_skeleton');
    }
    for (const { document } of result.learningUnits) {
      expect(document).not.toContain('staging/');
      expect(document).toContain(input.build.id);
      expect(document).toContain(input.build.buildDigest);
    }
    expect(CanonicalLearningPrerequisitesSchema.parse(result.learningPrerequisites)).toEqual(
      result.learningPrerequisites,
    );
    expect(result.learningPrerequisites).not.toHaveProperty('standardOrder');
    expect(result.learningPrerequisites).not.toHaveProperty('orderReasons');
    expect(CanonicalProblemPlacementPolicySchema.parse(result.problemPlacementPolicy)).toEqual(
      result.problemPlacementPolicy,
    );
    expect(validateCanonicalMaterialization(input, result)).toEqual([]);
  }, 30_000);

  it('hands full-authoring bytes off without relaxing canonical taxonomy invariants', async () => {
    const input = await loadMaterializationInput();
    const result = structuredClone(buildCanonicalTaxonomyMaterialization(input));
    const unit = result.learningUnits[0];
    if (unit === undefined) throw new Error('Expected one canonical LearningUnit.');

    unit.value.contentPhase = 'full_authoring';
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

  it('preserves direct prerequisite DAGs and binds each Problem home to its primary Outcome owner', async () => {
    const input = await loadMaterializationInput();
    const result = buildCanonicalTaxonomyMaterialization(input);
    const outcomeIds = new Set(result.learningOutcomes.map(({ value }) => value.id));
    const ownerUnitByOutcomeId = new Map<string, string>();
    for (const { value } of result.learningUnits) {
      for (const outcomeId of value.ownedLearningOutcomeIds ?? []) {
        ownerUnitByOutcomeId.set(outcomeId, value.id);
      }
    }

    expect(result.learningPrerequisites.tagPrerequisites).toEqual(input.build.tagPrerequisites);
    expect(result.learningPrerequisites.learningOutcomePrerequisites).toEqual(
      input.build.finalCandidates
        .filter((candidate) => candidate.kind === 'outcome')
        .flatMap(({ entity }) =>
          entity.prerequisiteOutcomeIds.map((prerequisiteId) => ({
            nodeId: entity.id,
            prerequisiteId,
          })),
        ),
    );
    expect(result.learningPrerequisites.learningUnitPrerequisites).toEqual(
      input.build.learningUnitPrerequisites,
    );
    for (const placement of result.problemPlacementPolicy.placements) {
      expect(outcomeIds.has(placement.primaryOutcomeId)).toBe(true);
      const homeUnitId = ownerUnitByOutcomeId.get(placement.primaryOutcomeId);
      expect(homeUnitId, placement.problemId).toBeDefined();
      expect(
        result.learningUnits.find(({ value }) => value.id === homeUnitId)?.value.directProblemIds,
      ).toContain(placement.problemId);
      expect(
        [...placement.additionalPrimaryOutcomeIds, ...placement.supportingOutcomeIds].every((id) =>
          outcomeIds.has(id),
        ),
      ).toBe(true);
    }
    const unitById = new Map(result.learningUnits.map(({ value }) => [value.id, value]));
    for (const [problemId, homeUnitId] of [
      ['abc301-e', 'unit-dp-subset-state'],
      ['abc375-g', 'unit-lowlink-critical-structure'],
    ] as const) {
      expect(unitById.get(homeUnitId)?.directProblemIds, problemId).toContain(problemId);
      expect(
        unitById.get('unit-weighted-shortest-path')?.directProblemIds,
        problemId,
      ).not.toContain(problemId);
      expect(unitById.get('unit-weighted-shortest-path')?.relatedProblemIds, problemId).toContain(
        problemId,
      );
    }
    expect(
      result.learningUnits.find(({ value }) => value.id === 'unit-dp-subset-state')?.document,
    ).toContain('既習技能:');
    expect(
      result.learningUnits.find(({ value }) => value.id === 'unit-lowlink-critical-structure')
        ?.document,
    ).toContain('既習技能:');
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
      for (const locator of impact.affectedContentLocators) {
        if (locator.ownerType !== 'learning_unit') continue;
        expect(result.learningUnits.some(({ value }) => value.id === locator.learningUnitId)).toBe(
          true,
        );
        expect(locator.path).toBe('content');
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
      'learning_unit_candidate:prerequisite_graph',
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
        if (assessment.surface === 'prerequisite_graph') {
          canonicalImpact.affectedContentLocators = canonicalImpact.affectedContentLocators.filter(
            (locator) => locator.ownerType !== 'learning_prerequisites',
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
              return locator.path !== 'content';
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
