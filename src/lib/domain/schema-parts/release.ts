import publishReceiptContractJson from '../../../../specs/001-build-abc-textbook/contracts/publish-receipt.schema.json' with { type: 'json' };
import releaseCandidateContractJson from '../../../../specs/001-build-abc-textbook/contracts/release-candidate.schema.json' with { type: 'json' };
import updateManifestContractJson from '../../../../specs/001-build-abc-textbook/contracts/update-manifest.schema.json' with { type: 'json' };
import { z } from 'zod';

import { defineContractSchema, strictObject, zodFromContractSchema } from '../contract-schema.js';
import { EntityIdSchema, OffsetDateTimeSchema, Sha256Schema } from './catalog.js';

export const AuthoringResultSchema = strictObject({
  problemId: z.string().min(1),
  result: z.enum(['explanation_draft', 'authoring_required', 'blocked']),
  explanationId: EntityIdSchema.nullable(),
  inputPacketPath: z.string().min(1).nullable(),
  holdCode: z.string().min(1).nullable(),
  retryCondition: z.string().min(1).nullable(),
});

export const PublicationUpdateSchema = zodFromContractSchema(updateManifestContractJson);
export const ReleaseCandidateSchema = zodFromContractSchema(releaseCandidateContractJson);

export const ImmutableReleaseSchema = strictObject({
  schemaVersion: z.literal('1.0.0'),
  version: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/u),
  cutoffAt: OffsetDateTimeSchema,
  contentSnapshotDigest: Sha256Schema,
  updateIds: z.array(EntityIdSchema).min(1),
  publishedAt: OffsetDateTimeSchema,
}).readonly();
export const ReleaseSchema = ImmutableReleaseSchema;

export const PublishReceiptSchema = zodFromContractSchema(publishReceiptContractJson);

export const UpdateManifestContract = defineContractSchema(
  'update-manifest.schema.json',
  updateManifestContractJson,
);
export const ReleaseCandidateContract = defineContractSchema(
  'release-candidate.schema.json',
  releaseCandidateContractJson,
);
export const PublishReceiptContract = defineContractSchema(
  'publish-receipt.schema.json',
  publishReceiptContractJson,
);
