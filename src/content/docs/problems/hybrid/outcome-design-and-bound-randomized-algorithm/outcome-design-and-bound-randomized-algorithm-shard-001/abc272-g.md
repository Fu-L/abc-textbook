---
title: "ABC272-G — Yet Another mod M"
draft: true
authoringUnit: {"problemId":"abc272-g","docPath":"src/content/docs/problems/hybrid/outcome-design-and-bound-randomized-algorithm/outcome-design-and-bound-randomized-algorithm-shard-001/abc272-g.md","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prime-divisor"],"excludedTopics":["誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。"],"tagIds":["tag-randomized-algorithm","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370","source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"過半数の同余類から二要素を引けば、その差は真の法の倍数である。奇素因数または4への候補削減は同余類をさらにまとめるため、過半数条件を保つ。各候補を全要素で確かめるので誤った法を返すことはなく、失敗は有効な対を一度も引けない場合に限られる。","sourceRevisionIds":["source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370","source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

先に読む単元:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

この解説で扱わないこと:

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 考察

valid Mで同じremainder Xを持つmajority index set Sを考えると、任意のi,j∈SについてM divides |A_i−A_j|となる。

|S|>N/2なのでrandomに二indexを選んだとき両方がSに入る確率は1/4より大きく、正しいdifferenceをconstant probabilityで得られる。

棄却する候補: M=3,…,10^9を列挙してremainder frequenciesを調べる。

modulus候補範囲が大きすぎる。

採用する候補: random pairsのdifferenceをfactorizeし、その3以上のdivisorsを候補Mとして全Aのremainder majorityを検証する。

majority pairを引けば真のMがdifferenceのdivisorに現れ、反復でfailure probabilityが幾何的に減る。

candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。

divisor closureより全divisorsの代わりにdifferenceのodd prime factorsと4だけを試しても、valid divisorがある場合のより小さいvalid candidateを拾える。

hidden majority congruence classからrandom pair samplingでmodulus divisorを抽出し、factorization-generated candidatesをdeterministically verifyするMonte Carlo searchである。

## 典型の発動条件

### majority集合からの乱択sampling

発動条件: 未知のgood subsetが全体の半数超を占め、その中の少数sampleから答え候補を生成できるとき。

random pairを複数回選び、両方がmajority residue classに入るeventを利用する。

### 差の約数による合同類候補

発動条件: 複数整数が同じmodulo remainderを持つ未知modulusを探すとき。

sample differenceをfactorizeし、3以上のdivisorsまたは必要十分なprime-factor candidatesを列挙する。

## 問題固有の要素

入力値はdistinctなのでsampleした異なるindicesのdifferenceは正で、factorization対象0の例外を避けられる。

別の問題へ持ち帰る視点: majority構造はrandom pairが同じhidden classへ入る定数確率を与え、candidate generationのrandomizationに使える。

## 正当性

過半数の同余類から二要素を引けば、その差は真の法の倍数である。奇素因数または4への候補削減は同余類をさらにまとめるため、過半数条件を保つ。各候補を全要素で確かめるので誤った法を返すことはなく、失敗は有効な対を一度も引けない場合に限られる。

## 実装上の注意

- 同一pair・同一factorから出るcandidateをdeduplicateし、M≥3かつM≤10^9を満たすものだけ検証する。
- 試行回数を要求failure probabilityから決め、random generatorのindex選択で同じindexを避ける。

## 復習の核

- 同じmodulo classの二値差はmodulusの倍数になるので、未知modulus候補をdifference factorizationへ移す。
- majorityが保証するconstant hit probabilityと、候補の完全検証を組み合わせてone-sided errorにする。

## 計算量と制約

### 時間

T回sample、差の試し割りO(T√D)、候補C個の検査O(CN)、D=maxA−minA。固定Tで失敗確率を制御する。

### 空間

O(N+√D)、候補とfrequency。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \le N \le 5000; 1 \le A_i \le 10^9; The elements of A are distinct.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_g) — source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4981) — source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952
