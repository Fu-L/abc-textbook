import { mkdtemp, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  prepareCanonicalUpdate,
  loadAcceptedUpdates,
  UpdateAuthoringSchema,
  CATCH_UP_ROOT,
} from '../../src/lib/corpus/accepted-updates.js';

describe('accepted normal updates', () => {
  it('joins every post-bootstrap contest, including explicit absent slots, without fixtures', async () => {
    const result = await loadAcceptedUpdates();
    expect(result?.documents).toHaveLength(36);
    expect(result?.policy.updates.map((update) => update.contestId)).toEqual(
      Array.from({ length: 12 }, (_, i) => `abc${String(467 + i)}`),
    );
    const update = await prepareCanonicalUpdate({
      contestId: 'abc478',
      metadataPath: `${CATCH_UP_ROOT}/metadata/abc478.json`,
      authoringPath: `${CATCH_UP_ROOT}/authoring/abc478.json`,
      cutoffAt: '2026-10-06T00:00:00+09:00',
    });
    expect(update.update.fixtureMode).toBe(false);
    expect(update.update.state).toBe('ELIGIBLE_FOR_BATCH');
    expect(
      update.metadata.contestSlots
        .filter((slot) => slot.availability === 'official_absent')
        .map((slot) => slot.label),
    ).toEqual(['Ex', 'H']);
  });
  it.each(['review', 'risk', 'skill', 'claim', 'source', 'placement'] as const)(
    'rejects a stale or unreviewed %s before canonical writes',
    async (kind) => {
      const root = await mkdtemp(path.join(tmpdir(), 'abc-catchup-rejection-'));
      try {
        for (const dir of ['src', 'staging', 'docs'])
          await symlink(path.join(process.cwd(), dir), path.join(root, dir), 'dir');
        const authoring = UpdateAuthoringSchema.parse(
          JSON.parse(await readFile(`${CATCH_UP_ROOT}/authoring/abc478.json`, 'utf8')) as unknown,
        );
        const item = authoring.items[kind === 'risk' ? 1 : 0];
        if (!item) throw new Error('Missing item');
        if (kind === 'review') item.inventory.reviewStatus = 'draft';
        if (kind === 'risk') {
          item.review.riskReasons = [];
          item.review.mode = 'self';
        }
        if (kind === 'skill') item.packet.skill.digest = '0'.repeat(64);
        if (kind === 'claim') {
          const ref = item.placement.analysisEvidenceRefs[0];
          if (ref) ref.claimPath = '/outcomeCandidates/999';
        }
        if (kind === 'source') item.packet.sources.pop();
        if (kind === 'placement') item.placement.primaryOutcomeId = 'outcome-design-lis-frontier';
        await writeFile(path.join(root, 'tampered.json'), JSON.stringify(authoring));
        await expect(
          prepareCanonicalUpdate({
            contestId: 'abc478',
            metadataPath: `${CATCH_UP_ROOT}/metadata/abc478.json`,
            authoringPath: 'tampered.json',
            cutoffAt: '2026-10-06T00:00:00+09:00',
            repositoryRoot: root,
          }),
        ).rejects.toThrow();
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
  );
});
