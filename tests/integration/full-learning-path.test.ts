import { readFile } from 'node:fs/promises';

import { beforeAll, describe, expect, it } from 'vitest';

import { buildLearningPath } from '../../src/lib/catalog/build-learning-path.js';
import {
  FinalTaxonomyBuildSchema,
  LearningUnitSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  buildCanonicalTaxonomyMaterialization,
  type CanonicalTaxonomyMaterialization,
} from '../../src/lib/taxonomy/canonical-taxonomy-materialization.js';
import { loadFinalTaxonomySourceContext } from '../../src/lib/taxonomy/final-taxonomy-build.js';
import { SINGLE_PROBLEM_TAG_IDS } from '../../src/lib/taxonomy/final-taxonomy-policy.js';

describe('full authored LearningUnit navigation', () => {
  let expected: CanonicalTaxonomyMaterialization;
  let actual: CanonicalTaxonomyMaterialization;
  beforeAll(async () => {
    const context = await loadFinalTaxonomySourceContext();
    const build = FinalTaxonomyBuildSchema.parse(
      JSON.parse(
        await readFile('staging/taxonomy/initial/final-taxonomy-build.json', 'utf8'),
      ) as unknown,
    );
    expected = buildCanonicalTaxonomyMaterialization({
      build,
      records: context.records,
      problems: context.corpus.problems.map(({ entity }) => entity),
      sources: context.corpus.sources.map(({ entity }) => entity),
      placementDecisionTable: context.placementDecisionTable,
      singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
    });
    actual = {
      ...expected,
      learningUnits: await Promise.all(
        expected.learningUnits.map(async (output) => ({
          ...output,
          value: LearningUnitSchema.parse(
            JSON.parse(await readFile(output.relativePath, 'utf8')) as unknown,
          ),
          document: (await readFile(output.documentPath, 'utf8')).replace(
            '\ndraft: false\n',
            '\ndraft: true\n',
          ),
        })),
      ),
    };
  }, 60_000);

  it('accepts all 232 authored Units without requiring topological or contiguous textbook order', () => {
    const result = buildLearningPath(actual, expected);
    expect(result.units).toHaveLength(232);
    expect(result.chapters).toHaveLength(9);
    expect(result.problemHomeById.size).toBe(868);
  });

  it.each(['remove source', 'replace source URL', 'remove taxonomy identity'])(
    'rejects reference drift while allowing authored additions: %s',
    (change) => {
      const output = actual.learningUnits.find(
        ({ value }) => value.id === 'unit-priority-queue-best-first',
      );
      const accepted = expected.learningUnits.find(({ value }) => value.id === output?.value.id);
      const prefix = change === 'remove taxonomy identity' ? 'Canonical taxonomy:' : '- [';
      const line = accepted?.document
        .split('\n## 根拠\n')[1]
        ?.split('\n')
        .find((text) => text.startsWith(prefix));
      if (!output || !line) throw new Error('Missing reference fixture');
      const document = output.document.replace(
        line,
        change === 'replace source URL' ? line.replace(/\]\(.*\)/u, '](https://atcoder.jp/)') : '',
      );
      const changed = {
        ...actual,
        learningUnits: actual.learningUnits.map((unit) =>
          unit === output ? { ...unit, document } : unit,
        ),
      };
      expect(() => buildLearningPath(changed, expected)).toThrow(
        'ACCEPTED_NAVIGATION_DRIFT:unit-priority-queue-best-first:根拠',
      );
    },
  );

  it.each(['章の構成', '問題一覧', '関連問題'])(
    'still rejects changes to accepted navigation: %s',
    (title) => {
      const heading = `\n## ${title}\n`;
      const output = actual.learningUnits.find(({ document }) => document.includes(heading));
      if (!output) throw new Error('Missing navigation fixture');
      const document = output.document.replace(heading, `${heading}\nUnexpected entry.\n`);
      const changed = {
        ...actual,
        learningUnits: actual.learningUnits.map((unit) =>
          unit === output ? { ...unit, document } : unit,
        ),
      };
      expect(() => buildLearningPath(changed, expected)).toThrow(
        `ACCEPTED_NAVIGATION_DRIFT:${output.value.id}:${title}`,
      );
    },
  );

  it('rejects a handoff that changes accepted reading order', () => {
    const changed = structuredClone(actual);
    const output = changed.learningUnits.find(({ value }) => value.id === 'unit-xor-linear-basis');
    if (!output) throw new Error('Missing fixture');
    output.value.directProblemIds?.reverse();
    expect(() => buildLearningPath(changed, expected)).toThrow('METADATA_DRIFT');
  });

  it('checks the actual prerequisite line, rather than accepting a link elsewhere', () => {
    const changed = {
      ...actual,
      learningUnits: actual.learningUnits.map((output) => ({
        ...output,
        document: output.document.replace(/^直接の前提単元:.*$/mu, '直接の前提単元: なし。'),
      })),
    };
    expect(() => buildLearningPath(changed, expected)).toThrow('PREREQUISITE_NAVIGATION');
  });

  it('rejects an Outcome prerequisite cycle independently of the Unit graph', () => {
    const changed = structuredClone(actual);
    const a = changed.learningOutcomes[0]?.value;
    const b = changed.learningOutcomes[1]?.value;
    if (!a || !b) throw new Error('Missing fixture');
    a.prerequisiteOutcomeIds = [b.id];
    b.prerequisiteOutcomeIds = [a.id];
    expect(() => buildLearningPath(changed, expected)).toThrow('DEPENDENCY_CYCLE');
  });

  it('rejects accidental publication and missing conceptual-parent links', () => {
    const changed = {
      ...actual,
      learningUnits: actual.learningUnits.map((output) => ({
        ...output,
        document: output.document.replace('draft: true', 'draft: false'),
      })),
    };
    expect(() => buildLearningPath(changed, expected)).toThrow('DRAFT_REQUIRED');
    const noParent = {
      ...actual,
      learningUnits: actual.learningUnits.map((output) => ({
        ...output,
        document: output.document.replace(/^概念上の親:.*$/mu, ''),
      })),
    };
    expect(() => buildLearningPath(noParent, expected)).toThrow('CONCEPTUAL_PARENT');
  });
});
