import path from 'node:path';

import {
  createFetchTransport,
  normalizedPolicyFingerprint,
  SerialOfficialPageClient,
} from '../../src/lib/corpus/acquisition.js';
import type { ApprovedPolicyDocument, PolicyApprovalManifest } from '../../src/lib/corpus/types.js';
import { verifyPolicyApprovalManifest } from '../../src/lib/corpus/verification.js';
import {
  parseKeyValueArguments,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';

const USAGE =
  'Usage: policy-fingerprints --generative-ai-url https://atcoder.jp/posts/NNNN --user-agent "abc-textbook/VERSION (contact: CONTACT)" --output APPROVAL.json';

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--generative-ai-url',
    '--user-agent',
    '--output',
  ]);
  const outputPath = requiredArgument(values, '--output');
  const userAgent = requiredArgument(values, '--user-agent');
  const documents = [
    { id: 'atcoder-robots', kind: 'robots' as const, url: 'https://atcoder.jp/robots.txt' },
    { id: 'atcoder-terms', kind: 'terms' as const, url: 'https://atcoder.jp/tos' },
    {
      id: 'atcoder-generative-ai',
      kind: 'generative-ai' as const,
      url: requiredArgument(values, '--generative-ai-url'),
    },
  ];
  const upstream = createFetchTransport();
  const client = new SerialOfficialPageClient({
    transport: upstream,
    userAgent,
  });
  const approvedDocuments: ApprovedPolicyDocument[] = [];
  for (const document of documents) {
    const response = await client.get(document.url);
    approvedDocuments.push({
      ...document,
      approvedFingerprint: normalizedPolicyFingerprint(document, response),
    });
  }
  const approval: PolicyApprovalManifest = {
    schemaVersion: '1.0.0',
    documents: Object.freeze(approvedDocuments),
  };
  verifyPolicyApprovalManifest(approval);
  await writeJsonNoOverwrite(path.resolve(outputPath), approval);
  console.log(
    JSON.stringify({
      command: 'policy-fingerprints',
      status: 'written_for_explicit_review',
      outputPath,
      policyFetchMode: 'live_uncached',
      documents: approval.documents.map(({ id, approvedFingerprint }) => ({
        id,
        fingerprint: approvedFingerprint,
      })),
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
