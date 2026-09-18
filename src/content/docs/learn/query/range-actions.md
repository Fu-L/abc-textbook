---
title: "区間更新を要約へ作用させる"
description: "「区間更新を要約へ作用させる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 46
---

# 区間更新を要約へ作用させる

習得対象の目安: **青色（1600–1999）**。要約に対する作用と作用同士の合成を定義し、遅延評価の整合性を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 遅延評価する区間作用

区間更新を要約へ作用させ、作用の合成を遅延評価する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。

### このUnitでは扱わないもの

- 過去の版の保存・rollback・構造共有。

## 下位単元

- [Segment Tree Beats](/learn/query/segment-tree-beats/) — 橙色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC340 E「Mancala 2」](https://atcoder.jp/contests/abc340/tasks/abc340_e)
2. [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f)
3. [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f)
4. [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f)
5. [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f)
6. [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f)
7. [ABC371 F「Takahashi in Narrow Road」](https://atcoder.jp/contests/abc371/tasks/abc371_f)
8. [ABC382 F「Falling Bars」](https://atcoder.jp/contests/abc382/tasks/abc382_f)
9. [ABC389 F「Rated Range」](https://atcoder.jp/contests/abc389/tasks/abc389_f)
10. [ABC397 F「Variety Split Hard」](https://atcoder.jp/contests/abc397/tasks/abc397_f)
11. [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
12. [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)
13. [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f)
14. [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f)
15. [ABC237 G「Range Sort Query」](https://atcoder.jp/contests/abc237/tasks/abc237_g)
16. [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g)
17. [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g)
18. [ABC441 G「Takoyaki and Flip」](https://atcoder.jp/contests/abc441/tasks/abc441_g)
19. [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h)
20. [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)

## 根拠

- [ABC237 G 公式解説](https://atcoder.jp/contests/abc237/editorial/3341)
- [ABC237 G 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_g)
- [ABC248 H 公式解説](https://atcoder.jp/contests/abc248/editorial/3748)
- [ABC248 H 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-range-actions`
