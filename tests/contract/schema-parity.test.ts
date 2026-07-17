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
    }
  });

  it.each(contractSchemaEntries)('$fileName rejects unknown top-level fields', ({ schema }) => {
    const result = schema.safeParse({ unexpectedPhaseTwoField: true });

    expect(result.success).toBe(false);
  });
});
