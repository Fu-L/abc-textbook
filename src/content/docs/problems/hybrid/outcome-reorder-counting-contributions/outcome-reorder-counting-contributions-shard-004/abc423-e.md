---
title: "ABC423-E — Sum of Subarrays"
draft: true
authoringUnit: {"problemId":"abc423-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc423-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-prefix-difference"],"sourceRevisionIds":["source-abc423-e-problem-70cd42243b3dd2ea52aa4c95e5cbc404880bfbd8f4cc44c1e25c1048ad7fb183","source-abc423-editorial-13865-fd384d905e41456fa6859db592e9bd3fa92ee736dd68a446d3fa122f7e885422"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"Σ(j-L+1)(R-j+1)A_jを展開するとΣ[-j²+(L+R)j+(-L+1)(R+1)]A_jとなり、必要なのは三種類の区間和だけである。 query依存係数をL,Rだけへ分離し、各queryをO(1)で答えられる。","sourceRevisionIds":["source-abc423-e-problem-70cd42243b3dd2ea52aa4c95e5cbc404880bfbd8f4cc44c1e25c1048ad7fb183","source-abc423-editorial-13865-fd384d905e41456fa6859db592e9bd3fa92ee736dd68a446d3fa122f7e885422"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

固定query[L,R]でA_jはl≤j≤rとなるsubarrayごとに現れ、左端j-L+1通り、右端R-j+1通りなので係数はその積になる。

採用する候補: A_j,jA_j,j²A_jの三prefix sumで展開式を評価する

棄却する候補: queryごとに全subarray sumを列挙する

一queryでもO(length²)以上、Q=3×10^5では不可能である。

P0=prefix A_j,P1=prefix jA_j,P2=prefix j²A_jを作る。各queryで区間和s0,s1,s2を取り、-s2+(L+R)s1+(-L+1)(R+1)s0を64bitで出す。

## 典型の発動条件

### 寄与回数の主客転倒

発動条件: subarrayごとのsum総和をelementごとの包含回数へ変える。

各jを含むleft/right endpoint組数を積で数える。

### 多項式重み付きprefix sum

発動条件: query係数がindex jの低次多項式として展開できる。

各j^dA_jのprefixを次数分だけ前計算する。

## 問題固有の要素

三重和をA_jの寄与へ反転すると、query区間内位置に二次weightを掛けたrange sumになる。

別の問題へ持ち帰る視点: 全区間集計は要素包含数を数え、index polynomialならmoment prefixで高速化する。

## 正当性

Σ(j-L+1)(R-j+1)A_jを展開するとΣ[-j²+(L+R)j+(-L+1)(R+1)]A_jとなり、必要なのは三種類の区間和だけである。 query依存係数をL,Rだけへ分離し、各queryをO(1)で答えられる。

## 実装上の注意

- 1-based jと係数式を揃え、積は最大値を見積もって64bitで保持する。

## 復習の核

- L=R、全A=1を直接三重loopと比較する。

## 計算量と制約

### 時間

O(N+Q)、三moment prefix。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 3 \times 10^5; 1 \leq A_i \leq 100; 1 \leq L_i \leq R_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/tasks/abc423_e) — source-abc423-e-problem-70cd42243b3dd2ea52aa4c95e5cbc404880bfbd8f4cc44c1e25c1048ad7fb183
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/editorial/13865) — source-abc423-editorial-13865-fd384d905e41456fa6859db592e9bd3fa92ee736dd68a446d3fa122f7e885422
