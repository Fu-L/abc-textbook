import { describe, expect, it } from 'vitest';

import { prepareAuthoringResults } from '../../scripts/update-abc/author.js';
import { stagePublicationUpdate } from '../../scripts/update-abc/stage.js';

const skill = { name: 'abc-explanation-author' as const, version: '1.1.1', digest: 'a'.repeat(64) };

describe('US5 update preparation', () => {
  it('classifies complete drafts, complete authoring inputs, and concrete blocks', () => {
    const result = prepareAuthoringResults({
      skill,
      targets: [
        { problemId: 'abc500-e', slotLabel: 'E', draftPath: 'staging/drafts/abc500-e.json' },
        {
          problemId: 'abc500-f',
          slotLabel: 'F',
          packetPath: 'staging/packets/abc500-f.json',
          templatePath: '.agents/skills/abc-explanation-author/templates/full-explanation.md',
        },
        {
          problemId: 'abc500-i',
          slotLabel: 'I',
          block: {
            code: 'SOURCE_UNAVAILABLE',
            reason: 'The official source fixture is unavailable.',
            retryCondition: 'Restore the source fixture and resume.',
          },
        },
      ],
    });
    expect(result.map(({ resultType }) => resultType)).toEqual([
      'authoring_unit_draft',
      'authoring_required',
      'blocked',
    ]);
  });

  it('reuses the same deterministic update on an identical rerun', () => {
    const input = {
      previewId: 'initial-v1',
      contestId: 'abc500',
      sourceSetFingerprint: 'b'.repeat(64),
      targetProblemIds: ['abc500-e'],
      operations: [
        {
          entityType: 'problem' as const,
          entityId: 'abc500-e',
          action: 'add' as const,
          path: 'staging/previews/initial-v1/problems/abc500-e.json',
          beforeDigest: null,
          afterDigest: 'c'.repeat(64),
          affectedProblemIds: ['abc500-e'],
        },
      ],
    };
    expect(stagePublicationUpdate(input)).toEqual(stagePublicationUpdate(input));
  });
});
