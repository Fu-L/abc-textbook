---
title: "繰り上がり・借り・混合基数を状態にするDP"
description: "繰り上がり・借り・混合基数を状態にするDPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 39
---

# 繰り上がり・借り・混合基数を状態にするDP

## 概要

### 繰り上がり・混合基数DP

整除鎖の丸め、支払いと釣銭、複数項の加算を下位桁から処理し、次の桁へ渡すcarry・borrowだけを状態に保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態設計を土台に、整除鎖の丸めや複数項の加算で次の桁へ渡すcarryだけを有限状態として保つ。

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC231 E「Minimal payments」](https://atcoder.jp/contests/abc231/tasks/abc231_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g)

## 根拠

- [ABC231 E 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_e)
- [ABC231 E 公式解説](https://atcoder.jp/contests/abc231/editorial/3062)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-dp-carry-mixed-radix`
