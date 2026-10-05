import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  PROBLEM_SHARD_INDEX_PATH,
  PROBLEM_SHARD_ROOT,
  PROBLEM_SHARD_DOMAINS,
  assertProblemShardIndex,
  type ProblemShardIndex,
} from '../../src/lib/authoring/problem-shard-index.js';
import {
  readShardJson,
  loadProblemShardContext,
  buildProblemShardWorkManifest,
} from '../../src/lib/authoring/problem-shard-context.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
const optionalJson = async <T>(file: string): Promise<T | undefined> =>
  readShardJson<T>(file).catch((error: unknown) => {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  });
const mode = process.argv[2] ?? '--check';
try {
  if (process.argv.length > 3 || !['--check', '--write'].includes(mode))
    throw new Error('Usage: freeze-problem-shard-index [--check | --write]');
  const stored = await optionalJson<ProblemShardIndex>(PROBLEM_SHARD_INDEX_PATH);
  if (!stored && mode === '--check')
    throw new Error('SHARD_INDEX_MISSING: run corpus:problem-shards:freeze');
  const context = await loadProblemShardContext(stored?.frozenAt ?? new Date().toISOString());
  const { index } = context;
  if (stored) assertProblemShardIndex(stored, index);
  const outputs: { path: string; value: unknown }[] = [
    { path: PROBLEM_SHARD_INDEX_PATH, value: index },
  ];
  for (const domain of PROBLEM_SHARD_DOMAINS) {
    const shards = index.shards.filter((s) => s.domain === domain);
    outputs.push({
      path: `${PROBLEM_SHARD_ROOT}/${domain}/manifest.json`,
      value: {
        domain,
        indexDigest: index.indexDigest,
        taskId: `T${String(66 + PROBLEM_SHARD_DOMAINS.indexOf(domain)).padStart(3, '0')}`,
        shardIds: shards.map((s) => s.shardId),
        problemCount: shards.reduce((sum, s) => sum + s.problemIds.length, 0),
      },
    });
    for (const shard of shards) {
      const previous = await optionalJson<unknown>(`${shard.workPath}/manifest.json`);
      const parsed = previous === undefined ? undefined : ContentWorkManifestSchema.parse(previous);
      if (parsed) validateContentWorkManifest(parsed);
      const planned = await buildProblemShardWorkManifest(
        context,
        shard,
        parsed?.reviewPolicy ?? shard.reviewPolicy,
      );
      if (parsed && parsed.scopeDigest !== planned.scopeDigest)
        throw new Error(`SHARD_MANIFEST_SCOPE_DRIFT:${shard.shardId}`);
      const manifest = parsed ?? planned;
      outputs.push({ path: `${shard.workPath}/manifest.json`, value: manifest });
      outputs.push({
        path: `${shard.workPath}/dispatch.json`,
        value: {
          ...shard,
          reviewPolicy: manifest.reviewPolicy,
          indexDigest: index.indexDigest,
          manifestDigest: manifest.digest,
          evidencePaths: {
            checks: `${shard.workPath}/checks.json`,
            review: `${shard.workPath}/review.json`,
            preview: `${shard.previewPath}/snapshot.json`,
          },
          ownedContentLocators: shard.problemIds.map((problemId, i) => ({
            ownerType: 'problem',
            problemId,
            path: shard.documentPaths[i],
            localKeys: { claims: ['correctness'], examples: ['worked'], exercises: ['transfer'] },
          })),
        },
      });
    }
  }
  // Validate the complete output set before the first write. Re-runs can fill missing outputs after interruption.
  const missing = [];
  for (const output of outputs) {
    const text = JSON.stringify(output.value, null, 2) + '\n';
    const existing = await optionalJson(output.path);
    if (existing !== undefined && canonicalDigest(existing) !== canonicalDigest(output.value))
      throw new Error(`SHARD_FROZEN_ARTIFACT_DRIFT:${output.path}`);
    if (mode === '--write' && existing === undefined) {
      missing.push({ path: output.path, text });
    }
    if (mode === '--check') {
      if (existing === undefined) throw new Error(`SHARD_FROZEN_ARTIFACT_MISSING:${output.path}`);
      if ((await readFile(output.path, 'utf8')) !== text)
        throw new Error(`SHARD_FROZEN_ARTIFACT_FORMAT_DRIFT:${output.path}`);
    }
  }
  for (const output of missing) {
    await mkdir(path.dirname(output.path), { recursive: true });
    await writeFile(output.path, output.text, { flag: 'wx' });
  }
  console.log(
    JSON.stringify({
      status: 'passed',
      indexDigest: index.indexDigest,
      shards: index.shards.length,
      problems: index.problemCount,
      domains: PROBLEM_SHARD_DOMAINS,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
