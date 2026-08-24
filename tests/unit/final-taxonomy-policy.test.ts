import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { FINAL_TAXONOMY_BASELINE_CLAIMS } from '../../src/lib/taxonomy/final-taxonomy-baseline.js';
import {
  CURATED_PRIMARY_OVERRIDES,
  EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS,
  FINAL_LEARNING_UNIT_CANDIDATES,
  FINAL_LEARNING_UNIT_ORDER_POLICY,
  FINAL_TAXONOMY_PLACEMENT_PRINCIPLES,
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
        'tag-bounded-enumeration',
        'tag-carry-mixed-radix-dp',
        'tag-coordinate-compression',
        'tag-event-sweep',
        'tag-implicit-binary-tree-arithmetic',
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
        'outcome-answer-tree-ancestor-queries',
        'outcome-build-virtual-tree',
        'outcome-compress-sparse-keys',
        'outcome-count-implicit-binary-tree-layers',
        'outcome-design-carry-or-mixed-radix-dp',
        'outcome-encode-threshold-constraints-as-two-sat',
        'outcome-enumerate-bounded-candidates-or-cases',
        'outcome-flatten-tree-by-euler-order',
        'outcome-represent-convex-intersection-by-halfplanes',
        'outcome-build-balanced-separator-decomposition',
        'outcome-identify-bridges-and-articulations',
        'outcome-reduce-graph-by-peeling-or-kernelization',
        'outcome-maintain-dynamic-order-statistics',
        'outcome-decompose-ranges-into-segment-tree-nodes',
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
    ).toContain('2-SAT');
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.boundaries).toContain(
      '座標圧縮とevent sweepと単純scan',
    );
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.boundaries).toContain(
      'tight・automatonを接頭辞更新する桁DP',
    );
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.boundaries).toContain(
      '親・選択記録から具体解を復元する構成法',
    );
    expect(FINAL_TAXONOMY_PLACEMENT_PRINCIPLES.boundaries).toContain(
      '専用primary技能だけで列挙を説明し切れる場合',
    );
    expect(
      FINAL_LEARNING_UNIT_CANDIDATES.find((unit) => unit.id === 'unit-events-offline')?.title,
    ).toContain('逆走査');
    for (const tagId of ['tag-event-sweep', 'tag-coordinate-compression']) {
      const excludedPatterns =
        FINAL_TAXONOMY_TAGS.find((tag) => tag.id === tagId)?.semanticSignature.excludedPatterns ??
        [];
      expect(
        excludedPatterns.some((pattern) =>
          new RegExp(pattern, 'iu').test('座標圧縮とevent sweepを併用する'),
        ),
      ).toBe(false);
    }
    expect(
      FINAL_TAXONOMY_OUTCOMES.find(
        (outcome) => outcome.id === 'outcome-count-prefix-constrained-objects',
      )?.statement,
    ).toContain('個数または最適値');
    expect(
      FINAL_TAXONOMY_TAGS.find((tag) => tag.id === 'tag-monoid-segment-tree')?.definition,
    ).toContain('canonical node');
    expect(
      FINAL_TAXONOMY_OUTCOMES.find(
        (outcome) => outcome.id === 'outcome-decompose-ranges-into-segment-tree-nodes',
      )?.statement,
    ).toContain('range-edge graph');
    expect(
      FINAL_LEARNING_UNIT_CANDIDATES.find((unit) => unit.id === 'unit-monoid-segment-tree')
        ?.learningOutcomeIds,
    ).toContain('outcome-decompose-ranges-into-segment-tree-nodes');
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
    const learnerTermOwners = new Map<string, string[]>();
    for (const tag of FINAL_TAXONOMY_TAGS) {
      for (const term of [...tag.aliases, ...tag.formerNames]) {
        const normalizedTerm = term.normalize('NFKC').trim().toLocaleLowerCase('en-US');
        learnerTermOwners.set(normalizedTerm, [
          ...(learnerTermOwners.get(normalizedTerm) ?? []),
          tag.id,
        ]);
      }
    }
    expect(
      [...learnerTermOwners.entries()].filter(([, tagIds]) => new Set(tagIds).size > 1),
    ).toEqual([]);
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
    expect(outcomePrerequisites.get('outcome-localize-change-impact-by-witness')).toEqual([]);
    expect(outcomePrerequisites.get('outcome-design-range-update-action')).toEqual([
      'outcome-design-associative-range-summary',
    ]);
    expect(outcomePrerequisites.get('outcome-use-tree-diameter-extrema')).toEqual([
      'outcome-select-state-graph-search',
    ]);
    expect(outcomePrerequisites.get('outcome-solve-modular-constraints')).toEqual([
      'outcome-characterize-integer-solvability',
      'outcome-compute-in-modular-arithmetic',
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
    expect(outcomePrerequisites.get('outcome-represent-convex-intersection-by-halfplanes')).toEqual(
      ['outcome-reduce-geometry-to-algebraic-predicates'],
    );
    expect(
      FINAL_TAXONOMY_OUTCOMES.filter((outcome) => outcome.prerequisiteOutcomeIds.length > 0)
        .map((outcome) => outcome.id)
        .sort(),
    ).toEqual(
      [
        'outcome-apply-formal-power-series-operations',
        'outcome-bound-reachability-in-numerical-semigroup',
        'outcome-build-cartesian-tree-decomposition',
        'outcome-build-shortest-path-certificate',
        'outcome-color-and-classify-bipartite-components',
        'outcome-compose-dynamic-tree-clusters',
        'outcome-compute-in-finite-field-extension',
        'outcome-construct-optimal-spanning-tree',
        'outcome-count-through-cyclic-exponents',
        'outcome-design-range-update-action',
        'outcome-encode-counting-by-generating-function',
        'outcome-evaluate-and-compose-polynomials',
        'outcome-find-period-by-multiplicative-order',
        'outcome-represent-convex-intersection-by-halfplanes',
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
    ).toEqual(['unit-modular-congruence']);
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
    const problemIdsUsingTag = (tagId: string): string[] =>
      table.decisions
        .filter((decision) =>
          [...decision.primaryTagIds, ...decision.supportingTagIds].includes(tagId),
        )
        .map((decision) => decision.problemId)
        .sort();

    expect(problemIdsUsingTag('tag-event-sweep')).toEqual([
      'abc214-e',
      'abc223-h',
      'abc224-e',
      'abc231-f',
      'abc233-ex',
      'abc235-e',
      'abc240-ex',
      'abc245-e',
      'abc250-ex',
      'abc254-g',
      'abc257-ex',
      'abc263-ex',
      'abc266-ex',
      'abc268-ex',
      'abc274-f',
      'abc280-g',
      'abc283-f',
      'abc287-ex',
      'abc296-g',
      'abc301-ex',
      'abc306-f',
      'abc308-f',
      'abc309-f',
      'abc311-g',
      'abc320-e',
      'abc327-f',
      'abc332-g',
      'abc337-g',
      'abc344-g',
      'abc346-g',
      'abc351-f',
      'abc360-f',
      'abc361-g',
      'abc368-e',
      'abc393-f',
      'abc394-g',
      'abc401-e',
      'abc407-f',
      'abc408-f',
      'abc410-g',
      'abc411-e',
      'abc431-g',
      'abc433-e',
      'abc436-f',
      'abc438-g',
      'abc447-g',
      'abc449-e',
      'abc449-f',
      'abc453-e',
    ]);
    expect(problemIdsUsingTag('tag-coordinate-compression')).toEqual([
      'abc221-e',
      'abc231-f',
      'abc232-g',
      'abc254-g',
      'abc262-ex',
      'abc266-ex',
      'abc273-f',
      'abc276-ex',
      'abc287-g',
      'abc306-f',
      'abc309-f',
      'abc320-g',
      'abc351-f',
      'abc354-f',
      'abc356-f',
      'abc360-f',
      'abc360-g',
      'abc374-f',
      'abc384-g',
      'abc431-g',
      'abc434-e',
      'abc439-f',
      'abc465-g',
    ]);
    expect(problemIdsUsingTag('tag-bounded-enumeration')).toEqual([
      'abc220-g',
      'abc223-e',
      'abc226-f',
      'abc227-f',
      'abc227-h',
      'abc234-e',
      'abc234-ex',
      'abc240-ex',
      'abc240-f',
      'abc248-e',
      'abc254-e',
      'abc257-f',
      'abc258-f',
      'abc260-f',
      'abc270-f',
      'abc271-ex',
      'abc284-e',
      'abc290-g',
      'abc293-f',
      'abc298-g',
      'abc301-g',
      'abc302-g',
      'abc323-f',
      'abc328-e',
      'abc331-e',
      'abc343-e',
      'abc347-f',
      'abc353-f',
      'abc369-e',
      'abc386-e',
      'abc387-e',
      'abc409-f',
      'abc410-f',
      'abc418-e',
      'abc419-g',
      'abc442-g',
      'abc459-g',
    ]);
    expect(problemIdsUsingTag('tag-divide-enumerate')).toEqual([
      'abc213-h',
      'abc220-h',
      'abc230-h',
      'abc247-ex',
      'abc252-ex',
      'abc260-ex',
      'abc267-ex',
      'abc269-ex',
      'abc270-g',
      'abc271-f',
      'abc272-ex',
      'abc273-ex',
      'abc281-ex',
      'abc281-f',
      'abc282-ex',
      'abc300-g',
      'abc304-g',
      'abc313-f',
      'abc317-ex',
      'abc326-f',
      'abc331-g',
      'abc336-f',
      'abc345-g',
      'abc348-g',
      'abc352-g',
      'abc357-g',
      'abc381-g',
      'abc383-g',
      'abc385-g',
      'abc402-f',
      'abc413-e',
      'abc423-g',
      'abc425-g',
      'abc426-g',
      'abc427-f',
      'abc439-g',
      'abc464-f',
    ]);
    expect(problemIdsUsingTag('tag-carry-mixed-radix-dp')).toEqual(['abc231-e', 'abc466-g']);
    expect(problemIdsUsingTag('tag-implicit-binary-tree-arithmetic')).toEqual([
      'abc220-e',
      'abc321-e',
      'abc424-e',
    ]);
    expect(problemIdsUsingTag('tag-tree-path-decomposition')).toEqual([
      'abc267-f',
      'abc294-g',
      'abc298-ex',
      'abc329-g',
      'abc337-g',
      'abc340-g',
      'abc351-g',
      'abc405-f',
      'abc406-f',
      'abc438-f',
      'abc460-f',
    ]);
    const boundaryHardNegatives: Readonly<Record<string, readonly string[]>> = {
      'abc220-e': ['tag-tree-path-decomposition', 'tag-tree-aggregation-reroot'],
      'abc227-f': ['tag-discrete-convex-marginal', 'tag-divide-enumerate'],
      'abc231-e': ['tag-digit-automaton-dp'],
      'abc234-e': ['tag-divide-enumerate'],
      'abc295-f': ['tag-digit-automaton-dp'],
      'abc317-e': ['tag-event-sweep', 'tag-coordinate-compression'],
      'abc321-e': ['tag-tree-path-decomposition', 'tag-tree-aggregation-reroot'],
      'abc328-e': ['tag-divide-enumerate'],
      'abc347-f': ['tag-divide-enumerate'],
      'abc378-f': ['tag-tree-path-decomposition'],
      'abc386-e': ['tag-divide-enumerate'],
      'abc442-g': ['tag-divide-enumerate'],
      'abc466-g': ['tag-digit-automaton-dp'],
    };
    for (const [problemId, forbiddenTagIds] of Object.entries(boundaryHardNegatives)) {
      const decision = decisionByProblemId.get(problemId);
      const assignedTagIds = [
        ...(decision?.primaryTagIds ?? []),
        ...(decision?.supportingTagIds ?? []),
      ];
      for (const tagId of forbiddenTagIds) expect(assignedTagIds).not.toContain(tagId);
    }

    const semanticPrimaryRegressions: Readonly<Record<string, string>> = {
      'abc216-h': 'tag-determinant-counting',
      'abc218-e': 'tag-spanning-tree-optimization',
      'abc221-f': 'tag-tree-metric-diameter',
      'abc221-g': 'tag-bitset-word-parallel',
      'abc222-f': 'tag-tree-metric-diameter',
      'abc224-e': 'tag-dp-transition-acceleration',
      'abc227-f': 'tag-bounded-enumeration',
      'abc228-e': 'tag-modular-crt',
      'abc229-h': 'tag-game-value-dp',
      'abc231-e': 'tag-carry-mixed-radix-dp',
      'abc234-e': 'tag-bounded-enumeration',
      'abc234-ex': 'tag-geometry-orientation-transform',
      'abc235-e': 'tag-spanning-tree-optimization',
      'abc243-e': 'tag-shortest-path',
      'abc247-f': 'tag-dp-state-equivalence',
      'abc246-e': 'tag-shortest-path',
      'abc252-f': 'tag-greedy-exchange-order',
      'abc253-ex': 'tag-determinant-counting',
      'abc253-f': 'tag-reverse-offline',
      'abc255-e': 'tag-contribution-reordering',
      'abc260-f': 'tag-constructive-witness',
      'abc261-ex': 'tag-game-value-dp',
      'abc264-g': 'tag-string-automata',
      'abc273-ex': 'tag-gcd-diophantine',
      'abc266-f': 'tag-graph-core-peeling',
      'abc267-f': 'tag-tree-metric-diameter',
      'abc270-f': 'tag-spanning-tree-optimization',
      'abc279-e': 'tag-witness-impact-localization',
      'abc284-ex': 'tag-symmetry-invariant-normalization',
      'abc287-e': 'tag-trie-prefix',
      'abc287-ex': 'tag-reachability-bfs',
      'abc288-g': 'tag-linear-algebra-xor',
      'abc294-ex': 'tag-subset-bitmask-transform',
      'abc295-e': 'tag-contribution-reordering',
      'abc298-f': 'tag-greedy-exchange-order',
      'abc301-f': 'tag-string-automata',
      'abc303-g': 'tag-game-value-dp',
      'abc305-g': 'tag-string-automata',
      'abc307-g': 'tag-knapsack-resource',
      'abc309-ex': 'tag-convolution-fps',
      'abc312-e': 'tag-geometry-orientation-transform',
      'abc317-e': 'tag-reachability-bfs',
      'abc321-e': 'tag-implicit-binary-tree-arithmetic',
      'abc321-f': 'tag-knapsack-resource',
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
      'abc328-e': 'tag-bounded-enumeration',
      'abc347-f': 'tag-bounded-enumeration',
      'abc349-e': 'tag-game-value-dp',
      'abc351-g': 'tag-static-top-tree',
      'abc353-e': 'tag-trie-prefix',
      'abc355-g': 'tag-discrete-convex-marginal',
      'abc361-e': 'tag-contribution-reordering',
      'abc367-f': 'tag-string-hash-equality',
      'abc377-g': 'tag-trie-prefix',
      'abc378-g': 'tag-dp-state-equivalence',
      'abc382-f': 'tag-lazy-segment-action',
      'abc401-f': 'tag-tree-metric-diameter',
      'abc406-f': 'tag-tree-path-decomposition',
      'abc413-f': 'tag-game-value-dp',
      'abc415-e': 'tag-grid-table-dp',
      'abc416-g': 'tag-dp-state-equivalence',
      'abc419-g': 'tag-graph-core-peeling',
      'abc421-f': 'tag-linked-list-index',
      'abc433-g': 'tag-string-automata',
      'abc428-e': 'tag-tree-metric-diameter',
      'abc437-e': 'tag-trie-prefix',
      'abc386-e': 'tag-bounded-enumeration',
      'abc442-g': 'tag-bounded-enumeration',
      'abc443-e': 'tag-grid-table-dp',
      'abc448-g': 'tag-convex-hull-trick',
      'abc453-f': 'tag-constructive-witness',
      'abc455-g': 'tag-string-hash-equality',
      'abc460-g': 'tag-static-top-tree',
    };
    for (const [problemId, primaryTagId] of Object.entries(semanticPrimaryRegressions)) {
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).toContain(primaryTagId);
    }

    const semanticOutcomeRegressions: Readonly<Record<string, string>> = {
      'abc212-h': 'outcome-transform-to-linear-system-or-rank',
      'abc213-h': 'outcome-compute-convolution-or-correlation',
      'abc221-f': 'outcome-use-tree-diameter-extrema',
      'abc221-g': 'outcome-accelerate-set-operations-with-bitsets',
      'abc222-f': 'outcome-use-tree-diameter-extrema',
      'abc224-e': 'outcome-factor-and-accelerate-transitions',
      'abc227-f': 'outcome-enumerate-bounded-candidates-or-cases',
      'abc228-e': 'outcome-exploit-modular-periodicity',
      'abc231-e': 'outcome-design-carry-or-mixed-radix-dp',
      'abc234-e': 'outcome-enumerate-bounded-candidates-or-cases',
      'abc243-e': 'outcome-model-and-compute-shortest-path',
      'abc251-g': 'outcome-represent-convex-intersection-by-halfplanes',
      'abc246-e': 'outcome-model-and-compute-shortest-path',
      'abc272-ex': 'outcome-evaluate-and-compose-polynomials',
      'abc277-ex': 'outcome-encode-threshold-constraints-as-two-sat',
      'abc252-f': 'outcome-prove-greedy-order',
      'abc253-f': 'outcome-reverse-update-time',
      'abc255-e': 'outcome-reorder-counting-contributions',
      'abc260-f': 'outcome-recover-valid-witness',
      'abc267-f': 'outcome-use-tree-diameter-extrema',
      'abc280-f': 'outcome-maintain-potential-differences',
      'abc284-ex': 'outcome-count-orbits-by-fixed-points',
      'abc287-ex': 'outcome-compute-transitive-closure',
      'abc292-e': 'outcome-compute-transitive-closure',
      'abc288-g': 'outcome-factor-separable-linear-transform',
      'abc298-f': 'outcome-prove-greedy-order',
      'abc295-e': 'outcome-reorder-counting-contributions',
      'abc295-f': 'outcome-reorder-counting-contributions',
      'abc301-f': 'outcome-build-finite-string-automaton',
      'abc305-g': 'outcome-build-finite-string-automaton',
      'abc307-ex': 'outcome-compute-convolution-or-correlation',
      'abc309-ex': 'outcome-compute-convolution-or-correlation',
      'abc314-f': 'outcome-augment-components-with-metadata',
      'abc314-ex': 'outcome-exploit-convexity',
      'abc318-ex': 'outcome-apply-formal-power-series-operations',
      'abc319-e': 'outcome-exploit-modular-periodicity',
      'abc321-e': 'outcome-count-implicit-binary-tree-layers',
      'abc321-f': 'outcome-design-resource-dp',
      'abc333-g': 'outcome-approximate-rational-by-euclid',
      'abc334-e': 'outcome-reorder-counting-contributions',
      'abc337-g': 'outcome-flatten-tree-by-euler-order',
      'abc340-g': 'outcome-build-virtual-tree',
      'abc347-f': 'outcome-enumerate-bounded-candidates-or-cases',
      'abc351-g': 'outcome-compose-dynamic-tree-clusters',
      'abc361-e': 'outcome-reorder-counting-contributions',
      'abc374-f': 'outcome-compress-sparse-keys',
      'abc408-g': 'outcome-approximate-rational-by-euclid',
      'abc433-g': 'outcome-build-suffix-automaton',
      'abc442-g': 'outcome-enumerate-bounded-candidates-or-cases',
      'abc443-e': 'outcome-design-grid-table-dp',
      'abc460-g': 'outcome-compose-dynamic-tree-clusters',
      'abc466-g': 'outcome-maintain-potential-differences',
      'abc281-f': 'outcome-query-bitwise-order-with-trie',
      'abc282-ex': 'outcome-divide-search-space-recursively',
      'abc238-e': 'outcome-maintain-connectivity-components',
      'abc383-e': 'outcome-construct-optimal-spanning-tree',
      'abc392-e': 'outcome-augment-components-with-metadata',
      'abc399-e': 'outcome-decompose-functional-graph',
      'abc401-e': 'outcome-augment-components-with-metadata',
      'abc401-f': 'outcome-use-tree-diameter-extrema',
      'abc405-f': 'outcome-answer-tree-ancestor-queries',
      'abc406-f': 'outcome-flatten-tree-by-euler-order',
      'abc415-e': 'outcome-design-grid-table-dp',
      'abc420-e': 'outcome-augment-components-with-metadata',
      'abc428-e': 'outcome-use-tree-diameter-extrema',
      'abc428-g': 'outcome-count-orbits-by-fixed-points',
      'abc429-g': 'outcome-evaluate-compressed-integer-blocks',
      'abc434-e': 'outcome-augment-components-with-metadata',
      'abc436-e': 'outcome-decompose-functional-graph',
      'abc438-e': 'outcome-jump-deterministic-transition',
      'abc438-g': 'outcome-reduce-integer-structure-by-gcd',
      'abc451-f': 'outcome-color-and-classify-bipartite-components',
      'abc459-g': 'outcome-characterize-integer-solvability',
      'abc460-e': 'outcome-solve-modular-constraints',
      'abc387-g': 'outcome-evaluate-and-compose-polynomials',
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

    const dualPrimaryRegressions = {
      'abc228-e': ['tag-modular-arithmetic', 'outcome-compute-in-modular-arithmetic'],
      'abc274-ex': ['tag-finite-field-extension', 'outcome-compute-in-finite-field-extension'],
      'abc305-f': ['tag-interactive-protocol', 'outcome-maintain-interactive-query-protocol'],
      'abc311-e': ['tag-grid-table-dp', 'outcome-design-grid-table-dp'],
      'abc355-e': ['tag-interactive-protocol', 'outcome-maintain-interactive-query-protocol'],
      'abc398-e': ['tag-bipartite-structure', 'outcome-color-and-classify-bipartite-components'],
      'abc398-g': ['tag-bipartite-structure', 'outcome-color-and-classify-bipartite-components'],
      'abc411-e': ['tag-modular-arithmetic', 'outcome-compute-in-modular-arithmetic'],
    } as const;
    for (const [problemId, [tagId, outcomeId]] of Object.entries(dualPrimaryRegressions)) {
      const decision = decisionByProblemId.get(problemId);
      expect(decision?.primaryTagIds).toContain(tagId);
      expect(decision?.additionalPrimaryOutcomeIds).toContain(outcomeId);
      expect(decision?.supportingTagIds).not.toContain(tagId);
      expect(decision?.supportingOutcomeIds).not.toContain(outcomeId);
    }
    expect(decisionByProblemId.get('abc306-g')?.additionalPrimaryOutcomeIds).toContain(
      'outcome-bound-reachability-in-numerical-semigroup',
    );
    expect(decisionByProblemId.get('abc317-g')?.additionalPrimaryOutcomeIds).toContain(
      'outcome-characterize-bipartite-feasibility-by-hall',
    );
    expect(decisionByProblemId.get('abc279-e')?.learningUnitCandidateIds).toContain(
      'unit-change-impact-localization',
    );
    expect(decisionByProblemId.get('abc279-e')?.learningUnitCandidateIds).not.toContain(
      'unit-shortest-path-certificates',
    );

    const supportingRegressions: Readonly<Record<string, string>> = {
      'abc213-f': 'tag-monotone-stack-queue',
      'abc214-h': 'tag-flow-matching-cut',
      'abc227-h': 'tag-flow-matching-cut',
      'abc248-ex': 'tag-lazy-segment-action',
      'abc269-ex': 'tag-convolution-fps',
      'abc267-f': 'tag-tree-path-decomposition',
      'abc220-e': 'tag-implicit-binary-tree-arithmetic',
      'abc221-g': 'tag-constructive-witness',
      'abc243-e': 'tag-witness-impact-localization',
      'abc276-ex': 'tag-coordinate-compression',
      'abc287-ex': 'tag-event-sweep',
      'abc287-g': 'tag-coordinate-compression',
      'abc280-ex': 'tag-monotone-stack-queue',
      'abc299-ex': 'tag-linear-recurrence-matrix',
      'abc305-g': 'tag-linear-recurrence-matrix',
      'abc261-f': 'tag-fenwick-weighted-prefix',
      'abc334-e': 'tag-modular-arithmetic',
      'abc336-g': 'tag-euler-degree-parity',
      'abc364-g': 'tag-shortest-path',
      'abc375-g': 'tag-shortest-path',
      'abc387-f': 'tag-dp-transition-acceleration',
      'abc370-f': 'tag-functional-graph-doubling',
      'abc361-e': 'tag-tree-metric-diameter',
      'abc366-g': 'tag-constructive-witness',
      'abc369-f': 'tag-constructive-witness',
      'abc403-e': 'tag-trie-prefix',
      'abc392-e': 'tag-constructive-witness',
      'abc396-e': 'tag-constructive-witness',
      'abc406-g': 'tag-constructive-witness',
      'abc427-e': 'tag-prefix-difference',
      'abc440-g': 'tag-dsu-connectivity',
      'abc450-f': 'tag-lazy-segment-action',
      'abc443-f': 'tag-constructive-witness',
      'abc424-e': 'tag-implicit-binary-tree-arithmetic',
      'abc465-g': 'tag-coordinate-compression',
      'abc460-f': 'tag-tree-path-decomposition',
    };
    for (const [problemId, supportingTagId] of Object.entries(supportingRegressions)) {
      expect(decisionByProblemId.get(problemId)?.supportingTagIds).toContain(supportingTagId);
    }
    expect(decisionByProblemId.get('abc351-g')?.supportingOutcomeIds).toContain(
      'outcome-apply-heavy-light-decomposition',
    );

    const directClaimRegressions = [
      [
        'abc221-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-constructive-witness',
        'outcome-recover-valid-witness',
      ],
      [
        'abc243-e',
        '/typicalTechniques/1',
        'supporting',
        'tag-witness-impact-localization',
        'outcome-localize-change-impact-by-witness',
      ],
      [
        'abc276-ex',
        '/typicalTechniques/1',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc276-ex',
        '/typicalTechniques/2',
        'supporting',
        'tag-constructive-witness',
        'outcome-recover-valid-witness',
      ],
      [
        'abc287-ex',
        '/typicalTechniques/0',
        'supporting',
        'tag-event-sweep',
        'outcome-linearize-events',
      ],
      [
        'abc287-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc287-g',
        '/prerequisiteCandidates/1',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc300-ex',
        '/typicalTechniques/1',
        'supporting',
        'tag-subset-bitmask-transform',
        'outcome-enumerate-subset-state-space',
      ],
      [
        'abc222-e',
        '/typicalTechniques/0',
        'supporting',
        'tag-contribution-reordering',
        'outcome-reorder-counting-contributions',
      ],
      [
        'abc224-e',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-directed-condensation-toposort',
        'outcome-condense-and-order-directed-graph',
      ],
      [
        'abc302-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-bounded-enumeration',
        'outcome-enumerate-bounded-candidates-or-cases',
      ],
      [
        'abc318-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-flow-matching-cut',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ],
      [
        'abc342-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      [
        'abc342-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      [
        'abc363-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      [
        'abc363-f',
        '/typicalTechniques/1',
        'supporting',
        'tag-prime-divisor-decomposition',
        'outcome-decompose-by-prime-or-divisor',
      ],
      [
        'abc363-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-flow-matching-cut',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ],
      [
        'abc363-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      [
        'abc363-g',
        '/prerequisiteCandidates/1',
        'supporting',
        'tag-flow-matching-cut',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ],
      [
        'abc384-g',
        '/prerequisiteCandidates/1',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc396-e',
        '/typicalTechniques/1',
        'supporting',
        'tag-constructive-witness',
        'outcome-recover-valid-witness',
      ],
      [
        'abc424-e',
        '/typicalTechniques/1',
        'supporting',
        'tag-implicit-binary-tree-arithmetic',
        'outcome-count-implicit-binary-tree-layers',
      ],
      [
        'abc465-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc405-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      ['abc406-f', '/typicalTechniques/0', 'primary', 'tag-tree-path-decomposition', null],
      ['abc406-f', '/prerequisiteCandidates/0', 'same_tag', 'tag-tree-path-decomposition', null],
      [
        'abc406-g',
        '/typicalTechniques/2',
        'supporting',
        'tag-ordered-set-heap',
        'outcome-maintain-dynamic-order-statistics',
      ],
      [
        'abc409-f',
        '/typicalTechniques/0',
        'supporting',
        'tag-dsu-connectivity',
        'outcome-maintain-connectivity-components',
      ],
      [
        'abc409-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc412-f',
        '/typicalTechniques/1',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc412-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-modular-arithmetic',
        'outcome-compute-in-modular-arithmetic',
      ],
      ['abc412-g', '/typicalTechniques/2', 'same_tag', 'tag-flow-matching-cut', null],
      [
        'abc413-f',
        '/typicalTechniques/1',
        'supporting',
        'tag-reachability-bfs',
        'outcome-select-state-graph-search',
      ],
      [
        'abc413-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-reachability-bfs',
        'outcome-select-state-graph-search',
      ],
      [
        'abc414-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      [
        'abc414-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-decompose-ranges-into-segment-tree-nodes',
      ],
      ['abc415-e', '/typicalTechniques/0', 'primary', 'tag-grid-table-dp', null],
      ['abc415-e', '/typicalTechniques/1', 'same_tag', 'tag-grid-table-dp', null],
      ['abc415-e', '/prerequisiteCandidates/0', 'same_tag', 'tag-grid-table-dp', null],
      [
        'abc417-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-modular-arithmetic',
        'outcome-compute-in-modular-arithmetic',
      ],
      [
        'abc422-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc422-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc429-f',
        '/typicalTechniques/0',
        'supporting',
        'tag-shortest-path',
        'outcome-model-and-compute-shortest-path',
      ],
      [
        'abc429-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-shortest-path',
        'outcome-model-and-compute-shortest-path',
      ],
      [
        'abc431-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-event-sweep',
        'outcome-linearize-events',
      ],
      [
        'abc432-f',
        '/typicalTechniques/2',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc432-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc432-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc432-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc434-e',
        '/typicalTechniques/2',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc436-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-dp-transition-acceleration',
        'outcome-factor-and-accelerate-transitions',
      ],
      [
        'abc434-e',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc439-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-coordinate-compression',
        'outcome-compress-sparse-keys',
      ],
      [
        'abc453-f',
        '/typicalTechniques/1',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc453-f',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc453-g',
        '/typicalTechniques/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-design-associative-range-summary',
      ],
      [
        'abc453-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-monoid-segment-tree',
        'outcome-design-associative-range-summary',
      ],
      [
        'abc456-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-combinatorial-coefficients',
        'outcome-formulate-combinatorial-coefficients',
      ],
      [
        'abc462-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-amortized-heavy-light',
        'outcome-bound-total-work',
      ],
      [
        'abc462-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-amortized-heavy-light',
        'outcome-bound-total-work',
      ],
      [
        'abc464-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
      [
        'abc466-g',
        '/typicalTechniques/1',
        'supporting',
        'tag-carry-mixed-radix-dp',
        'outcome-design-carry-or-mixed-radix-dp',
      ],
      [
        'abc464-g',
        '/prerequisiteCandidates/0',
        'supporting',
        'tag-greedy-exchange-order',
        'outcome-prove-greedy-order',
      ],
    ] as const;
    for (const [problemId, claimPath, kind, tagId, supportingOutcomeId] of directClaimRegressions) {
      const decision = decisionByProblemId.get(problemId);
      const matchingDisposition = decision?.claimDispositions.find(
        (disposition) =>
          disposition.claimRef.claimPath === claimPath &&
          disposition.kind === kind &&
          disposition.tagIds.includes(tagId),
      );
      expect(matchingDisposition, `${problemId}${claimPath} -> ${kind}:${tagId}`).toBeDefined();
      if (supportingOutcomeId) {
        expect(decision?.supportingOutcomeIds).toContain(supportingOutcomeId);
      }
    }
    expect(decisionByProblemId.get('abc460-f')?.supportingTagIds).toContain(
      'tag-tree-metric-diameter',
    );
    expect(decisionByProblemId.get('abc302-g')?.presentationUnitId).toBe(
      'unit-bounded-enumeration',
    );
    expect(decisionByProblemId.get('abc436-g')?.presentationUnitId).toBe(
      'unit-generating-functions',
    );

    for (const [problemId, claimPaths, primaryTagId, presentationUnitId] of [
      ['abc241-f', ['/typicalTechniques/1'], 'tag-reachability-bfs', 'unit-graph-search'],
      [
        'abc267-e',
        ['/typicalTechniques/1'],
        'tag-monotone-threshold-search',
        'unit-monotone-search',
      ],
    ] as const) {
      const decision = decisionByProblemId.get(problemId);
      for (const claimPath of claimPaths) {
        expect(
          decision?.claimDispositions.find(
            (disposition) => disposition.claimRef.claimPath === claimPath,
          ),
        ).toMatchObject({ kind: 'problem_specific', tagIds: [] });
      }
      expect(decision?.primaryTagIds).toContain(primaryTagId);
      expect(decision?.presentationUnitId).toBe(presentationUnitId);
    }

    const baselineClaimKeys = table.decisions
      .flatMap((decision) =>
        decision.claimDispositions.flatMap(({ claimRef, kind, rationale }) =>
          kind === 'baseline'
            ? [`${decision.problemId}${claimRef.claimPath}\u0000${rationale}`]
            : [],
        ),
      )
      .sort();
    expect(baselineClaimKeys).toHaveLength(71);
    expect(baselineClaimKeys.every((key) => key.includes('共通前提カテゴリ:'))).toBe(true);
    expect(baselineClaimKeys.map((key) => key.split('\u0000')[0])).toEqual(
      FINAL_TAXONOMY_BASELINE_CLAIMS.map(({ key }) => key).sort(),
    );

    const leadTechniqueRegressions: Readonly<Record<string, string>> = {
      'abc270-g': 'tag-divide-enumerate',
      'abc273-ex': 'tag-gcd-diophantine',
      'abc321-e': 'tag-implicit-binary-tree-arithmetic',
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
      'abc303-e': ['tag-constructive-witness'],
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

    const problemSpecificClaimRegressions = [
      [
        'abc214-g',
        '/prerequisiteCandidates/1',
        'tag-graph-core-peeling',
        'unit-graph-core-peeling',
        'unit-generating-functions',
      ],
      [
        'abc247-f',
        '/typicalTechniques/0',
        'tag-graph-core-peeling',
        'unit-graph-core-peeling',
        'unit-dp-state-design',
      ],
      [
        'abc247-f',
        '/prerequisiteCandidates/1',
        'tag-graph-core-peeling',
        'unit-graph-core-peeling',
        'unit-dp-state-design',
      ],
      [
        'abc252-f',
        '/typicalTechniques/1',
        'tag-reverse-offline',
        'unit-events-offline',
        'unit-ordered-set-heap',
      ],
      [
        'abc289-e',
        '/prerequisiteCandidates/2',
        'tag-euler-degree-parity',
        'unit-euler-degree',
        'unit-graph-search',
      ],
      [
        'abc431-g',
        '/typicalTechniques/2',
        'tag-symmetry-invariant-normalization',
        'unit-normalization',
        'unit-ordered-set-heap',
      ],
      [
        'abc454-e',
        '/typicalTechniques/0',
        'tag-bipartite-structure',
        'unit-bipartite-structure',
        'unit-constructive-witness',
      ],
    ] as const;
    for (const [
      problemId,
      claimPath,
      forbiddenTagId,
      forbiddenUnitId,
      presentationUnitId,
    ] of problemSpecificClaimRegressions) {
      const decision = decisionByProblemId.get(problemId);
      expect(
        decision?.claimDispositions.find(
          (disposition) => disposition.claimRef.claimPath === claimPath,
        ),
      ).toMatchObject({ kind: 'problem_specific', tagIds: [] });
      expect(decision?.supportingTagIds).not.toContain(forbiddenTagId);
      expect(decision?.learningUnitCandidateIds).not.toContain(forbiddenUnitId);
      expect(decision?.presentationUnitId).toBe(presentationUnitId);
    }

    const abc286F = decisionByProblemId.get('abc286-f');
    expect(
      abc286F?.claimDispositions.find(
        ({ claimRef, kind }) =>
          claimRef.claimPath === '/typicalTechniques/1' && kind === 'supporting',
      )?.tagIds,
    ).toEqual(['tag-functional-graph-doubling']);
    expect(
      abc286F?.claimDispositions.find(
        ({ claimRef, kind }) =>
          claimRef.claimPath === '/prerequisiteCandidates/2' && kind === 'supporting',
      )?.tagIds,
    ).toEqual(['tag-interactive-protocol']);

    const abc347F = decisionByProblemId.get('abc347-f');
    expect(
      abc347F?.claimDispositions.find(
        ({ claimRef, kind }) => claimRef.claimPath === '/typicalTechniques/0' && kind === 'primary',
      )?.tagIds,
    ).toEqual(['tag-bounded-enumeration']);
    expect(
      abc347F?.claimDispositions.find(
        ({ claimRef, kind }) =>
          claimRef.claimPath === '/typicalTechniques/1' && kind === 'supporting',
      )?.tagIds,
    ).toEqual(['tag-grid-table-dp']);
    expect(
      abc347F?.claimDispositions.find(
        ({ claimRef, kind }) =>
          claimRef.claimPath === '/prerequisiteCandidates/0' && kind === 'supporting',
      )?.tagIds,
    ).toEqual(['tag-grid-table-dp', 'tag-prefix-difference']);
    expect(abc347F?.supportingOutcomeIds).toEqual([
      'outcome-design-grid-table-dp',
      'outcome-linearize-static-range-information',
    ]);
    expect(abc347F?.presentationUnitId).toBe('unit-dp-grid-table');

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

  it('keeps the new reusable skills at observable textbook boundaries', () => {
    const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));
    const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));
    const unitById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));

    expect(tagById.get('tag-witness-impact-localization')).toMatchObject({
      parentId: 'tag-model-reduction',
      prerequisiteTagIds: [],
      learningUnitCandidateIds: ['unit-change-impact-localization'],
    });
    expect(outcomeById.get('outcome-localize-change-impact-by-witness')).toMatchObject({
      prerequisiteOutcomeIds: [],
      learningUnitCandidateIds: ['unit-change-impact-localization'],
    });

    expect(tagById.get('tag-modular-arithmetic')?.learningOutcomeIds).toEqual([
      'outcome-compute-in-modular-arithmetic',
    ]);
    expect(outcomeById.get('outcome-compute-in-modular-arithmetic')).toMatchObject({
      prerequisiteOutcomeIds: [],
      learningUnitCandidateIds: ['unit-modular-arithmetic'],
    });
    expect(outcomeById.get('outcome-compute-in-modular-arithmetic')?.statement).toContain(
      '零因子数',
    );
    expect(outcomeById.has('outcome-maintain-zero-aware-modular-product')).toBe(false);
    expect(tagById.get('tag-modular-arithmetic')?.aliases).toContain('zero-aware modular product');
    expect(outcomeById.get('outcome-solve-modular-constraints')).toMatchObject({
      learningUnitCandidateIds: ['unit-modular-congruence'],
    });

    expect(tagById.has('tag-numerical-semigroup-reachability')).toBe(false);
    expect(tagById.get('tag-gcd-diophantine')?.learningOutcomeIds).toContain(
      'outcome-bound-reachability-in-numerical-semigroup',
    );
    expect(tagById.get('tag-gcd-diophantine')?.learningUnitCandidateIds).toContain(
      'unit-numerical-semigroup-reachability',
    );
    expect(tagById.get('tag-gcd-diophantine')?.representativeProblemIds).toEqual(
      expect.arrayContaining(['abc388-f', 'abc306-g']),
    );
    expect(tagById.get('tag-gcd-diophantine')?.aliases).toContain('Frobenius coin problem');
    expect(outcomeById.get('outcome-bound-reachability-in-numerical-semigroup')).toMatchObject({
      prerequisiteOutcomeIds: ['outcome-reduce-integer-structure-by-gcd'],
      scopeTagIds: ['tag-gcd-diophantine'],
      learningUnitCandidateIds: ['unit-numerical-semigroup-reachability'],
    });
    expect(
      outcomeById.get('outcome-bound-reachability-in-numerical-semigroup')?.statement,
    ).toContain('conductor');
    expect(
      unitById.get('unit-numerical-semigroup-reachability')?.additionalPrerequisiteUnitIds,
    ).toEqual(['unit-gcd-diophantine']);
    expect(unitById.get('unit-numerical-semigroup-reachability')?.orderReason).toContain(
      'conductor',
    );

    expect(tagById.get('tag-convolution-fps')?.learningOutcomeIds).toEqual([
      'outcome-compute-convolution-or-correlation',
      'outcome-encode-counting-by-generating-function',
      'outcome-apply-formal-power-series-operations',
      'outcome-evaluate-and-compose-polynomials',
    ]);
    expect(tagById.get('tag-string-automata')?.learningOutcomeIds).toEqual([
      'outcome-build-finite-string-automaton',
      'outcome-build-multi-pattern-automaton',
      'outcome-build-suffix-automaton',
    ]);
    expect(outcomeById.get('outcome-compose-dynamic-tree-clusters')?.scopeTagIds).toEqual([
      'tag-static-top-tree',
    ]);
    expect(unitById.get('unit-static-top-tree')?.additionalPrerequisiteUnitIds).toContain(
      'unit-tree-aggregation',
    );

    expect([...tagById.keys()]).toEqual(
      expect.arrayContaining([
        'tag-spanning-tree-optimization',
        'tag-randomized-algorithm',
        'tag-bitset-word-parallel',
        'tag-cartesian-tree',
        'tag-interactive-protocol',
        'tag-binary-trie',
        'tag-finite-field-extension',
      ]),
    );
  });
});
