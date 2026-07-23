import { canonicalDigest } from '../domain/canonical-json.js';

export type PreviewStatus = 'on_hold' | 'passed';

export interface ComponentEvidence {
  readonly componentId: string;
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly subjectDigest: string;
  /** Digest of the generated artifact represented by this evidence. */
  readonly artifactDigest: string;
  readonly componentDigest: string;
  readonly checksPassed: boolean;
  readonly review: {
    readonly subjectDigest: string;
    readonly aggregatePassed: boolean;
  };
}

export const requiredPreviewComponentIds = [
  'metadata-inventory-taxonomy',
  'content-graph-search',
  'content-dynamic-programming',
  'content-data-structures',
  'content-mathematics',
  'learning-records',
  'ui-search',
  'update-simulation',
] as const;

export type ComponentEvidenceSubject = Omit<ComponentEvidence, 'componentDigest'>;

export const componentEvidenceDigest = (component: ComponentEvidenceSubject): string =>
  canonicalDigest(component);

export interface PreviewSnapshot {
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly componentDigests: readonly string[];
  readonly joinDigest: string;
  readonly status: PreviewStatus;
  readonly holdReasons: readonly string[];
}

export type PreviewSnapshotDigestSubject = Omit<PreviewSnapshot, 'joinDigest'>;

export const previewSnapshotDigestSubject = (
  snapshot: PreviewSnapshot | PreviewSnapshotDigestSubject,
): PreviewSnapshotDigestSubject => ({
  previewId: snapshot.previewId,
  manifestDigest: snapshot.manifestDigest,
  problemIds: snapshot.problemIds,
  componentDigests: snapshot.componentDigests,
  status: snapshot.status,
  holdReasons: snapshot.holdReasons,
});

export const previewSnapshotJoinDigest = (
  snapshot: PreviewSnapshot | PreviewSnapshotDigestSubject,
): string => canonicalDigest(previewSnapshotDigestSubject(snapshot));

export class PreviewSnapshotIntegrityError extends Error {
  constructor() {
    super('CANONICAL_SNAPSHOT_DIGEST_MISMATCH');
    this.name = 'PreviewSnapshotIntegrityError';
  }
}

export const assertPreviewSnapshotIntegrity = (
  snapshot: PreviewSnapshot,
  pathJoinDigest: string,
): void => {
  if (
    snapshot.joinDigest !== pathJoinDigest ||
    previewSnapshotJoinDigest(snapshot) !== pathJoinDigest
  ) {
    throw new PreviewSnapshotIntegrityError();
  }
};

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const componentIdsAreComplete = (componentIds: readonly string[]): boolean => {
  const uniqueIds = new Set(componentIds);
  return (
    uniqueIds.size === componentIds.length &&
    requiredPreviewComponentIds.every((componentId) => uniqueIds.has(componentId)) &&
    componentIds.every((componentId) =>
      requiredPreviewComponentIds.includes(
        componentId as (typeof requiredPreviewComponentIds)[number],
      ),
    )
  );
};

/** Join preview component evidence into the immutable snapshot subject. */
export const joinPreviewComponents = (
  components: readonly ComponentEvidence[],
): PreviewSnapshot => {
  const [first] = components;
  if (!first) throw new Error('Preview component evidence is empty.');

  const holdReasons: string[] = [];
  const componentIds = components.map(({ componentId }) => componentId);
  if (!componentIdsAreComplete(componentIds)) {
    holdReasons.push('COMPONENT_SET_INCOMPLETE');
  }

  for (const component of components) {
    const { componentDigest, ...subject } = component;
    if (componentDigest !== componentEvidenceDigest(subject)) {
      holdReasons.push(`COMPONENT_DIGEST_STALE:${component.componentId}`);
    }
    if (
      component.previewId !== first.previewId ||
      component.manifestDigest !== first.manifestDigest ||
      !sameOrderedValues(component.problemIds, first.problemIds)
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

  const snapshotSubject: PreviewSnapshotDigestSubject = {
    previewId: first.previewId,
    manifestDigest: first.manifestDigest,
    problemIds: first.problemIds,
    componentDigests: components.map(({ componentDigest }) => componentDigest),
    holdReasons,
    status: holdReasons.length === 0 ? 'passed' : 'on_hold',
  };
  return {
    ...snapshotSubject,
    joinDigest: previewSnapshotJoinDigest(snapshotSubject),
  };
};
