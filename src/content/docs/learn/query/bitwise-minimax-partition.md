---
title: "上位bitの支配関係によるXOR minimax"
description: "「上位bitの支配関係によるXOR minimax」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 55
---

# 上位bitの支配関係によるXOR minimax

習得対象の目安: **青色（1600–1999）**。上位bitが最大値を支配することを使い、二群への再帰とminimaxを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 上位bitの支配関係によるXOR minimax

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC281 F 公式解説](https://atcoder.jp/contests/abc281/editorial/5367)
- [ABC281 F 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-bitwise-minimax-partition`
