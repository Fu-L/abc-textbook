import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readdir, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { load } from 'cheerio';
import { z } from 'zod';

import { acquisitionCacheScope } from '../../src/lib/corpus/acquisition.js';
import { corpusBatches } from '../../src/lib/corpus/batches.js';
import {
  OfficialMetadataError,
  parseOfficialEditorialItemRevision,
  parseOfficialProblemMetadata,
} from '../../src/lib/corpus/metadata.js';
import type {
  CorpusMetadataBatch,
  CorpusProblemMetadata,
  CorpusSourceRevision,
  OfficialContestMetadata,
  PolicyApprovalManifest,
} from '../../src/lib/corpus/types.js';
import {
  CorpusVerificationError,
  verifyCorpusMetadataBatch,
} from '../../src/lib/corpus/verification.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  CorpusCliError,
  parseKeyValueArguments,
  readJson,
  requiredArgument,
} from './cli-support.js';

const USAGE =
  'Usage: export-inventory-review-packets --metadata-dir PATH --cache-scope-dir ABSOLUTE_PATH --output-dir ABSOLUTE_PATH [--repository-root PATH]';

const SHA_256 = /^[a-f0-9]{64}$/u;
const cachedPageSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  cacheScope: z.string().regex(SHA_256),
  url: z.url(),
  status: z.literal(200),
  contentType: z.string().min(1),
  finalUrl: z.url(),
  body: z.string().min(1),
});

type CachedPage = z.infer<typeof cachedPageSchema>;

const usageErrorCodes = new Set([
  'ARGUMENTS_INVALID',
  'ARGUMENT_REQUIRED',
  'REVIEW_PACKET_OUTPUT_PATH_INVALID',
  'REVIEW_PACKET_OUTPUT_ALREADY_EXISTS',
  'REVIEW_PACKET_CACHE_PATH_INVALID',
  'REVIEW_PACKET_CACHE_DIRECTORY_UNSAFE',
  'REVIEW_PACKET_CACHE_SCOPE_INVALID',
]);

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const reportReviewPacketFailure = (error: unknown): void => {
  let exitCode: 2 | 64 | 65 | 70 | 73;
  if (error instanceof CorpusCliError && usageErrorCodes.has(error.code)) exitCode = 64;
  else if (error instanceof SyntaxError || error instanceof z.ZodError) exitCode = 65;
  else if (error instanceof CorpusVerificationError || error instanceof OfficialMetadataError) {
    exitCode = 2;
  } else if (isNodeError(error) && !(error instanceof CorpusCliError)) exitCode = 73;
  else if (error instanceof CorpusCliError) exitCode = 2;
  else exitCode = 70;
  if (exitCode === 64) console.error(USAGE);
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = exitCode;
};

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const assertOutsideRepository = (
  repositoryRoot: string,
  requestedPath: string,
  code: string,
): string => {
  if (!path.isAbsolute(requestedPath)) throw new CorpusCliError(code, requestedPath);
  const resolved = path.resolve(requestedPath);
  const repositoryRelative = path.relative(repositoryRoot, resolved);
  const outputRelative = path.relative(resolved, repositoryRoot);
  if (
    repositoryRelative === '' ||
    (!repositoryRelative.startsWith(`..${path.sep}`) && repositoryRelative !== '..') ||
    outputRelative === '' ||
    (!outputRelative.startsWith(`..${path.sep}`) && outputRelative !== '..')
  ) {
    throw new CorpusCliError(code, resolved);
  }
  return resolved;
};

const resolveNewOutsideDirectory = async (
  repositoryRoot: string,
  requestedDirectory: string,
): Promise<string> => {
  const lexicalDirectory = assertOutsideRepository(
    repositoryRoot,
    requestedDirectory,
    'REVIEW_PACKET_OUTPUT_PATH_INVALID',
  );
  const resolvedParent = await realpath(path.dirname(lexicalDirectory));
  const resolvedDirectory = path.join(resolvedParent, path.basename(lexicalDirectory));
  return assertOutsideRepository(
    repositoryRoot,
    resolvedDirectory,
    'REVIEW_PACKET_OUTPUT_PATH_INVALID',
  );
};

const assertPathDoesNotExist = async (absolutePath: string): Promise<void> => {
  try {
    await lstat(absolutePath);
    throw new CorpusCliError('REVIEW_PACKET_OUTPUT_ALREADY_EXISTS', absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
};

interface ResolvedPrivateCacheDirectory {
  readonly directory: string;
  readonly cacheScope: string;
}

const resolvePrivateCacheDirectory = async (
  repositoryRoot: string,
  requestedDirectory: string,
): Promise<ResolvedPrivateCacheDirectory> => {
  const directory = assertOutsideRepository(
    repositoryRoot,
    requestedDirectory,
    'REVIEW_PACKET_CACHE_PATH_INVALID',
  );
  const requestedMetadata = await lstat(directory);
  if (requestedMetadata.isSymbolicLink() || !requestedMetadata.isDirectory()) {
    throw new CorpusCliError('REVIEW_PACKET_CACHE_DIRECTORY_UNSAFE', directory);
  }
  const resolvedDirectory = await realpath(directory);
  assertOutsideRepository(repositoryRoot, resolvedDirectory, 'REVIEW_PACKET_CACHE_PATH_INVALID');
  const cacheScope = path.basename(resolvedDirectory);
  if (!SHA_256.test(cacheScope)) {
    throw new CorpusCliError('REVIEW_PACKET_CACHE_SCOPE_INVALID', cacheScope);
  }
  const metadata = await lstat(resolvedDirectory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new CorpusCliError('REVIEW_PACKET_CACHE_DIRECTORY_UNSAFE', resolvedDirectory);
  }
  return { directory: resolvedDirectory, cacheScope };
};

const loadPrivatePages = async (
  cache: ResolvedPrivateCacheDirectory,
  expectedCacheScope: string,
): Promise<ReadonlyMap<string, CachedPage>> => {
  if (cache.cacheScope !== expectedCacheScope) {
    throw new CorpusCliError(
      'REVIEW_PACKET_CACHE_SCOPE_MISMATCH',
      `${cache.cacheScope} != ${expectedCacheScope}`,
    );
  }
  const pages = new Map<string, CachedPage>();
  for (const entry of (await readdir(cache.directory, { withFileTypes: true })).sort(
    (left, right) => compareText(left.name, right.name),
  )) {
    if (!entry.isFile() || entry.isSymbolicLink() || !/^[a-f0-9]{64}\.json$/u.test(entry.name)) {
      throw new CorpusCliError('REVIEW_PACKET_CACHE_ENTRY_UNSAFE', entry.name);
    }
    const page = cachedPageSchema.parse(
      JSON.parse(await readFile(path.join(cache.directory, entry.name), 'utf8')) as unknown,
    );
    const url = new URL(page.url);
    if (
      page.cacheScope !== cache.cacheScope ||
      url.protocol !== 'https:' ||
      url.hostname !== 'atcoder.jp' ||
      !page.contentType.toLocaleLowerCase('en-US').includes('text/html') ||
      pages.has(page.url)
    ) {
      throw new CorpusCliError('REVIEW_PACKET_CACHE_ENTRY_INVALID', page.url);
    }
    pages.set(page.url, page);
  }
  return pages;
};

const extractStatementText = (html: string, problemId: string): string => {
  const $ = load(html);
  const roots = $('#task-statement span.lang-en');
  if (roots.length !== 1) {
    throw new CorpusCliError(
      'REVIEW_PACKET_STATEMENT_PARSER_DRIFT',
      `${problemId}: ${String(roots.length)} English roots`,
    );
  }
  const root = roots.first().clone();
  root.find('script, style, pre').remove();
  root.find('section').each((_index, section) => {
    const heading = normalizeText($(section).find('h3').first().text());
    if (/^(?:sample input|sample output)/iu.test(heading)) $(section).remove();
  });
  const text = normalizeText(root.text());
  if (text.length < 20) {
    throw new CorpusCliError('REVIEW_PACKET_STATEMENT_TEXT_MISSING', problemId);
  }
  return text;
};

const extractSamples = (
  html: string,
  problemId: string,
): readonly Readonly<{ heading: string; text: string; note: string }>[] => {
  const $ = load(html);
  const roots = $('#task-statement span.lang-en');
  if (roots.length !== 1) {
    throw new CorpusCliError(
      'REVIEW_PACKET_SAMPLE_PARSER_DRIFT',
      `${problemId}: ${String(roots.length)} English roots`,
    );
  }
  const samples = roots
    .first()
    .find('section')
    .toArray()
    .flatMap((section) => {
      const heading = normalizeText($(section).find('h3').first().text());
      if (!/^(?:sample input|sample output)/iu.test(heading)) return [];
      const text = normalizeText($(section).find('pre').first().text());
      const noteRoot = $(section).clone();
      noteRoot.find('h3, pre').remove();
      return [{ heading, text, note: normalizeText(noteRoot.text()) }];
    });
  return samples;
};

const extractEditorialText = (html: string, contestId: string, officialTaskId: string): string => {
  const $ = load(html);
  const expectedPath = `/contests/${contestId}/tasks/${officialTaskId}`;
  const headings = $('h2').filter((_index, heading) =>
    $(heading)
      .find('a[href]')
      .toArray()
      .some((anchor) => {
        const href = $(anchor).attr('href');
        if (!href) return false;
        try {
          return new URL(href, 'https://atcoder.jp').pathname === expectedPath;
        } catch {
          return false;
        }
      }),
  );
  if (headings.length !== 1) {
    throw new CorpusCliError(
      'REVIEW_PACKET_EDITORIAL_PARSER_DRIFT',
      `${contestId}:${officialTaskId}: ${String(headings.length)} task headings`,
    );
  }
  const container = $('<abc-textbook-editorial></abc-textbook-editorial>');
  for (const element of headings.first().nextAll().toArray()) container.append($(element).clone());
  container.find('script, style, form, nav, footer, pre, noscript').remove();
  const text = normalizeText(container.text());
  if (text.length < 20) {
    throw new CorpusCliError(
      'REVIEW_PACKET_EDITORIAL_TEXT_MISSING',
      `${contestId}:${officialTaskId}`,
    );
  }
  return text;
};

const requestedEnglishUrl = (canonicalUrl: string): string => `${canonicalUrl}?lang=en`;

const pageFor = (
  pages: ReadonlyMap<string, CachedPage>,
  canonicalUrl: string,
  problemId: string,
): CachedPage => {
  const requestedUrl = requestedEnglishUrl(canonicalUrl);
  const page = pages.get(requestedUrl);
  if (!page) {
    throw new CorpusCliError('REVIEW_PACKET_SOURCE_PAGE_MISSING', `${problemId}: ${requestedUrl}`);
  }
  return page;
};

const buildPacket = (input: {
  readonly problem: CorpusProblemMetadata;
  readonly contest: OfficialContestMetadata;
  readonly sourcesById: ReadonlyMap<string, CorpusSourceRevision>;
  readonly pages: ReadonlyMap<string, CachedPage>;
  readonly termsCheckedAt: string;
}): Readonly<Record<string, unknown>> => {
  const task = input.contest.tasks.find(
    ({ officialTaskId }) => officialTaskId === input.problem.officialTaskId,
  );
  if (!task) throw new CorpusCliError('REVIEW_PACKET_TASK_MISSING', input.problem.id);

  const sources = input.problem.sourceRevisionIds.map((sourceId) => {
    const source = input.sourcesById.get(sourceId);
    if (!source) throw new CorpusCliError('REVIEW_PACKET_SOURCE_MISSING', sourceId);
    return source;
  });
  const problemSource = sources.find(({ sourceKind }) => sourceKind === 'official_problem');
  const editorialSources = sources.filter(({ sourceKind }) => sourceKind === 'official_editorial');
  if (!problemSource || editorialSources.length === 0) {
    throw new CorpusCliError('REVIEW_PACKET_SOURCE_SET_INVALID', input.problem.id);
  }

  const problemPage = pageFor(input.pages, problemSource.url, input.problem.id);
  const reparsedProblem = parseOfficialProblemMetadata({
    contest: input.contest,
    task,
    html: problemPage.body,
    checkedAt: input.problem.checkedAt,
    termsCheckedAt: input.termsCheckedAt,
  });
  if (
    reparsedProblem.problem.id !== input.problem.id ||
    reparsedProblem.sourceRevision.id !== problemSource.id
  ) {
    throw new CorpusCliError('REVIEW_PACKET_PROBLEM_SOURCE_CHANGED', input.problem.id);
  }

  const editorialText = editorialSources
    .map((source) => {
      const page = pageFor(input.pages, source.url, input.problem.id);
      const reparsed = parseOfficialEditorialItemRevision({
        contestId: input.problem.contestId,
        officialTaskId: input.problem.officialTaskId,
        url: source.url,
        html: page.body,
        checkedAt: input.problem.checkedAt,
        termsCheckedAt: input.termsCheckedAt,
      });
      if (reparsed.id !== source.id) {
        throw new CorpusCliError('REVIEW_PACKET_EDITORIAL_SOURCE_CHANGED', input.problem.id);
      }
      return extractEditorialText(page.body, input.problem.contestId, input.problem.officialTaskId);
    })
    .join(' ');

  return {
    problemId: input.problem.id,
    title: input.problem.title,
    constraintsSummary: input.problem.constraintsSummary,
    officialTaskId: input.problem.officialTaskId,
    officialUrl: input.problem.officialUrl,
    sourceRevisionIds: input.problem.sourceRevisionIds,
    statementText: extractStatementText(problemPage.body, input.problem.id),
    samples: extractSamples(problemPage.body, input.problem.id),
    editorialText,
  };
};

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--metadata-dir',
    '--cache-scope-dir',
    '--output-dir',
    '--repository-root',
  ]);
  const repositoryRoot = await realpath(
    path.resolve(values.get('--repository-root') ?? path.resolve(import.meta.dirname, '../..')),
  );
  const metadataDirectory = path.resolve(requiredArgument(values, '--metadata-dir'));
  const outputDirectory = await resolveNewOutsideDirectory(
    repositoryRoot,
    requiredArgument(values, '--output-dir'),
  );
  await assertPathDoesNotExist(outputDirectory);
  const cache = await resolvePrivateCacheDirectory(
    repositoryRoot,
    requiredArgument(values, '--cache-scope-dir'),
  );

  const artifacts = await Promise.all(
    corpusBatches.map(async (batch) => {
      const value = await readJson(path.join(metadataDirectory, `${batch.id}.json`));
      verifyCorpusMetadataBatch(value, batch);
      return value as CorpusMetadataBatch;
    }),
  );
  const checkedAtValues = new Set(artifacts.map(({ checkedAt }) => checkedAt));
  const policyDigestValues = new Set(artifacts.map(({ policy }) => policy.digest));
  if (checkedAtValues.size !== 1 || policyDigestValues.size !== 1) {
    throw new CorpusCliError(
      'REVIEW_PACKET_METADATA_SCOPE_MISMATCH',
      'All batches must share one checkedAt and verified policy bundle.',
    );
  }
  const firstArtifact = artifacts[0];
  if (!firstArtifact) {
    throw new CorpusCliError('REVIEW_PACKET_METADATA_EMPTY', 'No metadata batches were loaded.');
  }
  const policyApproval: PolicyApprovalManifest = {
    schemaVersion: '1.0.0',
    documents: firstArtifact.policy.documents.map(({ id, kind, url, approvedFingerprint }) => ({
      id,
      kind,
      url,
      approvedFingerprint,
    })),
  };
  const pages = await loadPrivatePages(
    cache,
    acquisitionCacheScope(firstArtifact.checkedAt, policyApproval),
  );

  const contests = artifacts.flatMap(({ contests }) => contests);
  const problems = artifacts.flatMap(({ problems }) => problems);
  const sources = artifacts.flatMap(({ sourceRevisions }) => sourceRevisions);
  const contestById = new Map(contests.map((contest) => [contest.id, contest]));
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  if (
    contestById.size !== contests.length ||
    sourcesById.size !== sources.length ||
    new Set(problems.map(({ id }) => id)).size !== problems.length
  ) {
    throw new CorpusCliError('REVIEW_PACKET_METADATA_ID_COLLISION', 'IDs must be unique.');
  }

  const packets = [...problems]
    .sort((left, right) => compareText(left.id, right.id))
    .map((problem) => {
      const contest = contestById.get(problem.contestId);
      if (!contest) throw new CorpusCliError('REVIEW_PACKET_CONTEST_MISSING', problem.contestId);
      return {
        problemId: problem.id,
        packet: buildPacket({
          problem,
          contest,
          sourcesById,
          pages,
          termsCheckedAt: artifacts[0]?.policy.checkedAt ?? '',
        }),
      };
    });

  const temporaryDirectory = path.join(
    path.dirname(outputDirectory),
    `.${path.basename(outputDirectory)}.${String(process.pid)}.${randomUUID()}.tmp`,
  );
  let temporaryDirectoryCreated = false;
  let committed = false;
  try {
    await mkdir(temporaryDirectory, { recursive: false, mode: 0o700 });
    temporaryDirectoryCreated = true;
    for (const { problemId, packet } of packets) {
      await writeFile(path.join(temporaryDirectory, `${problemId}.json`), canonicalJson(packet), {
        encoding: 'utf8',
        flag: 'wx',
      });
    }
    await assertPathDoesNotExist(outputDirectory);
    await rename(temporaryDirectory, outputDirectory);
    committed = true;
  } finally {
    if (temporaryDirectoryCreated && !committed) {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  }

  console.log(
    JSON.stringify({
      command: 'export-inventory-review-packets',
      status: 'passed',
      problemCount: problems.length,
      sourceRevisionCount: sources.length,
      cachePageCount: pages.size,
      outputDirectory,
    }),
  );
} catch (error) {
  reportReviewPacketFailure(error);
}
