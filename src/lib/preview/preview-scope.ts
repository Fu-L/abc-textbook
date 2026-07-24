const unpublishedPreviewEntityId = /^(?:preview|provisional)-/u;

export interface CatalogEntityCollection {
  readonly tags: readonly { readonly id: string }[];
  readonly learningUnits: readonly { readonly id: string }[];
}

/** Return preview-only entities that would leak into a public Catalog projection. */
export const unpublishedPreviewEntityViolations = (catalog: CatalogEntityCollection): string[] =>
  [...catalog.tags, ...catalog.learningUnits]
    .filter(({ id }) => unpublishedPreviewEntityId.test(id))
    .map(({ id }) => id);
