---
title: "FPS合成・power projection"
description: "「FPS合成・power projection」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 207
---

# FPS合成・power projection

習得対象の目安: **赤色（2800以上）**。FPS合成と転置の対応を理解し、block分割や有理関数への還元を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### FPS合成・power projection

多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。

### 習得する技能

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)。

このUnitを直接前提とする単元: なし。

形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `bc3fd38aa082c37e76f0829dcc0cff7e6d53e5b699f0b15c0b0432ab980d791f` / LearningUnit `unit-fps-composition-power-projection`
