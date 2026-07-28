export interface TechniqueCandidate {
  readonly problemId: string;
  readonly techniqueKey: string;
}

export const classifyTechniques = (
  candidates: readonly TechniqueCandidate[],
  existingTaxonomy: Readonly<
    Record<string, { readonly tagId: string; readonly outcomeId: string; readonly unitId: string }>
  >,
): { mappings: readonly object[]; proposals: readonly object[] } => {
  const mappings: object[] = [];
  const proposals: object[] = [];
  for (const candidate of candidates) {
    const existing = existingTaxonomy[candidate.techniqueKey];
    if (existing) mappings.push({ ...candidate, ...existing });
    else proposals.push({ ...candidate, status: 'preview_only', publishable: false });
  }
  return { mappings, proposals };
};
