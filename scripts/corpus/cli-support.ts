import { randomUUID } from 'node:crypto';
import { link, lstat, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class CorpusCliError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CorpusCliError';
  }
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

export const parseKeyValueArguments = (
  args: readonly string[],
  allowedFlags: readonly string[],
): ReadonlyMap<string, string> => {
  if (args.length % 2 !== 0) {
    throw new CorpusCliError('ARGUMENTS_INVALID', 'Every flag requires one value.');
  }
  const allowed = new Set(allowedFlags);
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!flag || !value || !allowed.has(flag) || values.has(flag)) {
      throw new CorpusCliError(
        'ARGUMENTS_INVALID',
        `${flag ?? '<missing>'} is unknown, duplicated, or has no value.`,
      );
    }
    values.set(flag, value);
  }
  return values;
};

export const requiredArgument = (values: ReadonlyMap<string, string>, flag: string): string => {
  const value = values.get(flag);
  if (!value) throw new CorpusCliError('ARGUMENT_REQUIRED', flag);
  return value;
};

export const readJson = async (filePath: string): Promise<unknown> =>
  JSON.parse(await readFile(filePath, 'utf8')) as unknown;

const inspectPath = async (filePath: string): Promise<Awaited<ReturnType<typeof lstat>> | null> => {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  }
};

/** Create missing parents one segment at a time and reject every symlink hop. */
export const ensureNoSymlinkParents = async (
  repositoryRoot: string,
  relativeFilePath: string,
): Promise<void> => {
  const directorySegments = path.dirname(relativeFilePath).split(path.sep);
  let current = repositoryRoot;
  for (const segment of directorySegments) {
    current = path.join(current, segment);
    let metadata = await inspectPath(current);
    if (!metadata) {
      await mkdir(current);
      metadata = await lstat(current);
    }
    if (metadata.isSymbolicLink() || !metadata.isDirectory()) {
      throw new CorpusCliError('MATERIALIZATION_PARENT_UNSAFE', current);
    }
  }
};

const temporaryPathFor = (filePath: string): string =>
  path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${String(process.pid)}.${randomUUID()}.tmp`,
  );

const serializeJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

/** Commit one complete file without replacing an existing path. */
export const writeJsonNoOverwrite = async (filePath: string, value: unknown): Promise<void> => {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = temporaryPathFor(filePath);
  await writeFile(temporaryPath, serializeJson(value), { encoding: 'utf8', flag: 'wx' });
  try {
    await link(temporaryPath, filePath);
  } finally {
    await unlink(temporaryPath).catch((error: unknown) => {
      if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    });
  }
};

/** Replace a specifically authorized mutable control manifest atomically. */
export const replaceJsonAtomically = async (filePath: string, value: unknown): Promise<void> => {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = temporaryPathFor(filePath);
  await writeFile(temporaryPath, serializeJson(value), { encoding: 'utf8', flag: 'wx' });
  try {
    await rename(temporaryPath, filePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
};

export const reportCliFailure = (error: unknown): void => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = error instanceof CorpusCliError ? 64 : 2;
};
