---
title: "方向別grid scanによる長距離効果の前計算"
description: "「方向別grid scanによる長距離効果の前計算」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 88
---

# 方向別grid scanによる長距離効果の前計算

習得対象の目安: **水色（1200–1599）**。方向ごとの走査で長距離の影響を前計算し、探索中の判定を軽くする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 方向別grid scanによる長距離効果の前計算

各行・各列を効果の向きにscanし、最後のblockerまたはactive emitterだけを保って、直線状に続く監視・照射・到達禁止効果を全体線形時間で印付ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各行・各列を固定方向に一度ずつscanし、定数方向へ伸びる効果をblockerまで一括伝播する。効果を止める属性と、その後の処理で禁止する属性を分離する。

### このUnitでは扱わないもの

- 方向別grid scanによる長距離効果の前計算の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC317 E 公式問題文](https://atcoder.jp/contests/abc317/tasks/abc317_e)
- [ABC317 E 公式解説](https://atcoder.jp/contests/abc317/editorial/7031)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-directional-grid-effect-scan`
