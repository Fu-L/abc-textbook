import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  FinalTaxonomyReviewError,
  readFinalTaxonomyReviewBasisFile,
  reviewFinalTaxonomy,
} from '../../src/lib/taxonomy/final-taxonomy-review.js';

export const FINAL_TAXONOMY_REVIEW_USAGE =
  'Usage: node --import tsx scripts/corpus/review-final-taxonomy.ts --reviewer-id person-* --approve (--review-basis TEXT | --review-basis-file PATH)';

export interface FinalTaxonomyReviewCliArguments {
  readonly reviewerId: string;
  readonly approve: true;
  readonly reviewBasis: string | null;
  readonly reviewBasisFile: string | null;
  readonly repositoryRoot: string;
}

export const parseFinalTaxonomyReviewArguments = (
  args: readonly string[],
  currentDirectory = process.cwd(),
): FinalTaxonomyReviewCliArguments => {
  const values = new Map<string, string>();
  let approve = false;
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === '--approve') {
      if (approve) {
        throw new FinalTaxonomyReviewError(
          'FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID',
          '--approve was duplicated.',
        );
      }
      approve = true;
      continue;
    }
    if (
      flag === undefined ||
      !['--reviewer-id', '--review-basis', '--review-basis-file', '--repository-root'].includes(
        flag,
      ) ||
      values.has(flag)
    ) {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID',
        flag ?? '<missing>',
      );
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith('--')) {
      throw new FinalTaxonomyReviewError(
        'FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID',
        `${flag} requires one value.`,
      );
    }
    values.set(flag, value);
    index += 1;
  }
  const reviewerId = values.get('--reviewer-id');
  const reviewBasis = values.get('--review-basis') ?? null;
  const reviewBasisFile = values.get('--review-basis-file') ?? null;
  if (
    !approve ||
    reviewerId === undefined ||
    (reviewBasis === null) === (reviewBasisFile === null)
  ) {
    throw new FinalTaxonomyReviewError(
      'FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID',
      FINAL_TAXONOMY_REVIEW_USAGE,
    );
  }
  return {
    reviewerId,
    approve: true,
    reviewBasis,
    reviewBasisFile,
    repositoryRoot: path.resolve(values.get('--repository-root') ?? currentDirectory),
  };
};

export const runFinalTaxonomyReviewCli = async (
  args: readonly string[],
  currentDirectory = process.cwd(),
): Promise<void> => {
  const parsed = parseFinalTaxonomyReviewArguments(args, currentDirectory);
  const reviewBasis =
    parsed.reviewBasis ??
    (await readFinalTaxonomyReviewBasisFile(parsed.repositoryRoot, parsed.reviewBasisFile ?? ''));
  const result = await reviewFinalTaxonomy({
    reviewerId: parsed.reviewerId,
    approve: parsed.approve,
    reviewBasis,
    repositoryRoot: parsed.repositoryRoot,
  });
  process.stdout.write(
    `${JSON.stringify({
      command: 'review-final-taxonomy',
      evidenceId: result.evidence.id,
      evidencePath: result.evidencePath,
      subjectDigest: result.evidence.subjectDigest,
      reviewerId: result.evidence.reviewer.personId,
      aggregatePassed: result.evidence.aggregatePassed,
      written: result.written,
    })}\n`,
  );
};

const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  try {
    await runFinalTaxonomyReviewCli(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${FINAL_TAXONOMY_REVIEW_USAGE}\n`);
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode =
      error instanceof FinalTaxonomyReviewError &&
      [
        'FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID',
        'FINAL_TAXONOMY_EXPLICIT_APPROVAL_REQUIRED',
        'FINAL_TAXONOMY_REVIEWER_ID_INVALID',
        'FINAL_TAXONOMY_REVIEW_BASIS_REQUIRED',
      ].includes(error.code)
        ? 64
        : 2;
  }
}
