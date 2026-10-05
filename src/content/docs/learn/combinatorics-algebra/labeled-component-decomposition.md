---
title: "label付き連結成分分解・exponential formula"
description: "「label付き連結成分分解・exponential formula」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 203
---

# label付き連結成分分解・exponential formula

習得対象の目安: **黄色（2000–2399）**。根を含む成分や成分集合の一意な分解から、指数型母関数やsubset再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### label付き連結成分分解・exponential formula

rootを含む連結成分または成分集合を一意に切り出し、全構造とconnected構造の関係をsubset DPや指数型母関数で解く。

### 習得する技能

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

## 考え方

固定されたnラベル上の全構造の個数をa_n、連結な構造の個数をc_nとし、空構造は `a_0=1`、空の連結成分は存在しないとする。成分間の制約がなく、各構造が連結成分の集合へ一意に分かれる場合を扱う。

### 最小ラベルのある成分を固定する

ラベル1を含む成分のサイズをkとする。残りのk-1ラベルの選び方は `C(n-1,k-1)` 通り。そのラベル集合上でc_k通りの成分を作り、残ったn-kラベル上でa_{n-k}通りの構造を作る。したがって

`a_n=Σ_{k=1}^n C(n-1,k-1)c_k a_{n-k}`。

どの構造にもラベル1の成分が一つだけあるため、成分の順序を数える重複はない。全構造a_nが先に分かる場合、k=nの項がc_nなので、`c_n=a_n-Σ_{k=1}^{n-1}C(n-1,k-1)c_k a_{n-k}` と順に復元できる。

### 指数型生成関数とsubset再帰

`A(x)=Σ a_n x^n/n!`、`C(x)=Σ_{n≥1}c_n x^n/n!` と置く。上の式を(n-1)!で割って比較すると `A'=C'A`。初期値A(0)=1,C(0)=0から `A=exp C`、逆に `C=log A` となる。別の見方では、k個の成分を並べた `C^k` を、順序を忘れるためk!で割って合計しても同じ式を得る。成分数をuで記録するなら `A(x,u)=exp(uC(x))`、成分数kだけなら `C(x)^k/k!` である。

ラベルごとに辺や重みが違うと、サイズだけへ圧縮できない。集合S上の全構造数a[S]と連結構造数c[S]を持ち、空集合をa[∅]=1として、`a[S]=Σ_{T⊆S, min(S)∈T} c[T]a[S\T]` とする。同じ最小ラベルによる一意な分解で、二項係数は各Tを直接列挙する操作へ置き換わる。

### 符号付きの連結グラフへ特殊化する

上の分解は個数だけでなく、成分ごとに積となる重み和にも使える。単純グラフの重みを(−1)^{辺数}とすると、全グラフの和a_nはa_0=a_1=1、n≥2では一つの辺の有無を反転する対の相殺から0になる。連結グラフの符号和をh(n)とすれば、最小ラベルの成分を固定した式は0=Σ C(n−1,k−1)h(k)a_{n−k}。補集合サイズが2以上の項は消え、0=h(n)+(n−1)h(n−1)だけが残る。h(1)=1からh(n)=(−1)^{n−1}(n−1)!を得る。

[ABC236 Ex](https://atcoder.jp/contests/abc236/editorial/3289)では等値辺の成分Tの共通値をg(T)通り選べるため、c[T]=g(T)h(|T|)を集合分割の重みとして使う。空分割の重みdp[∅]=1、固定ラベルを含むT⊆Sの列挙から、dp[S]=Σ c[T]dp[S\T]となる。T=Sも含めるので、全体が一成分の項も基底から生成できる。成分内部の相殺を導くことと、分割を重複なく合成することは別々に確認する。

## 成立条件と計算量

サイズだけの漸化式は、二項係数を前計算すればO(N²)時間。subset再帰を全Sについて直接評価するとO(3^N)時間・O(2^N)空間になる。exp/logで高速化する場合の費用はFPS演算に依存する。

n!による除算ができない法でも、二項係数を用いた整数の漸化式自体は成立する。成分間の辺・順序・相互制約がある場合は `A=exp C` をそのまま使えない。成分数制約ならuを追加するように、何を独立に選べるのかを先に確認する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（連結二部グラフの二つの彩色が部の交換だけで対応することを使い、彩色付きの計数から同じグラフの重複を補正できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。
- [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC236 H 公式解説](https://atcoder.jp/contests/abc236/editorial/3289)
- [ABC236 H 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-labeled-component-decomposition`
