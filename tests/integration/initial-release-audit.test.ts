import { describe, expect, it } from 'vitest';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { designLimitCatalog } from '../../scripts/verify/initial-release-performance.js';
import {
  auditCompleteness,
  auditOptionalBlocks,
} from '../../scripts/verify/initial-release-audits.js';

const projection = await loadFullPublicProjection();

describe('independent initial-release audit', () => {
  it('uses a complete design-limit fixture with unique routes and an extra advanced label', () => {
    const fixture = designLimitCatalog(projection.ui);
    expect(fixture.problems).toHaveLength(1500);
    expect(new Set(fixture.problems.map((problem) => problem.route)).size).toBe(1500);
    expect(fixture.tags).toHaveLength(500);
    expect(fixture.learningUnits).toHaveLength(1000);
    expect(fixture.problems.some((problem) => problem.label === 'I')).toBe(true);
    for (const unit of fixture.learningUnits)
      expect(unit.coverageProblemIds).toEqual(
        fixture.problems
          .filter((problem) => problem.learningUnitId === unit.id)
          .map((problem) => problem.id),
      );
  });
  it('covers every official D-after task and documented contest gap', () => {
    expect(auditCompleteness(projection.catalog)).toMatchObject({
      problems: 904,
      expectedProblems: 904,
      coveragePercent: 100,
    });
  });

  it('rejects a missing Problem even when release counts claim completeness', () => {
    const catalog = structuredClone(projection.catalog);
    catalog.problems.pop();
    expect(() => auditCompleteness(catalog)).toThrow('AUDIT_PROBLEM_COVERAGE');
  });

  it('requires official gap evidence rather than accepting skipped contest numbers', () => {
    const catalog = structuredClone(projection.catalog);
    catalog.contestGaps = [];
    expect(() => auditCompleteness(catalog)).toThrow('AUDIT_CONTEST_CONTINUITY');
  });

  it('checks task identity separately from label-based Problem IDs', () => {
    const catalog = structuredClone(projection.catalog);
    const problem = catalog.problems[0];
    if (!problem) throw new Error('Missing fixture.');
    problem.officialTaskId = 'abc212_wrong';
    expect(() => auditCompleteness(catalog)).toThrow('AUDIT_TASK_IDENTITY');
  });

  it('does not require fixed Outcome guides, exercises, or answers', () => {
    expect(auditOptionalBlocks(projection)).toMatchObject({
      owners: 1136,
      executableCount: 0,
      exerciseCount: 0,
    });
  });

  it('refuses to certify an added runnable fence without actual execution evidence', () => {
    const document = projection.problemDocuments.values().next().value;
    if (!document) throw new Error('Missing fixture.');
    const changed = { ...projection, problemDocuments: new Map(projection.problemDocuments) };
    changed.problemDocuments.set(document.unit.problemId, {
      ...document,
      text: `${document.text}\n\n\`\`\`python\nprint(42)\n\`\`\`\n`,
    });
    expect(() => auditOptionalBlocks(changed)).toThrow('AUDIT_EXECUTION_REQUIRED');
  });
});
