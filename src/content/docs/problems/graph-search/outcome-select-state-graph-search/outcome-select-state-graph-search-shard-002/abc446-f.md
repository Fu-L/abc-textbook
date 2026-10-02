---
title: "ABC446-F — Reachable Set 2"
draft: true
authoringUnit: {"problemId":"abc446-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc446-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc446-editorial-16384-e279164f75dd3bd2328adc1e2913cfadc8fe01e518d1feeff4473560ea3eae4f","source-abc446-f-problem-f542f915a44d41318c9a77b17d56066f497fa351159eabce91ad755de4b504ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"prefix誘導graphで全頂点に届かなければ外削除で新到達性を作れず不可能。全到達なら外へ出る最初のneighborを全削除するのが必須で、それらを消せば外へのpathがなく十分。prefix追加で到達性は増加のみなので新到達queueを伝播しboundaryをdistinct countすると全最小値を得る。","sourceRevisionIds":["source-abc446-editorial-16384-e279164f75dd3bd2328adc1e2913cfadc8fe01e518d1feeff4473560ea3eae4f","source-abc446-f-problem-f542f915a44d41318c9a77b17d56066f497fa351159eabce91ad755de4b504ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点1から到達可能な集合をちょうど {1..i} にできる必要条件は、誘導部分 graph G_i で1から全1..iへ到達できること。可能なら削除すべき外側頂点は、その集合から一辺で出る頂点に限られる。 G_i で到達不能な j≤i は、外側頂点を削除しても新たに到達可能にはならないので、その i の答えは -1 である。 prefix が全到達なら、外へ出る path の最初の外側頂点を全て削除すれば、それより先の外側頂点は自動的に到達不能になる。

採用する候補: 頂点番号順に G_i を増やし、新たに1から到達可能になった頂点を増分 DFS で伝播する。同時に到達集合から外側へ出る隣接先の distinct 数を保ち、各 i の答えを出す。

到達済み頂点・辺は全過程で定数回だけ走査され、G_i で prefix 全体が reachable なら境界を一歩越える頂点を削除することが必要十分になる。

棄却する候補: 各 i ごとに頂点 i+1..N の削除集合を探索し、到達可能集合を最初から計算する。

N 回の graph traversal だけでも O(N(N+M)) となり、削除集合の探索はさらに指数的である。

G_i で到達不能な j≤i は、外側頂点を削除しても新たに到達可能にはならないので、その i の答えは -1 である。

prefix が全到達なら、外へ出る path の最初の外側頂点を全て削除すれば、それより先の外側頂点は自動的に到達不能になる。

頂点 i と内部辺を順に有効化し、到達済み頂点から i への入辺があれば i を queue に入れる。新規到達頂点から有効な出辺を探索して連鎖到達を広げ、全 graph 上の一歩隣接先を集合/最小前駆集計へ反映する。reachableCount=i なら境界数を返す。

## 典型の発動条件

### 増分 reachability

発動条件: 頂点番号 prefix を順に追加した誘導 graph の到達集合を全 prefix で求めたいとき。

新規到達頂点だけから DFS を再開し、各辺を定数回処理する。

### 到達境界の必要十分化

発動条件: reachable set を指定集合へ一致させるための最小削除を問うとき。

指定集合から一歩で外へ出る頂点だけを削除対象として数える。

## 問題固有の要素

頂点削除の組合せを探す前に、残したい集合内の reachability と、その集合から出る最初の境界を分離する。

別の問題へ持ち帰る視点: prefix ごとの graph query は、状態を捨てず頂点追加に伴う新規到達分だけを処理できる場合がある。

## 正当性

prefix誘導graphで全頂点に届かなければ外削除で新到達性を作れず不可能。全到達なら外へ出る最初のneighborを全削除するのが必須で、それらを消せば外へのpathがなく十分。prefix追加で到達性は増加のみなので新到達queueを伝播しboundaryをdistinct countすると全最小値を得る。

## 実装上の注意

- 未有効頂点への辺は到達伝播にはまだ使わず、境界数には重複なく数える。自己loop・多重辺があっても count を二重加算しない。

## 復習の核

- prefix 内に未到達頂点がある不可能性と、境界頂点を全削除すれば十分なことを path の最初の外側頂点で証明する。

## 計算量と制約

### 時間

N有向頂点M辺。activate/reach/boundaryを各edge定数回処理して O(N+M)。

### 空間

正逆adjacencyとreach,boundary flag O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 3\times 10^5; 1\leq M\leq 3\times 10^5; 1\leq U_i,V_i\leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/editorial/16384) — source-abc446-editorial-16384-e279164f75dd3bd2328adc1e2913cfadc8fe01e518d1feeff4473560ea3eae4f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/tasks/abc446_f) — source-abc446-f-problem-f542f915a44d41318c9a77b17d56066f497fa351159eabce91ad755de4b504ba
