import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  componentEvidenceDigest,
  joinPreviewComponents,
  previewSnapshotJoinDigest,
  requiredPreviewComponentIds,
  type ComponentEvidence,
} from '../../src/lib/preview/preview-snapshot.js';
import { PreviewSnapshotCommitService } from '../../src/lib/preview/preview-snapshot-repository.js';
import { InMemoryPreviewSnapshotRepository } from '../fixtures/in-memory-preview-snapshot-repository.js';

const componentFixture = (componentId: string): ComponentEvidence => {
  const subject = {
    componentId,
    previewId: 'initial-v1',
    manifestDigest: 'a'.repeat(64),
    problemIds: ['abc212-e', 'abc213-f'],
    subjectDigest: 'b'.repeat(64),
    artifactDigest: canonicalDigest({ componentId, artifact: 'fixture' }),
    checksPassed: true,
    review: { subjectDigest: 'b'.repeat(64), aggregatePassed: true },
  };
  return { ...subject, componentDigest: componentEvidenceDigest(subject) };
};

const completeComponents = (): ComponentEvidence[] =>
  requiredPreviewComponentIds.map((componentId) => componentFixture(componentId));

describe('US2 vertical preview contract', () => {
  it('joins only components for the same cohort and current subject', () => {
    const snapshot = joinPreviewComponents(completeComponents());
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
            subjectDigest: 'c'.repeat(64),
            checksPassed: false,
            review: { subjectDigest: 'b'.repeat(64), aggregatePassed: true },
          }
        : component,
    );
    const snapshot = joinPreviewComponents(components);
    expect(snapshot.status).toBe('on_hold');
    expect(snapshot.holdReasons).toEqual(
      expect.arrayContaining([
        'STALE_SUBJECT:content-graph-search',
        'COMPONENT_DIGEST_STALE:content-graph-search',
        'CHECK_FAILED:content-graph-search',
        'CURRENT_REVIEW_MISSING:content-graph-search',
      ]),
    );
  });

  it('keeps a join on hold when a required component is missing or duplicated', () => {
    const missing = completeComponents().slice(1);
    expect(joinPreviewComponents(missing).holdReasons).toContain('COMPONENT_SET_INCOMPLETE');

    const duplicated = completeComponents();
    const first = duplicated[0];
    if (!first) throw new Error('Preview component fixture is missing.');
    duplicated.push(first);
    expect(joinPreviewComponents(duplicated).holdReasons).toContain('COMPONENT_SET_INCOMPLETE');
  });

  it('never overwrites a canonical snapshot with the same join digest', async () => {
    const repository = new InMemoryPreviewSnapshotRepository();
    const service = new PreviewSnapshotCommitService(repository);
    const snapshot = joinPreviewComponents(completeComponents());
    await service.commit(snapshot);

    await expect(service.commit(snapshot)).rejects.toThrow('SNAPSHOT_ALREADY_EXISTS');
    expect(await repository.getSnapshot(snapshot.previewId, snapshot.joinDigest)).toEqual(snapshot);
  });

  it.each([
    ['status', { status: 'on_hold' as const }],
    ['hold reasons', { holdReasons: ['TAMPERED'] }],
    ['component digests', { componentDigests: ['tampered-component-digest'] }],
  ])('rejects a %s mutation that retains an old join digest', async (_, mutation) => {
    const snapshot = joinPreviewComponents(completeComponents());
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
    const snapshot = joinPreviewComponents(completeComponents());
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
    const snapshot = joinPreviewComponents(completeComponents());
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
    const snapshot = joinPreviewComponents(completeComponents());
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
