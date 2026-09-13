---
title: "重心を分離点として木を再帰分解する"
description: "重心を分離点として木を再帰分解するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 96
---

# 重心を分離点として木を再帰分解する

## 概要

### 重心separatorによる木の再帰分解

各成分のサイズを半分以下にする重心をseparatorとし、除去後の成分を再帰的に分解する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

部分木サイズから重心を選び、除去後の各成分が半分以下になることを使って再帰の深さを抑える。

- LCA・HLDによる固定木上パスの区間分解。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC291 Ex「Balanced Tree」](https://atcoder.jp/contests/abc291/tasks/abc291_h)
2. [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g)
3. [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC291 H 公式解説](https://atcoder.jp/contests/abc291/editorial/5840)
- [ABC291 H 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_h)
- [ABC359 G 公式解説](https://atcoder.jp/contests/abc359/editorial/10255)
- [ABC359 G 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC453 F 公式解説](https://atcoder.jp/contests/abc453/editorial/18542)
- [ABC453 F 公式問題文](https://atcoder.jp/contests/abc453/tasks/abc453_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-tree-balanced-separators`
