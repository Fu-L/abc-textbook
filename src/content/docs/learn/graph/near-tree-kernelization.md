---
title: "near-tree graphのkernel化"
description: "「near-tree graphのkernel化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 115
---

# near-tree graphのkernel化

習得対象の目安: **黄色（2000–2399）**。葉と次数2のchainを答えを保って縮約し、余分な辺数で残るサイズを界する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第148単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/) ／ 次: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)

## 概要

### near-tree graphのkernel化

terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。

### 習得する技能

- terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)、[graph core・leaf peeling](/learn/graph/graph-core/)。

cycle space・fundamental cycle basis・graph core・leaf peelingで得た考え方と実装を再利用し、near-tree graphのkernel化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-near-tree-kernelization`
