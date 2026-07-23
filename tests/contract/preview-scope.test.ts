import { describe, expect, it } from 'vitest';

import { hasStagingPathSegment } from '../../src/lib/catalog/publication-boundary.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

interface PreviewComponent {
  readonly componentId: string;
  readonly previewId: string;
  readonly manifestDigest: string;
  readonly problemIds: readonly string[];
  readonly inputDigest: string;
  readonly outputDigest: string;
}

const componentDigest = (component: Omit<PreviewComponent, 'outputDigest'>): string =>
  canonicalDigest(component);

const previewChainViolations = (components: readonly PreviewComponent[]): string[] => {
  const [first, ...rest] = components;
  if (!first) return ['component_chain_empty'];
  const violations: string[] = [];
  for (const component of components) {
    const subject = {
      componentId: component.componentId,
      previewId: component.previewId,
      manifestDigest: component.manifestDigest,
      problemIds: component.problemIds,
      inputDigest: component.inputDigest,
    };
    if (component.outputDigest !== componentDigest(subject)) {
      violations.push(`stale_output:${component.componentId}`);
    }
    if (
      component.previewId !== first.previewId ||
      component.manifestDigest !== first.manifestDigest ||
      JSON.stringify(component.problemIds) !== JSON.stringify(first.problemIds)
    ) {
      violations.push(`cohort_mismatch:${component.componentId}`);
    }
  }
  for (const [index, component] of rest.entries()) {
    const predecessor = components[index];
    if (predecessor && component.inputDigest !== predecessor.outputDigest) {
      violations.push(`broken_chain:${component.componentId}`);
    }
  }
  return violations;
};

const previewEntityId = /^(?:preview|provisional)-/u;
const unpublishedEntityViolations = (catalog: {
  readonly tags: readonly { readonly id: string }[];
  readonly learningUnits: readonly { readonly id: string }[];
}): string[] =>
  [...catalog.tags, ...catalog.learningUnits]
    .filter(({ id }) => previewEntityId.test(id))
    .map(({ id }) => id);

describe('US2 preview scope contract', () => {
  it('binds every component to one manifest, cohort, and digest chain', () => {
    const base = {
      previewId: 'initial-v1',
      manifestDigest: 'a'.repeat(64),
      problemIds: ['abc212-e', 'abc213-f'],
    } as const;
    const metadataSubject = {
      componentId: 'metadata-inventory-taxonomy',
      ...base,
      inputDigest: base.manifestDigest,
    };
    const metadata: PreviewComponent = {
      ...metadataSubject,
      outputDigest: componentDigest(metadataSubject),
    };
    const contentSubject = {
      componentId: 'content-graph-search',
      ...base,
      inputDigest: metadata.outputDigest,
    };
    const content: PreviewComponent = {
      ...contentSubject,
      outputDigest: componentDigest(contentSubject),
    };

    expect(previewChainViolations([metadata, content])).toEqual([]);
    expect(
      previewChainViolations([{ ...metadata, outputDigest: 'b'.repeat(64) }, content]),
    ).toEqual(expect.arrayContaining(['stale_output:metadata-inventory-taxonomy']));
    expect(previewChainViolations([metadata, { ...content, problemIds: ['abc212-e'] }])).toEqual(
      expect.arrayContaining(['cohort_mismatch:content-graph-search']),
    );
  });

  it('rejects provisional Tag and LearningUnit IDs from a public Catalog projection', () => {
    expect(
      unpublishedEntityViolations({
        tags: [{ id: 'tag-graph' }, { id: 'provisional-tag-preview-graph' }],
        learningUnits: [{ id: 'unit-graph' }, { id: 'preview-unit-graph' }],
      }),
    ).toEqual(['provisional-tag-preview-graph', 'preview-unit-graph']);
  });

  it('recognizes preview staging paths across POSIX and Windows separators', () => {
    expect(hasStagingPathSegment('staging/previews/initial-v1/taxonomy/tag.json')).toBe(true);
    expect(hasStagingPathSegment('staging\\previews\\initial-v1\\taxonomy\\tag.json')).toBe(true);
    expect(hasStagingPathSegment('src/content/tags/tag-graph.json')).toBe(false);
  });
});
