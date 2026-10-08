import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { z } from 'zod';
import { parseFrontmatter } from '@astrojs/markdown-remark';
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
  parseAtCoderContestResourceUrl,
  ProblemPlacementSchema,
  CanonicalProblemPlacementPolicySchema,
  CanonicalLearningPrerequisitesSchema,
} from '../domain/schema-parts/catalog.js';
import { readProblemAuthoringDocument } from '../authoring/problem-authoring-document.js';
import { validatePublicationExamples } from '../authoring/publication-examples.js';
import {
  resolveProblemLocator,
  validateJoinedProblemDocuments,
} from '../authoring/verify-problem-corpus.js';
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
import { PublicReleaseHistorySchema } from './build-release-history.js';
import { INITIAL_RELEASE_CUTOFF } from './seed-release.js';

export const FULL_PROJECTION_PATH = 'docs/verification/bootstrap/us4/full-projections.json';
export const TAXONOMY_INDEX_PATH = 'src/content/indexes/taxonomy.json';
export const PUBLIC_HISTORY_PATH = 'src/content/indexes/release-history.json';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
/** Validate current prose and publication structure, without an accepted-byte inventory. */
export const assertUnitPublication = (
  unit: z.infer<typeof LearningUnitSchema>,
  text: string,
): void => {
  const { frontmatter, content } = parseFrontmatter(text);
  const sections = ['概要', '考え方', '成立条件と計算量', '前提と範囲', '問題一覧', '根拠'];
  if (
    unit.contentPhase !== 'full_authoring' ||
    frontmatter.draft !== false ||
    frontmatter.title !== unit.title ||
    sections.some((heading) => {
      const body = content.split(`## ${heading}\n`)[1]?.split(/\n## /u)[0]?.trim();
      return !body;
    }) ||
    content.includes('objectPatterns') ||
    content.includes('triggerPatterns')
  )
    throw new Error(`FULL_PROJECTION_UNIT_DOCUMENT:${unit.id}`);
  validatePublicationExamples(content, unit.examples, (reason) => {
    throw new Error(`FULL_PROJECTION_UNIT_${reason}:${unit.id}`);
  });
};

/** Read canonical metadata and authored Markdown; never regenerate taxonomy or prose. */
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
    const values = await Promise.all(
      files.map(async (file) => schema.parse(await json(`${directory}/${file}`))),
    );
    return values;
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
  for (const values of [contests, metadata, inventory, tags, outcomes, units, sources]) {
    const ids = values.map((value) => ('id' in value ? value.id : value.problemId));
    if (new Set(ids).size !== values.length) throw new Error('FULL_PROJECTION_DUPLICATE_ENTITY');
  }
  contests.sort((a, b) => a.number - b.number);
  const policy = CanonicalProblemPlacementPolicySchema.parse(
    await json('src/content/policies/problem-placements.json'),
  );
  const prerequisites = CanonicalLearningPrerequisitesSchema.parse(
    await json('src/content/policies/learning-prerequisites.json'),
  );
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const requireSources = (owner: string, ids: readonly string[]) =>
    ids.map((id) => {
      const source = sourceById.get(id);
      if (!source) throw new Error(`FULL_PROJECTION_SOURCE_UNKNOWN:${owner}:${id}`);
      return source;
    });
  const unitDocuments = new Map<string, { text: string; digest: string; validated: boolean }>();
  const problemDocuments = new Map<
    string,
    ReturnType<typeof readProblemAuthoringDocument> & { text: string; digest: string }
  >();
  for (const unit of units) {
    const text = (await read(unit.docPath)).toString('utf8');
    assertUnitPublication(unit, text);
    for (const source of requireSources(unit.id, unit.sourceRevisionIds))
      if (!text.includes(`](${source.url})`))
        throw new Error(`FULL_PROJECTION_UNIT_SOURCE_REFERENCE:${unit.id}:${source.id}`);
    unitDocuments.set(unit.id, { text, digest: sha(text), validated: true });
  }
  // Problem metadata has no docPath. The authored frontmatter owns this reference.
  const problemRoot = 'src/content/docs/problems';
  const problemPaths = (await readdir(path.join(root, problemRoot), { recursive: true }))
    .filter((file) => /\.mdx?$/u.test(file))
    .sort()
    .map((file) => `${problemRoot}/${file}`);
  const documents = await Promise.all(
    problemPaths.map(async (file) => {
      const text = (await read(file)).toString('utf8');
      return { ...readProblemAuthoringDocument(text), path: file, text, digest: sha(text) };
    }),
  );
  validateJoinedProblemDocuments({
    expectedDocuments: metadata.map((problem) => ({
      problemId: problem.id,
      path:
        documents.find((document) => document.unit.problemId === problem.id)?.unit.docPath ?? '',
    })),
    documents,
    discoveredPaths: problemPaths,
  });
  const unitIds = new Set(units.map((unit) => unit.id));
  const outcomeIds = new Set(outcomes.map((outcome) => outcome.id));
  const tagIds = new Set(tags.map((tag) => tag.id));
  const metadataById = new Map(metadata.map((problem) => [problem.id, problem]));
  for (const document of documents) {
    const problem = metadataById.get(document.unit.problemId);
    if (!problem) throw new Error(`FULL_PROJECTION_PROBLEM_UNKNOWN:${document.unit.problemId}`);
    if (
      document.unit.additionalPrerequisiteUnitIds.some((id) => !unitIds.has(id)) ||
      document.unit.learningOutcomeIds.some((id) => !outcomeIds.has(id)) ||
      document.unit.tagIds.some((id) => !tagIds.has(id))
    )
      throw new Error(`FULL_PROJECTION_AUTHORING_REFERENCE:${problem.id}`);
    const placement = policy.placements.find((item) => item.problemId === problem.id);
    if (
      placement?.kind !== document.unit.kind ||
      placement.primaryProblemId !== document.unit.primaryProblemId
    )
      throw new Error(`FULL_PROJECTION_AUTHORING_PLACEMENT:${problem.id}`);
    for (const source of requireSources(problem.id, document.unit.sourceRevisionIds))
      if (!document.body.includes(`](${source.url})`))
        throw new Error(`FULL_PROJECTION_PROBLEM_SOURCE_REFERENCE:${problem.id}:${source.id}`);
    const refs = requireSources(problem.id, [
      ...problem.sourceRevisionIds,
      ...document.unit.sourceRevisionIds,
    ]);
    for (const source of refs) {
      const identity = parseAtCoderContestResourceUrl(source.url);
      if (
        source.contestId !== problem.contestId ||
        identity?.contestId !== problem.contestId ||
        source.officialTaskId !== problem.officialTaskId ||
        (source.sourceKind === 'official_problem' &&
          (identity.resource !== 'task' || identity.taskId !== problem.officialTaskId))
      )
        throw new Error(`FULL_PROJECTION_SOURCE_TASK:${problem.id}:${source.id}`);
    }
    if (!refs.some((source) => source.sourceKind === 'official_problem'))
      throw new Error(`FULL_PROJECTION_SOURCE_TASK_MISSING:${problem.id}`);
    problemDocuments.set(problem.id, document);
  }
  for (const record of inventory) requireSources(record.problemId, record.sourceRevisionIds);
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
      // These optional preview blocks are absent from the current canonical prose.
      // All other missing correction locators still fail below.
      if (
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
    ...documents.map((document) => ({ path: document.unit.docPath, digest: document.digest })),
  ].sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const contentDigest = canonicalDigest(contentInventory);
  const completedAt = policy.sourceBuild.acceptedAt;
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
  const history = PublicReleaseHistorySchema.parse(await json(PUBLIC_HISTORY_PATH));
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
      // The legacy release inventories all canonical content files, rather than
      // the prose-only inventory used by the candidate projection above.
      const { calculateActualContentFileInventory } = await import('./evidence-inventory.js');
      const actualInventoryDigest = canonicalDigest(
        await calculateActualContentFileInventory(root),
      );
      Object.assign(catalog.release, release);
      if (
        release.contentFileInventoryDigest !== actualInventoryDigest ||
        catalogContentDigest(catalog) !== release.contentSnapshotDigest
      )
        throw new Error('FULL_PROJECTION_PREPARED_RELEASE_DRIFT');
    }
  }
  const digest = canonicalDigest({
    catalog: projectCatalogContent(catalog),
    mappingDigest,
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
