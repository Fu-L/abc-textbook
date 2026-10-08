import { describe, expect, it } from 'vitest';

import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { readTextbookOrder, withGitBaseline } from '../fixtures/maintenance-compatibility.js';

const chapterUnitIds = (chapterId: string): readonly string[] => {
  const chapter = TEXTBOOK_CHAPTERS.find(({ id }) => id === chapterId);
  if (chapter === undefined) throw new Error(`Missing textbook chapter: ${chapterId}`);
  return chapter.unitIds;
};

const expectChapterOrder = (chapterId: string, expectedUnitIds: readonly string[]): void => {
  expect(chapterUnitIds(chapterId), `${chapterId} Unit order`).toEqual(expectedUnitIds);
};

const expectAdjacentSequence = (chapterId: string, before: string, after: string): void => {
  const unitIds = chapterUnitIds(chapterId);
  expect(unitIds.indexOf(after), `${before} directly precedes ${after}`).toBe(
    unitIds.indexOf(before) + 1,
  );
};

describe('textbook Unit reading order', () => {
  it('compares every chapter and Unit with the order actually exported by the old commit', async () => {
    await withGitBaseline(async (root) => {
      const before = await readTextbookOrder(root);
      expect(TEXTBOOK_CHAPTERS).toEqual(before);
      const reversed = before.map((chapter) => ({
        ...chapter,
        unitIds: [...chapter.unitIds].reverse(),
      }));
      expect(reversed).not.toEqual(TEXTBOOK_CHAPTERS);
    });
  });
  it('completes the reusable design toolkit before game-specific parity strategy', () => {
    expect(chapterUnitIds('unit-chapter-modeling')).toEqual([
      'unit-bounded-enumeration',
      'unit-backtracking-search',
      'unit-normalization',
      'unit-coordinate-compression',
      'unit-contribution-reordering',
      'unit-divide-enumeration',
      'unit-recursive-divide-and-conquer',
      'unit-meet-in-the-middle',
      'unit-monotone-search',
      'unit-two-pointers-window',
      'unit-greedy-exchange',
      'unit-bitwise-greedy-feasibility',
      'unit-constructive-witness',
      'unit-reverse-offline',
      'unit-event-sweep',
      'unit-decomposition-amortization',
      'unit-amortized-monotone-progress',
      'unit-small-to-large',
      'unit-threshold-heavy-light',
      'unit-parallel-binary-search',
      'unit-change-impact-localization',
      'unit-game-parity-invariant',
      'unit-interactive-protocol',
      'unit-information-theoretic-query-design',
      'unit-randomized-algorithms',
      'unit-randomized-algebraic-fingerprint',
      'unit-kinetic-order-maintenance',
      'unit-xor-threshold-matching',
    ]);
  });

  it('introduces range actions immediately after the range monoid summary', () => {
    expectChapterOrder('unit-chapter-query', [
      'unit-prefix-aggregate',
      'unit-linked-list-index',
      'unit-ordered-set-heap',
      'unit-priority-queue-best-first',
      'unit-ordered-set-multiset',
      'unit-monotone-stack-queue',
      'unit-cartesian-tree',
      'unit-weighted-prefix-fenwick',
      'unit-monoid-segment-tree',
      'unit-range-monoid-aggregation',
      'unit-range-actions',
      'unit-finite-function-composition',
      'unit-idempotent-overlap-range-query',
      'unit-swag',
      'unit-segment-tree-canonical-decomposition',
      'unit-static-sorted-range-index',
      'unit-dynamic-segment-tree',
      'unit-ordered-interval-partition',
      'unit-value-bucket-aggregation',
      'unit-mo-offline-range',
      'unit-bitset-word-parallel',
      'unit-binary-trie',
      'unit-bitwise-minimax-partition',
      'unit-string-hash',
      'unit-sequence-fingerprint',
      'unit-persistence-rollback',
      'unit-rollback',
      'unit-persistence',
      'unit-segment-tree-beats',
    ]);
    expectAdjacentSequence(
      'unit-chapter-query',
      'unit-range-monoid-aggregation',
      'unit-range-actions',
    );
  });

  it('keeps directional grid scans with graph search and advanced flow later', () => {
    expectChapterOrder('unit-chapter-graph', [
      'unit-graph-search',
      'unit-state-graph-search',
      'unit-transitive-closure',
      'unit-directional-grid-effect-scan',
      'unit-bipartite-structure',
      'unit-connectivity',
      'unit-dsu-components',
      'unit-graph-potential-propagation',
      'unit-potential-dsu',
      'unit-shortest-path-certificates',
      'unit-weighted-shortest-path',
      'unit-shortest-path-reconstruction',
      'unit-difference-constraints',
      'unit-directed-condensation',
      'unit-dag-topological-processing',
      'unit-directed-core-peeling',
      'unit-scc-condensation',
      'unit-two-sat',
      'unit-functional-graph',
      'unit-functional-graph-decomposition',
      'unit-binary-lifting',
      'unit-spanning-tree-optimization',
      'unit-kruskal-threshold-sweep',
      'unit-lowlink-critical-structure',
      'unit-euler-degree',
      'unit-euler-trail-circuit',
      'unit-degree-parity-subgraph',
      'unit-flow-matching',
      'unit-bipartite-matching',
      'unit-max-flow-min-cut',
      'unit-graph-core-peeling',
      'unit-graph-core',
      'unit-cycle-space-basis',
      'unit-monotone-path-contraction',
      'unit-near-tree-kernelization',
      'unit-directed-walk-periodicity',
      'unit-flow-lower-bounds',
      'unit-min-cost-flow',
      'unit-weighted-bipartite-matching',
      'unit-planar-duality',
      'unit-path-matching-contraction',
      'unit-min-weight-general-perfect-matching',
    ]);
    expectAdjacentSequence(
      'unit-chapter-graph',
      'unit-transitive-closure',
      'unit-directional-grid-effect-scan',
    );
    expectAdjacentSequence(
      'unit-chapter-graph',
      'unit-directional-grid-effect-scan',
      'unit-bipartite-structure',
    );
  });

  it('establishes the general tree toolkit before implicit complete binary trees', () => {
    expectChapterOrder('unit-chapter-tree', [
      'unit-tree-metric',
      'unit-tree-aggregation',
      'unit-rooted-tree-aggregation',
      'unit-rerooting',
      'unit-tree-decomposition',
      'unit-tree-euler-flattening',
      'unit-tree-ancestor-lca',
      'unit-heavy-light-decomposition',
      'unit-virtual-tree',
      'unit-implicit-binary-tree',
      'unit-laminar-interval-containment-tree',
      'unit-dsu-merge-tree',
      'unit-tree-balanced-separators',
      'unit-additive-tree-metric-reconstruction',
      'unit-tree-precedence-contraction',
      'unit-heavy-path-tree-dp',
      'unit-static-top-tree',
      'unit-heavy-light-recursive-dp',
    ]);
  });

  it('completes automaton topics after suffix indexing and before compressed-string topics', () => {
    expectChapterOrder('unit-chapter-string', [
      'unit-trie-prefix',
      'unit-string-prefix-automata',
      'unit-z-algorithm',
      'unit-string-periodicity',
      'unit-palindrome-radius',
      'unit-suffix-lcp-index',
      'unit-string-automata',
      'unit-finite-pattern-automaton',
      'unit-aho-corasick',
      'unit-automaton-subset-construction',
      'unit-suffix-automaton',
      'unit-run-length-dynamics',
      'unit-recursive-compressed-string',
    ]);
  });

  it('teaches general counting corrections before the reflection principle', () => {
    expectChapterOrder('unit-chapter-combinatorics-algebra', [
      'unit-combinatorial-coefficients',
      'unit-inclusion-exclusion',
      'unit-divisor-mobius-inversion',
      'unit-subset-transforms',
      'unit-reflection-principle',
      'unit-monoid-exponentiation',
      'unit-semiring-matrix-exponentiation',
      'unit-linear-algebra-xor',
      'unit-linear-system-rank',
      'unit-xor-linear-basis',
      'unit-separable-linear-transform',
      'unit-prufer-code',
      'unit-orbit-counting',
      'unit-deletion-contraction',
      'unit-determinant-counting',
      'unit-poset-dilworth-antichain',
      'unit-matroid-theory',
      'unit-matroid-greedy',
      'unit-generating-functions',
      'unit-labeled-component-decomposition',
      'unit-polynomial-convolution',
      'unit-polynomial-taylor-shift',
      'unit-formal-power-series',
      'unit-polynomial-multipoint-evaluation',
      'unit-bostan-mori',
      'unit-generating-function-coefficients',
      'unit-relaxed-convolution',
      'unit-subset-convolution',
      'unit-euler-circuit-counting',
      'unit-rsk-young-tableaux',
      'unit-fps-composition-power-projection',
      'unit-linear-matroid-intersection',
    ]);
  });

  it('places fractional programming before the more specialized PAV topic', () => {
    expectChapterOrder('unit-chapter-geometry-optimization', [
      'unit-geometry-primitives',
      'unit-cyclic-order-crossing',
      'unit-convex-geometry',
      'unit-convex-boundary-hull',
      'unit-half-plane-constraints',
      'unit-line-envelope',
      'unit-discrete-convex',
      'unit-basic-convex-optimization',
      'unit-separable-convex-marginals',
      'unit-slope-trick',
      'unit-fractional-parametric-search',
      'unit-isotonic-regression',
      'unit-lagrangian-relaxation',
      'unit-monge-optimization',
      'unit-two-variable-convex-lattice-optimization',
    ]);
  });
});
