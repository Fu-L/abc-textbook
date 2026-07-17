const CONTEST_ID = /^abc(?<number>[0-9]{3,})$/u;
const ENTITY_ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;

export class StableIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StableIdError';
  }
}

export const stableContestId = (contestNumber: number): string => {
  if (!Number.isSafeInteger(contestNumber) || contestNumber < 0) {
    throw new StableIdError('Contest number must be a non-negative safe integer.');
  }
  return `abc${contestNumber.toString().padStart(3, '0')}`;
};

export const normalizeProblemLabel = (label: string): string => {
  const normalized = label.normalize('NFC').trim().toLowerCase();
  if (!/^[a-z][a-z0-9+_-]*$/u.test(normalized)) {
    throw new StableIdError(`Unsupported official problem label: ${label}`);
  }
  // Escape every punctuation character, including the escape marker itself. This
  // preserves existing alphanumeric IDs while making the mapping injective.
  return normalized.replaceAll('_', '_5f').replaceAll('+', '_2b').replaceAll('-', '_2d');
};

export const stableProblemId = (contestId: string, officialLabel: string): string => {
  if (!CONTEST_ID.test(contestId)) {
    throw new StableIdError(`Invalid contest ID: ${contestId}`);
  }
  return `${contestId}-${normalizeProblemLabel(officialLabel)}`;
};

export const assertStableEntityId = (value: string): string => {
  if (!ENTITY_ID.test(value)) throw new StableIdError(`Invalid stable entity ID: ${value}`);
  return value;
};
