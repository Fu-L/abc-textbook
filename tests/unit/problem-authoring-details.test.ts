import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { authorProblemInShard } from '../../src/lib/authoring/author-problem-shard.js';
import { ProblemAuthoringDetailsSchema } from '../../src/lib/authoring/problem-authoring-document.js';
import { loadProblemShardContext } from '../../src/lib/authoring/problem-shard-context.js';

describe('complete problem explanation input', () => {
  const metadataOnly = {
    correctness: 'All selected objects are counted once.',
    time: 'O(N)',
    space: 'O(N)',
  };

  it('requires an authored reasoning manuscript, even when proof and costs exist', () => {
    expect(ProblemAuthoringDetailsSchema.safeParse(metadataOnly).success).toBe(false);
    expect(
      ProblemAuthoringDetailsSchema.safeParse({ ...metadataOnly, reasoning: '' }).success,
    ).toBe(false);
  });

  // This integration with the frozen corpus reads all 868 problems and their sources.
  // Give this corpus integration an explicit I/O budget when the full suite runs in CI.
  it('generates the complete manuscript without appending inventory prose or exercises', async () => {
    const index = JSON.parse(
      await readFile('docs/work-manifests/initial/problem-authoring-units/index.json', 'utf8'),
    ) as { frozenAt: string };
    const context = await loadProblemShardContext(index.frozenAt);
    const shard = context.index.shards.find((s) => s.problemIds.includes('abc298-ex'));
    if (!shard) throw new Error('Missing frozen shard for abc298-ex');
    const reasoning = 'Define dp[0]=1; update dp[i] from earlier states; return dp[N].';
    const details = ProblemAuthoringDetailsSchema.parse({ ...metadataOnly, reasoning });
    const result = authorProblemInShard(context, shard, 'abc298-ex', details);
    expect(result.unit.sections.reasoning).toBe(reasoning);
    expect(result.unit.examples).toEqual([]);
    expect(result.unit.exercises).toEqual([]);

    const determinantShard = context.index.shards.find((s) => s.problemIds.includes('abc323-g'));
    if (!determinantShard) throw new Error('Missing frozen shard for abc323-g');
    const inferred = authorProblemInShard(context, determinantShard, 'abc323-g', details);
    expect(inferred.unit.additionalPrerequisiteUnitIds).toContain('unit-polynomial-taylor-shift');
    const adopted = authorProblemInShard(context, determinantShard, 'abc323-g', {
      ...details,
      additionalPrerequisiteUnitIds: [
        'unit-combinatorial-coefficients',
        'unit-linear-system-rank',
        'unit-modular-arithmetic',
      ],
    });
    expect(adopted.input.additionalPrerequisiteUnitIds).toEqual(
      adopted.unit.additionalPrerequisiteUnitIds,
    );
    expect(adopted.document).toContain('combinatorial-coefficients.md');
    expect(adopted.document).not.toContain('polynomial-taylor-shift.md');
  }, 30_000);
});
