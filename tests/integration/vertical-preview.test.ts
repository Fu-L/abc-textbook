import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  componentEvidenceDigest,
  joinPreviewComponents,
  previewSnapshotJoinDigest,
  requiredPreviewComponentIds,
  type ComponentEvidence,
  type PreviewJoinRequirements,
} from '../../src/lib/preview/preview-snapshot.js';
import { PreviewSnapshotCommitService } from '../../src/lib/preview/preview-snapshot-repository.js';
import { InMemoryPreviewSnapshotRepository } from '../fixtures/in-memory-preview-snapshot-repository.js';

const componentFixture = (componentId: string): ComponentEvidence => {
  const checkResultId = `check:${componentId}`;
  const reviewEvidenceId = `review:${componentId}`;
  const subject = {
    componentId,
    previewId: 'initial-v1',
    manifestDigest: 'a'.repeat(64),
    candidatePoolDigest: 'b'.repeat(64),
    problemIds: ['abc212-e', 'abc213-f'],
    sourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
    provisionalTaxonomyDigest: 'c'.repeat(64),
    authoringSkillVersion: '1.0.0',
    authoringSkillDigest: 'd'.repeat(64),
    subjectDigest: 'e'.repeat(64),
    artifactDigest: canonicalDigest({ componentId, artifact: 'fixture' }),
    checkResults: [{ checkResultId, subjectDigest: 'e'.repeat(64), passed: true }],
    reviewEvidence: [
      {
        reviewEvidenceId,
        subjectDigest: 'e'.repeat(64),
        requiredMode: 'self' as const,
        reviewMode: 'self' as const,
        aggregatePassed: true,
      },
    ],
  };
  return { ...subject, componentDigest: componentEvidenceDigest(subject) };
};

const completeComponents = (): ComponentEvidence[] =>
  requiredPreviewComponentIds.map((componentId) => componentFixture(componentId));

const joinRequirements = (): PreviewJoinRequirements => ({
  previewId: 'initial-v1',
  manifestDigest: 'a'.repeat(64),
  candidatePoolDigest: 'b'.repeat(64),
  problemIds: ['abc212-e', 'abc213-f'],
  sourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
  provisionalTaxonomyDigest: 'c'.repeat(64),
  authoringSkillVersion: '1.0.0',
  authoringSkillDigest: 'd'.repeat(64),
  subjectDigest: 'e'.repeat(64),
  requiredCheckResultIds: requiredPreviewComponentIds.map((componentId) => `check:${componentId}`),
  requiredReviewEvidenceIds: requiredPreviewComponentIds.map(
    (componentId) => `review:${componentId}`,
  ),
});

describe('US2 vertical preview contract', () => {
  it('joins only components for the same cohort and current subject', () => {
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    expect(snapshot.status).toBe('passed');
    expect(snapshot.holdReasons).toEqual([]);
    expect(snapshot.joinDigest).toBe(previewSnapshotJoinDigest(snapshot));
  });

  it('records explicit holds for stale artifacts, failed checks, and stale review evidence', () => {
    const stale = componentFixture('content-graph-search');
    const components = completeComponents().map((component) =>
      component.componentId === stale.componentId
        ? {
            ...stale,
            subjectDigest: 'f'.repeat(64),
            checkResults: stale.checkResults.map((result) => ({ ...result, passed: false })),
            reviewEvidence: stale.reviewEvidence.map((evidence) => ({
              ...evidence,
              subjectDigest: 'f'.repeat(64),
              reviewMode: 'third_party' as const,
            })),
          }
        : component,
    );
    const snapshot = joinPreviewComponents(components, joinRequirements());
    expect(snapshot.status).toBe('on_hold');
    expect(snapshot.holdReasons).toEqual(
      expect.arrayContaining([
        'STALE_SUBJECT:content-graph-search',
        'COMPONENT_DIGEST_STALE:content-graph-search',
        'CHECK_FAILED:check:content-graph-search',
        'REVIEW_POLICY_MISMATCH:review:content-graph-search',
        'CURRENT_REVIEW_MISSING:review:content-graph-search',
      ]),
    );
  });

  it.each([
    [
      'candidate pool',
      { candidatePoolDigest: 'f'.repeat(64) },
      'CANDIDATE_POOL_MISMATCH:content-graph-search',
    ],
    [
      'source revisions',
      { sourceRevisionIds: ['source-abc212-e'] },
      'SOURCE_REVISIONS_MISMATCH:content-graph-search',
    ],
    [
      'provisional taxonomy',
      { provisionalTaxonomyDigest: 'f'.repeat(64) },
      'PROVISIONAL_TAXONOMY_MISMATCH:content-graph-search',
    ],
    [
      'authoring skill',
      { authoringSkillVersion: '2.0.0' },
      'AUTHORING_SKILL_MISMATCH:content-graph-search',
    ],
  ])('holds a component with stale %s evidence', (_, mutation, reason) => {
    const components = completeComponents().map((component) =>
      component.componentId === 'content-graph-search' ? { ...component, ...mutation } : component,
    );
    expect(joinPreviewComponents(components, joinRequirements()).holdReasons).toContain(reason);
  });

  it('requires every frozen check and current-subject review evidence ID', () => {
    const requirements = joinRequirements();
    expect(
      joinPreviewComponents(completeComponents(), {
        ...requirements,
        requiredCheckResultIds: [...requirements.requiredCheckResultIds, 'check:missing'],
        requiredReviewEvidenceIds: [...requirements.requiredReviewEvidenceIds, 'review:missing'],
      }).holdReasons,
    ).toEqual(
      expect.arrayContaining(['CHECK_RESULT_SET_INCOMPLETE', 'REVIEW_EVIDENCE_SET_INCOMPLETE']),
    );
  });

  it('keeps a join on hold when a required component is missing or duplicated', () => {
    const missing = completeComponents().slice(1);
    expect(joinPreviewComponents(missing, joinRequirements()).holdReasons).toContain(
      'COMPONENT_SET_INCOMPLETE',
    );

    const duplicated = completeComponents();
    const first = duplicated[0];
    if (!first) throw new Error('Preview component fixture is missing.');
    duplicated.push(first);
    expect(joinPreviewComponents(duplicated, joinRequirements()).holdReasons).toContain(
      'COMPONENT_SET_INCOMPLETE',
    );
  });

  it('never overwrites a canonical snapshot with the same join digest', async () => {
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    await service.commit(snapshot);

    await expect(service.commit(snapshot)).rejects.toThrow('SNAPSHOT_ALREADY_EXISTS');
    expect(await repository.getSnapshot(snapshot.previewId, snapshot.joinDigest)).toEqual(snapshot);
  });

  it.each([
    ['status', { status: 'on_hold' as const }],
    ['hold reasons', { holdReasons: ['TAMPERED'] }],
    ['component digests', { componentDigests: ['tampered-component-digest'] }],
  ])('rejects a %s mutation that retains an old join digest', async (_, mutation) => {
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    const tamperedSnapshot = { ...snapshot, ...mutation };
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);

    await expect(service.commit(tamperedSnapshot)).rejects.toThrow(
      'CANONICAL_SNAPSHOT_DIGEST_MISMATCH',
    );
    expect(await repository.getSnapshot(snapshot.previewId, snapshot.joinDigest)).toBeUndefined();
    expect(await repository.getReference(snapshot.previewId, snapshot.joinDigest)).toBeUndefined();
  });

  it('does not recreate a reference from a tampered canonical snapshot during recovery', async () => {
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    await service.commit(snapshot);
    repository.replaceSnapshotForFailureInjection({
      ...snapshot,
      componentDigests: ['tampered-component-digest'],
    });
    await repository.deleteReference(snapshot.previewId, snapshot.joinDigest);

    await service.recover(snapshot.previewId, snapshot.joinDigest);

    expect((await repository.getTransaction(snapshot.previewId, snapshot.joinDigest))?.phase).toBe(
      'recovery_required',
    );
    expect(await repository.getReference(snapshot.previewId, snapshot.joinDigest)).toBeUndefined();
  });

  it('recovers a missing or stale derived reference from the canonical snapshot', async () => {
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    await service.commit(snapshot);
    await repository.deleteReference(snapshot.previewId, snapshot.joinDigest);
    await service.recover(snapshot.previewId, snapshot.joinDigest);

    expect(await repository.getReference(snapshot.previewId, snapshot.joinDigest)).toMatchObject({
      previewId: snapshot.previewId,
      joinDigest: snapshot.joinDigest,
      status: 'passed',
      canonicalSnapshotDigest: canonicalDigest(snapshot),
    });
    expect((await repository.getTransaction(snapshot.previewId, snapshot.joinDigest))?.phase).toBe(
      'verified',
    );
  });

  it('uses the transaction phase to recover an interruption between snapshot and reference', async () => {
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    const snapshot = joinPreviewComponents(completeComponents(), joinRequirements());
    await expect(service.commit(snapshot, { interruptAfterSnapshot: true })).rejects.toThrow(
      'INTERRUPTED_AFTER_SNAPSHOT',
    );
    expect((await repository.getTransaction(snapshot.previewId, snapshot.joinDigest))?.phase).toBe(
      'snapshot_committed',
    );
    expect(await repository.getReference(snapshot.previewId, snapshot.joinDigest)).toBeUndefined();

    await service.recover(snapshot.previewId, snapshot.joinDigest);
    expect((await repository.getTransaction(snapshot.previewId, snapshot.joinDigest))?.phase).toBe(
      'verified',
    );
    expect(await repository.getReference(snapshot.previewId, snapshot.joinDigest)).toBeDefined();
  });

  it('leaves recovery on hold when no canonical snapshot exists', async () => {
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    const transaction = await service.recover('initial-v1', 'd'.repeat(64));
    expect(transaction.phase).toBe('recovery_required');
    expect(transaction.recoveryReason).toBe('CANONICAL_SNAPSHOT_MISSING');
    expect(await repository.getReference('initial-v1', 'd'.repeat(64))).toBeUndefined();
  });
});
