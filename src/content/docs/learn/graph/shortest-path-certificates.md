---
title: "重み付き最短路・経路復元・差分制約"
description: "「重み付き最短路・経路復元・差分制約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 91
---

# 重み付き最短路・経路復元・差分制約

導入対象の目安: **緑色（800–1199）**。辺の重みに合う距離計算を選び、最短路の復元へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

辺重みに応じた距離計算、距離等式による経路復元、差の不等式を緩和へ写す制約系への応用を順に学ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 辺重みや最短距離を扱わず、到達可否だけを求める探索、および最短路に限らない一般の変更影響解析。

## 下位単元

- [最短路モデル](/learn/graph/weighted-shortest-path/) — 緑色
- [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/) — 水色
- [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。

## 根拠

- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-shortest-path-certificates`
