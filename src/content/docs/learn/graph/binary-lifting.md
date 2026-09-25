---
title: "doubling・binary lifting"
description: "「doubling・binary lifting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 103
---

# doubling・binary lifting

習得対象の目安: **水色（1200–1599）**。二の冪回の遷移を合成し、行き先や累積値を対数回で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第60単元。技能の説明を学んでから問題一覧へ進んでください。

前: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) ／ 次: [有限関数・作用の合成](/learn/query/finite-function-composition/)

## 概要

### doubling・binary lifting

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。

### 習得する技能

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC367 E「Permute K times」](https://atcoder.jp/contests/abc367/tasks/abc367_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。
2. [ABC438 E「Heavy Buckets」](https://atcoder.jp/contests/abc438/tasks/abc438_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。
3. [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
4. [ABC212 F「Greedy Takahashi」](https://atcoder.jp/contests/abc212/tasks/abc212_f) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。
5. [ABC310 G「Takahashi And Pass-The-Ball Game」](https://atcoder.jp/contests/abc310/tasks/abc310_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
6. [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC254 G 公式解説](https://atcoder.jp/contests/abc254/editorial/4066)
- [ABC254 G 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC310 G 公式解説](https://atcoder.jp/contests/abc310/editorial/6785)
- [ABC310 G 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-binary-lifting`
