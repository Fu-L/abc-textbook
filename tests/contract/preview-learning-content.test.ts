import { describe, expect, it } from 'vitest';

import {
  buildPreviewLearningContentArtifacts,
  validatePreviewLearningContentArtifacts,
  type PreviewLearningContentBuildInput,
} from '../../src/lib/preview/learning-content.js';

const digest = (character: string): string => character.repeat(64);

const buildInput = (): PreviewLearningContentBuildInput => ({
  manifest: {
    previewId: 'initial-v1',
    manifestDigest: digest('a'),
    candidatePoolDigest: digest('b'),
    selectedProblemIds: ['abc218-f', 'abc252-e'],
    sourceRevisionIds: ['source-abc218-f-problem', 'source-abc252-e-problem'],
  },
  taxonomyDigest: digest('c'),
  authoringSkill: {
    version: '1.1.1',
    digest: digest('d'),
    sourcePacketDigest: digest('e'),
  },
  domain: {
    taskId: 'T051',
    domain: 'graph-search',
    directory: 'graph-search',
    frozenAt: '2026-07-28T09:00:00+09:00',
    ownerId: 'person-maintainer',
    expectedProblemIds: ['abc218-f', 'abc252-e'],
    expectedSourceRevisionIds: ['source-abc218-f-problem', 'source-abc252-e-problem'],
    outcome: {
      id: 'outcome-provisional-shortest-path-structure',
      statement: '最短路構造を復元し、再計算範囲や構成へ利用できる。',
    },
    unit: {
      id: 'provisional-unit-shortest-path-structure',
      title: '最短路を構造として利用する',
      prerequisiteUnitIds: [],
      excludedTopics: ['負辺を含む最短路'],
      tagIds: ['provisional-tag-shortest-path-structure'],
      problemIds: ['abc218-f', 'abc252-e'],
      sourceRevisionIds: ['source-abc218-f-problem', 'source-abc252-e-problem'],
      explanation: '距離だけでなく、親辺や経路を復元して後続処理へ再利用する。',
      examples: [
        {
          key: 'path-recovery',
          learningOutcomeIds: ['outcome-provisional-shortest-path-structure'],
          kind: 'illustrative',
          language: 'text',
          omissions: [],
          environment: '紙と筆記具',
          input: '1→2→4 と 1→3→4 の2本の最短路',
          procedure: ['BFSの親辺を一つ記録する。', '終点から親を逆にたどる。'],
          executionTarget: null,
          expectedResult: '選ばれた1本の最短路の辺列を復元できる。',
          verificationStatus: 'not_applicable',
        },
      ],
      exercises: [
        {
          key: 'attainment',
          learningOutcomeIds: ['outcome-provisional-shortest-path-structure'],
          prerequisiteIds: [],
          attainmentCondition: '再計算が必要な辺を説明できる。',
          assessment: {
            method: '短答',
            successCondition: '基準最短路外の辺を除外できる。',
          },
          answer: {
            reasoningOrVerification: '基準最短路に含まれない辺を削除しても基準経路は残る。',
            procedure: ['基準経路を復元する。', '削除辺が経路上か判定する。'],
            expectedResult: '経路上の辺だけ再BFS対象になる。',
            verificationStatus: 'passed',
          },
        },
      ],
      navigation: { previousUnitId: null, nextUnitId: null, orderReason: '前提を持たない。' },
    },
  },
});

describe('T051-T054 preview learning content', () => {
  it('builds deterministic staging-only content, manifest, and current-subject evidence', () => {
    const input = buildInput();
    const first = buildPreviewLearningContentArtifacts(input);
    const second = buildPreviewLearningContentArtifacts(structuredClone(input));

    expect(second).toEqual(first);
    expect(validatePreviewLearningContentArtifacts(input, first)).toEqual([]);
    expect(first.learningUnit.canonicalMaterializationAllowed).toBe(false);
    expect(first.workManifest.taskId).toBe('T051');
    expect(first.component.componentId).toBe('content-graph-search');
    expect(first.component.authoringSkillVersion).toBe('1.1.1');
    expect(first.component.checkResults.every(({ passed }) => passed)).toBe(true);
    expect(first.component.reviewEvidence[0]?.aggregatePassed).toBe(true);
  });

  it('rejects cohort, source, skill, and publication-boundary mismatches', () => {
    const input = buildInput();
    const badProblem = structuredClone(input);
    badProblem.domain.unit.problemIds = ['abc218-f'];
    expect(() => buildPreviewLearningContentArtifacts(badProblem)).toThrow(/COHORT/iu);

    const badSource = structuredClone(input);
    badSource.domain.unit.sourceRevisionIds = ['source-unknown'];
    expect(() => buildPreviewLearningContentArtifacts(badSource)).toThrow(/SOURCE/iu);

    const artifacts = buildPreviewLearningContentArtifacts(input);
    const changed = {
      ...artifacts,
      learningUnitPath: 'src/content/learning-units/shortest-path.json',
    };
    expect(validatePreviewLearningContentArtifacts(input, changed)).toContain(
      'canonical_path_forbidden:src/content/learning-units/shortest-path.json',
    );
  });
});
