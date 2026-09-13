---
title: "対称性・深さ・label区間で巨大な完全二分木を数える"
description: "対称性・深さ・label区間で巨大な完全二分木を数えるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 84
---

# 対称性・深さ・label区間で巨大な完全二分木を数える

## 概要

### 暗黙・対称な完全二分木の深さ算術

巨大な完全二分木を展開せず、同じ深さの対称性と2冪で集約するか、heap番号の祖先移動と深さdの子孫label区間を使って数える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

指数個の頂点を持つ完全二分木を展開せず、深さごとの対称性と2冪で集約するか、heap番号の祖先移動と深さ別子孫label区間で数える。

- 子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC321 E「Complete Binary Tree」](https://atcoder.jp/contests/abc321/tasks/abc321_e)
2. [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e)
3. [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC220 E 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 E 公式解説](https://atcoder.jp/contests/abc220/editorial/2679)
- [ABC321 E 公式問題文](https://atcoder.jp/contests/abc321/tasks/abc321_e)
- [ABC321 E 公式解説](https://atcoder.jp/contests/abc321/editorial/7267)
- [ABC424 E 公式問題文](https://atcoder.jp/contests/abc424/tasks/abc424_e)
- [ABC424 E 公式解説](https://atcoder.jp/contests/abc424/editorial/13858)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-implicit-binary-tree`
