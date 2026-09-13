---
title: "連分数・Stern–Brocotで有理近似する"
description: "連分数・Stern–Brocotで有理近似するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 85
---

# 連分数・Stern–Brocotで有理近似する

## 概要

### 連分数・Stern–Brocot有理近似

Euclidの商列またはStern–Brocot区間を辿り、分母制約下の最良有理近似を求める。

ABC333 Gでは目標値を挟む隣接分数を保ち、分母上限を越えない最大の連続移動回数を計算する。停止後は上下両候補の誤差を分母も含めて比較する。Stern–Brocotの祖先経路を求めることと、分母制約で切った境界候補を比較することを区別する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。

- 整除性や一次不定方程式の可解判定だけを行う問題、および合同類をCRTで統合する構成。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-rational-approximation`
