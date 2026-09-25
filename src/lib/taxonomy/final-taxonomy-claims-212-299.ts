type ClaimDispositionKind = 'primary' | 'supporting' | 'same_tag' | 'baseline' | 'problem_specific';

interface ExplicitClaimDisposition {
  readonly claimPath: string;
  readonly kind: ClaimDispositionKind;
  readonly tagIds: readonly string[];
}

const disposition = (
  source: `t${number}` | `p${number}`,
  kind: ClaimDispositionKind,
  ...tagIds: readonly string[]
): ExplicitClaimDisposition => ({
  claimPath: source.startsWith('t')
    ? `/typicalTechniques/${source.slice(1)}`
    : `/prerequisiteCandidates/${source.slice(1)}`,
  kind,
  tagIds,
});

const decision = <
  const TOutcome extends string,
  const TDispositions extends readonly ExplicitClaimDisposition[],
  const TSupporting extends Readonly<Record<string, readonly string[]>>,
>(
  primaryOutcomeId: TOutcome,
  dispositions: TDispositions,
  supportingOutcomeIdsByTag: TSupporting,
  additionalPrimaryOutcomeIds: readonly string[] = [],
) => ({
  primaryOutcomeId,
  additionalPrimaryOutcomeIds,
  dispositions,
  supportingOutcomeIdsByTag,
});

const d = disposition;

/**
 * ABC 212--299 の reviewed ProblemAnalysis を claim path 単位で精読した明示判断表。
 * recall 語句から Tag を推測せず、教材上独立して学ぶ技能だけを supporting にする。
 */
export const FINAL_TAXONOMY_CLAIM_DECISIONS_212_299 = {
  'abc212-e': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'primary', 'tag-dp-transition-acceleration'),
      d('t1', 'baseline'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc212-f': decision(
    'outcome-jump-deterministic-transition',
    [
      d('t0', 'primary', 'tag-functional-graph-doubling'),
      d('t1', 'baseline'),
      d('p0', 'baseline'),
      d('p1', 'same_tag', 'tag-functional-graph-doubling'),
    ],
    {},
  ),
  'abc212-g': decision(
    'outcome-count-through-cyclic-exponents',
    [
      d('t0', 'primary', 'tag-cyclic-group-order'),
      d('t1', 'supporting', 'tag-inclusion-exclusion'),
      d('p0', 'same_tag', 'tag-cyclic-group-order'),
      d('p0', 'supporting', 'tag-gcd-structure', 'tag-prime-divisor-decomposition'),
    ],
    {
      'tag-gcd-structure': ['outcome-reduce-integer-structure-by-gcd'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc212-h': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'supporting', 'tag-game-grundy-dp'),
      d('t1', 'primary', 'tag-linear-algebra-xor'),
      d('p0', 'supporting', 'tag-game-grundy-dp'),
      d('p1', 'same_tag', 'tag-linear-algebra-xor'),
    ],
    { 'tag-game-grundy-dp': ['outcome-classify-game-states'] },
  ),
  'abc213-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc213-f': decision(
    'outcome-build-suffix-lcp-index',
    [
      d('t0', 'primary', 'tag-suffix-lcp-index'),
      d('t1', 'supporting', 'tag-monotone-stack-queue'),
      d('p0', 'same_tag', 'tag-suffix-lcp-index'),
      d('p1', 'supporting', 'tag-monotone-stack-queue'),
    ],
    { 'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'] },
  ),
  'abc213-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'same_tag', 'tag-subset-bitmask-transform'),
      d('t1', 'primary', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
      d('p1', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc213-h': decision(
    'outcome-compute-convolution-or-correlation',
    [
      d('t0', 'supporting', 'tag-divide-enumerate'),
      d('t0', 'same_tag', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'supporting', 'tag-divide-enumerate'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
  ),
  'abc214-e': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t0', 'supporting', 'tag-ordered-set-heap'),
      d('t1', 'supporting', 'tag-event-sweep'),
      d('p0', 'supporting', 'tag-ordered-set-heap', 'tag-event-sweep'),
      d('p1', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc214-f': decision(
    'outcome-design-order-preserving-dp',
    [
      d('t0', 'primary', 'tag-sequence-subsequence-dp'),
      d('t1', 'supporting', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-sequence-subsequence-dp'),
      d('p1', 'baseline'),
    ],
    { 'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'] },
  ),
  'abc214-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-inclusion-exclusion'),
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p1', 'problem_specific'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'],
    },
  ),
  'abc214-h': decision(
    'outcome-condense-and-order-directed-graph',
    [
      d('t0', 'primary', 'tag-directed-condensation-toposort'),
      d('t1', 'supporting', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p1', 'supporting', 'tag-flow-matching-cut'),
    ],
    { 'tag-flow-matching-cut': ['outcome-reduce-selection-to-network-optimization'] },
    ['outcome-model-min-cost-flow'],
  ),
  'abc215-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'supporting', 'tag-subset-bitmask-transform'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'supporting', 'tag-subset-bitmask-transform'),
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc215-f': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-two-pointers-window'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d('p1', 'supporting', 'tag-two-pointers-window'),
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc215-g': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc215-h': decision(
    'outcome-characterize-bipartite-feasibility-by-hall',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'supporting', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'supporting', 'tag-subset-bitmask-transform'),
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc216-e': decision(
    'outcome-allocate-by-convex-marginal-costs',
    [
      d('t0', 'primary', 'tag-discrete-convex-marginal'),
      d('t0', 'supporting', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-integer-boundary-blocks'),
      d('p0', 'supporting', 'tag-monotone-threshold-search'),
      d('p1', 'supporting', 'tag-integer-boundary-blocks'),
    ],
    {
      'tag-integer-boundary-blocks': ['outcome-evaluate-compressed-integer-blocks'],
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc216-f': decision(
    'outcome-design-resource-dp',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-knapsack-resource'),
      d('p0', 'supporting', 'tag-contribution-reordering'),
      d('p1', 'same_tag', 'tag-knapsack-resource'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc216-g': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'supporting', 'tag-prefix-difference'),
      d('t1', 'primary', 'tag-shortest-path'),
      d('p0', 'supporting', 'tag-prefix-difference'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    { 'tag-prefix-difference': ['outcome-linearize-static-range-information'] },
  ),
  'abc216-h': decision(
    'outcome-count-combinatorial-objects-by-determinant',
    [
      d('t0', 'primary', 'tag-determinant-counting'),
      d('t1', 'supporting', 'tag-subset-bitmask-transform'),
      d('t1', 'same_tag', 'tag-determinant-counting'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-determinant-counting'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc217-e': decision(
    'outcome-bound-total-work',
    [
      d('t0', 'supporting', 'tag-ordered-set-heap'),
      d('t1', 'primary', 'tag-amortized-heavy-light'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc217-f': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc217-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc217-h': decision(
    'outcome-exploit-convexity',
    [
      d('t0', 'primary', 'tag-discrete-convex-marginal'),
      d('t1', 'same_tag', 'tag-discrete-convex-marginal'),
      d('p0', 'same_tag', 'tag-discrete-convex-marginal'),
    ],
    {},
  ),
  'abc218-e': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-spanning-tree-optimization'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
    },
  ),
  'abc218-f': decision(
    'outcome-localize-change-impact-by-witness',
    [
      d('t0', 'primary', 'tag-shortest-path-certificate', 'tag-witness-impact-localization'),
      d('t1', 'supporting', 'tag-shortest-path'),
      d('p0', 'supporting', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-witness-impact-localization'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
    ['outcome-build-shortest-path-certificate'],
  ),
  'abc218-g': decision(
    'outcome-share-or-revert-versions',
    [
      d('t0', 'primary', 'tag-persistent-rollback'),
      d('t1', 'supporting', 'tag-game-value-dp'),
      d('p0', 'supporting', 'tag-game-value-dp', 'tag-ordered-set-heap'),
    ],
    {
      'tag-game-value-dp': ['outcome-evaluate-adversarial-game-value'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc218-h': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'supporting', 'tag-symmetry-invariant-normalization'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-linked-list-index', 'tag-ordered-set-heap'),
      d('p0', 'supporting', 'tag-linked-list-index', 'tag-ordered-set-heap'),
    ],
    {
      'tag-linked-list-index': ['outcome-maintain-local-sequence-links'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc219-e': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'primary', 'tag-subset-bitmask-transform'),
      d('t1', 'baseline'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc219-f': decision(
    'outcome-normalize-equivalent-states',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p0', 'same_tag', 'tag-symmetry-invariant-normalization'),
    ],
    {},
  ),
  'abc219-g': decision(
    'outcome-bound-total-work',
    [
      d('t0', 'primary', 'tag-amortized-heavy-light'),
      d('t1', 'same_tag', 'tag-amortized-heavy-light'),
      d('p0', 'same_tag', 'tag-amortized-heavy-light'),
    ],
    {},
  ),
  'abc219-h': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'supporting', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-contribution-reordering'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc220-e': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('t1', 'supporting', 'tag-implicit-binary-tree-arithmetic'),
      d('p0', 'supporting', 'tag-implicit-binary-tree-arithmetic', 'tag-modular-arithmetic'),
    ],
    {
      'tag-implicit-binary-tree-arithmetic': ['outcome-count-implicit-binary-tree-layers'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc220-f': decision(
    'outcome-reroot-tree-aggregation',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    {},
  ),
  'abc220-g': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc220-h': decision(
    'outcome-split-enumeration-space',
    [
      d('t0', 'primary', 'tag-divide-enumerate'),
      d('t1', 'supporting', 'tag-separable-linear-transform'),
      d('p0', 'same_tag', 'tag-divide-enumerate'),
      d('p0', 'supporting', 'tag-separable-linear-transform'),
    ],
    { 'tag-separable-linear-transform': ['outcome-factor-separable-linear-transform'] },
  ),
  'abc221-e': decision(
    'outcome-maintain-weighted-prefix-statistics',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-fenwick-weighted-prefix'),
      d('t1', 'supporting', 'tag-coordinate-compression'),
      d('p0', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d(
        'p0',
        'supporting',
        'tag-contribution-reordering',
        'tag-coordinate-compression',
        'tag-modular-arithmetic',
      ),
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc221-f': decision(
    'outcome-use-tree-diameter-extrema',
    [
      d('t0', 'primary', 'tag-tree-metric-diameter'),
      d('t1', 'supporting', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-tree-metric-diameter'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc221-g': decision(
    'outcome-accelerate-set-operations-with-bitsets',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-bitset-word-parallel'),
      d('t1', 'supporting', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-bitset-word-parallel'),
      d('p0', 'supporting', 'tag-constructive-witness', 'tag-geometry-orientation-transform'),
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
    },
  ),
  'abc221-h': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p0', 'supporting', 'tag-grid-table-dp'),
    ],
    { 'tag-grid-table-dp': ['outcome-design-grid-table-dp'] },
  ),
  'abc222-e': decision(
    'outcome-design-resource-dp',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-knapsack-resource'),
      d('p0', 'baseline'),
      d('p1', 'same_tag', 'tag-knapsack-resource'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc222-f': decision(
    'outcome-use-tree-diameter-extrema',
    [
      d('t0', 'same_tag', 'tag-tree-metric-diameter'),
      d('t1', 'primary', 'tag-tree-metric-diameter'),
      d('p0', 'same_tag', 'tag-tree-metric-diameter'),
      d('p1', 'same_tag', 'tag-tree-metric-diameter'),
    ],
    {},
  ),
  'abc222-g': decision(
    'outcome-find-period-by-multiplicative-order',
    [
      d('t0', 'primary', 'tag-cyclic-group-order'),
      d('t1', 'supporting', 'tag-prime-divisor-decomposition'),
      d('t2', 'supporting', 'tag-gcd-structure'),
      d('p0', 'same_tag', 'tag-cyclic-group-order'),
      d('p0', 'supporting', 'tag-gcd-structure', 'tag-prime-divisor-decomposition'),
    ],
    {
      'tag-gcd-structure': ['outcome-reduce-integer-structure-by-gcd'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc222-h': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'same_tag', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t2', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc223-e': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc223-f': decision(
    'outcome-design-associative-range-summary',
    [
      d('t0', 'same_tag', 'tag-monoid-segment-tree'),
      d('t1', 'primary', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-monoid-segment-tree'),
      d('p1', 'same_tag', 'tag-monoid-segment-tree'),
    ],
    {},
  ),
  'abc223-g': decision(
    'outcome-reroot-tree-aggregation',
    [
      d('t0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('t1', 'primary', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p1', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    {},
  ),
  'abc223-h': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'primary', 'tag-linear-algebra-xor'),
      d('t1', 'same_tag', 'tag-linear-algebra-xor'),
      d('t1', 'supporting', 'tag-event-sweep'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'supporting', 'tag-event-sweep'),
    ],
    { 'tag-event-sweep': ['outcome-linearize-events'] },
  ),
  'abc224-e': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'supporting', 'tag-event-sweep'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('p0', 'supporting', 'tag-dag-topological-processing'),
      d('p1', 'same_tag', 'tag-dp-transition-acceleration'),
    ],
    {
      'tag-dag-topological-processing': ['outcome-process-dag-in-topological-order'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc224-f': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p1', 'same_tag', 'tag-contribution-reordering'),
    ],
    {},
  ),
  'abc224-g': decision(
    'outcome-exploit-convexity',
    [
      d('t0', 'primary', 'tag-discrete-convex-marginal'),
      d('t1', 'same_tag', 'tag-discrete-convex-marginal'),
      d('p0', 'same_tag', 'tag-discrete-convex-marginal'),
    ],
    {},
  ),
  'abc224-h': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'same_tag', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc225-e': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
      d('p1', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc225-f': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-sequence-subsequence-dp'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
      d('p1', 'supporting', 'tag-sequence-subsequence-dp'),
    ],
    { 'tag-sequence-subsequence-dp': ['outcome-design-order-preserving-dp'] },
  ),
  'abc225-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'same_tag', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc225-h': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'same_tag', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc226-e': decision(
    'outcome-peel-graph-core',
    [
      d('t0', 'primary', 'tag-graph-core-peeling'),
      d('t1', 'same_tag', 'tag-graph-core-peeling'),
      d('p0', 'same_tag', 'tag-graph-core-peeling'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc226-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc226-g': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'same_tag', 'tag-greedy-exchange-order'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    {},
  ),
  'abc226-h': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('t1', 'primary', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p1', 'same_tag', 'tag-stochastic-expectation-dp'),
    ],
    {},
  ),
  'abc227-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'supporting', 'tag-greedy-exchange-order'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'supporting', 'tag-greedy-exchange-order'),
      d('p1', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    { 'tag-greedy-exchange-order': ['outcome-prove-greedy-order'] },
  ),
  'abc227-f': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      d('t0', 'primary', 'tag-bounded-enumeration'),
      d('t1', 'supporting', 'tag-grid-table-dp'),
      d('p0', 'supporting', 'tag-grid-table-dp'),
      d('p1', 'same_tag', 'tag-bounded-enumeration'),
    ],
    { 'tag-grid-table-dp': ['outcome-design-grid-table-dp'] },
  ),
  'abc227-g': decision(
    'outcome-decompose-by-prime-or-divisor',
    [
      d('t0', 'primary', 'tag-prime-divisor-decomposition'),
      d('t1', 'same_tag', 'tag-prime-divisor-decomposition'),
      d('p0', 'same_tag', 'tag-prime-divisor-decomposition'),
      d('p1', 'same_tag', 'tag-prime-divisor-decomposition'),
    ],
    {},
  ),
  'abc227-h': decision(
    'outcome-characterize-walk-by-degrees',
    [
      d('t0', 'primary', 'tag-euler-degree-parity'),
      d('t1', 'primary', 'tag-max-flow-min-cut'),
      d('t2', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-euler-degree-parity'),
      d('p1', 'same_tag', 'tag-max-flow-min-cut'),
      d('p2', 'supporting', 'tag-bounded-enumeration'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
    },
    ['outcome-model-max-flow-min-cut'],
  ),
  'abc228-e': decision(
    'outcome-exploit-modular-periodicity',
    [
      d('t0', 'primary', 'tag-modular-crt'),
      d('t0', 'primary', 'tag-modular-arithmetic'),
      d('t1', 'primary', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-modular-arithmetic'),
      d('p1', 'same_tag', 'tag-modular-crt'),
    ],
    {},
    ['outcome-compute-in-modular-arithmetic'],
  ),
  'abc228-f': decision(
    'outcome-prune-dominated-candidates-once',
    [
      d('t0', 'problem_specific'),
      d('t1', 'supporting', 'tag-prefix-difference'),
      d('t2', 'primary', 'tag-monotone-stack-queue'),
      d('p0', 'supporting', 'tag-prefix-difference'),
      d('p1', 'same_tag', 'tag-monotone-stack-queue'),
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc228-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-subset-bitmask-transform'),
      d('t2', 'same_tag', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
      d('p1', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc228-h': decision(
    'outcome-optimize-by-line-envelope',
    [
      d('t0', 'supporting', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-interval-partition-dp'),
      d('t2', 'primary', 'tag-convex-hull-trick'),
      d('p0', 'supporting', 'tag-greedy-exchange-order'),
      d('p1', 'supporting', 'tag-interval-partition-dp'),
      d('p1', 'same_tag', 'tag-convex-hull-trick'),
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-interval-partition-dp': ['outcome-design-interval-split-dp'],
    },
  ),
  'abc229-e': decision(
    'outcome-reverse-update-time',
    [
      d('t0', 'primary', 'tag-reverse-offline'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc229-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'same_tag', 'tag-dp-state-equivalence'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc229-g': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'problem_specific'),
      d('t1', 'supporting', 'tag-discrete-convex-marginal'),
      d('t2', 'primary', 'tag-monotone-threshold-search'),
      d('p0', 'supporting', 'tag-discrete-convex-marginal'),
    ],
    {
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
    },
  ),
  'abc229-h': decision(
    'outcome-evaluate-adversarial-game-value',
    [
      d('t0', 'same_tag', 'tag-game-value-dp'),
      d('t1', 'primary', 'tag-game-value-dp'),
      d('p0', 'same_tag', 'tag-game-value-dp'),
    ],
    {},
  ),
  'abc230-e': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      d('t0', 'primary', 'tag-integer-boundary-blocks'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
    ],
    {},
  ),
  'abc230-f': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-interval-partition-dp'),
      d('p0', 'baseline'),
    ],
    {},
  ),
  'abc230-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-inclusion-exclusion'),
      d('t1', 'supporting', 'tag-prime-divisor-decomposition'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-prime-divisor-decomposition'),
    ],
    { 'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'] },
  ),
  'abc230-h': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-divide-enumerate'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'supporting', 'tag-divide-enumerate'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc231-e': decision(
    'outcome-design-carry-or-mixed-radix-dp',
    [
      d('t0', 'primary', 'tag-carry-mixed-radix-dp'),
      d('p0', 'same_tag', 'tag-carry-mixed-radix-dp'),
    ],
    {},
  ),
  'abc231-f': decision(
    'outcome-linearize-events',
    [
      d('t0', 'primary', 'tag-event-sweep'),
      d('t1', 'supporting', 'tag-fenwick-weighted-prefix'),
      d('t1', 'supporting', 'tag-coordinate-compression'),
      d('p0', 'same_tag', 'tag-event-sweep'),
      d('p0', 'supporting', 'tag-coordinate-compression', 'tag-fenwick-weighted-prefix'),
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc231-g': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
    ],
    {},
  ),
  'abc231-h': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'same_tag', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc232-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc232-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc232-g': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('t1', 'supporting', 'tag-coordinate-compression'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p0', 'supporting', 'tag-coordinate-compression'),
    ],
    { 'tag-coordinate-compression': ['outcome-compress-sparse-keys'] },
  ),
  'abc232-h': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'supporting', 'tag-symmetry-invariant-normalization'),
      d('p0', 'supporting', 'tag-symmetry-invariant-normalization'),
    ],
    { 'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'] },
  ),
  'abc233-e': decision(
    'outcome-reorder-counting-contributions',
    [d('t0', 'primary', 'tag-contribution-reordering'), d('p0', 'baseline')],
    {},
  ),
  'abc233-ex': decision(
    'outcome-share-threshold-checks-by-parallel-binary-search',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-parallel-binary-search'),
      d('t1', 'supporting', 'tag-fenwick-weighted-prefix', 'tag-event-sweep'),
      d(
        'p0',
        'supporting',
        'tag-geometry-orientation-transform',
        'tag-fenwick-weighted-prefix',
        'tag-prefix-difference',
      ),
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc233-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc233-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-prefix-difference'),
    ],
    { 'tag-prefix-difference': ['outcome-linearize-static-range-information'] },
  ),
  'abc234-e': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [d('t0', 'primary', 'tag-bounded-enumeration'), d('p0', 'baseline')],
    {},
  ),
  'abc234-ex': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc234-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'primary', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc234-g': decision(
    'outcome-prune-dominated-candidates-once',
    [
      d('t0', 'primary', 'tag-monotone-stack-queue'),
      d('t1', 'supporting', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-monotone-stack-queue'),
    ],
    { 'tag-interval-partition-dp': ['outcome-design-prefix-partition-dp'] },
  ),
  'abc235-e': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      d('t0', 'primary', 'tag-spanning-tree-optimization'),
      d('t0', 'supporting', 'tag-event-sweep'),
      d('p0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc235-ex': decision(
    'outcome-build-component-merge-tree',
    [
      d('t0', 'primary', 'tag-dsu-merge-tree'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-dsu-merge-tree', 'tag-convolution-fps'),
    ],
    {},
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc235-f': decision(
    'outcome-count-prefix-constrained-objects',
    [
      d('t0', 'primary', 'tag-digit-dp'),
      d('t1', 'primary', 'tag-digit-dp'),
      d('p0', 'same_tag', 'tag-digit-dp'),
    ],
    {},
  ),
  'abc235-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-inclusion-exclusion'),
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-dp-transition-acceleration'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d(
        'p0',
        'supporting',
        'tag-dp-transition-acceleration',
        'tag-combinatorial-coefficients',
        'tag-modular-arithmetic',
      ),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc236-e': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'supporting', 'tag-dp-state-equivalence'),
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc236-ex': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-inclusion-exclusion'),
      d('t1', 'supporting', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-subset-bitmask-transform'),
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc236-f': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'supporting', 'tag-linear-algebra-xor'),
      d('t1', 'primary', 'tag-matroid-greedy'),
      d('p0', 'supporting', 'tag-linear-algebra-xor'),
    ],
    { 'tag-linear-algebra-xor': ['outcome-maintain-xor-linear-basis'] },
  ),
  'abc236-g': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'primary', 'tag-linear-recurrence-matrix'),
      d('t1', 'same_tag', 'tag-linear-recurrence-matrix'),
      d('p0', 'same_tag', 'tag-linear-recurrence-matrix'),
    ],
    {},
  ),
  'abc237-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'primary', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc237-ex': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'same_tag', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc237-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t0', 'supporting', 'tag-sequence-subsequence-dp'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'supporting', 'tag-sequence-subsequence-dp'),
    ],
    { 'tag-sequence-subsequence-dp': ['outcome-design-lis-frontier'] },
  ),
  'abc237-g': decision(
    'outcome-design-range-update-action',
    [
      d('t0', 'same_tag', 'tag-lazy-segment-action'),
      d('t1', 'primary', 'tag-lazy-segment-action'),
      d('p0', 'same_tag', 'tag-lazy-segment-action'),
    ],
    {},
  ),
  'abc238-e': decision(
    'outcome-maintain-connectivity-components',
    [
      d('t0', 'supporting', 'tag-prefix-difference'),
      d('t1', 'primary', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-dsu-connectivity'),
      d('p0', 'supporting', 'tag-prefix-difference'),
    ],
    { 'tag-prefix-difference': ['outcome-linearize-static-range-information'] },
  ),
  'abc238-ex': decision(
    'outcome-reverse-update-time',
    [
      d('t0', 'primary', 'tag-reverse-offline'),
      d('t1', 'supporting', 'tag-interval-partition-dp', 'tag-combinatorial-coefficients'),
      d('t2', 'supporting', 'tag-contribution-reordering', 'tag-modular-arithmetic'),
      d('p0', 'supporting', 'tag-interval-partition-dp', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-interval-partition-dp': ['outcome-design-interval-split-dp'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc238-f': decision(
    'outcome-design-order-preserving-dp',
    [
      d('t0', 'primary', 'tag-sequence-subsequence-dp'),
      d('t1', 'primary', 'tag-sequence-subsequence-dp'),
      d('p0', 'same_tag', 'tag-sequence-subsequence-dp'),
    ],
    {},
  ),
  'abc238-g': decision(
    'outcome-compare-algebraic-objects-by-random-fingerprint',
    [
      d('t0', 'primary', 'tag-randomized-algebraic-fingerprint'),
      d('t0', 'supporting', 'tag-prime-divisor-decomposition'),
      d('t1', 'same_tag', 'tag-randomized-algebraic-fingerprint'),
      d('p0', 'same_tag', 'tag-randomized-algebraic-fingerprint'),
      d('p0', 'supporting', 'tag-prime-divisor-decomposition'),
    ],
    { 'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'] },
  ),
  'abc239-e': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    {},
  ),
  'abc239-ex': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      d('t0', 'primary', 'tag-integer-boundary-blocks'),
      d('t1', 'supporting', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
      d('p0', 'supporting', 'tag-stochastic-expectation-dp', 'tag-modular-arithmetic'),
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-stochastic-expectation-dp': ['outcome-solve-stochastic-recurrence'],
    },
  ),
  'abc239-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t0', 'supporting', 'tag-dsu-connectivity'),
      d('t1', 'primary', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-constructive-witness'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc239-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc240-e': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'supporting', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'supporting', 'tag-constructive-witness'),
    ],
    { 'tag-constructive-witness': ['outcome-recover-valid-witness'] },
  ),
  'abc240-ex': decision(
    'outcome-design-order-preserving-dp',
    [
      d('t0', 'primary', 'tag-sequence-subsequence-dp'),
      d('t0', 'supporting', 'tag-event-sweep', 'tag-monoid-segment-tree'),
      d('t1', 'supporting', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d(
        'p0',
        'supporting',
        'tag-trie-prefix',
        'tag-monoid-segment-tree',
        'tag-greedy-exchange-order',
      ),
      d('p0', 'same_tag', 'tag-sequence-subsequence-dp'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
      'tag-trie-prefix': ['outcome-index-shared-prefixes-with-trie'],
    },
  ),
  'abc240-f': decision(
    'outcome-evaluate-compressed-integer-blocks',
    [
      d('t0', 'primary', 'tag-integer-boundary-blocks'),
      d('t1', 'supporting', 'tag-discrete-convex-marginal'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
      d('p0', 'supporting', 'tag-discrete-convex-marginal'),
    ],
    { 'tag-discrete-convex-marginal': ['outcome-exploit-convexity'] },
  ),
  'abc240-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc241-e': decision(
    'outcome-decompose-functional-graph',
    [
      d('t0', 'primary', 'tag-functional-graph-doubling'),
      d('t1', 'same_tag', 'tag-functional-graph-doubling'),
      d('p0', 'same_tag', 'tag-functional-graph-doubling'),
    ],
    {},
  ),
  'abc241-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc241-f': decision(
    'outcome-select-state-graph-search',
    [
      d('t0', 'primary', 'tag-reachability-bfs'),
      d('t1', 'baseline'),
      d('p0', 'same_tag', 'tag-reachability-bfs'),
    ],
    {},
  ),
  'abc241-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'same_tag', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc242-e': decision(
    'outcome-normalize-equivalent-states',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p0', 'same_tag', 'tag-symmetry-invariant-normalization'),
    ],
    {},
  ),
  'abc242-ex': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'supporting', 'tag-sequence-subsequence-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d(
        'p0',
        'supporting',
        'tag-sequence-subsequence-dp',
        'tag-modular-arithmetic',
        'tag-combinatorial-coefficients',
      ),
    ],
    {
      'tag-sequence-subsequence-dp': ['outcome-design-order-preserving-dp'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
  ),
  'abc242-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'primary', 'tag-inclusion-exclusion'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc242-g': decision(
    'outcome-schedule-range-query-updates',
    [
      d('t0', 'primary', 'tag-mo-offline-range'),
      d('t1', 'same_tag', 'tag-mo-offline-range'),
      d('p0', 'same_tag', 'tag-mo-offline-range'),
    ],
    {},
  ),
  'abc243-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('t1', 'supporting', 'tag-witness-impact-localization'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p0', 'supporting', 'tag-witness-impact-localization'),
    ],
    {
      'tag-witness-impact-localization': ['outcome-localize-change-impact-by-witness'],
    },
  ),
  'abc243-ex': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-shortest-path'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-shortest-path'),
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc243-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'primary', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc243-g': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'primary', 'tag-dp-transition-acceleration'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p0', 'supporting', 'tag-integer-boundary-blocks'),
    ],
    { 'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'] },
  ),
  'abc244-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc244-ex': decision(
    'outcome-optimize-by-line-envelope',
    [
      d('t0', 'primary', 'tag-convex-hull-trick'),
      d('t0', 'supporting', 'tag-convex-hull-halfplane'),
      d('t1', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'supporting', 'tag-convex-hull-halfplane'),
      d('p0', 'supporting', 'tag-monoid-segment-tree'),
    ],
    {
      'tag-convex-hull-halfplane': ['outcome-restrict-geometric-candidates-to-boundary'],
      'tag-monoid-segment-tree': ['outcome-decompose-ranges-into-segment-tree-nodes'],
    },
  ),
  'abc244-f': decision(
    'outcome-select-state-graph-search',
    [
      d('t0', 'primary', 'tag-reachability-bfs'),
      d('t1', 'primary', 'tag-reachability-bfs'),
      d('p0', 'same_tag', 'tag-reachability-bfs'),
    ],
    {},
  ),
  'abc244-g': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'primary', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-constructive-witness'),
    ],
    {},
  ),
  'abc245-e': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'supporting', 'tag-ordered-set-heap', 'tag-event-sweep'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
      d('p1', 'supporting', 'tag-event-sweep'),
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc245-ex': decision(
    'outcome-solve-modular-constraints',
    [
      d('t0', 'primary', 'tag-modular-crt'),
      d('t1', 'supporting', 'tag-prime-divisor-decomposition'),
      d('t2', 'supporting', 'tag-linear-recurrence-matrix', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-modular-crt'),
      d('p0', 'supporting', 'tag-prime-divisor-decomposition'),
      d('p1', 'supporting', 'tag-prime-divisor-decomposition'),
      d('p2', 'supporting', 'tag-linear-recurrence-matrix', 'tag-modular-arithmetic'),
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc245-f': decision(
    'outcome-condense-and-order-directed-graph',
    [
      d('t0', 'primary', 'tag-directed-condensation-toposort'),
      d('t1', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p0', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p1', 'same_tag', 'tag-directed-condensation-toposort'),
    ],
    {},
  ),
  'abc245-g': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc246-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc246-ex': decision(
    'outcome-design-associative-range-summary',
    [
      d('t0', 'same_tag', 'tag-monoid-segment-tree'),
      d('t1', 'primary', 'tag-monoid-segment-tree'),
      d('p0', 'supporting', 'tag-sequence-subsequence-dp'),
      d('p1', 'same_tag', 'tag-monoid-segment-tree'),
      d('p2', 'same_tag', 'tag-monoid-segment-tree'),
    ],
    { 'tag-sequence-subsequence-dp': ['outcome-design-order-preserving-dp'] },
  ),
  'abc246-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-inclusion-exclusion'),
      d('t1', 'supporting', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p1', 'supporting', 'tag-subset-bitmask-transform'),
      d('p2', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc246-g': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d('p1', 'supporting', 'tag-tree-aggregation-reroot'),
      d('p2', 'same_tag', 'tag-monotone-threshold-search'),
    ],
    { 'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'] },
  ),
  'abc247-e': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p1', 'same_tag', 'tag-contribution-reordering'),
    ],
    {},
  ),
  'abc247-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'supporting', 'tag-functional-graph-doubling'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t2', 'same_tag', 'tag-convolution-fps'),
      d('t2', 'supporting', 'tag-divide-enumerate'),
      d('p0', 'supporting', 'tag-functional-graph-doubling'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
      d('p2', 'same_tag', 'tag-convolution-fps'),
    ],
    {
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
      'tag-functional-graph-doubling': ['outcome-decompose-functional-graph'],
    },
  ),
  'abc247-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'problem_specific'),
      d('p2', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc247-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'same_tag', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'same_tag', 'tag-flow-matching-cut'),
      d('p2', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc248-e': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p2', 'baseline'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc248-ex': decision(
    'outcome-prune-dominated-candidates-once',
    [
      d('t0', 'primary', 'tag-monotone-stack-queue'),
      d('t1', 'supporting', 'tag-lazy-segment-action'),
      d('p0', 'same_tag', 'tag-monotone-stack-queue'),
      d('p1', 'supporting', 'tag-lazy-segment-action'),
      d('p2', 'supporting', 'tag-monoid-segment-tree'),
    ],
    {
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc248-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc248-g': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'supporting', 'tag-gcd-diophantine'),
      d('t1', 'primary', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p1', 'supporting', 'tag-gcd-diophantine'),
      d('p2', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    { 'tag-gcd-diophantine': ['outcome-reduce-integer-structure-by-gcd'] },
  ),
  'abc249-e': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p1', 'same_tag', 'tag-dp-transition-acceleration'),
    ],
    {},
  ),
  'abc249-ex': decision(
    'outcome-decompose-expectation-by-additive-potential',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'primary', 'tag-symmetry-invariant-normalization'),
      d('p0', 'supporting', 'tag-stochastic-expectation-dp'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients', 'tag-convolution-fps'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-compute-convolution-or-correlation'],
      'tag-stochastic-expectation-dp': ['outcome-solve-stochastic-recurrence'],
    },
  ),
  'abc249-f': decision(
    'outcome-reverse-update-time',
    [
      d('t0', 'primary', 'tag-reverse-offline'),
      d('t1', 'supporting', 'tag-ordered-set-heap'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
      d('p1', 'same_tag', 'tag-reverse-offline'),
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc249-g': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'primary', 'tag-linear-algebra-xor'),
      d('t1', 'problem_specific'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'problem_specific'),
    ],
    {},
  ),
  'abc250-e': decision(
    'outcome-normalize-equivalent-states',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p0', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc250-ex': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'primary', 'tag-kruskal-threshold-sweep'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('t1', 'supporting', 'tag-event-sweep'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'supporting', 'tag-dsu-connectivity'),
      d('p1', 'supporting', 'tag-event-sweep'),
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
    ['outcome-sweep-connectivity-by-kruskal-threshold'],
  ),
  'abc250-f': decision(
    'outcome-maintain-monotone-window',
    [
      d('t0', 'primary', 'tag-two-pointers-window'),
      d('t1', 'supporting', 'tag-geometry-orientation-transform'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
      d('p1', 'same_tag', 'tag-two-pointers-window'),
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc250-g': decision(
    'outcome-exploit-convexity',
    [
      d('t0', 'primary', 'tag-discrete-convex-marginal'),
      d('t1', 'supporting', 'tag-ordered-set-heap'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
      d('p1', 'same_tag', 'tag-discrete-convex-marginal'),
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc251-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc251-ex': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'primary', 'tag-linear-recurrence-matrix'),
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-integer-boundary-blocks'),
      d('p0', 'same_tag', 'tag-linear-recurrence-matrix'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'supporting', 'tag-integer-boundary-blocks'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-integer-boundary-blocks': ['outcome-evaluate-compressed-integer-blocks'],
    },
  ),
  'abc251-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'primary', 'tag-constructive-witness'),
      d('p0', 'baseline'),
      d('p1', 'same_tag', 'tag-constructive-witness'),
    ],
    {},
  ),
  'abc251-g': decision(
    'outcome-represent-convex-intersection-by-halfplanes',
    [
      d('t0', 'primary', 'tag-convex-hull-halfplane'),
      d('t1', 'primary', 'tag-convex-hull-halfplane'),
      d('p0', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p1', 'same_tag', 'tag-convex-hull-halfplane'),
    ],
    {},
  ),
  'abc252-e': decision(
    'outcome-build-shortest-path-certificate',
    [
      d('t0', 'primary', 'tag-shortest-path-certificate'),
      d('t1', 'supporting', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path-certificate'),
      d('p0', 'supporting', 'tag-shortest-path'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc252-ex': decision(
    'outcome-split-enumeration-space',
    [
      d('t0', 'primary', 'tag-divide-enumerate'),
      d('t1', 'supporting', 'tag-binary-trie'),
      d('p0', 'supporting', 'tag-binary-trie'),
      d('p1', 'same_tag', 'tag-divide-enumerate'),
    ],
    { 'tag-binary-trie': ['outcome-query-bitwise-order-with-trie'] },
  ),
  'abc252-f': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t0', 'supporting', 'tag-ordered-set-heap'),
      d('t1', 'problem_specific'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
      d('p1', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc252-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p1', 'same_tag', 'tag-interval-partition-dp'),
    ],
    {},
  ),
  'abc253-e': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'primary', 'tag-dp-transition-acceleration'),
      d('t1', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc253-ex': decision(
    'outcome-count-combinatorial-objects-by-determinant',
    [
      d('t0', 'primary', 'tag-determinant-counting'),
      d('t1', 'supporting', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-determinant-counting'),
      d('p1', 'supporting', 'tag-subset-bitmask-transform'),
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc253-f': decision(
    'outcome-reverse-update-time',
    [
      d('t0', 'primary', 'tag-reverse-offline'),
      d('t1', 'supporting', 'tag-prefix-difference', 'tag-fenwick-weighted-prefix'),
      d('p0', 'supporting', 'tag-prefix-difference', 'tag-fenwick-weighted-prefix'),
      d('p1', 'same_tag', 'tag-reverse-offline'),
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc253-g': decision(
    'outcome-evaluate-compressed-integer-blocks',
    [
      d('t0', 'primary', 'tag-integer-boundary-blocks'),
      d('t1', 'problem_specific'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
      d('p1', 'problem_specific'),
    ],
    {},
  ),
  'abc254-e': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      d('t0', 'primary', 'tag-bounded-enumeration'),
      d('t1', 'baseline'),
      d('p0', 'baseline'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc254-ex': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'same_tag', 'tag-greedy-exchange-order'),
      d('t0', 'supporting', 'tag-binary-trie'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('p0', 'problem_specific'),
      d('p1', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    { 'tag-binary-trie': ['outcome-query-bitwise-order-with-trie'] },
  ),
  'abc254-f': decision(
    'outcome-reduce-integer-structure-by-gcd',
    [
      d('t0', 'primary', 'tag-gcd-diophantine'),
      d('t1', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-gcd-diophantine'),
      d('p1', 'supporting', 'tag-monoid-segment-tree'),
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
  'abc254-g': decision(
    'outcome-jump-deterministic-transition',
    [
      d('t0', 'supporting', 'tag-event-sweep'),
      d('t1', 'primary', 'tag-functional-graph-doubling'),
      d('p0', 'supporting', 'tag-coordinate-compression', 'tag-event-sweep'),
      d('p1', 'same_tag', 'tag-functional-graph-doubling'),
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc255-e': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-contribution-reordering'),
      d('p0', 'problem_specific'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc255-ex': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      d('t0', 'primary', 'tag-ordered-set-heap'),
      d('t1', 'supporting', 'tag-amortized-heavy-light'),
      d('p0', 'same_tag', 'tag-ordered-set-heap'),
      d('p1', 'supporting', 'tag-amortized-heavy-light'),
    ],
    { 'tag-amortized-heavy-light': ['outcome-bound-total-work'] },
  ),
  'abc255-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'same_tag', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-constructive-witness'),
      d('p1', 'same_tag', 'tag-constructive-witness'),
    ],
    {},
  ),
  'abc255-g': decision(
    'outcome-classify-game-states',
    [
      d('t0', 'primary', 'tag-game-grundy-dp'),
      d('t1', 'same_tag', 'tag-game-grundy-dp'),
      d('t2', 'same_tag', 'tag-game-grundy-dp'),
      d('p0', 'same_tag', 'tag-game-grundy-dp'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc256-e': decision(
    'outcome-decompose-functional-graph',
    [
      d('t0', 'primary', 'tag-functional-graph-doubling'),
      d('t1', 'same_tag', 'tag-functional-graph-doubling'),
      d('p0', 'same_tag', 'tag-functional-graph-doubling'),
      d('p1', 'same_tag', 'tag-functional-graph-doubling'),
    ],
    {},
  ),
  'abc256-ex': decision(
    'outcome-bound-total-work',
    [
      d('t0', 'supporting', 'tag-ordered-set-heap'),
      d('t1', 'primary', 'tag-amortized-heavy-light'),
      d('t2', 'supporting', 'tag-lazy-segment-action'),
      d('p0', 'supporting', 'tag-ordered-set-heap'),
      d('p1', 'supporting', 'tag-lazy-segment-action'),
      d('p1', 'same_tag', 'tag-amortized-heavy-light'),
    ],
    {
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc256-f': decision(
    'outcome-maintain-weighted-prefix-statistics',
    [
      d('t0', 'primary', 'tag-fenwick-weighted-prefix'),
      d('t1', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('p0', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc256-g': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'primary', 'tag-linear-recurrence-matrix'),
      d('t1', 'primary', 'tag-linear-recurrence-matrix'),
      d('t2', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-linear-recurrence-matrix'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc257-e': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'same_tag', 'tag-greedy-exchange-order'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
      d('p1', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    {},
  ),
  'abc257-ex': decision(
    'outcome-restrict-geometric-candidates-to-boundary',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-convex-hull-halfplane'),
      d('t2', 'supporting', 'tag-event-sweep'),
      d('p0', 'problem_specific'),
      d('p1', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p1', 'supporting', 'tag-event-sweep'),
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc257-f': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'primary', 'tag-shortest-path'),
      d('t2', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc257-g': decision(
    'outcome-build-prefix-match-state',
    [
      d('t0', 'primary', 'tag-prefix-matching-automata'),
      d('t1', 'supporting', 'tag-reachability-bfs'),
      d('p0', 'same_tag', 'tag-prefix-matching-automata'),
      d('p1', 'supporting', 'tag-reachability-bfs'),
    ],
    { 'tag-reachability-bfs': ['outcome-select-state-graph-search'] },
  ),
  'abc258-e': decision(
    'outcome-maintain-monotone-window',
    [
      d('t0', 'primary', 'tag-two-pointers-window'),
      d('t1', 'supporting', 'tag-functional-graph-doubling'),
      d('p0', 'same_tag', 'tag-two-pointers-window'),
      d('p1', 'supporting', 'tag-functional-graph-doubling'),
    ],
    { 'tag-functional-graph-doubling': ['outcome-decompose-functional-graph'] },
  ),
  'abc258-ex': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-linear-recurrence-matrix'),
      d('t2', 'primary', 'tag-linear-recurrence-matrix'),
      d('p0', 'problem_specific'),
      d('p1', 'same_tag', 'tag-linear-recurrence-matrix'),
    ],
    {},
  ),
  'abc258-f': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p1', 'same_tag', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc258-g': decision(
    'outcome-accelerate-set-operations-with-bitsets',
    [
      d('t0', 'primary', 'tag-bitset-word-parallel'),
      d('t1', 'supporting', 'tag-contribution-reordering'),
      d('p0', 'same_tag', 'tag-bitset-word-parallel'),
      d('p1', 'supporting', 'tag-contribution-reordering'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc259-e': decision(
    'outcome-decompose-by-prime-or-divisor',
    [
      d('t0', 'primary', 'tag-prime-divisor-decomposition'),
      d('t1', 'same_tag', 'tag-prime-divisor-decomposition'),
      d('p0', 'same_tag', 'tag-prime-divisor-decomposition'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc259-ex': decision(
    'outcome-bound-total-work',
    [
      d('t0', 'primary', 'tag-amortized-heavy-light'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('t2', 'same_tag', 'tag-amortized-heavy-light'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-amortized-heavy-light'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc259-f': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'supporting', 'tag-greedy-exchange-order'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p1', 'supporting', 'tag-greedy-exchange-order'),
    ],
    { 'tag-greedy-exchange-order': ['outcome-prove-greedy-order'] },
  ),
  'abc259-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'same_tag', 'tag-flow-matching-cut'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc260-e': decision(
    'outcome-maintain-monotone-window',
    [
      d('t0', 'primary', 'tag-two-pointers-window'),
      d('t1', 'baseline'),
      d('p0', 'same_tag', 'tag-two-pointers-window'),
    ],
    {},
  ),
  'abc260-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t0', 'supporting', 'tag-inclusion-exclusion'),
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('t2', 'primary', 'tag-convolution-fps'),
      d('t2', 'supporting', 'tag-divide-enumerate'),
      d('t2', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-inclusion-exclusion', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-apply-formal-power-series-operations'],
  ),
  'abc260-f': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      d('t0', 'primary', 'tag-bounded-enumeration'),
      d('t1', 'primary', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-bounded-enumeration'),
    ],
    {},
  ),
  'abc260-g': decision(
    'outcome-linearize-static-range-information',
    [
      d('t0', 'primary', 'tag-prefix-difference'),
      d('t1', 'same_tag', 'tag-prefix-difference'),
      d('p0', 'same_tag', 'tag-prefix-difference'),
    ],
    {},
  ),
  'abc261-e': decision(
    'outcome-design-associative-range-summary',
    [
      d('t0', 'same_tag', 'tag-monoid-segment-tree'),
      d('t1', 'primary', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-monoid-segment-tree'),
    ],
    {},
  ),
  'abc261-ex': decision(
    'outcome-evaluate-adversarial-game-value',
    [
      d('t0', 'primary', 'tag-game-value-dp'),
      d('t1', 'same_tag', 'tag-game-value-dp'),
      d('p0', 'same_tag', 'tag-game-value-dp'),
    ],
    {},
  ),
  'abc261-f': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'supporting', 'tag-fenwick-weighted-prefix'),
    ],
    { 'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'] },
  ),
  'abc261-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'supporting', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-shortest-path'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc262-e': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc262-ex': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'supporting', 'tag-lazy-segment-action'),
      d('t1', 'supporting', 'tag-contribution-reordering', 'tag-coordinate-compression'),
      d('t2', 'primary', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-lazy-segment-action'),
      d('p0', 'supporting', 'tag-coordinate-compression'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
    },
  ),
  'abc262-f': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('t2', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'supporting', 'tag-monoid-segment-tree'),
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
  'abc262-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
    ],
    {},
  ),
  'abc263-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc263-ex': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-geometry-orientation-transform'),
      d('t2', 'supporting', 'tag-event-sweep', 'tag-fenwick-weighted-prefix'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d(
        'p0',
        'supporting',
        'tag-geometry-orientation-transform',
        'tag-event-sweep',
        'tag-fenwick-weighted-prefix',
      ),
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc263-f': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    {},
  ),
  'abc263-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'same_tag', 'tag-flow-matching-cut'),
      d('t2', 'supporting', 'tag-discrete-convex-marginal'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p0', 'supporting', 'tag-discrete-convex-marginal'),
    ],
    { 'tag-discrete-convex-marginal': ['outcome-exploit-convexity'] },
  ),
  'abc264-e': decision(
    'outcome-reverse-update-time',
    [
      d('t0', 'primary', 'tag-reverse-offline'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-reverse-offline'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    { 'tag-dsu-connectivity': ['outcome-augment-components-with-metadata'] },
  ),
  'abc264-ex': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-tree-aggregation-reroot'),
      d('t2', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    {},
  ),
  'abc264-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'same_tag', 'tag-dp-state-equivalence'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc264-g': decision(
    'outcome-build-finite-string-automaton',
    [
      d('t0', 'primary', 'tag-string-automata'),
      d('t1', 'supporting', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-string-automata'),
      d('p0', 'supporting', 'tag-shortest-path'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc265-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc265-ex': decision(
    'outcome-compute-convolution-or-correlation',
    [
      d('t0', 'supporting', 'tag-game-grundy-dp', 'tag-game-value-dp'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-linear-algebra-xor'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-linear-algebra-xor'),
    ],
    {
      'tag-game-grundy-dp': ['outcome-classify-game-states'],
      'tag-game-value-dp': ['outcome-evaluate-adversarial-game-value'],
      'tag-linear-algebra-xor': [
        'outcome-transform-to-linear-system-or-rank',
        'outcome-factor-separable-linear-transform',
      ],
    },
  ),
  'abc265-f': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-dp-transition-acceleration'),
    ],
    {},
  ),
  'abc265-g': decision(
    'outcome-design-range-update-action',
    [
      d('t0', 'supporting', 'tag-monoid-segment-tree'),
      d('t1', 'primary', 'tag-lazy-segment-action'),
      d('p0', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-lazy-segment-action'),
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
  'abc266-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
    ],
    {},
  ),
  'abc266-ex': decision(
    'outcome-linearize-events',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-event-sweep'),
      d('t2', 'supporting', 'tag-coordinate-compression', 'tag-monoid-segment-tree'),
      d(
        'p0',
        'supporting',
        'tag-coordinate-compression',
        'tag-geometry-orientation-transform',
        'tag-monoid-segment-tree',
      ),
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc266-f': decision(
    'outcome-reduce-graph-by-peeling-or-kernelization',
    [
      d('t0', 'primary', 'tag-graph-core-peeling'),
      d('t1', 'same_tag', 'tag-graph-core-peeling'),
      d('p0', 'same_tag', 'tag-graph-core-peeling'),
    ],
    {},
  ),
  'abc266-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
    ],
    {},
  ),
  'abc267-e': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-amortized-monotone-progress'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
    ],
    { 'tag-amortized-monotone-progress': ['outcome-bound-monotone-total-work'] },
  ),
  'abc267-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'same_tag', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-divide-enumerate'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-divide-enumerate'),
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
  ),
  'abc267-f': decision(
    'outcome-use-tree-diameter-extrema',
    [
      d('t0', 'primary', 'tag-tree-metric-diameter'),
      d('t1', 'supporting', 'tag-tree-path-decomposition'),
      d('p0', 'same_tag', 'tag-tree-metric-diameter'),
      d('p0', 'supporting', 'tag-tree-path-decomposition'),
    ],
    { 'tag-tree-path-decomposition': ['outcome-answer-tree-ancestor-queries'] },
  ),
  'abc267-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'primary', 'tag-combinatorial-coefficients'),
      d('t1', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
    ],
    {},
  ),
  'abc268-e': decision(
    'outcome-linearize-static-range-information',
    [
      d('t0', 'primary', 'tag-prefix-difference'),
      d('t1', 'same_tag', 'tag-prefix-difference'),
      d('p0', 'same_tag', 'tag-prefix-difference'),
    ],
    {},
  ),
  'abc268-ex': decision(
    'outcome-build-suffix-lcp-index',
    [
      d('t0', 'primary', 'tag-suffix-lcp-index'),
      d('t0', 'supporting', 'tag-monoid-segment-tree'),
      d('t1', 'supporting', 'tag-event-sweep', 'tag-ordered-set-heap'),
      d('t2', 'supporting', 'tag-greedy-exchange-order'),
      d('p0', 'same_tag', 'tag-suffix-lcp-index'),
      d('p0', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'supporting', 'tag-ordered-set-heap', 'tag-greedy-exchange-order'),
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc268-f': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'same_tag', 'tag-greedy-exchange-order'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    {},
  ),
  'abc268-g': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'supporting', 'tag-trie-prefix'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'supporting', 'tag-trie-prefix'),
    ],
    { 'tag-trie-prefix': ['outcome-index-shared-prefixes-with-trie'] },
  ),
  'abc269-e': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-monotone-threshold-search'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'supporting', 'tag-interactive-protocol'),
    ],
    {
      'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'],
    },
  ),
  'abc269-ex': decision(
    'outcome-bound-total-work',
    [
      d('t0', 'supporting', 'tag-convolution-fps'),
      d('t0', 'supporting', 'tag-tree-aggregation-reroot'),
      d('t1', 'primary', 'tag-amortized-heavy-light'),
      d('t2', 'supporting', 'tag-convolution-fps'),
      d('t2', 'supporting', 'tag-divide-enumerate'),
      d('p0', 'supporting', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-amortized-heavy-light'),
    ],
    {
      'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
    },
  ),
  'abc269-f': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'baseline'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc269-g': decision(
    'outcome-design-resource-dp',
    [
      d('t0', 'primary', 'tag-knapsack-resource'),
      d('t1', 'same_tag', 'tag-knapsack-resource'),
      d('p0', 'same_tag', 'tag-knapsack-resource'),
    ],
    {},
  ),
  'abc270-e': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
    ],
    {},
  ),
  'abc270-ex': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'supporting', 'tag-linear-recurrence-matrix', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'supporting', 'tag-linear-recurrence-matrix', 'tag-modular-arithmetic'),
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc270-f': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      d('t0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('t1', 'primary', 'tag-spanning-tree-optimization'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'supporting', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
    },
  ),
  'abc270-g': decision(
    'outcome-split-enumeration-space',
    [
      d('t0', 'primary', 'tag-divide-enumerate'),
      d('t1', 'same_tag', 'tag-divide-enumerate'),
      d('t1', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-divide-enumerate'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc271-e': decision(
    'outcome-design-order-preserving-dp',
    [
      d('t0', 'primary', 'tag-sequence-subsequence-dp'),
      d('t1', 'same_tag', 'tag-sequence-subsequence-dp'),
      d('p0', 'same_tag', 'tag-sequence-subsequence-dp'),
      d('p0', 'supporting', 'tag-shortest-path'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc271-ex': decision(
    'outcome-characterize-integer-solvability',
    [
      d('t0', 'supporting', 'tag-greedy-exchange-order'),
      d('t0', 'supporting', 'tag-bounded-enumeration'),
      d('t1', 'primary', 'tag-gcd-diophantine'),
      d('p0', 'same_tag', 'tag-gcd-diophantine'),
      d('p0', 'supporting', 'tag-greedy-exchange-order'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc271-f': decision(
    'outcome-split-enumeration-space',
    [
      d('t0', 'primary', 'tag-divide-enumerate'),
      d('t1', 'same_tag', 'tag-divide-enumerate'),
      d('p0', 'same_tag', 'tag-divide-enumerate'),
    ],
    {},
  ),
  'abc271-g': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'supporting', 'tag-stochastic-expectation-dp'),
      d('t1', 'primary', 'tag-linear-recurrence-matrix'),
      d('p0', 'same_tag', 'tag-linear-recurrence-matrix'),
      d('p0', 'supporting', 'tag-stochastic-expectation-dp', 'tag-modular-arithmetic'),
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-stochastic-expectation-dp': ['outcome-solve-stochastic-recurrence'],
    },
  ),
  'abc272-e': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      d('t0', 'primary', 'tag-bounded-enumeration'),
      d('t1', 'same_tag', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-bounded-enumeration'),
    ],
    {},
  ),
  'abc272-ex': decision(
    'outcome-evaluate-and-compose-polynomials',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t0', 'supporting', 'tag-divide-enumerate'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-inclusion-exclusion'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-divide-enumerate'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc272-f': decision(
    'outcome-build-suffix-lcp-index',
    [
      d('t0', 'same_tag', 'tag-suffix-lcp-index'),
      d('t1', 'primary', 'tag-suffix-lcp-index'),
      d('p0', 'same_tag', 'tag-suffix-lcp-index'),
    ],
    {},
  ),
  'abc272-g': decision(
    'outcome-design-and-bound-randomized-algorithm',
    [
      d('t0', 'primary', 'tag-randomized-algorithm'),
      d('t1', 'supporting', 'tag-prime-divisor-decomposition'),
      d('p0', 'same_tag', 'tag-randomized-algorithm'),
      d('p0', 'supporting', 'tag-prime-divisor-decomposition'),
    ],
    { 'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'] },
  ),
  'abc273-e': decision(
    'outcome-share-or-revert-versions',
    [
      d('t0', 'primary', 'tag-persistent-rollback'),
      d('t1', 'same_tag', 'tag-persistent-rollback'),
      d('p0', 'same_tag', 'tag-persistent-rollback'),
    ],
    {},
  ),
  'abc273-ex': decision(
    'outcome-approximate-rational-by-euclid',
    [
      d('t0', 'primary', 'tag-gcd-diophantine'),
      d('t0', 'supporting', 'tag-divide-enumerate'),
      d('t1', 'supporting', 'tag-amortized-heavy-light', 'tag-ordered-set-heap'),
      d('p0', 'same_tag', 'tag-gcd-diophantine'),
      d('p0', 'supporting', 'tag-amortized-heavy-light', 'tag-ordered-set-heap'),
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc273-f': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-coordinate-compression'),
    ],
    { 'tag-coordinate-compression': ['outcome-compress-sparse-keys'] },
  ),
  'abc273-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc274-e': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'primary', 'tag-subset-bitmask-transform'),
      d('t1', 'same_tag', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc274-ex': decision(
    'outcome-compare-objects-by-fingerprint',
    [
      d('t0', 'primary', 'tag-string-hash-equality'),
      d('t1', 'same_tag', 'tag-string-hash-equality'),
      d('t1', 'primary', 'tag-finite-field-extension'),
      d('p0', 'same_tag', 'tag-string-hash-equality'),
      d('p0', 'same_tag', 'tag-finite-field-extension'),
    ],
    {},
    ['outcome-compute-in-finite-field-extension'],
  ),
  'abc274-f': decision(
    'outcome-linearize-events',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-event-sweep'),
      d('p0', 'same_tag', 'tag-event-sweep'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc274-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'supporting', 'tag-greedy-exchange-order'),
      d('t1', 'primary', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p0', 'supporting', 'tag-greedy-exchange-order'),
    ],
    { 'tag-greedy-exchange-order': ['outcome-prove-greedy-order'] },
  ),
  'abc275-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
      d('p1', 'same_tag', 'tag-stochastic-expectation-dp'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc275-ex': decision(
    'outcome-build-cartesian-tree-decomposition',
    [
      d('t0', 'primary', 'tag-cartesian-tree'),
      d('t1', 'primary', 'tag-slope-trick'),
      d('t2', 'supporting', 'tag-amortized-heavy-light', 'tag-ordered-set-heap'),
      d('p0', 'same_tag', 'tag-cartesian-tree'),
      d('p1', 'same_tag', 'tag-slope-trick'),
      d('p2', 'supporting', 'tag-amortized-heavy-light', 'tag-ordered-set-heap'),
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
    ['outcome-maintain-piecewise-linear-convex-function'],
  ),
  'abc275-f': decision(
    'outcome-design-resource-dp',
    [
      d('t0', 'primary', 'tag-knapsack-resource'),
      d('t1', 'same_tag', 'tag-knapsack-resource'),
      d('p0', 'same_tag', 'tag-knapsack-resource'),
      d('p1', 'same_tag', 'tag-knapsack-resource'),
    ],
    {},
  ),
  'abc275-g': decision(
    'outcome-restrict-geometric-candidates-to-boundary',
    [
      d('t0', 'same_tag', 'tag-convex-hull-halfplane'),
      d('t1', 'primary', 'tag-convex-hull-halfplane'),
      d('p0', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p1', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p2', 'same_tag', 'tag-convex-hull-halfplane'),
    ],
    {},
  ),
  'abc276-e': decision(
    'outcome-maintain-connectivity-components',
    [
      d('t0', 'primary', 'tag-dsu-connectivity'),
      d('t1', 'same_tag', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-dsu-connectivity'),
      d('p1', 'same_tag', 'tag-dsu-connectivity'),
    ],
    {},
  ),
  'abc276-ex': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'same_tag', 'tag-linear-algebra-xor'),
      d('t1', 'supporting', 'tag-prefix-difference'),
      d('t1', 'supporting', 'tag-coordinate-compression'),
      d('t2', 'primary', 'tag-linear-algebra-xor'),
      d('t2', 'supporting', 'tag-bitset-word-parallel'),
      d('t2', 'supporting', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'supporting', 'tag-prefix-difference'),
      d('p2', 'same_tag', 'tag-linear-algebra-xor'),
      d(
        'p2',
        'supporting',
        'tag-bitset-word-parallel',
        'tag-constructive-witness',
        'tag-prefix-difference',
      ),
    ],
    {
      'tag-bitset-word-parallel': ['outcome-accelerate-set-operations-with-bitsets'],
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc276-f': decision(
    'outcome-maintain-weighted-prefix-statistics',
    [
      d('t0', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('t1', 'primary', 'tag-fenwick-weighted-prefix'),
      d('p0', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc276-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'primary', 'tag-combinatorial-coefficients'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('t2', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-combinatorial-coefficients'),
      d('p2', 'same_tag', 'tag-combinatorial-coefficients'),
    ],
    {},
  ),
  'abc277-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc277-ex': decision(
    'outcome-encode-threshold-constraints-as-two-sat',
    [
      d('t0', 'same_tag', 'tag-directed-condensation-toposort'),
      d('t1', 'primary', 'tag-directed-condensation-toposort'),
      d('p0', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p1', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p2', 'same_tag', 'tag-directed-condensation-toposort'),
    ],
    {},
  ),
  'abc277-f': decision(
    'outcome-condense-and-order-directed-graph',
    [
      d('t0', 'primary', 'tag-directed-condensation-toposort'),
      d('t1', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p0', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p1', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p2', 'same_tag', 'tag-directed-condensation-toposort'),
    ],
    {},
  ),
  'abc277-g': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p1', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
      d('p2', 'supporting', 'tag-contribution-reordering'),
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc278-e': decision(
    'outcome-linearize-static-range-information',
    [
      d('t0', 'primary', 'tag-prefix-difference'),
      d('t1', 'same_tag', 'tag-prefix-difference'),
      d('p0', 'same_tag', 'tag-prefix-difference'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc278-ex': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'primary', 'tag-linear-algebra-xor'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('t2', 'supporting', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p2', 'supporting', 'tag-convolution-fps'),
      d('p3', 'supporting', 'tag-convolution-fps'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-compute-convolution-or-correlation'],
    },
  ),
  'abc278-f': decision(
    'outcome-classify-game-states',
    [
      d('t0', 'primary', 'tag-game-grundy-dp'),
      d('t0', 'supporting', 'tag-subset-bitmask-transform'),
      d('t1', 'same_tag', 'tag-game-grundy-dp'),
      d('p0', 'supporting', 'tag-subset-bitmask-transform'),
      d('p1', 'same_tag', 'tag-game-grundy-dp'),
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc278-g': decision(
    'outcome-classify-game-states',
    [
      d('t0', 'supporting', 'tag-symmetry-invariant-normalization'),
      d('t1', 'primary', 'tag-game-grundy-dp'),
      d('p0', 'same_tag', 'tag-game-grundy-dp'),
      d('p1', 'supporting', 'tag-symmetry-invariant-normalization'),
      d('p2', 'supporting', 'tag-interactive-protocol'),
    ],
    {
      'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'],
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc279-e': decision(
    'outcome-localize-change-impact-by-witness',
    [
      d('t0', 'primary', 'tag-witness-impact-localization'),
      d('t1', 'same_tag', 'tag-witness-impact-localization'),
      d('p0', 'same_tag', 'tag-witness-impact-localization'),
      d('p1', 'same_tag', 'tag-witness-impact-localization'),
    ],
    {},
  ),
  'abc279-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'same_tag', 'tag-convolution-fps'),
      d('t2', 'same_tag', 'tag-convolution-fps'),
      d('t2', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
      d('p2', 'same_tag', 'tag-convolution-fps'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc279-f': decision(
    'outcome-augment-components-with-metadata',
    [
      d('t0', 'primary', 'tag-dsu-connectivity'),
      d('t1', 'same_tag', 'tag-dsu-connectivity'),
      d('p0', 'same_tag', 'tag-dsu-connectivity'),
      d('p1', 'same_tag', 'tag-dsu-connectivity'),
    ],
    {},
  ),
  'abc279-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'supporting', 'tag-dp-transition-acceleration'),
      d('p2', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    { 'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'] },
  ),
  'abc280-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('t1', 'primary', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc280-ex': decision(
    'outcome-build-suffix-lcp-index',
    [
      d('t0', 'primary', 'tag-suffix-lcp-index'),
      d('t1', 'supporting', 'tag-monotone-stack-queue'),
      d('t2', 'same_tag', 'tag-suffix-lcp-index'),
      d('p0', 'same_tag', 'tag-suffix-lcp-index'),
      d('p1', 'same_tag', 'tag-suffix-lcp-index'),
      d('p2', 'supporting', 'tag-monotone-stack-queue'),
    ],
    {
      'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'],
    },
  ),
  'abc280-f': decision(
    'outcome-maintain-potential-differences',
    [
      d('t0', 'primary', 'tag-dsu-connectivity'),
      d('t1', 'same_tag', 'tag-dsu-connectivity'),
      d('p0', 'baseline'),
      d('p1', 'same_tag', 'tag-dsu-connectivity'),
    ],
    {},
  ),
  'abc280-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t1', 'supporting', 'tag-contribution-reordering'),
      d('t2', 'primary', 'tag-inclusion-exclusion'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p1', 'same_tag', 'tag-geometry-orientation-transform'),
      d('p2', 'same_tag', 'tag-inclusion-exclusion'),
      d('p2', 'supporting', 'tag-event-sweep'),
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
    ['outcome-reduce-geometry-to-algebraic-predicates'],
  ),
  'abc281-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      d('t0', 'primary', 'tag-ordered-set-heap'),
      d('t1', 'same_tag', 'tag-ordered-set-heap'),
      d('t1', 'supporting', 'tag-two-pointers-window'),
      d('p0', 'same_tag', 'tag-ordered-set-heap'),
      d('p1', 'same_tag', 'tag-ordered-set-heap'),
      d('p1', 'supporting', 'tag-two-pointers-window'),
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc281-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-divide-enumerate'),
      d('t1', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
      d('p2', 'supporting', 'tag-divide-enumerate'),
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc281-f': decision(
    'outcome-query-bitwise-order-with-trie',
    [
      d('t0', 'primary', 'tag-binary-trie'),
      d('t1', 'same_tag', 'tag-binary-trie'),
      d('p0', 'same_tag', 'tag-binary-trie'),
      d('p1', 'same_tag', 'tag-binary-trie'),
      d('p2', 'same_tag', 'tag-binary-trie'),
    ],
    {},
  ),
  'abc281-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'same_tag', 'tag-dp-state-equivalence'),
      d('t1', 'primary', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients'),
    ],
    { 'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'] },
  ),
  'abc282-e': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      d('t0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('t1', 'primary', 'tag-spanning-tree-optimization'),
      d('p0', 'same_tag', 'tag-spanning-tree-optimization'),
      d('p1', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc282-ex': decision(
    'outcome-divide-search-space-recursively',
    [
      d('t0', 'primary', 'tag-divide-enumerate'),
      d('t1', 'same_tag', 'tag-divide-enumerate'),
      d('t2', 'baseline'),
      d('p0', 'supporting', 'tag-idempotent-overlap-range-query'),
      d('p1', 'baseline'),
      d('p2', 'same_tag', 'tag-divide-enumerate'),
    ],
    { 'tag-idempotent-overlap-range-query': ['outcome-answer-idempotent-range-query'] },
  ),
  'abc282-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'same_tag', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-constructive-witness'),
      d('p1', 'supporting', 'tag-interactive-protocol'),
    ],
    { 'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'] },
  ),
  'abc282-g': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      d('t0', 'same_tag', 'tag-dp-transition-acceleration'),
      d('t1', 'primary', 'tag-dp-transition-acceleration'),
      d('t1', 'supporting', 'tag-prefix-difference'),
      d('p0', 'supporting', 'tag-dp-state-equivalence'),
      d('p1', 'same_tag', 'tag-dp-transition-acceleration'),
      d('p1', 'supporting', 'tag-prefix-difference'),
      d('p2', 'problem_specific'),
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc283-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
      d('p1', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc283-ex': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-integer-boundary-blocks'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
      d('p0', 'supporting', 'tag-contribution-reordering'),
      d('p1', 'same_tag', 'tag-integer-boundary-blocks'),
      d('p2', 'same_tag', 'tag-integer-boundary-blocks'),
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc283-f': decision(
    'outcome-linearize-events',
    [
      d('t0', 'supporting', 'tag-geometry-orientation-transform'),
      d('t1', 'primary', 'tag-event-sweep'),
      d('t1', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'supporting', 'tag-geometry-orientation-transform'),
      d('p1', 'supporting', 'tag-monoid-segment-tree'),
      d('p2', 'same_tag', 'tag-event-sweep'),
    ],
    {
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc283-g': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      d('t0', 'primary', 'tag-linear-algebra-xor'),
      d('t1', 'same_tag', 'tag-linear-algebra-xor'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'same_tag', 'tag-linear-algebra-xor'),
      d('p2', 'same_tag', 'tag-linear-algebra-xor'),
    ],
    {},
  ),
  'abc284-e': decision(
    'outcome-select-state-graph-search',
    [
      d('t0', 'primary', 'tag-reachability-bfs'),
      d('t1', 'same_tag', 'tag-reachability-bfs'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-reachability-bfs'),
      d('p1', 'same_tag', 'tag-reachability-bfs'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc284-ex': decision(
    'outcome-count-orbits-by-fixed-points',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('t2', 'supporting', 'tag-inclusion-exclusion'),
      d('p0', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p1', 'supporting', 'tag-inclusion-exclusion'),
      d('p2', 'supporting', 'tag-combinatorial-coefficients', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc284-f': decision(
    'outcome-build-prefix-match-state',
    [
      d('t0', 'primary', 'tag-prefix-matching-automata'),
      d('t1', 'same_tag', 'tag-prefix-matching-automata'),
      d('p0', 'same_tag', 'tag-prefix-matching-automata'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc284-g': decision(
    'outcome-decompose-functional-graph',
    [
      d('t0', 'primary', 'tag-functional-graph-doubling'),
      d('t1', 'supporting', 'tag-symmetry-invariant-normalization'),
      d('t2', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-functional-graph-doubling'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc285-e': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p1', 'same_tag', 'tag-interval-partition-dp'),
    ],
    {},
  ),
  'abc285-ex': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'supporting', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-inclusion-exclusion'),
      d('t2', 'supporting', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-convolution-fps'),
      d('p1', 'same_tag', 'tag-inclusion-exclusion'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p2', 'supporting', 'tag-prime-divisor-decomposition'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc285-f': decision(
    'outcome-design-associative-range-summary',
    [
      d('t0', 'primary', 'tag-monoid-segment-tree'),
      d('t1', 'same_tag', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-monoid-segment-tree'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc285-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      d('t0', 'primary', 'tag-flow-matching-cut'),
      d('t1', 'same_tag', 'tag-flow-matching-cut'),
      d('p0', 'same_tag', 'tag-flow-matching-cut'),
      d('p1', 'same_tag', 'tag-flow-matching-cut'),
    ],
    {},
  ),
  'abc286-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
      d('p1', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc286-ex': decision(
    'outcome-restrict-geometric-candidates-to-boundary',
    [
      d('t0', 'primary', 'tag-convex-hull-halfplane'),
      d('t1', 'same_tag', 'tag-convex-hull-halfplane'),
      d('t2', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p0', 'same_tag', 'tag-convex-hull-halfplane'),
      d('p1', 'same_tag', 'tag-convex-hull-halfplane'),
    ],
    {},
  ),
  'abc286-f': decision(
    'outcome-solve-modular-constraints',
    [
      d('t0', 'primary', 'tag-modular-crt'),
      d('t1', 'supporting', 'tag-functional-graph-doubling'),
      d('t2', 'same_tag', 'tag-modular-crt'),
      d('p0', 'same_tag', 'tag-modular-crt'),
      d('p1', 'supporting', 'tag-functional-graph-doubling'),
      d('p2', 'supporting', 'tag-interactive-protocol'),
    ],
    {
      'tag-functional-graph-doubling': ['outcome-decompose-functional-graph'],
      'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'],
    },
    ['outcome-exploit-modular-periodicity'],
  ),
  'abc286-g': decision(
    'outcome-characterize-walk-by-degrees',
    [
      d('t0', 'supporting', 'tag-dsu-connectivity'),
      d('t1', 'primary', 'tag-euler-degree-parity'),
      d('p0', 'supporting', 'tag-dsu-connectivity'),
      d('p1', 'same_tag', 'tag-euler-degree-parity'),
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc287-e': decision(
    'outcome-index-shared-prefixes-with-trie',
    [
      d('t0', 'primary', 'tag-trie-prefix'),
      d('t1', 'same_tag', 'tag-trie-prefix'),
      d('p0', 'same_tag', 'tag-trie-prefix'),
      d('p1', 'same_tag', 'tag-trie-prefix'),
    ],
    {},
  ),
  'abc287-ex': decision(
    'outcome-compute-transitive-closure',
    [
      d('t0', 'same_tag', 'tag-reachability-bfs'),
      d('t0', 'supporting', 'tag-event-sweep'),
      d('t1', 'primary', 'tag-reachability-bfs'),
      d('t1', 'supporting', 'tag-bitset-word-parallel'),
      d('t2', 'primary', 'tag-reachability-bfs'),
      d('p0', 'same_tag', 'tag-reachability-bfs'),
      d('p1', 'supporting', 'tag-bitset-word-parallel'),
      d('p2', 'same_tag', 'tag-reachability-bfs'),
    ],
    {
      'tag-bitset-word-parallel': ['outcome-accelerate-set-operations-with-bitsets'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc287-f': decision(
    'outcome-aggregate-rooted-tree',
    [
      d('t0', 'primary', 'tag-tree-aggregation-reroot'),
      d('t1', 'supporting', 'tag-knapsack-resource'),
      d('t2', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-aggregation-reroot'),
      d('p1', 'supporting', 'tag-knapsack-resource'),
      d('p2', 'same_tag', 'tag-tree-aggregation-reroot'),
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc287-g': decision(
    'outcome-maintain-weighted-prefix-statistics',
    [
      d('t0', 'supporting', 'tag-coordinate-compression'),
      d('t1', 'primary', 'tag-fenwick-weighted-prefix'),
      d('t2', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('p0', 'same_tag', 'tag-fenwick-weighted-prefix'),
      d('p1', 'supporting', 'tag-coordinate-compression'),
      d('p2', 'same_tag', 'tag-fenwick-weighted-prefix'),
    ],
    { 'tag-coordinate-compression': ['outcome-compress-sparse-keys'] },
  ),
  'abc288-e': decision(
    'outcome-design-resource-dp',
    [
      d('t0', 'same_tag', 'tag-knapsack-resource'),
      d('t1', 'primary', 'tag-knapsack-resource'),
      d('t2', 'problem_specific'),
      d('p0', 'same_tag', 'tag-knapsack-resource'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc288-ex': decision(
    'outcome-count-prefix-constrained-objects',
    [
      d('t0', 'primary', 'tag-digit-dp'),
      d('t0', 'supporting', 'tag-combinatorial-coefficients'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('t2', 'supporting', 'tag-combinatorial-coefficients', 'tag-inclusion-exclusion'),
      d('t3', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-digit-dp'),
      d('p1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p2', 'supporting', 'tag-inclusion-exclusion'),
      d('p3', 'supporting', 'tag-combinatorial-coefficients'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
    },
  ),
  'abc288-f': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'supporting', 'tag-dp-transition-acceleration'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p1', 'supporting', 'tag-dp-transition-acceleration'),
    ],
    { 'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'] },
  ),
  'abc288-g': decision(
    'outcome-factor-separable-linear-transform',
    [
      d('t0', 'primary', 'tag-linear-algebra-xor'),
      d('t1', 'same_tag', 'tag-linear-algebra-xor'),
      d('p0', 'same_tag', 'tag-linear-algebra-xor'),
      d('p1', 'same_tag', 'tag-linear-algebra-xor'),
      d('p2', 'same_tag', 'tag-linear-algebra-xor'),
    ],
    {},
  ),
  'abc289-e': decision(
    'outcome-select-state-graph-search',
    [
      d('t0', 'primary', 'tag-reachability-bfs'),
      d('t1', 'same_tag', 'tag-reachability-bfs'),
      d('p0', 'same_tag', 'tag-reachability-bfs'),
      d('p1', 'same_tag', 'tag-reachability-bfs'),
      d('p2', 'problem_specific'),
    ],
    {},
  ),
  'abc289-ex': decision(
    'outcome-apply-formal-power-series-operations',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'primary', 'tag-convolution-fps'),
      d('t1', 'supporting', 'tag-modular-arithmetic'),
      d('t2', 'primary', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p1', 'same_tag', 'tag-convolution-fps'),
      d('p2', 'same_tag', 'tag-convolution-fps'),
      d('p2', 'supporting', 'tag-modular-arithmetic'),
      d('p3', 'same_tag', 'tag-convolution-fps'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    [
      'outcome-compute-convolution-or-correlation',
      'outcome-encode-counting-by-generating-function',
    ],
  ),
  'abc289-f': decision(
    'outcome-recover-valid-witness',
    [
      d('t0', 'primary', 'tag-constructive-witness'),
      d('t1', 'same_tag', 'tag-constructive-witness'),
      d('t2', 'same_tag', 'tag-constructive-witness'),
      d('p0', 'same_tag', 'tag-constructive-witness'),
      d('p1', 'same_tag', 'tag-constructive-witness'),
      d('p2', 'same_tag', 'tag-constructive-witness'),
    ],
    {},
  ),
  'abc289-g': decision(
    'outcome-optimize-by-line-envelope',
    [
      d('t0', 'primary', 'tag-convex-hull-trick'),
      d('t1', 'same_tag', 'tag-convex-hull-trick'),
      d('t2', 'primary', 'tag-convex-hull-trick'),
      d('p0', 'same_tag', 'tag-convex-hull-trick'),
      d('p1', 'baseline'),
    ],
    {},
  ),
  'abc290-e': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'supporting', 'tag-two-pointers-window'),
      d('p0', 'same_tag', 'tag-contribution-reordering'),
      d('p0', 'supporting', 'tag-two-pointers-window'),
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc290-ex': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-knapsack-resource'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
      d('p0', 'supporting', 'tag-knapsack-resource'),
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc290-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-combinatorial-coefficients'),
    ],
    {},
  ),
  'abc290-g': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc291-e': decision(
    'outcome-condense-and-order-directed-graph',
    [
      d('t0', 'primary', 'tag-directed-condensation-toposort'),
      d('t1', 'same_tag', 'tag-directed-condensation-toposort'),
      d('p0', 'same_tag', 'tag-directed-condensation-toposort'),
    ],
    {},
  ),
  'abc291-ex': decision(
    'outcome-build-balanced-separator-decomposition',
    [
      d('t0', 'primary', 'tag-tree-balanced-separator'),
      d('t1', 'same_tag', 'tag-tree-balanced-separator'),
      d('p0', 'same_tag', 'tag-tree-balanced-separator'),
    ],
    {},
  ),
  'abc291-f': decision(
    'outcome-model-and-compute-shortest-path',
    [
      d('t0', 'primary', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-shortest-path'),
      d('p0', 'same_tag', 'tag-shortest-path'),
    ],
    {},
  ),
  'abc291-g': decision(
    'outcome-compute-convolution-or-correlation',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t1', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
    ],
    {},
  ),
  'abc292-e': decision(
    'outcome-compute-transitive-closure',
    [d('t0', 'primary', 'tag-reachability-bfs'), d('p0', 'same_tag', 'tag-reachability-bfs')],
    {},
  ),
  'abc292-ex': decision(
    'outcome-design-associative-range-summary',
    [
      d('t0', 'primary', 'tag-monoid-segment-tree'),
      d('t1', 'same_tag', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-monoid-segment-tree'),
    ],
    {},
  ),
  'abc292-f': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
    ],
    {},
  ),
  'abc292-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'same_tag', 'tag-interval-partition-dp'),
      d('t1', 'primary', 'tag-interval-partition-dp'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
    ],
    {},
  ),
  'abc293-e': decision(
    'outcome-accelerate-fixed-linear-transition',
    [
      d('t0', 'primary', 'tag-linear-recurrence-matrix'),
      d('p0', 'same_tag', 'tag-linear-recurrence-matrix'),
    ],
    {},
  ),
  'abc293-ex': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'supporting', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'supporting', 'tag-tree-aggregation-reroot'),
    ],
    { 'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'] },
  ),
  'abc293-f': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      d('t0', 'primary', 'tag-integer-boundary-blocks'),
      d('t1', 'primary', 'tag-integer-boundary-blocks'),
      d('p0', 'same_tag', 'tag-integer-boundary-blocks'),
    ],
    {},
  ),
  'abc293-g': decision(
    'outcome-schedule-range-query-updates',
    [
      d('t0', 'primary', 'tag-mo-offline-range'),
      d('t1', 'same_tag', 'tag-mo-offline-range'),
      d('p0', 'same_tag', 'tag-mo-offline-range'),
    ],
    {},
  ),
  'abc294-e': decision(
    'outcome-maintain-monotone-window',
    [d('t0', 'primary', 'tag-two-pointers-window'), d('p0', 'same_tag', 'tag-two-pointers-window')],
    {},
  ),
  'abc294-ex': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc294-f': decision(
    'outcome-prove-and-search-threshold',
    [
      d('t0', 'primary', 'tag-monotone-threshold-search'),
      d('t1', 'same_tag', 'tag-monotone-threshold-search'),
      d('p0', 'baseline'),
    ],
    {},
  ),
  'abc294-g': decision(
    'outcome-flatten-tree-by-euler-order',
    [
      d('t0', 'primary', 'tag-tree-path-decomposition'),
      d('t1', 'same_tag', 'tag-tree-path-decomposition'),
      d('p0', 'same_tag', 'tag-tree-path-decomposition'),
      d('p0', 'supporting', 'tag-fenwick-weighted-prefix'),
    ],
    { 'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'] },
    ['outcome-answer-tree-ancestor-queries'],
  ),
  'abc295-e': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'primary', 'tag-contribution-reordering'),
      d('t1', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc295-ex': decision(
    'outcome-enumerate-subset-state-space',
    [
      d('t0', 'primary', 'tag-subset-bitmask-transform'),
      d('t1', 'same_tag', 'tag-subset-bitmask-transform'),
      d('p0', 'same_tag', 'tag-subset-bitmask-transform'),
    ],
    {},
  ),
  'abc295-f': decision(
    'outcome-reorder-counting-contributions',
    [
      d('t0', 'baseline'),
      d('t1', 'primary', 'tag-contribution-reordering'),
      d('p0', 'problem_specific'),
    ],
    {},
  ),
  'abc295-g': decision(
    'outcome-condense-and-order-directed-graph',
    [
      d('t0', 'primary', 'tag-directed-condensation-toposort'),
      d('t1', 'supporting', 'tag-dsu-connectivity', 'tag-amortized-heavy-light'),
      d('p0', 'supporting', 'tag-dsu-connectivity', 'tag-amortized-heavy-light'),
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
    },
  ),
  'abc296-e': decision(
    'outcome-decompose-functional-graph',
    [
      d('t0', 'primary', 'tag-functional-graph-doubling'),
      d('p0', 'same_tag', 'tag-functional-graph-doubling'),
    ],
    {},
  ),
  'abc296-ex': decision(
    'outcome-design-minimal-sufficient-state',
    [
      d('t0', 'primary', 'tag-dp-state-equivalence'),
      d('t1', 'same_tag', 'tag-dp-state-equivalence'),
      d('p0', 'same_tag', 'tag-dp-state-equivalence'),
    ],
    {},
  ),
  'abc296-f': decision(
    'outcome-normalize-equivalent-states',
    [
      d('t0', 'primary', 'tag-symmetry-invariant-normalization'),
      d('t1', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p0', 'same_tag', 'tag-symmetry-invariant-normalization'),
      d('p0', 'supporting', 'tag-fenwick-weighted-prefix'),
    ],
    { 'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'] },
  ),
  'abc296-g': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      d('t0', 'primary', 'tag-geometry-orientation-transform'),
      d('t1', 'supporting', 'tag-event-sweep'),
      d('p0', 'same_tag', 'tag-geometry-orientation-transform'),
    ],
    { 'tag-event-sweep': ['outcome-linearize-events'] },
  ),
  'abc297-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      d('t0', 'primary', 'tag-ordered-set-heap'),
      d('t0', 'supporting', 'tag-shortest-path'),
      d('t1', 'same_tag', 'tag-ordered-set-heap'),
      d('p0', 'same_tag', 'tag-ordered-set-heap'),
      d('p0', 'supporting', 'tag-shortest-path'),
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc297-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      d('t0', 'primary', 'tag-convolution-fps'),
      d('t0', 'supporting', 'tag-inclusion-exclusion'),
      d('t1', 'same_tag', 'tag-convolution-fps'),
      d('t2', 'same_tag', 'tag-convolution-fps'),
      d('t2', 'supporting', 'tag-modular-arithmetic'),
      d('p0', 'same_tag', 'tag-convolution-fps'),
      d('p0', 'supporting', 'tag-inclusion-exclusion', 'tag-modular-arithmetic'),
    ],
    {
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-apply-formal-power-series-operations'],
  ),
  'abc297-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      d('t0', 'supporting', 'tag-contribution-reordering'),
      d('t1', 'primary', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-combinatorial-coefficients'),
      d('p0', 'same_tag', 'tag-inclusion-exclusion'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc297-g': decision(
    'outcome-classify-game-states',
    [
      d('t0', 'primary', 'tag-game-grundy-dp'),
      d('t1', 'same_tag', 'tag-game-grundy-dp'),
      d('p0', 'same_tag', 'tag-game-grundy-dp'),
    ],
    {},
  ),
  'abc298-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc298-ex': decision(
    'outcome-answer-tree-ancestor-queries',
    [
      d('t0', 'primary', 'tag-tree-path-decomposition'),
      d('t1', 'supporting', 'tag-tree-aggregation-reroot'),
      d('p0', 'same_tag', 'tag-tree-path-decomposition'),
      d('p0', 'supporting', 'tag-tree-aggregation-reroot'),
    ],
    { 'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'] },
  ),
  'abc298-f': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'problem_specific'),
      d('t1', 'primary', 'tag-greedy-exchange-order'),
      d('p0', 'baseline'),
    ],
    {},
  ),
  'abc298-g': decision(
    'outcome-design-interval-split-dp',
    [
      d('t0', 'primary', 'tag-interval-partition-dp'),
      d('t1', 'same_tag', 'tag-interval-partition-dp'),
      d('t1', 'supporting', 'tag-bounded-enumeration'),
      d('p0', 'same_tag', 'tag-interval-partition-dp'),
      d('p0', 'supporting', 'tag-prefix-difference'),
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc299-e': decision(
    'outcome-recover-valid-witness',
    [d('t0', 'primary', 'tag-constructive-witness'), d('t1', 'baseline'), d('p0', 'baseline')],
    {},
  ),
  'abc299-ex': decision(
    'outcome-solve-stochastic-recurrence',
    [
      d('t0', 'primary', 'tag-stochastic-expectation-dp'),
      d('t1', 'supporting', 'tag-linear-recurrence-matrix'),
      d('p0', 'same_tag', 'tag-stochastic-expectation-dp'),
      d('p0', 'supporting', 'tag-linear-recurrence-matrix'),
      d('p0', 'supporting', 'tag-modular-arithmetic'),
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc299-f': decision(
    'outcome-design-order-preserving-dp',
    [
      d('t0', 'primary', 'tag-sequence-subsequence-dp'),
      d('t1', 'same_tag', 'tag-sequence-subsequence-dp'),
      d('p0', 'same_tag', 'tag-sequence-subsequence-dp'),
    ],
    {},
  ),
  'abc299-g': decision(
    'outcome-prove-greedy-order',
    [
      d('t0', 'primary', 'tag-greedy-exchange-order'),
      d('t1', 'supporting', 'tag-monoid-segment-tree'),
      d('p0', 'same_tag', 'tag-greedy-exchange-order'),
      d('p0', 'supporting', 'tag-monoid-segment-tree'),
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
} as const;
