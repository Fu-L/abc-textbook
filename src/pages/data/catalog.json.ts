import type { APIRoute } from 'astro';

import { CatalogSchema } from '../../lib/domain/schema-parts/catalog.js';
import { publicCatalogContract } from '../../lib/catalog/public-catalog.js';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(CatalogSchema.parse(publicCatalogContract), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
