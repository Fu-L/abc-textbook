import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { buildCatalog, catalogContentDigest } from '../../src/lib/catalog/build-catalog.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalUiRoutes } from '../../src/lib/catalog/ui-catalog.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import {
  readProblemAuthoringDocument,
  renderProblemAuthoringDocument,
} from '../../src/lib/authoring/problem-authoring-document.js';
import {
  validateAuthoringOutput,
  type AuthoringInputPacket,
} from '../../src/lib/authoring/explanation-authoring-skill.js';
import { joinAndFilterLearningRecords } from '../../src/lib/learning-records/filter.js';
import { defaultLearningRecord } from '../../src/lib/learning-records/database.js';
import {
  assertCanonicalPreserved,
  readCanonicalSnapshot,
  withGitBaseline,
} from '../fixtures/maintenance-compatibility.js';

// Exercise the unreviewed projection independently of generated release acceptance.
const projection = await loadFullPublicProjection({ usePreparedRelease: false });

describe('maintenance compatibility against a Git commit', () => {
  it('preserves every entity, document byte, placement, direct prerequisite and reading order', async () => {
    await withGitBaseline(async (root) => {
      const before = await readCanonicalSnapshot(root);
      const after = await readCanonicalSnapshot(process.cwd());
      expect([
        before.problems.size,
        before.tags.size,
        before.outcomes.size,
        before.units.size,
      ]).toEqual([868, 213, 242, 232]);
      assertCanonicalPreserved(before, after);
      // Bind the runtime projection to the independently read canonical input, too.
      expect(projection.catalog.problems.map(({ id }) => id).sort()).toEqual(
        [...before.problems.keys()].sort(),
      );
      expect(new Map(projection.catalog.tags.map((value) => [value.id, value]))).toEqual(
        before.tags,
      );
      expect(
        new Map(projection.catalog.learningOutcomes.map((value) => [value.id, value])),
      ).toEqual(before.outcomes);
      expect(new Map(projection.catalog.learningUnits.map((value) => [value.id, value]))).toEqual(
        before.units,
      );
      expect(projection.policy.placements).toEqual(before.placements);
      expect(projection.prerequisites).toEqual(before.prerequisites);
      expect(projection.ui.learningUnits.map(({ id }) => id)).toEqual(
        before.order.flatMap(({ id, unitIds }) => [id, ...unitIds]),
      );
      for (const [id, document] of [...projection.unitDocuments, ...projection.problemDocuments]) {
        const docPath = before.units.get(id)?.docPath ?? before.problemDocumentPaths.get(id);
        if (!docPath) throw new Error(`Unknown projected document: ${id}`);
        expect(Buffer.from(document.text), id).toEqual(
          before.documents.get(path.relative('src/content/docs', docPath)),
        );
      }
    });
  }, 60_000);

  it('detects missing/rewritten prose and classification drift in a disposable copy', async () => {
    await withGitBaseline(async (root) => {
      const before = await readCanonicalSnapshot(root);
      const problem = [...before.problems.values()][0];
      if (!problem) throw new Error('Missing baseline Problem');
      const docPath = before.problemDocumentPaths.get(problem.id);
      if (!docPath) throw new Error('Missing baseline document path');
      const document = path.join(root, docPath);
      const bytes = await readFile(document);
      await rm(document);
      await expect(readCanonicalSnapshot(root)).rejects.toThrow('Missing document');
      await writeFile(document, Buffer.concat([bytes, Buffer.from('\n雛形への巻き戻し\n')]));
      const rewritten = await readCanonicalSnapshot(root);
      expect(() => {
        assertCanonicalPreserved(before, rewritten);
      }).toThrow('documents: changed');
      await writeFile(document, bytes);
      // Removing metadata and prose together still fails even though no dangling docPath remains.
      const missing = {
        ...before,
        problems: new Map(before.problems),
        documents: new Map(before.documents),
      };
      missing.problems.delete(problem.id);
      missing.documents.delete(path.relative('src/content/docs', docPath));
      expect(() => {
        assertCanonicalPreserved(before, missing);
      }).toThrow('problems: ID/path set changed');
      const reclassified = { ...before, placements: structuredClone(before.placements) };
      const placement = reclassified.placements[0];
      if (!placement) throw new Error('Missing baseline placement');
      const anotherOutcome = [...before.outcomes.keys()].find(
        (id) => id !== placement.primaryOutcomeId,
      );
      if (!anotherOutcome) throw new Error('Missing alternate Outcome');
      placement.primaryOutcomeId = anotherOutcome;
      expect(() => {
        assertCanonicalPreserved(before, reclassified);
      }).toThrow('Problem placements changed');
      for (const kind of [
        'tagPrerequisites',
        'learningOutcomePrerequisites',
        'learningUnitPrerequisites',
      ] as const) {
        const drift = { ...before, prerequisites: structuredClone(before.prerequisites) };
        drift.prerequisites[kind].pop();
        expect(() => {
          assertCanonicalPreserved(before, drift);
        }).toThrow(`${kind}: direct prerequisites changed`);
      }
      for (const kind of ['tags', 'outcomes', 'units'] as const) {
        const drift = {
          ...before,
          tags: new Map(before.tags),
          outcomes: new Map(before.outcomes),
          units: new Map(before.units),
        };
        const id = before[kind].keys().next().value;
        if (!id) throw new Error(`Missing ${kind} fixture`);
        drift[kind].delete(id);
        expect(() => {
          assertCanonicalPreserved(before, drift);
        }).toThrow(`${kind}: ID/path set changed`);
      }
      const reordered = {
        ...before,
        order: before.order.map((chapter) => ({
          ...chapter,
          unitIds: [...chapter.unitIds].reverse(),
        })),
      };
      expect(() => {
        assertCanonicalPreserved(before, reordered);
      }).toThrow('Textbook reading order changed');
      assertCanonicalPreserved(before, await readCanonicalSnapshot(root));
    });
  }, 60_000);
});
describe('accepted canonical full public projection', () => {
  it.each(['similar', 'supplement'] as const)(
    'publishes %s through the authoring reader, public loader and production-subpath HTML',
    async (kind) => {
      await withGitBaseline(async (root) => {
        const document = projection.problemDocuments.get('abc212-g');
        const primary = projection.problemDocuments.get('abc335-g');
        const problem = projection.catalog.problems.find((item) => item.id === 'abc212-g');
        if (!document || !primary || !problem) throw new Error('Missing abbreviated fixtures');
        // This disposable conversion exercises the format contract, not a proposed
        // reclassification of these real Problems. Keep the target's verified proof/sources.
        const unit = structuredClone(document.unit);
        delete unit.skill;
        unit.kind = kind;
        unit.primaryProblemId = primary.unit.problemId;
        unit.differenceSummary = '公開consumerの短縮形式を検証するfixture。';
        unit.sections = {
          differences: String(unit.sections.correctness),
          implementationNotes: String(unit.sections.implementationNotes),
        };
        const claim = unit.claims[0];
        if (!claim) throw new Error('Missing difference claim');
        claim.key = 'difference-proof';
        claim.text = String(unit.sections.differences);
        unit.examples = [];
        unit.exercises = [];
        const sources = unit.sourceRevisionIds.map((id) => {
          const source = projection.catalog.sources.find((item) => item.id === id);
          if (!source) throw new Error(`Missing fixture source: ${id}`);
          return source;
        });
        const links = {
          home: '[主題の単元](src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)',
          outcomes: unit.learningOutcomeIds,
          prerequisites: [],
          sources: sources.map((source) => `[公式出典](${source.url})`),
        };
        const text = renderProblemAuthoringDocument(unit, document.title, links);
        const read = readProblemAuthoringDocument(text);
        const input: AuthoringInputPacket = {
          problemId: unit.problemId,
          learningOutcomeIds: unit.learningOutcomeIds,
          baseline: { id: unit.baselineId, version: unit.baselineVersion },
          additionalPrerequisiteUnitIds: unit.additionalPrerequisiteUnitIds,
          excludedTopics: unit.excludedTopics,
          tagIds: unit.tagIds,
          constraints: [problem.constraintsSummary ?? '公式問題の制約を保持する。'],
          placementCandidate: {
            primaryProblemId: unit.primaryProblemId,
            comparison: {
              learningOutcomes: true,
              prerequisites: true,
              coreMethod: true,
              proofIdea: true,
              asymptoticComplexity: true,
            },
            additionalElement: kind === 'supplement' ? unit.differenceSummary : null,
          },
          technicalClaims: unit.claims.map(({ text, sourceRevisionIds }) => ({
            text,
            sourceRevisionIds,
          })),
          sources: sources.map((source) => ({
            sourceRevisionId: source.id,
            path: `src/content/sources/${source.id}.json`,
            sourceKind: source.sourceKind as 'official_problem' | 'official_editorial',
            officialTaskId: problem.officialTaskId,
            checkedAt: source.checkedAt,
            termsCheckedAt: source.termsCheckedAt,
            allowedUses: ['constraint_reference', 'technical_claim'],
          })),
        };
        expect(validateAuthoringOutput(read.unit, input)).toEqual({
          status: 'ready',
          diagnostics: [],
        });
        const policy = structuredClone(projection.policy);
        const placement = policy.placements.find((item) => item.problemId === unit.problemId);
        if (!placement) throw new Error('Missing fixture placement');
        placement.kind = kind;
        placement.primaryProblemId = unit.primaryProblemId;
        placement.sharedOutcomeIds = unit.learningOutcomeIds;
        placement.additionalElement = input.placementCandidate.additionalElement;
        // Keep current correction targets attached to the actual section after
        // changing the fixture's kind; the loader must still reject missing targets.
        for (const impact of policy.correctionImpacts)
          for (const locator of impact.affectedContentLocators)
            if (
              locator.ownerType === 'problem' &&
              locator.problemId === unit.problemId &&
              locator.path === 'sections.reasoning'
            )
              locator.path = 'sections.differences';
        const policyPath = path.join(root, 'src/content/policies/problem-placements.json');
        const writePolicy = async () => {
          policy.placementDigest = canonicalDigest(policy.placements);
          policy.correctionImpactDigest = canonicalDigest(policy.correctionImpacts);
          await writeFile(policyPath, JSON.stringify(policy));
          await writeFile(
            path.join(root, 'src/content/indexes/taxonomy.json'),
            JSON.stringify({ ...projection.taxonomyIndex, placements: policy.placements }),
          );
        };
        await writePolicy();
        const documentPath = path.join(root, unit.docPath);
        await writeFile(documentPath, text);
        const project = () =>
          loadFullPublicProjection({ repositoryRoot: root, usePreparedRelease: false });
        const published = await project();
        const publishedDocument = published.problemDocuments.get(unit.problemId);
        if (!publishedDocument) throw new Error('Missing published abbreviated document');
        expect(publishedDocument.unit).toEqual(read.unit);
        expect(
          published.catalog.problems.find((item) => item.id === unit.problemId)?.publicationStatus,
        ).toBe('published');
        expect(published.problemDocuments.get(unit.primaryProblemId)?.unit.kind).toBe('full');
        // Use the same renderer as the actual Problem page, with the production base path.
        const $ = load(await renderPublicDocument(publishedDocument.text, '/abc-textbook/'));
        const reference = $('a[href="/abc-textbook/problems/abc335-g/"]');
        expect(reference).toHaveLength(1);
        expect(reference.text()).toBe('abc335-g');
        expect($('p').first().text()).toContain('参照元の完全解説');
        expect($('p').first().text()).toContain('成立条件・正当性・全体計算量');
        expect(
          $('h2')
            .map((_i, heading) => $(heading).text())
            .get(),
        ).toContain('差分');
        expect(
          $('h2')
            .map((_i, heading) => $(heading).text())
            .get(),
        ).not.toContain('正当性');
        expect(published.mapping.some((item) => item.route === '/problems/abc335-g/')).toBe(true);

        for (const failure of [
          'missing-claim',
          'drift',
          'unverified',
          'stale',
          'contradicted',
          'foreign-source',
        ] as const) {
          const invalid = structuredClone(unit);
          const differenceClaim = invalid.claims[0];
          if (!differenceClaim) throw new Error('Missing rejection claim');
          if (failure === 'missing-claim') differenceClaim.text = '差分とは別の根拠。';
          if (failure === 'drift') invalid.sections.differences = '出典と照合していない差分。';
          if (['unverified', 'stale', 'contradicted'].includes(failure))
            differenceClaim.verificationStatus = failure as 'unverified' | 'stale' | 'contradicted';
          if (failure === 'foreign-source')
            differenceClaim.sourceRevisionIds = primary.unit.sourceRevisionIds;
          await writeFile(
            documentPath,
            renderProblemAuthoringDocument(invalid, document.title, links),
          );
          await expect(project(), `${kind}:${failure}`).rejects.toThrow(
            /CLAIM_DRIFT|CLAIM_HOLD|CLAIM_SOURCE/,
          );
        }
        await writeFile(documentPath, text);
        const bodyTarget = policy.correctionImpacts
          .flatMap((impact) => impact.affectedContentLocators)
          .find(
            (locator) =>
              locator.ownerType === 'problem' &&
              locator.problemId === unit.problemId &&
              locator.path === 'sections.differences',
          );
        if (!bodyTarget) throw new Error('Missing abbreviated body correction target');
        bodyTarget.path = 'sections.reasoning';
        await writePolicy();
        await expect(project()).rejects.toThrow(/CORRECTION_MISSING/);
        bodyTarget.path = 'sections.differences';
        const abbreviatedPrimary = structuredClone(primary.unit);
        abbreviatedPrimary.kind = 'similar';
        abbreviatedPrimary.primaryProblemId = 'abc212-e';
        abbreviatedPrimary.differenceSummary = '参照元が短縮解説である不正なfixture。';
        abbreviatedPrimary.sections = {
          differences: String(abbreviatedPrimary.sections.correctness),
          implementationNotes: String(abbreviatedPrimary.sections.implementationNotes),
        };
        abbreviatedPrimary.examples = [];
        abbreviatedPrimary.exercises = [];
        await writeFile(
          path.join(root, abbreviatedPrimary.docPath),
          renderProblemAuthoringDocument(abbreviatedPrimary, primary.title, links),
        );
        for (const primaryProblemId of ['abc999-g', primary.unit.problemId]) {
          const invalid = { ...unit, primaryProblemId };
          placement.primaryProblemId = primaryProblemId;
          await writePolicy();
          await writeFile(
            documentPath,
            renderProblemAuthoringDocument(invalid, document.title, links),
          );
          await expect(project(), `${kind}:primary:${primaryProblemId}`).rejects.toThrow(
            /PRIMARY|REFERENCE/,
          );
        }
      });
    },
    60_000,
  );
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
    expect(joinAndFilterLearningRecords(problems, [], {}, learningUnits)).toHaveLength(868);
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
    expect(documents).toHaveLength(1100);
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
  }, 60_000);
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
    expect(checkedIds.size).toBe(12);
    expect(checkedLines).toBe(15);
  });
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
    expect(projection.catalog.release.humanContentReviewEvidenceRefs).toBeUndefined();
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
    ).toBe(true);
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
  it('loads current Unit prose while preserving its published draft representation', () => {
    for (const unit of projection.catalog.learningUnits) {
      expect(projection.unitDocuments.get(unit.id)?.text).toContain('\ndraft: false\n');
      expect(projection.unitDocuments.get(unit.id)?.validated).toBe(true);
    }
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
    const again = await loadFullPublicProjection({ usePreparedRelease: false });
    expect(again.digest).toBe(projection.digest);
    expect(projection.ui.subjectDigest).toBe(projection.digest);
    expect(canonicalDigest(projection.mapping)).toBe(projection.mappingDigest);
  }, 60_000);
});

describe('current canonical prose without bootstrap acceptance ledgers', () => {
  it.each(['Problem', 'Unit'] as const)(
    'requires registered, passed executable examples in current %s prose without ledgers',
    async (owner) => {
      await withGitBaseline(async (root) => {
        const problem = projection.problemDocuments.get('abc212-e');
        const unit = projection.catalog.learningUnits.find(
          (item) => item.id === 'unit-xor-linear-basis',
        );
        if (!problem || !unit) throw new Error('Missing executable example fixtures');
        const docPath = owner === 'Problem' ? problem.unit.docPath : unit.docPath;
        const target = path.join(root, docPath);
        const original = await readFile(target, 'utf8');
        const { frontmatter, content } = parseFrontmatter(original);
        const example = {
          key: 'execution-check',
          learningOutcomeIds:
            owner === 'Problem' ? problem.unit.learningOutcomeIds : unit.learningOutcomeIds,
          kind: 'executable' as const,
          language: 'javascript',
          omissions: [],
          environment: 'Node.js 24.18.0',
          input: '入力なし',
          procedure: ['node example.cjs'],
          executionTarget: 'example.cjs',
          expectedResult: '1',
          verificationStatus: 'passed' as const,
          ...(owner === 'Problem' ? { learningUnitIds: ['unit-dp-state-design'] } : {}),
        };
        const update = async (
          examples: readonly (Omit<typeof example, 'verificationStatus'> & {
            verificationStatus: 'pending' | 'failed' | 'passed';
          })[],
          code: string,
        ) => {
          const body = content.replace(
            owner === 'Problem' ? '## 実装上の注意\n\n' : '## 考え方\n\n',
            (heading) => `${heading}${code}\n\n`,
          );
          if (owner === 'Problem') {
            const metadata = Object.fromEntries(
              Object.entries(problem.unit).filter(([key]) => key !== 'sections'),
            );
            await writeFile(
              target,
              `---\ntitle: ${JSON.stringify(frontmatter.title)}\ndraft: true\nauthoringUnit: ${JSON.stringify({ ...metadata, examples })}\n---\n${body}`,
            );
          } else {
            await writeFile(target, original.replace(content, body));
            await writeFile(
              path.join(root, 'src/content/learning-units/unit-xor-linear-basis.json'),
              JSON.stringify({ ...unit, examples }),
            );
            await writeFile(
              path.join(root, 'src/content/indexes/taxonomy.json'),
              JSON.stringify({
                ...projection.taxonomyIndex,
                learningUnits: projection.catalog.learningUnits.map((item) =>
                  item.id === unit.id ? { ...unit, examples } : item,
                ),
              }),
            );
          }
        };
        const project = () =>
          loadFullPublicProjection({ repositoryRoot: root, usePreparedRelease: false });
        for (const verificationStatus of ['pending', 'failed'] as const) {
          await update(
            [{ ...example, verificationStatus }],
            '```javascript\nthrow new Error("未検証または失敗した例");\n```',
          );
          await expect(project(), `${owner}:${verificationStatus}`).rejects.toThrow(/EXAMPLE_HOLD/);
        }
        const code = '```javascript\nconsole.log(1);\n```';
        await update([], code);
        await expect(project(), `${owner}:unregistered`).rejects.toThrow(/UNREGISTERED_EXECUTABLE/);
        await update([{ ...example, language: 'python' }], code);
        await expect(project(), `${owner}:wrong-language`).rejects.toThrow(
          /UNREGISTERED_EXECUTABLE/,
        );
        await update([example], `${code}\n\n${code}`);
        await expect(project(), `${owner}:second-unregistered-block`).rejects.toThrow(
          /UNREGISTERED_EXECUTABLE/,
        );
        await writeFile(path.join(root, 'example.cjs'), 'console.log(1);\n');
        const { stdout } = await promisify(execFile)(process.execPath, ['example.cjs'], {
          cwd: root,
        });
        expect(stdout.trim()).toBe(example.expectedResult);
        await update([example], code);
        const published = await project();
        if (owner === 'Problem') {
          expect(
            published.catalog.problems.find((item) => item.id === 'abc212-e')?.publicationStatus,
          ).toBe('published');
          expect(
            published.problemDocuments.get('abc212-e')?.unit.examples[0]?.verificationStatus,
          ).toBe('passed');
        } else {
          expect(published.unitDocuments.get(unit.id)?.validated).toBe(true);
          expect(
            published.catalog.learningUnits.find((item) => item.id === unit.id)?.examples[0]
              ?.verificationStatus,
          ).toBe('passed');
        }
      });
    },
    60_000,
  );

  it('projects small Unit and Problem corrections from a content-only copy', async () => {
    await withGitBaseline(async (root) => {
      const unit = projection.catalog.learningUnits.find(
        (item) => item.id === 'unit-xor-linear-basis',
      );
      const problem = projection.problemDocuments.get('abc212-e');
      if (!unit || !problem) throw new Error('Missing correction fixtures');
      const unitPath = path.join(root, unit.docPath);
      const problemPath = path.join(root, problem.unit.docPath);
      const unitText = await readFile(unitPath, 'utf8');
      const problemText = await readFile(problemPath, 'utf8');
      await writeFile(
        unitPath,
        unitText.replace('最高bitごとにpivotを保存する。', '各最高bitに対応するpivotを保存する。'),
      );
      // Unit prose is outside the structured catalog snapshot, so the legacy
      // prepared release must also match the current document inventory.
      await mkdir(path.join(root, 'docs/verification/releases'), { recursive: true });
      await cp(
        'docs/verification/releases/catalog.json',
        path.join(root, 'docs/verification/releases/catalog.json'),
      );
      await expect(loadFullPublicProjection({ repositoryRoot: root })).rejects.toThrow(
        'FULL_PROJECTION_PREPARED_RELEASE_DRIFT',
      );
      await writeFile(
        problemPath,
        problemText.replace(
          '## 実装上の注意\n\n',
          '## 実装上の注意\n\n添字と状態の対応を確認する。\n\n',
        ),
      );
      const corrected = await loadFullPublicProjection({
        repositoryRoot: root,
        usePreparedRelease: false,
      });
      expect(corrected.unitDocuments.get(unit.id)?.text).toContain('各最高bitに対応するpivot');
      expect(
        corrected.problemDocuments.get('abc212-e')?.unit.sections.implementationNotes,
      ).toContain('添字と状態の対応');
      expect(corrected.mapping).toEqual(projection.mapping);
      expect(canonicalUiRoutes(corrected.ui)).toEqual(canonicalUiRoutes(projection.ui));
      expect(corrected.digest).not.toBe(projection.digest);
      expect(corrected.catalog.release.validationSummary).toBeUndefined();
      await expect(loadFullPublicProjection({ repositoryRoot: root })).rejects.toThrow(
        'FULL_PROJECTION_PREPARED_RELEASE_DRIFT',
      );
    });
  }, 60_000);

  it('rejects invalid current prose, sources, placement and prerequisites without ledgers', async () => {
    await withGitBaseline(async (root) => {
      const problem = projection.problemDocuments.get('abc212-e');
      const unit = projection.catalog.learningUnits.find(
        (item) => item.id === 'unit-xor-linear-basis',
      );
      if (!problem || !unit) throw new Error('Missing rejection fixtures');
      const problemPath = problem.unit.docPath;
      const cases = [
        { file: problemPath, change: () => null, error: /ENOENT|MISSING|COVERAGE/ },
        { file: unit.docPath, change: () => null, error: /ENOENT|MISSING|COVERAGE/ },
        {
          file: problemPath,
          change: (text: string) => text.replace('## 考察', '## 未完成'),
          error: /AUTHORING_SECTION/,
        },
        {
          file: problemPath,
          change: (text: string) =>
            text.replace(
              /## 考察\n\n[\s\S]*?\n\n## 典型の発動条件/u,
              '## 考察\n\n\n\n## 典型の発動条件',
            ),
          error: /AUTHORING|explanation|reasoning/i,
        },
        {
          file: problemPath,
          change: (text: string) =>
            text.replace('"verificationStatus":"verified"', '"verificationStatus":"held"'),
          error: /CLAIM|verificationStatus/,
        },
        {
          file: problemPath,
          change: (text: string) =>
            text.replace('"problemId":"abc212-e"', '"problemId":"abc212-f"'),
          error: /DUPLICATE|COVERAGE|OWNER/,
        },
        {
          file: problemPath,
          change: (text: string) => text.replace(problemPath, 'src/content/docs/problems/wrong.md'),
          error: /OWNER|PATH/,
        },
        {
          file: unit.docPath,
          change: (text: string) => text.replace('draft: false', 'draft: true'),
          error: /UNIT_DOCUMENT/,
        },
        {
          file: unit.docPath,
          change: (text: string) => text.replace('## 考え方', '## 未完成'),
          error: /UNIT_DOCUMENT/,
        },
        {
          file: 'src/content/learning-units/unit-xor-linear-basis.json',
          change: (text: string) => text.replace('full_authoring', 'canonical_skeleton'),
          error: /UNIT_DOCUMENT/,
        },
        {
          file: problemPath,
          change: (text: string) => text.replace('"unit-dp-state-design"', '"unit-unknown"'),
          error: /AUTHORING_REFERENCE/,
        },
        {
          file: problemPath,
          change: (text: string) => text.replace('## 正当性\n\n', '## 正当性\n\n別の主張。\n\n'),
          error: /CLAIM_DRIFT/,
        },
        {
          file: problemPath,
          change: (text: string) =>
            text.replaceAll('https://atcoder.jp/', 'https://missing.example/'),
          error: /SOURCE_REFERENCE/,
        },
        {
          file: problemPath,
          change: (text: string) =>
            text.replaceAll(problem.unit.sourceRevisionIds[0] ?? '', 'source-unknown'),
          error: /SOURCE/,
        },
        {
          file: unit.docPath,
          change: (text: string) =>
            text.replaceAll('https://atcoder.jp/', 'https://missing.example/'),
          error: /SOURCE/,
        },
        {
          file: 'src/content/problems/abc212-abc263/abc212-e.json',
          change: (text: string) => text.replace('abc212_e', 'abc212_f'),
          error: /TASK|identity|officialUrl/i,
        },
        {
          file: 'src/content/problems/abc212-abc263/abc212-e.json',
          change: (text: string) =>
            text.replaceAll(
              projection.catalog.problems.find((item) => item.id === 'abc212-e')
                ?.sourceRevisionIds[0] ?? '',
              projection.catalog.problems.find((item) => item.id === 'abc212-f')
                ?.sourceRevisionIds[0] ?? '',
            ),
          error: /SOURCE_TASK/,
        },
        {
          file: 'src/content/policies/problem-placements.json',
          change: () => {
            const value = structuredClone(projection.policy);
            const placement = value.placements[0];
            if (!placement) throw new Error('Missing placement');
            placement.primaryOutcomeId = 'outcome-unknown';
            value.placementDigest = canonicalDigest(value.placements);
            return JSON.stringify(value);
          },
          error: /OWNER|OUTCOME|PLACEMENT|PROBLEM_HOME/,
        },
        {
          file: 'src/content/policies/learning-prerequisites.json',
          change: () => {
            const value = structuredClone(projection.prerequisites);
            const edge = value.learningUnitPrerequisites[0];
            if (!edge) throw new Error('Missing prerequisite');
            edge.nodeId = 'unit-unknown';
            value.learningUnitDagDigest = canonicalDigest(value.learningUnitPrerequisites);
            return JSON.stringify(value);
          },
          error: /RELEASE_DAG_UNKNOWN/,
        },
      ];
      for (const { file, change, error } of cases) {
        const target = path.join(root, file);
        const original = await readFile(target, 'utf8');
        const changed = change(original);
        expect(changed, file).not.toBe(original);
        if (changed === null) await rm(target);
        else await writeFile(target, changed);
        try {
          await expect(
            loadFullPublicProjection({ repositoryRoot: root, usePreparedRelease: false }),
            file,
          ).rejects.toThrow(error);
        } finally {
          await writeFile(target, original);
        }
      }
    });
  }, 60_000);
});

it.skipIf(!process.env.ABC_COMPAT_NEW_DIST)(
  'checks the current built projection without frozen evidence and rejects stale output',
  async () => {
    const dist = process.env.ABC_COMPAT_NEW_DIST;
    if (!dist) throw new Error('Missing build for projection verification');
    await withGitBaseline(async (root) => {
      await cp(dist, path.join(root, 'dist'), { recursive: true });
      const endpointPath = path.join(root, 'dist/data/catalog.json');
      const endpoint = await readFile(endpointPath, 'utf8');
      await mkdir(path.join(root, 'docs/verification/releases'), { recursive: true });
      await writeFile(path.join(root, 'docs/verification/releases/catalog.json'), endpoint);
      const execute = promisify(execFile);
      const verify = () =>
        execute(
          process.execPath,
          [
            '--import',
            fileURLToPath(new URL('../../node_modules/tsx/dist/loader.mjs', import.meta.url)),
            fileURLToPath(
              new URL('../../scripts/corpus/verify-full-projections.ts', import.meta.url),
            ),
            '--check',
          ],
          { cwd: root, env: process.env },
        );
      expect((await verify()).stdout).toContain('"status":"passed"');
      await expect(
        readFile(path.join(root, 'docs/verification/bootstrap/us4/full-projections.json')),
      ).rejects.toThrow(/ENOENT/);
      await writeFile(endpointPath, endpoint.replace('Safety Journey', 'Stale title'));
      await expect(verify()).rejects.toThrow('FULL_PROJECTION_ENDPOINT_STALE');
      await writeFile(endpointPath, endpoint);
      const page = path.join(root, 'dist/problems/abc212-e/index.html');
      const html = await readFile(page);
      await rm(page);
      await expect(verify()).rejects.toThrow('ENOENT');
      await writeFile(page, html);
      const tagPage = path.join(root, 'dist/tags/tag-slope-trick/index.html');
      const tagHtml = await readFile(tagPage, 'utf8');
      await writeFile(tagPage, tagHtml.replaceAll('絶対値costを順次追加', '失われた発動条件'));
      await expect(verify()).rejects.toThrow('FULL_PROJECTION_TAG_RECALL');
    });
  },
  60_000,
);
