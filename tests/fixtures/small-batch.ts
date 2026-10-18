import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

import { acquireMetadataRange } from '../../scripts/update-abc/acquire.js';
import { SerialOfficialPageClient } from '../../src/lib/corpus/acquisition.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { renderProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { liveBase, liveCheckedAt, livePolicyApproval, liveTransport } from './live-metadata.js';

/** Suite-owned immutable preparation. Keep this factory in beforeAll (or one
 * build lifecycle), never at module/process scope: every suite reads current
 * manuscripts, and every candidate receives its own mutable input and files. */
export const createSmallBatchFixture = async () => {
  const repositoryRoot = process.cwd();
  // The frozen acquisition catalog predates normal textbook corrections.
  const projection = await loadFullPublicProjection({
    repositoryRoot,
    usePreparedRelease: false,
  });
  const base = await liveBase(projection.catalog);
  const metricsTemplate = JSON.parse(
    await readFile('src/content/problem-metrics/atcoder-problems.json', 'utf8'),
  ) as Record<string, unknown>;
  const acquisitions = new Map<number, ReturnType<typeof acquireMetadataRange>>();
  const smallBatchInput = async (root: string, last = 467) => {
    let acquisition = acquisitions.get(last);
    if (!acquisition) {
      acquisition = acquireMetadataRange({
        ...base,
        firstContestNumber: 467,
        lastContestNumber: last,
        checkedAt: liveCheckedAt,
        policyApproval: livePolicyApproval,
        client: new SerialOfficialPageClient({
          transport: liveTransport(),
          userAgent: 'abc-textbook/0.1.0 (contact: fixture-test)',
          minimumStartIntervalMs: 0,
        }),
      });
      acquisitions.set(last, acquisition);
    }
    const acquired = await acquisition;
    if (acquired.status !== 'acquired') throw new Error('Fixture acquisition failed');
    await cp(path.join(repositoryRoot, 'src/content'), path.join(root, 'src/content'), {
      recursive: true,
    });
    const metrics = {
      ...metricsTemplate,
      checkedAt: liveCheckedAt,
      problems: Object.fromEntries(
        acquired.artifact.problems.map((p) => [
          p.id,
          {
            officialTaskId: p.officialTaskId,
            difficulty: null,
            difficultyExperimental: null,
            point: null,
          },
        ]),
      ),
    };
    // No shared object escapes: callers deliberately corrupt nested fields.
    return structuredClone({
      ...base,
      metadataBatch: acquired.artifact,
      metrics,
      repositoryRoot,
      candidateRoot: root,
    });
  };

  const template = projection.problemDocuments.get('abc212-e');
  const placement = projection.policy.placements.find((p) => p.problemId === 'abc212-e');
  const analysis = projection.catalog.techniqueInventory.find((p) => p.problemId === 'abc212-e');
  if (!template || !placement || !analysis) throw new Error('Missing authoring fixture');
  const homeId = projection.mapping.find(
    (item) => item.problemId === template.unit.problemId,
  )?.homeUnitId;
  const home = projection.catalog.learningUnits.find((unit) => unit.id === homeId);
  const relatedUnit = projection.catalog.learningUnits.find(
    (unit) => unit.id === 'unit-modular-arithmetic',
  );
  if (!home || !relatedUnit) throw new Error('Missing fixture Outcome owner or related Unit');

  /** Borrow a complete document solely to exercise the editing contract; these are
   * synthetic transport Problems, never real ABC467 explanations for publication. */
  const authorSmallBatch = async (input: Awaited<ReturnType<typeof smallBatchInput>>) => {
    const policy = structuredClone(projection.policy);
    for (const problem of input.metadataBatch.problems) {
      const replace = <T>(value: T): T =>
        JSON.parse(
          JSON.stringify(value)
            .replaceAll(
              template.unit.sourceRevisionIds[0] ?? '__missing__',
              problem.sourceRevisionIds[0] ?? '__missing__',
            )
            .replaceAll(
              template.unit.sourceRevisionIds[1] ?? '__missing__',
              problem.sourceRevisionIds[1] ?? '__missing__',
            )
            .replaceAll('abc212-e', problem.id),
        ) as T;
      const unit = replace(template.unit);
      const batchPlacement = replace(placement);
      if (problem.id === 'abc467-e') {
        // Exercise a related Unit with a claim actually present in the borrowed analysis.
        batchPlacement.supportingTagIds.push('tag-modular-arithmetic');
        batchPlacement.supportingOutcomeIds.push('outcome-compute-in-modular-arithmetic');
        unit.learningOutcomeIds.push('outcome-compute-in-modular-arithmetic');
        const prerequisite = batchPlacement.claimDispositions.find(
          (d) => d.claimRef.claimPath === '/prerequisiteCandidates/1',
        );
        if (!prerequisite) throw new Error('Missing modular subtraction claim');
        prerequisite.kind = 'supporting';
        prerequisite.tagIds = ['tag-modular-arithmetic'];
        prerequisite.rationale =
          '法を取る減算の正規化を剰余演算の補助学習成果へ対応させるfixture。';
      }
      delete unit.skill;
      unit.docPath = `src/content/docs/problems/${problem.id}.md`;
      unit.examples = [];
      unit.exercises = [];
      const text = renderProblemAuthoringDocument(unit, `${problem.id} 編集経路fixture`, {
        home: `[主題](/${home.docPath.replace('src/content/docs/', '').replace(/\.md$/u, '/')})`,
        outcomes: unit.learningOutcomeIds,
        prerequisites: [],
        sources: input.metadataBatch.sourceRevisions
          .filter((s) => problem.sourceRevisionIds.includes(s.id))
          .map((s) => `[公式fixture出典](${s.url})`),
      });
      await writeFile(path.join(input.candidateRoot, unit.docPath), text);
      const file = path.join(
        input.candidateRoot,
        `src/content/technique-inventory/${input.metadataBatch.batchId}/${problem.id}.json`,
      );
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(replace(analysis)));
      policy.placements.push(batchPlacement);
    }
    policy.placementDigest = canonicalDigest(policy.placements);
    await writeFile(
      path.join(input.candidateRoot, 'src/content/policies/problem-placements.json'),
      JSON.stringify(policy),
    );
    // Explicit editorial input for this synthetic contract fixture: choose an
    // order different from contest/slot order. This is not real problem ranking.
    const addedIds = new Set(input.metadataBatch.problems.map((problem) => problem.id));
    const fixtureOrder = [
      'abc468-i',
      'abc467-e',
      'abc468-f',
      'abc467-i',
      'abc468-e',
      'abc467-ex',
      'abc468-ex',
      'abc467-f',
    ].filter((id) => addedIds.has(id));
    const homeFile = path.join(input.candidateRoot, `src/content/learning-units/${home.id}.json`);
    const authoredHome = structuredClone(home);
    authoredHome.directProblemIds?.splice(
      authoredHome.directProblemIds.indexOf('abc212-e') + 1,
      0,
      ...fixtureOrder,
    );
    await writeFile(homeFile, JSON.stringify(authoredHome));
    const related = structuredClone(relatedUnit);
    related.relatedProblemIds?.splice(1, 0, 'abc467-e');
    await writeFile(
      path.join(input.candidateRoot, `src/content/learning-units/${related.id}.json`),
      JSON.stringify(related),
    );
  };

  return { smallBatchInput, authorSmallBatch };
};

export type SmallBatchFixture = Awaited<ReturnType<typeof createSmallBatchFixture>>;
export type SmallBatchInput = Awaited<ReturnType<SmallBatchFixture['smallBatchInput']>>;

/** Fork an authored starting point without sharing candidate bytes or input arrays. */
export const copySmallBatchCandidate = async (input: SmallBatchInput, root: string) => {
  await cp(path.join(input.candidateRoot, 'src/content'), path.join(root, 'src/content'), {
    recursive: true,
  });
  return structuredClone({ ...input, candidateRoot: root });
};

export const contentHashes = async (root: string) => {
  const files = (await readdir(path.join(root, 'src/content'), { recursive: true })).sort();
  const result = new Map<string, string>();
  for (const file of files) {
    try {
      result.set(
        file,
        createHash('sha256')
          .update(await readFile(path.join(root, 'src/content', file)))
          .digest('hex'),
      );
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EISDIR')) throw error;
    }
  }
  return result;
};
