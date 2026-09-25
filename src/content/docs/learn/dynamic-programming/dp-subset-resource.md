---
title: "集合・資源軸のDP"
description: "「集合・資源軸のDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 68
---

# 集合・資源軸のDP

習得対象の目安: **緑色（800–1199）**。個数・容量を軸とするナップサック型DPを実装し、更新方向を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第39単元。技能の説明を学んでから問題一覧へ進んでください。

前: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/) ／ 次: [event順にactive集合を更新する](/learn/modeling/event-sweep/)

## 概要

### 資源軸knapsack DP

容量・時間・個数などの有界資源を軸に選択の価値を更新する。

### 習得する技能

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

最小十分状態を設計できるようになった後、集合bitmaskや容量を軸にした遷移と更新順へ進む。

### このUnitでは扱わないもの

- 入力順や区間端点だけを状態にし、集合・容量軸を持たないDP。

## 下位単元

- [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/) — 橙色
- [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/) — 水色

## 問題一覧

1. [ABC410 E「Battles in a Row」](https://atcoder.jp/contests/abc410/tasks/abc410_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
2. [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
3. [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
4. [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
5. [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
6. [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
7. [ABC364 E「Maximum Glutton」](https://atcoder.jp/contests/abc364/tasks/abc364_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
8. [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
9. [ABC441 F「Must Buy」](https://atcoder.jp/contests/abc441/tasks/abc441_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
10. [ABC275 F「Erase Subarrays」](https://atcoder.jp/contests/abc275/tasks/abc275_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
11. [ABC321 F「#(subset sum = K) with Add and Erase」](https://atcoder.jp/contests/abc321/tasks/abc321_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
12. [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
13. [ABC383 F「Diversity」](https://atcoder.jp/contests/abc383/tasks/abc383_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
14. [ABC325 F「Sensor Optimization Dilemma」](https://atcoder.jp/contests/abc325/tasks/abc325_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
15. [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
16. [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
17. [ABC288 E「Wish List」](https://atcoder.jp/contests/abc288/tasks/abc288_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
18. [ABC320 F「Fuel Round Trip」](https://atcoder.jp/contests/abc320/tasks/abc320_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
19. [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
20. [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
21. [ABC269 G「Reversible Cards 2」](https://atcoder.jp/contests/abc269/tasks/abc269_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。
22. [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 BFSと部分集合DPを既習として、移動の全履歴を重要地点間の距離へ圧縮する。dp[S][v]から未訪問の代表地点へ進み、最後に出口への距離を加えて時間制約を判定する。通過した菓子を全て状態に記録しなくても最適値を失わない理由も確かめる。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。 Floyd–Warshallと部分集合DPを既習として、最短路閉包上の訪問順DPへ変換する。maskは代表として訪問順へ追加した頂点集合であり、距離前計算の途中で通る頂点を禁止しない。任意のwalkから初訪問順を取り出す方向と、DP解をwalkへ展開する方向で同値性を示す。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC382 E「Expansion Packs」](https://atcoder.jp/contests/abc382/tasks/abc382_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 資源軸の上限と更新順を選び、選択の重複を避けられる。

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC216 F 公式解説](https://atcoder.jp/contests/abc216/editorial/2560)
- [ABC216 F 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-subset-resource`
