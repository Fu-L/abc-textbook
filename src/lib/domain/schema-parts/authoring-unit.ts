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
  executionTarget: SafePathSchema.nullable(),
  expectedResult: text,
  verificationStatus: z.enum(['pending', 'passed', 'not_applicable', 'failed']),
};

const validateInlineExample = (
  example: {
    readonly kind: string;
    readonly verificationStatus: string;
    readonly executionTarget: string | null;
  },
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
  if (executable !== (example.executionTarget !== null)) {
    context.addIssue({
      code: 'custom',
      path: ['executionTarget'],
      message: 'Executable examples require a repository-relative execution target.',
    });
  }
};

/** Example block owned by one Problem authoring document. */
export const InlineExampleSchema = strictObject({
  ...inlineExampleFields,
  learningUnitIds: entityIds,
}).superRefine(validateInlineExample);

/** Example block owned by one Learning Unit document. */
export const LearningUnitInlineExampleSchema = strictObject({
  ...inlineExampleFields,
}).superRefine(validateInlineExample);

const InlineAssessmentSchema = strictObject({ method: text, successCondition: text });
const InlineAnswerSchema = strictObject({
  reasoningOrVerification: text,
  procedure: z.array(text).min(1),
  expectedResult: text,
  verificationStatus: z.enum(['pending', 'passed', 'failed']),
});

const inlineExerciseFields = {
  key: ContentBlockKeySchema,
  learningOutcomeIds: entityIds.min(1),
  prerequisiteIds: entityIds,
  attainmentCondition: text,
  assessment: InlineAssessmentSchema,
  answer: InlineAnswerSchema,
};

export const InlineExerciseSchema = strictObject(inlineExerciseFields);

/** Exercise block owned by one Learning Unit document. */
export const LearningUnitInlineExerciseSchema = strictObject({
  ...inlineExerciseFields,
});

/** Catch unfinished outlines without guessing mathematical meaning from keywords. */
export const ExplanationTextSchema = text.superRefine((value, context) => {
  const prose = value.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/gu, '[code]');
  const headings = [...prose.matchAll(/^#{1,6}\s+(.+)$/gmu)];
  for (const [index, heading] of headings.entries()) {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? prose.length;
    const next = headings[index + 1];
    const hasSubsection = next !== undefined && next[0].indexOf(' ') > heading[0].indexOf(' ');
    if (!prose.slice(start, end).trim() && !hasSubsection) {
      context.addIssue({
        code: 'custom',
        message: `Explanation part has no content: ${heading[1] ?? ''}`,
      });
    }
  }
});

const FullExplanationSectionsSchema = strictObject({
  reasoning: ExplanationTextSchema,
  technique: ExplanationTextSchema,
  problemSpecificElements: ExplanationTextSchema,
  reviewAdvice: ExplanationTextSchema,
  correctness: ExplanationTextSchema,
  complexity: strictObject({ time: ExplanationTextSchema, space: ExplanationTextSchema }),
  constraintConsistency: ExplanationTextSchema,
  implementationNotes: ExplanationTextSchema,
});
const AbbreviatedExplanationSectionsSchema = strictObject({
  differences: ExplanationTextSchema,
  implementationNotes: ExplanationTextSchema,
});
export const ProblemAuthoringSectionKeySchema = z.enum([
  ...FullExplanationSectionsSchema.keyof().options,
  ...AbbreviatedExplanationSectionsSchema.keyof().options,
]);

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
  }).optional(),
  revision: z.number().int().positive(),
  claims: uniqueArray(InlineClaimSchema).min(1),
  examples: uniqueArray(InlineExampleSchema),
  exercises: uniqueArray(InlineExerciseSchema),
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
    const parsedSections = full
      ? FullExplanationSectionsSchema.safeParse(unit.sections)
      : AbbreviatedExplanationSectionsSchema.safeParse(unit.sections);
    if (!validIdentity) {
      context.addIssue({
        code: 'custom',
        path: ['primaryProblemId'],
        message: 'Authoring unit kind and primary Problem conflict.',
      });
    }
    if (!parsedSections.success) {
      for (const issue of parsedSections.error.issues) {
        context.addIssue({
          code: 'custom',
          path: ['sections', ...issue.path],
          message: issue.message,
        });
      }
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
