---
title: "Segment Treeのcanonical区間分解"
description: "「Segment Treeのcanonical区間分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 44
---

# Segment Treeのcanonical区間分解

習得対象の目安: **青色（1600–1999）**。区間を少数のnodeへ分解する性質を、値の集約以外の配置にも使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Segment Treeのcanonical区間分解

区間をO(log N)個のcanonical nodeへ分解してrange object・生存時間・range edgeを配置し、point queryでは対応するroot-to-leaf pathから該当objectを集める。

### 習得する技能

- 区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。

## 考え方

区間をSegment Treeの互いに素な最大節点区間へ分ける。O(log N)個の節点を使うことで、区間を対象とする制約や辺を個別要素すべてへ作らず表現できる。


node区間とquery[L,R)が交わらなければ停止、完全に含まれればそのnodeへ対象を置いて停止、部分交差なら両子へ進む。各深さで部分交差するnodeは左端・右端の高々二つで、その脇の完全被覆nodeだけを選ぶため全選択数はO(log N)。選ばれるnode区間は互いに素で、合併はちょうど[L,R)となる。

位置pを含む対象を集めるにはleaf pからrootへのpathの配置物を見る。pが対象区間に含まれる必要十分条件は、そのcanonical分解の一nodeがこのpath上にあることで、同じ対象が一queryで重複しない。range edgeでは外部頂点→区間の各点に届かせるdown tree（親→子）、区間の各点→外部頂点にはup tree（子→親）を分け、canonical nodeへ元辺重みで接続する。共有leaf以外で両向き木を無条件に結ぶと許さない移動を作るため、補助辺の向きを固定する。

## 成立条件と計算量

Q区間の分解数はO(Q log N)。区間graphへの帰着では上向き・下向きの補助辺を分ける。query合成と補助graph構築は用途が違うため、最終graphの頂点・辺数と探索費用も数える。

概念上の親: [結合的な区間要約・区間分解・合成](/learn/query/monoid-segment-tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/)。

区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元

- [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/) — 青色

## 問題一覧

- [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g) — 主題: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)
- [ABC342 G 公式解説](https://atcoder.jp/contests/abc342/editorial/9373)
- [ABC342 G 公式問題文](https://atcoder.jp/contests/abc342/tasks/abc342_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-segment-tree-canonical-decomposition`
