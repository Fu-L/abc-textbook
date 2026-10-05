import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
import { learningUnitRoute } from './build-learning-path.js';
import { withBase } from './ui-catalog.js';

const processor = createMarkdownProcessor({ syntaxHighlight: 'prism', smartypants: false });

/** Resolve canonical file references only in the rendered projection; source bytes stay intact. */
export const renderPublicDocument = async (
  text: string,
  base: string,
  omitTitle = false,
  problemRoutes: ReadonlyMap<string, string> = new Map(),
): Promise<string> => {
  const { content } = parseFrontmatter(text);
  const rendered = await (await processor).render(content);
  const $ = load(rendered.code, null, false);
  if (omitTitle) $('h1').remove();
  $('a[href]').each((_index, element) => {
    const link = $(element);
    const href = link.attr('href') ?? '';
    const mathematicalDestination = decodeURI(href);
    // Coefficient notation such as [t^(n−2)](Φ^n) is mathematical prose,
    // although Markdown interprets the bracket/parenthesis pair as a link.
    if (
      /^[A-Za-z]\^\([^)]*\)$/u.test(link.text()) &&
      /^[\p{Script=Greek}]\^[^/]+$/u.test(mathematicalDestination)
    ) {
      link.replaceWith($('<span>').text(`[${link.text()}](${mathematicalDestination})`));
      return;
    }
    const problemRoute = problemRoutes.get(href);
    if (problemRoute && /^ABC[0-9]+ [^「]+「/u.test(link.text()))
      link.attr('href', withBase(problemRoute, base));
    else if (href.startsWith('src/content/docs/learn/'))
      link.attr('href', withBase(learningUnitRoute(href), base));
    else if (href.startsWith('src/content/docs/problems/')) {
      const id = href.split('/').at(-1)?.replace(/\.md$/u, '');
      if (!id) throw new Error(`PUBLIC_DOCUMENT_LINK_UNKNOWN:${href}`);
      link.attr('href', withBase(`/problems/${id}/`, base));
    } else if (href.startsWith('/')) link.attr('href', withBase(href, base));
    else if (/^(?:src\/|staging\/)/u.test(href))
      throw new Error(`PUBLIC_DOCUMENT_LINK_UNKNOWN:${href}`);
  });
  return $.html();
};
