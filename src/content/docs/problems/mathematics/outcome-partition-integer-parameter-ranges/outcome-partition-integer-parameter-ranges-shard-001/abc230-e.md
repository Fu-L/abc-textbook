---
title: "ABC230-E — Fraction Floor Sum"
draft: true
authoringUnit: {"problemId":"abc230-e","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc230-e.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc230-e-problem-3d6f2eb2af132c663a771b9bbc8c60031ad3f3e5de0dbe6cbab88f2cd9aa22a0","source-abc230-editorial-3015-e3a2cd6ba379bb9e86973db15ecf8c610c29213fe94c061e57e1d7b30cd5b019"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"s=floor√Nとしてi≤sは直接足す。i>sの商q≤sについてfloor(N/(q+1))<i≤floor(N/q)をi>sへ制限して個数を数える。この二領域は互いに素で全iを覆い、各商の寄与を一度だけ足す。","sourceRevisionIds":["source-abc230-e-problem-3d6f2eb2af132c663a771b9bbc8c60031ad3f3e5de0dbe6cbab88f2cd9aa22a0","source-abc230-editorial-3015-e3a2cd6ba379bb9e86973db15ecf8c610c29213fe94c061e57e1d7b30cd5b019"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

この解説で扱わないこと:

- 素因数指数による整数条件の分解。

## 考察

i が大きくなると floor(N/i) は単調に減り、同じ商を取る i が長い連続区間としてまとまる。

商が k となる整数 i の個数は floor(N/k)−floor(N/(k＋1)) で求まり、小さい商は値ごとに一括加算できる。

棄却する候補: i＝1 から N まで順に floor(N/i) を計算して足す。

N が 10 の 12 乗まであるため、N 回の除算を実行できない。

採用する候補: sqrt(N) 以下の商は出現回数でまとめ、それより大きい商は対応する小さい i を一つずつ処理する。

商と添字の少なくとも一方が sqrt(N) 以下になる双曲線の性質により、両側を合わせても平方根程度の項だけで済む。

全ての i を走査する代わりに、floor(N/i) の値が同じ区間を数えるという商側からの集約へ視点を移す。

整数双曲線 xy≤N の格子点数え上げとして、小さい商の頻度集約と小さい除数の直接和を境界 floor(sqrt(N)) で分割する。

## 典型の発動条件

### floor 商の平方根分割

発動条件: floor(N/i) を i の広い範囲で集約して和や頻度を求めるとき。

商 k の出現個数を除算二回の差で求め、大きい商側は小さい i だけ直接処理する。

## 問題固有の要素

k₀＝floor(sqrt(N)) とすると、商が k₀＋1 以上の i は N/(k₀＋1) 以下に限られ、集約側との重複なしに直接列挙できる。

別の問題へ持ち帰る視点: 商と除数の対称性を使う分割では、境界の等号を式で確認して二重計上を避ける。

## 正当性

s=floor√Nとしてi≤sは直接足す。i>sの商q≤sについてfloor(N/(q+1))<i≤floor(N/q)をi>sへ制限して個数を数える。この二領域は互いに素で全iを覆い、各商の寄与を一度だけ足す。

## 実装上の注意

- 平方根は浮動小数に頼らず整数として補正し、k₀²≤N＜(k₀＋1)² を満たすことを確認する。
- 答えは 32 bit を超えるため 64 bit 整数を使い、二つの和の添字範囲を境界で重ねない。

## 復習の核

- floor(N/i) が並んだら、値の種類数と同値区間の端点 floor(N/k) を先に調べる。

## 計算量と制約

### 時間

O(√N)。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{12}; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_e) — source-abc230-e-problem-3d6f2eb2af132c663a771b9bbc8c60031ad3f3e5de0dbe6cbab88f2cd9aa22a0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/3015) — source-abc230-editorial-3015-e3a2cd6ba379bb9e86973db15ecf8c610c29213fe94c061e57e1d7b30cd5b019
