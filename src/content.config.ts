import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

import { structuredContentRoots } from './lib/catalog/content-source-registry.js';

const structuredEntrySchema = z.record(z.string(), z.unknown());

function structuredJsonCollection(base: string) {
  return defineCollection({
    loader: glob({
      base,
      pattern: '**/*.json',
      generateId: ({ entry }) => entry.replace(/\.json$/u, ''),
    }),
    schema: structuredEntrySchema,
  });
}

const structuredCollection = (name: keyof typeof structuredContentRoots) =>
  structuredJsonCollection(`./${structuredContentRoots[name]}`);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
  contests: structuredCollection('contests'),
  contestGaps: structuredCollection('contestGaps'),
  problemSlots: structuredCollection('problemSlots'),
  problems: structuredCollection('problems'),
  techniqueInventory: structuredCollection('techniqueInventory'),
  tags: structuredCollection('tags'),
  learningOutcomes: structuredCollection('learningOutcomes'),
  learningUnits: structuredCollection('learningUnits'),
  sources: structuredCollection('sources'),
  glossary: structuredCollection('glossary'),
  policies: structuredCollection('policies'),
  releases: structuredCollection('releases'),
};
