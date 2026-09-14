import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { isOffsetDateTime } from '../domain/date-time.js';
import { ProblemIdSchema } from '../domain/schema-parts/content-common.js';

export const ATCODER_PROBLEMS_METRICS_PATH = 'src/content/problem-metrics/atcoder-problems.json';
export const ATCODER_PROBLEMS_SOURCES = Object.freeze({
  problemModels: 'https://kenkoooo.com/atcoder/resources/problem-models.json',
  mergedProblems: 'https://kenkoooo.com/atcoder/resources/merged-problems.json',
} as const);

const CanonicalProblemIdentitySchema = z.object({
  id: ProblemIdSchema,
  officialTaskId: z.string().min(1),
});

export const AtCoderProblemsMetricEntrySchema = z
  .object({
    officialTaskId: z.string().min(1),
    difficulty: z.number().nullable(),
    difficultyExperimental: z.boolean().nullable(),
    point: z.number().nonnegative().nullable(),
  })
  .strict();

const CheckedAtSchema = z.string().refine(isOffsetDateTime, {
  message: 'checkedAt must be an RFC 3339 date-time with an explicit offset.',
});

export const AtCoderProblemsSnapshotSchema = z
  .object({
    schemaVersion: z.literal('1.0.0'),
    provider: z.literal('atcoder-problems'),
    checkedAt: CheckedAtSchema,
    sources: z
      .object({
        problemModels: z.literal(ATCODER_PROBLEMS_SOURCES.problemModels),
        mergedProblems: z.literal(ATCODER_PROBLEMS_SOURCES.mergedProblems),
      })
      .strict(),
    problems: z.record(ProblemIdSchema, AtCoderProblemsMetricEntrySchema),
  })
  .strict();

export type CanonicalProblemIdentity = z.infer<typeof CanonicalProblemIdentitySchema>;
export type AtCoderProblemsMetricEntry = z.infer<typeof AtCoderProblemsMetricEntrySchema>;
export type AtCoderProblemsSnapshot = z.infer<typeof AtCoderProblemsSnapshotSchema>;
export type AtCoderProblemsJsonFetcher = (url: string) => Promise<unknown>;

export class AtCoderProblemsMetricsError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'AtCoderProblemsMetricsError';
  }
}

const fail = (code: string, message: string): never => {
  throw new AtCoderProblemsMetricsError(code, message);
};

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sorted = (values: readonly string[]): string[] => [...values].sort(compareCodeUnits);

const parseCanonicalProblemIdentities = (
  value: readonly CanonicalProblemIdentity[],
): readonly CanonicalProblemIdentity[] => {
  const problemIds = new Set<string>();
  const officialTaskIds = new Set<string>();
  const identities: CanonicalProblemIdentity[] = [];

  for (const [index, candidate] of value.entries()) {
    const parsed = CanonicalProblemIdentitySchema.safeParse(candidate);
    if (!parsed.success) {
      fail('CANONICAL_PROBLEM_INVALID', `index ${String(index)}: ${parsed.error.message}`);
    }
    const identity = parsed.success
      ? parsed.data
      : fail('CANONICAL_PROBLEM_INVALID', String(index));
    if (problemIds.has(identity.id)) {
      fail('DUPLICATE_CANONICAL_PROBLEM_ID', identity.id);
    }
    if (officialTaskIds.has(identity.officialTaskId)) {
      fail('DUPLICATE_CANONICAL_OFFICIAL_TASK_ID', identity.officialTaskId);
    }
    problemIds.add(identity.id);
    officialTaskIds.add(identity.officialTaskId);
    identities.push(identity);
  }

  return identities.sort((left, right) => compareCodeUnits(left.id, right.id));
};

const parseCanonicalProblemJson = (value: unknown, filePath: string): CanonicalProblemIdentity => {
  const parsed = CanonicalProblemIdentitySchema.safeParse(value);
  if (!parsed.success) {
    fail('CANONICAL_PROBLEM_INVALID', `${filePath}: ${parsed.error.message}`);
  }
  return parsed.success ? parsed.data : fail('CANONICAL_PROBLEM_INVALID', filePath);
};

const collectJsonFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => compareCodeUnits(left.name, right.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectJsonFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryPath);
    }
  }
  return files;
};

export const loadCanonicalProblemIdentities = async (
  repositoryRoot = process.cwd(),
): Promise<readonly CanonicalProblemIdentity[]> => {
  const problemsRoot = path.resolve(repositoryRoot, 'src/content/problems');
  const files = await collectJsonFiles(problemsRoot);
  const identities: CanonicalProblemIdentity[] = [];
  for (const filePath of files) {
    let value: unknown;
    try {
      value = JSON.parse(await readFile(filePath, 'utf8')) as unknown;
    } catch (error) {
      fail(
        'CANONICAL_PROBLEM_READ_FAILED',
        `${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    identities.push(parseCanonicalProblemJson(value, filePath));
  }
  return parseCanonicalProblemIdentities(identities);
};

const parseProblemModels = (value: unknown): Readonly<Record<string, unknown>> => {
  return isRecord(value)
    ? value
    : fail('PROBLEM_MODELS_INVALID', 'problem-models.json must contain an object.');
};

const parseMergedProblems = (
  value: unknown,
): ReadonlyMap<string, Readonly<Record<string, unknown>>> => {
  const records = Array.isArray(value)
    ? value
    : fail('MERGED_PROBLEMS_INVALID', 'merged-problems.json must contain an array.');
  const byTaskId = new Map<string, Readonly<Record<string, unknown>>>();
  for (const [index, candidate] of records.entries()) {
    const record = isRecord(candidate)
      ? candidate
      : fail('MERGED_PROBLEM_INVALID', `index ${String(index)} has no string id.`);
    const id =
      typeof record.id === 'string' && record.id.length > 0
        ? record.id
        : fail('MERGED_PROBLEM_INVALID', `index ${String(index)} has no string id.`);
    if (byTaskId.has(id)) {
      fail('DUPLICATE_UPSTREAM_PROBLEM_ID', id);
    }
    byTaskId.set(id, record);
  }
  return byTaskId;
};

const optionalFiniteNumber = (
  value: unknown,
  field: string,
  officialTaskId: string,
): number | null => {
  if (value === undefined || value === null) return null;
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fail(
        'UPSTREAM_METRIC_INVALID',
        `${officialTaskId}.${field} must be a finite number or null.`,
      );
};

const optionalBoolean = (value: unknown, field: string, officialTaskId: string): boolean | null => {
  if (value === undefined || value === null) return null;
  return typeof value === 'boolean'
    ? value
    : fail('UPSTREAM_METRIC_INVALID', `${officialTaskId}.${field} must be a boolean or null.`);
};

const metricForProblem = (
  officialTaskId: string,
  problemModels: Readonly<Record<string, unknown>>,
  mergedProblems: ReadonlyMap<string, Readonly<Record<string, unknown>>>,
): AtCoderProblemsMetricEntry => {
  const modelValue = problemModels[officialTaskId];
  const model =
    modelValue === undefined
      ? null
      : isRecord(modelValue)
        ? modelValue
        : fail('UPSTREAM_MODEL_INVALID', `${officialTaskId} must map to an object.`);
  const merged = mergedProblems.get(officialTaskId);
  const point = optionalFiniteNumber(merged?.point, 'point', officialTaskId);
  if (point !== null && point < 0) {
    fail('UPSTREAM_METRIC_INVALID', `${officialTaskId}.point must be non-negative.`);
  }
  return {
    officialTaskId,
    difficulty: optionalFiniteNumber(model?.difficulty, 'difficulty', officialTaskId),
    difficultyExperimental: optionalBoolean(
      model?.is_experimental,
      'is_experimental',
      officialTaskId,
    ),
    point,
  };
};

export const validateAtCoderProblemsSnapshot = (
  value: unknown,
  canonicalProblems: readonly CanonicalProblemIdentity[],
): AtCoderProblemsSnapshot => {
  const parsed = AtCoderProblemsSnapshotSchema.safeParse(value);
  if (!parsed.success) {
    fail('SNAPSHOT_SCHEMA_INVALID', parsed.error.message);
  }
  const snapshot = parsed.success
    ? parsed.data
    : fail('SNAPSHOT_SCHEMA_INVALID', 'Snapshot could not be parsed.');
  const canonical = parseCanonicalProblemIdentities(canonicalProblems);
  const expectedIds = canonical.map(({ id }) => id);
  const actualIds = sorted(Object.keys(snapshot.problems));
  const expected = new Set(expectedIds);
  const actual = new Set(actualIds);
  const unknownIds = actualIds.filter((id) => !expected.has(id));
  const missingIds = expectedIds.filter((id) => !actual.has(id));
  if (unknownIds.length > 0) {
    fail('UNKNOWN_PROBLEM_ID', unknownIds.join(', '));
  }
  if (missingIds.length > 0 || actualIds.length !== expectedIds.length) {
    fail(
      'PROBLEM_SET_MISMATCH',
      `missing=${missingIds.join(', ') || 'none'} actual=${String(actualIds.length)} expected=${String(expectedIds.length)}`,
    );
  }

  const canonicalById = new Map(canonical.map((problem) => [problem.id, problem]));
  for (const problemId of expectedIds) {
    const entry = snapshot.problems[problemId];
    const problem = canonicalById.get(problemId);
    if (!entry) return fail('PROBLEM_SET_MISMATCH', problemId);
    if (!problem) return fail('PROBLEM_SET_MISMATCH', problemId);
    if (entry.officialTaskId !== problem.officialTaskId) {
      fail(
        'OFFICIAL_TASK_ID_MISMATCH',
        `${problemId}: snapshot=${entry.officialTaskId} canonical=${problem.officialTaskId}`,
      );
    }
  }
  return snapshot;
};

export const buildAtCoderProblemsSnapshot = (input: {
  readonly checkedAt: string;
  readonly canonicalProblems: readonly CanonicalProblemIdentity[];
  readonly problemModels: unknown;
  readonly mergedProblems: unknown;
}): AtCoderProblemsSnapshot => {
  if (!isOffsetDateTime(input.checkedAt)) {
    fail('CHECKED_AT_INVALID', input.checkedAt);
  }
  const canonicalProblems = parseCanonicalProblemIdentities(input.canonicalProblems);
  const problemModels = parseProblemModels(input.problemModels);
  const mergedProblems = parseMergedProblems(input.mergedProblems);
  const problems = Object.fromEntries(
    canonicalProblems.map(({ id, officialTaskId }) => [
      id,
      metricForProblem(officialTaskId, problemModels, mergedProblems),
    ]),
  );
  return validateAtCoderProblemsSnapshot(
    {
      schemaVersion: '1.0.0',
      provider: 'atcoder-problems',
      checkedAt: input.checkedAt,
      sources: { ...ATCODER_PROBLEMS_SOURCES },
      problems,
    },
    canonicalProblems,
  );
};

export const acquireAtCoderProblemsSnapshot = async (input: {
  readonly checkedAt: string;
  readonly canonicalProblems: readonly CanonicalProblemIdentity[];
  readonly fetchJson: AtCoderProblemsJsonFetcher;
}): Promise<AtCoderProblemsSnapshot> => {
  const problemModels = await input.fetchJson(ATCODER_PROBLEMS_SOURCES.problemModels);
  const mergedProblems = await input.fetchJson(ATCODER_PROBLEMS_SOURCES.mergedProblems);
  return buildAtCoderProblemsSnapshot({
    checkedAt: input.checkedAt,
    canonicalProblems: input.canonicalProblems,
    problemModels,
    mergedProblems,
  });
};
