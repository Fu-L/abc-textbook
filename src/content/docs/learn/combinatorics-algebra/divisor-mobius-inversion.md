---
title: "約数格子のzeta・Möbius反転"
description: "「約数格子のzeta・Möbius反転」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 186
---

# 約数格子のzeta・Möbius反転

習得対象の目安: **青色（1600–1999）**。約数・倍数の累積値とexact値を区別し、反転でgcd別の個数を取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 約数格子のzeta・Möbius反転

約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。

### 習得する技能

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

「ちょうどn」の値f(n)と、「nの約数すべて」を含む累積値g(n)=Σ_{d|n}f(d)を区別する。約数方向の和をzeta変換、その重複を取り除いてfへ戻す操作をMöbius反転と呼ぶ。素因数ごとの包除が反転の係数になる。

### μの定義と約数方向の反転

Möbius関数はμ(1)=1、平方因子を持つ整数では0、相異なるk個の素数の積では(−1)^kと定める。例えばμ(2)=−1、μ(6)=1、μ(12)=0である。n>1の相異なる素因数をk個とすると、μが非零の約数はその素因数の部分集合に対応するので、Σ_{d|n}μ(d)=(1−1)^k=0。n=1では和が1となる。つまりΣ_{d|n}μ(d)=[n=1]である。

この恒等式から、f(n)=Σ_{d|n}μ(n/d)g(d)を得る。右辺へgの定義を代入して和を交換すると、f(e)の係数はΣ_{d: e|d|n}μ(n/d)=Σ_{h|n/e}μ(h)。e=nだけが残り、それ以外の重複が相殺される。

μを作らず、f(n)=g(n)−Σ_{d|n,d<n}f(d)をnの昇順に計算してもよい。真の約数はnより小さいため、この順序で必要な値が既に分かっている。例えばg(1)=2、g(2)=5、g(3)=7、g(6)=17なら、f(6)=17−7−5+2=7となる。

### 倍数方向の反転とexact gcd

今度は上限Mを固定し、F(d)をgcdがちょうどdである対象の個数、G(d)をgcdがdの倍数である対象の個数とする。G(d)=Σ_{k≤M,d|k}F(k)なので、F(d)=G(d)−Σ_{k=2d,3d,…≤M}F(k)をd=Mから1への降順に計算する。約数方向と逆に、真の倍数が先に必要になる。

μを使う形はF(d)=Σ_{t≤M/d}μ(t)G(dt)。代入後のF(dk)の係数がΣ_{t|k}μ(t)になるので、同じ恒等式で正当化できる。正整数の値の頻度が与えられるなら、dの倍数の要素数C(d)を先に求め、異なる二要素のunordered pairを数える場合はG(d)=C(d)(C(d)−1)/2と置ける。そこからF(d)へ反転するとexact gcd別の個数になる。順序付きか、同じ要素の二度使用を許すかによってGの式は変わる。

周期を数える場合も、「周期がdを割る」個数と「最小の反復単位の長さがちょうどd」の個数を分けると、約数方向の反転になる。何が約数で何が倍数かを集合の包含から決め、評価順を合わせる。

## 成立条件と計算量

1からMまでの累積と反転は、各dの倍数を走査すればΣ_{d=1}^M floor(M/d)=O(M log M)時間、O(M)空間。μの篩では全値を1で初期化し、各素数pの倍数の符号を反転、p²の倍数を0にする。素数を求める通常の篩も含めO(M log log M)である。反転は加減算だけで成立するので、法が合成数でも反転のための逆元は不要。gcdが0となる対象や負値は正整数上の集計へそのまま混ぜず別に扱う。二軸の倍数集計などは各軸の走査費用も数える。

概念上の親: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

このUnitを直接前提とする単元: なし。

素因数・約数分解で得た考え方と実装を再利用し、約数格子のzeta・Möbius反転の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。）。
- [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。追加で学ぶ技能: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)（合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC230 G 公式解説](https://atcoder.jp/contests/abc230/editorial/3020)
- [ABC230 G 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_g)
- [ABC304 F 公式解説](https://atcoder.jp/contests/abc304/editorial/6511)
- [ABC304 F 公式問題文](https://atcoder.jp/contests/abc304/tasks/abc304_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-divisor-mobius-inversion`
