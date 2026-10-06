import { readFile } from 'node:fs/promises';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
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
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { joinAndFilterLearningRecords } from '../../src/lib/learning-records/filter.js';
import { defaultLearningRecord } from '../../src/lib/learning-records/database.js';

const projection = await loadFullPublicProjection();
describe('accepted canonical full public projection', () => {
  it('preserves representative problems independently of direct tag assignments for all 213 tags', () => {
    expect(projection.ui.tags).toHaveLength(213);
    for (const tag of projection.catalog.tags) {
      const projected = projection.ui.tags.find((item) => item.id === tag.id);
      expect(projected?.representativeProblemIds, tag.id).toEqual(tag.representativeProblemIds);
      expect(projected?.problemIds.slice().sort(), tag.id).toEqual(
        projection.ui.problems
          .filter((problem) => problem.tagIds.includes(tag.id))
          .map(({ id }) => id)
          .sort(),
      );
    }
  });
  it('filters Problems and review records by the coverage of every leaf, parent, and chapter Unit', () => {
    const { problems, learningUnits } = projection.ui;
    const records = problems.map(({ id }) => ({ ...defaultLearningRecord(id), needsReview: true }));
    for (const unit of projection.catalog.learningUnits) {
      const projected = learningUnits.find((item) => item.id === unit.id);
      expect(projected?.coverageProblemIds, unit.id).toEqual(unit.problemIds);
      for (const needsReview of [null, true]) {
        const filtered = joinAndFilterLearningRecords(
          problems,
          records,
          { unit: unit.id, needsReview },
          learningUnits,
        );
        expect(filtered.map(({ problem }) => problem.id).sort(), unit.id).toEqual(
          [...unit.problemIds].sort(),
        );
      }
    }
    expect(
      joinAndFilterLearningRecords(problems, [], { unit: 'unknown-unit' }, learningUnits),
    ).toEqual([]);
    expect(joinAndFilterLearningRecords(problems, [], {}, learningUnits)).toHaveLength(904);
    expect(
      joinAndFilterLearningRecords(problems, [], { needsReview: true }, learningUnits),
    ).toEqual([]);
    const graphReview = joinAndFilterLearningRecords(
      problems,
      [{ ...defaultLearningRecord('abc218-e'), needsReview: true }],
      {
        unit: 'unit-chapter-graph',
        tag: 'tag-dsu-components',
        contest: 'abc218',
        needsReview: true,
      },
      learningUnits,
    );
    expect(graphReview.map(({ problem }) => problem.id)).toEqual(['abc218-e']);
    // ABC218 F is a related reference in this chapter, with its home in another chapter.
    expect(
      joinAndFilterLearningRecords(
        problems,
        [{ ...defaultLearningRecord('abc218-f'), needsReview: true }],
        { unit: 'unit-chapter-graph', needsReview: true },
        learningUnits,
      ),
    ).toEqual([]);
  });
  it('renders the actual slope-trick, semiring, and grammar-DP explanations without losing notation', async () => {
    const cases = [
      ['abc217-h', 'f(x)=m+Σ_{l∈L}(l−x)_++Σ_{r∈R}(x−r)_+'],
      ['abc236-g', '(P⊗Q)_{ij}=min_k max(P_{ik},Q_{kj})'],
      ['abc403-f', '最短の任意の <expr> と最短の乗算可能な <term> を別状態にする'],
      ['abc363-f', 'x*middle*rev(x)'],
    ] as const;
    for (const [id, notation] of cases) {
      const source = projection.problemDocuments.get(id)?.text;
      if (!source) throw new Error(`Missing accepted Problem: ${id}`);
      expect(source, id).toContain(notation);
      const $ = load(await renderPublicDocument(source, '/'));
      expect($('body').text(), id).toContain(notation);
    }
  });
  it('preserves literal mathematical paragraphs throughout all accepted Units and Problems', async () => {
    let checkedParagraphs = 0;
    const documents = [...projection.unitDocuments, ...projection.problemDocuments];
    expect(documents).toHaveLength(1136);
    for (const [id, document] of documents) {
      const source = parseFrontmatter(document.text).content;
      const $ = load(await renderPublicDocument(document.text, '/'));
      expect($('em, expr, term'), id).toHaveLength(0);
      // Compare plain source paragraphs independently of the Markdown parser.
      // Skip formatted/code blocks, whose syntax intentionally disappears.
      let inCode = false;
      for (const paragraph of source.split(/\n\s*\n/u)) {
        if (paragraph.includes('```')) {
          if ((paragraph.match(/```/gu)?.length ?? 0) % 2) inCode = !inCode;
          continue;
        }
        if (
          inCode ||
          !/[_*]|<expr>|<term>/u.test(paragraph) ||
          /^(?:\s|#|\||- |\d+\. )|`|\*\*|\]\(/u.test(paragraph)
        )
          continue;
        expect($('body').text(), `${id}: ${paragraph}`).toContain(paragraph);
        checkedParagraphs++;
      }
    }
    expect(checkedParagraphs).toBeGreaterThan(1000);
  }, 30_000);
  it('displays all accepted authoring bracket escapes without losing set differences', async () => {
    const checkedIds = new Set<string>();
    let checkedLines = 0;
    for (const [id, document] of [...projection.unitDocuments, ...projection.problemDocuments]) {
      const lines = parseFrontmatter(document.text)
        .content.split('\n')
        .filter((line) => line.includes('\\['));
      if (!lines.length) continue;
      const $ = load(await renderPublicDocument(document.text, '/'));
      for (const line of lines) {
        expect($('body').text(), id).toContain(line.replaceAll('\\[', '['));
        checkedLines++;
      }
      expect($('body').text(), id).not.toContain('\\[');
      checkedIds.add(id);
    }
    expect(checkedIds.size).toBeGreaterThanOrEqual(12);
    expect(checkedLines).toBeGreaterThanOrEqual(15);
  });
  it('joins all accepted content without leaking the preview or learner state', () => {
    const { ui, catalog } = projection;
    expect(ui.publicationBoundary).toBe('public');
    expect(ui.problems).toHaveLength(904);
    expect(ui.contests).toHaveLength(266);
    expect(ui.learningUnits).toHaveLength(232);
    expect(catalog.authoringUnits).toHaveLength(904);
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
