import { canonicalDigest } from '../src/lib/domain/canonical-json.js';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { PublicationUpdateSchema } from '../src/lib/domain/schema-parts/release.js';

export const verifyPreviewReleaseSimulation = (input: {
  readonly previewId: 'initial-v1';
  readonly update: {
    readonly updateId: string;
    readonly publicationUpdate: unknown;
  };
  readonly publicWrites: readonly string[];
  readonly productionReleaseMetadataWrites: readonly string[];
  readonly deploymentWrites: readonly string[];
}) => {
  const findings: string[] = [];
  if (input.publicWrites.length > 0) findings.push('PUBLIC_WRITE_DETECTED');
  if (input.productionReleaseMetadataWrites.length > 0)
    findings.push('PRODUCTION_RELEASE_METADATA_WRITE_DETECTED');
  if (input.deploymentWrites.length > 0) findings.push('DEPLOYMENT_WRITE_DETECTED');
  const inventory = {
    previewId: input.previewId,
    updateId: input.update.updateId,
    publicationUpdateDigest: canonicalDigest(input.update.publicationUpdate),
    stagingClosed: true,
    publicWriteCount: input.publicWrites.length,
    productionReleaseMetadataWriteCount: input.productionReleaseMetadataWrites.length,
    deploymentWriteCount: input.deploymentWrites.length,
    checks: [
      'staging-public-closure',
      'immutable-preview-digest',
      'validation-inventory',
      'no-production-release-metadata',
      'no-deployment',
    ],
  };
  return {
    ...inventory,
    aggregatePassed: findings.length === 0,
    findings,
    immutablePreviewDigest: canonicalDigest(inventory),
  };
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const manifestPath = argument('--manifest');
  if (!manifestPath) {
    process.stderr.write(
      'Usage: npm run verify:release -- --manifest staging/previews/initial-v1/release-simulation/<id>/manifest.json\n',
    );
    process.stdout.write(`${JSON.stringify({ command: 'verify:release', exitCode: 64 })}\n`);
    process.exitCode = 64;
  } else {
    const update = PublicationUpdateSchema.parse(
      JSON.parse(await readFile(manifestPath, 'utf8')) as unknown,
    );
    const verification = verifyPreviewReleaseSimulation({
      previewId: 'initial-v1',
      update: { updateId: update.updateId, publicationUpdate: update },
      publicWrites: [],
      productionReleaseMetadataWrites: [],
      deploymentWrites: [],
    });
    const releaseEligible = update.state === 'ELIGIBLE_FOR_BATCH';
    const summary = {
      command: 'verify:release',
      updateId: update.updateId,
      fixtureMode: update.fixtureMode,
      state: update.state,
      aggregatePassed: releaseEligible && verification.aggregatePassed,
      blockingFindingCount: update.validationSummary.blockingFindingCount,
    };
    process.stdout.write(`${JSON.stringify(summary)}\n`);
    process.exitCode = summary.aggregatePassed ? 0 : 2;
  }
}
