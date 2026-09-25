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

## 概要

### 資源軸knapsack DP

容量・時間・個数などの有界資源を軸に選択の価値を更新する。

### 習得する技能

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)、[資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)。

最小十分状態を設計できるようになった後、集合bitmaskや容量を軸にした遷移と更新順へ進む。

### このUnitでは扱わないもの

- 入力順や区間端点だけを状態にし、集合・容量軸を持たないDP。

## 下位単元

- [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/) — 橙色
- [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/) — 水色

## 問題一覧

- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。
- [ABC288 E「Wish List」](https://atcoder.jp/contests/abc288/tasks/abc288_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC364 E「Maximum Glutton」](https://atcoder.jp/contests/abc364/tasks/abc364_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC410 E「Battles in a Row」](https://atcoder.jp/contests/abc410/tasks/abc410_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。）。
- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。
- [ABC275 F「Erase Subarrays」](https://atcoder.jp/contests/abc275/tasks/abc275_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC320 F「Fuel Round Trip」](https://atcoder.jp/contests/abc320/tasks/abc320_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC321 F「#(subset sum = K) with Add and Erase」](https://atcoder.jp/contests/abc321/tasks/abc321_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC325 F「Sensor Optimization Dilemma」](https://atcoder.jp/contests/abc325/tasks/abc325_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC383 F「Diversity」](https://atcoder.jp/contests/abc383/tasks/abc383_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC441 F「Must Buy」](https://atcoder.jp/contests/abc441/tasks/abc441_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC269 G「Reversible Cards 2」](https://atcoder.jp/contests/abc269/tasks/abc269_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。）。
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)（P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)（外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC382 E「Expansion Packs」](https://atcoder.jp/contests/abc382/tasks/abc382_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC402 E「Payment Required」](https://atcoder.jp/contests/abc402/tasks/abc402_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC216 F 公式解説](https://atcoder.jp/contests/abc216/editorial/2560)
- [ABC216 F 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-dp-subset-resource`
