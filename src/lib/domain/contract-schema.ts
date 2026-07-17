import { z } from 'zod';

export type JsonSchemaDocument = Readonly<Record<string, unknown>>;

export interface ContractSchemaDefinition {
  readonly fileName: `${string}.schema.json`;
  readonly schema: z.ZodType;
  readonly jsonSchema: JsonSchemaDocument;
  readonly reuseJsonSchemaReferences?: boolean;
}

export const defineZodContractSchema = (
  fileName: ContractSchemaDefinition['fileName'],
  schema: z.ZodType,
  metadata: Readonly<Record<string, unknown>> = {},
): ContractSchemaDefinition => {
  const annotatedSchema = schema.meta(metadata);
  return {
    fileName,
    schema: annotatedSchema,
    jsonSchema: z.toJSONSchema(annotatedSchema, {
      target: 'draft-2020-12',
      reused: 'ref',
    }),
    reuseJsonSchemaReferences: true,
  };
};

export const strictObject = <Shape extends z.ZodRawShape>(shape: Shape): z.ZodObject<Shape> =>
  z.strictObject(shape);

const structuralJsonKey = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(structuralJsonKey).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${JSON.stringify(key)}:${structuralJsonKey(item)}`)
    .join(',')}}`;
};

/** Keep Zod runtime validation aligned with JSON Schema's uniqueItems semantics. */
export const uniqueArray = <T extends z.ZodType>(schema: T): z.ZodArray<T> =>
  z
    .array(schema)
    .refine(
      (items) => new Set(items.map(structuralJsonKey)).size === items.length,
      'Array items must be unique.',
    )
    .meta({ uniqueItems: true });
