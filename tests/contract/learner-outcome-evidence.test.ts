import { readFile } from 'node:fs/promises';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { beforeAll, describe, expect, it } from 'vitest';

import { LearnerOutcomeEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';

const digest = 'a'.repeat(64);
const now = '2026-10-01T17:00:00Z';
const result = (criterionId: 'SC-009' | 'SC-010') => ({
  criterionId,
  protocolId: 'protocol-learning',
  releaseDigest: digest,
  itemResults: Array.from({ length: 5 }, (_, index) => ({
    itemId: `item-${String(index)}`,
    rawAnswerPath: `docs/answers/item-${String(index)}.txt`,
    rawAnswerDigest: digest,
    rubricDecisions: [{ rubricItemId: 'rubric-item', decision: 'pass', rationale: 'Observed.' }],
    allBlockingPassed: true,
    evidenceNotes: 'Recorded answer.',
  })),
  passedItemCount: 5,
  totalItemCount: 5,
  passRatio: 1,
  passed: true,
});
const fixture = () => ({
  schemaVersion: '2.0.0',
  evidenceId: 'evidence-learning',
  releaseVersion: '2026.10.02',
  releaseDigest: digest,
  operatorId: 'person-maintainer',
  protocol: {
    protocolId: 'protocol-learning',
    releaseDigest: digest,
    fixedAt: now,
    sc009Items: Array.from({ length: 5 }, (_, index) => ({
      itemId: `item-${String(index)}`,
      order: index + 1,
      problemId: `problem-${String(index)}`,
      slotLabel: 'G',
      primaryGenre: 'graph',
      expectedElements: ['idea', 'technique', 'correctness', 'complexity'],
      rubricId: 'rubric-learning',
    })),
    rubrics: [
      {
        rubricId: 'rubric-learning',
        blockingItemIds: ['rubric-item'],
        items: [{ itemId: 'rubric-item', description: 'Observed reasoning.' }],
      },
    ],
    passingRatio: 0.8,
  },
  results: [result('SC-009')],
  rawManifest: {
    path: 'docs/answers/manifest.json',
    digest,
    fileCount: 1,
    files: [{ path: 'docs/answers/item-0.txt', sha256: digest, byteLength: 1 }],
  },
  aggregatePassed: true,
  generatedAt: now,
});

describe('legacy self-study and the owner-retired SC-009 gate', () => {
  let validateJson: (value: unknown) => boolean;
  beforeAll(async () => {
    const ajv = new Ajv2020({ strict: false });
    addFormats(ajv);
    validateJson = ajv.compile(
      JSON.parse(
        await readFile(
          'specs/001-build-abc-textbook/contracts/learner-outcome-evidence.schema.json',
          'utf8',
        ),
      ) as object,
    );
  });
  const accepts = (value: unknown, expected: boolean) => {
    expect(LearnerOutcomeEvidenceSchema.safeParse(value).success).toBe(expected);
    expect(validateJson(value)).toBe(expected);
  };

  it('accepts SC-009 evidence without a manual navigation questionnaire', () => {
    accepts(fixture(), true);
  });

  it('still accepts legacy SC-010 protocols and results', () => {
    const current = fixture();
    const legacy = {
      ...current,
      protocol: {
        ...current.protocol,
        sc010Items: Array.from({ length: 5 }, (_, index) => ({
          itemId: `navigation-${String(index)}`,
          order: index + 1,
          currentUnitId: 'unit-scc',
          primaryGenre: 'graph',
          expectedNextUnitId: 'unit-two-sat',
          expectedPrerequisiteIds: [],
          expectedProblemId: 'problem-example',
          rubricId: 'rubric-learning',
        })),
      },
      results: [...current.results, result('SC-010')],
    };
    accepts(legacy, true);
  });

  it('continues to require SC-009 and rejects duplicate criteria', () => {
    accepts({ ...fixture(), results: [result('SC-010')] }, false);
    accepts({ ...fixture(), results: [result('SC-009'), result('SC-009')] }, false);
  });

  it('records the owner decision without synthetic answers or approval', () => {
    const retired = {
      schemaVersion: '3.0.0',
      criterionId: 'SC-009',
      status: 'not_required_by_owner',
      scope: 'initial_problem_corpus',
      decisionSource: 'owner_instruction_issue_48',
      reason: 'The owner requested quality and full-corpus checks instead of manual self-study.',
      replacementEvidencePaths: ['docs/verification/bootstrap/us1.json'],
    };
    accepts(retired, true);
    accepts({ ...retired, status: 'passed' }, false);
    accepts({ ...retired, replacementEvidencePaths: [] }, false);
    accepts({ ...retired, aggregatePassed: true }, false);
  });
});
