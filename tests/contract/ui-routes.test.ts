import { describe, expect, it } from 'vitest';

import reviewEvidence from '../../docs/reviews/human-content/previews/initial-v1/us4/ui-search-review.json';
import workManifest from '../../docs/work-manifests/initial/us4/manifest.json';
import componentEvidence from '../../docs/verification/previews/initial-v1/components/ui-search.json';
import {
  buildPreviewUiCatalog,
  previewCatalog,
  canonicalPreviewRoutes,
  frozenPreviewUiCatalogSource,
  futureCompatibilityCatalog,
  futureProblemCompatibilityCatalog,
  withBase,
} from '../../src/lib/catalog/preview-ui-catalog.js';
import { buildPreviewCatalogContract } from '../../src/lib/catalog/preview-catalog-contract.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { HumanContentReviewEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { validatePreviewChain } from '../../src/lib/preview/preview-chain.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

describe('initial-v1 UI route contract', () => {
  it('freezes the US4 review scope before implementation', () => {
    expect(() => {
      validateContentWorkManifest(workManifest);
    }).not.toThrow();
  });

  it('freezes a current-subject reviewed UI/search component', () => {
    expect(validatePreviewChain([componentEvidence])).toEqual([]);
    expect(HumanContentReviewEvidenceSchema.parse(reviewEvidence).aggregatePassed).toBe(true);
    expect(componentEvidence.catalogSubjectDigest).toBe(buildPreviewUiCatalog().subjectDigest);
  });

  it('projects only the frozen preview cohort onto stable canonical routes', () => {
    const catalog = buildPreviewUiCatalog(frozenPreviewUiCatalogSource);

    expect(catalog.previewId).toBe('initial-v1');
    expect(catalog.problems).toHaveLength(8);
    expect(catalog.problems.map(({ id }) => id)).toEqual([
      'abc212-g',
      'abc215-e',
      'abc218-f',
      'abc222-g',
      'abc223-f',
      'abc232-e',
      'abc252-e',
      'abc256-f',
    ]);
    expect(catalog.problems.every(({ route }) => route === `/problems/${routeId(route)}/`)).toBe(
      true,
    );
    expect(new Set(catalog.problems.map(({ publicationState }) => publicationState))).toEqual(
      new Set(['preview']),
    );
  });

  it('serves the preview through the repository-wide CatalogSchema contract', () => {
    const catalog = buildPreviewCatalogContract();

    expect(() => CatalogSchema.parse(catalog)).not.toThrow();
    expect(catalog.schemaVersion).toBe('3.0.0');
    expect(catalog.problems.map(({ id }) => id)).toEqual(
      frozenPreviewUiCatalogSource.selectedProblemIds,
    );
    expect(catalog.release.validationSummary.checks[0]?.resultDigest).toBe(
      componentEvidence.artifactFiles[0]?.digest,
    );
    expect(catalog.release.humanContentReviewEvidenceRefs[0]?.digest).toBe(
      componentEvidence.reviewEvidence.digest,
    );
    const sourceIds = new Set(catalog.sources.map(({ id }) => id));
    for (const revisionId of catalog.problems.flatMap(
      ({ sourceRevisionIds }) => sourceRevisionIds,
    )) {
      expect(sourceIds).toContain(revisionId);
    }
    for (const revisionId of catalog.advancedSlotRegistry.orderEvidenceSourceRevisionIds) {
      expect(sourceIds).toContain(revisionId);
    }
  });

  it('projects future labels and unavailable states through the ordinary catalog path', () => {
    expect(futureCompatibilityCatalog.registry.labels).toContain('I');
    expect(
      futureCompatibilityCatalog.cells.find(
        ({ contestId, label }) => contestId === 'abc999' && label === 'I',
      )?.state,
    ).toBe('unpublished');
    expect(
      futureCompatibilityCatalog.cells.find(
        ({ contestId, label }) => contestId === 'abc999' && label === 'G',
      )?.state,
    ).toBe('unknown');
    expect(JSON.stringify(buildSearchDocuments(futureCompatibilityCatalog))).toContain('abc999');
  });

  it('lets unavailable official state override a selected preview problem', () => {
    const catalog = buildPreviewUiCatalog({
      ...frozenPreviewUiCatalogSource,
      contests: frozenPreviewUiCatalogSource.contests.map((contest) =>
        contest.id === 'abc212'
          ? { ...contest, slotStateOverrides: { G: 'unknown' as const } }
          : contest,
      ),
    });
    const cell = catalog.cells.find(
      ({ contestId, label }) => contestId === 'abc212' && label === 'G',
    );

    expect(cell?.state).toBe('unknown');
    expect(cell?.problemId).toBeNull();
  });

  it('projects a future I problem onto canonical routes, search, and coverage', () => {
    const futureProblem = futureProblemCompatibilityCatalog.problems.find(
      ({ id }) => id === 'abc999-i',
    );
    expect(futureProblem?.label).toBe('I');
    expect(canonicalPreviewRoutes(futureProblemCompatibilityCatalog)).toContain(
      '/problems/abc999-i/',
    );
    expect(JSON.stringify(buildSearchDocuments(futureProblemCompatibilityCatalog))).toContain(
      'Future I Projection Fixture',
    );
    expect(
      futureProblemCompatibilityCatalog.cells.find(
        ({ contestId, label }) => contestId === 'abc999' && label === 'I',
      )?.state,
    ).toBe('preview');
  });

  it('keeps base-path joining deterministic without double slashes', () => {
    expect(withBase('/problems/abc212-g/', '/abc-textbook/')).toBe(
      '/abc-textbook/problems/abc212-g/',
    );
    expect(withBase('/contests/', '/')).toBe('/contests/');
    expect(withBase('/feed.xml', '/abc-textbook/')).toBe('/abc-textbook/feed.xml');
  });

  it('provides canonical navigation for every entity', () => {
    const catalog = buildPreviewUiCatalog();
    const routes = canonicalPreviewRoutes(catalog);

    expect(routes).toContain('/');
    expect(routes).toContain('/learn/');
    expect(routes).toContain('/contests/');
    expect(routes).toContain('/updates/initial-v1/');
    for (const problem of catalog.problems) expect(routes).toContain(problem.route);
    for (const tag of catalog.tags) expect(routes).toContain(tag.route);
    for (const unit of catalog.learningUnits) expect(routes).toContain(unit.route);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('projects searchable entity kinds and terms without private state', () => {
    const documents = buildSearchDocuments(previewCatalog);
    const serialized = JSON.stringify(documents);

    expect(new Set(documents.map(({ entityKind }) => entityKind))).toEqual(
      new Set(['problem', 'technique-tag', 'learning-unit', 'contest', 'release']),
    );
    expect(serialized).toContain('graph-search');
    expect(serialized).toContain('グラフ・探索');
    expect(serialized).not.toContain('staging/');
    expect(serialized).not.toContain('needsReview');
  });
});

const routeId = (route: string): string => route.split('/').filter(Boolean).at(-1) ?? '';
