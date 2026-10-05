---
title: "Baby-Step Giant-Step・可逆作用の反復到達探索"
description: "「Baby-Step Giant-Step・可逆作用の反復到達探索」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 174
---

# Baby-Step Giant-Step・可逆作用の反復到達探索

習得対象の目安: **黄色（2000–2399）**。可逆性を使って反復回数を二分し、平方根個の状態を照合する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Baby-Step Giant-Step・可逆作用の反復到達探索

有限群の累乗または有限集合上の可逆写像fについてf^t(s)=gをt=iB+jへ分け、target側のinverse baby stepとstart側のgiant stepをhash照合して到達時刻を平方根時間で求める。

### 習得する技能

- 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。

## 考え方

群でa^x=bを探す際、x=iL+jと分ける。a^jを表へ保存し、b·a^(−iL)との一致を探すことで指数の全範囲を平方根規模へ分けられる。


### 可逆写像でも同じ手順を使う

探索範囲を0≤t<U、幅B=ceil(√U)とする。target gから逆写像でg,f^(−1)(g),…,f^(−(B−1))(g)を作り、各状態に最小のjを記録する。start sからs,f^B(s),f^(2B)(s),…をi昇順に調べ、一致したjについてt=iB+j<Uなら返す。一致はf^(iB)(s)=f^(−j)(g)、すなわちf^t(s)=gと同値。各blockを昇順に調べて最小jを使うので最小到達時刻も復元できる。衝突がなければ範囲内では到達不能である。

群作用ならf(x)=ax、f^B(x)=a^B xを累乗で用意できる。一般の可逆写像ではf^Bの一適用を高速に行えることが別の条件であり、B回の素朴な反復を毎giant stepへ課すと全体O(U)に戻る。非可逆写像には逆側の表をそのまま作れない。

## 成立条件と計算量

探索範囲U、L≈√UならO(√U)群演算と空間、辞書費用を加える。逆元が存在する群を仮定する。最小指数を求めるなら同値keyの最小jを残し、非互いに素のmodには別の縮約が必要。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

有限集合上の可逆な作用と逆作用を定義し、離散対数やaffine反復を含む反復到達時刻をbaby/giantの衝突へ変換して平方根時間で求める。合同算術が必要な問題では個別のreadinessとして接続する。

### このUnitでは扱わないもの

- Baby-Step Giant-Step・可逆作用の反復到達探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC270 G「Sequence in mod P」](https://atcoder.jp/contests/abc270/tasks/abc270_g) — 主題: [Baby-Step Giant-Step・可逆作用の反復到達探索](/learn/number-theory/baby-step-giant-step/)（有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC270 G 公式解説](https://atcoder.jp/contests/abc270/editorial/4847)
- [ABC270 G 公式問題文](https://atcoder.jp/contests/abc270/tasks/abc270_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-baby-step-giant-step`
