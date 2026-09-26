---
title: "parallel binary search・多数境界の判定共有"
description: "「parallel binary search・多数境界の判定共有」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 18
---

# parallel binary search・多数境界の判定共有

習得対象の目安: **青色（1600–1999）**。offline処理と二分探索を組み合わせ、複数queryで判定器の走査を共有する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### parallel binary search・多数境界の判定共有

多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。

### 習得する技能

- 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

このUnitを直接前提とする単元: なし。

単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。

### このUnitでは扱わないもの

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)（各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)（各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC394 G 公式解説](https://atcoder.jp/contests/abc394/editorial/12282)
- [ABC394 G 公式問題文](https://atcoder.jp/contests/abc394/tasks/abc394_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-parallel-binary-search`
