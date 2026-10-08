import { spawn } from 'node:child_process';
import { cp, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  assertPublicSurfacePreserved,
  readPublicSurface,
} from '../fixtures/maintenance-compatibility.js';

const script = fileURLToPath(new URL('../../scripts/validate/links.ts', import.meta.url));
const loader = fileURLToPath(new URL('../../node_modules/tsx/dist/loader.mjs', import.meta.url));

const availablePort = async (): Promise<number> => {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing test port');
  await new Promise<void>((resolve, reject) =>
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    }),
  );
  return address.port;
};

describe('built internal link verification', () => {
  it('detects simultaneous source/target deletion and missing data, feeds, sitemap or history', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-url-compat-'));
    try {
      const oldDist = path.join(root, 'old');
      const newDist = path.join(root, 'new');
      const files = new Map([
        ['index.html', '<h1 id="目次">目次</h1><a href="/abc-textbook/target/#proof">教材</a>'],
        ['target/index.html', '<h1 id="proof">正当性</h1><a name="legacy">旧anchor</a>'],
        ['data/catalog.json', '{}'],
        ['release-metadata.json', '{}'],
        ['feed.xml', '<feed/>'],
        ['sitemap.xml', '<urlset/>'],
        ['sitemap-index.xml', '<sitemapindex/>'],
        ['sitemap-0.xml', '<urlset/>'],
        ['updates/index.html', '<h1 id="history">更新履歴</h1>'],
        ['updates/2026.10.07/index.html', '<h1 id="release">公開版</h1>'],
      ]);
      for (const [file, body] of files) {
        await mkdir(path.dirname(path.join(oldDist, file)), { recursive: true });
        await writeFile(path.join(oldDist, file), body);
      }
      await cp(oldDist, newDist, { recursive: true });
      const before = await readPublicSurface(oldDist, '/abc-textbook');
      expect(before.get('/abc-textbook/')).toEqual(['目次']);
      expect(before.get('/abc-textbook/target/')).toEqual(['legacy', 'proof']);
      assertPublicSurfacePreserved(before, await readPublicSurface(newDist, '/abc-textbook'));
      await writeFile(path.join(newDist, 'extra.html'), '<h1 id="new">追加</h1>');
      assertPublicSurfacePreserved(before, await readPublicSurface(newDist, '/abc-textbook'));
      for (const file of [...files.keys()].filter((file) => file !== 'index.html')) {
        await rm(path.join(newDist, file));
        await writeFile(path.join(newDist, 'index.html'), '<h1 id="目次">目次</h1>');
        const after = await readPublicSurface(newDist, '/abc-textbook');
        expect(() => {
          assertPublicSurfacePreserved(before, after);
        }, file).toThrow('Missing public URL');
        await writeFile(path.join(newDist, file), files.get(file) ?? '');
      }
      for (const body of [
        '<h1 id="changed">正当性</h1><a name="legacy">旧anchor</a>',
        '<h1 id="proof">正当性</h1>',
      ]) {
        await writeFile(path.join(newDist, 'target/index.html'), body);
        const after = await readPublicSurface(newDist, '/abc-textbook');
        expect(() => {
          assertPublicSurfacePreserved(before, after);
        }).toThrow('Missing public anchor');
      }
      await expect(readPublicSurface(path.join(root, 'absent'), '/abc-textbook')).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it.skipIf(!process.env.ABC_COMPAT_OLD_DIST)(
    'preserves all old build URLs and anchors in the new build',
    async () => {
      const oldDist = process.env.ABC_COMPAT_OLD_DIST;
      if (!oldDist) throw new Error('ABC_COMPAT_OLD_DIST is required');
      const basePath = process.env.BASE_PATH ?? '/';
      const before = await readPublicSurface(oldDist, basePath);
      const after = await readPublicSurface(
        process.env.ABC_COMPAT_NEW_DIST ?? path.resolve('dist'),
        basePath,
      );
      assertPublicSurfacePreserved(before, after);
    },
    60_000,
  );
  it.each([
    ['/target/#correct', 0, 'no broken targets'],
    ['/missing/', 2, '404'],
    ['/target/#missing', 2, '#missing'],
  ] as const)(
    'checks %s without masking missing pages or anchors',
    async (href, expectedExit, message) => {
      const root = await mkdtemp(path.join(tmpdir(), 'abc-public-links-'));
      try {
        await mkdir(path.join(root, 'dist/target'), { recursive: true });
        await writeFile(path.join(root, 'dist/index.html'), `<a href="${href}">教材</a>`);
        await writeFile(path.join(root, 'dist/target/index.html'), '<h1 id="correct">本文</h1>');
        const port = await availablePort();
        const result = await new Promise<{ exit: number | null; output: string }>(
          (resolve, reject) => {
            const child = spawn(process.execPath, ['--import', loader, script], {
              cwd: root,
              env: { ...process.env, BASE_PATH: '/', LINK_CHECK_PORT: String(port) },
            });
            let output = '';
            child.stdout.on('data', (chunk: Buffer) => {
              output += chunk.toString();
            });
            child.stderr.on('data', (chunk: Buffer) => {
              output += chunk.toString();
            });
            child.on('error', reject);
            child.on('close', (exit) => {
              resolve({ exit, output });
            });
          },
        );
        expect(result.exit, result.output).toBe(expectedExit);
        expect(result.output).toContain(message);
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
  );
});
