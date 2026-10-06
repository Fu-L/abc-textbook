---
title: "円環順序・chord交差"
description: "「円環順序・chord交差」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 218
---

# 円環順序・chord交差

習得対象の目安: **青色（1600–1999）**。円環を切って端点順を線形化し、交互配置と包含構造で交差を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 円環順序・chord交差

円周上の端点順をcutで線形化し、二chordの端点交互配置またはlaminar括弧構造として交差を判定・数え上げる。

### 習得する技能

- 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

## 考え方

円周上の二本の弦は、四つの端点が交互に並ぶとき内部で交差する。座標の交点計算を円環の掲載順へ変え、一方の弦の端点間に他方の端点がちょうど一つあるかを数える。


切断後の弦の端点をl<rとする。二弦が交差するのはl1<l2<r1<r2またはl2<l1<r2<r1の厳密な交互配置。左端の位置順に走査し、過去の弦の右端をFenwickの頻度として追加しておくと、現在(l,r)と交差する過去弦は右端が(l,r)にあるものだけである。prefix(r未満)−prefix(l以下)を加えれば一対を後の左端で一回だけ数える。

左端が同じ弦同士は交差に数えないので、同じlのqueryを全て先に行い、その後まとめて右端をinsertする。右端の等値は開区間queryが除く。共有端点を内部交差から除くときに必要な境界処理であり、円周の切断位置を変えても交互性と最終個数は変わらない。

## 成立条件と計算量

端点のsortはO(N log N)。走査とFenwick Treeで交差対を数えるなら更新・queryはO(log N)。共有端点を交差に含むか、同じ位置のeventの処理順を定める。一直線上の区間重なりとは条件が違う。

概念上の親: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

このUnitを直接前提とする単元: なし。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、円環順序・chord交差の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC338 E「Chords」](https://atcoder.jp/contests/abc338/tasks/abc338_e) — 主題: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)（laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。

## 根拠

- [ABC263 H 公式解説](https://atcoder.jp/contests/abc263/editorial/4547)
- [ABC263 H 公式問題文](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC338 E 公式問題文](https://atcoder.jp/contests/abc338/tasks/abc338_e)
- [ABC338 E 公式解説](https://atcoder.jp/contests/abc338/editorial/9172)
- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-cyclic-order-crossing`
