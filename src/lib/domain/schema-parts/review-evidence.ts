import contentWorkManifestContractJson from '../../../../specs/001-build-abc-textbook/contracts/content-work-manifest.schema.json' with { type: 'json' };
import humanReviewContractJson from '../../../../specs/001-build-abc-textbook/contracts/human-content-review-evidence.schema.json' with { type: 'json' };
import learnerOutcomeContractJson from '../../../../specs/001-build-abc-textbook/contracts/learner-outcome-evidence.schema.json' with { type: 'json' };
import mergeReviewContractJson from '../../../../specs/001-build-abc-textbook/contracts/merge-review.schema.json' with { type: 'json' };
import userTimingContractJson from '../../../../specs/001-build-abc-textbook/contracts/user-timing-evidence.schema.json' with { type: 'json' };
import { defineContractSchema, zodFromContractSchema } from '../contract-schema.js';

export const ContentWorkManifestSchema = zodFromContractSchema(contentWorkManifestContractJson);
export const HumanContentReviewEvidenceSchema = zodFromContractSchema(humanReviewContractJson);
export const MergeReviewEvidenceSchema = zodFromContractSchema(mergeReviewContractJson);
export const LearnerOutcomeEvidenceSchema = zodFromContractSchema(learnerOutcomeContractJson);
export const UserTimingEvidenceSchema = zodFromContractSchema(userTimingContractJson);

export const ContentWorkManifestContract = defineContractSchema(
  'content-work-manifest.schema.json',
  contentWorkManifestContractJson,
);
export const HumanContentReviewEvidenceContract = defineContractSchema(
  'human-content-review-evidence.schema.json',
  humanReviewContractJson,
);
export const MergeReviewEvidenceContract = defineContractSchema(
  'merge-review.schema.json',
  mergeReviewContractJson,
);
export const LearnerOutcomeEvidenceContract = defineContractSchema(
  'learner-outcome-evidence.schema.json',
  learnerOutcomeContractJson,
);
export const UserTimingEvidenceContract = defineContractSchema(
  'user-timing-evidence.schema.json',
  userTimingContractJson,
);
