import type { APIRoute } from 'astro';

import { CatalogSchema } from '../../lib/domain/schema-parts/catalog.js';
import { previewCatalogContract } from '../../lib/catalog/preview-catalog-contract.js';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(CatalogSchema.parse(previewCatalogContract), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
