---
title: "乗法的位数から最小周期を求める"
description: "「乗法的位数から最小周期を求める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 172
---

# 乗法的位数から最小周期を求める

習得対象の目安: **青色（1600–1999）**。群の位数と要素の位数を区別し、約数を割り落として最小周期を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 乗法的位数・最小周期

合同反復の最小正周期をmultiplicative orderへ帰着し、群位数の約数を割り落として求める。

### 習得する技能

- 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。

## 考え方

gcd(a,m)=1のときa^k≡1となる最小正整数kが位数である。既知の群の位数を素因数分解し、候補kを各素数で割っても等式が保たれるかを検査する。

まずa^M≡1 mod mが保証される正整数Mを用意する。素数法ならM=p−1、一般の法でも単元群の位数φ(m)を使えるが、その計算費用を含める。d=Mから始め、Mの各相異なる素因数qについて、qがdを割り、かつa^(d/q)≡1である間だけd←d/qと繰り返す。失敗したら次のqへ進み、最後のdを出力する。

真の位数hに対し、a^d=1であることとhがdを割ることは同値である。d=th+r、0≤r<hと書けばa^r=1であり、hの最小性からr=0となるためだ。更新は常にh|dを保つ。あるqをこれ以上割れないのはd/qがhの倍数でなくなったためで、その後他の素因数を削ってもqを追加で削れるようにはならない。終了時に余分な素因数が残ればその素数で割れるはずなのでd=hとなる。例えば法7のa=2はM=6から3へ下がり、2^1≠1なので位数3。

## 成立条件と計算量

各検査はO(log k)累乗で、群の位数の因数分解費用も必要。素数法pなら位数はp−1を割る。aが非可逆なら位数を定義できず、単なる反復周期と同じ算法を使えない。

Mの素因数の重複込み個数と最後の失敗検査はO(log M)回なので、法上の乗算をO(1)とすれば累乗部分はO(log² M)。別途Mの導出・素因数分解費用がかかる。gcd(a,m)=1を確認し、m≥2とする。a=1は位数1であり、反復がa^t以外の形なら、まずその反復の周期と位数が一致することを証明する。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)、[素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

このUnitを直接前提とする単元: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。

合同算術と約数分解を使えることを前提に、最小周期を乗法的位数へ帰着して約数から絞る。

### このUnitでは扱わないもの

- 約数格子上の指数計数・包除。

## 問題一覧

- [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g) — 主題: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)（合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。追加で学ぶ技能: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)（合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC335 G 公式解説](https://atcoder.jp/contests/abc335/editorial/9017)
- [ABC335 G 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-multiplicative-order-periods`
