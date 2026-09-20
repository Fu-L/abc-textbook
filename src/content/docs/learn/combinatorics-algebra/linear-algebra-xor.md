---
title: "線形方程式・基底・分離可能変換へ変換する"
description: "「線形方程式・基底・分離可能変換へ変換する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 195
---

# 線形方程式・基底・分離可能変換へ変換する

導入対象の目安: **青色（1600–1999）**。rank・基底・線形写像を制約と変換の共通言語として学ぶ入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

制約を線形方程式へ写して解空間とrankを調べ、XORの生成可能性を基底で表す。多次元の線形変換は軸別に分離して計算する。行列式による数え上げは別の単元で扱う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 行列式による全域木・非交差pathの計数は行列式計数の単元で扱う。通常の多項式畳み込み・生成関数と、幾何の面積行列式も対象外とする。

## 下位単元

- [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/) — 青色
- [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/) — 青色
- [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)
- [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC223 H 公式解説](https://atcoder.jp/contests/abc223/editorial/2784)
- [ABC223 H 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-linear-algebra-xor`
