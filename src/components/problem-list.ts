import { load, type CheerioAPI } from 'cheerio';
import { isText, type AnyNode } from 'domhandler';
import { withBase, type UiCatalog, type UiProblem } from '../lib/catalog/ui-catalog.js';

const link = ($: CheerioAPI, href: string, label: string) =>
  $('<a></a>').attr('href', href).text(label);

/** Keep authored role explanations intact; disclose them one problem at a time. */
function compactRow(
  $: CheerioAPI,
  element: AnyNode,
  problem: UiProblem,
  catalog: UiCatalog,
  base: string,
  unitId?: string,
  tagId?: string,
) {
  const row = $(element);
  const title = row.children('a').first();
  if (!title.length) return;
  const detail = $('<details class="problem-list-context"></details>');
  detail.append(
    $('<summary>技能・出典</summary>').attr('aria-label', `${title.text()}の技能・出典`),
  );
  // Move nodes rather than reconstructing or summarizing the author's explanation.
  const context = $('<div class="problem-list-roles"></div>');
  context.append(row.contents().not(title));
  const first = context.contents().first();
  if (first[0] && isText(first[0])) first[0].data = first[0].data.replace(/^\s*—\s*/u, '');
  if (context.text().trim()) detail.append(context);

  const home = catalog.learningUnits.find(({ id }) => id === problem.learningUnitId);
  if (!home) throw new Error(`PROBLEM_LIST_HOME_MISSING:${problem.id}`);
  const connections = $('<div class="problem-list-connections"></div>');
  if (home.id !== unitId) {
    connections.append('主題: ', link($, withBase(home.route, base), home.title));
  }
  if (unitId && home.id === unitId) {
    const otherUnits = new Map<string, string>();
    context.find('a[href]').each((_, anchor) => {
      const href = $(anchor).attr('href') ?? '';
      if (
        catalog.learningUnits.some(
          (unit) =>
            unit.id !== unitId && unit.id !== home.id && withBase(unit.route, base) === href,
        )
      )
        otherUnits.set(href, $(anchor).text());
    });
    if (otherUnits.size) {
      if (connections.contents().length) connections.append(' / ');
      connections.append('組合せ: ');
      for (const [index, [href, label]] of [...otherUnits].entries()) {
        if (index) connections.append('、');
        connections.append(link($, href, label));
      }
    }
  }
  const tagRole =
    tagId && problem.primaryTagIds.includes(tagId)
      ? '主タグ'
      : tagId && problem.supportingTagIds.includes(tagId)
        ? '補助タグ'
        : undefined;
  if (tagRole) {
    if (connections.contents().length) connections.append(' / ');
    connections.append(tagRole);
  }
  if (connections.contents().length) row.append(connections);
  if (!context.text().trim()) {
    detail.append($('<p></p>').append('主題: ', link($, withBase(home.route, base), home.title)));
  }
  const tags = $('<p></p>');
  for (const [label, ids] of [
    ['主タグ', problem.primaryTagIds],
    ['補助タグ', problem.supportingTagIds],
  ] as const) {
    if (!ids.length) continue;
    if (tags.contents().length) tags.append(' / ');
    tags.append(`${label}: `);
    ids.forEach((id, index) => {
      const tag = catalog.tags.find((item) => item.id === id);
      if (!tag) throw new Error(`PROBLEM_LIST_TAG_MISSING:${id}`);
      if (index) tags.append('、');
      tags.append(link($, withBase(tag.route, base), tag.name));
    });
  }
  if (tags.contents().length) detail.append(tags);
  row.append(detail);
  title.after(
    ' ',
    link($, problem.officialUrl, '公式問題')
      .attr('rel', 'external')
      .attr('aria-label', `${title.text()}の公式問題`)
      .addClass('problem-list-official'),
  );
}

export function compactUnitProblemLists(
  body: string,
  catalog: UiCatalog,
  base: string,
  unitId: string,
): string {
  const $ = load(body, null, false);
  const byRoute = new Map(catalog.problems.map((p) => [withBase(p.route, base), p]));
  for (const id of ['問題一覧', '関連問題']) {
    const heading = $(`h2[id="${id}"]`);
    const lists = heading
      .nextUntil('h2')
      .filter('ul')
      .add(heading.next('.unit-related').children('ul'));
    lists.each((_, list) => {
      $(list).addClass('problem-list');
      $(list)
        .children('li')
        .each((_, row) => {
          const problem = byRoute.get($(row).children('a').first().attr('href') ?? '');
          if (problem) compactRow($, row, problem, catalog, base, unitId);
        });
    });
  }
  return $.html();
}

/** Tag membership and representative selection come only from the accepted catalog. */
export function renderTagProblemList(
  ids: readonly string[],
  catalog: UiCatalog,
  base: string,
  tagId: string,
): string {
  const $ = load('<ul class="problem-list"></ul>', null, false);
  for (const id of ids) {
    const problem = catalog.problems.find((item) => item.id === id);
    if (!problem) throw new Error(`PROBLEM_LIST_UNKNOWN:${id}`);
    const row = $('<li></li>').append(
      link(
        $,
        withBase(problem.route, base),
        `${problem.contestId.toUpperCase()} ${problem.label}「${problem.title}」`,
      ),
    );
    $('ul').first().append(row);
    if (row[0]) compactRow($, row[0], problem, catalog, base, undefined, tagId);
  }
  return $.html();
}
