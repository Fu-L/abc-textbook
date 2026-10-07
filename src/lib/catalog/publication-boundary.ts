import { realpath } from 'node:fs/promises';
import path from 'node:path';

export class CatalogPublicationBoundaryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CatalogPublicationBoundaryError';
  }
}

const pathSegments = (value: string): readonly string[] =>
  value.replaceAll('\\', '/').split('/').filter(Boolean);

export const hasStagingPathSegment = (value: string): boolean =>
  pathSegments(value).some((segment) => segment.toLocaleLowerCase('en-US') === 'staging');

const isWithin = (root: string, candidate: string): boolean => {
  const relative = path.relative(root, candidate);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
};

/** Public evidence is kept in these roots; staging and arbitrary repository files are not evidence. */
export const publicEvidenceRoots = [
  'docs/verification',
  'docs/reviews/human-content',
  'docs/reviews/agent-content/initial-release',
  // Keep the path used by the phase-two fixtures while the review tree migrates to its final name.
  'docs/judgments',
] as const;

export const resolvePublicCatalogInput = async (
  inputPath: string,
  repositoryRoot = process.cwd(),
): Promise<string> => {
  if (hasStagingPathSegment(inputPath)) {
    throw new CatalogPublicationBoundaryError(
      'STAGING_PUBLICATION_BOUNDARY',
      `Public catalog cannot read ${inputPath}.`,
    );
  }

  const resolvedRepositoryRoot = await realpath(repositoryRoot);
  const resolvedStagingRoot = await realpath(path.join(resolvedRepositoryRoot, 'staging'));
  const absoluteInput = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(resolvedRepositoryRoot, inputPath);
  const resolvedInput = await realpath(absoluteInput);
  if (!isWithin(resolvedRepositoryRoot, resolvedInput)) {
    throw new CatalogPublicationBoundaryError(
      'CATALOG_INPUT_OUTSIDE_REPOSITORY',
      `Catalog input is outside the repository: ${inputPath}.`,
    );
  }
  if (isWithin(resolvedStagingRoot, resolvedInput)) {
    throw new CatalogPublicationBoundaryError(
      'STAGING_PUBLICATION_BOUNDARY',
      `Public catalog cannot read staging through ${inputPath}.`,
    );
  }
  return resolvedInput;
};

export const resolvePublicEvidencePath = async (
  evidencePath: string,
  repositoryRoot = process.cwd(),
): Promise<string> => {
  if (hasStagingPathSegment(evidencePath)) {
    throw new CatalogPublicationBoundaryError(
      'STAGING_PUBLICATION_BOUNDARY',
      `Public evidence cannot read ${evidencePath}.`,
    );
  }

  const resolvedRepositoryRoot = await realpath(repositoryRoot);
  const absoluteEvidence = path.isAbsolute(evidencePath)
    ? evidencePath
    : path.resolve(resolvedRepositoryRoot, evidencePath);
  let resolvedEvidence: string;
  try {
    resolvedEvidence = await realpath(absoluteEvidence);
  } catch {
    throw new CatalogPublicationBoundaryError(
      'EVIDENCE_FILE_NOT_FOUND',
      `Public evidence file does not exist: ${evidencePath}.`,
    );
  }

  try {
    const resolvedStagingRoot = await realpath(path.join(resolvedRepositoryRoot, 'staging'));
    if (isWithin(resolvedStagingRoot, resolvedEvidence)) {
      throw new CatalogPublicationBoundaryError(
        'STAGING_PUBLICATION_BOUNDARY',
        `Public evidence cannot read staging through ${evidencePath}.`,
      );
    }
  } catch (error) {
    if (error instanceof CatalogPublicationBoundaryError) throw error;
    // The repository may omit staging in a minimal test fixture; root authorization below still applies.
  }

  const resolvedRoots: string[] = [];
  for (const root of publicEvidenceRoots) {
    try {
      resolvedRoots.push(await realpath(path.join(resolvedRepositoryRoot, root)));
    } catch {
      // A not-yet-created optional evidence root cannot authorize a path.
    }
  }
  if (!resolvedRoots.some((root) => isWithin(root, resolvedEvidence))) {
    throw new CatalogPublicationBoundaryError(
      'EVIDENCE_OUTSIDE_PUBLIC_ROOT',
      `Evidence must be under a public evidence root: ${evidencePath}.`,
    );
  }
  return resolvedEvidence;
};

/** Canonical release inputs may live in staging, but never outside the repository tree. */
export const resolveCanonicalReleaseSource = async (
  sourcePath: string,
  repositoryRoot = process.cwd(),
): Promise<string> => {
  const resolvedRepositoryRoot = await realpath(repositoryRoot);
  const absoluteSource = path.isAbsolute(sourcePath)
    ? sourcePath
    : path.resolve(resolvedRepositoryRoot, sourcePath);
  let resolvedSource: string;
  try {
    resolvedSource = await realpath(absoluteSource);
  } catch {
    throw new CatalogPublicationBoundaryError(
      'CANONICAL_RELEASE_SOURCE_NOT_FOUND',
      `Canonical release source does not exist: ${sourcePath}.`,
    );
  }
  if (!isWithin(resolvedRepositoryRoot, resolvedSource)) {
    throw new CatalogPublicationBoundaryError(
      'CANONICAL_RELEASE_SOURCE_OUTSIDE_REPOSITORY',
      `Canonical release source is outside the repository: ${sourcePath}.`,
    );
  }
  return resolvedSource;
};
