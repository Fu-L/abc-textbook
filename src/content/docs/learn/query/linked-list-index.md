---
title: "要素索引と連結リストで局所linkを更新する"
description: "「要素索引と連結リストで局所linkを更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 31
---

# 要素索引と連結リストで局所linkを更新する

習得対象の目安: **茶色（400–799）**。配列や辞書で要素を索引化し、挿入・削除で変わる前後関係だけを更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 索引付き連結リスト

要素IDから前後linkへ直接到達し、挿入・削除で影響する局所的なlinkだけを更新する。

### 習得する技能

- 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

配列やmapの索引を使い、順序全体を走査せず前後linkだけを更新して列を保つ。

### このUnitでは扱わないもの

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 問題一覧

- [ABC344 E「Insert or Erase」](https://atcoder.jp/contests/abc344/tasks/abc344_e) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。）。
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC344 E 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_e)
- [ABC344 E 公式解説](https://atcoder.jp/contests/abc344/editorial/9487)
- [ABC421 F 公式解説](https://atcoder.jp/contests/abc421/editorial/13787)
- [ABC421 F 公式問題文](https://atcoder.jp/contests/abc421/tasks/abc421_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-linked-list-index`
