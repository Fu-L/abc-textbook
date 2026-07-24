import type { PreviewSelectionRules } from '../../src/lib/preview/cohort-selection.js';

export type FrozenInitialV1SelectionRules = PreviewSelectionRules;

/** T028-approved rules. Changing this object is an intentional contract change. */
export const frozenInitialV1SelectionRules = {
  seedRange: {
    firstContestNumber: 212,
    lastContestNumber: 466,
    requireContinuity: true,
  },
  scopeRule: {
    anchorLabel: 'D',
    relation: 'after_in_official_task_order',
    labelRegistry: 'dynamic_official_order_union',
    requireOfficialStateForEveryRegistryLabel: true,
  },
  cohortRules: {
    domains: [
      'graph-search',
      'dynamic-programming',
      'data-structures-algorithm-design',
      'mathematics-combinatorics',
    ],
    minimumProblemsPerDomain: 2,
    minimumProblemsPerOutcome: 2,
    minimumProblemCount: 8,
    minimumContestCount: 3,
    minimumAdvancedLabelCount: 2,
    stableSortKeys: ['contestNumber', 'officialTaskOrder', 'problemId'],
    allowFixtureSupplement: true,
    requireFixtureBoundaryDeclaration: true,
  },
  publicationBoundary: {
    allowedPreviewRoots: ['staging/previews/initial-v1', 'docs/verification/previews/initial-v1'],
    forbiddenPublicRoots: [
      'src/content/tags',
      'src/content/learning-outcomes',
      'src/content/learning-units',
      'src/content/releases',
    ],
  },
} satisfies FrozenInitialV1SelectionRules;

export const frozenInitialV1RulesDigest =
  'c8a912fd36995e3347f8f59fad3df8fd08f2a2319a70448d3ea7edd11e718bae';
