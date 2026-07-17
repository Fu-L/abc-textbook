export interface DependencyNode {
  readonly id: string;
  readonly prerequisiteIds: readonly string[];
}

export class DomainValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'DomainValidationError';
  }
}

export class DependencyCycleError extends DomainValidationError {
  constructor(ids: readonly string[]) {
    super('DEPENDENCY_CYCLE', `Cycle includes: ${ids.join(', ')}`);
    this.name = 'DependencyCycleError';
  }
}

const compareUtf8 = (left: string, right: string): number =>
  Buffer.from(left).compare(Buffer.from(right));

const compareRank = (left: readonly number[], right: readonly number[]): number => {
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
};

export const deterministicTopologicalOrder = <Node extends DependencyNode>(
  nodes: readonly Node[],
  ranks: (node: Node) => readonly number[] = () => [],
): Node[] => {
  const byId = new Map<string, Node>();
  const dependents = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    if (byId.has(node.id)) {
      throw new DomainValidationError('DUPLICATE_ENTITY_ID', node.id);
    }
    byId.set(node.id, node);
    dependents.set(node.id, new Set());
    inDegree.set(node.id, 0);
  }

  for (const node of nodes) {
    const uniquePrerequisites = new Set(node.prerequisiteIds);
    if (uniquePrerequisites.size !== node.prerequisiteIds.length) {
      throw new DomainValidationError('DUPLICATE_DEPENDENCY', node.id);
    }
    for (const prerequisiteId of uniquePrerequisites) {
      if (prerequisiteId === node.id) {
        throw new DependencyCycleError([node.id]);
      }
      if (!byId.has(prerequisiteId)) {
        throw new DomainValidationError(
          'UNKNOWN_DEPENDENCY',
          `${node.id} references ${prerequisiteId}`,
        );
      }
      dependents.get(prerequisiteId)?.add(node.id);
      inDegree.set(node.id, (inDegree.get(node.id) ?? 0) + 1);
    }
  }

  const ready = nodes.filter((node) => inDegree.get(node.id) === 0);
  const result: Node[] = [];
  const sortReady = (): void => {
    ready.sort(
      (left, right) => compareRank(ranks(left), ranks(right)) || compareUtf8(left.id, right.id),
    );
  };
  sortReady();

  while (ready.length > 0) {
    const node = ready.shift();
    if (!node) break;
    result.push(node);
    for (const dependentId of dependents.get(node.id) ?? []) {
      const nextDegree = (inDegree.get(dependentId) ?? 0) - 1;
      inDegree.set(dependentId, nextDegree);
      if (nextDegree === 0) {
        const dependent = byId.get(dependentId);
        if (dependent) ready.push(dependent);
      }
    }
    sortReady();
  }

  if (result.length !== nodes.length) {
    const unresolved = nodes
      .filter((node) => (inDegree.get(node.id) ?? 0) > 0)
      .map(({ id }) => id)
      .sort(compareUtf8);
    throw new DependencyCycleError(unresolved);
  }
  return result;
};

export interface ValidationDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly entityId?: string;
}

export interface Validator<Result> {
  readonly code: string;
  validate(input: Result): readonly ValidationDiagnostic[];
}

export const validateFailClosed = <Input>(
  input: Input,
  validators: readonly Validator<Input>[],
): { readonly valid: boolean; readonly diagnostics: readonly ValidationDiagnostic[] } => {
  const diagnostics = validators
    .flatMap((validator) => validator.validate(input))
    .sort(
      (left, right) =>
        left.code.localeCompare(right.code) || left.message.localeCompare(right.message),
    );
  return { valid: diagnostics.length === 0, diagnostics };
};
