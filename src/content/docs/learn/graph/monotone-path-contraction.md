---
title: "単調path contraction・DSU jump"
description: "「単調path contraction・DSU jump」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 120
---

# 単調path contraction・DSU jump

習得対象の目安: **青色（1600–1999）**。確定した区間を次未処理pointerで飛ばし、削除済み部分を再走査しない。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調path contraction・DSU jump

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。

### 習得する技能

- 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)（一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC295 G 公式解説](https://atcoder.jp/contests/abc295/editorial/6052)
- [ABC295 G 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-monotone-path-contraction`
