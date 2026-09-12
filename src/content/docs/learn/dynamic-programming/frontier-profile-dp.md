---
title: "frontier/profile DP・境界状態圧縮"
description: "frontier/profile DP・境界状態圧縮の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 141
---

# frontier/profile DP・境界状態圧縮

## 概要

### frontier/profile DP・境界状態圧縮

走査済み領域と未走査領域の境界だけに未来へ影響する色・接続partitionを正規化して保持し、幅指数で遷移する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

DPの最小十分状態で得た考え方と実装を再利用し、frontier/profile DP・境界状態圧縮の発動条件・正当化・境界を重複なく学ぶ。

- frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC248 F「Keep Connect」](https://atcoder.jp/contests/abc248/tasks/abc248_f)
2. [ABC296 Ex「Unite」](https://atcoder.jp/contests/abc296/tasks/abc296_h)
3. [ABC379 G「Count Grid 3-coloring」](https://atcoder.jp/contests/abc379/tasks/abc379_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC248 F 公式解説](https://atcoder.jp/contests/abc248/editorial/3794)
- [ABC248 F 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_f)
- [ABC296 H 公式解説](https://atcoder.jp/contests/abc296/editorial/6119)
- [ABC296 H 公式問題文](https://atcoder.jp/contests/abc296/tasks/abc296_h)
- [ABC379 G 公式解説](https://atcoder.jp/contests/abc379/editorial/11331)
- [ABC379 G 公式問題文](https://atcoder.jp/contests/abc379/tasks/abc379_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-frontier-profile-dp`
