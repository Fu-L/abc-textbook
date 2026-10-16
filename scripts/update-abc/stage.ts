import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stableCompare, type StagedOperationInput } from './types.js';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** Only content bytes are copied/applied. Existing prose is never regenerated. */
export const readContentFiles = async (root: string): Promise<Map<string, Buffer>> => {
  const directory = path.join(root, 'src/content');
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const files = new Map<string, Buffer>();
  for (const entry of entries.filter((entry) => entry.isFile())) {
    const file = path.relative(root, path.join(entry.parentPath, entry.name));
    files.set(file, await readFile(path.join(root, file)));
  }
  return files;
};

export const writeChangedContent = async (
  root: string,
  files: ReadonlyMap<string, Buffer>,
): Promise<string[]> => {
  const previous = await readContentFiles(root);
  const changed: string[] = [];
  for (const [file, bytes] of files) {
    if (previous.get(file)?.equals(bytes)) continue;
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), bytes);
    changed.push(file);
  }
  return changed.sort();
};

export interface StageInput {
  readonly previewId: string;
  readonly contestId: string | null;
  readonly sourceSetFingerprint: string;
  readonly targetProblemIds: readonly string[];
  readonly operations: readonly StagedOperationInput[];
  readonly allowRepositoryPaths?: boolean;
}

export interface StagedUpdate extends StageInput {
  readonly updateId: string;
  readonly operations: readonly (StagedOperationInput & { readonly operationId: string })[];
  readonly inputDigest: string;
}

const assertStagingPath = (
  candidate: string,
  previewId: string,
  allowRepositoryPaths: boolean,
): void => {
  const root = `staging/previews/${previewId}/`;
  const unsafe = candidate.includes('..') || candidate.startsWith('/');
  if (unsafe || (!allowRepositoryPaths && !candidate.startsWith(root))) {
    throw new Error(`STAGING_PATH_REQUIRED:${candidate}`);
  }
};

export const stagePublicationUpdate = (input: StageInput): StagedUpdate => {
  const paths = new Set<string>();
  for (const operation of input.operations) {
    assertStagingPath(operation.path, input.previewId, input.allowRepositoryPaths ?? false);
    if (paths.has(operation.path)) throw new Error(`DUPLICATE_OPERATION_PATH:${operation.path}`);
    paths.add(operation.path);
  }
  const { allowRepositoryPaths: _allowRepositoryPaths, ...stableInput } = input;
  void _allowRepositoryPaths;
  const normalized = {
    ...stableInput,
    targetProblemIds: [...input.targetProblemIds].sort(stableCompare),
    operations: [...input.operations]
      .sort((left, right) => stableCompare(left.path, right.path))
      .map((operation) => ({
        ...operation,
        affectedProblemIds: [...operation.affectedProblemIds].sort(stableCompare),
        operationId: `operation-${canonicalDigest(operation).slice(0, 20)}`,
      })),
  };
  const inputDigest = canonicalDigest(normalized);
  return { ...normalized, updateId: `update-${inputDigest.slice(0, 24)}`, inputDigest };
};

export const bootstrapPreviewSeed = (input: {
  readonly previewId: string;
  readonly problemIds: readonly string[];
  readonly snapshotDigest: string;
  readonly artifacts: readonly {
    readonly entityType:
      'contest' | 'problem' | 'source' | 'technique_inventory' | 'learning_unit' | 'placement';
    readonly entityId: string;
    readonly path: string;
    readonly digest: string;
    readonly affectedProblemIds: readonly string[];
  }[];
}) =>
  stagePublicationUpdate({
    previewId: input.previewId,
    contestId: null,
    sourceSetFingerprint: input.snapshotDigest,
    allowRepositoryPaths: true,
    targetProblemIds: input.problemIds,
    operations: input.artifacts.map((artifact) => ({
      entityType: artifact.entityType,
      entityId: artifact.entityId,
      action: 'add' as const,
      path: artifact.path,
      beforeDigest: null,
      afterDigest: artifact.digest,
      affectedProblemIds: artifact.affectedProblemIds,
    })),
  });
