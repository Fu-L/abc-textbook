---
title: "FPS演算・多点評価・合成を行う"
description: "「FPS演算・多点評価・合成を行う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 205
---

# FPS演算・多点評価・合成を行う

習得対象の目安: **橙色（2400–2799）**。定数項と打切り次数の条件を押さえ、Newton反復で逆数・log・expを構成する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第190単元。技能の説明を学んでから問題一覧へ進んでください。

前: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/) ／ 次: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)

## 概要

### 形式的べき級数の基本演算

定数項条件と次数打切りを確認し、Newton iterationでinverse・log・exp等を畳み込みへ還元する。

### 習得する技能

- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)、[NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expと多点評価・合成を次数制限付きで実装する。

### このUnitでは扱わないもの

- 積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。

## 下位単元

- [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) — 橙色
- [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/) — 橙色
- [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/) — 赤色

## 問題一覧

1. [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。
2. [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
3. [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
4. [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h) — 主題: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
5. [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
6. [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC260 H 公式解説](https://atcoder.jp/contests/abc260/editorial/4434)
- [ABC260 H 公式問題文](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC289 H 公式解説](https://atcoder.jp/contests/abc289/editorial/5712)
- [ABC289 H 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-formal-power-series`
