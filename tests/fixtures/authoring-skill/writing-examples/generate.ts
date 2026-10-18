import { readFile } from 'node:fs/promises';

import {
  prepareExplanationAuthoring,
  validateAuthoringOutput,
  type AuthoringInputPacket,
} from '../../../../src/lib/authoring/explanation-authoring-skill.js';
import {
  readProblemAuthoringDocument,
  renderProblemAuthoringDocument,
} from '../../../../src/lib/authoring/problem-authoring-document.js';
import { SourceRevisionSchema } from '../../../../src/lib/domain/schema-parts/catalog.js';
import type { ProblemAuthoringUnit } from '../../../../src/lib/domain/schema-parts/authoring-unit.js';

const originalPath =
  'src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc391-f.md';

// Independently authored prose for #120. Never written into src/content or a public catalog.
const reasoning = String.raw`三つの配列を降順に並べると、選ぶ位置を先へ進めても値は増えない。最大の組から候補を広げれば、全組を作らずに必要な順位まで調べられる。同じ位置の組を重複登録せず、値が等しい別の組は残す。

全組を並べると $$N^3$$ 個になるが、必要なのは上位の高々 $$5\times 10^5$$ 個だけだ。大きい組から順に作れないだろうか。各配列の要素は正なので、一要素を大きくすると式の値は小さくならない。そこで三つの配列を降順に並べる。

以後、添字は0から始める。選んだ位置の組を $$(i,j,k)$$ とし、その値を定義する。

$$
f(i,j,k)=A_iB_j+B_jC_k+C_kA_i
$$

$$0\leq i<N-1$$ なら、一方向の変化は次の式で確認できる。

$$
f(i,j,k)-f(i+1,j,k)=(A_i-A_{i+1})(B_j+C_k)\geq 0
$$

前半は降順なので非負、後半は要素が正なので正である。他の二方向も同様に、添字を増やしても値は増えない。最大の組の一つは $$(0,0,0)$$ だと分かる。この状態を原点と呼ぶ。

### なぜ以前の候補も残すのか

降順の独自例 $$A=(3,1),B=(4,2),C=(5,1)$$ を見る。最大値47から添字を一つ増やした三つの候補は29、31、19である。次に31を選んだ後、その隣に追加できる値は17、11だが、以前の候補29はまだ残っている。直前の組の隣だけを見てはいけない。

生成済みで未出力の候補全体を、最大値を取り出せる優先度付きキュー（max-heap）へ残す。この候補集合が探索境界（frontier）となる。

1. 値と組 $$(f(0,0,0),0,0,0)$$ をキューへ入れ、組 $$(0,0,0)$$ を登録済み集合へ記録する。
2. 最大値の組を取り出す。これが $$K$$ 回目なら、その値を答えて終了する。
3. 取り出した組の各添字を一つ増やした三つの組のうち、範囲内かつ未登録のものを集合へ記録してキューへ入れ、手順2へ戻る。

同じ組へは複数方向から到達するので、登録は追加時に行う。一方、全要素が1なら値はすべて3でも、組の数だけ順位がある。集合のキーは値ではなく添字の組にする。`;

const correctness = String.raw`任意の未出力の組 $$x$$ へ、原点から添字を一つずつ増やして進む経路を取る。その経路で最初の未出力状態を $$y$$ とする。原点なら初期登録され、それ以外なら直前の状態を取り出した際に登録されている。未出力なので、どちらもキューに残っている。

経路上で値は増えないから $$f(y)\geq f(x)$$。従ってキューの最大値は、すべての未出力状態の最大値でもある。この操作を繰り返すと $$K$$ 回目が答えになる。同じ組は一度だけ登録し、値が等しい別の組は区別するので、同値の順位も正しく数える。`;

const differences = String.raw`ABC123 Dでも、三つの配列から一つずつ選んだ組を、大きい順に必要な個数だけ求める。参照元の探索境界を使い、優先値を三要素の和へ変える。今回は取り出した値を毎回出力する。

配列の長さをそれぞれ $$X,Y,Z$$ とする。各配列を降順に並べ、添字を0始まりとし、値を $$g(i,j,k)=A_i+B_j+C_k$$ と定める。一つの添字を増やした差は $$g(i,j,k)-g(i+1,j,k)=A_i-A_{i+1}\geq 0$$。他の方向も同じなので、原点から全状態へ値を増やさずに到達できる。参照元の「経路で最初の未出力状態がキューに残る」という証明を、値を $$g$$ に替えて使える。

状態・キュー・追加時の組の登録は共通である。三方向の境界をそれぞれ $$X,Y,Z$$ へ替え、取り出すたびに値を出力し、$$K$$ 回で終了する。和が等しい別の選び方も別々に出力する。

$$L=X+Y+Z$$ とすると、整列に $$O(X\log X+Y\log Y+Z\log Z)$$、列挙と出力に $$O(K\log(K+1))$$、全体で $$O(L\log L+K\log(K+1))$$ 時間である。入力・キュー・登録済み集合を含む空間は $$O(L+K)$$。参照元の $$L=3N$$ と対応し、主解法・証明着眼点・漸近計算量は変わらない。$$X,Y,Z\leq 1000$$、$$K\leq\min(3000,XYZ)$$ なので、全組を保持する必要はない。

復習では、式の見た目ではなく「大きい出発点から値が悪化する向きへ全状態に到達できるか」を確かめる。同じ値をまとめると順位の意味が変わる点も思い出す。`;

export async function generateWritingExamples() {
  const original = readProblemAuthoringDocument(await readFile(originalPath, 'utf8')).unit;
  const originalClaim = original.claims[0];
  if (!originalClaim) throw new Error('Missing source claim');
  const full: ProblemAuthoringUnit = {
    ...original,
    docPath: 'tests/fixtures/authoring-skill/writing-examples/full-abc391-f.md',
    sections: {
      reasoning,
      technique:
        '全状態が多くても上位の少数だけが必要で、最大の出発点と値が悪化する向きが分かるなら、探索境界を優先度付きキューで管理する。複数経路が合流する場合は、値ではなく状態を追加時に登録する。',
      problemSpecificElements:
        '交差項を含む式でも、他の二要素の和が正なので各方向に単調となる。一つの変数だけ動かした差を因数分解すると、この制約の役割が見える。',
      correctness,
      implementationNotes: String.raw`添字が $$N$$ に達する候補は追加しない。$$K=1$$ なら初回で終了し、$$K=N^3$$ なら全組を数える。要素は最大 $$10^9$$、答えは最大 $$3\times 10^{18}$$ なので、乗算前に符号付き64 bit整数へ変換する。組のキーも整数幅を確認する。`,
      reviewAdvice:
        '- 全状態が多く上位だけが少ないとき、最大の出発点と単調な向きを探す。\n- 未出力状態への経路を描き、最初の未出力状態がキューに残る理由を説明する。\n- 同じ値と同じ状態の重複を区別する。',
      complexity: {
        time: String.raw`三列の整列が $$O(N\log N)$$。一回の取り出しにつき追加は高々三件で、全体の候補は $$O(K)$$ 件。優先度付きキューと、登録済み集合に使う平衡二分探索木の各操作は $$O(\log(K+1))$$ なので、全体は $$O(N\log N+K\log(K+1))$$ 時間。`,
        space: String.raw`入力が $$O(N)$$、キューと登録済み集合が $$O(K)$$ なので、合計 $$O(N+K)$$。全組は保持しない。`,
      },
      constraintConsistency: String.raw`$$1\leq N\leq 2\times 10^5$$、$$1\leq K\leq\min(N^3,5\times 10^5)$$、$$1\leq A_i,B_i,C_i\leq 10^9$$。列挙量を $$N^3$$ から $$K$$ に抑える。要素が正という条件は単調性に使い、順位の範囲は答えに到達できることを保証する。`,
    },
    claims: [{ ...originalClaim, text: correctness }],
    examples: [],
    exercises: [],
  };
  delete full.skill;
  const sources = await Promise.all(
    original.sourceRevisionIds.map(async (id) =>
      SourceRevisionSchema.parse(
        JSON.parse(await readFile(`src/content/sources/abc368-abc419/${id}.json`, 'utf8')),
      ),
    ),
  );
  const input: AuthoringInputPacket = {
    problemId: full.problemId,
    learningOutcomeIds: full.learningOutcomeIds,
    baseline: { id: full.baselineId, version: full.baselineVersion },
    additionalPrerequisiteUnitIds: full.additionalPrerequisiteUnitIds,
    excludedTopics: full.excludedTopics,
    tagIds: full.tagIds,
    constraints: [full.sections.constraintConsistency as string],
    placementCandidate: { primaryProblemId: null, comparison: null, additionalElement: null },
    technicalClaims: [{ text: correctness, sourceRevisionIds: full.sourceRevisionIds }],
    sources: sources.map((source) => ({
      sourceRevisionId: source.id,
      path: `src/content/sources/abc368-abc419/${source.id}.json`,
      sourceKind: source.sourceKind as 'official_problem' | 'official_editorial',
      officialTaskId: source.officialTaskId ?? '',
      checkedAt: source.checkedAt,
      termsCheckedAt: source.termsCheckedAt,
      allowedUses: ['constraint_reference', 'technical_claim'],
    })),
  };
  const sourcePath = 'tests/fixtures/authoring-skill/writing-examples/source-abc123-d.json';
  const source = SourceRevisionSchema.parse(JSON.parse(await readFile(sourcePath, 'utf8')));
  const similar: ProblemAuthoringUnit = {
    ...full,
    problemId: 'abc123-d',
    docPath: 'tests/fixtures/authoring-skill/writing-examples/similar-abc123-d.md',
    kind: 'similar',
    primaryProblemId: full.problemId,
    differenceSummary: '優先値が和になり、配列ごとの長さを使い、上位すべてを出力する。',
    sourceRevisionIds: [source.id],
    sections: {
      differences,
      implementationNotes: String.raw`各添字は対応する配列長だけで判定する。和は最大 $$3\times 10^{10}$$ なので符号付き64 bit整数で保持する。同じ和でも組が違えば一行ずつ出力する。`,
    },
    claims: [{ ...originalClaim, text: differences, sourceRevisionIds: [source.id] }],
  };
  const similarInput: AuthoringInputPacket = {
    ...input,
    problemId: similar.problemId,
    constraints: ['1 ≤ X,Y,Z ≤ 1000; 1 ≤ K ≤ min(3000,XYZ); 1 ≤ A_i,B_i,C_i ≤ 10^10'],
    placementCandidate: {
      primaryProblemId: full.problemId,
      comparison: {
        learningOutcomes: true,
        prerequisites: true,
        coreMethod: true,
        proofIdea: true,
        asymptoticComplexity: true,
      },
      additionalElement: null,
    },
    technicalClaims: [{ text: differences, sourceRevisionIds: [source.id] }],
    sources: [
      {
        sourceRevisionId: source.id,
        path: sourcePath,
        sourceKind: 'official_problem',
        officialTaskId: source.officialTaskId ?? '',
        checkedAt: source.checkedAt,
        termsCheckedAt: source.termsCheckedAt,
        allowedUses: ['constraint_reference', 'technical_claim'],
      },
    ],
  };
  return [
    { unit: full, input, title: 'ABC391 F — 執筆例', sources },
    { unit: similar, input: similarInput, title: 'ABC123 D — 差分の執筆例', sources: [source] },
  ].map((example) => {
    const preparation = prepareExplanationAuthoring(example.input);
    const validation = validateAuthoringOutput(example.unit, example.input);
    if (preparation.status !== 'authoring_required' || validation.status !== 'ready')
      throw new Error(JSON.stringify({ preparation, validation }));
    const document = renderProblemAuthoringDocument(example.unit, example.title, {
      home: '[priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)',
      outcomes: ['単調な探索境界から上位の状態を列挙する。'],
      prerequisites: [],
      sources: example.sources.map((item) => `[公式出典](${item.url})`),
    });
    return { ...example, preparation, document };
  });
}
