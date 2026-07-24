import { z } from 'zod';

import { previewSelectionRulesDigest } from '../../src/lib/preview/cohort-selection.js';
import type { PreviewSelectionRules } from '../../src/lib/preview/cohort-selection.js';
import { PreviewCandidatePoolSchema } from '../../src/lib/corpus/technique-inventory.js';
import type {
  PreviewCandidatePool,
  PreviewCohortCandidateInput,
} from '../../src/lib/corpus/types.js';
import { CorpusCliError } from './cli-support.js';

const nonEmpty = z.string().trim().min(1);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
const uniqueStrings = z.array(nonEmpty).superRefine((values, context) => {
  if (new Set(values).size !== values.length) {
    context.addIssue({ code: 'custom', message: 'Values must be unique.' });
  }
});

const selectionRulesSchema = z.strictObject({
  seedRange: z.strictObject({
    firstContestNumber: z.number().int(),
    lastContestNumber: z.number().int(),
    requireContinuity: z.boolean(),
  }),
  scopeRule: z.strictObject({
    anchorLabel: nonEmpty,
    relation: nonEmpty,
    labelRegistry: nonEmpty,
    requireOfficialStateForEveryRegistryLabel: z.boolean(),
  }),
  cohortRules: z.strictObject({
    domains: uniqueStrings.min(1),
    minimumProblemsPerDomain: z.number().int().positive(),
    minimumProblemsPerOutcome: z.number().int().positive(),
    minimumProblemCount: z.number().int().positive(),
    minimumContestCount: z.number().int().positive(),
    minimumAdvancedLabelCount: z.number().int().positive(),
    stableSortKeys: z.tuple([
      z.literal('contestNumber'),
      z.literal('officialTaskOrder'),
      z.literal('problemId'),
    ]),
    allowFixtureSupplement: z.boolean(),
    requireFixtureBoundaryDeclaration: z.boolean(),
  }),
  publicationBoundary: z.strictObject({
    allowedPreviewRoots: uniqueStrings.min(1),
    forbiddenPublicRoots: uniqueStrings.min(1),
  }),
});

const classificationSchema = z.strictObject({
  domain: nonEmpty,
  outcomeId: nonEmpty,
  sourceRevisionIds: uniqueStrings.min(1),
  rationale: nonEmpty,
});

const candidateInputSchema = z.strictObject({
  problemId: nonEmpty,
  sourceRevisionIds: uniqueStrings.min(1),
  classifications: z.array(classificationSchema),
  selectionEligible: z.boolean(),
  exclusionReason: nonEmpty.nullable(),
  fixtureId: nonEmpty.nullable(),
});

const candidateSchema = candidateInputSchema.extend({
  contestNumber: z.number().int(),
  officialTaskOrder: z.number().int().nonnegative(),
  advancedLabel: nonEmpty,
  officialTaskId: nonEmpty,
  candidateDomains: uniqueStrings,
  candidateOutcomeIds: uniqueStrings,
});

const candidateInputFileSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  batchId: z.literal('abc212-abc263'),
  metadataBatchDigest: sha256,
  allowedDomains: uniqueStrings.min(1),
  candidates: z.array(candidateInputSchema),
  fixtures: z.array(candidateSchema),
});

export interface PreviewSelectionControl {
  readonly phase: string;
  readonly selectionRules: PreviewSelectionRules;
  readonly frozenRulesDigest: string;
}

export interface CandidateInputFile {
  readonly schemaVersion: '1.0.0';
  readonly previewId: 'initial-v1';
  readonly batchId: 'abc212-abc263';
  readonly metadataBatchDigest: string;
  readonly allowedDomains: readonly string[];
  readonly candidates: readonly PreviewCohortCandidateInput[];
  readonly fixtures: PreviewCandidatePool['candidates'];
}

export const parsePreviewSelectionControl = (value: unknown): PreviewSelectionControl => {
  const envelope = z
    .object({ phase: nonEmpty, frozenRulesDigest: sha256 })
    .and(selectionRulesSchema)
    .parse(value);
  const selectionRules: PreviewSelectionRules = {
    seedRange: envelope.seedRange,
    scopeRule: envelope.scopeRule,
    cohortRules: envelope.cohortRules,
    publicationBoundary: envelope.publicationBoundary,
  };
  if (previewSelectionRulesDigest(selectionRules) !== envelope.frozenRulesDigest) {
    throw new CorpusCliError('FROZEN_SELECTION_RULES_DIGEST_MISMATCH', envelope.frozenRulesDigest);
  }
  return {
    phase: envelope.phase,
    selectionRules,
    frozenRulesDigest: envelope.frozenRulesDigest,
  };
};

export const parseCandidateInputFile = (value: unknown): CandidateInputFile =>
  candidateInputFileSchema.parse(value);

export const parsePreviewCandidatePool = (value: unknown): PreviewCandidatePool =>
  PreviewCandidatePoolSchema.parse(value);
