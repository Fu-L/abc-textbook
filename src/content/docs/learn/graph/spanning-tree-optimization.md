---
title: "cut・cycle性質から最適全域木を構成する"
description: "「cut・cycle性質から最適全域木を構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# cut・cycle性質から最適全域木を構成する

習得対象の目安: **水色（1200–1599）**。DSUやheapを用い、cut・cycle性質で全域木の辺選択を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最小・最大全域木とcut・cycle性質

辺重み順の成分併合をcut・cycle性質で正当化し、全域木の構成と閾値別成分数による最適重みを導く。

### 習得する技能

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。
- 重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。

貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

### このUnitでは扱わないもの

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 下位単元

- [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/) — 青色

## 問題一覧

- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC282 E「Choose Two and Eat One」](https://atcoder.jp/contests/abc282/tasks/abc282_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

## 根拠

- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-spanning-tree-optimization`
