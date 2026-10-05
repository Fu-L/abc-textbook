---
title: "monoid exponentiation・連結演算doubling"
description: "「monoid exponentiation・連結演算doubling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 189
---

# monoid exponentiation・連結演算doubling

習得対象の目安: **水色（1200–1599）**。結合則と単位元を定義し、数値以外の反復合成にも二分累乗を使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### monoid exponentiation・連結演算doubling

長さ・値・補助剰余を含む要約の結合則と単位元を定義し、巨大な反復連結を二分累乗する。

### 習得する技能

- 反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。

## 考え方

結合的な演算と単位元があれば、同じ元をK回合成する値を二分累乗で求められる。整数積だけでなく行列・写像・文字列の要約にも同じ原理を使える。


単位元e、演算⊗、基準元aに対しres=e,power=a,k=Kで始める。kの下位bitが1ならres←res⊗power、次にpower←power⊗power、k←floor(k/2)とし、k=0でresを返す。不変式 `res⊗power^k=a^K` を保つ。奇数時は一個をresへ移し、残りの偶数個を二個ずつまとめたので、結合則だけで成立する。K=0の空反復はeである。

十進文字列の連結なら要約(v,p)を「値v」と「10^長さの剰余p」とし、(v,p)⊗(w,q)=(vq+w,pq)、空列e=(0,1)とする。三つを結合した値はどちらの括り方でもvqr+w r+zになり結合的である。基準文字列の要約を累乗すれば、そのK回連結を実際に展開せず評価できる。

## 成立条件と計算量

O(log K)回の合成に、一回の演算費用を掛ける。可換性や逆元は不要で、K=0は単位元。負の指数には可逆性が必要。値の表現が途中で大きくなる場合は合成を定数時間と数えない。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

長さ・値・補助剰余を含む要約の結合則と単位元を定義し、巨大な反復連結を二分累乗する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- monoid exponentiation・連結演算doublingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC448 E「Simple Division」](https://atcoder.jp/contests/abc448/tasks/abc448_e) — 主題: [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/)（反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC448 E 公式問題文](https://atcoder.jp/contests/abc448/tasks/abc448_e)
- [ABC448 E 公式解説](https://atcoder.jp/contests/abc448/editorial/16749)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-monoid-exponentiation`
