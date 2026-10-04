---
title: "ABC258-G — Triangle"
draft: true
authoringUnit: {"problemId":"abc258-g","docPath":"src/content/docs/problems/data-structures/outcome-accelerate-set-operations-with-bitsets/outcome-accelerate-set-operations-with-bitsets-shard-001/abc258-g.md","learningOutcomeIds":["outcome-accelerate-set-operations-with-bitsets"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。"],"tagIds":["tag-bitset-word-parallel","tag-contribution-reordering"],"sourceRevisionIds":["source-abc258-editorial-4234-240b1b29f114017fcb1f5f7d99967afd1205e4555fdf9ee798946f1e4416589a","source-abc258-g-problem-c594589a21884cf181b9544d824b13fbdaea2df8db597d58143f8efd69411998"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i<jかつA_ij=1の組だけを調べ、popcount(row_i AND row_j)を足すと、各三角形はその三辺ごとにちょうど3回数えられる。 隣接行列の一行を集合のbitsetとみなすと、共通隣接集合の積がワード並列ANDへ置き換わる。 N頂点の隣接行を64ビット語へ圧縮し、O(N^2)組の共通隣接数を語単位で求めればN=3000を処理できる。","sourceRevisionIds":["source-abc258-editorial-4234-240b1b29f114017fcb1f5f7d99967afd1205e4555fdf9ee798946f1e4416589a","source-abc258-g-problem-c594589a21884cf181b9544d824b13fbdaea2df8db597d58143f8efd69411998"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)

- 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

この解説で扱わないこと:

- 集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。

## 考察

辺(i,j)を一つ固定すると三角形の第三頂点kはiとjの共通隣接頂点であり、その個数は隣接bitsetのANDのpopcountで得られる。

採用する候補: 各辺について隣接bitsetの積集合を数える

N頂点の隣接行を64ビット語へ圧縮し、O(N^2)組の共通隣接数を語単位で求めればN=3000を処理できる。

棄却する候補: 三頂点組を全て通常ループで調べる

約N^3/6組を一つずつ判定し、N=3000では遅い。

i<jかつA_ij=1の組だけを調べ、popcount(row_i AND row_j)を足すと、各三角形はその三辺ごとにちょうど3回数えられる。

隣接行列の一行を集合のbitsetとみなすと、共通隣接集合の積がワード並列ANDへ置き換わる。

各頂点の隣接行をbitsetとして保存する。全i<jで辺がある場合だけ(row_i & row_j).count()を合計し、各三角形の三重計数を除くため3で割る。

## 典型の発動条件

### bitset集合演算

発動条件: 多数の頂点対について共通隣接頂点数を求めたい。

隣接集合を64ビット語列にし、ANDとpopcountで積集合サイズを数える。

### 辺を基準にした三角形数え上げ

発動条件: 三角形を頂点三重ループ以外の形で数えたい。

各辺へ共通隣接頂点を付け、一定の重複数で最後に割る。

## 問題固有の要素

三角形条件の三つの辺のうち一辺を外側で固定すると、残り二辺は二つの隣接集合の積というbitset向きの演算になる。

別の問題へ持ち帰る視点: 小さめNの密グラフ部分構造は、隣接集合の論理演算で64頂点ずつ並列判定できる。

## 正当性

i<jかつA_ij=1の組だけを調べ、popcount(row_i AND row_j)を足すと、各三角形はその三辺ごとにちょうど3回数えられる。 隣接行列の一行を集合のbitsetとみなすと、共通隣接集合の積がワード並列ANDへ置き換わる。 N頂点の隣接行を64ビット語へ圧縮し、O(N^2)組の共通隣接数を語単位で求めればN=3000を処理できる。

## 実装上の注意

- 辺でない(i,j)は加算せず、i<jだけ走査する。この数え方では各三角形を3回数えるので6ではなく3で割り、合計は64ビット整数で持つ。

## 復習の核

- Nが小さい三頂点全列挙と比較し、三角形なし、完全グラフ、共有辺を持つ複数三角形、3割と6割の数え方の違いを確認する。

## 計算量と制約

### 時間

O(N²⌈N/w⌉)、w=64。

### 空間

O(N⌈N/w⌉)語。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 3 \le N \le 3000; A is the adjacency matrix of a simple undirected graph G.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/editorial/4234) — source-abc258-editorial-4234-240b1b29f114017fcb1f5f7d99967afd1205e4555fdf9ee798946f1e4416589a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/tasks/abc258_g) — source-abc258-g-problem-c594589a21884cf181b9544d824b13fbdaea2df8db597d58143f8efd69411998
