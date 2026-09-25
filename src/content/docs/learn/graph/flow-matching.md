---
title: "フロー・マッチング・カットへ帰着する"
description: "「フロー・マッチング・カットへ帰着する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 119
---

# フロー・マッチング・カットへ帰着する

導入対象の目安: **青色（1600–1999）**。割当て・容量・cutの制約を読み、matchingとflowへの還元を選ぶ入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

頂点と辺のモデルを作れることを前提に、選択制約を容量・カット・マッチングへ翻訳する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- Eulerウォークの次数・偶奇条件。

## 下位単元

- [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/) — 青色
- [最大流・最小カット](/learn/graph/max-flow-min-cut/) — 青色
- [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/) — 黄色
- [最小費用流・circulation](/learn/graph/min-cost-flow/) — 黄色
- [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/) — 黄色
- [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/) — 赤色
- [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-flow-matching`
