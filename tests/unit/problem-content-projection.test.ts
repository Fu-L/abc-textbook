import { describe, expect, it } from 'vitest';

import { buildProblemContent } from '../../src/lib/catalog/build-problem-content.js';

const input = () => ({
  problemIds: ['abc212-e', 'abc212-f'],
  documents: [
    { problemId: 'abc212-e', docPath: 'src/content/docs/problems/a/e.md' },
    { problemId: 'abc212-f', docPath: 'src/content/docs/problems/b/f.md' },
  ],
  placements: [
    {
      problemId: 'abc212-e',
      primaryOutcomeId: 'outcome-a',
      additionalPrimaryOutcomeIds: ['outcome-b'],
      supportingOutcomeIds: ['outcome-c'],
    },
    {
      problemId: 'abc212-f',
      primaryOutcomeId: 'outcome-a',
      additionalPrimaryOutcomeIds: [],
      supportingOutcomeIds: [],
    },
  ],
  units: [
    {
      id: 'unit-a',
      ownedLearningOutcomeIds: ['outcome-a'],
      directProblemIds: ['abc212-f', 'abc212-e'],
      relatedProblemIds: [],
    },
    {
      id: 'unit-b',
      ownedLearningOutcomeIds: ['outcome-b'],
      directProblemIds: [],
      relatedProblemIds: ['abc212-e'],
    },
    {
      id: 'unit-c',
      ownedLearningOutcomeIds: ['outcome-c'],
      directProblemIds: [],
      relatedProblemIds: ['abc212-e'],
    },
  ] as {
    id: string;
    parentId?: string | null;
    problemIds?: string[];
    ownedLearningOutcomeIds: string[];
    directProblemIds: string[];
    relatedProblemIds: string[];
  }[],
});

describe('canonical Problem content projection', () => {
  it('keeps ancestral coverage without requiring a duplicate related link', () => {
    const value = input();
    const [home, parent] = value.units;
    const placement = value.placements[0];
    if (!home || !parent || !placement) throw new Error('Fixture incomplete.');
    home.parentId = parent.id;
    parent.relatedProblemIds = [];
    parent.problemIds = ['abc212-e', 'abc212-f'];
    const projected = buildProblemContent(value)[0];
    expect(projected?.coverageUnitIds).toEqual(['unit-b']);
    expect(projected?.additionalPrimaryUnitIds).toEqual(['unit-b']);
    expect(projected?.relatedUnitIds).toEqual(['unit-c']);
    parent.parentId = home.id;
    expect(() => buildProblemContent(value)).toThrow(/PARENT_CYCLE/);
  });
  it('preserves unique primary homes, coverage/related references and accepted reading order', () => {
    const result = buildProblemContent(input());
    expect(result[0]).toEqual({
      problemId: 'abc212-e',
      documentPath: 'src/content/docs/problems/a/e.md',
      route: '/problems/abc212-e/',
      homeUnitId: 'unit-a',
      homeOrder: 2,
      coverageUnitIds: [],
      additionalPrimaryUnitIds: ['unit-b'],
      relatedUnitIds: ['unit-b', 'unit-c'],
    });
    expect(result[1]?.homeOrder).toBe(1);
    expect(result[0]).not.toHaveProperty('tags');
    expect(
      buildProblemContent({ ...input(), documents: [...input().documents].reverse() }),
    ).toEqual(result);
  });

  it.each([
    'duplicate',
    'orphan',
    'missing',
    'two-homes',
    'wrong-owner',
    'missing-related',
    'unknown-direct',
    'shared-path',
  ])('rejects %s instead of silently emitting incomplete links', (failure) => {
    const value = input();
    const [firstDocument, secondDocument] = value.documents;
    const [home, related] = value.units;
    if (!firstDocument || !secondDocument || !home || !related)
      throw new Error('Fixture incomplete.');
    if (failure === 'duplicate') value.documents.push({ ...firstDocument });
    if (failure === 'orphan')
      value.documents.push({ problemId: 'abc212-g', docPath: 'src/content/docs/problems/g.md' });
    if (failure === 'missing') value.documents.pop();
    if (failure === 'two-homes') related.directProblemIds.push('abc212-e');
    if (failure === 'wrong-owner') home.ownedLearningOutcomeIds = [];
    if (failure === 'missing-related') related.relatedProblemIds = [];
    if (failure === 'unknown-direct') home.directProblemIds.push('abc212-g');
    if (failure === 'shared-path') secondDocument.docPath = firstDocument.docPath;
    expect(() => buildProblemContent(value)).toThrow(/PROBLEM_CONTENT_/);
  });
});
