---
title: "値軸のbucket分割と区間集約"
description: "「値軸のbucket分割と区間集約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 48
---

# 値軸のbucket分割と区間集約

習得対象の目安: **水色（1200–1599）**。平方根分割で完全blockと端数を分け、更新とqueryの費用を調整する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 値軸のbucket分割と区間集約

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。

値域を0,…,V−1、block幅をBとし、block jは[jB,min((j+1)B,V))とする。和の要約S_j=Σ a_vは初め配列から構築し、全て0の配列ならS_j=0。一点a_vをoldからnewへ変えるとき、j=floor(v/B)としてS_j←S_j+new−old、a_v←newとする。

半開prefix[0,x)の取得ではq=floor(x/B)を求め、全S_j（j<q）と、残りのa_v（qB≤v<x）を足す。x=Vがblock境界なら端数は空であり、x=0の答えは0。各位置は完全blockか端数の一方にただ一度含まれるので正しい。一般の結合演算でも同じ分割でqueryできるが、旧寄与を取り消す操作がなければO(1)更新はできない。

積の要約P_j=∏ a_vは、可逆な旧因子ならP_j←P_j·old^(−1)·newと直せる。ただし逆元を一回O(log p)の累乗で求める実装はO(1)更新ではなく、逆元が前計算済みか、更新時に定数回の演算で得られる場合に限りO(1)となる。0や非可逆因子にはこの除去式を適用しない。素数法で0を扱う場合は、非零因子の積と0の個数を別々に持つ方法を[動的mod積](/learn/number-theory/dynamic-modular-product/)で学ぶ。

ABC405 Gはこの更新と取得の非対称性をMoに組み込む。各値の頻度とblock内のΣf_v、∏invFact[f_v]を持ち、値の重複数に依存する並べ替え数を計算する。頻出値をheavyへ分類する方法とは、分割対象も計算量の証明も異なる。

この例ではf_v=0、和0、積1から始め、最大頻度が素数法p未満となるようfactorialとその逆元を前計算する。f→f+1では和へ1、積へinv(f+1)を掛け、f→f−1では和から1、積へfを掛ける。invFact[f+1]/invFact[f]=1/(f+1)からこの定数時間更新が従う。prefix内の頻度和をn、その逆階乗積をPとすれば、同じ値を区別しない並べ替え数はn!·P。位置を動かすMoの費用と、この値prefix取得の費用を分けて数える。

### 習得する技能

- 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。

## 考え方

値域をbucketへ分け、各bucketの個数や和を持つ。prefixは丸ごとのbucketと端の部分走査へ分けられ、複雑な木を使わず更新と集計を釣り合わせられる。

## 成立条件と計算量

和の初期構築O(V)、U点更新とQ prefix取得ならO(V+U+Q(V/B+B))時間、O(V)空間。queryがある単純なこのモデルではB≈√Vで二項を釣り合わせる。block全体の再構築が要る更新ならUの係数にもBが現れるため、実際の更新・query回数から総費用を作り直す。疎な値域は座標圧縮し、順位と実値の総和を区別する。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 値軸のbucket分割と区間集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)（値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-value-bucket-aggregation`
