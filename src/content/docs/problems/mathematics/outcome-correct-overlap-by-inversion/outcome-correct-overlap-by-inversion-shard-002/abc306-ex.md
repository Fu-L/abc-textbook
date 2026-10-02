---
title: "ABC306-EX — Balance Scale"
draft: true
authoringUnit: {"problemId":"abc306-ex","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc306-ex.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing","unit-dp-subset-state"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-dag-topological-processing","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc306-ex-problem-b9c7a8bd006550e4d73f568241fff4d4c28a401e89035db0d0f5053c9441705b","source-abc306-editorial-6608-b26cf5ec067dbb3ef7869e21dc5ec7a7d1d7630314db9f49d2d1710a6ad2fa10"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等値比較を縮約した後の厳密比較がDAGであることが実現可能性と同値。任意の非空DAGはsourceを持ち、source classの一つ以上を選ぶ交互和は1なので除去順重複を相殺できる。選択頂点sの元graph各成分は同時sourceとして一classへ等値縮約されるため符号は(−1)^{c(s)+1}になる。補集合の既計算dpを合成すると全実現可能結果を一度数える。","sourceRevisionIds":["source-abc306-ex-problem-b9c7a8bd006550e4d73f568241fff4d4c28a401e89035db0d0f5053c9441705b","source-abc306-editorial-6608-b26cf5ec067dbb3ef7869e21dc5ec7a7d1d7630314db9f49d2d1710a6ad2fa10"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、比較edge一本。","procedure":["結果は小、大、等の3通りで全て実数重みにより実現できる。","dp[11]はsingleton除去2項と両頂点除去1項。"],"executionTarget":null,"expectedResult":"3。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"prerequisiteIds":["unit-dag-topological-processing","unit-dp-subset-state"],"attainmentCondition":"三頂点全pair比較では全3³=27結果が可能か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"13。"},"answer":{"reasoningOrVerification":"厳密cycleは実現不能。三要素の弱順序は全等1、二class6、三class6の13。","procedure":["具体例の各状態・寄与を再計算する。","厳密cycleは実現不能。三要素の弱順序は全等1、二class6、三class6の13。"],"expectedResult":"13。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

各comparisonの<,>,=はedgeの向きまたは両端の同一weight classへのcontractに対応し、実現可能性はcontract後のstrict-order digraphがDAGであることと同値である。

DAGからindegree-zero classesを順に除く数え方は複数sourcesの除去順を重複計上するため、source集合に包除原理が必要になる。

棄却する候補: M edgesへ3結果をすべて割り当て、cycle consistencyを検査する。

3^MでMは最大136となる。

採用する候補: vertex subset maskのDPを用い、除去する非空subset sが元graph上で持つconnected components数c(s)に応じて符号(−1)^(c(s)+1)を掛ける。

source equality classesの全選択を包除で一度ずつ数え、全submask遷移はO(3^N)でN≤17に収まる。

同時にindegree zeroとして除くverticesは、元のundirected selected subgraphの各connected component内で=により一classへcontractされる必要がある。

dp[mask]=Σ_{∅≠s⊆mask}dp\[mask\s](−1)^(c(s)+1)とすると、複数zero-indegree componentsを持つcaseのalternating sumが1になる。

comparison outcomesのrealisabilityをcontracted DAG countingへ写し、minimal classesのsubset inclusion-exclusionを3^N bit DPで評価する。

## 典型の発動条件

### DAGのsource除去と包除原理

発動条件: partial orderをminimal elementsの除去で数えると複数の除去順が同じ構造を表すとき。

nonempty source subsetを選ぶsubmask transitionにconnected-component数由来のalternating signを付ける。

### 全subsetの連結成分数前計算

発動条件: Nが20未満で、各submask transitionの係数がinduced subgraphのcomponent countに依存するとき。

least bitを追加するrecurrence等でc(mask)を全2^N masksについて求める。

## 問題固有の要素

equal outcomesは単なるbidirectional edgesではなくvertex identificationであり、異なるmass classes間だけにstrict directed edgesが残る。

別の問題へ持ち帰る視点: 比較結果の=を含む整合性問題は、equality classesをcontractしてstrict relationのacyclicityを見る。

## 正当性

等値比較を縮約した後の厳密比較がDAGであることが実現可能性と同値。任意の非空DAGはsourceを持ち、source classの一つ以上を選ぶ交互和は1なので除去順重複を相殺できる。選択頂点sの元graph各成分は同時sourceとして一classへ等値縮約されるため符号は(−1)^{c(s)+1}になる。補集合の既計算dpを合成すると全実現可能結果を一度数える。

## 実装上の注意

- submask loopはs=maskから(s−1)&maskでempty直前まで回し、mask\sの既計算順を保証する。
- c(s)のparityでmodular加減を行い、負値を998244353へ正規化する。

## 復習の核

- 三値比較はequality contract後のstrict partial orderとしてmodel化する。
- DAGをsourcesから生成する数え上げでは、同時に選べるsourcesによる重複を包除で補正する。

## 計算量と制約

### 時間

O(3^N+N²2^N)。誘導graphの成分数を前計算してsource集合包除を行う。

### 空間

O(2^N+N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \le N \le 17; 1 \le M \le \frac{N \times (N-1)}{2}; 1 \le A_i < B_i \le N; i \neq j \Rightarrow (A_i,B_i) \neq (A_j,B_j)

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、比較edge一本。

1. 結果は小、大、等の3通りで全て実数重みにより実現できる。
2. dp[11]はsingleton除去2項と両頂点除去1項。

期待される結果: 3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

三頂点全pair比較では全3³=27結果が可能か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

厳密cycleは実現不能。三要素の弱順序は全等1、二class6、三class6の13。

確認結果: 13。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/tasks/abc306_h) — source-abc306-ex-problem-b9c7a8bd006550e4d73f568241fff4d4c28a401e89035db0d0f5053c9441705b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/editorial/6608) — source-abc306-editorial-6608-b26cf5ec067dbb3ef7869e21dc5ec7a7d1d7630314db9f49d2d1710a6ad2fa10
