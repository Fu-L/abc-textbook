import { canonicalDigest } from '../src/lib/domain/canonical-json.js';
import type { PipelineResult } from './update-abc/index.js';

export const verifyPreviewReleaseSimulation = (input: {
  readonly previewId: 'initial-v1';
  readonly update: PipelineResult;
  readonly publicWrites: readonly string[];
  readonly productionReleaseMetadataWrites: readonly string[];
  readonly deploymentWrites: readonly string[];
}) => {
  const findings: string[] = [];
  if (input.update.state !== 'ELIGIBLE_FOR_BATCH') findings.push('UPDATE_ON_HOLD');
  if (input.publicWrites.length > 0) findings.push('PUBLIC_WRITE_DETECTED');
  if (input.productionReleaseMetadataWrites.length > 0)
    findings.push('PRODUCTION_RELEASE_METADATA_WRITE_DETECTED');
  if (input.deploymentWrites.length > 0) findings.push('DEPLOYMENT_WRITE_DETECTED');
  const inventory = {
    previewId: input.previewId,
    updateId: input.update.updateId,
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
