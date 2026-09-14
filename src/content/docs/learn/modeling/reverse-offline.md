---
title: "時間を逆向きにして未来依存を消す"
description: "「時間を逆向きにして未来依存を消す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 40
---

# 時間を逆向きにして未来依存を消す

## 概要

### 逆向きのオフライン処理

時間依存を逆走査・逆操作・last-write時刻で単調または静的な処理へ変換し、元の時点の答えを復元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

削除・上書き・未来依存を含む更新列を逆向きに読み、追加だけ・first-writeだけなどの単調な処理へ変換して元の時刻へ答えを戻す。

### このUnitでは扱わないもの

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e)
2. [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e)
3. [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
4. [ABC346 E「Paint」](https://atcoder.jp/contests/abc346/tasks/abc346_e)
5. [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e)
6. [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f)

## 根拠

- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)
- [ABC238 H 公式解説](https://atcoder.jp/contests/abc238/editorial/3361)
- [ABC238 H 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC249 F 公式解説](https://atcoder.jp/contests/abc249/editorial/3789)
- [ABC249 F 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-reverse-offline`
