---
title: "幾何・凸最適化"
description: "「幾何・凸最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 215
---

# 幾何・凸最適化

導入対象の目安: **水色（1200–1599）**。座標と向きによる判定から、凸な境界・関数の最適化へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

位置関係と凸性から、調べる候補を絞る。まず座標・向き・円環順序の判定を揃え、凸包と半平面の共通部分を扱う。直線包絡を境に、幾何的な境界から関数の最適化へ視点を移す。凸最適化のまとまりで限界費用、傾き、順序制約、罰則係数、Monge性を比較し、比率目的の判定問題への変換へ進む。DP・データ構造・flowで得た表現を組み合わせる章として読む。

### 幾何・凸最適化への変換

配置・距離・目的関数を幾何predicateや凸構造へ変換する。

### 習得する技能

- 配置・距離・目的関数を幾何predicateや凸構造へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

orientationなどの幾何predicateから凸境界・傾き・dual penaltyへ進み、候補を構造的に削減する。

### このUnitでは扱わないもの

- なし

## 章の構成

- [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/) — 水色
  - [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/) — 青色
- [凸境界・半平面制約を扱う](/learn/geometry-optimization/convex-geometry/) — 青色（導入）
  - [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/) — 青色
  - [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/) — 黄色
- [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/) — 黄色
- [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/) — 青色（導入）
  - [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/) — 青色
  - [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) — 青色
  - [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/) — 橙色
  - [slope trick](/learn/geometry-optimization/slope-trick/) — 黄色
  - [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/) — 橙色
  - [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/) — 橙色
- [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。既習技能: 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-geometry-optimization`
