---
title: "状態グラフのモデリングと探索"
description: "「状態グラフのモデリングと探索」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 87
---

# 状態グラフのモデリングと探索

難度の目安: **基礎**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 状態グラフのモデリングと探索

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。

状態に頂点以外の情報を加えるときは、状態数と遷移数に加えて、遷移に閉路があるかを確認する。ABC244 Fの状態は(mask,v)で、移動先uのbitを反転して(mask XOR (1<<u),u)へ進む。集合は増減するため部分集合の包含順では計算できない。

各vから(1<<v,v)を距離1で多始点BFSし、各maskについて終点vの距離の最小値を取る。空のwalkで実現するmask=0は長さ0。bitmaskは状態表現であり、距離を確定する算法は単位重みのBFSである。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC289 E「Swap Places」](https://atcoder.jp/contests/abc289/tasks/abc289_e)
2. [ABC394 E「Palindromic Shortest Path」](https://atcoder.jp/contests/abc394/tasks/abc394_e)
3. [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)
4. [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
5. [ABC429 E「Hit and Away」](https://atcoder.jp/contests/abc429/tasks/abc429_e)
6. [ABC446 E「Multiple-Free Sequences」](https://atcoder.jp/contests/abc446/tasks/abc446_e)
7. [ABC241 F「Skate」](https://atcoder.jp/contests/abc241/tasks/abc241_f)
8. [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f)
9. [ABC302 F「Merge Set」](https://atcoder.jp/contests/abc302/tasks/abc302_f)
10. [ABC414 F「Jump Traveling」](https://atcoder.jp/contests/abc414/tasks/abc414_f)
11. [ABC446 F「Reachable Set 2」](https://atcoder.jp/contests/abc446/tasks/abc446_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-state-graph-search`
