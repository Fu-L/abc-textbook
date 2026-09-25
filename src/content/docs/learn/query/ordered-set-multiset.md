---
title: "ordered set・multisetの動的順序管理"
description: "「ordered set・multisetの動的順序管理」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 32
---

# ordered set・multisetの動的順序管理

習得対象の目安: **緑色（800–1199）**。前後要素・重複を管理し、二集合に分けて境界と集計値を保つ基本操作を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### ordered set・multisetの動的順序管理

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。

### 習得する技能

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)。

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC306 E「Best Performances」](https://atcoder.jp/contests/abc306/tasks/abc306_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC330 E「Mex and Update」](https://atcoder.jp/contests/abc330/tasks/abc330_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC308 G「Minimum Xor Pair Query」](https://atcoder.jp/contests/abc308/tasks/abc308_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)（隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC245 E 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC245 E 公式解説](https://atcoder.jp/contests/abc245/editorial/3635)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-ordered-set-multiset`
