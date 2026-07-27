import type { APIRoute } from 'astro';

import { PreviewUiCatalogSchema, previewCatalog } from '../../lib/catalog/preview-ui-catalog.js';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(PreviewUiCatalogSchema.parse(previewCatalog), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
