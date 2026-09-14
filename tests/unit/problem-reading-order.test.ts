import { describe, expect, it } from 'vitest';
import { orderProblemsByPrerequisites } from '../../src/lib/taxonomy/problem-reading-order.js';

const skills = [
  { id: 'tag-base', prerequisiteIds: [] },
  { id: 'tag-advanced', prerequisiteIds: ['tag-base'] },
];
const problem = (problemId: string, advanced = false) => ({
  problemId,
  primaryTagIds: [advanced ? 'tag-advanced' : 'tag-base'],
  supportingTagIds: [],
  primaryOutcomeId: 'tag-base',
  additionalPrimaryOutcomeIds: [],
  supportingOutcomeIds: [],
});

describe('problem reading order', () => {
  it('uses ABC slots before skill counts, representatives, and contest IDs', () => {
    const input = [
      problem('abc212-ex'),
      problem('abc226-h'),
      problem('abc213-g'),
      problem('abc466-e', true),
      problem('abc300-f'),
    ];
    const expected = ['abc466-e', 'abc300-f', 'abc213-g', 'abc212-ex', 'abc226-h'];
    expect(orderProblemsByPrerequisites(input, skills)).toEqual(expected);
    expect(orderProblemsByPrerequisites([...input].reverse(), [...skills].reverse())).toEqual(
      expected,
    );
  });
  it('starts event sweep and probability with E problems before complex later slots', () => {
    expect(
      orderProblemsByPrerequisites(
        ['abc226-h', 'abc320-e', 'abc214-e', 'abc275-e', 'abc298-e', 'abc300-f'].map((id) =>
          problem(id),
        ),
        skills,
      ),
    ).toEqual(['abc214-e', 'abc275-e', 'abc298-e', 'abc320-e', 'abc300-f', 'abc226-h']);
  });
  it('keeps a local floor-sum exception inside its original slots', () => {
    const input = ['abc402-g', 'abc283-ex', 'abc443-g', 'abc300-f'].map((id) => problem(id));
    expect(orderProblemsByPrerequisites(input, skills, 'unit-euclidean-floor-sum')).toEqual([
      'abc300-f',
      'abc443-g',
      'abc402-g',
      'abc283-ex',
    ]);
    expect(orderProblemsByPrerequisites(input, skills, 'unit-unrelated')).toEqual([
      'abc300-f',
      'abc402-g',
      'abc443-g',
      'abc283-ex',
    ]);
  });
});
