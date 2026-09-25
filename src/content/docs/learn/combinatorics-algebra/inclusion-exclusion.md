---
title: "包除・Möbius反転で重複を補正する"
description: "「包除・Möbius反転で重複を補正する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 190
---

# 包除・Möbius反転で重複を補正する

習得対象の目安: **水色（1200–1599）**。条件の共通部分を数え、交互符号が重複を打ち消す理由を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第51単元。技能の説明を学んでから問題一覧へ進んでください。

前: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/) ／ 次: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)

## 概要

### 集合上の包除原理

条件集合の交差をsubsetごとに数え、交互符号で「少なくとも一つ」「全てを避ける」対象を重複なく数える。

### 習得する技能

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。

### このUnitでは扱わないもの

- 選択順を二項係数だけで式化する数え上げ。

## 下位単元

- [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/) — 青色
- [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/) — 青色

## 問題一覧

1. [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。 非空の行集合Sをbitmaskで列挙し、共通文字数c(S)を求める。和集合の大きさはΣ_{S≠∅}(−1)^{|S|+1}c(S)^L。重複を交互に打ち消す包除原理が主題であり、subset間のDP遷移はない。
2. [ABC455 E「Unbalanced ABC Substrings」](https://atcoder.jp/contests/abc455/tasks/abc455_e) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
3. [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
4. [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
5. [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
6. [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
7. [ABC242 F「Black and White Rooks」](https://atcoder.jp/contests/abc242/tasks/abc242_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
8. [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。
9. [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC214 G「Three Permutations」](https://atcoder.jp/contests/abc214/tasks/abc214_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。 F_A(i)=Σ_{k≤A}C(i,k)を毎回足し直さず、Pascalの式からF_A(i+1)=2F_A(i)−C(i,A)とする。三色分を同時更新して包除の各項を定数時間で計算する。
- [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC214 G 公式解説](https://atcoder.jp/contests/abc214/editorial/2442)
- [ABC214 G 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-inclusion-exclusion`
