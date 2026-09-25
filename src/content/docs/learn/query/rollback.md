---
title: "rollback・DFS入退場の状態復元"
description: "「rollback・DFS入退場の状態復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 51
---

# rollback・DFS入退場の状態復元

習得対象の目安: **青色（1600–1999）**。変更前の差分を保存し、DFSや時間分割から戻るたびに不変量を復元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第122単元。技能の説明を学んでから問題一覧へ進んでください。

前: [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/) ／ 次: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)

## 概要

### rollback・DFS入退場の状態復元

更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。

### 習得する技能

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
2. [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
3. [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC302 H 公式解説](https://atcoder.jp/contests/abc302/editorial/6409)
- [ABC302 H 公式問題文](https://atcoder.jp/contests/abc302/tasks/abc302_h)
- [ABC363 G 公式解説](https://atcoder.jp/contests/abc363/editorial/10451)
- [ABC363 G 公式問題文](https://atcoder.jp/contests/abc363/tasks/abc363_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-rollback`
