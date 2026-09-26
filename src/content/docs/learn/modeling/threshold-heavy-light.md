---
title: "平方根・閾値による軽重分類"
description: "「平方根・閾値による軽重分類」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 22
---

# 平方根・閾値による軽重分類

習得対象の目安: **青色（1600–1999）**。頻度や次数で場合分けし、二つの計算量の釣合いから閾値を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 平方根・閾値による軽重分類

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。

### 習得する技能

- 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC335 F「Hop Sugoroku」](https://atcoder.jp/contests/abc335/tasks/abc335_f) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC219 G「Propagation」](https://atcoder.jp/contests/abc219/tasks/abc219_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC350 G「Mediator」](https://atcoder.jp/contests/abc350/tasks/abc350_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

## 根拠

- [ABC219 G 公式解説](https://atcoder.jp/contests/abc219/editorial/2653)
- [ABC219 G 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_g)
- [ABC259 H 公式解説](https://atcoder.jp/contests/abc259/editorial/4269)
- [ABC259 H 公式問題文](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC335 F 公式解説](https://atcoder.jp/contests/abc335/editorial/9038)
- [ABC335 F 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-threshold-heavy-light`
