/**
 * Single source of truth for structured content collection roots.
 *
 * Astro loading and release provenance validation must agree on these paths;
 * keeping the registry framework-agnostic lets both layers depend on it.
 */
export const structuredContentRoots = {
  contests: 'src/content/contests',
  contestGaps: 'src/content/contest-gaps',
  problemSlots: 'src/content/problem-slots',
  problems: 'src/content/problems',
  techniqueInventory: 'src/content/technique-inventory',
  tags: 'src/content/tags',
  learningOutcomes: 'src/content/learning-outcomes',
  learningUnits: 'src/content/learning-units',
  sources: 'src/content/sources',
  glossary: 'src/content/glossary',
  policies: 'src/content/policies',
  releases: 'src/content/releases',
} as const;

export type StructuredContentCollection = keyof typeof structuredContentRoots;
