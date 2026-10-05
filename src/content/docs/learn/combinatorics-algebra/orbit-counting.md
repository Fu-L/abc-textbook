---
title: "群作用・軌道数え上げ"
description: "「群作用・軌道数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 196
---

# 群作用・軌道数え上げ

習得対象の目安: **黄色（2000–2399）**。群作用と固定点を定義し、Burnside・Pólyaによる対称性込みの計数を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 群作用・軌道数え上げ

群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。

### 習得する技能

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

## 考え方

対称操作で同じとみなす対象は群作用のorbitである。各操作が固定する対象数を足し群のサイズで割るBurnsideの補題により、orbitサイズが一様でなくても数えられる。


有限群Gが集合Xへ作用するとは、単位元が何も変えず、(gh)x=g(hx)となること。orbitはGx、固定点集合はFix(g)={x:gx=x}、stabilizerはG_x={g:gx=x}である。g→gxの各fiberはG_xのcosetなので|Gx|·|G_x|=|G|。組(g,x)でgx=xとなるものを二方向から数えると、Σ_g|Fix(g)|=Σ_x|G_x|。各orbitの右辺寄与は|G|だから、orbit数は(1/|G|)Σ_g|Fix(g)|となる。

N位置をq色で塗る場合、位置置換gが持つcycle数をc(g)とすると、固定された塗り方は各cycle内が同色であるためq^c(g)個。回転tではc(g)=gcd(N,t)なので回転同値の数は `(1/N)Σ_{t=0}^{N−1}q^gcd(N,t)`。色ごとの個数も固定するPólya計数では、長さlのcycle一個の寄与をΣ_color z_color^lへ置き換え、全cycleの積を群で平均した多項式から必要な係数を取る。全対象数を|G|で割るだけでは、対称性のある対象のorbitが小さいことを補正できない。

## 成立条件と計算量

群Gなら|G|個の固定点計数の総費用になる。回転だけか反転も含むかで群が変わる。modで|G|を割るには逆元が必要で、割れない場合は整数段階や別の法で処理する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [同値な状態を正規化する](/learn/modeling/normalization/)。

このUnitを直接前提とする単元: なし。

状態・配置の正規化で得た考え方と実装を再利用し、群作用・軌道数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC284 H 公式解説](https://atcoder.jp/contests/abc284/editorial/5481)
- [ABC284 H 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC428 G 公式解説](https://atcoder.jp/contests/abc428/editorial/14241)
- [ABC428 G 公式問題文](https://atcoder.jp/contests/abc428/tasks/abc428_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-orbit-counting`
