---
title: "ABC348-F — Oddly Similar"
draft: true
authoringUnit: {"problemId":"abc348-f","docPath":"src/content/docs/problems/data-structures/outcome-accelerate-set-operations-with-bitsets/outcome-accelerate-set-operations-with-bitsets-shard-001/abc348-f.md","learningOutcomeIds":["outcome-accelerate-set-operations-with-bitsets"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。"],"tagIds":["tag-bitset-word-parallel"],"sourceRevisionIds":["source-abc348-editorial-9731-afb44305327ab23b60890a293679d6f3d14e71f94053d0953c8b5129b8f21ff2","source-abc348-f-problem-e6cdc8d4d7b34661443befa49ba6ce4894287446e58c7154e0cb1e2c627ff935"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"column kで値vを持つrow集合mask_vを作ると、その集合内の任意pairだけ一致数parityがtoggleされる。各i∈mask_vについてparity[i] xor=mask_vとすれば、全column後のbit jが1 iff i,jの一致列数がoddになる。 64 pair判定を一machine wordで並列化し、O(MN²/word_size)の実用時間に落とせる。","sourceRevisionIds":["source-abc348-editorial-9731-afb44305327ab23b60890a293679d6f3d14e71f94053d0953c8b5129b8f21ff2","source-abc348-f-problem-e6cdc8d4d7b34661443befa49ba6ce4894287446e58c7154e0cb1e2c627ff935"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)

- 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。

## 考察

pair(i,j)について一致column数の偶奇だけが必要なので、columnごとの「同じ値groupに属するpair」という0/1寄与をXORで累積できる。N行分のparity vectorをbitsetとして同時更新する。

採用する候補: 各column・値groupのrow maskを作り、該当rowのparity bitsetへXORする

64 pair判定を一machine wordで並列化し、O(MN²/word_size)の実用時間に落とせる。

棄却する候補: 全row pairについてM列を比較する

O(N²M)=8×10^9比較となり時間制限に厳しい。

column kで値vを持つrow集合mask_vを作ると、その集合内の任意pairだけ一致数parityがtoggleされる。各i∈mask_vについてparity[i] xor=mask_vとすれば、全column後のbit jが1 iff i,jの一致列数がoddになる。

N個のdynamic bitset parityを0初期化する。各column kでA_{i,k}を値1…999ごとにrow bitmaskへまとめ、各groupの全row iについてparity[i]へgroup maskをXORする。最後に各iでj>iのset bit数をpopcountして合計する。

## 典型の発動条件

### bitset高速化

発動条件: 同じboolean演算をN個の対象へ繰り返し、N≤2000でword並列化できる。

row集合を64bit blocksで表しXOR・popcountをまとめて行う。

### parityのXOR集計

発動条件: 一致回数そのものではなく奇偶だけが判定条件である。

各columnの一致indicatorをaddition mod 2としてXOR累積する。

## 問題固有の要素

値ごとにpairを列挙する代わりにgroup maskをgroup内の各rowへXORすると、group内完全graphの隣接vectorをbit並列で生成できる。

別の問題へ持ち帰る視点: 同値class内全pair更新はclass bitmaskを各memberのbitsetへbroadcastできる。

## 正当性

column kで値vを持つrow集合mask_vを作ると、その集合内の任意pairだけ一致数parityがtoggleされる。各i∈mask_vについてparity[i] xor=mask_vとすれば、全column後のbit jが1 iff i,jの一致列数がoddになる。 64 pair判定を一machine wordで並列化し、O(MN²/word_size)の実用時間に落とせる。

## 実装上の注意

- diagonal(i,i)もM回toggleされ得るが必ず集計から除き、j>iだけ数える。columnごとのgroup maskは使い回す前にclearする。

## 復習の核

- Mの偶奇でdiagonalが変わる例、全行同一、全値distinct、同じpairが複数列一致する例を三重loopと比較する。

## 計算量と制約

### 時間

O(M(N+V)⌈N/w⌉+MN)、w=64、Vは列ごとに初期化する値マスク数。maskを必要な値だけ初期化すればV≤N。

### 空間

O((N+N_V)⌈N/w⌉)語。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2000; 1 \leq M \leq 2000; 1 \leq A_{i,j} \leq 999; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/editorial/9731) — source-abc348-editorial-9731-afb44305327ab23b60890a293679d6f3d14e71f94053d0953c8b5129b8f21ff2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/tasks/abc348_f) — source-abc348-f-problem-e6cdc8d4d7b34661443befa49ba6ce4894287446e58c7154e0cb1e2c627ff935
