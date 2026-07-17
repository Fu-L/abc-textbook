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
import {
  ReleaseCandidateContract,
  UpdateManifestContract,
} from '../../src/lib/domain/schema-parts/release.js';

const contractsDirectory = path.resolve('specs/001-build-abc-textbook/contracts');
const sha = (character: string): string => character.repeat(64);
const validDraftCandidate = {
  schemaVersion: '2.0.0',
  candidateId: 'release-candidate-2026.07.17-aaaaaaaaaaaa',
  releaseKind: 'initial',
  targetReleaseVersion: '2026.07.17',
  baseReleaseVersion: null,
  cutoffAt: '2026-07-17T12:00:00+09:00',
  orderedUpdateIds: ['update-phase-two'],
  fixtureMode: false,
  advancedSlotRegistryDigest: sha('1'),
  contentFiles: [],
  contentSubjectDigest: sha('2'),
  preJudgmentCheckRefs: [],
  humanContentReviewEvidenceRefs: [],
  blockingFindings: [],
  candidateFiles: [],
  candidatePayloadDigest: null,
  approvableDigest: null,
  ownerApproval: null,
  publicationEffectiveAt: null,
  publicationWindowEndsAt: null,
  state: 'DRAFTED',
  createdAt: '2026-07-17T12:00:00+09:00',
  updatedAt: '2026-07-17T12:00:00+09:00',
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
        'oneOf' in schema &&
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
  });

  it('gives Zod and Ajv the same answer for valid, unknown-field, and duplicate inputs', () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validateJsonSchema = ajv.compile(ReleaseCandidateContract.jsonSchema);
    const cases = [
      { value: validDraftCandidate, expected: true },
      { value: { ...validDraftCandidate, unexpectedPhaseTwoField: true }, expected: false },
      {
        value: {
          ...validDraftCandidate,
          orderedUpdateIds: ['update-phase-two', 'update-phase-two'],
        },
        expected: false,
      },
    ];

    for (const { value, expected } of cases) {
      expect(ReleaseCandidateContract.schema.safeParse(value).success).toBe(expected);
      expect(validateJsonSchema(value)).toBe(expected);
    }
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
      operations: [
        {
          operationId: 'operation-problem',
          entityType: 'problem',
          entityId: 'abc212-e',
          action: 'add',
          path: 'src/content/problems/abc212-e.json',
          beforeDigest: null,
          afterDigest: sha('2'),
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
