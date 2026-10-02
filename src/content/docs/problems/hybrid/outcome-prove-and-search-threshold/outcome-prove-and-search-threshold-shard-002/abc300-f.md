---
title: "ABC300-F — More Holidays"
draft: true
authoringUnit: {"problemId":"abc300-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc300-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-prefix-difference"],"sourceRevisionIds":["source-abc300-editorial-6274-0864bbe43d2b73100f40a3ae4570313cd49b9bb79864c234e5ab104da1d49125","source-abc300-f-problem-beedc932c2c8433d25250402c8e5ba2ff009bea2b7300ccd6e34c77fb16b5b94"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"変更すべきx数だけが区間可否を決め、prefixX(pos)=floor(pos/N)·cntX+一周期prefixで巨大位置も計算できる。 周期prefixで任意長区間のx個数をO(1)計算でき、各始点からK個以下となる最遠端を単調判定で求められる。","sourceRevisionIds":["source-abc300-editorial-6274-0864bbe43d2b73100f40a3ae4570313cd49b9bb79864c234e5ab104da1d49125","source-abc300-f-problem-beedc932c2c8433d25250402c8e5ba2ff009bea2b7300ccd6e34c77fb16b5b94"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

周期文字列T=S^Mの最適区間の始点は、全変更と区間をNだけ左へ平行移動できるため最初の一周期内に選べる。

採用する候補: N始点列挙と終点二分探索

周期prefixで任意長区間のx個数をO(1)計算でき、各始点からK個以下となる最遠端を単調判定で求められる。

棄却する候補: 長さNMのTを構築して尺取

Mは10^9で展開不能。

変更すべきx数だけが区間可否を決め、prefixX(pos)=floor(pos/N)·cntX+一周期prefixで巨大位置も計算できる。

i=0..N-1ごとにendを[i,NM]で二分探索し、prefixX(end)-prefixX(i)≤Kとなる最大end-iを答えへ取る。

## 典型の発動条件

### 周期列のprefix集約

発動条件: 巨大な繰返し列の区間頻度が必要。

完全周期数と余りprefixへ分ける。

### 最遠到達二分探索

発動条件: 固定始点で区間costが終点に単調。

K以下となる最大終点を求める。

## 問題固有の要素

周期対称性でNM個の始点をN個へ落とし、終点だけ巨大座標で探せる。

別の問題へ持ち帰る視点: 周期列の部分区間最適化は始点を一周期に正規化する。

## 正当性

変更すべきx数だけが区間可否を決め、prefixX(pos)=floor(pos/N)·cntX+一周期prefixで巨大位置も計算できる。 周期prefixで任意長区間のx個数をO(1)計算でき、各始点からK個以下となる最遠端を単調判定で求められる。

## 実装上の注意

- 終点は半開区間でNMまで、Kは全x数以下だが区間長を64ビットで持つ。

## 復習の核

- 短い展開列の尺取と比較し、K=0、周期境界跨ぎ、全x・x一個周期、区間が全Tになる例を確認する。

## 計算量と制約

### 時間

O(N log(NM))、一周期N始点ごとの終端二分探索。

### 空間

O(N)、一周期のx-prefix。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N, M, and K are integers.; 1 \le N \le 3 \times 10^5; 1 \le M \le 10^9; 1 \le K \le x, where x is the number of x's in the string T.; S is a string of length N consisting of o and x.; S has at least one x.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/editorial/6274) — source-abc300-editorial-6274-0864bbe43d2b73100f40a3ae4570313cd49b9bb79864c234e5ab104da1d49125
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/tasks/abc300_f) — source-abc300-f-problem-beedc932c2c8433d25250402c8e5ba2ff009bea2b7300ccd6e34c77fb16b5b94
