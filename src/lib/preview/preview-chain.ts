import { canonicalDigest } from '../domain/canonical-json.js';

export interface PreviewComponent {
  readonly componentId: string;
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly inputDigest: string;
  /** Digest of the actual component artifact, not of its metadata. */
  readonly artifactDigest: string;
  readonly outputDigest: string;
}

export type PreviewComponentSubject = Omit<PreviewComponent, 'outputDigest'>;

export const previewComponentOutputDigest = (component: PreviewComponentSubject): string =>
  canonicalDigest(component);

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

/**
 * Validate the digest and cohort contract shared by preview verification and tests.
 *
 * `artifactDigest` is intentionally part of the output subject. A component cannot
 * be accepted merely because its metadata is unchanged while the generated artifact
 * has been replaced.
 */
export const validatePreviewChain = (components: readonly PreviewComponent[]): string[] => {
  const [first, ...rest] = components;
  if (!first) return ['component_chain_empty'];

  const violations: string[] = [];
  for (const component of components) {
    const subject: PreviewComponentSubject = {
      componentId: component.componentId,
      previewId: component.previewId,
      manifestDigest: component.manifestDigest,
      problemIds: component.problemIds,
      inputDigest: component.inputDigest,
      artifactDigest: component.artifactDigest,
    };
    if (component.outputDigest !== previewComponentOutputDigest(subject)) {
      violations.push(`stale_output:${component.componentId}`);
    }
    if (
      component.previewId !== first.previewId ||
      component.manifestDigest !== first.manifestDigest ||
      !sameOrderedValues(component.problemIds, first.problemIds)
    ) {
      violations.push(`cohort_mismatch:${component.componentId}`);
    }
  }

  if (first.inputDigest !== first.manifestDigest) {
    violations.push(`manifest_mismatch:${first.componentId}`);
  }
  for (const [index, component] of rest.entries()) {
    const predecessor = components[index];
    if (predecessor && component.inputDigest !== predecessor.outputDigest) {
      violations.push(`broken_chain:${component.componentId}`);
    }
  }
  return violations;
};
