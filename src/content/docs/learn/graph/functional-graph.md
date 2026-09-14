---
title: "一意な後続・サイクル・ダブリング"
description: "「一意な後続・サイクル・ダブリング」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 55
---

# 一意な後続・サイクル・ダブリング

## 概要

状態グラフを理解した後、後続が一意という制約からcycleと流入木への分解やダブリングを導く。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 各頂点から複数の後続を選べる一般のグラフ探索・強連結成分への縮約。

## 下位単元

- [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)
- [doubling・binary lifting](/learn/graph/binary-lifting/)

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g)

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-functional-graph`
