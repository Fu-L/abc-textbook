import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import {
  LearningUnitSchema,
  ProblemSchema,
  SourceRevisionSchema,
} from '../../../src/lib/domain/schema-parts/catalog.js';
import { renderLearningUnitDocument } from '../../../src/lib/taxonomy/canonical-taxonomy-materialization.js';
import {
  readProblemAuthoringDocument,
  renderProblemAuthoringDocument,
} from '../../../src/lib/authoring/problem-authoring-document.js';

// Runs only in the disposable project, with a fixture ID registered in its
// reading order/target table. Production content and templates are never patched.
const original = LearningUnitSchema.parse(
  JSON.parse(
    await readFile('src/content/learning-units/unit-dp-transition-optimization.json', 'utf8'),
  ),
);
const unit = LearningUnitSchema.parse({
  ...original,
  id: 'unit-regression-transitions',
  title: '表示回帰用の遷移',
  docPath: 'src/content/docs/learn/dp/regression-transitions.md',
  ownedLearningOutcomeIds: [],
  ownedTagIds: [],
  problemIds: [],
  directProblemIds: [],
  relatedProblemIds: ['abc467-e'],
  examples: [],
  exercises: [],
});
const sourceIndex = await Promise.all(
  (await readdir('src/content/sources', { recursive: true }))
    .filter((file) => file.endsWith('.json') && !file.startsWith('authoring/'))
    .map(async (file) =>
      SourceRevisionSchema.parse(JSON.parse(await readFile(`src/content/sources/${file}`, 'utf8'))),
    ),
);
const sources = unit.sourceRevisionIds.map((id) => {
  const source = sourceIndex.find((item) => item.id === id);
  return SourceRevisionSchema.parse(source);
});
const policy = JSON.parse(
  await readFile('src/content/policies/problem-placements.json', 'utf8'),
) as {
  sourceBuild: { id: string; digest: string };
};
const problemFile = 'src/content/docs/problems/abc467-e.md';
const problem = readProblemAuthoringDocument(await readFile(problemFile, 'utf8')).unit;
const metadataFile = (await readdir('src/content/problems', { recursive: true })).find((file) =>
  file.endsWith('/abc467-e.json'),
);
if (!metadataFile) throw new Error('Missing new Problem metadata');
const metadata = ProblemSchema.parse(
  JSON.parse(await readFile(`src/content/problems/${metadataFile}`, 'utf8')),
);
const document = renderLearningUnitDocument({
  unit,
  tags: [],
  childUnits: [],
  prerequisiteTitles: [],
  dependentTitles: [],
  chapterLinks: [],
  outcomeStatements: ['必要な情報を状態として残す。'],
  problemRoles: new Map([['abc467-e', '遷移のまとめ方を確認する。']]),
  sources,
  problems: new Map([['abc467-e', metadata]]),
  sourceBuild: policy.sourceBuild,
})
  .replace('draft: true', 'draft: false')
  .replace(
    '## 前提と範囲',
    () => String.raw`## 考え方

各頂点への通り数を状態 $$dp[v]$$ とする。全体の和から、移動できない頂点の寄与を引く。

## 成立条件と計算量

同じ時刻の値だけを使って次の状態を作る。時間は $$O(K(N+M))$$、空間は $$O(N+M)$$ である。

## 前提と範囲`,
  );
await mkdir('src/content/docs/learn/dp', { recursive: true });
await writeFile(unit.docPath, document);
await writeFile(`src/content/learning-units/${unit.id}.json`, JSON.stringify(unit));
problem.additionalPrerequisiteUnitIds.push(unit.id);
if (typeof problem.sections.implementationNotes !== 'string')
  throw new Error('Missing implementation notes');
problem.sections.implementationNotes +=
  '\n\n次の時刻の通り数を $$next[v]$$ に保存する。表示確認用の擬似コード（実行用のプログラムではない）。\n\n```text\nfor each vertex v:\n    next[v] = total - dp[v] - sum_of_forbidden_neighbors[v]\n```';
await writeFile(
  problemFile,
  renderProblemAuthoringDocument(problem, '教材追加の表示回帰 fixture', {
    home: `[遷移の最適化](${original.docPath})`,
    outcomes: ['同じ時刻の状態から次の状態をまとめて計算する。'],
    prerequisites: [`[${unit.title}](${unit.docPath})`],
    sources: sourceIndex
      .filter((source) => problem.sourceRevisionIds.includes(source.id))
      .map((source) => `[公式fixture出典](${source.url})`),
  }),
);
// A fresh process loads the updated canonical inputs and registered reading order.
const { loadFullPublicProjection } =
  await import('../../../src/lib/catalog/full-public-projection.js');
const projection = await loadFullPublicProjection({
  usePreparedRelease: false,
  verifyDerivedFiles: false,
});
await writeFile('src/content/indexes/taxonomy.json', JSON.stringify(projection.taxonomyIndex));
