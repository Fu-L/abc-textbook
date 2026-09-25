---
title: "結合的要約と列・区間の合成"
description: "「結合的要約と列・区間の合成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 38
---

# 結合的要約と列・区間の合成

導入対象の目安: **水色（1200–1599）**。結合則・単位元・順序を区間集約の共通言語として使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

結合則を持つ要約という共通像から、Segment Tree・Sparse Table・SWAG・有限関数合成が使う分解方法の違いを比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- Fenwick Treeで保つ重み付き接頭辞統計。

## 下位単元

- [区間monoid要約](/learn/query/range-monoid-aggregation/) — 水色
- [有限関数・作用の合成](/learn/query/finite-function-composition/) — 水色
- [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/) — 水色
- [SWAG・two-stack queue aggregation](/learn/query/swag/) — 青色
- [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/) — 青色
- [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/) — 青色
- [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f) — 主題: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 max_j(dp[j]−C|j−t|)+pを、j≤tのmax(dp[j]+Cj)−Ct+pとj≥tのmax(dp[j]−Cj)+Ct+pへ分ける。二本の区間最大で各イベントO(log N)。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
- [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 根拠

- [ABC223 F 公式解説](https://atcoder.jp/contests/abc223/editorial/2774)
- [ABC223 F 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_f)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-monoid-segment-tree`
