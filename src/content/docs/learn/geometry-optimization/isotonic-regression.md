---
title: "isotonic regression・PAV"
description: "「isotonic regression・PAV」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 228
---

# isotonic regression・PAV

習得対象の目安: **橙色（2400–2799）**。順序制約に違反するblockの併合が正しい理由を示し、PAVで最適化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

### 習得する技能

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

x_1≤…≤x_Nという順序制約下で分離可能な凸損失を最小化する。隣接blockの最適値が逆転したら併合するPAV法は、違反を一つの共有値へ集めて順序制約を回復する。


### 二乗損失のPAVを構成する

w_i>0としてΣ_i w_i(x_i−a_i)²をx_1≤…≤x_Nの下で最小化する。blockに範囲・W=Σw_i・S=Σw_i a_iを持ち、共有値の最適値をμ=S/Wとする。左から一要素blockをstackへpushし、末尾二blockの平均がμ_left>μ_rightの間、WとSを加えて併合する。これを繰り返した最終block内では全x_i=μと出力する。各要素blockは一回作られ、各併合はblock数を一減らすので線形時間。

正しさは各最終blockのprefixについて `Σ_prefix w_i(μ−a_i)≤0`、block全体では0という不変量から示せる。一要素で成立し、平均α>βの二blockを平均μへ併合した場合、左内prefixはμ<αで和が減る。右内prefixは元のprefix和≤0に、左全体の負寄与と右prefixの正寄与を足すが、右全体まで足して初めて0になるためやはり非正。従って併合でも保たれる。

最終解でg_i=2w_i(x_i−a_i)、λ_j=−Σ_{i≤j}g_i、λ_0=λ_N=0とする。上のprefix性からλ_j≥0で、g_i+λ_i−λ_(i−1)=0。block間ではprefix和が0なのでλ_j=0、block内ではx_j=x_(j+1)であり、λ_j(x_j−x_(j+1))=0も満たす。これらは順序制約の最適性条件で、凸性から任意の実行可能yへの損失差の下界Σg_i(y_i−x_i)=Σλ_j(y_(j+1)−y_j)≥0を与える。よって復元したxは最適である。

### 整数の均しblockと片方向移送

値a_iから隣へ一単位ずつ右向きに移す場合は、実数の二乗損失とは異なる目的を持つ。長さL・総和Sの整数均しblockはq=floor(S/L)、r=S−qLとして、先頭L−r個がq、末尾r個がq+1となる。両端はfloor(S/L)、ceil(S/L)なので、左blockの末尾が右blockの先頭より大きい場合に併合する。平均が等しくても、(0,1)と(0,1)の境界は1>0である。

目標bへの右移送数は境界ごとのprefix差h_i=Σ_{j≤i}(a_j−b_j)。総和一致とh_i≥0が到達条件で、操作数はΣh_iとなる。逆転している境界だけを移す手順が任意の単調目標の移送数を超えないことを示し、block併合がその逐次手順をまとめていると確認する。PAVの形だけを借りず、整数のblock解、到達条件、目的値へ戻す式をその問題で導く。S<0でも数学的な床除算を使う。

## 成立条件と計算量

二乗損失ならblockの重み付き平均をO(1)で更新し、各blockが一度push・popされるためO(N)。絶対値損失では中央値管理が必要で費用は構造に依存する。異なる損失でも平均を使えるとは限らない。

概念上の親: [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f) — 主題: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)（単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-isotonic-regression`
