import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

type PreviewStatus = 'on_hold' | 'passed';
type TransactionPhase =
  'prepared' | 'snapshot_committed' | 'reference_committed' | 'verified' | 'recovery_required';

interface ComponentEvidence {
  readonly componentId: string;
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly subjectDigest: string;
  readonly artifactDigest: string;
  readonly componentDigest: string;
  readonly checksPassed: boolean;
  readonly review: {
    readonly subjectDigest: string;
    readonly aggregatePassed: boolean;
  };
}

const requiredComponentIds = [
  'metadata-inventory-taxonomy',
  'content-graph-search',
  'content-dynamic-programming',
  'content-data-structures',
  'content-mathematics',
  'learning-records',
  'ui-search',
  'update-simulation',
] as const;

const componentSubject = (component: Omit<ComponentEvidence, 'componentDigest'>) => component;

interface PreviewSnapshot {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly componentDigests: readonly string[];
  readonly joinDigest: string;
  readonly status: PreviewStatus;
  readonly holdReasons: readonly string[];
}

const snapshotDigestSubject = (snapshot: PreviewSnapshot) => ({
  previewId: snapshot.previewId,
  manifestDigest: snapshot.manifestDigest,
  problemIds: snapshot.problemIds,
  componentDigests: snapshot.componentDigests,
  status: snapshot.status,
  holdReasons: snapshot.holdReasons,
});

const snapshotJoinDigest = (snapshot: PreviewSnapshot): string =>
  canonicalDigest(snapshotDigestSubject(snapshot));

const assertSnapshotIntegrity = (snapshot: PreviewSnapshot, pathJoinDigest: string): void => {
  if (snapshot.joinDigest !== pathJoinDigest || snapshotJoinDigest(snapshot) !== pathJoinDigest) {
    throw new Error('CANONICAL_SNAPSHOT_DIGEST_MISMATCH');
  }
};

interface SnapshotReference {
  readonly joinDigest: string;
  readonly canonicalSnapshotPath: string;
  readonly canonicalSnapshotDigest: string;
  readonly status: PreviewStatus;
}

class PreviewCommitHarness {
  readonly snapshots = new Map<string, PreviewSnapshot>();
  readonly references = new Map<string, SnapshotReference>();
  readonly transactions = new Map<string, TransactionPhase>();

  commit(snapshot: PreviewSnapshot, interruptAfterSnapshot = false): void {
    assertSnapshotIntegrity(snapshot, snapshot.joinDigest);
    this.transactions.set(snapshot.joinDigest, 'prepared');
    if (this.snapshots.has(snapshot.joinDigest)) throw new Error('SNAPSHOT_ALREADY_EXISTS');
    this.snapshots.set(snapshot.joinDigest, structuredClone(snapshot));
    this.transactions.set(snapshot.joinDigest, 'snapshot_committed');
    if (interruptAfterSnapshot) throw new Error('INTERRUPTED_AFTER_SNAPSHOT');
    this.writeReference(snapshot.joinDigest);
    this.transactions.set(snapshot.joinDigest, 'verified');
  }

  recover(joinDigest: string): void {
    const snapshot = this.snapshots.get(joinDigest);
    if (!snapshot) {
      this.transactions.set(joinDigest, 'recovery_required');
      return;
    }
    try {
      assertSnapshotIntegrity(snapshot, joinDigest);
    } catch {
      this.references.delete(joinDigest);
      this.transactions.set(joinDigest, 'recovery_required');
      return;
    }
    const reference = this.references.get(joinDigest);
    const referenceIsCurrent =
      reference?.joinDigest === joinDigest &&
      reference.canonicalSnapshotDigest === canonicalDigest(snapshot) &&
      reference.status === snapshot.status;
    if (!referenceIsCurrent) {
      this.writeReference(joinDigest);
    }
    this.transactions.set(joinDigest, 'verified');
  }

  private writeReference(joinDigest: string): void {
    const snapshot = this.snapshots.get(joinDigest);
    if (!snapshot) throw new Error('CANONICAL_SNAPSHOT_MISSING');
    assertSnapshotIntegrity(snapshot, joinDigest);
    this.references.set(joinDigest, {
      joinDigest,
      canonicalSnapshotPath: `staging/previews/initial-v1/snapshots/${joinDigest}.json`,
      canonicalSnapshotDigest: canonicalDigest(snapshot),
      status: snapshot.status,
    });
    this.transactions.set(joinDigest, 'reference_committed');
  }
}

const joinPreview = (components: readonly ComponentEvidence[]): PreviewSnapshot => {
  const [first] = components;
  if (!first) throw new Error('Preview component evidence is empty.');
  const holdReasons: string[] = [];
  const componentIds = components.map(({ componentId }) => componentId);
  if (
    new Set(componentIds).size !== componentIds.length ||
    requiredComponentIds.some((componentId) => !componentIds.includes(componentId)) ||
    componentIds.some(
      (componentId) =>
        !requiredComponentIds.includes(componentId as (typeof requiredComponentIds)[number]),
    )
  ) {
    holdReasons.push('COMPONENT_SET_INCOMPLETE');
  }
  for (const component of components) {
    const { componentDigest, ...subject } = component;
    if (componentDigest !== canonicalDigest(componentSubject(subject))) {
      holdReasons.push(`COMPONENT_DIGEST_STALE:${component.componentId}`);
    }
    if (
      component.previewId !== first.previewId ||
      component.manifestDigest !== first.manifestDigest ||
      JSON.stringify(component.problemIds) !== JSON.stringify(first.problemIds)
    ) {
      holdReasons.push(`COHORT_MISMATCH:${component.componentId}`);
    }
    if (component.subjectDigest !== first.subjectDigest) {
      holdReasons.push(`STALE_SUBJECT:${component.componentId}`);
    }
    if (!component.checksPassed) holdReasons.push(`CHECK_FAILED:${component.componentId}`);
    if (
      !component.review.aggregatePassed ||
      component.review.subjectDigest !== component.subjectDigest
    ) {
      holdReasons.push(`CURRENT_REVIEW_MISSING:${component.componentId}`);
    }
  }
  const joinSubject = {
    previewId: first.previewId,
    manifestDigest: first.manifestDigest,
    problemIds: first.problemIds,
    componentDigests: components.map(({ componentDigest }) => componentDigest),
    holdReasons,
  };
  const status: PreviewStatus = holdReasons.length === 0 ? 'passed' : 'on_hold';
  const snapshotSubject = { ...joinSubject, status };
  return {
    ...snapshotSubject,
    joinDigest: canonicalDigest(snapshotSubject),
  };
};

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
  return { ...subject, componentDigest: canonicalDigest(componentSubject(subject)) };
};

const completeComponents = (): ComponentEvidence[] =>
  requiredComponentIds.map((componentId) => componentFixture(componentId));

describe('US2 vertical preview contract', () => {
  it('joins only components for the same cohort and current subject', () => {
    const snapshot = joinPreview(completeComponents());
    expect(snapshot.status).toBe('passed');
    expect(snapshot.holdReasons).toEqual([]);
    expect(snapshot.joinDigest).toBe(snapshotJoinDigest(snapshot));
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
    const snapshot = joinPreview(components);
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
    expect(joinPreview(missing).holdReasons).toContain('COMPONENT_SET_INCOMPLETE');

    const duplicated = completeComponents();
    const first = duplicated[0];
    if (!first) throw new Error('Preview component fixture is missing.');
    duplicated.push(first);
    expect(joinPreview(duplicated).holdReasons).toContain('COMPONENT_SET_INCOMPLETE');
  });

  it('never overwrites a canonical snapshot with the same join digest', () => {
    const harness = new PreviewCommitHarness();
    const snapshot = joinPreview(completeComponents());
    harness.commit(snapshot);

    expect(() => {
      harness.commit(snapshot);
    }).toThrow('SNAPSHOT_ALREADY_EXISTS');
    expect(harness.snapshots.get(snapshot.joinDigest)).toEqual(snapshot);
  });

  it.each([
    ['status', { status: 'on_hold' as const }],
    ['hold reasons', { holdReasons: ['TAMPERED'] }],
    ['component digests', { componentDigests: ['tampered-component-digest'] }],
  ])('rejects a %s mutation that retains an old join digest', (_, mutation) => {
    const snapshot = joinPreview(completeComponents());
    const tamperedSnapshot = { ...snapshot, ...mutation };
    const harness = new PreviewCommitHarness();

    expect(() => {
      harness.commit(tamperedSnapshot);
    }).toThrow('CANONICAL_SNAPSHOT_DIGEST_MISMATCH');
    expect(harness.snapshots.size).toBe(0);
    expect(harness.references.size).toBe(0);
  });

  it('does not recreate a reference from a tampered canonical snapshot during recovery', () => {
    const snapshot = joinPreview(completeComponents());
    const harness = new PreviewCommitHarness();
    harness.commit(snapshot);
    harness.snapshots.set(snapshot.joinDigest, {
      ...snapshot,
      componentDigests: ['tampered-component-digest'],
    });
    harness.references.delete(snapshot.joinDigest);

    harness.recover(snapshot.joinDigest);

    expect(harness.transactions.get(snapshot.joinDigest)).toBe('recovery_required');
    expect(harness.references.has(snapshot.joinDigest)).toBe(false);
  });

  it('recovers a missing or stale derived reference from the canonical snapshot', () => {
    const harness = new PreviewCommitHarness();
    const snapshot = joinPreview(completeComponents());
    harness.commit(snapshot);
    harness.references.delete(snapshot.joinDigest);
    harness.recover(snapshot.joinDigest);

    expect(harness.references.get(snapshot.joinDigest)).toMatchObject({
      joinDigest: snapshot.joinDigest,
      status: 'passed',
      canonicalSnapshotDigest: canonicalDigest(snapshot),
    });
    expect(harness.transactions.get(snapshot.joinDigest)).toBe('verified');
  });

  it('uses the transaction phase to recover an interruption between snapshot and reference', () => {
    const harness = new PreviewCommitHarness();
    const snapshot = joinPreview(completeComponents());
    expect(() => {
      harness.commit(snapshot, true);
    }).toThrow('INTERRUPTED_AFTER_SNAPSHOT');
    expect(harness.transactions.get(snapshot.joinDigest)).toBe('snapshot_committed');
    expect(harness.references.has(snapshot.joinDigest)).toBe(false);

    harness.recover(snapshot.joinDigest);
    expect(harness.transactions.get(snapshot.joinDigest)).toBe('verified');
    expect(harness.references.has(snapshot.joinDigest)).toBe(true);
  });

  it('leaves recovery on hold when no canonical snapshot exists', () => {
    const harness = new PreviewCommitHarness();
    harness.recover('d'.repeat(64));
    expect(harness.transactions.get('d'.repeat(64))).toBe('recovery_required');
    expect(harness.references.size).toBe(0);
  });
});
