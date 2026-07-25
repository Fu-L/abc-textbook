import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, realpath, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildTechniqueInventoryEvidence,
  CorpusInventoryLoadError,
  defaultCorpusInventoryLayout,
  loadTechniqueInventoryCorpus,
} from '../../src/lib/corpus/technique-inventory.js';

const USAGE =
  'Usage: verify-inventory (--check | --write) [--repository-root PATH] [--output PATH] [--candidate-pool PATH] [--preview-manifest PATH] [--preview-component PATH] [--inventory-root PATH] [--preview-inventory-root PATH]';

class EvidenceCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvidenceCheckError';
  }
}

class EvidenceUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvidenceUsageError';
  }
}

const valueFlags = new Set([
  '--repository-root',
  '--output',
  '--candidate-pool',
  '--preview-manifest',
  '--preview-component',
  '--inventory-root',
  '--preview-inventory-root',
]);
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
    throw new EvidenceUsageError(`OUTPUT_PATH_INVALID: ${value}`);
  }
};

const assertOwnedOutputPath = (value: string, ownedRoot: string): void => {
  assertRepositoryRelativePath(value);
  const normalized = value.split(path.sep).join('/');
  if (!normalized.startsWith(`${ownedRoot}/`) || !normalized.endsWith('.json')) {
    throw new EvidenceUsageError(`OUTPUT_PATH_NOT_OWNED: ${value}`);
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
    throw new EvidenceUsageError(`OUTPUT_PATH_ESCAPE: ${relativePath}`);
  }
  const lexicalParent = path.dirname(lexicalPath);
  if (createParent) await mkdir(lexicalParent, { recursive: true });
  const resolvedParent = await realpath(lexicalParent);
  const parentRelative = path.relative(resolvedRoot, resolvedParent);
  if (
    parentRelative === '..' ||
    parentRelative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(parentRelative)
  ) {
    throw new EvidenceUsageError(`OUTPUT_PATH_ESCAPE: ${relativePath}`);
  }
  return path.join(resolvedParent, path.basename(lexicalPath));
};

const assertRegularDestination = async (
  absolutePath: string,
  relativePath: string,
): Promise<boolean> => {
  try {
    const stats = await lstat(absolutePath);
    if (stats.isSymbolicLink() || !stats.isFile()) {
      throw new EvidenceCheckError(`OUTPUT_DESTINATION_INVALID: ${relativePath}`);
    }
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
};

const checkExactFile = async (
  repositoryRoot: string,
  relativePath: string,
  expectedBytes: string,
): Promise<void> => {
  let absolutePath: string;
  try {
    absolutePath = await resolveRepositoryFile(repositoryRoot, relativePath, false);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new EvidenceCheckError(`CORPUS_EVIDENCE_MISSING: ${relativePath}`);
    }
    throw error;
  }
  if (!(await assertRegularDestination(absolutePath, relativePath))) {
    throw new EvidenceCheckError(`CORPUS_EVIDENCE_MISSING: ${relativePath}`);
  }
  if ((await readFile(absolutePath, 'utf8')) !== expectedBytes) {
    throw new EvidenceCheckError(`CORPUS_EVIDENCE_STALE: ${relativePath}`);
  }
};

const atomicWriteFile = async (
  repositoryRoot: string,
  relativePath: string,
  bytes: string,
): Promise<'unchanged' | 'updated'> => {
  const absolutePath = await resolveRepositoryFile(repositoryRoot, relativePath, true);
  if (await assertRegularDestination(absolutePath, relativePath)) {
    if ((await readFile(absolutePath, 'utf8')) === bytes) return 'unchanged';
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
  return 'updated';
};

if (usageInvalid || mode === null) {
  console.error(USAGE);
  process.exitCode = 64;
} else {
  const repositoryRoot = values.get('--repository-root') ?? process.cwd();
  const defaults = defaultCorpusInventoryLayout(repositoryRoot);
  const layout = {
    ...defaults,
    candidatePoolPath: values.get('--candidate-pool') ?? defaults.candidatePoolPath,
    previewManifestPath: values.get('--preview-manifest') ?? defaults.previewManifestPath,
    previewComponentPath: values.get('--preview-component') ?? defaults.previewComponentPath,
    inventoryRoot: values.get('--inventory-root') ?? defaults.inventoryRoot,
    previewInventoryRoot: values.get('--preview-inventory-root') ?? defaults.previewInventoryRoot,
  };
  const outputPath =
    values.get('--output') ?? 'docs/verification/bootstrap/technique-inventory.json';

  try {
    assertOwnedOutputPath(outputPath, 'docs/verification/bootstrap');
    assertOwnedOutputPath(
      layout.previewComponentPath,
      'docs/verification/previews/initial-v1/components',
    );
    if (outputPath === layout.previewComponentPath) {
      throw new EvidenceUsageError(`OUTPUT_PATH_COLLISION: ${outputPath}`);
    }
    const corpus = await loadTechniqueInventoryCorpus(layout, {
      synthesizePreviewComponent: mode === 'write',
    });
    const evidence = buildTechniqueInventoryEvidence(corpus);
    if (evidence.status !== 'passed') {
      for (const diagnostic of evidence.diagnostics) {
        console.error(
          `${diagnostic.code}${diagnostic.entityId ? ` [${diagnostic.entityId}]` : ''}: ${diagnostic.message}`,
        );
      }
      console.log(
        JSON.stringify({
          command: 'verify-inventory',
          mode,
          status: evidence.status,
          evidenceDigest: evidence.evidenceDigest,
          diagnosticCount: evidence.diagnostics.length,
        }),
      );
      process.exitCode = 2;
    } else {
      const componentBytes = `${JSON.stringify(corpus.previewComponent, null, 2)}\n`;
      const evidenceBytes = `${JSON.stringify(evidence, null, 2)}\n`;
      if (mode === 'check') {
        await checkExactFile(repositoryRoot, layout.previewComponentPath, componentBytes);
        await checkExactFile(repositoryRoot, outputPath, evidenceBytes);
      } else {
        await atomicWriteFile(repositoryRoot, layout.previewComponentPath, componentBytes);
        await atomicWriteFile(repositoryRoot, outputPath, evidenceBytes);
      }
      console.log(
        JSON.stringify({
          command: 'verify-inventory',
          mode,
          status: evidence.status,
          evidenceDigest: evidence.evidenceDigest,
          corpusDigest: evidence.corpusDigest,
          inventoryDigest: evidence.inventoryDigest,
          previewComponentDigest: corpus.previewComponent.outputDigest,
          resultPath: outputPath,
        }),
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode =
      error instanceof EvidenceUsageError
        ? 64
        : error instanceof CorpusInventoryLoadError || error instanceof EvidenceCheckError
          ? 2
          : 70;
  }
}
