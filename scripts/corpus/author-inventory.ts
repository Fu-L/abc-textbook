import { lstat, readdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import { load } from 'cheerio';
import { z } from 'zod';

import { corpusBatches, getCorpusBatch, type CorpusBatch } from '../../src/lib/corpus/batches.js';
import { authorProblemAnalysisRecord } from '../../src/lib/corpus/technique-authoring.js';
import {
  FrozenPreviewCohortSchema,
  techniqueInventoryShardId,
} from '../../src/lib/corpus/technique-inventory.js';
import type {
  CorpusMetadataBatch,
  CorpusProblemMetadata,
  CorpusSourceRevision,
  OfficialContestMetadata,
} from '../../src/lib/corpus/types.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  parseOfficialEditorialItemRevision,
  parseOfficialProblemMetadata,
} from '../../src/lib/corpus/metadata.js';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  CorpusCliError,
  ensureNoSymlinkParents,
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';

const USAGE =
  'Usage: author-inventory --mode analyze|write --batch all|abc212-abc263 --metadata-dir PATH --cache-scope-dir ABSOLUTE_PATH --preview-manifest PATH --report-output PATH [--repository-root PATH]';

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

interface AuthoredRecord {
  readonly problem: CorpusProblemMetadata;
  readonly item: ReturnType<typeof authorProblemAnalysisRecord>['item'];
  readonly signalIds: readonly string[];
  readonly structureId: string;
  readonly complexityEssential: boolean;
  readonly problemComplexityRecorded: boolean;
  readonly classificationMode: 'source_bound_draft' | 'heuristic_draft';
}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const inspectPath = async (filePath: string): Promise<Awaited<ReturnType<typeof lstat>> | null> => {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  }
};

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const assertOutsideRepository = async (
  repositoryRoot: string,
  requestedPath: string,
): Promise<string> => {
  if (!path.isAbsolute(requestedPath)) {
    throw new CorpusCliError('AUTHORING_CACHE_PATH_NOT_ABSOLUTE', requestedPath);
  }
  const resolved = await realpath(requestedPath);
  const relative = path.relative(repositoryRoot, resolved);
  const reverse = path.relative(resolved, repositoryRoot);
  if (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..') ||
    reverse === '' ||
    (!reverse.startsWith(`..${path.sep}`) && reverse !== '..')
  ) {
    throw new CorpusCliError('AUTHORING_CACHE_OVERLAPS_REPOSITORY', resolved);
  }
  return resolved;
};

const loadPrivatePages = async (
  repositoryRoot: string,
  requestedCacheScopeDirectory: string,
): Promise<ReadonlyMap<string, CachedPage>> => {
  const directory = await assertOutsideRepository(repositoryRoot, requestedCacheScopeDirectory);
  const cacheScope = path.basename(directory);
  if (!SHA_256.test(cacheScope)) {
    throw new CorpusCliError('AUTHORING_CACHE_SCOPE_INVALID', cacheScope);
  }
  const metadata = await lstat(directory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new CorpusCliError('AUTHORING_CACHE_DIRECTORY_UNSAFE', directory);
  }
  const pages = new Map<string, CachedPage>();
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => compareText(left.name, right.name))) {
    if (!entry.isFile() || entry.isSymbolicLink() || !/^[a-f0-9]{64}\.json$/u.test(entry.name)) {
      throw new CorpusCliError('AUTHORING_CACHE_ENTRY_UNSAFE', entry.name);
    }
    const filePath = path.join(directory, entry.name);
    const fileMetadata = await lstat(filePath);
    if (!fileMetadata.isFile() || fileMetadata.isSymbolicLink()) {
      throw new CorpusCliError('AUTHORING_CACHE_ENTRY_UNSAFE', entry.name);
    }
    const page = cachedPageSchema.parse(JSON.parse(await readFile(filePath, 'utf8')) as unknown);
    const url = new URL(page.url);
    if (
      page.cacheScope !== cacheScope ||
      url.protocol !== 'https:' ||
      url.hostname !== 'atcoder.jp' ||
      !page.contentType.toLocaleLowerCase('en-US').includes('text/html')
    ) {
      throw new CorpusCliError('AUTHORING_CACHE_ENTRY_SCOPE_INVALID', page.url);
    }
    if (pages.has(page.url)) {
      throw new CorpusCliError('AUTHORING_CACHE_URL_DUPLICATE', page.url);
    }
    pages.set(page.url, page);
  }
  return pages;
};

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const extractStatementText = (html: string, problemId: string): string => {
  const $ = load(html);
  const roots = $('#task-statement span.lang-en');
  if (roots.length !== 1) {
    throw new CorpusCliError(
      'AUTHORING_STATEMENT_PARSER_DRIFT',
      `${problemId}: ${String(roots.length)} English roots`,
    );
  }
  const root = roots.first().clone();
  root.find('script, style, pre, code').remove();
  root.find('section').each((_index, section) => {
    const heading = normalizeText($(section).find('h3').first().text());
    if (/^(?:sample input|sample output)/iu.test(heading)) $(section).remove();
  });
  const text = normalizeText(root.text());
  if (text.length < 20) {
    throw new CorpusCliError('AUTHORING_STATEMENT_TEXT_MISSING', problemId);
  }
  return text;
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
      'AUTHORING_EDITORIAL_PARSER_DRIFT',
      `${contestId}:${officialTaskId}: ${String(headings.length)} task headings`,
    );
  }
  const container = $('<abc-textbook-editorial></abc-textbook-editorial>');
  for (const element of headings.first().nextAll().toArray()) container.append($(element).clone());
  container.find('script, style, form, nav, footer, pre, code, noscript').remove();
  const text = normalizeText(container.text());
  if (text.length < 20) {
    throw new CorpusCliError('AUTHORING_EDITORIAL_TEXT_MISSING', `${contestId}:${officialTaskId}`);
  }
  return text;
};

const requestedEnglishUrl = (canonicalUrl: string): string => `${canonicalUrl}?lang=en`;

const getPage = (
  pages: ReadonlyMap<string, CachedPage>,
  requestedUrl: string,
  problemId: string,
): CachedPage => {
  const page = pages.get(requestedUrl);
  if (!page) {
    throw new CorpusCliError('AUTHORING_SOURCE_PAGE_MISSING', `${problemId}: ${requestedUrl}`);
  }
  return page;
};

const authorRecord = (input: {
  readonly problem: CorpusProblemMetadata;
  readonly contest: OfficialContestMetadata;
  readonly sourcesById: ReadonlyMap<string, CorpusSourceRevision>;
  readonly pages: ReadonlyMap<string, CachedPage>;
  readonly termsCheckedAt: string;
}): AuthoredRecord => {
  const task = input.contest.tasks.find(
    ({ officialTaskId }) => officialTaskId === input.problem.officialTaskId,
  );
  if (!task) {
    throw new CorpusCliError('AUTHORING_TASK_METADATA_MISSING', input.problem.id);
  }
  const problemSource = input.problem.sourceRevisionIds
    .map((sourceId) => input.sourcesById.get(sourceId))
    .find((source): source is CorpusSourceRevision => source?.sourceKind === 'official_problem');
  if (!problemSource) {
    throw new CorpusCliError('AUTHORING_PROBLEM_SOURCE_MISSING', input.problem.id);
  }
  const problemPage = getPage(
    input.pages,
    requestedEnglishUrl(problemSource.url),
    input.problem.id,
  );
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
    throw new CorpusCliError('AUTHORING_PROBLEM_SOURCE_CHANGED', input.problem.id);
  }

  const editorialSources = input.problem.sourceRevisionIds
    .map((sourceId) => input.sourcesById.get(sourceId))
    .filter(
      (source): source is CorpusSourceRevision => source?.sourceKind === 'official_editorial',
    );
  if (editorialSources.length === 0) {
    throw new CorpusCliError('AUTHORING_EDITORIAL_SOURCE_MISSING', input.problem.id);
  }
  const editorialTexts = editorialSources.map((editorialSource) => {
    const editorialPage = getPage(
      input.pages,
      requestedEnglishUrl(editorialSource.url),
      input.problem.id,
    );
    const reparsedEditorial = parseOfficialEditorialItemRevision({
      contestId: input.problem.contestId,
      officialTaskId: input.problem.officialTaskId,
      url: editorialSource.url,
      html: editorialPage.body,
      checkedAt: input.problem.checkedAt,
      termsCheckedAt: input.termsCheckedAt,
    });
    if (reparsedEditorial.id !== editorialSource.id) {
      throw new CorpusCliError('AUTHORING_EDITORIAL_SOURCE_CHANGED', input.problem.id);
    }
    return extractEditorialText(
      editorialPage.body,
      input.problem.contestId,
      input.problem.officialTaskId,
    );
  });

  const analysis = authorProblemAnalysisRecord({
    problem: input.problem,
    statementText: extractStatementText(problemPage.body, input.problem.id),
    editorialText: editorialTexts.join(' '),
  });
  if (analysis.complexityEssential && !analysis.problemComplexityRecorded) {
    throw new CorpusCliError(
      'AUTHORING_REVIEWED_COMPLEXITY_EVIDENCE_MISSING',
      `${input.problem.id}: reviewed Problem-level complexity no longer matches the bound in its official editorial revision`,
    );
  }
  return { problem: input.problem, ...analysis };
};

const increment = (counts: Map<string, number>, key: string): void => {
  counts.set(key, (counts.get(key) ?? 0) + 1);
};

const sortedCounts = (counts: ReadonlyMap<string, number>): Readonly<Record<string, number>> =>
  Object.fromEntries([...counts].sort(([left], [right]) => compareText(left, right)));

const buildReport = (
  records: readonly AuthoredRecord[],
  sourceRevisionCount: number,
): Readonly<Record<string, unknown>> => {
  const signalCounts = new Map<string, number>();
  const structureCounts = new Map<string, number>();
  for (const record of records) {
    increment(structureCounts, record.structureId);
    for (const signalId of record.signalIds) increment(signalCounts, signalId);
  }
  const unclassifiedProblemIds = records
    .filter(({ signalIds }) => signalIds.length === 0)
    .map(({ problem }) => problem.id)
    .sort(compareText);
  const complexityOmittedProblemIds = records
    .filter(({ problemComplexityRecorded }) => !problemComplexityRecorded)
    .map(({ problem }) => problem.id)
    .sort(compareText);
  const subject = {
    schemaVersion: '1.0.0',
    evidenceId: 'bootstrap-technique-inventory-authoring',
    status: 'passed',
    problemCount: records.length,
    sourceRevisionCount,
    sourceBoundProblemCount: records.length,
    complexityEssentialProblemCount: records.filter(
      ({ complexityEssential }) => complexityEssential,
    ).length,
    problemComplexityCount: records.length - complexityOmittedProblemIds.length,
    unclassifiedProblemIds,
    complexityOmittedProblemIds,
    classificationModeCounts: sortedCounts(
      records.reduce((counts, { classificationMode }) => {
        increment(counts, classificationMode);
        return counts;
      }, new Map<string, number>()),
    ),
    reviewStatusCounts: sortedCounts(
      records.reduce((counts, { item }) => {
        increment(counts, item.reviewStatus);
        return counts;
      }, new Map<string, number>()),
    ),
    assignments: records.map(
      ({
        problem,
        signalIds,
        structureId,
        complexityEssential,
        problemComplexityRecorded,
        classificationMode,
      }) => ({
        problemId: problem.id,
        signalIds,
        structureId,
        classificationMode,
        complexityEssential,
        problemComplexityRecorded,
      }),
    ),
    signalCounts: sortedCounts(signalCounts),
    structureCounts: sortedCounts(structureCounts),
    inventoryDigest: canonicalDigest({ items: records.map(({ item }) => item) }),
  } as const;
  return { ...subject, evidenceDigest: canonicalDigest(subject) };
};

const writeOrVerify = async (
  repositoryRoot: string,
  relativePath: string,
  value: unknown,
): Promise<'written' | 'verified'> => {
  const destination = path.resolve(repositoryRoot, relativePath);
  const relative = path.relative(repositoryRoot, destination);
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new CorpusCliError('AUTHORING_OUTPUT_PATH_ESCAPE', relativePath);
  }
  await ensureNoSymlinkParents(repositoryRoot, relative);
  const metadata = await inspectPath(destination);
  if (metadata) {
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      throw new CorpusCliError('AUTHORING_OUTPUT_PATH_UNSAFE', relativePath);
    }
    if (canonicalJson(await readJson(destination)) !== canonicalJson(value)) {
      throw new CorpusCliError('AUTHORING_OUTPUT_CONFLICT', relativePath);
    }
    return 'verified';
  }
  await writeJsonNoOverwrite(destination, value);
  return 'written';
};

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--mode',
    '--batch',
    '--metadata-dir',
    '--cache-scope-dir',
    '--preview-manifest',
    '--report-output',
    '--repository-root',
  ]);
  const mode = requiredArgument(values, '--mode');
  if (mode !== 'analyze' && mode !== 'write') {
    throw new CorpusCliError('AUTHORING_MODE_INVALID', mode);
  }
  const requestedBatch = requiredArgument(values, '--batch');
  const batches: readonly CorpusBatch[] =
    requestedBatch === 'all' ? corpusBatches : [getCorpusBatch(requestedBatch)];
  if (mode === 'write' && requestedBatch !== 'all') {
    throw new CorpusCliError(
      'AUTHORING_PARTIAL_WRITE_FORBIDDEN',
      'Canonical inventory materialization requires all five verified batches.',
    );
  }
  const repositoryRoot = await realpath(
    path.resolve(values.get('--repository-root') ?? path.resolve(import.meta.dirname, '../..')),
  );
  const metadataDirectory = path.resolve(requiredArgument(values, '--metadata-dir'));
  const pages = await loadPrivatePages(
    repositoryRoot,
    requiredArgument(values, '--cache-scope-dir'),
  );
  const artifacts: CorpusMetadataBatch[] = [];
  for (const batch of batches) {
    const value = await readJson(path.join(metadataDirectory, `${batch.id}.json`));
    verifyCorpusMetadataBatch(value, batch);
    artifacts.push(value as CorpusMetadataBatch);
  }
  const checkedAtValues = new Set(artifacts.map(({ checkedAt }) => checkedAt));
  const policyDigestValues = new Set(artifacts.map(({ policy }) => policy.digest));
  if (checkedAtValues.size !== 1 || policyDigestValues.size !== 1) {
    throw new CorpusCliError(
      'AUTHORING_METADATA_RUN_SCOPE_MISMATCH',
      'All batches must share one checkedAt and verified policy bundle.',
    );
  }
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
    throw new CorpusCliError('AUTHORING_METADATA_ID_COLLISION', 'Canonical IDs must be unique.');
  }
  const records = problems
    .sort((left, right) => compareText(left.id, right.id))
    .map((problem) => {
      const contest = contestById.get(problem.contestId);
      if (!contest) throw new CorpusCliError('AUTHORING_CONTEST_MISSING', problem.contestId);
      return authorRecord({
        problem,
        contest,
        sourcesById,
        pages,
        termsCheckedAt: artifacts[0]?.policy.checkedAt ?? '',
      });
    });
  const report = buildReport(records, sources.length);
  const unclassifiedCount = (report.unclassifiedProblemIds as readonly string[]).length;
  const problemComplexityCount = report.problemComplexityCount as number;
  let written = 0;
  let verified = 0;
  if (mode === 'write') {
    const previewManifest = FrozenPreviewCohortSchema.parse(
      await readJson(requiredArgument(values, '--preview-manifest')),
    );
    const selectedProblemIds = new Set(previewManifest.selectedProblemIds);
    for (const record of records) {
      const shardId = techniqueInventoryShardId(record.problem.id);
      const result = await writeOrVerify(
        repositoryRoot,
        `src/content/technique-inventory/${shardId}/${record.problem.id}.json`,
        record.item,
      );
      if (result === 'written') written += 1;
      else verified += 1;
      if (selectedProblemIds.has(record.problem.id)) {
        const previewResult = await writeOrVerify(
          repositoryRoot,
          `staging/previews/initial-v1/technique-inventory/${record.problem.id}.json`,
          record.item,
        );
        if (previewResult === 'written') written += 1;
        else verified += 1;
      }
    }
    if (
      records.filter(({ problem }) => selectedProblemIds.has(problem.id)).length !==
      selectedProblemIds.size
    ) {
      throw new CorpusCliError(
        'AUTHORING_PREVIEW_SELECTION_NOT_IN_CORPUS',
        previewManifest.previewId,
      );
    }
    const reportOutput = path.resolve(repositoryRoot, requiredArgument(values, '--report-output'));
    const relativeReportOutput = path.relative(repositoryRoot, reportOutput);
    const reportResult = await writeOrVerify(repositoryRoot, relativeReportOutput, report);
    if (reportResult === 'written') written += 1;
    else verified += 1;
  }

  console.log(
    JSON.stringify({
      command: 'author-inventory',
      mode,
      status: 'passed',
      problemCount: records.length,
      sourceRevisionCount: sources.length,
      complexityEssentialProblemCount: report.complexityEssentialProblemCount,
      problemComplexityCount,
      unclassifiedProblemCount: unclassifiedCount,
      cachePageCount: pages.size,
      inventoryDigest: report.inventoryDigest,
      evidenceDigest: report.evidenceDigest,
      written,
      verified,
      ...(mode === 'analyze'
        ? {
            unclassifiedProblemIds: report.unclassifiedProblemIds,
            complexityOmittedProblemIds: report.complexityOmittedProblemIds,
            signalCounts: report.signalCounts,
            structureCounts: report.structureCounts,
          }
        : {}),
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
