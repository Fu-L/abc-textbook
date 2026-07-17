import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  ReleaseTransitionError,
  assertApprovalDigest,
  assertImmutableSnapshot,
  assertReviewComplete,
  transitionReleaseCandidate,
} from '../../src/lib/validation/release-state.js';

const digest = 'a'.repeat(64);

describe('release state gate', () => {
  it('allows only the declared forward transitions and fail-closed holds', () => {
    expect(transitionReleaseCandidate('DRAFTED', 'VALIDATING')).toBe('VALIDATING');
    expect(transitionReleaseCandidate('READY_TO_PUBLISH', 'ON_HOLD')).toBe('ON_HOLD');
    expect(() => transitionReleaseCandidate('DRAFTED', 'PUBLISHED')).toThrow(
      ReleaseTransitionError,
    );
  });

  it('detects any mutation of a fixed snapshot', () => {
    const files = [{ path: 'src/content/a.json', sha256: digest, byteLength: 1 }];
    const expected = canonicalDigest(files);

    expect(() => {
      assertImmutableSnapshot(expected, files);
    }).not.toThrow();
    expect(() => {
      assertImmutableSnapshot(expected, [
        { path: 'src/content/a.json', sha256: 'b'.repeat(64), byteLength: 1 },
      ]);
    }).toThrow(/IMMUTABLE_SNAPSHOT_MISMATCH/u);
  });

  it('binds owner approval to the current approvable digest', () => {
    expect(() => {
      assertApprovalDigest(digest, { approvedDigest: digest });
    }).not.toThrow();
    expect(() => {
      assertApprovalDigest(digest, { approvedDigest: 'b'.repeat(64) });
    }).toThrow(/APPROVAL_DIGEST_MISMATCH/u);
  });

  it('requires complete current review evidence before publication', () => {
    expect(() => {
      assertReviewComplete({
        subjectDigest: digest,
        expectedSubjectDigest: digest,
        applicableCheckCount: 2,
        passedApplicableCheckCount: 2,
        unreviewedItemCount: 0,
        blockingFindingCount: 0,
        aggregatePassed: true,
      });
    }).not.toThrow();

    expect(() => {
      assertReviewComplete({
        subjectDigest: digest,
        expectedSubjectDigest: digest,
        applicableCheckCount: 2,
        passedApplicableCheckCount: 1,
        unreviewedItemCount: 0,
        blockingFindingCount: 0,
        aggregatePassed: true,
      });
    }).toThrow(/REVIEW_INCOMPLETE/u);
  });

  it('requires an append-only receipt before the published state is accepted', () => {
    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        receipt: { candidateId: 'candidate-initial', result: 'published' },
        candidateId: 'candidate-initial',
      }),
    ).not.toThrow();

    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        candidateId: 'candidate-initial',
      }),
    ).toThrow(/PUBLISH_RECEIPT_REQUIRED/u);
  });
});
