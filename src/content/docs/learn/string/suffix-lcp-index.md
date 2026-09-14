---
title: "接尾辞の順序とLCPを索引化する"
description: "「接尾辞の順序とLCPを索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 91
---

# 接尾辞の順序とLCPを索引化する

## 概要

### 接尾辞順序・LCP索引

全接尾辞の辞書順とLCPを索引化し、部分文字列の順序・出現範囲・順位・distinct数を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

全接尾辞の辞書順と隣接LCPを索引化し、部分文字列の出現範囲・順位・個数へ答える。

### このUnitでは扱わないもの

- rolling hashによる一致比較と回文半径。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f)
2. [ABC272 F「Two Strings」](https://atcoder.jp/contests/abc272/tasks/abc272_f)
3. [ABC362 G「Count Substring Query」](https://atcoder.jp/contests/abc362/tasks/abc362_g)
4. [ABC452 G「221 Substring」](https://atcoder.jp/contests/abc452/tasks/abc452_g)
5. [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
6. [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC272 F 公式解説](https://atcoder.jp/contests/abc272/editorial/4980)
- [ABC272 F 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-suffix-lcp-index`
