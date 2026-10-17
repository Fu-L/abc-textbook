import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { publicProjection, publicCatalog } from '../../src/lib/catalog/public-catalog.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import {
  isStudyPreview,
  previewUnit,
  previewProblem,
  STUDY_PREVIEW_ROUTES,
} from '../../src/lib/study-preview/render.js';

const base = '/abc-textbook/';
const links = (html: string) =>
  load(html)('a[href]')
    .map((_, a) => a.attribs.href)
    .get();
const anchors = (html: string) =>
  load(html)('[id]')
    .map((_, node) => node.attribs.id)
    .get();

describe('representative reading prototype', () => {
  it('requires explicit opt-in and limits changes to four exact routes', () => {
    expect(STUDY_PREVIEW_ROUTES).toHaveLength(4);
    for (const route of STUDY_PREVIEW_ROUTES) {
      expect(isStudyPreview(undefined, route)).toBe(false);
      expect(isStudyPreview('0', route)).toBe(false);
      expect(isStudyPreview('true', route)).toBe(false);
      expect(isStudyPreview('1', route)).toBe(true);
    }
    expect(isStudyPreview('1', '/problems/abc251-f/')).toBe(false);
    expect(isStudyPreview('1', '/learn/')).toBe(false);
  });

  for (const id of ['unit-priority-queue-best-first', 'unit-range-monoid-aggregation']) {
    it(`keeps all original unit anchors, references, detailed text, and problem order: ${id}`, async () => {
      const doc = publicProjection.unitDocuments.get(id);
      if (!doc) throw new Error(id);
      const original = await renderPublicDocument(
        doc.text,
        base,
        true,
        new Map(publicCatalog.problems.map((p) => [p.officialUrl, p.route])),
      );
      const after = await previewUnit(original, id, base);
      const $ = load(after, null, false);
      for (const link of links(original)) expect(links(after)).toContain(link);
      for (const anchor of anchors(original)) expect(anchors(after)).toContain(anchor);
      expect(new Set(anchors(after)).size).toBe(anchors(after).length);
      const normalize = (text: string) => text.replace(/\s+/gu, '');
      // Every paragraph in the original remains available, including collapsed details.
      const originalDocument = load(original);
      for (const paragraph of originalDocument('p').toArray()) {
        expect(normalize($.root().text())).toContain(normalize(originalDocument(paragraph).text()));
      }
      for (const heading of ['問題一覧', '関連問題']) {
        const before = originalDocument(`[id="${heading}"]`)
          .nextAll('ul')
          .first()
          .children('li')
          .map((_, row) => originalDocument(row).find('a').first().attr('href'))
          .get();
        const compact = $(`[id="${heading}"]`)
          .nextAll('ul')
          .first()
          .children('li')
          .map((_, row) => $(row).find('a').first().attr('href'))
          .get();
        expect(compact).toEqual(before);
      }
      expect($('math').length).toBeGreaterThan(0);
      expect($('details').length).toBeGreaterThan(0);
    });
  }

  for (const id of ['abc391-f', 'abc213-g']) {
    it(`retains problem anchors and official links while exposing proof before metadata: ${id}`, async () => {
      const doc = publicProjection.problemDocuments.get(id);
      if (!doc) throw new Error(id);
      const original = await renderPublicDocument(doc.text, base);
      const after = await previewProblem(original, id, base);
      for (const link of links(original)) expect(links(after)).toContain(link);
      for (const anchor of anchors(original)) expect(anchors(after)).toContain(anchor);
      expect(new Set(anchors(after)).size).toBe(anchors(after).length);
      const $ = load(after, null, false);
      expect($.root().children().first().is('nav')).toBe(true);
      expect($('#考察').parents('details')).toHaveLength(0);
      const reading = splitProblemContext(after);
      expect(load(reading.body)('#学習の位置')).toHaveLength(0);
      expect(load(reading.context)('#学習の位置')).toHaveLength(1);
      expect($('math').length).toBeGreaterThan(0);
    });
  }

  it('keeps the full-explanation link first for an unpublished similar fixture', async () => {
    const fixture =
      '---\nauthoringUnit: {"kind":"similar","primaryProblemId":"abc391-f"}\n---\n\n表示確認用fixture（未掲載）\n\n## 主要解説との差分\n\nここでは表示だけを確認する。';
    const original = await renderPublicDocument(fixture, base);
    const $ = load(await previewProblem(original, 'fixture', base));
    expect($('a').first().attr('href')).toBe(`${base}problems/abc391-f/`);
    expect($('a').first().parents('details')).toHaveLength(0);
    expect($.text()).toContain('先に参照元の着想');
  });
});
