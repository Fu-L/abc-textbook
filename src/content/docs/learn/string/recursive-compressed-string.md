---
title: "圧縮・反復・再帰文字列へ問い合わせる"
description: "「圧縮・反復・再帰文字列へ問い合わせる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 159
---

# 圧縮・反復・再帰文字列へ問い合わせる

習得対象の目安: **青色（1600–1999）**。再帰blockの長さと位置を追い、展開せずに問い合わせや作用の合成を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 再帰・圧縮・入れ子文字列の走査

明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。

### このUnitでは扱わないもの

- 明示された文字列への接尾辞索引の構築。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC450 E「Fibonacci String」](https://atcoder.jp/contests/abc450/tasks/abc450_e)
2. [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)
3. [ABC350 F「Transpose」](https://atcoder.jp/contests/abc350/tasks/abc350_f)
4. [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC346 F 公式解説](https://atcoder.jp/contests/abc346/editorial/9644)
- [ABC346 F 公式問題文](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC350 F 公式解説](https://atcoder.jp/contests/abc350/editorial/9820)
- [ABC350 F 公式問題文](https://atcoder.jp/contests/abc350/tasks/abc350_f)
- [ABC417 G 公式解説](https://atcoder.jp/contests/abc417/editorial/13580)
- [ABC417 G 公式問題文](https://atcoder.jp/contests/abc417/tasks/abc417_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-recursive-compressed-string`
