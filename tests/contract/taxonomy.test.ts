import { describe, expect, it } from 'vitest';

import { validateCatalogSemantics, type CatalogLike } from '../../src/lib/catalog/build-catalog.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  CanonicalLearningPrerequisitesSchema,
  CatalogSchema,
  TechniqueTagSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalogFixture = () => CatalogSchema.parse(makeTrustedCatalog({}));
const codes = (catalog: CatalogLike): string[] =>
  validateCatalogSemantics(catalog).map(({ code }) => code);

describe('US2 taxonomy contract', () => {
  it('deduplicates canonical names, aliases, and former names across Tags', () => {
    const catalog = catalogFixture();
    const tag = catalog.tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    catalog.tags.push({
      ...structuredClone(tag),
      id: 'tag-duplicate-graph',
      name: '  GRAPHS  ',
    });

    expect(codes(catalog)).toContain('TAG_TERM_CONFLICT');
  });

  it('requires every formal Tag to define outcomes and representative Problems', () => {
    const tag = catalogFixture().tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    expect(TechniqueTagSchema.safeParse({ ...tag, learningOutcomeIds: [] }).success).toBe(false);
    expect(TechniqueTagSchema.safeParse({ ...tag, representativeProblemIds: [] }).success).toBe(
      false,
    );
  });

  it('validates Tag prerequisites in the Catalog and separate prerequisite policy graphs', () => {
    const tagCycle = catalogFixture();
    const tag = tagCycle.tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    tag.prerequisiteTagIds = [tag.id];
    expect(codes(tagCycle)).toContain('DEPENDENCY_CYCLE');

    const sourceBuild = {
      id: 'final-taxonomy-test',
      digest: 'a'.repeat(64),
      acceptedAt: '2026-07-27T23:21:00+09:00',
    };
    for (const field of [
      'tagPrerequisites',
      'learningOutcomePrerequisites',
      'learningUnitPrerequisites',
    ] as const) {
      const edges = [
        { nodeId: 'node-a', prerequisiteId: 'node-b' },
        { nodeId: 'node-b', prerequisiteId: 'node-a' },
      ];
      const empty = {
        tagPrerequisites: [],
        learningOutcomePrerequisites: [],
        learningUnitPrerequisites: [],
      };
      const graph = { ...empty, [field]: edges };
      const invalid = {
        schemaVersion: '1.0.0',
        sourceBuild,
        ...graph,
        tagDagDigest: canonicalDigest(graph.tagPrerequisites),
        learningOutcomeDagDigest: canonicalDigest(graph.learningOutcomePrerequisites),
        learningUnitDagDigest: canonicalDigest(graph.learningUnitPrerequisites),
      };
      expect(CanonicalLearningPrerequisitesSchema.safeParse(invalid).success, field).toBe(false);
    }
  });

  it('rejects published Problems without a primary Tag, Placement, and authoring unit', () => {
    const catalog = catalogFixture();
    const problem = catalog.problems[0];
    if (!problem) throw new Error('Problem fixture is missing.');
    problem.primaryTagIds = [];
    problem.placementId = null;

    expect(codes(catalog)).toContain('PUBLISHED_PROBLEM_UNREACHABLE');
  });
});
