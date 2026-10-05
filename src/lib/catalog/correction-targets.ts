import { createHash } from 'node:crypto';
import type { z } from 'zod';
import { resolveProblemLocator } from '../authoring/verify-problem-corpus.js';
import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import {
  type CatalogSchema,
  CorrectionImpactSchema,
  CanonicalLearningPrerequisitesSchema,
} from '../domain/schema-parts/catalog.js';

/** Full-catalog corrections enumerate existing blocks only. Sources from before
 * and after the correction remain attached; absence of optional blocks is valid.
 * Preview enumeration remains in update-abc/correction-impact.ts.
 */
export const enumerateCanonicalCorrectionImpact = (input: {
  readonly catalog: z.infer<typeof CatalogSchema>;
  /** Protected-base catalog when the correction changes classification. */
  readonly previousCatalog?: z.infer<typeof CatalogSchema>;
  readonly correctionId: string;
  readonly sourceRevisionId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly problemIds: readonly string[];
  readonly changeSummary: string;
  readonly derivedIndexPaths: readonly string[];
}) => {
  const locators: z.infer<typeof CorrectionImpactSchema>['affectedContentLocators'] = [];
  const problemIds = new Set(input.problemIds);
  const revisions = new Set([input.sourceRevisionId, ...input.sourceRevisionIds]);
  for (const unit of [
    ...input.catalog.authoringUnits,
    ...(input.previousCatalog?.authoringUnits ?? []),
  ])
    if (unit.sourceRevisionIds.some((id) => revisions.has(id))) problemIds.add(unit.problemId);
  if (!problemIds.size) throw new Error('CORRECTION_PROBLEM_SCOPE_EMPTY');
  for (const problemId of problemIds) {
    const unit = input.catalog.authoringUnits.find((owner) => owner.problemId === problemId);
    if (!unit) throw new Error(`CORRECTION_TARGET_MISSING:${problemId}`);
    locators.push(
      ...Object.keys(unit.sections).map((key) => ({
        ownerType: 'problem' as const,
        problemId,
        path: `sections.${key}`,
      })),
    );
    locators.push(
      ...unit.claims.map((block) => ({
        ownerType: 'problem' as const,
        problemId,
        path: `claims.${block.key}`,
      })),
    );
    locators.push(
      ...unit.examples.map((block) => ({
        ownerType: 'problem' as const,
        problemId,
        path: `examples.${block.key}`,
      })),
    );
    for (const block of unit.exercises)
      for (const suffix of ['', '.assessment', '.answer'])
        locators.push({ ownerType: 'problem', problemId, path: `exercises.${block.key}${suffix}` });
    locators.push({
      ownerType: 'problem_placement',
      problemId,
      path: 'src/content/policies/problem-placements.json',
    });
  }
  const affectedUnitIds = new Set(
    [...input.catalog.learningUnits, ...(input.previousCatalog?.learningUnits ?? [])]
      .filter(
        (unit) =>
          unit.problemIds.some((id) => problemIds.has(id)) ||
          (unit.relatedProblemIds ?? []).some((id) => problemIds.has(id)) ||
          unit.sourceRevisionIds.some((id) => revisions.has(id)),
      )
      .map((unit) => unit.id),
  );
  // Resolve surviving units against the current catalog: both removed and added
  // relations need their current prose checked after a classification change.
  for (const unit of input.catalog.learningUnits) {
    if (!affectedUnitIds.has(unit.id)) continue;
    locators.push({ ownerType: 'learning_unit', learningUnitId: unit.id, path: 'content' });
    locators.push(
      ...unit.examples.map((block) => ({
        ownerType: 'learning_unit' as const,
        learningUnitId: unit.id,
        path: `examples.${block.key}`,
      })),
    );
    for (const block of unit.exercises)
      for (const suffix of ['', '.assessment', '.answer'])
        locators.push({
          ownerType: 'learning_unit',
          learningUnitId: unit.id,
          path: `exercises.${block.key}${suffix}`,
        });
  }
  locators.push({
    ownerType: 'learning_prerequisites',
    path: 'src/content/policies/learning-prerequisites.json',
  });
  const subject = {
    correctionId: input.correctionId,
    sourceRevisionIds: [...revisions].sort(),
    problemIds: [...problemIds].sort(),
  };
  return CorrectionImpactSchema.parse({
    id: `correction-impact-${canonicalDigest(subject).slice(0, 20)}`,
    sourceRevisionId: input.sourceRevisionId,
    sourceRevisionIds: subject.sourceRevisionIds,
    changeSummary: input.changeSummary,
    affectedContentLocators: locators.sort((a, b) =>
      canonicalJson(a).localeCompare(canonicalJson(b), 'en'),
    ),
    derivedIndexPaths: [...new Set(input.derivedIndexPaths)].sort(),
    verificationStatus: 'pending',
  });
};

/** Mapping completeness is insufficient: resolve the actual target and bind its
 * bytes, including derived indexes freshly calculated from canonical content.
 * The caller persists this report with its update; this function never writes.
 */
export const verifyCanonicalCorrectionTargets = async (input: {
  readonly impact: unknown;
  readonly catalog: z.infer<typeof CatalogSchema>;
  readonly readTarget: (file: string) => Promise<Buffer>;
  readonly indexProjections: ReadonlyMap<string, unknown>;
}) => {
  const impact = CorrectionImpactSchema.parse(input.impact);
  for (const sourceId of impact.sourceRevisionIds ?? [impact.sourceRevisionId])
    if (!input.catalog.sources.some((source) => source.id === sourceId))
      throw new Error(`CORRECTION_SOURCE_MISSING:${sourceId}`);
  const read = async (file: string) => {
    const bytes = await input.readTarget(file);
    if (!bytes.length) throw new Error(`CORRECTION_TARGET_EMPTY:${file}`);
    return { bytes, digest: createHash('sha256').update(bytes).digest('hex') };
  };
  const targets = [];
  for (const locator of impact.affectedContentLocators) {
    let documentPath: string;
    if (locator.ownerType === 'problem') {
      const owner = input.catalog.authoringUnits.find(
        (unit) => unit.problemId === locator.problemId,
      );
      if (!owner || !resolveProblemLocator(owner, locator.path))
        throw new Error(`CORRECTION_TARGET_MISSING:${JSON.stringify(locator)}`);
      documentPath = owner.docPath;
    } else if (locator.ownerType === 'learning_unit') {
      const owner = input.catalog.learningUnits.find((unit) => unit.id === locator.learningUnitId);
      const [collection, key, detail, ...rest] = locator.path.split('.');
      const valid =
        locator.path === 'content' ||
        (rest.length === 0 &&
          key &&
          (Boolean(
            collection === 'examples' &&
            detail === undefined &&
            owner?.examples.some((example) => example.key === key),
          ) ||
            (collection === 'exercises' &&
              (detail === undefined || detail === 'answer' || detail === 'assessment') &&
              owner?.exercises.some((exercise) => exercise.key === key))));
      if (!owner || !valid) throw new Error(`CORRECTION_TARGET_MISSING:${JSON.stringify(locator)}`);
      documentPath = owner.docPath;
    } else {
      documentPath = locator.path;
      const value = JSON.parse((await read(documentPath)).bytes.toString('utf8')) as unknown;
      if (locator.ownerType === 'learning_prerequisites')
        CanonicalLearningPrerequisitesSchema.parse(value);
      else {
        const placements =
          typeof value === 'object' &&
          value !== null &&
          'placements' in value &&
          Array.isArray(value.placements)
            ? (value.placements as unknown[])
            : [];
        if (
          !input.catalog.problems.some((problem) => problem.id === locator.problemId) ||
          !placements.some(
            (placement) =>
              typeof placement === 'object' &&
              placement !== null &&
              'problemId' in placement &&
              placement.problemId === locator.problemId,
          )
        )
          throw new Error(`CORRECTION_PLACEMENT_MISSING:${locator.problemId}`);
      }
    }
    targets.push({ locator, documentPath, digest: (await read(documentPath)).digest });
  }
  const derivedIndexes = [];
  for (const file of impact.derivedIndexPaths) {
    if (!input.indexProjections.has(file))
      throw new Error(`CORRECTION_INDEX_PROJECTION_MISSING:${file}`);
    const { bytes, digest } = await read(file);
    if (
      canonicalJson(JSON.parse(bytes.toString('utf8')) as unknown) !==
      canonicalJson(input.indexProjections.get(file))
    )
      throw new Error(`CORRECTION_INDEX_STALE:${file}`);
    derivedIndexes.push({ path: file, digest });
  }
  return {
    correctionImpactId: impact.id,
    sourceRevisionIds: impact.sourceRevisionIds ?? [impact.sourceRevisionId],
    verificationStatus: 'verified' as const,
    targets,
    derivedIndexes,
  };
};
