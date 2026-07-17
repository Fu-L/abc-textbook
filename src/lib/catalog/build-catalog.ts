import { CatalogContract } from '../domain/schema-parts/catalog.js';
import {
  deterministicTopologicalOrder,
  DomainValidationError,
  type ValidationDiagnostic,
} from '../validation/validate.js';

export class CatalogBuildError extends Error {
  readonly diagnostics: readonly ValidationDiagnostic[];

  constructor(diagnostics: readonly ValidationDiagnostic[]) {
    super(diagnostics.map(({ code, message }) => `${code}: ${message}`).join('\n'));
    this.name = 'CatalogBuildError';
    this.diagnostics = diagnostics;
  }
}

interface Entity {
  readonly id?: string;
  readonly problemId?: string;
}

interface CatalogLike {
  readonly advancedSlotRegistry: { readonly labels: readonly string[] };
  readonly contests: readonly {
    readonly id: string;
    readonly officialTaskOrder: readonly string[];
  }[];
  readonly contestSlots: readonly {
    readonly contestId: string;
    readonly label: string;
  }[];
  readonly problems: readonly { readonly id: string }[];
  readonly techniqueInventory: readonly { readonly problemId: string }[];
  readonly tags: readonly {
    readonly id: string;
    readonly prerequisiteTagIds: readonly string[];
  }[];
  readonly learningUnits: readonly {
    readonly id: string;
    readonly additionalPrerequisiteUnitIds: readonly string[];
    readonly stageRank: number;
    readonly difficultyRank: number;
    readonly representativeRank: number;
  }[];
  readonly [key: string]: unknown;
}

const entityArrayKeys = [
  'contests',
  'contestSlots',
  'problems',
  'techniqueInventory',
  'tags',
  'learningOutcomes',
  'learningUnits',
  'placements',
  'explanations',
  'sources',
  'correctionImpacts',
  'claims',
  'examples',
  'exercises',
  'assessments',
  'answerMaterials',
] as const;

const sortedEntities = (items: readonly Entity[]): readonly Entity[] =>
  [...items].sort((left, right) =>
    (left.id ?? left.problemId ?? '').localeCompare(right.id ?? right.problemId ?? ''),
  );

export const buildCatalog = (input: unknown, sourcePaths: readonly string[] = []): CatalogLike => {
  const stagingPath = sourcePaths.find(
    (sourcePath) =>
      sourcePath === 'staging' ||
      sourcePath.startsWith('staging/') ||
      sourcePath.includes('/staging/'),
  );
  if (stagingPath) {
    throw new CatalogBuildError([
      {
        code: 'STAGING_PUBLICATION_BOUNDARY',
        message: `Public catalog cannot read ${stagingPath}.`,
      },
    ]);
  }
  const parsed = CatalogContract.schema.safeParse(input);
  if (!parsed.success) {
    throw new CatalogBuildError([
      { code: 'CATALOG_SCHEMA_INVALID', message: parsed.error.message },
    ]);
  }
  const catalog = structuredClone(input) as CatalogLike;
  for (const key of entityArrayKeys) {
    const value = catalog[key];
    if (Array.isArray(value)) {
      (catalog as Record<string, unknown>)[key] = sortedEntities(value as Entity[]);
    }
  }
  const diagnostics = validateCatalogSemantics(catalog);
  if (diagnostics.length > 0) throw new CatalogBuildError(diagnostics);
  return Object.freeze(catalog);
};

export const validateCatalogSemantics = (catalog: CatalogLike): ValidationDiagnostic[] => {
  const diagnostics: ValidationDiagnostic[] = [];
  const problemIds = new Set(catalog.problems.map(({ id }) => id));
  const inventoryIds = new Set(catalog.techniqueInventory.map(({ problemId }) => problemId));
  for (const missing of [...problemIds].filter((id) => !inventoryIds.has(id))) {
    diagnostics.push({ code: 'TECHNIQUE_INVENTORY_MISSING', entityId: missing, message: missing });
  }
  for (const orphan of [...inventoryIds].filter((id) => !problemIds.has(id))) {
    diagnostics.push({ code: 'TECHNIQUE_INVENTORY_ORPHAN', entityId: orphan, message: orphan });
  }
  const slotKeys = new Set(
    catalog.contestSlots.map(({ contestId, label }) => `${contestId}:${label}`),
  );
  for (const contest of catalog.contests) {
    const d = contest.officialTaskOrder.indexOf('D');
    if (d < 0) {
      diagnostics.push({ code: 'D_TASK_NOT_FOUND', entityId: contest.id, message: contest.id });
      continue;
    }
    for (const label of catalog.advancedSlotRegistry.labels) {
      if (!slotKeys.has(`${contest.id}:${label}`)) {
        diagnostics.push({
          code: 'CONTEST_SLOT_STATE_MISSING',
          entityId: contest.id,
          message: `${contest.id}:${label}`,
        });
      }
    }
  }
  try {
    deterministicTopologicalOrder(
      catalog.tags.map((tag) => ({ id: tag.id, prerequisiteIds: tag.prerequisiteTagIds })),
    );
    deterministicTopologicalOrder(
      catalog.learningUnits.map((unit) => ({
        id: unit.id,
        prerequisiteIds: unit.additionalPrerequisiteUnitIds,
        ranks: [unit.stageRank, unit.difficultyRank, unit.representativeRank],
      })),
      (unit) => unit.ranks,
    );
  } catch (error) {
    diagnostics.push({
      code: error instanceof DomainValidationError ? error.code : 'CATALOG_DAG_INVALID',
      message: error instanceof Error ? error.message : String(error),
    });
  }
  return diagnostics.sort(
    (left, right) =>
      left.code.localeCompare(right.code) || left.message.localeCompare(right.message),
  );
};
