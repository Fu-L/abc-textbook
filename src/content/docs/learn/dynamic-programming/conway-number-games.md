---
title: "独立な数ゲームの和"
description: "「独立な数ゲームの和」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 82
---

# 独立な数ゲームの和

習得対象の目安: **赤色（2800以上）**。partisan gameが数になる条件と数の独立和を理解し、Grundy数との違いを扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第157単元。技能の説明を学んでから問題一覧へ進んでください。

前: [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/) ／ 次: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)

## 概要

### 独立な数ゲームの和

全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。

数としての評価はminimaxの終端得点とは異なる。左の全選択肢より大きく、右の全選択肢より小さい数のうち最も単純な二進有理数を選ぶ。空の片側には不等式制約がなく、両側が空の値は0。例えば{0|1}=1/2だが、{0|0}は数でなく、この規則で0にしてはいけない。

ABC229 Hでは列間で手が干渉しない独立和と、全ての列局面が数である条件を先に確かめる。浮動小数の誤差で符号を変えず、共通の2冪分母などで厳密に加算する。ABC265 Exへの応用では整数の数成分だけをこの技能で扱い、Nim成分はGrundy数のXORとして別に保持する。数成分とNim成分を一つの実数へ潰さない。

### 習得する技能

- 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。

有限局面DAGのminimaxで得た考え方と実装を再利用し、独立な数ゲームの和の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 独立な数ゲームの和の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC229 H「Advance or Eat」](https://atcoder.jp/contests/abc229/tasks/abc229_h) — 主題: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)。
2. [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 / Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC229 H 公式解説](https://atcoder.jp/contests/abc229/editorial/2977)
- [ABC229 H 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_h)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-conway-number-games`
