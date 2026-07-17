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
  PublishReceiptContract,
  ReleaseCandidateContract,
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
  FilesystemPublishEvidenceContract,
  InstructionQualityEvidenceContract,
  LearningRecordE2eEvidenceContract,
  PerformanceEvidenceContract,
} from '../src/lib/domain/schema-parts/verification-evidence.js';
import type {
  ContractSchemaDefinition,
  JsonSchemaDocument,
} from '../src/lib/domain/contract-schema.js';
import { canonicalDigest, canonicalJson } from '../src/lib/domain/canonical-json.js';

const canonicalContractDigests: Readonly<Record<string, string>> = {
  'answer-material-evidence.schema.json':
    '98a05b5f8c6e144dcd8549a9203b3c20080402e3cdbf9d7ec18b22447450ff72',
  'catalog.schema.json': 'c77a3d6f75a9af8328384fc1e700013b12620fa921312401d51f9a25752ebe39',
  'client-bundle-evidence.schema.json':
    '8a78eb9d57876931e5bfe65bcf2a634ae68899e8ab1cd7618ba476a91d0721c3',
  'content-work-manifest.schema.json':
    '84a06f6c6d51529c0d71eb3ed7953d93125cb326d51891b4b4fe3940087d0a11',
  'filesystem-publish-evidence.schema.json':
    'dff42b5524ff3114abd1e245ae9011ca1bec560067afac3ae0c4eb3765cb7250',
  'glossary.schema.json': '0943eaddf724e50177735bf1973105b0f29ec059a190a7c28b9158baed13b569',
  'human-content-review-evidence.schema.json':
    '43ed2a423e05c83549d1b0a5c7e8b26a593ad518f04d353435a5d5ff6ac11305',
  'instruction-quality-evidence.schema.json':
    '1c7eb79babda73943fc723fd646932d99d5236357cd5dd9fb0eaf47db5602ea5',
  'learner-outcome-evidence.schema.json':
    'c33757be0c12e243ef8149432aeef7bc28feeb58c7d53d2e9b92f4cd8593e510',
  'learning-record-e2e-evidence.schema.json':
    '7dc1394e3ce865b17420eb60915a1a5232715516ff300af3bc536b20da2a156b',
  'learning-record.schema.json': '6378642a83dfbb4ae43087a58e403396647f894fa3ac2c1c0d890b9dc27777eb',
  'merge-review.schema.json': '5ea579c4875ca735ed229c77d45b3ca727bd26fc9e615d33e4f92edb85c08a04',
  'performance-evidence.schema.json':
    '2ca260c1c6ad41742b3876a8b3cd69ac5536f93a5e77be0623015e3343deb2c3',
  'prerequisite-baseline.schema.json':
    '987b40c2f62f2498e31bb8eb7337795a4bee656dc2aa0f505d0bc63411284a32',
  'problem-placement-decision-table.schema.json':
    '6c71a66101f9d336b63beacf0f30d6d4035efc08d54fbfe02bdb051eed812fab',
  'publish-receipt.schema.json': '25caa009ceee246d3975c5c60a7ec192624fafe7df3d666417952ef5d89fe1ea',
  'release-candidate.schema.json':
    '4f44fd576d3e074a837823aa095239dd27834eef0f1ff1f928ec95ed71469140',
  'update-manifest.schema.json': '4c94129bccc6f976fe9525ebac5cea876ff8c01ae4238b621ec86d2ba412251d',
  'user-timing-evidence.schema.json':
    'fd65940688627a4db75acf9c7d7cf8eba52f6e6db42ada0eb7dffd10e83a836b',
};

export const contractSchemaEntries: readonly ContractSchemaDefinition[] = [
  AnswerMaterialEvidenceContract,
  CatalogContract,
  ClientBundleEvidenceContract,
  ContentWorkManifestContract,
  FilesystemPublishEvidenceContract,
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
  PublishReceiptContract,
  ReleaseCandidateContract,
  UpdateManifestContract,
  UserTimingEvidenceContract,
].sort((left, right) => left.fileName.localeCompare(right.fileName));

export const generateContractJsonSchemas = (): Record<string, JsonSchemaDocument> =>
  Object.fromEntries(
    contractSchemaEntries.map((definition) => {
      // Force Zod to traverse every canonical runtime shape. The checked-in document
      // retains contract metadata and reference layout that Zod intentionally normalizes.
      z.toJSONSchema(definition.schema, { target: 'draft-2020-12' });
      if (
        canonicalDigest(definition.jsonSchema) !== canonicalContractDigests[definition.fileName]
      ) {
        throw new Error(
          `SCHEMA_SOURCE_DRIFT: ${definition.fileName} changed without a canonical shape update.`,
        );
      }
      return [definition.fileName, definition.jsonSchema];
    }),
  );

const contractsDirectory = path.resolve('specs/001-build-abc-textbook/contracts');

const run = async (): Promise<void> => {
  const checkOnly = process.argv.includes('--check');
  let drift = false;
  for (const [fileName, jsonSchema] of Object.entries(generateContractJsonSchemas())) {
    const contractPath = path.join(contractsDirectory, fileName);
    const next = `${JSON.stringify(jsonSchema, null, 2)}\n`;
    if (checkOnly) {
      const current = await readFile(contractPath, 'utf8');
      if (canonicalJson(JSON.parse(current) as unknown) !== canonicalJson(jsonSchema)) {
        drift = true;
        process.stderr.write(`SCHEMA_DRIFT: ${fileName}\n`);
      }
    } else {
      await writeFile(contractPath, next, 'utf8');
    }
  }
  if (drift) process.exitCode = 2;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await run();
}
