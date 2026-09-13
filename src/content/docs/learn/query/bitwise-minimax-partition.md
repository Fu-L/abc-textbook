---
title: "上位bitの支配関係によるXOR minimax"
description: "上位bitの支配関係によるXOR minimaxの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 134
---

# 上位bitの支配関係によるXOR minimax

## 概要

### 上位bitの支配関係によるXOR minimax

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC281 F 公式解説](https://atcoder.jp/contests/abc281/editorial/5367)
- [ABC281 F 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-bitwise-minimax-partition`
