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

## 標準履修順

第137単元。技能の説明を学んでから問題一覧へ進んでください。

前: [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/) ／ 次: [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/)

## 概要

### Baby-Step Giant-Step・可逆作用の反復到達探索

有限群の累乗または有限集合上の可逆写像fについてf^t(s)=gをt=iB+jへ分け、target側のinverse baby stepとstart側のgiant stepをhash照合して到達時刻を平方根時間で求める。

### 習得する技能

- 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

有限集合上の可逆な作用と逆作用を定義し、離散対数やaffine反復を含む反復到達時刻をbaby/giantの衝突へ変換して平方根時間で求める。合同算術が必要な問題では個別のreadinessとして接続する。

### このUnitでは扱わないもの

- Baby-Step Giant-Step・可逆作用の反復到達探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC270 G「Sequence in mod P」](https://atcoder.jp/contests/abc270/tasks/abc270_g) — 主題: [Baby-Step Giant-Step・可逆作用の反復到達探索](/learn/number-theory/baby-step-giant-step/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC270 G 公式解説](https://atcoder.jp/contests/abc270/editorial/4847)
- [ABC270 G 公式問題文](https://atcoder.jp/contests/abc270/tasks/abc270_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-baby-step-giant-step`
