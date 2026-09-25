---
title: "label付き連結成分分解・exponential formula"
description: "「label付き連結成分分解・exponential formula」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 201
---

# label付き連結成分分解・exponential formula

習得対象の目安: **黄色（2000–2399）**。根を含む成分や成分集合の一意な分解から、指数型母関数やsubset再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第168単元。技能の説明を学んでから問題一覧へ進んでください。

前: [平面graph双対・cut/path対応](/learn/graph/planar-duality/) ／ 次: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)

## 概要

### label付き連結成分分解・exponential formula

rootを含む連結成分または成分集合を一意に切り出し、全構造とconnected構造の関係をsubset DPや指数型母関数で解く。

### 習得する技能

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、label付き連結成分分解・exponential formulaの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
2. [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
3. [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)。既習技能: 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
4. [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
5. [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
6. [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC236 H 公式解説](https://atcoder.jp/contests/abc236/editorial/3289)
- [ABC236 H 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-labeled-component-decomposition`
