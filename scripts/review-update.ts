import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { canonicalDigest } from '../src/lib/domain/canonical-json.js';
import { HumanContentReviewEvidenceSchema } from '../src/lib/domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../src/lib/domain/schema-parts/release.js';
import {
  componentEvidenceDigest,
  componentSubjectDigest,
  type ComponentEvidence,
} from '../src/lib/preview/preview-snapshot.js';
import { validateContentWorkManifest } from '../src/lib/validation/content-work-manifest.js';
import {
  validateHumanContentReview,
  type TrustedReviewCheckInventory,
} from '../src/lib/validation/human-content-review.js';

const workManifestPath = 'docs/work-manifests/initial/us5/manifest.json';
const componentPath = 'docs/verification/previews/initial-v1/components/update-simulation.json';
const verificationPath = 'staging/previews/initial-v1/release-simulation/verification.json';

interface WorkManifest {
  readonly digest: string;
  readonly learningOutcomeIds: readonly string[];
  readonly reviewPolicy: {
    readonly requiredMode: 'self' | 'third_party';
    readonly riskReasons: readonly string[];
  };
  readonly reviewUnits: readonly {
    readonly reviewUnitId: string;
    readonly paths: readonly string[];
    readonly learningOutcomeIds: readonly string[];
    readonly checkIds: readonly string[];
    readonly owner: string;
  }[];
}

const reviewItemId = (reviewUnitId: string): string =>
  `human-review-item-${reviewUnitId.toLowerCase()}`;

const trustedReviewInventory = (input: {
  readonly manifest: WorkManifest;
  readonly subjectDigest: string;
  readonly updatePath: string;
}): TrustedReviewCheckInventory => {
  const command = `node --import tsx scripts/verify-release.ts --manifest ${input.updatePath} --simulation-only`;
  return {
    subjectDigest: input.subjectDigest,
    inventoryDigest: input.manifest.digest,
    reviewPolicy: input.manifest.reviewPolicy,
    workManifest: {
      learningOutcomeIds: input.manifest.learningOutcomeIds,
      reviewUnits: input.manifest.reviewUnits.map((unit) => ({
        reviewUnitId: unit.reviewUnitId,
        subjectPaths: unit.paths,
        learningOutcomeIds: unit.learningOutcomeIds,
        owner: unit.owner,
      })),
    },
    applicableChecks: [...new Set(input.manifest.reviewUnits.flatMap((unit) => unit.checkIds))].map(
      (checkId) => ({ checkId, command }),
    ),
    reviewItems: input.manifest.reviewUnits.map((unit) => ({
      reviewItemId: reviewItemId(unit.reviewUnitId),
      reviewUnitId: unit.reviewUnitId,
      kind: 'outcome_coverage' as const,
      subjectPaths: unit.paths,
      authorIds: [unit.owner],
      learningOutcomeIds: unit.learningOutcomeIds,
    })),
  };
};

export const createPreviewUpdateReview = (input: {
  readonly subjectDigest: string;
  readonly authoringSkillVersion: string;
  readonly authoringSkillDigest: string;
  readonly checkIds: readonly string[];
  readonly resultDigest: string;
  readonly resultCommand: string;
  readonly riskReasons?: readonly string[];
  readonly workManifest: WorkManifest;
  readonly updatePath: string;
}) => {
  const reviewMode =
    input.riskReasons && input.riskReasons.length > 0
      ? ('third_party' as const)
      : ('self' as const);
  const reviewerId = reviewMode === 'self' ? 'person-maintainer' : 'person-independent-reviewer';
  const completedAt = '2026-07-28T15:00:00+09:00';
  const resultPath = 'staging/previews/initial-v1/release-simulation/verification.json';
  const applicableChecks = input.checkIds.map((checkId) => ({
    checkId,
    command: input.resultCommand,
    subjectDigest: input.subjectDigest,
    resultPath,
    resultDigest: input.resultDigest,
    exitCode: 0,
    passed: true,
    completedAt,
    executedByReviewerId: reviewerId,
  }));
  const reviewItems = input.workManifest.reviewUnits.map((unit) => ({
    reviewItemId: reviewItemId(unit.reviewUnitId),
    kind: 'outcome_coverage' as const,
    subjectPaths: unit.paths,
    authorIds: [unit.owner],
    learningOutcomeIds: unit.learningOutcomeIds,
    reviewerId,
    reviewBasis: `The current fixture subject was checked with abc-explanation-author ${input.authoringSkillVersion} (${input.authoringSkillDigest}).`,
    decision: 'approved' as const,
    findings: [],
    reviewedAt: completedAt,
  }));
  const evidence = {
    schemaVersion: '3.0.0' as const,
    id: 'human-content-review-initial-v1-us5-update-simulation',
    scopeType: 'merge' as const,
    scopeId: 'initial-v1-us5-update-simulation',
    releaseVersion: null,
    subjectDigest: input.subjectDigest,
    inventoryPath: workManifestPath,
    inventoryDigest: input.workManifest.digest,
    reviewPolicy: { requiredMode: reviewMode, riskReasons: input.riskReasons ?? [] },
    reviewMode,
    applicableChecks,
    applicableCheckCount: applicableChecks.length,
    passedApplicableCheckCount: applicableChecks.length,
    reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
    authors: [
      {
        personId: 'person-maintainer',
        authoredItemIds: reviewItems.map(({ reviewItemId }) => reviewItemId),
      },
    ],
    reviewer: { personId: reviewerId, mode: reviewMode },
    reviewItems,
    inventoryItemCount: reviewItems.length,
    reviewedItemCount: reviewItems.length,
    approvedItemCount: reviewItems.length,
    changesRequestedItemCount: 0,
    unreviewedItemCount: 0,
    outcomeCoverageReview: {
      reviewerId,
      authorIds: ['person-maintainer'],
      decision: 'confirmed' as const,
      learningOutcomeIds: input.workManifest.learningOutcomeIds,
      subjectPaths: input.workManifest.reviewUnits.flatMap((unit) => unit.paths),
      rationale:
        'The frozen US5 review units cover discovery, authoring classification, and resumable validation.',
      noOutcomeImpactRationale: null,
      confirmedAt: completedAt,
    },
    outcomeCoverageConfirmed: true,
    aggregatePassed: true,
    generatedAt: completedAt,
  };
  return HumanContentReviewEvidenceSchema.parse({
    ...evidence,
    evidenceDigest: canonicalDigest(evidence),
  });
};

export const validatePreviewUpdateReview = async (input: {
  readonly updateId: string;
  readonly evidencePath: string;
  readonly repositoryRoot?: string;
}): Promise<ReturnType<typeof HumanContentReviewEvidenceSchema.parse>> => {
  const root = input.repositoryRoot ?? process.cwd();
  const readJson = async (relativePath: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(root, relativePath), 'utf8')) as unknown;
  const updatePath = `staging/previews/initial-v1/release-simulation/${input.updateId}/manifest.json`;
  const update = PublicationUpdateSchema.parse(await readJson(updatePath));
  if (update.updateId !== input.updateId) throw new Error('REVIEW_UPDATE_ID_MISMATCH');
  const evidence = HumanContentReviewEvidenceSchema.parse(await readJson(input.evidencePath));
  const manifest = (await readJson(workManifestPath)) as WorkManifest;
  validateContentWorkManifest(manifest);
  if (evidence.inventoryPath !== workManifestPath || evidence.inventoryDigest !== manifest.digest) {
    throw new Error('REVIEW_INVENTORY_DIGEST_MISMATCH');
  }
  const verification = (await readJson(verificationPath)) as {
    readonly updateId?: unknown;
    readonly publicationUpdateDigest?: unknown;
    readonly applicableCheckIds?: readonly string[];
  };
  const component = (await readJson(componentPath)) as ComponentEvidence;
  const previewManifest = (await readJson('staging/previews/initial-v1/preview-manifest.json')) as {
    readonly manifestDigest: string;
    readonly candidatePoolDigest: string;
    readonly selectedProblemIds: readonly string[];
    readonly sourceRevisionIds: readonly string[];
  };
  const candidatePool = (await readJson('staging/previews/initial-v1/candidate-pool.json')) as {
    readonly candidatePoolDigest: string;
  };
  const taxonomy = (await readJson('staging/previews/initial-v1/taxonomy/index.json')) as {
    readonly taxonomyDigest: string;
  };
  const skillManifest = (await readJson(
    'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
  )) as {
    readonly authoringSkillVersion: string;
    readonly authoringSkillDigest: string;
  };
  if (
    verification.updateId !== update.updateId ||
    verification.publicationUpdateDigest !== canonicalDigest(update)
  ) {
    throw new Error('REVIEW_UPDATE_SUBJECT_MISMATCH');
  }
  const { componentDigest, ...componentSubject } = component;
  const {
    subjectDigest,
    checkResults: _checkResults,
    reviewEvidence: _reviewEvidence,
    ...currentSubject
  } = componentSubject;
  void _checkResults;
  void _reviewEvidence;
  const componentMatchesCurrentArtifacts =
    component.manifestDigest === previewManifest.manifestDigest &&
    component.candidatePoolDigest === previewManifest.candidatePoolDigest &&
    component.candidatePoolDigest === candidatePool.candidatePoolDigest &&
    canonicalDigest([...component.problemIds].sort()) ===
      canonicalDigest([...previewManifest.selectedProblemIds].sort()) &&
    canonicalDigest([...component.sourceRevisionIds].sort()) ===
      canonicalDigest([...previewManifest.sourceRevisionIds].sort()) &&
    component.provisionalTaxonomyDigest === taxonomy.taxonomyDigest &&
    component.authoringSkillVersion === skillManifest.authoringSkillVersion &&
    component.authoringSkillDigest === skillManifest.authoringSkillDigest;
  if (
    component.artifactDigest !== canonicalDigest(verification) ||
    subjectDigest !== evidence.subjectDigest ||
    componentSubjectDigest(currentSubject) !== subjectDigest ||
    componentEvidenceDigest(componentSubject) !== componentDigest ||
    canonicalDigest([...component.problemIds].sort()) !==
      canonicalDigest([...update.targetProblemIds].sort()) ||
    !componentMatchesCurrentArtifacts
  ) {
    throw new Error('REVIEW_COMPONENT_SUBJECT_DIGEST_MISMATCH');
  }
  const expectedDigest = canonicalDigest(
    Object.fromEntries(Object.entries(evidence).filter(([key]) => key !== 'evidenceDigest')),
  );
  if (expectedDigest !== evidence.evidenceDigest)
    throw new Error('REVIEW_EVIDENCE_DIGEST_MISMATCH');
  const trustedInventory = trustedReviewInventory({
    manifest,
    subjectDigest: component.subjectDigest,
    updatePath,
  });
  validateHumanContentReview(evidence, trustedInventory);
  for (const check of evidence.applicableChecks) {
    if (check.resultPath !== verificationPath) {
      throw new Error(`REVIEW_CHECK_RESULT_PATH_MISMATCH:${check.checkId}`);
    }
    if (check.resultDigest !== canonicalDigest(verification)) {
      throw new Error(`REVIEW_CHECK_RESULT_DIGEST_MISMATCH:${check.checkId}`);
    }
    if (!verification.applicableCheckIds?.includes(check.checkId)) {
      throw new Error(`REVIEW_CHECK_RESULT_SCOPE_MISMATCH:${check.checkId}`);
    }
  }
  return evidence;
};

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const updateId = argument('--update');
  const evidencePath = argument('--evidence');
  if (!updateId || !evidencePath) {
    process.stderr.write('Usage: npm run abc:review -- --update UPDATE_ID --evidence PATH\n');
    process.stdout.write(`${JSON.stringify({ command: 'abc:review', exitCode: 64 })}\n`);
    process.exitCode = 64;
  } else {
    const evidence = await validatePreviewUpdateReview({ updateId, evidencePath });
    process.stdout.write(
      `${JSON.stringify({ command: 'abc:review', evidenceId: evidence.id, reviewMode: evidence.reviewMode, aggregatePassed: evidence.aggregatePassed })}\n`,
    );
    process.exitCode = evidence.aggregatePassed ? 0 : 2;
  }
}
