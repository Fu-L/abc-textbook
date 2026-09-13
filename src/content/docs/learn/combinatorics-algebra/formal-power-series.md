---
title: "FPS演算・多点評価・合成を行う"
description: "FPS演算・多点評価・合成を行うの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 189
---

# FPS演算・多点評価・合成を行う

## 概要

### 形式的べき級数の基本演算

定数項条件と次数打切りを確認し、Newton iterationでinverse・log・exp等を畳み込みへ還元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 組合せを生成関数へ符号化する、NTT・FFTで畳み込みと相互相関を求める。

生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expと多点評価・合成を次数制限付きで実装する。

- 積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。

## 下位単元

- [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)
- [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)
- [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g)
2. [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h)
3. [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
4. [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h)
5. [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h)
6. [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC260 H 公式解説](https://atcoder.jp/contests/abc260/editorial/4434)
- [ABC260 H 公式問題文](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC289 H 公式解説](https://atcoder.jp/contests/abc289/editorial/5712)
- [ABC289 H 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-formal-power-series`
