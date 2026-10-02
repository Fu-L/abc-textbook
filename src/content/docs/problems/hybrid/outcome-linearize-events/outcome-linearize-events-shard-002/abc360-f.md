---
title: "ABC360-F — InterSections"
draft: true
authoringUnit: {"problemId":"abc360-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc360-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-range-actions"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-coordinate-compression","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc360-editorial-10323-8c4d9a5f024898c43c5374ba4f69c2e52dfea61b23a8564413205c7c24070951","source-abc360-f-problem-c17709f594bb666a67405cb3e6aa0269fa08eb28943f9259ece37d85766a4993"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"strict不等号を整数座標へ直すと、L_i+1、R_i−1、R_i+1などが長方形境界候補になり、圧縮時にも空区間を除く必要がある。 同じ最大交差数ならl最小、さらにr最小なので、lを昇順走査し、segment treeは最大値を達成する最小rを返す。 各入力区間が作る二長方形の被覆数最大化を、一方向の追加削除と一次元最大値へ落とせる。","sourceRevisionIds":["source-abc360-editorial-10323-8c4d9a5f024898c43c5374ba4f69c2e52dfea61b23a8564413205c7c24070951","source-abc360-f-problem-c17709f594bb666a67405cb3e6aa0269fa08eb28943f9259ece37d85766a4993"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

入力区間[L_i,R_i]と[l,r]が交差する条件はL_i<l<R_i<rまたはl<L_i<r<R_iで、(l,r)平面では互いに重ならない二つの長方形になる。

最適座標は端点の直前・直後など有限個の候補だけ調べればよく、lを走査すると各長方形はr軸上の区間加算eventになる。

採用する候補: 候補座標を圧縮してl方向にevent sweepし、lazy segment treeでr区間加算・全体最大と最左argmaxを管理する。

各入力区間が作る二長方形の被覆数最大化を、一方向の追加削除と一次元最大値へ落とせる。

棄却する候補: 候補(l,r)を二重列挙し、各入力区間との交差数を数える。

候補を端点周辺へ絞っても組数が二次になり、全区間の判定まで重ねられない。

strict不等号を整数座標へ直すと、L_i+1、R_i−1、R_i+1などが長方形境界候補になり、圧縮時にも空区間を除く必要がある。

同じ最大交差数ならl最小、さらにr最小なので、lを昇順走査し、segment treeは最大値を達成する最小rを返す。

各区間から二つの有効な(l範囲,r範囲)長方形を作り、l開始時の+1と終了後の−1 eventへする。l候補を昇順に処理してr圧縮区間へrange addし、rootの最大値と最小argmaxで答えを辞書順更新する。最大値0なら(0,1)も候補に含める。

## 典型の発動条件

### 長方形被覆の平面走査

発動条件: 二変数の条件が軸平行長方形の和集合・重なりへ分解できるとき。

一軸をevent化し、もう一軸の被覆数をrange addで維持する。

### 最大値と最左位置のlazy segment tree

発動条件: 区間加算中の最大値だけでなく同率時の最小座標も必要なとき。

各nodeにmaxとその最小indexを持たせ、mergeでtie-breakする。

## 問題固有の要素

区間の「交差」を一次元のまま扱うより、未知区間の両端(l,r)を点と見れば条件が長方形になる。

別の問題へ持ち帰る視点: 複数の不等式を満たすパラメータ最適化は、parameter space上の領域被覆へ描き直す。

## 正当性

strict不等号を整数座標へ直すと、L_i+1、R_i−1、R_i+1などが長方形境界候補になり、圧縮時にも空区間を除く必要がある。 同じ最大交差数ならl最小、さらにr最小なので、lを昇順走査し、segment treeは最大値を達成する最小rを返す。 各入力区間が作る二長方形の被覆数最大化を、一方向の追加削除と一次元最大値へ落とせる。

## 実装上の注意

- strict境界を±1へ変換した結果l<rを満たさない長方形は捨てる。削除eventの時刻と、最大値0時の既定解(0,1)を確認する。

## 復習の核

- 二種類の交差順序を別々の長方形として紙に描く。圧縮候補・eventの閉区間・tie-breakを独立したテストで確かめる。

## 計算量と制約

### 時間

O(N log N)、二長方形eventと座標圧縮lazy tree。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{5}; 0 \leq L_i < R_i \leq 10^{9} (1 \leq i \leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/editorial/10323) — source-abc360-editorial-10323-8c4d9a5f024898c43c5374ba4f69c2e52dfea61b23a8564413205c7c24070951
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/tasks/abc360_f) — source-abc360-f-problem-c17709f594bb666a67405cb3e6aa0269fa08eb28943f9259ece37d85766a4993
