import { loadFullPublicProjection } from './full-public-projection.js';
export {
  requireCatalogEntity,
  withBase,
  canonicalUiRoutes,
  type UiCatalog,
  type UiProblem,
} from './ui-catalog.js';
export const publicProjection = await loadFullPublicProjection();
export const publicCatalog = publicProjection.ui;
export const publicCatalogContract = publicProjection.catalog;
