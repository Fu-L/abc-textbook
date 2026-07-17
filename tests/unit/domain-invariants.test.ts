import { describe, expect, it } from 'vitest';

import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../../src/lib/domain/date-time.js';
import { stableContestId, stableProblemId } from '../../src/lib/domain/identity.js';
import {
  DependencyCycleError,
  deterministicTopologicalOrder,
} from '../../src/lib/validation/validate.js';
import {
  createContentWorkManifest,
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
  });

  it('canonicalizes keys, rejects non-NFC strings, and produces SHA-256 digests', () => {
    expect(canonicalJson({ z: 1, a: ['x', null] })).toBe('{"a":["x",null],"z":1}');
    expect(canonicalDigest({ z: 1, a: ['x', null] })).toMatch(/^[a-f0-9]{64}$/u);
    expect(() => canonicalJson({ text: 'e\u0301' })).toThrow(/NFC/u);
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
  });
});
