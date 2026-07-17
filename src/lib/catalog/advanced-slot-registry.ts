import { canonicalDigest } from '../domain/canonical-json.js';
import { deterministicTopologicalOrder } from '../validation/validate.js';

export interface ContestAdvancedOrder {
  readonly contestId: string;
  readonly advancedLabels: readonly string[];
  readonly sourceRevisionId?: string;
}

export interface AdvancedSlotRegistry {
  readonly version: '1.0.0';
  readonly labels: readonly string[];
  readonly firstSeenContestByLabel: Readonly<Record<string, string>>;
  readonly orderEvidence: readonly string[];
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
  readonly existingLabels?: readonly string[];
  readonly contests: readonly ContestAdvancedOrder[];
}): AdvancedSlotRegistry => {
  const existingLabels = [...(input.existingLabels ?? [])];
  if (new Set(existingLabels).size !== existingLabels.length) {
    throw new AdvancedSlotRegistryError(
      'DUPLICATE_REGISTRY_LABEL',
      'Existing registry is invalid.',
    );
  }

  const firstSeenContestByLabel: Record<string, string> = {};
  const evidence = new Set<string>();
  const allLabels = new Set(existingLabels);
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

  const contests = [...input.contests].sort((left, right) =>
    left.contestId.localeCompare(right.contestId),
  );
  for (const contest of contests) {
    if (new Set(contest.advancedLabels).size !== contest.advancedLabels.length) {
      throw new AdvancedSlotRegistryError('DUPLICATE_TASK_LABEL', contest.contestId);
    }
    if (contest.sourceRevisionId) evidence.add(contest.sourceRevisionId);
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
  for (const label of existingLabels) firstSeenContestByLabel[label] ??= 'existing-release';

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
    orderEvidence: [...evidence].sort(),
  };
  return Object.freeze({ ...subject, digest: canonicalDigest(subject) });
};

export type ContestSlotAvailability = 'exists' | 'official_absent' | 'unknown' | 'withdrawn';

export const materializeContestSlotStates = (
  registryLabels: readonly string[],
  contest: ContestAdvancedOrder,
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
    const officialOrder = contest.advancedLabels.indexOf(label);
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
