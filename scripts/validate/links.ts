import { readFile, stat } from 'node:fs/promises';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { extname, resolve, sep } from 'node:path';

import { check, LinkState } from 'linkinator';

import { normalizeBasePath, resolvePort, resolveSite, UsageError } from '../config/publication.js';

const distRoot = resolve('dist');

try {
  const port = resolvePort(process.env.LINK_CHECK_PORT ?? '8673', 'LINK_CHECK_PORT');
  const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/');
  const siteOrigin = new URL(resolveSite(process.env.SITE_URL ?? 'https://abc-textbook.example'))
    .origin;
  const localOrigin = `http://127.0.0.1:${String(port)}`;
  const startUrl = `${localOrigin}${basePath}`;
  const server = createStaticServer(basePath);

  await listen(server, port);
  try {
    const result = await check({
      path: startUrl,
      recurse: true,
      checkFragments: true,
      checkCss: true,
      concurrency: 16,
      // A full-corpus discovery burst can reset local connections; retry transport errors.
      retryErrors: true,
      retryErrorsCount: 3,
      retryErrorsJitter: 0,
      // canonical URLは先にlocal serverへ書き換わるため、実際の通信先をlocal originへ限定する。
      linksToSkip: (link) => Promise.resolve(new URL(link).origin !== localOrigin),
      urlRewriteExpressions: [
        {
          pattern: new RegExp(`^${escapeRegularExpression(siteOrigin)}(?=/|$)`, 'u'),
          replacement: localOrigin,
        },
      ],
    });

    const brokenLinks = result.links.filter((link) => link.state === LinkState.BROKEN);

    if (brokenLinks.length > 0) {
      for (const link of brokenLinks) {
        console.error(
          `${String(link.status ?? 'ERR')} ${link.url}${link.parent ? ` (from ${link.parent})` : ''}`,
        );
      }

      process.exitCode = 2;
    } else {
      console.log(`Checked ${String(result.links.length)} links with no broken targets.`);
    }
  } finally {
    await close(server);
  }
} catch (error) {
  if (error instanceof UsageError) {
    console.error(error.message);
    process.exitCode = 64;
  } else {
    throw error;
  }
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function createStaticServer(basePath: string): Server {
  // 本番サーバーを使わず、生成済みdistだけを検査対象にする。
  return createServer((request, response) => {
    void serveStaticFile(request, response, basePath);
  });
}

async function serveStaticFile(
  request: IncomingMessage,
  response: ServerResponse,
  basePath: string,
): Promise<void> {
  try {
    const host = request.headers.host ?? '127.0.0.1';
    const requestUrl = new URL(request.url ?? '/', `http://${host}`);
    const relativePath = stripBasePath(requestUrl.pathname, basePath);

    if (relativePath === null) {
      response.writeHead(404).end();
      return;
    }

    const filePath = await resolveStaticFile(relativePath);
    if (filePath === null) {
      response.writeHead(404).end();
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      'content-length': String(body.byteLength),
      'content-type': contentType(filePath),
    });

    if (request.method === 'HEAD') {
      response.end();
    } else {
      response.end(body);
    }
  } catch {
    response.writeHead(500).end();
  }
}

function stripBasePath(pathname: string, basePath: string): string | null {
  if (basePath === '/') {
    return pathname;
  }

  if (pathname === basePath) {
    return '/';
  }

  if (!pathname.startsWith(`${basePath}/`)) {
    return null;
  }

  return pathname.slice(basePath.length);
}

async function resolveStaticFile(pathname: string): Promise<string | null> {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath.replace(/^\/+/u, '');
  const candidates =
    relativePath === ''
      ? ['index.html']
      : relativePath.endsWith('/')
        ? [`${relativePath}index.html`]
        : [relativePath, `${relativePath}.html`, `${relativePath}/index.html`];

  for (const candidate of candidates) {
    const absolutePath = resolve(distRoot, candidate);
    // URLデコード後もdistの外へ出られないよう、clean URL解決前に境界を確認する。
    if (absolutePath !== distRoot && !absolutePath.startsWith(`${distRoot}${sep}`)) {
      continue;
    }

    try {
      if ((await stat(absolutePath)).isFile()) {
        return absolutePath;
      }
    } catch {
      // clean URLの候補を順に試し、どれもなければ404にする。
    }
  }

  return null;
}

function contentType(filePath: string): string {
  const types: Readonly<Record<string, string>> = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.wasm': 'application/wasm',
    '.xml': 'application/xml; charset=utf-8',
  };

  return types[extname(filePath)] ?? 'application/octet-stream';
}

function listen(server: Server, port: number): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolvePromise();
    });
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolvePromise();
      }
    });
  });
}
