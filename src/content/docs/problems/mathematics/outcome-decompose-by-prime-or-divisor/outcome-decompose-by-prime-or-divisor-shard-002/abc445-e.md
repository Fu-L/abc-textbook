---
title: "ABC445-E — Many LCMs"
draft: true
authoringUnit: {"problemId":"abc445-e","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-002/abc445-e.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc445-e-problem-50135848a5878b8a158943534dbfed90b6878bc27e5ccea5387b9cf9efb99965","source-abc445-editorial-15897-cb7d716d9e102facbb220e48ba70de743c4fb5a4c813c547c6652e11a22000e2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全LCMのprime指数は最大e1。要素kを除いたときはその要素だけが最大を担うprimeに限り二番目e2へ下がる。最大が重複すればe2=e1で不変。この差のprime冪で全体LCMを割れば除去後LCMになる。各primeは法より小さく可逆なのでmod上の逆元乗算でも同じ整数比を表す。","sourceRevisionIds":["source-abc445-e-problem-50135848a5878b8a158943534dbfed90b6878bc27e5ccea5387b9cf9efb99965","source-abc445-editorial-15897-cb7d716d9e102facbb220e48ba70de743c4fb5a4c813c547c6652e11a22000e2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

A_k を除いた lcm の各素数 p の指数は、全 A_i における p 指数の最大値と二番目の最大値だけで決まる。

採用する候補: 全数を素因数分解して各 p の最大指数 e1 と第二最大 e2 を保持し、全体 lcm L から A_k が担う最大指数分だけ p^{e1-e2} を除いて各 L_k を求める。

lcm は素数ごとに指数 max を取るため、最大を担う要素を一つ除いた後の max が e2 であり、その他の素数指数は変化しない。

棄却する候補: 各 k について N-1 個の lcm を先頭から掛け合わせて計算する。

N 回の再計算で O(N^2) となり、値自体も巨大なのでそのまま保持できない。

同じ最大指数を複数要素が持つ場合は e2=e1 となり、どれを除いてもその素数因子は減らない。

全体 L を modulus 上で持ち、減る因子の逆元を掛ければ巨大な整数 lcm を構築せず各答えを得られる。

篩の最小素因数で全 A_i を分解し、p ごとの top2 指数を更新する。L=∏p^{e1} mod MOD を作り、各 k は L から A_k の指数が e1 である p について p^{e1-e2} の逆元を掛けて出力する。

## 典型の発動条件

### 素数指数ごとの top-2

発動条件: 一要素除外後の gcd・lcm を全要素について求めたいとき。

各素数の最大指数と第二最大指数だけを十分統計として保持する。

## 問題固有の要素

一要素除外 query では、集約演算 max の最大値だけでなく次点を持つと除外後を定数情報で復元できる。

別の問題へ持ち帰る視点: lcm の巨大値は素数指数空間で設計し、最終的な積だけ modulus 上へ写す。

## 正当性

全LCMのprime指数は最大e1。要素kを除いたときはその要素だけが最大を担うprimeに限り二番目e2へ下がる。最大が重複すればe2=e1で不変。この差のprime冪で全体LCMを割れば除去後LCMになる。各primeは法より小さく可逆なのでmod上の逆元乗算でも同じ整数比を表す。

## 実装上の注意

- 存在しない第二指数は0とし、最大値の重複を e2=e1 として記録する。modular inverse は MOD の倍数でない因子だけに使う。

## 復習の核

- 最大指数が一意な場合と複数ある場合を分け、除外後指数が e2 になる更新規則を同じ素数の例で確認する。

## 計算量と制約

### 時間

O(V log log V+Σ_i log A_i+S log MOD)、V=10^7、Sは全factor pair数。逆元をfactorごとに作る。

### 空間

O(V+S+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^7; All input values are integers.; The sum of N over all test cases in a single input is at most 2 \times 10^5.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/tasks/abc445_e) — source-abc445-e-problem-50135848a5878b8a158943534dbfed90b6878bc27e5ccea5387b9cf9efb99965
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/editorial/15897) — source-abc445-editorial-15897-cb7d716d9e102facbb220e48ba70de743c4fb5a4c813c547c6652e11a22000e2
