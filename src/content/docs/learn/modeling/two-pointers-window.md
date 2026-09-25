---
title: "尺取り法・sliding windowで連続区間を走査する"
description: "「尺取り法・sliding windowで連続区間を走査する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 15
---

# 尺取り法・sliding windowで連続区間を走査する

習得対象の目安: **緑色（800–1199）**。窓の条件とpointerが戻らない理由を定め、全体の走査回数を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第4単元。技能の説明を学んでから問題一覧へ進んでください。

前: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/) ／ 次: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)

## 概要

### 尺取り法・sliding window

一列の連続窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進める。

### 習得する技能

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

### このUnitでは扱わないもの

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 問題一覧

1. [ABC294 E「2xN Grid」](https://atcoder.jp/contests/abc294/tasks/abc294_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。
2. [ABC260 E「At Least One」](https://atcoder.jp/contests/abc260/tasks/abc260_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。
3. [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
4. [ABC337 F「Usual Color Ball Problems」](https://atcoder.jp/contests/abc337/tasks/abc337_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC250 F 公式解説](https://atcoder.jp/contests/abc250/editorial/3928)
- [ABC250 F 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC258 E 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 E 公式解説](https://atcoder.jp/contests/abc258/editorial/4215)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-two-pointers-window`
