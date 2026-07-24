import type { z } from 'zod';

import { canonicalJson } from '../domain/canonical-json.js';
import { ProblemIdSchema, CatalogSchema } from '../domain/schema-parts/catalog.js';
import type { PublicationUpdateSchema } from '../domain/schema-parts/release.js';
import { structuredContentRoots } from './content-source-registry.js';

type Catalog = z.infer<typeof CatalogSchema>;
type PublicationUpdate = z.infer<typeof PublicationUpdateSchema>;
type PublicationOperation = PublicationUpdate['operations'][number];

type EntityType =
  | 'contest'
  | 'contest_gap'
  | 'contest_slot'
  | 'problem'
  | 'technique_inventory'
  | 'tag'
  | 'learning_outcome'
  | 'learning_unit'
  | 'placement'
  | 'authoring_unit'
  | 'source'
  | 'correction_impact';

const collections: readonly [keyof Catalog, EntityType][] = [
  ['contests', 'contest'],
  ['contestGaps', 'contest_gap'],
  ['contestSlots', 'contest_slot'],
  ['problems', 'problem'],
  ['techniqueInventory', 'technique_inventory'],
  ['tags', 'tag'],
  ['learningOutcomes', 'learning_outcome'],
  ['learningUnits', 'learning_unit'],
  ['placements', 'placement'],
  ['authoringUnits', 'authoring_unit'],
  ['sources', 'source'],
  ['correctionImpacts', 'correction_impact'],
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
  readonly identity: string;
  readonly aliases: ReadonlySet<string>;
  readonly value: Record<string, unknown>;
  readonly projection: string;
  readonly directProblemIds: readonly string[];
  readonly references: Set<string>;
}

const operationAlias = (entityType: EntityType, entityId: string): string =>
  `${entityType}\u0000${entityId}`;

const contestSlotOperationId = (contestId: string, label: string): string =>
  `contest-slot-${contestId}-${label.toLocaleLowerCase('en-US')}`;

const operationEntityId = (node: CatalogNode): string => {
  if (node.entityType !== 'contest_slot') return node.identity;
  const contestId = typeof node.value.contestId === 'string' ? node.value.contestId : undefined;
  const label = typeof node.value.label === 'string' ? node.value.label : undefined;
  return contestId && label ? contestSlotOperationId(contestId, label) : node.identity;
};

const canonicalEntityIdentity = (
  entityType: EntityType,
  value: Record<string, unknown>,
): string | undefined => {
  if (entityType === 'contest_gap' && typeof value.contestId === 'string') {
    return value.contestId;
  }
  if (entityType === 'contest_slot') {
    const contestId = typeof value.contestId === 'string' ? value.contestId : undefined;
    const label = typeof value.label === 'string' ? value.label : undefined;
    if (contestId && label) return `${contestId}:${label.toLocaleUpperCase('en-US')}`;
  }
  if (
    (entityType === 'technique_inventory' || entityType === 'authoring_unit') &&
    typeof value.problemId === 'string'
  ) {
    return value.problemId;
  }
  return typeof value.id === 'string' ? value.id : undefined;
};

const nodeAliases = (entityType: EntityType, value: Record<string, unknown>): Set<string> => {
  const aliases = new Set<string>();
  const identity = canonicalEntityIdentity(entityType, value);
  if (identity) aliases.add(identity);
  if (typeof value.id === 'string') aliases.add(value.id);
  if (typeof value.problemId === 'string') aliases.add(value.problemId);
  if (entityType === 'contest_slot') {
    const contestId = typeof value.contestId === 'string' ? value.contestId : undefined;
    const label = typeof value.label === 'string' ? value.label : undefined;
    if (contestId && label) {
      aliases.add(`${contestId}:${label}`);
      aliases.add(`contest-slot-${contestId}-${label}`);
      aliases.add(`${contestId}-${label}`);
      aliases.add(contestSlotOperationId(contestId, label));
    }
  }
  if (
    (entityType === 'technique_inventory' || entityType === 'authoring_unit') &&
    typeof value.problemId === 'string'
  ) {
    aliases.add(`${entityType.replace('_', '-')}-${value.problemId}`);
  }
  return aliases;
};

class CatalogGraph {
  private readonly nodes = new Map<string, CatalogNode>();
  private readonly nodesByEntityKey = new Map<string, CatalogNode>();
  private readonly byTypeAndAlias = new Map<string, CatalogNode>();
  private readonly byAlias = new Map<string, CatalogNode[]>();
  private readonly reverseReferences = new Map<string, Set<string>>();
  private readonly sourceFiles:
    ReadonlyMap<string, TrustedCatalogSourceInventory['baseFiles'][number]> | undefined;

  constructor(
    catalog: Catalog | undefined,
    sourceFiles?: readonly TrustedCatalogSourceInventory['baseFiles'][number][],
  ) {
    if (sourceFiles !== undefined) {
      const files = new Map(sourceFiles.map((file) => [file.path, file] as const));
      if (files.size !== sourceFiles.length) {
        throw new TrustedCatalogDiffError(
          'TRUSTED_SOURCE_INVENTORY_DUPLICATE',
          'Trusted source inventories must contain unique paths.',
        );
      }
      this.sourceFiles = files;
    }
    if (!catalog) return;
    for (const [collection, entityType] of collections) {
      const values = catalog[collection];
      if (!Array.isArray(values)) continue;
      values.forEach((value, index) => {
        const record = value as Record<string, unknown>;
        const identity = canonicalEntityIdentity(entityType, record);
        if (!identity) {
          throw new TrustedCatalogDiffError(
            'CANONICAL_CATALOG_ENTITY_ID_INVALID',
            `${entityType} at index ${String(index)} has no stable identity.`,
          );
        }
        const aliases = nodeAliases(entityType, record);
        const entityKey = operationAlias(entityType, identity);
        if (this.nodesByEntityKey.has(entityKey)) {
          throw new TrustedCatalogDiffError(
            'CANONICAL_CATALOG_ENTITY_DUPLICATE',
            `${entityType}:${identity} occurs more than once in the Catalog.`,
          );
        }
        const firstAlias = [...aliases][0];
        if (!firstAlias) {
          throw new TrustedCatalogDiffError(
            'CANONICAL_CATALOG_ENTITY_ID_INVALID',
            `${entityType}:${identity} has no resolvable alias.`,
          );
        }
        let projection: string;
        try {
          projection = canonicalJson(record);
        } catch (error) {
          throw new TrustedCatalogDiffError(
            'CANONICAL_CATALOG_PROJECTION_INVALID',
            `${entityType}:${identity} is not canonical JSON: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
        const key = `${entityType}:${firstAlias}:${String(index)}`;
        const node: CatalogNode = {
          key,
          entityType,
          identity,
          aliases,
          value: record,
          projection,
          directProblemIds: collectProblemIds(record),
          references: new Set(),
        };
        this.nodes.set(key, node);
        this.nodesByEntityKey.set(entityKey, node);
        for (const alias of aliases) {
          const aliasKey = operationAlias(entityType, alias);
          const previous = this.byTypeAndAlias.get(aliasKey);
          if (previous && previous !== node) {
            throw new TrustedCatalogDiffError(
              'CANONICAL_CATALOG_ENTITY_ALIAS_DUPLICATE',
              `${entityType}:${alias} resolves to more than one Catalog entity.`,
            );
          }
          this.byTypeAndAlias.set(aliasKey, node);
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

  entityNodes(): readonly CatalogNode[] {
    return [...this.nodesByEntityKey.values()];
  }

  hasSourceInventory(): boolean {
    return this.sourceFiles !== undefined;
  }

  sourcePaths(node: CatalogNode): readonly string[] {
    const declaredPaths = declaredSourcePaths(node);
    const root = structuredEntityRoots[node.entityType];
    const discoveredPaths = this.sourceFiles
      ? [...this.sourceFiles.keys()].filter((candidatePath) => nodeOwnsPath(node, candidatePath))
      : [];
    const discoveredStructuredPaths = root
      ? discoveredPaths.filter((candidatePath) => pathHasRoot(candidatePath, root))
      : [];
    const structuredPaths =
      discoveredStructuredPaths.length > 0
        ? discoveredStructuredPaths
        : root
          ? structuredFallbackSourcePaths(node)
          : [];
    return [...new Set([...declaredPaths, ...structuredPaths])].sort();
  }

  sourceDigest(sourcePath: string): string | undefined {
    return this.sourceFiles?.get(sourcePath)?.sha256;
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
  readonly affectedEntities: readonly TrustedEntityDiffReference[];
}

export interface TrustedEntityDiffReference {
  readonly entityType: EntityType;
  readonly entityId: string;
  readonly action: 'add' | 'replace' | 'remove';
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

/**
 * The immutable before/after source inventory rebuilt from the repository.
 * Catalog records intentionally do not contain file bytes, so the trusted
 * diff also compares the digest of each source path owned by an entity.
 */
export interface TrustedCatalogSourceInventory {
  readonly baseFiles: readonly {
    readonly path: string;
    readonly sha256: string;
    readonly byteLength: number;
  }[];
  readonly currentFiles: readonly {
    readonly path: string;
    readonly sha256: string;
    readonly byteLength: number;
  }[];
}

interface CatalogGraphPair {
  readonly base: CatalogGraph;
  readonly current: CatalogGraph;
}

interface CatalogEntityDiff {
  readonly key: string;
  readonly entityType: EntityType;
  readonly entityId: string;
  readonly action: PublicationOperation['action'];
  readonly base: CatalogNode | undefined;
  readonly current: CatalogNode | undefined;
  readonly changedSourcePaths: readonly string[];
}

const structuredEntityRoots: Readonly<Partial<Record<EntityType, string>>> = {
  contest: structuredContentRoots.contests,
  contest_gap: structuredContentRoots.contestGaps,
  contest_slot: structuredContentRoots.problemSlots,
  problem: structuredContentRoots.problems,
  technique_inventory: structuredContentRoots.techniqueInventory,
  tag: structuredContentRoots.tags,
  learning_outcome: structuredContentRoots.learningOutcomes,
  learning_unit: structuredContentRoots.learningUnits,
  source: structuredContentRoots.sources,
};

const pathBasename = (value: string): string => value.slice(value.lastIndexOf('/') + 1);

const pathHasRoot = (value: string, root: string): boolean =>
  value.startsWith(`${root}/`) && value.endsWith('.json');

const structuredFileNames = (node: CatalogNode): readonly string[] => {
  const candidates = new Set<string>();
  candidates.add(node.identity);
  if (typeof node.value.id === 'string') candidates.add(node.value.id);
  if (typeof node.value.problemId === 'string') candidates.add(node.value.problemId);
  if (node.entityType === 'contest_slot') {
    const contestId = typeof node.value.contestId === 'string' ? node.value.contestId : undefined;
    const label = typeof node.value.label === 'string' ? node.value.label : undefined;
    if (contestId && label) {
      candidates.add(contestSlotOperationId(contestId, label));
      candidates.add(`${contestId}-${label.toLocaleLowerCase('en-US')}`);
      candidates.add(`${contestId}_${label.toLocaleLowerCase('en-US')}`);
      candidates.add(contestId);
    }
  }
  return [...candidates];
};

/**
 * Canonical source ownership for Catalog entities.
 *
 * Structured records are one JSON object per file, with arbitrary shard
 * directories allowed below their collection root. Explanations and learning
 * units additionally own their declared Markdown docPath. A Markdown file may
 * therefore be owned by multiple entity projections. File transitions are
 * represented once per path; affected Catalog entity diffs are derived below.
 */
const nodeOwnsPath = (node: CatalogNode, candidatePath: string): boolean => {
  if (!candidatePath.startsWith('src/content/')) return false;
  if (node.entityType === 'authoring_unit' || node.entityType === 'learning_unit') {
    if (node.value.docPath === candidatePath) return true;
  }
  if (node.entityType === 'placement') {
    return candidatePath === 'src/content/policies/problem-placements.json';
  }
  if (node.entityType === 'correction_impact') {
    const paths = impactPaths(node);
    return paths.includes(candidatePath);
  }
  const root = structuredEntityRoots[node.entityType];
  if (!root || !pathHasRoot(candidatePath, root)) return false;
  const basename = pathBasename(candidatePath).replace(/\.json$/u, '');
  return structuredFileNames(node).includes(basename);
};

const catalogEntityDiffs = (pair: CatalogGraphPair): readonly CatalogEntityDiff[] => {
  const hasSourceInventory = pair.base.hasSourceInventory() || pair.current.hasSourceInventory();
  const baseByKey = new Map(
    pair.base.entityNodes().map((node) => [operationAlias(node.entityType, node.identity), node]),
  );
  const currentByKey = new Map(
    pair.current
      .entityNodes()
      .map((node) => [operationAlias(node.entityType, node.identity), node]),
  );
  const keys = [...new Set([...baseByKey.keys(), ...currentByKey.keys()])].sort();
  return keys.flatMap((key) => {
    const base = baseByKey.get(key);
    const current = currentByKey.get(key);
    const node = current ?? base;
    if (!node) return [];
    const baseProjection = base?.projection;
    const currentProjection = current?.projection;
    const action: PublicationOperation['action'] | undefined = !base
      ? 'add'
      : !current
        ? 'remove'
        : baseProjection === currentProjection
          ? undefined
          : 'replace';
    if (!action) return [];
    const sourcePaths = [
      ...(base ? pair.base.sourcePaths(base) : []),
      ...(current ? pair.current.sourcePaths(current) : []),
    ].filter((path, index, paths) => paths.indexOf(path) === index);
    const changedSourcePaths = hasSourceInventory
      ? sourcePaths.filter(
          (sourcePath) =>
            pair.base.sourceDigest(sourcePath) !== pair.current.sourceDigest(sourcePath),
        )
      : sourcePaths;
    if (hasSourceInventory && changedSourcePaths.length === 0) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_ENTITY_SOURCE_DIFF_INVALID',
        `${action} ${node.entityType}:${node.identity} has no corresponding changed source path in the trusted inventory.`,
      );
    }
    return [
      {
        key,
        entityType: node.entityType,
        entityId: operationEntityId(node),
        action,
        base,
        current,
        changedSourcePaths,
      },
    ];
  });
};

const resolveOperationNodes = (
  pair: CatalogGraphPair,
  operation: PublicationOperation,
): readonly CatalogNode[] => {
  const nodes = resolveNodes(pair, operation);
  if (!nodes.some((node) => nodeOwnsPath(node, operation.path))) {
    throw new TrustedCatalogDiffError(
      'PUBLICATION_UPDATE_ENTITY_PATH_INVALID',
      `${operation.operationId} claims ${operation.path}, which is not a canonical source path for ${operation.entityType}:${operation.entityId}.`,
    );
  }
  if (pair.base.hasSourceInventory() || pair.current.hasSourceInventory()) {
    const beforeDigest = pair.base.sourceDigest(operation.path);
    const afterDigest = pair.current.sourceDigest(operation.path);
    const action =
      beforeDigest === undefined
        ? afterDigest === undefined
          ? undefined
          : 'add'
        : afterDigest === undefined
          ? 'remove'
          : beforeDigest === afterDigest
            ? undefined
            : 'replace';
    if (
      action !== operation.action ||
      (beforeDigest ?? null) !== operation.beforeDigest ||
      (afterDigest ?? null) !== operation.afterDigest
    ) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_SOURCE_DIFF_INVALID',
        `${operation.operationId} does not reproduce the trusted file transition for ${operation.path}.`,
      );
    }
  }
  return nodes;
};

const resolveNodes = (
  pair: CatalogGraphPair,
  operation: PublicationOperation,
): readonly CatalogNode[] => {
  const base = pair.base.resolve(operation.entityType, operation.entityId);
  const current = pair.current.resolve(operation.entityType, operation.entityId);
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

const nodeProblemIds = (graph: CatalogGraph, node: CatalogNode): readonly string[] =>
  node.entityType === 'correction_impact'
    ? graph.problemIdsOwnedByReferences(node)
    : graph.problemIdsOwnedBy(node);

/** Every Catalog entity that owns a changed file contributes to its review scope. */
const pathOwnerProblemIds = (pair: CatalogGraphPair, path: string): readonly string[] =>
  unionProblemIds(
    ([pair.base, pair.current] as const).flatMap((graph) =>
      graph
        .entityNodes()
        .filter((node) => nodeOwnsPath(node, path))
        .map((node) => nodeProblemIds(graph, node)),
    ),
  );

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
  return problemIds;
};

const entityDiffProblemIds = (pair: CatalogGraphPair, diff: CatalogEntityDiff): readonly string[] =>
  unionProblemIds(
    [diff.base, diff.current]
      .filter((node): node is CatalogNode => node !== undefined)
      .map((node) =>
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

const declaredSourcePaths = (node: CatalogNode): readonly string[] => {
  if (node.entityType === 'authoring_unit' || node.entityType === 'learning_unit') {
    return typeof node.value.docPath === 'string' ? [node.value.docPath] : [];
  }
  if (node.entityType === 'placement') {
    return ['src/content/policies/problem-placements.json'];
  }
  if (node.entityType === 'correction_impact') return impactPaths(node);
  return [];
};

const structuredFallbackSourcePaths = (node: CatalogNode): readonly string[] => {
  const root = structuredEntityRoots[node.entityType];
  if (!root) return [];
  return structuredFileNames(node).map((name) => `${root}/${name}.json`);
};

const canonicalEntityDiffPaths = (diff: CatalogEntityDiff): readonly string[] =>
  diff.changedSourcePaths;

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
  sourceInventory?: TrustedCatalogSourceInventory,
): TrustedPublicationDiff => {
  const pair: CatalogGraphPair = {
    base: new CatalogGraph(baseCatalog, sourceInventory?.baseFiles),
    current: new CatalogGraph(currentCatalog, sourceInventory?.currentFiles),
  };
  const entityDiffs = catalogEntityDiffs(pair);
  const operationByPath = new Map<
    string,
    { readonly update: PublicationUpdate; readonly operation: PublicationOperation }
  >();
  const affectedEntityDiffs = new Map<string, CatalogEntityDiff[]>();

  for (const update of updates) {
    for (const operation of update.operations) {
      const previous = operationByPath.get(operation.path);
      if (previous) {
        throw new TrustedCatalogDiffError(
          'PUBLICATION_UPDATE_DUPLICATE_PATH',
          `${operation.operationId} duplicates ${operation.path}, already represented by ${previous.operation.operationId}; a file transition must be recorded once.`,
        );
      }
      resolveOperationNodes(pair, operation);
      const digestShapeIsValid =
        operation.action === 'add'
          ? operation.beforeDigest === null && operation.afterDigest !== null
          : operation.action === 'replace'
            ? operation.beforeDigest !== null &&
              operation.afterDigest !== null &&
              operation.beforeDigest !== operation.afterDigest
            : operation.beforeDigest !== null && operation.afterDigest === null;
      if (!digestShapeIsValid) {
        throw new TrustedCatalogDiffError(
          'PUBLICATION_UPDATE_SOURCE_DIFF_INVALID',
          `${operation.operationId} has digests that conflict with its ${operation.action} file transition.`,
        );
      }
      operationByPath.set(operation.path, { update, operation });
      affectedEntityDiffs.set(operation.operationId, []);
    }
  }

  for (const diff of entityDiffs) {
    const paths = canonicalEntityDiffPaths(diff);
    const missingPaths = paths.filter((path) => !operationByPath.has(path));
    if (missingPaths.length > 0) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_ENTITY_DIFF_INCOMPLETE',
        `Catalog ${diff.action} ${diff.entityType}:${diff.entityId} is missing canonical source paths: ${missingPaths.join(', ')}.`,
      );
    }
    const owners = new Set(
      paths.map((path) => operationByPath.get(path)?.update.updateId).filter(Boolean),
    );
    if (owners.size !== 1) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_ENTITY_DIFF_DUPLICATE',
        `Catalog ${diff.action} ${diff.entityType}:${diff.entityId} is split across updates; all source paths for one Catalog diff must be atomic.`,
      );
    }
    for (const path of paths) {
      const operationId = operationByPath.get(path)?.operation.operationId;
      if (!operationId) continue;
      affectedEntityDiffs.get(operationId)?.push(diff);
    }
  }

  if (!sourceInventory) {
    const unrelated = [...operationByPath.values()].find(
      ({ operation }) => affectedEntityDiffs.get(operation.operationId)?.length === 0,
    );
    if (unrelated) {
      throw new TrustedCatalogDiffError(
        'PUBLICATION_UPDATE_ENTITY_DIFF_INVALID',
        `${unrelated.operation.operationId} has no independently derived Catalog diff and no trusted source inventory.`,
      );
    }
  }

  const trustedUpdates = updates.map((update) => {
    const operationOwnership = update.operations.map((operation) => {
      const operationEntityDiffs = affectedEntityDiffs.get(operation.operationId) ?? [];
      return {
        operationId: operation.operationId,
        affectedProblemIds: unionProblemIds([
          operationProblemIds(pair, operation),
          pathOwnerProblemIds(pair, operation.path),
          ...operationEntityDiffs.map((diff) => entityDiffProblemIds(pair, diff)),
        ]),
        entityType: operation.entityType,
        entityId: operation.entityId,
        action: operation.action,
        path: operation.path,
        beforeDigest: operation.beforeDigest,
        afterDigest: operation.afterDigest,
        affectedEntities: operationEntityDiffs.map(({ entityType, entityId, action }) => ({
          entityType,
          entityId,
          action,
        })),
      };
    });
    return {
      updateId: update.updateId,
      operationOwnership,
      correctionImpacts:
        update.kind === 'correction'
          ? deriveCorrectionImpacts(update, pair, operationOwnership)
          : [],
    };
  });
  return { updates: trustedUpdates };
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
