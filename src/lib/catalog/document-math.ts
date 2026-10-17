import type { Node } from '@astrojs/markdown-remark';
import { renderToString } from 'katex';
import remarkMath from 'remark-math';

export interface DocumentNode extends Node {
  value?: string;
  lang?: string | null | undefined;
  children?: DocumentNode[];
}

export const parseDocumentMath = [remarkMath, { singleDollarTextMath: false }] as const;

export function renderDocumentMath(value: string, displayMode: boolean): string {
  // A JSON-escaped command pasted into Markdown can otherwise become a valid
  // TeX line break followed by letters, silently changing the expression.
  if (/\\\\[A-Za-z]{2,}/u.test(value)) throw new Error('DOUBLE_ESCAPED_TEX');
  return renderToString(value, {
    displayMode,
    output: 'mathml',
    throwOnError: true,
    strict: 'error',
  });
}

export function renderDocumentMathNode(node: DocumentNode, source: string): string {
  if (node.type === 'math') {
    const original = source.slice(node.position?.start.offset, node.position?.end.offset).trimEnd();
    const lines = original.split('\n');
    const fence = lines[0]?.match(/^\s*(\${2,})/u)?.[1];
    if (lines.length < 3 || lines.at(-1)?.trim() !== fence)
      throw new Error('UNCLOSED_DISPLAY_MATH');
  }
  return renderDocumentMath(node.value ?? '', node.type === 'math');
}

/** Build-time MathML: no browser script, external font, or inline style. */
export const remarkRenderDocumentMath = () => (tree: DocumentNode, file: { value: unknown }) => {
  const visit = (node: DocumentNode) => {
    if (node.type === 'math' || node.type === 'inlineMath') {
      const display = node.type === 'math';
      const html = renderDocumentMathNode(node, String(file.value));
      // Drop remark-math's code projection along with its data.hChildren.
      Object.assign(node, {
        type: 'html',
        value: display
          ? `<div class="math-display" tabindex="0" role="group" aria-label="数式">${html}</div>`
          : `<span class="math-inline" tabindex="0" role="group" aria-label="数式">${html}</span>`,
        data: undefined,
      });
    } else node.children?.forEach(visit);
  };
  visit(tree);
};
