---
title: "ABC277-F — Sorting a Matrix"
draft: true
authoringUnit: {"problemId":"abc277-f","docPath":"src/content/docs/problems/graph-search/outcome-process-dag-in-topological-order/outcome-process-dag-in-topological-order-shard-001/abc277-f.md","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dag-topological-processing"],"sourceRevisionIds":["source-abc277-editorial-5205-50a17c7304820afec392f4f5d2e4d68029b5d5917bed293338b3f1944e58fa31","source-abc277-f-problem-31003897c55646800d102d379355637ceb915026df0d7f2addf5b78c1530286b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非零値を持つ行の区間 `[min,max]` が重ならず並ぶことが、行順で全ての既知値比較を満たせる条件である。同じminの行はmaxの小さい順なら条件を保つ。列側では、各行内の異なる値group間に張った補助辺が「小さい値の列を大きい値より前へ置く」という全制約と同値である。DAGならtopological順を列順にでき、行区間順と合わせて非零値を非減少に並べられる。残る0は必要位置へ埋められる。","sourceRevisionIds":["source-abc277-editorial-5205-50a17c7304820afec392f4f5d2e4d68029b5d5917bed293338b3f1944e58fa31","source-abc277-f-problem-31003897c55646800d102d379355637ceb915026df0d7f2addf5b78c1530286b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)

- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

0は任意の正数へ補完できるため、まず各行の非零値だけを見る。各行の既知値は `[min,max]` の区間を占めるので、行を `(min,max)` の辞書順で並べ、隣接行で `max_i≤min_{i+1}` なら行間の条件を満たせる。同じminではmaxの小さい行を先に置く。

列順の条件は別にDAGへする。各行の値groupを昇順に並べ、隣り合うgroupの間へ補助頂点を置けば、低いgroupの全列を高いgroupより前にする制約を辺数線形で表せる。

採用する候補: 行intervalの整列可能性と、列順制約DAGの非巡回性を別々に判定する。

行と列の置換に関する条件を独立に検査できる。

棄却する候補: 各行の大小関係を列pairごとの辺にして、全条件を直接graphへ張る。

1行だけでW²本の辺が必要になる。

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

非零値を持つ行の区間 `[min,max]` が重ならず並ぶことが、行順で全ての既知値比較を満たせる条件である。同じminの行はmaxの小さい順なら条件を保つ。列側では、各行内の異なる値group間に張った補助辺が「小さい値の列を大きい値より前へ置く」という全制約と同値である。DAGならtopological順を列順にでき、行区間順と合わせて非零値を非減少に並べられる。残る0は必要位置へ埋められる。

## 実装上の注意

- 行を `min` だけでsortせず、`(min,max)` の辞書順にする。同じminのsingleton行を先に置く。
- 0だけの行は区間検査から除き、値group内には順序辺を作らない。

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
