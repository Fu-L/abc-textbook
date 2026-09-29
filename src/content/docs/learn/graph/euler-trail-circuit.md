---
title: "Euler trail・circuit"
description: "「Euler trail・circuit」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 121
---

# Euler trail・circuit

習得対象の目安: **水色（1200–1599）**。次数条件を理解し、辺を一度ずつ使うHierholzer法を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Euler trail・circuit

全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。

### 習得する技能

- 無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。
- 全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)、[BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)。

全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Euler trail・circuitの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC286 G「Unique Walk」](https://atcoder.jp/contests/abc286/tasks/abc286_g) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)（有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

## 根拠

- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC286 G 公式解説](https://atcoder.jp/contests/abc286/editorial/5573)
- [ABC286 G 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_g)
- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-euler-trail-circuit`
