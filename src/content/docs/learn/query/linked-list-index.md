---
title: "要素索引と連結リストで局所linkを更新する"
description: "「要素索引と連結リストで局所linkを更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 29
---

# 要素索引と連結リストで局所linkを更新する

習得対象の目安: **茶色（400–799）**。配列や辞書で要素を索引化し、挿入・削除で変わる前後関係だけを更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 索引付き連結リスト

要素IDから前後linkへ直接到達し、挿入・削除で影響する局所的なlinkだけを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

配列やmapの索引を使い、順序全体を走査せず前後linkだけを更新して列を保つ。

### このUnitでは扱わないもの

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 問題一覧

1. [ABC344 E「Insert or Erase」](https://atcoder.jp/contests/abc344/tasks/abc344_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f)

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC344 E 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_e)
- [ABC344 E 公式解説](https://atcoder.jp/contests/abc344/editorial/9487)
- [ABC421 F 公式解説](https://atcoder.jp/contests/abc421/editorial/13787)
- [ABC421 F 公式問題文](https://atcoder.jp/contests/abc421/tasks/abc421_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-linked-list-index`
