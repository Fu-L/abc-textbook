---
title: "ABC407-F — Sums of Sliding Window Maximum"
draft: true
authoringUnit: {"problemId":"abc407-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc407-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-ordered-set-multiset","unit-prefix-aggregate"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-event-sweep","tag-ordered-set-multiset","tag-prefix-difference"],"sourceRevisionIds":["source-abc407-editorial-13108-38f93e0c75d1922e70f9cb3ae76f65fae4a6386c930a66d1ebf4d332862331e8","source-abc407-f-problem-284de07bd055797c176cf4d63305ca74264c863f3254ae2b251073c88d2fec0c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"a=min(L_i,R_i), b=max(L_i,R_i) とすると窓数は k≤a+1 で k、a+1<k≤b+1 で a+1、b+1<k≤L_i+R_i+1 で L_i+R_i+2-k である。 この台形の二階差分は index 1 に +A_i、a+2 と b+2 に -A_i、L_i+R_i+3 に +A_i の4点だけ非零になる。 一要素の全 k への寄与は第二差分配列の4点更新で表せる。全要素後に prefix sum を二回取れば N 個の答えを一括計算できる。","sourceRevisionIds":["source-abc407-editorial-13108-38f93e0c75d1922e70f9cb3ae76f65fae4a6386c930a66d1ebf4d332862331e8","source-abc407-f-problem-284de07bd055797c176cf4d63305ca74264c863f3254ae2b251073c88d2fec0c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

各 subarray の最大値を一意に担当させるため (A_i,i) の辞書順で大小を定める。i より大きい要素に挟まれるまでの左の連続長 L_i、右の連続長 R_i 内でだけ A_i が担当最大になる。

長さ k で i を担当最大として含む窓数は、k に対して増加・一定・減少する台形状の一次関数になる。

採用する候補: 要素を (A_i,i) の降順に挿入して ordered set から L_i,R_i を求め、各寄与の一次関数区間を二階差分へ加える

一要素の全 k への寄与は第二差分配列の4点更新で表せる。全要素後に prefix sum を二回取れば N 個の答えを一括計算できる。

棄却する候補: 各 k ごとに monotonic deque で全 sliding-window maximum を求める

一つの k は O(N) でも N 種類を繰り返すと O(N^2) になり、同じ要素の複数長への寄与を共有できない。

a=min(L_i,R_i), b=max(L_i,R_i) とすると窓数は k≤a+1 で k、a+1<k≤b+1 で a+1、b+1<k≤L_i+R_i+1 で L_i+R_i+2-k である。

この台形の二階差分は index 1 に +A_i、a+2 と b+2 に -A_i、L_i+R_i+3 に +A_i の4点だけ非零になる。

sentinel 0,N+1 を持つ set を用意し、(A_i,i) を大きい順に処理する。挿入前の前後 set 要素から L_i,R_i を得て第二差分へ4点加算し、i を set に入れる。最後に配列を二度累積して ans[1..N] を出力する。

## 典型の発動条件

### 最大値の担当区間

発動条件: 全 subarray の最大値寄与を要素ごとに数えるとき。

より大きい要素までの左右距離から、その要素を一意な最大とする窓を数える。

### ordered set による最近傍境界

発動条件: 要素を値順に有効化し、現在位置を挟む既有効位置が必要なとき。

前後 iterator からより大きい要素の最近傍を O(log N) で取得する。

### 二階差分

発動条件: 多数の添字区間へ一次関数を加算するとき。

台形状寄与の傾き変化だけを4点更新し、二回の累積和で復元する。

## 問題固有の要素

window 長を固定して最大値を求める向きと逆に、最大値を担当する要素を固定すると、全長への寄与が二階差分4点だけになる。

別の問題へ持ち帰る視点: 複数の window 長すべてへの答えでは、各要素の寄与を長さの関数として調べ、多項式なら対応階数の差分で一括加算する。

## 正当性

a=min(L_i,R_i), b=max(L_i,R_i) とすると窓数は k≤a+1 で k、a+1<k≤b+1 で a+1、b+1<k≤L_i+R_i+1 で L_i+R_i+2-k である。 この台形の二階差分は index 1 に +A_i、a+2 と b+2 に -A_i、L_i+R_i+3 に +A_i の4点だけ非零になる。 一要素の全 k への寄与は第二差分配列の4点更新で表せる。全要素後に prefix sum を二回取れば N 個の答えを一括計算できる。

## 実装上の注意

- 同値 A_i は添字を含む辞書順で必ず一意に順序付け、処理順と境界判定を一致させる。差分添字 N+2 まで確保し、答えは 64 bit にする。

## 復習の核

- 全要素同値、単調増加・減少、中央だけ最大、N=1 を各 k の deque または全窓列挙と比較し、tie-break と4点更新を確認する。

## 計算量と制約

### 時間

O(N log N)、値降順sortと隣接set、二階差分。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^{5}; 0 \le A_i \le 10^{7} (1 \le i \le N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/editorial/13108) — source-abc407-editorial-13108-38f93e0c75d1922e70f9cb3ae76f65fae4a6386c930a66d1ebf4d332862331e8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/tasks/abc407_f) — source-abc407-f-problem-284de07bd055797c176cf4d63305ca74264c863f3254ae2b251073c88d2fec0c
