import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { load } from 'cheerio';
import type { z } from 'zod';

import {
  LearningOutcomeSchema,
  LearningUnitSchema,
  ProblemSchema,
  TechniqueTagSchema,
  CanonicalLearningPrerequisitesSchema,
  CanonicalProblemPlacementPolicySchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';

const execute = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

/** Archive a real commit, without switching the working tree or writing a frozen inventory. */
export async function withGitBaseline<T>(
  inspect: (root: string, commit: string) => Promise<T>,
  ref = process.env.ABC_COMPAT_BASE_REF ?? 'HEAD',
): Promise<T> {
  const { stdout } = await execute('git', ['rev-parse', '--verify', `${ref}^{commit}`], {
    cwd: repositoryRoot,
  });
  const commit = stdout.trim();
  const temporary = await mkdtemp(path.join(tmpdir(), 'abc-compat-source-'));
  try {
    const archive = path.join(temporary, 'source.tar');
    await execute(
      'git',
      [
        'archive',
        '--format=tar',
        `--output=${archive}`,
        commit,
        'src/content',
        'src/lib/taxonomy/textbook-order.ts',
      ],
      { cwd: repositoryRoot },
    );
    await execute('tar', ['-xf', archive, '-C', temporary]);
    return await inspect(temporary, commit);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

type TextbookOrder = readonly { id: string; introduction: string; unitIds: readonly string[] }[];

export async function readTextbookOrder(root: string): Promise<TextbookOrder> {
  // Run the archived module itself; importing the working-tree constant would hide old-order drift.
  const { stdout } = await execute(process.execPath, [
    '--import',
    fileURLToPath(new URL('../../node_modules/tsx/dist/loader.mjs', import.meta.url)),
    '--input-type=module',
    '-e',
    'const m = await import(process.argv[1]); process.stdout.write(JSON.stringify(m.TEXTBOOK_CHAPTERS));',
    pathToFileURL(path.join(root, 'src/lib/taxonomy/textbook-order.ts')).href,
  ]);
  return JSON.parse(stdout) as TextbookOrder;
}

export async function readCanonicalSnapshot(root: string) {
  const json = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(root, file), 'utf8')) as unknown;
  const entities = async <T extends { id: string }>(directory: string, schema: z.ZodType<T>) => {
    const files = (await readdir(path.join(root, directory), { recursive: true }))
      .filter((file) => file.endsWith('.json') && !file.startsWith('authoring/'))
      .sort();
    const values = await Promise.all(
      files.map(async (file) => schema.parse(await json(`${directory}/${file}`))),
    );
    assert.equal(
      new Set(values.map(({ id }) => id)).size,
      values.length,
      `${directory}: duplicate IDs`,
    );
    return new Map(
      values.sort((a, b) => a.id.localeCompare(b.id, 'en')).map((value) => [value.id, value]),
    );
  };
  const [problems, tags, outcomes, units, policy, prerequisites, order] = await Promise.all([
    entities('src/content/problems', ProblemSchema),
    entities('src/content/tags', TechniqueTagSchema),
    entities('src/content/learning-outcomes', LearningOutcomeSchema),
    entities('src/content/learning-units', LearningUnitSchema),
    json('src/content/policies/problem-placements.json').then((value) =>
      CanonicalProblemPlacementPolicySchema.parse(value),
    ),
    json('src/content/policies/learning-prerequisites.json').then((value) =>
      CanonicalLearningPrerequisitesSchema.parse(value),
    ),
    readTextbookOrder(root),
  ]);
  const docsRoot = 'src/content/docs';
  const files = (await readdir(path.join(root, docsRoot), { recursive: true }))
    .filter((file) => /\.mdx?$/u.test(file))
    .sort();
  const documents = new Map(
    await Promise.all(
      files.map(async (file) => [file, await readFile(path.join(root, docsRoot, file))] as const),
    ),
  );
  const problemDocumentPaths = new Map<string, string>();
  for (const [file, bytes] of documents) {
    if (!file.startsWith('problems/')) continue;
    const { unit } = readProblemAuthoringDocument(bytes.toString('utf8'));
    assert(!problemDocumentPaths.has(unit.problemId), `Duplicate document: ${unit.problemId}`);
    assert.equal(`${docsRoot}/${file}`, unit.docPath, `Document path mismatch: ${unit.problemId}`);
    problemDocumentPaths.set(unit.problemId, unit.docPath);
  }
  for (const id of problems.keys()) assert(problemDocumentPaths.has(id), `Missing document: ${id}`);
  assert.equal(problemDocumentPaths.size, problems.size, 'Orphan Problem document');
  for (const entity of units.values()) {
    assert(
      documents.has(path.relative(docsRoot, entity.docPath)),
      `Missing document: ${entity.docPath}`,
    );
  }
  return {
    problems,
    tags,
    outcomes,
    units,
    placements: policy.placements,
    prerequisites,
    order,
    documents,
    problemDocumentPaths,
  };
}

export type CanonicalSnapshot = Awaited<ReturnType<typeof readCanonicalSnapshot>>;

export function assertCanonicalPreserved(
  before: CanonicalSnapshot,
  after: CanonicalSnapshot,
): void {
  for (const kind of ['problems', 'tags', 'outcomes', 'units', 'documents'] as const) {
    assert.deepEqual(
      [...after[kind].keys()],
      [...before[kind].keys()],
      `${kind}: ID/path set changed`,
    );
    for (const [id, value] of before[kind]) {
      assert.deepEqual(after[kind].get(id), value, `${kind}: changed ${id}`);
    }
  }
  assert.deepEqual(after.placements, before.placements, 'Problem placements changed');
  for (const kind of [
    'tagPrerequisites',
    'learningOutcomePrerequisites',
    'learningUnitPrerequisites',
  ] as const) {
    assert.deepEqual(
      after.prerequisites[kind],
      before.prerequisites[kind],
      `${kind}: direct prerequisites changed`,
    );
  }
  assert.deepEqual(after.order, before.order, 'Textbook reading order changed');
}

export function htmlAnchors(html: string): string[] {
  const $ = load(html);
  return [
    ...new Set(
      [
        ...$('[id]')
          .toArray()
          .map((element) => $(element).attr('id') ?? ''),
        ...$('a[name]')
          .toArray()
          .map((element) => $(element).attr('name') ?? ''),
      ].filter(Boolean),
    ),
  ].sort();
}

/** Stable document/data endpoints, excluding content-hashed JS/CSS/search implementation files. */
export async function readPublicSurface(
  distRoot: string,
  basePath: string,
): Promise<Map<string, string[]>> {
  const files = (await readdir(distRoot, { recursive: true }))
    .filter((file) => /\.(?:html|json|xml|txt|csv|webmanifest)$/u.test(file))
    .sort();
  assert(files.includes('index.html'), `Missing build: ${distRoot}/index.html`);
  const prefix = basePath === '/' ? '' : basePath.replace(/\/$/u, '');
  const surface = new Map<string, string[]>();
  for (const file of files) {
    const route = `${prefix}/${file.replace(/(?:^|\/)index\.html$/u, (match) => (match.startsWith('/') ? '/' : ''))}`;
    surface.set(
      route,
      file.endsWith('.html') ? htmlAnchors(await readFile(path.join(distRoot, file), 'utf8')) : [],
    );
  }
  return surface;
}

/** Inclusion permits later additions, but never simultaneous removal of a source and its target. */
export function assertPublicSurfacePreserved(
  before: Map<string, string[]>,
  after: Map<string, string[]>,
): void {
  for (const [route, anchors] of before) {
    assert(after.has(route), `Missing public URL: ${route}`);
    const current = new Set(after.get(route));
    for (const anchor of anchors)
      assert(current.has(anchor), `Missing public anchor: ${route}#${anchor}`);
  }
}
