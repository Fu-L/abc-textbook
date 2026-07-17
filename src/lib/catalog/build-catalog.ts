import { CatalogContract } from '../domain/schema-parts/catalog.js';
import { stableProblemId } from '../domain/identity.js';
import { hasStagingPathSegment } from './publication-boundary.js';
import { buildAdvancedSlotRegistry } from './advanced-slot-registry.js';
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
  readonly problemId?: string | null;
  readonly contestId?: string;
  readonly label?: string;
  readonly officialOrder?: number | null;
}

interface CatalogLike {
  readonly release: {
    readonly advancedSlotRegistryDigest: string;
    readonly firstContestId: string;
    readonly lastContestId: string;
    readonly contestCount: number;
    readonly problemCount: number;
    readonly slotRecordCount: number;
  };
  readonly advancedSlotRegistry: {
    readonly labels: readonly string[];
    readonly firstSeenContestByLabel: Readonly<Record<string, string>>;
    readonly orderEvidenceSourceRevisionIds: readonly string[];
    readonly digest: string;
  };
  readonly contests: readonly {
    readonly id: string;
    readonly number: number;
    readonly officialTaskOrder: readonly string[];
    readonly taskOrderSourceRevisionId: string;
  }[];
  readonly contestSlots: readonly {
    readonly contestId: string;
    readonly label: string;
    readonly officialOrder: number | null;
    readonly availability: 'exists' | 'official_absent' | 'unknown' | 'withdrawn';
    readonly problemId?: string | null;
  }[];
  readonly problems: readonly {
    readonly id: string;
    readonly contestId?: string;
    readonly slotLabel?: string;
  }[];
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

export const sortCatalogEntityArray = (
  key: (typeof entityArrayKeys)[number],
  items: readonly Entity[],
): readonly Entity[] =>
  [...items].sort((left, right) => {
    if (key === 'contestSlots') {
      return (
        (left.contestId ?? '').localeCompare(right.contestId ?? '') ||
        (left.officialOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.officialOrder ?? Number.MAX_SAFE_INTEGER) ||
        (left.label ?? '').localeCompare(right.label ?? '') ||
        (left.problemId ?? '').localeCompare(right.problemId ?? '')
      );
    }
    const leftKey = key === 'techniqueInventory' ? left.problemId : left.id;
    const rightKey = key === 'techniqueInventory' ? right.problemId : right.id;
    return (leftKey ?? '').localeCompare(rightKey ?? '');
  });

export const buildCatalog = (input: unknown, sourcePaths: readonly string[] = []): CatalogLike => {
  const stagingPath = sourcePaths.find(hasStagingPathSegment);
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
      (catalog as Record<string, unknown>)[key] = sortCatalogEntityArray(key, value as Entity[]);
    }
  }
  const diagnostics = validateCatalogSemantics(catalog);
  if (diagnostics.length > 0) throw new CatalogBuildError(diagnostics);
  return Object.freeze(catalog);
};

export const validateCatalogSemantics = (catalog: CatalogLike): ValidationDiagnostic[] => {
  const diagnostics: ValidationDiagnostic[] = [];
  const contestIds = new Set(catalog.contests.map(({ id }) => id));
  if (contestIds.size !== catalog.contests.length) {
    diagnostics.push({ code: 'DUPLICATE_CONTEST_ID', message: 'Contest IDs must be unique.' });
  }
  if (catalog.release.contestCount !== catalog.contests.length) {
    diagnostics.push({
      code: 'CONTEST_COUNT_MISMATCH',
      message: 'release.contestCount does not match contests.',
    });
  }
  if (catalog.release.problemCount !== catalog.problems.length) {
    diagnostics.push({
      code: 'PROBLEM_COUNT_MISMATCH',
      message: 'release.problemCount does not match problems.',
    });
  }
  if (catalog.release.slotRecordCount !== catalog.contestSlots.length) {
    diagnostics.push({
      code: 'SLOT_RECORD_COUNT_MISMATCH',
      message: 'release.slotRecordCount does not match contestSlots.',
    });
  }
  if (catalog.release.advancedSlotRegistryDigest !== catalog.advancedSlotRegistry.digest) {
    diagnostics.push({
      code: 'REGISTRY_DIGEST_MISMATCH',
      message: 'Release registry digest is stale.',
    });
  }
  const contestNumbers = [...catalog.contests].map(({ number }) => number).sort((a, b) => a - b);
  const firstNumber = Number(
    /^abc(?<number>[0-9]+)$/u.exec(catalog.release.firstContestId)?.groups?.number,
  );
  const lastNumber = Number(
    /^abc(?<number>[0-9]+)$/u.exec(catalog.release.lastContestId)?.groups?.number,
  );
  const expectedNumbers =
    Number.isInteger(firstNumber) && Number.isInteger(lastNumber) && lastNumber >= firstNumber
      ? Array.from(
          { length: lastNumber - firstNumber + 1 },
          (_unused, index) => firstNumber + index,
        )
      : [];
  if (
    expectedNumbers.length !== catalog.contests.length ||
    expectedNumbers.some((number, index) => contestNumbers[index] !== number) ||
    catalog.contests.some(({ id, number }) => id !== `abc${String(number)}`)
  ) {
    diagnostics.push({
      code: 'CONTEST_RANGE_INCOMPLETE',
      message: 'Contest range must be continuous and agree with release bounds.',
    });
  }
  if (catalog.release.firstContestId !== 'abc212') {
    diagnostics.push({
      code: 'CATALOG_START_CONTEST_INVALID',
      message: 'The public catalog must start at ABC 212.',
    });
  }
  const problemIds = new Set(catalog.problems.map(({ id }) => id));
  if (problemIds.size !== catalog.problems.length) {
    diagnostics.push({
      code: 'DUPLICATE_PROBLEM_ID',
      message: 'Problem IDs must be unique across the registry.',
    });
  }
  for (const problem of catalog.problems) {
    if (
      problem.contestId &&
      problem.slotLabel &&
      stableProblemId(problem.contestId, problem.slotLabel) !== problem.id
    ) {
      diagnostics.push({
        code: 'UNSTABLE_PROBLEM_ID',
        entityId: problem.id,
        message: `${problem.contestId}:${problem.slotLabel}`,
      });
    }
  }
  const inventoryIds = new Set(catalog.techniqueInventory.map(({ problemId }) => problemId));
  for (const missing of [...problemIds].filter((id) => !inventoryIds.has(id))) {
    diagnostics.push({ code: 'TECHNIQUE_INVENTORY_MISSING', entityId: missing, message: missing });
  }
  for (const orphan of [...inventoryIds].filter((id) => !problemIds.has(id))) {
    diagnostics.push({ code: 'TECHNIQUE_INVENTORY_ORPHAN', entityId: orphan, message: orphan });
  }
  const slotKeys = new Set<string>();
  for (const slot of catalog.contestSlots) {
    const key = `${slot.contestId}:${slot.label}`;
    if (slotKeys.has(key)) {
      diagnostics.push({ code: 'DUPLICATE_CONTEST_SLOT', entityId: slot.contestId, message: key });
    }
    slotKeys.add(key);
    if (!contestIds.has(slot.contestId)) {
      diagnostics.push({ code: 'CONTEST_SLOT_ORPHAN', entityId: slot.contestId, message: key });
    }
    if (!catalog.advancedSlotRegistry.labels.includes(slot.label)) {
      diagnostics.push({
        code: 'CONTEST_SLOT_LABEL_NOT_REGISTERED',
        entityId: slot.contestId,
        message: key,
      });
    }
    if (
      slot.problemId !== null &&
      slot.problemId !== undefined &&
      !problemIds.has(slot.problemId)
    ) {
      diagnostics.push({
        code: 'CONTEST_SLOT_PROBLEM_ORPHAN',
        entityId: slot.problemId,
        message: key,
      });
    }
  }
  const slottedProblemIds = new Set(
    catalog.contestSlots.flatMap(({ problemId }) => (problemId ? [problemId] : [])),
  );
  for (const problemId of problemIds) {
    if (!slottedProblemIds.has(problemId)) {
      diagnostics.push({ code: 'PROBLEM_SLOT_MISSING', entityId: problemId, message: problemId });
    }
  }
  for (const problem of catalog.problems) {
    const matchingSlot = catalog.contestSlots.find(
      (slot) => slot.contestId === problem.contestId && slot.label === problem.slotLabel,
    );
    if (matchingSlot?.problemId !== problem.id) {
      diagnostics.push({
        code: 'PROBLEM_SLOT_MISMATCH',
        entityId: problem.id,
        message: problem.id,
      });
    }
  }
  for (const contest of catalog.contests) {
    const d = contest.officialTaskOrder.indexOf('D');
    if (d < 0) {
      diagnostics.push({ code: 'D_TASK_NOT_FOUND', entityId: contest.id, message: contest.id });
      continue;
    }
    const advancedLabels = contest.officialTaskOrder.slice(d + 1);
    for (const label of catalog.advancedSlotRegistry.labels) {
      const key = `${contest.id}:${label}`;
      const matchingSlots = catalog.contestSlots.filter(
        (slot) => slot.contestId === contest.id && slot.label === label,
      );
      if (!slotKeys.has(key)) {
        diagnostics.push({
          code: 'CONTEST_SLOT_STATE_MISSING',
          entityId: contest.id,
          message: `${contest.id}:${label}`,
        });
        continue;
      }
      const slot = matchingSlots[0];
      if (!slot) continue;
      const officialOrder = contest.officialTaskOrder.indexOf(label);
      if (officialOrder >= 0) {
        if (slot.availability === 'official_absent' || slot.officialOrder !== officialOrder) {
          diagnostics.push({
            code: 'CONTEST_SLOT_OFFICIAL_MISMATCH',
            entityId: contest.id,
            message: key,
          });
        }
      } else if (slot.availability === 'exists' || slot.officialOrder !== null) {
        diagnostics.push({
          code: 'CONTEST_SLOT_ABSENCE_MISMATCH',
          entityId: contest.id,
          message: key,
        });
      }
    }
    for (const label of advancedLabels) {
      if (!catalog.advancedSlotRegistry.labels.includes(label)) {
        diagnostics.push({
          code: 'REGISTRY_LABEL_MISSING',
          entityId: contest.id,
          message: `${contest.id}:${label}`,
        });
      }
    }
  }
  try {
    const rebuiltRegistry = buildAdvancedSlotRegistry({
      contests: [...catalog.contests]
        .sort((left, right) => left.number - right.number)
        .map((contest) => ({
          contestId: contest.id,
          advancedLabels: contest.officialTaskOrder.slice(
            contest.officialTaskOrder.indexOf('D') + 1,
          ),
          sourceRevisionId: contest.taskOrderSourceRevisionId,
        })),
    });
    if (
      JSON.stringify(rebuiltRegistry.labels) !==
        JSON.stringify(catalog.advancedSlotRegistry.labels) ||
      JSON.stringify(rebuiltRegistry.firstSeenContestByLabel) !==
        JSON.stringify(catalog.advancedSlotRegistry.firstSeenContestByLabel) ||
      JSON.stringify(rebuiltRegistry.orderEvidenceSourceRevisionIds) !==
        JSON.stringify(catalog.advancedSlotRegistry.orderEvidenceSourceRevisionIds)
    ) {
      diagnostics.push({
        code: 'REGISTRY_REBUILD_MISMATCH',
        message: 'Registry does not match official contest task orders.',
      });
    }
  } catch (error) {
    diagnostics.push({
      code: 'REGISTRY_REBUILD_FAILED',
      message: error instanceof Error ? error.message : String(error),
    });
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
