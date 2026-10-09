import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from '../../src/lib/catalog/advanced-slot-registry.js';
import {
  buildCatalog,
  buildCanonicalCatalog,
  validateCatalogSemantics,
  type CatalogLike,
} from '../../src/lib/catalog/build-catalog.js';
import {
  previewSelectionRulesDigest,
  validateCohortSelection,
  type PreviewCohortCandidate,
  type PreviewCohortRules,
} from '../../src/lib/preview/cohort-selection.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';
import {
  frozenInitialV1RulesDigest,
  frozenInitialV1SelectionRules,
  type FrozenInitialV1SelectionRules,
} from '../fixtures/preview-selection-rules.js';

interface PreviewSelectionManifest {
  readonly phase: string;
  readonly seedRange: {
    readonly firstContestNumber: number;
    readonly lastContestNumber: number;
    readonly requireContinuity: boolean;
  };
  readonly scopeRule: {
    readonly anchorLabel: string;
    readonly relation: string;
    readonly labelRegistry: string;
    readonly requireOfficialStateForEveryRegistryLabel: boolean;
  };
  readonly cohortRules: PreviewCohortRules;
  readonly publicationBoundary: FrozenInitialV1SelectionRules['publicationBoundary'];
  readonly candidatePoolDigest: string | null;
  readonly selectedProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly frozenRulesDigest: string;
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T;

describe('US2 catalog scope contract', () => {
  it('builds content without release ledgers while keeping semantic diagnostics', () => {
    const catalog = CatalogSchema.parse(
      JSON.parse(JSON.stringify(makeTrustedCatalog({})).replaceAll('abc212-x45', 'abc212-e')),
    );
    const problem = catalog.problems[0];
    if (!problem) throw new Error('Missing Problem fixture.');
    problem.placementId = 'placement-abc212-e';
    catalog.placements = [
      {
        id: problem.placementId,
        problemId: problem.id,
        policyVersion: '1.0.0',
        kind: 'full',
        primaryProblemId: null,
        sharedOutcomeIds: [],
        additionalElement: null,
        comparison: {
          method: 'Fixture method.',
          proof: 'Fixture proof.',
          complexity: 'O(1).',
          constraints: 'Fixture constraints.',
          prerequisites: 'Fixture prerequisites.',
          implementation: 'Fixture implementation.',
        },
        rationale: 'Fixture placement.',
        evidenceIds: ['evidence-official-analysis'],
      },
    ];
    Reflect.deleteProperty(catalog.release, 'manifestDigest');
    Reflect.deleteProperty(catalog.release, 'contentFileInventoryDigest');
    Reflect.deleteProperty(catalog.release, 'contentSnapshotDigest');
    Reflect.deleteProperty(catalog.release, 'validationSummary');
    Reflect.deleteProperty(catalog.release, 'humanContentReviewEvidenceRefs');
    expect(buildCanonicalCatalog(catalog).problems.length).toBe(catalog.problems.length);
    expect(() => buildCatalog(catalog)).toThrow('RELEASE_EVIDENCE_INVENTORY_REQUIRED');
    catalog.problems.push(structuredClone(problem));
    expect(() => buildCanonicalCatalog(catalog)).toThrow('DUPLICATE_PROBLEM_ID');
  });

  it('freezes valid, non-overlapping learning-outcome review units before story changes', async () => {
    const manifest = await readJson<unknown>('docs/work-manifests/initial/us2/manifest.json');
    expect(() => {
      validateContentWorkManifest(manifest);
    }).not.toThrow();
  });

  it('preserves the frozen selection rules after the deterministic cohort freeze', async () => {
    const manifest = await readJson<PreviewSelectionManifest>(
      'staging/previews/initial-v1/preview-manifest.json',
    );
    const rules: FrozenInitialV1SelectionRules = {
      seedRange: manifest.seedRange,
      scopeRule: manifest.scopeRule,
      cohortRules: manifest.cohortRules,
      publicationBoundary: manifest.publicationBoundary,
    };

    expect(manifest.phase).toBe('cohort_frozen');
    expect(manifest.candidatePoolDigest).toMatch(/^[a-f0-9]{64}$/u);
    expect(manifest.selectedProblemIds).toHaveLength(8);
    expect(new Set(manifest.selectedProblemIds).size).toBe(manifest.selectedProblemIds.length);
    expect(manifest.sourceRevisionIds.length).toBeGreaterThanOrEqual(
      manifest.selectedProblemIds.length,
    );
    expect(new Set(manifest.sourceRevisionIds).size).toBe(manifest.sourceRevisionIds.length);
    expect(rules).toEqual(frozenInitialV1SelectionRules);
    expect(manifest.frozenRulesDigest).toBe(frozenInitialV1RulesDigest);
    expect(previewSelectionRulesDigest(rules)).toBe(frozenInitialV1RulesDigest);
    expect(previewSelectionRulesDigest(frozenInitialV1SelectionRules)).toBe(
      frozenInitialV1RulesDigest,
    );
  });

  it('rejects a seed range with a missing Contest', () => {
    const catalog = makeTrustedCatalog({
      lastContestId: 'abc213',
      contestCount: 1,
    }) as CatalogLike;
    const codes = validateCatalogSemantics(catalog).map(({ code }) => code);
    expect(codes).toContain('CONTEST_RANGE_INCOMPLETE');
  });

  it('covers the release range with held Contests and official gaps exactly once', () => {
    const baseCatalog = makeTrustedCatalog({
      lastContestId: 'abc214',
      contestCount: 2,
    });
    const firstContest = baseCatalog.contests[0];
    if (!firstContest) throw new Error('Trusted catalog Contest fixture is missing.');
    const secondContest = {
      ...structuredClone(firstContest),
      id: 'abc214',
      number: 214,
      title: 'ABC 214',
      officialUrl: 'https://atcoder.jp/contests/abc214',
      officialTaskIds: ['abc214_a', 'abc214_b', 'abc214_c', 'abc214_d', 'abc214_e'],
      taskOrderSourceRevisionId: 'source-revision-abc214-e',
    };
    const gap = {
      number: 213,
      contestId: 'abc213',
      status: 'officially_unheld' as const,
      evidenceUrl: 'https://atcoder.jp/contests/abc350/tasks/abc350_a',
      evidenceAssertion: 'ABC213 was not held in this fixture.',
      checkedAt: '2026-07-17T02:00:00+09:00',
      termsCheckedAt: '2026-07-17T02:00:00+09:00',
      fingerprint: 'a'.repeat(64),
    };
    const catalog = {
      ...baseCatalog,
      contests: [...baseCatalog.contests, secondContest],
      contestGaps: [gap],
    };

    const validCodes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(validCodes).not.toContain('CONTEST_RANGE_INCOMPLETE');
    expect(validCodes).not.toContain('CONTEST_GAP_OVERLAP');

    const overlapCatalog = {
      ...catalog,
      contestGaps: [...catalog.contestGaps, { ...gap, number: 212, contestId: 'abc212' }],
    };
    const overlapCodes = validateCatalogSemantics(overlapCatalog as CatalogLike).map(
      ({ code }) => code,
    );
    expect(overlapCodes).toContain('CONTEST_GAP_OVERLAP');
    expect(overlapCodes).toContain('CONTEST_RANGE_INCOMPLETE');
  });

  it('derives scope strictly from every official label after D', () => {
    const registry = buildAdvancedSlotRegistry({
      contests: [
        {
          contestId: 'abc500',
          advancedLabels: ['E', 'F', 'I', 'Ex'],
          sourceRevisionId: 'source-abc500-task-order',
        },
      ],
    });
    expect(registry.labels).toEqual(['E', 'F', 'I', 'Ex']);
  });

  it('materializes a reasoned official state for every dynamic registry label', () => {
    const states = materializeContestSlotStates(
      ['E', 'F', 'G', 'H', 'I'],
      {
        contestId: 'abc500',
        officialTaskOrder: ['A', 'B', 'C', 'D', 'E', 'F', 'I'],
        officialTaskIds: [
          'abc500_a',
          'abc500_b',
          'abc500_c',
          'abc500_d',
          'abc500_e',
          'abc500_f',
          'abc500_i',
        ],
        advancedLabels: ['E', 'F', 'I'],
      },
      { F: 'unknown', I: 'withdrawn' },
    );
    expect(states).toHaveLength(5);
    expect(states.find(({ label }) => label === 'G')?.availability).toBe('official_absent');
    expect(states.find(({ label }) => label === 'F')?.availability).toBe('unknown');
    expect(states.find(({ label }) => label === 'I')?.availability).toBe('withdrawn');
  });

  it('requires all four domains, three Contests, and two advanced labels in one cohort', async () => {
    const { cohortRules } = await readJson<PreviewSelectionManifest>(
      'staging/previews/initial-v1/preview-manifest.json',
    );
    const candidates: PreviewCohortCandidate[] = cohortRules.domains.flatMap(
      (domain, domainIndex) =>
        [0, 1].map((offset) => ({
          problemId: `abc${String(212 + domainIndex)}-${offset === 0 ? 'e' : 'f'}`,
          contestNumber: 212 + (domainIndex % 3),
          officialTaskOrder: 4 + offset,
          advancedLabel: offset === 0 ? 'E' : 'F',
          candidateDomains: [domain],
          candidateOutcomeIds: [`outcome-${domain}`],
        })),
    );

    expect(validateCohortSelection(candidates, cohortRules)).toEqual([]);
    expect(validateCohortSelection(candidates.slice(0, 6), cohortRules)).toEqual(
      expect.arrayContaining(['problem_count', `domain:${cohortRules.domains.at(-1) ?? ''}`]),
    );
  });

  it('requires the selected cohort to cover every selected candidate outcome twice', async () => {
    const { cohortRules } = await readJson<PreviewSelectionManifest>(
      'staging/previews/initial-v1/preview-manifest.json',
    );
    const candidates: PreviewCohortCandidate[] = cohortRules.domains.flatMap(
      (domain, domainIndex) =>
        [0, 1].map((offset) => ({
          problemId: `abc${String(212 + domainIndex)}-${offset === 0 ? 'e' : 'f'}`,
          contestNumber: 212 + (domainIndex % 3),
          officialTaskOrder: 4 + offset,
          advancedLabel: offset === 0 ? 'E' : 'F',
          candidateDomains: [domain],
          candidateOutcomeIds: [`outcome-${String(domainIndex)}-${String(offset)}`],
        })),
    );

    expect(validateCohortSelection(candidates, cohortRules)).toEqual(
      expect.arrayContaining(['outcome:outcome-0-0', 'outcome:outcome-3-1']),
    );
  });

  it('counts distinct Problems for cohort size and domain coverage', async () => {
    const { cohortRules } = await readJson<PreviewSelectionManifest>(
      'staging/previews/initial-v1/preview-manifest.json',
    );
    const candidates: PreviewCohortCandidate[] = cohortRules.domains.flatMap(
      (domain, domainIndex) =>
        [0, 1].map((offset) => ({
          problemId: `abc${String(212 + domainIndex)}-${offset === 0 ? 'e' : 'f'}`,
          contestNumber: 212 + (domainIndex % 3),
          officialTaskOrder: 4 + offset,
          advancedLabel: offset === 0 ? 'E' : 'F',
          candidateDomains: [domain],
          candidateOutcomeIds: [`outcome-${domain}`],
        })),
    );
    const first = candidates[0];
    if (!first) throw new Error('Cohort fixture is incomplete.');

    const duplicated = [...candidates.slice(0, -1), { ...first }];
    expect(validateCohortSelection(duplicated, cohortRules)).toEqual(
      expect.arrayContaining([
        'duplicate_problem_id:abc212-e',
        'problem_count',
        `domain:${cohortRules.domains.at(-1) ?? ''}`,
      ]),
    );
  });

  it('rejects staging as a public Catalog source even when the payload is otherwise valid', () => {
    expect(() =>
      buildCatalog(makeTrustedCatalog({}), ['staging/previews/initial-v1/catalog.json']),
    ).toThrow(/STAGING_PUBLICATION_BOUNDARY/u);
  });
});
