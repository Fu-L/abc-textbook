---
title: "回文半径と左右対称区間を特定する"
description: "回文半径と左右対称区間を特定するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 43
---

# 回文半径と左右対称区間を特定する

## 概要

### 回文半径・Manacher

各中心の最大回文半径を左右対称性と既知区間の再利用で線形に求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC398 F「ABCBA」](https://atcoder.jp/contests/abc398/tasks/abc398_f)
2. [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC349 G 公式解説](https://atcoder.jp/contests/abc349/editorial/9782)
- [ABC349 G 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC398 F 公式解説](https://atcoder.jp/contests/abc398/editorial/12501)
- [ABC398 F 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-palindrome-radius`
