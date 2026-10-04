---
title: "ABC377-F — Avoid Queen Attack"
draft: true
authoringUnit: {"problemId":"abc377-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc377-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-inclusion-exclusion"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc377-editorial-11246-f29d5b7dfcda9fe5a743e462d4bb6d1048af559b76f7ebedbd5b7dd2dcd4694a","source-abc377-f-problem-0783e8d2bcd70768494a36d61bb0dc1ea442c8f69fafc99c889c5d04e78fcf0c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同方向線は一致かdisjointなので先にunique化する。新線のlengthから既存攻撃領域との交点数を引けば新增攻撃cell数になる。既存方向ごとに列挙した同一交点はsetで一つにするので三方向以上の重複も正しく補正する。盤面内整数交点だけ残し全線を足すことで攻撃unionをexactに得る。N²との差が安全cell数。","sourceRevisionIds":["source-abc377-editorial-11246-f29d5b7dfcda9fe5a743e462d4bb6d1048af559b76f7ebedbd5b7dd2dcd4694a","source-abc377-f-problem-0783e8d2bcd70768494a36d61bb0dc1ea442c8f69fafc99c889c5d04e78fcf0c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

先に読む単元:

- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md) — 単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

盤面は N^2 と巨大だが、M 個の queen が攻撃する行・列・二種の対角線は各 O(M) 本である。単純に各線の長さを足した時の重複は、異なる線同士の交点にしか起きず O(M^2) 個である。

採用する候補: 重複する攻撃線を種類ごとに除去し、各線の盤面内セル数を足しながら、既に数えた他方向線との交点だけを列挙して重複分を引く。

線そのものは O(M)、異方向の交点候補は O(M^2) で、N=10^9 のマスを一切列挙せず攻撃セル数を求められる。

棄却する候補: 各 queen から8方向へ盤面端までマスを走査して攻撃済み集合へ入れる。

一方向だけで長さ N に達し、N≤10^9 なので M が1000でも走査不能である。

同方向の同一直線は完全に一致するので先に unique 化し、重複補正を線の追加順で「以前の線との交点」に限定すると包除の高次項を直接扱わずに済む。

行・列・対角線の交点座標は整数条件と盤面内条件を満たす場合だけ一セルを共有し、同じ交点は集合で一度だけ数える。

行 r、列 c、対角 r-c、反対角 r+c の集合を作る。各 unique line の長さを計算し、方向を一つずつ追加するとき既存方向との有効交点を列挙して、その線上で既出の交点数を差し引く。N^2 から攻撃和集合を引く。

## 典型の発動条件

### 疎な直線和集合の交点補正

発動条件: 巨大格子で少数の行・列・対角線が覆うセル数を求めるとき。

線長の和と O(M^2) 個の交点だけを管理する。

## 問題固有の要素

巨大な被覆集合でも、複数方向から覆われる点の複雑度は入力本数の二乗に抑えられる。

別の問題へ持ち帰る視点: 線を順に加え、新しい線上の既出セルだけを集合で数えると多重交点も過不足なく処理できる。

## 正当性

同方向線は一致かdisjointなので先にunique化する。新線のlengthから既存攻撃領域との交点数を引けば新增攻撃cell数になる。既存方向ごとに列挙した同一交点はsetで一つにするので三方向以上の重複も正しく補正する。盤面内整数交点だけ残し全線を足すことで攻撃unionをexactに得る。N²との差が安全cell数。

## 実装上の注意

- 対角線同士の交点は parity が合うときだけ整数座標になる。queen 自身のセル、多方向が同一点で交わる場合、N^2 の 64 bit を確認する。

## 復習の核

- 各方向の線を一つずつ追加する順序を固定し、その時に新しく重複するセル集合を具体的に書いて検算する。

## 計算量と制約

### 時間

O(M² log M)。unique lineの各追加で旧方向交点をset統合する。

### 空間

O(M²)、各新線の交点だけならO(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq10^9; 1\leq M\leq10^3; 1\leq a_k\leq N,1\leq b_k\leq N\ (1\leq k\leq M); (a_k,b_k)\neq(a_l,b_l)\ (1\leq k\lt l\leq M); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/editorial/11246) — source-abc377-editorial-11246-f29d5b7dfcda9fe5a743e462d4bb6d1048af559b76f7ebedbd5b7dd2dcd4694a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/tasks/abc377_f) — source-abc377-f-problem-0783e8d2bcd70768494a36d61bb0dc1ea442c8f69fafc99c889c5d04e78fcf0c
