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
