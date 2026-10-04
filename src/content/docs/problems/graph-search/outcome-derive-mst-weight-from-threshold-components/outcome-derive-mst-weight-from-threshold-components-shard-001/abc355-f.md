---
title: "ABC355-F — MST Query"
draft: true
authoringUnit: {"problemId":"abc355-f","docPath":"src/content/docs/problems/graph-search/outcome-derive-mst-weight-from-threshold-components/outcome-derive-mst-weight-from-threshold-components-shard-001/abc355-f.md","learningOutcomeIds":["outcome-derive-mst-weight-from-threshold-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-dsu-components"],"sourceRevisionIds":["source-abc355-editorial-10072-b0b2651882f9eced13b53a7f7015c8fee4a5eda9771810884da1635af703c536","source-abc355-f-problem-777f87d12143504d9185ddb463ae9444b5ce67579a5df710def09ff6c653a930"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重みk以下graphの成分数c_kについてMST和はΣ_{k=0}^{W−1}(c_k−1)。追加辺重みwはk≥wだけを変え、union成功ごとc_kが1減る。従って各成功で答え1減算が正確で再MST不要。","sourceRevisionIds":["source-abc355-editorial-10072-b0b2651882f9eced13b53a7f7015c8fee4a5eda9771810884da1635af703c536","source-abc355-f-problem-777f87d12143504d9185ddb463ae9444b5ce67579a5df710def09ff6c653a930"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- 重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

この解説で扱わないこと:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

辺重みが1..10と極端に小さい。G_k を重み k 以下の辺だけの graph とすると、Kruskal の telescoping から MST 重みは Σ_{k=0}^{9}(components(G_k)−1) で表せる。 辺 (u,v,w) の追加は全 k≥w の G_k に同じ connectivity edge を追加するだけで、削除がないため各 threshold を Union-Find で独立管理できる。 MST の重み w は「重み≥1,…,w の層を一つずつ払う」と分解でき、層 k+1 で必要な辺数が c(G_k)−1 になる。 k≥w の各 DSU で u,v が別 component の時だけ answer を1減らすと、Σ(c_k−1) を直接維持できる。

採用する候補: 重み threshold 0..9 ごとの DSU と component 数を持ち、追加辺を該当 threshold 全てへ unite する。

threshold 数が定数10で、union 成功のたび components が1減りMST和も1減るため一 query ほぼ定数で更新できる。

棄却する候補: 各辺追加後に全辺を重み順に走査して Kruskal 法をやり直す。

辺数が Q とともに増え、全 query 合計が O(Q(N+Q)) になる。

MST の重み w は「重み≥1,…,w の層を一つずつ払う」と分解でき、層 k+1 で必要な辺数が c(G_k)−1 になる。

k≥w の各 DSU で u,v が別 component の時だけ answer を1減らすと、Σ(c_k−1) を直接維持できる。

10個の DSU を初期化し、初期木の各辺 (a,b,c) を k=c..9 へ unite する。component 数から ans=Σ_{k=0}^9(c_k−1) を作る。query (u,v,w) では k=w..9 で unite が成功するたび ans-- し、更新後 ans を出力する。

## 典型の発動条件

### 小重みの threshold 分解

発動条件: 重み種類数 W が小さく、MST/最小 bottleneck 情報を追加辺下で維持するとき。

重み≤k の連結性を全 k で持ち、目的値を component 数の層和にする。

### 追加専用 connectivity の並列 DSU

発動条件: 複数の単調な edge filter graph に同じ追加が波及するとき。

filter ごとに Union-Find を持ち、successful union だけ集約量へ反映する。

## 問題固有の要素

動的 MST の一般データ構造ではなく、重み上限10を使って MST重みそのものを connectivity layers の面積として表す。

別の問題へ持ち帰る視点: 重み値域が小さいとき、weighted quantity を threshold indicator の総和へ主客転倒する。

## 正当性

重みk以下graphの成分数c_kについてMST和はΣ_{k=0}^{W−1}(c_k−1)。追加辺重みwはk≥wだけを変え、union成功ごとc_kが1減る。従って各成功で答え1減算が正確で再MST不要。

## 実装上の注意

- G_0 は辺なし、G_10 は常に連結で和には k=0..9 を使う。追加重み w の辺は threshold k≥w だけへ入れる。

## 復習の核

- MST辺一本の重みを threshold 層へ分解し、Σ(c_k−1) の式を自分で telescoping する。DSU merge失敗時に答えを変えない。

## 計算量と制約

### 時間

N頂点Q追加、重み上限W=10。10 DSUで O(W(N+Q)α(N))。

### 空間

W個DSUで O(WN)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq a_i < b_i \leq N; 1 \leq u_i < v_i \leq N; 1 \leq c_i, w_i \leq 10; The graph is connected before processing the queries.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/editorial/10072) — source-abc355-editorial-10072-b0b2651882f9eced13b53a7f7015c8fee4a5eda9771810884da1635af703c536
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/tasks/abc355_f) — source-abc355-f-problem-777f87d12143504d9185ddb463ae9444b5ce67579a5df710def09ff6c653a930
