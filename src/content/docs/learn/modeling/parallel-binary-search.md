---
title: "parallel binary search・多数境界の判定共有"
description: "「parallel binary search・多数境界の判定共有」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 19
---

# parallel binary search・多数境界の判定共有

習得対象の目安: **青色（1600–1999）**。offline処理と二分探索を組み合わせ、複数queryで判定器の走査を共有する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第117単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) ／ 次: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)

## 概要

### parallel binary search・多数境界の判定共有

多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。

### 習得する技能

- 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。

### このUnitでは扱わないもの

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
2. [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC394 G 公式解説](https://atcoder.jp/contests/abc394/editorial/12282)
- [ABC394 G 公式問題文](https://atcoder.jp/contests/abc394/tasks/abc394_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-parallel-binary-search`
