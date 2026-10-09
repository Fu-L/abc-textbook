import { loadFullPublicProjection } from './full-public-projection.js';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolveBuildPublication } from '../../../scripts/config/publication.js';
import { readVerificationChanges } from '../../../scripts/verify/runner.js';
import { ReleaseVersionSchema } from '../domain/schema-parts/content-common.js';
import { buildPublicationCandidate } from './build-publication.js';
import { z } from 'zod';
export {
  requireCatalogEntity,
  withBase,
  canonicalUiRoutes,
  type UiCatalog,
  type UiProblem,
} from './ui-catalog.js';
// The same canonical projection is checked, built, and uploaded. Legacy acceptance
// snapshots and reviews are historical inputs, not a gate for this candidate.
export const publicProjection = await loadFullPublicProjection({ usePreparedRelease: false });
let baselineVersion: string | undefined;
if (process.env.GITHUB_ACTIONS !== 'true' && publicProjection.history.length === 0) {
  try {
    const baseline = JSON.parse(
      await readFile('docs/verification/releases/catalog.json', 'utf8'),
    ) as { release?: { version?: unknown } };
    baselineVersion = ReleaseVersionSchema.parse(baseline.release?.version);
  } catch (error) {
    throw new Error(
      'PUBLICATION_BASELINE_MISSING: docs/verification/releases/catalog.json release.version is required for an empty history.',
      { cause: error },
    );
  }
}
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const publication = resolveBuildPublication({
  env: process.env,
  head,
  historyVersions: publicProjection.history.map(({ version }) => version),
  ...(baselineVersion ? { baselineVersion } : {}),
});
const publicationBase = process.env.ABC_TEXTBOOK_PUBLICATION_BASE_SHA;
const changes = publicationBase
  ? readVerificationChanges({ ...process.env, CI: 'true' }, publicationBase)
  : null;
const candidate = buildPublicationCandidate(
  publicProjection.catalog,
  publication,
  changes,
  publicProjection.history,
  publicationBase
    ? (file) => {
        const before: unknown = JSON.parse(
          execFileSync('git', ['show', `${publicationBase}:${file}`], { encoding: 'utf8' }),
        );
        const label = z
          .object({ title: z.string().optional(), name: z.string().optional() })
          .parse(before);
        return label.title ?? label.name;
      }
    : undefined,
);
export const publicCatalog = publicProjection.ui;
export const publicCatalogContract = candidate.catalog;
export const publicReleaseMetadata = candidate.metadata;
