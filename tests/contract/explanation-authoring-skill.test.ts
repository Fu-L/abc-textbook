import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import {
  prepareExplanationAuthoring,
  validateAuthoringInput,
  type AuthoringInputPacket,
  type AuthoringSkillSubject,
} from '../../src/lib/authoring/explanation-authoring-skill.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

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

const fileDigest = async (filePath: string): Promise<string> =>
  createHash('sha256')
    .update(await readFile(filePath))
    .digest('hex');

const withoutField = (
  value: Readonly<Record<string, unknown>>,
  field: string,
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));

const skillSubject = (manifest: SkillManifest): AuthoringSkillSubject => ({
  name: 'abc-explanation-author',
  version: manifest.authoringSkillVersion,
  digest: manifest.authoringSkillDigest,
});

describe('explanation authoring skill contract', () => {
  it('freezes the US1 review units before authoring changes', async () => {
    const manifest = await readJson<unknown>('docs/work-manifests/initial/us1/manifest.json');
    expect(() => {
      validateContentWorkManifest(manifest);
    }).not.toThrow();
  });

  it('freezes one self-contained skill version and canonical digest', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
    const sourcePacket = await readJson<SourcePacket>(manifest.sourcePacket.path);
    const artifactDigests = await Promise.all(
      manifest.artifacts.map(async (artifact) => ({
        path: artifact.path,
        digest: await fileDigest(artifact.path),
      })),
    );
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
    expect(artifactDigests).toEqual(manifest.artifacts);
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

  it('prepares the fixed complete fixtures and holds the incomplete fixture', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
    const fixtureManifest = await readJson<FixtureManifest>(
      'tests/fixtures/authoring-skill/manifest.json',
    );
    expect(fixtureManifest.fixtures).toHaveLength(3);
    expect(fixtureManifest.authoringSkillVersion).toBe(manifest.authoringSkillVersion);
    expect(fixtureManifest.authoringSkillDigest).toBe(manifest.authoringSkillDigest);

    for (const fixture of fixtureManifest.fixtures) {
      const result = prepareExplanationAuthoring(fixture.input, skillSubject(manifest));
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

  it('holds a stale skill subject and unresolved or disallowed claim sources', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
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

    const result = validateAuthoringInput(input, skillSubject(manifest));
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['SKILL_VERSION_MISMATCH', 'SOURCE_REVISION_MISSING']),
    );
  });

  it('holds a technical claim that cites another Problem source revision', async () => {
    const manifest = await readJson<SkillManifest>(
      'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    );
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

    const result = validateAuthoringInput(input, skillSubject(manifest));
    expect(result.status).toBe('on_hold');
    expect(result.diagnostics.map(({ code }) => code)).toContain('SOURCE_PROBLEM_MISMATCH');
  });
});
