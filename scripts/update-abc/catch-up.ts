import { pathToFileURL } from 'node:url';
import { parseKeyValueArguments } from '../corpus/cli-support.js';
import {
  CATCH_UP_ROOT,
  CATCH_UP_POLICY,
  UPDATE_RECEIPT_ROOT,
  INITIAL_CUTOFF,
  jsonAt,
  writeUpdateJson,
  discoverMissingContests,
  prepareCanonicalUpdate,
  applyCanonicalUpdate,
  loadAcceptedUpdates,
} from '../../src/lib/corpus/accepted-updates.js';
import type { DiscoverableContest } from './types.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  BOOTSTRAP_UPDATE_ID,
  BOOTSTRAP_MANIFEST_PATH,
  prepareBootstrapUpdate,
} from '../../src/lib/corpus/bootstrap-update.js';
export * from '../../src/lib/corpus/accepted-updates.js';
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseKeyValueArguments(process.argv.slice(2), ['--cutoff']);
    const cutoffAt = args.get('--cutoff') ?? INITIAL_CUTOFF;
    const discoveryPath = `${CATCH_UP_ROOT}/discovery.json`;
    const discovery = (await jsonAt(process.cwd(), discoveryPath)) as {
      cutoffAt: string;
      contests: DiscoverableContest[];
    };
    if (cutoffAt !== discovery.cutoffAt) throw new Error('CUTOFF_FROZEN');
    const missing = discoverMissingContests({
      cutoffAt,
      contests: discovery.contests,
      collectedContestIds: [],
    });
    const updates = [];
    for (const contest of missing) {
      const metadataPath = `${CATCH_UP_ROOT}/metadata/${contest.contestId}.json`;
      const authoringPath = `${CATCH_UP_ROOT}/authoring/${contest.contestId}.json`;
      const result = await prepareCanonicalUpdate({
        contestId: contest.contestId,
        metadataPath,
        authoringPath,
        cutoffAt,
      });
      await applyCanonicalUpdate(result);
      updates.push({
        contestId: contest.contestId,
        updateId: result.update.updateId,
        metadataPath,
        authoringPath,
        manifestPath: `${CATCH_UP_ROOT}/${result.update.updateId}/manifest.json`,
        receiptPath: `${UPDATE_RECEIPT_ROOT}/${contest.contestId}.json`,
        receiptDigest: canonicalDigest(result.authoring),
      });
      console.error(`${contest.contestId}: ELIGIBLE_FOR_BATCH`);
    }
    const bootstrap = await prepareBootstrapUpdate();
    await writeUpdateJson(BOOTSTRAP_MANIFEST_PATH, bootstrap);
    const policy = {
      schemaVersion: '1.0.0',
      cutoffAt,
      discoveryPath,
      discoveryDigest: canonicalDigest(discovery),
      bootstrapUpdateId: BOOTSTRAP_UPDATE_ID,
      bootstrapManifestPath: BOOTSTRAP_MANIFEST_PATH,
      bootstrapManifestDigest: canonicalDigest(bootstrap),
      updates,
    };
    await writeUpdateJson(CATCH_UP_POLICY, { ...policy, digest: canonicalDigest(policy) });
    const accepted = await loadAcceptedUpdates();
    console.log(
      JSON.stringify({
        command: 'release:catch-up',
        status: 'passed',
        cutoffAt,
        contests: updates.length,
        problems: accepted?.documents.length,
        updateIds: [policy.bootstrapUpdateId, ...updates.map((u) => u.updateId)],
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
