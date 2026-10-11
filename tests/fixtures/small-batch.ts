import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

import { acquireMetadataRange } from '../../scripts/update-abc/acquire.js';
import { SerialOfficialPageClient } from '../../src/lib/corpus/acquisition.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { renderProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { liveBase, liveCheckedAt, livePolicyApproval, liveTransport } from './live-metadata.js';

export const smallBatchInput = async (root: string, last = 467) => {
  await cp('src/content', path.join(root, 'src/content'), { recursive: true });
  const base = await liveBase();
  const acquired = await acquireMetadataRange({
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
  if (acquired.status !== 'acquired') throw new Error('Fixture acquisition failed');
  const metrics = {
    ...(JSON.parse(
      await readFile('src/content/problem-metrics/atcoder-problems.json', 'utf8'),
    ) as Record<string, unknown>),
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
  return {
    ...base,
    metadataBatch: acquired.artifact,
    metrics,
    repositoryRoot: process.cwd(),
    candidateRoot: root,
  };
};

/** Borrow a complete document solely to exercise the editing contract; these are
 * synthetic transport Problems, never real ABC467 explanations for publication. */
export const authorSmallBatch = async (input: Awaited<ReturnType<typeof smallBatchInput>>) => {
  const base = await loadFullPublicProjection({ usePreparedRelease: false });
  const template = base.problemDocuments.get('abc212-e');
  const placement = base.policy.placements.find((p) => p.problemId === 'abc212-e');
  const analysis = base.catalog.techniqueInventory.find((p) => p.problemId === 'abc212-e');
  if (!template || !placement || !analysis) throw new Error('Missing authoring fixture');
  const homeId = base.mapping.find(
    (item) => item.problemId === template.unit.problemId,
  )?.homeUnitId;
  const home = base.catalog.learningUnits.find((unit) => unit.id === homeId);
  if (!home) throw new Error('Missing fixture Outcome owner');
  const policy = structuredClone(base.policy);
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
      batchPlacement.supportingOutcomeIds.push('outcome-linearize-static-range-information');
      unit.learningOutcomeIds.push('outcome-linearize-static-range-information');
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
