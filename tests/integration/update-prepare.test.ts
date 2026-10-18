import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runSmallBatchUpdate } from '../../scripts/update-abc/index.js';
import { smallBatchInput, authorSmallBatch, contentHashes } from '../fixtures/small-batch.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import * as publicProjection from '../../src/lib/catalog/full-public-projection.js';
import { AtCoderProblemsSnapshotSchema } from '../../src/lib/corpus/atcoder-problems-metrics.js';

import { prepareAuthoringResults } from '../../scripts/update-abc/author.js';
import { stagePublicationUpdate } from '../../scripts/update-abc/stage.js';

const skill = { name: 'abc-explanation-author' as const, version: '1.1.1', digest: 'a'.repeat(64) };

describe('US5 update preparation', () => {
  it('classifies complete drafts, complete authoring inputs, and concrete blocks', () => {
    const result = prepareAuthoringResults({
      skill,
      targets: [
        { problemId: 'abc500-e', slotLabel: 'E', draftPath: 'staging/drafts/abc500-e.json' },
        {
          problemId: 'abc500-f',
          slotLabel: 'F',
          packetPath: 'staging/packets/abc500-f.json',
          templatePath: '.agents/skills/abc-explanation-author/templates/full-explanation.md',
        },
        {
          problemId: 'abc500-i',
          slotLabel: 'I',
          block: {
            code: 'SOURCE_UNAVAILABLE',
            reason: 'The official source fixture is unavailable.',
            retryCondition: 'Restore the source fixture and resume.',
          },
        },
      ],
    });
    expect(result.map(({ resultType }) => resultType)).toEqual([
      'authoring_unit_draft',
      'authoring_required',
      'blocked',
    ]);
  });

  it('reuses the same deterministic update on an identical rerun', () => {
    const input = {
      previewId: 'initial-v1',
      contestId: 'abc500',
      sourceSetFingerprint: 'b'.repeat(64),
      targetProblemIds: ['abc500-e'],
      operations: [
        {
          entityType: 'problem' as const,
          entityId: 'abc500-e',
          action: 'add' as const,
          path: 'staging/previews/initial-v1/problems/abc500-e.json',
          beforeDigest: null,
          afterDigest: 'c'.repeat(64),
          affectedProblemIds: ['abc500-e'],
        },
      ],
    };
    expect(stagePublicationUpdate(input)).toEqual(stagePublicationUpdate(input));
  });
});

describe('normal small-batch editing', () => {
  // Each case checks the real 868-Problem corpus across prepare/validate reruns.
  // Leave room for shared CI runners while keeping every invariant assertion.
  it.each([467, 468])(
    'prepares and validates a bounded batch ending at ABC%s with zero rerun diff',
    async (last) => {
      const root = await mkdtemp(path.join(tmpdir(), 'abc-small-batch-'));
      try {
        const input = await smallBatchInput(root, last);
        const metricsFile = path.join(root, 'src/content/problem-metrics/atcoder-problems.json');
        const previousMetrics = AtCoderProblemsSnapshotSchema.parse(
          JSON.parse(await readFile(metricsFile, 'utf8')),
        );
        const zeroMetric = input.metrics.problems['abc467-e'];
        if (!zeroMetric) throw new Error('Missing metric fixture');
        Object.assign(zeroMetric, { difficulty: 0, point: 0, difficultyExperimental: false });
        const before = await contentHashes(root);
        expect(await runSmallBatchUpdate({ ...input, mode: 'prepare' })).toMatchObject({
          status: 'on_hold',
          holds: [expect.objectContaining({ code: 'AUTHORING_REQUIRED' })],
        });
        const prepared = await contentHashes(root);
        expect(await runSmallBatchUpdate({ ...input, mode: 'prepare' })).toMatchObject({
          writtenPaths: [],
        });
        const reprepared = await contentHashes(root);
        expect(reprepared.size).toBe(prepared.size);
        for (const [file, bytes] of prepared) expect(reprepared.get(file), file).toBe(bytes);
        await authorSmallBatch(input);
        const authoredHome = JSON.parse(
          await readFile(
            path.join(root, 'src/content/learning-units/unit-dp-transition-optimization.json'),
            'utf8',
          ),
        ) as { directProblemIds: string[] };
        const loads = vi.spyOn(publicProjection, 'loadFullPublicProjection');
        const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
        // One strict base load and one candidate load. Checking the written index
        // must not parse the complete candidate a second time.
        expect(loads.mock.calls).toEqual([
          [{ repositoryRoot: process.cwd(), usePreparedRelease: false }],
          [
            {
              repositoryRoot: expect.stringContaining('abc-update-validation-') as string,
              usePreparedRelease: false,
              verifyDerivedFiles: false,
            },
          ],
        ]);
        loads.mockRestore();
        expect(result.holds).toEqual([]);
        expect(result).toMatchObject({
          status: 'passed',
          lastContestId: `abc${String(last)}`,
          addedProblemIds: input.metadataBatch.problems.map((p) => p.id),
        });
        const projection = await loadFullPublicProjection({
          repositoryRoot: root,
          usePreparedRelease: false,
        });
        expect(projection.catalog.release.lastContestId).toBe(`abc${String(last)}`);
        expect(projection.catalog.release.problemCount).toBe(868 + 4 * (last - 466));
        expect(projection.catalog.release.cutoffAt).toBe(
          input.metadataBatch.contests.at(-1)?.endedAt,
        );
        expect(projection.catalog.problems.find((p) => p.id === 'abc467-ex')?.officialTaskId).toBe(
          'abc467_h',
        );
        expect(
          projection.mapping.find((p) => p.problemId === 'abc467-e')?.relatedUnitIds,
        ).toContain('unit-modular-arithmetic');
        // Reproduce Medium 2: the authored sequence inserts new Problems right
        // after ABC212 E, preserving all old relative order and old list prose.
        const home = projection.catalog.learningUnits.find(
          (unit) => unit.id === 'unit-dp-transition-optimization',
        );
        expect(home?.directProblemIds).toEqual(authoredHome.directProblemIds);
        const idsInSection = (text: string, heading: string) => {
          const section = text.split(`\n## ${heading}\n`)[1]?.split('\n## ')[0] ?? '';
          return [...section.matchAll(/^- \[(ABC\d+) ([A-Za-z]+)「/gmu)].map(
            (match) => `${match[1]?.toLowerCase() ?? ''}-${match[2]?.toLowerCase() ?? ''}`,
          );
        };
        for (const id of ['unit-dp-transition-optimization', 'unit-modular-arithmetic']) {
          const unit = projection.catalog.learningUnits.find((unit) => unit.id === id);
          if (!unit) throw new Error(`Missing Unit ${id}`);
          const text = await readFile(path.join(root, unit.docPath), 'utf8');
          expect(idsInSection(text, '問題一覧')).toEqual(unit.directProblemIds);
          expect(idsInSection(text, '関連問題')).toEqual(unit.relatedProblemIds);
          const oldText = await readFile(unit.docPath, 'utf8');
          const oldLines = text
            .split('\n')
            .filter((line) => !/^- \[ABC46[78] /u.test(line))
            .join('\n');
          expect(oldLines).toBe(oldText);
          expect(
            projection.ui.learningUnits.find((projected) => projected.id === id)?.problemIds,
          ).toEqual(unit.directProblemIds);
        }
        const oldHome = JSON.parse(
          await readFile('src/content/learning-units/unit-dp-transition-optimization.json', 'utf8'),
        ) as { directProblemIds: string[] };
        expect(
          home?.directProblemIds?.filter((id) => !result.addedProblemIds.includes(id)),
        ).toEqual(oldHome.directProblemIds);
        expect(home?.directProblemIds?.[3]).toBe(last === 467 ? 'abc467-e' : 'abc468-i');
        // No metrics (including 0/null) or contest/slot order may override this choice.
        expect(home?.directProblemIds?.indexOf('abc467-i')).toBeLessThan(
          home?.directProblemIds?.indexOf('abc467-f') ?? 0,
        );
        const mergedMetrics = AtCoderProblemsSnapshotSchema.parse(
          JSON.parse(await readFile(metricsFile, 'utf8')),
        );
        expect(mergedMetrics.checkedAt).toBe(previousMetrics.checkedAt);
        for (const [id, values] of Object.entries(previousMetrics.problems))
          expect(mergedMetrics.problems[id], id).toEqual(values);
        expect(mergedMetrics.problems['abc467-e']).toEqual(input.metrics.problems['abc467-e']);
        expect(mergedMetrics.problems['abc467-i']?.difficulty).toBeNull();
        expect(
          projection.catalog.problems.find((p) => p.id === 'abc467-e')?.difficultyEvidence,
        ).toContain(input.metrics.checkedAt);
        const completed = await contentHashes(root);
        expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
          status: 'passed',
          writtenPaths: [],
        });
        const repeated = await contentHashes(root);
        expect(repeated.size).toBe(completed.size);
        for (const [file, bytes] of completed) expect(repeated.get(file), file).toBe(bytes);
        // Every old Problem, source, tag, Outcome, prerequisite and reading-order byte survives.
        for (const [file, bytes] of before) {
          if (
            result.writtenPaths.includes(`src/content/${file}`) ||
            /^(policies\/problem-placements\.json|problem-metrics\/)/u.test(file)
          )
            continue;
          expect(completed.get(file), file).toBe(bytes);
        }
        expect(input.metrics.problems['abc467-i']?.difficulty).toBeNull();
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
    300_000,
  );
});
