---
title: "ABC388-G — Simultaneous Kagamimochi 2"
draft: true
authoringUnit: {"problemId":"abc388-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc388-g.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation","unit-two-pointers-window"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-range-monoid-aggregation","tag-two-pointers-window"],"sourceRevisionIds":["source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565","source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"B_iは昇順Aに対するtwo-pointerで全iまとめてO(N)計算できる。 max(B_i-i,K)は、下段が上段K個の直後以降で重複しない条件と、各上餅のサイズ条件を同時に表す。 K候補の可否を区間最大だけで判定でき、segment treeのmax_right等を用いれば各query O(log N)、全体O(N+Q log N)となる。","sourceRevisionIds":["source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565","source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)
- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

上段として連続K個i=L..L+K-1を使うとき、各iに対して条件を満たす最小下段index B_iを前計算できる。

必要な右端はL+K-1+max(K,max_{i∈[L,L+K)}(B_i-i))と表せ、この式はKについて単調非減少である。

採用する候補: B_i-iのrange maximumをsegment treeで持ち、queryごとに最大Kをtree上で二分探索する

K候補の可否を区間最大だけで判定でき、segment treeのmax_right等を用いれば各query O(log N)、全体O(N+Q log N)となる。

棄却する候補: 各query区間を取り出してE問題のtwo-pointerを最初から実行する

区間長に比例し、Q=2×10^5ではΘ(NQ)になり得る。

B_iは昇順Aに対するtwo-pointerで全iまとめてO(N)計算できる。

max(B_i-i,K)は、下段が上段K個の直後以降で重複しない条件と、各上餅のサイズ条件を同時に表す。

two-pointerで各iの最小適合index B_iを求め、D_i=B_i-iのrange-max segment treeを作る。query(L,R)では可否式の左辺≤Rとなる最大Kをmonotonic searchする。

## 典型の発動条件

### 必要位置のoffset化

発動条件: 各itemの最小partner indexが単調列から求まるとき。

B_i-iを持ち、連続block全体の必要余白をrange maxにする。

### segment tree上の二分探索

発動条件: prefixを伸ばした集約値に単調な可否条件があるとき。

max_rightで最大Kを対数時間に特定する。

## 問題固有の要素

query内のpairingを毎回作らず、上段各位置が要求する下段offsetの最大値一つへ縮約する。

別の問題へ持ち帰る視点: 連続区間から同数pairを作るqueryでは、各要素の最小partnerを前計算し、区間のworst offsetを集約する。

## 正当性

B_iは昇順Aに対するtwo-pointerで全iまとめてO(N)計算できる。 max(B_i-i,K)は、下段が上段K個の直後以降で重複しない条件と、各上餅のサイズ条件を同時に表す。 K候補の可否を区間最大だけで判定でき、segment treeのmax_right等を用いれば各query O(log N)、全体O(N+Q log N)となる。

## 実装上の注意

- B_iがN外なら十分大きいsentinelにする。0/1-indexと半開区間[L,L+K)を統一し、K=0を常に可能とする。

## 復習の核

- 小区間を全matching列挙し、B_iが範囲外、Kが区間長/2、等号境界のqueryで可否式とsegment-tree searchを比較する。

## 計算量と制約

### 時間

前処理O(N)、Q照会O(Q log²N)、K外側二分ごとにrange-max O(log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9 \ (1 \leq i \leq N); A_i \leq A_{i+1} \ (1 \leq i < N); 1 \leq Q \leq 2 \times 10^5; 1 \leq L_i < R_i \leq N \ (1 \leq i \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/editorial/11904) — source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/tasks/abc388_g) — source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757
