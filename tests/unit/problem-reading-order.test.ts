import { describe, expect, it } from 'vitest';
import { orderProblemsByPrerequisites } from '../../src/lib/taxonomy/problem-reading-order.js';

const skills = [
  { id: 'tag-base', prerequisiteIds: [] },
  { id: 'outcome-base', prerequisiteIds: [] },
  { id: 'tag-advanced', prerequisiteIds: ['tag-base'] },
  { id: 'outcome-advanced', prerequisiteIds: ['outcome-base'] },
];
const problem = (id: string, advanced = false) => ({
  problemId: id,
  primaryTagIds: [advanced ? 'tag-advanced' : 'tag-base'],
  supportingTagIds: [],
  primaryOutcomeId: advanced ? 'outcome-advanced' : 'outcome-base',
  additionalPrimaryOutcomeIds: [],
  supportingOutcomeIds: [],
});

describe('problem reading order', () => {
  it('prioritizes the reviewed local progression over skill counts and representative rank', () => {
    const intro = problem('abc270-e', true);
    const extension = problem('abc373-e');
    expect(
      orderProblemsByPrerequisites(
        [extension, intro],
        skills,
        [extension.problemId],
        'unit-monotone-search',
      ),
    ).toEqual([intro.problemId, extension.problemId]);
    expect(orderProblemsByPrerequisites([extension, intro], skills, [], 'unit-unrelated')).toEqual([
      extension.problemId,
      intro.problemId,
    ]);
  });
  it('puts prerequisite skills before advanced composition regardless of contest ID or representative rank', () => {
    const basic = problem('abc466-g');
    const advanced = problem('abc212-e', true);
    expect(orderProblemsByPrerequisites([advanced, basic], skills, [advanced.problemId])).toEqual([
      basic.problemId,
      advanced.problemId,
    ]);
    expect(
      orderProblemsByPrerequisites([basic, advanced], [...skills].reverse(), [advanced.problemId]),
    ).toEqual([basic.problemId, advanced.problemId]);
  });
  it('does not force a smaller skill set ahead of a basic discrete probability DP', () => {
    expect(
      orderProblemsByPrerequisites([problem('abc226-h'), problem('abc275-e', true)], skills),
    ).toEqual(['abc275-e', 'abc226-h']);
  });
  it('uses representative rank and then stable ID only when mechanism and requirements tie', () => {
    expect(
      orderProblemsByPrerequisites([problem('abc400-e'), problem('abc300-f')], skills, [
        'abc400-e',
      ]),
    ).toEqual(['abc400-e', 'abc300-f']);
  });
});
