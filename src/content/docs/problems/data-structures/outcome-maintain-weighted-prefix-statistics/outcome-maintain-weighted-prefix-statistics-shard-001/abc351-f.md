---
title: "ABC351-F — Double Sum"
draft: true
authoringUnit: {"problemId":"abc351-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc351-f.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-coordinate-compression","tag-event-sweep"],"sourceRevisionIds":["source-abc351-editorial-9877-597d4bd09ec26bf222624a2357ff69b6bda0e3f4b273bca35cabb8953774e686","source-abc351-f-problem-759c8b5d7921f2c97c855f3ab51645da21d9936ee6eeaa61c8cb72f2b3a0b3fc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"条件を満たす過去集合 I に対し Σ_{i∈I}(A_j−A_i)=|I|A_j−Σ_{i∈I}A_i なので count と sum の二集約で十分である。 等値 A_i=A_j の寄与は0なので prefix を < にしても ≤ にしても数値は同じだが、条件の意味を strict に保つと証明が明瞭になる。 各 j の寄与が count·A_j−sum と分離し、query/update 各 O(log N) で全体 O(N log N) になる。","sourceRevisionIds":["source-abc351-editorial-9877-597d4bd09ec26bf222624a2357ff69b6bda0e3f4b273bca35cabb8953774e686","source-abc351-f-problem-759c8b5d7921f2c97c855f3ab51645da21d9936ee6eeaa61c8cb72f2b3a0b3fc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

項 (i,j) の寄与は i<j かつ A_i<A_j のとき A_j−A_i である。j を右端として走査すれば、過去の A_i<A_j の個数と総和だけで寄与を計算できる。

値は10^8だが大小関係しか query index に使わないため、座標圧縮して Fenwick Tree の prefix count/sum を利用できる。

採用する候補: 左から走査し、値別の過去個数 Fenwick と過去値和 Fenwick から A_i<A_j の寄与を一括取得する。

棄却する候補: すべての i<j を列挙して max(A_j−A_i,0) を足す。

N=4×10^5 に対する Θ(N²) 項は処理できない。

A の unique sorted 値で rank を作る。j=1..N で rank(A_j) 未満の count c と sum s を二本の Fenwick Tree から得て、答えへ cA_j−s を加える。その後 rank へ count+1,sum+A_j を更新する。

## 典型の発動条件

### 平面走査＋Fenwick Tree

発動条件: index 順と値順の二条件を満たす過去要素の集約が必要なとき。

一方を走査順へ移し、他方を座標圧縮した prefix query で処理する。

### 差の総和の count/sum 分解

発動条件: 固定値 x と条件付き集合の Σ(x−a) を求めるとき。

集合の個数と要素和だけを持ち、x·count−sum とする。

## 問題固有の要素

二重和の max は大小条件を切り出すと線形式になり、必要な統計量が count と sum の二つに落ちる。

別の問題へ持ち帰る視点: max(x−y,0) を見たら領域 x>y で場合分けし、線形式の係数別集約を探す。

## 正当性

条件を満たす過去集合 I に対し Σ_{i∈I}(A_j−A_i)=|I|A_j−Σ_{i∈I}A_i なので count と sum の二集約で十分である。 等値 A_i=A_j の寄与は0なので prefix を < にしても ≤ にしても数値は同じだが、条件の意味を strict に保つと証明が明瞭になる。 各 j の寄与が count·A_j−sum と分離し、query/update 各 O(log N) で全体 O(N log N) になる。

## 実装上の注意

- 値和と答えは 64 bit を使う。query してから現在値を update し、i<j の向きを守る。

## 復習の核

- 差を足す対象条件と式を先に展開し、どの統計量が必要か逆算する。Fenwick の query 境界が strict 条件と合うか重複値で試す。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 4 \times 10^5; 0 \leq A_i \leq 10^8; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/editorial/9877) — source-abc351-editorial-9877-597d4bd09ec26bf222624a2357ff69b6bda0e3f4b273bca35cabb8953774e686
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/tasks/abc351_f) — source-abc351-f-problem-759c8b5d7921f2c97c855f3ab51645da21d9936ee6eeaa61c8cb72f2b3a0b3fc
