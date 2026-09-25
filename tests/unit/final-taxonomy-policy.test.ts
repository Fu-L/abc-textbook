import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS,
  FINAL_LEARNING_UNIT_CANDIDATES,
  FINAL_LEARNING_UNIT_PREREQUISITES,
  FINAL_TAXONOMY_OUTCOMES,
  FINAL_TAXONOMY_PLACEMENT_PRINCIPLES,
  FINAL_TAXONOMY_TAGS,
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  PREVIEW_FINAL_TAXONOMY_DECISIONS,
  SINGLE_PROBLEM_OUTCOME_IDS,
  SINGLE_PROBLEM_TAG_IDS,
  buildFullCorpusPrimaryDecisionTable,
  materializeLearningUnitCandidates,
  validateFinalTaxonomyPolicy,
  type ProblemAnalysisInput,
} from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import {
  FINAL_TAG_DIRECTED_RELATION_SEEDS,
  FINAL_TAG_LEARNER_ALIASES,
} from '../../src/lib/taxonomy/final-taxonomy-content.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

const inventoryRoot = path.join(process.cwd(), 'src/content/technique-inventory');
const manifestPath = path.join(
  process.cwd(),
  'docs/work-manifests/initial/us2/final-taxonomy/manifest.json',
);

const prerequisiteIdsForUnit = (unitId: string): string[] =>
  FINAL_LEARNING_UNIT_PREREQUISITES.filter(({ nodeId }) => nodeId === unitId)
    .map(({ prerequisiteId }) => prerequisiteId)
    .sort();

const ownerUnitIdForOutcome = (outcomeId: string): string | undefined =>
  FINAL_LEARNING_UNIT_CANDIDATES.find((unit) => unit.ownedLearningOutcomeIds.includes(outcomeId))
    ?.id;

const loadRecords = async (): Promise<readonly ProblemAnalysisInput[]> => {
  const shardNames = (await readdir(inventoryRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const records: ProblemAnalysisInput[] = [];
  for (const shardName of shardNames) {
    const shardPath = path.join(inventoryRoot, shardName);
    const fileNames = (await readdir(shardPath))
      .filter((fileName) => fileName.endsWith('.json'))
      .sort();
    for (const fileName of fileNames) {
      records.push(
        JSON.parse(await readFile(path.join(shardPath, fileName), 'utf8')) as ProblemAnalysisInput,
      );
    }
  }
  return records;
};

const loadedRecords = loadRecords();
const loadedDecisionTable = loadedRecords.then((records) =>
  buildFullCorpusPrimaryDecisionTable(records),
);

describe('final taxonomy policy', () => {
  it('classifies reviewed examples by the adopted proof and transition mechanism', async () => {
    const table = await loadedDecisionTable;
    const expected = {
      'abc217-g': 'outcome-design-minimal-sufficient-state',
      'abc216-h': 'outcome-count-nonintersecting-paths-by-lgv',
      'abc253-ex': 'outcome-count-combinatorial-objects-by-determinant',
      'abc300-e': 'outcome-propagate-probability-distribution',
      'abc263-e': 'outcome-solve-stochastic-recurrence',
      'abc266-e': 'outcome-optimize-stochastic-actions',
      'abc283-ex': 'outcome-sum-affine-floors-by-euclid',
      'abc230-e': 'outcome-partition-integer-parameter-ranges',
      'abc465-f': 'outcome-linearize-static-range-information',
      'abc219-e': 'outcome-enumerate-bounded-candidates-or-cases',
      'abc377-e': 'outcome-decompose-functional-graph',
      'abc229-h': 'outcome-add-conway-number-games',
      'abc261-ex': 'outcome-solve-cyclic-minimax-game',
      'abc413-f': 'outcome-solve-cyclic-minimax-game',
      'abc311-ex': 'outcome-pass-resource-dp-through-heavy-recursion',
      'abc273-ex': 'outcome-traverse-stern-brocot-ancestors',
      'abc280-f': 'outcome-propagate-static-graph-potentials',
      'abc254-ex': 'outcome-match-binary-tree-ancestors',
      'abc281-f': 'outcome-minimize-maximum-xor-by-bit-partition',
      'abc218-h': 'outcome-optimize-path-matching-by-contraction',
      'abc310-ex': 'outcome-stabilize-unbounded-knapsack-by-best-density',
    };
    for (const [problemId, outcomeId] of Object.entries(expected)) {
      expect(
        table.decisions
          .filter((decision) => decision.problemId === problemId)
          .flatMap((decision) => [
            decision.primaryOutcomeId,
            ...decision.additionalPrimaryOutcomeIds,
          ]),
        problemId,
      ).toContain(outcomeId);
    }
  });

  it('defines the nine-chapter dictionary with atomic retrieval Tags and observable Outcomes', () => {
    expect(validateFinalTaxonomyPolicy()).toEqual([]);
    expect(FINAL_TAXONOMY_TAGS).toHaveLength(205);
    expect(FINAL_TAXONOMY_OUTCOMES).toHaveLength(225);
    expect(FINAL_LEARNING_UNIT_CANDIDATES).toHaveLength(230);
    expect(NON_PRIMARY_TAG_IDS).toEqual([
      'tag-model-reduction',
      'tag-dp-state-transition',
      'tag-graph-model-structure',
      'tag-query-sufficient-aggregate',
      'tag-string-state-representation',
      'tag-tree-model-structure',
      'tag-number-theory-structure',
      'tag-combinatorics-algebra-structure',
      'tag-geometry-optimization-structure',
    ]);
    expect(NON_PRIMARY_OUTCOME_IDS).toHaveLength(9);

    const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
    const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
    const unitById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));

    expect([...tagById.keys()]).toEqual(
      expect.arrayContaining([
        'tag-backtracking-search',
        'tag-prufer-code',
        'tag-directed-walk-periodicity',
        'tag-reflection-principle',
        'tag-labeled-component-decomposition',
        'tag-fractional-parametric-search',
        'tag-information-theoretic-query-design',
        'tag-cyclic-order-crossing',
        'tag-kinetic-order-maintenance',
        'tag-poset-dilworth-antichain',
        'tag-tree-precedence-contraction',
        'tag-frontier-profile-dp',
        'tag-semiring-matrix-exponentiation',
        'tag-monoid-exponentiation',
        'tag-additive-tree-metric-reconstruction',
        'tag-bostan-mori',
        'tag-baby-step-giant-step',
        'tag-directional-grid-effect-scan',
        'tag-laminar-interval-containment-tree',
        'tag-polynomial-taylor-shift',
        'tag-linear-matroid-intersection',
        'tag-min-weight-general-perfect-matching',
        'tag-cycle-space-basis',
        'tag-graph-potential-propagation',
        'tag-difference-constraints',
        'tag-kruskal-threshold-sweep',
        'tag-path-matching-contraction',
        'tag-eventual-unbounded-knapsack',
        'tag-suffix-automaton',
        'tag-segment-tree-beats',
        'tag-dynamic-modular-product',
      ]),
    );
    for (const retiredTagId of [
      'tag-math-geometry-transformation',
      'tag-directed-condensation-toposort',
      'tag-dsu-connectivity',
      'tag-flow-matching-network',
      'tag-monoid-segment-tree',
      'tag-ordered-set-heap',
      'tag-string-automata',
      'tag-subset-bitmask-transform',
    ]) {
      expect(tagById.has(retiredTagId)).toBe(false);
    }

    expect(tagById.get('tag-inclusion-exclusion')?.aliases.join(' ')).not.toMatch(
      /Möbius|メビウス/u,
    );
    expect(tagById.get('tag-dp-transition-acceleration')?.aliases.join(' ')).not.toMatch(/Monge/u);
    expect(tagById.get('tag-recursive-compressed-string')?.aliases.join(' ')).not.toMatch(
      /RLE|ランレングス/u,
    );
    expect(tagById.get('tag-graph-core-peeling')?.aliases.join(' ')).not.toMatch(
      /kernel|cycle-rank/iu,
    );
    expect(tagById.get('tag-digit-dp')?.formerNames).not.toContain('桁上限・文字列automaton DP');
    expect(tagById.get('tag-linear-matroid-intersection')?.formerNames).not.toContain(
      'matroid intersection',
    );
    expect(tagById.get('tag-min-weight-general-perfect-matching')?.formerNames).not.toContain(
      '一般グラフのmatching',
    );
    expect(tagById.get('tag-digit-dp')?.aliases).toContain('digit DP');
    expect(tagById.get('tag-automaton-dp')?.aliases).toContain('automaton DP');
    expect(tagById.get('tag-linear-matroid-intersection')?.aliases).toContain(
      'linear matroid intersection',
    );
    expect(tagById.get('tag-min-weight-general-perfect-matching')?.aliases).toContain(
      'minimum-weight perfect matching',
    );
    expect(tagById.get('tag-cycle-space-basis')?.aliases).toContain('cycle space');

    const learnerTermOwners = new Map<string, string[]>();
    for (const tag of FINAL_TAXONOMY_TAGS) {
      expect(Object.hasOwn(FINAL_TAG_LEARNER_ALIASES, tag.id), tag.id).toBe(true);
      expect(tag.aliases.length).toBeGreaterThan(0);
      expect(tag.learningOutcomeIds.length).toBeGreaterThan(0);
      expect(tag.learningUnitCandidateIds.length).toBeGreaterThan(0);
      expect(tag.semanticSignature.objectPatterns.length).toBeGreaterThan(0);
      expect(tag.semanticSignature.triggerPatterns.length).toBeGreaterThan(0);
      expect(tag.semanticSignature.invariantPatterns.length).toBeGreaterThan(0);
      expect(tag.semanticSignature.goalPatterns.length).toBeGreaterThan(0);
      expect(tag.semanticSignature.minimumDimensions).toBeGreaterThanOrEqual(1);
      expect(tag.representativeProblemIds.length).toBeGreaterThanOrEqual(
        SINGLE_PROBLEM_TAG_IDS.includes(tag.id) ? 1 : 2,
      );
      for (const term of [...tag.aliases, ...tag.formerNames]) {
        const normalized = term.normalize('NFKC').trim().toLocaleLowerCase('en-US');
        learnerTermOwners.set(normalized, [...(learnerTermOwners.get(normalized) ?? []), tag.id]);
      }
    }
    const symmetricRelationTypes = new Set(['contrast', 'analogy', 'often_combined']);
    for (const tag of FINAL_TAXONOMY_TAGS) {
      const relationKeys = tag.relatedTags.map(({ tagId, type }) => `${tagId}:${type}`);
      expect(new Set(relationKeys).size, tag.id).toBe(relationKeys.length);
      for (const relation of tag.relatedTags) {
        expect(tagById.has(relation.tagId), `${tag.id}/${relation.tagId}`).toBe(true);
        expect(relation.rationale.length).toBeGreaterThan(0);
        if (symmetricRelationTypes.has(relation.type)) {
          expect(
            tagById
              .get(relation.tagId)
              ?.relatedTags.some(
                (reverse) => reverse.tagId === tag.id && reverse.type === relation.type,
              ),
            `${tag.id}/${relation.type}/${relation.tagId}`,
          ).toBe(true);
        }
      }
    }
    expect([...learnerTermOwners.values()].filter((tagIds) => new Set(tagIds).size > 1)).toEqual(
      [],
    );

    const prerequisiteEdgeKeys = FINAL_LEARNING_UNIT_PREREQUISITES.map(
      ({ nodeId, prerequisiteId }) => `${nodeId}->${prerequisiteId}`,
    );
    expect(new Set(prerequisiteEdgeKeys).size).toBe(prerequisiteEdgeKeys.length);
    expect(FINAL_LEARNING_UNIT_CANDIDATES.filter((unit) => unit.kind === 'chapter')).toHaveLength(
      9,
    );
    expect(new Set(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.learningRationale)).size).toBe(
      FINAL_LEARNING_UNIT_CANDIDATES.length,
    );
    for (const unit of FINAL_LEARNING_UNIT_CANDIDATES) {
      expect(unit.tagIds.length).toBeGreaterThan(0);
      expect(unit.learningOutcomeIds.length).toBeGreaterThan(0);
      expect(unit.learningRationale).not.toMatch(/(?:unit|tag|outcome)-/u);
      if (unit.kind !== 'chapter') expect(unit.excludedTopics.length).toBeGreaterThan(0);
    }
    for (const { nodeId, prerequisiteId } of FINAL_LEARNING_UNIT_PREREQUISITES) {
      expect(unitById.has(nodeId), nodeId).toBe(true);
      expect(unitById.has(prerequisiteId), prerequisiteId).toBe(true);
      expect(prerequisiteId).not.toBe(nodeId);
    }

    expect(tagById.get('tag-spanning-tree-optimization')?.prerequisiteTagIds).toEqual([
      'tag-greedy-exchange-order',
    ]);
    expect(
      outcomeById.get('outcome-construct-optimal-spanning-tree')?.prerequisiteOutcomeIds,
    ).toEqual(['outcome-prove-greedy-order']);
    expect(prerequisiteIdsForUnit('unit-spanning-tree-optimization')).toEqual([
      'unit-greedy-exchange',
    ]);
    expect(unitById.get('unit-graph-search')?.title).toBe('状態グラフ探索・到達関係');
    expect(unitById.get('unit-shortest-path-certificates')?.title).toBe(
      '重み付き最短路・経路復元・差分制約',
    );
    expect(unitById.get('unit-tree-metric')?.title).toBe('木距離を基準点・直径・中心から捉える');
    expect(unitById.get('unit-tree-decomposition')?.title).toContain('包含木');
    expect(tagById.get('tag-two-sat')?.prerequisiteTagIds).toEqual(['tag-scc-condensation']);
    expect(
      outcomeById.get('outcome-encode-threshold-constraints-as-two-sat')?.prerequisiteOutcomeIds,
    ).toContain('outcome-condense-and-order-directed-graph');
    expect(tagById.get('tag-virtual-tree')?.prerequisiteTagIds).toEqual([
      'tag-tree-ancestor-lca',
      'tag-tree-euler-flattening',
    ]);
    expect(outcomeById.get('outcome-build-virtual-tree')?.prerequisiteOutcomeIds).toEqual([
      'outcome-answer-tree-ancestor-queries',
      'outcome-flatten-tree-by-euler-order',
    ]);
    expect(tagById.get('tag-static-top-tree')?.prerequisiteTagIds).toEqual([
      'tag-rooted-tree-aggregation',
    ]);
    expect(tagById.get('tag-heavy-path-tree-dp')?.prerequisiteTagIds).toEqual([
      'tag-convolution',
      'tag-rooted-tree-aggregation',
    ]);
    expect(
      outcomeById.get('outcome-accelerate-tree-dp-by-heavy-path')?.prerequisiteOutcomeIds,
    ).toContain('outcome-aggregate-rooted-tree');
    expect(unitById.get('unit-heavy-path-tree-dp')).toMatchObject({
      parentId: 'unit-tree-aggregation',
    });
    expect(prerequisiteIdsForUnit('unit-heavy-path-tree-dp')).toEqual([
      'unit-polynomial-convolution',
      'unit-rooted-tree-aggregation',
    ]);
    expect(tagById.get('tag-z-algorithm-prefix-matching')).toMatchObject({
      learningOutcomeIds: ['outcome-build-prefix-match-state'],
      learningUnitCandidateIds: ['unit-z-algorithm'],
    });
    expect(outcomeById.get('outcome-build-prefix-match-state')).toMatchObject({
      learningUnitCandidateIds: ['unit-z-algorithm'],
    });
    expect(outcomeById.get('outcome-build-prefix-match-state')?.statement).toMatch(
      /Z-box.*Z array.*各位置.*prefix.*最大一致長.*prefix照合/u,
    );
    expect(outcomeById.get('outcome-build-prefix-match-state')?.statement).not.toMatch(
      /failure link/iu,
    );
    expect(tagById.get('tag-generating-functions')?.prerequisiteTagIds).toEqual([
      'tag-combinatorial-coefficients',
    ]);
    expect(tagById.get('tag-formal-power-series')?.prerequisiteTagIds).toEqual([
      'tag-convolution',
      'tag-generating-functions',
    ]);
    expect(tagById.get('tag-aho-corasick')?.prerequisiteTagIds).toEqual([
      'tag-finite-pattern-automaton',
      'tag-trie-prefix',
    ]);
    expect(
      outcomeById.get('outcome-build-multi-pattern-automaton')?.prerequisiteOutcomeIds,
    ).toContain('outcome-index-shared-prefixes-with-trie');
    expect(outcomeById.get('outcome-compute-directed-walk-period')?.prerequisiteOutcomeIds).toEqual(
      ['outcome-condense-and-order-directed-graph', 'outcome-reduce-integer-structure-by-gcd'],
    );
    expect(tagById.get('tag-baby-step-giant-step')?.prerequisiteTagIds).toEqual([
      'tag-modular-arithmetic',
    ]);
    expect(tagById.get('tag-cyclic-exponent-counting')?.prerequisiteTagIds).toEqual([
      'tag-multiplicative-order',
    ]);
    expect(tagById.get('tag-multiplicative-order')?.prerequisiteTagIds).toEqual([
      'tag-modular-arithmetic',
      'tag-prime-divisor-decomposition',
    ]);
    expect(tagById.get('tag-modular-arithmetic')?.learningOutcomeIds).toEqual([
      'outcome-compute-in-modular-arithmetic',
    ]);
    expect(tagById.get('tag-dynamic-modular-product')).toMatchObject({
      parentId: 'tag-modular-arithmetic',
      prerequisiteTagIds: ['tag-modular-arithmetic'],
      learningOutcomeIds: ['outcome-maintain-modular-product-under-factor-updates'],
      learningUnitCandidateIds: ['unit-dynamic-modular-product'],
    });
    expect(tagById.get('tag-dynamic-modular-product')?.definition).toMatch(
      /法 m で非零となるものがすべて可逆/u,
    );
    expect(outcomeById.get('outcome-maintain-modular-product-under-factor-updates')).toMatchObject({
      prerequisiteOutcomeIds: ['outcome-compute-in-modular-arithmetic'],
      learningUnitCandidateIds: ['unit-dynamic-modular-product'],
    });
    expect(
      outcomeById.get('outcome-maintain-modular-product-under-factor-updates')?.statement,
    ).toMatch(/非零剰余がすべて可逆かを確認/u);
    for (const outcomeId of [
      'outcome-compute-in-finite-field-extension',
      'outcome-exploit-modular-periodicity',
      'outcome-find-orbit-hit-by-bsgs',
      'outcome-find-period-by-multiplicative-order',
      'outcome-solve-modular-constraints',
    ]) {
      expect(outcomeById.get(outcomeId)?.prerequisiteOutcomeIds).not.toContain(
        'outcome-maintain-modular-product-under-factor-updates',
      );
    }
    expect(unitById.get('unit-modular-product-foundations')).toMatchObject({
      kind: 'section',
      parentId: 'unit-chapter-number-theory',
    });
    expect(unitById.get('unit-modular-arithmetic')).toMatchObject({
      kind: 'subsection',
      parentId: 'unit-modular-product-foundations',
    });
    expect(unitById.get('unit-dynamic-modular-product')).toMatchObject({
      kind: 'subsection',
      parentId: 'unit-modular-product-foundations',
      learningOutcomeIds: ['outcome-maintain-modular-product-under-factor-updates'],
      ownedLearningOutcomeIds: ['outcome-maintain-modular-product-under-factor-updates'],
    });
    expect(prerequisiteIdsForUnit('unit-dynamic-modular-product')).toEqual([
      'unit-modular-arithmetic',
    ]);
    expect(unitById.get('unit-dynamic-modular-product')?.excludedTopics).toEqual(
      expect.arrayContaining([expect.stringMatching(/合成数法.*非零の非可逆因子/u)]),
    );
    expect(tagById.get('tag-linear-matroid-intersection')?.prerequisiteTagIds).toEqual([
      'tag-linear-system-rank',
      'tag-matroid-greedy',
      'tag-randomized-algorithm',
    ]);
    expect(unitById.get('unit-linear-matroid-intersection')?.parentId).toBe('unit-matroid-theory');
    expect(tagById.get('tag-min-weight-general-perfect-matching')?.definition).toMatch(
      /最小重み|weighted blossom|Tutte/u,
    );
    expect(tagById.get('tag-digit-dp')?.learningUnitCandidateIds).toEqual(['unit-digit-dp']);
    expect(tagById.get('tag-automaton-dp')?.learningUnitCandidateIds).toEqual([
      'unit-automaton-dp',
    ]);
    expect(unitById.get('unit-digit-dp')?.parentId).toBe('unit-dp-digit-string');
    expect(unitById.get('unit-automaton-dp')?.parentId).toBe('unit-dp-digit-string');
    expect(tagById.has('tag-digit-automaton-dp')).toBe(false);
    expect(tagById.get('tag-labeled-component-decomposition')?.prerequisiteTagIds).toEqual([
      'tag-generating-functions',
    ]);
    expect(
      outcomeById.get('outcome-count-labeled-structures-by-components')?.prerequisiteOutcomeIds,
    ).toEqual(['outcome-encode-counting-by-generating-function']);
    expect(prerequisiteIdsForUnit('unit-labeled-component-decomposition')).toEqual([
      'unit-generating-functions',
    ]);
    expect(tagById.get('tag-parallel-binary-search')?.prerequisiteTagIds).toEqual([
      'tag-monotone-threshold-search',
    ]);
    expect(tagById.get('tag-parallel-binary-search')?.aliases.join(' ')).not.toMatch(
      /offline threshold connectivity/iu,
    );
    expect(tagById.get('tag-polynomial-taylor-shift')?.prerequisiteTagIds).toEqual([
      'tag-combinatorial-coefficients',
      'tag-convolution',
    ]);
    expect(tagById.get('tag-directional-grid-effect-scan')?.prerequisiteTagIds).toEqual([]);
    expect(tagById.get('tag-convex-hull-trick')?.prerequisiteTagIds).toEqual([]);
    expect(tagById.has('tag-periodic-tree-role-recovery')).toBe(false);
    expect(tagById.has('tag-prefix-interval-multiset-transform')).toBe(false);
    expect(outcomeById.has('outcome-recover-periodic-tree-roles-by-distance-residue')).toBe(false);
    expect(outcomeById.has('outcome-transform-multisets-in-prefix-interval-basis')).toBe(false);
    expect(unitById.has('unit-periodic-tree-role-recovery')).toBe(false);
    expect(unitById.has('unit-prefix-interval-multiset-transform')).toBe(false);
    expect(unitById.get('unit-directional-grid-effect-scan')?.parentId).toBe('unit-graph-search');
    expect(prerequisiteIdsForUnit('unit-directional-grid-effect-scan')).toEqual([]);
    expect(prerequisiteIdsForUnit('unit-line-envelope')).toEqual([]);
    expect(unitById.get('unit-flow-matching')?.kind).toBe('section');
    expect(unitById.get('unit-max-flow-min-cut')?.parentId).toBe('unit-flow-matching');
    expect(unitById.has('unit-events-offline')).toBe(false);
    expect(tagById.get('tag-event-sweep')?.learningUnitCandidateIds).toEqual(['unit-event-sweep']);
    expect(tagById.get('tag-reverse-offline')?.learningUnitCandidateIds).toEqual([
      'unit-reverse-offline',
    ]);
    expect(tagById.get('tag-contribution-reordering')?.learningUnitCandidateIds).toEqual([
      'unit-contribution-reordering',
    ]);
    for (const unitId of [
      'unit-event-sweep',
      'unit-reverse-offline',
      'unit-contribution-reordering',
    ]) {
      expect(unitById.get(unitId)).toMatchObject({
        kind: 'section',
        parentId: 'unit-chapter-modeling',
      });
    }
    expect(unitById.get('unit-kinetic-order-maintenance')?.parentId).toBe('unit-event-sweep');

    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.homeAndReadiness).toContain(
      'primary Outcomeのowner Unit',
    );
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.homeAndReadiness).toContain(
      'home placementを変えない',
    );
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.prerequisite).toContain('curriculum prerequisite');
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.prerequisite).toContain('precedence constraint');
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.relatedTags).toContain('often_combined');

    expect(tagById.get('tag-event-sweep')?.relatedTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tagId: 'tag-coordinate-compression', type: 'contrast' }),
        expect.objectContaining({ tagId: 'tag-coordinate-compression', type: 'often_combined' }),
      ]),
    );
    expect(tagById.get('tag-parallel-binary-search')?.relatedTags).toContainEqual(
      expect.objectContaining({
        tagId: 'tag-monotone-threshold-search',
        type: 'extension',
      }),
    );
    expect(tagById.get('tag-directional-grid-effect-scan')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-event-sweep', type: 'analogy' }),
    );
    expect(tagById.get('tag-convex-hull-trick')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-basic-convex-optimization', type: 'analogy' }),
    );
    expect(tagById.get('tag-event-sweep')?.semanticSignature.excludedPatterns).toContain(
      '固定.*方向.*scanだけ',
    );
    expect(tagById.get('tag-flow-feasibility-lower-bounds')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-max-flow-min-cut', type: 'reduction' }),
    );
    expect(tagById.get('tag-min-cost-flow')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-max-flow-min-cut', type: 'extension' }),
    );
    expect(tagById.get('tag-difference-constraints')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-shortest-path', type: 'reduction' }),
    );
    expect(tagById.get('tag-subset-convolution')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-convolution', type: 'analogy' }),
    );
    expect(tagById.get('tag-bostan-mori')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-generating-functions', type: 'extension' }),
    );
    expect(tagById.get('tag-polynomial-taylor-shift')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-convolution', type: 'reduction' }),
    );
    expect(tagById.get('tag-poset-dilworth-antichain')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-bipartite-matching-hall', type: 'reduction' }),
    );
    expect(
      FINAL_TAG_DIRECTED_RELATION_SEEDS.filter(({ type }) => type === 'specialization').map(
        ({ sourceTagId, targetTagId }) => `${sourceTagId}->${targetTagId}`,
      ),
    ).toEqual([
      'tag-aho-corasick->tag-finite-pattern-automaton',
      'tag-steiner-tree-dp->tag-subset-bitmask-dp',
    ]);
    expect(tagById.get('tag-subset-zeta-mobius-transform')?.relatedTags).toContainEqual(
      expect.objectContaining({ tagId: 'tag-divisor-mobius-inversion', type: 'analogy' }),
    );
    expect(tagById.get('tag-virtual-tree')?.relatedTags).toContainEqual(
      expect.objectContaining({
        tagId: 'tag-tree-ancestor-lca',
        type: 'implementation_substrate',
      }),
    );
  });

  it('separates unique direct Unit ownership from exact descendant navigation rollups', () => {
    const normalizeIds = (ids: readonly string[]): string[] => [...new Set(ids)].sort();
    const units = FINAL_LEARNING_UNIT_CANDIDATES;

    for (const tag of FINAL_TAXONOMY_TAGS) {
      const ownerUnitIds = units
        .filter((unit) => unit.ownedTagIds.includes(tag.id))
        .map((unit) => unit.id);
      expect(ownerUnitIds, tag.id).toHaveLength(1);
      expect(ownerUnitIds, tag.id).toEqual(tag.learningUnitCandidateIds);
    }

    for (const outcome of FINAL_TAXONOMY_OUTCOMES) {
      const ownerUnitIds = units
        .filter((unit) => unit.ownedLearningOutcomeIds.includes(outcome.id))
        .map((unit) => unit.id);
      const scopedTagOwnerUnitIds = outcome.scopeTagIds.flatMap((tagId) =>
        units.filter((unit) => unit.ownedTagIds.includes(tagId)).map((unit) => unit.id),
      );
      expect(ownerUnitIds, outcome.id).toHaveLength(1);
      expect(ownerUnitIds, outcome.id).toEqual(outcome.learningUnitCandidateIds);
      expect(normalizeIds(scopedTagOwnerUnitIds), outcome.id).toEqual(ownerUnitIds);
    }

    for (const unit of units) {
      const children = units.filter((candidate) => candidate.parentId === unit.id);
      const expectedTagIds = normalizeIds([
        ...unit.ownedTagIds,
        ...children.flatMap((child) => child.tagIds),
      ]);
      const expectedOutcomeIds = normalizeIds([
        ...unit.ownedLearningOutcomeIds,
        ...children.flatMap((child) => child.learningOutcomeIds),
      ]);
      expect(normalizeIds(unit.tagIds), `${unit.id}/tagIds`).toEqual(expectedTagIds);
      expect(normalizeIds(unit.learningOutcomeIds), `${unit.id}/learningOutcomeIds`).toEqual(
        expectedOutcomeIds,
      );
      expect(
        unit.ownedTagIds.every((tagId) => unit.tagIds.includes(tagId)),
        unit.id,
      ).toBe(true);
      expect(
        unit.ownedLearningOutcomeIds.every((outcomeId) =>
          unit.learningOutcomeIds.includes(outcomeId),
        ),
        unit.id,
      ).toBe(true);
      if (unit.ownedTagIds.length === 0 && unit.ownedLearningOutcomeIds.length === 0) {
        expect(children.length, unit.id).toBeGreaterThan(0);
      }
    }
  });

  it('treats mathematical notation in semantic signatures as literal text', () => {
    const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
    const fixtures: readonly [
      string,
      (
        | 'objectPatterns'
        | 'triggerPatterns'
        | 'invariantPatterns'
        | 'goalPatterns'
        | 'excludedPatterns'
      ),
      string,
    ][] = [
      ['tag-generating-function-coefficients', 'triggerPatterns', 'F=xΦ(F)'],
      ['tag-implicit-binary-tree-arithmetic', 'triggerPatterns', '2v+1'],
      ['tag-implicit-binary-tree-arithmetic', 'invariantPatterns', '親はfloor(v/2)'],
      ['tag-baby-step-giant-step', 'triggerPatterns', 'f^t(s)=g'],
      ['tag-baby-step-giant-step', 'triggerPatterns', 'g^t=h'],
      ['tag-baby-step-giant-step', 'invariantPatterns', 't=iB+j'],
      ['tag-cycle-space-basis', 'triggerPatterns', 'M-N+Cが小さい'],
      ['tag-cycle-space-basis', 'invariantPatterns', 'dim C(G)=M-N+C'],
      ['tag-segment-tree-canonical-decomposition', 'invariantPatterns', 'O(log N) nodes'],
      ['tag-idempotent-overlap-range-query', 'invariantPatterns', 'f(x,x)=x'],
      ['tag-idempotent-overlap-range-query', 'goalPatterns', 'O(1) range query'],
      ['tag-bezout-diophantine', 'triggerPatterns', 'ax+by=c'],
      ['tag-multiplicative-order', 'triggerPatterns', 'a^k=1の最小k'],
      ['tag-convolution', 'triggerPatterns', 'i+j=k'],
      ['tag-formal-power-series', 'invariantPatterns', 'mod x^n'],
      ['tag-polynomial-taylor-shift', 'triggerPatterns', 'P(x+a) の全係数'],
      ['tag-polynomial-taylor-shift', 'excludedPatterns', '一般の f(g(x)) を計算する'],
      ['tag-fps-composition-power-projection', 'triggerPatterns', 'f(g(x))'],
      ['tag-fps-composition-power-projection', 'triggerPatterns', 'g(x)^kの係数pairing'],
      ['tag-bostan-mori', 'invariantPatterns', 'Q(x)Q(-x)'],
      ['tag-gaussian-integers-two-squares', 'objectPatterns', 'a+bi'],
      ['tag-gaussian-integers-two-squares', 'triggerPatterns', 'x^2+y^2=n'],
      ['tag-information-theoretic-query-design', 'invariantPatterns', 'alphabet^queries >= states'],
    ];

    for (const [tagId, dimension, literal] of fixtures) {
      const patterns = tagById.get(tagId)?.semanticSignature[dimension];
      expect(patterns, `${tagId}/${dimension}`).toBeDefined();
      expect(
        patterns?.some((pattern) => new RegExp(pattern, 'iu').test(literal)),
        `${tagId}/${dimension}/${literal}`,
      ).toBe(true);
    }
  });

  it('classifies every reviewed inventory claim and keeps singleton exceptions exact', async () => {
    const records = await loadedRecords;
    const table = await loadedDecisionTable;
    const reversed = buildFullCorpusPrimaryDecisionTable([...records].reverse());

    expect(records).toHaveLength(868);
    expect(table.problemCount).toBe(868);
    expect(table.decisions).toHaveLength(868);
    expect(reversed).toEqual(table);
    expect(Object.keys(EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS)).toHaveLength(868);

    const recordsById = new Map(records.map((record) => [record.problemId, record]));
    const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
    const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
    const unitById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));
    const problemsByTag = new Map<string, Set<string>>();
    const problemsByOutcome = new Map<string, Set<string>>();

    for (const decision of table.decisions) {
      const record = recordsById.get(decision.problemId);
      expect(record).toBeDefined();
      expect(decision.primaryTagIds).toContain(
        EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS[decision.problemId],
      );
      expect(decision.primaryTagIds.some((tagId) => NON_PRIMARY_TAG_IDS.includes(tagId))).toBe(
        false,
      );
      expect(NON_PRIMARY_OUTCOME_IDS).not.toContain(decision.primaryOutcomeId);
      expect(outcomeById.has(decision.primaryOutcomeId)).toBe(true);
      expect(decision.acceptanceStatus).toBe('proposed');
      expect(decision.selectionRationale.length).toBeGreaterThan(0);

      const expectedClaimPaths = [
        ...(record?.typicalTechniques.map((_, index) => '/typicalTechniques/' + String(index)) ??
          []),
        ...(record?.prerequisiteCandidates.map(
          (_, index) => '/prerequisiteCandidates/' + String(index),
        ) ?? []),
      ].sort();
      const actualClaimPaths = [
        ...new Set(decision.claimDispositions.map(({ claimRef }) => claimRef.claimPath)),
      ].sort();
      expect(expectedClaimPaths.every((claimPath) => actualClaimPaths.includes(claimPath))).toBe(
        true,
      );
      expect(
        actualClaimPaths
          .filter((claimPath) => !expectedClaimPaths.includes(claimPath))
          .every((claimPath) => /^\/implementationConcerns\/[0-9]+$/u.test(claimPath)),
      ).toBe(true);
      for (const claimPath of expectedClaimPaths) {
        const kinds = new Set(
          decision.claimDispositions
            .filter(({ claimRef }) => claimRef.claimPath === claimPath)
            .map(({ kind }) => kind),
        );
        expect(kinds.size === 1 || (!kinds.has('baseline') && !kinds.has('problem_specific'))).toBe(
          true,
        );
      }
      expect(
        decision.claimDispositions.every(
          ({ claimRef, kind, tagIds }) =>
            claimRef.owner.problemId === decision.problemId &&
            ((kind !== 'primary' && kind !== 'same_tag') ||
              tagIds.every((tagId) => decision.primaryTagIds.includes(tagId))) &&
            (kind !== 'supporting' ||
              tagIds.every((tagId) => decision.supportingTagIds.includes(tagId))),
        ),
      ).toBe(true);
      const primaryDispositionTagIds = new Set(
        decision.claimDispositions.flatMap(({ kind, tagIds }) =>
          kind === 'primary' ? tagIds : [],
        ),
      );
      const supportingDispositionTagIds = new Set(
        decision.claimDispositions.flatMap(({ kind, tagIds }) =>
          kind === 'supporting' ? tagIds : [],
        ),
      );
      expect(decision.primaryTagIds.every((tagId) => primaryDispositionTagIds.has(tagId))).toBe(
        true,
      );
      expect(
        decision.supportingTagIds.every((tagId) => supportingDispositionTagIds.has(tagId)),
      ).toBe(true);

      const primaryOutcomeIds = [
        decision.primaryOutcomeId,
        ...decision.additionalPrimaryOutcomeIds,
      ];
      const assignedOutcomeIds = [...primaryOutcomeIds, ...decision.supportingOutcomeIds];
      expect(ownerUnitIdForOutcome(decision.primaryOutcomeId), decision.problemId).toBeDefined();
      expect(assignedOutcomeIds.every((outcomeId) => outcomeById.has(outcomeId))).toBe(true);

      for (const tagId of [...decision.primaryTagIds, ...decision.supportingTagIds]) {
        problemsByTag.set(
          tagId,
          new Set([...(problemsByTag.get(tagId) ?? []), decision.problemId]),
        );
      }
      for (const outcomeId of [
        decision.primaryOutcomeId,
        ...decision.additionalPrimaryOutcomeIds,
        ...decision.supportingOutcomeIds,
      ]) {
        problemsByOutcome.set(
          outcomeId,
          new Set([...(problemsByOutcome.get(outcomeId) ?? []), decision.problemId]),
        );
      }
    }

    const abc405g = table.decisions.find(({ problemId }) => problemId === 'abc405-g');
    expect(abc405g?.supportingTagIds).toContain('tag-dynamic-modular-product');
    expect(abc405g?.supportingTagIds).not.toContain('tag-modular-arithmetic');
    expect(abc405g?.supportingOutcomeIds).toContain(
      'outcome-maintain-modular-product-under-factor-updates',
    );
    expect(abc405g?.supportingOutcomeIds).not.toContain('outcome-compute-in-modular-arithmetic');
    expect(
      abc405g?.supportingTagDecisions
        .find(({ tagId }) => tagId === 'tag-dynamic-modular-product')
        ?.decisionBasis.map(({ claimPath }) => claimPath),
    ).toEqual(['/implementationConcerns/0']);
    const abc411e = table.decisions.find(({ problemId }) => problemId === 'abc411-e');
    expect(abc411e?.primaryTagIds).toEqual([
      'tag-contribution-reordering',
      'tag-dynamic-modular-product',
    ]);
    expect(abc411e?.primaryOutcomeId).toBe('outcome-reorder-counting-contributions');
    expect(abc411e?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-maintain-modular-product-under-factor-updates',
    ]);
    expect(
      abc411e === undefined ? undefined : ownerUnitIdForOutcome(abc411e.primaryOutcomeId),
    ).toBe('unit-contribution-reordering');
    expect(abc411e?.supportingTagIds).toContain('tag-modular-arithmetic');
    expect(abc411e?.supportingOutcomeIds).toContain('outcome-compute-in-modular-arithmetic');
    expect(
      abc411e?.claimDispositions.find(
        ({ claimRef, kind }) => claimRef.claimPath === '/typicalTechniques/2' && kind === 'primary',
      )?.tagIds,
    ).toEqual(['tag-dynamic-modular-product']);
    const abc456g = table.decisions.find(({ problemId }) => problemId === 'abc456-g');
    expect(abc456g?.supportingOutcomeIds).toContain(
      'outcome-maintain-modular-product-under-factor-updates',
    );
    expect(abc456g?.supportingOutcomeIds).not.toContain('outcome-compute-in-modular-arithmetic');
    expect(
      abc456g?.claimDispositions.find(
        ({ claimRef, kind }) =>
          claimRef.claimPath === '/implementationConcerns/0' && kind === 'supporting',
      )?.tagIds,
    ).toEqual(['tag-dynamic-modular-product']);
    const abc456gModularEvidence = abc456g?.supportingTagDecisions.find(
      ({ tagId }) => tagId === 'tag-dynamic-modular-product',
    )?.decisionBasis;
    expect(abc456gModularEvidence?.map(({ claimPath }) => claimPath)).toEqual([
      '/implementationConcerns/0',
    ]);
    expect(
      abc456gModularEvidence?.find(({ claimPath }) => claimPath === '/implementationConcerns/0')
        ?.text,
    ).toMatch(/0因子.*mod逆元/u);

    const tagHasAncestor = (tagId: string, ancestorId: string): boolean => {
      const visited = new Set<string>();
      let currentId: string | null = tagId;
      while (currentId !== null && !visited.has(currentId)) {
        if (currentId === ancestorId) return true;
        visited.add(currentId);
        currentId = tagById.get(currentId)?.parentId ?? null;
      }
      return false;
    };
    for (const tag of FINAL_TAXONOMY_TAGS) {
      if (tag.parentId === null) continue;
      expect(problemsByTag.get(tag.id)?.size ?? 0).toBeGreaterThanOrEqual(
        SINGLE_PROBLEM_TAG_IDS.includes(tag.id) ? 1 : 2,
      );
      for (const problemId of tag.representativeProblemIds) {
        const decision = table.decisions.find((candidate) => candidate.problemId === problemId);
        expect(
          [...(decision?.primaryTagIds ?? []), ...(decision?.supportingTagIds ?? [])].some(
            (tagId) => tagHasAncestor(tagId, tag.id),
          ),
        ).toBe(true);
      }
    }
    for (const outcome of FINAL_TAXONOMY_OUTCOMES) {
      if (NON_PRIMARY_OUTCOME_IDS.includes(outcome.id)) continue;
      expect(problemsByOutcome.get(outcome.id)?.size ?? 0).toBeGreaterThanOrEqual(
        SINGLE_PROBLEM_OUTCOME_IDS.includes(outcome.id) ? 1 : 2,
      );
    }

    const materializedUnits = materializeLearningUnitCandidates(table.decisions);
    const unitAncestors = (unitId: string): readonly string[] => {
      const result: string[] = [];
      let currentId: string | null = unitId;
      while (currentId !== null) {
        result.push(currentId);
        currentId = unitById.get(currentId)?.parentId ?? null;
      }
      return result;
    };
    const expectedProblemIdsByUnit = new Map<string, Set<string>>();
    for (const decision of table.decisions) {
      const homeUnitId = ownerUnitIdForOutcome(decision.primaryOutcomeId);
      expect(homeUnitId, decision.problemId).toBeDefined();
      for (const unitId of unitAncestors(homeUnitId ?? '')) {
        const problemIds = expectedProblemIdsByUnit.get(unitId) ?? new Set<string>();
        problemIds.add(decision.problemId);
        expectedProblemIdsByUnit.set(unitId, problemIds);
      }
    }
    for (const unit of materializedUnits) {
      expect(unit.problemIds, `${unit.id}/subtree homes`).toEqual(
        [...(expectedProblemIdsByUnit.get(unit.id) ?? [])].sort(),
      );
    }

    const actualSingletonOutcomes = FINAL_TAXONOMY_OUTCOMES.filter(
      (outcome) =>
        !NON_PRIMARY_OUTCOME_IDS.includes(outcome.id) &&
        (problemsByOutcome.get(outcome.id)?.size ?? 0) === 1,
    )
      .map((outcome) => outcome.id)
      .sort();
    expect(actualSingletonOutcomes).toEqual([...SINGLE_PROBLEM_OUTCOME_IDS].sort());

    expect(
      table.decisions.every((decision) =>
        FINAL_LEARNING_UNIT_CANDIDATES.some((unit) =>
          unit.ownedLearningOutcomeIds.includes(decision.primaryOutcomeId),
        ),
      ),
    ).toBe(true);
    expect(unitById.size).toBe(FINAL_LEARNING_UNIT_CANDIDATES.length);
  });

  it('separates cycle-space reasoning from near-tree kernelization without a lowlink prerequisite', async () => {
    const table = await loadedDecisionTable;
    const decision = table.decisions.find(({ problemId }) => problemId === 'abc419-g');
    const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
    const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
    const unitById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));

    expect(decision?.primaryTagIds).toEqual([
      'tag-cycle-space-basis',
      'tag-near-tree-kernelization',
    ]);
    expect(decision?.primaryOutcomeId).toBe('outcome-kernelize-near-tree-graph');
    expect(decision?.additionalPrimaryOutcomeIds).toEqual(['outcome-use-cycle-space-basis']);
    expect(
      decision === undefined ? undefined : ownerUnitIdForOutcome(decision.primaryOutcomeId),
    ).toBe('unit-near-tree-kernelization');
    expect(decision?.supportingTagIds).toEqual([
      'tag-backtracking-search',
      'tag-bounded-enumeration',
    ]);
    expect(
      decision?.claimDispositions.find(
        ({ claimRef, kind }) => claimRef.claimPath === '/typicalTechniques/2' && kind === 'primary',
      )?.tagIds,
    ).toEqual(['tag-cycle-space-basis']);

    expect(tagById.get('tag-near-tree-kernelization')?.prerequisiteTagIds).toEqual([
      'tag-cycle-space-basis',
      'tag-graph-core-peeling',
    ]);
    expect(tagById.get('tag-near-tree-kernelization')?.prerequisiteTagIds).not.toContain(
      'tag-lowlink-critical-structure',
    );
    expect(tagById.get('tag-cycle-space-basis')?.relatedTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tagId: 'tag-degree-parity-subgraph', type: 'analogy' }),
        expect.objectContaining({ tagId: 'tag-xor-linear-basis', type: 'analogy' }),
      ]),
    );
    expect(unitById.get('unit-cycle-space-basis')).toMatchObject({
      kind: 'section',
      parentId: 'unit-chapter-graph',
    });
    expect(unitById.get('unit-cycle-space-basis')?.excludedTopics).toEqual(
      expect.arrayContaining([expect.stringContaining('橋・関節点')]),
    );
    expect(tagById.get('tag-cycle-space-basis')?.definition).toMatch(
      /spanning forest.*dim C\(G\)=M-N\+C/u,
    );
    expect(tagById.get('tag-cycle-space-basis')?.semanticSignature.objectPatterns).toContain(
      '連結成分',
    );
    expect(tagById.get('tag-cycle-space-basis')?.definition).toContain('連結graphではC=1');
    expect(prerequisiteIdsForUnit('unit-near-tree-kernelization')).toEqual([
      'unit-cycle-space-basis',
      'unit-graph-core',
    ]);
    expect(outcomeById.get('outcome-use-cycle-space-basis')?.statement).toMatch(
      /spanning forest.*dim C\(G\)=M-N\+C/u,
    );
    expect(outcomeById.get('outcome-use-cycle-space-basis')?.statement).toContain(
      '連結graphではC=1',
    );
    expect(outcomeById.get('outcome-use-cycle-space-basis')?.statement).toContain(
      '同一連結成分内のs,t',
    );
    expect(outcomeById.get('outcome-use-cycle-space-basis')?.statement).not.toContain('ABC419-G');
    expect(outcomeById.get('outcome-use-cycle-space-basis')?.statement).toContain('P XOR P_0');
  });

  it('preserves adopted skills and derives each home from its primary Outcome owner', async () => {
    const table = await loadedDecisionTable;
    const byProblemId = new Map(table.decisions.map((decision) => [decision.problemId, decision]));
    const expectedPrimary: Readonly<Record<string, readonly [string, string]>> = {
      'abc216-e': ['outcome-allocate-by-convex-marginal-costs', 'unit-separable-convex-marginals'],
      'abc228-g': [
        'outcome-determinize-automaton-by-subsets',
        'unit-automaton-subset-construction',
      ],
      'abc233-ex': [
        'outcome-share-threshold-checks-by-parallel-binary-search',
        'unit-parallel-binary-search',
      ],
      'abc235-ex': ['outcome-build-component-merge-tree', 'unit-dsu-merge-tree'],
      'abc238-g': [
        'outcome-compare-algebraic-objects-by-random-fingerprint',
        'unit-randomized-algebraic-fingerprint',
      ],
      'abc248-f': ['outcome-design-frontier-profile-dp', 'unit-frontier-profile-dp'],
      'abc236-f': ['outcome-optimize-weighted-matroid-basis', 'unit-matroid-greedy'],
      'abc237-ex': [
        'outcome-optimize-poset-antichain-by-dilworth',
        'unit-poset-dilworth-antichain',
      ],
      'abc251-ex': [
        'outcome-accelerate-iteration-by-characteristic-p-frobenius',
        'unit-finite-field-frobenius',
      ],
      'abc250-ex': ['outcome-model-and-compute-shortest-path', 'unit-weighted-shortest-path'],
      'abc261-e': ['outcome-compose-finite-functions', 'unit-finite-function-composition'],
      'abc270-g': ['outcome-find-orbit-hit-by-bsgs', 'unit-baby-step-giant-step'],
      'abc282-f': ['outcome-answer-idempotent-range-query', 'unit-idempotent-overlap-range-query'],
      'abc284-e': ['outcome-enumerate-by-reversible-backtracking', 'unit-backtracking-search'],
      'abc285-g': ['outcome-solve-flow-with-lower-bounds', 'unit-flow-lower-bounds'],
      'abc294-ex': ['outcome-compute-subset-convolution', 'unit-subset-convolution'],
      'abc295-ex': ['outcome-apply-subset-zeta-mobius-transform', 'unit-subset-transforms'],
      'abc296-ex': ['outcome-design-frontier-profile-dp', 'unit-frontier-profile-dp'],
      'abc300-ex': ['outcome-extract-rational-series-coefficient', 'unit-bostan-mori'],
      'abc303-e': ['outcome-use-tree-diameter-extrema', 'unit-tree-metric'],
      'abc303-ex': ['outcome-encode-labeled-trees-by-prufer-code', 'unit-prufer-code'],
      'abc306-g': ['outcome-compute-directed-walk-period', 'unit-directed-walk-periodicity'],
      'abc309-ex': ['outcome-remove-boundaries-by-reflection', 'unit-reflection-principle'],
      'abc312-ex': ['outcome-normalize-string-to-primitive-period', 'unit-string-periodicity'],
      'abc313-e': ['outcome-evolve-run-length-encoded-state', 'unit-run-length-dynamics'],
      'abc314-f': ['outcome-build-component-merge-tree', 'unit-dsu-merge-tree'],
      'abc315-ex': ['outcome-compute-online-relaxed-convolution', 'unit-relaxed-convolution'],
      'abc317-e': [
        'outcome-precompute-directional-grid-effects',
        'unit-directional-grid-effect-scan',
      ],
      'abc321-g': [
        'outcome-count-labeled-structures-by-components',
        'unit-labeled-component-decomposition',
      ],
      'abc324-f': [
        'outcome-optimize-ratio-by-parametric-search',
        'unit-fractional-parametric-search',
      ],
      'abc327-g': [
        'outcome-count-labeled-structures-by-components',
        'unit-labeled-component-decomposition',
      ],
      'abc336-g': ['outcome-count-euler-circuits-by-best', 'unit-euler-circuit-counting'],
      'abc337-e': [
        'outcome-design-query-code-by-information-bound',
        'unit-information-theoretic-query-design',
      ],
      'abc338-e': ['outcome-detect-crossing-by-cyclic-order', 'unit-cyclic-order-crossing'],
      'abc339-g': ['outcome-build-static-sorted-range-index', 'unit-static-sorted-range-index'],
      'abc344-g': [
        'outcome-maintain-order-through-crossing-events',
        'unit-kinetic-order-maintenance',
      ],
      'abc348-g': ['outcome-optimize-monge-transitions', 'unit-monge-optimization'],
      'abc354-g': ['outcome-optimize-poset-antichain-by-dilworth', 'unit-poset-dilworth-antichain'],
      'abc359-f': ['outcome-allocate-by-convex-marginal-costs', 'unit-separable-convex-marginals'],
      'abc364-g': ['outcome-solve-steiner-tree-by-subset-dp', 'unit-steiner-tree-dp'],
      'abc370-g': ['outcome-sum-multiplicative-function-by-min25-sieve', 'unit-min25-sieve'],
      'abc373-g': ['outcome-solve-weighted-bipartite-matching', 'unit-weighted-bipartite-matching'],
      'abc376-g': [
        'outcome-optimize-tree-order-by-cluster-contraction',
        'unit-tree-precedence-contraction',
      ],
      'abc378-g': ['outcome-translate-sequences-by-rsk', 'unit-rsk-young-tableaux'],
      'abc379-g': ['outcome-design-frontier-profile-dp', 'unit-frontier-profile-dp'],
      'abc383-e': [
        'outcome-sweep-connectivity-by-kruskal-threshold',
        'unit-kruskal-threshold-sweep',
      ],
      'abc393-g': ['outcome-optimize-by-lagrangian-relaxation', 'unit-lagrangian-relaxation'],
      'abc394-g': [
        'outcome-share-threshold-checks-by-parallel-binary-search',
        'unit-parallel-binary-search',
      ],
      'abc396-e': ['outcome-propagate-static-graph-potentials', 'unit-graph-potential-propagation'],
      'abc399-g': [
        'outcome-test-linear-matroid-intersection-rank',
        'unit-linear-matroid-intersection',
      ],
      'abc404-g': ['outcome-solve-difference-constraints', 'unit-difference-constraints'],
      'abc405-f': [
        'outcome-build-laminar-interval-containment-tree',
        'unit-laminar-interval-containment-tree',
      ],
      'abc408-e': [
        'outcome-optimize-mask-by-bitwise-feasibility',
        'unit-bitwise-greedy-feasibility',
      ],
      'abc412-g': [
        'outcome-solve-min-weight-general-perfect-matching',
        'unit-min-weight-general-perfect-matching',
      ],
      'abc415-g': [
        'outcome-stabilize-unbounded-knapsack-by-best-density',
        'unit-eventual-unbounded-knapsack',
      ],
      'abc413-g': ['outcome-dualize-planar-cut-to-path', 'unit-planar-duality'],
      'abc419-f': ['outcome-build-multi-pattern-automaton', 'unit-aho-corasick'],
      'abc419-g': ['outcome-kernelize-near-tree-graph', 'unit-near-tree-kernelization'],
      'abc423-f': ['outcome-apply-subset-zeta-mobius-transform', 'unit-subset-transforms'],
      'abc430-g': ['outcome-prune-range-actions-by-node-invariant', 'unit-segment-tree-beats'],
      'abc433-g': ['outcome-build-suffix-automaton', 'unit-suffix-automaton'],
      'abc444-g': [
        'outcome-represent-integers-as-two-squares',
        'unit-gaussian-integers-two-squares',
      ],
      'abc445-f': [
        'outcome-exponentiate-transition-over-semiring',
        'unit-semiring-matrix-exponentiation',
      ],
      'abc448-e': ['outcome-exponentiate-associative-composition', 'unit-monoid-exponentiation'],
      'abc451-e': [
        'outcome-reconstruct-tree-from-distance-matrix',
        'unit-additive-tree-metric-reconstruction',
      ],
      'abc453-g': ['outcome-persist-data-structure-versions', 'unit-persistence'],
      'abc455-g': [
        'outcome-compare-algebraic-objects-by-random-fingerprint',
        'unit-randomized-algebraic-fingerprint',
      ],
      'abc456-f': ['outcome-maintain-queue-aggregate-with-swag', 'unit-swag'],
      'abc457-g': ['outcome-optimize-poset-antichain-by-dilworth', 'unit-poset-dilworth-antichain'],
      'abc458-f': ['outcome-build-multi-pattern-automaton', 'unit-aho-corasick'],
      'abc459-f': ['outcome-solve-isotonic-regression-by-pav', 'unit-isotonic-regression'],
      'abc464-g': [
        'outcome-optimize-path-matching-by-contraction',
        'unit-path-matching-contraction',
      ],
      'abc465-f': ['outcome-linearize-static-range-information', 'unit-prefix-aggregate'],
      'abc466-f': ['outcome-bound-monotone-total-work', 'unit-amortized-monotone-progress'],
    };

    for (const [problemId, [primaryOutcomeId, expectedHomeUnitId]] of Object.entries(
      expectedPrimary,
    )) {
      const decision = byProblemId.get(problemId);
      expect(decision?.primaryOutcomeId, problemId).toBe(primaryOutcomeId);
      expect(ownerUnitIdForOutcome(primaryOutcomeId), problemId).toBe(expectedHomeUnitId);
    }

    const expectedSupporting: Readonly<Record<string, readonly string[]>> = {
      'abc216-e': [
        'outcome-evaluate-compressed-integer-blocks',
        'outcome-prove-and-search-threshold',
      ],
      'abc236-f': ['outcome-maintain-xor-linear-basis'],
      'abc251-ex': ['outcome-maintain-ordered-interval-partition'],
      'abc263-ex': ['outcome-detect-crossing-by-cyclic-order'],
      'abc267-e': ['outcome-peel-graph-core'],
      'abc270-g': ['outcome-compute-in-modular-arithmetic'],
      'abc284-e': ['outcome-enumerate-bounded-candidates-or-cases'],
      'abc285-g': ['outcome-model-max-flow-min-cut'],
      'abc294-ex': ['outcome-recur-by-edge-deletion-contraction'],
      'abc295-ex': ['outcome-enumerate-subset-state-space'],
      'abc300-ex': ['outcome-compute-convolution-or-correlation'],
      'abc303-ex': [
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ],
      'abc309-ex': ['outcome-compute-convolution-or-correlation'],
      'abc317-e': ['outcome-select-state-graph-search'],
      'abc323-g': ['outcome-shift-polynomial-by-factorial-convolution'],
      'abc315-ex': [
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ],
      'abc324-f': [
        'outcome-process-dag-in-topological-order',
        'outcome-prove-and-search-threshold',
      ],
      'abc328-g': ['outcome-normalize-equivalent-states'],
      'abc336-g': ['outcome-count-combinatorial-objects-by-determinant'],
      'abc354-g': ['outcome-model-max-flow-min-cut'],
      'abc359-f': ['outcome-prove-greedy-order', 'outcome-enumerate-frontier-best-first'],
      'abc374-g': [
        'outcome-compute-transitive-closure',
        'outcome-condense-and-order-directed-graph',
      ],
      'abc376-g': ['outcome-maintain-connectivity-components', 'outcome-prove-greedy-order'],
      'abc378-g': ['outcome-design-minimal-sufficient-state'],
      'abc383-e': ['outcome-augment-components-with-metadata', 'outcome-prove-greedy-order'],
      'abc391-g': ['outcome-run-dp-on-finite-automaton'],
      'abc394-g': ['outcome-maintain-connectivity-components'],
      'abc399-g': ['outcome-solve-linear-system-and-rank'],
      'abc405-f': [
        'outcome-answer-tree-ancestor-queries',
        'outcome-detect-crossing-by-cyclic-order',
      ],
      'abc408-e': ['outcome-maintain-connectivity-components'],
      'abc413-g': ['outcome-maintain-connectivity-components', 'outcome-model-max-flow-min-cut'],
      'abc415-g': ['outcome-prove-greedy-order'],
      'abc424-f': ['outcome-detect-crossing-by-cyclic-order'],
      'abc429-f': ['outcome-exponentiate-transition-over-semiring'],
      'abc448-e': ['outcome-compute-in-modular-arithmetic'],
      'abc451-e': ['outcome-recover-valid-witness'],
      'abc454-e': ['outcome-color-and-classify-bipartite-components'],
      'abc457-g': ['outcome-design-order-preserving-dp'],
    };
    for (const [problemId, supportingOutcomeIds] of Object.entries(expectedSupporting)) {
      expect(
        [
          byProblemId.get(problemId)?.primaryOutcomeId,
          ...(byProblemId.get(problemId)?.additionalPrimaryOutcomeIds ?? []),
          ...(byProblemId.get(problemId)?.supportingOutcomeIds ?? []),
        ],
        problemId,
      ).toEqual(expect.arrayContaining([...supportingOutcomeIds]));
    }

    expect(byProblemId.get('abc300-ex')?.additionalPrimaryOutcomeIds).toEqual([]);
    expect(byProblemId.get('abc315-ex')?.additionalPrimaryOutcomeIds).toEqual([]);
    expect([
      byProblemId.get('abc228-g')?.primaryOutcomeId,
      ...(byProblemId.get('abc228-g')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-run-dp-on-finite-automaton');
    expect([
      byProblemId.get('abc214-h')?.primaryOutcomeId,
      ...(byProblemId.get('abc214-h')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-model-min-cost-flow');
    expect([
      byProblemId.get('abc235-ex')?.primaryOutcomeId,
      ...(byProblemId.get('abc235-ex')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-encode-counting-by-generating-function');
    expect([
      byProblemId.get('abc250-ex')?.primaryOutcomeId,
      ...(byProblemId.get('abc250-ex')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-sweep-connectivity-by-kruskal-threshold');
    expect(byProblemId.get('abc305-ex')?.additionalPrimaryOutcomeIds).not.toContain(
      'outcome-optimize-monge-transitions',
    );
    expect([
      byProblemId.get('abc355-g')?.primaryOutcomeId,
      ...(byProblemId.get('abc355-g')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-optimize-monge-transitions');
    expect([
      byProblemId.get('abc357-g')?.primaryOutcomeId,
      ...(byProblemId.get('abc357-g')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-compute-online-relaxed-convolution');
    expect([
      byProblemId.get('abc466-g')?.primaryOutcomeId,
      ...(byProblemId.get('abc466-g')?.additionalPrimaryOutcomeIds ?? []),
    ]).toContain('outcome-design-carry-or-mixed-radix-dp');
    expect(
      byProblemId
        .get('abc303-e')
        ?.claimDispositions.filter(({ kind }) => kind === 'problem_specific')
        .map(({ claimRef }) => claimRef.claimPath),
    ).toContain('/typicalTechniques/1');
    expect(
      byProblemId
        .get('abc466-f')
        ?.claimDispositions.filter(({ kind }) => kind === 'problem_specific')
        .map(({ claimRef }) => claimRef.claimPath),
    ).toEqual(['/typicalTechniques/0', '/prerequisiteCandidates/0']);
  });

  it('keeps every co-primary claim bound to its exact skill instead of broadcasting all primary Tags', async () => {
    const table = await loadedDecisionTable;
    const byProblemId = new Map(table.decisions.map((decision) => [decision.problemId, decision]));
    const tagIdsAt = (
      problemId: string,
      claimPath: string,
      kind: 'primary' | 'supporting' | 'same_tag',
    ): readonly string[] =>
      [
        ...new Set(
          (byProblemId.get(problemId)?.claimDispositions ?? []).flatMap((disposition) =>
            disposition.claimRef.claimPath === claimPath && disposition.kind === kind
              ? disposition.tagIds
              : [],
          ),
        ),
      ].sort();

    const expectedPrimaryByPath: Readonly<
      Record<string, Readonly<Record<string, readonly string[]>>>
    > = {
      'abc301-ex': {
        '/typicalTechniques/0': ['tag-kruskal-threshold-sweep'],
        '/typicalTechniques/1': ['tag-lowlink-critical-structure'],
      },
      'abc311-e': {
        '/typicalTechniques/0': ['tag-dp-state-equivalence'],
        '/typicalTechniques/1': ['tag-grid-table-dp'],
      },
      'abc318-ex': {
        '/typicalTechniques/0': ['tag-labeled-component-decomposition'],
        '/typicalTechniques/1': ['tag-formal-power-series'],
      },
      'abc331-g': {
        '/typicalTechniques/0': ['tag-inclusion-exclusion'],
        '/typicalTechniques/1': ['tag-generating-functions'],
      },
      'abc355-g': {
        '/typicalTechniques/0': ['tag-lagrangian-relaxation'],
        '/typicalTechniques/1': ['tag-monge-optimization'],
      },
      'abc386-g': {
        '/typicalTechniques/0': ['tag-contribution-reordering'],
        '/typicalTechniques/1': ['tag-labeled-component-decomposition'],
      },
      'abc418-g': {
        '/typicalTechniques/0': ['tag-finite-pattern-automaton'],
        '/typicalTechniques/1': ['tag-automaton-dp'],
      },
      'abc422-g': {
        '/typicalTechniques/0': ['tag-generating-functions'],
        '/typicalTechniques/1': ['tag-convolution'],
      },
      'abc466-g': {
        '/typicalTechniques/0': ['tag-potential-dsu'],
        '/typicalTechniques/1': ['tag-carry-mixed-radix-dp'],
      },
    };
    for (const [problemId, byClaimPath] of Object.entries(expectedPrimaryByPath)) {
      for (const [claimPath, expectedTagIds] of Object.entries(byClaimPath)) {
        expect(tagIdsAt(problemId, claimPath, 'primary'), `${problemId}${claimPath}`).toEqual(
          expectedTagIds,
        );
      }
    }

    expect(tagIdsAt('abc318-ex', '/typicalTechniques/0', 'supporting')).toEqual([
      'tag-generating-functions',
    ]);
    expect(tagIdsAt('abc318-ex', '/typicalTechniques/1', 'supporting')).toEqual([]);
    expect(tagIdsAt('abc466-g', '/prerequisiteCandidates/0', 'same_tag')).toEqual([
      'tag-carry-mixed-radix-dp',
      'tag-potential-dsu',
    ]);

    const multiPrimaryDecisions = table.decisions.filter(
      (decision) => decision.additionalPrimaryOutcomeIds.length > 0,
    );
    expect(multiPrimaryDecisions.length).toBeGreaterThan(50);
    expect(
      multiPrimaryDecisions.some((decision) =>
        decision.claimDispositions.some(
          ({ kind, tagIds }) =>
            (kind === 'primary' || kind === 'same_tag') &&
            tagIds.length < decision.primaryTagIds.length,
        ),
      ),
    ).toBe(true);

    expect(tagIdsAt('abc378-g', '/typicalTechniques/0', 'primary')).toEqual([
      'tag-rsk-young-tableaux',
    ]);
    expect(tagIdsAt('abc378-g', '/typicalTechniques/1', 'same_tag')).toEqual([]);
    expect(tagIdsAt('abc378-g', '/typicalTechniques/1', 'supporting')).toEqual([
      'tag-dp-state-equivalence',
    ]);
  });

  it('preserves semantic roles under input reordering and keeps prerequisite DAGs separate', async () => {
    const records = await loadedRecords;
    const normal = buildFullCorpusPrimaryDecisionTable(records);
    const reversed = buildFullCorpusPrimaryDecisionTable([...records].reverse());
    expect(reversed).toEqual(normal);
    const byId = new Map(normal.decisions.map((d) => [d.problemId, d]));
    // Independently read from the adopted Inventory solution, not inferred from current assignments.
    const adoptedSkills = {
      'abc246-f': ['outcome-correct-overlap-by-inversion', 'outcome-enumerate-subsets-by-mask'],
      'abc301-e': [
        'outcome-enumerate-subset-state-space',
        'outcome-model-and-compute-shortest-path',
      ],
      'abc338-f': ['outcome-enumerate-subset-state-space', 'outcome-compute-all-pairs-distance'],
      'abc375-g': [
        'outcome-identify-bridges-and-articulations',
        'outcome-model-and-compute-shortest-path',
      ],
      'abc437-g': [
        'outcome-model-max-flow-min-cut',
        'outcome-recover-valid-witness',
        'outcome-color-and-classify-bipartite-components',
      ],
      'abc453-f': ['outcome-find-weighted-balanced-separator'],
      'abc381-g': [
        'outcome-compute-in-finite-field-extension',
        'outcome-evaluate-at-geometric-points',
      ],
    };
    for (const [id, skills] of Object.entries(adoptedSkills)) {
      const d = byId.get(id);
      if (d === undefined) throw new Error(`Missing decision: ${id}`);
      expect(
        [d.primaryOutcomeId, ...d.additionalPrimaryOutcomeIds, ...d.supportingOutcomeIds],
        id,
      ).toEqual(expect.arrayContaining(skills));
    }
    expect(byId.get('abc246-f')?.primaryOutcomeId).toBe('outcome-correct-overlap-by-inversion');
    expect(byId.get('abc265-e')?.primaryOutcomeId).toBe('outcome-design-minimal-sufficient-state');
    expect(byId.get('abc227-g')?.primaryOutcomeId).toBe('outcome-decompose-by-prime-or-divisor');
    expect(byId.get('abc437-g')?.primaryOutcomeId).toBe('outcome-model-max-flow-min-cut');
    expect(ownerUnitIdForOutcome(byId.get('abc301-e')?.primaryOutcomeId ?? '')).toBe(
      'unit-dp-subset-state',
    );
    expect(byId.get('abc301-e')?.supportingOutcomeIds).toContain(
      'outcome-model-and-compute-shortest-path',
    );
    expect(ownerUnitIdForOutcome(byId.get('abc375-g')?.primaryOutcomeId ?? '')).toBe(
      'unit-lowlink-critical-structure',
    );
    expect(byId.get('abc375-g')?.supportingOutcomeIds).toContain(
      'outcome-model-and-compute-shortest-path',
    );
    expect(prerequisiteIdsForUnit('unit-heavy-path-tree-dp')).toEqual([
      'unit-polynomial-convolution',
      'unit-rooted-tree-aggregation',
    ]);
  });

  it('keeps problem readiness separate from Unit prerequisites', async () => {
    const outcomes = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
    expect(outcomes.get('outcome-classify-game-states')?.prerequisiteOutcomeIds).toEqual([
      'outcome-design-minimal-sufficient-state',
    ]);
    expect(outcomes.get('outcome-design-lis-frontier')?.prerequisiteOutcomeIds).toEqual([
      'outcome-design-order-preserving-dp',
    ]);
    const table = await loadedDecisionTable;
    const game = table.decisions.find((decision) => decision.problemId === 'abc354-e');
    expect(game?.primaryOutcomeId).toBe('outcome-classify-game-states');
    expect(game?.supportingOutcomeIds).toContain('outcome-enumerate-subset-state-space');
    expect(game === undefined ? undefined : ownerUnitIdForOutcome(game.primaryOutcomeId)).toBe(
      ownerUnitIdForOutcome('outcome-classify-game-states'),
    );
    expect(ownerUnitIdForOutcome(game?.primaryOutcomeId ?? '')).not.toBe('unit-dp-subset-state');
    for (const id of ['abc297-g', 'abc255-g', 'abc368-f']) {
      const decision = table.decisions.find((decision) => decision.problemId === id);
      expect(ownerUnitIdForOutcome(decision?.primaryOutcomeId ?? ''), id).not.toBe(
        'unit-dp-subset-state',
      );
    }
    for (const id of ['abc369-f', 'abc393-f', 'abc439-e']) {
      const decision = table.decisions.find((decision) => decision.problemId === id);
      expect(ownerUnitIdForOutcome(decision?.primaryOutcomeId ?? ''), id).toBe('unit-dp-lis');
    }
    for (const id of ['abc339-e', 'abc354-f', 'abc360-g']) {
      const decision = table.decisions.find((decision) => decision.problemId === id);
      expect(ownerUnitIdForOutcome(decision?.primaryOutcomeId ?? ''), id).toBe(
        'unit-dp-value-range',
      );
    }
  });

  it('binds the review manifest to every final Outcome exactly', async () => {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
      readonly learningOutcomeIds: readonly string[];
      readonly reviewUnits: readonly { readonly learningOutcomeIds: readonly string[] }[];
    };
    expect(() => {
      validateContentWorkManifest(manifest);
    }).not.toThrow();
    const expectedOutcomeIds = FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id).sort();
    expect(manifest.learningOutcomeIds).toEqual(expectedOutcomeIds);
    expect(manifest.reviewUnits).toHaveLength(1);
    expect(manifest.reviewUnits[0]?.learningOutcomeIds).toEqual(expectedOutcomeIds);
  });

  it('keeps preview migrations source-backed after coarse concepts are split', () => {
    expect(PREVIEW_FINAL_TAXONOMY_DECISIONS).toHaveLength(12);
    const tagIds = new Set(FINAL_TAXONOMY_TAGS.map((tag) => tag.id));
    const outcomeIds = new Set(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id));
    const unitIds = new Set(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.id));
    for (const decision of PREVIEW_FINAL_TAXONOMY_DECISIONS) {
      expect(decision.evidenceOwnerProblemIds.length).toBeGreaterThan(0);
      expect(decision.representativeProblemIds.length).toBeGreaterThan(0);
      expect(decision.rationale.length).toBeGreaterThan(0);
      const knownIds =
        decision.previewEntityKind === 'tag'
          ? tagIds
          : decision.previewEntityKind === 'outcome'
            ? outcomeIds
            : unitIds;
      expect(decision.finalEntityIds.every((id) => knownIds.has(id))).toBe(true);
      if (decision.action === 'split') {
        expect(decision.splitAssignments.length).toBeGreaterThan(1);
        expect(
          decision.splitAssignments.every(
            (assignment) =>
              decision.finalEntityIds.includes(assignment.finalEntityId) &&
              assignment.problemIds.length > 0 &&
              assignment.representativeProblemIds.length > 0,
          ),
        ).toBe(true);
      }
    }
    const multiplicativeOrderSplit = PREVIEW_FINAL_TAXONOMY_DECISIONS.find(
      (decision) => decision.previewEntityId === 'provisional-tag-multiplicative-order-counting',
    );
    expect(multiplicativeOrderSplit?.finalEntityIds).toEqual(
      expect.arrayContaining([
        'tag-cyclic-exponent-counting',
        'tag-multiplicative-order',
        'tag-prime-divisor-decomposition',
        'tag-divisor-mobius-inversion',
      ]),
    );
    expect(multiplicativeOrderSplit?.finalEntityIds).not.toContain('tag-bezout-diophantine');
    expect(multiplicativeOrderSplit?.finalEntityIds).not.toContain('tag-inclusion-exclusion');
  });
});
