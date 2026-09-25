export type FinalClaimOutcomeBindingKind = 'primary' | 'supporting' | 'same_tag';

export interface FinalClaimOutcomeBinding {
  readonly kind: FinalClaimOutcomeBindingKind;
  readonly outcomeIds: readonly string[];
}

const primary = (...outcomeIds: readonly string[]): FinalClaimOutcomeBinding => ({
  kind: 'primary',
  outcomeIds,
});

const supporting = (...outcomeIds: readonly string[]): FinalClaimOutcomeBinding => ({
  kind: 'supporting',
  outcomeIds,
});

const sameTag = (...outcomeIds: readonly string[]): FinalClaimOutcomeBinding => ({
  kind: 'same_tag',
  outcomeIds,
});

/**
 * Exact claim-path bindings for decisions with multiple primary Outcomes.
 *
 * The raw inventory decision tables predate several atomic Tag splits, so their coarse tag IDs
 * cannot distinguish which co-primary skill a particular claim proves.  This table is the final
 * learner-facing semantic join: every listed claim is bound to only the Outcome(s) its text
 * actually explains.  Supporting bindings on the same path are included here as well so a
 * promoted co-primary does not silently inherit every skill from its former coarse bucket.
 */
export const FINAL_MULTI_PRIMARY_CLAIM_OUTCOME_BINDINGS: Readonly<
  Record<string, Readonly<Record<string, readonly FinalClaimOutcomeBinding[]>>>
> = {
  'abc222-h': {
    '/typicalTechniques/0': [sameTag('outcome-invert-generating-function-equation')],
    '/typicalTechniques/1': [primary('outcome-invert-generating-function-equation')],
    '/typicalTechniques/2': [primary('outcome-derive-coefficient-recurrence-by-differentiation')],
    '/prerequisiteCandidates/0': [sameTag('outcome-invert-generating-function-equation')],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-derive-coefficient-recurrence-by-differentiation'),
      supporting('outcome-compute-in-modular-arithmetic'),
    ],
  },
  'abc214-h': {
    '/typicalTechniques/0': [primary('outcome-condense-and-order-directed-graph')],
    '/typicalTechniques/1': [primary('outcome-model-min-cost-flow')],
    '/prerequisiteCandidates/0': [sameTag('outcome-condense-and-order-directed-graph')],
    '/prerequisiteCandidates/1': [sameTag('outcome-model-min-cost-flow')],
  },
  'abc264-g': {
    '/typicalTechniques/0': [primary('outcome-build-finite-string-automaton')],
    '/typicalTechniques/1': [primary('outcome-detect-improving-cycles')],
    '/prerequisiteCandidates/0': [sameTag('outcome-build-finite-string-automaton')],
  },
  'abc335-e': {
    '/typicalTechniques/0': [primary('outcome-maintain-connectivity-components')],
    '/typicalTechniques/1': [primary('outcome-process-dag-in-topological-order')],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-maintain-connectivity-components',
        'outcome-process-dag-in-topological-order',
      ),
    ],
  },
  'abc218-f': {
    '/typicalTechniques/0': [
      primary(
        'outcome-localize-change-impact-by-witness',
        'outcome-build-shortest-path-certificate',
      ),
    ],
    '/prerequisiteCandidates/1': [sameTag('outcome-localize-change-impact-by-witness')],
  },
  'abc228-e': {
    '/typicalTechniques/0': [
      primary('outcome-exploit-modular-periodicity', 'outcome-compute-in-modular-arithmetic'),
    ],
    '/typicalTechniques/1': [primary('outcome-compute-in-modular-arithmetic')],
    '/prerequisiteCandidates/0': [sameTag('outcome-compute-in-modular-arithmetic')],
    '/prerequisiteCandidates/1': [sameTag('outcome-exploit-modular-periodicity')],
  },
  'abc227-h': {
    '/typicalTechniques/0': [primary('outcome-construct-euler-trail-or-circuit')],
    '/typicalTechniques/1': [primary('outcome-model-max-flow-min-cut')],
    '/prerequisiteCandidates/0': [sameTag('outcome-construct-euler-trail-or-circuit')],
    '/prerequisiteCandidates/1': [sameTag('outcome-model-max-flow-min-cut')],
  },
  'abc275-ex': {
    '/typicalTechniques/0': [primary('outcome-build-cartesian-tree-decomposition')],
    '/typicalTechniques/1': [primary('outcome-maintain-piecewise-linear-convex-function')],
    '/prerequisiteCandidates/0': [sameTag('outcome-build-cartesian-tree-decomposition')],
    '/prerequisiteCandidates/1': [sameTag('outcome-maintain-piecewise-linear-convex-function')],
  },
  'abc228-g': {
    '/typicalTechniques/1': [primary('outcome-determinize-automaton-by-subsets')],
    '/typicalTechniques/2': [
      primary('outcome-run-dp-on-finite-automaton'),
      supporting('outcome-enumerate-subset-state-space'),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-run-dp-on-finite-automaton')],
    '/prerequisiteCandidates/1': [sameTag('outcome-determinize-automaton-by-subsets')],
  },
  'abc230-h': {
    '/typicalTechniques/0': [primary('outcome-derive-coefficient-recurrence-by-differentiation')],
    '/typicalTechniques/1': [
      primary('outcome-compute-online-relaxed-convolution'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-derive-coefficient-recurrence-by-differentiation'),
    ],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-compute-online-relaxed-convolution'),
      supporting('outcome-divide-search-space-recursively'),
    ],
  },
  'abc235-ex': {
    '/typicalTechniques/0': [primary('outcome-build-component-merge-tree')],
    '/typicalTechniques/1': [primary('outcome-encode-counting-by-generating-function')],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-build-component-merge-tree',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting('outcome-compute-convolution-or-correlation'),
    ],
  },
  'abc250-ex': {
    '/typicalTechniques/0': [primary('outcome-model-and-compute-shortest-path')],
    '/typicalTechniques/1': [
      primary('outcome-sweep-connectivity-by-kruskal-threshold'),
      supporting('outcome-maintain-connectivity-components', 'outcome-linearize-events'),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-model-and-compute-shortest-path')],
    '/prerequisiteCandidates/1': [
      supporting('outcome-maintain-connectivity-components', 'outcome-linearize-events'),
    ],
  },
  'abc260-ex': {
    '/typicalTechniques/0': [
      primary('outcome-encode-counting-by-generating-function'),
      supporting(
        'outcome-correct-overlap-by-inversion',
        'outcome-formulate-combinatorial-coefficients',
      ),
    ],
    '/typicalTechniques/1': [
      primary('outcome-encode-counting-by-generating-function'),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
    '/typicalTechniques/2': [
      primary('outcome-apply-formal-power-series-operations'),
      supporting(
        'outcome-divide-search-space-recursively',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
      supporting('outcome-correct-overlap-by-inversion', 'outcome-compute-in-modular-arithmetic'),
    ],
  },
  'abc272-ex': {
    '/typicalTechniques/0': [
      primary('outcome-evaluate-polynomial-at-many-points'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/typicalTechniques/1': [
      primary('outcome-encode-counting-by-generating-function'),
      supporting(
        'outcome-correct-overlap-by-inversion',
        'outcome-formulate-combinatorial-coefficients',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-evaluate-polynomial-at-many-points',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting('outcome-correct-overlap-by-inversion', 'outcome-divide-search-space-recursively'),
    ],
  },
  'abc274-ex': {
    '/typicalTechniques/0': [primary('outcome-compare-sequences-by-rolling-fingerprint')],
    '/typicalTechniques/1': [
      primary('outcome-compute-in-finite-field-extension'),
      sameTag('outcome-compare-sequences-by-rolling-fingerprint'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-compare-sequences-by-rolling-fingerprint',
        'outcome-compute-in-finite-field-extension',
      ),
    ],
  },
  'abc280-g': {
    '/typicalTechniques/0': [primary('outcome-reduce-geometry-to-algebraic-predicates')],
    '/typicalTechniques/2': [primary('outcome-correct-overlap-by-inversion')],
    '/prerequisiteCandidates/0': [sameTag('outcome-reduce-geometry-to-algebraic-predicates')],
    '/prerequisiteCandidates/1': [sameTag('outcome-reduce-geometry-to-algebraic-predicates')],
    '/prerequisiteCandidates/2': [
      sameTag('outcome-correct-overlap-by-inversion'),
      supporting('outcome-linearize-events'),
    ],
  },
  'abc281-ex': {
    '/typicalTechniques/0': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/1': [
      primary('outcome-compute-online-relaxed-convolution'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-encode-counting-by-generating-function')],
    '/prerequisiteCandidates/1': [supporting('outcome-compute-convolution-or-correlation')],
  },
  'abc286-f': {
    '/typicalTechniques/0': [primary('outcome-solve-modular-constraints')],
    '/typicalTechniques/1': [primary('outcome-exploit-modular-periodicity')],
    '/typicalTechniques/2': [sameTag('outcome-solve-modular-constraints')],
    '/prerequisiteCandidates/0': [sameTag('outcome-solve-modular-constraints')],
    '/prerequisiteCandidates/1': [sameTag('outcome-exploit-modular-periodicity')],
  },
  'abc289-ex': {
    '/typicalTechniques/0': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/1': [
      primary('outcome-apply-formal-power-series-operations'),
      supporting('outcome-compute-in-modular-arithmetic'),
    ],
    '/typicalTechniques/2': [primary('outcome-compute-convolution-or-correlation')],
    '/prerequisiteCandidates/0': [supporting('outcome-formulate-combinatorial-coefficients')],
    '/prerequisiteCandidates/1': [sameTag('outcome-compute-convolution-or-correlation')],
    '/prerequisiteCandidates/2': [
      sameTag('outcome-apply-formal-power-series-operations'),
      supporting('outcome-compute-in-modular-arithmetic'),
    ],
    '/prerequisiteCandidates/3': [sameTag('outcome-encode-counting-by-generating-function')],
  },
  'abc294-g': {
    '/typicalTechniques/0': [primary('outcome-flatten-tree-by-euler-order')],
    '/typicalTechniques/1': [primary('outcome-answer-tree-ancestor-queries')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-flatten-tree-by-euler-order', 'outcome-answer-tree-ancestor-queries'),
      supporting('outcome-maintain-weighted-prefix-statistics'),
    ],
  },
  'abc297-ex': {
    '/typicalTechniques/0': [
      primary('outcome-encode-counting-by-generating-function'),
      supporting('outcome-correct-overlap-by-inversion'),
    ],
    '/typicalTechniques/1': [sameTag('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/2': [
      primary('outcome-apply-formal-power-series-operations'),
      supporting('outcome-compute-in-modular-arithmetic'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
      supporting('outcome-correct-overlap-by-inversion', 'outcome-compute-in-modular-arithmetic'),
    ],
  },
  'abc301-ex': {
    '/typicalTechniques/0': [
      primary('outcome-sweep-connectivity-by-kruskal-threshold'),
      supporting('outcome-maintain-connectivity-components', 'outcome-linearize-events'),
    ],
    '/typicalTechniques/1': [primary('outcome-identify-bridges-and-articulations')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-identify-bridges-and-articulations'),
      supporting('outcome-maintain-connectivity-components'),
    ],
  },
  'abc301-f': {
    '/typicalTechniques/0': [
      primary('outcome-build-finite-string-automaton', 'outcome-run-dp-on-finite-automaton'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-build-finite-string-automaton', 'outcome-run-dp-on-finite-automaton'),
      supporting('outcome-compute-in-modular-arithmetic'),
    ],
  },
  'abc305-f': {
    '/typicalTechniques/0': [
      primary('outcome-select-state-graph-search', 'outcome-maintain-interactive-query-protocol'),
    ],
    '/prerequisiteCandidates/1': [sameTag('outcome-maintain-interactive-query-protocol')],
  },
  'abc305-g': {
    '/typicalTechniques/0': [primary('outcome-build-finite-string-automaton')],
    '/typicalTechniques/1': [
      primary('outcome-run-dp-on-finite-automaton'),
      supporting('outcome-accelerate-fixed-linear-transition'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-build-finite-string-automaton', 'outcome-run-dp-on-finite-automaton'),
    ],
    '/prerequisiteCandidates/1': [supporting('outcome-accelerate-fixed-linear-transition')],
  },
  'abc311-e': {
    '/typicalTechniques/0': [primary('outcome-design-minimal-sufficient-state')],
    '/typicalTechniques/1': [primary('outcome-design-grid-table-dp')],
    '/prerequisiteCandidates/0': [sameTag('outcome-design-grid-table-dp')],
    '/prerequisiteCandidates/1': [sameTag('outcome-design-minimal-sufficient-state')],
  },
  'abc317-ex': {
    '/typicalTechniques/0': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
    ],
    '/typicalTechniques/1': [
      primary('outcome-compute-convolution-or-correlation'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
    ],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-compute-convolution-or-correlation'),
      supporting('outcome-divide-search-space-recursively'),
    ],
  },
  'abc317-g': {
    '/typicalTechniques/0': [
      primary(
        'outcome-solve-bipartite-matching',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ),
    ],
    '/typicalTechniques/1': [
      sameTag(
        'outcome-solve-bipartite-matching',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-solve-bipartite-matching',
        'outcome-characterize-bipartite-feasibility-by-hall',
      ),
    ],
  },
  'abc318-ex': {
    '/typicalTechniques/0': [
      primary('outcome-count-labeled-structures-by-components'),
      supporting('outcome-encode-counting-by-generating-function'),
    ],
    '/typicalTechniques/1': [primary('outcome-apply-formal-power-series-operations')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-count-labeled-structures-by-components'),
      supporting('outcome-encode-counting-by-generating-function'),
    ],
    '/prerequisiteCandidates/1': [sameTag('outcome-apply-formal-power-series-operations')],
  },
  'abc331-g': {
    '/typicalTechniques/0': [primary('outcome-correct-overlap-by-inversion')],
    '/typicalTechniques/1': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/2': [
      supporting(
        'outcome-compute-convolution-or-correlation',
        'outcome-divide-search-space-recursively',
      ),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-correct-overlap-by-inversion')],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-encode-counting-by-generating-function'),
      supporting('outcome-compute-convolution-or-correlation'),
    ],
  },
  'abc335-g': {
    '/typicalTechniques/0': [
      primary(
        'outcome-count-through-cyclic-exponents',
        'outcome-find-period-by-multiplicative-order',
      ),
    ],
    '/typicalTechniques/1': [
      supporting(
        'outcome-decompose-by-prime-or-divisor',
        'outcome-invert-divisor-lattice-by-mobius',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-count-through-cyclic-exponents',
        'outcome-find-period-by-multiplicative-order',
      ),
      supporting(
        'outcome-decompose-by-prime-or-divisor',
        'outcome-invert-divisor-lattice-by-mobius',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
  },
  'abc345-g': {
    '/typicalTechniques/0': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/1': [
      primary('outcome-compute-convolution-or-correlation'),
      supporting('outcome-balance-heavy-light-threshold'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-divide-search-space-recursively',
      ),
    ],
  },
  'abc352-g': {
    '/typicalTechniques/1': [
      primary(
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/1': [
      sameTag(
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting('outcome-divide-search-space-recursively'),
    ],
  },
  'abc355-e': {
    '/typicalTechniques/0': [primary('outcome-select-state-graph-search')],
    '/typicalTechniques/1': [
      primary('outcome-maintain-interactive-query-protocol'),
      sameTag('outcome-select-state-graph-search'),
      supporting('outcome-build-shortest-path-certificate'),
    ],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-select-state-graph-search', 'outcome-maintain-interactive-query-protocol'),
    ],
  },
  'abc355-g': {
    '/typicalTechniques/0': [primary('outcome-optimize-by-lagrangian-relaxation')],
    '/typicalTechniques/1': [primary('outcome-optimize-monge-transitions')],
    '/prerequisiteCandidates/0': [sameTag('outcome-optimize-monge-transitions')],
    '/prerequisiteCandidates/1': [sameTag('outcome-optimize-by-lagrangian-relaxation')],
  },
  'abc357-g': {
    '/typicalTechniques/0': [primary('outcome-correct-overlap-by-inversion')],
    '/typicalTechniques/1': [
      primary('outcome-compute-online-relaxed-convolution'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-correct-overlap-by-inversion'),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-correct-overlap-by-inversion', 'outcome-compute-online-relaxed-convolution'),
    ],
  },
  'abc385-g': {
    '/typicalTechniques/0': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/1': [
      primary('outcome-compute-convolution-or-correlation'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-encode-counting-by-generating-function')],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-compute-convolution-or-correlation'),
      supporting('outcome-divide-search-space-recursively'),
    ],
  },
  'abc386-g': {
    '/typicalTechniques/0': [primary('outcome-reorder-counting-contributions')],
    '/typicalTechniques/1': [
      primary('outcome-count-labeled-structures-by-components'),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
    '/typicalTechniques/2': [sameTag('outcome-reorder-counting-contributions')],
    '/prerequisiteCandidates/0': [sameTag('outcome-reorder-counting-contributions')],
    '/prerequisiteCandidates/1': [
      sameTag('outcome-count-labeled-structures-by-components'),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
  },
  'abc387-g': {
    '/typicalTechniques/0': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/1': [primary('outcome-compose-series-and-project-powers')],
    '/typicalTechniques/2': [
      primary('outcome-apply-formal-power-series-operations'),
      sameTag('outcome-compose-series-and-project-powers'),
    ],
    '/prerequisiteCandidates/0': [sameTag('outcome-encode-counting-by-generating-function')],
    '/prerequisiteCandidates/1': [
      sameTag(
        'outcome-compose-series-and-project-powers',
        'outcome-apply-formal-power-series-operations',
      ),
    ],
  },
  'abc390-g': {
    '/typicalTechniques/1': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
    '/prerequisiteCandidates/1': [sameTag('outcome-encode-counting-by-generating-function')],
  },
  'abc392-g': {
    '/typicalTechniques/0': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
      supporting('outcome-formulate-combinatorial-coefficients'),
    ],
  },
  'abc398-e': {
    '/typicalTechniques/0': [primary('outcome-classify-game-states')],
    '/typicalTechniques/1': [primary('outcome-color-and-classify-bipartite-components')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-color-and-classify-bipartite-components'),
      supporting('outcome-maintain-interactive-query-protocol'),
    ],
  },
  'abc398-g': {
    '/typicalTechniques/0': [primary('outcome-classify-game-states')],
    '/typicalTechniques/1': [primary('outcome-color-and-classify-bipartite-components')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-classify-game-states', 'outcome-color-and-classify-bipartite-components'),
    ],
  },
  'abc409-g': {
    '/typicalTechniques/2': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-solve-stochastic-recurrence',
      ),
    ],
  },
  'abc411-e': {
    '/typicalTechniques/0': [primary('outcome-reorder-counting-contributions')],
    '/typicalTechniques/2': [primary('outcome-maintain-modular-product-under-factor-updates')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-reorder-counting-contributions'),
      supporting('outcome-compute-in-modular-arithmetic', 'outcome-linearize-events'),
    ],
  },
  'abc418-g': {
    '/typicalTechniques/0': [
      primary('outcome-build-finite-string-automaton'),
      supporting('outcome-design-minimal-sufficient-state'),
    ],
    '/typicalTechniques/1': [primary('outcome-run-dp-on-finite-automaton')],
    '/typicalTechniques/2': [supporting('outcome-design-interval-split-dp')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-build-finite-string-automaton', 'outcome-run-dp-on-finite-automaton'),
      supporting('outcome-design-minimal-sufficient-state', 'outcome-design-interval-split-dp'),
    ],
  },
  'abc419-f': {
    '/typicalTechniques/0': [primary('outcome-build-multi-pattern-automaton')],
    '/typicalTechniques/1': [supporting('outcome-enumerate-subset-state-space')],
    '/typicalTechniques/2': [
      primary('outcome-run-dp-on-finite-automaton'),
      supporting('outcome-enumerate-subset-state-space'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-build-multi-pattern-automaton', 'outcome-run-dp-on-finite-automaton'),
      supporting('outcome-enumerate-subset-state-space'),
    ],
  },
  'abc419-g': {
    '/typicalTechniques/0': [primary('outcome-kernelize-near-tree-graph')],
    '/typicalTechniques/1': [sameTag('outcome-kernelize-near-tree-graph')],
    '/typicalTechniques/2': [primary('outcome-use-cycle-space-basis')],
    '/typicalTechniques/3': [supporting('outcome-enumerate-bounded-candidates-or-cases')],
    '/typicalTechniques/4': [supporting('outcome-enumerate-by-reversible-backtracking')],
    '/prerequisiteCandidates/0': [sameTag('outcome-use-cycle-space-basis')],
    '/prerequisiteCandidates/1': [sameTag('outcome-kernelize-near-tree-graph')],
    '/prerequisiteCandidates/2': [supporting('outcome-enumerate-by-reversible-backtracking')],
  },
  'abc422-g': {
    '/typicalTechniques/0': [
      primary('outcome-encode-counting-by-generating-function'),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
    '/typicalTechniques/1': [primary('outcome-compute-convolution-or-correlation')],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
  },
  'abc432-g': {
    '/typicalTechniques/0': [
      primary(
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
    '/typicalTechniques/1': [sameTag('outcome-compute-convolution-or-correlation')],
    '/typicalTechniques/2': [sameTag('outcome-encode-counting-by-generating-function')],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-compute-convolution-or-correlation',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting(
        'outcome-formulate-combinatorial-coefficients',
        'outcome-compute-in-modular-arithmetic',
      ),
    ],
  },
  'abc436-g': {
    '/typicalTechniques/2': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ),
    ],
  },
  'abc439-g': {
    '/typicalTechniques/0': [primary('outcome-compose-series-and-project-powers')],
    '/typicalTechniques/1': [primary('outcome-encode-counting-by-generating-function')],
    '/typicalTechniques/2': [
      primary('outcome-apply-formal-power-series-operations'),
      supporting('outcome-divide-search-space-recursively'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-compose-series-and-project-powers',
        'outcome-apply-formal-power-series-operations',
        'outcome-encode-counting-by-generating-function',
      ),
      supporting('outcome-divide-search-space-recursively'),
    ],
  },
  'abc449-g': {
    '/typicalTechniques/1': [
      primary(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
    ],
    '/prerequisiteCandidates/0': [
      sameTag(
        'outcome-encode-counting-by-generating-function',
        'outcome-apply-formal-power-series-operations',
      ),
    ],
  },
  'abc458-f': {
    '/typicalTechniques/0': [
      primary('outcome-build-multi-pattern-automaton', 'outcome-run-dp-on-finite-automaton'),
    ],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-build-multi-pattern-automaton', 'outcome-run-dp-on-finite-automaton'),
      supporting('outcome-accelerate-fixed-linear-transition'),
    ],
  },
  'abc466-g': {
    '/typicalTechniques/0': [primary('outcome-maintain-potential-differences')],
    '/typicalTechniques/1': [primary('outcome-design-carry-or-mixed-radix-dp')],
    '/prerequisiteCandidates/0': [
      sameTag('outcome-maintain-potential-differences', 'outcome-design-carry-or-mixed-radix-dp'),
    ],
  },
};
