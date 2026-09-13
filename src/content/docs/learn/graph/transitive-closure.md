---
title: "推移閉包"
description: "推移閉包の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 50
---

# 推移閉包

## 概要

### 推移閉包

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC292 E「Transitivity」](https://atcoder.jp/contests/abc292/tasks/abc292_e)
2. [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)

## 根拠

- [ABC287 H 公式解説](https://atcoder.jp/contests/abc287/editorial/5635)
- [ABC287 H 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC292 E 公式問題文](https://atcoder.jp/contests/abc292/tasks/abc292_e)
- [ABC292 E 公式解説](https://atcoder.jp/contests/abc292/editorial/5874)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-transitive-closure`
