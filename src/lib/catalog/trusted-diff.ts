import type { z } from 'zod';

import { ProblemIdSchema, CatalogSchema } from '../domain/schema-parts/catalog.js';
import type { PublicationUpdateSchema } from '../domain/schema-parts/release.js';

type Catalog = z.infer<typeof CatalogSchema>;
type PublicationUpdate = z.infer<typeof PublicationUpdateSchema>;
type PublicationOperation = PublicationUpdate['operations'][number];

type EntityType =
  | 'contest'
  | 'contest_slot'
  | 'problem'
  | 'technique_inventory'
  | 'tag'
  | 'learning_outcome'
  | 'learning_unit'
  | 'placement'
  | 'explanation'
  | 'claim'
  | 'example'
  | 'exercise'
  | 'assessment'
  | 'answer_material'
  | 'source'
  | 'correction_impact';

const collections: readonly [keyof Catalog, EntityType][] = [
  ['contests', 'contest'],
  ['contestSlots', 'contest_slot'],
  ['problems', 'problem'],
  ['techniqueInventory', 'technique_inventory'],
  ['tags', 'tag'],
  ['learningOutcomes', 'learning_outcome'],
  ['learningUnits', 'learning_unit'],
  ['placements', 'placement'],
  ['explanations', 'explanation'],
  ['sources', 'source'],
  ['correctionImpacts', 'correction_impact'],
  ['claims', 'claim'],
  ['examples', 'example'],
  ['exercises', 'exercise'],
  ['assessments', 'assessment'],
  ['answerMaterials', 'answer_material'],
];

const collectStrings = (value: unknown): readonly string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (typeof value !== 'object' || value === null) return [];
  return Object.values(value).flatMap(collectStrings);
};

const collectProblemIds = (value: unknown): readonly string[] =>
  [
    ...new Set(
      collectStrings(value).filter((candidate) => ProblemIdSchema.safeParse(candidate).success),
    ),
  ]
    .map((candidate) => candidate.toLowerCase())
    .sort();

interface CatalogNode {
  readonly key: string;
  readonly entityType: EntityType;
  readonly aliases: ReadonlySet<string>;
  readonly value: Record<string, unknown>;
  readonly directProblemIds: readonly string[];
  readonly references: Set<string>;
}

const operationAlias = (entityType: EntityType, entityId: string): string =>
  `${entityType}\u0000${entityId}`;

const nodeAliases = (entityType: EntityType, value: Record<string, unknown>): Set<string> => {
  const aliases = new Set<string>();
  if (typeof value.id === 'string') aliases.add(value.id);
  if (typeof value.problemId === 'string') aliases.add(value.problemId);
  if (entityType === 'contest_slot') {
    const contestId = typeof value.contestId === 'string' ? value.contestId : undefined;
    const label = typeof value.label === 'string' ? value.label : undefined;
    if (contestId && label) {
      aliases.add(`${contestId}:${label}`);
      aliases.add(`contest-slot-${contestId}-${label}`);
      aliases.add(`${contestId}-${label}`);
    }
  }
  if (entityType === 'technique_inventory' && typeof value.problemId === 'string') {
    aliases.add(`technique-inventory-${value.problemId}`);
  }
  return aliases;
};

class CatalogGraph {
  private readonly nodes = new Map<string, CatalogNode>();
  private readonly byTypeAndAlias = new Map<string, CatalogNode>();
  private readonly byAlias = new Map<string, CatalogNode[]>();
  private readonly reverseReferences = new Map<string, Set<string>>();

  constructor(catalog: Catalog | undefined) {
    if (!catalog) return;
    for (const [collection, entityType] of collections) {
      const values = catalog[collection];
      if (!Array.isArray(values)) continue;
      values.forEach((value, index) => {
        const record = value as Record<string, unknown>;
        const aliases = nodeAliases(entityType, record);
        if (aliases.size === 0) return;
        const firstAlias = [...aliases][0];
        if (!firstAlias) return;
        const key = `${entityType}:${firstAlias}:${String(index)}`;
        const node: CatalogNode = {
          key,
          entityType,
          aliases,
          value: record,
          directProblemIds: collectProblemIds(record),
          references: new Set(),
        };
        this.nodes.set(key, node);
        for (const alias of aliases) {
          this.byTypeAndAlias.set(operationAlias(entityType, alias), node);
          const nodes = this.byAlias.get(alias) ?? [];
          nodes.push(node);
          this.byAlias.set(alias, nodes);
        }
      });
    }

    for (const node of this.nodes.values()) {
      for (const reference of collectStrings(node.value)) {
        for (const target of this.byAlias.get(reference) ?? []) {
          node.references.add(target.key);
          const reverse = this.reverseReferences.get(target.key) ?? new Set<string>();
          reverse.add(node.key);
          this.reverseReferences.set(target.key, reverse);
        }
      }
    }
  }

  resolve(entityType: EntityType, entityId: string): CatalogNode | undefined {
    return this.byTypeAndAlias.get(operationAlias(entityType, entityId));
  }

  referencedNodes(node: CatalogNode): readonly CatalogNode[] {
    return [...node.references]
      .map((key) => this.nodes.get(key))
      .filter((value): value is CatalogNode => value !== undefined);
  }

  problemIdsOwnedBy(node: CatalogNode): readonly string[] {
    const problemIds = new Set<string>();
    const pending = [node.key];
    const visited = new Set<string>();
    while (pending.length > 0) {
      const key = pending.pop();
      if (!key || visited.has(key)) continue;
      visited.add(key);
      const current = this.nodes.get(key);
      if (!current) continue;
      for (const problemId of current.directProblemIds) problemIds.add(problemId);
      for (const ownerKey of this.reverseReferences.get(key) ?? []) pending.push(ownerKey);
    }
    return [...problemIds].sort();
  }

  problemIdsOwnedByReferences(node: CatalogNode): readonly string[] {
    const problemIds = new Set<string>(this.problemIdsOwnedBy(node));
    for (const referenced of this.referencedNodes(node)) {
      for (const problemId of this.problemIdsOwnedBy(referenced)) problemIds.add(problemId);
    }
    return [...problemIds].sort();
  }
}

export class TrustedCatalogDiffError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = 'TrustedCatalogDiffError';
    this.code = code;
  }
}

export interface TrustedOperationOwnership {
  readonly operationId: string;
  readonly affectedProblemIds: readonly string[];
  readonly entityType: PublicationOperation['entityType'];
  readonly entityId: string;
  readonly action: PublicationOperation['action'];
  readonly path: string;
  readonly beforeDigest: string | null;
  readonly afterDigest: string | null;
}

export interface TrustedCorrectionImpact {
  readonly correctionImpactId: string;
  readonly affectedProblemIds: readonly string[];
  readonly operationIds: readonly string[];
}

export interface TrustedUpdateDiff {
  readonly updateId: string;
  readonly operationOwnership: readonly TrustedOperationOwnership[];
  readonly correctionImpacts: readonly TrustedCorrectionImpact[];
}

export interface TrustedPublicationDiff {
  readonly updates: readonly TrustedUpdateDiff[];
}

interface CatalogGraphPair {
  readonly base: CatalogGraph;
  readonly current: CatalogGraph;
}

const resolveNodes = (
  pair: CatalogGraphPair,
  operation: PublicationOperation,
): readonly CatalogNode[] => {
  const base = pair.base.resolve(operation.entityType, operation.entityId);
  const current = pair.current.resolve(operation.entityType, operation.entityId);
  if (operation.action === 'add' && (!current || base)) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_ENTITY_DIFF_INVALID',
      `${operation.operationId} adds an entity that is not newly present in the current Catalog.`,
    );
  }
  if (operation.action === 'remove' && (!base || current)) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_ENTITY_DIFF_INVALID',
      `${operation.operationId} removes an entity that is not absent from the current Catalog or missing from the base Catalog.`,
    );
  }
  if (operation.action === 'replace' && (!base || !current)) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_ENTITY_DIFF_INVALID',
      `${operation.operationId} replaces an entity that is not present in both Catalogs.`,
    );
  }
  const nodes = [base, current].filter((value): value is CatalogNode => value !== undefined);
  if (nodes.length === 0) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_ENTITY_NOT_FOUND',
      `Cannot resolve ${operation.entityType}:${operation.entityId} in the trusted Catalogs.`,
    );
  }
  return nodes;
};

const unionProblemIds = (values: readonly (readonly string[])[]): readonly string[] =>
  [...new Set(values.flat())].sort();

const operationProblemIds = (
  pair: CatalogGraphPair,
  operation: PublicationOperation,
): readonly string[] => {
  const nodes = resolveNodes(pair, operation);
  const problemIds = unionProblemIds(
    nodes.map((node) =>
      node.entityType === 'correction_impact'
        ? unionProblemIds([
            pair.base.problemIdsOwnedByReferences(node),
            pair.current.problemIdsOwnedByReferences(node),
          ])
        : unionProblemIds([
            pair.base.problemIdsOwnedBy(node),
            pair.current.problemIdsOwnedBy(node),
          ]),
    ),
  );
  if (problemIds.length === 0) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_OWNERSHIP_UNDERIVED',
      `Cannot derive Problem ownership from the trusted ${operation.entityType}:${operation.entityId} Catalog diff.`,
    );
  }
  return problemIds;
};

const correctionImpactTargets = (
  pair: CatalogGraphPair,
  impactId: string,
): readonly { readonly graph: CatalogGraph; readonly node: CatalogNode }[] => {
  const matches = [
    [pair.base, pair.base.resolve('correction_impact', impactId)],
    [pair.current, pair.current.resolve('correction_impact', impactId)],
  ] as const;
  const resolved = matches.filter(
    (value): value is readonly [CatalogGraph, CatalogNode] => value[1] !== undefined,
  );
  if (resolved.length === 0) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_CORRECTION_IMPACT_NOT_FOUND',
      `Correction Impact ${impactId} is not present in the trusted current or base Catalog.`,
    );
  }
  return resolved.map(([graph, node]) => ({ graph, node }));
};

const impactPaths = (node: CatalogNode): readonly string[] => {
  const paths = node.value.derivedIndexPaths;
  return Array.isArray(paths) && paths.every((value) => typeof value === 'string') ? paths : [];
};

const deriveCorrectionImpacts = (
  update: PublicationUpdate,
  pair: CatalogGraphPair,
  operations: readonly TrustedOperationOwnership[],
): readonly TrustedCorrectionImpact[] =>
  update.correctionImpactIds.map((impactId) => {
    const targets = correctionImpactTargets(pair, impactId);
    const targetKeys = new Set<string>();
    const paths = new Set<string>();
    const problemIds = new Set<string>();
    for (const { graph, node } of targets) {
      targetKeys.add(node.key);
      for (const target of graph.referencedNodes(node)) targetKeys.add(target.key);
      for (const path of impactPaths(node)) paths.add(path);
      for (const problemId of graph.problemIdsOwnedByReferences(node)) problemIds.add(problemId);
    }
    const operationIds = operations
      .filter((operation) => {
        const resolved = [
          pair.base.resolve(operation.entityType, operation.entityId),
          pair.current.resolve(operation.entityType, operation.entityId),
        ].filter((value): value is CatalogNode => value !== undefined);
        return (
          resolved.some((node) => targetKeys.has(node.key)) ||
          paths.has(operation.path) ||
          (operation.entityType === 'correction_impact' && operation.entityId === impactId)
        );
      })
      .map(({ operationId }) => operationId);
    if (operationIds.length === 0) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
        `Correction Impact ${impactId} does not match any trusted Catalog operation.`,
      );
    }
    for (const operationId of operationIds) {
      const operation = operations.find((candidate) => candidate.operationId === operationId);
      if (operation)
        for (const problemId of operation.affectedProblemIds) problemIds.add(problemId);
    }
    if (problemIds.size === 0) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
        `Correction Impact ${impactId} has no trusted affected Problem.`,
      );
    }
    return {
      correctionImpactId: impactId,
      affectedProblemIds: [...problemIds].sort(),
      operationIds: [...new Set(operationIds)].sort(),
    };
  });

export const buildTrustedPublicationDiff = (
  updates: readonly PublicationUpdate[],
  baseCatalog: Catalog | undefined,
  currentCatalog: Catalog,
): TrustedPublicationDiff => {
  const pair: CatalogGraphPair = {
    base: new CatalogGraph(baseCatalog),
    current: new CatalogGraph(currentCatalog),
  };
  return {
    updates: updates.map((update) => {
      const operationOwnership = update.operations.map((operation) => ({
        operationId: operation.operationId,
        affectedProblemIds: operationProblemIds(pair, operation),
        entityType: operation.entityType,
        entityId: operation.entityId,
        action: operation.action,
        path: operation.path,
        beforeDigest: operation.beforeDigest,
        afterDigest: operation.afterDigest,
      }));
      return {
        updateId: update.updateId,
        operationOwnership,
        correctionImpacts:
          update.kind === 'correction'
            ? deriveCorrectionImpacts(update, pair, operationOwnership)
            : [],
      };
    }),
  };
};

export const parseTrustedCatalog = (value: unknown, label: string): Catalog => {
  const result = CatalogSchema.safeParse(value);
  if (!result.success) {
    throw new TrustedCatalogDiffError(
      'CANONICAL_CATALOG_SCHEMA_INVALID',
      `${label}: ${result.error.message}`,
    );
  }
  return result.data;
};
