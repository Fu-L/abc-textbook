import { canonicalDigest } from '../src/lib/domain/canonical-json.js';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PublicationUpdateSchema } from '../src/lib/domain/schema-parts/release.js';
import { runUpdatePipeline } from './update-abc/index.js';
import { verifyFullReleaseCommit } from './release/validate-full-release.js';
import { CorpusCliError, parseKeyValueArguments } from './corpus/cli-support.js';

export const isProductionReleaseEligible = (update: {
  readonly state: string;
  readonly fixtureMode: boolean;
}): boolean => update.state === 'ELIGIBLE_FOR_BATCH' && !update.fixtureMode;

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const rightSet = new Set(right);
  return (
    new Set(left).size === left.length &&
    rightSet.size === right.length &&
    left.length === right.length &&
    left.every((value) => rightSet.has(value))
  );
};

const snapshotRoots = async (
  repositoryRoot: string,
  relativeRoots: readonly string[],
): Promise<Map<string, string>> => {
  const snapshot = new Map<string, string>();
  const visit = async (relativePath: string): Promise<void> => {
    const absolutePath = path.join(repositoryRoot, relativePath);
    let entries;
    try {
      entries = await readdir(absolutePath, { withFileTypes: true });
    } catch {
      return;
    }
    await Promise.all(
      entries.map(async (entry) => {
        const child = path.join(relativePath, entry.name);
        if (entry.isDirectory()) await visit(child);
        else if (entry.isFile()) {
          snapshot.set(
            child,
            createHash('sha256')
              .update(await readFile(path.join(repositoryRoot, child)))
              .digest('hex'),
          );
        }
      }),
    );
  };
  await Promise.all(relativeRoots.map(visit));
  return snapshot;
};

const changedPaths = (before: Map<string, string>, after: Map<string, string>): string[] =>
  [...new Set([...before.keys(), ...after.keys()])].filter(
    (filePath) => before.get(filePath) !== after.get(filePath),
  );

export const verifyPreviewReleaseSimulation = async (input: {
  readonly previewId: 'initial-v1';
  readonly update: {
    readonly updateId: string;
    readonly publicationUpdate: unknown;
  };
  readonly executeSimulation: () => Promise<{
    readonly updateId: string;
    readonly publicationUpdate: unknown;
  }>;
  readonly repositoryRoot?: string;
}) => {
  const findings: string[] = [];
  const root = path.resolve(input.repositoryRoot ?? process.cwd());
  const [publicBefore, releaseMetadataBefore, deploymentBefore] = await Promise.all([
    snapshotRoots(root, ['public', 'src/content']),
    snapshotRoots(root, ['src/content/releases']),
    snapshotRoots(root, ['dist']),
  ]);
  const update = PublicationUpdateSchema.parse(input.update.publicationUpdate);
  const simulated = await input.executeSimulation();
  if (
    simulated.updateId !== update.updateId ||
    canonicalDigest(simulated.publicationUpdate) !== canonicalDigest(update)
  ) {
    findings.push('SIMULATION_RESULT_MISMATCH');
  }
  const operationPaths = new Set<string>();
  const affectedProblemIds = new Set<string>();
  const problemOperationIds: string[] = [];
  for (const operation of update.operations) {
    if (operationPaths.has(operation.path))
      findings.push(`DUPLICATE_OPERATION_PATH:${operation.path}`);
    operationPaths.add(operation.path);
    for (const problemId of operation.affectedProblemIds) affectedProblemIds.add(problemId);
    if (operation.entityType === 'problem') problemOperationIds.push(operation.entityId);
    const absolutePath = path.resolve(root, operation.path);
    if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
      findings.push(`OPERATION_PATH_OUTSIDE_REPOSITORY:${operation.path}`);
      continue;
    }
    try {
      const artifact = JSON.parse(await readFile(absolutePath, 'utf8')) as unknown;
      if (canonicalDigest(artifact) !== operation.afterDigest) {
        findings.push(`OPERATION_DIGEST_MISMATCH:${operation.path}`);
      }
    } catch {
      findings.push(`OPERATION_ARTIFACT_UNREADABLE:${operation.path}`);
    }
  }
  if (!sameSet(problemOperationIds, update.targetProblemIds)) {
    findings.push('PROBLEM_OPERATION_SCOPE_MISMATCH');
  }
  if (!sameSet([...affectedProblemIds], update.targetProblemIds)) {
    findings.push('AFFECTED_PROBLEM_SCOPE_MISMATCH');
  }
  const [publicAfter, releaseMetadataAfter, deploymentAfter] = await Promise.all([
    snapshotRoots(root, ['public', 'src/content']),
    snapshotRoots(root, ['src/content/releases']),
    snapshotRoots(root, ['dist']),
  ]);
  const publicWrites = changedPaths(publicBefore, publicAfter);
  const productionReleaseMetadataWrites = changedPaths(releaseMetadataBefore, releaseMetadataAfter);
  const deploymentWrites = changedPaths(deploymentBefore, deploymentAfter);
  if (publicWrites.length > 0) findings.push('PUBLIC_WRITE_DETECTED');
  if (productionReleaseMetadataWrites.length > 0)
    findings.push('PRODUCTION_RELEASE_METADATA_WRITE_DETECTED');
  if (deploymentWrites.length > 0) findings.push('DEPLOYMENT_WRITE_DETECTED');
  const closureFindings = findings.filter(
    (finding) =>
      finding.startsWith('OPERATION_') ||
      finding.startsWith('DUPLICATE_OPERATION_') ||
      finding.endsWith('_SCOPE_MISMATCH'),
  );
  const inventory = {
    previewId: input.previewId,
    updateId: input.update.updateId,
    publicationUpdateDigest: canonicalDigest(input.update.publicationUpdate),
    stagingClosed: closureFindings.length === 0,
    publicWriteCount: publicWrites.length,
    productionReleaseMetadataWriteCount: productionReleaseMetadataWrites.length,
    deploymentWriteCount: deploymentWrites.length,
    applicableCheckIds: [
      'check-us5-discovery',
      'check-us5-prepare',
      'check-us5-review',
      'check-us5-validation',
    ],
    checks: [
      'staging-public-closure',
      'immutable-preview-digest',
      'validation-inventory',
      'no-production-release-metadata',
      'no-deployment',
    ],
  };
  return {
    ...inventory,
    aggregatePassed: findings.length === 0,
    findings,
    immutablePreviewDigest: canonicalDigest(inventory),
  };
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const commit = argument('--commit');
  const manifestPath = argument('--manifest');
  if (commit && !manifestPath && !process.argv.includes('--simulation-only')) {
    try {
      parseKeyValueArguments(process.argv.slice(2), [
        '--commit',
        '--catalog',
        '--evidence-inventory',
        '--merge-review',
      ]);
      const mergedMainCommit =
        process.env.GITHUB_REF === 'refs/heads/main' ? process.env.GITHUB_SHA : undefined;
      const catalogPath = argument('--catalog');
      const evidencePath = argument('--evidence-inventory');
      const mergeReviewPath = argument('--merge-review');
      const result = await verifyFullReleaseCommit({
        commit,
        ...(catalogPath ? { catalogPath } : {}),
        ...(evidencePath ? { evidencePath } : {}),
        ...(mergeReviewPath ? { mergeReviewPath } : {}),
        ...(mergedMainCommit ? { mergedMainCommit } : {}),
      });
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } catch (error) {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.stdout.write(
        `${JSON.stringify({ command: 'verify:release', commit, aggregatePassed: false })}\n`,
      );
      process.exitCode = error instanceof CorpusCliError ? 64 : 2;
    }
  } else if (!manifestPath || commit) {
    process.stderr.write(
      'Usage: npm run verify:release -- --commit HEAD [--catalog PATH --evidence-inventory PATH]\n  or --manifest staging/previews/initial-v1/release-simulation/<id>/manifest.json [--simulation-only]\n',
    );
    process.stdout.write(`${JSON.stringify({ command: 'verify:release', exitCode: 64 })}\n`);
    process.exitCode = 64;
  } else {
    const update = PublicationUpdateSchema.parse(
      JSON.parse(await readFile(manifestPath, 'utf8')) as unknown,
    );
    const verification = await verifyPreviewReleaseSimulation({
      previewId: 'initial-v1',
      update: { updateId: update.updateId, publicationUpdate: update },
      executeSimulation: async () => {
        const result = await runUpdatePipeline({ fixture: 'initial-v1' });
        return { updateId: result.updateId, publicationUpdate: result.publicationUpdate };
      },
    });
    if (process.argv.includes('--simulation-only')) {
      process.stdout.write(`${JSON.stringify(verification)}\n`);
      process.exitCode = verification.aggregatePassed ? 0 : 2;
    } else {
      const releaseEligible = isProductionReleaseEligible(update);
      const summary = {
        command: 'verify:release',
        updateId: update.updateId,
        fixtureMode: update.fixtureMode,
        state: update.state,
        aggregatePassed: releaseEligible && verification.aggregatePassed,
        blockingFindingCount: update.validationSummary.blockingFindingCount,
      };
      process.stdout.write(`${JSON.stringify(summary)}\n`);
      process.exitCode = summary.aggregatePassed ? 0 : 2;
    }
  }
}
