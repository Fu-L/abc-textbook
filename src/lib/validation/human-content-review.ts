import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import {
  HumanContentReviewEvidenceSchema,
  MergeReviewEvidenceSchema,
} from '../domain/schema-parts/review-evidence.js';

export class HumanReviewError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'HumanReviewError';
  }
}

interface HumanReviewShape {
  readonly subjectDigest: string;
  readonly inventoryDigest: string;
  readonly applicableChecks: readonly {
    readonly checkId: string;
    readonly command: string;
    readonly subjectDigest: string;
    readonly resultPath: string;
    readonly exitCode: number;
    readonly passed: boolean;
    readonly completedAt: string;
    readonly executedByReviewerId: string;
    readonly resultDigest: string;
  }[];
  readonly applicableCheckCount: number;
  readonly passedApplicableCheckCount: number;
  readonly reviewerExecutedCheckSetDigest: string;
  readonly authors: readonly {
    readonly personId: string;
    readonly authoredItemIds: readonly string[];
  }[];
  readonly reviewers: readonly { readonly personId: string }[];
  readonly reviewItems: readonly {
    readonly reviewItemId: string;
    readonly kind: string;
    readonly subjectPaths: readonly string[];
    readonly reviewerId: string;
    readonly authorIds: readonly string[];
    readonly decision: string;
    readonly findings: readonly { readonly severity: string; readonly resolved: boolean }[];
  }[];
  readonly outcomeCoverageReview: {
    readonly reviewerId: string;
    readonly authorIds: readonly string[];
    readonly decision: string;
  };
  readonly inventoryItemCount: number;
  readonly reviewedItemCount: number;
  readonly approvedItemCount: number;
  readonly changesRequestedItemCount: number;
  readonly unreviewedItemCount: number;
  readonly outcomeCoverageConfirmed: boolean;
  readonly aggregatePassed: boolean;
  readonly evidenceDigest: string;
}

export interface TrustedReviewCheckInventory {
  readonly subjectDigest: string;
  readonly inventoryDigest: string;
  readonly applicableChecks: readonly {
    readonly checkId: string;
    readonly command: string;
  }[];
  readonly reviewItems: readonly {
    readonly reviewItemId: string;
    readonly kind: 'outcome_coverage' | 'non_automatable_claim' | 'non_automatable_example';
    readonly subjectPaths: readonly string[];
    readonly authorIds: readonly string[];
  }[];
}

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedRight = [...right].sort();
  return (
    left.length === right.length &&
    [...left].sort().every((item, index) => item === sortedRight[index])
  );
};

export const validateHumanContentReview = (
  value: unknown,
  trustedInventory: TrustedReviewCheckInventory,
): void => {
  const parsed = HumanContentReviewEvidenceSchema.safeParse(value);
  if (!parsed.success) {
    throw new HumanReviewError('HUMAN_REVIEW_SCHEMA_INVALID', parsed.error.message);
  }
  const evidence = value as HumanReviewShape;
  const authors = new Set(evidence.authors.map(({ personId }) => personId));
  const reviewers = new Set(evidence.reviewers.map(({ personId }) => personId));
  if (authors.size !== evidence.authors.length || reviewers.size !== evidence.reviewers.length) {
    throw new HumanReviewError('REVIEW_INVENTORY_INVALID', 'People must be unique.');
  }
  const gateReviewer = evidence.outcomeCoverageReview.reviewerId;
  if (!reviewers.has(gateReviewer) || authors.has(gateReviewer)) {
    throw new HumanReviewError('REVIEWER_NOT_INDEPENDENT', gateReviewer);
  }
  if (evidence.outcomeCoverageReview.authorIds.includes(gateReviewer)) {
    throw new HumanReviewError('REVIEWER_NOT_INDEPENDENT', gateReviewer);
  }
  const evidenceCheckIds = evidence.applicableChecks.map(({ checkId }) => checkId);
  const trustedCheckIds = trustedInventory.applicableChecks.map(({ checkId }) => checkId);
  if (
    trustedInventory.subjectDigest !== evidence.subjectDigest ||
    trustedInventory.inventoryDigest !== evidence.inventoryDigest ||
    new Set(evidenceCheckIds).size !== evidenceCheckIds.length ||
    new Set(trustedCheckIds).size !== trustedCheckIds.length ||
    [...evidenceCheckIds].sort().join('\n') !== [...trustedCheckIds].sort().join('\n')
  ) {
    throw new HumanReviewError(
      'REVIEWER_CHECK_INVENTORY_INVALID',
      'Evidence does not exactly cover the trusted check inventory.',
    );
  }
  const trustedCommands = new Map(
    trustedInventory.applicableChecks.map(({ checkId, command }) => [checkId, command]),
  );
  for (const check of evidence.applicableChecks) {
    if (
      check.command !== trustedCommands.get(check.checkId) ||
      check.executedByReviewerId !== gateReviewer ||
      check.subjectDigest !== evidence.subjectDigest ||
      check.exitCode !== 0 ||
      !check.passed
    ) {
      throw new HumanReviewError('REVIEWER_CHECK_INVENTORY_INVALID', check.checkId);
    }
  }

  const trustedItems = new Map(
    trustedInventory.reviewItems.map((item) => [item.reviewItemId, item] as const),
  );
  const evidenceItemIds = evidence.reviewItems.map(({ reviewItemId }) => reviewItemId);
  if (
    trustedItems.size !== trustedInventory.reviewItems.length ||
    new Set(evidenceItemIds).size !== evidenceItemIds.length ||
    !sameStringSet(evidenceItemIds, [...trustedItems.keys()])
  ) {
    throw new HumanReviewError(
      'REVIEW_ITEM_INVENTORY_INVALID',
      'Evidence must exactly cover the fixed review-item inventory.',
    );
  }

  const expectedAuthoredItems = new Map<string, string[]>();
  for (const trustedItem of trustedInventory.reviewItems) {
    if (new Set(trustedItem.authorIds).size !== trustedItem.authorIds.length) {
      throw new HumanReviewError('REVIEW_ITEM_INVENTORY_INVALID', trustedItem.reviewItemId);
    }
    for (const authorId of trustedItem.authorIds) {
      const itemIds = expectedAuthoredItems.get(authorId) ?? [];
      itemIds.push(trustedItem.reviewItemId);
      expectedAuthoredItems.set(authorId, itemIds);
    }
  }
  if (!sameStringSet([...authors], [...expectedAuthoredItems.keys()])) {
    throw new HumanReviewError('AUTHOR_INVENTORY_INVALID', 'Author inventory is incomplete.');
  }
  for (const author of evidence.authors) {
    if (!sameStringSet(author.authoredItemIds, expectedAuthoredItems.get(author.personId) ?? [])) {
      throw new HumanReviewError('AUTHOR_INVENTORY_INVALID', author.personId);
    }
  }
  for (const item of evidence.reviewItems) {
    const trustedItem = trustedItems.get(item.reviewItemId);
    if (!trustedItem) {
      throw new HumanReviewError('REVIEW_ITEM_INVENTORY_INVALID', item.reviewItemId);
    }
    if (
      item.kind !== trustedItem.kind ||
      !sameStringSet(item.subjectPaths, trustedItem.subjectPaths) ||
      !sameStringSet(item.authorIds, trustedItem.authorIds)
    ) {
      throw new HumanReviewError('REVIEW_ITEM_INVENTORY_INVALID', item.reviewItemId);
    }
    if (
      !reviewers.has(item.reviewerId) ||
      trustedItem.authorIds.includes(item.reviewerId) ||
      authors.has(item.reviewerId)
    ) {
      throw new HumanReviewError('ITEM_REVIEWER_NOT_INDEPENDENT', item.reviewerId);
    }
    if (
      item.decision === 'approved' &&
      item.findings.some((finding) => finding.severity === 'blocking' && !finding.resolved)
    ) {
      throw new HumanReviewError('UNRESOLVED_BLOCKING_FINDING', item.reviewerId);
    }
  }
  const checkSetDigest = canonicalDigest(
    evidence.applicableChecks
      .map(
        ({
          checkId,
          command,
          subjectDigest,
          resultPath,
          resultDigest,
          exitCode,
          passed,
          completedAt,
          executedByReviewerId,
        }) => ({
          checkId,
          command,
          subjectDigest,
          resultPath,
          resultDigest,
          exitCode,
          passed,
          completedAt,
          executedByReviewerId,
        }),
      )
      .sort((left, right) => left.checkId.localeCompare(right.checkId)),
  );
  if (checkSetDigest !== evidence.reviewerExecutedCheckSetDigest) {
    throw new HumanReviewError('REVIEW_CHECK_SET_DIGEST_MISMATCH', 'Check inventory changed.');
  }
  const countsAreComplete =
    evidence.applicableCheckCount === evidence.applicableChecks.length &&
    evidence.passedApplicableCheckCount === evidence.applicableCheckCount &&
    evidence.inventoryItemCount === evidence.reviewItems.length &&
    evidence.reviewedItemCount === evidence.reviewItems.length &&
    evidence.approvedItemCount + evidence.changesRequestedItemCount ===
      evidence.reviewedItemCount &&
    evidence.changesRequestedItemCount === 0 &&
    evidence.unreviewedItemCount === 0 &&
    evidence.reviewItems.every(
      (item) => item.decision === 'approved' && item.findings.every((finding) => finding.resolved),
    );
  if (!countsAreComplete || !evidence.outcomeCoverageConfirmed || !evidence.aggregatePassed) {
    throw new HumanReviewError(
      'REVIEW_INCOMPLETE',
      'Review counts or aggregate result are incomplete.',
    );
  }
  if (
    digestWithoutField(value as Record<string, unknown>, 'evidenceDigest') !==
    evidence.evidenceDigest
  ) {
    throw new HumanReviewError('REVIEW_EVIDENCE_DIGEST_MISMATCH', 'Evidence digest is stale.');
  }
};

export const assertCurrentConstitution = (input: {
  readonly constitutionVersion: string;
  readonly constitutionDigest: string;
  readonly currentVersion: string;
  readonly currentDigest: string;
  readonly passed: boolean;
  readonly violationCount: number;
}): void => {
  if (
    input.constitutionVersion !== input.currentVersion ||
    input.constitutionDigest !== input.currentDigest ||
    !input.passed ||
    input.violationCount !== 0
  ) {
    throw new HumanReviewError('STALE_CONSTITUTION_CHECK', 'Constitution check is not current.');
  }
};

export interface TrustedMergeReviewContext {
  readonly subjectDigest: string;
  readonly workManifestPath: string;
  readonly workManifestDigest: string;
  readonly humanReview: {
    readonly id: string;
    readonly digest: string;
    readonly subjectDigest: string;
    readonly aggregatePassed: boolean;
  };
  readonly constitutionVersion: string;
  readonly constitutionDigest: string;
}

export const validateMergeReviewEvidence = (
  value: unknown,
  trusted: TrustedMergeReviewContext,
): void => {
  const parsed = MergeReviewEvidenceSchema.safeParse(value);
  if (!parsed.success) {
    throw new HumanReviewError('MERGE_REVIEW_SCHEMA_INVALID', parsed.error.message);
  }
  const evidence = parsed.data;
  if (
    evidence.logicalChangeSubjectDigest !== trusted.subjectDigest ||
    evidence.workManifestPath !== trusted.workManifestPath ||
    evidence.workManifestDigest !== trusted.workManifestDigest ||
    evidence.applicableChecks.some(
      (check) => check.subjectDigest !== trusted.subjectDigest || check.exitCode !== 0,
    )
  ) {
    throw new HumanReviewError(
      'MERGE_REVIEW_SUBJECT_MISMATCH',
      'Checks and work manifest must match the fixed change subject.',
    );
  }
  if (
    evidence.humanContentReviewEvidenceId !== trusted.humanReview.id ||
    evidence.humanContentReviewEvidenceDigest !== trusted.humanReview.digest ||
    trusted.humanReview.subjectDigest !== trusted.subjectDigest ||
    !trusted.humanReview.aggregatePassed
  ) {
    throw new HumanReviewError(
      'MERGE_HUMAN_REVIEW_INCOMPLETE',
      'A complete human review for the current subject is required.',
    );
  }
  assertCurrentConstitution({
    constitutionVersion: evidence.constitutionCheck.constitutionVersion,
    constitutionDigest: evidence.constitutionCheck.constitutionDigest,
    currentVersion: trusted.constitutionVersion,
    currentDigest: trusted.constitutionDigest,
    passed: evidence.constitutionCheck.passed,
    violationCount: evidence.constitutionCheck.violationCount,
  });
  if (evidence.unresolvedBlockingFindingCount !== 0 || !evidence.mergeApproved) {
    throw new HumanReviewError('MERGE_REVIEW_INCOMPLETE', 'Merge review is not approved.');
  }
  if (digestWithoutField(evidence, 'evidenceDigest') !== evidence.evidenceDigest) {
    throw new HumanReviewError('MERGE_REVIEW_DIGEST_MISMATCH', 'Merge evidence digest is stale.');
  }
};
