import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stableCompare, type StagedOperationInput } from './types.js';

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
