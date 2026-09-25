---
title: "単調境界を証明して探索する"
description: "「単調境界を証明して探索する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 14
---

# 単調境界を証明して探索する

習得対象の目安: **緑色（800–1199）**。二分探索の実装に加え、判定の単調性と境界の意味を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第2単元。技能の説明を学んでから問題一覧へ進んでください。

前: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/) ／ 次: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)

## 概要

### 単調境界探索

可否または値の単調性を証明し、最初・最後の成立点を探す。

### 習得する技能

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

### このUnitでは扱わないもの

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 問題一覧

1. [ABC270 E「Apple Baskets on Circle」](https://atcoder.jp/contests/abc270/tasks/abc270_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。
2. [ABC381 E「11/22 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。
3. [ABC395 F「Smooth Occlusion」](https://atcoder.jp/contests/abc395/tasks/abc395_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。
4. [ABC292 F「Regular Triangle Inside a Rectangle」](https://atcoder.jp/contests/abc292/tasks/abc292_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。
5. [ABC373 E「How to Win the Election」](https://atcoder.jp/contests/abc373/tasks/abc373_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。
6. [ABC303 F「Damage over Time」](https://atcoder.jp/contests/abc303/tasks/abc303_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC295 F「substr = S」](https://atcoder.jp/contests/abc295/tasks/abc295_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC374 E「Sensor Optimization Dilemma 2」](https://atcoder.jp/contests/abc374/tasks/abc374_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC388 E「Simultaneous Kagamimochi」](https://atcoder.jp/contests/abc388/tasks/abc388_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC402 F「Path to Integer」](https://atcoder.jp/contests/abc402/tasks/abc402_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-monotone-search`
