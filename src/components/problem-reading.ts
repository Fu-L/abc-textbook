import { load } from 'cheerio';

/** Move only the authored classification section; retain its text, links and anchor. */
export function splitProblemContext(body: string) {
  const $ = load(body, null, false);
  const heading = $('h2[id="学習の位置"]');
  const context = $('<div></div>');
  context.append(heading.nextUntil('h2').addBack());
  return { body: $.html(), context: context.html() ?? '' };
}
