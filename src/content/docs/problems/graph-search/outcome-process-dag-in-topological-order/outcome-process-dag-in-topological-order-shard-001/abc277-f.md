---
title: "ABC277-F — Sorting a Matrix"
draft: true
authoringUnit: {"problemId":"abc277-f","docPath":"src/content/docs/problems/graph-search/outcome-process-dag-in-topological-order/outcome-process-dag-in-topological-order-shard-001/abc277-f.md","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dag-topological-processing"],"sourceRevisionIds":["source-abc277-editorial-5205-50a17c7304820afec392f4f5d2e4d68029b5d5917bed293338b3f1944e58fa31","source-abc277-f-problem-31003897c55646800d102d379355637ceb915026df0d7f2addf5b78c1530286b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"row順は非零min/max区間が隣接非重複に並べられることと同値。column順は各rowの小value groupを全て大value groupより先へ置く共通部分順序で、補助nodeの辺が全pair条件を等価に表す。DAGならtopological列順とrow順で非零全体を整列し0も埋められる。","sourceRevisionIds":["source-abc277-editorial-5205-50a17c7304820afec392f4f5d2e4d68029b5d5917bed293338b3f1944e58fa31","source-abc277-f-problem-31003897c55646800d102d379355637ceb915026df0d7f2addf5b78c1530286b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)

- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

0は後から任意の正数にできるため、最終flatten列が非減少かは、0を除いた既知値の相対順序だけで決まる。 最終条件は、各行の既知値区間が行順に重ならないことと、各行内で既知値が同じ共通列順に非減少になることへ分離できる。 非零要素を持つ行はminの昇順に並べ、直前までのmax≤次のminなら行間の全比較を満たす。全0行は既知制約を持たない。 1行の正値を同値group順に並べ、隣接group間に補助頂点を挟めば、低いgroupの全列が高いgroupの全列より前という推移閉包を線形本数のedgeで表せる。

採用する候補: 非零値だけで行ごとの[min,max]を並べて非重複を検査し、列には各行の大小制約を補助頂点で圧縮したDAGを作ってacyclicか判定する。

row swapとcolumn swapの影響を独立化し、全cell数に比例するgraphで共通列順の存在を判定できる。

棄却する候補: 各行でA_{i,j}<A_{i,j'}の全列pairへ直接edgeを張ってtopological sortする。

1行だけでW² edgeになり、H×W≤10^6でも辺数が大きすぎる。

非零要素を持つ行はminの昇順に並べ、直前までのmax≤次のminなら行間の全比較を満たす。全0行は既知制約を持たない。

1行の正値を同値group順に並べ、隣接group間に補助頂点を挟めば、低いgroupの全列が高いgroupの全列より前という推移閉包を線形本数のedgeで表せる。

各行の0を除くmin/maxを集め、空行を除いてsortし隣接区間を検査する。列番号W頂点に加え、各行の昇順value group境界ごとに補助頂点とgroup→aux→次groupのedgeを作り、全graphがDAGならYesとする。

## 典型の発動条件

### 行列sorting条件の独立化

発動条件: row permutationとcolumn permutationが可換で、最終順序条件を行間・行内へ分けられるとき。

行は値域interval、列は全行から来るprecedence制約として別々に判定する。

### dense precedenceの補助頂点圧縮

発動条件: group Aの全要素をgroup Bの全要素より前にする完全二部有向edgeが必要なとき。

隣接value group間にauxiliary nodeを置き、推移性で全大小pairを表す。

## 問題固有の要素

自由値0は順序制約から削除でき、残った既知値だけが行intervalと列DAGを決める。

別の問題へ持ち帰る視点: wildcardを任意値へ補完する非減少化では、wildcard除去後の既知列が非減少かを核にする。

## 正当性

row順は非零min/max区間が隣接非重複に並べられることと同値。column順は各rowの小value groupを全て大value groupより先へ置く共通部分順序で、補助nodeの辺が全pair条件を等価に表す。DAGならtopological列順とrow順で非零全体を整列し0も埋められる。

## 実装上の注意

- 各行で0はmin/maxにも列edgeにも含めず、正値がない行を通常の[INF,-INF] intervalとして誤判定しない。
- group内の同値列間には順序制約を張らず、group境界だけに補助頂点を作って総頂点・辺をHW規模に抑える。

## 復習の核

- 2×2の矛盾例で列制約cycleを描き、別の例で行[min,max]が交差すると列順に関係なく不可能なことを確認する。

## 計算量と制約

### 時間

H×W、非零cell数L。各行sort O(L log W)、行区間sort O(H log H)、圧縮順序graph O(W+L)とtoposort。

### 空間

盤面 O(HW)、補助graph O(W+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W; H \times W \leq 10^6; 0 \leq A_{i, j} \leq H \times W; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/editorial/5205) — source-abc277-editorial-5205-50a17c7304820afec392f4f5d2e4d68029b5d5917bed293338b3f1944e58fa31
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/tasks/abc277_f) — source-abc277-f-problem-31003897c55646800d102d379355637ceb915026df0d7f2addf5b78c1530286b
