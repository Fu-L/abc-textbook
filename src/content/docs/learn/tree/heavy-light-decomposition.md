---
title: "Heavy-Light Decomposition"
description: "「Heavy-Light Decomposition」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 135
---

# Heavy-Light Decomposition

習得対象の目安: **青色（1600–1999）**。軽い辺の回数を界し、pathを少数の区間に分解して順序付きqueryを処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Heavy-Light Decomposition

木上pathをO(log N)本の連続区間へ分解し、配列data structure上のqueryへ変換する。

Heavy-Light Decomposition（HLD）は、根付き木の各頂点で部分木サイズ最大の子への辺をheavy、それ以外をlightとして分ける。heavy辺が連なるpathを連続した配列区間へ写し、木のpathを区間列として扱う。

light辺を子へ降りると部分木サイズは半分未満になるため、根へのpathが通るlight辺はO(log N)本。任意の二頂点間のpathもO(log N)個のheavy path区間に分かれる。分解の前処理はO(N)、各区間をsegment treeでO(log N)処理するならpath queryはO(log² N)。

和や最大値なら区間の向きを無視できるが、行列積や文字列の連結では結合順を保つ必要がある。両端からLCAへ向かう区間を分け、逆向き集約も用意する。辺に値を置くときはLCA自身の頂点位置を除外する。

### 習得する技能

- heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)、[Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。

このUnitを直接前提とする単元: なし。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、Heavy-Light Decompositionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Heavy-Light Decompositionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)（heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。）。

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-heavy-light-decomposition`
