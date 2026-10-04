---
title: "ABC282-E — Choose Two and Eat One"
draft: true
authoringUnit: {"problemId":"abc282-e","docPath":"src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc282-e.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange","unit-modular-arithmetic"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc282-e-problem-914b9b4d38269c619530f4c66c8620d8dc5b0b66aa42bc2e0c18cb4c9bf6629e","source-abc282-editorial-5398-d6e68174ec62656ceec64ff790551f0920345c205c50c7bdd3863cb13e6c9ed4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"消えたballを残ったballへ結ぶ操作辺は最終ballを根とするtreeである。逆に任意spanning treeは葉を親に食べさせる順で実現できるので操作合計とtree重み和は同じ。よって最大全域木が最適。","sourceRevisionIds":["source-abc282-e-problem-914b9b4d38269c619530f4c66c8620d8dc5b0b66aa42bc2e0c18cb4c9bf6629e","source-abc282-editorial-5398-d6e68174ec62656ceec64ff790551f0920345c205c50c7bdd3863cb13e6c9ed4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

各操作は2ballを結ぶscoreを得て片方を消すため、N-1回の選択pairをedgeとして記録できる。 消されたballを含む過去のpair関係をたどると、最後に残るballへ全ballがつながり、N-1 edgeなので選択edgeはtreeになる。 操作列から追加したN-1 edgeは、各削除ballを残したball側へ結ぶのでcycleを作らず全頂点を連結する。 逆にrooted spanning treeのleaf vと親pを選んでvを食べ続ければ、treeの全edge weightを一度ずつscoreにできる。

採用する候補: ballを頂点、pair scoreをedge重みとする完全graphのmaximum spanning treeをPrim/Kruskalで求める。

任意操作列と同weightのspanning treeが対応し、任意treeもleafから消す順で実現できるため最適値が一致する。

棄却する候補: その時点でscore最大のpairを毎回選び、片方を任意に食べる。

局所的にballを消す選択が将来使える高weight edgeを失わせ、全体最適を保証しない。

操作列から追加したN-1 edgeは、各削除ballを残したball側へ結ぶのでcycleを作らず全頂点を連結する。

逆にrooted spanning treeのleaf vと親pを選んでvを食べ続ければ、treeの全edge weightを一度ずつscoreにできる。

全i<jについてpowmod(A_i,A_j,M)+powmod(A_j,A_i,M)をmod Mしたweightを計算する。complete graphにmaximum版Primまたはweight降順Kruskalを適用し、採用N-1 edgeの和を出す。

## 典型の発動条件

### 操作列とspanning treeの対応

発動条件: 各操作で2component/要素を関係付け片方を消し、最後に1要素残るとき。

操作pairをedge化し、leaf eliminationとの双方向構成でtree最適化へ移す。

### maximum spanning tree

発動条件: 全頂点を連結するN-1関係のweight和を最大化するとき。

Primの最大key版またはKruskal降順を使う。

## 問題固有の要素

食べる側を自由に選べるため、任意treeのleaf削除順をそのまま操作順として実現できる。

別の問題へ持ち帰る視点: merge/elimination操作では、任意spanning treeをleafから実行可能かを確認するとMST型へ帰着できる。

## 正当性

消えたballを残ったballへ結ぶ操作辺は最終ballを根とするtreeである。逆に任意spanning treeは葉を親に食べさせる順で実現できるので操作合計とtree重み和は同じ。よって最大全域木が最適。

## 実装上の注意

- edge weightは二つのpowmod結果を加えてからMで剰余を取り、指数A_jは最大10^9なので二分累乗する。
- maximum版であるため比較方向を最小全域木のtemplateから反転し、total scoreは64 bitにする。

## 復習の核

- 3ballの任意操作列から2edge treeを作り、逆にそのtreeのleaf順が同じscoreを再現することを両方向で示す。

## 計算量と制約

### 時間

N ball、A=max A_i。全pair重みの二分累乗 O(N²log A)、dense Prim O(N²)。

### 空間

Primなら重みを必要時に計算して O(N) 作業、全重み表保持なら O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 500; 2 \leq M \leq 10^9; 1 \leq A_i \leq M-1; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/tasks/abc282_e) — source-abc282-e-problem-914b9b4d38269c619530f4c66c8620d8dc5b0b66aa42bc2e0c18cb4c9bf6629e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/editorial/5398) — source-abc282-editorial-5398-d6e68174ec62656ceec64ff790551f0920345c205c50c7bdd3863cb13e6c9ed4
