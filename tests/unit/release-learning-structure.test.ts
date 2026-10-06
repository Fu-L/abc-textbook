import { describe, expect, it } from 'vitest';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { validateReleaseLearningStructure } from '../../src/lib/catalog/release-learning-structure.js';

const input = () => ({
  tags: [{ id: 'tag-a', prerequisiteTagIds: [] }],
  outcomes: [{ id: 'outcome-a', prerequisiteOutcomeIds: [] }],
  units: [
    {
      id: 'unit-a',
      kind: 'subsection',
      parentId: 'unit-chapter',
      contentPhase: 'full_authoring',
      ownedLearningOutcomeIds: ['outcome-a'],
      problemIds: ['abc212-e'],
      directProblemIds: ['abc212-e'],
    },
    {
      id: 'unit-chapter',
      kind: 'chapter',
      parentId: null,
      contentPhase: 'full_authoring',
      ownedLearningOutcomeIds: [],
      problemIds: ['abc212-e'],
      directProblemIds: [],
    },
  ],
  problems: [{ id: 'abc212-e' }],
  placements: [
    {
      problemId: 'abc212-e',
      primaryOutcomeId: 'outcome-a',
      additionalPrimaryOutcomeIds: [],
      supportingOutcomeIds: [],
      primaryTagIds: ['tag-a'],
      supportingTagIds: [],
    },
  ],
  prerequisites: {
    schemaVersion: '1.0.0',
    sourceBuild: { id: 'build-a', digest: 'a'.repeat(64), acceptedAt: '2026-10-05T00:00:00Z' },
    tagPrerequisites: [],
    learningOutcomePrerequisites: [],
    learningUnitPrerequisites: [],
    tagDagDigest: canonicalDigest([]),
    learningOutcomeDagDigest: canonicalDigest([]),
    learningUnitDagDigest: canonicalDigest([]),
  },
  chapters: [{ id: 'unit-chapter', unitIds: ['unit-a'] }],
});
describe('release canonical learning structure', () => {
  it('covers the complete canonical corpus using semantic home and all three DAGs', async () => {
    const projection = await loadFullPublicProjection();
    const { problems, learningOutcomes: outcomes, learningUnits: units, tags } = projection.catalog;
    const coverage = validateReleaseLearningStructure({
      problems,
      outcomes,
      units,
      tags,
      placements: projection.policy.placements,
      prerequisites: projection.prerequisites,
      chapters: TEXTBOOK_CHAPTERS,
    });
    expect(coverage).toHaveLength(outcomes.length);
    expect(new Set(coverage.flatMap((entry) => entry.primaryProblemIds)).size).toBe(
      problems.length,
    );
    expect(units.every((unit) => unit.contentPhase === 'full_authoring')).toBe(true);
  }, 30_000);
  it('uses semantic primary ownership regardless of editorial order', () => {
    expect(validateReleaseLearningStructure(input())[0]).toMatchObject({
      outcomeId: 'outcome-a',
      ownerUnitId: 'unit-a',
    });
  });
  it('rejects missing placement, duplicate owners, wrong home and unhanded units', () => {
    const value = input();
    expect(() => validateReleaseLearningStructure({ ...value, placements: [] })).toThrow(
      'RELEASE_PLACEMENT_COVERAGE',
    );
    const chapter = value.units[1];
    if (!chapter) throw new Error('Missing chapter.');
    chapter.ownedLearningOutcomeIds = ['outcome-a'];
    expect(() => validateReleaseLearningStructure(value)).toThrow('OUTCOME_OWNER');
    const wrong = input();
    const wrongHome = wrong.units[0];
    if (!wrongHome) throw new Error('Missing Unit.');
    wrongHome.directProblemIds = [];
    expect(() => validateReleaseLearningStructure(wrong)).toThrow('RELEASE_PROBLEM_HOME');
    const skeleton = input();
    const skeletonUnit = skeleton.units[0];
    if (!skeletonUnit) throw new Error('Missing Unit.');
    skeletonUnit.contentPhase = 'taxonomy_skeleton';
    expect(() => validateReleaseLearningStructure(skeleton)).toThrow('RELEASE_UNIT_HANDOFF');
  });
  it('checks three separate DAGs, unknown references and independent order coverage', () => {
    const value = input();
    expect(() => validateReleaseLearningStructure({ ...value, chapters: [] })).toThrow(
      'RELEASE_EDITORIAL_ORDER',
    );
    const edges = [
      { nodeId: 'unit-a', prerequisiteId: 'unit-chapter' },
      { nodeId: 'unit-chapter', prerequisiteId: 'unit-a' },
    ];
    expect(() =>
      validateReleaseLearningStructure({
        ...value,
        prerequisites: {
          ...value.prerequisites,
          learningUnitPrerequisites: edges,
          learningUnitDagDigest: canonicalDigest(edges),
        },
      }),
    ).toThrow();
    const unknown = [{ nodeId: 'unit-missing', prerequisiteId: 'unit-a' }];
    expect(() =>
      validateReleaseLearningStructure({
        ...value,
        prerequisites: {
          ...value.prerequisites,
          learningUnitPrerequisites: unknown,
          learningUnitDagDigest: canonicalDigest(unknown),
        },
      }),
    ).toThrow('RELEASE_DAG_UNKNOWN');
    const laterPrerequisite = [{ nodeId: 'unit-chapter', prerequisiteId: 'unit-a' }];
    expect(
      validateReleaseLearningStructure({
        ...value,
        prerequisites: {
          ...value.prerequisites,
          learningUnitPrerequisites: laterPrerequisite,
          learningUnitDagDigest: canonicalDigest(laterPrerequisite),
        },
      }),
    ).toHaveLength(1);
  });
});
