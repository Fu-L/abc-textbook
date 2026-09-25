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

### 習得する技能

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。

### このUnitでは扱わないもの

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 問題一覧

- [ABC333 G「Nearest Fraction」](https://atcoder.jp/contests/abc333/tasks/abc333_g) — 主題: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。）。
- [ABC408 G「A/B < p/q < C/D」](https://atcoder.jp/contests/abc408/tasks/abc408_g) — 主題: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC333 G 公式解説](https://atcoder.jp/contests/abc333/editorial/7937)
- [ABC333 G 公式問題文](https://atcoder.jp/contests/abc333/tasks/abc333_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC408 G 公式解説](https://atcoder.jp/contests/abc408/editorial/13160)
- [ABC408 G 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-rational-approximation`
