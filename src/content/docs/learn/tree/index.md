---
title: "木構造"
description: "「木構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 128
---

# 木構造

## 概要

木の一意な経路と部分木への分解を使う。距離・直径から始め、Euler順とLCAで位置関係を表し、部分木集約と全方位DPへ進む。続いてpath・分離点による分解、必要頂点だけの圧縮、併合履歴の木を比較する。後半の木DPでは、軽い子の処理回数、path上の合成、rake・compressがそれぞれ何を高速化するかを区別する。多項式木DPに進むときは代数章の畳み込みを参照する。

### 木モデルと構造

木固有の根・部分木・path・separator構造へ問題を写し、利用する性質を選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一般グラフから独立させ、根・部分木・一意path・separatorという木固有の不変量を体系的に積み上げる。

### このUnitでは扱わないもの

- なし

## 章の構成

- [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/) — 標準
- [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/) — 発展
- [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/) — 応用
- [包含木の構築とancestor・path分解](/learn/tree/tree-decomposition/) — 節案内
- [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/) — 応用
- [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) — 標準
- [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) — 標準
- [木DP・集約・rerooting](/learn/tree/tree-aggregation/) — 節案内
- [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) — 標準
- [rerooting・全方位木DP](/learn/tree/rerooting/) — 標準
- [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) — 応用
- [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) — 応用
- [重心を分離点として木を再帰分解する](/learn/tree/tree-balanced-separators/) — 応用
- [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/) — 応用
- [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/) — 発展
- [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/) — 発展
- [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/) — 発展
- [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/) — 発展

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f)

## 根拠

- [ABC220 E 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 E 公式解説](https://atcoder.jp/contests/abc220/editorial/2679)
- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC221 F 公式解説](https://atcoder.jp/contests/abc221/editorial/2723)
- [ABC221 F 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-tree`
