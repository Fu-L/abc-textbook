import { describe, expect, it } from 'vitest';

import { hasStagingPathSegment } from '../../src/lib/catalog/publication-boundary.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  previewComponentOutputDigest,
  validatePreviewChain,
  type PreviewComponent,
} from '../../src/lib/preview/preview-chain.js';
import { unpublishedPreviewEntityViolations } from '../../src/lib/preview/preview-scope.js';

const fixtureArtifactDigest = (componentId: string, artifact = 'fixture'): string =>
  canonicalDigest({ componentId, artifact });

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
      artifactDigest: fixtureArtifactDigest('metadata-inventory-taxonomy'),
    };
    const metadata: PreviewComponent = {
      ...metadataSubject,
      outputDigest: previewComponentOutputDigest(metadataSubject),
    };
    const contentSubject = {
      componentId: 'content-graph-search',
      ...base,
      inputDigest: metadata.outputDigest,
      artifactDigest: fixtureArtifactDigest('content-graph-search'),
    };
    const content: PreviewComponent = {
      ...contentSubject,
      outputDigest: previewComponentOutputDigest(contentSubject),
    };

    expect(validatePreviewChain([metadata, content])).toEqual([]);
    expect(validatePreviewChain([{ ...metadata, inputDigest: 'c'.repeat(64) }, content])).toContain(
      'manifest_mismatch:metadata-inventory-taxonomy',
    );
    expect(validatePreviewChain([{ ...metadata, outputDigest: 'b'.repeat(64) }, content])).toEqual(
      expect.arrayContaining(['stale_output:metadata-inventory-taxonomy']),
    );
    expect(validatePreviewChain([metadata, { ...content, problemIds: ['abc212-e'] }])).toEqual(
      expect.arrayContaining(['cohort_mismatch:content-graph-search']),
    );
    expect(
      validatePreviewChain([
        metadata,
        { ...content, artifactDigest: fixtureArtifactDigest('content-graph-search', 'changed') },
      ]),
    ).toContain('stale_output:content-graph-search');
  });

  it('rejects provisional Tag and LearningUnit IDs from a public Catalog projection', () => {
    expect(
      unpublishedPreviewEntityViolations({
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
