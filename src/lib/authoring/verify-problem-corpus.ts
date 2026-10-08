import { canonicalDigest } from '../domain/canonical-json.js';
import type { ProblemAuthoringUnit } from '../domain/schema-parts/authoring-unit.js';
import { validatePublicationExamples } from './publication-examples.js';

export interface JoinedProblemDocument {
  readonly unit: ProblemAuthoringUnit;
  readonly path: string;
  readonly body: string;
}

/** Chapter outcomes are evidenced by their ordinary Unit prose and subtree Problems;
 * no fixed Outcome assessment block is required.
 */
export const buildProblemOutcomeCoverage = (input: {
  readonly outcomes: readonly { readonly id: string }[];
  readonly units: readonly {
    readonly id: string;
    readonly kind: string;
    readonly ownedLearningOutcomeIds?: readonly string[] | undefined;
    readonly problemIds: readonly string[];
  }[];
  readonly placements: readonly {
    readonly problemId: string;
    readonly primaryOutcomeId: string;
    readonly additionalPrimaryOutcomeIds: readonly string[];
    readonly supportingOutcomeIds: readonly string[];
  }[];
}) =>
  input.outcomes
    .map((outcome) => {
      const owners = input.units.filter((u) => u.ownedLearningOutcomeIds?.includes(outcome.id));
      const owner = owners[0];
      if (owners.length !== 1 || !owner)
        throw new Error(`PROBLEM_JOIN_OUTCOME_OWNER:${outcome.id}`);
      const select = (predicate: (p: (typeof input.placements)[number]) => boolean) =>
        input.placements
          .filter(predicate)
          .map((p) => p.problemId)
          .sort();
      const primaryProblemIds = select((p) => p.primaryOutcomeId === outcome.id);
      const additionalPrimaryProblemIds = select((p) =>
        p.additionalPrimaryOutcomeIds.includes(outcome.id),
      );
      const supportingProblemIds = select((p) => p.supportingOutcomeIds.includes(outcome.id));
      const explicit =
        primaryProblemIds.length + additionalPrimaryProblemIds.length + supportingProblemIds.length;
      if (!explicit && (owner.kind !== 'chapter' || !owner.problemIds.length))
        throw new Error(`PROBLEM_JOIN_OUTCOME_UNCOVERED:${outcome.id}`);
      return {
        outcomeId: outcome.id,
        ownerUnitId: owner.id,
        coverageMode: explicit ? 'problem_placement' : 'chapter_subtree',
        primaryProblemIds,
        additionalPrimaryProblemIds,
        supportingProblemIds,
        chapterProblemIds: owner.kind === 'chapter' ? [...owner.problemIds].sort() : [],
      };
    })
    .sort((a, b) => a.outcomeId.localeCompare(b.outcomeId, 'en'));

export const assertCurrentAgentQualityReview = (
  review: {
    readonly subjectDigest: string;
    readonly reviewMode: string;
    readonly status: string;
    readonly unresolvedFindingCount: number;
  },
  subjectDigest: string,
): void => {
  if (
    review.subjectDigest !== subjectDigest ||
    review.reviewMode !== 'agent_quality_review' ||
    review.status !== 'accepted' ||
    review.unresolvedFindingCount !== 0
  )
    throw new Error('PROBLEM_JOIN_QUALITY_REVIEW_STALE_OR_INCOMPLETE');
};

/** Local keys belong to this authoring document, never to a global Claim/Example entity. */
export const resolveProblemLocator = (unit: ProblemAuthoringUnit, locator: string): boolean => {
  const [collection, key, detail, ...rest] = locator.split('.');
  if (!key || rest.length) return false;
  if (collection === 'sections') return detail === undefined && Object.hasOwn(unit.sections, key);
  if (collection === 'claims' || collection === 'examples')
    return detail === undefined && unit[collection].some((block) => block.key === key);
  if (collection === 'exercises')
    return (
      (detail === undefined || detail === 'assessment' || detail === 'answer') &&
      unit.exercises.some((block) => block.key === key)
    );
  return false;
};

export const validateJoinedProblemDocuments = (input: {
  readonly expectedDocuments: readonly { readonly problemId: string; readonly path: string }[];
  readonly documents: readonly JoinedProblemDocument[];
  readonly discoveredPaths: readonly string[];
}): void => {
  const fail = (reason: string): never => {
    throw new Error(`PROBLEM_JOIN_${reason}`);
  };
  const same = (a: readonly string[], b: readonly string[]) =>
    canonicalDigest([...a].sort()) === canonicalDigest([...b].sort());
  const ids = input.documents.map((d) => d.unit.problemId);
  const paths = input.documents.map((d) => d.path);
  if (new Set(ids).size !== ids.length || new Set(paths).size !== paths.length) fail('DUPLICATE');
  if (
    !same(
      ids,
      input.expectedDocuments.map((d) => d.problemId),
    )
  )
    fail('PROBLEM_COVERAGE');
  if (
    !same(
      paths,
      input.expectedDocuments.map((d) => d.path),
    ) ||
    !same(paths, input.discoveredPaths)
  )
    fail('PATH_COVERAGE');
  const expected = new Map(input.expectedDocuments.map((d) => [d.problemId, d.path]));
  for (const { unit, path, body } of input.documents) {
    if (path !== unit.docPath || path !== expected.get(unit.problemId))
      fail(`OWNER:${unit.problemId}`);
    if (unit.claims.some((claim) => claim.verificationStatus !== 'verified'))
      fail(`CLAIM_HOLD:${unit.problemId}`);
    const correctness = unit.claims.find((claim) => claim.key === 'correctness');
    // Markdown escapes before coefficient-extraction brackets do not change the claim.
    const prose = (value: string) => value.replace(/\\\[/gu, '[');
    if (!correctness || prose(correctness.text) !== prose(String(unit.sections.correctness)))
      fail(`CLAIM_DRIFT:${unit.problemId}`);
    if (/^#{2,3} (?:具体例|確認問題|確認する観点|解答と理由)\s*$/mu.test(body))
      fail(`STANDALONE_SECTION:${unit.problemId}`);
    // A prose quotation needs explicit source/length review; the current corpus contains none.
    if (/^\s*>\s+/mu.test(body)) fail(`QUOTATION_REVIEW_REQUIRED:${unit.problemId}`);
    validatePublicationExamples(body, unit.examples, (reason) =>
      fail(`${reason}:${unit.problemId}`),
    );
    for (const claim of unit.claims)
      if (claim.sourceRevisionIds.some((id) => !unit.sourceRevisionIds.includes(id)))
        fail(`CLAIM_SOURCE:${unit.problemId}`);
    for (const exercise of unit.exercises)
      if (exercise.answer.verificationStatus !== 'passed') fail(`ANSWER_HOLD:${unit.problemId}`);
  }
};
