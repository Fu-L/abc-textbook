---
title: "cycle space・fundamental cycle basis"
description: "「cycle space・fundamental cycle basis」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 111
---

# cycle space・fundamental cycle basis

習得対象の目安: **青色（1600–1999）**。非木辺と基本cycleを対応させ、偶数次数の辺集合をF₂上の基底で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### cycle space・fundamental cycle basis

無向graphで全頂点が偶数次数となる辺集合をF_2上のcycle space C(G)として扱い、連結成分数C、spanning forest F、各non-tree edge eが作る唯一のcycleからfundamental cycle basisとdim C(G)=M-N+Cを導く。連結graphではC=1なのでM-N+1となる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導き、path族への単射へ接続する。

### このUnitでは扱わないもの

- ord/lowを用いた橋・関節点の検出、および偶数次数辺集合のcycle-space構造を使わない単なるcycle検出。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-cycle-space-basis`
