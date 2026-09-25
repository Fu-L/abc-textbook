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

## 標準履修順

第139単元。技能の説明を学んでから問題一覧へ進んでください。

前: [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/) ／ 次: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)

## 概要

### 上位bitの支配関係によるXOR minimax

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。

### 習得する技能

- 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f) — 主題: [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC281 F 公式解説](https://atcoder.jp/contests/abc281/editorial/5367)
- [ABC281 F 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bitwise-minimax-partition`
