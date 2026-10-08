import { loadFullPublicProjection } from './full-public-projection.js';
export {
  requireCatalogEntity,
  withBase,
  canonicalUiRoutes,
  type UiCatalog,
  type UiProblem,
} from './ui-catalog.js';
// Shared pages consume current canonical prose. The optional prepared release check
// remains until the standard publication path is introduced.
export const publicProjection = await loadFullPublicProjection();
export const publicCatalog = publicProjection.ui;
export const publicCatalogContract = publicProjection.catalog;
