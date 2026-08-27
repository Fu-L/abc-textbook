import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS,
  FINAL_LEARNING_UNIT_CANDIDATES,
  FINAL_LEARNING_UNIT_ORDER_POLICY,
  FINAL_TAXONOMY_OUTCOMES,
  FINAL_TAXONOMY_PLACEMENT_PRINCIPLES,
  FINAL_TAXONOMY_TAGS,
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  PREVIEW_FINAL_TAXONOMY_DECISIONS,
  SINGLE_PROBLEM_OUTCOME_IDS,
  SINGLE_PROBLEM_TAG_IDS,
  SINGLE_PROBLEM_UNIT_IDS,
  buildFullCorpusPrimaryDecisionTable,
  materializeLearningUnitCandidates,
  validateFinalTaxonomyPolicy,
  type ProblemAnalysisInput,
} from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

const inventoryRoot = path.join(process.cwd(), 'src/content/technique-inventory');
const manifestPath = path.join(
  process.cwd(),
  'docs/work-manifests/initial/us2/final-taxonomy/manifest.json',
);

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
  it('defines the nine-chapter dictionary with atomic retrieval Tags and observable Outcomes', () => {
    expect(validateFinalTaxonomyPolicy()).toEqual([]);
    expect(FINAL_TAXONOMY_TAGS).toHaveLength(180);
    expect(FINAL_TAXONOMY_OUTCOMES).toHaveLength(183);
    expect(FINAL_LEARNING_UNIT_CANDIDATES).toHaveLength(196);
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
        'tag-matroid-intersection',
        'tag-general-graph-matching',
        'tag-suffix-automaton',
        'tag-segment-tree-beats',
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

    const learnerTermOwners = new Map<string, string[]>();
    for (const tag of FINAL_TAXONOMY_TAGS) {
      expect(tag.aliases.length).toBeGreaterThan(0);
      expect(tag.learningOutcomeIds.length).toBeGreaterThan(0);
      expect(tag.learningUnitCandidateIds.length).toBeGreaterThan(0);
      expect(tag.representativeProblemIds.length).toBeGreaterThanOrEqual(
        SINGLE_PROBLEM_TAG_IDS.includes(tag.id) ? 1 : 2,
      );
      for (const term of [...tag.aliases, ...tag.formerNames]) {
        const normalized = term.normalize('NFKC').trim().toLocaleLowerCase('en-US');
        learnerTermOwners.set(normalized, [...(learnerTermOwners.get(normalized) ?? []), tag.id]);
      }
    }
    expect([...learnerTermOwners.values()].filter((tagIds) => new Set(tagIds).size > 1)).toEqual(
      [],
    );

    const orderIndex = new Map(
      FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds.map((unitId, index) => [unitId, index]),
    );
    expect(FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds).toHaveLength(
      FINAL_LEARNING_UNIT_CANDIDATES.length,
    );
    expect(FINAL_LEARNING_UNIT_CANDIDATES.filter((unit) => unit.kind === 'chapter')).toHaveLength(
      9,
    );
    expect(
      FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds.filter(
        (unitId) => unitById.get(unitId)?.kind === 'chapter',
      ),
    ).toEqual([
      'unit-chapter-modeling',
      'unit-chapter-dynamic-programming',
      'unit-chapter-graph',
      'unit-chapter-tree',
      'unit-chapter-query',
      'unit-chapter-string',
      'unit-chapter-number-theory',
      'unit-chapter-combinatorics-algebra',
      'unit-chapter-geometry-optimization',
    ]);
    expect(new Set(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.orderReason)).size).toBe(
      FINAL_LEARNING_UNIT_CANDIDATES.length,
    );
    for (const unit of FINAL_LEARNING_UNIT_CANDIDATES) {
      expect(unit.tagIds.length).toBeGreaterThan(0);
      expect(unit.learningOutcomeIds.length).toBeGreaterThan(0);
      expect(unit.orderReason).not.toMatch(/(?:unit|tag|outcome)-/u);
      if (unit.kind !== 'chapter') expect(unit.excludedTopics.length).toBeGreaterThan(0);
      if (unit.parentId !== null) {
        expect(orderIndex.get(unit.parentId)).toBeLessThan(orderIndex.get(unit.id) ?? -1);
      }
      for (const prerequisiteId of unit.additionalPrerequisiteUnitIds) {
        expect(orderIndex.get(prerequisiteId)).toBeLessThan(orderIndex.get(unit.id) ?? -1);
      }
    }

    expect(tagById.get('tag-spanning-tree-optimization')?.prerequisiteTagIds).toEqual([
      'tag-greedy-exchange-order',
    ]);
    expect(
      outcomeById.get('outcome-construct-optimal-spanning-tree')?.prerequisiteOutcomeIds,
    ).toEqual(['outcome-prove-greedy-order']);
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
    expect(tagById.get('tag-formal-power-series')?.prerequisiteTagIds).toEqual(['tag-convolution']);
    expect(tagById.get('tag-aho-corasick')?.prerequisiteTagIds).toEqual(['tag-trie-prefix']);
    expect(
      outcomeById.get('outcome-build-multi-pattern-automaton')?.prerequisiteOutcomeIds,
    ).toContain('outcome-index-shared-prefixes-with-trie');
    expect(outcomeById.get('outcome-compute-directed-walk-period')?.prerequisiteOutcomeIds).toEqual(
      ['outcome-condense-and-order-directed-graph', 'outcome-reduce-integer-structure-by-gcd'],
    );
    expect(unitById.get('unit-flow-matching')?.kind).toBe('section');
    expect(unitById.get('unit-max-flow-min-cut')?.parentId).toBe('unit-flow-matching');

    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.homeAndReadiness).toContain('co-primary Outcome');
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.homeAndReadiness).toContain('ready-after');
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
    const orderIndex = new Map(
      FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds.map((unitId, index) => [unitId, index]),
    );
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
      expect(
        [...new Set(decision.claimDispositions.map(({ claimRef }) => claimRef.claimPath))].sort(),
      ).toEqual(expectedClaimPaths);
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

      const primaryUnitIds = [
        decision.primaryOutcomeId,
        ...decision.additionalPrimaryOutcomeIds,
      ].flatMap((outcomeId) => outcomeById.get(outcomeId)?.learningUnitCandidateIds ?? []);
      expect(primaryUnitIds).toContain(decision.presentationUnitId);
      expect(decision.learningUnitCandidateIds).toContain(decision.presentationUnitId);

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
    for (const unit of materializedUnits) {
      if (unit.kind === 'chapter') continue;
      expect(new Set(unit.problemIds).size).toBeGreaterThanOrEqual(
        SINGLE_PROBLEM_UNIT_IDS.includes(unit.id) ? 1 : 2,
      );
    }

    const actualSingletonTags = FINAL_TAXONOMY_TAGS.filter(
      (tag) => tag.parentId !== null && (problemsByTag.get(tag.id)?.size ?? 0) === 1,
    )
      .map((tag) => tag.id)
      .sort();
    const actualSingletonOutcomes = FINAL_TAXONOMY_OUTCOMES.filter(
      (outcome) =>
        !NON_PRIMARY_OUTCOME_IDS.includes(outcome.id) &&
        (problemsByOutcome.get(outcome.id)?.size ?? 0) === 1,
    )
      .map((outcome) => outcome.id)
      .sort();
    const actualSingletonUnits = materializedUnits
      .filter((unit) => unit.kind !== 'chapter' && new Set(unit.problemIds).size === 1)
      .map((unit) => unit.id)
      .sort();
    expect(actualSingletonTags).toEqual([...SINGLE_PROBLEM_TAG_IDS].sort());
    expect(actualSingletonOutcomes).toEqual([...SINGLE_PROBLEM_OUTCOME_IDS].sort());
    expect(actualSingletonUnits).toEqual([...SINGLE_PROBLEM_UNIT_IDS].sort());

    const supportingCanBeLearnedAfterHome = table.decisions.some((decision) => {
      const primaryUnitIds = [
        decision.primaryOutcomeId,
        ...decision.additionalPrimaryOutcomeIds,
      ].flatMap((outcomeId) => outcomeById.get(outcomeId)?.learningUnitCandidateIds ?? []);
      return decision.learningUnitCandidateIds.some(
        (unitId) =>
          !primaryUnitIds.includes(unitId) &&
          (orderIndex.get(unitId) ?? -1) >
            (orderIndex.get(decision.presentationUnitId) ?? Number.POSITIVE_INFINITY),
      );
    });
    expect(supportingCanBeLearnedAfterHome).toBe(true);
    expect(unitById.size).toBe(FINAL_LEARNING_UNIT_CANDIDATES.length);
  });

  it('keeps advanced recognition skills as Home and implementation substrates as supporting', async () => {
    const table = await loadedDecisionTable;
    const byProblemId = new Map(table.decisions.map((decision) => [decision.problemId, decision]));
    const expectedPrimary: Readonly<Record<string, readonly [string, string]>> = {
      'abc228-g': [
        'outcome-determinize-automaton-by-subsets',
        'unit-automaton-subset-construction',
      ],
      'abc236-f': ['outcome-optimize-weighted-matroid-basis', 'unit-matroid-greedy'],
      'abc237-ex': [
        'outcome-optimize-poset-antichain-by-dilworth',
        'unit-poset-dilworth-antichain',
      ],
      'abc251-ex': [
        'outcome-decompose-finite-field-frobenius-orbits',
        'unit-finite-field-frobenius',
      ],
      'abc261-e': ['outcome-compose-finite-functions', 'unit-finite-function-composition'],
      'abc282-f': ['outcome-answer-idempotent-range-query', 'unit-idempotent-overlap-range-query'],
      'abc284-e': ['outcome-enumerate-by-reversible-backtracking', 'unit-backtracking-search'],
      'abc285-g': ['outcome-solve-flow-with-lower-bounds', 'unit-flow-lower-bounds'],
      'abc294-ex': ['outcome-compute-subset-convolution', 'unit-subset-convolution'],
      'abc295-ex': ['outcome-apply-subset-zeta-mobius-transform', 'unit-subset-transforms'],
      'abc296-ex': ['outcome-design-frontier-profile-dp', 'unit-frontier-profile-dp'],
      'abc300-ex': ['outcome-extract-rational-series-coefficient', 'unit-bostan-mori'],
      'abc303-ex': ['outcome-encode-labeled-trees-by-prufer-code', 'unit-prufer-code'],
      'abc306-g': ['outcome-compute-directed-walk-period', 'unit-directed-walk-periodicity'],
      'abc309-ex': ['outcome-remove-boundaries-by-reflection', 'unit-reflection-principle'],
      'abc312-ex': ['outcome-normalize-string-to-primitive-period', 'unit-string-periodicity'],
      'abc313-e': ['outcome-evolve-run-length-encoded-state', 'unit-run-length-dynamics'],
      'abc314-f': ['outcome-build-component-merge-tree', 'unit-dsu-merge-tree'],
      'abc315-ex': ['outcome-compute-online-relaxed-convolution', 'unit-relaxed-convolution'],
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
      'abc364-g': ['outcome-solve-steiner-tree-by-subset-dp', 'unit-steiner-tree-dp'],
      'abc370-g': ['outcome-sum-multiplicative-function-by-min25-sieve', 'unit-min25-sieve'],
      'abc373-g': ['outcome-solve-weighted-bipartite-matching', 'unit-weighted-bipartite-matching'],
      'abc376-g': [
        'outcome-optimize-tree-order-by-cluster-contraction',
        'unit-tree-precedence-contraction',
      ],
      'abc378-g': ['outcome-translate-sequences-by-rsk', 'unit-rsk-young-tableaux'],
      'abc379-g': ['outcome-design-frontier-profile-dp', 'unit-frontier-profile-dp'],
      'abc383-e': ['outcome-build-component-merge-tree', 'unit-dsu-merge-tree'],
      'abc393-g': ['outcome-optimize-by-lagrangian-relaxation', 'unit-lagrangian-relaxation'],
      'abc394-g': [
        'outcome-share-threshold-checks-by-parallel-binary-search',
        'unit-parallel-binary-search',
      ],
      'abc399-g': ['outcome-solve-matroid-intersection', 'unit-matroid-intersection'],
      'abc408-e': [
        'outcome-optimize-mask-by-bitwise-feasibility',
        'unit-bitwise-greedy-feasibility',
      ],
      'abc412-g': ['outcome-solve-general-graph-matching', 'unit-general-graph-matching'],
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
      'abc465-f': ['outcome-apply-subset-zeta-mobius-transform', 'unit-subset-transforms'],
    };

    for (const [problemId, [primaryOutcomeId, presentationUnitId]] of Object.entries(
      expectedPrimary,
    )) {
      const decision = byProblemId.get(problemId);
      expect(decision?.primaryOutcomeId, problemId).toBe(primaryOutcomeId);
      expect(decision?.presentationUnitId, problemId).toBe(presentationUnitId);
    }

    const expectedSupporting: Readonly<Record<string, readonly string[]>> = {
      'abc236-f': ['outcome-maintain-xor-linear-basis'],
      'abc251-ex': ['outcome-maintain-ordered-interval-partition'],
      'abc263-ex': ['outcome-detect-crossing-by-cyclic-order'],
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
      'abc315-ex': [
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ],
      'abc324-f': [
        'outcome-process-dag-in-topological-order',
        'outcome-prove-and-search-threshold',
      ],
      'abc336-g': ['outcome-count-combinatorial-objects-by-determinant'],
      'abc354-g': ['outcome-model-max-flow-min-cut'],
      'abc376-g': ['outcome-maintain-connectivity-components', 'outcome-prove-greedy-order'],
      'abc394-g': ['outcome-maintain-connectivity-components'],
      'abc399-g': ['outcome-solve-linear-system-and-rank'],
      'abc408-e': ['outcome-maintain-connectivity-components'],
      'abc413-g': ['outcome-maintain-connectivity-components', 'outcome-model-max-flow-min-cut'],
      'abc424-f': ['outcome-detect-crossing-by-cyclic-order'],
      'abc429-f': ['outcome-exponentiate-transition-over-semiring'],
      'abc448-e': ['outcome-compute-in-modular-arithmetic'],
      'abc451-e': ['outcome-recover-valid-witness'],
      'abc457-g': ['outcome-design-order-preserving-dp'],
    };
    for (const [problemId, supportingOutcomeIds] of Object.entries(expectedSupporting)) {
      expect(byProblemId.get(problemId)?.supportingOutcomeIds, problemId).toEqual(
        expect.arrayContaining([...supportingOutcomeIds]),
      );
    }

    expect(byProblemId.get('abc300-ex')?.additionalPrimaryOutcomeIds).toEqual([]);
    expect(byProblemId.get('abc315-ex')?.additionalPrimaryOutcomeIds).toEqual([]);
    expect(byProblemId.get('abc228-g')?.additionalPrimaryOutcomeIds).toContain(
      'outcome-run-dp-on-finite-automaton',
    );
    expect(byProblemId.get('abc355-g')?.additionalPrimaryOutcomeIds).toContain(
      'outcome-optimize-monge-transitions',
    );
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
        'tag-bezout-diophantine',
        'tag-prime-divisor-decomposition',
        'tag-divisor-mobius-inversion',
      ]),
    );
    expect(multiplicativeOrderSplit?.finalEntityIds).not.toContain('tag-inclusion-exclusion');
  });
});
