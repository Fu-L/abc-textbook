---
title: "尺取り法・sliding windowで連続区間を走査する"
description: "「尺取り法・sliding windowで連続区間を走査する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 10
---

# 尺取り法・sliding windowで連続区間を走査する

習得対象の目安: **緑色（800–1199）**。窓の条件とpointerが戻らない理由を定め、全体の走査回数を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 尺取り法・sliding window

一列の連続窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進める。

### 習得する技能

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

## 考え方

左端を進めた後、右端を戻さずに最長の合法区間を追える条件を探す。区間を広げると条件が一方向に悪化し、左端を消すと回復するなら、二つの端点の総移動を抑えられる。


合法条件が部分区間へ縮めても保たれる場合、半開窓[L,R)を空から始める。各LでR<Nかつa_Rを追加しても合法な間だけaddしてRを進め、現在窓を評価する。非空ならa_Lをremoveして次のLへ進む。一要素すら合法でない場合はR=Lのまま評価し、次の空窓へRを合わせる。前のLで失敗したRより左へ戻る必要はなく、Lを一つ消した後に拡張を再開できる。各端点の一方向移動が線形性を与える。

二列のRLE blockの照合では、現在blockの残長p,qからmin(p,q)だけ処理する。値が等しければその長さを答えへ加え、両残長から引き、0になった側のblockだけ次へ進む。各回で少なくとも一blockが終わるので、総仕事量は両列のrun数の和で抑えられる。

## 成立条件と計算量

端点はそれぞれ高々N回進むため、O(1)更新ならO(N)。負数を含む和の上限など、単調性が壊れる条件には使えない。空区間、右端を含むか、削除後の集計値を固定する。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

### このUnitでは扱わないもの

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 問題一覧

- [ABC294 E「2xN Grid」](https://atcoder.jp/contests/abc294/tasks/abc294_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC260 E「At Least One」](https://atcoder.jp/contests/abc260/tasks/abc260_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC337 F「Usual Color Ball Problems」](https://atcoder.jp/contests/abc337/tasks/abc337_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC250 F 公式解説](https://atcoder.jp/contests/abc250/editorial/3928)
- [ABC250 F 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC258 E 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 E 公式解説](https://atcoder.jp/contests/abc258/editorial/4215)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-two-pointers-window`
