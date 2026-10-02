---
title: "ABC393-E — GCD of Subset"
draft: true
authoringUnit: {"problemId":"abc393-e","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc393-e.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc393-e-problem-1e1f2843143d35d6c5d3150c8d998e82152d9774ae3832fc0936a73f30866d8f","source-abc393-editorial-12243-3c04bba99a9b8a20be1435fc482a7c1e5e81e34c6f6aa29197be95eda1d4f5c1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"K要素のgcdはA_iの約数で、全体にその倍数がK個以上必要。逆にこの条件を満たすdならA_iを含むK個の倍数を選べ、そのgcdはdの倍数である。最大valid約数dより大きいgcdが得られたならそれ自身もvalid約数で矛盾するので、最大dが最適gcdに一致する。昇順上書きでそれを保存する。","sourceRevisionIds":["source-abc393-e-problem-1e1f2843143d35d6c5d3150c8d998e82152d9774ae3832fc0936a73f30866d8f","source-abc393-editorial-12243-3c04bba99a9b8a20be1435fc482a7c1e5e81e34c6f6aa29197be95eda1d4f5c1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

A_iを含むK要素のGCD候補dはA_iの約数であり、さらに列全体でdの倍数がK個以上なければならない。この二条件は十分でもある。

値上限10^6なので、各dの倍数個数を倍数sieveで全て数え、条件を満たすdをその倍数へ配れる。

採用する候補: frequencyの倍数和でvalid divisorを判定し、valid dを倍数nの答えへ昇順上書きする

t[d]=Σ_{multiple}freqをO(V log V)で求め、t[d]≥Kなら全multiple nのbest[n]=dを更新すれば最大valid divisorが残る。

棄却する候補: 各A_iの全約数を列挙し、その都度全配列で倍数個数を数える

要素ごとの重複計算が大きく、同じ値・同じ約数の判定を何度も繰り返す。

GCDをちょうどdにする必要はなく「少なくともdで割れる」K個を選べば、そのGCDはd以上で、最大候補探索の十分性が得られる。

dを昇順に処理してbest[multiple]=dと代入すれば、最後の値が最大のvalid約数になる。

freq[value]を数える。d=1..Vでmultipleを走査してt[d]を求める。t[d]≥Kのdについて全multipleへbest[multiple]=dを設定し、各A_iにbest[A_i]を出力する。

## 典型の発動条件

### 倍数sieve

発動条件: 全dについて入力中のdの倍数個数を求めたいとき。

frequencyをmultiple方向に足す。

### 約数条件の倍数配布

発動条件: 各nに対する最大valid divisorを一括計算したいとき。

valid dからその倍数nへ値を伝播する。

## 問題固有の要素

選ぶK要素の組合せを考えず、候補GCD dごとに「選択可能な母集団size」だけ判定すればよい。

別の問題へ持ち帰る視点: subsetのGCD最大化では、dで割れる要素数という単調な可否条件へ切り替える。

## 正当性

K要素のgcdはA_iの約数で、全体にその倍数がK個以上必要。逆にこの条件を満たすdならA_iを含むK個の倍数を選べ、そのgcdはdの倍数である。最大valid約数dより大きいgcdが得られたならそれ自身もvalid約数で矛盾するので、最大dが最適gcdに一致する。昇順上書きでそれを保存する。

## 実装上の注意

- V=max(A)までに配列を絞り、t[d]とfrequencyはNを保持できる型にする。昇順上書きか降順初回代入のどちらかを一貫する。

## 復習の核

- N≤12で各iを含むK-combinationを全列挙し、duplicate値、K=1,N、A_i=1をsieve結果と比較する。

## 計算量と制約

### 時間

O(V log V+N)。倍数個数とbest約数の倍数配布を行う。

### 空間

O(V+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 1.2 \times 10^6; 1 \leq A_i \leq 10^6; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/tasks/abc393_e) — source-abc393-e-problem-1e1f2843143d35d6c5d3150c8d998e82152d9774ae3832fc0936a73f30866d8f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/editorial/12243) — source-abc393-editorial-12243-3c04bba99a9b8a20be1435fc482a7c1e5e81e34c6f6aa29197be95eda1d4f5c1
