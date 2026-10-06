import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

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
              env: { ...process.env, LINK_CHECK_PORT: String(port) },
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
