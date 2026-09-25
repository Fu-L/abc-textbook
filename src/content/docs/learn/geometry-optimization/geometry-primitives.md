---
title: "幾何の基本判定と座標変換"
description: "「幾何の基本判定と座標変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 216
---

# 幾何の基本判定と座標変換

習得対象の目安: **水色（1200–1599）**。外積・端点順・座標変換を用い、退化ケースを含む位置関係を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第15単元。技能の説明を学んでから問題一覧へ進んでください。

前: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/) ／ 次: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)

## 概要

### 幾何の基本判定・配置・座標変換

交差・方向・距離・接触条件を、外積、端点順、格子占有または変換後座標の局所判定にする。

### 習得する技能

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

### このUnitでは扱わないもの

- 凸包の境界候補列挙・半平面交差。

## 下位単元

- [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/) — 青色

## 問題一覧

1. [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
2. [ABC442 E「Laser Takahashi」](https://atcoder.jp/contests/abc442/tasks/abc442_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。
3. [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
4. [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
5. [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
6. [ABC426 E「Closest Moment」](https://atcoder.jp/contests/abc426/tasks/abc426_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。
7. [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
8. [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
9. [ABC385 F「Visible Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。
10. [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
11. [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
12. [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
13. [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
14. [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
15. [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC314 Ex「Disk and Segments」](https://atcoder.jp/contests/abc314/tasks/abc314_h) — 主題: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

## 根拠

- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC223 E 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 E 公式解説](https://atcoder.jp/contests/abc223/editorial/2781)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-geometry-primitives`
