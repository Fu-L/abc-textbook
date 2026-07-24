import { load } from 'cheerio';

export interface NormalizedOfficialContentFragment {
  readonly text: string;
  readonly links: readonly { readonly href: string; readonly text: string }[];
  readonly images: readonly { readonly src: string; readonly alt: string }[];
}

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const canonicalLinkedResourceUrl = (value: string, baseUrl: string): string => {
  const url = new URL(value, baseUrl);
  url.hash = '';
  return url.href;
};

/**
 * Project official HTML onto stable, source-relevant text and resource links.
 * Session controls and presentation-only markup are removed before hashing.
 */
export const normalizeOfficialContentFragment = (
  htmlFragment: string,
  baseUrl: string,
): NormalizedOfficialContentFragment => {
  const $ = load(`<abc-textbook-root>${htmlFragment}</abc-textbook-root>`, undefined, false);
  const root = $('abc-textbook-root');
  root
    .find(
      'script, style, form, nav, footer, input, button, noscript, .clearfix, [name*="csrf" i], [data-session], [data-csrf]',
    )
    .remove();

  const links = root
    .find('a[href]')
    .toArray()
    .flatMap((anchor) => {
      const href = $(anchor).attr('href');
      if (!href) return [];
      try {
        return [
          {
            href: canonicalLinkedResourceUrl(href, baseUrl),
            text: normalizeText($(anchor).text()),
          },
        ];
      } catch {
        return [];
      }
    });
  const images = root
    .find('img[src]')
    .toArray()
    .flatMap((image) => {
      const src = $(image).attr('src');
      if (!src) return [];
      try {
        return [
          {
            src: canonicalLinkedResourceUrl(src, baseUrl),
            alt: normalizeText($(image).attr('alt') ?? ''),
          },
        ];
      } catch {
        return [];
      }
    });

  return Object.freeze({
    text: normalizeText(root.text()),
    links: Object.freeze(links),
    images: Object.freeze(images),
  });
};
