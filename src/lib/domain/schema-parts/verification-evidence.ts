import clientBundleContractJson from '../../../../specs/001-build-abc-textbook/contracts/client-bundle-evidence.schema.json' with { type: 'json' };
import filesystemPublishContractJson from '../../../../specs/001-build-abc-textbook/contracts/filesystem-publish-evidence.schema.json' with { type: 'json' };
import instructionQualityContractJson from '../../../../specs/001-build-abc-textbook/contracts/instruction-quality-evidence.schema.json' with { type: 'json' };
import learningRecordE2eContractJson from '../../../../specs/001-build-abc-textbook/contracts/learning-record-e2e-evidence.schema.json' with { type: 'json' };
import performanceContractJson from '../../../../specs/001-build-abc-textbook/contracts/performance-evidence.schema.json' with { type: 'json' };
import { z } from 'zod';

import { defineContractSchema, zodFromContractSchema } from '../contract-schema.js';
import { AnswerMaterialEvidenceContract } from './catalog.js';

export const PerformanceEvidenceSchema = zodFromContractSchema(performanceContractJson);
export const ExecutableExampleEvidenceSchema = z
  .object({
    schemaVersion: z.string(),
    releaseDigest: z.string(),
    items: z.array(z.unknown()),
  })
  .strict();
export { AnswerMaterialEvidenceContract as AnswerMaterialVerificationEvidenceContract };
export const AnswerMaterialEvidenceSchema = AnswerMaterialEvidenceContract.schema;
export const InstructionQualityEvidenceSchema = zodFromContractSchema(
  instructionQualityContractJson,
);
export const ClientBundleEvidenceSchema = zodFromContractSchema(clientBundleContractJson);
export const FilesystemPublishEvidenceSchema = zodFromContractSchema(filesystemPublishContractJson);
export const LearningRecordE2eEvidenceSchema = zodFromContractSchema(learningRecordE2eContractJson);

export const PerformanceEvidenceContract = defineContractSchema(
  'performance-evidence.schema.json',
  performanceContractJson,
);
export const InstructionQualityEvidenceContract = defineContractSchema(
  'instruction-quality-evidence.schema.json',
  instructionQualityContractJson,
);
export const ClientBundleEvidenceContract = defineContractSchema(
  'client-bundle-evidence.schema.json',
  clientBundleContractJson,
);
export const FilesystemPublishEvidenceContract = defineContractSchema(
  'filesystem-publish-evidence.schema.json',
  filesystemPublishContractJson,
);
export const LearningRecordE2eEvidenceContract = defineContractSchema(
  'learning-record-e2e-evidence.schema.json',
  learningRecordE2eContractJson,
);
