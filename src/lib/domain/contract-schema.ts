import Ajv2020, { type ErrorObject } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { z } from 'zod';

import { isOffsetDateTime } from './date-time.js';

export type JsonSchemaDocument = Readonly<Record<string, unknown>>;

export interface ContractSchemaDefinition {
  readonly fileName: `${string}.schema.json`;
  readonly schema: z.ZodType;
  readonly jsonSchema: JsonSchemaDocument;
  readonly reuseJsonSchemaReferences?: boolean;
}

const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
ajv.addFormat('date-time', { type: 'string', validate: isOffsetDateTime });

const formatAjvError = (error: ErrorObject): string =>
  `${error.instancePath || '/'} ${error.message ?? error.keyword}`;

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

export const zodFromContractSchema = (jsonSchema: JsonSchemaDocument): z.ZodType => {
  const structuralSchema = z.fromJSONSchema(
    removeUnsupportedJsonSchemaKeywords(jsonSchema) as JsonSchemaDocument,
  );
  const validateJsonSchema = ajv.compile(jsonSchema);
  return structuralSchema
    .superRefine((value, context) => {
      if (validateJsonSchema(value)) return;
      for (const error of validateJsonSchema.errors ?? []) {
        context.addIssue({ code: 'custom', message: formatAjvError(error) });
      }
    })
    .meta(jsonSchema);
};

export const defineContractSchema = (
  fileName: ContractSchemaDefinition['fileName'],
  jsonSchema: JsonSchemaDocument,
): ContractSchemaDefinition => ({
  fileName,
  schema: zodFromContractSchema(jsonSchema),
  jsonSchema,
});

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
