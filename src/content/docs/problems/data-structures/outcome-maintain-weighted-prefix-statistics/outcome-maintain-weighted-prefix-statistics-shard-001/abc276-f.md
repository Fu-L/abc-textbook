---
title: "ABC276-F — Double Chance"
draft: true
authoringUnit: {"problemId":"abc276-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc276-f.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc276-editorial-5174-9428f970e7dd996691db755207bc1d0af8192e158099bf7709109244eefd72b6","source-abc276-f-problem-8458e6623b4a15fa95504db816dad955e83b363f69ac8bcd8f7f5d3fae260deb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Σ_{i<K}max(A_i,a)=a·count(A_i≤a)+sum(A_i>a) と、必要量が値域上の個数prefixと総和suffixに分離する。 S_Kは整数のまま更新し、出力時だけK^{-2}を掛ければ、各pairの確率を個別に扱わずに済む。 全prefixの二重和を増分で共有し、大小別集計をprefix sum queryで得られる。","sourceRevisionIds":["source-abc276-editorial-5174-9428f970e7dd996691db755207bc1d0af8192e158099bf7709109244eefd72b6","source-abc276-f-problem-8458e6623b4a15fa95504db816dad955e83b363f69ac8bcd8f7f5d3fae260deb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

prefix Kでの期待値は、ordered pair (i,j) がK²通り等確率なので S_K=Σ_{i,j≤K}max(A_i,A_j) をK²で割ればよい。

K-1からA_Kを追加すると新規pairは(K,K)と片方だけKの2(K-1)個で、差分は2Σ_{i<K}max(A_i,A_K)+A_Kになる。

採用する候補: 値ごとの個数と総和を2本のFenwick treeに持ち、新要素以下の個数と新要素超の総和から差分を更新する。

全prefixの二重和を増分で共有し、大小別集計をprefix sum queryで得られる。

棄却する候補: 各Kでprefixをsortして全ordered pairのmaxを計算し直す。

prefixごとの再計算が二次規模以上になり、N≤2×10^5に収まらない。

Σ_{i<K}max(A_i,a)=a·count(A_i≤a)+sum(A_i>a) と、必要量が値域上の個数prefixと総和suffixに分離する。

S_Kは整数のまま更新し、出力時だけK^{-2}を掛ければ、各pairの確率を個別に扱わずに済む。

Kを1から進め、Fenwickでcnt≤A_Kとsum≤A_Kを取得し、sumGreater=totalSum-sum≤を作る。S+=2(A_K·cnt≤+sumGreater)+A_K と更新し、S/(K²)を法上で出力してからA_Kを木へ追加する。

## 典型の発動条件

### online二重和の差分更新

発動条件: prefix集合上の全pair関数を各prefixで求め、新要素とのpair寄与を高速集計できるとき。

旧pair和を保持し、新要素が関与する行・列・対角だけを加える。

### Fenwick treeで個数と総和

発動条件: 値との大小で寄与式が分かれ、値域prefixの件数と重み和が必要なとき。

2本の木でcount≤aとsum≤aを求め、残りを全体和との差にする。

## 問題固有の要素

maxの和は新値以下をすべて新値へ置換し、新値超は元値を足す式になるため、順序統計ではなく個数と総和だけで十分である。

別の問題へ持ち帰る視点: pair関数min/maxでは、新要素を閾値に集合を二分し、各側の寄与がcount/sumに分離するか確認する。

## 正当性

Σ_{i<K}max(A_i,a)=a·count(A_i≤a)+sum(A_i>a) と、必要量が値域上の個数prefixと総和suffixに分離する。 S_Kは整数のまま更新し、出力時だけK^{-2}を掛ければ、各pairの確率を個別に扱わずに済む。 全prefixの二重和を増分で共有し、大小別集計をprefix sum queryで得られる。

## 実装上の注意

- 同値A_iは≤側へ含めてもmaxは同じであり、count queryの境界を一貫させる。
- K²の逆元はpow(K,mod-2)²またはinv(K)²で求め、減算したsumGreaterを法で正規化する。

## 復習の核

- A=(5,7)でS_1=5からS_2=26へ増える4pairを列挙し、差分式の係数2と対角A_Kを照合する。

## 計算量と制約

### 時間

O(N log V)、Vは値座標数。逆元前計算O(N)。

### 空間

O(N+V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq A_i \leq 2\times 10^5; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/editorial/5174) — source-abc276-editorial-5174-9428f970e7dd996691db755207bc1d0af8192e158099bf7709109244eefd72b6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/tasks/abc276_f) — source-abc276-f-problem-8458e6623b4a15fa95504db816dad955e83b363f69ac8bcd8f7f5d3fae260deb
