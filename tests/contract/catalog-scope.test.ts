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
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

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
  readonly cohortRules: {
    readonly domains: readonly string[];
    readonly minimumProblemsPerDomain: number;
    readonly minimumProblemCount: number;
    readonly minimumContestCount: number;
    readonly minimumAdvancedLabelCount: number;
    readonly stableSortKeys: readonly string[];
  };
  readonly publicationBoundary: Readonly<Record<string, unknown>>;
  readonly candidatePoolDigest: string | null;
  readonly selectedProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly frozenRulesDigest: string;
}

interface CohortCandidate {
  readonly problemId: string;
  readonly contestNumber: number;
  readonly officialTaskOrder: number;
  readonly advancedLabel: string;
  readonly domain: string;
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T;

const cohortViolations = (
  candidates: readonly CohortCandidate[],
  rules: PreviewSelectionManifest['cohortRules'],
): string[] => {
  const counts = new Map(rules.domains.map((domain) => [domain, 0]));
  for (const candidate of candidates) {
    if (counts.has(candidate.domain))
      counts.set(candidate.domain, (counts.get(candidate.domain) ?? 0) + 1);
  }
  return [
    ...(candidates.length < rules.minimumProblemCount ? ['problem_count'] : []),
    ...(new Set(candidates.map(({ contestNumber }) => contestNumber)).size <
    rules.minimumContestCount
      ? ['contest_count']
      : []),
    ...(new Set(candidates.map(({ advancedLabel }) => advancedLabel)).size <
    rules.minimumAdvancedLabelCount
      ? ['advanced_label_count']
      : []),
    ...rules.domains.flatMap((domain) =>
      (counts.get(domain) ?? 0) < rules.minimumProblemsPerDomain ? [`domain:${domain}`] : [],
    ),
  ];
};

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
    const rules = {
      seedRange: manifest.seedRange,
      scopeRule: manifest.scopeRule,
      cohortRules: manifest.cohortRules,
      publicationBoundary: manifest.publicationBoundary,
    };

    expect(manifest.phase).toBe('selection_rules_frozen');
    expect(manifest.candidatePoolDigest).toBeNull();
    expect(manifest.selectedProblemIds).toEqual([]);
    expect(manifest.sourceRevisionIds).toEqual([]);
    expect(manifest.frozenRulesDigest).toBe(canonicalDigest(rules));
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
    const candidates: CohortCandidate[] = cohortRules.domains.flatMap((domain, domainIndex) =>
      [0, 1].map((offset) => ({
        problemId: `abc${String(212 + domainIndex)}-${offset === 0 ? 'e' : 'f'}`,
        contestNumber: 212 + (domainIndex % 3),
        officialTaskOrder: 4 + offset,
        advancedLabel: offset === 0 ? 'E' : 'F',
        domain,
      })),
    );

    expect(cohortViolations(candidates, cohortRules)).toEqual([]);
    expect(cohortViolations(candidates.slice(0, 6), cohortRules)).toEqual(
      expect.arrayContaining(['problem_count', `domain:${cohortRules.domains.at(-1) ?? ''}`]),
    );
  });

  it('rejects staging as a public Catalog source even when the payload is otherwise valid', () => {
    expect(() =>
      buildCatalog(makeTrustedCatalog({}), ['staging/previews/initial-v1/catalog.json']),
    ).toThrow(/STAGING_PUBLICATION_BOUNDARY/u);
  });
});
