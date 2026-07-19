import { z } from 'zod';

import { strictObject, uniqueArray } from '../contract-schema.js';
import {
  ContentBlockKeySchema,
  EntityIdSchema,
  ProblemIdSchema,
  SafePathSchema,
  Sha256Schema,
} from './content-common.js';

const text = z.string().trim().min(1);
const entityIds = uniqueArray(EntityIdSchema);

/** A source-backed claim lives and changes with its owning Problem document. */
export const InlineClaimSchema = strictObject({
  key: ContentBlockKeySchema,
  text,
  sourceRevisionIds: entityIds.min(1),
  authorId: EntityIdSchema,
  verificationStatus: z.enum(['verified', 'unverified', 'stale', 'contradicted']),
});

/** Metadata adjacent to an executable or illustrative code block. */
const inlineExampleFields = {
  key: ContentBlockKeySchema,
  learningOutcomeIds: entityIds.min(1),
  kind: z.enum(['executable', 'pseudocode', 'illustrative']),
  language: text,
  omissions: z.array(text),
  environment: text,
  input: text,
  procedure: z.array(text).min(1),
  expectedResult: text,
  verificationStatus: z.enum(['pending', 'passed', 'not_applicable', 'failed']),
};

const validateInlineExample = (
  example: { readonly kind: string; readonly verificationStatus: string },
  context: z.RefinementCtx,
): void => {
  const executable = example.kind === 'executable';
  if (executable !== (example.verificationStatus !== 'not_applicable')) {
    context.addIssue({
      code: 'custom',
      path: ['verificationStatus'],
      message:
        'Executable examples require a verification result; other examples use not_applicable.',
    });
  }
};

/** Example block owned by one Problem authoring document. */
export const InlineExampleSchema = strictObject({
  ...inlineExampleFields,
  learningUnitIds: entityIds,
}).superRefine(validateInlineExample);

/** Example block owned by one Learning Unit document. */
export const LearningUnitInlineExampleSchema =
  strictObject(inlineExampleFields).superRefine(validateInlineExample);

const InlineAssessmentSchema = strictObject({ method: text, successCondition: text });
const InlineAnswerSchema = strictObject({
  reasoningOrVerification: text,
  procedure: z.array(text).min(1),
  expectedResult: text,
  verificationStatus: z.enum(['pending', 'passed', 'failed']),
});

export const InlineExerciseSchema = strictObject({
  key: ContentBlockKeySchema,
  learningOutcomeIds: entityIds.min(1),
  prerequisiteIds: entityIds,
  attainmentCondition: text,
  assessment: InlineAssessmentSchema,
  answer: InlineAnswerSchema,
});

const FullExplanationSectionsSchema = strictObject({
  reasoning: text,
  technique: text,
  problemSpecificElements: text,
  reviewAdvice: text,
  correctness: text,
  complexity: strictObject({ time: text, space: text }),
  constraintConsistency: text,
  implementationNotes: text,
});
const AbbreviatedExplanationSectionsSchema = strictObject({
  differences: text,
  implementationNotes: text,
});

const authoringUnitCommon = {
  problemId: ProblemIdSchema,
  docPath: SafePathSchema,
  learningOutcomeIds: entityIds.min(1),
  baselineId: EntityIdSchema,
  baselineVersion: z.string().regex(/^\d+\.\d+\.\d+$/u),
  additionalPrerequisiteUnitIds: entityIds,
  excludedTopics: z.array(text),
  tagIds: entityIds.min(1),
  sourceRevisionIds: entityIds.min(1),
  skill: strictObject({
    name: text,
    version: z.string().regex(/^\d+\.\d+\.\d+$/u),
    digest: Sha256Schema,
  }),
  revision: z.number().int().positive(),
  claims: uniqueArray(InlineClaimSchema).min(1),
  examples: uniqueArray(InlineExampleSchema).min(1),
  exercises: uniqueArray(InlineExerciseSchema).min(1),
};

/**
 * The canonical one-file authoring boundary for a Problem.
 * Local keys only identify blocks inside this document; they are not Catalog entities.
 */
export const ProblemAuthoringUnitSchema = strictObject({
  ...authoringUnitCommon,
  kind: z.enum(['full', 'similar', 'supplement']),
  primaryProblemId: ProblemIdSchema.nullable(),
  differenceSummary: text.nullable(),
  // The canonical runtime validator selects the strict section contract from `kind`.
  // JSON Schema keeps this as an object because the branch choice is a semantic invariant.
  sections: z.record(z.string(), z.unknown()),
})
  .superRefine((unit, context) => {
    const full = unit.kind === 'full';
    const validIdentity = full
      ? unit.primaryProblemId === null && unit.differenceSummary === null
      : unit.primaryProblemId !== null && unit.differenceSummary !== null;
    const validSections = full
      ? FullExplanationSectionsSchema.safeParse(unit.sections).success
      : AbbreviatedExplanationSectionsSchema.safeParse(unit.sections).success;
    if (!validIdentity || !validSections) {
      context.addIssue({
        code: 'custom',
        message: 'Authoring unit kind, primary Problem, and section shape conflict.',
      });
    }
    for (const field of ['claims', 'examples', 'exercises'] as const) {
      const keys = unit[field].map(({ key }) => key);
      if (new Set(keys).size !== keys.length) {
        context.addIssue({
          code: 'custom',
          path: [field],
          message: `${field} local keys must be unique.`,
        });
      }
    }
  })
  .meta({
    allOf: [
      {
        if: { properties: { kind: { const: 'full' } }, required: ['kind'] },
        then: {
          properties: {
            primaryProblemId: { type: 'null' },
            differenceSummary: { type: 'null' },
          },
        },
        else: {
          properties: {
            primaryProblemId: {
              type: 'string',
              pattern: '^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$',
            },
            differenceSummary: { type: 'string', minLength: 1 },
          },
        },
      },
    ],
  });

export type ProblemAuthoringUnit = z.infer<typeof ProblemAuthoringUnitSchema>;
