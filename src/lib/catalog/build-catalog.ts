import { CatalogContract, parseAtCoderContestResourceUrl } from '../domain/schema-parts/catalog.js';
import { canonicalDigest } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
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
  readonly additionalPrerequisiteUnitIds?: readonly string[];
  readonly stageRank?: number;
  readonly difficultyRank?: number;
  readonly representativeRank?: number;
}

export interface TrustedCatalogReleaseEvidenceInventory {
  readonly subjectDigest: string;
  readonly checks: readonly {
    readonly checkId: string;
    readonly command: string;
    readonly subjectDigest: string;
    readonly resultPath: string;
    readonly resultDigest: string;
    readonly exitCode: number;
    readonly passed: boolean;
    readonly completedAt: string;
  }[];
  readonly reviews: readonly {
    readonly evidenceId: string;
    readonly path: string;
    readonly digest: string;
    readonly subjectDigest: string;
    readonly authorIds: readonly string[];
    readonly reviewerIds: readonly string[];
    readonly reviewMode: 'self' | 'third_party';
    readonly aggregatePassed: boolean;
  }[];
}

export interface CatalogLike {
  readonly schemaVersion: '3.0.0';
  readonly release: {
    readonly version: string;
    readonly releaseKind: 'initial' | 'incremental';
    readonly advancedSlotRegistryDigest: string;
    readonly cutoffAt: string;
    readonly validatedAt: string;
    readonly publicationEffectiveAt: string;
    readonly manifestDigest: string;
    readonly contentFileInventoryDigest: string;
    readonly contentSnapshotDigest: string;
    readonly updateIds: readonly string[];
    readonly firstContestId: string;
    readonly lastContestId: string;
    readonly contestCount: number;
    readonly problemCount: number;
    readonly slotRecordCount: number;
    readonly validationSummary: {
      readonly checkCount: number;
      readonly passedCheckCount: number;
      readonly blockingFindingCount: number;
      readonly evidenceDigests: readonly string[];
      readonly checks: readonly {
        readonly checkId: string;
        readonly command: string;
        readonly subjectDigest: string;
        readonly resultPath: string;
        readonly resultDigest: string;
        readonly exitCode: number;
        readonly passed: boolean;
        readonly completedAt: string;
      }[];
    };
    readonly humanContentReviewEvidenceRefs: readonly {
      readonly evidenceId: string;
      readonly path: string;
      readonly digest: string;
      readonly subjectDigest: string;
      readonly authorIds: readonly string[];
      readonly reviewerIds: readonly string[];
      readonly reviewMode: 'self' | 'third_party';
      readonly aggregatePassed: boolean;
    }[];
    readonly addedProblemIds: readonly string[];
    readonly changedProblemIds: readonly string[];
    readonly heldProblemIds: readonly string[];
    readonly withdrawnProblemIds: readonly string[];
    readonly taxonomyChanges: readonly unknown[];
    readonly changelogPath: string;
  };
  readonly advancedSlotRegistry: {
    readonly version: '1.0.0';
    readonly labels: readonly string[];
    readonly firstSeenContestByLabel: Readonly<Record<string, string>>;
    readonly orderEvidenceSourceRevisionIds: readonly string[];
    readonly digest: string;
  };
  readonly contests: readonly {
    readonly id: string;
    readonly number: number;
    readonly startedAt: string;
    readonly endedAt: string;
    readonly officialTaskOrder: readonly string[];
    readonly taskOrderSourceRevisionId: string;
  }[];
  readonly contestSlots: readonly {
    readonly contestId: string;
    readonly label: string;
    readonly officialOrder: number | null;
    readonly availability: 'exists' | 'official_absent' | 'unknown' | 'withdrawn';
    readonly problemId: string | null;
    readonly sourceRevisionId: string;
  }[];
  readonly problems: readonly {
    readonly id: string;
    readonly contestId: string;
    readonly slotLabel: string;
    readonly publicationStatus: string;
    readonly sourceRevisionIds: readonly string[];
    readonly primaryTagIds: readonly string[];
    readonly secondaryTagIds: readonly string[];
    readonly placementId: string | null;
  }[];
  readonly techniqueInventory: readonly {
    readonly problemId: string;
    readonly sourceRevisionIds: readonly string[];
  }[];
  readonly tags: readonly {
    readonly id: string;
    readonly name: string;
    readonly aliases: readonly string[];
    readonly formerNames: readonly string[];
    readonly lifecycle: 'active' | 'deprecated';
    readonly prerequisiteTagIds: readonly string[];
    readonly parentId: string | null;
    readonly learningOutcomeIds: readonly string[];
    readonly representativeProblemIds: readonly string[];
    readonly replacementTagIds: readonly string[];
  }[];
  readonly learningUnits: readonly {
    readonly id: string;
    readonly sourceRevisionIds: readonly string[];
    readonly additionalPrerequisiteUnitIds: readonly string[];
    readonly stageRank: number;
    readonly difficultyRank: number;
    readonly representativeRank: number;
    readonly globalIndex: number;
    readonly parentId: string | null;
    readonly tagIds: readonly string[];
    readonly learningOutcomeIds: readonly string[];
    readonly problemIds: readonly string[];
    readonly examples: readonly {
      readonly key: string;
      readonly learningOutcomeIds: readonly string[];
      readonly kind: 'executable' | 'pseudocode' | 'illustrative';
      readonly verificationStatus: 'pending' | 'passed' | 'not_applicable' | 'failed';
    }[];
  }[];
  readonly learningOutcomes: readonly {
    readonly id: string;
    readonly prerequisiteOutcomeIds: readonly string[];
    readonly scopeIds: readonly string[];
  }[];
  readonly placements: readonly {
    readonly id: string;
    readonly problemId: string;
    readonly kind: 'full' | 'similar' | 'supplement';
    readonly primaryProblemId: string | null;
    readonly sharedOutcomeIds: readonly string[];
    readonly additionalElement: string | null;
    readonly evidenceIds: readonly string[];
  }[];
  readonly authoringUnits: readonly {
    readonly problemId: string;
    readonly kind: 'full' | 'similar' | 'supplement';
    readonly primaryProblemId: string | null;
    readonly learningOutcomeIds: readonly string[];
    readonly additionalPrerequisiteUnitIds: readonly string[];
    readonly tagIds: readonly string[];
    readonly sourceRevisionIds: readonly string[];
    readonly claims: readonly {
      readonly key: string;
      readonly sourceRevisionIds: readonly string[];
      readonly verificationStatus: 'verified' | 'unverified' | 'stale' | 'contradicted';
    }[];
    readonly examples: readonly {
      readonly key: string;
      readonly learningOutcomeIds: readonly string[];
      readonly learningUnitIds: readonly string[];
      readonly kind: 'executable' | 'pseudocode' | 'illustrative';
      readonly verificationStatus: 'pending' | 'passed' | 'not_applicable' | 'failed';
    }[];
    readonly exercises: readonly {
      readonly key: string;
      readonly learningOutcomeIds: readonly string[];
      readonly answer: { readonly verificationStatus: 'pending' | 'passed' | 'failed' };
    }[];
  }[];
  readonly sources: readonly {
    readonly id: string;
    readonly url: string;
    readonly sourceKind: string;
    readonly contestId: string | null;
  }[];
  readonly correctionImpacts: readonly {
    readonly id: string;
    readonly sourceRevisionId: string;
    readonly authoringUnitProblemIds: readonly string[];
    readonly affectedSectionKeys: readonly string[];
    readonly learningUnitIds: readonly string[];
    readonly verificationStatus: string;
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
  'authoringUnits',
  'sources',
  'correctionImpacts',
] as const;

/** Keep the public content projection explicit so new top-level fields cannot silently escape it. */
const catalogContentKeys = [
  'schemaVersion',
  'advancedSlotRegistry',
  'contests',
  'contestSlots',
  'problems',
  'techniqueInventory',
  'tags',
  'learningOutcomes',
  'learningUnits',
  'placements',
  'authoringUnits',
  'sources',
  'correctionImpacts',
] as const;

const immutableReleaseScopeKeys = [
  'version',
  'releaseKind',
  'cutoffAt',
  'validatedAt',
  'publicationEffectiveAt',
  'manifestDigest',
  'contentFileInventoryDigest',
  'updateIds',
  'advancedSlotRegistryDigest',
  'firstContestId',
  'lastContestId',
  'contestCount',
  'problemCount',
  'slotRecordCount',
  'addedProblemIds',
  'changedProblemIds',
  'heldProblemIds',
  'withdrawnProblemIds',
  'taxonomyChanges',
  'changelogPath',
] as const;

export const projectCatalogContent = (catalog: CatalogLike): Readonly<Record<string, unknown>> => {
  const projection: Record<string, unknown> = {};
  for (const key of catalogContentKeys) projection[key] = catalog[key];
  const immutableReleaseScope: Record<string, unknown> = {};
  for (const key of immutableReleaseScopeKeys) immutableReleaseScope[key] = catalog.release[key];
  projection.release = immutableReleaseScope;
  return projection;
};

export const catalogContentDigest = (catalog: CatalogLike): string =>
  canonicalDigest(projectCatalogContent(catalog));

export const sortCatalogEntityArray = (
  key: (typeof entityArrayKeys)[number],
  items: readonly Entity[],
): readonly Entity[] => {
  const compareCodeUnits = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
  const compareContestIds = (a: string, b: string): number => {
    const leftNumber = /^abc(?<number>[0-9]+)$/u.exec(a)?.groups?.number;
    const rightNumber = /^abc(?<number>[0-9]+)$/u.exec(b)?.groups?.number;
    if (leftNumber && rightNumber) {
      const leftValue = BigInt(leftNumber);
      const rightValue = BigInt(rightNumber);
      if (leftValue !== rightValue) return leftValue < rightValue ? -1 : 1;
    }
    return compareCodeUnits(a, b);
  };
  if (key === 'learningUnits') {
    try {
      const ordered = deterministicTopologicalOrder(
        items.map((item) => ({
          item,
          id: item.id ?? '',
          prerequisiteIds: item.additionalPrerequisiteUnitIds ?? [],
          ranks: [item.stageRank ?? 0, item.difficultyRank ?? 0, item.representativeRank ?? 0],
        })),
        (node) => node.ranks,
      );
      return ordered.map(({ item }) => item);
    } catch {
      // Semantic validation reports the actual dependency error below;
      // retain a deterministic fallback order until then.
      return [...items].sort((left, right) => compareCodeUnits(left.id ?? '', right.id ?? ''));
    }
  }
  return [...items].sort((left, right) => {
    if (key === 'contestSlots') {
      return (
        compareContestIds(left.contestId ?? '', right.contestId ?? '') ||
        (left.officialOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.officialOrder ?? Number.MAX_SAFE_INTEGER) ||
        compareCodeUnits(left.label ?? '', right.label ?? '') ||
        compareCodeUnits(left.problemId ?? '', right.problemId ?? '')
      );
    }
    const usesProblemIdentity = key === 'techniqueInventory' || key === 'authoringUnits';
    const leftKey = usesProblemIdentity ? left.problemId : left.id;
    const rightKey = usesProblemIdentity ? right.problemId : right.id;
    return key === 'contests'
      ? compareContestIds(leftKey ?? '', rightKey ?? '')
      : compareCodeUnits(leftKey ?? '', rightKey ?? '');
  });
};

export const buildCatalog = (
  input: unknown,
  sourcePaths: readonly string[] = [],
  trustedEvidence?: TrustedCatalogReleaseEvidenceInventory,
): CatalogLike => {
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
  const diagnostics = validateCatalogSemantics(catalog, trustedEvidence);
  if (diagnostics.length > 0) throw new CatalogBuildError(diagnostics);
  return Object.freeze(catalog);
};

export const validateCatalogSemantics = (
  catalog: CatalogLike,
  trustedEvidence?: TrustedCatalogReleaseEvidenceInventory,
): ValidationDiagnostic[] => {
  const diagnostics: ValidationDiagnostic[] = [];
  const expectedContentSnapshotDigest = catalogContentDigest(catalog);
  if (catalog.release.contentSnapshotDigest !== expectedContentSnapshotDigest) {
    diagnostics.push({
      code: 'CONTENT_SNAPSHOT_DIGEST_MISMATCH',
      message:
        'release.contentSnapshotDigest must match the normalized public catalog content projection.',
    });
  }
  const contestIds = new Set(catalog.contests.map(({ id }) => id));
  if (contestIds.size !== catalog.contests.length) {
    diagnostics.push({ code: 'DUPLICATE_CONTEST_ID', message: 'Contest IDs must be unique.' });
  }
  const releaseCutoff = parseOffsetDateTime(catalog.release.cutoffAt);
  for (const contest of catalog.contests) {
    const startedAt = parseOffsetDateTime(contest.startedAt);
    const endedAt = parseOffsetDateTime(contest.endedAt);
    if (compareOffsetDateTimes(startedAt, endedAt) >= 0) {
      diagnostics.push({
        code: 'CONTEST_TIME_RANGE_INVALID',
        entityId: contest.id,
        message: `${contest.id} must end after it starts.`,
      });
    }
    if (compareOffsetDateTimes(endedAt, releaseCutoff) > 0) {
      diagnostics.push({
        code: 'CONTEST_AFTER_RELEASE_CUTOFF',
        entityId: contest.id,
        message: `${contest.id} ends after the release cutoff.`,
      });
    }
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
  const registrySubjectDigest = canonicalDigest({
    version: catalog.advancedSlotRegistry.version,
    labels: catalog.advancedSlotRegistry.labels,
    firstSeenContestByLabel: catalog.advancedSlotRegistry.firstSeenContestByLabel,
    orderEvidenceSourceRevisionIds: catalog.advancedSlotRegistry.orderEvidenceSourceRevisionIds,
  });
  if (registrySubjectDigest !== catalog.advancedSlotRegistry.digest) {
    diagnostics.push({
      code: 'REGISTRY_DIGEST_STALE',
      message: 'AdvancedSlotRegistry digest does not match its content.',
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
  if (
    catalog.contests[0]?.id !== catalog.release.firstContestId ||
    catalog.contests.at(-1)?.id !== catalog.release.lastContestId
  ) {
    diagnostics.push({
      code: 'CONTEST_BOUNDARY_MISMATCH',
      message: 'Release contest boundaries must match the sorted catalog.',
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
  if (inventoryIds.size !== catalog.techniqueInventory.length) {
    diagnostics.push({
      code: 'DUPLICATE_TECHNIQUE_INVENTORY_PROBLEM',
      message: 'Each problem must have exactly one Technique Inventory record.',
    });
  }
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
    if (slot.problemId !== null && !problemIds.has(slot.problemId)) {
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
        JSON.stringify(catalog.advancedSlotRegistry.orderEvidenceSourceRevisionIds) ||
      rebuiltRegistry.digest !== catalog.advancedSlotRegistry.digest
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
  const idSet = (kind: string, values: readonly { readonly id: string }[]): ReadonlySet<string> => {
    const ids = new Set(values.map(({ id }) => id));
    if (ids.size !== values.length) {
      diagnostics.push({ code: `DUPLICATE_${kind}_ID`, message: `${kind} IDs must be unique.` });
    }
    return ids;
  };
  const tagIds = idSet('TAG', catalog.tags);
  const outcomeIds = idSet('OUTCOME', catalog.learningOutcomes);
  const unitIds = idSet('LEARNING_UNIT', catalog.learningUnits);
  const placementIds = idSet('PLACEMENT', catalog.placements);
  const sourceIds = idSet('SOURCE_REVISION', catalog.sources);
  idSet('CORRECTION_IMPACT', catalog.correctionImpacts);
  const authoringUnitProblemIds = new Set(catalog.authoringUnits.map(({ problemId }) => problemId));
  if (authoringUnitProblemIds.size !== catalog.authoringUnits.length) {
    diagnostics.push({
      code: 'DUPLICATE_AUTHORING_UNIT_PROBLEM',
      message: 'A Problem can own only one authoring unit.',
    });
  }
  const requireRefs = (
    owner: string,
    relation: string,
    refs: readonly string[],
    targets: ReadonlySet<string>,
  ): void => {
    for (const ref of refs) {
      if (!targets.has(ref)) {
        diagnostics.push({
          code: 'CATALOG_REFERENCE_MISSING',
          entityId: owner,
          message: `${owner}.${relation} references unknown ${ref}.`,
        });
      }
    }
  };
  const scopeTargets = new Set([...tagIds, ...unitIds, ...problemIds]);
  const releaseChecks = catalog.release.validationSummary.checks;
  const releaseEvidenceDigests = catalog.release.validationSummary.evidenceDigests;
  const releaseCheckIds = releaseChecks.map(({ checkId }) => checkId);
  const releaseResultDigests = releaseChecks.map(({ resultDigest }) => resultDigest);
  const reviewEvidenceRefs = catalog.release.humanContentReviewEvidenceRefs;
  const reviewEvidenceIds = reviewEvidenceRefs.map(({ evidenceId }) => evidenceId);
  const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
    const sortedLeft = [...left].sort();
    const sortedRight = [...right].sort();
    return (
      sortedLeft.length === sortedRight.length &&
      sortedLeft.every((item, index) => item === sortedRight[index])
    );
  };
  const sameCheck = (
    left: (typeof releaseChecks)[number],
    right: TrustedCatalogReleaseEvidenceInventory['checks'][number],
  ): boolean =>
    left.checkId === right.checkId &&
    left.command === right.command &&
    left.subjectDigest === right.subjectDigest &&
    left.resultPath === right.resultPath &&
    left.resultDigest === right.resultDigest &&
    left.exitCode === right.exitCode &&
    left.passed === right.passed &&
    left.completedAt === right.completedAt;
  const sameReview = (
    left: (typeof reviewEvidenceRefs)[number],
    right: TrustedCatalogReleaseEvidenceInventory['reviews'][number],
  ): boolean =>
    left.evidenceId === right.evidenceId &&
    left.path === right.path &&
    left.digest === right.digest &&
    left.subjectDigest === right.subjectDigest &&
    left.aggregatePassed === right.aggregatePassed &&
    left.reviewMode === right.reviewMode &&
    sameStringSet(left.authorIds, right.authorIds) &&
    sameStringSet(left.reviewerIds, right.reviewerIds);
  const releaseEvidenceComplete =
    catalog.release.validationSummary.checkCount > 0 &&
    catalog.release.validationSummary.passedCheckCount ===
      catalog.release.validationSummary.checkCount &&
    catalog.release.validationSummary.blockingFindingCount === 0 &&
    releaseChecks.length === catalog.release.validationSummary.checkCount &&
    new Set(releaseCheckIds).size === releaseCheckIds.length &&
    new Set(releaseResultDigests).size === releaseResultDigests.length &&
    sameStringSet(releaseEvidenceDigests, releaseResultDigests) &&
    reviewEvidenceRefs.length > 0 &&
    new Set(reviewEvidenceIds).size === reviewEvidenceIds.length &&
    reviewEvidenceRefs.every(
      (review) =>
        review.aggregatePassed &&
        review.subjectDigest === catalog.release.contentFileInventoryDigest &&
        review.reviewerIds.length > 0 &&
        review.authorIds.length > 0 &&
        (review.reviewMode === 'self' ||
          !review.authorIds.some((authorId) => review.reviewerIds.includes(authorId))),
    ) &&
    releaseChecks.every(
      (check) =>
        check.subjectDigest === catalog.release.contentFileInventoryDigest &&
        check.exitCode === 0 &&
        check.passed,
    ) &&
    trustedEvidence?.subjectDigest === catalog.release.contentFileInventoryDigest &&
    trustedEvidence.checks.length === releaseChecks.length &&
    trustedEvidence.reviews.length === reviewEvidenceRefs.length &&
    sameStringSet(
      trustedEvidence.checks.map(({ checkId }) => checkId),
      releaseCheckIds,
    ) &&
    trustedEvidence.checks.every((trustedCheck) => {
      const releaseCheck = releaseChecks.find(({ checkId }) => checkId === trustedCheck.checkId);
      return releaseCheck !== undefined && sameCheck(releaseCheck, trustedCheck);
    }) &&
    sameStringSet(
      trustedEvidence.reviews.map(({ evidenceId }) => evidenceId),
      reviewEvidenceIds,
    ) &&
    trustedEvidence.reviews.every((trustedReview) => {
      const review = reviewEvidenceRefs.find(
        ({ evidenceId }) => evidenceId === trustedReview.evidenceId,
      );
      return review !== undefined && sameReview(review, trustedReview);
    });
  if (!trustedEvidence) {
    diagnostics.push({
      code: 'RELEASE_EVIDENCE_INVENTORY_REQUIRED',
      message: 'Catalog publication requires the trusted release check and review inventory.',
    });
  } else if (!releaseEvidenceComplete) {
    diagnostics.push({
      code: 'RELEASE_EVIDENCE_INCOMPLETE',
      message:
        'Every release check and human review must match the trusted current subject before publication.',
    });
  }
  for (const inventory of catalog.techniqueInventory) {
    requireRefs(inventory.problemId, 'problemId', [inventory.problemId], problemIds);
    requireRefs(inventory.problemId, 'sourceRevisionIds', inventory.sourceRevisionIds, sourceIds);
  }
  for (const [relation, refs] of [
    ['addedProblemIds', catalog.release.addedProblemIds],
    ['changedProblemIds', catalog.release.changedProblemIds],
    ['heldProblemIds', catalog.release.heldProblemIds],
    ['withdrawnProblemIds', catalog.release.withdrawnProblemIds],
  ] as const) {
    requireRefs('release', relation, refs, problemIds);
  }
  for (const slot of catalog.contestSlots) {
    requireRefs(
      `${slot.contestId}:${slot.label}`,
      'sourceRevisionId',
      [slot.sourceRevisionId],
      sourceIds,
    );
  }
  for (const contest of catalog.contests) {
    requireRefs(
      contest.id,
      'taskOrderSourceRevisionId',
      [contest.taskOrderSourceRevisionId],
      sourceIds,
    );
  }
  for (const source of catalog.sources) {
    if (source.contestId !== null) {
      requireRefs(source.id, 'contestId', [source.contestId], contestIds);
    }
  }
  for (const problem of catalog.problems) {
    requireRefs(problem.id, 'contestId', [problem.contestId], contestIds);
    requireRefs(problem.id, 'sourceRevisionIds', problem.sourceRevisionIds, sourceIds);
    requireRefs(problem.id, 'primaryTagIds', problem.primaryTagIds, tagIds);
    requireRefs(problem.id, 'secondaryTagIds', problem.secondaryTagIds, tagIds);
    for (const sourceRevisionId of problem.sourceRevisionIds) {
      const source = catalog.sources.find(({ id }) => id === sourceRevisionId);
      if (!source) continue;
      const sourceUrl = parseAtCoderContestResourceUrl(source.url);
      const expectedTaskId = `${problem.contestId}_${problem.slotLabel.toLocaleLowerCase('en-US')}`;
      if (source.contestId !== problem.contestId || sourceUrl?.contestId !== problem.contestId) {
        diagnostics.push({
          code: 'PROBLEM_SOURCE_CONTEST_MISMATCH',
          entityId: problem.id,
          message: `${sourceRevisionId} is not scoped to ${problem.contestId}.`,
        });
      } else if (
        source.sourceKind === 'official_problem' &&
        (sourceUrl.resource !== 'task' || sourceUrl.taskId !== expectedTaskId)
      ) {
        diagnostics.push({
          code: 'PROBLEM_SOURCE_TASK_MISMATCH',
          entityId: problem.id,
          message: `${sourceRevisionId} does not cite ${expectedTaskId}.`,
        });
      }
    }
    if (problem.placementId)
      requireRefs(problem.id, 'placementId', [problem.placementId], placementIds);
    const placement = problem.placementId
      ? catalog.placements.find(({ id }) => id === problem.placementId)
      : undefined;
    const authoringUnit = catalog.authoringUnits.find(({ problemId }) => problemId === problem.id);
    if (placement && placement.problemId !== problem.id) {
      diagnostics.push({
        code: 'PROBLEM_PLACEMENT_MISMATCH',
        entityId: problem.id,
        message: problem.id,
      });
    }
    if (placement && authoringUnit) {
      if (placement.kind !== authoringUnit.kind) {
        diagnostics.push({
          code: 'PLACEMENT_AUTHORING_KIND_MISMATCH',
          entityId: problem.id,
          message: `${placement.kind} != ${authoringUnit.kind}`,
        });
      }
      if (placement.primaryProblemId !== authoringUnit.primaryProblemId) {
        diagnostics.push({
          code: 'PLACEMENT_PRIMARY_PROBLEM_MISMATCH',
          entityId: problem.id,
          message: `${placement.id} and its authoring unit disagree about the primary Problem.`,
        });
      }
    }
    if (
      problem.publicationStatus === 'published' &&
      (problem.primaryTagIds.length === 0 || !problem.placementId || !authoringUnit)
    ) {
      diagnostics.push({
        code: 'PUBLISHED_PROBLEM_UNREACHABLE',
        entityId: problem.id,
        message: 'Published problems require a primary tag, placement, and authoring unit.',
      });
    }
  }
  for (const tag of catalog.tags) {
    const normalizedTerms = [tag.name, ...tag.aliases, ...tag.formerNames].map((term) =>
      term.normalize('NFKC').trim().toLocaleLowerCase('en-US'),
    );
    if (new Set(normalizedTerms).size !== normalizedTerms.length) {
      diagnostics.push({
        code: 'TAG_TERM_DUPLICATE',
        entityId: tag.id,
        message: 'A tag name, alias, or former name is duplicated within the tag.',
      });
    }
    if (tag.parentId) requireRefs(tag.id, 'parentId', [tag.parentId], tagIds);
    requireRefs(tag.id, 'prerequisiteTagIds', tag.prerequisiteTagIds, tagIds);
    requireRefs(tag.id, 'learningOutcomeIds', tag.learningOutcomeIds, outcomeIds);
    requireRefs(tag.id, 'representativeProblemIds', tag.representativeProblemIds, problemIds);
    requireRefs(tag.id, 'replacementTagIds', tag.replacementTagIds, tagIds);
    if (tag.lifecycle === 'deprecated' && tag.replacementTagIds.length === 0) {
      diagnostics.push({
        code: 'TAG_REPLACEMENT_MISSING',
        entityId: tag.id,
        message: 'Deprecated tags require at least one replacement tag.',
      });
    }
    if (tag.lifecycle === 'active' && tag.replacementTagIds.length > 0) {
      diagnostics.push({
        code: 'TAG_ACTIVE_REPLACEMENT',
        entityId: tag.id,
        message: 'Active tags cannot declare replacement tags.',
      });
    }
    if (tag.replacementTagIds.includes(tag.id)) {
      diagnostics.push({
        code: 'TAG_REPLACEMENT_SELF_REFERENCE',
        entityId: tag.id,
        message: 'A tag cannot replace itself.',
      });
    }
  }
  const tagTermOwners = new Map<string, string>();
  for (const tag of catalog.tags) {
    for (const term of [tag.name, ...tag.aliases, ...tag.formerNames]) {
      const normalized = term.normalize('NFKC').trim().toLocaleLowerCase('en-US');
      const existingOwner = tagTermOwners.get(normalized);
      if (existingOwner && existingOwner !== tag.id) {
        diagnostics.push({
          code: 'TAG_TERM_CONFLICT',
          entityId: tag.id,
          message: `${tag.id} shares the term "${term}" with ${existingOwner}.`,
        });
      } else {
        tagTermOwners.set(normalized, tag.id);
      }
    }
  }
  for (const outcome of catalog.learningOutcomes) {
    requireRefs(outcome.id, 'prerequisiteOutcomeIds', outcome.prerequisiteOutcomeIds, outcomeIds);
    requireRefs(outcome.id, 'scopeIds', outcome.scopeIds, scopeTargets);
  }
  for (const unit of catalog.learningUnits) {
    if (unit.parentId) requireRefs(unit.id, 'parentId', [unit.parentId], unitIds);
    requireRefs(unit.id, 'sourceRevisionIds', unit.sourceRevisionIds, sourceIds);
    requireRefs(
      unit.id,
      'additionalPrerequisiteUnitIds',
      unit.additionalPrerequisiteUnitIds,
      unitIds,
    );
    requireRefs(unit.id, 'tagIds', unit.tagIds, tagIds);
    requireRefs(unit.id, 'learningOutcomeIds', unit.learningOutcomeIds, outcomeIds);
    requireRefs(unit.id, 'problemIds', unit.problemIds, problemIds);
    for (const example of unit.examples) {
      requireRefs(
        `${unit.id}:${example.key}`,
        'learningOutcomeIds',
        example.learningOutcomeIds,
        outcomeIds,
      );
      if (
        (example.kind === 'executable' && example.verificationStatus !== 'passed') ||
        (example.kind !== 'executable' && example.verificationStatus !== 'not_applicable')
      ) {
        diagnostics.push({
          code: 'LEARNING_UNIT_EXAMPLE_NOT_VERIFIED',
          entityId: unit.id,
          message: `${unit.id}:${example.key} has an invalid publication verification state.`,
        });
      }
    }
  }
  for (const placement of catalog.placements) {
    requireRefs(placement.id, 'problemId', [placement.problemId], problemIds);
    if (placement.primaryProblemId)
      requireRefs(placement.id, 'primaryProblemId', [placement.primaryProblemId], problemIds);
    requireRefs(placement.id, 'sharedOutcomeIds', placement.sharedOutcomeIds, outcomeIds);
    const problem = catalog.problems.find(({ id }) => id === placement.problemId);
    if (problem && problem.placementId !== placement.id) {
      diagnostics.push({
        code: 'PLACEMENT_REVERSE_REFERENCE_MISMATCH',
        entityId: placement.id,
        message: `${placement.id} is not selected by ${placement.problemId}.`,
      });
    }
    const primary = placement.primaryProblemId
      ? catalog.authoringUnits.find(({ problemId }) => problemId === placement.primaryProblemId)
      : undefined;
    if (placement.kind === 'full' && placement.primaryProblemId !== null) {
      diagnostics.push({
        code: 'FULL_PLACEMENT_HAS_PRIMARY',
        entityId: placement.id,
        message: 'Full placement must have an independent authoring unit.',
      });
    }
    if (placement.kind !== 'full' && !primary) {
      diagnostics.push({
        code: 'ABBREVIATED_PLACEMENT_PRIMARY_MISSING',
        entityId: placement.id,
        message: 'Similar and supplement placements require a primary Problem authoring unit.',
      });
    }
    if (primary && primary.kind !== 'full') {
      diagnostics.push({
        code: 'PLACEMENT_PRIMARY_NOT_FULL',
        entityId: placement.id,
        message: `${placement.primaryProblemId ?? 'unknown'} must own a full authoring unit.`,
      });
    }
    if (primary?.problemId === placement.problemId) {
      diagnostics.push({
        code: 'PLACEMENT_PRIMARY_SELF_REFERENCE',
        entityId: placement.id,
        message: 'A placement cannot use its own Problem as its primary Problem.',
      });
    }
  }
  for (const unit of catalog.authoringUnits) {
    requireRefs(unit.problemId, 'problemId', [unit.problemId], problemIds);
    if (unit.primaryProblemId)
      requireRefs(unit.problemId, 'primaryProblemId', [unit.primaryProblemId], problemIds);
    requireRefs(unit.problemId, 'learningOutcomeIds', unit.learningOutcomeIds, outcomeIds);
    requireRefs(
      unit.problemId,
      'additionalPrerequisiteUnitIds',
      unit.additionalPrerequisiteUnitIds,
      unitIds,
    );
    requireRefs(unit.problemId, 'tagIds', unit.tagIds, tagIds);
    requireRefs(unit.problemId, 'sourceRevisionIds', unit.sourceRevisionIds, sourceIds);
    for (const claim of unit.claims) {
      requireRefs(
        `${unit.problemId}:${claim.key}`,
        'sourceRevisionIds',
        claim.sourceRevisionIds,
        sourceIds,
      );
      if (claim.verificationStatus !== 'verified') {
        diagnostics.push({
          code: 'AUTHORING_CLAIM_NOT_VERIFIED',
          entityId: unit.problemId,
          message: `Claim ${claim.key} is not verified.`,
        });
      }
    }
    for (const example of unit.examples) {
      requireRefs(
        `${unit.problemId}:${example.key}`,
        'learningOutcomeIds',
        example.learningOutcomeIds,
        outcomeIds,
      );
      requireRefs(
        `${unit.problemId}:${example.key}`,
        'learningUnitIds',
        example.learningUnitIds,
        unitIds,
      );
      const validStatus =
        example.kind === 'executable'
          ? example.verificationStatus === 'passed'
          : example.verificationStatus === 'not_applicable';
      if (!validStatus) {
        diagnostics.push({
          code: 'AUTHORING_EXAMPLE_NOT_VERIFIED',
          entityId: unit.problemId,
          message: `Example ${example.key} has an invalid publication verification state.`,
        });
      }
    }
    for (const exercise of unit.exercises) {
      requireRefs(
        `${unit.problemId}:${exercise.key}`,
        'learningOutcomeIds',
        exercise.learningOutcomeIds,
        outcomeIds,
      );
      if (exercise.answer.verificationStatus !== 'passed') {
        diagnostics.push({
          code: 'AUTHORING_ANSWER_NOT_VERIFIED',
          entityId: unit.problemId,
          message: `Exercise ${exercise.key} answer is not verified.`,
        });
      }
    }
  }
  const authoringUnitByProblemId = new Map(
    catalog.authoringUnits.map((unit) => [unit.problemId, unit]),
  );
  const authoringVisitState = new Map<string, 'visiting' | 'visited'>();
  const visitAuthoringUnit = (problemId: string, path: readonly string[]): void => {
    const state = authoringVisitState.get(problemId);
    if (state === 'visiting') {
      diagnostics.push({
        code: 'AUTHORING_PRIMARY_CYCLE',
        entityId: problemId,
        message: `Primary Problem cycle: ${[...path, problemId].join(' -> ')}`,
      });
      return;
    }
    if (state === 'visited') return;
    authoringVisitState.set(problemId, 'visiting');
    const primaryProblemId = authoringUnitByProblemId.get(problemId)?.primaryProblemId;
    if (primaryProblemId && authoringUnitByProblemId.has(primaryProblemId)) {
      visitAuthoringUnit(primaryProblemId, [...path, problemId]);
    }
    authoringVisitState.set(problemId, 'visited');
  };
  for (const unit of catalog.authoringUnits) visitAuthoringUnit(unit.problemId, []);
  for (const impact of catalog.correctionImpacts) {
    requireRefs(impact.id, 'sourceRevisionId', [impact.sourceRevisionId], sourceIds);
    requireRefs(
      impact.id,
      'authoringUnitProblemIds',
      impact.authoringUnitProblemIds,
      authoringUnitProblemIds,
    );
    requireRefs(impact.id, 'learningUnitIds', impact.learningUnitIds, unitIds);
    if (impact.verificationStatus !== 'verified') {
      diagnostics.push({
        code: 'CORRECTION_IMPACT_NOT_VERIFIED',
        entityId: impact.id,
        message: 'Correction impact evidence must be verified before publication.',
      });
    }
  }
  interface CatalogDagNode {
    readonly id: string;
    readonly prerequisiteIds: readonly string[];
    readonly ranks?: readonly number[];
  }
  const validateDag = (
    code: string,
    nodes: readonly CatalogDagNode[],
    ranks: (node: CatalogDagNode) => readonly number[] = (node) => node.ranks ?? [],
  ): void => {
    try {
      deterministicTopologicalOrder(nodes, ranks);
    } catch (error) {
      diagnostics.push({
        code: error instanceof DomainValidationError ? error.code : code,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };
  // Hierarchy edges and learning-prerequisite edges have different meanings;
  // a cycle in their union is not a cycle in either graph.
  validateDag(
    'TAG_PREREQUISITE_DAG_INVALID',
    catalog.tags.map((tag) => ({ id: tag.id, prerequisiteIds: tag.prerequisiteTagIds })),
  );
  validateDag(
    'TAG_PARENT_HIERARCHY_INVALID',
    catalog.tags.map((tag) => ({
      id: tag.id,
      prerequisiteIds: tag.parentId ? [tag.parentId] : [],
    })),
  );
  validateDag(
    'TAG_REPLACEMENT_GRAPH_INVALID',
    catalog.tags.map((tag) => ({ id: tag.id, prerequisiteIds: tag.replacementTagIds })),
  );
  validateDag(
    'OUTCOME_PREREQUISITE_DAG_INVALID',
    catalog.learningOutcomes.map((outcome) => ({
      id: outcome.id,
      prerequisiteIds: outcome.prerequisiteOutcomeIds,
    })),
  );
  validateDag(
    'LEARNING_UNIT_PREREQUISITE_DAG_INVALID',
    catalog.learningUnits.map((unit) => ({
      id: unit.id,
      prerequisiteIds: unit.additionalPrerequisiteUnitIds,
      ranks: [unit.stageRank, unit.difficultyRank, unit.representativeRank],
    })),
    (unit) => unit.ranks ?? [],
  );
  try {
    const orderedLearningUnits = deterministicTopologicalOrder(
      catalog.learningUnits.map((unit) => ({
        unit,
        id: unit.id,
        prerequisiteIds: unit.additionalPrerequisiteUnitIds,
        ranks: [unit.stageRank, unit.difficultyRank, unit.representativeRank],
      })),
      (node) => node.ranks,
    );
    const expectedIds = orderedLearningUnits.map(({ id }) => id);
    const actualIds = catalog.learningUnits.map(({ id }) => id);
    if (expectedIds.some((id, index) => actualIds[index] !== id)) {
      diagnostics.push({
        code: 'LEARNING_UNIT_ORDER_MISMATCH',
        message: 'Learning units must be stored in deterministic prerequisite order.',
      });
    }
    for (const [index, unit] of catalog.learningUnits.entries()) {
      if (unit.globalIndex !== index || unit.globalIndex !== expectedIds.indexOf(unit.id)) {
        diagnostics.push({
          code: 'LEARNING_UNIT_GLOBAL_INDEX_MISMATCH',
          entityId: unit.id,
          message: `${unit.id} must have globalIndex ${String(expectedIds.indexOf(unit.id))}.`,
        });
      }
    }
  } catch {
    // The dedicated DAG validator above reports the actionable cycle or
    // unknown-dependency diagnostic.
  }
  validateDag(
    'LEARNING_UNIT_PARENT_HIERARCHY_INVALID',
    catalog.learningUnits.map((unit) => ({
      id: unit.id,
      prerequisiteIds: unit.parentId ? [unit.parentId] : [],
    })),
  );
  return diagnostics.sort(
    (left, right) =>
      left.code.localeCompare(right.code) || left.message.localeCompare(right.message),
  );
};
