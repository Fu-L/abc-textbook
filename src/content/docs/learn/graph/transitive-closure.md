---
title: "推移閉包"
description: "「推移閉包」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 89
---

# 推移閉包

習得対象の目安: **水色（1200–1599）**。到達関係の推移性を行列更新やbitsetでまとめて計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第54単元。技能の説明を学んでから問題一覧へ進んでください。

前: [bit列をTrieで索引化する](/learn/query/binary-trie/) ／ 次: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)

## 概要

### 推移閉包

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。

### 習得する技能

- 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC292 E「Transitivity」](https://atcoder.jp/contests/abc292/tasks/abc292_e) — 主題: [推移閉包](/learn/graph/transitive-closure/)。
2. [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h) — 主題: [推移閉包](/learn/graph/transitive-closure/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。 / 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。

## 根拠

- [ABC287 H 公式解説](https://atcoder.jp/contests/abc287/editorial/5635)
- [ABC287 H 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC292 E 公式問題文](https://atcoder.jp/contests/abc292/tasks/abc292_e)
- [ABC292 E 公式解説](https://atcoder.jp/contests/abc292/editorial/5874)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-transitive-closure`
