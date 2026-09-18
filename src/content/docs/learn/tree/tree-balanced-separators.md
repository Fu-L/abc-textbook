---
title: "重心を分離点として木を再帰分解する"
description: "「重心を分離点として木を再帰分解する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 142
---

# 重心を分離点として木を再帰分解する

習得対象の目安: **黄色（2000–2399）**。重心で各成分を半分以下にし、分離点を通る寄与と再帰側の寄与を分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 重心separatorによる木の再帰分解

各成分のサイズを半分以下にする重心をseparatorとし、除去後の成分を再帰的に分解する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

部分木サイズから重心を選び、除去後の各成分が半分以下になることを使って再帰の深さを抑える。

### このUnitでは扱わないもの

- LCA・HLDによる固定木上パスの区間分解。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f)
2. [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g)
3. [ABC291 Ex「Balanced Tree」](https://atcoder.jp/contests/abc291/tasks/abc291_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC291 H 公式解説](https://atcoder.jp/contests/abc291/editorial/5840)
- [ABC291 H 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_h)
- [ABC359 G 公式解説](https://atcoder.jp/contests/abc359/editorial/10255)
- [ABC359 G 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC453 F 公式解説](https://atcoder.jp/contests/abc453/editorial/18542)
- [ABC453 F 公式問題文](https://atcoder.jp/contests/abc453/tasks/abc453_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-tree-balanced-separators`
