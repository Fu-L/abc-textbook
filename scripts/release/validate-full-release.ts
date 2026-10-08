import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import type * as EditorialOrder from '../../src/lib/taxonomy/textbook-order.js';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  CatalogSchema,
  CanonicalLearningPrerequisitesSchema,
  CanonicalProblemPlacementPolicySchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { buildCatalog } from '../../src/lib/catalog/build-catalog.js';
import {
  loadCatalogEvidenceCanonicalSources,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../../src/lib/catalog/evidence-inventory.js';
import { validateReleaseLearningStructure } from '../../src/lib/catalog/release-learning-structure.js';
import { verifyCanonicalCorrectionTargets } from '../../src/lib/catalog/correction-targets.js';
import {
  resolvePublicCatalogInput,
  resolvePublicEvidencePath,
} from '../../src/lib/catalog/publication-boundary.js';
import {
  validateAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_METRICS_PATH,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { withReleaseCommit } from './commit-snapshot.js';
import {
  ContentWorkManifestSchema,
  MergeReviewEvidenceSchema,
  HumanContentReviewEvidenceSchema,
} from '../../src/lib/domain/schema-parts/review-evidence.js';
import { validateMergeReviewEvidence } from '../../src/lib/validation/human-content-review.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { assertSeedRelease, INITIAL_BOOTSTRAP_ID } from '../../src/lib/catalog/seed-release.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { verifySeedPreparation } from './verify-seed-preparation.js';

export const FULL_RELEASE_CATALOG_PATH = 'docs/verification/releases/catalog.json';
export const FULL_RELEASE_EVIDENCE_PATH = 'docs/verification/releases/evidence-inventory.json';
export const FULL_RELEASE_MERGE_REVIEW_PATH =
  'docs/reviews/human-content/releases/merge-review.json';

const filesUnder = async (root: string, directory: string, jsonOnly = true): Promise<string[]> => {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const file = `${directory}/${entry.name}`;
      return entry.isDirectory()
        ? filesUnder(root, file, jsonOnly)
        : entry.isFile() && (!jsonOnly || entry.name.endsWith('.json'))
          ? [file]
          : [];
    }),
  );
  return files.flat().sort();
};

/** Entry point for the protected-base diff and the exact merged commit. It
 * consumes existing checks/reviews and canonical bytes, never regenerates them.
 */
export const verifyFullReleaseCommit = async (input: {
  readonly repositoryRoot?: string;
  readonly commit: string;
  readonly catalogPath?: string;
  readonly evidencePath?: string;
  readonly mergeReviewPath?: string;
  readonly mergedMainCommit?: string;
  readonly preparation?: boolean;
}) =>
  withReleaseCommit(
    {
      repositoryRoot: input.repositoryRoot ?? process.cwd(),
      commit: input.commit,
      ...(input.mergedMainCommit ? { mergedMainCommit: input.mergedMainCommit } : {}),
    },
    async (context) => {
      const root = context.repositoryRoot;
      const json = async (file: string): Promise<unknown> =>
        JSON.parse(await readFile(path.join(root, file), 'utf8')) as unknown;
      const catalogPath = input.catalogPath ?? FULL_RELEASE_CATALOG_PATH;
      const resolvedCatalog = await resolvePublicCatalogInput(catalogPath, root);
      const catalog = CatalogSchema.parse(
        JSON.parse(await readFile(resolvedCatalog, 'utf8')) as unknown,
      );
      if (input.preparation) return verifySeedPreparation(context, catalog, resolvedCatalog);
      const seed =
        catalog.release.releaseKind === 'initial' &&
        catalog.release.updateIds[0] === INITIAL_BOOTSTRAP_ID;
      if (seed) {
        assertSeedRelease(catalog);
        if (
          catalog.release.agentQualityReviewEvidenceRef &&
          catalog.release.publicationStatus !== 'prepared'
        )
          throw new Error('INITIAL_AGENT_REVIEW_REQUIRES_PREPARED_GIT_SNAPSHOT');
        if (catalog.release.publicationStatus === 'prepared')
          await verifySeedPreparation(context, catalog, resolvedCatalog);
      }
      const sources = await loadCatalogEvidenceCanonicalSources(catalog, root, {
        catalogPath: resolvedCatalog,
      });
      for (const file of await filesUnder(root, 'staging/updates')) {
        const update = PublicationUpdateSchema.safeParse(await json(file));
        if (
          update.success &&
          catalog.release.updateIds.includes(update.data.updateId) &&
          update.data.fixtureMode
        )
          throw new Error(`RELEASE_FIXTURE_UPDATE:${update.data.updateId}`);
      }
      const evidencePath = input.evidencePath ?? FULL_RELEASE_EVIDENCE_PATH;
      const evidence = await loadTrustedCatalogReleaseEvidenceInventory(
        evidencePath,
        sources,
        root,
      );
      buildCatalog(catalog, [], evidence, { allowPreparedRelease: true });

      // Match serialized projections to their real canonical entities, not just to
      // another declared digest. Source packets are inputs, not SourceRevision entities.
      for (const [collection, directory, identity] of [
        ['problems', 'problems', 'id'],
        ['contests', 'contests', 'id'],
        ['tags', 'tags', 'id'],
        ['learningOutcomes', 'learning-outcomes', 'id'],
        ['learningUnits', 'learning-units', 'id'],
        ['techniqueInventory', 'technique-inventory', 'problemId'],
        ['sources', 'sources', 'id'],
      ] as const) {
        // Seed metadata deliberately remains uncollected; the accepted projection
        // supplies publication state, placement and metrics without rewriting it.
        if (seed && collection === 'problems') continue;
        const actual = [];
        for (const file of await filesUnder(root, `src/content/${directory}`)) {
          if (file.startsWith('src/content/sources/authoring/')) continue;
          actual.push(await json(file));
        }
        const sortEntities = (entities: readonly unknown[]) =>
          [...entities].sort((a, b) => {
            const key = (value: unknown) =>
              typeof value === 'object' && value !== null && identity in value
                ? String(value[identity as keyof typeof value])
                : '';
            return key(a).localeCompare(key(b), 'en');
          });
        if (
          canonicalJson(sortEntities(actual)) !== canonicalJson(sortEntities(catalog[collection]))
        )
          throw new Error(`RELEASE_CANONICAL_ENTITY_DRIFT:${collection}`);
      }
      for (const unit of catalog.learningUnits) {
        const body = await readFile(await resolvePublicCatalogInput(unit.docPath, root), 'utf8');
        if (
          !body.trim() ||
          !body.includes('\n## 考え方\n') ||
          !body.includes('\n## 成立条件と計算量\n')
        )
          throw new Error(`RELEASE_UNIT_PROSE_MISSING:${unit.id}`);
      }
      for (const unit of catalog.authoringUnits) {
        const document = readProblemAuthoringDocument(
          await readFile(await resolvePublicCatalogInput(unit.docPath, root), 'utf8'),
        );
        if (canonicalJson(document.unit) !== canonicalJson(unit))
          throw new Error(`RELEASE_PROBLEM_DOCUMENT_DRIFT:${unit.problemId}`);
      }
      const policy = CanonicalProblemPlacementPolicySchema.parse(
        await json('src/content/policies/problem-placements.json'),
      );
      const prerequisites = CanonicalLearningPrerequisitesSchema.parse(
        await json('src/content/policies/learning-prerequisites.json'),
      );
      const editorialOrder = (await import(
        pathToFileURL(path.join(root, 'src/lib/taxonomy/textbook-order.ts')).href
      )) as typeof EditorialOrder;
      const outcomeCoverage = validateReleaseLearningStructure({
        tags: catalog.tags,
        outcomes: catalog.learningOutcomes,
        units: catalog.learningUnits,
        problems: catalog.problems,
        placements: policy.placements,
        prerequisites,
        chapters: editorialOrder.TEXTBOOK_CHAPTERS,
      });
      validateAtCoderProblemsSnapshot(await json(ATCODER_PROBLEMS_METRICS_PATH), catalog.problems);
      const indexProjections = new Map<string, unknown>([
        [
          'src/content/indexes/taxonomy.json',
          {
            tags: catalog.tags,
            learningOutcomes: catalog.learningOutcomes,
            learningUnits: catalog.learningUnits,
            placements: policy.placements,
            learningPrerequisites: prerequisites,
          },
        ],
      ]);
      // Canonical impacts remain pending until their real targets are checked.
      // The public catalog records the verified projection; the checks below
      // must still resolve every target and recompute every index from bytes.
      const publicImpacts = seed
        ? (await loadFullPublicProjection({ repositoryRoot: root })).catalog.correctionImpacts
        : policy.correctionImpacts.map((impact) => ({
            ...impact,
            verificationStatus: 'verified' as const,
          }));
      if (canonicalJson(catalog.correctionImpacts) !== canonicalJson(publicImpacts))
        throw new Error('RELEASE_CORRECTION_INVENTORY_MISMATCH');
      const corrections = await Promise.all(
        catalog.correctionImpacts.map((impact) =>
          verifyCanonicalCorrectionTargets({
            impact,
            catalog,
            readTarget: async (file) => readFile(await resolvePublicCatalogInput(file, root)),
            indexProjections,
          }),
        ),
      );
      // These are release checks/results, not a second approval state machine.
      const constitution = await readFile(
        path.join(root, '.specify/memory/constitution.md'),
        'utf8',
      );
      if (!constitution.includes('**Version**: 3.0.0'))
        throw new Error('RELEASE_CONSTITUTION_VERSION');
      if (!catalog.release.agentQualityReviewEvidenceRef) {
        const mergeReviewPath = input.mergeReviewPath ?? FULL_RELEASE_MERGE_REVIEW_PATH;
        const merge = MergeReviewEvidenceSchema.parse(
          JSON.parse(
            await readFile(await resolvePublicEvidencePath(mergeReviewPath, root), 'utf8'),
          ) as unknown,
        );
        const manifest = ContentWorkManifestSchema.parse(sources.workManifest);
        const ref = catalog.release.humanContentReviewEvidenceRefs.find(
          (reference) => reference.path === merge.humanContentReviewEvidencePath,
        );
        if (!ref) throw new Error('RELEASE_MERGE_REVIEW_NOT_BOUND');
        const human = HumanContentReviewEvidenceSchema.parse(
          JSON.parse(
            await readFile(await resolvePublicEvidencePath(ref.path, root), 'utf8'),
          ) as unknown,
        );
        const fileEntry = async (file: string) => {
          const bytes = await readFile(path.join(root, file));
          return {
            path: file,
            sha256: createHash('sha256').update(bytes).digest('hex'),
            byteLength: bytes.length,
          };
        };
        const contentFiles = await Promise.all(
          (await filesUnder(root, 'src/content', false)).map(fileEntry),
        );
        const actualSubject = await Promise.all(
          merge.subjectFiles.map((file) => fileEntry(file.path)),
        );
        if (
          canonicalJson(actualSubject) !== canonicalJson(merge.subjectFiles) ||
          canonicalJson(contentFiles) !== canonicalJson(merge.subjectFiles) ||
          canonicalDigest(merge.subjectFiles) !== catalog.release.contentFileInventoryDigest
        )
          throw new Error('RELEASE_MERGE_SUBJECT_FILES_STALE');
        const templateFiles = await filesUnder(root, '.specify/templates', false);
        const declaredTemplates = merge.constitutionCheck.dependentTemplates;
        for (const file of declaredTemplates)
          if (canonicalJson(await fileEntry(file.path)) !== canonicalJson(file))
            throw new Error('RELEASE_CONSTITUTION_TEMPLATE_STALE');
        if (templateFiles.some((file) => !declaredTemplates.some((entry) => entry.path === file)))
          throw new Error('RELEASE_CONSTITUTION_TEMPLATE_MISSING');
        for (const check of merge.applicableChecks) {
          for (const [file, digest] of [
            [check.resultPath, check.resultDigest],
            [check.rawResultPath, check.rawResultDigest],
          ]) {
            if (
              !file ||
              createHash('sha256')
                .update(await readFile(await resolvePublicEvidencePath(file, root)))
                .digest('hex') !== digest
            )
              throw new Error(`RELEASE_MERGE_CHECK_STALE:${check.checkId}`);
          }
        }
        const mergeManifest = ContentWorkManifestSchema.parse(await json(merge.workManifestPath));
        if (
          !merge.workManifestPath.startsWith('docs/work-manifests/') ||
          canonicalJson(mergeManifest) !== canonicalJson(manifest)
        )
          throw new Error('RELEASE_MERGE_WORK_MANIFEST_MISMATCH');
        validateMergeReviewEvidence(merge, {
          subjectDigest: catalog.release.contentFileInventoryDigest,
          workManifestPath: merge.workManifestPath,
          workManifestDigest: manifest.digest,
          humanReview: {
            id: human.id,
            digest: ref.digest,
            subjectDigest: human.subjectDigest,
            aggregatePassed: human.aggregatePassed,
            reviewerId: human.reviewer.personId,
            reviewMode: human.reviewMode,
          },
          constitutionVersion: '3.0.0',
          constitutionDigest: createHash('sha256').update(constitution).digest('hex'),
          reviewerId: human.reviewer.personId,
          checks: catalog.release.validationSummary.checks.map((check) => ({
            checkId: check.checkId,
            command: check.command,
            applicable: true,
          })),
        });
      }
      return {
        command: 'verify:release',
        commit: context.commit,
        protectedBaseCommit: context.baseCommit,
        version: catalog.release.version,
        cutoffAt: catalog.release.cutoffAt,
        aggregatePassed: true,
        ...(catalog.release.agentQualityReviewEvidenceRef
          ? { acceptanceMode: 'agent_quality_review', humanApprovalClaimed: false }
          : { acceptanceMode: 'human_review' }),
        problemCount: catalog.problems.length,
        outcomeCount: outcomeCoverage.length,
        outcomeCoverageDigest: canonicalDigest(outcomeCoverage),
        correctionCount: corrections.length,
        checks: [
          'protected-base-diff',
          'current-policy-review',
          'catalog-coverage',
          'canonical-entities',
          'authored-documents',
          'three-prerequisite-dags',
          'semantic-primary-home',
          'independent-editorial-order',
          'metrics-identities',
          'correction-targets',
        ],
      };
    },
  );
