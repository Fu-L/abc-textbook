import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from '../../src/lib/catalog/advanced-slot-registry.js';
import {
  buildCatalog,
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
  it('freezes valid, non-overlapping learning-outcome review units before story changes', async () => {
    const manifest = await readJson<unknown>('docs/work-manifests/initial/us2/manifest.json');
    expect(() => {
      validateContentWorkManifest(manifest);
    }).not.toThrow();
  });

  it('freezes selection rules without prematurely choosing Problems or Source Revisions', async () => {
    const manifest = await readJson<PreviewSelectionManifest>(
      'staging/previews/initial-v1/preview-manifest.json',
    );
    const rules: FrozenInitialV1SelectionRules = {
      seedRange: manifest.seedRange,
      scopeRule: manifest.scopeRule,
      cohortRules: manifest.cohortRules,
      publicationBoundary: manifest.publicationBoundary,
    };

    expect(manifest.phase).toBe('selection_rules_frozen');
    expect(manifest.candidatePoolDigest).toBeNull();
    expect(manifest.selectedProblemIds).toEqual([]);
    expect(manifest.sourceRevisionIds).toEqual([]);
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
