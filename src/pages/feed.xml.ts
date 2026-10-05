import type { APIRoute } from 'astro';
import { publicProjection, withBase } from '../lib/catalog/public-catalog.js';
const escapeXml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const origin = site ?? new URL('https://abc-textbook.example');
  const entries = publicProjection.history
    .map((release) => {
      const url = escapeXml(new URL(withBase(`/updates/${release.version}/`, base), origin).href);
      return `<entry><id>${url}</id><title>${escapeXml(release.version)}</title><link href="${url}"/><updated>${release.validatedAt}</updated><summary>${String(release.problemCount)} problems</summary></entry>`;
    })
    .join('');
  const updated =
    publicProjection.history.at(-1)?.validatedAt ?? publicProjection.catalog.release.validatedAt;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>${escapeXml(origin.href)}</id><title>ABC上級問題体系化教科書 更新履歴</title><updated>${updated}</updated>${entries}</feed>`,
    { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } },
  );
};
