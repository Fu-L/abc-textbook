import { z } from 'zod';

import {
  ProblemAuthoringUnitSchema,
  type ProblemAuthoringUnit,
} from '../domain/schema-parts/authoring-unit.js';

export const EXPLANATION_AUTHORING_SKILL_NAME = 'abc-explanation-author';

const nonEmptyText = z.string().trim().min(1);
const semanticVersion = z.string().regex(/^\d+\.\d+\.\d+$/u);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
const problemId = z.string().regex(/^abc\d{3,}-[a-z][a-z0-9+_-]*$/u);

export const AuthoringSkillSubjectSchema = z
  .object({
    name: z.literal(EXPLANATION_AUTHORING_SKILL_NAME),
    version: semanticVersion,
    digest: sha256,
  })
  .strict();

export type AuthoringSkillSubject = z.infer<typeof AuthoringSkillSubjectSchema>;

const AllowedSourceUseSchema = z.enum([
  'constraint_reference',
  'technical_claim',
  'example_verification',
  'answer_verification',
]);

export const NormalizedAuthoringSourceSchema = z
  .object({
    sourceRevisionId: nonEmptyText,
    path: nonEmptyText,
    sourceKind: z.enum(['official_problem', 'official_editorial']),
    officialTaskId: nonEmptyText,
    checkedAt: z.iso.datetime({ offset: true }),
    termsCheckedAt: z.iso.datetime({ offset: true }),
    allowedUses: z.array(AllowedSourceUseSchema).min(1),
  })
  .strict();

export type NormalizedAuthoringSource = z.infer<typeof NormalizedAuthoringSourceSchema>;

const ComparisonSchema = z
  .object({
    learningOutcomes: z.boolean(),
    prerequisites: z.boolean(),
    coreMethod: z.boolean(),
    proofIdea: z.boolean(),
    asymptoticComplexity: z.boolean(),
  })
  .strict();

export type ExplanationComparison = z.infer<typeof ComparisonSchema>;

export const AuthoringInputPacketSchema = z
  .object({
    problemId,
    learningOutcomeIds: z.array(nonEmptyText).min(1),
    baseline: z.object({ id: nonEmptyText, version: semanticVersion }).strict(),
    additionalPrerequisiteUnitIds: z.array(nonEmptyText),
    excludedTopics: z.array(nonEmptyText),
    tagIds: z.array(nonEmptyText).min(1),
    constraints: z.array(nonEmptyText).min(1),
    placementCandidate: z
      .object({
        primaryProblemId: problemId.nullable(),
        comparison: ComparisonSchema.nullable(),
        additionalElement: nonEmptyText.nullable(),
      })
      .strict(),
    technicalClaims: z
      .array(
        z
          .object({
            text: nonEmptyText,
            sourceRevisionIds: z.array(nonEmptyText).min(1),
          })
          .strict(),
      )
      .min(1),
    sources: z.array(NormalizedAuthoringSourceSchema).min(1),
    skill: AuthoringSkillSubjectSchema,
  })
  .strict();

export type AuthoringInputPacket = z.infer<typeof AuthoringInputPacketSchema>;

export interface AuthoringDiagnostic {
  readonly code: string;
  readonly path: string;
  readonly message: string;
}

export interface InputValidationResult {
  readonly status: 'ready' | 'on_hold';
  readonly diagnostics: readonly AuthoringDiagnostic[];
}

export interface AuthoringPreparationResult {
  readonly status: 'authoring_required' | 'blocked';
  readonly problemId: string | null;
  readonly explanationKind: 'full' | 'similar' | 'supplement' | null;
  readonly templatePath: string | null;
  readonly diagnostics: readonly AuthoringDiagnostic[];
}

const diagnostic = (code: string, path: string, message: string): AuthoringDiagnostic => ({
  code,
  path,
  message,
});

const issuePath = (path: readonly PropertyKey[]): string =>
  path.length === 0 ? '$' : path.map(String).join('.');

const normalizeOfficialTaskId = (officialTaskId: string): string =>
  officialTaskId.replaceAll('_', '-');

const sourceBelongsToProblem = (
  source: NormalizedAuthoringSource,
  targetProblemId: string,
): boolean => normalizeOfficialTaskId(source.officialTaskId) === targetProblemId;

const equalStringArrays = (actual: readonly string[], expected: readonly string[]): boolean =>
  actual.length === expected.length && actual.every((value, index) => value === expected[index]);

const sourceSetKey = (sourceRevisionIds: readonly string[]): string =>
  [...sourceRevisionIds].sort().join('\u0000');

export const classifyExplanationKind = (
  candidate: AuthoringInputPacket['placementCandidate'],
): 'full' | 'similar' | 'supplement' => {
  if (candidate.primaryProblemId === null || candidate.comparison === null) return 'full';
  const sameCore = Object.values(candidate.comparison).every(Boolean);
  if (!sameCore) return 'full';
  return candidate.additionalElement === null ? 'similar' : 'supplement';
};

export const validateAuthoringInput = (
  value: unknown,
  expectedSkill: AuthoringSkillSubject,
): InputValidationResult => {
  const parsed = AuthoringInputPacketSchema.safeParse(value);
  if (!parsed.success) {
    return {
      status: 'on_hold',
      diagnostics: parsed.error.issues.map((issue) =>
        diagnostic(
          'INPUT_REQUIRED_FIELD_INVALID',
          issuePath(issue.path),
          `Required authoring input is missing or invalid: ${issue.message}`,
        ),
      ),
    };
  }

  const input = parsed.data;
  const diagnostics: AuthoringDiagnostic[] = [];
  if (input.skill.version !== expectedSkill.version) {
    diagnostics.push(
      diagnostic(
        'SKILL_VERSION_MISMATCH',
        'skill.version',
        `Expected ${expectedSkill.version}, received ${input.skill.version}.`,
      ),
    );
  }
  if (input.skill.digest !== expectedSkill.digest) {
    diagnostics.push(
      diagnostic(
        'SKILL_DIGEST_MISMATCH',
        'skill.digest',
        'The authoring packet does not reference the frozen skill digest.',
      ),
    );
  }

  const sourceById = new Map(input.sources.map((source) => [source.sourceRevisionId, source]));
  const problemSources = input.sources.filter(
    (source) =>
      source.sourceKind === 'official_problem' && sourceBelongsToProblem(source, input.problemId),
  );
  if (problemSources.length === 0) {
    diagnostics.push(
      diagnostic(
        'OFFICIAL_PROBLEM_SOURCE_REQUIRED',
        'sources',
        `A normalized official problem revision for ${input.problemId} is required.`,
      ),
    );
  }

  for (const [claimIndex, claim] of input.technicalClaims.entries()) {
    for (const [sourceIndex, sourceRevisionId] of claim.sourceRevisionIds.entries()) {
      const path = `technicalClaims.${String(claimIndex)}.sourceRevisionIds.${String(sourceIndex)}`;
      const source = sourceById.get(sourceRevisionId);
      if (!source) {
        diagnostics.push(
          diagnostic(
            'SOURCE_REVISION_MISSING',
            path,
            `${sourceRevisionId} is not present in the input source packet.`,
          ),
        );
      } else {
        if (!source.allowedUses.includes('technical_claim')) {
          diagnostics.push(
            diagnostic(
              'SOURCE_USE_NOT_ALLOWED',
              path,
              `${sourceRevisionId} is not approved for technical claims.`,
            ),
          );
        }
        if (!sourceBelongsToProblem(source, input.problemId)) {
          diagnostics.push(
            diagnostic(
              'SOURCE_PROBLEM_MISMATCH',
              path,
              `${sourceRevisionId} belongs to official task ${source.officialTaskId}, not ${input.problemId}.`,
            ),
          );
        }
      }
    }
  }

  const candidate = input.placementCandidate;
  if (
    (candidate.primaryProblemId === null) !== (candidate.comparison === null) ||
    (candidate.primaryProblemId === null && candidate.additionalElement !== null)
  ) {
    diagnostics.push(
      diagnostic(
        'PLACEMENT_COMPARISON_INCOMPLETE',
        'placementCandidate',
        'A primary Problem and complete comparison must be supplied together.',
      ),
    );
  }

  return { status: diagnostics.length === 0 ? 'ready' : 'on_hold', diagnostics };
};

export const prepareExplanationAuthoring = (
  value: unknown,
  expectedSkill: AuthoringSkillSubject,
): AuthoringPreparationResult => {
  const validation = validateAuthoringInput(value, expectedSkill);
  if (validation.status === 'on_hold') {
    const parsedProblemId = z.object({ problemId }).safeParse(value);
    return {
      status: 'blocked',
      problemId: parsedProblemId.success ? parsedProblemId.data.problemId : null,
      explanationKind: null,
      templatePath: null,
      diagnostics: validation.diagnostics,
    };
  }
  const input = AuthoringInputPacketSchema.parse(value);
  const explanationKind = classifyExplanationKind(input.placementCandidate);
  return {
    status: 'authoring_required',
    problemId: input.problemId,
    explanationKind,
    templatePath:
      explanationKind === 'full'
        ? '.agents/skills/abc-explanation-author/templates/full-explanation.md'
        : '.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md',
    diagnostics: [],
  };
};

export const validateAuthoringOutput = (
  value: unknown,
  expectedSkill: AuthoringSkillSubject,
  input: AuthoringInputPacket,
): InputValidationResult => {
  const parsed = ProblemAuthoringUnitSchema.safeParse(value);
  if (!parsed.success) {
    return {
      status: 'on_hold',
      diagnostics: parsed.error.issues.map((issue) =>
        diagnostic(
          'OUTPUT_CONTRACT_INVALID',
          issuePath(issue.path),
          `ProblemAuthoringUnit is incomplete: ${issue.message}`,
        ),
      ),
    };
  }

  const unit: ProblemAuthoringUnit = parsed.data;
  const inputValidation = validateAuthoringInput(input, expectedSkill);
  if (inputValidation.status === 'on_hold') return inputValidation;
  const validatedInput = AuthoringInputPacketSchema.parse(input);
  const diagnostics: AuthoringDiagnostic[] = [];
  if (unit.skill.name !== expectedSkill.name || unit.skill.version !== expectedSkill.version) {
    diagnostics.push(
      diagnostic(
        'SKILL_VERSION_MISMATCH',
        'skill',
        'Output must use the frozen authoring skill name and version.',
      ),
    );
  }
  if (unit.skill.digest !== expectedSkill.digest) {
    diagnostics.push(
      diagnostic(
        'SKILL_DIGEST_MISMATCH',
        'skill.digest',
        'Output must use the frozen authoring skill digest.',
      ),
    );
  }

  if (unit.problemId !== validatedInput.problemId) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_PROBLEM_MISMATCH',
        'problemId',
        `Output targets ${unit.problemId}, but the validated input targets ${validatedInput.problemId}.`,
      ),
    );
  }
  if (!equalStringArrays(unit.learningOutcomeIds, validatedInput.learningOutcomeIds)) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_LEARNING_OUTCOMES_MISMATCH',
        'learningOutcomeIds',
        'Output learning outcomes must match the validated input packet.',
      ),
    );
  }
  if (
    unit.baselineId !== validatedInput.baseline.id ||
    unit.baselineVersion !== validatedInput.baseline.version
  ) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_BASELINE_MISMATCH',
        'baseline',
        'Output baseline must match the validated input packet.',
      ),
    );
  }
  if (
    !equalStringArrays(
      unit.additionalPrerequisiteUnitIds,
      validatedInput.additionalPrerequisiteUnitIds,
    )
  ) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_PREREQUISITES_MISMATCH',
        'additionalPrerequisiteUnitIds',
        'Output additional prerequisites must match the validated input packet.',
      ),
    );
  }
  if (!equalStringArrays(unit.excludedTopics, validatedInput.excludedTopics)) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_EXCLUDED_TOPICS_MISMATCH',
        'excludedTopics',
        'Output excluded topics must match the validated input packet.',
      ),
    );
  }
  if (!equalStringArrays(unit.tagIds, validatedInput.tagIds)) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_TAGS_MISMATCH',
        'tagIds',
        'Output tags must match the validated input packet.',
      ),
    );
  }
  const allowedLearningOutcomeIds = new Set(validatedInput.learningOutcomeIds);
  for (const [exampleIndex, example] of unit.examples.entries()) {
    for (const [outcomeIndex, learningOutcomeId] of example.learningOutcomeIds.entries()) {
      if (!allowedLearningOutcomeIds.has(learningOutcomeId)) {
        diagnostics.push(
          diagnostic(
            'OUTPUT_LEARNING_OUTCOME_NOT_IN_INPUT',
            `examples.${String(exampleIndex)}.learningOutcomeIds.${String(outcomeIndex)}`,
            `${learningOutcomeId} is not declared by the validated input packet.`,
          ),
        );
      }
    }
  }
  for (const [exerciseIndex, exercise] of unit.exercises.entries()) {
    for (const [outcomeIndex, learningOutcomeId] of exercise.learningOutcomeIds.entries()) {
      if (!allowedLearningOutcomeIds.has(learningOutcomeId)) {
        diagnostics.push(
          diagnostic(
            'OUTPUT_LEARNING_OUTCOME_NOT_IN_INPUT',
            `exercises.${String(exerciseIndex)}.learningOutcomeIds.${String(outcomeIndex)}`,
            `${learningOutcomeId} is not declared by the validated input packet.`,
          ),
        );
      }
    }
  }

  const expectedKind = classifyExplanationKind(validatedInput.placementCandidate);
  if (unit.kind !== expectedKind) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_KIND_MISMATCH',
        'kind',
        `Output kind ${unit.kind} does not match the input placement candidate (${expectedKind}).`,
      ),
    );
  }
  const expectedPrimaryProblemId =
    expectedKind === 'full' ? null : validatedInput.placementCandidate.primaryProblemId;
  if (unit.primaryProblemId !== expectedPrimaryProblemId) {
    diagnostics.push(
      diagnostic(
        'OUTPUT_PRIMARY_PROBLEM_MISMATCH',
        'primaryProblemId',
        `Output primary Problem must be ${expectedPrimaryProblemId ?? 'null'} for the validated placement candidate.`,
      ),
    );
  }

  const sourceById = new Map(
    validatedInput.sources.map((source) => [source.sourceRevisionId, source]),
  );
  const reportOutputSource = (
    sourceRevisionId: string,
    path: string,
    requiredUse?: z.infer<typeof AllowedSourceUseSchema>,
  ): NormalizedAuthoringSource | undefined => {
    const source = sourceById.get(sourceRevisionId);
    if (!source) {
      diagnostics.push(
        diagnostic(
          'OUTPUT_SOURCE_NOT_IN_PACKET',
          path,
          `${sourceRevisionId} was not supplied by the validated input packet.`,
        ),
      );
      return undefined;
    }
    if (!sourceBelongsToProblem(source, validatedInput.problemId)) {
      diagnostics.push(
        diagnostic(
          'OUTPUT_SOURCE_PROBLEM_MISMATCH',
          path,
          `${sourceRevisionId} belongs to official task ${source.officialTaskId}, not ${validatedInput.problemId}.`,
        ),
      );
    }
    if (requiredUse !== undefined && !source.allowedUses.includes(requiredUse)) {
      diagnostics.push(
        diagnostic(
          'OUTPUT_SOURCE_USE_NOT_ALLOWED',
          path,
          `${sourceRevisionId} is not approved for ${requiredUse}.`,
        ),
      );
    }
    return source;
  };

  unit.sourceRevisionIds.forEach((sourceRevisionId, sourceIndex) => {
    reportOutputSource(sourceRevisionId, `sourceRevisionIds.${String(sourceIndex)}`);
  });

  const inputClaimSourceCounts = new Map<string, number>();
  for (const claim of validatedInput.technicalClaims) {
    const key = sourceSetKey(claim.sourceRevisionIds);
    inputClaimSourceCounts.set(key, (inputClaimSourceCounts.get(key) ?? 0) + 1);
  }
  for (const [claimIndex, claim] of unit.claims.entries()) {
    const path = `claims.${String(claimIndex)}.sourceRevisionIds`;
    for (const [sourceIndex, sourceRevisionId] of claim.sourceRevisionIds.entries()) {
      reportOutputSource(sourceRevisionId, `${path}.${String(sourceIndex)}`, 'technical_claim');
    }
    const sourceKey = sourceSetKey(claim.sourceRevisionIds);
    const remainingClaims = inputClaimSourceCounts.get(sourceKey) ?? 0;
    if (remainingClaims === 0) {
      diagnostics.push(
        diagnostic(
          'OUTPUT_CLAIM_SOURCE_MISMATCH',
          path,
          'Each output claim must reference exactly the source revisions declared by an input technical claim.',
        ),
      );
    } else {
      inputClaimSourceCounts.set(sourceKey, remainingClaims - 1);
    }
  }
  for (const [sourceKey, remainingClaims] of inputClaimSourceCounts) {
    if (remainingClaims > 0) {
      diagnostics.push(
        diagnostic(
          'OUTPUT_TECHNICAL_CLAIM_MISSING',
          'claims',
          `The output does not represent ${String(remainingClaims)} input technical claim(s) for source set ${sourceKey}.`,
        ),
      );
    }
  }
  if (unit.claims.some(({ verificationStatus }) => verificationStatus !== 'verified')) {
    diagnostics.push(
      diagnostic(
        'TECHNICAL_CLAIM_NOT_VERIFIED',
        'claims',
        'Every technical claim must be verified against its source revision.',
      ),
    );
  }
  if (
    unit.examples.some(
      ({ verificationStatus }) => !['passed', 'not_applicable'].includes(verificationStatus),
    )
  ) {
    diagnostics.push(
      diagnostic(
        'EXAMPLE_NOT_REPRODUCIBLE',
        'examples',
        'Executable examples must pass; non-executable examples must be marked not_applicable.',
      ),
    );
  }
  if (unit.exercises.some(({ answer }) => answer.verificationStatus !== 'passed')) {
    diagnostics.push(
      diagnostic(
        'ANSWER_MATERIAL_INCOMPLETE',
        'exercises',
        'Every exercise requires a verified reasoning or verification answer.',
      ),
    );
  }
  return { status: diagnostics.length === 0 ? 'ready' : 'on_hold', diagnostics };
};

export type AuthoringRiskReason =
  'official_source_conflict' | 'independent_proof' | 'major_classification_change';

export const requiredReviewMode = (
  riskReasons: readonly AuthoringRiskReason[],
): 'self' | 'third_party' => (riskReasons.length === 0 ? 'self' : 'third_party');
