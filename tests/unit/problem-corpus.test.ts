import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  ProblemAuthoringUnitSchema,
  type ProblemAuthoringUnit,
} from '../../src/lib/domain/schema-parts/authoring-unit.js';
import {
  resolveProblemLocator,
  assertCurrentAgentQualityReview,
  buildProblemOutcomeCoverage,
  validateJoinedProblemDocuments,
} from '../../src/lib/authoring/verify-problem-corpus.js';

let unit: ProblemAuthoringUnit;
beforeAll(async () => {
  unit = ProblemAuthoringUnitSchema.parse(
    JSON.parse(await readFile('tests/fixtures/authoring-skill/full-abc212-g.json', 'utf8')),
  );
  unit.docPath = 'src/content/docs/problems/abc212-g.md';
  unit.examples = [];
  unit.exercises = [];
  const claim = unit.claims[0];
  if (!claim) throw new Error('Fixture claim missing.');
  claim.key = 'correctness';
  claim.text = String(unit.sections.correctness);
});
const input = () => ({
  expectedDocuments: [{ problemId: unit.problemId, path: unit.docPath }],
  documents: [
    { unit: structuredClone(unit), path: unit.docPath, body: 'Original Japanese explanation.' },
  ],
  discoveredPaths: [unit.docPath],
});

describe('all-shard Problem join', () => {
  it('accepts explicit supporting and chapter-subtree coverage without an assessment block', () => {
    const value = {
      outcomes: [{ id: 'outcome-a' }, { id: 'outcome-chapter' }],
      units: [
        {
          id: 'unit-a',
          kind: 'section',
          ownedLearningOutcomeIds: ['outcome-a'],
          problemIds: ['abc212-g'],
        },
        {
          id: 'unit-chapter',
          kind: 'chapter',
          ownedLearningOutcomeIds: ['outcome-chapter'],
          problemIds: ['abc212-g'],
        },
      ],
      placements: [
        {
          problemId: 'abc212-g',
          primaryOutcomeId: 'outcome-a',
          additionalPrimaryOutcomeIds: [],
          supportingOutcomeIds: [],
        },
      ],
    };
    expect(buildProblemOutcomeCoverage(value).map((row) => row.coverageMode)).toEqual([
      'problem_placement',
      'chapter_subtree',
    ]);
    const chapter = value.units[1];
    if (!chapter) throw new Error('Fixture incomplete.');
    chapter.kind = 'section';
    expect(() => buildProblemOutcomeCoverage(value)).toThrow(/OUTCOME_UNCOVERED/);
    chapter.ownedLearningOutcomeIds = ['outcome-a'];
    expect(() => buildProblemOutcomeCoverage(value)).toThrow(/OUTCOME_OWNER/);
  });
  it('requires an explicit quality review of the current joined subject', () => {
    const review = {
      subjectDigest: 'a',
      reviewMode: 'agent_quality_review',
      status: 'accepted',
      unresolvedFindingCount: 0,
    };
    expect(() => {
      assertCurrentAgentQualityReview(review, 'a');
    }).not.toThrow();
    expect(() => {
      assertCurrentAgentQualityReview(review, 'b');
    }).toThrow(/QUALITY_REVIEW/);
    expect(() => {
      assertCurrentAgentQualityReview({ ...review, unresolvedFindingCount: 1 }, 'a');
    }).toThrow(/QUALITY_REVIEW/);
    expect(() => {
      assertCurrentAgentQualityReview({ ...review, reviewMode: 'self' }, 'a');
    }).toThrow(/QUALITY_REVIEW/);
  });
  it('permits empty optional material and resolves keys inside their owner', () => {
    expect(() => {
      validateJoinedProblemDocuments(input());
    }).not.toThrow();
    expect(resolveProblemLocator(unit, 'sections.complexity')).toBe(true);
    expect(resolveProblemLocator(unit, 'claims.correctness')).toBe(true);
    expect(resolveProblemLocator(unit, 'claims.missing')).toBe(false);
    expect(resolveProblemLocator(unit, 'sections.toString')).toBe(false);
    expect(resolveProblemLocator(unit, 'examples.worked')).toBe(false);
  });
  it.each([
    'duplicate',
    'orphan',
    'missing',
    'wrong-path',
    'claim-drift',
    'contradicted',
    'standalone-section',
    'unregistered-code',
    'quotation',
  ])('blocks %s', (failure) => {
    const value = input();
    const document = value.documents[0];
    const claim = document?.unit.claims[0];
    if (!document || !claim) throw new Error('Fixture incomplete.');
    if (failure === 'duplicate') value.documents.push(document);
    if (failure === 'orphan') value.discoveredPaths.push('src/content/docs/problems/orphan.md');
    if (failure === 'missing') value.documents = [];
    if (failure === 'wrong-path') document.unit.docPath = 'src/content/docs/problems/other.md';
    if (failure === 'claim-drift') claim.text = 'Stale proof.';
    if (failure === 'contradicted') claim.verificationStatus = 'contradicted';
    if (failure === 'standalone-section') document.body += '\n## 具体例\n';
    if (failure === 'unregistered-code') document.body += '\n```python\nprint(1)\n```';
    if (failure === 'quotation') document.body += '\n> unattributed quotation\n';
    expect(() => {
      validateJoinedProblemDocuments(value);
    }).toThrow(/PROBLEM_JOIN_/);
  });
});
