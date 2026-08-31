import { readFile } from 'node:fs/promises';
import path from 'node:path';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';

import {
  contractSchemaEntries,
  generateContractJsonSchemas,
} from '../../scripts/generate-json-schemas.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { validateContractValue } from '../../src/lib/domain/contract-schema.js';
import { CatalogContract } from '../../src/lib/domain/schema-parts/catalog.js';
import { LearningRecordContract } from '../../src/lib/domain/schema-parts/learning.js';
import {
  ReleaseMetadataContract,
  UpdateManifestContract,
} from '../../src/lib/domain/schema-parts/release.js';

const contractsDirectory = path.resolve('specs/001-build-abc-textbook/contracts');
const sha = (character: string): string => character.repeat(64);
const validReleaseMetadata = {
  schemaVersion: '1.0.0',
  version: '2026.07.17',
  cutoffAt: '2026-07-17T12:00:00+09:00',
  commit: 'a'.repeat(40),
  changeSummary: {
    updateIds: ['update-phase-two'],
    addedProblemIds: ['abc212-e'],
    changedProblemIds: [],
    withdrawnProblemIds: [],
    taxonomyChanges: [],
  },
  validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
} as const;

describe('canonical Zod and JSON Schema parity', () => {
  it('does not read checked-in JSON contracts back into canonical schema modules', async () => {
    const schemaPartDirectory = path.resolve('src/lib/domain/schema-parts');
    for (const fileName of [
      'catalog.ts',
      'learning.ts',
      'release.ts',
      'review-evidence.ts',
      'verification-evidence.ts',
    ]) {
      const source = await readFile(path.join(schemaPartDirectory, fileName), 'utf8');
      expect(source, fileName).not.toMatch(/schema\.json.*with\s*\{\s*type:\s*['"]json['"]/u);
      expect(source, fileName).not.toContain('zodFromContractSchema');
      expect(source, fileName).not.toContain('defineContractSchema');
    }
  });

  it('owns every JSON contract in the five schema-part modules', async () => {
    const generated = generateContractJsonSchemas();

    expect(Object.keys(generated).sort()).toEqual(
      contractSchemaEntries.map(({ fileName }) => fileName).sort(),
    );

    for (const [fileName, schema] of Object.entries(generated)) {
      const committed = JSON.parse(
        await readFile(path.join(contractsDirectory, fileName), 'utf8'),
      ) as unknown;

      expect(canonicalJson(schema), fileName).toBe(canonicalJson(committed));
      const rootIsStrict = schema.type === 'object' && schema.additionalProperties === false;
      const referencedRootsAreStrict =
        ('$ref' in schema || 'oneOf' in schema) &&
        Object.values((schema.$defs ?? {}) as Record<string, Record<string, unknown>>).some(
          (definition) => definition.type === 'object' && definition.additionalProperties === false,
        );
      expect(rootIsStrict || referencedRootsAreStrict, fileName).toBe(true);

      const intentionallyEdited = structuredClone(committed) as Record<string, unknown>;
      intentionallyEdited.title = 'intentionally drifted contract';
      expect(canonicalJson(schema), `${fileName} drift sentinel`).not.toBe(
        canonicalJson(intentionallyEdited),
      );
    }
    expect(contractSchemaEntries).toHaveLength(18);
    expect(contractSchemaEntries.map(({ semanticValidation }) => semanticValidation)).toEqual(
      Array.from({ length: 18 }, () => 'canonical-zod'),
    );
  });

  it('routes semantic collection invariants through the canonical validator', () => {
    const duplicateRecords = {
      schemaVersion: '1.0.0',
      exportedAt: '2026-07-17T12:00:00+09:00',
      catalogVersionAtExport: '2026.07.17',
      records: [
        {
          problemId: 'abc212-e',
          status: 'unstarted',
          statusUpdatedAt: null,
          needsReview: false,
          needsReviewUpdatedAt: null,
        },
        {
          problemId: 'abc212-e',
          status: 'completed',
          statusUpdatedAt: '2026-07-17T12:00:00+09:00',
          needsReview: true,
          needsReviewUpdatedAt: '2026-07-17T12:00:00+09:00',
        },
      ],
      orphanedProblemIds: [],
    };
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validateJsonSchema = ajv.compile(LearningRecordContract.jsonSchema);

    // JSON Schema cannot express uniqueness by a nested problemId property.
    expect(validateJsonSchema(duplicateRecords)).toBe(true);
    expect(validateContractValue(LearningRecordContract, duplicateRecords)).toBe(false);
  });

  it('publishes T159 staging definitions without widening the public Catalog root', () => {
    const properties = CatalogContract.jsonSchema.properties as Record<string, unknown>;
    const definitions = CatalogContract.jsonSchema.$defs as Record<string, unknown>;

    expect(Object.keys(properties).sort()).toEqual(
      [
        'schemaVersion',
        'release',
        'advancedSlotRegistry',
        'contests',
        'contestGaps',
        'contestSlots',
        'problems',
        'techniqueInventory',
        'tags',
        'learningOutcomes',
        'learningUnits',
        'placements',
        'authoringUnits',
        'sources',
        'correctionImpacts',
      ].sort(),
    );
    expect(properties).not.toHaveProperty('finalTaxonomyBuild');
    expect(properties).not.toHaveProperty('taxonomyIntegrationMap');
    expect(definitions).toHaveProperty('FinalTaxonomyBuild');
    expect(definitions).toHaveProperty('TaxonomyIntegrationMap');
    expect(definitions).toHaveProperty('LearningUnitTaxonomyCandidate');

    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    ajv.addSchema(CatalogContract.jsonSchema);
    expect(
      ajv.getSchema(
        'https://abc-textbook.local/schemas/catalog.schema.json#/$defs/FinalTaxonomyBuild',
      ),
    ).toBeTypeOf('function');
    expect(
      ajv.getSchema(
        'https://abc-textbook.local/schemas/catalog.schema.json#/$defs/TaxonomyIntegrationMap',
      ),
    ).toBeTypeOf('function');
  });

  it('gives Zod and Ajv the same answer for valid, unknown-field, and duplicate inputs', () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validateJsonSchema = ajv.compile(ReleaseMetadataContract.jsonSchema);
    const cases = [
      { value: validReleaseMetadata, expected: true },
      { value: { ...validReleaseMetadata, unexpectedPhaseTwoField: true }, expected: false },
      { value: { ...validReleaseMetadata, commit: 'a'.repeat(12) }, expected: false },
      {
        value: { ...validReleaseMetadata, validationResultsUrl: 'http://example.test/results' },
        expected: false,
      },
      { value: { ...validReleaseMetadata, validationResultsUrl: 'https://[' }, expected: false },
      {
        value: {
          ...validReleaseMetadata,
          changeSummary: {
            ...validReleaseMetadata.changeSummary,
            updateIds: ['update-phase-two', 'update-phase-two'],
          },
        },
        expected: false,
      },
    ];

    for (const { value, expected } of cases) {
      expect(ReleaseMetadataContract.schema.safeParse(value).success).toBe(expected);
      expect(validateJsonSchema(value)).toBe(expected);
    }

    expect(
      ReleaseMetadataContract.schema.safeParse({
        ...validReleaseMetadata,
        changeSummary: {
          ...validReleaseMetadata.changeSummary,
          changedProblemIds: ['abc212-e'],
        },
      }).success,
    ).toBe(false);
  });

  it('keeps ELIGIBLE update conditional failures aligned between Zod and Ajv', () => {
    const update = {
      schemaVersion: '2.0.0',
      updateId: 'update-phase-two',
      kind: 'bootstrap',
      baseReleaseVersion: null,
      contestId: null,
      sourceSetFingerprint: sha('1'),
      advancedSlotLabels: ['E'],
      targetProblemIds: ['abc212-e'],
      operations: [
        {
          operationId: 'operation-problem',
          entityType: 'problem',
          entityId: 'abc212-e',
          action: 'add',
          path: 'src/content/problems/abc212-e.json',
          beforeDigest: null,
          afterDigest: sha('2'),
          affectedEntities: [],
          affectedProblemIds: ['abc212-e'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-e',
          slotLabel: 'E',
          resultType: 'blocked',
          draftPath: null,
          packetPath: null,
          templatePath: null,
          reasonCode: 'SOURCE_UNAVAILABLE',
          reason: 'Source unavailable.',
          retryCondition: 'Retry later.',
        },
      ],
      correctionImpactIds: [],
      validationSummary: {
        checkIds: ['check-contracts'],
        problemResults: [
          { problemId: 'abc212-e', passed: true, findingCodes: [], remediation: null },
        ],
        blockingFindingCount: 0,
        aggregatePassed: true,
        resultDigest: sha('3'),
      },
      state: 'ELIGIBLE_FOR_BATCH',
      createdAt: '2026-07-17T12:00:00+09:00',
      updatedAt: '2026-07-17T12:00:00+09:00',
      fixtureMode: false,
    } as const;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validateJsonSchema = ajv.compile(UpdateManifestContract.jsonSchema);
    expect(UpdateManifestContract.schema.safeParse(update).success).toBe(false);
    expect(validateJsonSchema(update)).toBe(false);
  });
});
