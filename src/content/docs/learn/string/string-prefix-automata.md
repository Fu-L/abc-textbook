---
title: "接頭辞の一致状態とオートマトン"
description: "接頭辞の一致状態とオートマトンの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 30
---

# 接頭辞の一致状態とオートマトン

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

接頭辞と接尾辞の一致長を状態化し、失敗時の遷移を再利用して照合を線形化する。

- 接尾辞・LCPの索引、文字列hash、回文半径。

## 下位単元

- [Z algorithmによるprefix matching](/learn/string/z-algorithm/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-string-prefix-automata`
