import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

/** Validate an editorial insertion, never infer difficulty from a scalar or slot.
 * Removing the new IDs must recover the exact old sequence. */
export function validateInsertedProblemOrder(
  previous: readonly string[],
  additions: readonly string[],
  authored: readonly string[],
  context: string,
): string[] {
  const added = new Set(additions);
  if (additions.length && canonicalDigest(authored) === canonicalDigest(previous))
    throw new Error(
      `UNIT_PROBLEM_ORDER_REQUIRED:${context}: Edit the Unit problem array explicitly.`,
    );
  const expected = new Set([...previous, ...additions]);
  if (
    new Set(authored).size !== authored.length ||
    authored.length !== expected.size ||
    authored.some((id) => !expected.has(id)) ||
    canonicalDigest(authored.filter((id) => !added.has(id))) !== canonicalDigest(previous)
  )
    throw new Error(
      `UNIT_PROBLEM_ORDER_CONFLICT:${context}: Preserve existing membership and relative order.`,
    );
  return [...authored];
}

/** Insert only new list items, retaining explanations and continuation paragraphs.
 * Remove the generated empty-list notice when the first home Problem arrives.
 * The authored JSON array owns order. */
export function insertUnitProblemLinks(input: {
  text: string;
  heading: '問題一覧' | '関連問題';
  previous: readonly string[];
  ordered: readonly string[];
  links: ReadonlyMap<string, string>;
  unitId: string;
}): string {
  const { heading, previous, ordered, links, unitId } = input;
  let text = input.text;
  const marker = `\n## ${heading}\n`;
  if (!text.includes(marker)) {
    // A Unit can gain its first related Problem without having this section yet.
    const anchor = text.indexOf('\n## 根拠\n');
    if (heading !== '関連問題' || previous.length || anchor < 0)
      throw new Error(`UNIT_DOCUMENT_SECTION:${unitId}:${heading}`);
    text = `${text.slice(0, anchor)}\n## 関連問題\n\n${text.slice(anchor)}`;
  }
  const start = text.indexOf(marker) + marker.length;
  const next = text.indexOf('\n## ', start);
  const end = next < 0 ? text.length : next;
  const originalSection = text.slice(start, end);
  const section =
    heading === '問題一覧' && !previous.length && ordered.length
      ? originalSection.replace(
          'この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。\n',
          '',
        )
      : originalSection;
  const entries = [...section.matchAll(/^- \[(ABC\d+) ([A-Za-z]+)「[^\n]*$/gmu)].map((match) => ({
    id: `${match[1]?.toLowerCase() ?? ''}-${match[2]?.toLowerCase() ?? ''}`,
    offset: match.index,
  }));
  if (canonicalDigest(entries.map((entry) => entry.id)) !== canonicalDigest(previous))
    throw new Error(`UNIT_DOCUMENT_ORDER_CONFLICT:${unitId}:${heading}`);
  const positions = new Map(entries.map((entry) => [entry.id, entry.offset]));
  const insertions = new Map<number, string[]>();
  for (let index = 0; index < ordered.length; index++) {
    const id = ordered[index];
    if (!id || positions.has(id)) continue;
    const line = links.get(id);
    if (!line) throw new Error(`UNIT_DOCUMENT_LINK_MISSING:${unitId}:${id}`);
    const following = ordered.slice(index + 1).find((item) => positions.has(item));
    const offset = following === undefined ? section.length : positions.get(following);
    if (offset === undefined) throw new Error(`UNIT_DOCUMENT_ORDER_CONFLICT:${unitId}:${heading}`);
    const lines = insertions.get(offset) ?? [];
    lines.push(line);
    insertions.set(offset, lines);
  }
  // Iterate original offsets instead of sorting Problems or reconstructing old items.
  let result = '';
  let cursor = 0;
  for (const offset of [...entries.map((entry) => entry.offset), section.length]) {
    const lines = insertions.get(offset);
    if (!lines) continue;
    result += section.slice(cursor, offset);
    if (result && !result.endsWith('\n')) result += '\n';
    result += `${lines.join('\n')}\n`;
    cursor = offset;
  }
  result += section.slice(cursor);
  return `${text.slice(0, start)}${result}${text.slice(end)}`;
}
