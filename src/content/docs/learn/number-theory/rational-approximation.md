---
title: "連分数・Stern–Brocotで有理近似する"
description: "「連分数・Stern–Brocotで有理近似する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 175
---

# 連分数・Stern–Brocotで有理近似する

習得対象の目安: **橙色（2400–2799）**。連分数や隣接分数の行列式を使い、分母制約下で最良の候補を残す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 連分数・Stern–Brocot有理近似

Euclidの商列またはStern–Brocot区間を辿り、分母制約下の最良有理近似を求める。

下側a/bと上側c/dにbc−ad=1を保つと、mediant (a+c)/(b+d)で区間を細分できる。同方向に何回進めるかをEuclidの商に相当する整数でまとめ、分母上限によって打ち切る。この境界表現を続くStern–Brocot木の単元でも再利用する。

ABC333 Gでは目標値を挟む隣接分数を保ち、分母上限を越えない最大の連続移動回数を計算する。停止後は上下両候補の誤差を分母も含めて比較する。Stern–Brocotの祖先経路を求めることと、分母制約で切った境界候補を比較することを区別する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。

### このUnitでは扱わないもの

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC333 G「Nearest Fraction」](https://atcoder.jp/contests/abc333/tasks/abc333_g)
2. [ABC408 G「A/B < p/q < C/D」](https://atcoder.jp/contests/abc408/tasks/abc408_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)

## 根拠

- [ABC333 G 公式解説](https://atcoder.jp/contests/abc333/editorial/7937)
- [ABC333 G 公式問題文](https://atcoder.jp/contests/abc333/tasks/abc333_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC408 G 公式解説](https://atcoder.jp/contests/abc408/editorial/13160)
- [ABC408 G 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-rational-approximation`
