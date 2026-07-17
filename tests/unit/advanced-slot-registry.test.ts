import { describe, expect, it } from 'vitest';

import {
  AdvancedSlotRegistryError,
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from '../../src/lib/catalog/advanced-slot-registry.js';
import { parseOfficialTaskList } from '../../src/lib/catalog/official-task-list.js';

const taskList = (labels: readonly string[]) => `
  <table><tbody>${labels
    .map(
      (label) =>
        `<tr><td><a href="/contests/abc500/tasks/abc500_${label.toLowerCase()}">${label}</a></td><td>Problem ${label}</td></tr>`,
    )
    .join('')}</tbody></table>`;

describe('official advanced slot registry', () => {
  it('selects every official task after D without copying statements', () => {
    const parsed = parseOfficialTaskList({
      contestId: 'abc500',
      officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
      html: taskList(['A', 'B', 'C', 'D', 'E', 'F', 'I', 'Ex']),
      checkedAt: '2026-07-17T12:00:00+09:00',
    });

    expect(parsed.advancedLabels).toEqual(['E', 'F', 'I', 'Ex']);
    expect(parsed.sourceFingerprint).toMatch(/^[a-f0-9]{64}$/u);
    expect(JSON.stringify(parsed)).not.toContain('Problem E');
  });

  it('fails closed when D is missing or a label is duplicated', () => {
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/D_TASK_NOT_FOUND/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/DUPLICATE_TASK_LABEL/u);
  });

  it('keeps the existing order while inserting future labels from official constraints', () => {
    const registry = buildAdvancedSlotRegistry({
      existingLabels: ['E', 'F', 'G', 'H'],
      contests: [
        { contestId: 'abc500', advancedLabels: ['E', 'F', 'I', 'Ex'] },
        { contestId: 'abc501', advancedLabels: ['E', 'F', 'G', 'H'] },
      ],
    });

    expect(registry.labels).toEqual(['E', 'F', 'I', 'Ex', 'G', 'H']);
  });

  it('places an order-conflict hold instead of guessing', () => {
    expect(() =>
      buildAdvancedSlotRegistry({
        existingLabels: ['E', 'F'],
        contests: [
          { contestId: 'abc500', advancedLabels: ['E', 'F'] },
          { contestId: 'abc501', advancedLabels: ['F', 'E'] },
        ],
      }),
    ).toThrow(AdvancedSlotRegistryError);
  });

  it('records a missing H as official absence and keeps unknown/withdrawn distinct', () => {
    const states = materializeContestSlotStates(
      ['E', 'F', 'G', 'H', 'I', 'Ex'],
      { contestId: 'abc500', advancedLabels: ['E', 'F', 'G', 'I', 'Ex'] },
      { I: 'unknown', Ex: 'withdrawn' },
    );

    expect(states.find(({ label }) => label === 'H')).toMatchObject({
      officialOrder: null,
      availability: 'official_absent',
    });
    expect(states.find(({ label }) => label === 'I')?.availability).toBe('unknown');
    expect(states.find(({ label }) => label === 'Ex')?.availability).toBe('withdrawn');
  });
});
