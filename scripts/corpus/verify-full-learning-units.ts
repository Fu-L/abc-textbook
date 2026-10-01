import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';

import prettier from 'prettier';

import { buildLearningPath } from '../../src/lib/catalog/build-learning-path.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  FinalTaxonomyBuildSchema,
  CanonicalLearningPrerequisitesSchema,
  CanonicalProblemPlacementPolicySchema,
  LearningOutcomeSchema,
  LearningUnitSchema,
  TechniqueTagSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import {
  buildCanonicalTaxonomyMaterialization,
  validateCanonicalMaterialization,
} from '../../src/lib/taxonomy/canonical-taxonomy-materialization.js';
import { loadFinalTaxonomySourceContext } from '../../src/lib/taxonomy/final-taxonomy-build.js';
import { SINGLE_PROBLEM_TAG_IDS } from '../../src/lib/taxonomy/final-taxonomy-policy.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';

interface HandoffIndex {
  readonly fixedAt: string;
  readonly sourceBuild: string;
  readonly entries: readonly {
    readonly learningUnitId: string;
    readonly chapterId: string;
    readonly taskId: string;
    readonly manifestPath: string;
    readonly manifestDigest: string;
    readonly metadataDigest: string;
    readonly skeletonDocumentDigest: string;
  }[];
}

const ROOT = 'docs/work-manifests/initial/us2/full-learning-units';
const CONTENT_PATH = 'docs/verification/bootstrap/learning-unit-content.json';
const readJson = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(file, 'utf8')) as unknown;
const sha256 = (text: string): string => createHash('sha256').update(text).digest('hex');
const writeJson = async (file: string, value: unknown): Promise<void> => {
  const config = await prettier.resolveConfig(file);
  await writeFile(
    file,
    await prettier.format(JSON.stringify(value), { ...config, filepath: file }),
  );
};

const mode = process.argv[2] ?? '--check';
if (process.argv.length > 3 || !['--check', '--write'].includes(mode)) {
  console.error('Usage: verify-full-learning-units [--check | --write]');
  process.exitCode = 64;
} else {
  try {
    const context = await loadFinalTaxonomySourceContext();
    const build = FinalTaxonomyBuildSchema.parse(
      await readJson('staging/taxonomy/initial/final-taxonomy-build.json'),
    );
    const input = {
      build,
      records: context.records,
      problems: context.corpus.problems.map(({ entity }) => entity),
      sources: context.corpus.sources.map(({ entity }) => entity),
      placementDecisionTable: context.placementDecisionTable,
      singleProblemTagIds: SINGLE_PROBLEM_TAG_IDS,
    };
    const expected = buildCanonicalTaxonomyMaterialization(input);
    const index = (await readJson(`${ROOT}/index.json`)) as HandoffIndex;
    const expectedIds = expected.learningUnits.map(({ value }) => value.id).sort();
    const manifestIds = (await readdir(ROOT, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const unitFiles = (await readdir('src/content/learning-units'))
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/u, ''))
      .sort();
    if (
      index.sourceBuild !== build.buildDigest ||
      canonicalDigest(expectedIds) !==
        canonicalDigest(index.entries.map((entry) => entry.learningUnitId).sort()) ||
      canonicalDigest(expectedIds) !== canonicalDigest(manifestIds) ||
      canonicalDigest(expectedIds) !== canonicalDigest(unitFiles)
    )
      throw new Error('FULL_UNIT_WORKSET_COVERAGE');
    const handoffById = new Map(index.entries.map((entry) => [entry.learningUnitId, entry]));
    const actual = {
      ...expected,
      tags: await Promise.all(
        expected.tags.map(async (output) => ({
          ...output,
          value: TechniqueTagSchema.parse(await readJson(output.relativePath)),
        })),
      ),
      learningOutcomes: await Promise.all(
        expected.learningOutcomes.map(async (output) => ({
          ...output,
          value: LearningOutcomeSchema.parse(await readJson(output.relativePath)),
        })),
      ),
      learningPrerequisites: CanonicalLearningPrerequisitesSchema.parse(
        await readJson('src/content/policies/learning-prerequisites.json'),
      ),
      problemPlacementPolicy: CanonicalProblemPlacementPolicySchema.parse(
        await readJson('src/content/policies/problem-placements.json'),
      ),
      learningUnits: await Promise.all(
        expected.learningUnits.map(async (output) => ({
          ...output,
          value: LearningUnitSchema.parse(await readJson(output.relativePath)),
          document: await readFile(output.documentPath, 'utf8'),
        })),
      ),
    };
    const diagnostics = validateCanonicalMaterialization(input, actual);
    if (diagnostics.length) throw new Error(diagnostics.join('\n'));
    const path = buildLearningPath(actual, expected);
    const units = [];
    for (const output of actual.learningUnits) {
      const { value: unit, document } = output;
      const handoff = handoffById.get(unit.id);
      if (!handoff) throw new Error(`MANIFEST_MISSING:${unit.id}`);
      const manifestValue = await readJson(handoff.manifestPath);
      validateContentWorkManifest(manifestValue);
      const manifest = ContentWorkManifestSchema.parse(manifestValue);
      const ownedPaths = manifest.reviewUnits.flatMap((review) => review.paths).sort();
      if (
        manifest.digest !== handoff.manifestDigest ||
        manifest.taskId !== handoff.taskId ||
        manifest.reviewUnits.length !== 1 ||
        canonicalDigest(ownedPaths) !==
          canonicalDigest([output.relativePath, output.documentPath].sort()) ||
        canonicalDigest(manifest.learningOutcomeIds) !==
          canonicalDigest([...(unit.ownedLearningOutcomeIds ?? [])].sort())
      )
        throw new Error(`MANIFEST_OWNERSHIP:${unit.id}`);
      const metadataDigest = canonicalDigest(
        Object.fromEntries(Object.entries(unit).filter(([key]) => key !== 'contentPhase')),
      );
      if (
        metadataDigest !== handoff.metadataDigest ||
        sha256(document) === handoff.skeletonDocumentDigest
      )
        throw new Error(`HANDOFF_DRIFT:${unit.id}`);
      for (const sourceId of unit.sourceRevisionIds) {
        const source = input.sources.find((source) => source.id === sourceId);
        if (!source || !document.includes(`](${source.url})`))
          throw new Error(`SOURCE_REFERENCE:${unit.id}:${sourceId}`);
      }
      // This work introduces ordinary prose, not executable/assessment blocks.
      // Refuse to silently certify new blocks without their own execution evidence.
      if (
        unit.examples.length ||
        unit.exercises.length ||
        /```|^## (?:演習|解答|評価課題)$/mu.test(document)
      )
        throw new Error(`EXAMPLE_ANSWER_EVIDENCE_REQUIRED:${unit.id}`);
      units.push({
        learningUnitId: unit.id,
        taskId: handoff.taskId,
        chapterId: handoff.chapterId,
        documentPath: output.documentPath,
        documentDigest: sha256(document),
        metadataDigest,
        manifestPath: handoff.manifestPath,
        manifestDigest: manifest.digest,
        ownedLearningOutcomeIds: unit.ownedLearningOutcomeIds,
        sourceRevisionIds: unit.sourceRevisionIds,
        conceptSummary: document.split('\n## 考え方\n')[1]?.trim().split('\n\n')[0]?.slice(0, 80),
        checks: [
          'accepted_metadata',
          'source_references',
          'concept_prose',
          'assumptions_and_complexity_present',
          'navigation',
          'draft',
        ],
        exampleAnswerEvidence: 'not_applicable_no_added_examples_or_exercises',
      });
    }
    const subjectDigest = canonicalDigest(
      units.map((unit) => ({
        path: unit.documentPath,
        digest: unit.documentDigest,
        metadataDigest: unit.metadataDigest,
        manifestDigest: unit.manifestDigest,
      })),
    );
    const correctionImpacts = actual.problemPlacementPolicy.correctionImpacts.map((impact) => ({
      id: impact.id,
      targets: impact.affectedContentLocators.map((locator) => ({
        locator,
        status: locator.ownerType === 'problem' ? 'pending_problem_authoring' : 'verified',
        verificationBasis:
          locator.ownerType === 'learning_unit'
            ? `Checked actual JSON and authored Markdown for ${locator.learningUnitId}.`
            : locator.ownerType === 'problem'
              ? 'Problem-owned section/example/exercise/answer targets require #47/#48; no synthetic target is claimed.'
              : 'Accepted canonical policy checked by validateCanonicalMaterialization.',
      })),
      derivedIndexes: impact.derivedIndexPaths.map((indexPath) => ({
        path: indexPath,
        status: 'pending',
        ownerTaskId: 'T160',
      })),
      status: 'pending',
    }));
    const projection = {
      schemaVersion: '1.0.0',
      sourceBuild: index.sourceBuild,
      subjectDigest,
      counts: {
        chapters: path.chapters.length,
        units: units.length,
        ownedOutcomes: units.reduce(
          (sum, unit) => sum + (unit.ownedLearningOutcomeIds?.length ?? 0),
          0,
        ),
        reachableProblems: path.problemHomeById.size,
      },
      units,
      correctionImpacts,
    };
    if (mode === '--write') {
      await writeJson(CONTENT_PATH, projection);
    } else {
      if (canonicalDigest(await readJson(CONTENT_PATH)) !== canonicalDigest(projection))
        throw new Error('LEARNING_UNIT_CONTENT_EVIDENCE_STALE');
    }
    console.log(
      JSON.stringify({
        status: 'passed',
        subjectDigest,
        ...projection.counts,
        humanAcceptance: 'separate_required_review',
        sc010: 'not_required_by_owner',
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
