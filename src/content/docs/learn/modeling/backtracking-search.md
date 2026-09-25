---
title: "backtracking・可逆な探索状態"
description: "「backtracking・可逆な探索状態」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 5
---

# backtracking・可逆な探索状態

習得対象の目安: **緑色（800–1199）**。再帰と訪問済み管理を使い、選択と取り消しが対応する探索を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第37単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Z algorithmによるprefix matching](/learn/string/z-algorithm/) ／ 次: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)

## 概要

### backtracking・可逆な探索状態

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。

### 習得する技能

- 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- backtracking・可逆な探索状態の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e) — 主題: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

## 根拠

- [ABC284 E 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_e)
- [ABC284 E 公式解説](https://atcoder.jp/contests/abc284/editorial/5494)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-backtracking-search`
