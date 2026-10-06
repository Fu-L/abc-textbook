import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const EvidenceSchema = z.looseObject({
  sourceProjectionDigest: digest,
  implementationDigest: digest,
  fullProjectionDigest: digest,
  artifactDigest: digest,
  artifactInventory: z.array(
    z.object({ path: z.string(), digest, byteLength: z.number().int().nonnegative() }),
  ),
});

// Native Pagefind output and bundler artifacts are build evidence, not a
// portable source subject. Bind the snapshot to the rendering implementation
// and locked toolchain so a UI change still requires an explicit evidence update.
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

const sourceSubject = (evidence: z.infer<typeof EvidenceSchema>) =>
  Object.fromEntries(
    Object.entries(evidence).filter(
      ([key]) => !['fullProjectionDigest', 'artifactDigest', 'artifactInventory'].includes(key),
    ),
  );

export const verifyProjectionEvidence = (frozen: unknown, current: unknown) => {
  const previous = EvidenceSchema.parse(frozen);
  const report = EvidenceSchema.parse(current);
  for (const evidence of [previous, report]) {
    if (
      canonicalDigest(evidence.artifactInventory) !== evidence.artifactDigest ||
      projectionBuildDigest(evidence.sourceProjectionDigest, evidence.artifactDigest) !==
        evidence.fullProjectionDigest ||
      new Set(evidence.artifactInventory.map((artifact) => artifact.path)).size !==
        evidence.artifactInventory.length
    )
      throw new Error('FULL_PROJECTION_EVIDENCE_CORRUPT');
  }
  if (canonicalJson(sourceSubject(previous)) !== canonicalJson(sourceSubject(report)))
    throw new Error('FULL_PROJECTION_EVIDENCE_STALE');
  const previousArtifacts = new Map(previous.artifactInventory.map((item) => [item.path, item]));
  const currentArtifacts = new Map(report.artifactInventory.map((item) => [item.path, item]));
  const changedArtifacts = [...new Set([...previousArtifacts.keys(), ...currentArtifacts.keys()])]
    .sort()
    .filter((file) => {
      const before = previousArtifacts.get(file);
      const after = currentArtifacts.get(file);
      return before?.digest !== after?.digest || before?.byteLength !== after?.byteLength;
    });
  return { frozenBuildDigest: previous.fullProjectionDigest, changedArtifacts };
};
