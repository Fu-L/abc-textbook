import { createHash, randomUUID } from 'node:crypto';
import { chmod, link, lstat, mkdir, readFile, realpath, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { OfficialPageResponse, OfficialPageTransport } from '../../src/lib/corpus/types.js';

interface CachedOfficialPage {
  readonly schemaVersion: '1.0.0';
  readonly cacheScope: string;
  readonly url: string;
  readonly status: number;
  readonly contentType: string;
  readonly finalUrl: string;
  readonly body: string;
}

export interface PrivateResponseCache {
  readonly cacheDirectory: string;
  readonly transport: OfficialPageTransport;
  readonly isCached: (url: string) => Promise<boolean>;
}

export class PrivateResponseCacheError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'PrivateResponseCacheError';
  }
}

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const cacheKey = (url: string): string => createHash('sha256').update(url, 'utf8').digest('hex');

const cachePath = (cacheDirectory: string, url: string): string =>
  path.join(cacheDirectory, `${cacheKey(url)}.json`);

const parseCachedPage = (
  value: unknown,
  expectedUrl: string,
  expectedCacheScope: string,
): CachedOfficialPage => {
  if (
    !isRecord(value) ||
    Object.keys(value).sort().join(',') !==
      'body,cacheScope,contentType,finalUrl,schemaVersion,status,url' ||
    value.schemaVersion !== '1.0.0' ||
    value.cacheScope !== expectedCacheScope ||
    value.url !== expectedUrl ||
    typeof value.status !== 'number' ||
    !Number.isInteger(value.status) ||
    typeof value.contentType !== 'string' ||
    typeof value.finalUrl !== 'string' ||
    typeof value.body !== 'string'
  ) {
    throw new PrivateResponseCacheError('RESPONSE_CACHE_ENTRY_INVALID', expectedUrl);
  }
  return value as unknown as CachedOfficialPage;
};

const readCachedPage = async (
  cacheDirectory: string,
  url: string,
  cacheScope: string,
): Promise<CachedOfficialPage | null> => {
  const filePath = cachePath(cacheDirectory, url);
  try {
    const metadata = await lstat(filePath);
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      throw new PrivateResponseCacheError('RESPONSE_CACHE_ENTRY_UNSAFE', filePath);
    }
    return parseCachedPage(
      JSON.parse(await readFile(filePath, 'utf8')) as unknown,
      url,
      cacheScope,
    );
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  }
};

const commitCachedPage = async (
  cacheDirectory: string,
  page: CachedOfficialPage,
): Promise<void> => {
  const finalPath = cachePath(cacheDirectory, page.url);
  const temporaryPath = path.join(
    cacheDirectory,
    `.${cacheKey(page.url)}.${String(process.pid)}.${randomUUID()}.tmp`,
  );
  await writeFile(temporaryPath, `${JSON.stringify(page)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o600,
  });
  try {
    try {
      await link(temporaryPath, finalPath);
    } catch (error) {
      if (!isNodeError(error) || error.code !== 'EEXIST') throw error;
    }
  } finally {
    await unlink(temporaryPath).catch((error: unknown) => {
      if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    });
  }
};

/**
 * Raw responses are allowed only in an explicitly selected private directory
 * outside the repository. Canonical corpus files never read this shape.
 */
export const createPrivateResponseCache = async (input: {
  readonly cacheDirectory: string;
  readonly repositoryRoot: string;
  readonly upstream: OfficialPageTransport;
  /** SHA-256 of the immutable acquisition checkedAt + approved policy subject. */
  readonly cacheScope: string;
  /** Policy documents must always bypass cached source bytes. */
  readonly bypassUrls?: readonly string[];
}): Promise<PrivateResponseCache> => {
  if (
    !path.isAbsolute(input.cacheDirectory) ||
    path.parse(input.cacheDirectory).root === input.cacheDirectory ||
    !/^[a-f0-9]{64}$/u.test(input.cacheScope)
  ) {
    throw new PrivateResponseCacheError(
      'RESPONSE_CACHE_PATH_INVALID',
      'Use a non-root absolute path outside the repository.',
    );
  }
  const repositoryRoot = await realpath(input.repositoryRoot);
  const requestedCacheDirectory = path.resolve(input.cacheDirectory);
  const requestedRelativeToRepository = path.relative(repositoryRoot, requestedCacheDirectory);
  if (
    requestedRelativeToRepository === '' ||
    (!requestedRelativeToRepository.startsWith(`..${path.sep}`) &&
      requestedRelativeToRepository !== '..')
  ) {
    throw new PrivateResponseCacheError(
      'RESPONSE_CACHE_INSIDE_REPOSITORY',
      requestedCacheDirectory,
    );
  }
  await mkdir(input.cacheDirectory, { recursive: true, mode: 0o700 });
  const cacheDirectory = await realpath(input.cacheDirectory);
  const relativeToRepository = path.relative(repositoryRoot, cacheDirectory);
  const repositoryRelativeToCache = path.relative(cacheDirectory, repositoryRoot);
  if (
    relativeToRepository === '' ||
    (!relativeToRepository.startsWith(`..${path.sep}`) && relativeToRepository !== '..') ||
    repositoryRelativeToCache === '' ||
    (!repositoryRelativeToCache.startsWith(`..${path.sep}`) && repositoryRelativeToCache !== '..')
  ) {
    throw new PrivateResponseCacheError('RESPONSE_CACHE_OVERLAPS_REPOSITORY', cacheDirectory);
  }
  await chmod(cacheDirectory, 0o700);
  const requestedScopedCacheDirectory = path.join(cacheDirectory, input.cacheScope);
  await mkdir(requestedScopedCacheDirectory, { recursive: true, mode: 0o700 });
  const scopedMetadata = await lstat(requestedScopedCacheDirectory);
  if (scopedMetadata.isSymbolicLink() || !scopedMetadata.isDirectory()) {
    throw new PrivateResponseCacheError(
      'RESPONSE_CACHE_SCOPE_UNSAFE',
      requestedScopedCacheDirectory,
    );
  }
  const scopedCacheDirectory = await realpath(requestedScopedCacheDirectory);
  const scopedRelativeToCache = path.relative(cacheDirectory, scopedCacheDirectory);
  if (
    scopedRelativeToCache === '' ||
    scopedRelativeToCache === '..' ||
    scopedRelativeToCache.startsWith(`..${path.sep}`) ||
    path.isAbsolute(scopedRelativeToCache)
  ) {
    throw new PrivateResponseCacheError('RESPONSE_CACHE_SCOPE_ESCAPE', scopedCacheDirectory);
  }
  await chmod(scopedCacheDirectory, 0o700);
  const bypassUrls = new Set(input.bypassUrls ?? []);

  const isCached = async (url: string): Promise<boolean> =>
    !bypassUrls.has(url) &&
    (await readCachedPage(scopedCacheDirectory, url, input.cacheScope)) !== null;
  const transport: OfficialPageTransport = async (request): Promise<OfficialPageResponse> => {
    if (bypassUrls.has(request.url)) return input.upstream(request);
    const cached = await readCachedPage(scopedCacheDirectory, request.url, input.cacheScope);
    if (cached) {
      return {
        status: cached.status,
        url: cached.finalUrl,
        contentType: cached.contentType,
        body: cached.body,
      };
    }
    const response = await input.upstream(request);
    // A transient error must remain retryable; only successful responses are reusable.
    if (response.status === 200) {
      await commitCachedPage(scopedCacheDirectory, {
        schemaVersion: '1.0.0',
        cacheScope: input.cacheScope,
        url: request.url,
        status: response.status,
        contentType: response.contentType,
        finalUrl: response.url,
        body: response.body,
      });
    }
    return response;
  };
  return Object.freeze({ cacheDirectory: scopedCacheDirectory, transport, isCached });
};
