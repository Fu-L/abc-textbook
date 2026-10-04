import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  PROBLEM_SHARD_INDEX_PATH,
  PROBLEM_SHARD_DOMAINS,
  type ProblemShardDomain,
  type ProblemShardIndex,
} from '../../src/lib/authoring/problem-shard-index.js';
import {
  readShardJson,
  shardFileDigest,
  verifyFrozenProblemShardContext,
  buildProblemShardWorkManifest,
} from '../../src/lib/authoring/problem-shard-context.js';
import { authorProblemInShard } from '../../src/lib/authoring/author-problem-shard.js';
import {
  ProblemAuthoringDetailsSchema,
  readProblemAuthoringDocument,
  renderProblemAuthoringDocument,
  type ProblemAuthoringDetails,
} from '../../src/lib/authoring/problem-authoring-document.js';
import {
  validateAuthoringOutput,
  type AuthoringInputPacket,
} from '../../src/lib/authoring/explanation-authoring-skill.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

const jsonText = (value: unknown): string => JSON.stringify(value, null, 2) + '\n';
const escape = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const longSentences = (value: string): Set<string> =>
  new Set(
    value
      .split(/(?<=[。！？])|\r?\n+/u)
      .map((sentence) => sentence.replace(/\s+/gu, ' ').trim())
      .filter((sentence) => sentence.length >= 25),
  );
const duplicatedReasoningSentences = (reasoning: string, correctness: string): string[] => {
  const correctnessSentences = longSentences(correctness);
  return [...longSentences(reasoning)].filter((sentence) => correctnessSentences.has(sentence));
};
const htmlDocument = (title: string, body: string): string =>
  `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>body{max-width:76ch;margin:2rem auto;padding:0 1rem;line-height:1.85;font-family:system-ui,sans-serif;overflow-wrap:anywhere}a{color:#145da0}a:focus-visible{outline:3px solid #145da0}pre{white-space:pre-wrap}h2{margin-top:2.5rem}li{margin:.45rem 0}</style></head><body><main><h1>${escape(title)}</h1>${body}</main></body></html>\n`;
const args = process.argv.slice(2);
let domain: ProblemShardDomain | undefined;
let shardId: string | undefined;
let detailsPath: string | undefined;
let write = false;
try {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--write') write = true;
    else if (arg === '--check') {
      /* read-only validation is default */
    } else if (['--domain', '--shard', '--details'].includes(arg ?? '') && args[i + 1]) {
      const value = args[++i];
      if (!value) throw new Error('SHARD_ARGUMENT_MISSING');
      if (arg === '--domain') {
        if (!PROBLEM_SHARD_DOMAINS.includes(value as ProblemShardDomain))
          throw new Error(`SHARD_DOMAIN_UNKNOWN:${value}`);
        domain = value as ProblemShardDomain;
      }
      if (arg === '--shard') shardId = value;
      if (arg === '--details') detailsPath = value;
    } else
      throw new Error(
        'Usage: author-problem-shards [--check | --write] [--domain DOMAIN | --shard ID] [--details FILE]',
      );
  }
  if (domain && shardId) throw new Error('Choose one of --domain and --shard.');
  if (detailsPath && !write) throw new Error('--details requires --write.');
  const index = await readShardJson<ProblemShardIndex>(PROBLEM_SHARD_INDEX_PATH);
  const context = await verifyFrozenProblemShardContext(index);
  const selected = index.shards.filter(
    (s) => (!domain || s.domain === domain) && (!shardId || s.shardId === shardId),
  );
  if (!selected.length) throw new Error('SHARD_SELECTION_EMPTY');
  const details = detailsPath ? await readShardJson<Record<string, unknown>>(detailsPath) : {};
  if (detailsPath) {
    const selectedIds = new Set(selected.flatMap((s) => s.problemIds));
    for (const id of Object.keys(details))
      if (!selectedIds.has(id)) throw new Error(`SHARD_DETAILS_OUTSIDE_OWNERSHIP:${id}`);
  }
  const processor = await createMarkdownProcessor({ syntaxHighlight: 'prism' });
  const result = [];
  for (const shard of selected) {
    let manifest = ContentWorkManifestSchema.parse(
      await readShardJson(`${shard.workPath}/manifest.json`),
    );
    validateContentWorkManifest(manifest);
    const dispatch = await readShardJson<Record<string, unknown>>(
      `${shard.workPath}/dispatch.json`,
    );
    if (
      dispatch.indexDigest !== index.indexDigest ||
      dispatch.manifestDigest !== manifest.digest ||
      canonicalDigest(dispatch.problemIds) !== canonicalDigest(shard.problemIds) ||
      canonicalDigest(dispatch.documentPaths) !== canonicalDigest(shard.documentPaths)
    )
      throw new Error(`SHARD_DISPATCH_DRIFT:${shard.shardId}`);
    const packets: AuthoringInputPacket[] = [];
    const documents = [];
    const checks = [];
    const htmlFiles = [];
    const riskReasons = new Set<string>();
    const authoringHolds: string[] = [];
    const sourceVerifications = [];
    for (const [position, problemId] of shard.problemIds.entries()) {
      const docPath = shard.documentPaths[position];
      if (!docPath) throw new Error(`SHARD_DOCUMENT_PATH_MISSING:${problemId}`);
      let document: string;
      try {
        document = await readFile(docPath, 'utf8');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || !write) throw error;
        const detail = ProblemAuthoringDetailsSchema.parse(details[problemId]);
        const authored = authorProblemInShard(context, shard, problemId, detail);
        await mkdir(path.dirname(docPath), { recursive: true });
        await writeFile(docPath, authored.document, { flag: 'wx' });
        document = authored.document;
      }
      const previousDocument = readProblemAuthoringDocument(document);
      if (
        previousDocument.unit.problemId !== problemId ||
        previousDocument.unit.docPath !== docPath
      )
        throw new Error(`SHARD_DOCUMENT_OWNER_MISMATCH:${docPath}`);
      if (write && details[problemId]) {
        const replacement = authorProblemInShard(
          context,
          shard,
          problemId,
          ProblemAuthoringDetailsSchema.parse(details[problemId]),
        ).document;
        if (replacement !== document) {
          await writeFile(docPath, replacement);
          document = replacement;
        }
      }
      const { unit, body, title } = readProblemAuthoringDocument(document);
      if (problemId.endsWith('-e')) {
        const duplicated = duplicatedReasoningSentences(
          String(unit.sections.reasoning),
          String(unit.sections.correctness),
        );
        const firstDuplicate = duplicated[0];
        if (firstDuplicate)
          throw new Error(
            `SHARD_REASONING_CORRECTNESS_DUPLICATE:${problemId}:${firstDuplicate.slice(0, 60)}`,
          );
      }
      const example = unit.examples[0];
      const exercise = unit.exercises[0];
      const detail: ProblemAuthoringDetails = {
        reasoning: String(unit.sections.reasoning),
        time: (unit.sections.complexity as { time: string }).time,
        space: (unit.sections.complexity as { space: string }).space,
        correctness: String(unit.sections.correctness),
        example: example
          ? {
              input: example.input,
              procedure: example.procedure,
              expectedResult: example.expectedResult,
            }
          : undefined,
        exercise: exercise
          ? {
              prompt: exercise.attainmentCondition,
              answer: exercise.answer.reasoningOrVerification,
              expectedResult: exercise.answer.expectedResult,
            }
          : undefined,
      };
      const authored = authorProblemInShard(context, shard, problemId, detail);
      const validation = validateAuthoringOutput(unit, context.skill, authored.input);
      if (unit.docPath !== docPath || unit.problemId !== problemId)
        throw new Error(`SHARD_DOCUMENT_OWNER_MISMATCH:${docPath}`);
      if (document !== renderProblemAuthoringDocument(unit, title, authored.links))
        throw new Error(`SHARD_DOCUMENT_BLOCK_DRIFT:${docPath}`);
      const manual = details[problemId]
        ? ProblemAuthoringDetailsSchema.parse(details[problemId])
        : undefined;
      manual?.riskReasons?.forEach((r) =>
        riskReasons.add(r === 'independent_proof' ? 'original_proof' : r),
      );
      if (manual?.sourceVerification)
        sourceVerifications.push({ problemId, ...manual.sourceVerification });
      if (manual?.holdReason) authoringHolds.push(`${problemId}: ${manual.holdReason}`);
      const technicalHolds = validation.diagnostics.filter((d) =>
        ['TECHNICAL_CLAIM_NOT_VERIFIED', 'ANSWER_MATERIAL_INCOMPLETE'].includes(d.code),
      );
      const failures = validation.diagnostics.filter((d) => !technicalHolds.includes(d));
      if (failures.length)
        throw new Error(`SHARD_OUTPUT_BLOCKED:${problemId}:${JSON.stringify(failures)}`);
      technicalHolds.forEach((d) => authoringHolds.push(`${problemId}: ${d.code}`));
      packets.push(authored.input);
      const rendered = await processor.render(body);
      const $ = load(htmlDocument(title, rendered.code));
      if (
        $('main').length !== 1 ||
        $('html').attr('lang') !== 'ja' ||
        $('h1').length !== 1 ||
        $('img,input,button,iframe,script').length
      )
        throw new Error(`SHARD_PREVIEW_ACCESSIBILITY_STRUCTURE:${problemId}`);
      const ids = new Set<string>();
      $('*[id]').each((_, element) => {
        const id = $(element).attr('id');
        if (!id) throw new Error(`SHARD_EMPTY_ANCHOR:${problemId}`);
        if (ids.has(id)) throw new Error(`SHARD_DUPLICATE_ANCHOR:${problemId}:${id}`);
        ids.add(id);
      });
      for (const element of $('a').toArray()) {
        const node = $(element);
        const href = node.attr('href');
        if (!href || !node.text().trim())
          throw new Error(`SHARD_LINK_ACCESSIBLE_NAME:${problemId}`);
        if (href.startsWith('#')) {
          if (!ids.has(href.slice(1)))
            throw new Error(`SHARD_LINK_ANCHOR_MISSING:${problemId}:${href}`);
        } else if (!href.startsWith('https://')) {
          await access(href);
          node.attr('href', path.relative(shard.previewPath, href));
        }
      }
      const htmlPath = `${shard.previewPath}/${problemId}.html`;
      const html = $.html() + '\n';
      htmlFiles.push({ path: htmlPath, digest: shardFileDigest(html) });
      documents.push({
        problemId,
        path: docPath,
        digest: shardFileDigest(document),
        contentLocators: {
          claim: { ownerType: 'problem', problemId, path: docPath, key: 'correctness' },
          ...(example
            ? { example: { ownerType: 'problem', problemId, path: docPath, key: example.key } }
            : {}),
          ...(exercise
            ? { exercise: { ownerType: 'problem', problemId, path: docPath, key: exercise.key } }
            : {}),
        },
        sourceRevisionIds: unit.sourceRevisionIds,
        learningOutcomeIds: unit.learningOutcomeIds,
      });
      checks.push({
        problemId,
        source: 'passed',
        structure: 'passed',
        example: example
          ? {
              status: 'passed',
              kind: 'illustrative',
              execution: 'not_applicable',
              expectedResult: example.expectedResult,
              basis:
                'Original hand-worked trace; automated check validates the declared procedure and expected-result contract. Mathematical inspection remains in the shard review inventory.',
            }
          : { status: 'not_applicable', basis: 'No separate example block.' },
        answer: exercise
          ? {
              status: exercise.answer.verificationStatus === 'passed' ? 'passed' : 'on_hold',
              expectedResult: exercise.answer.expectedResult,
            }
          : { status: 'not_applicable', basis: 'No exercise or answer block.' },
        link: 'passed',
        accessibility: 'passed_static_text_structure',
      });
      if (write) {
        await mkdir(shard.previewPath, { recursive: true });
        await writeFile(htmlPath, html);
      } else if (shardFileDigest(await readFile(htmlPath, 'utf8')) !== shardFileDigest(html))
        throw new Error(`SHARD_PREVIEW_DOCUMENT_STALE:${problemId}`);
    }
    // This is an inventory for the maintainer's review, never synthetic human approval.
    const priorReview = write
      ? await readShardJson<Record<string, unknown>>(`${shard.workPath}/review.json`).catch(
          (error: unknown) => {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
            throw error;
          },
        )
      : await readShardJson<Record<string, unknown>>(`${shard.workPath}/review.json`);
    if (!detailsPath && priorReview) {
      ((priorReview.riskReasons ?? []) as string[]).forEach((r) => riskReasons.add(r));
      authoringHolds.push(...((priorReview.authoringHolds ?? []) as string[]));
      sourceVerifications.push(...((priorReview.sourceVerifications ?? []) as object[]));
    }
    const policy = {
      requiredMode: riskReasons.size ? ('third_party' as const) : ('self' as const),
      riskReasons: [...riskReasons].sort(),
    };
    const planned = ContentWorkManifestSchema.parse(
      await buildProblemShardWorkManifest(context, shard, policy),
    );
    if (write && (manifest.scopeDigest !== planned.scopeDigest || manifest.state === 'planned')) {
      manifest = ContentWorkManifestSchema.parse({
        ...planned,
        state: 'in_progress',
        updatedAt: new Date().toISOString(),
        reviewUnits: planned.reviewUnits.map((u) => ({ ...u, status: 'in_progress' })),
      });
      manifest.digest = digestWithoutField(manifest, 'digest');
      validateContentWorkManifest(manifest);
      dispatch.manifestDigest = manifest.digest;
      await writeFile(`${shard.workPath}/manifest.json`, jsonText(manifest));
      await writeFile(`${shard.workPath}/dispatch.json`, jsonText(dispatch));
    }
    if (manifest.scopeDigest !== planned.scopeDigest)
      throw new Error(`SHARD_REVIEW_POLICY_SCOPE_DRIFT:${shard.shardId}`);
    if (write) {
      dispatch.reviewPolicy = manifest.reviewPolicy;
      await writeFile(`${shard.workPath}/dispatch.json`, jsonText(dispatch));
    } else if (canonicalDigest(dispatch.reviewPolicy) !== canonicalDigest(manifest.reviewPolicy))
      throw new Error(`SHARD_DISPATCH_REVIEW_POLICY_DRIFT:${shard.shardId}`);
    const subjectDigest = canonicalDigest({
      indexDigest: index.indexDigest,
      manifestDigest: manifest.digest,
      documents,
      inputPackets: packets,
    });
    const review = {
      schemaVersion: '1.0.0',
      shardId: shard.shardId,
      indexDigest: index.indexDigest,
      subjectDigest,
      reviewPolicy: manifest.reviewPolicy,
      riskReasons: [...riskReasons].sort(),
      status: 'pending_policy_selected_human_review',
      humanApproval: false,
      authoringHolds: [...new Set(authoringHolds)].sort(),
      sourceVerifications,
      scope:
        'One shard owns whole Problem documents; local block keys are locators, not independent review entities.',
      reviewItems: documents.map((d) => ({
        problemId: d.problemId,
        path: d.path,
        learningOutcomeIds: d.learningOutcomeIds,
        requiredInspection: [
          'reasoning_reproducibility',
          'correctness_and_assumptions',
          'whole_algorithm_time_and_space',
          ...('example' in d.contentLocators ? ['original_hand_worked_example'] : []),
          ...('exercise' in d.contentLocators ? ['exercise_answer'] : []),
          'source_binding',
        ],
        authoringInspection: 'codex_assisted_source_bound_authoring',
        decision: 'pending',
      })),
    };
    const checkEvidence = {
      schemaVersion: '1.0.0',
      shardId: shard.shardId,
      indexDigest: index.indexDigest,
      subjectDigest,
      requiredChecks: shard.requiredChecks,
      checks,
      review: { status: 'pending', path: `${shard.workPath}/review.json` },
      automatedStatus: 'passed',
      releaseAcceptance: false,
    };
    const indexHtml = htmlDocument(
      shard.shardId,
      `<p>主成果: ${escape(shard.primaryOutcomeId)}。問題本文の私用プレビュー。</p><p>状態: 本文の技術確認と自動検査を記録済み。${riskReasons.size ? '指定リスクに応じたレビュー' : '管理者のセルフレビュー'}を待っています。</p><ul>${documents.map((d) => `<li><a href="${d.problemId}.html">${escape(d.problemId)}</a></li>`).join('')}</ul>`,
    );
    htmlFiles.push({ path: `${shard.previewPath}/index.html`, digest: shardFileDigest(indexHtml) });
    const snapshot = {
      schemaVersion: '1.0.0',
      shardId: shard.shardId,
      indexDigest: index.indexDigest,
      subjectDigest,
      status: 'on_hold',
      holdReasons: [
        ...review.authoringHolds,
        `${review.reviewPolicy.requiredMode.toUpperCase()}_REVIEW_REQUIRED: Policy-selected human review is pending; T074/T078 acceptance is separate.`,
      ],
      checksDigest: canonicalDigest(checkEvidence),
      reviewDigest: canonicalDigest(review),
      htmlFiles,
    };
    const artifacts = [
      {
        path: `${shard.workPath}/input.json`,
        value: { indexDigest: index.indexDigest, shardId: shard.shardId, packets },
      },
      { path: `${shard.workPath}/checks.json`, value: checkEvidence },
      { path: `${shard.workPath}/review.json`, value: review },
      {
        path: `${shard.previewPath}/snapshot.json`,
        value: { ...snapshot, snapshotDigest: canonicalDigest(snapshot) },
      },
    ];
    if (write) {
      await writeFile(`${shard.previewPath}/index.html`, indexHtml);
      for (const artifact of artifacts) await writeFile(artifact.path, jsonText(artifact.value));
    } else {
      for (const artifact of artifacts)
        if (canonicalDigest(await readShardJson(artifact.path)) !== canonicalDigest(artifact.value))
          throw new Error(`SHARD_EVIDENCE_STALE:${artifact.path}`);
      if (
        shardFileDigest(await readFile(`${shard.previewPath}/index.html`, 'utf8')) !==
        shardFileDigest(indexHtml)
      )
        throw new Error(`SHARD_PREVIEW_INDEX_STALE:${shard.shardId}`);
    }
    result.push({
      shardId: shard.shardId,
      domain: shard.domain,
      problemCount: shard.problemIds.length,
      subjectDigest,
      status: 'automated_checks_passed',
      previewStatus: 'on_hold',
      authoringHoldCount: review.authoringHolds.length,
    });
  }
  if (write && domain)
    await writeFile(
      `docs/work-manifests/initial/problem-authoring-units/${domain}/status.json`,
      jsonText({
        domain,
        indexDigest: index.indexDigest,
        shards: result,
        scope: 'Independent shard evidence only; no global join or human acceptance.',
      }),
    );
  console.log(
    JSON.stringify({
      status: 'automated_checks_passed',
      indexDigest: index.indexDigest,
      shards: result.length,
      problems: result.reduce((sum, r) => sum + r.problemCount, 0),
      authoringHoldCount: result.reduce((sum, r) => sum + r.authoringHoldCount, 0),
      humanReview: 'pending',
      scope: 'Independent shard authoring checks, not T072–T078 global acceptance.',
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
