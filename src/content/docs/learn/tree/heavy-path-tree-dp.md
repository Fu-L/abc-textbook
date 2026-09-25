---
title: "heavy path上の多項式木DP"
description: "「heavy path上の多項式木DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 140
---

# heavy path上の多項式木DP

習得対象の目安: **橙色（2400–2799）**。多項式の木DPをheavy path上の合成にまとめ、軽い部分木の総費用を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### heavy path上の多項式木DP

heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。

ABC269 Exではheavy path上の多項式漸化式を積と合成へまとめ、畳み込みと分割統治で評価する。必要なのは通常の多項式積を高速化できる代数構造であり、一般のmax-plus convolutionをNTTへ置き換えることはできない。

### 習得する技能

- heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（後の章）、[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

畳み込み・相互相関・根付き木DP・部分木集約で得た考え方と実装を再利用し、heavy path上の多項式木DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)（heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC269 H 公式解説](https://atcoder.jp/contests/abc269/editorial/4838)
- [ABC269 H 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-heavy-path-tree-dp`
