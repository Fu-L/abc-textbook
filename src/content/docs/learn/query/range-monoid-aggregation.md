---
title: "区間monoid要約"
description: "「区間monoid要約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 39
---

# 区間monoid要約

習得対象の目安: **水色（1200–1599）**。十分な要約と結合演算を定義し、Segment Treeへ正しく載せる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第69単元。技能の説明を学んでから問題一覧へ進んでください。

前: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/) ／ 次: [区間更新を要約へ作用させる](/learn/query/range-actions/)

## 概要

### 区間monoid要約

queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。

### 習得する技能

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC432 E「Clamp」](https://atcoder.jp/contests/abc432/tasks/abc432_e) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
2. [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
3. [ABC343 F「Second Largest Query」](https://atcoder.jp/contests/abc343/tasks/abc343_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
4. [ABC415 F「Max Combo」](https://atcoder.jp/contests/abc415/tasks/abc415_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
5. [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
6. [ABC223 F「Parenthesis Checking」](https://atcoder.jp/contests/abc223/tasks/abc223_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
7. [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
8. [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f) — 主題: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
9. [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
10. [ABC285 F「Substring of Sorted String」](https://atcoder.jp/contests/abc285/tasks/abc285_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
11. [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。
12. [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
13. [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
14. [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
15. [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
16. [ABC292 Ex「Rating Estimator」](https://atcoder.jp/contests/abc292/tasks/abc292_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
17. [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
18. [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
19. [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
20. [ABC365 F「Takahashi on Grid」](https://atcoder.jp/contests/abc365/tasks/abc365_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。
21. [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。
22. [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
23. [ABC434 G「Keyboard」](https://atcoder.jp/contests/abc434/tasks/abc434_g) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 max_j(dp[j]−C|j−t|)+pを、j≤tのmax(dp[j]+Cj)−Ct+pとj≥tのmax(dp[j]−Cj)+Ct+pへ分ける。二本の区間最大で各イベントO(log N)。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
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
- [ABC246 H 公式解説](https://atcoder.jp/contests/abc246/editorial/3705)
- [ABC246 H 公式問題文](https://atcoder.jp/contests/abc246/tasks/abc246_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-range-monoid-aggregation`
