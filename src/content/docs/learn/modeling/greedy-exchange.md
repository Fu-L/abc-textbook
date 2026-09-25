---
title: "交換論から選択順を導く"
description: "「交換論から選択順を導く」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 9
---

# 交換論から選択順を導く

習得対象の目安: **水色（1200–1599）**。選択の直感を交換論法や支配関係で裏付け、反例のある貪欲法を見分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第12単元。技能の説明を学んでから問題一覧へ進んでください。

前: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/) ／ 次: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)

## 概要

### 貪欲法と交換論

局所選択の交換または候補の支配関係から、調べる順序・残す候補・定数個のcaseを確定する。

### 習得する技能

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

### このUnitでは扱わないもの

- 対称操作による状態の正規化。

## 問題一覧

1. [ABC388 E「Simultaneous Kagamimochi」](https://atcoder.jp/contests/abc388/tasks/abc388_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
2. [ABC257 E「Addition and Multiplication 2」](https://atcoder.jp/contests/abc257/tasks/abc257_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
3. [ABC385 E「Snowflake Tree」](https://atcoder.jp/contests/abc385/tasks/abc385_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
4. [ABC404 E「Bowls and Beans」](https://atcoder.jp/contests/abc404/tasks/abc404_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
5. [ABC374 E「Sensor Optimization Dilemma 2」](https://atcoder.jp/contests/abc374/tasks/abc374_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
6. [ABC298 F「Rook Score」](https://atcoder.jp/contests/abc298/tasks/abc298_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
7. [ABC312 F「Cans and Openers」](https://atcoder.jp/contests/abc312/tasks/abc312_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
8. [ABC457 E「Crossing Table Cloth」](https://atcoder.jp/contests/abc457/tasks/abc457_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
9. [ABC268 F「Best Concatenation」](https://atcoder.jp/contests/abc268/tasks/abc268_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
10. [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
11. [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
12. [ABC226 G「The baggage」](https://atcoder.jp/contests/abc226/tasks/abc226_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。
13. [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)。既習技能: 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h) — 主題: [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 総数順の最適方策を証明し、自己loopを移項する。dp_i=(1+Σ_{j>i}A_j dp_j/S)/(1−Σ_{j<i}A_j/S)。prefix Aと降順の重み付きsuffix和で、一状態の全色走査を定数時間へ落とす。
- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。
- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 N=2を別扱いし、元の木の葉に重み1、他に0を置いて一点だけ均衡分離点を選ぶ。各成分の葉数が全葉数の半分以下になることを使い、残数最大の異なるgroupへ色を配る。削除後に生じた葉を数え直したり、各成分を再帰的に重心分解したりしない。
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 根拠

- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC225 E 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_e)
- [ABC225 F 公式解説](https://atcoder.jp/contests/abc225/editorial/2833)
- [ABC225 E 公式解説](https://atcoder.jp/contests/abc225/editorial/2853)
- [ABC225 F 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-greedy-exchange`
