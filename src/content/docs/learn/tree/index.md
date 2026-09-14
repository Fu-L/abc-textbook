---
title: "木構造"
description: "「木構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 41
---

# 木構造

## 概要

### 木モデルと構造

木固有の根・部分木・path・separator構造へ問題を写し、利用する性質を選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一般グラフから独立させ、根・部分木・一意path・separatorという木固有の不変量を体系的に積み上げる。

### このUnitでは扱わないもの

- なし

## 下位単元

- [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)
- [木DP・集約・rerooting](/learn/tree/tree-aggregation/)
- [包含木の構築とancestor・path分解](/learn/tree/tree-decomposition/)
- [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)
- [重心を分離点として木を再帰分解する](/learn/tree/tree-balanced-separators/)
- [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)
- [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)
- [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)
- [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)
- [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)

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
