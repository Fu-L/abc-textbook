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
  collection: 'typicalTechniques' | 'prerequisiteCandidates',
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
 * Source-backed claim dispositions for every reviewed ABC300--ABC383 inventory record.
 *
 * These decisions are deliberately explicit. Search/recall terms are not classification
 * evidence: every primary/supporting edge below follows the meaning of the corresponding
 * reviewed claim, while the common learner prerequisites in spec.md remain baseline.
 */
export const FINAL_TAXONOMY_CLAIM_DECISIONS_300_383 = {
  'abc300-e': decision('outcome-solve-stochastic-recurrence', [
    ['typicalTechniques', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
    ['typicalTechniques', 1, 'primary', 'tag-stochastic-expectation-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
  ]),
  'abc300-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-linear-recurrence-matrix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
    ],
    {
      'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc300-f': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'primary', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'baseline'],
    ],
    { 'tag-prefix-difference': ['outcome-linearize-static-range-information'] },
  ),
  'abc300-g': decision(
    'outcome-split-enumeration-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-two-pointers-window'],
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc301-e': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc301-ex': decision(
    'outcome-identify-bridges-and-articulations',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 0, 'primary', 'tag-kruskal-threshold-sweep'],
      ['typicalTechniques', 1, 'primary', 'tag-lowlink-critical-structure'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lowlink-critical-structure'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
    ['outcome-sweep-connectivity-by-kruskal-threshold'],
  ),
  'abc301-f': decision(
    'outcome-build-finite-string-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc301-g': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
    },
  ),
  'abc302-e': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'baseline'],
    ['typicalTechniques', 1, 'primary', 'tag-amortized-heavy-light'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc302-ex': decision(
    'outcome-share-or-revert-versions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-persistent-rollback'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-persistent-rollback'],
    ],
    { 'tag-dsu-connectivity': ['outcome-augment-components-with-metadata'] },
  ),
  'abc302-f': decision('outcome-select-state-graph-search', [
    ['typicalTechniques', 0, 'same_tag', 'tag-reachability-bfs'],
    ['typicalTechniques', 1, 'primary', 'tag-reachability-bfs'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
  ]),
  'abc302-g': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bounded-enumeration'],
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc303-e': decision(
    'outcome-use-tree-diameter-extrema',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-metric-diameter'],
      ['typicalTechniques', 1, 'problem_specific'],
      ['prerequisiteCandidates', 0, 'baseline'],
    ],
    {},
  ),
  'abc303-ex': decision(
    'outcome-compute-convolution-or-correlation',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      [
        'prerequisiteCandidates',
        0,
        'supporting',
        'tag-combinatorial-coefficients',
        'tag-modular-arithmetic',
      ],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc303-f': decision('outcome-prove-and-search-threshold', [
    ['typicalTechniques', 0, 'same_tag', 'tag-monotone-threshold-search'],
    ['typicalTechniques', 1, 'primary', 'tag-monotone-threshold-search'],
    ['prerequisiteCandidates', 0, 'baseline'],
  ]),
  'abc303-g': decision(
    'outcome-evaluate-adversarial-game-value',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-value-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-stack-queue'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-game-value-dp'],
    ],
    { 'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'] },
  ),
  'abc304-e': decision('outcome-maintain-connectivity-components', [
    ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
    ['typicalTechniques', 1, 'baseline'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
  ]),
  'abc304-ex': decision(
    'outcome-condense-and-order-directed-graph',
    [
      ['typicalTechniques', 0, 'primary', 'tag-directed-condensation-toposort'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-directed-condensation-toposort'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc304-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'primary', 'tag-inclusion-exclusion'],
      [
        'prerequisiteCandidates',
        0,
        'supporting',
        'tag-modular-arithmetic',
        'tag-prime-divisor-decomposition',
      ],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc304-g': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'primary', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
  'abc305-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc305-ex': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-interval-partition-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-interval-partition-dp': ['outcome-design-interval-split-dp'],
    },
  ),
  'abc305-f': decision(
    'outcome-select-state-graph-search',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs', 'tag-interactive-protocol'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'baseline'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-interactive-protocol'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
    },
    ['outcome-maintain-interactive-query-protocol'],
  ),
  'abc305-g': decision(
    'outcome-build-finite-string-automaton',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-linear-recurrence-matrix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-automata'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-linear-recurrence-matrix'],
    ],
    { 'tag-linear-recurrence-matrix': ['outcome-accelerate-fixed-linear-transition'] },
  ),
  'abc306-e': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
    ['typicalTechniques', 1, 'same_tag', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc306-ex': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 0, 'supporting', 'tag-dag-topological-processing'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dag-topological-processing'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-dag-topological-processing': ['outcome-process-dag-in-topological-order'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc306-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      [
        'typicalTechniques',
        1,
        'supporting',
        'tag-coordinate-compression',
        'tag-fenwick-weighted-prefix',
        'tag-event-sweep',
      ],
      [
        'prerequisiteCandidates',
        0,
        'supporting',
        'tag-coordinate-compression',
        'tag-fenwick-weighted-prefix',
      ],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc306-g': decision(
    'outcome-reduce-integer-structure-by-gcd',
    [
      ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
      ['typicalTechniques', 0, 'supporting', 'tag-directed-condensation-toposort'],
      ['typicalTechniques', 1, 'supporting', 'tag-directed-condensation-toposort'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-directed-condensation-toposort'],
    ],
    {
      'tag-directed-condensation-toposort': ['outcome-condense-and-order-directed-graph'],
    },
    ['outcome-bound-reachability-in-numerical-semigroup'],
  ),
  'abc307-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
    ],
    { 'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'] },
  ),
  'abc307-ex': decision('outcome-compute-convolution-or-correlation', [
    ['typicalTechniques', 0, 'same_tag', 'tag-convolution-fps'],
    ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
  ]),
  'abc307-f': decision(
    'outcome-model-and-compute-shortest-path',
    [
      ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
      ['typicalTechniques', 0, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc307-g': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 1, 'primary', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ],
    { 'tag-prefix-difference': ['outcome-linearize-static-range-information'] },
  ),
  'abc308-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc308-ex': decision(
    'outcome-build-shortest-path-certificate',
    [
      ['typicalTechniques', 0, 'primary', 'tag-shortest-path-certificate'],
      ['typicalTechniques', 0, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'problem_specific'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path-certificate'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc308-f': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
    ],
    {
      'tag-event-sweep': ['outcome-linearize-events'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc308-g': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'same_tag', 'tag-ordered-set-heap'],
    ['typicalTechniques', 1, 'primary', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc309-e': decision(
    'outcome-aggregate-rooted-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc309-ex': decision('outcome-compute-convolution-or-correlation', [
    ['typicalTechniques', 0, 'problem_specific'],
    ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
  ]),
  'abc309-f': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc309-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-frontier-profile-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
      'tag-frontier-profile-dp': ['outcome-design-frontier-profile-dp'],
    },
  ),
  'abc310-e': decision('outcome-design-minimal-sufficient-state', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-state-equivalence'],
  ]),
  'abc310-ex': decision(
    'outcome-stabilize-unbounded-knapsack-by-best-density',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-eventual-unbounded-knapsack'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-eventual-unbounded-knapsack'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-knapsack-resource'],
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc310-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-stochastic-expectation-dp': ['outcome-solve-stochastic-recurrence'],
    },
  ),
  'abc310-g': decision(
    'outcome-jump-deterministic-transition',
    [
      ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
      ['typicalTechniques', 1, 'same_tag', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-modular-arithmetic'],
    ],
    { 'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'] },
  ),
  'abc311-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'primary', 'tag-grid-table-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-grid-table-dp'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-state-equivalence'],
    ],
    {},
    ['outcome-design-grid-table-dp'],
  ),
  'abc311-ex': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
      'tag-tree-aggregation-reroot': ['outcome-reroot-tree-aggregation'],
    },
  ),
  'abc311-f': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'problem_specific'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dp-transition-acceleration'],
    ],
    { 'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'] },
  ),
  'abc311-g': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dsu-connectivity'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc312-e': decision('outcome-reduce-geometry-to-algebraic-predicates', [
    ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc312-ex': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-matching-automata'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-matching-automata'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-amortized-heavy-light'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-prefix-matching-automata': ['outcome-build-prefix-match-state'],
    },
  ),
  'abc312-f': decision('outcome-prove-greedy-order', [
    ['typicalTechniques', 0, 'same_tag', 'tag-greedy-exchange-order'],
    ['typicalTechniques', 1, 'primary', 'tag-greedy-exchange-order'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-greedy-exchange-order'],
  ]),
  'abc312-g': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc313-e': decision('outcome-query-recursively-defined-string', [
    ['typicalTechniques', 0, 'primary', 'tag-recursive-compressed-string'],
    ['typicalTechniques', 1, 'same_tag', 'tag-recursive-compressed-string'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-recursive-compressed-string'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc313-ex': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-flow-matching-cut'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-flow-matching-cut': ['outcome-reduce-selection-to-network-optimization'],
    },
  ),
  'abc313-f': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-subset-bitmask-transform'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'],
    },
  ),
  'abc313-g': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-integer-boundary-blocks'],
    ],
    { 'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'] },
  ),
  'abc314-e': decision('outcome-solve-stochastic-recurrence', [
    ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-stochastic-expectation-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc314-ex': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-geometry-orientation-transform'],
    ],
    { 'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'] },
  ),
  'abc314-f': decision(
    'outcome-augment-components-with-metadata',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
      [
        'prerequisiteCandidates',
        1,
        'supporting',
        'tag-modular-arithmetic',
        'tag-tree-aggregation-reroot',
      ],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
    },
  ),
  'abc314-g': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-two-pointers-window': ['outcome-maintain-monotone-window'],
    },
  ),
  'abc315-e': decision('outcome-condense-and-order-directed-graph', [
    ['typicalTechniques', 0, 'same_tag', 'tag-directed-condensation-toposort'],
    ['typicalTechniques', 1, 'primary', 'tag-directed-condensation-toposort'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-directed-condensation-toposort'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc315-ex': decision(
    'outcome-compute-convolution-or-correlation',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
    ],
    {},
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc315-f': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'primary', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
    ],
    {
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
    },
  ),
  'abc315-g': decision(
    'outcome-characterize-integer-solvability',
    [
      ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-integer-boundary-blocks'],
    ],
    { 'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'] },
  ),
  'abc317-e': decision(
    'outcome-precompute-directional-grid-effects',
    [
      ['typicalTechniques', 0, 'primary', 'tag-directional-grid-effect-scan'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-directional-grid-effect-scan'],
    ],
    { 'tag-reachability-bfs': ['outcome-select-state-graph-search'] },
  ),
  'abc317-ex': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
    ],
    { 'tag-divide-enumerate': ['outcome-divide-search-space-recursively'] },
    ['outcome-apply-formal-power-series-operations', 'outcome-compute-convolution-or-correlation'],
  ),
  'abc317-f': decision(
    'outcome-count-prefix-constrained-objects',
    [
      ['typicalTechniques', 0, 'primary', 'tag-digit-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-digit-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-digit-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-inclusion-exclusion'],
    ],
    { 'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'] },
  ),
  'abc317-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 1, 'problem_specific'],
    ],
    {},
    ['outcome-characterize-bipartite-feasibility-by-hall'],
  ),
  'abc318-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc318-ex': decision(
    'outcome-count-labeled-structures-by-components',
    [
      ['typicalTechniques', 0, 'primary', 'tag-labeled-component-decomposition'],
      ['typicalTechniques', 0, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-labeled-component-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-convolution-fps'],
    ],
    { 'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'] },
    ['outcome-apply-formal-power-series-operations'],
  ),
  'abc318-f': decision(
    'outcome-partition-integer-parameter-ranges',
    [
      ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-integer-boundary-blocks'],
    ],
    {
      'tag-flow-matching-cut': ['outcome-characterize-bipartite-feasibility-by-hall'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc318-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc319-e': decision('outcome-exploit-modular-periodicity', [
    ['typicalTechniques', 0, 'primary', 'tag-modular-crt'],
    ['typicalTechniques', 1, 'same_tag', 'tag-modular-crt'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-modular-crt'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc319-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 2, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 1, 'baseline'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc319-g': decision(
    'outcome-select-state-graph-search',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 2, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-reachability-bfs'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc320-e': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-multiset'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-ordered-set-multiset'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-event-sweep'],
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-ordered-set-multiset': ['outcome-maintain-ordered-set-statistics'],
    },
  ),
  'abc320-f': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['typicalTechniques', 2, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 2, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc320-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 2, 'supporting', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 3, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-modular-crt'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-modular-crt': ['outcome-exploit-modular-periodicity'],
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc321-e': decision('outcome-count-implicit-binary-tree-layers', [
    ['typicalTechniques', 0, 'primary', 'tag-implicit-binary-tree-arithmetic'],
    ['typicalTechniques', 1, 'same_tag', 'tag-implicit-binary-tree-arithmetic'],
    ['typicalTechniques', 2, 'same_tag', 'tag-implicit-binary-tree-arithmetic'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-implicit-binary-tree-arithmetic'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-implicit-binary-tree-arithmetic'],
    ['prerequisiteCandidates', 2, 'baseline'],
  ]),
  'abc321-f': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['typicalTechniques', 2, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 2, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc321-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 2, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-subset-bitmask-transform'],
      [
        'prerequisiteCandidates',
        3,
        'supporting',
        'tag-combinatorial-coefficients',
        'tag-modular-arithmetic',
      ],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc322-e': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 2, 'primary', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-dp-state-equivalence'],
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc322-f': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
      ['typicalTechniques', 2, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-monoid-segment-tree'],
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
  'abc322-g': decision(
    'outcome-decompose-by-prime-or-divisor',
    [
      ['typicalTechniques', 0, 'primary', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 2, 'problem_specific'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-greedy-exchange-order'],
    ],
    { 'tag-greedy-exchange-order': ['outcome-prove-greedy-order'] },
  ),
  'abc323-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-stochastic-expectation-dp'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc323-f': decision(
    'outcome-normalize-equivalent-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 2, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-symmetry-invariant-normalization'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-geometry-orientation-transform': ['outcome-reduce-geometry-to-algebraic-predicates'],
    },
  ),
  'abc323-g': decision(
    'outcome-count-combinatorial-objects-by-determinant',
    [
      ['typicalTechniques', 0, 'primary', 'tag-determinant-counting'],
      ['typicalTechniques', 1, 'same_tag', 'tag-determinant-counting'],
      ['typicalTechniques', 2, 'supporting', 'tag-polynomial-taylor-shift'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-determinant-counting'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-determinant-counting'],
      ['prerequisiteCandidates', 3, 'supporting', 'tag-polynomial-taylor-shift'],
    ],
    {
      'tag-polynomial-taylor-shift': ['outcome-shift-polynomial-by-factorial-convolution'],
      'tag-linear-algebra-xor': ['outcome-transform-to-linear-system-or-rank'],
    },
  ),
  'abc324-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'same_tag', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'primary', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'baseline'],
  ]),
  'abc324-f': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-directed-condensation-toposort'],
      ['typicalTechniques', 2, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-directed-condensation-toposort'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-directed-condensation-toposort': ['outcome-condense-and-order-directed-graph'],
    },
  ),
  'abc324-g': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 2, 'same_tag', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 3, 'supporting', 'tag-ordered-set-heap'],
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc325-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
    ['typicalTechniques', 2, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc325-f': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['typicalTechniques', 2, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 2, 'baseline'],
  ]),
  'abc325-g': decision('outcome-design-interval-split-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-interval-partition-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-interval-partition-dp'],
    ['typicalTechniques', 2, 'same_tag', 'tag-interval-partition-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-interval-partition-dp'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-interval-partition-dp'],
  ]),
  'abc326-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc326-f': decision(
    'outcome-split-enumeration-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'same_tag', 'tag-divide-enumerate'],
      ['typicalTechniques', 2, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-constructive-witness'],
    ],
    { 'tag-constructive-witness': ['outcome-recover-valid-witness'] },
  ),
  'abc326-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['typicalTechniques', 2, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 2, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc327-e': decision('outcome-design-order-preserving-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
    ['prerequisiteCandidates', 1, 'problem_specific'],
  ]),
  'abc327-f': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['typicalTechniques', 2, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-event-sweep'],
    ],
    { 'tag-lazy-segment-action': ['outcome-design-range-update-action'] },
  ),
  'abc327-g': decision(
    'outcome-formulate-combinatorial-coefficients',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 1, 'supporting', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 2, 'primary', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 2, 'supporting', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 3, 'same_tag', 'tag-combinatorial-coefficients'],
      ['typicalTechniques', 3, 'supporting', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-bipartite-structure'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 3, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-bipartite-structure': ['outcome-color-and-classify-bipartite-components'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc328-e': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      ['typicalTechniques', 0, 'primary', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 2, 'same_tag', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'baseline'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-dsu-connectivity'],
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc328-f': decision('outcome-maintain-potential-differences', [
    ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
    ['typicalTechniques', 1, 'same_tag', 'tag-dsu-connectivity'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-dsu-connectivity'],
    ['prerequisiteCandidates', 2, 'same_tag', 'tag-dsu-connectivity'],
  ]),
  'abc328-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 2, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-subset-bitmask-transform'],
    ],
    { 'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'] },
  ),
  'abc329-e': decision(
    'outcome-reverse-update-time',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reverse-offline'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['typicalTechniques', 2, 'same_tag', 'tag-reverse-offline'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-reverse-offline'],
    ],
    { 'tag-reachability-bfs': ['outcome-select-state-graph-search'] },
  ),
  'abc329-f': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
    ['typicalTechniques', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc329-g': decision(
    'outcome-aggregate-rooted-tree',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 2, 'primary', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 3, 'same_tag', 'tag-tree-aggregation-reroot'],
    ],
    { 'tag-tree-path-decomposition': ['outcome-answer-tree-ancestor-queries'] },
  ),
  'abc330-e': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'problem_specific'],
    ['typicalTechniques', 1, 'primary', 'tag-ordered-set-heap'],
    ['typicalTechniques', 2, 'same_tag', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'problem_specific'],
    ['prerequisiteCandidates', 1, 'baseline'],
    ['prerequisiteCandidates', 2, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc330-f': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'same_tag', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 2, 'supporting', 'tag-prefix-difference'],
      ['typicalTechniques', 3, 'supporting', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 1, 'baseline'],
      ['prerequisiteCandidates', 2, 'supporting', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc330-g': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
      ['typicalTechniques', 2, 'same_tag', 'tag-contribution-reordering'],
      ['typicalTechniques', 3, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'problem_specific'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 2, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 3, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc331-e': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'same_tag', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc331-f': decision(
    'outcome-design-associative-range-summary',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 0, 'supporting', 'tag-string-hash-equality'],
      ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-string-hash-equality'],
    ],
    { 'tag-string-hash-equality': ['outcome-compare-objects-by-fingerprint'] },
  ),
  'abc331-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 2, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-convolution-fps'],
    ],
    {
      'tag-convolution-fps': ['outcome-compute-convolution-or-correlation'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc332-e': decision('outcome-enumerate-subset-state-space', [
    ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-subset-bitmask-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
    ['prerequisiteCandidates', 1, 'problem_specific'],
  ]),
  'abc332-f': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-lazy-segment-action'],
    ],
    {
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc332-g': decision(
    'outcome-reduce-selection-to-network-optimization',
    [
      ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['typicalTechniques', 2, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-event-sweep'],
    ],
    {
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc333-e': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'primary', 'tag-constructive-witness'],
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-prefix-difference'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-difference'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc333-f': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc333-g': decision('outcome-approximate-rational-by-euclid', [
    ['typicalTechniques', 0, 'primary', 'tag-gcd-diophantine'],
    ['typicalTechniques', 1, 'same_tag', 'tag-gcd-diophantine'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
  ]),
  'abc334-e': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'baseline'],
      ['typicalTechniques', 1, 'primary', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc334-f': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-stack-queue'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-stack-queue'],
    ],
    {
      'tag-monotone-stack-queue': ['outcome-prune-dominated-candidates-once'],
    },
  ),
  'abc334-g': decision('outcome-identify-bridges-and-articulations', [
    ['typicalTechniques', 0, 'primary', 'tag-lowlink-critical-structure'],
    ['typicalTechniques', 1, 'same_tag', 'tag-lowlink-critical-structure'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lowlink-critical-structure'],
  ]),
  'abc335-e': decision(
    'outcome-maintain-connectivity-components',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-dag-topological-processing'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
    ],
    {
      'tag-dag-topological-processing': ['outcome-process-dag-in-topological-order'],
    },
  ),
  'abc335-f': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
    ['typicalTechniques', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc335-g': decision(
    'outcome-count-through-cyclic-exponents',
    [
      ['typicalTechniques', 0, 'primary', 'tag-cyclic-group-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-divisor-mobius-inversion'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-cyclic-group-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divisor-mobius-inversion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-divisor-mobius-inversion': ['outcome-invert-divisor-lattice-by-mobius'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
    ['outcome-find-period-by-multiplicative-order'],
  ),
  'abc336-e': decision('outcome-count-prefix-constrained-objects', [
    ['typicalTechniques', 0, 'primary', 'tag-digit-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-digit-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-digit-dp'],
  ]),
  'abc336-f': decision(
    'outcome-split-enumeration-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-divide-enumerate'],
    ],
    { 'tag-reachability-bfs': ['outcome-select-state-graph-search'] },
  ),
  'abc336-g': decision(
    'outcome-count-combinatorial-objects-by-determinant',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-euler-degree-parity'],
      ['typicalTechniques', 1, 'primary', 'tag-determinant-counting'],
      ['typicalTechniques', 1, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-determinant-counting'],
      [
        'prerequisiteCandidates',
        0,
        'supporting',
        'tag-combinatorial-coefficients',
        'tag-euler-degree-parity',
        'tag-modular-arithmetic',
      ],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-euler-degree-parity': ['outcome-characterize-walk-by-degrees'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
    },
  ),
  'abc337-e': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-interactive-protocol'],
    ],
    { 'tag-interactive-protocol': ['outcome-maintain-interactive-query-protocol'] },
  ),
  'abc337-f': decision('outcome-maintain-monotone-window', [
    ['typicalTechniques', 0, 'same_tag', 'tag-two-pointers-window'],
    ['typicalTechniques', 1, 'primary', 'tag-two-pointers-window'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-two-pointers-window'],
  ]),
  'abc337-g': decision(
    'outcome-flatten-tree-by-euler-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc338-e': decision('outcome-reduce-geometry-to-algebraic-predicates', [
    ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
    ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
  ]),
  'abc338-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    {
      'tag-shortest-path': ['outcome-model-and-compute-shortest-path'],
    },
  ),
  'abc338-g': decision('outcome-factor-and-accelerate-transitions', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
    ['typicalTechniques', 1, 'same_tag', 'tag-dp-transition-acceleration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
  ]),
  'abc339-e': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc339-f': decision(
    'outcome-compare-objects-by-fingerprint',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-hash-equality'],
      ['typicalTechniques', 0, 'supporting', 'tag-randomized-algorithm'],
      ['typicalTechniques', 1, 'same_tag', 'tag-string-hash-equality'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-hash-equality'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-randomized-algorithm'],
    ],
    { 'tag-randomized-algorithm': ['outcome-design-and-bound-randomized-algorithm'] },
  ),
  'abc339-g': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc340-e': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'same_tag', 'tag-lazy-segment-action'],
    ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc340-f': decision('outcome-characterize-integer-solvability', [
    ['typicalTechniques', 0, 'same_tag', 'tag-gcd-diophantine'],
    ['typicalTechniques', 1, 'primary', 'tag-gcd-diophantine'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-gcd-diophantine'],
  ]),
  'abc340-g': decision(
    'outcome-build-virtual-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-path-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-path-decomposition'],
    ],
    { 'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'] },
  ),
  'abc341-e': decision(
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
  'abc341-f': decision(
    'outcome-design-resource-dp',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dag-topological-processing'],
      ['typicalTechniques', 1, 'primary', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ],
    {
      'tag-dag-topological-processing': ['outcome-process-dag-in-topological-order'],
    },
  ),
  'abc341-g': decision('outcome-optimize-by-line-envelope', [
    ['typicalTechniques', 0, 'same_tag', 'tag-convex-hull-trick'],
    ['typicalTechniques', 1, 'primary', 'tag-convex-hull-trick'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-convex-hull-trick'],
  ]),
  'abc342-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'same_tag', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc342-f': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 0, 'supporting', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'primary', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
    ],
    {
      'tag-dp-transition-acceleration': ['outcome-factor-and-accelerate-transitions'],
    },
  ),
  'abc342-g': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'primary', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-decompose-ranges-into-segment-tree-nodes'],
    },
  ),
  'abc343-e': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'supporting', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-inclusion-exclusion'],
    ],
    {
      'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'],
      'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'],
    },
  ),
  'abc343-f': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc343-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-prefix-matching-automata'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prefix-matching-automata'],
    ],
    { 'tag-prefix-matching-automata': ['outcome-build-prefix-match-state'] },
  ),
  'abc344-e': decision('outcome-maintain-local-sequence-links', [
    ['typicalTechniques', 0, 'primary', 'tag-linked-list-index'],
    ['typicalTechniques', 1, 'same_tag', 'tag-linked-list-index'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-linked-list-index'],
  ]),
  'abc344-f': decision('outcome-design-minimal-sufficient-state', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
    ['typicalTechniques', 1, 'problem_specific'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
  ]),
  'abc344-g': decision('outcome-linearize-events', [
    ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
    ['typicalTechniques', 1, 'same_tag', 'tag-event-sweep'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
  ]),
  'abc345-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 1, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-sequence-subsequence-dp'],
    ],
    {
      'tag-sequence-subsequence-dp': ['outcome-design-order-preserving-dp'],
    },
  ),
  'abc345-f': decision(
    'outcome-characterize-walk-by-degrees',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-euler-degree-parity'],
      ['typicalTechniques', 1, 'primary', 'tag-euler-degree-parity'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-euler-degree-parity'],
    ],
    { 'tag-constructive-witness': ['outcome-recover-valid-witness'] },
  ),
  'abc345-g': decision(
    'outcome-encode-counting-by-generating-function',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
    ['outcome-compute-convolution-or-correlation'],
  ),
  'abc346-e': decision('outcome-reverse-update-time', [
    ['typicalTechniques', 0, 'primary', 'tag-reverse-offline'],
    ['typicalTechniques', 1, 'same_tag', 'tag-reverse-offline'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-reverse-offline'],
  ]),
  'abc346-f': decision(
    'outcome-query-recursively-defined-string',
    [
      ['typicalTechniques', 0, 'primary', 'tag-recursive-compressed-string'],
      ['typicalTechniques', 1, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-recursive-compressed-string'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
    ],
    {
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc346-g': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-lazy-segment-action'],
    ],
    { 'tag-lazy-segment-action': ['outcome-design-range-update-action'] },
  ),
  'abc347-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc347-f': decision(
    'outcome-enumerate-bounded-candidates-or-cases',
    [
      ['typicalTechniques', 0, 'primary', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'supporting', 'tag-grid-table-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-grid-table-dp', 'tag-prefix-difference'],
    ],
    {
      'tag-grid-table-dp': ['outcome-design-grid-table-dp'],
      'tag-prefix-difference': ['outcome-linearize-static-range-information'],
    },
  ),
  'abc347-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc348-e': decision('outcome-reroot-tree-aggregation', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['typicalTechniques', 1, 'same_tag', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc348-f': decision('outcome-accelerate-set-operations-with-bitsets', [
    ['typicalTechniques', 0, 'primary', 'tag-bitset-word-parallel'],
    ['typicalTechniques', 1, 'same_tag', 'tag-bitset-word-parallel'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-bitset-word-parallel'],
  ]),
  'abc348-g': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 0, 'supporting', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'supporting', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
    ],
    {
      'tag-discrete-convex-marginal': ['outcome-exploit-convexity'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
  'abc349-e': decision('outcome-evaluate-adversarial-game-value', [
    ['typicalTechniques', 0, 'primary', 'tag-game-value-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-game-value-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-game-value-dp'],
  ]),
  'abc349-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 0, 'supporting', 'tag-modular-arithmetic'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc349-g': decision(
    'outcome-characterize-palindrome-intervals',
    [
      ['typicalTechniques', 0, 'primary', 'tag-palindrome-radius'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-palindrome-radius'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
    },
  ),
  'abc350-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc350-f': decision('outcome-query-recursively-defined-string', [
    ['typicalTechniques', 0, 'primary', 'tag-recursive-compressed-string'],
    ['typicalTechniques', 1, 'same_tag', 'tag-recursive-compressed-string'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-recursive-compressed-string'],
  ]),
  'abc350-g': decision('outcome-bound-total-work', [
    ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
    ['typicalTechniques', 1, 'problem_specific'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-amortized-heavy-light'],
  ]),
  'abc351-e': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'problem_specific'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc351-f': decision(
    'outcome-maintain-weighted-prefix-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 0, 'supporting', 'tag-coordinate-compression'],
      ['typicalTechniques', 0, 'supporting', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'same_tag', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-event-sweep': ['outcome-linearize-events'],
    },
  ),
  'abc351-g': decision(
    'outcome-compose-dynamic-tree-clusters',
    [
      ['typicalTechniques', 0, 'primary', 'tag-static-top-tree'],
      ['typicalTechniques', 1, 'same_tag', 'tag-static-top-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-path-decomposition'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-static-top-tree'],
    ],
    { 'tag-tree-path-decomposition': ['outcome-apply-heavy-light-decomposition'] },
  ),
  'abc352-e': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-spanning-tree-optimization'],
      ['typicalTechniques', 1, 'primary', 'tag-spanning-tree-optimization'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-spanning-tree-optimization'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dsu-connectivity'],
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc352-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'primary', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-subset-bitmask-transform'],
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-potential-differences'] },
  ),
  'abc352-g': decision(
    'outcome-compute-convolution-or-correlation',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-divide-enumerate'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
    ['outcome-encode-counting-by-generating-function'],
  ),
  'abc353-e': decision(
    'outcome-index-shared-prefixes-with-trie',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-trie-prefix'],
      ['typicalTechniques', 1, 'primary', 'tag-trie-prefix'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-trie-prefix'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-contribution-reordering'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc353-f': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-bounded-enumeration'],
      ['typicalTechniques', 1, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-geometry-orientation-transform'],
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc353-g': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-transition-acceleration'],
    ],
    { 'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'] },
  ),
  'abc354-e': decision(
    'outcome-classify-game-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-grundy-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-game-grundy-dp'],
    ],
    { 'tag-subset-bitmask-transform': ['outcome-enumerate-subset-state-space'] },
  ),
  'abc354-f': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'primary', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      [
        'prerequisiteCandidates',
        1,
        'supporting',
        'tag-coordinate-compression',
        'tag-monoid-segment-tree',
      ],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc354-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['typicalTechniques', 1, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc355-e': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-reachability-bfs'],
      ['typicalTechniques', 1, 'primary', 'tag-constructive-witness', 'tag-interactive-protocol'],
      ['typicalTechniques', 1, 'supporting', 'tag-reachability-bfs'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path-certificate'],
      ['prerequisiteCandidates', 0, 'baseline'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-interactive-protocol'],
    ],
    {
      'tag-reachability-bfs': ['outcome-select-state-graph-search'],
      'tag-shortest-path-certificate': ['outcome-build-shortest-path-certificate'],
    },
    ['outcome-maintain-interactive-query-protocol'],
  ),
  'abc355-f': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-spanning-tree-optimization'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-spanning-tree-optimization'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-dsu-connectivity'],
    ],
    { 'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'] },
  ),
  'abc355-g': decision('outcome-exploit-convexity', [
    ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
    ['typicalTechniques', 1, 'same_tag', 'tag-discrete-convex-marginal'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-discrete-convex-marginal'],
  ]),
  'abc356-e': decision('outcome-partition-integer-parameter-ranges', [
    ['typicalTechniques', 0, 'primary', 'tag-integer-boundary-blocks'],
    ['typicalTechniques', 1, 'same_tag', 'tag-integer-boundary-blocks'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-integer-boundary-blocks'],
  ]),
  'abc356-f': decision(
    'outcome-maintain-dynamic-order-statistics',
    [
      ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 2, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-monoid-segment-tree'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc356-g': decision('outcome-restrict-geometric-candidates-to-boundary', [
    ['typicalTechniques', 0, 'primary', 'tag-convex-hull-halfplane'],
    ['typicalTechniques', 1, 'same_tag', 'tag-convex-hull-halfplane'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-convex-hull-halfplane'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-convex-hull-halfplane'],
  ]),
  'abc357-e': decision('outcome-decompose-functional-graph', [
    ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
    ['typicalTechniques', 1, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-functional-graph-doubling'],
  ]),
  'abc357-f': decision(
    'outcome-design-range-update-action',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
      ['typicalTechniques', 1, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-lazy-segment-action'],
    ],
    {
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc357-g': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-combinatorial-coefficients'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-inclusion-exclusion'],
    ],
    {
      'tag-combinatorial-coefficients': ['outcome-formulate-combinatorial-coefficients'],
      'tag-convolution-fps': ['outcome-compute-convolution-or-correlation'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
  'abc358-e': decision('outcome-formulate-combinatorial-coefficients', [
    ['typicalTechniques', 0, 'primary', 'tag-combinatorial-coefficients'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-combinatorial-coefficients'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-combinatorial-coefficients'],
  ]),
  'abc358-f': decision('outcome-recover-valid-witness', [
    ['typicalTechniques', 0, 'same_tag', 'tag-constructive-witness'],
    ['typicalTechniques', 1, 'primary', 'tag-constructive-witness'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-constructive-witness'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-constructive-witness'],
  ]),
  'abc358-g': decision(
    'outcome-factor-and-accelerate-transitions',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['typicalTechniques', 1, 'primary', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-grid-table-dp'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-transition-acceleration'],
    ],
    {
      'tag-grid-table-dp': ['outcome-design-grid-table-dp'],
    },
  ),
  'abc359-e': decision('outcome-prune-dominated-candidates-once', [
    ['typicalTechniques', 0, 'primary', 'tag-monotone-stack-queue'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monotone-stack-queue'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-stack-queue'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-monotone-stack-queue'],
  ]),
  'abc359-f': decision(
    'outcome-allocate-by-convex-marginal-costs',
    [
      ['typicalTechniques', 0, 'problem_specific'],
      ['typicalTechniques', 1, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'baseline'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc359-g': decision(
    'outcome-build-balanced-separator-decomposition',
    [
      ['typicalTechniques', 0, 'primary', 'tag-tree-balanced-separator'],
      ['typicalTechniques', 1, 'supporting', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-balanced-separator'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    {
      'tag-contribution-reordering': ['outcome-reorder-counting-contributions'],
    },
  ),
  'abc360-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['typicalTechniques', 0, 'supporting', 'tag-symmetry-invariant-normalization'],
      ['typicalTechniques', 1, 'supporting', 'tag-modular-arithmetic'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-symmetry-invariant-normalization': ['outcome-normalize-equivalent-states'],
    },
  ),
  'abc360-f': decision(
    'outcome-linearize-events',
    [
      ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-lazy-segment-action'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
    },
  ),
  'abc360-g': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
      'tag-monoid-segment-tree': ['outcome-design-associative-range-summary'],
    },
  ),
  'abc361-e': decision(
    'outcome-use-tree-diameter-extrema',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'primary', 'tag-tree-metric-diameter'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-metric-diameter'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-contribution-reordering': ['outcome-reorder-counting-contributions'] },
  ),
  'abc361-f': decision(
    'outcome-correct-overlap-by-inversion',
    [
      ['typicalTechniques', 0, 'primary', 'tag-inclusion-exclusion'],
      ['typicalTechniques', 1, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-integer-boundary-blocks'],
    ],
    {
      'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'],
    },
  ),
  'abc361-g': decision(
    'outcome-select-state-graph-search',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reachability-bfs'],
      ['typicalTechniques', 1, 'supporting', 'tag-event-sweep'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reachability-bfs'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-event-sweep'],
    ],
    { 'tag-event-sweep': ['outcome-linearize-events'] },
  ),
  'abc362-e': decision('outcome-design-order-preserving-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
    ['typicalTechniques', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
  ]),
  'abc362-f': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'problem_specific'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-contribution-reordering'],
    ],
    {
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
    },
  ),
  'abc362-g': decision('outcome-build-suffix-lcp-index', [
    ['typicalTechniques', 0, 'primary', 'tag-suffix-lcp-index'],
    ['typicalTechniques', 1, 'same_tag', 'tag-suffix-lcp-index'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-suffix-lcp-index'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-suffix-lcp-index'],
  ]),
  'abc363-e': decision('outcome-model-and-compute-shortest-path', [
    ['typicalTechniques', 0, 'same_tag', 'tag-shortest-path'],
    ['typicalTechniques', 1, 'primary', 'tag-shortest-path'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-shortest-path'],
  ]),
  'abc363-f': decision(
    'outcome-recover-valid-witness',
    [
      ['typicalTechniques', 0, 'primary', 'tag-constructive-witness'],
      ['typicalTechniques', 1, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'baseline'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-prime-divisor-decomposition'],
    ],
    {
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc363-g': decision(
    'outcome-share-or-revert-versions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-persistent-rollback'],
      ['typicalTechniques', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['typicalTechniques', 1, 'supporting', 'tag-lazy-segment-action'],
      ['typicalTechniques', 1, 'supporting', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-persistent-rollback'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monoid-segment-tree'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-persistent-rollback'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-lazy-segment-action'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-flow-matching-cut'],
    ],
    {
      'tag-flow-matching-cut': ['outcome-characterize-bipartite-feasibility-by-hall'],
      'tag-lazy-segment-action': ['outcome-design-range-update-action'],
      'tag-monoid-segment-tree': ['outcome-decompose-ranges-into-segment-tree-nodes'],
    },
  ),
  'abc364-e': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc364-f': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-spanning-tree-optimization'],
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-spanning-tree-optimization'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc364-g': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-shortest-path'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc365-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc365-f': decision('outcome-design-associative-range-summary', [
    ['typicalTechniques', 0, 'primary', 'tag-monoid-segment-tree'],
    ['typicalTechniques', 1, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monoid-segment-tree'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-monoid-segment-tree'],
  ]),
  'abc365-g': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'primary', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-amortized-heavy-light'],
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc366-e': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-two-pointers-window'],
    ],
    { 'tag-two-pointers-window': ['outcome-maintain-monotone-window'] },
  ),
  'abc366-f': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-knapsack-resource'],
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc366-g': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      ['typicalTechniques', 0, 'primary', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 0, 'supporting', 'tag-bitset-word-parallel'],
      ['typicalTechniques', 0, 'supporting', 'tag-constructive-witness'],
      ['typicalTechniques', 1, 'same_tag', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-linear-algebra-xor'],
    ],
    {
      'tag-bitset-word-parallel': ['outcome-accelerate-set-operations-with-bitsets'],
      'tag-constructive-witness': ['outcome-recover-valid-witness'],
    },
  ),
  'abc367-e': decision('outcome-jump-deterministic-transition', [
    ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
    ['typicalTechniques', 1, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-functional-graph-doubling'],
  ]),
  'abc367-f': decision(
    'outcome-compare-objects-by-fingerprint',
    [
      ['typicalTechniques', 0, 'primary', 'tag-string-hash-equality'],
      ['typicalTechniques', 0, 'supporting', 'tag-randomized-algorithm'],
      ['typicalTechniques', 1, 'same_tag', 'tag-string-hash-equality'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-string-hash-equality'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-randomized-algorithm'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    { 'tag-randomized-algorithm': ['outcome-design-and-bound-randomized-algorithm'] },
  ),
  'abc367-g': decision(
    'outcome-transform-to-linear-system-or-rank',
    [
      ['typicalTechniques', 0, 'primary', 'tag-linear-algebra-xor'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-linear-algebra-xor'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-convolution-fps'],
    ],
    { 'tag-convolution-fps': ['outcome-encode-counting-by-generating-function'] },
  ),
  'abc368-e': decision('outcome-linearize-events', [
    ['typicalTechniques', 0, 'primary', 'tag-event-sweep'],
    ['typicalTechniques', 1, 'same_tag', 'tag-event-sweep'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-event-sweep'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-event-sweep'],
  ]),
  'abc368-f': decision(
    'outcome-classify-game-states',
    [
      ['typicalTechniques', 0, 'primary', 'tag-game-grundy-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-game-grundy-dp'],
      ['prerequisiteCandidates', 1, 'baseline'],
    ],
    {
      'tag-prime-divisor-decomposition': ['outcome-decompose-by-prime-or-divisor'],
    },
  ),
  'abc368-g': decision(
    'outcome-bound-total-work',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-amortized-heavy-light'],
      ['typicalTechniques', 0, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 1, 'primary', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc369-e': decision(
    'outcome-model-and-compute-shortest-path',
    [
      ['typicalTechniques', 0, 'primary', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'supporting', 'tag-bounded-enumeration'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-shortest-path'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-bounded-enumeration'],
    ],
    { 'tag-bounded-enumeration': ['outcome-enumerate-bounded-candidates-or-cases'] },
  ),
  'abc369-f': decision(
    'outcome-design-order-preserving-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['typicalTechniques', 1, 'supporting', 'tag-constructive-witness'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-sequence-subsequence-dp'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-constructive-witness'],
    ],
    { 'tag-constructive-witness': ['outcome-recover-valid-witness'] },
  ),
  'abc369-g': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 0, 'supporting', 'tag-tree-aggregation-reroot'],
      ['typicalTechniques', 1, 'supporting', 'tag-amortized-heavy-light'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-tree-aggregation-reroot'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-discrete-convex-marginal'],
    ],
    {
      'tag-amortized-heavy-light': ['outcome-bound-total-work'],
      'tag-tree-aggregation-reroot': ['outcome-aggregate-rooted-tree'],
    },
  ),
  'abc370-e': decision('outcome-factor-and-accelerate-transitions', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
    ['typicalTechniques', 1, 'same_tag', 'tag-dp-transition-acceleration'],
    ['prerequisiteCandidates', 0, 'baseline'],
    ['prerequisiteCandidates', 1, 'same_tag', 'tag-dp-transition-acceleration'],
  ]),
  'abc370-f': decision(
    'outcome-maintain-monotone-window',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-two-pointers-window'],
      ['typicalTechniques', 1, 'primary', 'tag-two-pointers-window'],
      ['typicalTechniques', 1, 'supporting', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-functional-graph-doubling'],
    ],
    {
      'tag-functional-graph-doubling': ['outcome-jump-deterministic-transition'],
      'tag-monotone-threshold-search': ['outcome-prove-and-search-threshold'],
    },
  ),
  'abc370-g': decision(
    'outcome-decompose-by-prime-or-divisor',
    [
      ['typicalTechniques', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'primary', 'tag-prime-divisor-decomposition'],
      ['typicalTechniques', 1, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-prime-divisor-decomposition'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-prime-divisor-decomposition'],
    ],
    {
      'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'],
    },
  ),
  'abc371-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['typicalTechniques', 1, 'same_tag', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc371-f': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'problem_specific'],
    ['typicalTechniques', 1, 'primary', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc371-g': decision(
    'outcome-decompose-functional-graph',
    [
      ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order', 'tag-modular-crt'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order', 'tag-modular-crt'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-modular-crt': ['outcome-solve-modular-constraints'],
    },
  ),
  'abc372-e': decision('outcome-augment-components-with-metadata', [
    ['typicalTechniques', 0, 'primary', 'tag-dsu-connectivity'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dsu-connectivity'],
  ]),
  'abc372-f': decision('outcome-factor-and-accelerate-transitions', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-transition-acceleration'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-transition-acceleration'],
  ]),
  'abc372-g': decision(
    'outcome-optimize-by-line-envelope',
    [
      ['typicalTechniques', 0, 'primary', 'tag-convex-hull-trick'],
      ['typicalTechniques', 1, 'supporting', 'tag-integer-boundary-blocks'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-convex-hull-trick'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-integer-boundary-blocks'],
    ],
    {
      'tag-integer-boundary-blocks': ['outcome-partition-integer-parameter-ranges'],
    },
  ),
  'abc373-e': decision('outcome-prove-and-search-threshold', [
    ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
  ]),
  'abc373-f': decision(
    'outcome-exploit-convexity',
    [
      ['typicalTechniques', 0, 'primary', 'tag-discrete-convex-marginal'],
      ['typicalTechniques', 0, 'supporting', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 0, 'supporting', 'tag-ordered-set-heap'],
      ['typicalTechniques', 1, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-discrete-convex-marginal'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
      'tag-knapsack-resource': ['outcome-design-resource-dp'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc373-g': decision('outcome-reduce-selection-to-network-optimization', [
    ['typicalTechniques', 0, 'primary', 'tag-flow-matching-cut'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-flow-matching-cut'],
  ]),
  'abc374-e': decision(
    'outcome-prove-and-search-threshold',
    [
      ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-greedy-exchange-order'],
    ],
    { 'tag-greedy-exchange-order': ['outcome-prove-greedy-order'] },
  ),
  'abc374-f': decision(
    'outcome-design-prefix-partition-dp',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-prefix-partition'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-prefix-partition'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-coordinate-compression'],
    ],
    {
      'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'],
      'tag-coordinate-compression': ['outcome-compress-sparse-keys'],
    },
  ),
  'abc374-g': decision(
    'outcome-condense-and-order-directed-graph',
    [
      ['typicalTechniques', 0, 'primary', 'tag-directed-condensation-toposort'],
      ['typicalTechniques', 1, 'supporting', 'tag-flow-matching-cut'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-directed-condensation-toposort'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-flow-matching-cut'],
    ],
    { 'tag-flow-matching-cut': ['outcome-reduce-selection-to-network-optimization'] },
  ),
  'abc375-e': decision(
    'outcome-design-minimal-sufficient-state',
    [
      ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
      ['typicalTechniques', 0, 'supporting', 'tag-knapsack-resource'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc375-f': decision(
    'outcome-reverse-update-time',
    [
      ['typicalTechniques', 0, 'primary', 'tag-reverse-offline'],
      ['typicalTechniques', 1, 'supporting', 'tag-shortest-path'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-reverse-offline'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc375-g': decision(
    'outcome-identify-bridges-and-articulations',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-shortest-path'],
      ['typicalTechniques', 1, 'primary', 'tag-lowlink-critical-structure'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-lowlink-critical-structure'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-shortest-path'],
    ],
    { 'tag-shortest-path': ['outcome-model-and-compute-shortest-path'] },
  ),
  'abc376-e': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    { 'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'] },
  ),
  'abc376-f': decision('outcome-design-minimal-sufficient-state', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
  ]),
  'abc376-g': decision(
    'outcome-prove-greedy-order',
    [
      ['typicalTechniques', 0, 'primary', 'tag-greedy-exchange-order'],
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 0, 'supporting', 'tag-ordered-set-heap'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-ordered-set-heap'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-maintain-connectivity-components'],
      'tag-ordered-set-heap': ['outcome-maintain-dynamic-order-statistics'],
    },
  ),
  'abc377-e': decision('outcome-jump-deterministic-transition', [
    ['typicalTechniques', 0, 'primary', 'tag-functional-graph-doubling'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-functional-graph-doubling'],
  ]),
  'abc377-f': decision(
    'outcome-reduce-geometry-to-algebraic-predicates',
    [
      ['typicalTechniques', 0, 'primary', 'tag-geometry-orientation-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-inclusion-exclusion'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-geometry-orientation-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-inclusion-exclusion'],
    ],
    { 'tag-inclusion-exclusion': ['outcome-correct-overlap-by-inversion'] },
  ),
  'abc377-g': decision('outcome-index-shared-prefixes-with-trie', [
    ['typicalTechniques', 0, 'primary', 'tag-trie-prefix'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-trie-prefix'],
  ]),
  'abc378-e': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
    },
  ),
  'abc378-f': decision('outcome-aggregate-rooted-tree', [
    ['typicalTechniques', 0, 'primary', 'tag-tree-aggregation-reroot'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-tree-aggregation-reroot'],
  ]),
  'abc378-g': decision(
    'outcome-translate-sequences-by-rsk',
    [
      ['typicalTechniques', 0, 'primary', 'tag-rsk-young-tableaux'],
      ['typicalTechniques', 1, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-rsk-young-tableaux'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc379-e': decision('outcome-reorder-counting-contributions', [
    ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
  ]),
  'abc379-f': decision('outcome-prune-dominated-candidates-once', [
    ['typicalTechniques', 0, 'primary', 'tag-monotone-stack-queue'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-stack-queue'],
  ]),
  'abc379-g': decision('outcome-design-minimal-sufficient-state', [
    ['typicalTechniques', 0, 'primary', 'tag-dp-state-equivalence'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-dp-state-equivalence'],
  ]),
  'abc380-e': decision('outcome-maintain-dynamic-order-statistics', [
    ['typicalTechniques', 0, 'primary', 'tag-ordered-set-heap'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-ordered-set-heap'],
  ]),
  'abc380-f': decision('outcome-classify-game-states', [
    ['typicalTechniques', 0, 'primary', 'tag-game-grundy-dp'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-game-grundy-dp'],
  ]),
  'abc380-g': decision(
    'outcome-reorder-counting-contributions',
    [
      ['typicalTechniques', 0, 'primary', 'tag-contribution-reordering'],
      ['typicalTechniques', 1, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['typicalTechniques', 1, 'supporting', 'tag-two-pointers-window'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-contribution-reordering'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-fenwick-weighted-prefix'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-modular-arithmetic'],
    ],
    {
      'tag-fenwick-weighted-prefix': ['outcome-maintain-weighted-prefix-statistics'],
      'tag-modular-arithmetic': ['outcome-compute-in-modular-arithmetic'],
      'tag-two-pointers-window': ['outcome-maintain-monotone-window'],
    },
  ),
  'abc381-e': decision('outcome-prove-and-search-threshold', [
    ['typicalTechniques', 0, 'primary', 'tag-monotone-threshold-search'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-monotone-threshold-search'],
  ]),
  'abc381-f': decision(
    'outcome-enumerate-subset-state-space',
    [
      ['typicalTechniques', 0, 'primary', 'tag-subset-bitmask-transform'],
      ['typicalTechniques', 0, 'supporting', 'tag-dp-state-equivalence'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-subset-bitmask-transform'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dp-state-equivalence'],
    ],
    { 'tag-dp-state-equivalence': ['outcome-design-minimal-sufficient-state'] },
  ),
  'abc381-g': decision(
    'outcome-compute-in-finite-field-extension',
    [
      ['typicalTechniques', 0, 'primary', 'tag-finite-field-extension'],
      ['typicalTechniques', 1, 'supporting', 'tag-convolution-fps'],
      ['typicalTechniques', 1, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-finite-field-extension'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-convolution-fps'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
    ],
    {
      'tag-convolution-fps': ['outcome-evaluate-and-compose-polynomials'],
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
  'abc382-e': decision(
    'outcome-solve-stochastic-recurrence',
    [
      ['typicalTechniques', 0, 'primary', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-stochastic-expectation-dp'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-knapsack-resource'],
    ],
    { 'tag-knapsack-resource': ['outcome-design-resource-dp'] },
  ),
  'abc382-f': decision('outcome-design-range-update-action', [
    ['typicalTechniques', 0, 'primary', 'tag-lazy-segment-action'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-lazy-segment-action'],
  ]),
  'abc382-g': decision('outcome-normalize-equivalent-states', [
    ['typicalTechniques', 0, 'primary', 'tag-symmetry-invariant-normalization'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-symmetry-invariant-normalization'],
  ]),
  'abc383-e': decision(
    'outcome-construct-optimal-spanning-tree',
    [
      ['typicalTechniques', 0, 'primary', 'tag-spanning-tree-optimization'],
      ['typicalTechniques', 0, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-dsu-connectivity'],
      ['typicalTechniques', 1, 'supporting', 'tag-greedy-exchange-order'],
      ['prerequisiteCandidates', 0, 'same_tag', 'tag-spanning-tree-optimization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-dsu-connectivity'],
      ['prerequisiteCandidates', 1, 'supporting', 'tag-greedy-exchange-order'],
    ],
    {
      'tag-dsu-connectivity': ['outcome-augment-components-with-metadata'],
      'tag-greedy-exchange-order': ['outcome-prove-greedy-order'],
    },
  ),
  'abc383-f': decision('outcome-design-resource-dp', [
    ['typicalTechniques', 0, 'primary', 'tag-knapsack-resource'],
    ['typicalTechniques', 1, 'same_tag', 'tag-knapsack-resource'],
    ['prerequisiteCandidates', 0, 'same_tag', 'tag-knapsack-resource'],
  ]),
  'abc383-g': decision(
    'outcome-optimize-monge-transitions',
    [
      ['typicalTechniques', 0, 'supporting', 'tag-divide-enumerate'],
      ['typicalTechniques', 1, 'primary', 'tag-monge-optimization'],
      ['prerequisiteCandidates', 0, 'supporting', 'tag-divide-enumerate'],
      ['prerequisiteCandidates', 1, 'same_tag', 'tag-monge-optimization'],
    ],
    {
      'tag-divide-enumerate': ['outcome-divide-search-space-recursively'],
    },
  ),
} as const satisfies Readonly<Record<string, ExplicitTaxonomyClaimDecision>>;
