---
title: "matroid greedy"
description: "「matroid greedy」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 201
---

# matroid greedy

習得対象の目安: **黄色（2000–2399）**。独立性oracleと交換公理から、重み順の選択が最適基底を与えることを示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### matroid greedy

独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。

### 習得する技能

- 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

重み順に要素を見て、独立性を保つものだけ追加する。交換公理によりgreedyの選択を含む最適基底へ変形でき、帰納的に最適な重みの基底が得られる。


独立集合族Iは、空集合を含むこと、独立集合の部分集合も独立であること、A,B∈Iかつ|A|<|B|ならB∖Aのある要素をAへ加えて独立にできることを満たす。最後が交換公理であり、全ての極大独立集合は同じサイズrの基底になる。

最大重み基底では重みw_1≥…≥w_Nにsortし、空集合から一個ずつ独立性を保つ場合だけ選ぶ。最初のj要素内で得た集合G_jは極大である。一度拒否した要素はその後でも加えられない。加えられるなら、その部分集合だった拒否時の集合でも加えられ、遺伝性に反するためである。交換公理によりG_jのサイズはprefixのrankで、任意基底Bのprefix内個数以下にはならない。

基底の重みは `w_N r+Σ_{j=1}^{N−1}(w_j−w_(j+1))·|B∩{1,…,j}|` と書ける。各差は非負でgreedyが全prefix個数を最大化するから、合計も最大になる。これで負重みを含む「基底」の最適性まで証明できる。任意独立集合でサイズ固定がない最大化は、負重みを追加せず止める。最小重み基底は重み昇順にする。

## 成立条件と計算量

N要素・oracle費用TならO(N log N+NT)。最大重みと最小重みで順序を変える。任意独立集合の最適化では負重みや基底まで選ぶ条件を区別する。二つのmatroidの共通制約には通常このgreedyは使えない。

概念上の親: [Matroidの独立性・greedy・線形交差](/learn/combinatorics-algebra/matroid-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)。

Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。

### このUnitでは扱わないもの

- matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)（独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-matroid-greedy`
