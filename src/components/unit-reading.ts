import { load } from 'cheerio';

/** Organize rendered manuscripts at build time. Prose and classification keep one source. */
export function arrangeUnitReading(body: string, title: string): string {
  const $ = load(body, null, false);
  const context = $(
    '<details class="unit-context" data-pagefind-ignore><summary>前提・学習成果・出典</summary></details>',
  );

  // Leave authored introductions in place; only the known editorial metadata moves.
  $.root()
    .children('p')
    .each((_, element) => {
      if (
        /^(?:習得対象の目安:|導入対象の目安:|対象色の読み方は|概念上の親:|Canonical taxonomy:)/u.test(
          $(element).text(),
        )
      )
        context.append(element);
    });
  $('h3').each((_, element) => {
    const heading = $(element);
    if (heading.text() === '習得する技能') context.append(heading.nextUntil('h2, h3').addBack());
    else if (heading.text() === title) context.append(heading);
  });
  for (const id of ['前提と範囲', '根拠']) {
    const heading = $(`h2[id="${id}"]`);
    context.append(heading.nextUntil('h2').addBack());
  }
  const related = $('h2[id="関連問題"]');
  if (related.length) {
    const details = $(
      '<details class="unit-related"><summary>他の主題と組み合わせる問題を読む</summary></details>',
    );
    details.append(related.nextUntil('h2'));
    related.after(details);
  }
  if (context.children().length > 1) $.root().append(context);
  return $.html();
}
