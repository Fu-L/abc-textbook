import { describe, expect, it } from 'vitest';

import { AdvancedSlotRegistrySchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  AdvancedSlotRegistryError,
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from '../../src/lib/catalog/advanced-slot-registry.js';
import { buildCatalog } from '../../src/lib/catalog/build-catalog.js';
import { parseOfficialTaskList } from '../../src/lib/catalog/official-task-list.js';

const taskList = (labels: readonly string[]) => `
  <table><tbody>${labels
    .map(
      (label) =>
        `<tr><td><a href="/contests/abc500/tasks/abc500_${label.toLowerCase()}">${label}</a></td><td><a href="/contests/abc500/tasks/abc500_${label.toLowerCase()}">Problem ${label}</a></td></tr>`,
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

  it('rejects task-list and task links for a different contest', () => {
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc501',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/CONTEST_URL_MISMATCH/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc501',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc501/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/TASK_LINK_CONTEST_MISMATCH/u);
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
    const existingSubject = {
      version: '1.0.0' as const,
      labels: ['E', 'F', 'G', 'H'],
      firstSeenContestByLabel: {
        E: 'abc212',
        F: 'abc212',
        G: 'abc212',
        H: 'abc212',
      },
      orderEvidenceSourceRevisionIds: ['source-abc212-task-order'],
    };
    const registry = buildAdvancedSlotRegistry({
      existingRegistry: { ...existingSubject, digest: canonicalDigest(existingSubject) },
      contests: [
        {
          contestId: 'abc500',
          advancedLabels: ['E', 'F', 'I', 'Ex'],
          sourceRevisionId: 'source-abc500-task-order',
        },
        {
          contestId: 'abc501',
          advancedLabels: ['E', 'F', 'G', 'H'],
          sourceRevisionId: 'source-abc501-task-order',
        },
      ],
    });

    expect(registry.labels).toEqual(['E', 'F', 'I', 'Ex', 'G', 'H']);
    expect(registry.firstSeenContestByLabel.E).toBe('abc212');
    expect(registry.orderEvidenceSourceRevisionIds).toContain('source-abc212-task-order');
    expect(AdvancedSlotRegistrySchema.safeParse(registry).success).toBe(true);
  });

  it('passes a newly built registry through the canonical catalog contract', () => {
    const registry = buildAdvancedSlotRegistry({
      contests: [
        {
          contestId: 'abc500',
          advancedLabels: ['E'],
          sourceRevisionId: 'source-abc500-task-order',
        },
      ],
    });
    const digest = 'a'.repeat(64);
    const catalog = buildCatalog({
      schemaVersion: '2.0.0',
      release: {
        version: '2026.07.17',
        releaseKind: 'initial',
        cutoffAt: '2026-07-17T12:00:00+09:00',
        validatedAt: '2026-07-17T12:01:00+09:00',
        publicationEffectiveAt: '2026-07-17T12:02:00+09:00',
        manifestDigest: digest,
        contentSnapshotDigest: digest,
        updateIds: ['update-foundation'],
        advancedSlotRegistryDigest: registry.digest,
        firstContestId: 'abc500',
        lastContestId: 'abc500',
        contestCount: 1,
        problemCount: 1,
        slotRecordCount: 1,
        addedProblemIds: [],
        changedProblemIds: [],
        heldProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
        validationSummary: {
          checkCount: 1,
          passedCheckCount: 1,
          blockingFindingCount: 0,
          evidenceDigests: [digest],
        },
        humanContentReviewEvidenceRefs: [
          {
            evidenceId: 'human-review-foundation',
            path: 'docs/judgments/merge/foundation/human-review.json',
            digest,
          },
        ],
        changelogPath: 'docs/changelog/2026.07.17.md',
      },
      advancedSlotRegistry: registry,
      contests: [],
      contestSlots: [],
      problems: [],
      techniqueInventory: [],
      tags: [],
      learningOutcomes: [],
      learningUnits: [],
      placements: [],
      explanations: [],
      sources: [],
      correctionImpacts: [],
      claims: [],
      examples: [],
      exercises: [],
      assessments: [],
      answerMaterials: [],
    });

    expect(catalog.advancedSlotRegistry).toEqual(registry);
  });

  it('places an order-conflict hold instead of guessing', () => {
    expect(() =>
      buildAdvancedSlotRegistry({
        contests: [
          {
            contestId: 'abc500',
            advancedLabels: ['E', 'F'],
            sourceRevisionId: 'source-abc500-task-order',
          },
          {
            contestId: 'abc501',
            advancedLabels: ['F', 'E'],
            sourceRevisionId: 'source-abc501-task-order',
          },
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
