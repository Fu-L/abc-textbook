import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import type { z } from 'zod';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { stableProblemId } from '../../src/lib/domain/identity.js';
import type { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { buildAdvancedSlotRegistry } from '../../src/lib/catalog/advanced-slot-registry.js';
import type { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { learningUnitRoute } from '../../src/lib/catalog/build-learning-path.js';
import { validateReleaseLearningStructure } from '../../src/lib/catalog/release-learning-structure.js';
import { deterministicTopologicalOrder } from '../../src/lib/validation/validate.js';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { unitLearningTarget } from '../../src/lib/taxonomy/unit-learning-targets.js';

type Catalog = z.infer<typeof CatalogSchema>;
export type FullProjection = Awaited<ReturnType<typeof loadFullPublicProjection>>;
export const assertAudit = (condition: unknown, code: string): void => {
  if (!condition) throw new Error(code);
};
const equalSet = (actual: readonly string[], expected: readonly string[], code: string) => {
  assertAudit(
    new Set(actual).size === actual.length &&
      canonicalJson([...actual].sort()) === canonicalJson([...expected].sort()),
    code,
  );
};

/** Uses official task order, never the stored release counts or the preview cohort. */
export const auditCompleteness = (catalog: Catalog) => {
  const first = Number(catalog.release.firstContestId.slice(3));
  const last = Number(catalog.release.lastContestId.slice(3));
  assertAudit(first === 212 && last >= first, 'AUDIT_CONTEST_BOUNDARY');
  const numbers = [...catalog.contests, ...catalog.contestGaps].map((item) => String(item.number));
  equalSet(
    numbers,
    Array.from({ length: last - first + 1 }, (_, i) => String(first + i)),
    'AUDIT_CONTEST_CONTINUITY',
  );
  const expected = catalog.contests.flatMap((contest) => {
    assertAudit(
      contest.officialTaskOrder.filter((label) => label === 'D').length === 1 &&
        new Set(contest.officialTaskOrder).size === contest.officialTaskOrder.length &&
        new Set(contest.officialTaskIds).size === contest.officialTaskIds.length &&
        contest.officialTaskIds.length === contest.officialTaskOrder.length &&
        Date.parse(contest.endedAt) <= Date.parse(catalog.release.cutoffAt),
      `AUDIT_TASK_ORDER:${contest.id}`,
    );
    return contest.officialTaskOrder.flatMap((label, index) =>
      index > contest.officialTaskOrder.indexOf('D')
        ? [{ id: stableProblemId(contest.id, label), contest, label, index }]
        : [],
    );
  });
  const ids = expected.map((item) => item.id);
  equalSet(
    catalog.problems.map((problem) => problem.id),
    ids,
    'AUDIT_PROBLEM_COVERAGE',
  );
  equalSet(
    catalog.authoringUnits.map((unit) => unit.problemId),
    ids,
    'AUDIT_DOCUMENT_COVERAGE',
  );
  equalSet(
    catalog.techniqueInventory.map((item) => item.problemId),
    ids,
    'AUDIT_INVENTORY_COVERAGE',
  );
  equalSet(
    catalog.placements.map((item) => item.problemId),
    ids,
    'AUDIT_PLACEMENT_COVERAGE',
  );
  for (const { id, contest, label, index } of expected) {
    const problem = catalog.problems.find((item) => item.id === id);
    const slot = catalog.contestSlots.find(
      (item) => item.contestId === contest.id && item.label === label,
    );
    assertAudit(
      problem !== undefined &&
        problem.officialTaskId === contest.officialTaskIds[index] &&
        slot?.officialTaskId === problem.officialTaskId &&
        slot.officialOrder === index &&
        slot.problemId === id &&
        slot.availability === 'exists',
      `AUDIT_TASK_IDENTITY:${id}`,
    );
    assertAudit(
      problem?.publicationStatus === 'published' && slot?.catalogStatus === 'published',
      `AUDIT_PUBLIC_STATE:${id}`,
    );
  }
  const registry = buildAdvancedSlotRegistry({
    contests: catalog.contests.map((contest) => ({
      contestId: contest.id,
      advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: contest.taskOrderSourceRevisionId,
    })),
  });
  assertAudit(
    canonicalJson(registry) === canonicalJson(catalog.advancedSlotRegistry),
    'AUDIT_SLOT_REGISTRY',
  );
  equalSet(
    catalog.contestSlots.map((slot) => `${slot.contestId}:${slot.label}`),
    catalog.contests.flatMap((contest) => registry.labels.map((label) => `${contest.id}:${label}`)),
    'AUDIT_SLOT_COVERAGE',
  );
  for (const slot of catalog.contestSlots) {
    const exists = expected.some(
      (item) => item.contest.id === slot.contestId && item.label === slot.label,
    );
    if (!exists)
      assertAudit(
        slot.availability === 'official_absent' &&
          slot.problemId === null &&
          slot.officialTaskId === null,
        'AUDIT_ABSENT_SLOT',
      );
  }
  return {
    firstContestId: catalog.release.firstContestId,
    lastContestId: catalog.release.lastContestId,
    cutoffAt: catalog.release.cutoffAt,
    contestNumberCount: numbers.length,
    heldContests: catalog.contests.length,
    officialGaps: catalog.contestGaps.map((gap) => ({
      number: gap.number,
      evidenceUrl: gap.evidenceUrl,
      fingerprint: gap.fingerprint,
    })),
    problems: ids.length,
    expectedProblems: ids.length,
    coveragePercent: 100,
    labels: registry.labels,
    problemSetDigest: canonicalDigest([...ids].sort()),
  };
};

export const auditTaxonomy = async (projection: FullProjection) => {
  const { catalog, policy, prerequisites } = projection;
  validateReleaseLearningStructure({
    tags: catalog.tags,
    outcomes: catalog.learningOutcomes,
    units: catalog.learningUnits,
    problems: catalog.problems,
    placements: policy.placements,
    prerequisites,
    chapters: TEXTBOOK_CHAPTERS,
  });
  deterministicTopologicalOrder(
    catalog.tags.map((tag) => ({
      id: tag.id,
      prerequisiteIds: tag.parentId ? [tag.parentId] : [],
    })),
  );
  const terms = new Map<string, string>();
  for (const tag of catalog.tags) {
    // Repeated spellings within one owner are aliases, not duplicate concepts.
    for (const term of [tag.name, ...tag.aliases, ...tag.formerNames]) {
      const key = term.normalize('NFKC').trim().toLocaleLowerCase('en-US');
      assertAudit(!terms.has(key) || terms.get(key) === tag.id, `AUDIT_DUPLICATE_CONCEPT:${term}`);
      terms.set(key, tag.id);
    }
    equalSet(
      catalog.learningUnits
        .filter((unit) => unit.ownedTagIds?.includes(tag.id))
        .map((unit) => unit.id),
      catalog.learningUnits
        .filter((unit) => unit.ownedTagIds?.includes(tag.id))
        .slice(0, 1)
        .map((unit) => unit.id),
      'AUDIT_TAG_OWNER',
    );
    assertAudit(
      catalog.learningUnits.some((unit) => unit.ownedTagIds?.includes(tag.id)),
      `AUDIT_TAG_UNOWNED:${tag.id}`,
    );
  }
  const ordered = TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]);
  const order = new Map<string, number>(ordered.map((id, i) => [id, i]));
  let laterPrerequisites = 0;
  for (const unit of catalog.learningUnits) {
    const ui = projection.ui.learningUnits.find((item) => item.id === unit.id);
    const descendants = new Set([unit.id]);
    for (let changed = true; changed;) {
      changed = false;
      for (const child of catalog.learningUnits)
        if (child.parentId && descendants.has(child.parentId) && !descendants.has(child.id)) {
          descendants.add(child.id);
          changed = true;
        }
    }
    const homeByProblem = new Map(
      projection.mapping.map((item) => [item.problemId, item.homeUnitId]),
    );
    equalSet(
      unit.problemIds,
      [...homeByProblem].filter(([, home]) => descendants.has(home)).map(([id]) => id),
      `AUDIT_DESCENDANT_COVERAGE:${unit.id}`,
    );
    const descendantOutcomes = new Set(
      catalog.learningUnits
        .filter((item) => descendants.has(item.id))
        .flatMap((item) => item.ownedLearningOutcomeIds ?? []),
    );
    const related = policy.placements
      .filter((placement) => {
        const home = homeByProblem.get(placement.problemId);
        return (
          !descendants.has(home ?? '') &&
          [
            placement.primaryOutcomeId,
            ...placement.additionalPrimaryOutcomeIds,
            ...placement.supportingOutcomeIds,
          ].some((id) => descendantOutcomes.has(id))
        );
      })
      .map((placement) => placement.problemId);
    equalSet(unit.relatedProblemIds ?? [], related, `AUDIT_RELATED_COVERAGE:${unit.id}`);
    assertAudit(
      canonicalJson(ui?.problemIds) === canonicalJson(unit.directProblemIds ?? []),
      `AUDIT_READING_ORDER:${unit.id}`,
    );
    const $ = load(await readFile(`dist${learningUnitRoute(unit.docPath)}index.html`, 'utf8'));
    const main = $('main');
    const target = unitLearningTarget(unit.id);
    assertAudit(
      main.text().includes(target.color) && main.text().includes(target.reason),
      `AUDIT_TARGET_COLOR:${unit.id}`,
    );
    if (unit.parentId) {
      const parent = catalog.learningUnits.find((item) => item.id === unit.parentId);
      assertAudit(
        parent && main.find(`a[href$="${learningUnitRoute(parent.docPath)}"]`).length,
        `AUDIT_CONCEPT_PARENT:${unit.id}`,
      );
    }
    for (const edge of prerequisites.learningUnitPrerequisites.filter(
      (item) => item.nodeId === unit.id,
    ))
      if ((order.get(edge.prerequisiteId) ?? -1) > (order.get(unit.id) ?? -1)) {
        laterPrerequisites++;
        const prerequisite = catalog.learningUnits.find((item) => item.id === edge.prerequisiteId);
        const anchor =
          prerequisite &&
          main
            .find(`a[href$="${learningUnitRoute(prerequisite.docPath)}"]`)
            .filter((_i, element) => {
              const sibling = element.nextSibling;
              return sibling !== null && 'data' in sibling && /後の(?:節|章)/u.test(sibling.data);
            });
        assertAudit(anchor?.length, `AUDIT_LATER_PREREQUISITE:${unit.id}:${edge.prerequisiteId}`);
      }
  }
  return {
    tags: catalog.tags.length,
    outcomes: catalog.learningOutcomes.length,
    units: ordered.length,
    tagEdges: prerequisites.tagPrerequisites.length,
    outcomeEdges: prerequisites.learningOutcomePrerequisites.length,
    unitEdges: prerequisites.learningUnitPrerequisites.length,
    laterPrerequisites,
    acceptedReadingOrderDigest: canonicalDigest(
      catalog.learningUnits.map((unit) => ({ id: unit.id, problemIds: unit.directProblemIds })),
    ),
    editorialOrderDigest: canonicalDigest(ordered),
    mappingDigest: projection.mappingDigest,
    correctionImpacts: projection.corrections,
    retiredOptionalTargets: projection.retiredTargets,
  };
};

export const auditSources = (projection: FullProjection) => {
  const sources = new Map(projection.catalog.sources.map((source) => [source.id, source]));
  let claims = 0;
  for (const [id, document] of projection.problemDocuments) {
    const problem = projection.catalog.problems.find((item) => item.id === id);
    for (const claim of document.unit.claims) {
      claims++;
      assertAudit(
        claim.verificationStatus === 'verified' && claim.sourceRevisionIds.length,
        `AUDIT_CLAIM_UNVERIFIED:${id}`,
      );
      for (const sourceId of claim.sourceRevisionIds) {
        const source = sources.get(sourceId);
        assertAudit(
          source &&
            ['official_problem', 'official_editorial'].includes(source.sourceKind) &&
            source.officialTaskId === problem?.officialTaskId &&
            source.contestId === problem.contestId &&
            document.unit.sourceRevisionIds.includes(sourceId) &&
            document.text.includes(source.url),
          `AUDIT_CLAIM_SOURCE:${id}:${sourceId}`,
        );
      }
    }
  }
  const documents = [...projection.problemDocuments.values(), ...projection.unitDocuments.values()];
  for (const document of documents) {
    assertAudit(!/<!doctype\s+html|<html(?:\s|>)/iu.test(document.text), 'AUDIT_RAW_SOURCE_COPY');
    // The accepted writing policy uses independent prose with source links. A new quote
    // needs its own source-specific length/reuse review instead of an invented allowance.
    assertAudit(!/^\s*>/mu.test(document.text), 'AUDIT_QUOTATION_REVIEW_REQUIRED');
  }
  return {
    sourceCount: sources.size,
    claimCount: claims,
    sourceInventoryDigest: canonicalDigest(projection.catalog.sources),
    earliestConfirmation: projection.catalog.sources.map((source) => source.checkedAt).sort()[0],
    latestConfirmation: projection.catalog.sources
      .map((source) => source.checkedAt)
      .sort()
      .at(-1),
    allowedUsePolicy: '.agents/skills/abc-explanation-author/references/source-policy.md',
    quotationCount: 0,
    sourceReacquisition: false,
    basis:
      'Recorded official revision identities, confirmation/terms dates and claim-to-owner bindings are checked. This audit does not claim live re-fetch or a new mathematical proof.',
  };
};

export const auditOptionalBlocks = (projection: FullProjection) => {
  let executableCount = 0;
  let exerciseCount = 0;
  for (const owner of [...projection.catalog.learningUnits, ...projection.catalog.authoringUnits]) {
    executableCount += owner.examples.filter((example) => example.kind === 'executable').length;
    exerciseCount += owner.exercises.length;
  }
  for (const document of [
    ...projection.unitDocuments.values(),
    ...projection.problemDocuments.values(),
  ]) {
    const fences = [...document.text.matchAll(/^```([^\n]*)/gmu)].map(
      (match) => match[1]?.trim() ?? '',
    );
    assertAudit(
      fences.every((language) => ['', 'text'].includes(language)),
      'AUDIT_EXECUTION_REQUIRED',
    );
    assertAudit(
      !/^## (?:演習|解答|確認問題|評価課題)$/mu.test(document.text),
      'AUDIT_ANSWER_VERIFICATION_REQUIRED',
    );
  }
  assertAudit(executableCount === 0, 'AUDIT_EXECUTION_REQUIRED');
  assertAudit(exerciseCount === 0, 'AUDIT_ANSWER_VERIFICATION_REQUIRED');
  return {
    owners: projection.unitDocuments.size + projection.problemDocuments.size,
    executableCount,
    exerciseCount,
    fixedOutcomeBlocksRequired: false,
    basis:
      'All current owner inventories and prose fences inspected. Text fences are pseudocode; optional runnable/answer additions block until executed and verified.',
  };
};
