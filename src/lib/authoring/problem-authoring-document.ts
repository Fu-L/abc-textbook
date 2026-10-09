import { parseFrontmatter } from '@astrojs/markdown-remark';
import { z } from 'zod';
import {
  ProblemAuthoringUnitSchema,
  ExplanationTextSchema,
  type ProblemAuthoringUnit,
} from '../domain/schema-parts/authoring-unit.js';

export const ProblemAuthoringDetailsSchema = z
  .object({
    time: ExplanationTextSchema,
    space: ExplanationTextSchema,
    correctness: ExplanationTextSchema,
    // A complete explanation is authored explicitly; inventory prose is only an outline.
    reasoning: ExplanationTextSchema,
    // A chosen algorithm can require less than the taxonomy's related techniques.
    additionalPrerequisiteUnitIds: z.array(z.string().min(1)).optional(),
    example: z
      .object({
        input: z.string().min(1),
        procedure: z.array(z.string().min(1)).min(1),
        expectedResult: z.string().min(1),
      })
      .strict()
      .optional(),
    exercise: z
      .object({
        prompt: z.string().min(1),
        answer: z.string().min(1),
        expectedResult: z.string().min(1),
      })
      .strict()
      .optional(),
    holdReason: z.string().optional(),
    constraintConsistency: ExplanationTextSchema.optional(),
    reviewMode: z.enum(['self', 'third_party']).optional(),
    sectionOverrides: z
      .object({
        reasoning: ExplanationTextSchema.optional(),
        technique: ExplanationTextSchema.optional(),
        problemSpecificElements: ExplanationTextSchema.optional(),
        reviewAdvice: ExplanationTextSchema.optional(),
        implementationNotes: ExplanationTextSchema.optional(),
      })
      .strict()
      .optional(),
    riskReasons: z
      .array(
        z.enum(['official_source_conflict', 'independent_proof', 'major_classification_change']),
      )
      .optional(),
    sourceVerification: z
      .object({ url: z.string(), checkedAt: z.string(), reason: z.string() })
      .optional(),
  })
  .strict();
export type ProblemAuthoringDetails = z.infer<typeof ProblemAuthoringDetailsSchema>;

// Flag long verbatim repetitions for editorial review, excluding executable examples.
export const findExplanationRepetition = (reasoning: string, correctness: string) => {
  const sentences = (value: string): string[] =>
    value
      .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/gu, '')
      .split(/(?<=[。！？])|\r?\n+/u)
      .map((sentence) => sentence.replace(/\s+/gu, ' ').trim())
      .filter(Boolean);
  const seen = new Set<string>();
  const withinReasoning = new Set<string>();
  const correctnessSentences = new Set(sentences(correctness));
  const acrossSections = new Set<string>();
  for (const sentence of sentences(reasoning)) {
    if (sentence.length >= 35 && seen.has(sentence)) withinReasoning.add(sentence);
    if (sentence.length >= 25 && correctnessSentences.has(sentence)) acrossSections.add(sentence);
    seen.add(sentence);
  }
  return { withinReasoning: [...withinReasoning], acrossSections: [...acrossSections] };
};
const SECTION_TITLES = {
  reasoning: '考察',
  technique: '典型の発動条件',
  problemSpecificElements: '問題固有の要素',
  correctness: '正当性',
  implementationNotes: '実装上の注意',
  reviewAdvice: '復習の核',
} as const;
const ABBREVIATED_SECTION_TITLES = {
  differences: '差分',
  implementationNotes: '実装上の注意',
} as const;
const sectionTitles = (kind: unknown) =>
  kind === 'full' ? SECTION_TITLES : ABBREVIATED_SECTION_TITLES;
const list = (items: readonly string[]) => items.map((s) => `- ${s}`).join('\n');
const readerFacingExclusions = (topics: readonly string[]): string[] =>
  topics.filter((topic) => !topic.includes('実装部品だけを偶然共有する解法'));
const protectMathematicalLinks = (text: string): string =>
  text.replace(/(?<!\\)(\[[^\]\n]+\])\((?!https?:|src\/|#)/gu, '\\$1(');
export const renderProblemAuthoringDocument = (
  value: ProblemAuthoringUnit,
  title: string,
  links: {
    home: string;
    outcomes: readonly string[];
    sources: readonly string[];
    prerequisites: readonly string[];
  },
): string => {
  const unit = ProblemAuthoringUnitSchema.parse(value);
  const { sections, ...metadata } = unit;
  const paragraphs = Object.entries(sectionTitles(unit.kind))
    .map(([key, heading]) => `## ${heading}\n\n${String(sections[key])}`)
    .join('\n\n');
  const complexity = sections.complexity as { time: string; space: string };
  const prerequisites = links.prerequisites.length
    ? `先に読む単元:\n\n${list(links.prerequisites)}\n\n`
    : '';
  const exclusions = readerFacingExclusions(unit.excludedTopics);
  const excludedTopics = exclusions.length
    ? `この解説で扱わないこと:\n\n${list(exclusions)}\n\n`
    : '';
  const complexityText =
    unit.kind === 'full'
      ? `## 計算量と制約\n\n### 時間\n\n${complexity.time}\n\n### 空間\n\n${complexity.space}\n\n### 制約との対応\n\n${String(sections.constraintConsistency)}\n\n`
      : '';
  const body =
    `## 学習の位置\n\n${links.home}\n\n${list(links.outcomes)}\n\n${prerequisites}${excludedTopics}` +
    `${paragraphs}\n\n${complexityText}` +
    `## 出典\n\n${list(links.sources)}\n`;
  return `---\ntitle: ${JSON.stringify(title)}\ndraft: true\nauthoringUnit: ${JSON.stringify(metadata)}\n---\n\n${protectMathematicalLinks(body)}`;
};
const between = (body: string, start: string, end: string): string => {
  const offset = body.indexOf(start);
  if (offset < 0) throw new Error(`AUTHORING_SECTION_MISSING:${start.trim()}`);
  const from = offset + start.length;
  const to = body.indexOf(end, from);
  if (to < 0) throw new Error(`AUTHORING_SECTION_END_MISSING:${end.trim()}`);
  return body.slice(from, to).trim();
};
export const readProblemAuthoringDocument = (
  text: string,
): { unit: ProblemAuthoringUnit; body: string; title: string } => {
  const { frontmatter, content } = parseFrontmatter(text);
  if (
    frontmatter.draft !== true ||
    typeof frontmatter.title !== 'string' ||
    typeof frontmatter.authoringUnit !== 'object' ||
    frontmatter.authoringUnit === null
  )
    throw new Error('AUTHORING_DRAFT_FRONTMATTER_REQUIRED');
  const sections: Record<string, unknown> = {};
  const kind = (frontmatter.authoringUnit as Record<string, unknown>).kind;
  const full = kind === 'full';
  const headings = Object.entries(sectionTitles(kind));
  for (const [i, [key, title]] of headings.entries())
    sections[key] = between(
      content,
      `## ${title}\n\n`,
      `\n\n## ${headings[i + 1]?.[1] ?? (full ? '計算量と制約' : '出典')}\n`,
    );
  if (full) {
    sections.complexity = {
      time: between(content, '### 時間\n\n', '\n\n### 空間\n'),
      space: between(content, '### 空間\n\n', '\n\n### 制約との対応\n'),
    };
    sections.constraintConsistency = between(content, '### 制約との対応\n\n', '\n\n## 出典\n');
  }
  return {
    unit: ProblemAuthoringUnitSchema.parse({ ...frontmatter.authoringUnit, sections }),
    body: content,
    title: frontmatter.title,
  };
};
