import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CURATED_PRIMARY_OVERRIDES,
  EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS,
  FINAL_LEARNING_UNIT_CANDIDATES,
  FINAL_LEARNING_UNIT_ORDER_POLICY,
  FINAL_TAXONOMY_OUTCOMES,
  FINAL_TAXONOMY_TAGS,
  KNOWN_UNMATCHED_CURATED_OVERRIDE_PROBLEM_IDS,
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  PREVIEW_FINAL_TAXONOMY_DECISIONS,
  buildFullCorpusPrimaryDecisionTable,
  materializeLearningUnitCandidates,
  validateFinalTaxonomyPolicy,
  type ProblemAnalysisInput,
} from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

const inventoryRoot = path.join(process.cwd(), 'src/content/technique-inventory');

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

describe('final taxonomy policy', () => {
  it('defines a source-backed atomic Tag / observable Outcome vocabulary and an acyclic Unit order', () => {
    expect(validateFinalTaxonomyPolicy()).toEqual([]);
    expect(new Set(FINAL_TAXONOMY_TAGS.map((tag) => tag.id)).size).toBe(FINAL_TAXONOMY_TAGS.length);
    expect(new Set(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id)).size).toBe(
      FINAL_TAXONOMY_OUTCOMES.length,
    );
    expect(FINAL_TAXONOMY_TAGS.map((tag) => tag.id)).toEqual(
      expect.arrayContaining([
        'tag-tree-balanced-separator',
        'tag-lowlink-critical-structure',
        'tag-graph-core-peeling',
        'tag-ordered-set-heap',
        'tag-monotone-stack-queue',
        'tag-suffix-lcp-index',
        'tag-string-hash-equality',
        'tag-palindrome-radius',
        'tag-linked-list-index',
        'tag-trie-prefix',
        'tag-game-value-dp',
        'tag-determinant-counting',
        'tag-convex-hull-trick',
      ]),
    );
    expect(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id)).toEqual(
      expect.arrayContaining([
        'outcome-build-balanced-separator-decomposition',
        'outcome-identify-bridges-and-articulations',
        'outcome-reduce-graph-by-peeling-or-kernelization',
        'outcome-maintain-dynamic-order-statistics',
        'outcome-prune-dominated-candidates-once',
        'outcome-build-suffix-lcp-index',
        'outcome-compare-objects-by-fingerprint',
        'outcome-characterize-palindrome-intervals',
        'outcome-index-shared-prefixes-with-trie',
        'outcome-count-combinatorial-objects-by-determinant',
      ]),
    );
    expect(NON_PRIMARY_TAG_IDS).toEqual([
      'tag-model-reduction',
      'tag-dp-state-transition',
      'tag-graph-model-structure',
      'tag-query-sufficient-aggregate',
      'tag-string-state-representation',
      'tag-math-geometry-transformation',
    ]);
    expect(NON_PRIMARY_OUTCOME_IDS).toHaveLength(6);
    expect(FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds).toHaveLength(
      FINAL_LEARNING_UNIT_CANDIDATES.length,
    );
    const nimRecallTerms = FINAL_TAXONOMY_TAGS.find(
      (tag) => tag.id === 'tag-game-grundy-dp',
    )?.strictRecallTerms;
    expect(nimRecallTerms?.some((pattern) => new RegExp(pattern, 'iu').test('minimum cycle'))).toBe(
      false,
    );
    expect(nimRecallTerms?.some((pattern) => new RegExp(pattern, 'iu').test('Nim game'))).toBe(
      true,
    );
    expect(
      FINAL_LEARNING_UNIT_CANDIDATES.find((unit) => unit.id === 'unit-shortest-path-certificates')
        ?.title,
    ).toContain('重み付き最短路');
    expect(
      FINAL_TAXONOMY_TAGS.find((tag) => tag.id === 'tag-directed-condensation-toposort')
        ?.definition,
    ).toContain('必要なら強連結成分へ縮約');
    expect(
      FINAL_TAXONOMY_OUTCOMES.find(
        (outcome) => outcome.id === 'outcome-count-prefix-constrained-objects',
      )?.statement,
    ).toContain('個数または最適値');
    const sections = FINAL_LEARNING_UNIT_CANDIDATES.filter((unit) => unit.kind === 'section');
    expect(sections.every((unit) => unit.excludedTopics.length > 0)).toBe(true);
    expect(
      sections.every((unit) =>
        unit.excludedTopics.every(
          (topic) => !topic.includes('このsectionの観察可能なOutcomeを発動しない'),
        ),
      ),
    ).toBe(true);
    expect(FINAL_TAXONOMY_TAGS.every((tag) => tag.aliases.length > 0)).toBe(true);
    expect(FINAL_TAXONOMY_TAGS.every((tag) => tag.representativeProblemIds.length >= 2)).toBe(true);
    expect(new Set(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.orderReason)).size).toBe(
      FINAL_LEARNING_UNIT_CANDIDATES.length,
    );
    expect(
      FINAL_LEARNING_UNIT_CANDIDATES.every(
        (unit) => unit.orderReason.length > 0 && !/(?:unit|tag|outcome)-/u.test(unit.orderReason),
      ),
    ).toBe(true);
    expect(
      FINAL_TAXONOMY_TAGS.find((tag) => tag.id === 'tag-two-pointers-window')
        ?.learningUnitCandidateIds,
    ).toEqual(['unit-two-pointers-window']);
    expect(
      FINAL_TAXONOMY_OUTCOMES.find(
        (outcome) => outcome.id === 'outcome-approximate-rational-by-euclid',
      )?.learningUnitCandidateIds,
    ).toEqual(['unit-rational-approximation']);
    const outcomePrerequisites = new Map(
      FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome.prerequisiteOutcomeIds]),
    );
    expect(outcomePrerequisites.get('outcome-build-shortest-path-certificate')).toEqual([
      'outcome-model-and-compute-shortest-path',
    ]);
    expect(outcomePrerequisites.get('outcome-localize-change-impact-by-witness')).toEqual([
      'outcome-build-shortest-path-certificate',
    ]);
    expect(outcomePrerequisites.get('outcome-design-range-update-action')).toEqual([
      'outcome-design-associative-range-summary',
    ]);
    expect(outcomePrerequisites.get('outcome-use-tree-diameter-extrema')).toEqual([
      'outcome-select-state-graph-search',
    ]);
    expect(outcomePrerequisites.get('outcome-solve-modular-constraints')).toEqual([
      'outcome-characterize-integer-solvability',
    ]);
    expect(outcomePrerequisites.get('outcome-exploit-modular-periodicity')).toEqual([]);
    expect(outcomePrerequisites.get('outcome-count-through-cyclic-exponents')).toEqual([
      'outcome-correct-overlap-by-inversion',
      'outcome-decompose-by-prime-or-divisor',
      'outcome-exploit-modular-periodicity',
    ]);
    expect(outcomePrerequisites.get('outcome-find-period-by-multiplicative-order')).toEqual([
      'outcome-characterize-integer-solvability',
      'outcome-decompose-by-prime-or-divisor',
      'outcome-exploit-modular-periodicity',
    ]);
    expect(outcomePrerequisites.get('outcome-restrict-geometric-candidates-to-boundary')).toEqual([
      'outcome-reduce-geometry-to-algebraic-predicates',
    ]);
    expect(
      FINAL_TAXONOMY_OUTCOMES.filter((outcome) => outcome.prerequisiteOutcomeIds.length > 0)
        .map((outcome) => outcome.id)
        .sort(),
    ).toEqual(
      [
        'outcome-build-shortest-path-certificate',
        'outcome-count-through-cyclic-exponents',
        'outcome-design-range-update-action',
        'outcome-find-period-by-multiplicative-order',
        'outcome-localize-change-impact-by-witness',
        'outcome-restrict-geometric-candidates-to-boundary',
        'outcome-solve-modular-constraints',
        'outcome-use-tree-diameter-extrema',
      ].sort(),
    );
    expect(
      FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
        ['outcome-solve-modular-constraints', 'outcome-exploit-modular-periodicity'].includes(
          outcome.id,
        ),
      ).every(
        (outcome) =>
          !outcome.prerequisiteOutcomeIds.includes('outcome-approximate-rational-by-euclid'),
      ),
    ).toBe(true);
    expect(
      FINAL_TAXONOMY_OUTCOMES.find((outcome) => outcome.id === 'outcome-solve-modular-constraints')
        ?.learningUnitCandidateIds,
    ).toEqual(['unit-modular-arithmetic']);
    expect(
      FINAL_TAXONOMY_OUTCOMES.find(
        (outcome) => outcome.id === 'outcome-exploit-modular-periodicity',
      )?.learningUnitCandidateIds,
    ).toEqual(['unit-modular-periodicity']);
    expect(
      FINAL_LEARNING_UNIT_CANDIDATES.find((unit) => unit.id === 'unit-decomposition-amortization')
        ?.tagIds,
    ).not.toContain('tag-divide-enumerate');
    expect(
      FINAL_TAXONOMY_OUTCOMES.find((outcome) => outcome.id === 'outcome-select-state-graph-search')
        ?.statement,
    ).not.toContain('0-1 BFS');
  });

  it('materializes one proposed primary Outcome for all 868 reviewed analyses without ambiguity', async () => {
    const records = await loadRecords();
    expect(records).toHaveLength(868);

    const table = buildFullCorpusPrimaryDecisionTable(records);
    const reversed = buildFullCorpusPrimaryDecisionTable([...records].reverse());
    expect(reversed).toEqual(table);
    expect(table.problemCount).toBe(868);
    expect(Object.keys(EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS)).toHaveLength(868);
    expect(new Set(table.decisions.map((decision) => decision.problemId)).size).toBe(868);

    const recordsById = new Map(records.map((record) => [record.problemId, record]));
    const overrides = new Map(
      CURATED_PRIMARY_OVERRIDES.map((override) => [override.problemId, override]),
    );
    const orderIndex = new Map(
      FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds.map((unitId, index) => [unitId, index]),
    );

    for (const decision of table.decisions) {
      const record = recordsById.get(decision.problemId);
      const override = overrides.get(decision.problemId);
      expect(decision.primaryTagIds).toContain(
        override?.primaryTagId ?? EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS[decision.problemId],
      );
      expect(decision.primaryOutcomeId).toMatch(/^outcome-/u);
      expect(NON_PRIMARY_OUTCOME_IDS).not.toContain(decision.primaryOutcomeId);
      expect(decision.primaryTagIds.length).toBeGreaterThanOrEqual(1);
      expect(decision.primaryTagIds.some((tagId) => NON_PRIMARY_TAG_IDS.includes(tagId))).toBe(
        false,
      );
      expect(decision.acceptanceStatus).toBe('proposed');
      expect(decision.decisionKind).toBe(
        override ? 'curated_semantic_override' : 'explicit_inventory_assignment',
      );
      expect(decision.ambiguityStatus).toBe(override ? 'curated_override' : 'proposed_assignment');
      expect(decision.selectionRationale).not.toHaveLength(0);
      expect(decision.decisionBasis.map((claim) => claim.claimPath)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^\/reasoningPath\/candidateApproaches\/\d+$/u),
          expect.stringMatching(/^\/reasoningPath\/observations\/\d+$/u),
          expect.stringMatching(/^\/reasoningPath\/keyInsights\/\d+$/u),
          '/reasoningPath/algorithmConnection',
          '/outcomeCandidates/0',
        ]),
      );
      const expectedDispositionPaths = [
        ...(record?.typicalTechniques.map((_, index) => `/typicalTechniques/${String(index)}`) ??
          []),
        ...(record?.prerequisiteCandidates.map(
          (_, index) => `/prerequisiteCandidates/${String(index)}`,
        ) ?? []),
      ].sort();
      expect(
        [...new Set(decision.claimDispositions.map(({ claimRef }) => claimRef.claimPath))].sort(),
      ).toEqual(expectedDispositionPaths);
      const dispositionKeys = decision.claimDispositions.map(
        ({ claimRef, kind, tagIds }) =>
          `${claimRef.claimPath}\u0000${kind}\u0000${[...tagIds].sort().join('\u0000')}`,
      );
      expect(new Set(dispositionKeys).size).toBe(dispositionKeys.length);
      for (const claimPath of expectedDispositionPaths) {
        const kinds = new Set(
          decision.claimDispositions
            .filter(({ claimRef }) => claimRef.claimPath === claimPath)
            .map(({ kind }) => kind),
        );
        expect(kinds.size === 1 || (!kinds.has('baseline') && !kinds.has('problem_specific'))).toBe(
          true,
        );
      }
      expect(decision.claimDispositions.every(({ rationale }) => rationale.length > 0)).toBe(true);
      expect(
        decision.claimDispositions.every(
          ({ claimRef, kind, tagIds }) =>
            claimRef.owner.problemId === decision.problemId &&
            tagIds.every((tagId) =>
              [...decision.primaryTagIds, ...decision.supportingTagIds].includes(tagId),
            ) &&
            ((kind !== 'primary' && kind !== 'same_tag') ||
              tagIds.every((tagId) => decision.primaryTagIds.includes(tagId))) &&
            (kind !== 'supporting' ||
              tagIds.every((tagId) => decision.supportingTagIds.includes(tagId))) &&
            ((kind !== 'baseline' && kind !== 'problem_specific') || tagIds.length === 0),
        ),
      ).toBe(true);
      const primaryDispositionTagIds = new Set(
        decision.claimDispositions.flatMap(({ kind, tagIds }) =>
          kind === 'primary' ? tagIds : [],
        ),
      );
      expect(decision.primaryTagIds.every((tagId) => primaryDispositionTagIds.has(tagId))).toBe(
        true,
      );
      const supportingDispositionTagIds = new Set(
        decision.claimDispositions.flatMap(({ kind, tagIds }) =>
          kind === 'supporting' ? tagIds : [],
        ),
      );
      expect(
        decision.supportingTagIds.every((tagId) => supportingDispositionTagIds.has(tagId)),
      ).toBe(true);
      expect([...supportingDispositionTagIds].sort()).toEqual(
        [...decision.supportingTagIds].sort(),
      );
      expect(decision.learningUnitCandidateIds).toContain(decision.presentationUnitId);
      expect(
        decision.learningUnitCandidateIds.every(
          (unitId) =>
            (orderIndex.get(unitId) ?? Number.POSITIVE_INFINITY) <=
            (orderIndex.get(decision.presentationUnitId) ?? -1),
        ),
      ).toBe(true);
      for (const claim of [
        ...decision.decisionBasis,
        ...decision.claimDispositions.map((disposition) => disposition.claimRef),
        ...decision.adHocElements.map((element) => element.claimRef),
      ]) {
        expect(claim.owner).toEqual({ kind: 'problem_analysis', problemId: decision.problemId });
        expect(claim.claimPath).toMatch(/^\//u);
        expect(claim.evidenceRefs.length).toBeGreaterThan(0);
        expect(
          claim.evidenceRefs.every(
            (reference) =>
              reference.owner.problemId === decision.problemId &&
              reference.sourceRevisionIds.length > 0,
          ),
        ).toBe(true);
      }
    }
    expect(CURATED_PRIMARY_OVERRIDES).toHaveLength(
      new Set(CURATED_PRIMARY_OVERRIDES.map((item) => item.problemId)).size,
    );
    expect(KNOWN_UNMATCHED_CURATED_OVERRIDE_PROBLEM_IDS).toHaveLength(9);
    expect(
      KNOWN_UNMATCHED_CURATED_OVERRIDE_PROBLEM_IDS.every((problemId) => overrides.has(problemId)),
    ).toBe(true);
    for (const decision of table.decisions.filter((item) => overrides.has(item.problemId))) {
      const override = overrides.get(decision.problemId);
      expect(decision.decisionKind).toBe('curated_semantic_override');
      expect(decision.primaryTagIds).toContain(override?.primaryTagId);
      expect(decision.primaryOutcomeId).toBe(override?.primaryOutcomeId);
    }

    const units = materializeLearningUnitCandidates(table.decisions);
    expect(units.map((unit) => unit.id)).toEqual(FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds);
    const chapterProblemIds = units
      .filter((unit) => unit.kind === 'chapter')
      .flatMap((unit) => unit.problemIds);
    expect(new Set(chapterProblemIds).size).toBe(868);
    expect(
      chapterProblemIds.every((problemId) =>
        table.decisions.some((decision) => decision.problemId === problemId),
      ),
    ).toBe(true);

    const decisionByProblemId = new Map(
      table.decisions.map((decision) => [decision.problemId, decision]),
    );
    const semanticPrimaryRegressions: Readonly<Record<string, string>> = {
      'abc216-h': 'tag-determinant-counting',
      'abc221-f': 'tag-tree-metric-diameter',
      'abc222-f': 'tag-tree-metric-diameter',
      'abc224-e': 'tag-dp-transition-acceleration',
      'abc227-f': 'tag-discrete-convex-marginal',
      'abc228-e': 'tag-modular-crt',
      'abc229-h': 'tag-game-value-dp',
      'abc234-ex': 'tag-geometry-orientation-transform',
      'abc247-f': 'tag-dp-state-equivalence',
      'abc246-e': 'tag-shortest-path',
      'abc252-f': 'tag-greedy-exchange-order',
      'abc253-ex': 'tag-determinant-counting',
      'abc253-f': 'tag-reverse-offline',
      'abc261-ex': 'tag-game-value-dp',
      'abc264-g': 'tag-dp-state-equivalence',
      'abc273-ex': 'tag-gcd-diophantine',
      'abc266-f': 'tag-graph-core-peeling',
      'abc267-f': 'tag-tree-metric-diameter',
      'abc279-e': 'tag-witness-impact-localization',
      'abc284-ex': 'tag-symmetry-invariant-normalization',
      'abc287-e': 'tag-trie-prefix',
      'abc287-ex': 'tag-reachability-bfs',
      'abc288-g': 'tag-linear-algebra-xor',
      'abc294-ex': 'tag-subset-bitmask-transform',
      'abc298-f': 'tag-greedy-exchange-order',
      'abc303-g': 'tag-game-value-dp',
      'abc307-g': 'tag-knapsack-resource',
      'abc312-e': 'tag-geometry-orientation-transform',
      'abc321-e': 'tag-tree-aggregation-reroot',
      'abc323-g': 'tag-determinant-counting',
      'abc324-e': 'tag-contribution-reordering',
      'abc329-g': 'tag-tree-aggregation-reroot',
      'abc334-e': 'tag-contribution-reordering',
      'abc334-f': 'tag-dp-transition-acceleration',
      'abc335-g': 'tag-cyclic-group-order',
      'abc336-g': 'tag-determinant-counting',
      'abc338-e': 'tag-geometry-orientation-transform',
      'abc339-f': 'tag-string-hash-equality',
      'abc344-e': 'tag-linked-list-index',
      'abc349-e': 'tag-game-value-dp',
      'abc353-e': 'tag-trie-prefix',
      'abc355-g': 'tag-discrete-convex-marginal',
      'abc361-e': 'tag-contribution-reordering',
      'abc367-f': 'tag-string-hash-equality',
      'abc377-g': 'tag-trie-prefix',
      'abc378-g': 'tag-dp-state-equivalence',
      'abc382-f': 'tag-lazy-segment-action',
      'abc401-f': 'tag-tree-metric-diameter',
      'abc413-f': 'tag-game-value-dp',
      'abc416-g': 'tag-dp-state-equivalence',
      'abc419-g': 'tag-graph-core-peeling',
      'abc421-f': 'tag-linked-list-index',
      'abc428-e': 'tag-tree-metric-diameter',
      'abc437-e': 'tag-trie-prefix',
      'abc448-g': 'tag-convex-hull-trick',
      'abc453-f': 'tag-constructive-witness',
      'abc455-g': 'tag-string-hash-equality',
      'abc460-g': 'tag-tree-aggregation-reroot',
    };
    for (const [problemId, primaryTagId] of Object.entries(semanticPrimaryRegressions)) {
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).toContain(primaryTagId);
    }

    const semanticOutcomeRegressions: Readonly<Record<string, string>> = {
      'abc212-h': 'outcome-transform-to-linear-system-or-rank',
      'abc221-f': 'outcome-use-tree-diameter-extrema',
      'abc222-f': 'outcome-use-tree-diameter-extrema',
      'abc224-e': 'outcome-factor-and-accelerate-transitions',
      'abc227-f': 'outcome-exploit-convexity',
      'abc228-e': 'outcome-exploit-modular-periodicity',
      'abc246-e': 'outcome-model-and-compute-shortest-path',
      'abc252-f': 'outcome-prove-greedy-order',
      'abc253-f': 'outcome-reverse-update-time',
      'abc267-f': 'outcome-use-tree-diameter-extrema',
      'abc280-f': 'outcome-maintain-potential-differences',
      'abc284-ex': 'outcome-count-orbits-by-fixed-points',
      'abc287-ex': 'outcome-compute-transitive-closure',
      'abc292-e': 'outcome-compute-transitive-closure',
      'abc288-g': 'outcome-factor-separable-linear-transform',
      'abc298-f': 'outcome-prove-greedy-order',
      'abc314-f': 'outcome-augment-components-with-metadata',
      'abc314-ex': 'outcome-exploit-convexity',
      'abc319-e': 'outcome-exploit-modular-periodicity',
      'abc333-g': 'outcome-approximate-rational-by-euclid',
      'abc334-e': 'outcome-reorder-counting-contributions',
      'abc351-g': 'outcome-compose-dynamic-tree-clusters',
      'abc361-e': 'outcome-reorder-counting-contributions',
      'abc408-g': 'outcome-approximate-rational-by-euclid',
      'abc460-g': 'outcome-compose-dynamic-tree-clusters',
      'abc466-g': 'outcome-maintain-potential-differences',
      'abc281-f': 'outcome-divide-search-space-recursively',
      'abc282-ex': 'outcome-divide-search-space-recursively',
      'abc238-e': 'outcome-maintain-connectivity-components',
      'abc383-e': 'outcome-augment-components-with-metadata',
      'abc392-e': 'outcome-augment-components-with-metadata',
      'abc399-e': 'outcome-decompose-functional-graph',
      'abc401-e': 'outcome-augment-components-with-metadata',
      'abc401-f': 'outcome-use-tree-diameter-extrema',
      'abc420-e': 'outcome-augment-components-with-metadata',
      'abc428-e': 'outcome-use-tree-diameter-extrema',
      'abc428-g': 'outcome-count-orbits-by-fixed-points',
      'abc429-g': 'outcome-evaluate-compressed-integer-blocks',
      'abc434-e': 'outcome-augment-components-with-metadata',
      'abc436-e': 'outcome-decompose-functional-graph',
      'abc438-e': 'outcome-jump-deterministic-transition',
      'abc438-g': 'outcome-reduce-integer-structure-by-gcd',
      'abc451-f': 'outcome-augment-components-with-metadata',
      'abc459-g': 'outcome-characterize-integer-solvability',
      'abc460-e': 'outcome-characterize-integer-solvability',
      'abc241-e': 'outcome-decompose-functional-graph',
      'abc371-g': 'outcome-decompose-functional-graph',
      'abc377-e': 'outcome-jump-deterministic-transition',
      'abc248-g': 'outcome-aggregate-rooted-tree',
      'abc312-g': 'outcome-aggregate-rooted-tree',
      'abc315-g': 'outcome-characterize-integer-solvability',
    };
    for (const [problemId, outcomeId] of Object.entries(semanticOutcomeRegressions)) {
      expect(decisionByProblemId.get(problemId)?.primaryOutcomeId).toBe(outcomeId);
    }
    expect(decisionByProblemId.get('abc218-f')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-build-shortest-path-certificate',
    ]);
    expect(decisionByProblemId.get('abc335-g')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-find-period-by-multiplicative-order',
    ]);
    expect(decisionByProblemId.get('abc280-g')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-reduce-geometry-to-algebraic-predicates',
    ]);
    expect(decisionByProblemId.get('abc286-f')?.additionalPrimaryOutcomeIds).toEqual([
      'outcome-exploit-modular-periodicity',
    ]);

    const supportingRegressions: Readonly<Record<string, string>> = {
      'abc213-f': 'tag-monotone-stack-queue',
      'abc214-h': 'tag-flow-matching-cut',
      'abc227-h': 'tag-flow-matching-cut',
      'abc248-ex': 'tag-lazy-segment-action',
      'abc269-ex': 'tag-convolution-fps',
      'abc267-f': 'tag-tree-path-decomposition',
      'abc280-ex': 'tag-monotone-stack-queue',
      'abc299-ex': 'tag-linear-recurrence-matrix',
      'abc305-g': 'tag-linear-recurrence-matrix',
      'abc336-g': 'tag-euler-degree-parity',
      'abc364-g': 'tag-shortest-path',
      'abc375-g': 'tag-shortest-path',
      'abc370-f': 'tag-functional-graph-doubling',
      'abc361-e': 'tag-tree-metric-diameter',
      'abc403-e': 'tag-trie-prefix',
      'abc450-f': 'tag-lazy-segment-action',
      'abc460-f': 'tag-tree-path-decomposition',
    };
    for (const [problemId, supportingTagId] of Object.entries(supportingRegressions)) {
      expect(decisionByProblemId.get(problemId)?.supportingTagIds).toContain(supportingTagId);
    }
    expect(decisionByProblemId.get('abc460-f')?.supportingTagIds).toContain(
      'tag-tree-metric-diameter',
    );

    const leadTechniqueRegressions: Readonly<Record<string, string>> = {
      'abc270-g': 'tag-divide-enumerate',
      'abc273-ex': 'tag-gcd-diophantine',
      'abc321-e': 'tag-tree-aggregation-reroot',
      'abc344-e': 'tag-linked-list-index',
      'abc355-g': 'tag-discrete-convex-marginal',
      'abc421-f': 'tag-linked-list-index',
    };
    for (const [problemId, primaryTagId] of Object.entries(leadTechniqueRegressions)) {
      const disposition = decisionByProblemId
        .get(problemId)
        ?.claimDispositions.find(
          ({ claimRef, kind }) =>
            claimRef.claimPath === '/typicalTechniques/0' && kind === 'primary',
        );
      expect(disposition?.tagIds).toContain(primaryTagId);
    }
    expect(decisionByProblemId.get('abc367-f')?.supportingTagIds).not.toContain(
      'tag-ordered-set-heap',
    );
    expect(decisionByProblemId.get('abc455-g')?.supportingTagIds).not.toContain(
      'tag-ordered-set-heap',
    );
    const falseSupportingRegressions: Readonly<Record<string, readonly string[]>> = {
      'abc213-f': ['tag-prefix-difference'],
      'abc283-e': ['tag-fenwick-weighted-prefix'],
      'abc287-e': ['tag-suffix-lcp-index'],
      'abc301-g': ['tag-symmetry-invariant-normalization'],
      'abc304-e': ['tag-symmetry-invariant-normalization'],
      'abc334-e': ['tag-stochastic-expectation-dp', 'tag-modular-crt'],
      'abc334-f': ['tag-gcd-diophantine', 'tag-monoid-segment-tree'],
      'abc361-e': ['tag-tree-aggregation-reroot'],
    };
    for (const [problemId, forbiddenTagIds] of Object.entries(falseSupportingRegressions)) {
      for (const tagId of forbiddenTagIds) {
        expect(decisionByProblemId.get(problemId)?.supportingTagIds).not.toContain(tagId);
      }
    }
    expect(decisionByProblemId.get('abc334-f')?.supportingTagIds).toContain(
      'tag-monotone-stack-queue',
    );

    expect(decisionByProblemId.get('abc212-g')?.learningUnitCandidateIds).toContain(
      'unit-cyclic-group-exponent-counting',
    );
    expect(decisionByProblemId.get('abc212-g')?.learningUnitCandidateIds).not.toContain(
      'unit-multiplicative-order-periods',
    );
    expect(decisionByProblemId.get('abc222-g')?.learningUnitCandidateIds).toContain(
      'unit-multiplicative-order-periods',
    );
    expect(decisionByProblemId.get('abc222-g')?.learningUnitCandidateIds).not.toContain(
      'unit-cyclic-group-exponent-counting',
    );
  });

  it('binds the planned T159 manifest scope to the exact final Outcome ID set', async () => {
    const manifest = JSON.parse(
      await readFile(
        path.join(process.cwd(), 'docs/work-manifests/initial/us2/final-taxonomy/manifest.json'),
        'utf8',
      ),
    ) as {
      readonly learningOutcomeIds: readonly string[];
      readonly reviewUnits: readonly { readonly learningOutcomeIds: readonly string[] }[];
    };
    const expectedOutcomeIds = FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id).sort();

    expect(() => {
      validateContentWorkManifest(manifest);
    }).not.toThrow();
    expect(manifest.learningOutcomeIds).toEqual(expectedOutcomeIds);
    expect(manifest.reviewUnits).toHaveLength(1);
    expect(manifest.reviewUnits[0]?.learningOutcomeIds).toEqual(expectedOutcomeIds);
  });

  it('records explicit third-party preview promote/merge/split targets and cross-corpus evidence owners', () => {
    expect(PREVIEW_FINAL_TAXONOMY_DECISIONS).toHaveLength(12);
    expect(
      new Set(PREVIEW_FINAL_TAXONOMY_DECISIONS.map((decision) => decision.reviewMode)),
    ).toEqual(new Set(['third_party']));
    expect(
      PREVIEW_FINAL_TAXONOMY_DECISIONS.every(
        ({ aliasesOrRedirects }) => aliasesOrRedirects.length > 0,
      ),
    ).toBe(true);
    const multiplicativeOutcome = PREVIEW_FINAL_TAXONOMY_DECISIONS.find(
      (decision) =>
        decision.previewEntityId === 'outcome-provisional-multiplicative-order-counting',
    );
    expect(multiplicativeOutcome?.finalEntityIds).toEqual([
      'outcome-count-through-cyclic-exponents',
      'outcome-find-period-by-multiplicative-order',
    ]);
    expect(multiplicativeOutcome?.representativeProblemIds).toContain('abc335-g');
    expect(multiplicativeOutcome?.evidenceOwnerProblemIds).toContain('abc335-g');

    const shortestTag = PREVIEW_FINAL_TAXONOMY_DECISIONS.find(
      (decision) => decision.previewEntityId === 'provisional-tag-shortest-path-structure',
    );
    expect(
      shortestTag?.splitAssignments
        .filter((assignment) => assignment.problemIds.includes('abc218-f'))
        .map((assignment) => assignment.finalEntityId),
    ).toEqual(['tag-witness-impact-localization', 'tag-shortest-path-certificate']);
  });
});
