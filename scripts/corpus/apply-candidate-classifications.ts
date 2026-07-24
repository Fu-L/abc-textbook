import path from 'node:path';

import { z } from 'zod';

import { getCorpusBatch } from '../../src/lib/corpus/batches.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  CorpusCliError,
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';
import { parseCandidateInputFile, parsePreviewSelectionControl } from './preview-contracts.js';

const USAGE =
  'Usage: apply-candidate-classifications --metadata abc212-abc263.json --template candidate-template.json --classifications candidate-classifications.json --selection-manifest preview-manifest.json --output candidate-input.json';

const nonEmptyText = z.string().trim().min(1);
const uniqueArray = <Schema extends z.ZodType>(schema: Schema) =>
  z.array(schema).superRefine((values, context) => {
    if (new Set(values.map((value) => JSON.stringify(value))).size !== values.length) {
      context.addIssue({ code: 'custom', message: 'Values must be unique.' });
    }
  });

const classificationSchema = z.strictObject({
  domain: nonEmptyText,
  outcomeId: nonEmptyText,
  rationale: nonEmptyText,
});

const classificationFileSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  previewId: z.literal('initial-v1'),
  defaultExclusionReason: nonEmptyText,
  candidates: uniqueArray(
    z.strictObject({
      problemId: nonEmptyText,
      classifications: uniqueArray(classificationSchema).min(1),
    }),
  ).min(1),
});

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--metadata',
    '--template',
    '--classifications',
    '--selection-manifest',
    '--output',
  ]);
  const metadataValue = await readJson(requiredArgument(values, '--metadata'));
  verifyCorpusMetadataBatch(metadataValue, getCorpusBatch('abc212-abc263'));
  const metadata = metadataValue as CorpusMetadataBatch;
  const template = parseCandidateInputFile(await readJson(requiredArgument(values, '--template')));
  const classificationFile = classificationFileSchema.parse(
    await readJson(requiredArgument(values, '--classifications')),
  );
  const control = parsePreviewSelectionControl(
    await readJson(requiredArgument(values, '--selection-manifest')),
  );
  if (
    control.phase !== 'selection_rules_frozen' ||
    template.metadataBatchDigest !== metadata.metadataBatchDigest
  ) {
    throw new CorpusCliError(
      'CANDIDATE_CLASSIFICATION_CONTROL_MISMATCH',
      'The template is not bound to the current selection control and metadata batch.',
    );
  }

  const allowedDomains = new Set(control.selectionRules.cohortRules.domains);
  const classificationsByProblemId = new Map(
    classificationFile.candidates.map((candidate) => [candidate.problemId, candidate]),
  );
  if (classificationsByProblemId.size !== classificationFile.candidates.length) {
    throw new CorpusCliError(
      'CANDIDATE_CLASSIFICATION_DUPLICATE_PROBLEM',
      'A Problem can appear only once in the classification file.',
    );
  }

  const templateProblemIds = new Set(template.candidates.map(({ problemId }) => problemId));
  for (const candidate of classificationFile.candidates) {
    if (!templateProblemIds.has(candidate.problemId)) {
      throw new CorpusCliError('CANDIDATE_CLASSIFICATION_UNKNOWN_PROBLEM', candidate.problemId);
    }
    for (const classification of candidate.classifications) {
      if (!allowedDomains.has(classification.domain)) {
        throw new CorpusCliError(
          'CANDIDATE_CLASSIFICATION_DOMAIN_INVALID',
          `${candidate.problemId}: ${classification.domain}`,
        );
      }
    }
  }

  const candidates = template.candidates.map((candidate) => {
    const curated = classificationsByProblemId.get(candidate.problemId);
    if (!curated) {
      return {
        ...candidate,
        classifications: [],
        selectionEligible: false,
        exclusionReason: classificationFile.defaultExclusionReason,
        fixtureId: null,
      };
    }
    return {
      ...candidate,
      classifications: curated.classifications
        .map((classification) => ({
          ...classification,
          sourceRevisionIds: [...candidate.sourceRevisionIds].sort(compareText),
        }))
        .sort(
          (left, right) =>
            compareText(left.domain, right.domain) || compareText(left.outcomeId, right.outcomeId),
        ),
      selectionEligible: true,
      exclusionReason: null,
      fixtureId: null,
    };
  });
  const output = {
    ...template,
    candidates,
    fixtures: [],
  };
  parseCandidateInputFile(output);
  await writeJsonNoOverwrite(path.resolve(requiredArgument(values, '--output')), output);
  console.log(
    JSON.stringify({
      command: 'apply-candidate-classifications',
      status: 'passed',
      candidateCount: candidates.length,
      eligibleCount: candidates.filter(({ selectionEligible }) => selectionEligible).length,
      classifiedSourceRevisionCount: new Set(
        candidates
          .filter(({ selectionEligible }) => selectionEligible)
          .flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
      ).size,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
