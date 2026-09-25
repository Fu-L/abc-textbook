---
title: "FPS演算・多点評価・合成を行う"
description: "「FPS演算・多点評価・合成を行う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 204
---

# FPS演算・多点評価・合成を行う

習得対象の目安: **橙色（2400–2799）**。定数項と打切り次数の条件を押さえ、Newton反復で逆数・log・expを構成する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 形式的べき級数の基本演算

定数項条件と次数打切りを確認し、Newton iterationでinverse・log・exp等を畳み込みへ還元する。

### 習得する技能

- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)、[NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

このUnitを直接前提とする単元: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)、[多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。

生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expと多点評価・合成を次数制限付きで実装する。

### このUnitでは扱わないもの

- 積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。

## 下位単元

- [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) — 橙色
- [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/) — 橙色
- [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/) — 赤色

## 問題一覧

- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h) — 主題: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
- [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。

## 根拠

- [ABC260 H 公式解説](https://atcoder.jp/contests/abc260/editorial/4434)
- [ABC260 H 公式問題文](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC289 H 公式解説](https://atcoder.jp/contests/abc289/editorial/5712)
- [ABC289 H 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-formal-power-series`
