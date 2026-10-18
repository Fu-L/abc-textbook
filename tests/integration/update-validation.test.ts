import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { enumerateCorrectionImpacts } from '../../scripts/update-abc/correction-impact.js';
import { deriveFrozenClassification } from '../../scripts/update-abc/classify.js';
import {
  persistPublicationUpdate,
  resumeUpdate,
  runUpdatePipeline,
} from '../../scripts/update-abc/index.js';
import { validatePreparedUpdate } from '../../scripts/update-abc/validate.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import {
  CanonicalProblemPlacementPolicySchema,
  CorrectionImpactSchema,
  LearningUnitSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { runSmallBatchUpdate } from '../../scripts/update-abc/index.js';
import { smallBatchInput, authorSmallBatch, contentHashes } from '../fixtures/small-batch.js';
import * as publicProjection from '../../src/lib/catalog/full-public-projection.js';

describe('US5 update validation', () => {
  it('enumerates every affected content and derived index surface', () => {
    const impact = enumerateCorrectionImpacts({
      correctionId: 'correction-abc500-e',
      sourceRevisionId: 'source-abc500-e',
      problemIds: ['abc500-e'],
      changedBlocks: ['explanation', 'example'],
      locators: [
        {
          problemId: 'abc500-e',
          learningUnitId: 'unit-abc500-e',
          exampleKey: 'worked-example',
          exerciseKey: 'practice',
          indexPaths: ['staging/previews/initial-v1/taxonomy/index.json'],
        },
      ],
    });
    expect(CorrectionImpactSchema.parse(impact)).toEqual(impact);
    expect(impact.affectedContentLocators).toHaveLength(4);
  });

  it('reports cycle, reachability, and index failures per Problem', () => {
    const result = validatePreparedUpdate({
      problems: [
        {
          problemId: 'abc500-e',
          sourceAvailable: true,
          explanationComplete: true,
          examplesValid: true,
          placementIds: ['placement-abc500-e'],
          crossReferencesValid: true,
        },
      ],
      taxonomyEdges: [
        ['outcome-a', 'outcome-b'],
        ['outcome-b', 'outcome-a'],
      ],
      reachableProblemIds: [],
      indexedProblemIds: [],
      catalogProblemIds: ['abc500-e'],
    });
    expect(result.problemResults[0]?.findingCodes).toEqual(
      expect.arrayContaining(['DEPENDENCY_CYCLE', 'PROBLEM_UNREACHABLE', 'INDEX_MISSING']),
    );
    expect(result.aggregatePassed).toBe(false);
  });

  it('derives classification mappings and DAG edges from frozen artifacts', () => {
    const base = {
      selectedProblemIds: ['abc500-e'],
      candidates: [
        {
          problemId: 'abc500-e',
          sourceRevisionIds: ['source-abc500-e'],
          classifications: [
            {
              domain: 'graphs',
              outcomeId: 'outcome-candidate-graphs',
              sourceRevisionIds: ['source-abc500-e'],
              rationale: 'Shortest paths.',
            },
          ],
        },
      ],
      groups: [
        {
          domain: 'graphs',
          candidateOutcomeId: 'outcome-candidate-graphs',
          problemIds: ['abc500-e'],
          sourceRevisionIds: ['source-abc500-e'],
          tag: { id: 'tag-graphs', prerequisiteTagIds: ['tag-basics'] },
          outcome: { id: 'outcome-graphs', prerequisiteOutcomeIds: ['outcome-basics'] },
          unit: { id: 'unit-graphs', prerequisiteUnitIds: ['unit-basics'] },
          placements: [
            {
              problemId: 'abc500-e',
              tagIds: ['tag-graphs'],
              outcomeIds: ['outcome-graphs'],
              unitIds: ['unit-graphs'],
              sourceRevisionIds: ['source-abc500-e'],
              classificationRationale: 'Shortest paths.',
            },
          ],
        },
      ],
      index: {
        problemIds: ['abc500-e'],
        tags: [
          { id: 'tag-basics', prerequisiteTagIds: [] },
          { id: 'tag-graphs', prerequisiteTagIds: ['tag-basics'] },
        ],
        outcomes: [
          { id: 'outcome-basics', prerequisiteOutcomeIds: [] },
          { id: 'outcome-graphs', prerequisiteOutcomeIds: ['outcome-basics'] },
        ],
        units: [
          { id: 'unit-basics', prerequisiteUnitIds: [] },
          { id: 'unit-graphs', prerequisiteUnitIds: ['unit-basics'] },
        ],
        placements: [
          {
            problemId: 'abc500-e',
            tagIds: ['tag-graphs'],
            outcomeIds: ['outcome-graphs'],
            unitIds: ['unit-graphs'],
            sourceRevisionIds: ['source-abc500-e'],
            classificationRationale: 'Shortest paths.',
          },
        ],
        standardUnitOrder: ['unit-basics', 'unit-graphs'],
      },
    } as const;
    expect(deriveFrozenClassification(base)).toMatchObject({
      proposals: [],
      validProblemIds: ['abc500-e'],
      taxonomyEdges: [
        ['tag-basics', 'tag-graphs'],
        ['outcome-basics', 'outcome-graphs'],
        ['unit-basics', 'unit-graphs'],
      ],
    });
    const broken = {
      ...base,
      candidates: [
        {
          ...base.candidates[0],
          classifications: [
            { ...base.candidates[0].classifications[0], outcomeId: 'outcome-missing' },
          ],
        },
      ],
    };
    expect(deriveFrozenClassification(broken)).toMatchObject({
      validProblemIds: [],
      proposals: [expect.objectContaining({ problemId: 'abc500-e' })],
    });
    const danglingPrerequisite = {
      ...base,
      index: {
        ...base.index,
        tags: [base.index.tags[0], { ...base.index.tags[1], prerequisiteTagIds: ['tag-missing'] }],
      },
    };
    expect(deriveFrozenClassification(danglingPrerequisite)).toMatchObject({
      taxonomyValid: false,
      validProblemIds: [],
    });
  });

  it('resumes an on-hold operation without changing its update identity', async () => {
    const held = await runUpdatePipeline({ fixture: 'initial-v1', failAt: 'validate' });
    expect(held.state).toBe('ON_HOLD');
    const resumed = await resumeUpdate(held, { fixture: 'initial-v1' });
    expect(resumed.updateId).toBe(held.updateId);
    expect(resumed.state).toBe('ON_HOLD');
    expect(resumed.holdReasons).toEqual(['AUTHORING_REQUIRED']);
    expect(resumed.blockingFindingCount).toBe(0);
    expect(PublicationUpdateSchema.parse(resumed.publicationUpdate).updateId).toBe(held.updateId);
  });

  it('rejects resume when the persisted source fingerprint is stale', async () => {
    const held = await runUpdatePipeline({ fixture: 'initial-v1' });
    await expect(
      runUpdatePipeline({
        fixture: 'initial-v1',
        resume: { updateId: held.updateId, sourceSetFingerprint: '0'.repeat(64) },
      }),
    ).rejects.toThrow('RESUME_INPUT_MISMATCH');
  });

  it('persists a validated resume transition for the same immutable input identity', async () => {
    const outputRoot = await mkdtemp(path.join(tmpdir(), 'abc-update-resume-'));
    try {
      const held = await runUpdatePipeline({ fixture: 'initial-v1', failAt: 'validate' });
      await persistPublicationUpdate(held, outputRoot);
      const resumed = await resumeUpdate(held, { fixture: 'initial-v1' });
      await expect(persistPublicationUpdate(resumed, outputRoot)).resolves.toBeUndefined();
      const saved = PublicationUpdateSchema.parse(
        JSON.parse(await readFile(path.join(outputRoot, resumed.resultPath), 'utf8')) as unknown,
      );
      expect(saved.validationSummary.aggregatePassed).toBe(true);
      expect(saved.updateId).toBe(held.updateId);
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });
});

describe('normal batch holds', () => {
  describe('editorial order regressions', () => {
    let root: string;
    let input: Awaited<ReturnType<typeof smallBatchInput>>;
    const homePath = 'src/content/learning-units/unit-dp-transition-optimization.json';
    const relatedPath = 'src/content/learning-units/unit-modular-arithmetic.json';
    let originalHome: ReturnType<typeof LearningUnitSchema.parse>;
    let homeFile: string;
    let relatedFile: string;
    let docFile: string;
    let homeBytes: Buffer;
    let relatedBytes: Buffer;
    let docBytes: Buffer;

    beforeAll(async () => {
      root = await mkdtemp(path.join(tmpdir(), 'abc-batch-order-'));
      input = await smallBatchInput(root);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      await authorSmallBatch(input);
      originalHome = LearningUnitSchema.parse(JSON.parse(await readFile(homePath, 'utf8')));
      homeFile = path.join(root, homePath);
      relatedFile = path.join(root, relatedPath);
      homeBytes = await readFile(homeFile);
      relatedBytes = await readFile(relatedFile);
      docFile = path.join(root, originalHome.docPath);
      docBytes = await readFile(docFile);
    }, 300_000);

    afterAll(async () => {
      if (root) await rm(root, { recursive: true, force: true });
    }, 300_000);

    it.each([
      'missing-direct',
      'missing-related',
      'reordered',
      'foreign',
      'metadata',
      'prose',
      'stale-list',
    ] as const)(
      'holds %s without writing derived content',
      async (scenario) => {
        await writeFile(homeFile, homeBytes);
        await writeFile(relatedFile, relatedBytes);
        await writeFile(docFile, docBytes);
        const home = LearningUnitSchema.parse(JSON.parse(homeBytes.toString('utf8')));
        let code = 'UNIT_PROBLEM_ORDER_CONFLICT';
        if (scenario === 'missing-direct') {
          home.directProblemIds = originalHome.directProblemIds;
          code = 'UNIT_PROBLEM_ORDER_REQUIRED';
        } else if (scenario === 'missing-related') {
          await writeFile(relatedFile, await readFile(relatedPath));
          code = 'UNIT_PROBLEM_ORDER_REQUIRED';
        } else if (scenario === 'reordered') {
          home.directProblemIds?.reverse();
        } else if (scenario === 'foreign') {
          home.directProblemIds?.push('abc212-f');
        } else if (scenario === 'metadata') {
          home.learningRationale += '対象外の編集';
          code = 'UNIT_CONTENT_CONFLICT';
        } else {
          let text = docBytes.toString('utf8');
          if (scenario === 'stale-list') {
            const inserted = '- [ABC467 E「fixture」](/problems/abc467-e/) — 主題: fixture\n';
            text = text.replace('\n## 関連問題\n', `\n${inserted}\n## 関連問題\n`);
          } else text += '\n対象外の本文編集\n';
          await writeFile(docFile, text);
          code = 'UNIT_CONTENT_CONFLICT';
        }
        await writeFile(homeFile, JSON.stringify(home));
        const before = await contentHashes(root);
        const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
        expect(result, scenario).toMatchObject({
          status: 'on_hold',
          writtenPaths: [],
          holds: [expect.objectContaining({ code })],
        });
        expect(await contentHashes(root), scenario).toEqual(before);
      },
      300_000,
    );
  });

  // Multiple complete-corpus validations share the CI runner with legacy fixtures.
  it('holds incomplete/source-failed input without applying part of a batch', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-batch-hold-'));
    try {
      const input = await smallBatchInput(root);
      const snapshot = () => contentHashes(root);
      const before = await snapshot();
      const failed = {
        ...input.metadataBatch,
        sourceRevisions: input.metadataBatch.sourceRevisions.slice(1),
      };
      expect(
        await runSmallBatchUpdate({ ...input, metadataBatch: failed, mode: 'prepare' }),
      ).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(await snapshot()).toEqual(before);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      const prepared = await snapshot();
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [
          expect.objectContaining({
            code: 'AUTHORING_REQUIRED',
            retryCondition: expect.any(String) as unknown,
          }),
        ],
        writtenPaths: [],
      });
      expect(await snapshot()).toEqual(prepared);
      await authorSmallBatch(input);
      const file = path.join(root, 'src/content/docs/problems/abc467-i.md');
      const text = await readFile(file, 'utf8');
      await writeFile(
        file,
        text.replaceAll('"verificationStatus":"verified"', '"verificationStatus":"unverified"'),
      );
      const authored = await snapshot();
      const held = await runSmallBatchUpdate({ ...input, mode: 'validate' });
      expect(held).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(held.holds[0]?.reason).toContain('CLAIM_HOLD');
      expect(await snapshot()).toEqual(authored);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 300_000);

  describe('placement role and analysis regressions', () => {
    let root: string;
    let input: Awaited<ReturnType<typeof smallBatchInput>>;
    let policyFile: string;
    let originalPolicy: Buffer;
    let documentFile: string;
    let originalDocument: string;

    // Share only the authored starting fixture. Each case restores it before editing
    // and checks its own unchanged bytes; eight full validations cannot share one deadline.
    beforeAll(async () => {
      root = await mkdtemp(path.join(tmpdir(), 'abc-batch-analysis-'));
      input = await smallBatchInput(root);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      await authorSmallBatch(input);
      policyFile = path.join(root, 'src/content/policies/problem-placements.json');
      originalPolicy = await readFile(policyFile);
      documentFile = path.join(root, 'src/content/docs/problems/abc467-e.md');
      originalDocument = await readFile(documentFile, 'utf8');
    }, 300_000);

    afterAll(async () => {
      if (root) await rm(root, { recursive: true, force: true });
    }, 300_000);

    it.each([
      'primary-role',
      'supporting-role',
      'typical',
      'prerequisite',
      'insight',
      'evidence',
      'conflict',
      'review-reproduction',
    ] as const)(
      'holds %s without applying derived content',
      async (scenario) => {
        const policy = CanonicalProblemPlacementPolicySchema.parse(
          JSON.parse(originalPolicy.toString('utf8')),
        );
        const placement = policy.placements.find((p) => p.problemId === 'abc467-e');
        if (!placement) throw new Error('Missing batch placement');
        let document = originalDocument;
        let expectedCode: string;
        if (scenario === 'primary-role') {
          placement.primaryOutcomeId = 'outcome-compute-convolution-or-correlation';
          document = document.replaceAll(
            'outcome-subtract-exception-transitions',
            placement.primaryOutcomeId,
          );
          expectedCode = 'PLACEMENT_OUTCOME_ROLE_MISMATCH';
        } else if (scenario === 'supporting-role') {
          placement.supportingTagIds = [];
          // Remove the Tag-bearing decision too, isolating the missing role check.
          const claim = placement.claimDispositions.find((d) => d.kind === 'supporting');
          if (!claim) throw new Error('Missing supporting claim');
          claim.kind = 'baseline';
          claim.tagIds = [];
          expectedCode = 'PLACEMENT_OUTCOME_ROLE_MISMATCH';
        } else if (scenario === 'typical' || scenario === 'prerequisite') {
          const claimPath =
            scenario === 'typical' ? '/typicalTechniques/1' : '/prerequisiteCandidates/0';
          placement.claimDispositions = placement.claimDispositions.filter(
            (d) => d.claimRef.claimPath !== claimPath,
          );
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath !== claimPath,
          );
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE';
        } else if (scenario === 'insight') {
          placement.adHocElements = [];
          expectedCode = 'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE';
        } else if (scenario === 'evidence') {
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath !== '/prerequisiteCandidates/0',
          );
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_EVIDENCE_INCOMPLETE';
        } else if (scenario === 'conflict') {
          const claim = structuredClone(placement.claimDispositions[0]);
          if (!claim) throw new Error('Missing disposition fixture');
          claim.kind = 'baseline';
          claim.tagIds = [];
          placement.claimDispositions.push(claim);
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_CONFLICT';
        } else {
          placement.claimDispositions = placement.claimDispositions.filter(
            (d) => d.claimRef.claimPath === '/typicalTechniques/0',
          );
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath === '/typicalTechniques/0',
          );
          placement.adHocElements = [];
          expectedCode = 'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE';
        }
        policy.placementDigest = canonicalDigest(policy.placements);
        await writeFile(policyFile, JSON.stringify(policy));
        await writeFile(documentFile, document);
        const before = await contentHashes(root);
        const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
        expect(result, scenario).toMatchObject({
          status: 'on_hold',
          writtenPaths: [],
          holds: [expect.objectContaining({ code: expectedCode })],
        });
        expect(await contentHashes(root), scenario).toEqual(before);
      },
      300_000,
    );

    it('rejects a stale generated index without applying any candidate bytes', async () => {
      await writeFile(policyFile, originalPolicy);
      await writeFile(documentFile, originalDocument);
      const before = await contentHashes(root);
      const verify = publicProjection.verifyFullPublicProjectionDerivedFiles;
      const checks = vi
        .spyOn(publicProjection, 'verifyFullPublicProjectionDerivedFiles')
        .mockImplementationOnce(async (input) => {
          const file = path.join(input.repositoryRoot, publicProjection.TAXONOMY_INDEX_PATH);
          await writeFile(file, '{}');
          return verify(input);
        });
      const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
      expect(result).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(result.holds[0]?.reason).toContain('CORRECTION_INDEX_STALE');
      expect(checks).toHaveBeenCalledOnce();
      expect(await contentHashes(root)).toEqual(before);
    }, 300_000);

    it('revalidates edited canonical input after a successful call on the same candidate', async () => {
      await writeFile(policyFile, originalPolicy);
      await writeFile(documentFile, originalDocument);
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'passed',
      });
      const changed = originalDocument.replace('## 正当性\n\n', '## 正当性\n\n異なる主張。\n\n');
      expect(changed).not.toBe(originalDocument);
      await writeFile(documentFile, changed);
      const before = await contentHashes(root);
      const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
      expect(result).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(result.holds[0]?.reason).toContain('CLAIM_DRIFT');
      expect(await contentHashes(root)).toEqual(before);
    }, 300_000);
  });

  it('rejects changed acquired input, outside prose and semantic primary mismatch', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-batch-conflict-'));
    try {
      const input = await smallBatchInput(root);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      await authorSmallBatch(input);
      const source = input.metadataBatch.sourceRevisions[0];
      if (!source) throw new Error('Missing source fixture');
      const sourceFile = path.join(
        root,
        `src/content/sources/${input.metadataBatch.batchId}/${source.id}.json`,
      );
      const sourceBytes = await readFile(sourceFile);
      await writeFile(sourceFile, JSON.stringify({ ...source, fingerprint: 'f'.repeat(64) }));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [expect.objectContaining({ code: 'ACQUIRED_INPUT_CONFLICT' })],
      });
      await writeFile(sourceFile, sourceBytes);
      for (const docPath of [
        'src/content/docs/problems/dynamic-programming/outcome-subtract-exception-transitions/outcome-subtract-exception-transitions-shard-001/abc212-e.md',
        'src/content/docs/learn/dynamic-programming/index.md',
      ]) {
        const proseFile = path.join(root, docPath);
        const prose = await readFile(proseFile);
        await writeFile(proseFile, Buffer.concat([prose, Buffer.from('\n対象外の変更\n')]));
        expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
          status: 'on_hold',
          writtenPaths: [],
          holds: [expect.objectContaining({ code: 'OUTSIDE_BATCH_CHANGE' })],
        });
        await writeFile(proseFile, prose);
      }
      const policyFile = path.join(root, 'src/content/policies/problem-placements.json');
      const policy = CanonicalProblemPlacementPolicySchema.parse(
        JSON.parse(await readFile(policyFile, 'utf8')),
      );
      const placement = policy.placements.find((p) => p.problemId === 'abc467-e');
      if (!placement) throw new Error('Missing placement fixture');
      const reference = placement.analysisEvidenceRefs[0];
      if (!reference) throw new Error('Missing claim reference fixture');
      const originalPath = reference.claimPath;
      reference.claimPath = '/typicalTechniques/999';
      policy.placementDigest = canonicalDigest(policy.placements);
      await writeFile(policyFile, JSON.stringify(policy));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        writtenPaths: [],
        holds: [expect.objectContaining({ code: 'ANALYSIS_CLAIM_POINTER_STALE' })],
      });
      reference.claimPath = originalPath;
      placement.primaryOutcomeId = 'outcome-missing';
      policy.placementDigest = canonicalDigest(policy.placements);
      await writeFile(policyFile, JSON.stringify(policy));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [expect.objectContaining({ code: 'OUTCOME_OWNER_MISSING' })],
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 300_000);
});
