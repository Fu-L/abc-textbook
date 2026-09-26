---
title: "path matchingのheap縮約greedy"
description: "「path matchingのheap縮約greedy」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 126
---

# path matchingのheap縮約greedy

習得対象の目安: **橙色（2400–2799）**。選んだ辺の近傍を補正して縮約し、各cardinalityの最適値が得られる理由を示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### path matchingのheap縮約greedy

pathの非隣接edgeからk本を選ぶ最小重みmatchingを、最小edgeの採用と近傍二辺の補正縮約 w_l+w_r-w_i により全cardinalityについて順に求める。

列の非隣接な要素iを選ぶことは、頂点0,…,nのpathで辺(i-1,i)を選ぶmatchingと同値。ABC218 Hの最大化はw_i=-B_iで最小化へ写り、w_l+w_r-w_iの符号を戻すとB_l+B_r-B_iとなる。個数を固定するため、途中の負の限界利益を勝手に打ち切らない。

端の辺を採用したときは存在しない隣辺を通常の重み0として扱わない。その辺と唯一の隣辺を除き、内部のときだけ左右二辺と中央を補正辺へ置き換える。番兵を使う実装では実辺を表さないことと、無限値の加減算を避けることを確認する。ABC464 GとABC218 Hで端点と選択可能数を比較する。

### 習得する技能

- 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)、[priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。

このUnitを直接前提とする単元: なし。

path matchingの交互構造を使い、最小edgeの採用後も残りの全cardinality最適値を保存する補正縮約を導いてheapと双方向linkで実装する。

### このUnitでは扱わないもの

- path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC464 G 公式解説](https://atcoder.jp/contests/abc464/editorial/22263)
- [ABC464 G 公式問題文](https://atcoder.jp/contests/abc464/tasks/abc464_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-path-matching-contraction`
