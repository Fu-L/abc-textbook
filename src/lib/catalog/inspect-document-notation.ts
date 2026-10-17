import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import { parseDocumentMath, renderDocumentMathNode, type DocumentNode } from './document-math.js';

export interface NotationDiagnostic {
  code: 'UNDELIMITED_TEX' | 'AMBIGUOUS_DOLLAR' | 'INVALID_MATH';
  line: number;
  column: number;
  detail: string;
}

/** Report candidates for editing; never infer formula boundaries in old prose. */
export async function inspectDocumentNotation(text: string): Promise<NotationDiagnostic[]> {
  const { content } = parseFrontmatter(text, { frontmatter: 'empty-with-spaces' });
  const diagnostics: NotationDiagnostic[] = [];
  const report = (offset: number, code: NotationDiagnostic['code'], detail: string) => {
    const before = text.slice(0, offset).split('\n');
    diagnostics.push({
      code,
      line: before.length,
      column: (before.at(-1)?.length ?? 0) + 1,
      detail,
    });
  };
  const inspect = () => (tree: DocumentNode) => {
    const visit = (node: DocumentNode) => {
      const start = node.position?.start.offset ?? 0;
      if (node.type === 'math' || node.type === 'inlineMath') {
        try {
          renderDocumentMathNode(node, content);
        } catch (error) {
          report(start, 'INVALID_MATH', error instanceof Error ? error.message : String(error));
        }
      } else if (node.type === 'text' || node.type === 'html') {
        const original = content.slice(start, node.position?.end.offset);
        for (const match of original.matchAll(/\\+(?:[A-Za-z]{2,}|[()[\]{}])/gu))
          report(start + match.index, 'UNDELIMITED_TEX', match[0]);
        for (const match of original.matchAll(/(?<!\\)\$+/gu))
          report(start + match.index, 'AMBIGUOUS_DOLLAR', match[0]);
      } else if (node.type !== 'code' && node.type !== 'inlineCode') node.children?.forEach(visit);
    };
    visit(tree);
  };
  const processor = await createMarkdownProcessor({
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [[...parseDocumentMath], inspect],
  });
  await processor.render(content);
  return diagnostics;
}
