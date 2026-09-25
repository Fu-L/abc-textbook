---
title: "heap・ordered setで全候補の極値を保つ"
description: "「heap・ordered setで全候補の極値を保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 30
---

# heap・ordered setで全候補の極値を保つ

導入対象の目安: **緑色（800–1199）**。極値の取得と近傍の検索を区別し、heapとordered setを使い分ける入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

比較可能な候補全体から極値・順位・隣接を繰り返し取り出すため、動的な順序を保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 支配関係で一度捨てた候補を戻さない単調stack・queue。

## 下位単元

- [priority queue・best-first列挙](/learn/query/priority-queue-best-first/) — 緑色
- [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/) — 緑色
- [ordered interval partition・ODT](/learn/query/ordered-interval-partition/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

## 根拠

- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-ordered-set-heap`
