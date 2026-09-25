---
title: "NTT・FFTで畳み込みと相互相関を求める"
description: "「NTT・FFTで畳み込みと相互相関を求める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 202
---

# NTT・FFTで畳み込みと相互相関を求める

習得対象の目安: **黄色（2000–2399）**。係数積和へ還元し、NTT・FFTの法・長さ・次数の条件を理解して利用する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第99単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/) ／ 次: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)

## 概要

### 畳み込み・相互相関

係数積和または反転列とのcorrelationを多項式積へ写し、必要な次数範囲をNTT/FFTで計算する。

ABC291 Gの巡回shiftごとのbitwise ORの総和を考える。観察: a_i,b_iをそのbitが0である指示変数とする。shift sでORが0の個数はR_s=Σ_{i=0}^{N-1}a_{(i+s) mod N}b_i。全shiftを直接計算するとO(N²)。

変換: aを2周並べてu、bを反転してv_j=b_{N-1-j}とする。多項式U(x)V(x)の係数c_tはΣ_{p+q=t}u_pv_q。t=N-1+sならp=i+s,q=N-1-iとなり、c_{N-1+s}=R_sを得る。

出力: 各bitの寄与は2^bit·(N-R_s)。5 bitの寄与をshiftごとに足してから最大化する。bitごとに最適shiftを選ぶことはできない。

計算量と境界: 5回の通常畳み込みでO(N log N)。各係数はN以下なので法998244353で正確に復元できる。N=1とs=N-1で反転位置と参照係数を手計算する。

ABC265 Exは通常の畳み込みだけの導入には用いない。Conwayの数ゲーム、Grundy数、XOR畳み込みを学んだ後に、整数和とXORという異なる合成則を同時に保持する複合問題として取り組む。

### 習得する技能

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。

### このUnitでは扱わないもの

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 下位単元

- [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/) — 橙色
- [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/) — 橙色

## 問題一覧

1. [ABC291 G「OR Sum」](https://atcoder.jp/contests/abc291/tasks/abc291_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。
2. [ABC307 Ex「Marquee」](https://atcoder.jp/contests/abc307/tasks/abc307_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。
3. [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h) — 主題: [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 / Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h) — 主題: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h) — 主題: [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC309 Ex「Simple Path Counting Problem」](https://atcoder.jp/contests/abc309/tasks/abc309_h) — 主題: [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC392 G「Fine Triplets」](https://atcoder.jp/contests/abc392/tasks/abc392_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
- [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 位取りで巨大添字の係数抽出を繰り返す。各段の全組合せを多項式分布との畳み込みへまとめ、その後同じ商へ移る剰余blockを区間集約する。畳み込みと区間集約の二つの高速化を区別する。
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-polynomial-convolution`
