import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import {
  HumanContentReviewEvidenceSchema,
  MergeReviewEvidenceSchema,
  ContentWorkManifestSchema,
} from '../../src/lib/domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import {
  validateHumanContentReview,
  validateMergeReviewEvidence,
} from '../../src/lib/validation/human-content-review.js';
import { deriveCatalogEvidenceTrustContext } from '../../src/lib/catalog/evidence-inventory.js';
import {
  INITIAL_RELEASE_MANIFEST,
  INITIAL_BOOTSTRAP_ID,
  assertSeedRelease,
} from '../../src/lib/catalog/seed-release.js';
import { parseKeyValueArguments, requiredArgument } from '../corpus/cli-support.js';
import { fileSha } from '../verify/initial-release-evidence.js';
import { writeSeedJson } from './prepare-seed.js';

/** Import already-completed human evidence verbatim; never generate decisions or identities. */
export const acceptSeedReview = async (humanPath: string, mergePath: string) => {
  const json = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(file, 'utf8')) as unknown;
  const catalog = CatalogSchema.parse(await json('docs/verification/releases/catalog.json'));
  assertSeedRelease(catalog);
  const manifest = ContentWorkManifestSchema.parse(await json(INITIAL_RELEASE_MANIFEST));
  const humanBytes = await readFile(humanPath);
  const human = HumanContentReviewEvidenceSchema.parse(
    JSON.parse(humanBytes.toString('utf8')) as unknown,
  );
  validateHumanContentReview(
    human,
    deriveCatalogEvidenceTrustContext({ catalog, workManifest: manifest }),
  );
  const mergeBytes = await readFile(mergePath);
  const merge = MergeReviewEvidenceSchema.parse(JSON.parse(mergeBytes.toString('utf8')) as unknown);
  const destination = 'docs/reviews/human-content/releases/human-review.json';
  if (
    merge.humanContentReviewEvidencePath !== destination ||
    merge.humanContentReviewEvidenceDigest !== fileSha(humanBytes) ||
    human.releaseVersion !== catalog.release.version
  )
    throw new Error('INITIAL_SIGNED_REVIEW_BINDING');
  validateMergeReviewEvidence(merge, {
    subjectDigest: catalog.release.contentFileInventoryDigest,
    workManifestPath: INITIAL_RELEASE_MANIFEST,
    workManifestDigest: manifest.digest,
    humanReview: {
      id: human.id,
      digest: fileSha(humanBytes),
      subjectDigest: human.subjectDigest,
      aggregatePassed: human.aggregatePassed,
      reviewerId: human.reviewer.personId,
      reviewMode: human.reviewMode,
    },
    constitutionVersion: '3.0.0',
    constitutionDigest: fileSha(await readFile('.specify/memory/constitution.md')),
    reviewerId: human.reviewer.personId,
    checks: catalog.release.validationSummary.checks.map((check) => ({
      checkId: check.checkId,
      command: check.command,
      applicable: true,
    })),
  });
  const reference = {
    evidenceId: human.id,
    path: destination,
    digest: fileSha(humanBytes),
    subjectDigest: human.subjectDigest,
    authorIds: human.authors.map((author) => author.personId),
    reviewerIds: [human.reviewer.personId],
    reviewMode: human.reviewMode,
    aggregatePassed: true as const,
  };
  const inventory = (await json('docs/verification/releases/evidence-inventory.json')) as Record<
    string,
    unknown
  >;
  if (canonicalJson(inventory.checks) !== canonicalJson(catalog.release.validationSummary.checks))
    throw new Error('INITIAL_SIGNED_CHECK_INVENTORY');
  catalog.release.humanContentReviewEvidenceRefs = [reference];
  const updatePath = `staging/updates/${INITIAL_BOOTSTRAP_ID}/manifest.json`;
  const update = PublicationUpdateSchema.parse(await json(updatePath));
  const eligible = PublicationUpdateSchema.parse({ ...update, state: 'ELIGIBLE_FOR_BATCH' });
  await writeFile(destination, humanBytes);
  await writeFile('docs/reviews/human-content/releases/merge-review.json', mergeBytes);
  await writeSeedJson('docs/verification/releases/evidence-inventory.json', {
    ...inventory,
    reviews: [reference],
  });
  await writeSeedJson('docs/verification/releases/catalog.json', catalog);
  await writeSeedJson(updatePath, eligible);
  return {
    status: 'human_review_imported',
    reviewMode: human.reviewMode,
    evidenceId: human.id,
    nextGate: 'commit the evidence and run read-only verify:release on that exact SHA',
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseKeyValueArguments(process.argv.slice(2), ['--human', '--merge']);
    console.log(
      JSON.stringify(
        await acceptSeedReview(
          requiredArgument(args, '--human'),
          requiredArgument(args, '--merge'),
        ),
      ),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
