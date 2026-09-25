---
title: "成立証明から構成解を復元する"
description: "「成立証明から構成解を復元する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 12
---

# 成立証明から構成解を復元する

習得対象の目安: **水色（1200–1599）**。存在判定の証明に操作列や親情報を対応させ、具体的な解へ戻す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第28単元。技能の説明を学んでから問題一覧へ進んでください。

前: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/) ／ 次: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)

## 概要

### 構成解・witness復元

成立条件の証明が与える局所操作やparentを記録し、実際の解を復元する。

### 習得する技能

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

### このUnitでは扱わないもの

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 問題一覧

1. [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
2. [ABC299 E「Nearest Black Vertex」](https://atcoder.jp/contests/abc299/tasks/abc299_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
3. [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
4. [ABC251 F「Two Spanning Trees」](https://atcoder.jp/contests/abc251/tasks/abc251_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
5. [ABC448 F「Authentic Traveling Salesman Problem」](https://atcoder.jp/contests/abc448/tasks/abc448_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
6. [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。
7. [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
8. [ABC255 F「Pre-order and In-order」](https://atcoder.jp/contests/abc255/tasks/abc255_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
9. [ABC363 F「Palindromic Expression」](https://atcoder.jp/contests/abc363/tasks/abc363_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
10. [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
11. [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
12. [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
13. [ABC289 F「Teleporter Takahashi」](https://atcoder.jp/contests/abc289/tasks/abc289_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
14. [ABC358 F「Easiest Maze」](https://atcoder.jp/contests/abc358/tasks/abc358_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
15. [ABC244 G「Construct Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_g) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。
16. [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
17. [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
18. [ABC232 H「King's Tour」](https://atcoder.jp/contests/abc232/tasks/abc232_h) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f) — 主題: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 二部彩色と整数最大流を既習とする。頂点・色組の使用回数A_{v,k}を容量に置き、流量N−1から各木辺の削除時の色対を固定する。一対一matchingではない。次に、実行可能な辺がないと仮定して葉から根へ条件を伝播させると矛盾することを示す。一辺削除した後も残りの回数制約が保たれるため、この存在証明を帰納的に繰り返して操作列を復元できる。静的な割当の可否と時系列の実行可能性を別々に証明する。
- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e) — 主題: [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 N=2を別扱いし、元の木の葉に重み1、他に0を置いて一点だけ均衡分離点を選ぶ。各成分の葉数が全葉数の半分以下になることを使い、残数最大の異なるgroupへ色を配る。削除後に生じた葉を数え直したり、各成分を再帰的に重心分解したりしない。

## 根拠

- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-constructive-witness`
