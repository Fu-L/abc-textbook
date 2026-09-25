---
title: "組合せ・多項式・線形代数"
description: "「組合せ・多項式・線形代数」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 182
---

# 組合せ・多項式・線形代数

導入対象の目安: **水色（1200–1599）**。対象を係数・和・積へ翻訳し、数え方と高速な評価を分ける入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

数えたい対象の分解と、それを計算する代数的な表現を結び付ける。係数・全単射・対称性による計数から包除と反転へ進み、線形写像・行列・基底を揃える。母関数で式を立て、畳み込みとFPSで評価し、高度な係数抽出へ広げる。最後に行列式によるグラフ計数と独立性の構造を扱う。式を導く段階と式を高速に計算する段階を分けて説明できることを目指す。

### 組合せ・多項式・線形代数への変換

数え上げや遷移を係数列・多項式・線形写像へ変換する。

### 習得する技能

- 数え上げや遷移を係数列・多項式・線形写像へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

数え上げを全単射・係数列・線形写像へ変換し、高速変換と構造定理へ接続する。

### このUnitでは扱わないもの

- なし

## 章の構成

- [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/) — 水色
- [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/) — 青色
- [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/) — 黄色
- [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/) — 黄色
- [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/) — 黄色
- [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/) — 赤色
- [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/) — 黄色
- [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/) — 水色
  - [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/) — 青色
  - [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/) — 青色
    - [subset convolution](/learn/combinatorics-algebra/subset-convolution/) — 橙色
- [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/) — 水色
- [線形方程式・基底・分離可能変換へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/) — 青色（導入）
  - [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/) — 青色
  - [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/) — 青色
  - [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/) — 黄色
- [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/) — 青色
- [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/) — 黄色
- [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/) — 黄色
- [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/) — 黄色
  - [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/) — 橙色
  - [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/) — 橙色
- [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/) — 橙色
  - [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) — 橙色
  - [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/) — 橙色
  - [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/) — 赤色
- [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/) — 橙色
- [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/) — 黄色
- [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/) — 橙色
- [Matroidの独立性・greedy・線形交差](/learn/combinatorics-algebra/matroid-theory/) — 黄色（導入）
  - [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/) — 黄色
  - [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/) — 赤色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。 F_A(i)=Σ_{k≤A}C(i,k)を毎回足し直さず、Pascalの式からF_A(i+1)=2F_A(i)−C(i,A)とする。三色分を同時更新して包除の各項を定数時間で計算する。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h) — 主題: [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 / Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC453 E「Team Division」](https://atcoder.jp/contests/abc453/tasks/abc453_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-combinatorics-algebra`
