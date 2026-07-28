import { access } from 'node:fs/promises';

import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  authoringSourcePacketDigest,
  buildPreviewLearningContentArtifacts,
  parsePreviewLearningContentDomainProposal,
  validatePreviewLearningContentArtifacts,
} from '../../src/lib/preview/learning-content.js';
import { CorpusCliError, readJson, reportCliFailure, writeJsonNoOverwrite } from './cli-support.js';

const USAGE = 'Usage: freeze-preview-learning-content (--check | --write)';
const PREVIEW_ID = 'initial-v1';
const DOMAINS = [
  ['graph-search', 'graph-search'],
  ['dynamic-programming', 'dynamic-programming'],
  ['data-structures-algorithm-design', 'data-structures'],
  ['mathematics-combinatorics', 'mathematics'],
] as const;

interface ManifestDocument {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly candidatePoolDigest: string;
  readonly selectedProblemIds: string[];
  readonly sourceRevisionIds: string[];
}

interface TaxonomyGroup {
  readonly domain: string;
  readonly problemIds: string[];
  readonly sourceRevisionIds: string[];
  readonly outcome: { readonly id: string; readonly statement: string };
  readonly unit: { readonly id: string };
}

interface TaxonomyDocument {
  readonly taxonomyDigest: string;
  readonly standardUnitOrder: string[];
}

interface SkillManifestDocument {
  readonly status: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly sourcePacket: { readonly path: string; readonly digest: string };
}

interface AuthoringSourcePacketDocument {
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly problemInputs: readonly {
    readonly problemId: string;
    readonly officialTaskId: string;
    readonly sourceRevisionIds: readonly string[];
  }[];
  readonly sources: readonly {
    readonly sourceRevisionId: string;
    readonly sourceKind: string;
    readonly officialTaskId: string;
    readonly allowedUses: readonly string[];
  }[];
}

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const inspectFrozenOutput = async (
  filePath: string,
  value: unknown,
): Promise<'missing' | 'verified'> => {
  if (!(await pathExists(filePath))) return 'missing';
  if (canonicalJson(await readJson(filePath)) !== canonicalJson(value)) {
    throw new CorpusCliError('FROZEN_PREVIEW_CONTENT_CONFLICT', filePath);
  }
  return 'verified';
};

const parseMode = (args: readonly string[]): 'check' | 'write' => {
  if (args.length !== 1 || !['--check', '--write'].includes(args[0] ?? '')) {
    throw new CorpusCliError('ARGUMENTS_INVALID', USAGE);
  }
  return args[0] === '--write' ? 'write' : 'check';
};

try {
  const mode = parseMode(process.argv.slice(2));
  const manifest = (await readJson(
    `staging/previews/${PREVIEW_ID}/preview-manifest.json`,
  )) as ManifestDocument;
  const taxonomy = (await readJson(
    `staging/previews/${PREVIEW_ID}/taxonomy/index.json`,
  )) as TaxonomyDocument;
  const skill = (await readJson(
    `docs/verification/authoring-skill/${PREVIEW_ID}/skill-manifest.json`,
  )) as SkillManifestDocument;
  if (manifest.previewId !== PREVIEW_ID || skill.status !== 'frozen') {
    throw new CorpusCliError('PREVIEW_CONTENT_PREREQUISITE_INVALID', PREVIEW_ID);
  }
  const sourcePacket = (await readJson(skill.sourcePacket.path)) as AuthoringSourcePacketDocument;
  const packetDigest = authoringSourcePacketDigest(sourcePacket);
  if (
    packetDigest !== skill.sourcePacket.digest ||
    sourcePacket.authoringSkillVersion !== skill.authoringSkillVersion ||
    sourcePacket.authoringSkillDigest !== skill.authoringSkillDigest
  ) {
    throw new CorpusCliError('AUTHORING_SOURCE_PACKET_SKILL_MISMATCH', skill.sourcePacket.path);
  }

  const artifacts = await Promise.all(
    DOMAINS.map(async ([domain, directory]) => {
      const group = (await readJson(
        `staging/previews/${PREVIEW_ID}/taxonomy/groups/${domain}.json`,
      )) as TaxonomyGroup;
      if (group.domain !== domain) throw new CorpusCliError('TAXONOMY_GROUP_MISSING', domain);
      const proposal = parsePreviewLearningContentDomainProposal(
        await readJson(
          `docs/work-manifests/initial/us2/preview-content/${directory}/proposal.json`,
        ),
        group.problemIds,
        group.sourceRevisionIds,
      );
      if (
        proposal.domain !== domain ||
        proposal.directory !== directory ||
        proposal.outcome.id !== group.outcome.id ||
        proposal.outcome.statement !== group.outcome.statement ||
        proposal.unit.id !== group.unit.id
      ) {
        throw new CorpusCliError('TAXONOMY_GROUP_MISMATCH', domain);
      }
      for (const problemId of group.problemIds) {
        const problemInput = sourcePacket.problemInputs.find(
          (candidate) => candidate.problemId === problemId,
        );
        const problemSources = sourcePacket.sources.filter((source) =>
          problemInput?.sourceRevisionIds.includes(source.sourceRevisionId),
        );
        if (
          !problemInput ||
          !problemInput.sourceRevisionIds.every((sourceId) =>
            group.sourceRevisionIds.includes(sourceId),
          ) ||
          !problemSources.some(
            (source) =>
              source.sourceKind === 'official_problem' &&
              source.officialTaskId === problemInput.officialTaskId &&
              source.allowedUses.includes('constraint_reference') &&
              source.allowedUses.includes('technical_claim'),
          ) ||
          !problemSources.some(
            (source) =>
              source.officialTaskId === problemInput.officialTaskId &&
              source.allowedUses.includes('answer_verification'),
          ) ||
          problemSources.some(
            (source) =>
              source.officialTaskId !== problemInput.officialTaskId ||
              !source.allowedUses.includes('technical_claim'),
          )
        ) {
          throw new CorpusCliError('AUTHORING_SOURCE_PACKET_INVALID', problemId);
        }
      }
      const input = {
        manifest: {
          previewId: manifest.previewId,
          manifestDigest: manifest.manifestDigest,
          candidatePoolDigest: manifest.candidatePoolDigest,
          selectedProblemIds: manifest.selectedProblemIds,
          sourceRevisionIds: manifest.sourceRevisionIds,
        },
        taxonomyDigest: taxonomy.taxonomyDigest,
        taxonomyUnitOrder: taxonomy.standardUnitOrder,
        authoringSkill: {
          version: skill.authoringSkillVersion,
          digest: skill.authoringSkillDigest,
          sourcePacketDigest: skill.sourcePacket.digest,
        },
        domain: proposal,
      };
      const result = buildPreviewLearningContentArtifacts(input);
      const violations = validatePreviewLearningContentArtifacts(input, result);
      if (violations.length > 0) {
        throw new CorpusCliError('PREVIEW_CONTENT_INVALID', violations.join(', '));
      }
      return result;
    }),
  );

  const outputs: readonly (readonly [string, unknown])[] = artifacts.flatMap((artifact) => [
    [artifact.learningUnitPath, artifact.learningUnit] as const,
    [artifact.workManifestPath, artifact.workManifest] as const,
    [artifact.componentPath, artifact.component] as const,
  ]);
  const preflight = await Promise.all(
    outputs.map(async ([filePath, value]) => inspectFrozenOutput(filePath, value)),
  );
  const missing = outputs.filter((_output, index) => preflight[index] === 'missing');
  if (mode === 'check' && missing.length > 0) {
    throw new CorpusCliError(
      'FROZEN_PREVIEW_CONTENT_MISSING',
      missing.map(([filePath]) => filePath).join(', '),
    );
  }
  for (const [filePath, value] of missing) await writeJsonNoOverwrite(filePath, value);
  console.log(
    JSON.stringify({
      command: 'freeze-preview-learning-content',
      mode,
      status: 'passed',
      domainCount: artifacts.length,
      problemCount: new Set(
        artifacts.flatMap(({ learningUnit }) => {
          const unit = learningUnit.learningUnit as { readonly problemIds: readonly string[] };
          return unit.problemIds;
        }),
      ).size,
      written: missing.length,
      verified: preflight.filter((result) => result === 'verified').length,
      componentDigests: artifacts.map(({ component }) => component.componentDigest),
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
