---
title: "鏡像法・reflection principle"
description: "「鏡像法・reflection principle」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 188
---

# 鏡像法・reflection principle

習得対象の目安: **青色（1600–1999）**。最初に境界を破るpathとの全単射を作り、壁付きの計数を差で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 鏡像法・reflection principle

境界を初めて破るpathを鏡像pathへ写す符号付き全単射により、壁付きwalkを無境界または巡回畳み込みへ変換する。

### 習得する技能

- 最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。

## 考え方

初めて境界を越える位置を固定し、それ以前のpathを反射すると、不正なpathを別の始終点の制約なしpathへ一対一に写せる。全pathから不正分を引くことでprefix制約を数える。


例えば+1/−1のstepをn回ずつ使い、0から0へ戻って全prefixで高さ≥0のpathを数える。全体はC(2n,n)。不正pathの初めて高さ−1になるprefixのstep符号を反転すると、そのprefixは高さ+1で終わり、全体の終点は+2になる。従って+1がn+1回、−1がn−1回の無制約pathへ写る。

逆に0から+2へ行くpathは必ず初めて+1へ到達する。そのprefixを反転すると初めて−1へ落ちる0終点pathへ戻るため全単射である。不正数はC(2n,n−1)、答えはC(2n,n)−C(2n,n−1)。n=0では後者を0とする。反射する区間と初到達水準を明示することで、「壁へ触れるのを禁止」と「壁を越えるのを禁止」の一段の違いも式へ反映できる。

## 成立条件と計算量

反射後も許されるstepになる対称性と、逆写像を示す。二項係数の評価費用で数えられる典型があるが、非対称なstepや複数境界には別の式が必要。境界に触れることと越えることを区別する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。

このUnitを直接前提とする単元: なし。

組合せ係数・数え上げで得た考え方と実装を再利用し、鏡像法・reflection principleの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 鏡像法・reflection principleの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC309 Ex「Simple Path Counting Problem」](https://atcoder.jp/contests/abc309/tasks/abc309_h) — 主題: [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/)（最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC309 H 公式解説](https://atcoder.jp/contests/abc309/editorial/6751)
- [ABC309 H 公式問題文](https://atcoder.jp/contests/abc309/tasks/abc309_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-reflection-principle`
