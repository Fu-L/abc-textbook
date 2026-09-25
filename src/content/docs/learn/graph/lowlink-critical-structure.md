---
title: "lowlinkで橋・関節点を特定する"
description: "「lowlinkで橋・関節点を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# lowlinkで橋・関節点を特定する

習得対象の目安: **青色（1600–1999）**。DFS木と後退辺を区別し、lowlinkの不変量から橋・関節点を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第27単元。技能の説明を学んでから問題一覧へ進んでください。

前: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/) ／ 次: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)

## 概要

### lowlinkによる橋・関節点の検出

DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。

### 習得する技能

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。

### このUnitでは扱わないもの

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 問題一覧

1. [ABC334 G「Christmas Color Grid 2」](https://atcoder.jp/contests/abc334/tasks/abc334_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 両端からのDijkstraとlowlinkを既習として、d_s[u]+w(u,v)+d_t[v]=d_s[t]を満たす辺だけで最短路部分グラフを作る。そのグラフで橋になることと全最短路に不可欠なことを対応させる。元グラフの橋判定とは違う。正重みによる距離の増加を使って対応を証明する。

## 根拠

- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC334 G 公式解説](https://atcoder.jp/contests/abc334/editorial/8980)
- [ABC334 G 公式問題文](https://atcoder.jp/contests/abc334/tasks/abc334_g)
- [ABC375 G 公式解説](https://atcoder.jp/contests/abc375/editorial/11133)
- [ABC375 G 公式問題文](https://atcoder.jp/contests/abc375/tasks/abc375_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-lowlink-critical-structure`
