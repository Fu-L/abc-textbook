---
title: "label付き連結成分分解・exponential formula"
description: "「label付き連結成分分解・exponential formula」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 200
---

# label付き連結成分分解・exponential formula

習得対象の目安: **黄色（2000–2399）**。根を含む成分や成分集合の一意な分解から、指数型母関数やsubset再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### label付き連結成分分解・exponential formula

rootを含む連結成分または成分集合を一意に切り出し、全構造とconnected構造の関係をsubset DPや指数型母関数で解く。

### 習得する技能

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

このUnitを直接前提とする単元: なし。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、label付き連結成分分解・exponential formulaの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。
- [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC236 H 公式解説](https://atcoder.jp/contests/abc236/editorial/3289)
- [ABC236 H 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-labeled-component-decomposition`
