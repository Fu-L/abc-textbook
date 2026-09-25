---
title: "動的計画法"
description: "「動的計画法」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 58
---

# 動的計画法

導入対象の目安: **緑色（800–1199）**。状態・基底・遷移・計算順を明示する習慣を身につける入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

未来に必要な情報と依存関係を定め、同じ状態へ到達する履歴をまとめる。グリッド・列・区間・集合の基本状態を比較し、全履歴を持つと大きすぎる場合の発展として境界圧縮へ進む。さらに桁・automatonという状態の形を比較する。確率では何を平均し、ゲームでは誰が選ぶのかを明示する。最後に遷移の共通部分や線形性を取り出し、後の代数・凸最適化の章で使う式へつなぐ。標準履修順ではautomatonの構成やSteiner tree DPの距離計算を先に学び、複合問題へ進む。

### DP状態と遷移

未来に必要な情報を状態とし、遷移と基底を設計する。

### 習得する技能

- 未来に十分な状態と、状態間の完全な遷移を説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

状態と遷移の設計を共通言語にし、集合・列・確率・ゲーム・遷移高速化へ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 章の構成

- [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/) — 緑色
- [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/) — 緑色
- [列・区間・分割のDP](/learn/dynamic-programming/dp-sequence-interval/) — 緑色（導入）
  - [列・subsequence DP](/learn/dynamic-programming/dp-sequence/) — 緑色
  - [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/) — 水色
  - [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/) — 水色
  - [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/) — 水色
  - [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/) — 水色
  - [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/) — 青色
- [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/) — 緑色
  - [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/) — 橙色
  - [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/) — 水色
  - [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/) — 黄色
- [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/) — 橙色
- [接頭辞から更新する有限状態DP](/learn/dynamic-programming/dp-digit-string/) — 水色（導入）
  - [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/) — 水色
  - [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/) — 青色
- [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/) — 青色
- [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/) — 水色
  - [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/) — 橙色
- [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/) — 水色
- [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/) — 水色
- [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/) — 黄色
- [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/) — 赤色
- [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/) — 青色
- [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。
- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 BFSと部分集合DPを既習として、移動の全履歴を重要地点間の距離へ圧縮する。dp[S][v]から未訪問の代表地点へ進み、最後に出口への距離を加えて時間制約を判定する。通過した菓子を全て状態に記録しなくても最適値を失わない理由も確かめる。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。 Floyd–Warshallと部分集合DPを既習として、最短路閉包上の訪問順DPへ変換する。maskは代表として訪問順へ追加した頂点集合であり、距離前計算の途中で通る頂点を禁止しない。任意のwalkから初訪問順を取り出す方向と、DP解をwalkへ展開する方向で同値性を示す。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 LISの末尾最小値と問い合わせのoffline処理を既習として、右端Rまでだけ更新したtailsから、値X以下で終わる最長長さを二分探索する。位置の制約を走査時刻、値の制約をtailsの境界へ分担させる。
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 位取りで巨大添字の係数抽出を繰り返す。各段の全組合せを多項式分布との畳み込みへまとめ、その後同じ商へ移る剰余blockを区間集約する。畳み込みと区間集約の二つの高速化を区別する。
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。
- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g) — 主題: [potential・weighted DSU](/learn/graph/potential-dsu/)。

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-dynamic-programming`
