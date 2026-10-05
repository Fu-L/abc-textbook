import type { APIRoute } from 'astro';

import { canonicalUiRoutes, publicCatalog, withBase } from '../lib/catalog/public-catalog.js';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const origin = site ?? new URL('https://abc-textbook.example');
  const urls = canonicalUiRoutes(publicCatalog)
    .filter(
      (route) => !route.endsWith('.json') && route !== '/feed.xml' && route !== '/sitemap.xml',
    )
    .map(
      (route) => `<url><loc>${escapeXml(new URL(withBase(route, base), origin).href)}</loc></url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
