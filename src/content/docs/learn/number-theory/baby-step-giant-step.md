---
title: "Baby-Step Giant-Step・可逆作用の反復到達探索"
description: "「Baby-Step Giant-Step・可逆作用の反復到達探索」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 171
---

# Baby-Step Giant-Step・可逆作用の反復到達探索

習得対象の目安: **黄色（2000–2399）**。可逆性を使って反復回数を二分し、平方根個の状態を照合する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Baby-Step Giant-Step・可逆作用の反復到達探索

有限群の累乗または有限集合上の可逆写像fについてf^t(s)=gをt=iB+jへ分け、target側のinverse baby stepとstart側のgiant stepをhash照合して到達時刻を平方根時間で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

有限集合上の可逆な作用と逆作用を定義し、離散対数やaffine反復を含む反復到達時刻をbaby/giantの衝突へ変換して平方根時間で求める。合同算術が必要な問題では個別のreadinessとして接続する。

### このUnitでは扱わないもの

- Baby-Step Giant-Step・可逆作用の反復到達探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC270 G「Sequence in mod P」](https://atcoder.jp/contests/abc270/tasks/abc270_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC270 G 公式解説](https://atcoder.jp/contests/abc270/editorial/4847)
- [ABC270 G 公式問題文](https://atcoder.jp/contests/abc270/tasks/abc270_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-baby-step-giant-step`
