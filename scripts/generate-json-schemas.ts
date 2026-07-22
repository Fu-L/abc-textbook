import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import {
  AnswerMaterialEvidenceContract,
  CatalogContract,
  GlossaryContract,
  PrerequisiteBaselineContract,
  ProblemPlacementDecisionTableContract,
} from '../src/lib/domain/schema-parts/catalog.js';
import { LearningRecordContract } from '../src/lib/domain/schema-parts/learning.js';
import {
  ReleaseMetadataContract,
  UpdateManifestContract,
} from '../src/lib/domain/schema-parts/release.js';
import {
  ContentWorkManifestContract,
  HumanContentReviewEvidenceContract,
  LearnerOutcomeEvidenceContract,
  MergeReviewEvidenceContract,
  UserTimingEvidenceContract,
} from '../src/lib/domain/schema-parts/review-evidence.js';
import {
  ClientBundleEvidenceContract,
  ExecutableExampleEvidenceContract,
  InstructionQualityEvidenceContract,
  LearningRecordE2eEvidenceContract,
  PerformanceEvidenceContract,
} from '../src/lib/domain/schema-parts/verification-evidence.js';
import type {
  ContractSchemaDefinition,
  JsonSchemaDocument,
} from '../src/lib/domain/contract-schema.js';
import { canonicalJson } from '../src/lib/domain/canonical-json.js';

export const contractSchemaEntries: readonly ContractSchemaDefinition[] = [
  AnswerMaterialEvidenceContract,
  CatalogContract,
  ClientBundleEvidenceContract,
  ExecutableExampleEvidenceContract,
  ContentWorkManifestContract,
  GlossaryContract,
  HumanContentReviewEvidenceContract,
  InstructionQualityEvidenceContract,
  LearnerOutcomeEvidenceContract,
  LearningRecordE2eEvidenceContract,
  LearningRecordContract,
  MergeReviewEvidenceContract,
  PerformanceEvidenceContract,
  PrerequisiteBaselineContract,
  ProblemPlacementDecisionTableContract,
  ReleaseMetadataContract,
  UpdateManifestContract,
  UserTimingEvidenceContract,
].sort((left, right) => left.fileName.localeCompare(right.fileName));

export const generateContractJsonSchemas = (): Record<string, JsonSchemaDocument> =>
  Object.fromEntries(
    contractSchemaEntries.map((definition) => [
      definition.fileName,
      z.toJSONSchema(definition.schema, {
        target: 'draft-2020-12',
        ...(definition.reuseJsonSchemaReferences ? { reused: 'ref' as const } : {}),
      }),
    ]),
  );

const contractsDirectory = path.resolve('specs/001-build-abc-textbook/contracts');

const run = async (): Promise<void> => {
  const checkOnly = process.argv.includes('--check');
  let drift = false;
  for (const [fileName, jsonSchema] of Object.entries(generateContractJsonSchemas())) {
    const contractPath = path.join(contractsDirectory, fileName);
    const next = `${JSON.stringify(jsonSchema, null, 2)}\n`;
    let current: string | undefined;
    try {
      current = await readFile(contractPath, 'utf8');
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
    if (checkOnly) {
      if (
        current === undefined ||
        canonicalJson(JSON.parse(current) as unknown) !== canonicalJson(jsonSchema)
      ) {
        drift = true;
        process.stderr.write(`SCHEMA_DRIFT: ${fileName}\n`);
      }
    } else if (
      current === undefined ||
      canonicalJson(JSON.parse(current) as unknown) !== canonicalJson(jsonSchema)
    ) {
      await writeFile(contractPath, next, 'utf8');
    }
  }
  if (drift) process.exitCode = 2;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await run();
}
