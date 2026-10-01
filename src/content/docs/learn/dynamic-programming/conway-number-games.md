---
title: "独立な数ゲームの和"
description: "「独立な数ゲームの和」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 85
---

# 独立な数ゲームの和

習得対象の目安: **赤色（2800以上）**。partisan gameが数になる条件と数の独立和を理解し、Grundy数との違いを扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 独立な数ゲームの和

全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。

数としての評価はminimaxの終端得点とは異なる。左の全選択肢より大きく、右の全選択肢より小さい数のうち最も単純な二進有理数を選ぶ。空の片側には不等式制約がなく、両側が空の値は0。例えば{0|1}=1/2だが、{0|0}は数でなく、この規則で0にしてはいけない。

ABC229 Hでは列間で手が干渉しない独立和と、全ての列局面が数である条件を先に確かめる。浮動小数の誤差で符号を変えず、共通の2冪分母などで厳密に加算する。ABC265 Exへの応用では整数の数成分だけをこの技能で扱い、Nim成分はGrundy数のXORとして別に保持する。数成分とNim成分を一つの実数へ潰さない。

### 習得する技能

- 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

左右の手を別々に持つpartizan gameのうち、左選択が右選択より小さい条件を満たす数ゲームは、選択肢の間の最も単純な数として評価する。独立な和を数の加算で扱える範囲を見極める。

## 成立条件と計算量

有限な数ゲームにはdyadic rationalが現れる。合法手の再帰とsimplest-number規則を確認し、一般のpartizan gameやimpartial gameのGrundy数と区別する。分母の桁数と状態の共有費用を含めて評価する。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。

このUnitを直接前提とする単元: なし。

有限局面DAGのminimaxで得た考え方と実装を再利用し、独立な数ゲームの和の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 独立な数ゲームの和の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC229 H「Advance or Eat」](https://atcoder.jp/contests/abc229/tasks/abc229_h) — 主題: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)（全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)（全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。） / [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。

## 根拠

- [ABC229 H 公式解説](https://atcoder.jp/contests/abc229/editorial/2977)
- [ABC229 H 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_h)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-conway-number-games`
