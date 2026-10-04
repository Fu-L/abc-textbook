---
title: "ABC252-E — Road Reduction"
draft: true
authoringUnit: {"problemId":"abc252-e","docPath":"src/content/docs/problems/graph-search/outcome-build-shortest-path-certificate/outcome-build-shortest-path-certificate-shard-001/abc252-e.md","learningOutcomeIds":["outcome-build-shortest-path-certificate"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["最短路を証明する木・経路の復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path-certificate","tag-shortest-path"],"sourceRevisionIds":["source-abc252-e-problem-66a6922aa6112c57b3273f081ee76d23a0be0bff39be72e343c3adf26edb445a","source-abc252-editorial-3980-86c3bf6be5d27aff2257287ab1f785e6f0321716a66591195820175c4ab1a0e2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"任意spanning treeの各頂点距離は元graph最短距離以上。保存親辺は正重みにより厳密に小distへ向かいcycleを作らず根1へ届く。したがってN−1辺で全最短距離を同時実現し距離和下界を達成する。","sourceRevisionIds":["source-abc252-e-problem-66a6922aa6112c57b3273f081ee76d23a0be0bff39be72e343c3adf26edb445a","source-abc252-editorial-3980-86c3bf6be5d27aff2257287ab1f785e6f0321716a66591195820175c4ab1a0e2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路を証明する木・経路の復元](src/content/docs/learn/graph/shortest-path-reconstruction.md)

- 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。

先に読む単元:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

全道路を使えるときの都市 1 から都市 v への最短距離を D_v とする。道路を N-1 本に減らした部分グラフ上の距離 d_v は必ず D_v 以上なので、目的値には Σ_{v=2}^N D_v という下界がある。各 v≠1 について D_v=D_u+C_{uv} を満たす直前辺を一本選ぶ。C_{uv}>0 より D_u<D_v なので、親を辿るたび距離が厳密に減って都市 1 へ到達し、選んだ N-1 本は全頂点を結ぶ木になる。各 d_v の個別下界 D_v を一つの最短路木で同時に達成できるため、距離和を別の全域木最適化として扱う必要はない。

採用する候補: Dijkstra で dist[v] が厳密に改善された緩和ごとに predecessor edge を更新し、計算終了後に頂点 2..N の保存辺を出力する。

各保存辺は dist[v]=dist[parent]+w を満たし、w>0 なので親の距離が厳密に小さい。親を辿れば都市 1 へ到達するため、N-1 本で全ての最短距離 D_v を同時に保つ木になる。

棄却する候補: 辺重みの総和が最小になる minimum spanning tree を構成する。

MST は木全体の重みを最小化するが、頂点 1 から各頂点への元の最短距離を保存する保証がない。

隣接辺 (v,to,w,id) で dist[to]>dist[v]+w となるたび dist[to] と parentEdge[to]=id を更新する。Dijkstra 終了後、頂点 2..N の parentEdge を出力すれば、距離和の下界を達成する N-1 本が得られる。

## 典型の発動条件

### 最短路木

発動条件: 単一始点最短距離を保つ疎な部分グラフが必要なとき。

各頂点への最短路 predecessor を一本選んで木を構成する。

### Dijkstra 法

発動条件: 非負重みグラフで単一始点最短路を求めるとき。

距離の緩和と同時に採用候補の edge id を更新する。

## 問題固有の要素

「N-1 本」という語から MST へ飛びつかず、保存すべき量が全体重みか各頂点の距離かを比較する。

別の問題へ持ち帰る視点: 木を求める問題では、最適化目的と保持すべき不変量から MST・DFS 木・最短路木を区別する。

## 正当性

任意spanning treeの各頂点距離は元graph最短距離以上。保存親辺は正重みにより厳密に小distへ向かいcycleを作らず根1へ届く。したがってN−1辺で全最短距離を同時実現し距離和下界を達成する。

## 実装上の注意

- 最短距離は最大で約 2×10^14 になるため 64-bit 整数で持つ。同距離の別候補へ更新する必要はなく、priority queue から取り出した距離が現在の dist と異なる stale entry は捨てる。

## 復習の核

- MST が距離和の下界を達成しない小グラフを作り、正の辺重みにより parent の距離が厳密に減ることから、選択辺が閉路を持たず都市 1 へ連結する証明を再構成する。

## 計算量と制約

### 時間

N頂点M辺。Dijkstra O((N+M)log N)、N−1辺出力O(N)。

### 空間

隣接、dist、親辺 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq 2\times 10^5; 1 \leq A_i < B_i \leq N; (A_i,B_i)\neq(A_j,B_j) if i\neq j.; 1\leq C_i \leq 10^9; One can travel between any two cities using some roads.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/tasks/abc252_e) — source-abc252-e-problem-66a6922aa6112c57b3273f081ee76d23a0be0bff39be72e343c3adf26edb445a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/editorial/3980) — source-abc252-editorial-3980-86c3bf6be5d27aff2257287ab1f785e6f0321716a66591195820175c4ab1a0e2
