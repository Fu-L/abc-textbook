---
title: "ABC424-E — Cut in Half"
draft: true
authoringUnit: {"problemId":"abc424-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-003/abc424-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-implicit-binary-tree"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-implicit-binary-tree-arithmetic"],"sourceRevisionIds":["source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6","source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"A/2^q≤Dを満たす最小q_iは、全pieceをD以下にするため各stickで必要な分割をちょうど行う。境界探索後の残り操作は最大pieceだけを割る実際のgreedy順と一致し、同じ長さのpieceは個数をまとめても分割結果が同じである。従って更新後の個数表はK回のgreedy分割と同じpiece集合を表し、その降順X番目が答えになる。","sourceRevisionIds":["source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6","source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

先に読む単元:

- [対称性・深さ・label区間で巨大な完全二分木を数える](src/content/docs/learn/tree/implicit-binary-tree.md) — 指数個の頂点を持つ完全二分木を展開せず、深さごとの対称性と2冪で集約するか、heap番号の祖先移動と深さ別子孫label区間で数える。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

長さAのstickを最大長D以下にする最小分割回数は、q=最小の非負整数でA/2^q≤Dとなるものに対する2^q−1回である。全stickのneed(D)=Σ(2^q−1)はDに対して単調非増加なので、need(D)≤Kを満たす最小側の境界を二分探索する。

境界で決まるq_iから、各stickのpiece長A_i/2^q_iを正確なdyadic値として個数表へ加え、使用回数を整数で合計する。残りK−used回は、現在最長の長さLのpieceをt=min(個数(L),残回数)個まとめて割る。個数(L)をt減らし、個数(L/2)へ2t足して、次の最長groupへ進む。この処理を残回数が0になるまで行う。最後にpiece長を降順に数え、X番目を答える。近似された境界値からpieceの個数を逆算しない。

## 典型の発動条件

### 答えの二分探索

発動条件: threshold以下に全objectをする最小operation数がthresholdに単調である。

Dごとの完全二分深さからneed(D)を計算し境界を探す。

### 完全二分木の層数式とfrequency集約

発動条件: 同じobjectへの反復二分操作が、深さqの完全二分木として対称に展開されるとき。

各棒のq回分割を内部node数2^q−1・葉数2^qで数え、pieceを個別生成せずlength→count mapで順位を求める。

## 問題固有の要素

greedyが常にlongestを割るため、最終maximum未満のpieceを先に割ることはなく、境界後の余剰操作もmaximum classだけへ集中する。

別の問題へ持ち帰る視点: priority processはthreshold到達までの各rootの展開数をclosed form化できる。

## 正当性

A/2^q≤Dを満たす最小q_iは、全pieceをD以下にするため各stickで必要な分割をちょうど行う。境界探索後の残り操作は最大pieceだけを割る実際のgreedy順と一致し、同じ長さのpieceは個数をまとめても分割結果が同じである。従って更新後の個数表はK回のgreedy分割と同じpiece集合を表し、その降順X番目が答えになる。

## 実装上の注意

- piece長は2で約分して正規化したdyadic値(numerator, exponent)で表し、等しい長さを同じgroupへまとめる。比較は2の冪を掛けて整数で行う。頻度・need・used・残回数も整数で保持する。
- 残回数を処理するときは各長さでt=min(頻度,残回数)個を一括分割し、半分の長さのgroupへ移す。q_iと2^q_i−1の計算はKを超えた時点でcapする。

## 復習の核

- K小でheap simulationと比較し、同率maximumが複数、X=1/N+Kを検証する。

## 計算量と制約

### 時間

O(I N log K + N log K log(N log K))、I回の実数二分探索とdyadic groupの構築・残余分割・順位取得。

### 空間

O(N log K)、各元stickが作る深さ別dyadic piece groupを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; For each test case: 1 \leq N \leq 10^5 1 \leq A_i \leq 10^9 1 \leq K \leq 10^9 1 \leq X \leq N+K; 1 \leq N \leq 10^5; 1 \leq A_i \leq 10^9; 1 \leq K \leq 10^9; 1 \leq X \leq N+K; The sum of N over all test cases does not exceed 10^5.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/tasks/abc424_e) — source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/editorial/13858) — source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e
