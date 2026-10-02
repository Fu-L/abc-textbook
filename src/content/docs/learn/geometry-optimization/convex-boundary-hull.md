---
title: "凸包・支持方向・境界候補"
description: "「凸包・支持方向・境界候補」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 220
---

# 凸包・支持方向・境界候補

習得対象の目安: **青色（1600–1999）**。外積で凸包を構築し、支持方向と境界上の極値を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 凸包・支持方向・境界候補

内部点が線形/凸目的に不要なことを示し、orientation順で凸境界を構成して支持方向ごとの極値を得る。

### 習得する技能

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

## 考え方

点を辞書順に並べ、同じ向きの曲がりだけを残すstackで下側・上側の凸包を作る。線形目的の最大値なら内部点は境界点の凸結合以下なので候補から除ける。凸包を作る目的と、求める量の性質を結び付ける。


Andrew法では点を(x,y)辞書順にsort・uniqueする。下側のstackに点pを順に追加するとき、末尾二点a,bに対するcross(b−a,p−b)≤0の間bをpopし、最後にpをpushする。上側は逆順で同様に作り、両端の重複を除いてつなぐ。除いたbは新しい下側支持辺の上側または辺上にあり、下側凸境界の頂点になれない。各点が高々一回push・popされるため走査はO(N)。

辺上の全点を残す場合はpop条件を<0へ変えるが、全点共線では上下の連結で二重に出力しないよう別処理する。unique後0,1,2点も明示的に返す。線形目的a·pなら任意内部点p=Σα_i v_iに対してa·p=Σα_i a·v_i≤max_i a·v_i。凸目的の「最大」もJensenの不等式で同様だが、凸目的の最小は内部で達することがあり、凸包頂点だけへ絞れない。

## 成立条件と計算量

N点でsortがO(N log N)、走査O(N)。重複点、全点共線、辺上の点を残すかを固定する。回転calipersの線形走査は支持点が単調に進む根拠を要する。任意の幾何目的が凸包だけで解けるわけではない。

概念上の親: [凸境界・半平面制約を扱う](/learn/geometry-optimization/convex-geometry/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

このUnitを直接前提とする単元: なし。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、凸包・支持方向・境界候補の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC341 G「Highest Ratio」](https://atcoder.jp/contests/abc341/tasks/abc341_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。
- [ABC275 G「Infinite Knapsack」](https://atcoder.jp/contests/abc275/tasks/abc275_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。
- [ABC286 Ex「Don't Swim」](https://atcoder.jp/contests/abc286/tasks/abc286_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。
- [ABC356 G「Freestyle」](https://atcoder.jp/contests/abc356/tasks/abc356_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)（隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC275 G 公式解説](https://atcoder.jp/contests/abc275/editorial/5111)
- [ABC275 G 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-convex-boundary-hull`
