---
title: "Z algorithmによるprefix matching"
description: "Z algorithmによるprefix matchingの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 30
---

# Z algorithmによるprefix matching

## 概要

### Z algorithmによるprefix matching

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC430 E「Shift String」](https://atcoder.jp/contests/abc430/tasks/abc430_e)
2. [ABC284 F「ABCBAC」](https://atcoder.jp/contests/abc284/tasks/abc284_f)
3. [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
4. [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g)

## 根拠

- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC284 F 公式解説](https://atcoder.jp/contests/abc284/editorial/5469)
- [ABC284 F 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_f)
- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-z-algorithm`
