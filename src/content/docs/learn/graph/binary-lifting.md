---
title: "doubling・binary lifting"
description: "「doubling・binary lifting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 107
---

# doubling・binary lifting

習得対象の目安: **水色（1200–1599）**。二の冪回の遷移を合成し、行き先や累積値を対数回で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### doubling・binary lifting

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。

### 習得する技能

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 考え方

決定性遷移fについてjump[k][v]=f^(2^k)(v)を保存する。Kの立っているbitだけ遷移を合成すれば、巨大な回数を対数個のjumpに分けられる。


初期表はjump[0][v]=f(v)、倍増は `jump[k+1][v]=jump[k][jump[k][v]]`。Kのbitを下から読み、立っていればv←jump[k][v]として残りのjumpを適用する。遷移ごとの寄与w(v)も欲しければagg[0][v]=w(v)、`agg[k+1][v]=agg[k][v]⊗agg[k][jump[k][v]]` と進行順に合成する。queryでは遷移前のvからaggを答えの末尾へ足してからvを更新する。K=0の答えは初期vと単位元である。

## 成立条件と計算量

最大回数Uに対しO(N log U)構築・空間、query O(log U)。遷移と一緒に値を合成するなら結合的な演算と進行方向を固定する。Uより小さいlog Nだけの表では巨大回数に足りない。

概念上の親: [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)。

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC367 E「Permute K times」](https://atcoder.jp/contests/abc367/tasks/abc367_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC438 E「Heavy Buckets」](https://atcoder.jp/contests/abc438/tasks/abc438_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC212 F「Greedy Takahashi」](https://atcoder.jp/contests/abc212/tasks/abc212_f) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC310 G「Takahashi And Pass-The-Ball Game」](https://atcoder.jp/contests/abc310/tasks/abc310_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC254 G 公式解説](https://atcoder.jp/contests/abc254/editorial/4066)
- [ABC254 G 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC310 G 公式解説](https://atcoder.jp/contests/abc310/editorial/6785)
- [ABC310 G 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-binary-lifting`
