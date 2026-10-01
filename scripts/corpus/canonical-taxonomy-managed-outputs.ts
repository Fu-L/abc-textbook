import { lstat, readdir } from 'node:fs/promises';
import path from 'node:path';

import { CorpusCliError } from './cli-support.js';

interface ManagedOutputScope {
  readonly relativeDirectory: string;
  readonly extension: '.json' | '.md';
}

const MANAGED_OUTPUT_SCOPES: readonly ManagedOutputScope[] = [
  { relativeDirectory: 'src/content/tags', extension: '.json' },
  { relativeDirectory: 'src/content/learning-outcomes', extension: '.json' },
  { relativeDirectory: 'src/content/learning-units', extension: '.json' },
  { relativeDirectory: 'src/content/docs/learn', extension: '.md' },
];

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export type CanonicalTaxonomyOutputDisposition = 'verified' | 'preserved' | 'drift';

/** Preserve only content whose Unit explicitly transferred byte ownership to full authoring. */
export const classifyCanonicalTaxonomyOutput = (input: {
  readonly actualBytes: string;
  readonly expectedBytes: string;
  readonly handoffUnitId?: string;
  readonly fullAuthoringUnitIds: ReadonlySet<string>;
}): CanonicalTaxonomyOutputDisposition => {
  if (input.actualBytes === input.expectedBytes) return 'verified';
  return input.handoffUnitId !== undefined && input.fullAuthoringUnitIds.has(input.handoffUnitId)
    ? 'preserved'
    : 'drift';
};

const repositoryRelativePath = (repositoryRoot: string, absolutePath: string): string =>
  path.relative(repositoryRoot, absolutePath).split(path.sep).join('/');

const inspectManagedDirectory = async (
  repositoryRoot: string,
  scope: ManagedOutputScope,
  absoluteDirectory: string,
  expectedPaths: ReadonlySet<string>,
  unexpectedPaths: string[],
): Promise<void> => {
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  entries.sort((left, right) => compareCodeUnits(left.name, right.name));

  for (const entry of entries) {
    const absoluteEntryPath = path.join(absoluteDirectory, entry.name);
    const relativeEntryPath = repositoryRelativePath(repositoryRoot, absoluteEntryPath);
    const metadata = await lstat(absoluteEntryPath);
    if (metadata.isSymbolicLink()) {
      throw new CorpusCliError('CANONICAL_MATERIALIZATION_MANAGED_PATH_UNSAFE', relativeEntryPath);
    }
    if (metadata.isDirectory()) {
      await inspectManagedDirectory(
        repositoryRoot,
        scope,
        absoluteEntryPath,
        expectedPaths,
        unexpectedPaths,
      );
      continue;
    }
    if (!metadata.isFile()) {
      throw new CorpusCliError('CANONICAL_MATERIALIZATION_MANAGED_PATH_UNSAFE', relativeEntryPath);
    }
    if (entry.name === '.gitkeep' || path.extname(entry.name) !== scope.extension) continue;
    if (!expectedPaths.has(relativeEntryPath)) unexpectedPaths.push(relativeEntryPath);
  }
};

/**
 * Reject stale or ad-hoc canonical files instead of silently leaving a second
 * taxonomy tree beside the accepted materialization.
 */
export const findUnexpectedCanonicalTaxonomyOutputs = async (
  repositoryRoot: string,
  expectedRelativePaths: ReadonlySet<string>,
): Promise<readonly string[]> => {
  const repositoryMetadata = await lstat(repositoryRoot);
  if (repositoryMetadata.isSymbolicLink() || !repositoryMetadata.isDirectory()) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_MANAGED_ROOT_UNSAFE', repositoryRoot);
  }

  const normalizedExpectedPaths = new Set(
    [...expectedRelativePaths].map((relativePath) => relativePath.split(path.sep).join('/')),
  );
  const unexpectedPaths: string[] = [];
  for (const scope of MANAGED_OUTPUT_SCOPES) {
    const absoluteDirectory = path.join(repositoryRoot, scope.relativeDirectory);
    const metadata = await lstat(absoluteDirectory).catch((error: unknown) => {
      if (isNodeError(error) && error.code === 'ENOENT') return null;
      throw error;
    });
    if (metadata === null) continue;
    if (metadata.isSymbolicLink() || !metadata.isDirectory()) {
      throw new CorpusCliError(
        'CANONICAL_MATERIALIZATION_MANAGED_ROOT_UNSAFE',
        scope.relativeDirectory,
      );
    }
    await inspectManagedDirectory(
      repositoryRoot,
      scope,
      absoluteDirectory,
      normalizedExpectedPaths,
      unexpectedPaths,
    );
  }

  return unexpectedPaths.sort(compareCodeUnits);
};
