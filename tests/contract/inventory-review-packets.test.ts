import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const runExporter = async (
  args: readonly string[],
): Promise<{ readonly exitCode: number; readonly stderr: string }> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', 'scripts/corpus/export-inventory-review-packets.ts', ...args],
      { cwd: process.cwd(), stdio: ['ignore', 'ignore', 'pipe'] },
    );
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`export-inventory-review-packets terminated by ${signal}.`));
        return;
      }
      resolve({ exitCode: code ?? 70, stderr });
    });
  });

describe('private inventory review-packet export boundary', () => {
  let temporaryRoot = '';

  beforeAll(async () => {
    temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'abc-review-packets-'));
  });

  afterAll(async () => {
    if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
  });

  it('rejects a repository-owned output directory before reading private inputs', async () => {
    const result = await runExporter([
      '--metadata-dir',
      path.join(temporaryRoot, 'metadata'),
      '--cache-scope-dir',
      path.join(temporaryRoot, 'cache'),
      '--output-dir',
      process.cwd(),
    ]);

    expect(result.exitCode).toBe(64);
    expect(result.stderr).toContain('REVIEW_PACKET_OUTPUT_PATH_INVALID');
  });

  it('resolves output parents and rejects a symlink route back into the repository', async () => {
    const linkedRepository = path.join(temporaryRoot, 'repository-link');
    await symlink(process.cwd(), linkedRepository, 'dir');
    const result = await runExporter([
      '--metadata-dir',
      path.join(temporaryRoot, 'metadata'),
      '--cache-scope-dir',
      path.join(temporaryRoot, 'cache'),
      '--output-dir',
      path.join(linkedRepository, 'review-packets'),
    ]);

    expect(result.exitCode).toBe(64);
    expect(result.stderr).toContain('REVIEW_PACKET_OUTPUT_PATH_INVALID');
  });

  it('rejects a symlink masquerading as a private cache-scope directory', async () => {
    const linkedCache = path.join(temporaryRoot, 'a'.repeat(64));
    await symlink(process.cwd(), linkedCache, 'dir');
    const result = await runExporter([
      '--metadata-dir',
      path.join(temporaryRoot, 'metadata'),
      '--cache-scope-dir',
      linkedCache,
      '--output-dir',
      path.join(temporaryRoot, 'new-review-packets'),
    ]);

    expect(result.exitCode).toBe(64);
    expect(result.stderr).toContain('REVIEW_PACKET_CACHE_DIRECTORY_UNSAFE');
  });

  it('rejects an existing output directory before reading private inputs', async () => {
    const existingOutput = path.join(temporaryRoot, 'existing-review-packets');
    await mkdir(existingOutput);
    const result = await runExporter([
      '--metadata-dir',
      path.join(temporaryRoot, 'metadata'),
      '--cache-scope-dir',
      path.join(temporaryRoot, 'cache'),
      '--output-dir',
      existingOutput,
    ]);

    expect(result.exitCode).toBe(64);
    expect(result.stderr).toContain('REVIEW_PACKET_OUTPUT_ALREADY_EXISTS');
  });
});
