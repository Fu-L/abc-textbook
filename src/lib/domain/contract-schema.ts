import { z } from 'zod';

export type JsonSchemaDocument = Readonly<Record<string, unknown>>;

export interface ContractSchemaDefinition {
  readonly fileName: `${string}.schema.json`;
  readonly schema: z.ZodType;
  readonly jsonSchema: JsonSchemaDocument;
  /** JSON Schema covers structural constraints; canonical Zod owns semantic checks. */
  readonly semanticValidation: 'canonical-zod';
  readonly reuseJsonSchemaReferences?: boolean;
}

const CONTRACT_ROOT_DEFINITION = '__contractRoot';

const contractJsonSchema = (
  schema: z.ZodType,
  supplementalSchemas: Readonly<Record<string, z.ZodType>>,
): JsonSchemaDocument => {
  if (Object.keys(supplementalSchemas).length === 0) {
    return z.toJSONSchema(schema, {
      target: 'draft-2020-12',
      reused: 'ref',
    });
  }

  if (Object.hasOwn(supplementalSchemas, CONTRACT_ROOT_DEFINITION)) {
    throw new Error(`${CONTRACT_ROOT_DEFINITION} is reserved for the contract root schema.`);
  }

  const bundleShape = Object.fromEntries([
    [CONTRACT_ROOT_DEFINITION, schema.meta({ id: CONTRACT_ROOT_DEFINITION })],
    ...Object.entries(supplementalSchemas).map(([name, supplementalSchema]) => [
      name,
      supplementalSchema.meta({ id: name }),
    ]),
  ]) as z.ZodRawShape;
  const bundle = z.toJSONSchema(z.strictObject(bundleShape), {
    target: 'draft-2020-12',
    reused: 'ref',
  }) as JsonSchemaDocument;
  const definitions = bundle.$defs;
  if (definitions === null || typeof definitions !== 'object' || Array.isArray(definitions)) {
    throw new Error('Supplemental contract schemas did not produce JSON Schema definitions.');
  }
  const { [CONTRACT_ROOT_DEFINITION]: root, ...supplementalDefinitions } = definitions as Record<
    string,
    unknown
  >;
  if (root === null || typeof root !== 'object' || Array.isArray(root)) {
    throw new Error('Contract root JSON Schema definition is missing.');
  }

  return {
    $schema: bundle.$schema,
    ...(root as Readonly<Record<string, unknown>>),
    $defs: supplementalDefinitions,
  };
};

export const defineZodContractSchema = (
  fileName: ContractSchemaDefinition['fileName'],
  schema: z.ZodType,
  metadata: Readonly<Record<string, unknown>> = {},
  supplementalSchemas: Readonly<Record<string, z.ZodType>> = {},
): ContractSchemaDefinition => {
  const annotatedSchema = schema.meta({
    ...metadata,
    $comment:
      metadata.$comment ??
      'Structural constraints are defined here; cross-field and collection invariants are enforced by the canonical Zod runtime validator.',
  });
  return {
    fileName,
    schema: annotatedSchema,
    jsonSchema: contractJsonSchema(annotatedSchema, supplementalSchemas),
    semanticValidation: 'canonical-zod',
    reuseJsonSchemaReferences: true,
  };
};

/** The single runtime entry point for cross-field and collection invariants. */
export const validateContractValue = (
  definition: Pick<ContractSchemaDefinition, 'schema'>,
  value: unknown,
): boolean => definition.schema.safeParse(value).success;

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
