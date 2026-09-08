import { randomUUID } from 'node:crypto';
import { lstat, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  FinalTaxonomyBuildSchema,
  LearningUnitSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  CANONICAL_LEARNING_ORDER_PATH,
  CANONICAL_PROBLEM_PLACEMENT_EVIDENCE_PATH,
  CANONICAL_PROBLEM_PLACEMENTS_PATH,
  CANONICAL_TAXONOMY_BUILD_PATH,
  CANONICAL_TAXONOMY_MATERIALIZATION_EVIDENCE_PATH,
  buildCanonicalTaxonomyMaterialization,
  validateCanonicalMaterialization,
  type CanonicalLearningUnitOutput,
} from '../../src/lib/taxonomy/canonical-taxonomy-materialization.js';
import {
  assertFinalTaxonomyBuildAgainstContext,
  defaultFinalTaxonomyBuildLayout,
  loadFinalTaxonomySourceContext,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';
import {
  NON_PRIMARY_OUTCOME_IDS,
  NON_PRIMARY_TAG_IDS,
  SINGLE_PROBLEM_OUTCOME_IDS,
  SINGLE_PROBLEM_TAG_IDS,
  SINGLE_PROBLEM_UNIT_IDS,
} from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import {
  CorpusCliError,
  ensureNoSymlinkParents,
  readJson,
  reportCliFailure,
} from './cli-support.js';
import {
  classifyCanonicalTaxonomyOutput,
  findUnexpectedCanonicalTaxonomyOutputs,
} from './canonical-taxonomy-managed-outputs.js';

const USAGE = 'Usage: materialize-canonical-taxonomy [--check | --write]';
type Mode = 'check' | 'write';

interface ExpectedOutput {
  readonly relativePath: string;
  readonly bytes: string;
  readonly handoffUnitId?: string;
}

type OutputInspection =
  | { readonly kind: 'missing' }
  | { readonly kind: 'verified' }
  | { readonly kind: 'preserved' }
  | { readonly kind: 'drift'; readonly bytes: string };

const parseMode = (args: readonly string[]): Mode => {
  if (args.length === 0) return 'check';
  if (args.length !== 1 || !['--check', '--write'].includes(args[0] ?? '')) {
    throw new CorpusCliError('ARGUMENTS_INVALID', USAGE);
  }
  return args[0] === '--write' ? 'write' : 'check';
};

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const serializeJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

const expectedJson = (
  relativePath: string,
  value: unknown,
  handoffUnitId?: string,
): ExpectedOutput => ({
  relativePath,
  bytes: serializeJson(value),
  ...(handoffUnitId === undefined ? {} : { handoffUnitId }),
});

const expectedText = (
  relativePath: string,
  value: string,
  handoffUnitId?: string,
): ExpectedOutput => ({
  relativePath,
  bytes: value,
  ...(handoffUnitId === undefined ? {} : { handoffUnitId }),
});

const absoluteOutputPath = (repositoryRoot: string, relativePath: string): string => {
  const absolutePath = path.resolve(repositoryRoot, relativePath);
  const relativeToRoot = path.relative(repositoryRoot, absolutePath);
  if (
    path.isAbsolute(relativePath) ||
    relativeToRoot === '..' ||
    relativeToRoot.startsWith(`..${path.sep}`)
  ) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_PATH_UNSAFE', relativePath);
  }
  return absolutePath;
};

const assertExistingParentsSafe = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<boolean> => {
  const repositoryMetadata = await lstat(repositoryRoot);
  if (repositoryMetadata.isSymbolicLink() || !repositoryMetadata.isDirectory()) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_PARENT_UNSAFE', repositoryRoot);
  }

  let current = repositoryRoot;
  for (const segment of path.dirname(relativePath).split(path.sep)) {
    if (segment === '.') continue;
    current = path.join(current, segment);
    const metadata = await lstat(current).catch((error: unknown) => {
      if (isNodeError(error) && error.code === 'ENOENT') return null;
      throw error;
    });
    if (metadata === null) return false;
    if (metadata.isSymbolicLink() || !metadata.isDirectory()) {
      throw new CorpusCliError('CANONICAL_MATERIALIZATION_PARENT_UNSAFE', current);
    }
  }
  return true;
};

const inspectOutput = async (
  repositoryRoot: string,
  output: ExpectedOutput,
  fullAuthoringUnitIds: ReadonlySet<string>,
): Promise<OutputInspection> => {
  const absolutePath = absoluteOutputPath(repositoryRoot, output.relativePath);
  if (!(await assertExistingParentsSafe(repositoryRoot, output.relativePath))) {
    return { kind: 'missing' };
  }
  const metadata = await lstat(absolutePath).catch((error: unknown) => {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  });
  if (metadata === null) return { kind: 'missing' };
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_OUTPUT_UNSAFE', output.relativePath);
  }
  const bytes = await readFile(absolutePath, 'utf8');
  const disposition = classifyCanonicalTaxonomyOutput({
    actualBytes: bytes,
    expectedBytes: output.bytes,
    ...(output.handoffUnitId === undefined ? {} : { handoffUnitId: output.handoffUnitId }),
    fullAuthoringUnitIds,
  });
  return disposition === 'drift' ? { kind: 'drift', bytes } : { kind: disposition };
};

const sameInspection = (left: OutputInspection, right: OutputInspection): boolean => {
  if (left.kind !== right.kind) return false;
  return left.kind !== 'drift' || (right.kind === 'drift' && left.bytes === right.bytes);
};

const loadFullAuthoringUnit = async (
  repositoryRoot: string,
  expected: CanonicalLearningUnitOutput,
): Promise<CanonicalLearningUnitOutput | null> => {
  const absoluteUnitPath = absoluteOutputPath(repositoryRoot, expected.relativePath);
  const metadata = await lstat(absoluteUnitPath).catch((error: unknown) => {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  });
  if (metadata === null) return null;
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_OUTPUT_UNSAFE', expected.relativePath);
  }
  let value: unknown;
  try {
    value = JSON.parse(await readFile(absoluteUnitPath, 'utf8')) as unknown;
  } catch (error) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_UNIT_UNREADABLE',
      `${expected.relativePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Reflect.get(value, 'contentPhase') !== 'full_authoring'
  ) {
    return null;
  }
  const parsed = LearningUnitSchema.safeParse(value);
  if (!parsed.success || parsed.data.id !== expected.value.id) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_AUTHORED_UNIT_INVALID',
      `${expected.relativePath}: ${parsed.success ? 'Unit ID mismatch.' : parsed.error.message}`,
    );
  }
  const absoluteDocumentPath = absoluteOutputPath(repositoryRoot, expected.documentPath);
  const documentMetadata = await lstat(absoluteDocumentPath).catch((error: unknown) => {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  });
  if (
    documentMetadata === null ||
    documentMetadata.isSymbolicLink() ||
    !documentMetadata.isFile()
  ) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_AUTHORED_DOCUMENT_INVALID',
      expected.documentPath,
    );
  }
  return {
    ...expected,
    value: parsed.data,
    document: await readFile(absoluteDocumentPath, 'utf8'),
  };
};

const replaceTextAtomically = async (absolutePath: string, bytes: string): Promise<void> => {
  const temporaryPath = path.join(
    path.dirname(absolutePath),
    `.${path.basename(absolutePath)}.${String(process.pid)}.${randomUUID()}.tmp`,
  );
  await writeFile(temporaryPath, bytes, { encoding: 'utf8', flag: 'wx' });
  try {
    await rename(temporaryPath, absolutePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
};

const summarizePaths = (outputs: readonly ExpectedOutput[]): string => {
  const visible = outputs.slice(0, 20).map(({ relativePath }) => relativePath);
  const omitted = outputs.length - visible.length;
  return omitted === 0 ? visible.join(', ') : `${visible.join(', ')}, ... (+${String(omitted)})`;
};

try {
  const mode = parseMode(process.argv.slice(2));
  const layout = defaultFinalTaxonomyBuildLayout();
  const [context, buildValue] = await Promise.all([
    loadFinalTaxonomySourceContext(layout),
    readJson(path.join(layout.repositoryRoot, CANONICAL_TAXONOMY_BUILD_PATH)),
  ]);
  const build = FinalTaxonomyBuildSchema.parse(buildValue);
  assertFinalTaxonomyBuildAgainstContext(context, build, {
    nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
    nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
    singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
    singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
    singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
  });
  const materializationInput = {
    build,
    records: context.records,
    problems: context.corpus.problems.map(({ entity }) => entity),
    sources: context.corpus.sources.map(({ entity }) => entity),
    placementDecisionTable: context.placementDecisionTable,
    singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
  } as const;
  const materialization = buildCanonicalTaxonomyMaterialization(materializationInput);

  const authoredLearningUnits = (
    await Promise.all(
      materialization.learningUnits.map(
        async (expected) => await loadFullAuthoringUnit(layout.repositoryRoot, expected),
      ),
    )
  ).filter((unit): unit is CanonicalLearningUnitOutput => unit !== null);
  const authoredLearningUnitById = new Map(
    authoredLearningUnits.map((unit) => [unit.value.id, unit]),
  );
  const currentLearningUnits = materialization.learningUnits.map(
    (unit) => authoredLearningUnitById.get(unit.value.id) ?? unit,
  );
  const handoffDiagnostics = validateCanonicalMaterialization(materializationInput, {
    ...materialization,
    learningUnits: currentLearningUnits,
  });
  if (handoffDiagnostics.length > 0) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_AUTHORED_CONTENT_INVALID',
      handoffDiagnostics.join(', '),
    );
  }
  const fullAuthoringUnitIds = new Set(authoredLearningUnitById.keys());

  const outputs = [
    ...materialization.tags.map(({ relativePath, value }) => expectedJson(relativePath, value)),
    ...materialization.learningOutcomes.map(({ relativePath, value }) =>
      expectedJson(relativePath, value),
    ),
    ...materialization.learningUnits.flatMap(({ relativePath, value, documentPath, document }) => [
      expectedJson(relativePath, value, value.id),
      expectedText(documentPath, document, value.id),
    ]),
    expectedJson(CANONICAL_LEARNING_ORDER_PATH, materialization.learningOrder),
    expectedJson(CANONICAL_PROBLEM_PLACEMENTS_PATH, materialization.problemPlacementPolicy),
    expectedJson(
      CANONICAL_PROBLEM_PLACEMENT_EVIDENCE_PATH,
      materialization.problemPlacementEvidence,
    ),
    expectedJson(
      CANONICAL_TAXONOMY_MATERIALIZATION_EVIDENCE_PATH,
      materialization.materializationEvidence,
    ),
  ].sort((left, right) => compareCodeUnits(left.relativePath, right.relativePath));

  const duplicatePath = outputs.find(
    (output, index) => index > 0 && output.relativePath === outputs[index - 1]?.relativePath,
  );
  if (duplicatePath !== undefined) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_OUTPUT_COLLISION',
      duplicatePath.relativePath,
    );
  }

  const unexpectedOutputs = await findUnexpectedCanonicalTaxonomyOutputs(
    layout.repositoryRoot,
    new Set(outputs.map(({ relativePath }) => relativePath)),
  );
  if (unexpectedOutputs.length > 0) {
    throw new CorpusCliError(
      'CANONICAL_MATERIALIZATION_UNEXPECTED_OUTPUT',
      unexpectedOutputs.length <= 20
        ? unexpectedOutputs.join(', ')
        : `${unexpectedOutputs.slice(0, 20).join(', ')}, ... (+${String(unexpectedOutputs.length - 20)})`,
    );
  }

  const inspections = await Promise.all(
    outputs.map(
      async (output) => await inspectOutput(layout.repositoryRoot, output, fullAuthoringUnitIds),
    ),
  );
  const pending = outputs.filter(
    (_output, index) => !['verified', 'preserved'].includes(inspections[index]?.kind ?? ''),
  );
  if (mode === 'check' && pending.length > 0) {
    throw new CorpusCliError('CANONICAL_MATERIALIZATION_STALE_OR_MISSING', summarizePaths(pending));
  }

  let written = 0;
  if (mode === 'write') {
    for (let index = 0; index < outputs.length; index += 1) {
      const output = outputs[index];
      const initialInspection = inspections[index];
      if (
        output === undefined ||
        initialInspection === undefined ||
        initialInspection.kind === 'verified' ||
        initialInspection.kind === 'preserved'
      ) {
        continue;
      }
      await ensureNoSymlinkParents(layout.repositoryRoot, output.relativePath);
      const currentInspection = await inspectOutput(
        layout.repositoryRoot,
        output,
        fullAuthoringUnitIds,
      );
      if (currentInspection.kind === 'verified' || currentInspection.kind === 'preserved') continue;
      if (!sameInspection(initialInspection, currentInspection)) {
        throw new CorpusCliError(
          'CANONICAL_MATERIALIZATION_OUTPUT_CHANGED_DURING_WRITE',
          output.relativePath,
        );
      }
      await replaceTextAtomically(
        absoluteOutputPath(layout.repositoryRoot, output.relativePath),
        output.bytes,
      );
      written += 1;
    }
  }

  console.log(
    JSON.stringify({
      command: 'materialize-canonical-taxonomy',
      mode,
      status: 'passed',
      sourceBuildId: build.id,
      sourceBuildDigest: build.buildDigest,
      expected: outputs.length,
      verified: inspections.filter(({ kind }) => kind === 'verified').length,
      preserved: inspections.filter(({ kind }) => kind === 'preserved').length,
      written,
      counts: {
        tags: materialization.tags.length,
        learningOutcomes: materialization.learningOutcomes.length,
        learningUnits: materialization.learningUnits.length,
        learningDocuments: materialization.learningUnits.length,
        placements: materialization.problemPlacementPolicy.placements.length,
      },
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
