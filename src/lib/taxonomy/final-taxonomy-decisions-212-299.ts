/**
 * Source-backed primary-tag curation for every accepted analysis record from
 * ABC212 through ABC299. Each value is the first reusable abstraction made
 * irreversible by the adopted approach, rather than a keyword or library name.
 */
export const CURATED_PRIMARY_TAG_ASSIGNMENTS_212_299 = Object.freeze({
  'abc212-e': 'tag-dp-transition-acceleration',
  'abc212-f': 'tag-functional-graph-doubling',
  'abc212-g': 'tag-cyclic-group-order',
  'abc212-h': 'tag-linear-algebra-xor',

  'abc213-e': 'tag-shortest-path',
  'abc213-f': 'tag-suffix-lcp-index',
  'abc213-g': 'tag-subset-bitmask-transform',
  'abc213-h': 'tag-convolution-fps',

  'abc214-e': 'tag-greedy-exchange-order',
  'abc214-f': 'tag-sequence-subsequence-dp',
  'abc214-g': 'tag-inclusion-exclusion',
  // Min-cost flow performs the joint path optimization after SCC condensation.
  'abc214-h': 'tag-min-cost-flow',

  'abc215-e': 'tag-dp-state-equivalence',
  'abc215-f': 'tag-monotone-threshold-search',
  'abc215-g': 'tag-contribution-reordering',
  // Hall's condition is the reusable feasibility theorem; mask transforms evaluate all subsets.
  'abc215-h': 'tag-flow-matching-cut',

  // The reusable object is the union of monotone marginal-reward sequences; threshold search
  // is one way to select their global top K without materializing all terms.
  'abc216-e': 'tag-discrete-convex-marginal',
  'abc216-f': 'tag-knapsack-resource',
  'abc216-g': 'tag-shortest-path',
  // LGV turns collision avoidance into a determinant; the remaining subset DP counts its terms.
  'abc216-h': 'tag-determinant-counting',

  // Queue-to-heap migration is safe because each element crosses the boundary at most once.
  'abc217-e': 'tag-amortized-heavy-light',
  'abc217-f': 'tag-interval-partition-dp',
  'abc217-g': 'tag-dp-state-equivalence',
  'abc217-h': 'tag-discrete-convex-marginal',

  'abc218-e': 'tag-spanning-tree-optimization',
  'abc218-f': 'tag-witness-impact-localization',
  // DFS entry/exit rollback is what makes the root-to-current-path median reusable.
  'abc218-g': 'tag-persistent-rollback',
  'abc218-h': 'tag-greedy-exchange-order',

  'abc219-e': 'tag-subset-bitmask-transform',
  'abc219-f': 'tag-symmetry-invariant-normalization',
  'abc219-g': 'tag-amortized-heavy-light',
  'abc219-h': 'tag-interval-partition-dp',

  // Fix a depth/LCA split and sum each pair's contribution; no path query is performed.
  'abc220-e': 'tag-contribution-reordering',
  'abc220-f': 'tag-tree-aggregation-reroot',
  'abc220-g': 'tag-geometry-orientation-transform',
  'abc220-h': 'tag-divide-enumerate',

  'abc221-e': 'tag-fenwick-weighted-prefix',
  'abc221-f': 'tag-tree-metric-diameter',
  'abc221-g': 'tag-bitset-word-parallel',
  'abc221-h': 'tag-dp-transition-acceleration',

  'abc222-e': 'tag-knapsack-resource',
  'abc222-f': 'tag-tree-metric-diameter',
  'abc222-g': 'tag-cyclic-group-order',
  'abc222-h': 'tag-convolution-fps',

  'abc223-e': 'tag-geometry-orientation-transform',
  'abc223-f': 'tag-monoid-segment-tree',
  'abc223-g': 'tag-tree-aggregation-reroot',
  'abc223-h': 'tag-linear-algebra-xor',

  'abc224-e': 'tag-dp-transition-acceleration',
  'abc224-f': 'tag-dp-transition-acceleration',
  'abc224-g': 'tag-discrete-convex-marginal',
  'abc224-h': 'tag-flow-matching-cut',

  'abc225-e': 'tag-greedy-exchange-order',
  'abc225-f': 'tag-greedy-exchange-order',
  'abc225-g': 'tag-flow-matching-cut',
  'abc225-h': 'tag-convolution-fps',

  'abc226-e': 'tag-graph-core-peeling',
  'abc226-f': 'tag-combinatorial-coefficients',
  'abc226-g': 'tag-greedy-exchange-order',
  'abc226-h': 'tag-stochastic-expectation-dp',

  'abc227-e': 'tag-dp-state-equivalence',
  'abc227-f': 'tag-bounded-enumeration',
  'abc227-g': 'tag-prime-divisor-decomposition',
  // Maximum flow decides residual-degree feasibility; Euler construction recovers the walk.
  'abc227-h': 'tag-max-flow-min-cut',

  'abc228-e': 'tag-modular-crt',
  'abc228-f': 'tag-monotone-stack-queue',
  'abc228-g': 'tag-subset-bitmask-transform',
  'abc228-h': 'tag-convex-hull-trick',

  'abc229-e': 'tag-reverse-offline',
  'abc229-f': 'tag-dp-state-equivalence',
  'abc229-g': 'tag-monotone-threshold-search',
  'abc229-h': 'tag-game-value-dp',

  'abc230-e': 'tag-integer-boundary-blocks',
  'abc230-f': 'tag-interval-partition-dp',
  'abc230-g': 'tag-inclusion-exclusion',
  'abc230-h': 'tag-convolution-fps',

  'abc231-e': 'tag-carry-mixed-radix-dp',
  'abc231-f': 'tag-event-sweep',
  'abc231-g': 'tag-contribution-reordering',
  'abc231-h': 'tag-flow-matching-cut',

  'abc232-e': 'tag-dp-state-equivalence',
  'abc232-f': 'tag-subset-bitmask-transform',
  'abc232-g': 'tag-shortest-path',
  'abc232-h': 'tag-constructive-witness',

  'abc233-e': 'tag-contribution-reordering',
  'abc233-ex': 'tag-parallel-binary-search',
  'abc233-f': 'tag-constructive-witness',
  'abc233-g': 'tag-interval-partition-dp',

  'abc234-e': 'tag-bounded-enumeration',
  'abc234-ex': 'tag-geometry-orientation-transform',
  'abc234-f': 'tag-combinatorial-coefficients',
  'abc234-g': 'tag-monotone-stack-queue',

  'abc235-e': 'tag-spanning-tree-optimization',
  // The Kruskal reconstruction tree is the rare recognition step that organizes every valid
  // operation; generating-function DP is retained as a co-primary counting layer.
  'abc235-ex': 'tag-dsu-merge-tree',
  'abc235-f': 'tag-digit-dp',
  'abc235-g': 'tag-inclusion-exclusion',

  'abc236-e': 'tag-monotone-threshold-search',
  'abc236-ex': 'tag-inclusion-exclusion',
  'abc236-f': 'tag-linear-algebra-xor',
  'abc236-g': 'tag-linear-recurrence-matrix',

  'abc237-e': 'tag-shortest-path',
  'abc237-ex': 'tag-flow-matching-cut',
  'abc237-f': 'tag-dp-state-equivalence',
  'abc237-g': 'tag-lazy-segment-action',

  'abc238-e': 'tag-dsu-connectivity',
  'abc238-ex': 'tag-reverse-offline',
  'abc238-f': 'tag-sequence-subsequence-dp',
  // The reusable recognition skill is the homomorphic algebraic fingerprint; the generic
  // Monte Carlo error analysis is its readiness prerequisite rather than the Home.
  'abc238-g': 'tag-randomized-algebraic-fingerprint',

  'abc239-e': 'tag-tree-aggregation-reroot',
  'abc239-ex': 'tag-integer-boundary-blocks',
  'abc239-f': 'tag-constructive-witness',
  'abc239-g': 'tag-flow-matching-cut',

  'abc240-e': 'tag-tree-aggregation-reroot',
  'abc240-ex': 'tag-sequence-subsequence-dp',
  'abc240-f': 'tag-integer-boundary-blocks',
  'abc240-g': 'tag-combinatorial-coefficients',

  'abc241-e': 'tag-functional-graph-doubling',
  'abc241-ex': 'tag-convolution-fps',
  'abc241-f': 'tag-reachability-bfs',
  'abc241-g': 'tag-flow-matching-cut',

  'abc242-e': 'tag-symmetry-invariant-normalization',
  'abc242-ex': 'tag-stochastic-expectation-dp',
  'abc242-f': 'tag-inclusion-exclusion',
  'abc242-g': 'tag-mo-offline-range',

  'abc243-e': 'tag-shortest-path',
  'abc243-ex': 'tag-shortest-path',
  'abc243-f': 'tag-combinatorial-coefficients',
  'abc243-g': 'tag-dp-transition-acceleration',

  'abc244-e': 'tag-dp-state-equivalence',
  'abc244-ex': 'tag-convex-hull-halfplane',
  'abc244-f': 'tag-subset-bitmask-transform',
  'abc244-g': 'tag-constructive-witness',

  'abc245-e': 'tag-greedy-exchange-order',
  'abc245-ex': 'tag-modular-crt',
  'abc245-f': 'tag-directed-condensation-toposort',
  'abc245-g': 'tag-shortest-path',

  'abc246-e': 'tag-shortest-path',
  'abc246-ex': 'tag-monoid-segment-tree',
  'abc246-f': 'tag-inclusion-exclusion',
  'abc246-g': 'tag-monotone-threshold-search',

  'abc247-e': 'tag-contribution-reordering',
  'abc247-ex': 'tag-convolution-fps',
  'abc247-f': 'tag-dp-state-equivalence',
  'abc247-g': 'tag-flow-matching-cut',

  'abc248-e': 'tag-geometry-orientation-transform',
  'abc248-ex': 'tag-monotone-stack-queue',
  'abc248-f': 'tag-frontier-profile-dp',
  'abc248-g': 'tag-tree-aggregation-reroot',

  'abc249-e': 'tag-dp-transition-acceleration',
  'abc249-ex': 'tag-symmetry-invariant-normalization',
  'abc249-f': 'tag-reverse-offline',
  'abc249-g': 'tag-linear-algebra-xor',

  'abc250-e': 'tag-symmetry-invariant-normalization',
  // Threshold connectivity answers every query; multi-source distances define edge thresholds.
  'abc250-ex': 'tag-kruskal-threshold-sweep',
  'abc250-f': 'tag-two-pointers-window',
  'abc250-g': 'tag-discrete-convex-marginal',

  'abc251-e': 'tag-dp-state-equivalence',
  'abc251-ex': 'tag-linear-recurrence-matrix',
  'abc251-f': 'tag-constructive-witness',
  'abc251-g': 'tag-convex-hull-halfplane',

  'abc252-e': 'tag-shortest-path-certificate',
  'abc252-ex': 'tag-divide-enumerate',
  'abc252-f': 'tag-greedy-exchange-order',
  'abc252-g': 'tag-interval-partition-dp',

  'abc253-e': 'tag-dp-transition-acceleration',
  'abc253-ex': 'tag-determinant-counting',
  'abc253-f': 'tag-reverse-offline',
  'abc253-g': 'tag-integer-boundary-blocks',

  'abc254-e': 'tag-bounded-enumeration',
  'abc254-ex': 'tag-greedy-exchange-order',
  'abc254-f': 'tag-gcd-diophantine',
  'abc254-g': 'tag-functional-graph-doubling',

  'abc255-e': 'tag-contribution-reordering',
  'abc255-ex': 'tag-ordered-set-heap',
  'abc255-f': 'tag-constructive-witness',
  'abc255-g': 'tag-game-grundy-dp',

  'abc256-e': 'tag-functional-graph-doubling',
  'abc256-ex': 'tag-amortized-heavy-light',
  'abc256-f': 'tag-fenwick-weighted-prefix',
  'abc256-g': 'tag-linear-recurrence-matrix',

  'abc257-e': 'tag-greedy-exchange-order',
  'abc257-ex': 'tag-convex-hull-halfplane',
  'abc257-f': 'tag-shortest-path',
  'abc257-g': 'tag-prefix-matching-automata',

  // The full-turn contribution is separated before the circular two-pointer remainder.
  'abc258-e': 'tag-two-pointers-window',
  'abc258-ex': 'tag-linear-recurrence-matrix',
  'abc258-f': 'tag-geometry-orientation-transform',
  'abc258-g': 'tag-bitset-word-parallel',

  'abc259-e': 'tag-prime-divisor-decomposition',
  'abc259-ex': 'tag-amortized-heavy-light',
  'abc259-f': 'tag-tree-aggregation-reroot',
  'abc259-g': 'tag-flow-matching-cut',

  'abc260-e': 'tag-two-pointers-window',
  'abc260-ex': 'tag-convolution-fps',
  'abc260-f': 'tag-constructive-witness',
  'abc260-g': 'tag-prefix-difference',

  // Each bit becomes an independently composable unary-function monoid.
  'abc261-e': 'tag-monoid-segment-tree',
  'abc261-ex': 'tag-game-value-dp',
  'abc261-f': 'tag-contribution-reordering',
  'abc261-g': 'tag-interval-partition-dp',

  'abc262-e': 'tag-combinatorial-coefficients',
  'abc262-ex': 'tag-interval-partition-dp',
  'abc262-f': 'tag-greedy-exchange-order',
  'abc262-g': 'tag-interval-partition-dp',

  'abc263-e': 'tag-stochastic-expectation-dp',
  'abc263-ex': 'tag-monotone-threshold-search',
  'abc263-f': 'tag-tree-aggregation-reroot',
  'abc263-g': 'tag-flow-matching-cut',

  'abc264-e': 'tag-reverse-offline',
  // The update follows ordinary tree-DP deltas; the logarithmic depth is a static size bound,
  // not a potential/amortized argument.
  'abc264-ex': 'tag-tree-aggregation-reroot',
  'abc264-f': 'tag-dp-state-equivalence',
  'abc264-g': 'tag-string-automata',

  'abc265-e': 'tag-dp-state-equivalence',
  'abc265-ex': 'tag-convolution-fps',
  'abc265-f': 'tag-dp-transition-acceleration',
  'abc265-g': 'tag-lazy-segment-action',

  'abc266-e': 'tag-stochastic-expectation-dp',
  'abc266-ex': 'tag-event-sweep',
  // Repeated leaf deletion is the reusable reduction to the unique cycle kernel.
  'abc266-f': 'tag-graph-core-peeling',
  'abc266-g': 'tag-combinatorial-coefficients',

  'abc267-e': 'tag-monotone-threshold-search',
  'abc267-ex': 'tag-convolution-fps',
  'abc267-f': 'tag-tree-metric-diameter',
  'abc267-g': 'tag-combinatorial-coefficients',

  'abc268-e': 'tag-prefix-difference',
  'abc268-ex': 'tag-suffix-lcp-index',
  'abc268-f': 'tag-greedy-exchange-order',
  'abc268-g': 'tag-contribution-reordering',

  'abc269-e': 'tag-monotone-threshold-search',
  'abc269-ex': 'tag-amortized-heavy-light',
  'abc269-f': 'tag-contribution-reordering',
  'abc269-g': 'tag-knapsack-resource',

  'abc270-e': 'tag-monotone-threshold-search',
  'abc270-ex': 'tag-stochastic-expectation-dp',
  'abc270-f': 'tag-spanning-tree-optimization',
  'abc270-g': 'tag-divide-enumerate',

  'abc271-e': 'tag-shortest-path',
  'abc271-ex': 'tag-gcd-diophantine',
  'abc271-f': 'tag-divide-enumerate',
  'abc271-g': 'tag-linear-recurrence-matrix',

  // Only (i,j) pairs that enter the mex range are generated; their harmonic count is a direct
  // candidate-space bound rather than monotone-state amortization.
  'abc272-e': 'tag-bounded-enumeration',
  'abc272-ex': 'tag-convolution-fps',
  'abc272-f': 'tag-suffix-lcp-index',
  'abc272-g': 'tag-randomized-algorithm',

  'abc273-e': 'tag-persistent-rollback',
  // Continued-fraction-style unary descents are skipped as equal-boundary blocks.
  // The compressed recursion follows Stern--Brocot/continued-fraction quotients; set merging is secondary.
  'abc273-ex': 'tag-gcd-diophantine',
  'abc273-f': 'tag-interval-partition-dp',
  'abc273-g': 'tag-dp-state-equivalence',

  'abc274-e': 'tag-subset-bitmask-transform',
  'abc274-ex': 'tag-string-hash-equality',
  'abc274-f': 'tag-event-sweep',
  'abc274-g': 'tag-flow-matching-cut',

  'abc275-e': 'tag-stochastic-expectation-dp',
  'abc275-ex': 'tag-slope-trick',
  'abc275-f': 'tag-knapsack-resource',
  'abc275-g': 'tag-convex-hull-halfplane',

  'abc276-e': 'tag-dsu-connectivity',
  'abc276-ex': 'tag-linear-algebra-xor',
  'abc276-f': 'tag-fenwick-weighted-prefix',
  'abc276-g': 'tag-combinatorial-coefficients',

  'abc277-e': 'tag-shortest-path',
  'abc277-ex': 'tag-directed-condensation-toposort',
  'abc277-f': 'tag-directed-condensation-toposort',
  'abc277-g': 'tag-stochastic-expectation-dp',

  'abc278-e': 'tag-prefix-difference',
  'abc278-ex': 'tag-finite-field-subspace-counting',
  'abc278-f': 'tag-game-grundy-dp',
  'abc278-g': 'tag-game-grundy-dp',

  // The full swap run is a witness; omitting one swap changes only the two labels it touches.
  'abc279-e': 'tag-witness-impact-localization',
  'abc279-ex': 'tag-convolution-fps',
  'abc279-f': 'tag-dsu-connectivity',
  'abc279-g': 'tag-dp-state-equivalence',

  'abc280-e': 'tag-contribution-reordering',
  'abc280-ex': 'tag-suffix-lcp-index',
  'abc280-f': 'tag-dsu-connectivity',
  'abc280-g': 'tag-inclusion-exclusion',

  'abc281-e': 'tag-ordered-set-heap',
  'abc281-ex': 'tag-convolution-fps',
  'abc281-f': 'tag-binary-trie',
  'abc281-g': 'tag-dp-state-equivalence',

  'abc282-e': 'tag-spanning-tree-optimization',
  'abc282-ex': 'tag-divide-enumerate',
  'abc282-f': 'tag-constructive-witness',
  'abc282-g': 'tag-dp-transition-acceleration',

  'abc283-e': 'tag-dp-state-equivalence',
  'abc283-ex': 'tag-integer-boundary-blocks',
  'abc283-f': 'tag-event-sweep',
  'abc283-g': 'tag-linear-algebra-xor',

  'abc284-e': 'tag-reachability-bfs',
  'abc284-ex': 'tag-symmetry-invariant-normalization',
  'abc284-f': 'tag-prefix-matching-automata',
  'abc284-g': 'tag-functional-graph-doubling',

  'abc285-e': 'tag-interval-partition-dp',
  'abc285-ex': 'tag-inclusion-exclusion',
  'abc285-f': 'tag-monoid-segment-tree',
  'abc285-g': 'tag-flow-matching-cut',

  'abc286-e': 'tag-shortest-path',
  'abc286-ex': 'tag-convex-hull-halfplane',
  'abc286-f': 'tag-modular-crt',
  'abc286-g': 'tag-euler-degree-parity',

  'abc287-e': 'tag-trie-prefix',
  'abc287-ex': 'tag-reachability-bfs',
  'abc287-f': 'tag-tree-aggregation-reroot',
  'abc287-g': 'tag-fenwick-weighted-prefix',

  'abc288-e': 'tag-knapsack-resource',
  'abc288-ex': 'tag-digit-dp',
  'abc288-f': 'tag-interval-partition-dp',
  'abc288-g': 'tag-linear-algebra-xor',

  'abc289-e': 'tag-reachability-bfs',
  'abc289-ex': 'tag-convolution-fps',
  'abc289-f': 'tag-constructive-witness',
  'abc289-g': 'tag-convex-hull-trick',

  'abc290-e': 'tag-contribution-reordering',
  'abc290-ex': 'tag-greedy-exchange-order',
  'abc290-f': 'tag-combinatorial-coefficients',
  'abc290-g': 'tag-greedy-exchange-order',

  'abc291-e': 'tag-directed-condensation-toposort',
  'abc291-ex': 'tag-tree-balanced-separator',
  'abc291-f': 'tag-shortest-path',
  'abc291-g': 'tag-convolution-fps',

  'abc292-e': 'tag-reachability-bfs',
  'abc292-ex': 'tag-monoid-segment-tree',
  'abc292-f': 'tag-monotone-threshold-search',
  'abc292-g': 'tag-interval-partition-dp',

  'abc293-e': 'tag-linear-recurrence-matrix',
  'abc293-ex': 'tag-monotone-threshold-search',
  'abc293-f': 'tag-integer-boundary-blocks',
  'abc293-g': 'tag-mo-offline-range',

  'abc294-e': 'tag-two-pointers-window',
  // Low-degree deletion/contracting is used to expose a small subset-convolution kernel.
  'abc294-ex': 'tag-subset-bitmask-transform',
  'abc294-f': 'tag-monotone-threshold-search',
  'abc294-g': 'tag-tree-path-decomposition',

  'abc295-e': 'tag-contribution-reordering',
  'abc295-ex': 'tag-subset-bitmask-transform',
  'abc295-f': 'tag-contribution-reordering',
  'abc295-g': 'tag-directed-condensation-toposort',

  'abc296-e': 'tag-functional-graph-doubling',
  'abc296-ex': 'tag-dp-state-equivalence',
  'abc296-f': 'tag-symmetry-invariant-normalization',
  'abc296-g': 'tag-geometry-orientation-transform',

  'abc297-e': 'tag-ordered-set-heap',
  'abc297-ex': 'tag-convolution-fps',
  'abc297-f': 'tag-inclusion-exclusion',
  'abc297-g': 'tag-game-grundy-dp',

  'abc298-e': 'tag-stochastic-expectation-dp',
  'abc298-ex': 'tag-tree-path-decomposition',
  'abc298-f': 'tag-greedy-exchange-order',
  'abc298-g': 'tag-interval-partition-dp',

  'abc299-e': 'tag-constructive-witness',
  'abc299-ex': 'tag-stochastic-expectation-dp',
  'abc299-f': 'tag-sequence-subsequence-dp',
  'abc299-g': 'tag-greedy-exchange-order',
} as const satisfies Readonly<Record<string, string>>);

export const CURATED_PRIMARY_TAG_ASSIGNMENT_COUNT_212_299 = 352 as const;
