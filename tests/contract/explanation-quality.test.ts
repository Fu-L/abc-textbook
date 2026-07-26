import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  classifyExplanationKind,
  requiredReviewMode,
  validateAuthoringOutput,
  type AuthoringInputPacket,
  type AuthoringSkillSubject,
} from '../../src/lib/authoring/explanation-authoring-skill.js';

interface FixtureManifest {
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly fixtures: readonly { readonly input: AuthoringInputPacket }[];
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T;

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
    const editorialId = input.technicalClaims[0]?.sourceRevisionIds[0];
    if (!editorialId) throw new Error('Editorial source fixture is missing.');
    const unit = {
      problemId: input.problemId,
      docPath: 'src/content/problems/abc212-g.md',
      learningOutcomeIds: input.learningOutcomeIds,
      baselineId: input.baseline.id,
      baselineVersion: input.baseline.version,
      additionalPrerequisiteUnitIds: input.additionalPrerequisiteUnitIds,
      excludedTopics: input.excludedTopics,
      tagIds: input.tagIds,
      sourceRevisionIds: input.sources.map(({ sourceRevisionId }) => sourceRevisionId),
      skill,
      revision: 1,
      kind: 'full',
      primaryProblemId: null,
      differenceSummary: null,
      sections: {
        reasoning: '小さい例から周期性を観察し、位数ごとの個数へ分解する。',
        technique: '約数列挙と乗法位数を組み合わせる。',
        problemSpecificElements: '法が素数であることを使う。',
        reviewAdvice: '位数が法の約数になる理由から復習する。',
        correctness: '各要素を位数で一意に分類するため重複も漏れもない。',
        complexity: { time: 'O(sqrt(P) log P)', space: 'O(sqrt(P))' },
        constraintConsistency: 'P <= 10^9 なので約数列挙が間に合う。',
        implementationNotes: '剰余の乗算を各加算の直後に行う。',
      },
      claims: [
        {
          key: 'claim-order-count',
          text: input.technicalClaims[0]?.text,
          sourceRevisionIds: [editorialId],
          authorId: 'person-maintainer',
          verificationStatus: 'verified',
        },
      ],
      examples: [
        {
          key: 'example-small-prime',
          learningOutcomeIds: input.learningOutcomeIds,
          learningUnitIds: [],
          kind: 'executable',
          language: 'TypeScript 6 / Node.js 24',
          omissions: [],
          environment: 'Node.js 24.18.0',
          input: 'P = 5',
          procedure: ['列挙コードを実行する。', '出力を手計算と比較する。'],
          expectedResult: '4',
          verificationStatus: 'passed',
        },
      ],
      exercises: [
        {
          key: 'exercise-order-proof',
          learningOutcomeIds: input.learningOutcomeIds,
          prerequisiteIds: [],
          attainmentCondition: '位数による分類が一意であることを説明できる。',
          assessment: {
            method: '証明の各写像を確認する。',
            successCondition: '重複と漏れがない理由を述べる。',
          },
          answer: {
            reasoningOrVerification: '各元の最小周期は一意でありP-1の約数である。',
            procedure: ['各元を最小周期へ対応させる。', '各fiberの個数を確認する。'],
            expectedResult: '全元が一度ずつ数えられる。',
            verificationStatus: 'passed',
          },
        },
      ],
    };

    expect(validateAuthoringOutput(unit, skill, input.sources)).toEqual({
      status: 'ready',
      diagnostics: [],
    });

    const incomplete = structuredClone(unit);
    delete (incomplete.sections as Partial<typeof incomplete.sections>).correctness;
    const incompleteExample = incomplete.examples[0];
    const incompleteExercise = incomplete.exercises[0];
    if (!incompleteExample || !incompleteExercise) throw new Error('Output fixture is incomplete.');
    incompleteExample.verificationStatus = 'failed';
    incompleteExercise.answer.verificationStatus = 'pending';
    const result = validateAuthoringOutput(incomplete, skill, input.sources);
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
      validateAuthoringOutput(unverified, skill, input.sources).diagnostics.map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining([
        'TECHNICAL_CLAIM_NOT_VERIFIED',
        'EXAMPLE_NOT_REPRODUCIBLE',
        'ANSWER_MATERIAL_INCOMPLETE',
      ]),
    );
  });

  it('uses self review normally and third-party review only for fixed high-risk reasons', () => {
    expect(requiredReviewMode([])).toBe('self');
    expect(requiredReviewMode(['official_source_conflict'])).toBe('third_party');
    expect(requiredReviewMode(['independent_proof'])).toBe('third_party');
    expect(requiredReviewMode(['major_classification_change'])).toBe('third_party');
  });
});
