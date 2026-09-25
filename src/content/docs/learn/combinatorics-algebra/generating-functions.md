---
title: "組合せを生成関数へ符号化する"
description: "「組合せを生成関数へ符号化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 200
---

# 組合せを生成関数へ符号化する

習得対象の目安: **黄色（2000–2399）**。組合せ構造の和・積を係数列の演算へ写し、求める係数を定める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第113単元。技能の説明を学んでから問題一覧へ進んでください。

前: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/) ／ 次: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)

## 概要

### 生成関数による組合せ構造の符号化

和・積・sequence・set・cycleなどの組合せ構成を係数列の演算へ翻訳し、欲しい個数を係数として抽出する。

まず組合せ構造を和・積へ翻訳し、何の係数を求めるのかを定める。ABC385 Gなどの局所多項式の積はこの基本操作の例である。得られた式が暗黙方程式や巨大な積なら、[高度な係数抽出の節](/learn/combinatorics-algebra/generating-function-coefficients/)で、式から計算可能な係数列を取り出す。

### 習得する技能

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。

高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。

### このUnitでは扱わないもの

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 問題一覧

1. [ABC392 G「Fine Triplets」](https://atcoder.jp/contests/abc392/tasks/abc392_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
2. [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
3. [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
4. [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
5. [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 位取りで巨大添字の係数抽出を繰り返す。各段の全組合せを多項式分布との畳み込みへまとめ、その後同じ商へ移る剰余blockを区間集約する。畳み込みと区間集約の二つの高速化を区別する。
6. [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
7. [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
8. [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
9. [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
10. [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
11. [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
12. [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
13. [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
14. [ABC241 Ex「Card Deck Score」](https://atcoder.jp/contests/abc241/tasks/abc241_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
15. [ABC214 G「Three Permutations」](https://atcoder.jp/contests/abc214/tasks/abc214_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
16. [ABC225 H「Social Distance 2」](https://atcoder.jp/contests/abc225/tasks/abc225_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
17. [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
18. [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h) — 主題: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h) — 主題: [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC315 Ex「Typical Convolution Problem」](https://atcoder.jp/contests/abc315/tasks/abc315_h) — 主題: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC367 G「Sum of (XOR^K or 0)」](https://atcoder.jp/contests/abc367/tasks/abc367_g) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

## 根拠

- [ABC214 G 公式解説](https://atcoder.jp/contests/abc214/editorial/2442)
- [ABC214 G 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC225 H 公式解説](https://atcoder.jp/contests/abc225/editorial/2834)
- [ABC225 H 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_h)
- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-generating-functions`
