import {
  CatalogContract,
  parseAtCoderContestResourceUrl,
  SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES,
  type SeedAgentQualityReviewReference,
} from '../domain/schema-parts/catalog.js';
import { canonicalDigest } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import { stableProblemId } from '../domain/identity.js';
import {
  executableExampleEvidenceLocatorKey,
  type ExecutableExampleEvidence,
} from '../domain/schema-parts/verification-evidence.js';
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
  readonly contestId?: string | null;
  readonly number?: number;
  readonly label?: string;
  readonly officialOrder?: number | null;
}

export interface TrustedCatalogReleaseEvidenceInventory {
  readonly agentQualityReview?: SeedAgentQualityReviewReference | undefined;
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
  /** Verified execution evidence for every executable example in the Catalog. */
  readonly executableExampleEvidence?: {
    readonly path: string;
    readonly digest: string;
    readonly evidence: ExecutableExampleEvidence;
  };
}

export interface CatalogLike {
  readonly schemaVersion: '3.0.0';
  readonly release: {
    readonly agentQualityReviewEvidenceRef?: SeedAgentQualityReviewReference | undefined;
    readonly publicationStatus?: 'prepared' | 'published' | undefined;
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
    readonly officialTaskIds: readonly string[];
    readonly taskOrderSourceRevisionId: string;
  }[];
  readonly contestGaps: readonly {
    readonly number: number;
    readonly contestId: string;
    readonly status: 'officially_unheld';
    readonly evidenceUrl: string;
    readonly evidenceAssertion: string;
    readonly checkedAt: string;
    readonly termsCheckedAt: string;
    readonly fingerprint: string;
  }[];
  readonly contestSlots: readonly {
    readonly contestId: string;
    readonly label: string;
    readonly officialTaskId: string | null;
    readonly officialOrder: number | null;
    readonly availability: 'exists' | 'official_absent' | 'unknown' | 'withdrawn';
    readonly problemId: string | null;
    readonly sourceRevisionId: string;
  }[];
  readonly problems: readonly {
    readonly id: string;
    readonly contestId: string;
    readonly slotLabel: string;
    readonly officialTaskId: string;
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
    readonly semanticSignature: {
      readonly objectPatterns: readonly string[];
      readonly triggerPatterns: readonly string[];
      readonly invariantPatterns: readonly string[];
      readonly goalPatterns: readonly string[];
      readonly excludedPatterns: readonly string[];
      readonly minimumDimensions: number;
      readonly requireObjectForStrictRecall: boolean;
    };
    readonly relatedTags: readonly {
      readonly tagId: string;
      readonly type:
        | 'contrast'
        | 'analogy'
        | 'specialization'
        | 'extension'
        | 'reduction'
        | 'often_combined'
        | 'implementation_substrate';
      readonly rationale: string;
    }[];
    readonly parentId: string | null;
    readonly learningOutcomeIds: readonly string[];
    readonly representativeProblemIds: readonly string[];
    readonly replacementTagIds: readonly string[];
  }[];
  readonly learningUnits: readonly {
    readonly kind?: string;
    readonly id: string;
    readonly sourceRevisionIds: readonly string[];
    readonly parentId: string | null;
    readonly tagIds: readonly string[];
    readonly ownedTagIds?: readonly string[] | undefined;
    readonly learningOutcomeIds: readonly string[];
    readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
    readonly contentPhase?: 'canonical_skeleton' | 'full_authoring' | undefined;
    readonly problemIds: readonly string[];
    readonly examples: readonly {
      readonly key: string;
      readonly learningOutcomeIds: readonly string[];
      readonly kind: 'executable' | 'pseudocode' | 'illustrative';
      readonly verificationStatus: 'pending' | 'passed' | 'not_applicable' | 'failed';
    }[];
    readonly exercises: readonly {
      readonly key: string;
      readonly learningOutcomeIds: readonly string[];
      readonly answer: { readonly verificationStatus: 'pending' | 'passed' | 'failed' };
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
    readonly sections: Readonly<Record<string, unknown>>;
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
    readonly officialTaskId: string | null;
  }[];
  readonly correctionImpacts: readonly {
    readonly id: string;
    readonly sourceRevisionId: string;
    readonly sourceRevisionIds?: readonly string[] | undefined;
    readonly affectedContentLocators: readonly (
      | {
          readonly ownerType: 'problem';
          readonly problemId: string;
          readonly path: string;
        }
      | {
          readonly ownerType: 'learning_unit';
          readonly learningUnitId: string;
          readonly path: string;
        }
      | {
          readonly ownerType: 'problem_placement';
          readonly problemId: string;
          readonly path: string;
        }
      | {
          readonly ownerType: 'learning_prerequisites';
          readonly path: 'src/content/policies/learning-prerequisites.json';
        }
    )[];
    readonly verificationStatus: string;
  }[];
  readonly [key: string]: unknown;
}

export type ExecutableExampleInventoryItem =
  | {
      readonly ownerType: 'problem';
      readonly problemId: string;
      readonly exampleKey: string;
    }
  | {
      readonly ownerType: 'learning_unit';
      readonly learningUnitId: string;
      readonly exampleKey: string;
    };

/**
 * Rebuild the executable-example inventory from canonical Catalog content.
 * The owner discriminator prevents document-local keys from colliding.
 */
export const deriveExecutableExampleInventory = (
  catalog: Pick<CatalogLike, 'learningUnits' | 'authoringUnits'>,
): readonly ExecutableExampleInventoryItem[] => {
  const learningUnitExamples = catalog.learningUnits.flatMap((unit) =>
    unit.examples
      .filter(({ kind }) => kind === 'executable')
      .map(({ key }) => ({
        ownerType: 'learning_unit' as const,
        learningUnitId: unit.id,
        exampleKey: key,
      })),
  );
  const problemExamples = catalog.authoringUnits.flatMap((unit) =>
    unit.examples
      .filter(({ kind }) => kind === 'executable')
      .map(({ key }) => ({
        ownerType: 'problem' as const,
        problemId: unit.problemId,
        exampleKey: key,
      })),
  );
  const compareCodeUnits = (left: string, right: string): number =>
    left < right ? -1 : left > right ? 1 : 0;
  return [...learningUnitExamples, ...problemExamples].sort((left, right) =>
    compareCodeUnits(
      executableExampleEvidenceLocatorKey(left),
      executableExampleEvidenceLocatorKey(right),
    ),
  );
};

export const executableExampleInventoryDigest = (
  catalog: Pick<CatalogLike, 'learningUnits' | 'authoringUnits'>,
): string => canonicalDigest({ items: deriveExecutableExampleInventory(catalog) });

const entityArrayKeys = [
  'contests',
  'contestGaps',
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
  'contestGaps',
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
  if (catalog.release.publicationStatus !== undefined)
    immutableReleaseScope.publicationStatus = catalog.release.publicationStatus;
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
    return [...items].sort((left, right) => compareCodeUnits(left.id ?? '', right.id ?? ''));
  }
  return [...items].sort((left, right) => {
    if (key === 'contestGaps') {
      return (
        (left.number ?? Number.MAX_SAFE_INTEGER) - (right.number ?? Number.MAX_SAFE_INTEGER) ||
        compareContestIds(left.contestId ?? '', right.contestId ?? '')
      );
    }
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

/** Canonical assembly is shared by prepared projections and release validation. */
export const assembleCatalog = (input: unknown): CatalogLike => {
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
  return catalog;
};

export const buildCatalog = (
  input: unknown,
  sourcePaths: readonly string[] = [],
  trustedEvidence?: TrustedCatalogReleaseEvidenceInventory,
  options: { readonly allowPreparedRelease?: boolean } = {},
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
  const catalog = assembleCatalog(input);
  const diagnostics = validateCatalogSemantics(catalog, trustedEvidence, options);
  if (diagnostics.length > 0) throw new CatalogBuildError(diagnostics);
  return Object.freeze(catalog);
};

export const validateCatalogSemantics = (
  catalog: CatalogLike,
  trustedEvidence?: TrustedCatalogReleaseEvidenceInventory,
  options: { readonly allowPreparedRelease?: boolean } = {},
): ValidationDiagnostic[] => {
  const diagnostics: ValidationDiagnostic[] = [];
  if (catalog.release.publicationStatus === 'prepared' && !options.allowPreparedRelease)
    diagnostics.push({
      code: 'PUBLIC_PROJECTION_NOT_RELEASE',
      message:
        'Prepared T160 projections must pass the later production release gate before publication.',
    });
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
    if (contest.officialTaskOrder.length !== contest.officialTaskIds.length) {
      diagnostics.push({
        code: 'CONTEST_TASK_ID_MAPPING_INCOMPLETE',
        entityId: contest.id,
        message: `${contest.id} labels and official task IDs must have equal lengths.`,
      });
    }
    if (new Set(contest.officialTaskIds).size !== contest.officialTaskIds.length) {
      diagnostics.push({
        code: 'DUPLICATE_OFFICIAL_TASK_ID',
        entityId: contest.id,
        message: `${contest.id} official task IDs must be unique.`,
      });
    }
    for (const officialTaskId of contest.officialTaskIds) {
      if (!officialTaskId.startsWith(`${contest.id}_`)) {
        diagnostics.push({
          code: 'OFFICIAL_TASK_ID_CONTEST_MISMATCH',
          entityId: contest.id,
          message: `${officialTaskId} does not belong to ${contest.id}.`,
        });
      }
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
  const gapNumbers = [...catalog.contestGaps].map(({ number }) => number).sort((a, b) => a - b);
  const gapNumberSet = new Set(gapNumbers);
  const gapIdSet = new Set(catalog.contestGaps.map(({ contestId }) => contestId));
  if (gapNumberSet.size !== gapNumbers.length || gapIdSet.size !== catalog.contestGaps.length) {
    diagnostics.push({
      code: 'DUPLICATE_CONTEST_GAP',
      message: 'Official Contest gap numbers and IDs must be unique.',
    });
  }
  if (catalog.contestGaps.some(({ contestId, number }) => contestId !== `abc${String(number)}`)) {
    diagnostics.push({
      code: 'CONTEST_GAP_ID_MISMATCH',
      message: 'Official Contest gap IDs must agree with their numbers.',
    });
  }
  if (contestNumbers.some((number) => gapNumberSet.has(number))) {
    diagnostics.push({
      code: 'CONTEST_GAP_OVERLAP',
      message: 'A Contest number cannot be both held and officially unheld.',
    });
  }
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
  const coveredNumbers = [...contestNumbers, ...gapNumbers].sort((left, right) => left - right);
  if (
    expectedNumbers.length !== coveredNumbers.length ||
    expectedNumbers.some((number, index) => coveredNumbers[index] !== number) ||
    catalog.contests.some(({ id, number }) => id !== `abc${String(number)}`)
  ) {
    diagnostics.push({
      code: 'CONTEST_RANGE_INCOMPLETE',
      message: 'Held Contests and official gap evidence must cover the release range exactly once.',
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
    if (matchingSlot?.officialTaskId !== problem.officialTaskId) {
      diagnostics.push({
        code: 'PROBLEM_SLOT_TASK_ID_MISMATCH',
        entityId: problem.id,
        message: `${problem.id} and its slot disagree about the official task ID.`,
      });
    }
    const contest = catalog.contests.find(({ id }) => id === problem.contestId);
    const officialTaskIndex = contest?.officialTaskOrder.indexOf(problem.slotLabel) ?? -1;
    if (
      officialTaskIndex < 0 ||
      contest?.officialTaskIds[officialTaskIndex] !== problem.officialTaskId
    ) {
      diagnostics.push({
        code: 'PROBLEM_CONTEST_TASK_ID_MISMATCH',
        entityId: problem.id,
        message: `${problem.id} does not match the Contest label-to-task-ID mapping.`,
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
      const officialTaskId =
        officialOrder < 0 ? null : (contest.officialTaskIds[officialOrder] ?? null);
      if (officialOrder >= 0) {
        if (
          slot.availability === 'official_absent' ||
          slot.officialOrder !== officialOrder ||
          slot.officialTaskId !== officialTaskId
        ) {
          diagnostics.push({
            code: 'CONTEST_SLOT_OFFICIAL_MISMATCH',
            entityId: contest.id,
            message: key,
          });
        }
      } else if (
        slot.availability === 'exists' ||
        slot.officialOrder !== null ||
        slot.officialTaskId !== null
      ) {
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
  const tagById = new Map(catalog.tags.map((tag) => [tag.id, tag]));
  const outcomeIds = idSet('OUTCOME', catalog.learningOutcomes);
  const unitIds = idSet('LEARNING_UNIT', catalog.learningUnits);
  const learningUnitById = new Map(catalog.learningUnits.map((unit) => [unit.id, unit]));
  const placementIds = idSet('PLACEMENT', catalog.placements);
  const sourceIds = idSet('SOURCE_REVISION', catalog.sources);
  idSet('CORRECTION_IMPACT', catalog.correctionImpacts);
  const authoringUnitProblemIds = new Set(catalog.authoringUnits.map(({ problemId }) => problemId));
  const authoringUnitByProblemId = new Map(
    catalog.authoringUnits.map((unit) => [unit.problemId, unit]),
  );
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
  const agentReview = catalog.release.agentQualityReviewEvidenceRef;
  const trustedAgentReview = trustedEvidence?.agentQualityReview;
  const agentReviewComplete =
    agentReview !== undefined &&
    trustedAgentReview !== undefined &&
    canonicalDigest(agentReview) === canonicalDigest(trustedAgentReview) &&
    agentReview.subjectDigest === catalog.release.contentFileInventoryDigest &&
    catalog.release.releaseKind === 'initial' &&
    catalog.release.firstContestId === 'abc212' &&
    catalog.release.lastContestId === 'abc466' &&
    catalog.release.problemCount === 868 &&
    catalog.release.cutoffAt === '2026-07-12T00:00:00+09:00' &&
    catalog.release.updateIds.length === 1 &&
    catalog.release.updateIds[0] === 'update-bootstrap-full-corpus' &&
    reviewEvidenceRefs.length === 0;
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
    (reviewEvidenceRefs.length > 0 || agentReviewComplete) &&
    (agentReview === undefined ? trustedAgentReview === undefined : agentReviewComplete) &&
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
        'Every release check and policy-selected review must match the trusted current subject before publication.',
    });
  }
  for (const inventory of catalog.techniqueInventory) {
    requireRefs(inventory.problemId, 'problemId', [inventory.problemId], problemIds);
    requireRefs(inventory.problemId, 'sourceRevisionIds', inventory.sourceRevisionIds, sourceIds);
    const problem = catalog.problems.find(({ id }) => id === inventory.problemId);
    if (!problem) continue;
    let hasBoundOfficialProblemSource = false;
    for (const sourceRevisionId of inventory.sourceRevisionIds) {
      const source = catalog.sources.find(({ id }) => id === sourceRevisionId);
      if (!source) continue;
      if (source.contestId !== problem.contestId) {
        diagnostics.push({
          code: 'TECHNIQUE_INVENTORY_SOURCE_CONTEST_MISMATCH',
          entityId: inventory.problemId,
          message: `${sourceRevisionId} is not scoped to ${problem.contestId}.`,
        });
        continue;
      }
      const sourceUrl = parseAtCoderContestResourceUrl(source.url);
      if (source.sourceKind === 'official_problem') {
        if (
          sourceUrl?.resource === 'task' &&
          sourceUrl.taskId === problem.officialTaskId &&
          source.officialTaskId === problem.officialTaskId
        ) {
          hasBoundOfficialProblemSource = true;
        } else {
          diagnostics.push({
            code: 'TECHNIQUE_INVENTORY_SOURCE_TASK_MISMATCH',
            entityId: inventory.problemId,
            message: `${sourceRevisionId} does not cite ${problem.officialTaskId}.`,
          });
        }
      } else if (
        source.sourceKind === 'official_editorial' &&
        (sourceUrl?.resource !== 'editorial_item' ||
          source.officialTaskId !== problem.officialTaskId)
      ) {
        diagnostics.push({
          code: 'TECHNIQUE_INVENTORY_SOURCE_TASK_MISMATCH',
          entityId: inventory.problemId,
          message: `${sourceRevisionId} is not an editorial for ${problem.officialTaskId}.`,
        });
      } else if (
        source.officialTaskId !== null &&
        source.officialTaskId !== problem.officialTaskId
      ) {
        diagnostics.push({
          code: 'TECHNIQUE_INVENTORY_SOURCE_TASK_MISMATCH',
          entityId: inventory.problemId,
          message: `${sourceRevisionId} is bound to another official task.`,
        });
      }
    }
    if (!hasBoundOfficialProblemSource) {
      diagnostics.push({
        code: 'TECHNIQUE_INVENTORY_PROBLEM_SOURCE_REQUIRED',
        entityId: inventory.problemId,
        message: `${inventory.problemId} requires its task-bound official Problem revision.`,
      });
    }
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
      if (source.contestId !== problem.contestId || sourceUrl?.contestId !== problem.contestId) {
        diagnostics.push({
          code: 'PROBLEM_SOURCE_CONTEST_MISMATCH',
          entityId: problem.id,
          message: `${sourceRevisionId} is not scoped to ${problem.contestId}.`,
        });
      } else if (
        source.sourceKind === 'official_problem' &&
        (sourceUrl.resource !== 'task' ||
          sourceUrl.taskId !== problem.officialTaskId ||
          source.officialTaskId !== problem.officialTaskId)
      ) {
        diagnostics.push({
          code: 'PROBLEM_SOURCE_TASK_MISMATCH',
          entityId: problem.id,
          message: `${sourceRevisionId} does not cite ${problem.officialTaskId}.`,
        });
      } else if (
        source.sourceKind === 'official_editorial' &&
        (sourceUrl.resource !== 'editorial_item' ||
          source.officialTaskId !== problem.officialTaskId)
      ) {
        diagnostics.push({
          code: 'PROBLEM_SOURCE_TASK_MISMATCH',
          entityId: problem.id,
          message: `${sourceRevisionId} is not an editorial for ${problem.officialTaskId}.`,
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
    if (tag.parentId) requireRefs(tag.id, 'parentId', [tag.parentId], tagIds);
    requireRefs(tag.id, 'prerequisiteTagIds', tag.prerequisiteTagIds, tagIds);
    requireRefs(
      tag.id,
      'relatedTags',
      tag.relatedTags.map(({ tagId }) => tagId),
      tagIds,
    );
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
    for (const relation of tag.relatedTags) {
      if (
        SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES.includes(
          relation.type as (typeof SYMMETRIC_TECHNIQUE_TAG_RELATION_TYPES)[number],
        ) &&
        !tagById
          .get(relation.tagId)
          ?.relatedTags.some(
            (reverse) => reverse.tagId === tag.id && reverse.type === relation.type,
          )
      ) {
        diagnostics.push({
          code: 'TAG_RELATION_REVERSE_MISSING',
          entityId: tag.id,
          message: `${tag.id}.${relation.type} -> ${relation.tagId} requires a reverse relation.`,
        });
      }
    }
  }
  const tagTermOwners = new Map<string, string>();
  for (const tag of catalog.tags) {
    // Accepted aliases may include the canonical name or spelling variants.
    // They identify one concept; only ownership by different Tags is ambiguous.
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
    requireRefs(unit.id, 'tagIds', unit.tagIds, tagIds);
    if (unit.ownedTagIds !== undefined) {
      requireRefs(unit.id, 'ownedTagIds', unit.ownedTagIds, tagIds);
    }
    requireRefs(unit.id, 'learningOutcomeIds', unit.learningOutcomeIds, outcomeIds);
    if (unit.ownedLearningOutcomeIds !== undefined) {
      requireRefs(unit.id, 'ownedLearningOutcomeIds', unit.ownedLearningOutcomeIds, outcomeIds);
    }
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
    for (const exercise of unit.exercises) {
      requireRefs(
        `${unit.id}:${exercise.key}`,
        'learningOutcomeIds',
        exercise.learningOutcomeIds,
        outcomeIds,
      );
      if (exercise.answer.verificationStatus !== 'passed') {
        diagnostics.push({
          code: 'LEARNING_UNIT_ANSWER_NOT_VERIFIED',
          entityId: unit.id,
          message: `Exercise ${exercise.key} answer is not verified.`,
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
    if (unit.kind !== 'full') {
      const primary = unit.primaryProblemId
        ? authoringUnitByProblemId.get(unit.primaryProblemId)
        : undefined;
      if (!primary) {
        diagnostics.push({
          code: 'AUTHORING_PRIMARY_MISSING',
          entityId: unit.problemId,
          message: `${unit.problemId} must reference an existing primary authoring unit.`,
        });
      } else if (primary.kind !== 'full') {
        diagnostics.push({
          code: 'AUTHORING_PRIMARY_NOT_FULL',
          entityId: unit.problemId,
          message: `${unit.problemId} must reference a full authoring unit.`,
        });
      } else if (primary.problemId === unit.problemId) {
        diagnostics.push({
          code: 'AUTHORING_PRIMARY_SELF_REFERENCE',
          entityId: unit.problemId,
          message: 'An abbreviated authoring unit cannot use itself as its primary Problem.',
        });
      }
    }
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
  const expectedExecutableExamples = deriveExecutableExampleInventory(catalog);
  const expectedExecutableExampleKeys = expectedExecutableExamples.map(
    executableExampleEvidenceLocatorKey,
  );
  const trustedExecutableEvidence = trustedEvidence?.executableExampleEvidence?.evidence;
  if (expectedExecutableExamples.length === 0) {
    if (trustedExecutableEvidence) {
      diagnostics.push({
        code: 'EXECUTABLE_EXAMPLE_EVIDENCE_UNEXPECTED',
        message: 'Executable example evidence exists but the Catalog has no executable examples.',
      });
    }
  } else if (!trustedExecutableEvidence) {
    diagnostics.push({
      code: 'EXECUTABLE_EXAMPLE_EVIDENCE_REQUIRED',
      message: 'Publication requires evidence for every executable example.',
    });
  } else {
    const actualExecutableExampleKeys = trustedExecutableEvidence.items.map(
      executableExampleEvidenceLocatorKey,
    );
    const expectedSubjectDigest = catalog.release.contentSnapshotDigest;
    const evidenceMatchesInventory =
      trustedExecutableEvidence.subjectDigest === expectedSubjectDigest &&
      trustedExecutableEvidence.inventoryDigest === executableExampleInventoryDigest(catalog) &&
      trustedExecutableEvidence.inventoryCount === expectedExecutableExamples.length &&
      trustedExecutableEvidence.checkedCount === expectedExecutableExamples.length &&
      trustedExecutableEvidence.aggregatePassed &&
      trustedExecutableEvidence.items.every(
        (item) => item.passed && item.subjectDigest === expectedSubjectDigest,
      ) &&
      sameStringSet(actualExecutableExampleKeys, expectedExecutableExampleKeys);
    if (!evidenceMatchesInventory) {
      diagnostics.push({
        code: 'EXECUTABLE_EXAMPLE_EVIDENCE_MISMATCH',
        message:
          'Executable example evidence must exactly match the Catalog locator inventory and subject digest.',
      });
    }
  }
  const problemContentPathExists = (
    unit: CatalogLike['authoringUnits'][number],
    path: string,
  ): boolean => {
    const [namespace, localKey, detail] = path.split('.');
    if (!namespace || !localKey) return false;
    if (namespace === 'sections') {
      return detail === undefined && Object.hasOwn(unit.sections, localKey);
    }
    if (namespace === 'claims') {
      return detail === undefined && unit.claims.some((claim) => claim.key === localKey);
    }
    if (namespace === 'examples') {
      return detail === undefined && unit.examples.some((example) => example.key === localKey);
    }
    if (namespace === 'exercises') {
      const exercise = unit.exercises.find((candidate) => candidate.key === localKey);
      return Boolean(
        exercise && (detail === undefined || detail === 'assessment' || detail === 'answer'),
      );
    }
    return false;
  };
  const learningUnitContentPathExists = (
    unit: CatalogLike['learningUnits'][number],
    path: string,
  ): boolean => {
    if (path === 'content') return true;
    const [namespace, localKey, detail] = path.split('.');
    if (!namespace || !localKey) return false;
    if (namespace === 'examples') {
      return detail === undefined && unit.examples.some((example) => example.key === localKey);
    }
    if (namespace === 'exercises') {
      const exercise = unit.exercises.find((candidate) => candidate.key === localKey);
      return Boolean(
        exercise && (detail === undefined || detail === 'assessment' || detail === 'answer'),
      );
    }
    return false;
  };
  const correctionLocatorKey = (
    locator: CatalogLike['correctionImpacts'][number]['affectedContentLocators'][number],
  ): string =>
    locator.ownerType === 'problem'
      ? `problem:${locator.problemId}:${locator.path}`
      : locator.ownerType === 'learning_unit'
        ? `learning_unit:${locator.learningUnitId}:${locator.path}`
        : locator.ownerType === 'problem_placement'
          ? `problem_placement:${locator.problemId}:${locator.path}`
          : `learning_prerequisites:${locator.path}`;
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
      'sourceRevisionIds',
      impact.sourceRevisionIds ?? [impact.sourceRevisionId],
      sourceIds,
    );
    if (impact.affectedContentLocators.length === 0) {
      diagnostics.push({
        code: 'CORRECTION_IMPACT_LOCATORS_EMPTY',
        entityId: impact.id,
        message: 'Correction Impact must enumerate at least one affected content locator.',
      });
    }
    const locatorKeys = impact.affectedContentLocators.map(correctionLocatorKey);
    if (new Set(locatorKeys).size !== locatorKeys.length) {
      diagnostics.push({
        code: 'CORRECTION_IMPACT_LOCATOR_DUPLICATE',
        entityId: impact.id,
        message: 'Correction Impact targets and locators must be unique.',
      });
    }
    for (const locator of impact.affectedContentLocators) {
      const locatorKey = correctionLocatorKey(locator);
      if (locator.ownerType === 'problem') {
        const unit = authoringUnitByProblemId.get(locator.problemId);
        if (!unit) {
          diagnostics.push({
            code: 'CORRECTION_IMPACT_LOCATOR_OWNER_MISSING',
            entityId: impact.id,
            message: `${locatorKey} cannot resolve its Problem authoring unit owner.`,
          });
          continue;
        }
        if (!problemContentPathExists(unit, locator.path)) {
          diagnostics.push({
            code: 'CORRECTION_IMPACT_CONTENT_NOT_FOUND',
            entityId: impact.id,
            message: `${locatorKey} does not resolve to a section or local block.`,
          });
        }
        continue;
      }
      if (locator.ownerType === 'problem_placement') {
        if (!problemIds.has(locator.problemId)) {
          diagnostics.push({
            code: 'CORRECTION_IMPACT_LOCATOR_OWNER_MISSING',
            entityId: impact.id,
            message: `${locatorKey} cannot resolve its Problem placement owner.`,
          });
        }
        continue;
      }
      if (locator.ownerType === 'learning_prerequisites') continue;
      const unit = learningUnitById.get(locator.learningUnitId);
      if (!unit) {
        diagnostics.push({
          code: 'CORRECTION_IMPACT_LOCATOR_OWNER_MISSING',
          entityId: impact.id,
          message: `${locatorKey} cannot resolve its Learning Unit owner.`,
        });
        continue;
      }
      if (!learningUnitContentPathExists(unit, locator.path)) {
        diagnostics.push({
          code: 'CORRECTION_IMPACT_CONTENT_NOT_FOUND',
          entityId: impact.id,
          message: `${locatorKey} does not resolve to Learning Unit content or a local block.`,
        });
      }
    }
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
  }
  const validateDag = (code: string, nodes: readonly CatalogDagNode[]): void => {
    try {
      deterministicTopologicalOrder(nodes);
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
  // Unit prerequisites are authored in the canonical learning-prerequisites
  // policy, independently of the hierarchy and the serialized Catalog order.
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
