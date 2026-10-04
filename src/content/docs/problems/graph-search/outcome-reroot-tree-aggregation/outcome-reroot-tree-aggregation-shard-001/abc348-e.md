---
title: "ABC348-E — Minimize Sum of Distances"
draft: true
authoringUnit: {"problemId":"abc348-e","docPath":"src/content/docs/problems/graph-search/outcome-reroot-tree-aggregation/outcome-reroot-tree-aggregation-shard-001/abc348-e.md","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rerooting"],"sourceRevisionIds":["source-abc348-e-problem-823e6b5e6f018b5c00d4d94d6bd9bf1fe258ca5d9a46580b391823fef195d866","source-abc348-editorial-9706-57a215cd911ca45ed5e672c5b31b51ffbcfc636f4ebb913932872b2cdaceed73"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一辺越えて根を子へ移すと子側重み総和subの距離が1減り、外側重みT−subが1増えるため差T−2sub。初期ΣC_v depth[v]から全rootを厳密に更新し最小を取る。","sourceRevisionIds":["source-abc348-e-problem-823e6b5e6f018b5c00d4d94d6bd9bf1fe258ca5d9a46580b391823fef195d866","source-abc348-editorial-9706-57a215cd911ca45ed5e672c5b31b51ffbcfc636f4ebb913932872b2cdaceed73"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rerooting・全方位木DP](src/content/docs/learn/tree/rerooting.md)

- 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

先に読む単元:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

## 考察

treeを一つroot化すると、ある頂点から全頂点への重み付き距離和と各subtreeのC総和が分かれば、rootをedge一本隣へ移した時の値を差分計算できる。 parent vからchild uへ基準点を移すと、subtree(u)内の各距離は1減り、それ以外は1増える。total weightをT、sub[u]をsとすればf(u)=f(v)-s+(T-s)=f(v)+T-2sである。

採用する候補: subtree weightを求めた後、rerooting式で全f(v)を計算する

二回のDFSで全頂点の目的値をO(N)計算し、その最小を取れる。

棄却する候補: 各vからDFSして距離和を計算する

一頂点O(N)をN回行いO(N^2)になる。

parent vからchild uへ基準点を移すと、subtree(u)内の各距離は1減り、それ以外は1増える。total weightをT、sub[u]をsとすればf(u)=f(v)-s+(T-s)=f(v)+T-2sである。

頂点1をrootにDFSしdepthとsubtree weight sub[v]を求め、f(1)=ΣC_v·depth[v]を計算する。二度目のDFSで各parent-childにf[child]=f[parent]+T-2sub[child]を適用し、全fの最小を出力する。

## 典型の発動条件

### rerooting DP

発動条件: rootに依存する全頂点への距離和を全rootについて求めたい。

edgeを跨いだ時に近づくsubtree量と遠ざかる補集合量の差で更新する。

### 重み付きsubtree集計

発動条件: 各頂点が異なるmultiplicity C_iで距離へ寄与する。

頂点数の代わりにsubtree内C総和をpostorderで持つ。

## 問題固有の要素

unweighted centroidのsize式をC重みへそのまま一般化し、移動差の符号からweighted centroidも解釈できる。

別の問題へ持ち帰る視点: 距離和rerootingは対象数を任意の非負weight総量に置き換えて成立する。

## 正当性

一辺越えて根を子へ移すと子側重み総和subの距離が1減り、外側重みT−subが1増えるため差T−2sub。初期ΣC_v depth[v]から全rootを厳密に更新し最小を取る。

## 実装上の注意

- fは約5×10^18まで達するのでsigned 64bitを使い、2×fのような不要な倍化を避ける。N=1ではf=0である。

## 復習の核

- path、star、重い頂点一つ、N=1を全点BFSの距離和と比較しreroot差を確認する。

## 計算量と制約

### 時間

N 頂点、二回走査 O(N)。

### 空間

木、部分木重み、全根目的値 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq A_i, B_i \leq N; The given graph is a tree.; 1 \leq C_i \leq 10^9

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/tasks/abc348_e) — source-abc348-e-problem-823e6b5e6f018b5c00d4d94d6bd9bf1fe258ca5d9a46580b391823fef195d866
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/editorial/9706) — source-abc348-editorial-9706-57a215cd911ca45ed5e672c5b31b51ffbcfc636f4ebb913932872b2cdaceed73
