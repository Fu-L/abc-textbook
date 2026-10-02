---
title: "ABC378-E — Mod Sigma Problem"
draft: true
authoringUnit: {"problemId":"abc378-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc378-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc378-e-problem-455f55c529853840624b25849197cee4c28e915574c44a8492c3d9fcd9bb42ef","source-abc378-editorial-11289-eaba34e24cab47788301f40dea4d5dcb36caf39e402be420a4e51caceff84104"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"0≤a,b<M なら (b-a) mod M=b-a+M·[a>b] で、mod による非線形部分は大小比較一つだけになる。 過去 prefix の個数と総和を分けて持てば、固定 S_r に対する全 l の差の和をまとめて計算できる。 各右端について式 S_r·r-ΣpastS+M·countGreater を O(log M) で計算でき、全区間を列挙しない。","sourceRevisionIds":["source-abc378-e-problem-455f55c529853840624b25849197cee4c28e915574c44a8492c3d9fcd9bb42ef","source-abc378-editorial-11289-eaba34e24cab47788301f40dea4d5dcb36caf39e402be420a4e51caceff84104"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

区間和 mod M は prefix 剰余 S_r-S_{l-1} に、負なら M を足した値である。従って各右端の寄与は通常の差の総和と、過去 prefix が S_r より大きい個数に分離できる。

採用する候補: prefix 剰余の総和を累積し、Fenwick tree で過去 S の度数を管理して S_{l-1}>S_r の個数を数える。

各右端について式 S_r·r-ΣpastS+M·countGreater を O(log M) で計算でき、全区間を列挙しない。

棄却する候補: 全ての l,r を列挙して prefix sum の差を M で割る。

区間和自体が O(1) でも区間数が Θ(N^2) である。

0≤a,b<M なら (b-a) mod M=b-a+M·[a>b] で、mod による非線形部分は大小比較一つだけになる。

過去 prefix の個数と総和を分けて持てば、固定 S_r に対する全 l の差の和をまとめて計算できる。

S_0=0 を Fenwick tree と prefix総和へ入れる。r=1..N で S_r を更新し、過去値のうち S_r より大きい数を取得して寄与を加えた後、S_r を登録する。

## 典型の発動条件

### mod 差の wrap 回数の数え上げ

発動条件: 剰余化された prefix 差の総和を求めるとき。

通常差と一周分 M を足す大小条件へ分離する。

## 問題固有の要素

mod を直接集計せず、代表元同士の差が負になる回数だけ補正する。

別の問題へ持ち帰る視点: 区間の二重和は右端固定で prefix の個数・総和・順位統計へ落とせる。

## 正当性

0≤a,b<M なら (b-a) mod M=b-a+M·[a>b] で、mod による非線形部分は大小比較一つだけになる。 過去 prefix の個数と総和を分けて持てば、固定 S_r に対する全 l の差の和をまとめて計算できる。 各右端について式 S_r·r-ΣpastS+M·countGreater を O(log M) で計算でき、全区間を列挙しない。

## 実装上の注意

- S_0 を必ず含め、greater は strict に数える。同値 prefix では M を足さず、答えは 64 bit に収める。

## 復習の核

- (b-a) mod M の二ケース式を書き、Fenwick tree が数える pair の不等号を小例で確認する。

## 計算量と制約

### 時間

O(N log M)、mod prefix値域MをFenwick管理。

### 空間

O(N+M)、入力とBIT。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 0 \leq A_i \leq 10^9

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/tasks/abc378_e) — source-abc378-e-problem-455f55c529853840624b25849197cee4c28e915574c44a8492c3d9fcd9bb42ef
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/editorial/11289) — source-abc378-editorial-11289-eaba34e24cab47788301f40dea4d5dcb36caf39e402be420a4e51caceff84104
