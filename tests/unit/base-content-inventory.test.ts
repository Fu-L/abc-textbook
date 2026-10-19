import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { calculateBaseContentFileInventory } from '../../src/lib/catalog/evidence-inventory.js';

const execute = promisify(execFile);

describe('protected-base content inventory', () => {
  let root: string;
  const git = (...args: string[]) => execute('git', args, { cwd: root });
  const commit = async () => {
    await git('add', '.');
    await git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '--quiet',
      '--allow-empty',
      '-m',
      'Seal content',
    );
    return (await git('rev-parse', 'HEAD')).stdout.trim();
  };

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'abc-base-inventory-'));
    await git('init', '--quiet');
    await mkdir(path.join(root, 'src/content'), { recursive: true });
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('keeps exact committed bytes, paths and ordering across multiple batches', async () => {
    const contents = new Map<string, Buffer>([
      ['src/content/ binary\t"\n日本語 ', Buffer.from([0, 10, 255, 13, 128])],
      ['src/content/empty', Buffer.alloc(0)],
      ['src/content/duplicate', Buffer.from([0, 10, 255, 13, 128])],
      ...Array.from({ length: 35 }, (_, index): [string, Buffer] => [
        `src/content/file-${String(index).padStart(2, '0')}`,
        Buffer.from(`内容 ${String(index)}\n${'a'.repeat(index * 1000)}`),
      ]),
    ]);
    for (const [file, bytes] of contents) await writeFile(path.join(root, file), bytes);
    await writeFile(path.join(root, 'outside-content'), 'excluded');
    const base = await commit();
    await writeFile(path.join(root, 'src/content/duplicate'), 'changed worktree');
    await writeFile(path.join(root, 'src/content/untracked'), 'excluded');
    expect(await calculateBaseContentFileInventory(root, base)).toEqual(
      [...contents]
        .sort(([left], [right]) => Buffer.compare(Buffer.from(left), Buffer.from(right)))
        .map(([file, bytes]) => ({
          path: file,
          sha256: createHash('sha256').update(bytes).digest('hex'),
          byteLength: bytes.byteLength,
        })),
    );
  });

  it('returns an empty inventory when the commit contains no content files', async () => {
    expect(await calculateBaseContentFileInventory(root, await commit())).toEqual([]);
  });

  it('rejects an unknown base commit', async () => {
    await expect(calculateBaseContentFileInventory(root, 'f'.repeat(40))).rejects.toThrow(
      'TRUSTED_BASE_CONTENT_UNREADABLE',
    );
  });

  it('rejects a missing blob even when git cat-file exits successfully', async () => {
    await writeFile(path.join(root, 'src/content/missing'), 'missing object');
    const base = await commit();
    const objectId = (await git('rev-parse', `${base}:src/content/missing`)).stdout.trim();
    await rm(path.join(root, '.git/objects', objectId.slice(0, 2), objectId.slice(2)));
    await expect(calculateBaseContentFileInventory(root, base)).rejects.toThrow(
      'TRUSTED_BASE_CONTENT_UNREADABLE',
    );
  });
});
