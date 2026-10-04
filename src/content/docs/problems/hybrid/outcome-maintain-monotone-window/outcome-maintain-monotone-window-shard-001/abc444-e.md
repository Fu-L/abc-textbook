---
title: "ABC444-E — Sparse Range"
draft: true
authoringUnit: {"problemId":"abc444-e","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc444-e.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc444-e-problem-dc6db3fa5a4cb75c262b4e86744c59364aa2f83ae4b1c38d2d3dc6579157e802","source-abc444-editorial-15690-15f66914a3c17025b5a7d8a595e6ae7f123f8769f39b8f98bc440e91ec61e759"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一度 |A_i-A_j|<D の反例を含んだ区間は、右端をさらに伸ばしても valid へ戻らない。 追加値 x との最小絶対差は sorted set 上で x 以下最大と x 以上最小のどちらかに現れる。 既存区間が valid なら追加値と距離 D 未満になり得る最も近い値は前後要素だけであり、各 index は高々一回追加・削除される。","sourceRevisionIds":["source-abc444-e-problem-dc6db3fa5a4cb75c262b4e86744c59364aa2f83ae4b1c38d2d3dc6579157e802","source-abc444-editorial-15690-15f66914a3c17025b5a7d8a595e6ae7f123f8769f39b8f98bc440e91ec61e759"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

先に読む単元:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

左端 L を固定すると、条件を満たす右端は L..f(L) の prefix になり、L を一つ進めても既存の反例 pair は減るだけなので f(L) は単調非減少である。

採用する候補: 二ポインタで区間を伸縮し、区間内の値を ordered multiset に保持して、新要素の predecessor と successor が距離 D 以上かだけを調べる。

棄却する候補: 各区間についてすべての要素 pair の差を調べ、条件を満たすか判定する。

区間が Θ(N^2) 個あり、さらに pair 検査を行うと三乗以上になってしまう。

R を単調に進め、A_R の predecessor/successor が十分離れていれば set に挿入する。挿入不能になった位置で L 始まりの valid 区間数 R-L を加え、A_L を削除して次の L へ進む。

## 典型の発動条件

### 尺取り法

発動条件: 右へ要素を加えると一度壊れた条件が復活せず、左削除では条件が緩むとき。

最大 valid 右端を全左端で単調に更新する。

### 順序集合の最近傍判定

発動条件: 集合内の全要素と新値の距離下限を確認したいとき。

predecessor と successor の二要素だけを比較する。

## 問題固有の要素

全 pair 条件でも、新規追加による違反だけを見れば ordered set の局所二候補へ縮約できる。

別の問題へ持ち帰る視点: 区間性質が要素追加で単調に悪化するなら、valid 区間の端点関数の単調性を探す。

## 正当性

一度 |A_i-A_j|<D の反例を含んだ区間は、右端をさらに伸ばしても valid へ戻らない。 追加値 x との最小絶対差は sorted set 上で x 以下最大と x 以上最小のどちらかに現れる。 既存区間が valid なら追加値と距離 D 未満になり得る最も近い値は前後要素だけであり、各 index は高々一回追加・削除される。

## 実装上の注意

- 重複値を multiset で正しく保持し、erase は一個だけ消す。D=0 の境界と predecessor/successor 不在を分岐する。

## 復習の核

- 既存区間が valid という仮定の下で、新しい反例が必ず追加値を含むことと最近傍二点だけで十分なことを証明する。

## 計算量と制約

### 時間

O(N log N)、window内ordered multisetの前後点を検査。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 4\times 10^5; 1 \leq A_i \leq 10^9; 1 \leq D \leq 10^9

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/tasks/abc444_e) — source-abc444-e-problem-dc6db3fa5a4cb75c262b4e86744c59364aa2f83ae4b1c38d2d3dc6579157e802
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/editorial/15690) — source-abc444-editorial-15690-15f66914a3c17025b5a7d8a595e6ae7f123f8769f39b8f98bc440e91ec61e759
