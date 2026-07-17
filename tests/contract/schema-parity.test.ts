import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  contractSchemaEntries,
  generateContractJsonSchemas,
} from '../../scripts/generate-json-schemas.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';

const contractsDirectory = path.resolve('specs/001-build-abc-textbook/contracts');

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

  it.each(contractSchemaEntries)('$fileName rejects unknown top-level fields', ({ schema }) => {
    const result = schema.safeParse({ unexpectedPhaseTwoField: true });

    expect(result.success).toBe(false);
  });
});
