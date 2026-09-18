---
title: "支配関係から不要な候補を単調stack・queueで削る"
description: "「支配関係から不要な候補を単調stack・queueで削る」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 34
---

# 支配関係から不要な候補を単調stack・queueで削る

習得対象の目安: **水色（1200–1599）**。将来不要な候補を削る支配関係と、一要素一度の償却計算量を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調stack・queueによる支配候補の削除

順序に走査し、新しい要素に支配された候補を二度と必要にならないことを示して一度だけ削除する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。

### このUnitでは扱わないもの

- 全候補から極値を反復取得するheap・ordered set。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC359 E「Water Tank」](https://atcoder.jp/contests/abc359/tasks/abc359_e)
2. [ABC228 F「Stamp Game」](https://atcoder.jp/contests/abc228/tasks/abc228_f)
3. [ABC379 F「Buildings 2」](https://atcoder.jp/contests/abc379/tasks/abc379_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g)
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h)
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g)
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f)
- [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 F 公式解説](https://atcoder.jp/contests/abc228/editorial/2945)
- [ABC228 F 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_f)
- [ABC234 G 公式解説](https://atcoder.jp/contests/abc234/editorial/3227)
- [ABC234 G 公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-monotone-stack-queue`
