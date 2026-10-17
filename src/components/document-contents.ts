import { load } from 'cheerio';

export interface DocumentHeading {
  id: string;
  label: string;
  level: number;
}

/** Read the final reading order, after editorial metadata has moved to details. */
export function documentHeadings(body: string): DocumentHeading[] {
  const $ = load(body, null, false);
  return $('h2, h3, h4, h5, h6')
    .toArray()
    .filter((heading) => !$(heading).closest('details, [data-pagefind-ignore]').length)
    .flatMap((heading) => {
      const id = $(heading).attr('id');
      const label = $(heading).clone();
      label.find('.heading-link').remove();
      // MathML includes an annotation with the original TeX. Do not read it twice.
      label.find('annotation').remove();
      const text = label.text().replace(/\s+/gu, ' ').trim();
      return id && text ? [{ id, label: text, level: Number(heading.tagName.slice(1)) }] : [];
    });
}
