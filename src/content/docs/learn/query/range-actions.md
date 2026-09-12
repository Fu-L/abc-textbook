---
title: "区間更新を要約へ作用させる"
description: "区間更新を要約へ作用させるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 56
---

# 区間更新を要約へ作用させる

## 概要

### 遅延評価する区間作用

区間更新を要約へ作用させ、作用の合成を遅延評価する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 区間monoid要約。

結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。

- 過去の版の保存・rollback・構造共有。

## 下位単元

- [Segment Tree Beats](/learn/query/segment-tree-beats/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC340 E「Mancala 2」](https://atcoder.jp/contests/abc340/tasks/abc340_e)
2. [ABC382 F「Falling Bars」](https://atcoder.jp/contests/abc382/tasks/abc382_f)
3. [ABC237 G「Range Sort Query」](https://atcoder.jp/contests/abc237/tasks/abc237_g)
4. [ABC371 F「Takahashi in Narrow Road」](https://atcoder.jp/contests/abc371/tasks/abc371_f)
5. [ABC389 F「Rated Range」](https://atcoder.jp/contests/abc389/tasks/abc389_f)
6. [ABC397 F「Variety Split Hard」](https://atcoder.jp/contests/abc397/tasks/abc397_f)
7. [ABC441 G「Takoyaki and Flip」](https://atcoder.jp/contests/abc441/tasks/abc441_g)
8. [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g)
9. [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f)
10. [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f)
11. [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f)
12. [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f)
13. [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g)
14. [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f)
15. [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h)
16. [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
17. [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f)
18. [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f)
19. [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)

## 根拠

- [ABC237 G 公式解説](https://atcoder.jp/contests/abc237/editorial/3341)
- [ABC237 G 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_g)
- [ABC248 H 公式解説](https://atcoder.jp/contests/abc248/editorial/3748)
- [ABC248 H 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-range-actions`
