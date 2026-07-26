import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  classifyExplanationKind,
  requiredReviewMode,
  validateAuthoringOutput,
  type AuthoringInputPacket,
  type AuthoringSkillSubject,
} from '../../src/lib/authoring/explanation-authoring-skill.js';
import type { ProblemAuthoringUnit } from '../../src/lib/domain/schema-parts/authoring-unit.js';

interface FixtureManifest {
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly representativeOutputPath: string;
  readonly fixtures: readonly { readonly input: AuthoringInputPacket }[];
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T;
const execFileAsync = promisify(execFile);

const comparison = {
  learningOutcomes: true,
  prerequisites: true,
  coreMethod: true,
  proofIdea: true,
  asymptoticComplexity: true,
} as const;

describe('explanation quality contract', () => {
  it('defaults to full and allows similar or supplement only after a complete comparison', () => {
    expect(
      classifyExplanationKind({
        primaryProblemId: null,
        comparison: null,
        additionalElement: null,
      }),
    ).toBe('full');
    expect(
      classifyExplanationKind({
        primaryProblemId: 'abc212-g',
        comparison,
        additionalElement: null,
      }),
    ).toBe('similar');
    expect(
      classifyExplanationKind({
        primaryProblemId: 'abc212-g',
        comparison,
        additionalElement: '境界値に対する追加の合同式変形',
      }),
    ).toBe('supplement');
    expect(
      classifyExplanationKind({
        primaryProblemId: 'abc212-g',
        comparison: { ...comparison, proofIdea: false },
        additionalElement: null,
      }),
    ).toBe('full');
  });

  it('accepts a source-backed complete explanation with reproducible example and answer', async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const input = fixtures.fixtures[0]?.input;
    if (!input) throw new Error('Complete authoring fixture is missing.');
    const skill: AuthoringSkillSubject = {
      name: 'abc-explanation-author',
      version: fixtures.authoringSkillVersion,
      digest: fixtures.authoringSkillDigest,
    };
    const unit = await readJson<ProblemAuthoringUnit>(fixtures.representativeOutputPath);

    expect(unit.sections.reasoning).toContain('制約');
    expect(unit.sections.reasoning).toContain('候補');
    expect(unit.sections.technique).toContain('分類');
    expect(unit.sections.problemSpecificElements).toContain('注目');
    expect(unit.sections.reviewAdvice).toContain('\n- ');

    expect(validateAuthoringOutput(unit, skill, input)).toEqual({
      status: 'ready',
      diagnostics: [],
    });

    const subjectMismatch = structuredClone(unit);
    subjectMismatch.problemId = 'abc999-z';
    subjectMismatch.learningOutcomeIds = ['outcome-fictional'];
    subjectMismatch.baselineId = 'baseline-fictional';
    subjectMismatch.baselineVersion = '9.9.9';
    subjectMismatch.additionalPrerequisiteUnitIds = ['unit-fictional'];
    subjectMismatch.excludedTopics = ['架空の対象外'];
    subjectMismatch.tagIds = ['tag-fictional'];
    const subjectResult = validateAuthoringOutput(subjectMismatch, skill, input);
    expect(subjectResult.status).toBe('on_hold');
    expect(subjectResult.diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        'OUTPUT_PROBLEM_MISMATCH',
        'OUTPUT_LEARNING_OUTCOMES_MISMATCH',
        'OUTPUT_BASELINE_MISMATCH',
        'OUTPUT_PREREQUISITES_MISMATCH',
        'OUTPUT_EXCLUDED_TOPICS_MISMATCH',
        'OUTPUT_TAGS_MISMATCH',
      ]),
    );

    const placementInput = structuredClone(input);
    placementInput.placementCandidate = {
      primaryProblemId: 'abc212-g',
      comparison: {
        learningOutcomes: true,
        prerequisites: true,
        coreMethod: true,
        proofIdea: true,
        asymptoticComplexity: true,
      },
      additionalElement: null,
    };
    const placementResult = validateAuthoringOutput(unit, skill, placementInput);
    expect(placementResult.diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['OUTPUT_KIND_MISMATCH', 'OUTPUT_PRIMARY_PROBLEM_MISMATCH']),
    );

    const baseSource = input.sources[0];
    if (!baseSource) throw new Error('Problem source fixture is missing.');
    const foreignSource: (typeof input.sources)[number] = {
      ...baseSource,
      sourceRevisionId: 'source-foreign-editorial-for-output-test',
      sourceKind: 'official_editorial',
      officialTaskId: 'abc222_g',
      allowedUses: ['technical_claim'],
    };
    const inputWithForeignSource = structuredClone(input);
    inputWithForeignSource.sources.push(foreignSource);
    const foreignSourceOutput = structuredClone(unit);
    const foreignClaim = foreignSourceOutput.claims[0];
    if (!foreignClaim) throw new Error('Output claim fixture is missing.');
    foreignClaim.sourceRevisionIds = [foreignSource.sourceRevisionId];
    foreignSourceOutput.sourceRevisionIds = [
      ...foreignSourceOutput.sourceRevisionIds,
      foreignSource.sourceRevisionId,
    ];
    const foreignSourceResult = validateAuthoringOutput(
      foreignSourceOutput,
      skill,
      inputWithForeignSource,
    );
    expect(foreignSourceResult.diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['OUTPUT_SOURCE_PROBLEM_MISMATCH', 'OUTPUT_CLAIM_SOURCE_MISMATCH']),
    );

    const disallowedSource: (typeof input.sources)[number] = {
      ...baseSource,
      sourceRevisionId: 'source-constraint-only-for-output-test',
      allowedUses: ['constraint_reference'],
    };
    const inputWithDisallowedSource = structuredClone(input);
    inputWithDisallowedSource.sources.push(disallowedSource);
    const disallowedSourceOutput = structuredClone(unit);
    const disallowedClaim = disallowedSourceOutput.claims[0];
    if (!disallowedClaim) throw new Error('Output claim fixture is missing.');
    disallowedClaim.sourceRevisionIds = [disallowedSource.sourceRevisionId];
    disallowedSourceOutput.sourceRevisionIds = [
      ...disallowedSourceOutput.sourceRevisionIds,
      disallowedSource.sourceRevisionId,
    ];
    const disallowedSourceResult = validateAuthoringOutput(
      disallowedSourceOutput,
      skill,
      inputWithDisallowedSource,
    );
    expect(disallowedSourceResult.diagnostics.map(({ code }) => code)).toContain(
      'OUTPUT_SOURCE_USE_NOT_ALLOWED',
    );

    const incomplete = structuredClone(unit);
    delete (incomplete.sections as Partial<typeof incomplete.sections>).correctness;
    const incompleteExample = incomplete.examples[0];
    const incompleteExercise = incomplete.exercises[0];
    if (!incompleteExample || !incompleteExercise) throw new Error('Output fixture is incomplete.');
    incompleteExample.verificationStatus = 'failed';
    incompleteExercise.answer.verificationStatus = 'pending';
    const result = validateAuthoringOutput(incomplete, skill, input);
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ code }) => code)).toContain('OUTPUT_CONTRACT_INVALID');

    const unverified = structuredClone(unit);
    const unverifiedClaim = unverified.claims[0];
    const unverifiedExample = unverified.examples[0];
    const unverifiedExercise = unverified.exercises[0];
    if (!unverifiedClaim || !unverifiedExample || !unverifiedExercise) {
      throw new Error('Output fixture is incomplete.');
    }
    unverifiedClaim.verificationStatus = 'stale';
    unverifiedExample.verificationStatus = 'failed';
    unverifiedExercise.answer.verificationStatus = 'pending';
    expect(
      validateAuthoringOutput(unverified, skill, input).diagnostics.map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining([
        'TECHNICAL_CLAIM_NOT_VERIFIED',
        'EXAMPLE_NOT_REPRODUCIBLE',
        'ANSWER_MATERIAL_INCOMPLETE',
      ]),
    );
  });

  it('executes the representative example and checks its recorded result', async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const unit = await readJson<ProblemAuthoringUnit>(fixtures.representativeOutputPath);
    const example = unit.examples.find(({ key }) => key === 'example-small-prime');
    if (!example) throw new Error('Representative executable example is missing.');
    if (example.kind !== 'executable' || example.executionTarget === null) {
      throw new Error('Representative example must declare an executable target.');
    }

    const result = await execFileAsync(
      process.execPath,
      ['--experimental-strip-types', example.executionTarget, example.input.trim()],
      { cwd: process.cwd(), maxBuffer: 1024 * 1024 },
    );
    expect(result.stdout.trim()).toBe(example.expectedResult);
  });

  it('uses self review normally and third-party review only for fixed high-risk reasons', () => {
    expect(requiredReviewMode([])).toBe('self');
    expect(requiredReviewMode(['official_source_conflict'])).toBe('third_party');
    expect(requiredReviewMode(['independent_proof'])).toBe('third_party');
    expect(requiredReviewMode(['major_classification_change'])).toBe('third_party');
  });
});
