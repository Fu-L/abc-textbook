import { lstat, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  FINAL_TAXONOMY_VERIFICATION_PATH,
  buildFinalTaxonomyFromPolicy,
  createFinalTaxonomyVerificationEvidence,
  defaultFinalTaxonomyBuildLayout,
  loadFinalTaxonomySourceContext,
} from '../../src/lib/taxonomy/final-taxonomy-build.js';
import {
  CorpusCliError,
  ensureNoSymlinkParents,
  readJson,
  replaceJsonAtomically,
  reportCliFailure,
  writeJsonNoOverwrite,
} from './cli-support.js';

const USAGE =
  'Usage: final-taxonomy (--check | --write [--archive-accepted docs/verification/history/NAME])';

type Mode = 'check' | 'write';
type OutputDisposition = 'missing' | 'verified' | 'replace_proposal' | 'replace_accepted';

interface CliOptions {
  readonly mode: Mode;
  readonly archiveRoot: string | null;
}

interface Output {
  readonly role: 'build' | 'integration' | 'verification';
  readonly relativePath: string;
  readonly value: unknown;
}

type ExistingJson =
  { readonly kind: 'missing' } | { readonly kind: 'present'; readonly value: unknown };

const parseOptions = (args: readonly string[]): CliOptions => {
  if (args.length === 1 && args[0] === '--check') return { mode: 'check', archiveRoot: null };
  if (args.length === 1 && args[0] === '--write') return { mode: 'write', archiveRoot: null };
  if (
    args.length !== 3 ||
    args[0] !== '--write' ||
    args[1] !== '--archive-accepted' ||
    !args[2]?.startsWith('docs/verification/history/') ||
    path.isAbsolute(args[2]) ||
    args[2].split('/').some((segment) => segment === '.' || segment === '..' || segment === '')
  ) {
    throw new CorpusCliError('ARGUMENTS_INVALID', USAGE);
  }
  return { mode: 'write', archiveRoot: args[2] };
};

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const existingJson = async (absolutePath: string): Promise<ExistingJson> => {
  const metadata = await lstat(absolutePath).catch((error: unknown) => {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  });
  if (metadata === null) return { kind: 'missing' };
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new CorpusCliError('FINAL_TAXONOMY_OUTPUT_UNSAFE', absolutePath);
  }
  return { kind: 'present', value: await readJson(absolutePath) };
};

const objectStatus = (value: unknown): string | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? typeof Reflect.get(value, 'status') === 'string'
      ? (Reflect.get(value, 'status') as string)
      : null
    : null;

const inspectOutput = async (
  repositoryRoot: string,
  output: Output,
  frozenProvisionalEvidence: unknown,
  allowAcceptedReplacement: boolean,
): Promise<OutputDisposition> => {
  const absolutePath = path.join(repositoryRoot, output.relativePath);
  const existingResult = await existingJson(absolutePath);
  if (existingResult.kind === 'missing') return 'missing';
  const existing = existingResult.value;
  if (canonicalJson(existing) === canonicalJson(output.value)) return 'verified';

  if (
    output.role === 'integration' &&
    objectStatus(existing) === 'evidence_frozen' &&
    canonicalJson(existing) === canonicalJson(frozenProvisionalEvidence)
  ) {
    return 'replace_proposal';
  }
  if (
    objectStatus(existing) === 'accepted' ||
    objectStatus(existing) === 'passed' ||
    (typeof existing === 'object' &&
      existing !== null &&
      !Array.isArray(existing) &&
      Reflect.get(existing, 'canonicalMaterializationAllowed') === true)
  ) {
    if (allowAcceptedReplacement) return 'replace_accepted';
    throw new CorpusCliError('FINAL_TAXONOMY_ACCEPTED_OUTPUT_CONFLICT', output.relativePath);
  }
  const replaceableStatus = output.role === 'verification' ? 'on_hold' : 'proposed';
  if (objectStatus(existing) !== replaceableStatus) {
    throw new CorpusCliError('FINAL_TAXONOMY_OUTPUT_CONFLICT', output.relativePath);
  }
  return 'replace_proposal';
};

const archiveCurrentReview = async (
  repositoryRoot: string,
  archiveRoot: string,
  relativePaths: readonly string[],
): Promise<void> => {
  const entries = await Promise.all(
    relativePaths.map(async (relativePath) => {
      const sourcePath = path.join(repositoryRoot, relativePath);
      const metadata = await lstat(sourcePath);
      if (metadata.isSymbolicLink() || !metadata.isFile()) {
        throw new CorpusCliError('FINAL_TAXONOMY_ARCHIVE_SOURCE_UNSAFE', relativePath);
      }
      const archivedPath = path.join(archiveRoot, relativePath);
      const archivedMetadata = await lstat(path.join(repositoryRoot, archivedPath)).catch(
        (error: unknown) => {
          if (isNodeError(error) && error.code === 'ENOENT') return null;
          throw error;
        },
      );
      if (archivedMetadata !== null) {
        throw new CorpusCliError('FINAL_TAXONOMY_ARCHIVE_EXISTS', archivedPath);
      }
      return { archivedPath, bytes: await readFile(sourcePath) };
    }),
  );
  for (const entry of entries) {
    await ensureNoSymlinkParents(repositoryRoot, entry.archivedPath);
    await writeFile(path.join(repositoryRoot, entry.archivedPath), entry.bytes, { flag: 'wx' });
  }
};

try {
  const { mode, archiveRoot } = parseOptions(process.argv.slice(2));
  const layout = defaultFinalTaxonomyBuildLayout();
  const context = await loadFinalTaxonomySourceContext(layout);
  const build = buildFinalTaxonomyFromPolicy(context);
  const verification = createFinalTaxonomyVerificationEvidence(context, build);
  // Automated checks run before human review. A current proposal may therefore
  // verify successfully while materialization remains gated by the accepted flag.
  const outputs: readonly Output[] = [
    {
      role: 'integration',
      relativePath: layout.provisionalIntegrationPath,
      value: build.integrationMap,
    },
    { role: 'build', relativePath: layout.outputPath, value: build },
    {
      role: 'verification',
      relativePath: FINAL_TAXONOMY_VERIFICATION_PATH,
      value: verification,
    },
  ];
  const dispositions = await Promise.all(
    outputs.map(
      async (output) =>
        await inspectOutput(
          layout.repositoryRoot,
          output,
          context.provisionalEvidence,
          archiveRoot !== null && build.status === 'proposed',
        ),
    ),
  );
  const replacingAccepted = dispositions.includes('replace_accepted');
  if (archiveRoot !== null && !replacingAccepted) {
    throw new CorpusCliError('FINAL_TAXONOMY_ARCHIVE_NOT_NEEDED', archiveRoot);
  }
  const pending = outputs.filter((_output, index) => dispositions[index] !== 'verified');
  if (mode === 'check' && pending.length > 0) {
    throw new CorpusCliError(
      'FINAL_TAXONOMY_OUTPUT_STALE_OR_MISSING',
      pending.map(({ relativePath }) => relativePath).join(', '),
    );
  }
  if (mode === 'write') {
    if (archiveRoot !== null) {
      await archiveCurrentReview(layout.repositoryRoot, archiveRoot, [
        ...outputs.map(({ relativePath }) => relativePath),
        layout.reviewEvidencePath,
        layout.reviewCheckResultsPath,
      ]);
    }
    for (let index = 0; index < outputs.length; index += 1) {
      const output = outputs[index];
      const disposition = dispositions[index];
      if (output === undefined || disposition === undefined || disposition === 'verified') continue;
      const currentDisposition = await inspectOutput(
        layout.repositoryRoot,
        output,
        context.provisionalEvidence,
        archiveRoot !== null,
      );
      if (currentDisposition !== disposition) {
        throw new CorpusCliError('FINAL_TAXONOMY_OUTPUT_CHANGED_DURING_WRITE', output.relativePath);
      }
      await ensureNoSymlinkParents(layout.repositoryRoot, output.relativePath);
      const absolutePath = path.join(layout.repositoryRoot, output.relativePath);
      if (disposition === 'missing') await writeJsonNoOverwrite(absolutePath, output.value);
      else await replaceJsonAtomically(absolutePath, output.value);
    }
    if (archiveRoot !== null) {
      await unlink(path.join(layout.repositoryRoot, layout.reviewEvidencePath));
      await unlink(path.join(layout.repositoryRoot, layout.reviewCheckResultsPath));
    }
  }
  console.log(
    JSON.stringify({
      command: 'final-taxonomy',
      mode,
      status: build.status,
      canonicalMaterializationAllowed: build.canonicalMaterializationAllowed,
      placementCount: build.placements.length,
      sourceRevisionCount: build.sourceRevisionIds.length,
      taxonomySubjectDigest: build.taxonomySubjectDigest,
      buildDigest: build.buildDigest,
      written: mode === 'write' ? pending.length : 0,
      verified: dispositions.filter((disposition) => disposition === 'verified').length,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
