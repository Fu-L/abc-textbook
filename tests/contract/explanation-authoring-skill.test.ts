import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  prepareExplanationAuthoring,
  validateAuthoringInput,
  validateAuthoringOutput,
  type AuthoringInputPacket,
} from '../../src/lib/authoring/explanation-authoring-skill.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { prepareAuthoringResults } from '../../scripts/update-abc/author.js';
import { ProblemAuthoringUnitSchema } from '../../src/lib/domain/schema-parts/authoring-unit.js';

interface SkillArtifact {
  readonly path: string;
  readonly digest: string;
}

interface SkillManifest {
  readonly status: string;
  readonly authoringSkillName: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly sourceNormalizationVersion: string;
  readonly artifacts: readonly SkillArtifact[];
  readonly sourcePacket: {
    readonly path: string;
    readonly digest: string;
    readonly inputProblemIds: readonly string[];
    readonly inputSourceRevisionIds: readonly string[];
    readonly allowedUses: readonly string[];
  };
  readonly inputContract: unknown;
  readonly outputContract: unknown;
  readonly reviewPolicy: unknown;
}

interface FixtureManifest {
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly fixtures: readonly {
    readonly fixtureId: string;
    readonly expectedStatus: string;
    readonly expectedKind?: string;
    readonly expectedDiagnosticCodes?: readonly string[];
    readonly input: unknown;
  }[];
}

interface SourcePacket {
  readonly sourceNormalizationVersion: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly problemInputs: readonly {
    readonly problemId: string;
    readonly problemPath: string;
    readonly officialTaskId: string;
    readonly constraintsSummary: string;
    readonly sourceRevisionIds: readonly string[];
    readonly checkedAt: string;
  }[];
  readonly sources: readonly {
    readonly sourceRevisionId: string;
    readonly path: string;
    readonly sourceKind: string;
    readonly officialTaskId: string;
    readonly checkedAt: string;
    readonly termsCheckedAt: string;
    readonly allowedUses: readonly string[];
  }[];
  readonly [key: string]: unknown;
}

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T;

const withoutField = (
  value: Readonly<Record<string, unknown>>,
  field: string,
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));

describe('explanation authoring skill contract', () => {
  it('reads the historical skill subject without binding current instructions to its digest', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
    const sourcePacket = await readJson<SourcePacket>(manifest.sourcePacket.path);
    const artifactDigests = manifest.artifacts;
    const packetDigest = canonicalDigest(withoutField(sourcePacket, 'authoringSkillDigest'));
    const calculatedSkillDigest = canonicalDigest({
      authoringSkillName: manifest.authoringSkillName,
      authoringSkillVersion: manifest.authoringSkillVersion,
      sourceNormalizationVersion: manifest.sourceNormalizationVersion,
      artifacts: artifactDigests,
      sourcePacketDigest: packetDigest,
      inputContract: manifest.inputContract,
      outputContract: manifest.outputContract,
      reviewPolicy: manifest.reviewPolicy,
    });

    expect(manifest.status).toBe('frozen');
    expect(packetDigest).toBe(manifest.sourcePacket.digest);
    expect(calculatedSkillDigest).toBe(manifest.authoringSkillDigest);
    expect(sourcePacket.authoringSkillVersion).toBe(manifest.authoringSkillVersion);
    expect(sourcePacket.authoringSkillDigest).toBe(manifest.authoringSkillDigest);
    expect(sourcePacket.sourceNormalizationVersion).toBe(manifest.sourceNormalizationVersion);
    expect(sourcePacket.sources.map(({ sourceRevisionId }) => sourceRevisionId)).toEqual(
      manifest.sourcePacket.inputSourceRevisionIds,
    );
    expect(sourcePacket.problemInputs.map(({ problemId }) => problemId)).toEqual(
      manifest.sourcePacket.inputProblemIds,
    );
    expect(
      [...new Set(sourcePacket.sources.flatMap(({ allowedUses }) => allowedUses))].sort(),
    ).toEqual([...manifest.sourcePacket.allowedUses].sort());

    for (const source of sourcePacket.sources) {
      const revision = await readJson<{
        readonly id: string;
        readonly sourceKind: string;
        readonly officialTaskId: string;
        readonly checkedAt: string;
        readonly termsCheckedAt: string;
      }>(source.path);
      expect(source).toMatchObject({
        sourceRevisionId: revision.id,
        sourceKind: revision.sourceKind,
        officialTaskId: revision.officialTaskId,
        checkedAt: revision.checkedAt,
        termsCheckedAt: revision.termsCheckedAt,
      });
    }
    for (const problemInput of sourcePacket.problemInputs) {
      const problem = await readJson<{
        readonly id: string;
        readonly officialTaskId: string;
        readonly constraintsSummary: string;
        readonly sourceRevisionIds: readonly string[];
        readonly checkedAt: string;
      }>(problemInput.problemPath);
      expect(problemInput).toMatchObject({
        problemId: problem.id,
        officialTaskId: problem.officialTaskId,
        constraintsSummary: problem.constraintsSummary,
        sourceRevisionIds: problem.sourceRevisionIds,
        checkedAt: problem.checkedAt,
      });
    }
  });

  it('keeps the complete writing policy in the current skill instructions', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
    const artifactContents = await Promise.all(
      manifest.artifacts.map(async ({ path }) => ({ path, content: await readFile(path, 'utf8') })),
    );
    const combinedSkill = artifactContents.map(({ content }) => content).join('\n');
    const writingPolicy = artifactContents
      .find(({ path }) => path.endsWith('/references/writing-policy.md'))
      ?.content.replace(/\s+/gu, ' ');
    const fullTemplate = artifactContents.find(({ path }) =>
      path.endsWith('/templates/full-explanation.md'),
    )?.content;
    const abbreviatedTemplate = artifactContents.find(({ path }) =>
      path.endsWith('/templates/abbreviated-explanation.md'),
    )?.content;

    expect(writingPolicy).toContain('自然な考察ロードマップ');
    expect(writingPolicy).toContain('正解から逆算した一直線のこじつけは避ける');
    expect(writingPolicy).toContain('AtCoder赤コーダー相当');
    expect(writingPolicy).toContain('部分集合の部分集合は O(3^N)');
    expect(writingPolicy).toContain('転倒数を Fenwick Tree で数える');
    expect(writingPolicy).toContain('約数の個数は意外と少ない');
    expect(writingPolicy).toContain('最大値の最小化は二分探索');
    expect(writingPolicy).toContain('操作の順番を逆から考える');
    expect(writingPolicy).toContain('実は不変量が存在する');
    expect(writingPolicy).toContain('実は状態数が少ない');
    expect(writingPolicy).toContain('ARC、AGC、Codeforces Div. 1（CF Div1）、UCUP');
    expect(writingPolicy).toContain('個数制限は設けない');
    expect(writingPolicy).toContain('典型要素');
    expect(writingPolicy).toContain('問題固有の要素');
    expect(writingPolicy).toContain('復習時の助言と文体');
    expect(writingPolicy).toContain('`full`');
    expect(writingPolicy).toContain('`similar`');
    expect(writingPolicy).toContain('`supplement`');
    expect(fullTemplate).toContain('## 自然な考察ロードマップ');
    expect(fullTemplate).toContain('## 典型要素');
    expect(fullTemplate).toContain('## 問題固有の要素と見抜き方');
    expect(abbreviatedTemplate).toContain('## 差分に気づくまでの考察');
    expect(abbreviatedTemplate).toContain('## コーチからの復習メッセージ');
    expect(combinedSkill).not.toMatch(/(?:^|[\s`/])prompt\.md(?:$|[\s`])/m);
  });

  it('prepares the fixed complete fixtures and holds the incomplete fixture', async () => {
    const fixtureManifest = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    expect(fixtureManifest.fixtures).toHaveLength(3);

    for (const fixture of fixtureManifest.fixtures) {
      const result = prepareExplanationAuthoring(fixture.input);
      expect(result.status, fixture.fixtureId).toBe(fixture.expectedStatus);
      if (fixture.expectedKind !== undefined) {
        expect(result.explanationKind, fixture.fixtureId).toBe(fixture.expectedKind);
      }
      if (fixture.expectedDiagnosticCodes !== undefined) {
        expect(
          result.diagnostics.map(({ code }) => code),
          fixture.fixtureId,
        ).toEqual(expect.arrayContaining([...fixture.expectedDiagnosticCodes]));
      }
    }
  });

  it('accepts an old skill version while holding unresolved claim sources', async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const complete = structuredClone(fixtures.fixtures[0]?.input);
    if (typeof complete !== 'object' || complete === null) throw new Error('Fixture is missing.');
    const input = complete as {
      skill: { version: string };
      technicalClaims: { sourceRevisionIds: string[] }[];
    };
    input.skill.version = '9.9.9';
    const firstClaim = input.technicalClaims[0];
    if (!firstClaim) throw new Error('Technical claim fixture is missing.');
    firstClaim.sourceRevisionIds = ['source-revision-missing'];

    const result = validateAuthoringInput(input);
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ code }) => code)).not.toContain('SKILL_VERSION_MISMATCH');
    expect(result.diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['SOURCE_REVISION_MISSING']),
    );
  });

  it('holds a technical claim that cites another Problem source revision', async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const complete = fixtures.fixtures[0]?.input as AuthoringInputPacket | undefined;
    const otherProblem = fixtures.fixtures[1]?.input as AuthoringInputPacket | undefined;
    if (!complete || !otherProblem) throw new Error('Problem fixtures are missing.');
    const foreignSource = otherProblem.sources.find(
      ({ sourceKind }) => sourceKind === 'official_editorial',
    );
    if (!foreignSource) throw new Error('Foreign editorial source fixture is missing.');

    const input = structuredClone(complete);
    const firstClaim = input.technicalClaims[0];
    if (!firstClaim) throw new Error('Technical claim fixture is missing.');
    input.sources.push(foreignSource);
    firstClaim.sourceRevisionIds = [foreignSource.sourceRevisionId];

    const result = validateAuthoringInput(input);
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ code }) => code)).toContain('SOURCE_PROBLEM_MISMATCH');
  });

  it('binds the displayed Ex slot to its official h task without allowing another contest', async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const input = structuredClone(fixtures.fixtures[0]?.input) as AuthoringInputPacket;
    input.problemId = 'abc274-ex';
    input.sources.forEach((source) => {
      source.officialTaskId = 'abc274_h';
    });
    expect(validateAuthoringInput(input).status).toBe('ready');
    input.sources.forEach((source) => {
      source.officialTaskId = 'abc275_h';
    });
    expect(validateAuthoringInput(input).diagnostics.map(({ code }) => code)).toContain(
      'SOURCE_PROBLEM_MISMATCH',
    );
  });

  const freshFixture = async () => {
    const fixtures = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    const input = structuredClone(fixtures.fixtures[0]?.input) as AuthoringInputPacket;
    delete input.skill;
    const unit = ProblemAuthoringUnitSchema.parse(
      await readJson<unknown>('tests/fixtures/authoring-skill/full-abc212-g.json'),
    );
    delete unit.skill;
    unit.examples = [];
    unit.exercises = [];
    return { input, unit };
  };

  it('prepares and validates new authoring without skill evidence or independent exercises', async () => {
    const { input, unit } = await freshFixture();
    expect(prepareExplanationAuthoring(input).status).toBe('authoring_required');
    expect(validateAuthoringOutput(unit, input)).toEqual({ status: 'ready', diagnostics: [] });
    const result = prepareAuthoringResults({
      targets: [{ problemId: input.problemId, slotLabel: 'G', draftPath: unit.docPath }],
    });
    expect(result[0]).not.toHaveProperty('authoringSkillDigest');
    expect(result[0]).not.toHaveProperty('authoringSkillVersion');
  });

  it('type-checks any historical skill fields without requiring current version equality', async () => {
    const { input, unit } = await freshFixture();
    const skill = {
      name: 'abc-explanation-author' as const,
      version: '0.1.0',
      digest: 'a'.repeat(64),
    };
    expect(validateAuthoringInput({ ...input, skill }).status).toBe('ready');
    expect(validateAuthoringOutput({ ...unit, skill }, input).status).toBe('ready');
    expect(validateAuthoringInput({ ...input, skill: { ...skill, digest: 42 } }).status).toBe(
      'on_hold',
    );
    expect(
      validateAuthoringOutput({ ...unit, skill: { ...skill, version: null } }, input).status,
    ).toBe('on_hold');
  });

  it('keeps task, source-use, and executable verification checks for evidence-free output', async () => {
    const { input, unit } = await freshFixture();
    const wrongTask = structuredClone(input);
    wrongTask.sources.forEach((source) => {
      source.officialTaskId = 'abc213_g';
    });
    expect(validateAuthoringOutput(unit, wrongTask).diagnostics.map(({ code }) => code)).toContain(
      'SOURCE_PROBLEM_MISMATCH',
    );
    const disallowed = structuredClone(input);
    disallowed.sources.forEach((source) => {
      source.allowedUses = ['constraint_reference'];
    });
    expect(validateAuthoringOutput(unit, disallowed).diagnostics.map(({ code }) => code)).toContain(
      'SOURCE_USE_NOT_ALLOWED',
    );
    const legacyUnit = ProblemAuthoringUnitSchema.parse(
      await readJson<unknown>('tests/fixtures/authoring-skill/full-abc212-g.json'),
    );
    unit.examples = legacyUnit.examples;
    const example = unit.examples[0];
    if (!example) throw new Error('Missing executable fixture.');
    expect(validateAuthoringOutput(unit, input).status).toBe('ready');
    example.verificationStatus = 'pending';
    expect(validateAuthoringOutput(unit, input).diagnostics.map(({ code }) => code)).toContain(
      'EXAMPLE_NOT_REPRODUCIBLE',
    );
    example.verificationStatus = 'failed';
    expect(validateAuthoringOutput(unit, input).diagnostics.map(({ code }) => code)).toContain(
      'EXAMPLE_NOT_REPRODUCIBLE',
    );
  });

  it.each(['unverified', 'stale', 'contradicted'] as const)(
    'holds %s technical claims without management evidence',
    async (verificationStatus) => {
      const { input, unit } = await freshFixture();
      const claim = unit.claims[0];
      if (!claim) throw new Error('Missing claim fixture.');
      claim.verificationStatus = verificationStatus;
      expect(validateAuthoringOutput(unit, input).diagnostics.map(({ code }) => code)).toContain(
        'TECHNICAL_CLAIM_NOT_VERIFIED',
      );
    },
  );

  it.each([
    ['reasoning', '', 'sections.reasoning'],
    ['reasoning', '### 状態の定義\n\n### 遷移と手順\n\n更新を行う。', 'sections.reasoning'],
    [
      'reasoning',
      '### 状態の定義\n\ndp[i] は i 番目までの最適値。\n\n### 遷移と手順\n',
      'sections.reasoning',
    ],
    ['correctness', '', 'sections.correctness'],
    ['implementationNotes', '', 'sections.implementationNotes'],
    ['constraintConsistency', '', 'sections.constraintConsistency'],
    ['complexity', { time: '', space: 'O(N)' }, 'sections.complexity.time'],
    ['complexity', { time: 'O(N)', space: '' }, 'sections.complexity.space'],
  ])('diagnoses unfinished %s at its field', async (key, value, expectedPath) => {
    const { input, unit } = await freshFixture();
    unit.sections[key] = value;
    const result = validateAuthoringOutput(unit, input);
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ path }) => path)).toContain(expectedPath);
  });
});
