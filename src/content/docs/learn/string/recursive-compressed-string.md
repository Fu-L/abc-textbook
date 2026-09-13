---
title: "圧縮・反復・再帰文字列へ問い合わせる"
description: "圧縮・反復・再帰文字列へ問い合わせるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 87
---

# 圧縮・反復・再帰文字列へ問い合わせる

## 概要

### 再帰・圧縮・入れ子文字列の走査

明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。

- 明示された文字列への接尾辞索引の構築。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC450 E「Fibonacci String」](https://atcoder.jp/contests/abc450/tasks/abc450_e)
2. [ABC350 F「Transpose」](https://atcoder.jp/contests/abc350/tasks/abc350_f)
3. [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)
4. [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC346 F 公式解説](https://atcoder.jp/contests/abc346/editorial/9644)
- [ABC346 F 公式問題文](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC350 F 公式解説](https://atcoder.jp/contests/abc350/editorial/9820)
- [ABC350 F 公式問題文](https://atcoder.jp/contests/abc350/tasks/abc350_f)
- [ABC417 G 公式解説](https://atcoder.jp/contests/abc417/editorial/13580)
- [ABC417 G 公式問題文](https://atcoder.jp/contests/abc417/tasks/abc417_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-recursive-compressed-string`
