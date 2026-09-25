---
title: "要素索引と連結リストで局所linkを更新する"
description: "「要素索引と連結リストで局所linkを更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 29
---

# 要素索引と連結リストで局所linkを更新する

習得対象の目安: **茶色（400–799）**。配列や辞書で要素を索引化し、挿入・削除で変わる前後関係だけを更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第14単元。技能の説明を学んでから問題一覧へ進んでください。

前: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/) ／ 次: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)

## 概要

### 索引付き連結リスト

要素IDから前後linkへ直接到達し、挿入・削除で影響する局所的なlinkだけを更新する。

### 習得する技能

- 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

配列やmapの索引を使い、順序全体を走査せず前後linkだけを更新して列を保つ。

### このUnitでは扱わないもの

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 問題一覧

1. [ABC344 E「Insert or Erase」](https://atcoder.jp/contests/abc344/tasks/abc344_e) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC344 E 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_e)
- [ABC344 E 公式解説](https://atcoder.jp/contests/abc344/editorial/9487)
- [ABC421 F 公式解説](https://atcoder.jp/contests/abc421/editorial/13787)
- [ABC421 F 公式問題文](https://atcoder.jp/contests/abc421/tasks/abc421_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-linked-list-index`
