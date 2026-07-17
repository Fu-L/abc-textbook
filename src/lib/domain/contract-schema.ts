import { z } from 'zod';

export type JsonSchemaDocument = Readonly<Record<string, unknown>>;

export interface ContractSchemaDefinition {
  readonly fileName: `${string}.schema.json`;
  readonly schema: z.ZodType;
  readonly jsonSchema: JsonSchemaDocument;
}

const removeUnsupportedJsonSchemaKeywords = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(removeUnsupportedJsonSchemaKeywords);
  if (value !== null && typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const converted = Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(
          ([key, item]) =>
            !['if', 'then', 'else'].includes(key) && !(key === 'format' && item === 'date-time'),
        )
        .map(([key, item]) => [key, removeUnsupportedJsonSchemaKeywords(item)]),
    );
    if (input.format === 'date-time' && !('pattern' in input)) {
      converted.pattern =
        '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,9})?(?:Z|[+-]\\d{2}:\\d{2})$';
    }
    return converted;
  }
  return value;
};

export const zodFromContractSchema = (jsonSchema: JsonSchemaDocument): z.ZodType =>
  z.fromJSONSchema(removeUnsupportedJsonSchemaKeywords(jsonSchema) as JsonSchemaDocument);

export const defineContractSchema = (
  fileName: ContractSchemaDefinition['fileName'],
  jsonSchema: JsonSchemaDocument,
): ContractSchemaDefinition => ({
  fileName,
  schema: zodFromContractSchema(jsonSchema),
  jsonSchema,
});

export const strictObject = <Shape extends z.ZodRawShape>(shape: Shape): z.ZodObject<Shape> =>
  z.strictObject(shape);
