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
  return $.html();
}
