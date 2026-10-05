import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { canonicalDigest } from '../domain/canonical-json.js';
import {
  FinalTaxonomyBuildSchema,
  CanonicalProblemPlacementPolicySchema,
  LearningUnitSchema,
} from '../domain/schema-parts/catalog.js';
import {
  loadFinalTaxonomySourceContext,
  validateFinalTaxonomyBuildAgainstContext,
} from '../taxonomy/final-taxonomy-build.js';
import {
  NON_PRIMARY_TAG_IDS,
  NON_PRIMARY_OUTCOME_IDS,
  SINGLE_PROBLEM_TAG_IDS,
  SINGLE_PROBLEM_OUTCOME_IDS,
  SINGLE_PROBLEM_UNIT_IDS,
} from '../taxonomy/final-taxonomy-policy.js';
import {
  AuthoringSkillSubjectSchema,
  type AuthoringSkillSubject,
} from './explanation-authoring-skill.js';
import {
  buildProblemShardIndex,
  type ProblemShardIndex,
  type ProblemShard,
} from './problem-shard-index.js';
import type { ContentReviewPolicy } from '../validation/content-work-manifest.js';

export const readShardJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, 'utf8')) as T;
export const shardFileDigest = (text: string): string =>
  createHash('sha256').update(text).digest('hex');
export const loadProblemShardContext = async (frozenAt: string) => {
  const context = await loadFinalTaxonomySourceContext();
  const build = FinalTaxonomyBuildSchema.parse(
    await readShardJson('staging/taxonomy/initial/final-taxonomy-build.json'),
  );
  const diagnostics = validateFinalTaxonomyBuildAgainstContext(context, build, {
    nonPrimaryTagIds: NON_PRIMARY_TAG_IDS,
    nonPrimaryOutcomeIds: NON_PRIMARY_OUTCOME_IDS,
    singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
    singleProblemOutcomeIds: SINGLE_PROBLEM_OUTCOME_IDS,
    singleProblemUnitIds: SINGLE_PROBLEM_UNIT_IDS,
  });
  if (
    diagnostics.length ||
    build.status !== 'accepted' ||
    !build.canonicalMaterializationAllowed ||
    context.previewSnapshot.status !== 'passed'
  )
    throw new Error(`SHARD_PREREQUISITES_FAILED:${diagnostics.map((d) => d.code).join(',')}`);
  const policy = CanonicalProblemPlacementPolicySchema.parse(
    await readShardJson('src/content/policies/problem-placements.json'),
  );
  if (canonicalDigest(policy.placements) !== canonicalDigest(build.placements))
    throw new Error('SHARD_ACCEPTED_PLACEMENT_DRIFT');
  const manifest = await readShardJson<{
    status: string;
    authoringSkillName: string;
    authoringSkillVersion: string;
    authoringSkillDigest: string;
    artifacts: { path: string; digest: string }[];
    inputContract: unknown;
    outputContract: unknown;
    reviewPolicy: unknown;
    sourceNormalizationVersion: string;
  }>('docs/verification/authoring-skill/initial-v1/skill-manifest.json');
  if (manifest.status !== 'frozen') throw new Error('SHARD_SKILL_NOT_FROZEN');
  const artifactSubjects = [];
  for (const artifact of manifest.artifacts) {
    const digest = shardFileDigest(await readFile(artifact.path, 'utf8'));
    if (digest !== artifact.digest) throw new Error(`SHARD_SKILL_ARTIFACT_DRIFT:${artifact.path}`);
    artifactSubjects.push({ path: artifact.path, digest });
  }
  const sourcePacket = await readShardJson<Record<string, unknown>>(
    'src/content/sources/authoring/initial-v1.json',
  );
  const packetDigest = canonicalDigest(
    Object.fromEntries(
      Object.entries(sourcePacket).filter(([key]) => key !== 'authoringSkillDigest'),
    ),
  );
  if (
    canonicalDigest({
      authoringSkillName: manifest.authoringSkillName,
      authoringSkillVersion: manifest.authoringSkillVersion,
      sourceNormalizationVersion: manifest.sourceNormalizationVersion,
      artifacts: artifactSubjects,
      sourcePacketDigest: packetDigest,
      inputContract: manifest.inputContract,
      outputContract: manifest.outputContract,
      reviewPolicy: manifest.reviewPolicy,
    }) !== manifest.authoringSkillDigest
  )
    throw new Error('SHARD_SKILL_DIGEST_DRIFT');
  const skill: AuthoringSkillSubject = AuthoringSkillSubjectSchema.parse({
    name: manifest.authoringSkillName,
    version: manifest.authoringSkillVersion,
    digest: manifest.authoringSkillDigest,
  });
  const unitCandidates = build.finalCandidates.filter((c) => c.kind === 'unit');
  const units = await Promise.all(
    unitCandidates.map(async (c) =>
      LearningUnitSchema.parse(
        await readShardJson(`src/content/learning-units/${c.entity.id}.json`),
      ),
    ),
  );
  const outcomes = build.finalCandidates.filter((c) => c.kind === 'outcome').map((c) => c.entity);
  const index = buildProblemShardIndex({
    contests: context.corpus.contests.map((c) => c.entity),
    problems: context.corpus.problems.map((p) => p.entity),
    placements: build.placements,
    units,
    outcomes,
    frozenAt,
    inputs: {
      acceptedBuildDigest: build.buildDigest,
      placementDigest: build.placementDigest,
      passedPreviewDigest: context.previewSnapshot.joinDigest,
      authoringSkillDigest: skill.digest,
      inventoryDigest: context.inventoryEvidence.inventoryDigest,
      sourceSetDigest: canonicalDigest(
        context.corpus.sources.map((s) => ({ path: s.path, entity: s.entity })),
      ),
      problemSetDigest: canonicalDigest(context.corpus.problems.map((p) => p.entity)),
      unitOwnershipDigest: canonicalDigest(
        units.map((u) => ({
          id: u.id,
          parentId: u.parentId,
          ownedLearningOutcomeIds: u.ownedLearningOutcomeIds ?? [],
          directProblemIds: u.directProblemIds ?? [],
        })),
      ),
    },
  });
  return { context, build, policy, skill, units, outcomes, index };
};
export type ProblemShardContext = Awaited<ReturnType<typeof loadProblemShardContext>>;
export const verifyFrozenProblemShardContext = async (
  index: ProblemShardIndex,
): Promise<ProblemShardContext> => {
  const context = await loadProblemShardContext(index.frozenAt);
  const { assertProblemShardIndex } = await import('./problem-shard-index.js');
  assertProblemShardIndex(index, context.index);
  return context;
};

export const buildProblemShardWorkManifest = async (
  context: ProblemShardContext,
  shard: ProblemShard,
  policy: ContentReviewPolicy = shard.reviewPolicy,
) => {
  const { createContentWorkManifest } = await import('../validation/content-work-manifest.js');
  const requirements = ['FR-004', 'FR-006', 'FR-023', 'CQ-001', 'CQ-003', 'CQ-005'];
  const outcomes = [
    ...new Set(
      context.policy.placements
        .filter((p) => shard.problemIds.includes(p.problemId))
        .flatMap((p) => [p.primaryOutcomeId, ...p.additionalPrimaryOutcomeIds]),
    ),
  ].sort();
  return createContentWorkManifest({
    manifestId: `work-manifest-${shard.taskId}-${shard.shardId}`,
    taskId: shard.taskId,
    changeKind: 'content',
    requiredRequirementIds: requirements,
    learningOutcomeIds: outcomes,
    reviewPolicy: policy,
    maintenanceBenefit: null,
    createdAt: context.index.frozenAt,
    reviewUnits: [
      {
        unitId: `RU-${shard.taskId}-${shard.shardId}`,
        paths: shard.documentPaths,
        itemIds: shard.problemIds,
        requirementIds: requirements,
        learningOutcomeIds: outcomes,
        dependencyUnitIds: [],
        checkIds: shard.requiredChecks.map((c) => `check-shard-${c}`),
        evidenceRole: 'problem_authoring',
        ownerId: 'person-maintainer',
      },
    ],
  });
};
