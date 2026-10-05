---
title: "ABC222-G — 222"
draft: true
authoringUnit: {"problemId":"abc222-g","docPath":"src/content/docs/problems/mathematics/outcome-find-period-by-multiplicative-order/outcome-find-period-by-multiplicative-order-shard-001/abc222-g.md","learningOutcomeIds":["outcome-find-period-by-multiplicative-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-structure","unit-modular-arithmetic","unit-prime-divisor"],"excludedTopics":["約数格子上の指数計数・包除。"],"tagIds":["tag-multiplicative-order","tag-gcd-structure","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc222-editorial-2750-60abea0942d6c1328f4e76175c2005c04c77516b4f4d3adc5d5fd5c231b76b95","source-abc222-g-problem-a78282cf6ac558c99da4c78599cb6984de0a1728896449b0230ae3d6c5299378"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"K|2(10^n−1)/9は整数の可除性としてL|(10^n−1)と同値。10とLが非互いに素なら不可能、互いに素なら最小nはord_L(10)でφ(L)を割る。約数を昇順に調べ最初の成立値を選ぶため最小桁数になる。9の逆元は仮定しない。","sourceRevisionIds":["source-abc222-editorial-2750-60abea0942d6c1328f4e76175c2005c04c77516b4f4d3adc5d5fd5c231b76b95","source-abc222-g-problem-a78282cf6ac558c99da4c78599cb6984de0a1728896449b0230ae3d6c5299378"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乗法的位数から最小周期を求める](src/content/docs/learn/number-theory/multiplicative-order-periods.md)

- 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。

先に読む単元:

- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md) — 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

この解説で扱わないこと:

- 約数格子上の指数計数・包除。

## 考察

n 桁の数は 2(10^n-1)/9 である。g=gcd(K,2) とおくと、K がこの数を割る条件は M'=9K/g が 10^n-1 を割る条件、すなわち 10^n≡1 (mod M') と同値になる。これは 9 の法逆元を取る変形ではなく、整数の可除性による変形である。

この合同式に解があるのは gcd(10,M')=1 のときだけである。共通素因子 2 または 5 があれば矛盾し、互いに素なら Euler の定理により n=φ(M') が一つの解になる。

採用する候補: Euler の定理で指数を φ(M') の約数へ限定し、昇順に modular power を検査して最小の乗法的位数を求める。

gcd(10,M')=1 のとき求める最小 n は 10 の乗法的位数で、φ(M') を割る。したがって長さを順に試さず、φ(M') の約数だけを検査できる。

棄却する候補: 余りを更新しながら長さ n を 1 から順に試す。

最悪 O(M') 回の余り更新が必要で、M'≤9×10^8 のケースを T≤200 件処理する制約に合わない。

gcd(10,M')=1 のとき求める n は ord_{M'}(10) である。これは有限群 (Z/M'Z)^× の元の位数なので φ(M') を割り、φ(M') の約数を昇順に調べて最初に 10^d≡1 となる d が最小解である。

各 K について g=gcd(K,2), M'=9K/g を作る。gcd(10,M')>1 なら -1 とし、そうでなければ試し割りで φ(M') を求め、その正約数を昇順に列挙して powmod(10,d,M')=1 となる最初の d を出力する。

## 典型の発動条件

### 乗法的位数

発動条件: 同じ桁の反復や等比数列が a^n≡1 の最小指数へ帰着するとき。

repdigit の長さを 10 の法 M' における位数として扱う。

### Euler の定理と約数列挙

発動条件: 底と法が互いに素で最小周期を求めるとき。

候補指数を φ(M') の約数へ限定する。

### 係数・分母を含む可除性の gcd 変形

発動条件: 整数等比和 c(a^n-1)/b の K による割り切れを冪合同式へ直すとき。

係数 2 は gcd(K,2) だけ消し、分母 9 は法を 9 倍して M'=9K/gcd(K,2) を作る。

## 問題固有の要素

数字 2 の反復では係数 2 を gcd(K,2) だけ消し、分母 9 は法逆元にせず法を 9 倍するため、M'=9K/gcd(K,2) が現れる。

別の問題へ持ち帰る視点: 反復桁・等比和の割り切れでは分母を安易に法逆元へせず、整数の可除性と gcd で冪合同式の法を作る。

## 正当性

K|2(10^n−1)/9は整数の可除性としてL|(10^n−1)と同値。10とLが非互いに素なら不可能、互いに素なら最小nはord_L(10)でφ(L)を割る。約数を昇順に調べ最初の成立値を選ぶため最小桁数になる。9の逆元は仮定しない。

## 実装上の注意

- M'=9K/gcd(K,2) を 64-bit 整数で計算し、gcd(10,M')>1 なら -1 とする。φ の計算では各素因数を一度だけ反映し、約数を重複なく昇順に並べ、powmod の積も 64-bit 整数で持つ。

## 復習の核

- 2(10^n-1)/9 の「9 で割る」を法 K 上の逆元にせず、M'=9K/gcd(K,2) を整数の可除性から再導出する。
- K=1,2,4,5,6,10 を余り更新による全探索と比較し、偶数を全て解なしにしていないか、4 または 5 の因子を見落としていないか確認する。

## 計算量と制約

### 時間

各case O(√L+√φ(L)+D log D+D log L)、L=9K/gcd(K,2)、D=τ(φ(L))。

### 空間

O(D+log L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 200; 1 \leq K \leq 10^8; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/editorial/2750) — source-abc222-editorial-2750-60abea0942d6c1328f4e76175c2005c04c77516b4f4d3adc5d5fd5c231b76b95
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/tasks/abc222_g) — source-abc222-g-problem-a78282cf6ac558c99da4c78599cb6984de0a1728896449b0230ae3d6c5299378
