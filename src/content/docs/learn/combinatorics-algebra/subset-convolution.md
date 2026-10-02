---
title: "subset convolution"
description: "「subset convolution」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 211
---

# subset convolution

習得対象の目安: **橙色（2400–2799）**。集合サイズ別の変換と反転を組み合わせ、互いに素な分割の畳み込みを求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset convolution

互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。

### 習得する技能

- 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

N bitの集合に対して `h[S]=Σ_{T⊆S}f[T]g[S\T]` を求める。素朴に全S,Tを列挙するとO(3^N)になる。通常のzeta変換はunionの畳み込みを扱うので、集合サイズも記録して重なりを除く。

### rankを添字へ追加する

1. rank k=0,…,Nについて、`f_k[S]=f[S]`（|S|=k）、それ以外は0とする。g_kも同様に作る。
2. rankごとにsubset zeta変換を行い、`F_k[S]=Σ_{T⊆S, |T|=k}f[T]` とG_k[S]を得る。各bit bについて、そのbitを含むSで `F_k[S]+=F_k[S\{b}]` と更新する。
3. 各Sでrank方向を畳み込み、`H_k[S]=Σ_{i=0}^k F_i[S]G_{k-i}[S]` とする。rankはNまででよい。
4. Hの各rankへMöbius反転を行う。各bit bを含むSで `H_k[S]-=H_k[S\{b}]` と更新し、その結果をK_k[S]と呼ぶ。
5. 求める値は `h[S]=K_{|S|}[S]` である。

### 反転とサイズがそれぞれ保証するもの

手順3には `U⊆S,V⊆S, |U|+|V|=k` の全組が含まれる。Möbius反転がSより小さいunionの寄与を除くため、`K_k[S]=Σ_{U∪V=S, |U|+|V|=k} f[U]g[V]` になる。

ここでk=|S|を選ぶと、`|U|+|V|=|U∪V|+|U∩V|` よりU∩V=∅。反転だけでは重なりを除けず、rank条件だけではunionがSと保証できない。両方を使って初めてV=S\Uとなる。空集合もrank 0として処理し、`h[∅]=f[∅]g[∅]` を保つ。

## 成立条件と計算量

N+1本のrank配列へ各O(N2^N)の変換・反転を行う。rank畳み込みも各SでO(N²)なので、全体はO(N²2^N)時間・O(N2^N)空間になる。

加減乗算のできる可換環を使う。Möbius反転の減算を、一般のmin-plus/max-plusの極値操作へそのまま移すことはできない。サイズ以外の属性を追加するなら、その属性が組の合成でどう足されるかも定義する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。

このUnitを直接前提とする単元: なし。

subset zeta・Möbius変換で得た考え方と実装を再利用し、subset convolutionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h) — 主題: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)（互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)（辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-subset-convolution`
