---
title: "半環行列・min-plus/max-min遷移"
description: "半環行列・min-plus/max-min遷移の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 140
---

# 半環行列・min-plus/max-min遷移

## 概要

### 半環行列・min-plus/max-min遷移

遷移の結合と候補選択を半環の積・和として行列化し、結合則を使って固定長walkを二分累乗または区間積で処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 固定線形遷移を巨大回数進める。

線形遷移・行列累乗で得た考え方と実装を再利用し、半環行列・min-plus/max-min遷移の発動条件・正当化・境界を重複なく学ぶ。

- 半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC236 G「Good Vertices」](https://atcoder.jp/contests/abc236/tasks/abc236_g)
2. [ABC445 F「Exactly K Steps 2」](https://atcoder.jp/contests/abc445/tasks/abc445_f)
3. [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC236 G 公式解説](https://atcoder.jp/contests/abc236/editorial/3286)
- [ABC236 G 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_g)
- [ABC429 F 公式解説](https://atcoder.jp/contests/abc429/editorial/14274)
- [ABC429 F 公式問題文](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC445 F 公式解説](https://atcoder.jp/contests/abc445/editorial/15907)
- [ABC445 F 公式問題文](https://atcoder.jp/contests/abc445/tasks/abc445_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-semiring-matrix-exponentiation`
