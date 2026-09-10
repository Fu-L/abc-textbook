---
title: "状態グラフのモデリングと探索"
description: "状態グラフのモデリングと探索の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 115
---

# 状態グラフのモデリングと探索

## 概要

### 状態グラフのモデリングと探索

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC302 F「Merge Set」](https://atcoder.jp/contests/abc302/tasks/abc302_f)
2. [ABC241 F「Skate」](https://atcoder.jp/contests/abc241/tasks/abc241_f)
3. [ABC289 E「Swap Places」](https://atcoder.jp/contests/abc289/tasks/abc289_e)
4. [ABC394 E「Palindromic Shortest Path」](https://atcoder.jp/contests/abc394/tasks/abc394_e)
5. [ABC414 F「Jump Traveling」](https://atcoder.jp/contests/abc414/tasks/abc414_f)
6. [ABC429 E「Hit and Away」](https://atcoder.jp/contests/abc429/tasks/abc429_e)
7. [ABC446 E「Multiple-Free Sequences」](https://atcoder.jp/contests/abc446/tasks/abc446_e)
8. [ABC446 F「Reachable Set 2」](https://atcoder.jp/contests/abc446/tasks/abc446_f)
9. [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)
10. [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)
11. [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
12. [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
13. [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
14. [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-state-graph-search`
