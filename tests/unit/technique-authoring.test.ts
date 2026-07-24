import { describe, expect, it } from 'vitest';

import { authorTechniqueInventoryItem } from '../../src/lib/corpus/technique-authoring.js';

const problem = {
  id: 'abc218-f',
  title: 'Blocked Roads',
  constraintsSummary: 'N vertices and M directed edges',
  sourceRevisionIds: ['source-problem', 'source-editorial'],
};

describe('source-backed technique inventory authoring', () => {
  it('selects a source-stated total complexity and specialized graph technique', () => {
    const analysis = authorTechniqueInventoryItem({
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
  });

  it('does not invent a generic complexity when the source does not state one', () => {
    const analysis = authorTechniqueInventoryItem({
      problem: { ...problem, id: 'abc218-g', title: 'Game on Tree 2' },
      statementText: 'A game is played on a tree.',
      editorialText: 'Consider each possible state and transition. Each transition takes O(1).',
    });

    expect(analysis.signalIds).toEqual([]);
    expect(analysis.complexityEssential).toBe(false);
    expect(analysis.item.coreMethod).toContain('必要な候補だけを制約内で列挙');
    expect(analysis.item.asymptoticComplexity).toBeUndefined();
  });

  it('omits an ordinary total complexity even when the official source states it', () => {
    const analysis = authorTechniqueInventoryItem({
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
    const analysis = authorTechniqueInventoryItem({
      problem,
      statementText: 'Find a shortest path in a directed graph.',
      editorialText: 'One queue operation takes O(1). A simplified discussion says O(NM).',
    });

    expect(analysis.complexityEssential).toBe(true);
    expect(analysis.problemComplexityRecorded).toBe(false);
    expect(analysis.item.asymptoticComplexity).toBeUndefined();
  });
});
