---
title: "回文半径と左右対称区間を特定する"
description: "「回文半径と左右対称区間を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 46
---

# 回文半径と左右対称区間を特定する

## 概要

### 回文半径・Manacher

各中心の最大回文半径を左右対称性と既知区間の再利用で線形に求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。

### このUnitでは扱わないもの

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC398 F「ABCBA」](https://atcoder.jp/contests/abc398/tasks/abc398_f)
2. [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC349 G 公式解説](https://atcoder.jp/contests/abc349/editorial/9782)
- [ABC349 G 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC398 F 公式解説](https://atcoder.jp/contests/abc398/editorial/12501)
- [ABC398 F 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-palindrome-radius`
