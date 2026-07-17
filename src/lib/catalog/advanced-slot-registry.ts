import { canonicalDigest } from '../domain/canonical-json.js';
import { deterministicTopologicalOrder } from '../validation/validate.js';

export interface ContestAdvancedOrder {
  readonly contestId: string;
  readonly advancedLabels: readonly string[];
  /** Complete official task order. Required when materializing absolute slot positions. */
  readonly officialTaskOrder?: readonly string[];
  readonly sourceRevisionId?: string;
}

export interface AdvancedSlotRegistry {
  readonly version: '1.0.0';
  readonly labels: readonly string[];
  readonly firstSeenContestByLabel: Readonly<Record<string, string>>;
  readonly orderEvidenceSourceRevisionIds: readonly string[];
  readonly digest: string;
}

export class AdvancedSlotRegistryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'AdvancedSlotRegistryError';
  }
}

export const buildAdvancedSlotRegistry = (input: {
  readonly existingRegistry?: AdvancedSlotRegistry;
  readonly contests: readonly ContestAdvancedOrder[];
}): AdvancedSlotRegistry => {
  const existingLabels = [...(input.existingRegistry?.labels ?? [])];
  const caseFold = (label: string): string => label.toLocaleLowerCase('en-US');
  if (new Set(existingLabels.map(caseFold)).size !== existingLabels.length) {
    throw new AdvancedSlotRegistryError(
      'DUPLICATE_REGISTRY_LABEL',
      'Existing registry is invalid.',
    );
  }

  if (
    input.existingRegistry &&
    canonicalDigest({
      version: input.existingRegistry.version,
      labels: input.existingRegistry.labels,
      firstSeenContestByLabel: input.existingRegistry.firstSeenContestByLabel,
      orderEvidenceSourceRevisionIds: input.existingRegistry.orderEvidenceSourceRevisionIds,
    }) !== input.existingRegistry.digest
  ) {
    throw new AdvancedSlotRegistryError('REGISTRY_DIGEST_MISMATCH', 'Existing registry is stale.');
  }
  if (
    (input.existingRegistry !== undefined &&
      (existingLabels.length === 0 ||
        input.existingRegistry.orderEvidenceSourceRevisionIds.length === 0 ||
        new Set(input.existingRegistry.orderEvidenceSourceRevisionIds).size !==
          input.existingRegistry.orderEvidenceSourceRevisionIds.length ||
        Object.keys(input.existingRegistry.firstSeenContestByLabel).length !==
          existingLabels.length ||
        existingLabels.some(
          (label) => input.existingRegistry?.firstSeenContestByLabel[label] === undefined,
        ))) ||
    existingLabels.some((label) => !/^[A-Za-z][A-Za-z0-9+_-]{0,15}$/u.test(label)) ||
    Object.keys(input.existingRegistry?.firstSeenContestByLabel ?? {}).some(
      (label) => !existingLabels.includes(label),
    ) ||
    Object.values(input.existingRegistry?.firstSeenContestByLabel ?? {}).some(
      (contestId) => !/^abc[0-9]{3,}$/u.test(contestId),
    ) ||
    (input.existingRegistry?.orderEvidenceSourceRevisionIds ?? []).some(
      (revisionId) => !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(revisionId),
    )
  ) {
    throw new AdvancedSlotRegistryError(
      'INVALID_EXISTING_REGISTRY',
      'Registry fields are invalid.',
    );
  }

  const firstSeenContestByLabel: Record<string, string> = {
    ...(input.existingRegistry?.firstSeenContestByLabel ?? {}),
  };
  const evidence = new Set(input.existingRegistry?.orderEvidenceSourceRevisionIds ?? []);
  const allLabels = new Set(existingLabels);
  const globallyObservedCase = new Map(existingLabels.map((label) => [caseFold(label), label]));
  const edges = new Map<string, Set<string>>();
  const ensure = (label: string): void => {
    allLabels.add(label);
    if (!edges.has(label)) edges.set(label, new Set());
  };
  existingLabels.forEach(ensure);
  for (let index = 1; index < existingLabels.length; index += 1) {
    const previous = existingLabels[index - 1];
    const current = existingLabels[index];
    if (previous && current) edges.get(previous)?.add(current);
  }

  const contests = [...input.contests].sort(
    (left, right) =>
      Number(left.contestId.slice(3)) - Number(right.contestId.slice(3)) ||
      left.contestId.localeCompare(right.contestId),
  );
  for (const contest of contests) {
    if (!/^abc[0-9]{3,}$/u.test(contest.contestId)) {
      throw new AdvancedSlotRegistryError('INVALID_CONTEST_ID', contest.contestId);
    }
    if (!contest.sourceRevisionId) {
      throw new AdvancedSlotRegistryError('ORDER_EVIDENCE_MISSING', contest.contestId);
    }
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(contest.sourceRevisionId)) {
      throw new AdvancedSlotRegistryError('INVALID_ORDER_EVIDENCE', contest.sourceRevisionId);
    }
    if (contest.advancedLabels.some((label) => !/^[A-Za-z][A-Za-z0-9+_-]{0,15}$/u.test(label))) {
      throw new AdvancedSlotRegistryError('INVALID_TASK_LABEL', contest.contestId);
    }
    if (new Set(contest.advancedLabels.map(caseFold)).size !== contest.advancedLabels.length) {
      throw new AdvancedSlotRegistryError('DUPLICATE_TASK_LABEL', contest.contestId);
    }
    for (const label of contest.advancedLabels) {
      const folded = caseFold(label);
      const observed = globallyObservedCase.get(folded);
      if (observed !== undefined && observed !== label) {
        throw new AdvancedSlotRegistryError(
          'TASK_LABEL_CASE_CONFLICT',
          `${observed} and ${label} are distinct labels with the same stable identity.`,
        );
      }
      globallyObservedCase.set(folded, label);
    }
    evidence.add(contest.sourceRevisionId);
    contest.advancedLabels.forEach((label) => {
      ensure(label);
      firstSeenContestByLabel[label] ??= contest.contestId;
    });
    for (let index = 1; index < contest.advancedLabels.length; index += 1) {
      const previous = contest.advancedLabels[index - 1];
      const current = contest.advancedLabels[index];
      if (previous && current) edges.get(previous)?.add(current);
    }

    // An unknown suffix observed after a known label belongs immediately before
    // the next label in the already-published registry, if such a label exists.
    const lastKnownIndex = contest.advancedLabels.reduce(
      (found, label, index) => (existingLabels.includes(label) ? index : found),
      -1,
    );
    if (lastKnownIndex >= 0 && lastKnownIndex < contest.advancedLabels.length - 1) {
      const knownLabel = contest.advancedLabels[lastKnownIndex];
      const existingIndex = knownLabel ? existingLabels.indexOf(knownLabel) : -1;
      const nextExisting = existingLabels[existingIndex + 1];
      const unknownTail = contest.advancedLabels.at(-1);
      if (nextExisting && unknownTail) edges.get(unknownTail)?.add(nextExisting);
    }
  }
  if (allLabels.size === 0 || evidence.size === 0) {
    throw new AdvancedSlotRegistryError(
      'EMPTY_REGISTRY',
      'At least one label and order evidence revision are required.',
    );
  }
  for (const label of existingLabels) {
    if (!firstSeenContestByLabel[label]) {
      throw new AdvancedSlotRegistryError(
        'FIRST_SEEN_CONTEST_MISSING',
        `Existing label ${label} has no first-seen contest.`,
      );
    }
  }

  let labels: string[];
  try {
    labels = deterministicTopologicalOrder(
      [...allLabels].map((id) => ({
        id,
        prerequisiteIds: [...allLabels].filter((candidate) => edges.get(candidate)?.has(id)),
        existingRank: existingLabels.indexOf(id),
      })),
      (node) => [node.existingRank < 0 ? Number.MAX_SAFE_INTEGER : node.existingRank],
    ).map(({ id }) => id);
  } catch (error) {
    throw new AdvancedSlotRegistryError(
      'TASK_ORDER_CONFLICT',
      error instanceof Error ? error.message : 'Official order constraints conflict.',
    );
  }

  const subject = {
    version: '1.0.0' as const,
    labels,
    firstSeenContestByLabel,
    orderEvidenceSourceRevisionIds: [...evidence].sort(),
  };
  return Object.freeze({ ...subject, digest: canonicalDigest(subject) });
};

export type ContestSlotAvailability = 'exists' | 'official_absent' | 'unknown' | 'withdrawn';

export const materializeContestSlotStates = (
  registryLabels: readonly string[],
  contest: ContestAdvancedOrder & { readonly officialTaskOrder: readonly string[] },
  stateOverrides: Readonly<
    Partial<Record<string, Extract<ContestSlotAvailability, 'unknown' | 'withdrawn'>>>
  > = {},
): readonly {
  readonly contestId: string;
  readonly label: string;
  readonly officialOrder: number | null;
  readonly availability: ContestSlotAvailability;
  readonly holdReason: string | null;
}[] =>
  registryLabels.map((label) => {
    const officialOrder = contest.officialTaskOrder.indexOf(label);
    const override = stateOverrides[label];
    const availability = override ?? (officialOrder < 0 ? 'official_absent' : 'exists');
    return {
      contestId: contest.contestId,
      label,
      officialOrder: officialOrder < 0 ? null : officialOrder,
      availability,
      holdReason: availability === 'unknown' ? 'Official task state could not be confirmed.' : null,
    };
  });
