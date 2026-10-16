import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

// Retained only for the explicit historical report writer. Normal verification
// checks the current source and build without a frozen implementation subject.
export const projectionImplementationDigest = async (root = process.cwd()): Promise<string> => {
  const files = [
    'package.json',
    'package-lock.json',
    ...(await readdir(root)).filter((file) =>
      /(?:config(?:\.[\w-]+)*\.(?:[cm]?js|ts|json)|^\.npmrc)$/u.test(file),
    ),
  ];
  for (const directory of ['src', 'scripts']) {
    const entries = await readdir(path.join(root, directory), { recursive: true });
    files.push(
      ...entries
        .filter((file) => /\.(?:astro|[cm]?js|tsx?|css)$/u.test(file))
        .map((file) => `${directory}/${file}`),
    );
  }
  const inventory = await Promise.all(
    files.sort().map(async (file) => ({
      path: file,
      digest: createHash('sha256')
        .update(await readFile(path.join(root, file)))
        .digest('hex'),
    })),
  );
  return canonicalDigest(inventory);
};

export const projectionBuildDigest = (sourceProjectionDigest: string, artifactDigest: string) =>
  canonicalDigest({ sourceProjectionDigest, artifactDigest });
