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
        'tag-parameterized-graph-kernelization',
        'tag-ordered-set-heap',
        'tag-monotone-stack-queue',
        'tag-suffix-lcp-index',
        'tag-string-hash-equality',
        'tag-palindrome-radius',
      ]),
    );
    expect(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id)).toEqual(
      expect.arrayContaining([
        'outcome-build-balanced-separator-decomposition',
        'outcome-identify-bridges-and-articulations',
        'outcome-reduce-graph-to-parameter-kernel',
        'outcome-maintain-global-order-frontier',
        'outcome-prune-dominated-candidates-once',
        'outcome-build-suffix-lcp-index',
        'outcome-compare-substrings-by-fingerprint',
        'outcome-characterize-palindrome-intervals',
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

    for (const decision of table.decisions) {
      expect(decision.primaryTagIds).toContain(
        EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS[decision.problemId],
      );
      expect(decision.primaryOutcomeId).toMatch(/^outcome-/u);
      expect(NON_PRIMARY_OUTCOME_IDS).not.toContain(decision.primaryOutcomeId);
      expect(decision.primaryTagIds.length).toBeGreaterThanOrEqual(1);
      expect(decision.primaryTagIds.some((tagId) => NON_PRIMARY_TAG_IDS.includes(tagId))).toBe(
        false,
      );
      expect(decision.acceptanceStatus).toBe('proposed');
      expect(decision.decisionKind).toBe('curated_semantic_override');
      expect(decision.ambiguityStatus).toBe('curated_override');
      expect(decision.scoreGap).toBeNull();
      expect(decision.matchedSemanticDimensions).toEqual([]);
      expect(decision.competingTagIds).toEqual([]);
      expect(decision.selectionRationale).not.toHaveLength(0);
      expect(decision.decisionBasis.map((claim) => claim.claimPath)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^\/reasoningPath\/candidateApproaches\/\d+$/u),
          expect.stringMatching(/^\/reasoningPath\/keyInsights\/\d+$/u),
          '/reasoningPath/algorithmConnection',
          '/outcomeCandidates/0',
        ]),
      );
      for (const claim of [
        ...decision.decisionBasis,
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

    const primaryTagCounts = new Map<string, number>();
    for (const decision of table.decisions) {
      for (const tagId of decision.primaryTagIds) {
        primaryTagCounts.set(tagId, (primaryTagCounts.get(tagId) ?? 0) + 1);
      }
    }
    expect(Math.max(...primaryTagCounts.values())).toBeLessThanOrEqual(40);
    expect(primaryTagCounts.get('tag-geometry-orientation-transform')).toBeLessThanOrEqual(20);
    expect(primaryTagCounts.get('tag-ordered-set-heap')).toBeLessThanOrEqual(30);
    expect(primaryTagCounts.get('tag-sweep-coordinate-compression')).toBeLessThanOrEqual(25);

    const overrides = new Map(
      CURATED_PRIMARY_OVERRIDES.map((override) => [override.problemId, override]),
    );
    expect(overrides.size).toBe(
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
    expect(decisionByProblemId.get('abc312-ex')?.primaryTagIds).toContain(
      'tag-symmetry-invariant-normalization',
    );
    expect(decisionByProblemId.get('abc312-ex')?.primaryTagIds).not.toContain(
      'tag-cyclic-group-order',
    );
    expect(decisionByProblemId.get('abc403-f')?.primaryTagIds).toContain(
      'tag-dp-state-equivalence',
    );
    expect(decisionByProblemId.get('abc403-f')?.primaryTagIds).not.toContain(
      'tag-cyclic-group-order',
    );
    expect(decisionByProblemId.get('abc403-f')?.primaryTagIds).not.toContain(
      'tag-prime-divisor-decomposition',
    );
    expect(decisionByProblemId.get('abc291-ex')?.primaryTagIds).toContain(
      'tag-tree-balanced-separator',
    );
    expect(decisionByProblemId.get('abc419-g')?.primaryTagIds).toContain(
      'tag-parameterized-graph-kernelization',
    );
    expect(decisionByProblemId.get('abc359-e')?.primaryTagIds).toContain(
      'tag-monotone-stack-queue',
    );
    expect(decisionByProblemId.get('abc272-f')?.primaryTagIds).toContain('tag-suffix-lcp-index');
    expect(decisionByProblemId.get('abc272-f')?.primaryTagIds).not.toContain(
      'tag-string-hash-equality',
    );
    expect(decisionByProblemId.get('abc272-f')?.primaryTagIds).not.toContain(
      'tag-palindrome-radius',
    );
    expect(decisionByProblemId.get('abc218-f')?.primaryTagIds).toEqual(
      expect.arrayContaining(['tag-shortest-path-certificate', 'tag-witness-impact-localization']),
    );
    const expectedFalsePositiveCorrections: Readonly<Record<string, string>> = {
      'abc214-f': 'tag-sequence-subsequence-dp',
      'abc216-h': 'tag-combinatorial-coefficients',
      'abc217-f': 'tag-interval-partition-dp',
      'abc220-e': 'tag-contribution-reordering',
      'abc221-f': 'tag-tree-aggregation-reroot',
      'abc225-f': 'tag-greedy-exchange-order',
      'abc229-h': 'tag-game-grundy-dp',
      'abc246-e': 'tag-reachability-bfs',
      'abc260-f': 'tag-contribution-reordering',
      'abc276-e': 'tag-dsu-connectivity',
      'abc284-e': 'tag-reachability-bfs',
      'abc285-g': 'tag-flow-matching-cut',
      'abc294-g': 'tag-tree-path-decomposition',
      'abc457-g': 'tag-sequence-subsequence-dp',
    };
    for (const [problemId, primaryTagId] of Object.entries(expectedFalsePositiveCorrections)) {
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).toContain(primaryTagId);
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).not.toContain(
        'tag-geometry-orientation-transform',
      );
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).not.toContain(
        'tag-ordered-set-heap',
      );
    }
    const expectedMiddleRangePrimaries: Readonly<Record<string, string>> = {
      'abc300-e': 'tag-stochastic-expectation-dp',
      'abc300-f': 'tag-monotone-threshold-search',
      'abc301-e': 'tag-subset-bitmask-transform',
      'abc301-ex': 'tag-lowlink-critical-structure',
      'abc302-e': 'tag-amortized-heavy-light',
      'abc302-f': 'tag-reachability-bfs',
      'abc303-e': 'tag-reachability-bfs',
      'abc303-ex': 'tag-convolution-fps',
      'abc303-f': 'tag-monotone-threshold-search',
      'abc304-g': 'tag-monotone-threshold-search',
      'abc305-e': 'tag-ordered-set-heap',
      'abc308-g': 'tag-ordered-set-heap',
      'abc310-e': 'tag-dp-state-equivalence',
      'abc310-ex': 'tag-greedy-exchange-order',
      'abc313-ex': 'tag-dp-state-equivalence',
      'abc313-f': 'tag-divide-enumerate',
      'abc315-f': 'tag-sequence-subsequence-dp',
      'abc317-ex': 'tag-convolution-fps',
      'abc321-g': 'tag-subset-bitmask-transform',
      'abc328-f': 'tag-dsu-connectivity',
      'abc334-e': 'tag-reachability-bfs',
      'abc335-g': 'tag-prime-divisor-decomposition',
      'abc338-e': 'tag-sweep-coordinate-compression',
      'abc338-f': 'tag-subset-bitmask-transform',
      'abc340-f': 'tag-gcd-diophantine',
      'abc341-e': 'tag-prefix-difference',
      'abc341-f': 'tag-knapsack-resource',
      'abc341-g': 'tag-convex-hull-halfplane',
      'abc342-g': 'tag-ordered-set-heap',
      'abc343-g': 'tag-subset-bitmask-transform',
      'abc347-f': 'tag-symmetry-invariant-normalization',
      'abc348-f': 'tag-contribution-reordering',
      'abc348-g': 'tag-dp-transition-acceleration',
      'abc349-f': 'tag-subset-bitmask-transform',
      'abc350-f': 'tag-recursive-compressed-string',
      'abc352-e': 'tag-dsu-connectivity',
      'abc352-f': 'tag-subset-bitmask-transform',
      'abc352-g': 'tag-convolution-fps',
      'abc353-e': 'tag-prefix-matching-automata',
      'abc353-f': 'tag-geometry-orientation-transform',
      'abc353-g': 'tag-dp-transition-acceleration',
      'abc354-f': 'tag-sequence-subsequence-dp',
      'abc355-f': 'tag-dsu-connectivity',
      'abc355-g': 'tag-dp-transition-acceleration',
      'abc358-g': 'tag-dp-transition-acceleration',
      'abc364-f': 'tag-ordered-set-heap',
      'abc368-g': 'tag-amortized-heavy-light',
      'abc370-g': 'tag-prime-divisor-decomposition',
      'abc371-f': 'tag-lazy-segment-action',
      'abc372-f': 'tag-dp-transition-acceleration',
      'abc372-g': 'tag-convex-hull-halfplane',
      'abc375-g': 'tag-lowlink-critical-structure',
      'abc376-g': 'tag-greedy-exchange-order',
      'abc377-f': 'tag-geometry-orientation-transform',
      'abc378-f': 'tag-tree-aggregation-reroot',
      'abc379-e': 'tag-contribution-reordering',
      'abc379-g': 'tag-dp-state-equivalence',
      'abc380-g': 'tag-contribution-reordering',
      'abc381-e': 'tag-monotone-threshold-search',
      'abc381-g': 'tag-convolution-fps',
      'abc382-f': 'tag-monoid-segment-tree',
    };
    for (const [problemId, primaryTagId] of Object.entries(expectedMiddleRangePrimaries)) {
      expect(decisionByProblemId.get(problemId)?.primaryTagIds).toContain(primaryTagId);
    }
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
