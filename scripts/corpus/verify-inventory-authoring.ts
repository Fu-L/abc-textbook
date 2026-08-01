import { createHash, randomUUID } from 'node:crypto';
import { lstat, readFile, realpath, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import {
  buildTechniqueInventoryAuthoringEvidence,
  CorpusInventoryLoadError,
  defaultCorpusInventoryLayout,
  loadTechniqueInventoryCorpus,
  type TechniqueInventoryAuthoringSkillSubject,
} from '../../src/lib/corpus/technique-inventory.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { ensureNoSymlinkParents } from './cli-support.js';

const USAGE =
  'Usage: verify-inventory-authoring (--check | --write) [--repository-root PATH] [--output PATH] [--skill-manifest PATH]';
const SHA_256 = /^[a-f0-9]{64}$/u;
const WRITING_POLICY_PATH = '.agents/skills/abc-explanation-author/references/writing-policy.md';
const nonEmptyText = z.string().trim().min(1);
const allowedUseSchema = z.enum([
  'constraint_reference',
  'technical_claim',
  'example_verification',
  'answer_verification',
]);

const skillManifestSchema = z
  .object({
    schemaVersion: z.literal('1.0.0'),
    manifestId: z.literal('abc-explanation-author-initial-v1'),
    status: z.literal('frozen'),
    authoringSkillName: z.literal('abc-explanation-author'),
    authoringSkillVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
    authoringSkillDigest: z.string().regex(SHA_256),
    sourceNormalizationVersion: nonEmptyText,
    artifacts: z.array(
      z.object({ path: nonEmptyText, digest: z.string().regex(SHA_256) }).strict(),
    ),
    sourcePacket: z.strictObject({
      path: nonEmptyText,
      digest: z.string().regex(SHA_256),
      inputProblemIds: z.array(nonEmptyText).optional(),
      inputSourceRevisionIds: z.array(nonEmptyText).optional(),
      allowedUses: z.array(allowedUseSchema).optional(),
    }),
    inputContract: z.unknown(),
    outputContract: z.unknown(),
    reviewPolicy: z.unknown(),
  })
  .loose();

const sourcePacketSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  packetId: z.literal('authoring-sources-initial-v1'),
  sourceNormalizationVersion: nonEmptyText,
  authoringSkillVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  authoringSkillDigest: z.string().regex(SHA_256),
  allowedUsePolicy: z.strictObject({
    mode: z.literal('reference_and_original_explanation_only'),
    prohibitUnnecessaryReproduction: z.literal(true),
    missingOrStaleSourceAction: z.literal('hold_with_retry_condition'),
  }),
  problemInputs: z.array(
    z.strictObject({
      problemId: nonEmptyText,
      problemPath: nonEmptyText,
      officialTaskId: nonEmptyText,
      constraintsSummary: nonEmptyText,
      sourceRevisionIds: z.array(nonEmptyText),
      checkedAt: nonEmptyText,
    }),
  ),
  sources: z.array(
    z.strictObject({
      sourceRevisionId: nonEmptyText,
      path: nonEmptyText,
      sourceKind: z.enum(['official_problem', 'official_editorial']),
      officialTaskId: nonEmptyText,
      checkedAt: nonEmptyText,
      termsCheckedAt: nonEmptyText,
      allowedUses: z.array(allowedUseSchema),
    }),
  ),
});

class AuthoringEvidenceError extends Error {}
class AuthoringEvidenceUsageError extends Error {}
class AuthoringEvidenceFormatError extends Error {}
class AuthoringEvidenceIoError extends Error {}

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const valueFlags = new Set(['--repository-root', '--output', '--skill-manifest']);
const modeFlags = new Set(['--check', '--write']);
const values = new Map<string, string>();
let mode: 'check' | 'write' | null = null;
let usageInvalid = false;
const args = process.argv.slice(2);
for (let index = 0; index < args.length;) {
  const flag = args[index];
  if (!flag) {
    usageInvalid = true;
    break;
  }
  if (modeFlags.has(flag)) {
    if (mode !== null) usageInvalid = true;
    mode = flag === '--check' ? 'check' : 'write';
    index += 1;
    continue;
  }
  const value = args[index + 1];
  if (
    !valueFlags.has(flag) ||
    !value ||
    valueFlags.has(value) ||
    modeFlags.has(value) ||
    values.has(flag)
  ) {
    usageInvalid = true;
    index += value && !valueFlags.has(value) && !modeFlags.has(value) ? 2 : 1;
    continue;
  }
  values.set(flag, value);
  index += 2;
}
if (mode === null) usageInvalid = true;

const assertRepositoryRelativePath = (value: string): void => {
  if (
    value.length === 0 ||
    path.isAbsolute(value) ||
    value.split(/[\\/]/u).some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new AuthoringEvidenceUsageError(`OUTPUT_PATH_INVALID: ${value}`);
  }
};

const resolveRepositoryFile = async (
  repositoryRoot: string,
  relativePath: string,
  createParent: boolean,
): Promise<string> => {
  assertRepositoryRelativePath(relativePath);
  const resolvedRoot = await realpath(repositoryRoot);
  const lexicalPath = path.resolve(resolvedRoot, relativePath);
  const relative = path.relative(resolvedRoot, lexicalPath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new AuthoringEvidenceUsageError(`OUTPUT_PATH_ESCAPE: ${relativePath}`);
  }
  if (createParent) {
    try {
      await ensureNoSymlinkParents(resolvedRoot, relativePath);
    } catch (error) {
      throw new AuthoringEvidenceUsageError(
        `OUTPUT_PARENT_UNSAFE: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  const resolvedParent = await realpath(path.dirname(lexicalPath));
  const parentRelative = path.relative(resolvedRoot, resolvedParent);
  if (
    parentRelative === '..' ||
    parentRelative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(parentRelative)
  ) {
    throw new AuthoringEvidenceUsageError(`OUTPUT_PATH_ESCAPE: ${relativePath}`);
  }
  return path.join(resolvedParent, path.basename(lexicalPath));
};

const resolveRepositoryInputFile = async (
  repositoryRoot: string,
  relativePath: string,
): Promise<string> => {
  const resolvedRoot = await realpath(repositoryRoot);
  const resolvedPath = await resolveRepositoryFile(resolvedRoot, relativePath, false);
  const metadata = await lstat(resolvedPath);
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new AuthoringEvidenceUsageError(`INPUT_FILE_UNSAFE: ${relativePath}`);
  }
  const canonicalPath = await realpath(resolvedPath);
  const relative = path.relative(resolvedRoot, canonicalPath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new AuthoringEvidenceUsageError(`INPUT_PATH_ESCAPE: ${relativePath}`);
  }
  return canonicalPath;
};

const readRepositoryJson = async (repositoryRoot: string, relativePath: string): Promise<unknown> =>
  JSON.parse(
    await readFile(await resolveRepositoryInputFile(repositoryRoot, relativePath), 'utf8'),
  );

const loadSkillSubject = async (
  repositoryRoot: string,
  manifestPath: string,
): Promise<TechniqueInventoryAuthoringSkillSubject> => {
  let manifestInput: unknown;
  try {
    manifestInput = await readRepositoryJson(repositoryRoot, manifestPath);
  } catch (error) {
    if (error instanceof AuthoringEvidenceUsageError) throw error;
    if (isNodeError(error)) {
      throw new AuthoringEvidenceIoError(`AUTHORING_SKILL_MANIFEST_UNREADABLE: ${manifestPath}`);
    }
    throw new AuthoringEvidenceFormatError(`AUTHORING_SKILL_MANIFEST_INVALID: ${manifestPath}`);
  }
  const manifestResult = skillManifestSchema.safeParse(manifestInput);
  if (!manifestResult.success) {
    throw new AuthoringEvidenceFormatError(`AUTHORING_SKILL_MANIFEST_INVALID: ${manifestPath}`);
  }
  const manifest = manifestResult.data;
  const artifacts = await Promise.all(
    manifest.artifacts.map(async (artifact) => {
      let artifactBytes: Buffer;
      try {
        artifactBytes = await readFile(
          await resolveRepositoryInputFile(repositoryRoot, artifact.path),
        );
      } catch (error) {
        if (isNodeError(error)) {
          throw new AuthoringEvidenceIoError(
            `AUTHORING_SKILL_ARTIFACT_UNREADABLE: ${artifact.path}`,
          );
        }
        throw new AuthoringEvidenceFormatError(
          `AUTHORING_SKILL_ARTIFACT_INVALID: ${artifact.path}`,
        );
      }
      const digest = createHash('sha256').update(artifactBytes).digest('hex');
      if (digest !== artifact.digest) {
        throw new AuthoringEvidenceError(`AUTHORING_SKILL_ARTIFACT_STALE: ${artifact.path}`);
      }
      return { path: artifact.path, digest };
    }),
  );
  let sourcePacketInput: unknown;
  try {
    sourcePacketInput = await readRepositoryJson(repositoryRoot, manifest.sourcePacket.path);
  } catch (error) {
    if (isNodeError(error)) {
      throw new AuthoringEvidenceIoError(
        `AUTHORING_SKILL_SOURCE_PACKET_UNREADABLE: ${manifest.sourcePacket.path}`,
      );
    }
    throw new AuthoringEvidenceFormatError(
      `AUTHORING_SKILL_SOURCE_PACKET_INVALID: ${manifest.sourcePacket.path}`,
    );
  }
  const sourcePacketResult = sourcePacketSchema.safeParse(sourcePacketInput);
  if (!sourcePacketResult.success) {
    throw new AuthoringEvidenceFormatError(
      `AUTHORING_SKILL_SOURCE_PACKET_INVALID: ${manifest.sourcePacket.path}`,
    );
  }
  const sourcePacket = sourcePacketResult.data;
  if (sourcePacket.authoringSkillVersion !== manifest.authoringSkillVersion) {
    throw new AuthoringEvidenceError('AUTHORING_SKILL_SOURCE_PACKET_VERSION_MISMATCH');
  }
  if (sourcePacket.sourceNormalizationVersion !== manifest.sourceNormalizationVersion) {
    throw new AuthoringEvidenceError('AUTHORING_SKILL_SOURCE_PACKET_NORMALIZATION_MISMATCH');
  }
  if (sourcePacket.authoringSkillDigest !== manifest.authoringSkillDigest) {
    throw new AuthoringEvidenceError('AUTHORING_SKILL_SOURCE_PACKET_MISMATCH');
  }
  const sourcePacketDigest = canonicalDigest(
    Object.fromEntries(
      Object.entries(sourcePacket).filter(([field]) => field !== 'authoringSkillDigest'),
    ),
  );
  if (sourcePacketDigest !== manifest.sourcePacket.digest) {
    throw new AuthoringEvidenceError('AUTHORING_SKILL_SOURCE_PACKET_STALE');
  }
  const calculatedSkillDigest = canonicalDigest({
    authoringSkillName: manifest.authoringSkillName,
    authoringSkillVersion: manifest.authoringSkillVersion,
    sourceNormalizationVersion: manifest.sourceNormalizationVersion,
    artifacts,
    sourcePacketDigest,
    inputContract: manifest.inputContract,
    outputContract: manifest.outputContract,
    reviewPolicy: manifest.reviewPolicy,
  });
  if (calculatedSkillDigest !== manifest.authoringSkillDigest) {
    throw new AuthoringEvidenceError('AUTHORING_SKILL_DIGEST_STALE');
  }
  const writingPolicy = artifacts.find(
    ({ path: artifactPath }) => artifactPath === WRITING_POLICY_PATH,
  );
  if (!writingPolicy) throw new AuthoringEvidenceError('AUTHORING_WRITING_POLICY_MISSING');
  return {
    name: manifest.authoringSkillName,
    version: manifest.authoringSkillVersion,
    digest: manifest.authoringSkillDigest,
    writingPolicyPath: writingPolicy.path,
    writingPolicyDigest: writingPolicy.digest,
    sourceNormalizationVersion: manifest.sourceNormalizationVersion,
  };
};

const destinationIsRegularFile = async (absolutePath: string): Promise<boolean> => {
  try {
    const stats = await lstat(absolutePath);
    if (stats.isSymbolicLink() || !stats.isFile()) {
      throw new AuthoringEvidenceError(`AUTHORING_EVIDENCE_DESTINATION_INVALID: ${absolutePath}`);
    }
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
};

const writeAtomically = async (absolutePath: string, bytes: string): Promise<void> => {
  if (await destinationIsRegularFile(absolutePath)) {
    if ((await readFile(absolutePath, 'utf8')) === bytes) return;
  }
  const temporaryPath = path.join(
    path.dirname(absolutePath),
    `.${path.basename(absolutePath)}.${String(process.pid)}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporaryPath, bytes, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    await rename(temporaryPath, absolutePath);
  } finally {
    await unlink(temporaryPath).catch((error: unknown) => {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    });
  }
};

if (usageInvalid || mode === null) {
  console.error(USAGE);
  process.exitCode = 64;
} else {
  const repositoryRoot = values.get('--repository-root') ?? process.cwd();
  const outputPath =
    values.get('--output') ?? 'docs/verification/bootstrap/technique-inventory-authoring.json';
  const skillManifestPath =
    values.get('--skill-manifest') ??
    'docs/verification/authoring-skill/initial-v1/skill-manifest.json';
  try {
    assertRepositoryRelativePath(outputPath);
    if (!outputPath.startsWith('docs/verification/bootstrap/') || !outputPath.endsWith('.json')) {
      throw new AuthoringEvidenceUsageError(`OUTPUT_PATH_NOT_OWNED: ${outputPath}`);
    }
    const corpus = await loadTechniqueInventoryCorpus(defaultCorpusInventoryLayout(repositoryRoot));
    const skill = await loadSkillSubject(repositoryRoot, skillManifestPath);
    const evidence = buildTechniqueInventoryAuthoringEvidence(corpus, skill);
    if (evidence.status !== 'passed') {
      console.error(
        `INVENTORY_AUTHORING_INCOMPLETE: ${String(evidence.unresolvedProblemIds.length)} unresolved Problems; diagnostics=${evidence.diagnosticCodes.join(',')}`,
      );
      console.log(
        JSON.stringify({
          command: 'verify-inventory-authoring',
          mode,
          status: evidence.status,
          evidenceDigest: evidence.evidenceDigest,
          diagnosticCount: evidence.diagnosticCodes.length,
          unresolvedProblemCount: evidence.unresolvedProblemIds.length,
        }),
      );
      process.exitCode = 2;
    } else {
      let absoluteOutputPath: string;
      try {
        absoluteOutputPath = await resolveRepositoryFile(
          repositoryRoot,
          outputPath,
          mode === 'write',
        );
      } catch (error) {
        if (mode === 'check' && (error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new AuthoringEvidenceError(`AUTHORING_EVIDENCE_MISSING: ${outputPath}`);
        }
        throw error;
      }
      const bytes = `${JSON.stringify(evidence, null, 2)}\n`;
      if (mode === 'check') {
        if (!(await destinationIsRegularFile(absoluteOutputPath))) {
          throw new AuthoringEvidenceError(`AUTHORING_EVIDENCE_MISSING: ${outputPath}`);
        }
        if ((await readFile(absoluteOutputPath, 'utf8')) !== bytes) {
          throw new AuthoringEvidenceError(`AUTHORING_EVIDENCE_STALE: ${outputPath}`);
        }
      } else {
        await writeAtomically(absoluteOutputPath, bytes);
      }
      console.log(
        JSON.stringify({
          command: 'verify-inventory-authoring',
          mode,
          status: evidence.status,
          problemCount: evidence.problemCount,
          sourceBoundProblemCount: evidence.sourceBoundProblemCount,
          reviewedProblemCount: evidence.reviewStatusCounts.reviewed,
          inventoryDigest: evidence.inventoryDigest,
          evidenceDigest: evidence.evidenceDigest,
          resultPath: outputPath,
        }),
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode =
      error instanceof AuthoringEvidenceUsageError
        ? 64
        : error instanceof AuthoringEvidenceFormatError
          ? 65
          : error instanceof AuthoringEvidenceIoError
            ? 73
            : error instanceof CorpusInventoryLoadError || error instanceof AuthoringEvidenceError
              ? 2
              : isNodeError(error)
                ? 73
                : 70;
  }
}
