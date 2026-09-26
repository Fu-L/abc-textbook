export type ExplicitInventoryClaimDispositionKind =
  'primary' | 'supporting' | 'same_tag' | 'baseline' | 'problem_specific';

export interface ExplicitInventoryClaimDisposition {
  readonly claimPath: string;
  readonly kind: ExplicitInventoryClaimDispositionKind;
  readonly tagIds: readonly string[];
}

export interface ExplicitTaxonomyClaimDecision {
  readonly primaryOutcomeId: string;
  readonly additionalPrimaryOutcomeIds: readonly string[];
  readonly dispositions: readonly ExplicitInventoryClaimDisposition[];
  readonly supportingOutcomeIdsByTag: Readonly<Record<string, readonly string[]>>;
}

type ClaimTuple = readonly [
  collection: 'typicalTechniques' | 'prerequisiteCandidates' | 'implementationConcerns',
  index: number,
  kind: ExplicitInventoryClaimDispositionKind,
  ...tagIds: readonly string[],
];

const decision = (
  primaryOutcomeId: string,
  claims: readonly ClaimTuple[],
  supportingOutcomeIdsByTag: Readonly<Record<string, readonly string[]>> = {},
  additionalPrimaryOutcomeIds: readonly string[] = [],
): ExplicitTaxonomyClaimDecision => ({
  primaryOutcomeId,
  additionalPrimaryOutcomeIds,
  dispositions: claims.map(([collection, index, kind, ...tagIds]) => ({
    claimPath: `/${collection}/${String(index)}`,
    kind,
    tagIds,
  })),
  supportingOutcomeIdsByTag,
});

/**
 * Source-backed claim dispositions for every reviewed ABC384--ABC466 inventory record.
 *
 * The table is intentionally explicit: semantic review of each claim, rather than recall-term
 * matching, decides its role. Common prerequisites from spec.md remain baseline, and every
 * supporting Tag names the exact Outcome used by the adopted solution.
 */
export const FINAL_TAXONOMY_CLAIM_DECISIONS_384_466 = {
  'abc384-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc384-f': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc384-g': decision(
    'outcome-schedule-range-query-updates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-mo-offline-range'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-mo-offline-range'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc385-e': decision('outcome-prove-greedy-order', [
    ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
    ['typicalTechniques', 1, 'problem_specific'],
    ['prerequisiteCandidates', 0, 'baseline'],
  ]),
  'abc385-f': decision('outcome-reduce-geometry-to-algebraic-predicates', [
    ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 1, 'problem_specific'],
  ]),
  'abc385-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-divide-enumerate'],
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc386-e': decision('outcome-enumerate-bounded-candidates-or-cases', [
    ['typicalTechniques', 0, 'primary', 'tag-bounded-enumeration'],
    ['typicalTechniques', 1, 'same_tag', 'tag-bounded-enumeration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-bounded-enumeration'],
  ]),
  'abc386-f': decision(
    'outcome-compute-edit-distance',
    [
      ['typicalTechniques', 0, 'primary', 'tag-edit-distance-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-edit-distance-dp'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
    },
  ),
  'abc386-g': decision(
    'outcome-count-labeled-structures-by-components',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'primary', 'tag-labeled-component-decomposition'],
      ['typicalTechniques', 2, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-labeled-component-decomposition'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
    ['outcome-reorder-counting-contributions'],
  ),
  'abc387-e': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'primary', 'tag-constructive-witness'],
      ['typicalTechniques', 0, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'baseline'],
      ['prerequisiteCandidates', 0, 'problem_specific'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc387-f': decision(
    'outcome-decompose-functional-graph',
    [
      ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dp-transition-acceleration'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
    },
  ),
  'abc387-g': decision(
    'outcome-evaluate-and-compose-polynomials',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
    ],
    {},
    [
      'outcome-encode-counting-by-generating-function',
      'outcome-apply-formal-power-series-operations',
    ],
  ),
  'abc388-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc388-f': decision(
    'outcome-bound-reachability-in-numerical-semigroup',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'primary', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-gcd-diophantine'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
    },
  ),
  'abc388-g': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'primary', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
      'tag-two-pointers-window': ['outcome-maintain-monotone-window'],
    },
  ),
  'abc389-e': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc389-f': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
    ['typicalTechniques', 1, 'same_tag', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc389-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'],
    },
  ),
  'abc390-e': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc390-f': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc390-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc391-e': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc391-f': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
    ['typicalTechniques', 1, 'same_tag', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc391-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
    ],
    {
      'tag-string-automata': ['outcome-build-finite-string-automaton'],
    },
  ),
  'abc392-e': decision(
    'outcome-augment-components-with-metadata',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
    },
  ),
  'abc392-f': decision(
    'outcome-reverse-update-time',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reverse-offline'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc392-g': decision(
    'outcome-compute-convolution-or-correlation',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc393-e': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
  ]),
  'abc393-f': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'primary', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc393-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 2, 'supporting', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-gcd-diophantine'],
    ],
    {
      'tag-gcd-diophantine': ['outcome-approximate-rational-by-euclid'],
      'tag-shortest-path': ['outcome-model-and-compute-shortest-path'],
    },
  ),
  'abc394-e': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'same_tag', 'tag-reachability-bfs'],
    ['typicalTechniques', 1, 'primary', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc394-f': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc394-g': decision(
    'outcome-maintain-connectivity-components',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc395-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc395-f': decision('outcome-prove-and-search-threshold', [
    ['typicalTechniques', 0, 'same_tag', 'tag-monotone-threshold-search'],
    ['typicalTechniques', 1, 'primary', 'tag-monotone-threshold-search'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
  ]),
  'abc395-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 2, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    {
      'tag-shortest-path': ['outcome-model-and-compute-shortest-path'],
    },
  ),
  'abc396-e': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      ['typicalTechniques', 0, 'primary', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 1, 'same_tag', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-algebra-xor'],
    ],
    { 'tag-constructive-witness': ['outcome-recover-valid-witness'] },
  ),
  'abc396-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-contribution-reordering'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc396-g': decision('outcome-enumerate-subset-state-space', [
    ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-subset-bitmask-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
  ]),
  'abc397-e': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'primary', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc397-f': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
    ['typicalTechniques', 1, 'same_tag', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc397-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc398-e': decision(
    'outcome-solve-game-by-parity-invariant',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-parity-invariant'],
      ['typicalTechniques', 1, 'primary', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-interactive-protocol'],
    ],
    {
      'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'],
    },
    ['outcome-color-and-classify-bipartite-components'],
  ),
  'abc398-f': decision('outcome-characterize-palindrome-intervals', [
    ['typicalTechniques', 0, 'primary', 'tag-palindrome-radius'],
    ['typicalTechniques', 1, 'same_tag', 'tag-palindrome-radius'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-palindrome-radius'],
  ]),
  'abc398-g': decision(
    'outcome-solve-game-by-parity-invariant',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-parity-invariant'],
      ['typicalTechniques', 1, 'primary', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-bipartite-structure'],
    ],
    {},
    ['outcome-color-and-classify-bipartite-components'],
  ),
  'abc399-e': decision('outcome-decompose-functional-graph', [
    ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
    ['typicalTechniques', 1, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
  ]),
  'abc399-f': decision('outcome-formulate-combinatorial-coefficients', [
    ['typicalTechniques', 0, 'primary', 'tag-combinatorial-coefficients'],
    ['typicalTechniques', 1, 'same_tag', 'tag-combinatorial-coefficients'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
  ]),
  'abc399-g': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      ['typicalTechniques', 0, 'primary', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 0, 'supporting', 'tag-randomized-algorithm'],
      ['typicalTechniques', 1, 'same_tag', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 2, 'same_tag', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-randomized-algorithm'],
    ],
    {
      'tag-randomized-algorithm': ['outcome-design-and-bound-randomized-algorithm'],
    },
  ),
  'abc400-e': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
  ]),
  'abc400-f': decision('outcome-design-interval-split-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-interval-partition-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-interval-partition-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-interval-partition-dp'],
  ]),
  'abc400-g': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc401-e': decision(
    'outcome-augment-components-with-metadata',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc401-f': decision(
    'outcome-use-tree-diameter-extrema',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-metric-diameter'],
      ['typicalTechniques', 1, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-metric-diameter'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc401-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 0, 'supporting', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc402-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc402-f': decision(
    'outcome-split-enumeration-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc402-g': decision('outcome-partition-integer-parameter-ranges', [
    ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
    ['typicalTechniques', 1, 'same_tag', 'tag-integer-boundary-blocks'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-integer-boundary-blocks'],
  ]),
  'abc403-e': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-trie-prefix'],
      ['typicalTechniques', 1, 'primary', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-trie-prefix'],
    ],
    {
      'tag-trie-prefix': ['outcome-index-shared-prefixes-with-trie'],
    },
  ),
  'abc403-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['typicalTechniques', 2, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prime-divisor-decomposition'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc403-g': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'same_tag', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'primary', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc404-e': decision('outcome-prove-greedy-order', [
    ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
    ['typicalTechniques', 1, 'same_tag', 'tag-greedy-exchange-order'],
    ['typicalTechniques', 2, 'same_tag', 'tag-greedy-exchange-order'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
  ]),
  'abc404-f': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 2, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc404-g': decision(
    'outcome-model-and-compute-shortest-path',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'primary', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc405-e': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'primary', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc405-f': decision(
    'outcome-build-laminar-interval-containment-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-laminar-interval-containment-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 2, 'supporting', 'tag-cyclic-order-crossing'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-laminar-interval-containment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-cyclic-order-crossing'],
    ],
    {
      'tag-cyclic-order-crossing': ['outcome-detect-crossing-by-cyclic-order'],
      'tag-tree-path-decomposition': ['outcome-answer-tree-ancestor-queries'],
    },
  ),
  'abc405-g': decision(
    'outcome-schedule-range-query-updates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-mo-offline-range'],
      ['typicalTechniques', 1, 'supporting', 'tag-value-bucket-aggregation'],
      ['implementationConcerns', 0, 'supporting', 'tag-dynamic-modular-product'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-mo-offline-range'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-value-bucket-aggregation'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-value-bucket-aggregation': ['outcome-aggregate-value-prefix-by-buckets'],
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-dynamic-modular-product': ['outcome-maintain-modular-product-under-factor-updates'],
    },
  ),
  'abc406-e': decision('outcome-count-prefix-constrained-objects', [
    ['typicalTechniques', 0, 'primary', 'tag-digit-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-digit-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-digit-dp'],
  ]),
  'abc406-f': decision(
    'outcome-flatten-tree-by-euler-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc406-g': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'same_tag', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['typicalTechniques', 2, 'same_tag', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 2, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc407-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 2, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc407-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 2, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc407-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['typicalTechniques', 2, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc408-e': decision(
    'outcome-maintain-connectivity-components',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'primary', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc408-f': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 2, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc408-g': decision('outcome-approximate-rational-by-euclid', [
    ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
    ['typicalTechniques', 1, 'same_tag', 'tag-gcd-diophantine'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
  ]),
  'abc409-e': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc409-f': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'same_tag', 'tag-ordered-set-heap'],
      ['typicalTechniques', 2, 'supporting', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
    },
  ),
  'abc409-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 2, 'primary', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-stochastic-expectation-dp'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-stochastic-expectation-dp': ['outcome-solve-stochastic-recurrence'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc410-e': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc410-f': decision(
    'outcome-linearize-static-range-information',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'primary', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bounded-enumeration'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
    },
  ),
  'abc410-g': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 2, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-geometry-orientation-transform'],
    ],
    {
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc411-e': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 2, 'primary', 'tag-dynamic-modular-product'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-maintain-modular-product-under-factor-updates'],
  ),
  'abc411-f': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
    ['typicalTechniques', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc411-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 2, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc412-e': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 2, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
  ]),
  'abc412-f': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 2, 'supporting', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc412-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 2, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
    ],
    {},
  ),
  'abc413-e': decision('outcome-divide-search-space-recursively', [
    ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
    ['typicalTechniques', 1, 'same_tag', 'tag-divide-enumerate'],
    ['typicalTechniques', 2, 'same_tag', 'tag-divide-enumerate'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
  ]),
  'abc413-f': decision(
    'outcome-evaluate-adversarial-game-value',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-value-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-game-value-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['typicalTechniques', 2, 'same_tag', 'tag-game-value-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-game-value-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-reachability-bfs'],
    ],
    {
      'tag-reachability-bfs': ['outcome-select-state-graph-search'],
    },
  ),
  'abc413-g': decision(
    'outcome-maintain-connectivity-components',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'supporting', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-flow-matching-cut'],
    ],
    {
      'tag-flow-matching-cut': ['outcome-reduce-selection-to-network-optimization'],
    },
  ),
  'abc414-e': decision('outcome-partition-integer-parameter-ranges', [
    ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
    ['typicalTechniques', 1, 'same_tag', 'tag-integer-boundary-blocks'],
    ['typicalTechniques', 2, 'same_tag', 'tag-integer-boundary-blocks'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-integer-boundary-blocks'],
  ]),
  'abc414-f': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
    ['typicalTechniques', 1, 'same_tag', 'tag-reachability-bfs'],
    ['typicalTechniques', 2, 'same_tag', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc414-g': decision(
    'outcome-model-and-compute-shortest-path',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-shortest-path'],
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
      ['typicalTechniques', 2, 'primary', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-decompose-ranges-into-segment-tree-nodes'],
    },
  ),
  'abc415-e': decision('outcome-design-grid-table-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-grid-table-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-grid-table-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-grid-table-dp'],
  ]),
  'abc415-f': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc415-g': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
      ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 2, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc416-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
    ['typicalTechniques', 2, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc416-f': decision(
    'outcome-aggregate-rooted-tree',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-knapsack-resource'],
      ['typicalTechniques', 1, 'primary', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 2, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
    ],
    {
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
    },
  ),
  'abc416-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 2, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc417-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-reachability-bfs'],
    ],
    {
      'tag-reachability-bfs': ['outcome-select-state-graph-search'],
    },
  ),
  'abc417-f': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc417-g': decision(
    'outcome-query-recursively-defined-string',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'supporting', 'tag-functional-graph-doubling'],
      ['typicalTechniques', 2, 'primary', 'tag-recursive-compressed-string'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-recursive-compressed-string'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-functional-graph-doubling'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-functional-graph-doubling': ['outcome-jump-deterministic-transition'],
    },
  ),
  'abc418-e': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-gcd-diophantine'],
      ['typicalTechniques', 2, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-gcd-diophantine'],
    ],
    {
      'tag-gcd-diophantine': ['outcome-reduce-integer-structure-by-gcd'],
    },
  ),
  'abc418-f': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 2, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc418-g': decision(
    'outcome-build-finite-string-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'same_tag', 'tag-string-automata'],
      ['typicalTechniques', 2, 'supporting', 'tag-interval-partition-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-interval-partition-dp'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
      'tag-interval-partition-dp': ['outcome-design-interval-split-dp'],
    },
  ),
  'abc419-e': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
      ['typicalTechniques', 2, 'primary', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ],
    {},
  ),
  'abc419-f': decision(
    'outcome-build-multi-pattern-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 2, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc419-g': decision(
    'outcome-reduce-graph-by-peeling-or-kernelization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-graph-core-peeling'],
      ['typicalTechniques', 1, 'same_tag', 'tag-graph-core-peeling'],
      ['typicalTechniques', 2, 'primary', 'tag-cycle-space-basis'],
      ['typicalTechniques', 3, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 4, 'supporting', 'tag-backtracking-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-cycle-space-basis'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-graph-core-peeling'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-backtracking-search'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-backtracking-search': ['outcome-enumerate-by-reversible-backtracking'],
    },
  ),
  'abc420-e': decision('outcome-augment-components-with-metadata', [
    ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
    ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
  ]),
  'abc420-f': decision(
    'outcome-build-cartesian-tree-decomposition',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-cartesian-tree'],
      ['typicalTechniques', 1, 'primary', 'tag-cartesian-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-stack-queue'],
      ['typicalTechniques', 2, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-cartesian-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-stack-queue'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc420-g': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['typicalTechniques', 2, 'same_tag', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
  ]),
  'abc421-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc421-f': decision(
    'outcome-maintain-local-sequence-links',
    [
      ['typicalTechniques', 0, 'primary', 'tag-linked-list-index'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-linked-list-index'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
    },
  ),
  'abc421-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'primary', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc422-e': decision(
    'outcome-design-and-bound-randomized-algorithm',
    [
      ['typicalTechniques', 0, 'primary', 'tag-randomized-algorithm'],
      ['typicalTechniques', 1, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-randomized-algorithm'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-geometry-orientation-transform'],
    ],
    {
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
    },
  ),
  'abc422-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc422-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 0, 'supporting', 'tag-modular-arithmetic'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc423-e': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc423-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'primary', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc423-g': decision(
    'outcome-solve-modular-constraints',
    [
      ['typicalTechniques', 0, 'primary', 'tag-modular-crt'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-modular-crt'],
    ],
    {
      'tag-divide-enumerate': ['outcome-split-enumeration-space'],
    },
  ),
  'abc424-e': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-implicit-binary-tree-arithmetic'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-implicit-binary-tree-arithmetic'],
    ],
    {
      'tag-implicit-binary-tree-arithmetic': ['outcome-count-implicit-binary-tree-layers'],
    },
  ),
  'abc424-f': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'same_tag', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'primary', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc424-g': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'primary', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-flow-matching-cut'],
    ],
    {
      'tag-flow-matching-cut': ['outcome-characterize-bipartite-feasibility-by-hall'],
    },
  ),
  'abc425-e': decision('outcome-formulate-combinatorial-coefficients', [
    ['typicalTechniques', 0, 'primary', 'tag-combinatorial-coefficients'],
    ['typicalTechniques', 1, 'same_tag', 'tag-combinatorial-coefficients'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
  ]),
  'abc425-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc425-g': decision(
    'outcome-query-bitwise-order-with-trie',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'primary', 'tag-binary-trie'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-binary-trie'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
    ],
    {
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
  'abc426-e': decision('outcome-reduce-geometry-to-algebraic-predicates', [
    ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
  ]),
  'abc426-f': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
    },
  ),
  'abc426-g': decision(
    'outcome-divide-search-space-recursively',
    [
      ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
    ],
    {
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
    },
  ),
  'abc427-e': decision(
    'outcome-select-state-graph-search',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 2, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc427-f': decision('outcome-split-enumeration-space', [
    ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
    ['typicalTechniques', 1, 'same_tag', 'tag-divide-enumerate'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
  ]),
  'abc427-g': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 2, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc428-e': decision('outcome-use-tree-diameter-extrema', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-metric-diameter'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-metric-diameter'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-metric-diameter'],
  ]),
  'abc428-f': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'same_tag', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 2, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc428-g': decision(
    'outcome-count-orbits-by-fixed-points',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['typicalTechniques', 2, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prime-divisor-decomposition'],
    ],
    {
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc429-e': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
    ['typicalTechniques', 1, 'same_tag', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc429-f': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 0, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    {
      'tag-shortest-path': ['outcome-model-and-compute-shortest-path'],
    },
  ),
  'abc429-g': decision(
    'outcome-evaluate-compressed-integer-blocks',
    [
      ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
      ['typicalTechniques', 1, 'supporting', 'tag-linear-recurrence-matrix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-linear-recurrence-matrix'],
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
    },
  ),
  'abc430-e': decision('outcome-build-prefix-match-state', [
    ['typicalTechniques', 0, 'same_tag', 'tag-prefix-matching-automata'],
    ['typicalTechniques', 1, 'primary', 'tag-prefix-matching-automata'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-matching-automata'],
  ]),
  'abc430-f': decision('outcome-linearize-static-range-information', [
    ['typicalTechniques', 0, 'baseline'],
    ['typicalTechniques', 1, 'primary', 'tag-prefix-difference'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-difference'],
  ]),
  'abc430-g': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
      ['typicalTechniques', 0, 'supporting', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'supporting', 'tag-bitset-word-parallel'],
      ['typicalTechniques', 2, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bitset-word-parallel'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-bitset-word-parallel': ['outcome-accelerate-set-operations-with-bitsets'],
    },
  ),
  'abc431-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc431-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'primary', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 2, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-two-pointers-window'],
    ],
    {
      'tag-two-pointers-window': ['outcome-maintain-monotone-window'],
    },
  ),
  'abc431-g': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 2, 'problem_specific'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc432-e': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc432-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'problem_specific'],
      ['typicalTechniques', 2, 'supporting', 'tag-constructive-witness'],
      ['typicalTechniques', 2, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc432-g': decision(
    'outcome-compute-convolution-or-correlation',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 0, 'supporting', 'tag-modular-arithmetic'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc433-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc433-f': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 2, 'baseline'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc433-g': decision(
    'outcome-build-suffix-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-game-grundy-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-game-grundy-dp'],
    ],
    {
      'tag-game-grundy-dp': ['outcome-classify-game-states'],
    },
  ),
  'abc434-e': decision(
    'outcome-augment-components-with-metadata',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
    },
  ),
  'abc434-f': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-matching-automata'],
      ['typicalTechniques', 2, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-matching-automata'],
    ],
    {
      'tag-prefix-matching-automata': ['outcome-build-prefix-match-state'],
    },
  ),
  'abc434-g': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 2, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc435-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
    },
  ),
  'abc435-f': decision(
    'outcome-build-cartesian-tree-decomposition',
    [
      ['typicalTechniques', 0, 'primary', 'tag-cartesian-tree'],
      ['typicalTechniques', 0, 'supporting', 'tag-monotone-stack-queue'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 2, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-cartesian-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-stack-queue'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-aggregation-reroot'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
      'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'],
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
    },
  ),
  'abc435-g': decision('outcome-factor-and-accelerate-transitions', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
    ['typicalTechniques', 1, 'same_tag', 'tag-dp-transition-acceleration'],
    ['typicalTechniques', 2, 'same_tag', 'tag-dp-transition-acceleration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
  ]),
  'abc436-e': decision(
    'outcome-decompose-functional-graph',
    [
      ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
      ['typicalTechniques', 1, 'problem_specific'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
    ],
    {},
  ),
  'abc436-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-event-sweep'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc436-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 2, 'primary', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc437-e': decision('outcome-index-shared-prefixes-with-trie', [
    ['typicalTechniques', 0, 'primary', 'tag-trie-prefix'],
    ['typicalTechniques', 1, 'same_tag', 'tag-trie-prefix'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-trie-prefix'],
  ]),
  'abc437-f': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc437-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-bipartite-structure'],
      ['typicalTechniques', 2, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bipartite-structure'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
      'tag-bipartite-structure': ['outcome-color-and-classify-bipartite-components'],
    },
  ),
  'abc438-e': decision('outcome-jump-deterministic-transition', [
    ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
    ['typicalTechniques', 1, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
  ]),
  'abc438-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 2, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-aggregation-reroot'],
    ],
    {
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
      'tag-tree-path-decomposition': ['outcome-answer-tree-ancestor-queries'],
    },
  ),
  'abc438-g': decision(
    'outcome-reduce-integer-structure-by-gcd',
    [
      ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
      ['typicalTechniques', 1, 'same_tag', 'tag-gcd-diophantine'],
      ['typicalTechniques', 2, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 2, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-event-sweep'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc439-e': decision('outcome-design-order-preserving-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
  ]),
  'abc439-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
      ['typicalTechniques', 2, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 2, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc439-g': decision(
    'outcome-evaluate-and-compose-polynomials',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'same_tag', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
    [
      'outcome-encode-counting-by-generating-function',
      'outcome-apply-formal-power-series-operations',
    ],
  ),
  'abc440-e': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
    ['typicalTechniques', 1, 'same_tag', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc440-f': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'primary', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc440-g': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 2, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-state-equivalence'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-augment-components-with-metadata'],
    },
  ),
  'abc441-e': decision(
    'outcome-linearize-static-range-information',
    [
      ['typicalTechniques', 0, 'primary', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc441-f': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc441-g': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc442-e': decision('outcome-reduce-geometry-to-algebraic-predicates', [
    ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
  ]),
  'abc442-f': decision('outcome-factor-and-accelerate-transitions', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
  ]),
  'abc442-g': decision('outcome-enumerate-bounded-candidates-or-cases', [
    ['typicalTechniques', 0, 'primary', 'tag-bounded-enumeration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-bounded-enumeration'],
  ]),
  'abc443-e': decision('outcome-design-grid-table-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-grid-table-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-grid-table-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-grid-table-dp'],
  ]),
  'abc443-f': decision(
    'outcome-select-state-graph-search',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
      ['typicalTechniques', 0, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-constructive-witness'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
    },
  ),
  'abc443-g': decision('outcome-partition-integer-parameter-ranges', [
    ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
    ['typicalTechniques', 1, 'same_tag', 'tag-integer-boundary-blocks'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-integer-boundary-blocks'],
  ]),
  'abc444-e': decision(
    'outcome-maintain-monotone-window',
    [
      ['typicalTechniques', 0, 'primary', 'tag-two-pointers-window'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc444-f': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-integer-boundary-blocks'],
    ],
    {
      'tag-integer-boundary-blocks': ['outcome-evaluate-compressed-integer-blocks'],
    },
  ),
  'abc444-g': decision(
    'outcome-decompose-by-prime-or-divisor',
    [
      ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-functional-graph-doubling'],
    ],
    {
      'tag-functional-graph-doubling': ['outcome-decompose-functional-graph'],
    },
  ),
  'abc445-e': decision('outcome-decompose-by-prime-or-divisor', [
    ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
  ]),
  'abc445-f': decision('outcome-accelerate-fixed-linear-transition', [
    ['typicalTechniques', 0, 'primary', 'tag-linear-recurrence-matrix'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-recurrence-matrix'],
  ]),
  'abc445-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-gcd-diophantine'],
      ['typicalTechniques', 1, 'supporting', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bipartite-structure'],
    ],
    {
      'tag-gcd-diophantine': ['outcome-reduce-integer-structure-by-gcd'],
      'tag-bipartite-structure': ['outcome-color-and-classify-bipartite-components'],
    },
  ),
  'abc446-e': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc446-f': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
    ['typicalTechniques', 1, 'same_tag', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc446-g': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-transition-acceleration'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
    },
  ),
  'abc447-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
    },
  ),
  'abc447-f': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc447-g': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-event-sweep'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc448-e': decision('outcome-accelerate-fixed-linear-transition', [
    ['typicalTechniques', 0, 'primary', 'tag-linear-recurrence-matrix'],
    ['typicalTechniques', 1, 'same_tag', 'tag-linear-recurrence-matrix'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-recurrence-matrix'],
  ]),
  'abc448-f': decision('outcome-recover-valid-witness', [
    ['typicalTechniques', 0, 'primary', 'tag-constructive-witness'],
    ['typicalTechniques', 1, 'same_tag', 'tag-constructive-witness'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-constructive-witness'],
  ]),
  'abc448-g': decision(
    'outcome-optimize-by-line-envelope',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convex-hull-trick'],
      ['typicalTechniques', 1, 'supporting', 'tag-witness-impact-localization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convex-hull-trick'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-witness-impact-localization'],
    ],
    {
      'tag-witness-impact-localization': ['outcome-localize-change-impact-by-witness'],
    },
  ),
  'abc449-e': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc449-f': decision('outcome-linearize-events', [
    ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
    ['typicalTechniques', 1, 'same_tag', 'tag-event-sweep'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
  ]),
  'abc449-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
    ],
    {},
    ['outcome-apply-formal-power-series-operations'],
  ),
  'abc450-e': decision('outcome-query-recursively-defined-string', [
    ['typicalTechniques', 0, 'primary', 'tag-recursive-compressed-string'],
    ['typicalTechniques', 1, 'same_tag', 'tag-recursive-compressed-string'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-recursive-compressed-string'],
  ]),
  'abc450-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-lazy-segment-action'],
    ],
    {
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
    },
  ),
  'abc450-g': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'primary', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc451-e': decision('outcome-reconstruct-tree-from-distance-matrix', [
    ['typicalTechniques', 0, 'primary', 'tag-additive-tree-metric-reconstruction'],
    ['typicalTechniques', 1, 'same_tag', 'tag-additive-tree-metric-reconstruction'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-additive-tree-metric-reconstruction'],
  ]),
  'abc451-f': decision(
    'outcome-color-and-classify-bipartite-components',
    [
      ['typicalTechniques', 0, 'primary', 'tag-bipartite-structure'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-dsu-connectivity': ['outcome-augment-components-with-metadata'],
    },
  ),
  'abc451-g': decision(
    'outcome-minimize-xor-coset-representative',
    [
      ['typicalTechniques', 0, 'primary', 'tag-xor-linear-basis'],
      ['typicalTechniques', 0, 'supporting', 'tag-cycle-space-basis'],
      ['typicalTechniques', 1, 'supporting', 'tag-binary-trie'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-xor-linear-basis'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-cycle-space-basis'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-binary-trie'],
    ],
    {
      'tag-binary-trie': ['outcome-query-bitwise-order-with-trie'],
      'tag-cycle-space-basis': ['outcome-map-graph-cycle-xor-to-span'],
    },
  ),
  'abc452-e': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc452-f': decision(
    'outcome-maintain-monotone-window',
    [
      ['typicalTechniques', 0, 'primary', 'tag-two-pointers-window'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc452-g': decision('outcome-build-suffix-lcp-index', [
    ['typicalTechniques', 0, 'problem_specific'],
    ['typicalTechniques', 1, 'primary', 'tag-suffix-lcp-index'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-suffix-lcp-index'],
  ]),
  'abc453-e': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
  ),
  'abc453-f': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-tree-balanced-separator'],
      ['typicalTechniques', 1, 'primary', 'tag-constructive-witness'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-balanced-separator'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-tree-balanced-separator': ['outcome-build-balanced-separator-decomposition'],
    },
  ),
  'abc453-g': decision(
    'outcome-share-or-revert-versions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-persistent-rollback'],
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-persistent-rollback'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc454-e': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-bipartite-structure'],
      ['typicalTechniques', 1, 'primary', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-constructive-witness'],
    ],
    { 'tag-bipartite-structure': ['outcome-color-and-classify-bipartite-components'] },
  ),
  'abc454-f': decision(
    'outcome-linearize-static-range-information',
    [
      ['typicalTechniques', 0, 'primary', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc454-g': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
    ['typicalTechniques', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc455-e': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc455-f': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc455-g': decision(
    'outcome-compare-objects-by-fingerprint',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-hash-equality'],
      ['typicalTechniques', 0, 'supporting', 'tag-randomized-algorithm'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-hash-equality'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-randomized-algorithm'],
    ],
    {
      'tag-two-pointers-window': ['outcome-maintain-monotone-window'],
      'tag-randomized-algorithm': ['outcome-design-and-bound-randomized-algorithm'],
    },
  ),
  'abc456-e': decision('outcome-condense-and-order-directed-graph', [
    ['typicalTechniques', 0, 'same_tag', 'tag-directed-condensation-toposort'],
    ['typicalTechniques', 1, 'primary', 'tag-directed-condensation-toposort'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-directed-condensation-toposort'],
  ]),
  'abc456-f': decision(
    'outcome-maintain-queue-aggregate-with-swag',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-semiring-matrix-exponentiation'],
      ['typicalTechniques', 1, 'primary', 'tag-swag'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-swag'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-semiring-matrix-exponentiation'],
    ],
    {
      'tag-semiring-matrix-exponentiation': ['outcome-exponentiate-transition-over-semiring'],
    },
  ),
  'abc456-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['implementationConcerns', 0, 'supporting', 'tag-dynamic-modular-product'],
      ['typicalTechniques', 1, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-dynamic-modular-product': ['outcome-maintain-modular-product-under-factor-updates'],
    },
  ),
  'abc457-e': decision('outcome-prove-greedy-order', [
    ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
    ['typicalTechniques', 1, 'same_tag', 'tag-greedy-exchange-order'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
  ]),
  'abc457-f': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
    },
  ),
  'abc457-g': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 1, 'primary', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-geometry-orientation-transform'],
    ],
    {
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
    },
  ),
  'abc458-e': decision('outcome-formulate-combinatorial-coefficients', [
    ['typicalTechniques', 0, 'same_tag', 'tag-combinatorial-coefficients'],
    ['typicalTechniques', 1, 'primary', 'tag-combinatorial-coefficients'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
  ]),
  'abc458-f': decision(
    'outcome-build-multi-pattern-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-linear-recurrence-matrix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-linear-recurrence-matrix'],
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
    },
  ),
  'abc458-g': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
    },
  ),
  'abc459-e': decision(
    'outcome-aggregate-rooted-tree',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
  ),
  'abc459-f': decision('outcome-prune-dominated-candidates-once', [
    ['typicalTechniques', 0, 'primary', 'tag-monotone-stack-queue'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monotone-stack-queue'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-stack-queue'],
  ]),
  'abc459-g': decision(
    'outcome-characterize-integer-solvability',
    [
      ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
      ['typicalTechniques', 1, 'supporting', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
    },
  ),
  'abc460-e': decision(
    'outcome-solve-modular-constraints',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-modular-crt'],
      ['typicalTechniques', 1, 'primary', 'tag-modular-crt'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-modular-crt'],
    ],
    {},
  ),
  'abc460-f': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 0, 'supporting', 'tag-tree-metric-diameter'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-metric-diameter'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-path-decomposition'],
    ],
    {
      'tag-tree-metric-diameter': ['outcome-use-tree-diameter-extrema'],
      'tag-tree-path-decomposition': ['outcome-answer-tree-ancestor-queries'],
    },
  ),
  'abc460-g': decision(
    'outcome-compose-dynamic-tree-clusters',
    [
      ['typicalTechniques', 0, 'primary', 'tag-static-top-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-static-top-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-aggregation-reroot'],
    ],
    {
      'tag-tree-aggregation-reroot': ['outcome-reroot-tree-aggregation'],
    },
  ),
  'abc461-e': decision('outcome-maintain-weighted-prefix-statistics', [
    ['typicalTechniques', 0, 'primary', 'tag-fenwick-weighted-prefix'],
    ['typicalTechniques', 1, 'same_tag', 'tag-fenwick-weighted-prefix'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-fenwick-weighted-prefix'],
  ]),
  'abc461-f': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
      ['typicalTechniques', 0, 'supporting', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prime-divisor-decomposition'],
    ],
    {
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc461-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc462-e': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
    },
  ),
  'abc462-f': decision('outcome-design-minimal-sufficient-state', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
  ]),
  'abc462-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-convolution-fps'],
    ],
    {
      'tag-convolution-fps': [
        'outcome-encode-counting-by-generating-function',
        'outcome-compute-convolution-or-correlation',
      ],
    },
  ),
  'abc463-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc463-f': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
    },
  ),
  'abc463-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      ['typicalTechniques', 0, 'primary', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'supporting', 'tag-mo-offline-range'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-mo-offline-range'],
    ],
    {
      'tag-mo-offline-range': ['outcome-schedule-range-query-updates'],
    },
  ),
  'abc464-e': decision(
    'outcome-reverse-update-time',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reverse-offline'],
      ['typicalTechniques', 1, 'supporting', 'tag-grid-table-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reverse-offline'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-grid-table-dp'],
    ],
    {
      'tag-grid-table-dp': ['outcome-design-grid-table-dp'],
    },
  ),
  'abc464-f': decision(
    'outcome-split-enumeration-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc464-g': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc465-e': decision('outcome-count-prefix-constrained-objects', [
    ['typicalTechniques', 0, 'primary', 'tag-digit-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-digit-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-digit-dp'],
  ]),
  'abc465-f': decision(
    'outcome-linearize-static-range-information',
    [
      ['typicalTechniques', 0, 'primary', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'same_tag', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prefix-difference'],
    ],
    {},
  ),
  'abc465-g': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc466-e': decision(
    'outcome-design-interval-split-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-interval-partition-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-interval-partition-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc466-f': decision('outcome-bound-monotone-total-work', [
    ['typicalTechniques', 0, 'problem_specific'],
    ['typicalTechniques', 1, 'primary', 'tag-amortized-monotone-progress'],
    ['prerequisiteCandidates', 0, 'problem_specific'],
  ]),
  'abc466-g': decision(
    'outcome-design-carry-or-mixed-radix-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'primary', 'tag-carry-mixed-radix-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
    ],
    {},
    ['outcome-maintain-potential-differences'],
  ),
} as const satisfies Readonly<Record<string, ExplicitTaxonomyClaimDecision>>;
