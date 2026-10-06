---
title: "gcd不変量・差分構造"
description: "「gcd不変量・差分構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 164
---

# gcd不変量・差分構造

習得対象の目安: **水色（1200–1599）**。差や周期をgcdにまとめ、共通因子と剰余類が保存する条件を示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### gcd不変量・差分構造

差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。

### 習得する技能

- gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。

## 考え方

gcdは整数の共通因子を最大公約数へ集める。加減算でgcdが保存されるため、全体のgcdや隣接差のgcdへ問題を直せる場合がある。

整数a,bの共通約数はaとb−qaの共通約数に一致するので、gcd(a,b)=gcd(a,b−qa)。Euclidの除算はこの不変量を保ち、非負の余りを小さくして終了する。配列全体へ同じxを加えたときは、各要素から先頭を引くことでgcd(a_0+x,…,a_(N−1)+x)=gcd(a_0+x,a_1−a_0,…,a_(N−1)−a_0)。右辺の差のgcdを一度求めれば、xごとのqueryは先頭とのgcd一回になる。N=1では差集合のgcdを0としてよい。

さらに、全要素が同じ剰余rになる法m>0は、全ての差を割ることと同値である。差のgcdをgとすれば候補mはgの正の約数へ絞れるが、g=0なら全要素が同じなので任意の正のmがこの条件を満たす。この境界を「0の約数一覧」で処理しない。

静的な一要素除外にはP[0]=S[N]=0、P[i+1]=gcd(P[i],a_i)、S[i]=gcd(a_i,S[i+1])を作り、iを除く答えをgcd(P[i],S[i+1])とする。互いに素な要素も0も同じ式で扱える。一方、区間gcdは和のようにprefix同士を引いて取り出せず、動的なrange条件にはgcdの結合性を使う区間集約が要る。

## 成立条件と計算量

EuclidはO(log U)回の除算。配列のgcd集約はO(N log U)の上界となる。gcd(0,a)=|a|を使い、全て0の境界を扱う。最小公倍数は先にgcdで割ってから掛け、overflowを確認する。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)、[Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)。

差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。

## 問題一覧

- [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f) — 主題: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g) — 主題: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g) — 主題: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)（合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC248 G「GCD cost on the tree」](https://atcoder.jp/contests/abc248/tasks/abc248_g) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g) — 主題: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)（往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。）。既習技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G 公式解説](https://atcoder.jp/contests/abc248/editorial/3795)
- [ABC248 G 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-gcd-structure`
