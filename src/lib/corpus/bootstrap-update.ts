import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest } from '../domain/canonical-json.js';
import { PublicationUpdateSchema } from '../domain/schema-parts/release.js';
import {
  CanonicalProblemPlacementPolicySchema,
  LearningUnitSchema,
} from '../domain/schema-parts/catalog.js';
import { shardFileDigest } from '../authoring/problem-shard-context.js';

export const BOOTSTRAP_UPDATE_ID = 'update-bootstrap-full-corpus';
export const BOOTSTRAP_MANIFEST_PATH = `staging/updates/initial-catch-up/${BOOTSTRAP_UPDATE_ID}/manifest.json`;

/** Packages the already accepted seed; never reauthors or changes seed content. */
export const prepareBootstrapUpdate = async (root = process.cwd()) => {
  const json = async (file: string) =>
    JSON.parse(await readFile(path.join(root, file), 'utf8')) as unknown;
  const accepted = (await json('docs/verification/bootstrap/problem-authoring-units.json')) as {
    status: string;
    subjectDigest: string;
    documents: { problemId: string; path: string; digest: string }[];
  };
  const units = (await json('docs/verification/bootstrap/learning-unit-content.json')) as {
    units: { learningUnitId: string; documentPath: string; documentDigest: string }[];
  };
  if (accepted.status !== 'passed' || !accepted.documents.length || !units.units.length)
    throw new Error('BOOTSTRAP_NOT_ACCEPTED');
  const policyPath = 'src/content/policies/problem-placements.json';
  const policy = CanonicalProblemPlacementPolicySchema.parse(await json(policyPath));
  const targetProblemIds = accepted.documents.map((document) => document.problemId).sort();
  const files = [];
  for (const document of accepted.documents) {
    const text = await readFile(path.join(root, document.path), 'utf8');
    if (shardFileDigest(text) !== document.digest)
      throw new Error(`BOOTSTRAP_DOCUMENT_DRIFT:${document.problemId}`);
    files.push({
      entityType: 'authoring_unit' as const,
      entityId: document.problemId,
      path: document.path,
      digest: document.digest,
      affectedProblemIds: [document.problemId],
    });
  }
  for (const document of units.units) {
    const text = await readFile(path.join(root, document.documentPath), 'utf8');
    const unit = LearningUnitSchema.parse(
      await json(`src/content/learning-units/${document.learningUnitId}.json`),
    );
    if (
      shardFileDigest(text.replace('\ndraft: false\n', '\ndraft: true\n')) !==
      document.documentDigest
    )
      throw new Error(`BOOTSTRAP_UNIT_DRIFT:${unit.id}`);
    files.push({
      entityType: 'learning_unit' as const,
      entityId: unit.id,
      path: document.documentPath,
      digest: shardFileDigest(text),
      affectedProblemIds: unit.problemIds,
    });
  }
  files.push({
    entityType: 'placement' as const,
    entityId: 'placement-bootstrap-full-corpus',
    path: policyPath,
    digest: shardFileDigest(await readFile(path.join(root, policyPath), 'utf8')),
    affectedProblemIds: targetProblemIds,
  });
  const operations = files
    .sort((a, b) => a.path.localeCompare(b.path, 'en'))
    .map((file) => ({
      operationId: `operation-${canonicalDigest(file).slice(0, 24)}`,
      entityType: file.entityType,
      entityId: file.entityId,
      action: 'add' as const,
      path: file.path,
      beforeDigest: null,
      afterDigest: file.digest,
      affectedProblemIds: file.affectedProblemIds,
      affectedEntities: [
        { entityType: file.entityType, entityId: file.entityId, action: 'add' as const },
      ],
    }));
  const validation = {
    checkIds: ['check-accepted-bootstrap-documents', 'check-accepted-bootstrap-placement'],
    problemResults: targetProblemIds.map((problemId) => ({
      problemId,
      passed: true,
      findingCodes: [],
      remediation: null,
    })),
    blockingFindingCount: 0,
    aggregatePassed: true,
  };
  const label = (id: string) =>
    id
      .slice(id.lastIndexOf('-') + 1)
      .replace(/^ex$/u, 'Ex')
      .toUpperCase()
      .replace(/^EX$/u, 'Ex');
  return PublicationUpdateSchema.parse({
    schemaVersion: '2.0.0',
    updateId: BOOTSTRAP_UPDATE_ID,
    kind: 'bootstrap',
    baseReleaseVersion: null,
    contestId: null,
    sourceSetFingerprint: accepted.subjectDigest,
    advancedSlotLabels: [...new Set(targetProblemIds.map(label))],
    targetProblemIds,
    operations,
    authoringResults: accepted.documents.map((document) => ({
      problemId: document.problemId,
      slotLabel: label(document.problemId),
      resultType: 'authoring_unit_draft',
      draftPath: document.path,
      packetPath: null,
      templatePath: null,
      reasonCode: null,
      reason: null,
      retryCondition: null,
    })),
    correctionImpactIds: [],
    validationSummary: { ...validation, resultDigest: canonicalDigest(validation) },
    state: 'ELIGIBLE_FOR_BATCH',
    createdAt: policy.sourceBuild.acceptedAt,
    updatedAt: policy.sourceBuild.acceptedAt,
    fixtureMode: false,
  });
};
