---
title: "時間を逆向きにして未来依存を消す"
description: "時間を逆向きにして未来依存を消すの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 22
---

# 時間を逆向きにして未来依存を消す

## 概要

### 逆向きのオフライン処理

時間依存を逆走査・逆操作・last-write時刻で単調または静的な処理へ変換し、元の時点の答えを復元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

削除・上書き・未来依存を含む更新列を逆向きに読み、追加だけ・first-writeだけなどの単調な処理へ変換して元の時刻へ答えを戻す。

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC346 E「Paint」](https://atcoder.jp/contests/abc346/tasks/abc346_e)
2. [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e)
3. [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f)
4. [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e)
5. [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
6. [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
7. [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f)
8. [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e)
9. [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
10. [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)
- [ABC238 H 公式解説](https://atcoder.jp/contests/abc238/editorial/3361)
- [ABC238 H 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC249 F 公式解説](https://atcoder.jp/contests/abc249/editorial/3789)
- [ABC249 F 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-reverse-offline`
