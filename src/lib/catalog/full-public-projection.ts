import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import {
  CatalogSchema,
  CatalogReleaseSchema,
  ContestSchema,
  OfficialContestGapMetadataSchema,
  ContestSlotRecordSchema,
  ProblemSchema,
  ProblemAnalysisRecordSchema,
  TechniqueTagSchema,
  LearningOutcomeSchema,
  LearningUnitSchema,
  SourceRevisionSchema,
  ProblemPlacementSchema,
  CanonicalProblemPlacementPolicySchema,
  CanonicalLearningPrerequisitesSchema,
} from '../domain/schema-parts/catalog.js';
import { readProblemAuthoringDocument } from '../authoring/problem-authoring-document.js';
import { resolveProblemLocator } from '../authoring/verify-problem-corpus.js';
import { structuredContentRoots } from './content-source-registry.js';
import { buildProblemContent } from './build-problem-content.js';
import { buildAdvancedSlotRegistry } from './advanced-slot-registry.js';
import { catalogContentDigest, projectCatalogContent, assembleCatalog } from './build-catalog.js';
import { verifyCanonicalCorrectionTargets } from './correction-targets.js';
import { validateReleaseLearningStructure } from './release-learning-structure.js';
import { buildUiCatalog } from './ui-catalog.js';
import { learningUnitRoute } from './build-learning-path.js';
import { unitLearningTarget } from '../taxonomy/unit-learning-targets.js';
import { TEXTBOOK_CHAPTERS } from '../taxonomy/textbook-order.js';
import {
  validateAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_METRICS_PATH,
} from '../corpus/atcoder-problems-metrics.js';
import { PublicReleaseHistoryEntrySchema } from './build-release-history.js';
import { INITIAL_RELEASE_CUTOFF } from './seed-release.js';

export const FULL_PROJECTION_PATH = 'docs/verification/bootstrap/us4/full-projections.json';
export const TAXONOMY_INDEX_PATH = 'src/content/indexes/taxonomy.json';
export const PUBLIC_HISTORY_PATH = 'src/content/indexes/release-history.json';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
export const acceptedDraftDocument = (text: string): string =>
  text.replace('\ndraft: false\n', '\ndraft: true\n');

export const assertAcceptedUnitPublication = (
  unit: z.infer<typeof LearningUnitSchema>,
  text: string,
  accepted:
    | {
        readonly documentPath: string;
        readonly documentDigest: string;
        readonly metadataDigest: string;
      }
    | undefined,
): void => {
  if (
    unit.contentPhase !== 'full_authoring' ||
    !text.includes('\ndraft: false\n') ||
    accepted?.documentPath !== unit.docPath ||
    sha(acceptedDraftDocument(text)) !== accepted.documentDigest ||
    canonicalDigest(
      Object.fromEntries(Object.entries(unit).filter(([key]) => key !== 'contentPhase')),
    ) !== accepted.metadataDigest
  )
    throw new Error(`FULL_PROJECTION_UNIT_NOT_ACCEPTED:${unit.id}`);
};

/** Loads only canonical roots and the accepted byte inventories. No taxonomy or shard regeneration. */
export const loadFullPublicProjection = async (
  options: {
    readonly repositoryRoot?: string;
    readonly verifyDerivedFiles?: boolean;
    readonly usePreparedRelease?: boolean;
  } = {},
) => {
  const root = options.repositoryRoot ?? process.cwd();
  const read = (file: string) => readFile(path.join(root, file));
  const json = async (file: string): Promise<unknown> =>
    JSON.parse((await read(file)).toString('utf8')) as unknown;
  const entities = async <T>(directory: string, schema: z.ZodType<T>): Promise<T[]> => {
    const files = (await readdir(path.join(root, directory), { recursive: true }))
      .filter((file) => file.endsWith('.json') && !file.startsWith('authoring/'))
      .sort();
    return Promise.all(files.map(async (file) => schema.parse(await json(`${directory}/${file}`))));
  };
  const [contests, contestGaps, slots, metadata, inventory, tags, outcomes, units, sources] =
    await Promise.all([
      entities(structuredContentRoots.contests, ContestSchema),
      entities(structuredContentRoots.contestGaps, OfficialContestGapMetadataSchema),
      entities(structuredContentRoots.problemSlots, ContestSlotRecordSchema),
      entities(structuredContentRoots.problems, ProblemSchema),
      entities(structuredContentRoots.techniqueInventory, ProblemAnalysisRecordSchema),
      entities(structuredContentRoots.tags, TechniqueTagSchema),
      entities(structuredContentRoots.learningOutcomes, LearningOutcomeSchema),
      entities(structuredContentRoots.learningUnits, LearningUnitSchema),
      entities(structuredContentRoots.sources, SourceRevisionSchema),
    ]);
  contests.sort((a, b) => a.number - b.number);
  const policy = CanonicalProblemPlacementPolicySchema.parse(
    await json('src/content/policies/problem-placements.json'),
  );
  const prerequisites = CanonicalLearningPrerequisitesSchema.parse(
    await json('src/content/policies/learning-prerequisites.json'),
  );
  const acceptedUnits = z
    .object({
      sourceBuild: z.string(),
      subjectDigest: z.string(),
      units: z.array(
        z.object({
          learningUnitId: z.string(),
          documentPath: z.string(),
          documentDigest: z.string(),
          metadataDigest: z.string(),
        }),
      ),
    })
    .parse(await json('docs/verification/bootstrap/learning-unit-content.json'));
  const acceptedProblems = z
    .object({
      subjectDigest: z.string(),
      indexDigest: z.string(),
      status: z.literal('passed'),
      documents: z.array(
        z.object({
          problemId: z.string(),
          path: z.string(),
          digest: z.string(),
        }),
      ),
      correctionImpacts: z.array(
        z.object({
          id: z.string(),
          targets: z.array(z.object({ locator: z.unknown(), status: z.string() })),
        }),
      ),
    })
    .parse(await json('docs/verification/bootstrap/problem-authoring-units.json'));
  const acceptance = z
    .object({
      status: z.literal('accepted'),
      subjectDigest: z.string(),
      unresolvedFindingCount: z.literal(0),
    })
    .parse(await json('docs/verification/bootstrap/us1.json'));
  const acceptedMapping = z
    .object({
      subjectDigest: z.string(),
      status: z.literal('passed'),
      projectionDigest: z.string(),
      items: z.unknown(),
    })
    .parse(await json('docs/verification/bootstrap/problem-content-projection.json'));
  if (
    acceptance.subjectDigest !== acceptedProblems.subjectDigest ||
    acceptance.subjectDigest !== acceptedMapping.subjectDigest ||
    acceptedUnits.sourceBuild !== policy.sourceBuild.digest
  )
    throw new Error('FULL_PROJECTION_ACCEPTANCE_SUBJECT');
  if (
    units.length !== acceptedUnits.units.length ||
    metadata.length !== acceptedProblems.documents.length
  )
    throw new Error('FULL_PROJECTION_ACCEPTED_COVERAGE');
  const unitDocuments = new Map<string, { text: string; digest: string; accepted: boolean }>();
  const problemDocuments = new Map<
    string,
    ReturnType<typeof readProblemAuthoringDocument> & { text: string; digest: string }
  >();
  for (const unit of units) {
    const accepted = acceptedUnits.units.find((item) => item.learningUnitId === unit.id);
    const text = (await read(unit.docPath)).toString('utf8');
    assertAcceptedUnitPublication(unit, text, accepted);
    unitDocuments.set(unit.id, { text, digest: sha(text), accepted: true });
  }
  for (const document of acceptedProblems.documents) {
    const text = (await read(document.path)).toString('utf8');
    const parsed = readProblemAuthoringDocument(text);
    if (
      sha(text) !== document.digest ||
      parsed.unit.problemId !== document.problemId ||
      parsed.unit.docPath !== document.path
    )
      throw new Error(`FULL_PROJECTION_PROBLEM_NOT_ACCEPTED:${document.problemId}`);
    problemDocuments.set(document.problemId, { ...parsed, text, digest: sha(text) });
  }
  validateReleaseLearningStructure({
    tags,
    outcomes,
    units,
    problems: metadata,
    placements: policy.placements,
    prerequisites,
    chapters: TEXTBOOK_CHAPTERS,
  });
  const authoringUnits = [...problemDocuments.values()].map((document) => document.unit);
  const mapping = buildProblemContent({
    problemIds: metadata.map((problem) => problem.id),
    documents: authoringUnits,
    placements: policy.placements,
    units,
  });
  const mappingDigest = canonicalDigest(mapping);
  if (
    mappingDigest !== acceptedMapping.projectionDigest ||
    canonicalJson(mapping) !== canonicalJson(acceptedMapping.items)
  )
    throw new Error('FULL_PROJECTION_MAPPING_DRIFT');
  const metrics = validateAtCoderProblemsSnapshot(
    await json(ATCODER_PROBLEMS_METRICS_PATH),
    metadata,
  );
  const placements = policy.placements.map((placement) =>
    ProblemPlacementSchema.parse(
      Object.fromEntries(
        Object.entries(placement).filter(([key]) =>
          [
            'id',
            'problemId',
            'policyVersion',
            'kind',
            'primaryProblemId',
            'sharedOutcomeIds',
            'comparison',
            'additionalElement',
            'rationale',
            'evidenceIds',
          ].includes(key),
        ),
      ),
    ),
  );
  const problems = metadata.map((problem) => {
    const placement = policy.placements.find((item) => item.problemId === problem.id);
    if (!placement) throw new Error(`FULL_PROJECTION_PLACEMENT_MISSING:${problem.id}`);
    const metric = metrics.problems[problem.id];
    return ProblemSchema.parse({
      ...problem,
      publicationStatus: 'published',
      primaryTagIds: placement.primaryTagIds,
      secondaryTagIds: placement.supportingTagIds,
      placementId: placement.id,
      adHocElements: placement.adHocElements,
      difficultyEvidence:
        problem.difficultyEvidence ??
        `AtCoder Problems (${metrics.checkedAt}): difficulty=${String(metric?.difficulty ?? '未推定')}; point=${String(metric?.point ?? '不明')}`,
    });
  });
  const registry = buildAdvancedSlotRegistry({
    contests: contests.map((contest) => ({
      contestId: contest.id,
      advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: contest.taskOrderSourceRevisionId,
    })),
  });
  const retiredTargets: {
    impactId: string;
    locator: unknown;
    status: 'not_applicable';
    documentDigest: string;
  }[] = [];
  const impacts = policy.correctionImpacts.map((impact) => ({
    ...impact,
    verificationStatus: 'verified' as const,
    affectedContentLocators: impact.affectedContentLocators.filter((locator) => {
      if (locator.ownerType !== 'problem') return true;
      const document = problemDocuments.get(locator.problemId);
      if (!document) throw new Error(`FULL_PROJECTION_CORRECTION_OWNER:${locator.problemId}`);
      if (resolveProblemLocator(document.unit, locator.path)) return true;
      const accepted = acceptedProblems.correctionImpacts
        .find((item) => item.id === impact.id)
        ?.targets.find((target) => canonicalJson(target.locator) === canonicalJson(locator));
      if (
        accepted?.status !== 'not_applicable' ||
        document.unit.examples.length ||
        document.unit.exercises.length ||
        ![
          'examples.taxonomy-integration',
          'exercises.taxonomy-integration',
          'exercises.taxonomy-integration.answer',
        ].includes(locator.path)
      )
        throw new Error(`FULL_PROJECTION_CORRECTION_MISSING:${canonicalJson(locator)}`);
      retiredTargets.push({
        impactId: impact.id,
        locator,
        status: 'not_applicable',
        documentDigest: document.digest,
      });
      return false;
    }),
  }));
  const contentInventory = [
    ...units.map((unit) => ({ path: unit.docPath, digest: unitDocuments.get(unit.id)?.digest })),
    ...acceptedProblems.documents.map((document) => ({
      path: document.path,
      digest: document.digest,
    })),
  ].sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const contentDigest = canonicalDigest(contentInventory);
  const completedAt = policy.sourceBuild.acceptedAt;
  const resultPath = 'docs/verification/bootstrap/problem-authoring-units.json';
  const resultDigest = canonicalDigest(await json(resultPath));
  const catalog = CatalogSchema.parse({
    schemaVersion: '3.0.0',
    advancedSlotRegistry: registry,
    release: {
      publicationStatus: 'prepared',
      version: completedAt.slice(0, 10).replaceAll('-', '.'),
      releaseKind: 'initial',
      cutoffAt: INITIAL_RELEASE_CUTOFF,
      validatedAt: completedAt,
      publicationEffectiveAt: completedAt,
      manifestDigest: policy.sourceBuild.digest,
      contentFileInventoryDigest: contentDigest,
      contentSnapshotDigest: '0'.repeat(64),
      updateIds: ['update-bootstrap-full-corpus'],
      advancedSlotRegistryDigest: registry.digest,
      firstContestId: contests[0]?.id,
      lastContestId: contests.at(-1)?.id,
      contestCount: contests.length,
      problemCount: problems.length,
      slotRecordCount: slots.length,
      addedProblemIds: problems.map((problem) => problem.id),
      changedProblemIds: [],
      heldProblemIds: [],
      withdrawnProblemIds: [],
      taxonomyChanges: [],
      validationSummary: {
        checkCount: 1,
        passedCheckCount: 1,
        blockingFindingCount: 0,
        evidenceDigests: [resultDigest],
        checks: [
          {
            checkId: 'check-accepted-problem-corpus',
            command: 'npm run corpus:verify-problem-corpus',
            subjectDigest: acceptedProblems.subjectDigest,
            resultPath,
            resultDigest,
            exitCode: 0,
            passed: true,
            completedAt,
          },
        ],
      },
      humanContentReviewEvidenceRefs: [],
      changelogPath: FULL_PROJECTION_PATH,
    },
    contests,
    contestGaps,
    contestSlots: slots.map((slot) => ({
      ...slot,
      catalogStatus: slot.availability === 'exists' ? 'published' : slot.catalogStatus,
    })),
    problems,
    techniqueInventory: inventory,
    tags,
    learningOutcomes: outcomes,
    learningUnits: units,
    placements,
    authoringUnits,
    sources,
    correctionImpacts: impacts,
  });
  Object.assign(catalog, assembleCatalog(catalog));
  catalog.release.contentSnapshotDigest = catalogContentDigest(catalog);
  const taxonomyIndex = {
    tags: catalog.tags,
    learningOutcomes: catalog.learningOutcomes,
    learningUnits: catalog.learningUnits,
    placements: policy.placements,
    learningPrerequisites: prerequisites,
  };
  const indexProjections = new Map<string, unknown>([[TAXONOMY_INDEX_PATH, taxonomyIndex]]);
  const corrections = await Promise.all(
    impacts.map((impact) =>
      verifyCanonicalCorrectionTargets({
        impact,
        catalog,
        indexProjections,
        readTarget: (file) =>
          options.verifyDerivedFiles === false && file === TAXONOMY_INDEX_PATH
            ? Promise.resolve(Buffer.from(JSON.stringify(taxonomyIndex)))
            : read(file),
      }),
    ),
  );
  const history = z.array(PublicReleaseHistoryEntrySchema).parse(await json(PUBLIC_HISTORY_PATH));
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const orderedUnits = TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]).map(
    (id) => {
      const unit = unitById.get(id);
      if (!unit) throw new Error(`FULL_PROJECTION_ORDER_UNKNOWN:${id}`);
      const parentTitles = [];
      let parent = unit.parentId ? unitById.get(unit.parentId) : undefined;
      while (parent) {
        parentTitles.unshift(parent.title);
        parent = parent.parentId ? unitById.get(parent.parentId) : undefined;
      }
      return {
        id,
        title: unit.title,
        outcome: unit.learningRationale,
        parentTitles,
        parentId: unit.parentId,
        prerequisiteUnitIds: prerequisites.learningUnitPrerequisites
          .filter((edge) => edge.nodeId === id)
          .map((edge) => edge.prerequisiteId),
        route: learningUnitRoute(unit.docPath),
        problemIds: unit.directProblemIds ?? [],
        relatedProblemIds: unit.relatedProblemIds ?? [],
        coverageProblemIds: unit.problemIds,
        childUnitIds: units.filter((child) => child.parentId === id).map((child) => child.id),
        ownedTagIds: unit.ownedTagIds ?? [],
      };
    },
  );
  if (options.usePreparedRelease !== false) {
    let prepared: unknown;
    try {
      prepared = await json('docs/verification/releases/catalog.json');
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
    if (prepared !== undefined) {
      const release = CatalogReleaseSchema.parse((prepared as { release: unknown }).release);
      Object.assign(catalog.release, release);
      if (catalogContentDigest(catalog) !== release.contentSnapshotDigest)
        throw new Error('FULL_PROJECTION_PREPARED_RELEASE_DRIFT');
    }
  }
  const digest = canonicalDigest({
    catalog: projectCatalogContent(catalog),
    mappingDigest,
    acceptedUnitSubject: acceptedUnits.subjectDigest,
    acceptedProblemSubject: acceptedProblems.subjectDigest,
    contentInventory,
    corrections,
    retiredTargets,
    history,
    editorialOrder: orderedUnits.map((unit) => ({
      id: unit.id,
      target: unitLearningTarget(unit.id),
    })),
  });
  const ui = buildUiCatalog({
    scopeId: 'canonical-full-corpus',
    subjectDigest: digest,
    publicationBoundary: 'public',
    selectedProblemIds: problems.map((problem) => problem.id),
    contests: contests.map((contest) => ({ ...contest, route: `/contests/${contest.id}/` })),
    problems: problems.map((problem) => ({
      ...problem,
      constraintsSummary: problem.constraintsSummary ?? '',
      publicationState: 'published' as const,
    })),
    placements: policy.placements.map((placement) => ({
      problemId: placement.problemId,
      homeUnitId: mapping.find((item) => item.problemId === placement.problemId)?.homeUnitId ?? '',
      primaryTagId: placement.primaryTagIds[0] ?? '',
      primaryTagIds: placement.primaryTagIds,
      supportingTagIds: placement.supportingTagIds,
      similarProblemIds:
        placement.kind === 'similar' && placement.primaryProblemId
          ? [placement.primaryProblemId]
          : [],
      relatedProblemIds:
        units
          .find(
            (unit) =>
              unit.id ===
              mapping.find((item) => item.problemId === placement.problemId)?.homeUnitId,
          )
          ?.directProblemIds?.filter((id) => id !== placement.problemId) ?? [],
      primaryOutcomeId: placement.primaryOutcomeId,
      additionalPrimaryOutcomeIds: placement.additionalPrimaryOutcomeIds,
      supportingOutcomeIds: placement.supportingOutcomeIds,
      explanationSummary:
        outcomes.find((outcome) => outcome.id === placement.primaryOutcomeId)?.statement ?? '',
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      definition: tag.definition,
      aliases: [...tag.aliases, ...tag.formerNames],
      route: `/tags/${tag.id}/`,
      representativeProblemIds: tag.representativeProblemIds,
      problemIds: problems
        .filter((problem) =>
          [...problem.primaryTagIds, ...problem.secondaryTagIds].includes(tag.id),
        )
        .map((problem) => problem.id),
    })),
    learningUnits: orderedUnits,
    releaseHistory: history.map((release) => ({
      version: release.version,
      state: 'public',
      route: `/updates/${release.version}/`,
      subjectDigest: canonicalDigest(release),
      problemCount: release.problemCount,
      evidencePaths: [release.changelogPath],
    })),
  });
  return {
    catalog,
    ui,
    policy,
    prerequisites,
    unitDocuments,
    problemDocuments,
    mapping,
    mappingDigest,
    taxonomyIndex,
    corrections,
    retiredTargets,
    history,
    digest,
  };
};
