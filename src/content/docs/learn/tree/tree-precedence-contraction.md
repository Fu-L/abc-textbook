---
title: "01 on Tree・親先行順序のcluster縮約"
description: "01 on Tree・親先行順序のcluster縮約の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 175
---

# 01 on Tree・親先行順序のcluster縮約

## 概要

### 01 on Tree・親先行順序のcluster縮約

親が子より先という順序制約の下でclusterの交換比較量を導き、priority queueとDSUで最良clusterを親へ縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: DSUによる連結成分管理・縮約、交換論から選択順を導く。

DSUによる連結成分管理・縮約・貪欲法と交換論で得た考え方と実装を再利用し、01 on Tree・親先行順序のcluster縮約の発動条件・正当化・境界を重複なく学ぶ。

- 01 on Tree・親先行順序のcluster縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC376 G 公式解説](https://atcoder.jp/contests/abc376/editorial/11196)
- [ABC376 G 公式問題文](https://atcoder.jp/contests/abc376/tasks/abc376_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-tree-precedence-contraction`
