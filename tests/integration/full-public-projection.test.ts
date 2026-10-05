import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  assertAcceptedUnitPublication,
  loadFullPublicProjection,
} from '../../src/lib/catalog/full-public-projection.js';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { buildCatalog, catalogContentDigest } from '../../src/lib/catalog/build-catalog.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalUiRoutes } from '../../src/lib/catalog/ui-catalog.js';

const projection = await loadFullPublicProjection();
describe('accepted canonical full public projection', () => {
  it('joins all accepted content without leaking the preview or learner state', () => {
    const { ui, catalog } = projection;
    expect(ui.publicationBoundary).toBe('public');
    expect(ui.problems).toHaveLength(868);
    expect(ui.contests).toHaveLength(254);
    expect(ui.learningUnits).toHaveLength(232);
    expect(catalog.authoringUnits).toHaveLength(868);
    expect(ui.releaseHistory).toEqual([]);
    expect(ui.problems.every((problem) => problem.similarProblemIds.length === 0)).toBe(true);
    const serialized = JSON.stringify(ui);
    for (const forbidden of ['provisional-', 'initial-v1', 'staging/', 'needsReview', 'fixture'])
      expect(serialized).not.toContain(forbidden);
  });
  it('distinguishes a prepared projection from a production Release without inventing human reviews', () => {
    expect(projection.catalog.release.publicationStatus).toBe('prepared');
    expect(projection.catalog.release.humanContentReviewEvidenceRefs).toEqual([]);
    expect(
      catalogContentDigest({
        ...projection.catalog,
        release: { ...projection.catalog.release, publicationStatus: 'published' },
      }),
    ).not.toBe(catalogContentDigest(projection.catalog));
    expect(() => buildCatalog(projection.catalog)).toThrow('PUBLIC_PROJECTION_NOT_RELEASE');
    expect(
      CatalogSchema.safeParse({
        ...projection.catalog,
        release: { ...projection.catalog.release, publicationStatus: 'published' },
      }).success,
    ).toBe(false);
  });
  it('preserves editorial order independently of semantic parents and prerequisites', () => {
    expect(projection.ui.learningUnits.map((unit) => unit.id)).toEqual(
      TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]),
    );
    for (const unit of projection.catalog.learningUnits) {
      const projected = projection.ui.learningUnits.find((item) => item.id === unit.id);
      expect(projected?.problemIds).toEqual(unit.directProblemIds);
      expect(projected?.parentId).toBe(unit.parentId);
    }
  });
  it('uses the primary Outcome owner as the sole home and keeps all Outcome roles', () => {
    for (const problem of projection.ui.problems) {
      const placement = projection.policy.placements.find((item) => item.problemId === problem.id);
      if (!placement) throw new Error(`Missing placement: ${problem.id}`);
      const home = projection.catalog.learningUnits.find((unit) =>
        unit.ownedLearningOutcomeIds?.includes(placement.primaryOutcomeId),
      );
      expect(problem.learningUnitId).toBe(home?.id);
      expect(problem.relatedProblemIds).toEqual(
        home?.directProblemIds?.filter((id) => id !== problem.id),
      );
      expect(problem.additionalPrimaryOutcomeIds).toEqual(placement.additionalPrimaryOutcomeIds);
      expect(problem.supportingOutcomeIds).toEqual(placement.supportingOutcomeIds);
    }
  });
  it('binds published Unit bytes to their accepted draft body', async () => {
    for (const unit of projection.catalog.learningUnits) {
      const document = await readFile(unit.docPath, 'utf8');
      expect(document).toContain('\ndraft: false\n');
      expect(projection.unitDocuments.get(unit.id)?.accepted).toBe(true);
    }
  });
  it('rejects skeletons, still-draft Units, unaccepted prose, and metadata drift', async () => {
    const unit = projection.catalog.learningUnits.find(
      (item) => item.id === 'unit-xor-linear-basis',
    );
    if (!unit) throw new Error('Missing fixture Unit');
    const accepted = JSON.parse(
      await readFile('docs/verification/bootstrap/learning-unit-content.json', 'utf8'),
    ) as {
      units: {
        learningUnitId: string;
        documentPath: string;
        documentDigest: string;
        metadataDigest: string;
      }[];
    };
    const record = accepted.units.find((item) => item.learningUnitId === unit.id);
    const text = await readFile(unit.docPath, 'utf8');
    expect(() => {
      assertAcceptedUnitPublication({ ...unit, contentPhase: 'canonical_skeleton' }, text, record);
    }).toThrow('NOT_ACCEPTED');
    expect(() => {
      assertAcceptedUnitPublication(unit, text.replace('draft: false', 'draft: true'), record);
    }).toThrow('NOT_ACCEPTED');
    expect(() => {
      assertAcceptedUnitPublication(unit, text + '\n未受理の説明\n', record);
    }).toThrow('NOT_ACCEPTED');
    expect(() => {
      assertAcceptedUnitPublication(
        { ...unit, directProblemIds: [...(unit.directProblemIds ?? [])].reverse() },
        text,
        record,
      );
    }).toThrow('NOT_ACCEPTED');
  });
  it('projects every entity to one canonical destination and indexes only those destinations', () => {
    const routes = canonicalUiRoutes(projection.ui);
    expect(new Set(routes).size).toBe(routes.length);
    for (const doc of buildSearchDocuments(projection.ui)) expect(routes).toContain(doc.route);
    expect(routes).toContain('/contests/abc466/');
    expect(routes).toContain('/problems/abc466-g/');
  });
  it('resolves pending correction targets, retiring only the accepted absent preview blocks', () => {
    expect(projection.corrections).toHaveLength(12);
    expect(new Set(projection.corrections.map((impact) => impact.verificationStatus))).toEqual(
      new Set(['verified']),
    );
    expect(projection.retiredTargets.length).toBeGreaterThan(0);
    expect(new Set(projection.retiredTargets.map((target) => target.status))).toEqual(
      new Set(['not_applicable']),
    );
  });
  it('freezes a reproducible projection digest', async () => {
    const again = await loadFullPublicProjection();
    expect(again.digest).toBe(projection.digest);
    expect(projection.ui.subjectDigest).toBe(projection.digest);
    expect(canonicalDigest(projection.mapping)).toBe(projection.mappingDigest);
  }, 15_000);
});
