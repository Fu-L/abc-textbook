---
title: "動的計画法"
description: "「動的計画法」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 59
---

# 動的計画法

導入対象の目安: **緑色（800–1199）**。状態・基底・遷移・計算順を明示する習慣を身につける入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

最小十分状態を定め、グリッド・容量・列・prefix分割・区間・部分集合という基本的な依存構造を比較する。列DPの小節ではLISの支配関係と値域集約を比較する。次に桁上限・automaton・carryによる有限状態化を学び、遷移集約を共通原理として整理して固定線形遷移の累乗へ進む。確率とゲームでは遷移の評価方法を変え、循環局面の後退解析へ広げる。後半は境界圧縮、Steiner木、巨大容量、期待値の状態削減、数ゲームの和を発展として扱う。automatonは文字列章、Steiner木は最短路の単元を先に参照する。

### DP状態と遷移

未来に必要な情報を状態とし、遷移と基底を設計する。

### 習得する技能

- 未来に十分な状態と、状態間の完全な遷移を説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

状態と遷移の設計を共通言語にし、集合・列・確率・ゲーム・遷移高速化へ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 章の構成

節と小節を学習順に並べています。字下げは概念の親子関係、「導入」は関連手法の見取り図を示します。発展的な小節は対象色を目安に後から戻って学べます。

- [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/) — 緑色
- [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/) — 緑色
- [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/) — 緑色
- [列・編集距離・区間合成DP](/learn/dynamic-programming/dp-sequence-interval/) — 緑色（導入）
  - [列・subsequence DP](/learn/dynamic-programming/dp-sequence/) — 緑色
    - [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/) — 水色
    - [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/) — 水色
  - [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/) — 水色
  - [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/) — 水色
  - [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/) — 青色
- [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/) — 水色
- [接頭辞から更新する有限状態DP](/learn/dynamic-programming/dp-digit-string/) — 水色（導入）
  - [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/) — 水色
  - [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/) — 青色
- [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/) — 青色
- [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/) — 青色
- [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/) — 青色
- [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/) — 水色
- [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/) — 水色
- [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/) — 水色
- [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/) — 黄色
- [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/) — 黄色
- [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/) — 橙色
- [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/) — 橙色
- [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/) — 橙色
- [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/) — 赤色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。既習技能: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。）。 F_A(i)=Σ_{k≤A}C(i,k)を毎回足し直さず、Pascalの式からF_A(i+1)=2F_A(i)−C(i,A)とする。三色分を同時更新して包除の各項を定数時間で計算する。
- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。
- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)（全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。） / [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。
- [ABC280 E「Critical Hit」](https://atcoder.jp/contests/abc280/tasks/abc280_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)（P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)（外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)（順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)（正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)（endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。）。既習技能: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 位取りで巨大添字の係数抽出を繰り返す。各段の全組合せを多項式分布との畳み込みへまとめ、その後同じ商へ移る剰余blockを区間集約する。畳み込みと区間集約の二つの高速化を区別する。
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 各値列の辞書順最小添字列だけを数える正準化から、直前位置の開区間L_p<j<R_pを導く。dp[p]=Σ dp[j]をrange sumとpoint addへ写し、O(N²)をO(N log N)へ減らす。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-chapter-dynamic-programming`
