---
title: "最短路を証明する木・経路の復元"
description: "「最短路を証明する木・経路の復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 97
---

# 最短路を証明する木・経路の復元

習得対象の目安: **水色（1200–1599）**。距離だけでなく到達元を保持し、最短路条件を満たす木や経路を取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最短路を証明する木・経路の復元

最短距離の等式を満たす辺から、親・木・実現経路を選ぶ。

### 習得する技能

- 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。

### このUnitでは扱わないもの

- 最短路を証明する木・経路の復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC252 E「Road Reduction」](https://atcoder.jp/contests/abc252/tasks/abc252_e) — 主題: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。追加で学ぶ技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC308 Ex「Make Q」](https://atcoder.jp/contests/abc308/tasks/abc308_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（根からの最短路木で第一枝の異なる頂点を結ぶ辺を列挙し、二本の木上経路と合わせて根を通る最小閉路を求められる。）。既習技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。追加で学ぶ技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。既習技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC252 E 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_e)
- [ABC252 E 公式解説](https://atcoder.jp/contests/abc252/editorial/3980)
- [ABC308 H 公式解説](https://atcoder.jp/contests/abc308/editorial/6709)
- [ABC308 H 公式問題文](https://atcoder.jp/contests/abc308/tasks/abc308_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-shortest-path-reconstruction`
