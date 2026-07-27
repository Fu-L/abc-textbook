import type { APIRoute } from 'astro';

import { previewCatalog, withBase } from '../lib/catalog/preview-ui-catalog.js';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const origin = site ?? new URL('https://abc-textbook.example');
  const entries = previewCatalog.releaseHistory
    .map((release) => {
      const url = new URL(withBase(release.route, base), origin).href;
      return `<entry><id>${url}</id><title>${release.version}</title><link href="${url}"/><updated>2026-07-27T00:00:00+09:00</updated><summary>${String(release.problemCount)} problems in private preview</summary></entry>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>${origin.href}</id><title>ABC上級問題体系化教科書 更新履歴</title><updated>2026-07-27T00:00:00+09:00</updated>${entries}</feed>`,
    { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } },
  );
};
