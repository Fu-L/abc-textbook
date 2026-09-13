---
title: "Monge・monotone minima最適化"
description: "Monge・monotone minima最適化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 172
---

# Monge・monotone minima最適化

## 概要

### Monge・monotone minima最適化

quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。

ABC348 Gの分割統治で生じるmax-plus convolutionを考える。入力: x_jは左からj個選ぶAの最大和なので差分が非増加。y_kは右からk個選ぶ最適値で、凹性は仮定しない。z_i=max_k(x_{i-k}+y_k)を求める。

行列: 行を合計個数i、列を右選択数kとし、M[i,k]=x_{i-k}+y_k。両側から選ぶなら1≤k≤|right|かつ1≤i-k≤|left|が有効範囲となる。

正当化: 列kからk+1への差はy_{k+1}−y_k−(x_{i-k}−x_{i-k-1})で、iの増加につれて非減少。離れた列の差も和を取れば同じ性質を持ち、大きい列への優位性は失われない。同点は左優先とすると行最大位置kは非減少。有効列区間の両端も非減少である。

手順: 中央行の有効列を走査して最適kを求め、上半分はk以下、下半分はk以上に探索範囲を絞って再帰する。長さLのmergeはO(L log L)、問題全体はO(N log² N)。SMAWKなら有効域の扱いを保った全単調行列の探索へ接続できる。

境界: 単調なのはkで、左選択数j=i-kではない。無効な個数を有限値0で埋めず、片側だけの選択は別に比較する。xの差分が任意なら単調性は保証されない。

ABC348 Gでは行最大位置の単調性から探索区間を制限する。ABC305 ExでのMonge性の役割は、分割個数別の最適費用の凸性を保証してAliensの復元を正当化すること。行最小値探索を行う教材とは区別し、Lagrangian relaxation側の接続例として読む。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: DP遷移を因数分解・集約して加速する。

DP遷移の集約・高速化で得た考え方と実装を再利用し、Monge・monotone minima最適化の発動条件・正当化・境界を重複なく学ぶ。

- Monge・monotone minima最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g)
2. [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g)
3. [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC348 G 公式解説](https://atcoder.jp/contests/abc348/editorial/9707)
- [ABC348 G 公式問題文](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC383 G 公式解説](https://atcoder.jp/contests/abc383/editorial/11500)
- [ABC383 G 公式問題文](https://atcoder.jp/contests/abc383/tasks/abc383_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-monge-optimization`
