import { InstructionQualityEvidenceSchema } from '../domain/schema-parts/verification-evidence.js';

export class InstructionQualityError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'InstructionQualityError';
  }
}

export interface TrustedInstructionQualityInventory {
  readonly releaseDigest: string;
  readonly inventoryDigest: string;
  readonly items: readonly {
    readonly itemId: string;
    readonly category:
      'textbook' | 'explanation' | 'exercise' | 'answer' | 'ui' | 'cli' | 'operations';
    readonly path: string;
    readonly contentDigest: string;
    readonly learningOutcomeIds: readonly string[];
    readonly requiresHumanReview: boolean;
    readonly humanReviewItemId: string | null;
  }[];
  /** Successful review evidence for this inventory, with mode enforced by its own gate. */
  readonly humanReviewEvidence: readonly {
    readonly evidenceId: string;
    readonly reviewItemIds: readonly string[];
    readonly aggregatePassed: boolean;
  }[];
}

interface InstructionQualityShape {
  readonly releaseDigest: string;
  readonly inventoryDigest: string;
  readonly inventoryCount: number;
  readonly checkedCount: number;
  readonly items: readonly {
    readonly itemId: string;
    readonly category: string;
    readonly path: string;
    readonly contentDigest: string;
    readonly learningOutcomeIds: readonly string[];
    readonly automatedPassed: boolean;
    readonly requiresHumanReview: boolean;
    readonly humanReviewItemId: string | null;
  }[];
  readonly humanReviewEvidenceIds: readonly string[];
  readonly blockingFindingCount: number;
  readonly aggregatePassed: boolean;
}

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  if (left.length !== right.length) return false;
  const expected = [...right].sort();
  return [...left].sort().every((value, index) => value === expected[index]);
};

/**
 * Validate quality evidence against the inventory frozen before the check ran.
 * The evidence schema can recompute its own counts, but only this trusted
 * boundary can prevent an empty self-declared inventory from being accepted.
 */
export const validateInstructionQualityEvidence = (
  value: unknown,
  trustedInventory: TrustedInstructionQualityInventory,
): void => {
  const parsed = InstructionQualityEvidenceSchema.safeParse(value);
  if (!parsed.success) {
    throw new InstructionQualityError('INSTRUCTION_QUALITY_SCHEMA_INVALID', parsed.error.message);
  }
  const evidence = parsed.data as InstructionQualityShape;
  const trustedItems = new Map(trustedInventory.items.map((item) => [item.itemId, item] as const));
  if (trustedItems.size !== trustedInventory.items.length) {
    throw new InstructionQualityError(
      'INSTRUCTION_QUALITY_INVENTORY_INVALID',
      'Trusted inventory item IDs must be unique.',
    );
  }
  if (
    evidence.releaseDigest !== trustedInventory.releaseDigest ||
    evidence.inventoryDigest !== trustedInventory.inventoryDigest ||
    evidence.inventoryCount !== trustedInventory.items.length ||
    evidence.checkedCount !== trustedInventory.items.length ||
    evidence.items.length !== trustedInventory.items.length ||
    new Set(evidence.items.map(({ itemId }) => itemId)).size !== evidence.items.length
  ) {
    throw new InstructionQualityError(
      'INSTRUCTION_QUALITY_INVENTORY_MISMATCH',
      'Evidence must exactly cover the trusted instruction inventory.',
    );
  }

  for (const item of evidence.items) {
    const trusted = trustedItems.get(item.itemId);
    if (!trusted) {
      throw new InstructionQualityError(
        'INSTRUCTION_QUALITY_INVENTORY_MISMATCH',
        `Evidence item ${item.itemId} is not in the trusted inventory.`,
      );
    }
    if (
      item.category !== trusted.category ||
      item.path !== trusted.path ||
      item.contentDigest !== trusted.contentDigest ||
      !sameStringSet(item.learningOutcomeIds, trusted.learningOutcomeIds) ||
      item.requiresHumanReview !== trusted.requiresHumanReview ||
      item.humanReviewItemId !== trusted.humanReviewItemId
    ) {
      throw new InstructionQualityError(
        'INSTRUCTION_QUALITY_INVENTORY_MISMATCH',
        `Evidence item ${item.itemId} differs from the trusted inventory.`,
      );
    }
  }

  const expectedReviewItemIds = trustedInventory.items.flatMap((item) =>
    item.requiresHumanReview && item.humanReviewItemId ? [item.humanReviewItemId] : [],
  );
  const trustedEvidenceIds = trustedInventory.humanReviewEvidence.map(
    ({ evidenceId }) => evidenceId,
  );
  const trustedCoveredReviewItemIds = trustedInventory.humanReviewEvidence.flatMap(
    ({ reviewItemIds }) => reviewItemIds,
  );
  if (
    new Set(trustedEvidenceIds).size !== trustedEvidenceIds.length ||
    new Set(trustedCoveredReviewItemIds).size !== trustedCoveredReviewItemIds.length ||
    !sameStringSet(evidence.humanReviewEvidenceIds, trustedEvidenceIds) ||
    !sameStringSet(trustedCoveredReviewItemIds, expectedReviewItemIds) ||
    trustedInventory.humanReviewEvidence.some(({ aggregatePassed }) => !aggregatePassed)
  ) {
    throw new InstructionQualityError(
      'INSTRUCTION_QUALITY_HUMAN_REVIEW_MISMATCH',
      'Human review evidence must cover each required review item exactly once.',
    );
  }

  const complete =
    evidence.items.every(({ automatedPassed }) => automatedPassed) &&
    evidence.blockingFindingCount === 0 &&
    evidence.aggregatePassed;
  if (!complete) {
    throw new InstructionQualityError(
      'INSTRUCTION_QUALITY_INCOMPLETE',
      'Instruction quality evidence is not an approved aggregate.',
    );
  }
};
