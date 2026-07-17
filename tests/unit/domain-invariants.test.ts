import { describe, expect, it } from 'vitest';

import { sortCatalogEntityArray } from '../../src/lib/catalog/build-catalog.js';
import {
  canonicalDigest,
  canonicalJson,
  digestWithoutField,
} from '../../src/lib/domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../../src/lib/domain/date-time.js';
import { stableContestId, stableProblemId } from '../../src/lib/domain/identity.js';
import {
  DependencyCycleError,
  deterministicTopologicalOrder,
} from '../../src/lib/validation/validate.js';
import {
  createContentWorkManifest,
  validateContentWorkManifest,
  WorkManifestError,
} from '../../src/lib/validation/content-work-manifest.js';

describe('domain invariants', () => {
  it('derives stable IDs from immutable official identity', () => {
    expect(stableContestId(212)).toBe('abc212');
    expect(stableProblemId('abc212', 'Ex')).toBe('abc212-ex');
    expect(() => stableProblemId('contest title', 'E')).toThrow();
  });

  it('preserves RFC 3339 offsets while comparing UTC instants', () => {
    const tokyo = parseOffsetDateTime('2026-07-17T12:00:00+09:00');
    const utc = parseOffsetDateTime('2026-07-17T03:00:00Z');

    expect(tokyo.original).toBe('2026-07-17T12:00:00+09:00');
    expect(tokyo.offset).toBe('+09:00');
    expect(compareOffsetDateTimes(tokyo, utc)).toBe(0);
    expect(() => parseOffsetDateTime('2026-07-17T12:00:00')).toThrow();
    expect(() => parseOffsetDateTime('2026-02-30T12:00:00+09:00')).toThrow();
    expect(() => parseOffsetDateTime('2026-04-31T00:00:00Z')).toThrow();
    expect(() => parseOffsetDateTime('2026-07-17T24:00:00Z')).toThrow();
    expect(() => parseOffsetDateTime('2026-07-17T12:00:00+24:00')).toThrow();
    expect(() => parseOffsetDateTime('2024-02-29T23:59:59.123456789-23:59')).not.toThrow();
  });

  it('canonicalizes keys, rejects non-NFC strings, and produces SHA-256 digests', () => {
    expect(canonicalJson({ z: 1, a: ['x', null] })).toBe('{"a":["x",null],"z":1}');
    expect(canonicalDigest({ z: 1, a: ['x', null] })).toMatch(/^[a-f0-9]{64}$/u);
    expect(() => canonicalJson({ text: 'e\u0301' })).toThrow(/NFC/u);
    expect(canonicalJson({ '\u{1f600}': 1, '\ue000': 2 })).toBe('{"😀":1,"":2}');
    expect(() => canonicalJson({ text: '\ud800' })).toThrow(/surrogate/u);
    expect(() => canonicalJson({ '\udc00': 'invalid key' })).toThrow(/surrogate/u);
    expect(() => canonicalJson({ text: '😀' })).not.toThrow();
  });

  it('encodes every allowed problem-label punctuation without stable-ID collisions', () => {
    expect(stableProblemId('abc500', 'A+B')).not.toBe(stableProblemId('abc500', 'A-plus-B'));
    expect(stableProblemId('abc500', 'A_B')).not.toBe(stableProblemId('abc500', 'A-B'));
    expect(stableProblemId('abc500', 'Ex')).toBe('abc500-ex');
  });

  it('sorts contest slots by contest and official order independent of input order', () => {
    const slots = [
      { contestId: 'abc500', label: 'Ex', officialOrder: null, problemId: null },
      { contestId: 'abc501', label: 'E', officialOrder: 0, problemId: 'abc501-e' },
      { contestId: 'abc500', label: 'F', officialOrder: 1, problemId: 'abc500-f' },
      { contestId: 'abc500', label: 'E', officialOrder: 0, problemId: 'abc500-e' },
    ];
    const expected = ['abc500:E', 'abc500:F', 'abc500:Ex', 'abc501:E'];
    const keys = (input: typeof slots): string[] =>
      sortCatalogEntityArray('contestSlots', input).map(
        (slot) => `${slot.contestId ?? ''}:${slot.label ?? ''}`,
      );

    expect(keys(slots)).toEqual(expected);
    expect(keys([...slots].reverse())).toEqual(expected);
  });

  it('rejects cycles and orders ready nodes deterministically', () => {
    expect(
      deterministicTopologicalOrder(
        [
          { id: 'unit-b', prerequisiteIds: [], ranks: [0, 0, 0] },
          { id: 'unit-a', prerequisiteIds: [], ranks: [0, 0, 0] },
          { id: 'unit-c', prerequisiteIds: ['unit-a'], ranks: [0, 0, 0] },
        ],
        (node) => node.ranks,
      ).map(({ id }) => id),
    ).toEqual(['unit-a', 'unit-b', 'unit-c']);

    expect(() =>
      deterministicTopologicalOrder(
        [
          { id: 'unit-a', prerequisiteIds: ['unit-b'], ranks: [0] },
          { id: 'unit-b', prerequisiteIds: ['unit-a'], ranks: [0] },
        ],
        (node) => node.ranks,
      ),
    ).toThrow(DependencyCycleError);
  });

  it('freezes non-overlapping pre-change review units and outcome scope', () => {
    const base = {
      manifestId: 'work-manifest-T024-foundation',
      taskId: 'T024',
      changeKind: 'tooling',
      requiredRequirementIds: ['FR-001'],
      learningOutcomeIds: ['outcome-foundation'],
      maintenanceBenefit: 'Centralizes review scope checks and prevents duplicated gates.',
      createdAt: '2026-07-17T12:00:00+09:00',
    } as const;
    const reviewUnit = {
      unitId: 'RU-T024-foundation',
      paths: ['src/lib/validation/content-work-manifest.ts'],
      itemIds: ['content-work-manifest'],
      requirementIds: ['FR-001'],
      learningOutcomeIds: ['outcome-foundation'],
      dependencyUnitIds: [],
      checkIds: ['check-unit'],
      evidenceRole: 'automated_validation',
      ownerId: 'person-maintainer',
    } as const;

    expect(() => createContentWorkManifest({ ...base, reviewUnits: [reviewUnit] })).not.toThrow();
    expect(() =>
      createContentWorkManifest({
        ...base,
        reviewUnits: [reviewUnit, { ...reviewUnit, unitId: 'RU-T024-duplicate' }],
      }),
    ).toThrow(WorkManifestError);

    const created = createContentWorkManifest({ ...base, reviewUnits: [reviewUnit] });
    const staleScope = structuredClone(created) as Record<string, unknown>;
    const staleUnits = staleScope.reviewUnits as { itemIds: string[] }[];
    staleUnits[0]?.itemIds.push('silently-added-item');
    staleScope.digest = digestWithoutField(staleScope, 'digest');
    expect(() => {
      validateContentWorkManifest(staleScope);
    }).toThrow(/WORK_MANIFEST_SCOPE_DIGEST_MISMATCH/u);

    expect(() =>
      createContentWorkManifest({
        ...base,
        requiredRequirementIds: ['FR-001', 'FR-002'],
        reviewUnits: [reviewUnit],
      }),
    ).toThrow(/REQUIREMENT_SCOPE_MISMATCH/u);

    expect(() =>
      createContentWorkManifest({
        ...base,
        reviewUnits: [
          reviewUnit,
          {
            ...reviewUnit,
            unitId: 'RU-T024-second',
            paths: ['src/lib/validation/second.ts'],
          },
        ],
      }),
    ).toThrow(/OVERLAPPING_REVIEW_UNIT_ITEM/u);

    expect(() =>
      createContentWorkManifest({
        ...base,
        reviewUnits: [
          { ...reviewUnit, dependencyUnitIds: ['RU-T024-second'] },
          {
            ...reviewUnit,
            unitId: 'RU-T024-second',
            paths: ['src/lib/validation/second.ts'],
            itemIds: ['second-item'],
            dependencyUnitIds: ['RU-T024-foundation'],
          },
        ],
      }),
    ).toThrow(/INVALID_REVIEW_UNIT_DEPENDENCY/u);
  });
});
