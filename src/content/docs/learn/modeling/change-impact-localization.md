---
title: "基準witnessから変更影響を局所化する"
description: "「基準witnessから変更影響を局所化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 21
---

# 基準witnessから変更影響を局所化する

習得対象の目安: **青色（1600–1999）**。基準解の実行可能性と最適性、または実行列の保存を証明し、答えが変わり得る変更だけを再計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 基準解による変更影響の局所化

変更前の解・実行列をwitnessとし、それを壊さない変更では答えが変わらないと示して再計算対象を絞る。

### 習得する技能

- 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

## 考え方

### 実行可能性と最適性を分ける

最小化問題の変更前の実行可能集合をS、最適解をs、費用をdとする。変更後の集合S'がSの部分集合で、残る解の費用が変わらず、sもS'に残るなら、変更後の最適値d'はd以上である。一方、費用dのsをそのまま使えるのでd'≤d。上下界が一致してd'=dとなり、再計算を省ける。最大化では不等号を逆にする。

ABC218 Fの辺削除はこの条件を満たす。最短経路Pを一つ復元しておき、P上にない辺を削除する場合は、候補経路が減るだけでPの長さも変わらない。P上の辺を削除した場合だけ再探索する。Pが壊れても別の最短経路が残る可能性はあるが、それを検査する代わりに再探索してよい。

辺追加や重み減少では、新しい良い解が生まれ得る。例えばs→aの重み5、a→tの重み5、s→tの重み20なら、基準経路s→a→tの費用は10。経路外のs→tを1に変えると基準経路は残るが最適値は1になる。witnessの存続だけが保証するのは、変更後にもその費用の解を使えるという上界である。

このような変更を省くには、最適性を保証する下界も検査する。最短路なら頂点potential hが全辺u→vについてh(v)≤h(u)+w(u,v)を満たすと、任意のs→t経路の長さはh(t)−h(s)以上になる。変更後も全制約が成立し、残る基準経路の長さがこの下界と等しければ最適性を保てる。制約を壊す変更では、新候補を評価するか再探索する。

### 決定的な実行を固定する

最適化を伴わない処理では、同じ初期状態から各操作後の状態が同じになることを帰納的に示す。ABC279 Eで追跡中の駒を含まない交換を一つ取り除く場合、その直前・直後の駒の位置が同じなので、以降の操作でも位置が一致する。ここで保持する証拠は駒の実行列であり、最適値の上下界とは別の根拠で局所化できる。

## 成立条件と計算量

変更ごとに何が単調に増減するか、witnessの費用や実行が保存されるかを確認する。各変更を同じ元入力に対して独立に試す場合と、変更を累積する場合も区別する。累積する変更ではwitnessと最適性の証明を更新する。

ABC218 Fでは隣接リスト上のBFSで基準距離とPをO(V+E)で求める。単位重みなのでPは高々V−1辺で、各辺削除に対する再探索もO(V+E)。全E個の答えを出す費用を含め、合計O(V(V+E))となる。元から到達不能なら削除で経路は増えず、全変更で到達不能である。

一般の局所更新は、影響する要素数Kと索引操作の費用で評価する。Kが大きくなり得るなら償却解析や再構築が必要であり、変更位置が一つというだけでは更新費用を小さくできない。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。

### このUnitでは扱わないもの

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 問題一覧

- [ABC279 E「Cheating Amidakuji」](https://atcoder.jp/contests/abc279/tasks/abc279_e) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。
- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。追加で学ぶ技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E 公式問題文](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC243 E 公式解説](https://atcoder.jp/contests/abc243/editorial/3561)
- [ABC279 E 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_e)
- [ABC279 E 公式解説](https://atcoder.jp/contests/abc279/editorial/5289)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-change-impact-localization`
