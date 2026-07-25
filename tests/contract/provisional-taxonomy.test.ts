import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { previewComponentOutputDigest } from '../../src/lib/preview/preview-chain.js';
import {
  buildProvisionalTaxonomyArtifacts,
  validateProvisionalTaxonomyArtifacts,
  type ProvisionalTaxonomyBuildInput,
} from '../../src/lib/preview/provisional-taxonomy.js';

const digest = (character: string): string => character.repeat(64);

const problems = [
  {
    problemId: 'abc218-f',
    sourceRevisionIds: ['source-abc218-f-problem', 'source-abc218-f-editorial'],
    outcomeCandidates: ['最短路構造を復元し、変更の影響範囲を限定できる。'],
    reviewStatus: 'reviewed' as const,
  },
  {
    problemId: 'abc252-e',
    sourceRevisionIds: ['source-abc252-e-problem', 'source-abc252-e-editorial'],
    outcomeCandidates: ['最短路木を構成し、採用辺の正当性を説明できる。'],
    reviewStatus: 'reviewed' as const,
  },
  {
    problemId: 'abc215-e',
    sourceRevisionIds: ['source-abc215-e-problem', 'source-abc215-e-editorial'],
    outcomeCandidates: ['同値な状態を圧縮して動的計画法を設計できる。'],
    reviewStatus: 'reviewed' as const,
  },
  {
    problemId: 'abc232-e',
    sourceRevisionIds: ['source-abc232-e-problem', 'source-abc232-e-editorial'],
    outcomeCandidates: ['対称性を使って状態を圧縮できる。'],
    reviewStatus: 'reviewed' as const,
  },
] as const;

const classifications = [
  {
    problemId: 'abc218-f',
    classifications: [
      {
        domain: 'graph-search',
        outcomeId: 'outcome-candidate-shortest-path-structure',
        rationale: 'BFSで復元した最短路だけを再計算対象にする。',
      },
    ],
  },
  {
    problemId: 'abc252-e',
    classifications: [
      {
        domain: 'graph-search',
        outcomeId: 'outcome-candidate-shortest-path-structure',
        rationale: 'Dijkstraの直前辺から最短路木を構成する。',
      },
    ],
  },
  {
    problemId: 'abc215-e',
    classifications: [
      {
        domain: 'dynamic-programming',
        outcomeId: 'outcome-candidate-compressed-dp-state',
        rationale: '集合と末尾だけを状態に持つ。',
      },
    ],
  },
  {
    problemId: 'abc232-e',
    classifications: [
      {
        domain: 'dynamic-programming',
        outcomeId: 'outcome-candidate-compressed-dp-state',
        rationale: '目標行・列との一致だけを状態に持つ。',
      },
    ],
  },
] as const;

const proposalGroups = [
  {
    slug: 'shortest-path-structure',
    domain: 'graph-search',
    candidateOutcomeId: 'outcome-candidate-shortest-path-structure',
    problemIds: ['abc218-f', 'abc252-e'],
    tagName: '最短路構造',
    tagDefinition: '最短路の距離だけでなく、経路・木・変更影響を扱うための技法。',
    outcomeStatement: '最短路の構造を復元し、必要な部分だけを再計算できる。',
    unitTitle: '最短路の構造を利用する',
    rationale: '異なるContestのBFSとDijkstraを、最短路構造の再利用という成果で統合する。',
  },
  {
    slug: 'compressed-dp-state',
    domain: 'dynamic-programming',
    candidateOutcomeId: 'outcome-candidate-compressed-dp-state',
    problemIds: ['abc215-e', 'abc232-e'],
    tagName: '状態圧縮DP',
    tagDefinition: '将来の遷移に必要な同値類だけを状態として保持する動的計画法。',
    outcomeStatement: '対称性や履歴の同値性を使い、十分な最小状態を設計できる。',
    unitTitle: '同値性からDP状態を圧縮する',
    rationale: '履歴集合と盤面座標という異なる対象を、十分統計量の設計として統合する。',
  },
] as const;

const buildInput = (): ProvisionalTaxonomyBuildInput => {
  const manifest = {
    previewId: 'initial-v1',
    manifestDigest: digest('a'),
    selectedProblemIds: ['abc218-f', 'abc252-e', 'abc215-e', 'abc232-e'],
    sourceRevisionIds: problems.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    expectedDomains: ['graph-search', 'dynamic-programming'],
    minimumProblemsPerOutcome: 2,
  };
  const inventoryArtifactDigest = canonicalDigest({
    items: [...problems].sort((left, right) => left.problemId.localeCompare(right.problemId)),
  });
  const inventorySubject = {
    componentId: 'technique-inventory',
    previewId: manifest.previewId,
    manifestDigest: manifest.manifestDigest,
    problemIds: manifest.selectedProblemIds,
    inputDigest: manifest.manifestDigest,
    artifactDigest: inventoryArtifactDigest,
  };
  return {
    manifest,
    inventoryComponent: {
      ...inventorySubject,
      outputDigest: previewComponentOutputDigest(inventorySubject),
    },
    inventoryItems: problems,
    classifications,
    proposal: {
      schemaVersion: '1.0.0',
      previewId: 'initial-v1',
      ownerId: 'person-maintainer',
      frozenAt: '2026-07-26T09:00:00+09:00',
      groups: proposalGroups,
    },
  };
};

describe('T045/T046 provisional taxonomy boundary', () => {
  it('builds deterministic staging-only taxonomy, review units, and component evidence', () => {
    const input = buildInput();
    const first = buildProvisionalTaxonomyArtifacts(input);
    const second = buildProvisionalTaxonomyArtifacts(structuredClone(input));

    expect(second).toEqual(first);
    expect(validateProvisionalTaxonomyArtifacts(input, first)).toEqual([]);
    expect(first.taxonomy.canonicalMaterializationAllowed).toBe(false);
    expect(first.taxonomy.finalSynthesisTask).toBe('T159');
    expect(first.taxonomy.problemIds).toEqual(input.manifest.selectedProblemIds);
    expect(first.taxonomy.tags).toHaveLength(2);
    expect(first.taxonomy.outcomes).toHaveLength(2);
    expect(first.taxonomy.units).toHaveLength(2);
    expect(first.taxonomy.placements).toHaveLength(4);
    expect(first.groups.every(({ path }) => path.startsWith('staging/previews/initial-v1/'))).toBe(
      true,
    );
    expect(first.workManifest.reviewUnits).toHaveLength(2);
    expect(
      first.workManifest.reviewUnits
        .flatMap(({ itemIds }) => itemIds)
        .filter((id) => id.startsWith('problem:')),
    ).toHaveLength(4);
    expect(first.component.componentId).toBe('metadata-inventory-taxonomy');
    expect(first.component.inputDigest).toBe(input.manifest.manifestDigest);
  });

  it('freezes all four final-integration action assessments without claiming a final decision', () => {
    const artifacts = buildProvisionalTaxonomyArtifacts(buildInput());

    expect(artifacts.integration.canonicalMaterializationAllowed).toBe(false);
    expect(artifacts.integration.finalDecisionTask).toBe('T159');
    expect(artifacts.integration.candidates).toHaveLength(6);
    for (const candidate of artifacts.integration.candidates) {
      expect(candidate.finalDecision).toBeNull();
      expect(candidate.finalEntityIds).toEqual([]);
      expect(candidate.actionAssessments.map(({ action }) => action)).toEqual([
        'promote',
        'merge',
        'split',
        'retire',
      ]);
      expect(candidate.affectedProblemIds.length).toBeGreaterThan(0);
      expect(candidate.rationale.length).toBeGreaterThan(0);
      expect(candidate.evidenceIds.length).toBeGreaterThan(0);
      expect(candidate.reviewPolicy.requiredMode).toBe('third_party');
      expect(candidate.reviewPolicy.riskReasons).toEqual(['major_classification_change']);
    }
  });

  it('rejects incomplete, overlapping, stale, or canonical-bound proposals', () => {
    const base = buildInput();
    const firstGroup = base.proposal.groups[0];
    const secondGroup = base.proposal.groups[1];
    if (!firstGroup || !secondGroup) throw new Error('Taxonomy proposal groups are missing.');
    const incomplete = {
      ...base,
      proposal: {
        ...base.proposal,
        groups: [
          { ...firstGroup, problemIds: firstGroup.problemIds.slice(0, -1) },
          ...base.proposal.groups.slice(1),
        ],
      },
    };
    expect(() => buildProvisionalTaxonomyArtifacts(incomplete)).toThrow(/PROBLEM_COVERAGE/iu);

    const overlapping = {
      ...base,
      proposal: {
        ...base.proposal,
        groups: [
          firstGroup,
          { ...secondGroup, problemIds: [...secondGroup.problemIds, 'abc218-f'] },
        ],
      },
    };
    expect(() => buildProvisionalTaxonomyArtifacts(overlapping)).toThrow(/PROBLEM_OVERLAP/iu);

    const unsafeDomain = {
      ...base,
      proposal: {
        ...base.proposal,
        groups: [{ ...firstGroup, domain: '../canonical' }, secondGroup],
      },
    };
    expect(() => buildProvisionalTaxonomyArtifacts(unsafeDomain)).toThrow(/PROPOSAL_INVALID/iu);

    const stale = {
      ...base,
      inventoryComponent: { ...base.inventoryComponent, outputDigest: digest('f') },
    };
    expect(() => buildProvisionalTaxonomyArtifacts(stale)).toThrow(/INVENTORY_COMPONENT/iu);

    const canonical = buildProvisionalTaxonomyArtifacts(base);
    const changed = {
      ...canonical,
      groups: canonical.groups.map((group, index) =>
        index === 0 ? { ...group, path: 'src/content/tags/shortest-path-structure.json' } : group,
      ),
    };
    expect(validateProvisionalTaxonomyArtifacts(base, changed)).toContain(
      'canonical_path_forbidden:src/content/tags/shortest-path-structure.json',
    );
  });
});
