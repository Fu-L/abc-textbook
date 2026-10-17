import { load } from 'cheerio';
import { renderPublicDocument } from '../catalog/render-public-document.js';
import { readFile } from 'node:fs/promises';

const manuscript = (name: string) =>
  readFile(`src/lib/study-preview/manuscripts/${name}.md`, 'utf8');

export const STUDY_PREVIEW_ROUTES = [
  '/learn/query/priority-queue-best-first/',
  '/learn/query/range-monoid-aggregation/',
  '/problems/abc391-f/',
  '/problems/abc213-g/',
] as const;

/** Build-time opt-in; the accepted catalog, manuscripts, and routes stay untouched. */
export const isStudyPreview = (flag: unknown, route: string): boolean =>
  flag === '1' && STUDY_PREVIEW_ROUTES.some((item) => item === route);

export async function previewUnit(body: string, unitId: string, base: string): Promise<string> {
  const $ = load(body, null, false);
  const text = await manuscript(
    unitId === 'unit-priority-queue-best-first' ? 'priority-queue' : 'monoid',
  );
  const replacement = load(await renderPublicDocument(text, base), null, false);
  // Retain every original section, anchor, source and detailed classification.
  const reference = $(
    '<details class="preview-context"><summary>単元の概要・前提と範囲</summary></details>',
  );
  reference.append($('h2').first().prevAll().get().reverse());
  for (const id of ['概要', '考え方', '成立条件と計算量', '前提と範囲']) {
    const heading = $(`[id="${id}"]`);
    reference.append(heading.nextUntil('h2').addBack());
  }
  // The new explanation owns these two existing anchors. Retained prose stays readable.
  reference.find('[id="考え方"], [id="成立条件と計算量"]').removeAttr('id');
  $.root().prepend(replacement.root().contents());
  $('#問題一覧').before(reference);
  for (const id of ['問題一覧', '関連問題']) {
    const heading = $(`[id="${id}"]`);
    const list = heading.nextAll('ul').first();
    const compact = $('<ul class="preview-problems"></ul>');
    for (const row of list.children('li').toArray()) {
      const link = $(row).find('a').first().clone();
      compact.append($('<li></li>').append(link));
    }
    const detail = $(
      '<details class="preview-context"><summary>各問題の主題・前提と補足を読む</summary></details>',
    );
    list.before(compact, detail);
    detail.append(list);
  }
  return $.html();
}

export async function previewProblem(body: string, id: string, base: string): Promise<string> {
  const $ = load(body, null, false);
  if (id === 'abc391-f') {
    const replacement = load(
      await renderPublicDocument(await manuscript('abc391-f'), base),
      null,
      false,
    );
    for (const name of ['考察', '正当性', '復習の核']) {
      const heading = $(`[id="${name}"]`);
      heading.nextUntil('h2').remove();
      heading.after(replacement(`[id="${name}"]`).nextUntil('h2'));
    }
  }
  const position = $('#学習の位置');
  const context = $(
    '<details class="preview-context"><summary>この問題で学ぶ技能</summary></details>',
  );
  if (position.length) {
    context.append(position.nextUntil('h2').addBack());
    $.root().append(context);
  }
  const navigation = $('<nav class="preview-toc" aria-label="解説内の移動"></nav>');
  for (const name of ['考察', '正当性', '計算量と制約', '復習の核', '出典']) {
    if ($(`[id="${name}"]`).length)
      navigation.append($('<a></a>').attr('href', `#${name}`).text(name));
  }
  if (navigation.children().length) $.root().prepend(navigation);
  return $.html();
}
