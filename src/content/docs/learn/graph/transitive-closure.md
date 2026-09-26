---
title: "推移閉包"
description: "「推移閉包」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 推移閉包

習得対象の目安: **水色（1200–1599）**。到達関係の推移性を行列更新やbitsetでまとめて計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 推移閉包

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。

### 習得する技能

- 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC292 E「Transitivity」](https://atcoder.jp/contests/abc292/tasks/abc292_e) — 主題: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。）。
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h) — 主題: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。） / [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。

## 根拠

- [ABC287 H 公式解説](https://atcoder.jp/contests/abc287/editorial/5635)
- [ABC287 H 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC292 E 公式問題文](https://atcoder.jp/contests/abc292/tasks/abc292_e)
- [ABC292 E 公式解説](https://atcoder.jp/contests/abc292/editorial/5874)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-transitive-closure`
