---
title: "関数グラフのcycle・tree分解"
description: "「関数グラフのcycle・tree分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 102
---

# 関数グラフのcycle・tree分解

習得対象の目安: **水色（1200–1599）**。前周期と周期を分離し、cycleへの流入と巨大回数の移動を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 関数グラフのcycle・tree分解

各頂点の後続が一意なgraphをcycleと流入treeへ分解し、前周期・周期を処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、関数グラフのcycle・tree分解の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC241 E「Putting Candies」](https://atcoder.jp/contests/abc241/tasks/abc241_e)
2. [ABC256 E「Takahashi's Anguish」](https://atcoder.jp/contests/abc256/tasks/abc256_e)
3. [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e)
4. [ABC296 E「Transition Game」](https://atcoder.jp/contests/abc296/tasks/abc296_e)
5. [ABC357 E「Reachability in Functional Graph」](https://atcoder.jp/contests/abc357/tasks/abc357_e)
6. [ABC377 E「Permute K times 2」](https://atcoder.jp/contests/abc377/tasks/abc377_e)
7. [ABC399 E「Replace」](https://atcoder.jp/contests/abc399/tasks/abc399_e)
8. [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e)
9. [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
10. [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g)

## 根拠

- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC256 E 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_e)
- [ABC256 E 公式解説](https://atcoder.jp/contests/abc256/editorial/4135)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-functional-graph-decomposition`
