---
title: "有向cycle検出・sink/source peeling"
description: "「有向cycle検出・sink/source peeling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 102
---

# 有向cycle検出・sink/source peeling

習得対象の目安: **水色（1200–1599）**。DFSの訪問状態や次数零の反復削除から、有向cycleと残る領域を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向cycle検出・sink/source peeling

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。

### 習得する技能

- 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。

## 考え方

入次数0や出次数0を反復除去し、残る有向構造を調べる。除去時に隣接頂点の次数を減らし、条件を満たした頂点をqueueへ入れることで各辺を一度扱える。


三色DFSでは未訪問0、再帰stack内1、退出済み2とする。vを1にして各辺v→uを見て、u=0なら再帰、u=1なら祖先への辺とDFS親pathから有向cycleを復元できる。全辺を処理してvを2にする。退出済みへの辺はcycleの証拠とは限らない。

入次数0だけを剥がした残りは「有向cycleから到達できる頂点」、出次数0だけなら「有向cycleへ到達できる頂点」である。残りで入辺（または出辺）を辿ると有限頂点内で繰り返すためcycleがあり、そのchainが到達性を与える。cycleそのものだけが必要ならSCCを使い、サイズ2以上または自己loop付き単点成分を選ぶ。

## 成立条件と計算量

O(V+E)。入次数だけの剥離ではcycleから到達する頂点も残り得るため、残る全頂点がcycle上とは限らない。何を判定したいかに合わせて剥離の向きと意味を証明する。

概念上の親: [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 有向cycle検出・sink/source peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC456 E「Endless Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_e) — 主題: [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)（三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。）。
- [ABC245 F「Endless Walk」](https://atcoder.jp/contests/abc245/tasks/abc245_f) — 主題: [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)（三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC245 F 公式解説](https://atcoder.jp/contests/abc245/editorial/3652)
- [ABC245 F 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_f)
- [ABC456 E 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_e)
- [ABC456 E 公式解説](https://atcoder.jp/contests/abc456/editorial/19849)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-directed-core-peeling`
