---
title: "Kruskal順の閾値DSU sweep"
description: "「Kruskal順の閾値DSU sweep」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# Kruskal順の閾値DSU sweep

習得対象の目安: **青色（1600–1999）**。辺とqueryを同じ重み順に処理し、連結する閾値と同重みの扱いを整理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Kruskal順の閾値DSU sweep

辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。

### 習得する技能

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。

このUnitを直接前提とする単元: なし。

DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。

### このUnitでは扱わないもの

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。追加で学ぶ技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

## 根拠

- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-kruskal-threshold-sweep`
