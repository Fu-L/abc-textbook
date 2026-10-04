---
title: "ABC245-G — Foreign Friends"
draft: true
authoringUnit: {"problemId":"abc245-g","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc245-g.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc245-editorial-3662-b961c3b834480885405633505668f8bd0f604a93e90d0b28607b613e678492fa","source-abc245-g-problem-6d7761263d562528347302c74f18394766880c6fdc390684c8189239dba378ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"自国除外は一labelだけ禁止するので最短二相異国候補の一方が最良合法候補。第三以降の国はある点で既に二国に劣り同一後続pathでも順位が上がらないため伝播不要。非負距離順で二labelを確定して全自国除外距離を得る。","sourceRevisionIds":["source-abc245-editorial-3662-b961c3b834480885405633505668f8bd0f604a93e90d0b28607b613e678492fa","source-abc245-g-problem-6d7761263d562528347302c74f18394766880c6fdc390684c8189239dba378ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

友達にする辺の費用は非負なので、ある人から人気者までに必要な最小総費用は重み付き無向グラフの最短距離である。 求める始点ごとに許される人気者の国が異なるが、各頂点で距離の短い異なる 2 国分まで分かれば、自国と異なる候補が必ずその中にある。 頂点 v に到達する国別距離の上位 2 国を保持すれば、A_v と異なる国は少なくとも一方であり、3 番目以降の距離が答えになることはない。 優先度付き queue の状態を (距離, 頂点, 始点の国) とし、同じ頂点・同じ国の後続状態は捨てることで、各頂点の確定回数を 2 回に抑えられる。

採用する候補: 人気者を距離 0・所属国ラベル付きの始点として同時に Dijkstra 法を行い、各頂点で異なる国から来た最短状態を 2 個まで確定する。

国×頂点を全列挙せず、各頂点の必要な 2 ラベルだけに制限して非負辺最短路を共有できる。

棄却する候補: 各人気者から Dijkstra 法を行い、各人について自国以外の結果の最小値を取る。

人気者数 L も N まで増えるため、同じグラフを L 回探索する計算量は制約に収まらない。

頂点 v に到達する国別距離の上位 2 国を保持すれば、A_v と異なる国は少なくとも一方であり、3 番目以降の距離が答えになることはない。

優先度付き queue の状態を (距離, 頂点, 始点の国) とし、同じ頂点・同じ国の後続状態は捨てることで、各頂点の確定回数を 2 回に抑えられる。

全人気者 (B_i, A_{B_i}) を距離 0 で queue に入れる。Dijkstra 順に取り出し、頂点ごとに未確定の国なら最短 2 国まで記録して隣接辺へ緩和する。最後に各頂点の記録から A_i と異なる国の最小距離を選び、なければ -1 とする。

## 典型の発動条件

### ラベル付き multi-source Dijkstra

発動条件: 複数の始点群からの最短距離が必要で、始点のカテゴリも答えの条件になるとき。

人気者を所属国ラベル付きで同時投入し、距離順を保ったまま国別候補を伝播する。

### 上位少数状態の枝刈り

発動条件: カテゴリ別状態は多いが、各地点の答えに距離順の少数カテゴリしか影響しないとき。

各頂点では異なる国の最短 2 状態だけを確定し、それ以降を展開しない。

## 問題固有の要素

除外されるカテゴリが各人の自国 1 個だけなので、国別最短距離の上位 2 個があれば必ず最良の許容候補を復元できる。

別の問題へ持ち帰る視点: 「1 カテゴリを除く最小値」は、全カテゴリを持たず異なるカテゴリの上位 2 候補を持つことで処理できる。

## 正当性

自国除外は一labelだけ禁止するので最短二相異国候補の一方が最良合法候補。第三以降の国はある点で既に二国に劣り同一後続pathでも順位が上がらないため伝播不要。非負距離順で二labelを確定して全自国除外距離を得る。

## 実装上の注意

- 同一国の人気者が複数いても、頂点ごとの 2 枠には国を重複登録しない。古い queue state と 3 国目以降も展開しない。
- 辺費用の経路和は 32 bit を超え得るため 64 bit 整数と十分大きい INF を使う。

## 復習の核

- 最寄り人気者が自国、2 番目が他国、さらに同じ自国の人気者が複数ある例で、「2 人」ではなく「異なる 2 国」を保持する理由を説明させる。

## 計算量と制約

### 時間

N頂点M辺、K国、L人気者。各点二国のみ展開するDijkstra O((N+M+L)log(N+M+L))。

### 空間

隣接、各点二label、heap O(N+M+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq M \leq 10^5; 1 \leq K \leq 10^5; 1 \leq L \leq N; 1 \leq A_i \leq K; 1 \leq B_1<B_2<\cdots<B_L\leq N; 1\leq C_i\leq 10^9; 1\leq U_i<V_i\leq N; (U_i, V_i)\neq (U_j,V_j) if i \neq j.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/editorial/3662) — source-abc245-editorial-3662-b961c3b834480885405633505668f8bd0f604a93e90d0b28607b613e678492fa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/tasks/abc245_g) — source-abc245-g-problem-6d7761263d562528347302c74f18394766880c6fdc390684c8189239dba378ad
