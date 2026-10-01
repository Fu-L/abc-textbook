import { canonicalJson } from '../domain/canonical-json.js';
import { TEXTBOOK_CHAPTERS, textbookIndex } from '../taxonomy/textbook-order.js';
import { unitLearningTarget } from '../taxonomy/unit-learning-targets.js';
import type { CanonicalTaxonomyMaterialization } from '../taxonomy/canonical-taxonomy-materialization.js';
import { deterministicTopologicalOrder } from '../validation/validate.js';

const section = (document: string, title: string): string =>
  document.split(`\n## ${title}\n`)[1]?.split('\n## ')[0]?.trim() ?? '';

export const learningUnitRoute = (documentPath: string): string =>
  `/${documentPath.replace(/^src\/content\/docs\//u, '').replace(/(?:\/index)?\.md$/u, '')}/`;

/** Validate authored documents against the accepted skeleton, then expose navigation.
 * Topological orders are used only for cycle checks, never as textbook order.
 */
export const buildLearningPath = (
  actual: CanonicalTaxonomyMaterialization,
  accepted: CanonicalTaxonomyMaterialization,
) => {
  const diagnostics: string[] = [];
  const byId = new Map(actual.learningUnits.map((output) => [output.value.id, output]));
  const acceptedById = new Map(accepted.learningUnits.map((output) => [output.value.id, output]));
  const ids = TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]);
  if (
    new Set(ids).size !== ids.length ||
    byId.size !== actual.learningUnits.length ||
    canonicalJson([...byId.keys()].sort()) !== canonicalJson([...ids].sort())
  )
    diagnostics.push('UNIT_ORDER_COVERAGE');

  for (const [kind, entities, edges] of [
    ['tag', actual.tags.map(({ value }) => value), actual.learningPrerequisites.tagPrerequisites],
    [
      'outcome',
      actual.learningOutcomes.map(({ value }) => value),
      actual.learningPrerequisites.learningOutcomePrerequisites,
    ],
    [
      'unit',
      actual.learningUnits.map(({ value }) => value),
      actual.learningPrerequisites.learningUnitPrerequisites,
    ],
  ] as const) {
    deterministicTopologicalOrder(
      entities.map((entity) => ({
        id: entity.id,
        prerequisiteIds: edges
          .filter((edge) => edge.nodeId === entity.id)
          .map((edge) => edge.prerequisiteId),
      })),
    );
    if (edges.some((edge) => !entities.some((entity) => entity.id === edge.nodeId)))
      diagnostics.push(`UNKNOWN_DAG_NODE:${kind}`);
  }
  // Outcome entities also declare their prerequisites; verify this separate source.
  deterministicTopologicalOrder(
    actual.learningOutcomes.map(({ value }) => ({
      id: value.id,
      prerequisiteIds: value.prerequisiteOutcomeIds,
    })),
  );
  deterministicTopologicalOrder(
    actual.learningUnits.map(({ value }) => ({
      id: value.id,
      prerequisiteIds: value.parentId === null ? [] : [value.parentId],
    })),
  );

  const root = (id: string): string | undefined => {
    let unit = byId.get(id)?.value;
    while (unit?.parentId) unit = byId.get(unit.parentId)?.value;
    return unit?.id;
  };
  const routes = new Set(
    actual.learningUnits.map((output) => learningUnitRoute(output.documentPath)),
  );
  const metadata = (value: object): string =>
    canonicalJson(
      Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'contentPhase')),
    );
  const problemHomeById = new Map<string, string>();
  for (const chapter of TEXTBOOK_CHAPTERS) {
    const chapterDocument = byId.get(chapter.id)?.document ?? '';
    const contents = section(chapterDocument, '章の構成');
    let previous = -1;
    for (const id of chapter.unitIds) {
      const output = byId.get(id);
      if (!output) continue;
      if (root(id) !== chapter.id) diagnostics.push(`CHAPTER_MEMBERSHIP:${id}`);
      const link = `[${output.value.title}](${learningUnitRoute(output.documentPath)})`;
      const position = contents.indexOf(link);
      if (position <= previous) diagnostics.push(`CHAPTER_NAVIGATION:${id}`);
      previous = position;
      const parent = output.value.parentId ? byId.get(output.value.parentId) : undefined;
      if (
        parent &&
        parent.value.id !== chapter.id &&
        !contents.includes(
          `概念上の親: [${parent.value.title}](${learningUnitRoute(parent.documentPath)})`,
        )
      )
        diagnostics.push(`CHAPTER_PARENT:${id}`);
    }
  }
  for (const output of actual.learningUnits) {
    const { value: unit, document } = output;
    const expected = acceptedById.get(unit.id);
    if (!expected || metadata(unit) !== metadata(expected.value))
      diagnostics.push(`METADATA_DRIFT:${unit.id}`);
    if (unit.contentPhase !== 'full_authoring') diagnostics.push(`HANDOFF_REQUIRED:${unit.id}`);
    if (!document.includes('\ndraft: true\n')) diagnostics.push(`DRAFT_REQUIRED:${unit.id}`);
    if (!document.includes(`  order: ${String(textbookIndex(unit.id))}\n`))
      diagnostics.push(`SIDEBAR_ORDER:${unit.id}`);
    if (!section(document, '考え方') || !section(document, '成立条件と計算量'))
      diagnostics.push(`CONCEPT_PROSE:${unit.id}`);
    const target = unitLearningTarget(unit.id);
    if (
      !document.includes(`**${target.color}（${target.rating}）**`) ||
      !document.includes(target.reason)
    )
      diagnostics.push(`LEARNING_TARGET:${unit.id}`);
    const parent = unit.parentId ? byId.get(unit.parentId) : undefined;
    if (
      parent &&
      !document.includes(
        `概念上の親: [${parent.value.title}](${learningUnitRoute(parent.documentPath)})`,
      )
    )
      diagnostics.push(`CONCEPTUAL_PARENT:${unit.id}`);
    for (const prefix of ['直接の前提単元:', 'このUnitを直接前提とする単元:']) {
      const line = document.split('\n').find((text) => text.startsWith(prefix));
      const expectedLine = expected?.document.split('\n').find((text) => text.startsWith(prefix));
      if (!line || line !== expectedLine) diagnostics.push(`PREREQUISITE_NAVIGATION:${unit.id}`);
    }
    for (const title of ['章の構成', '問題一覧', '関連問題', '根拠']) {
      if (expected && section(document, title) !== section(expected.document, title))
        diagnostics.push(`ACCEPTED_NAVIGATION_DRIFT:${unit.id}:${title}`);
    }
    for (const match of document.matchAll(/\]\((\/learn\/[^)\s]*)\)/gu)) {
      if (!routes.has(match[1] ?? ''))
        diagnostics.push(`LEARNING_LINK_UNKNOWN:${unit.id}:${match[1] ?? ''}`);
    }
    for (const problemId of unit.directProblemIds ?? []) {
      if (problemHomeById.has(problemId)) diagnostics.push(`DUPLICATE_HOME:${problemId}`);
      problemHomeById.set(problemId, unit.id);
    }
  }
  for (const field of [
    'tags',
    'learningOutcomes',
    'learningPrerequisites',
    'problemPlacementPolicy',
  ] as const) {
    if (canonicalJson(actual[field]) !== canonicalJson(accepted[field]))
      diagnostics.push(`ACCEPTED_POLICY_DRIFT:${field}`);
  }
  for (const placement of actual.problemPlacementPolicy.placements) {
    const owner = actual.learningUnits.filter(({ value }) =>
      value.ownedLearningOutcomeIds?.includes(placement.primaryOutcomeId),
    );
    if (owner.length !== 1 || owner[0]?.value.id !== problemHomeById.get(placement.problemId))
      diagnostics.push(`PRIMARY_OUTCOME_HOME:${placement.problemId}`);
  }
  if (problemHomeById.size !== actual.problemPlacementPolicy.placements.length)
    diagnostics.push('PROBLEM_REACHABILITY');
  if (diagnostics.length) throw new Error(diagnostics.join('\n'));
  return { chapters: TEXTBOOK_CHAPTERS, units: ids.map((id) => byId.get(id)), problemHomeById };
};
