import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

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

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
  contests: structuredJsonCollection('./src/content/contests'),
  problemSlots: structuredJsonCollection('./src/content/problem-slots'),
  problems: structuredJsonCollection('./src/content/problems'),
  techniqueInventory: structuredJsonCollection('./src/content/technique-inventory'),
  tags: structuredJsonCollection('./src/content/tags'),
  learningOutcomes: structuredJsonCollection('./src/content/learning-outcomes'),
  learningUnits: structuredJsonCollection('./src/content/learning-units'),
  claims: structuredJsonCollection('./src/content/claims'),
  examples: structuredJsonCollection('./src/content/examples'),
  exercises: structuredJsonCollection('./src/content/exercises'),
  assessments: structuredJsonCollection('./src/content/assessments'),
  answerMaterials: structuredJsonCollection('./src/content/answer-materials'),
  sources: structuredJsonCollection('./src/content/sources'),
  glossary: structuredJsonCollection('./src/content/glossary'),
  policies: structuredJsonCollection('./src/content/policies'),
  releases: structuredJsonCollection('./src/content/releases'),
};
