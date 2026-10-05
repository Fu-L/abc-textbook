---
title: "ABC237-E — Skiing"
draft: true
authoringUnit: {"problemId":"abc237-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc237-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc237-e-problem-7beb830ceedf710e6780afbe251c64ed7894804a10a0b4965116bc0418ccd4e4","source-abc237-editorial-3339-1fcc5407294a72af90f0c1270c4e3a9453333a0a2865360534b45792a07ba064"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"楽しさ+現在標高は下りで不変、上りで上昇分だけ減る。よってpath楽しさ=H_start−H_end−累積上昇量。累積上昇を非負辺costとして最小化すれば各終点の楽しさを最大化でき、その最大が全答え。","sourceRevisionIds":["source-abc237-e-problem-7beb830ceedf710e6780afbe251c64ed7894804a10a0b4965116bc0418ccd4e4","source-abc237-editorial-3339-1fcc5407294a72af90f0c1270c4e3a9453333a0a2865360534b45792a07ba064"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

下りでは高度差だけ得をする一方、上りでは高度差の二倍を失うため、楽しさをそのまま辺重みにすると負辺が現れる。「現在の楽しさ＋現在地の標高」を追うと、下りで値は変わらず、上りで上昇高度分だけ減る。開始時の「楽しさ＋標高」は H_1 であり、経路中に支払うのは上りの高度差だけなので、頂点 v での最大値は H_1−dist[v] になる。

棄却する候補: 楽しさの符号を反転した辺重みに対して Bellman-Ford 法で最短路を求める。

負辺を扱えるが、N、M がともに 20 万までなので O(NM) では間に合わない。

採用する候補: 標高をポテンシャルとして辺を付け替え、u から v へのコストを max(0,H_v−H_u) として頂点 1 から Dijkstra 法を行う。

全辺コストが非負になり、頂点 v で得られる最大の楽しさを H_1−dist[v]−H_v と復元できる。

負辺を含む経路評価に頂点ポテンシャル H_i を加えて非負の reduced cost へ変換し、単一始点最短路として解く。

## 典型の発動条件

### 頂点ポテンシャルによる辺重み変換

発動条件: 移動利得に頂点値の差が含まれ、そのままでは負辺になるが、経路の始点・終点だけで相殺できるとき。

目的値へ現在頂点の標高を加え、下りを 0、上りを高度差という非負コストにする。

### 非負辺上の Dijkstra 法

発動条件: ポテンシャル変換後の全移動コストが非負で、全終点への最小コストが必要なとき。

頂点 1 から上りコストの最小値を求め、全頂点で元の楽しさへ戻して最大を取る。

## 問題固有の要素

無向の坂一本は、高い方から低い方へコスト 0、低い方から高い方へ標高差の二本の有向辺になる。

別の問題へ持ち帰る視点: 方向で利得が異なる無向辺は、有向辺へ分けた後に各方向の変換後コストを個別に導く。

## 正当性

楽しさ+現在標高は下りで不変、上りで上昇分だけ減る。よってpath楽しさ=H_start−H_end−累積上昇量。累積上昇を非負辺costとして最小化すれば各終点の楽しさを最大化でき、その最大が全答え。

## 実装上の注意

- 距離と標高差の累積は 32 bit 整数を超え得るため、64 bit 整数で保持する。
- 最終答えには移動しない場合の 0 も含め、各 v の H_1−dist[v]−H_v との最大を取る。

## 復習の核

- 負辺が頂点量の差から生じているときは、Bellman-Ford 法へ進む前に目的値へ頂点量を足して符号が消えるか調べる。
- 変換後の距離だけを答えにせず、始点と終点のポテンシャル差を戻す式を先に固定する。

## 計算量と制約

### 時間

N 頂点、M 無向辺。非負cost Dijkstra O((N+M)log N)。

### 空間

隣接、距離 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq \min( 2\times 10^5,\frac{N(N-1)}{2}); 0 \leq H_i\leq 10^8 (1 \leq i \leq N); 1 \leq U_i < V_i \leq N (1 \leq i \leq M); (U_i,V_i) \neq (U_j, V_j) if i \neq j.; All values in input are integers.; It is possible to travel between any two spaces using some slopes.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/tasks/abc237_e) — source-abc237-e-problem-7beb830ceedf710e6780afbe251c64ed7894804a10a0b4965116bc0418ccd4e4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/editorial/3339) — source-abc237-editorial-3339-1fcc5407294a72af90f0c1270c4e3a9453333a0a2865360534b45792a07ba064
