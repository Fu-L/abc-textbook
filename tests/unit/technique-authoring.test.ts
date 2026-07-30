import { describe, expect, it } from 'vitest';

import { authorProblemAnalysisRecord } from '../../src/lib/corpus/technique-authoring.js';

const problem = {
  id: 'abc218-f',
  title: 'Blocked Roads',
  constraintsSummary: 'N vertices and M directed edges',
  sourceRevisionIds: ['source-problem', 'source-editorial'],
};

describe('source-backed technique inventory authoring', () => {
  it('selects a source-stated total complexity and specialized graph technique', () => {
    const analysis = authorProblemAnalysisRecord({
      problem,
      statementText: 'Find the shortest path after removing each directed edge.',
      editorialText:
        'Run BFS and restore one shortest path. It has at most N-1 edges, so the total time complexity is O(N(N+M)).',
    });

    expect(analysis.signalIds).toEqual(['shortest-path-edge-recomputation']);
    expect(analysis.structureId).toBe('graph');
    expect(analysis.complexityEssential).toBe(true);
    expect(analysis.problemComplexityRecorded).toBe(true);
    expect(analysis.item.asymptoticComplexity?.time).toContain('O(N[N+M])');
    expect(analysis.item.sourceRevisionIds).toEqual(['source-editorial', 'source-problem']);
    expect(analysis.item.reviewStatus).toBe('reviewed');
  });

  it('does not invent a generic complexity when the source does not state one', () => {
    const analysis = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc218-g', title: 'Game on Tree 2' },
      statementText: 'A game is played on a tree.',
      editorialText: 'Consider each possible state and transition. Each transition takes O(1).',
    });

    expect(analysis.signalIds).toEqual([]);
    expect(analysis.complexityEssential).toBe(false);
    expect(analysis.item.reasoningPath.algorithmConnection.text).toContain(
      '必要な候補だけを制約内で列挙',
    );
    expect(analysis.item.asymptoticComplexity).toBeUndefined();
    expect(analysis.item.reviewStatus).toBe('draft');
  });

  it('omits an ordinary total complexity even when the official source states it', () => {
    const analysis = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc223-f', title: 'Parenthesis Checking' },
      statementText: 'Process swaps and validity queries on a parenthesis string.',
      editorialText:
        'Use a segment tree that stores the total and minimum prefix sum. The total time complexity is O(N log N).',
    });

    expect(analysis.signalIds).toEqual(['parenthesis-monoid-segment-tree']);
    expect(analysis.complexityEssential).toBe(false);
    expect(analysis.problemComplexityRecorded).toBe(false);
    expect(analysis.item.asymptoticComplexity).toBeUndefined();
  });

  it('does not substitute a different bound for a reviewed Problem-level analysis', () => {
    const analysis = authorProblemAnalysisRecord({
      problem,
      statementText: 'Find a shortest path in a directed graph.',
      editorialText: 'One queue operation takes O(1). A simplified discussion says O(NM).',
    });

    expect(analysis.complexityEssential).toBe(true);
    expect(analysis.problemComplexityRecorded).toBe(false);
    expect(analysis.item.asymptoticComplexity).toBeUndefined();
  });

  it('does not infer a technique from an algorithm-shaped word in the title', () => {
    const analysis = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc999-e', title: '1D Bucket Tool' },
      statementText: 'Process repaint and color count queries on a row of cells.',
      editorialText:
        'Use an ordered set of the left endpoints of maximal same-color intervals and merge adjacent intervals.',
    });

    expect(analysis.signalIds).toEqual(['ordered-set']);
    expect(analysis.item.reviewStatus).toBe('draft');
  });

  it('selects the primary editorial method before a later alternative', () => {
    const analysis = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc999-f', title: 'Battles in a Row' },
      statementText: 'Defeat monsters while tracking health and magic.',
      editorialText:
        'This problem can be solved by DP over the current magic. As an alternative, a larger boolean DP can be optimized with a bitset.',
    });

    expect(analysis.signalIds).toEqual(['dynamic-programming']);
    expect(analysis.item.reviewStatus).toBe('draft');
  });

  it('does not mistake degree conditions in a tree DP for square-root decomposition', () => {
    const analysis = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc999-g', title: 'Centipede Graph' },
      statementText: 'Find a longest degree-constrained path in a tree.',
      editorialText:
        'Solution 1 uses tree DP. The transition distinguishes vertices whose degree is at least four.',
    });

    expect(analysis.signalIds).toEqual(['tree-dp']);
    expect(analysis.item.reviewStatus).toBe('draft');
  });

  it('keeps ordinary words prime and bit from matching Prim and BIT abbreviations', () => {
    const prime = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc227-g', title: 'Divisors of Binomial Coefficient' },
      statementText: 'Count divisors of a binomial coefficient.',
      editorialText: 'Use prime factorization and add each prime exponent.',
    });
    const bit = authorProblemAnalysisRecord({
      problem: { ...problem, id: 'abc261-e', title: 'Many Operations' },
      statementText: 'Apply bitwise operations to an integer.',
      editorialText: 'For each bit, compose the effect of the operations from left to right.',
    });

    expect(prime.signalIds).toEqual(['prime-factorization-sieve']);
    expect(bit.signalIds).toEqual([]);
  });
});
