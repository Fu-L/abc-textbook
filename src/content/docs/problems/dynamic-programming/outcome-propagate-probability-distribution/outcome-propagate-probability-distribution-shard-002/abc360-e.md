---
title: "ABC360-E — Random Swaps of Balls"
draft: true
authoringUnit: {"problemId":"abc360-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-002/abc360-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic","unit-normalization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc360-e-problem-3214799dba5edf0f62e3de6174530c076d6d3440214e0a67aefb0f14f8343bd4","source-abc360-editorial-10310-74276377180d9ad33a9601d51c84cd9f96c782a05c48f81d65b8e956f90af30a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一回の独立二位置選択で先頭から離れる確率2(N−1)/N²、非先頭から先頭へ来る確率2/N²。非先頭位置は対称で等確率のままなので先頭確率pだけで分布を復元できる。最後に非先頭平均位置を掛けると期待位置。","sourceRevisionIds":["source-abc360-e-problem-3214799dba5edf0f62e3de6174530c076d6d3440214e0a67aefb0f14f8343bd4","source-abc360-editorial-10310-74276377180d9ad33a9601d51c84cd9f96c782a05c48f81d65b8e956f90af30a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

操作は位置2..Nを対称に扱うため、黒球が先頭にある確率pだけ分かれば、他の各位置の確率はすべて(1−p)/(N−1)となる。 一回の操作で先頭から外へ移る確率は2(N−1)/N²、外から先頭へ移る条件付き確率は2/N²であり、状態数を二つに縮約できる。 順序付きに独立に二位置を選ぶため、黒球を先頭と外の間で交換する選び方をN²で割る。二位置が同じ場合も「留まる」側へ含まれる。 最終期待値はp×1+(1−p)×(2+…+N)/(N−1)で、確率はmod 998244353の逆元により表す。

採用する候補: 黒球が先頭か否かの二状態確率をK回更新し、最後に位置番号の期待値へ戻す。

対称性によりN個の位置分布を一変数で完全に復元でき、K回の線形漸化式で足りる。

棄却する候補: 黒球の各位置について確率配列を持ち、全ての交換pairから遷移を加える。

区別する必要のないN−1位置を展開し、Nが法に近いほど大きい制約に対応できない。

順序付きに独立に二位置を選ぶため、黒球を先頭と外の間で交換する選び方をN²で割る。二位置が同じ場合も「留まる」側へ含まれる。

最終期待値はp×1+(1−p)×(2+…+N)/(N−1)で、確率はmod 998244353の逆元により表す。

p=1からK回、leave=2(N−1)/N²、enter=2/N²としてp←p(1−leave)+(1−p)enterを法上で更新する。最後に先頭以外の位置番号平均を用いて期待値を計算する。

## 典型の発動条件

### 対称性によるMarkov状態圧縮

発動条件: 多数の状態が操作に対して同じ役割を持つ確率過程。

特別な位置とその他というorbitだけを状態にする。

### 有限体上の確率計算

発動条件: 答えが分数を素数modで求める形式のとき。

N²やN−1の除算を逆元へ置き換えて漸化式を実行する。

## 問題固有の要素

欲しい期待値を直接遷移させるより、唯一非対称な「位置1にいる確率」を追うと閉じた一次元漸化式になる。

別の問題へ持ち帰る視点: 確率過程では操作群が同一視する状態をまとめ、目的量をその集約状態から復元する。

## 正当性

一回の独立二位置選択で先頭から離れる確率2(N−1)/N²、非先頭から先頭へ来る確率2/N²。非先頭位置は対称で等確率のままなので先頭確率pだけで分布を復元できる。最後に非先頭平均位置を掛けると期待位置。

## 実装上の注意

- N=1ではN−1で割らず答えは常に1と処理する。ordered pairのN²通りと、異なる二位置を選ぶ場合を混同しない。

## 復習の核

- 遷移確率は「現在が先頭」「現在が外」の二行を別々に数える。最後の期待値復元まで含めてN=1,2で手計算と照合する。

## 計算量と制約

### 時間

N位置、swap回数K。二対称状態更新 O(K)。

### 空間

先頭確率と係数 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 998244352; 1 \leq K \leq 10^5

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/tasks/abc360_e) — source-abc360-e-problem-3214799dba5edf0f62e3de6174530c076d6d3440214e0a67aefb0f14f8343bd4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/editorial/10310) — source-abc360-editorial-10310-74276377180d9ad33a9601d51c84cd9f96c782a05c48f81d65b8e956f90af30a
