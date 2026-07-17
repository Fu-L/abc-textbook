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
