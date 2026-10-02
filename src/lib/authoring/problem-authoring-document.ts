import { parseFrontmatter } from '@astrojs/markdown-remark';
import { z } from 'zod';
import {
  ProblemAuthoringUnitSchema,
  type ProblemAuthoringUnit,
} from '../domain/schema-parts/authoring-unit.js';

export const ProblemAuthoringDetailsSchema = z
  .object({
    time: z.string().min(1),
    space: z.string().min(1),
    correctness: z.string().min(1),
    reasoning: z.string().min(1).optional(),
    example: z
      .object({
        input: z.string().min(1),
        procedure: z.array(z.string().min(1)).min(1),
        expectedResult: z.string().min(1),
      })
      .strict(),
    exercise: z
      .object({
        prompt: z.string().min(1),
        answer: z.string().min(1),
        expectedResult: z.string().min(1),
      })
      .strict(),
    holdReason: z.string().optional(),
    constraintConsistency: z.string().optional(),
    reviewMode: z.enum(['self', 'third_party']).optional(),
    sectionOverrides: z
      .object({
        reasoning: z.string().min(1).optional(),
        technique: z.string().min(1).optional(),
        problemSpecificElements: z.string().min(1).optional(),
        reviewAdvice: z.string().min(1).optional(),
        implementationNotes: z.string().min(1).optional(),
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
const SECTION_TITLES = {
  reasoning: '考察',
  technique: '典型の発動条件',
  problemSpecificElements: '問題固有の要素',
  correctness: '正当性',
  implementationNotes: '実装上の注意',
  reviewAdvice: '復習の核',
} as const;
const list = (items: readonly string[]) => items.map((s) => `- ${s}`).join('\n');
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
  const paragraphs = Object.entries(SECTION_TITLES)
    .map(([key, heading]) => `## ${heading}\n\n${String(sections[key])}`)
    .join('\n\n');
  const complexity = sections.complexity as { time: string; space: string };
  const example = unit.examples[0];
  const exercise = unit.exercises[0];
  if (!example || !exercise) throw new Error(`AUTHORING_BLOCK_MISSING:${unit.problemId}`);
  const answerSteps = exercise.answer.procedure.filter(
    (step) =>
      step !== exercise.answer.reasoningOrVerification &&
      step !== '具体例の各状態・寄与を再計算する。',
  );
  const answerResult =
    exercise.answer.expectedResult === exercise.answer.reasoningOrVerification
      ? ''
      : `\n\n確認結果: ${exercise.answer.expectedResult}`;
  const body =
    `## 学習の位置\n\n${links.home}\n\n${list(links.outcomes)}\n\n共通前提: ${unit.baselineId} ${unit.baselineVersion}。\n\n追加前提:\n\n${links.prerequisites.length ? list(links.prerequisites) : '共通前提と本節で説明する内容。'}\n\n対象外:\n\n${list(unit.excludedTopics)}\n\n` +
    `${paragraphs}\n\n## 計算量と制約\n\n### 時間\n\n${complexity.time}\n\n### 空間\n\n${complexity.space}\n\n### 制約との対応\n\n${String(sections.constraintConsistency)}\n\n` +
    `## 具体例\n\n${example.input}\n\n${example.procedure.map((s, i) => `${String(i + 1)}. ${s}`).join('\n')}\n\n期待される結果: ${example.expectedResult}\n\n実行形式: ${example.kind === 'illustrative' ? '手計算による図示・追跡。プログラムの実行例ではない。' : example.kind}\n\n` +
    `## 確認問題\n\n${exercise.attainmentCondition}\n\n### 確認する観点\n\n${exercise.assessment.method}\n\n### 解答と理由\n\n${exercise.answer.reasoningOrVerification}${answerSteps.length ? '\n\n' + list(answerSteps) : ''}${answerResult}\n\n## 出典\n\n${list(links.sources)}\n`;
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
  const headings = Object.entries(SECTION_TITLES);
  for (const [i, [key, title]] of headings.entries())
    sections[key] = between(
      content,
      `## ${title}\n\n`,
      `\n\n## ${headings[i + 1]?.[1] ?? '計算量と制約'}\n`,
    );
  sections.complexity = {
    time: between(content, '### 時間\n\n', '\n\n### 空間\n'),
    space: between(content, '### 空間\n\n', '\n\n### 制約との対応\n'),
  };
  sections.constraintConsistency = between(content, '### 制約との対応\n\n', '\n\n## 具体例\n');
  return {
    unit: ProblemAuthoringUnitSchema.parse({ ...frontmatter.authoringUnit, sections }),
    body: content,
    title: frontmatter.title,
  };
};
