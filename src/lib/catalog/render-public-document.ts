import { createMarkdownProcessor, parseFrontmatter, type Node } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
import { learningUnitRoute } from './build-learning-path.js';
import { withBase } from './ui-catalog.js';

interface DocumentNode extends Node {
  value?: string;
  lang?: string | null | undefined;
  children?: DocumentNode[];
}

const mathematicalLinkEscape = /(?<!\\)\\(?=\[[^\]\n]+(?<!\\)\]\((?!https?:|src\/|#))/gu;

/**
 * Accepted prose uses single * for products/optima, _ for subscripts, and
 * angle brackets for grammar symbols. Preserve these before HTML conversion;
 * headings, lists, **bold**, links, and code retain their Markdown meaning.
 */
const remarkPreserveNotation = () => (tree: DocumentNode, file: { value: unknown }) => {
  const source = String(file.value);
  // Match against the full source: Markdown can split a formula into several
  // text nodes (e.g. dp[N]\[L](N−L)!), separating the escape from its context.
  const linkEscapeOffsets = new Set(
    [...source.matchAll(mathematicalLinkEscape)].map((match) => match.index),
  );
  const rewrite = (node: DocumentNode): DocumentNode[] => {
    if (node.children) node.children = node.children.flatMap(rewrite);
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    const original = start === undefined || end === undefined ? '' : source.slice(start, end);
    // Restore set difference (S\{i}) and literal TeX syntax that CommonMark
    // unescapes, except the \[ added by protectMathematicalLinks to prevent
    // array indexing/coefficient extraction followed by (...) becoming a URL.
    if (node.type === 'text' && original.includes('\\'))
      node.value = original.replace(/\\\[/gu, (escape, offset: number) =>
        linkEscapeOffsets.has((start ?? 0) + offset) ? '[' : escape,
      );
    // The authoring protection also covered fenced text formulas, where the
    // Markdown parser keeps the escape verbatim. Leave programming code alone.
    if (node.type === 'code' && node.lang === 'text' && node.value !== undefined)
      node.value = node.value.replace(mathematicalLinkEscape, '');
    if (node.type === 'emphasis' || (node.type === 'strong' && original.startsWith('_'))) {
      const delimiter = original.slice(0, node.type === 'strong' ? 2 : 1);
      return [
        { type: 'text', value: delimiter },
        ...(node.children ?? []),
        { type: 'text', value: delimiter },
      ];
    }
    // Raw HTML in these documents denotes literal notation, e.g. <expr>.
    // Coefficient extraction [t^(n−2)](Φ^n) is also prose, not a link.
    if (
      node.type === 'html' ||
      (node.type === 'link' && /^\[[\p{L}][\p{L}\p{N}_]*\^[^\]\n]+\]\(/u.test(original))
    )
      return [{ type: 'text', value: original }];
    return [node];
  };
  rewrite(tree);
};

const processor = createMarkdownProcessor({
  syntaxHighlight: 'prism',
  smartypants: false,
  remarkPlugins: [remarkPreserveNotation],
});

/** Resolve canonical file references only in the rendered projection; source bytes stay intact. */
export const renderPublicDocument = async (
  text: string,
  base: string,
  omitTitle = false,
  problemRoutes: ReadonlyMap<string, string> = new Map(),
): Promise<string> => {
  const { frontmatter, content } = parseFrontmatter(text);
  const authoring = frontmatter.authoringUnit as
    { kind?: unknown; primaryProblemId?: unknown } | undefined;
  // The public loader validates the primary as a full explanation. Generate its
  // reader-facing link from the same metadata, including for hand-authored prose.
  const primaryProblemId =
    authoring?.kind === 'similar' || authoring?.kind === 'supplement'
      ? authoring.primaryProblemId
      : null;
  const introduction =
    typeof primaryProblemId === 'string'
      ? `参照元の完全解説: [${primaryProblemId}](/problems/${primaryProblemId}/)。先に参照元の着想・成立条件・正当性・全体計算量を確認し、以下ではこの問題で変わる点を読む。\n\n`
      : '';
  const rendered = await (await processor).render(`${introduction}${content}`);
  const $ = load(rendered.code, null, false);
  if (omitTitle) $('h1').remove();
  $('a[href]').each((_index, element) => {
    const link = $(element);
    const href = link.attr('href') ?? '';
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
