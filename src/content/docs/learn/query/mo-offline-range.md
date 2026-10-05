---
title: "Moの順序で区間問い合わせの差分を更新する"
description: "「Moの順序で区間問い合わせの差分を更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 49
---

# Moの順序で区間問い合わせの差分を更新する

習得対象の目安: **青色（1600–1999）**。追加・削除可能な集計を作り、query順の変更で端点移動量を抑える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Mo's algorithmによるオフライン区間問い合わせ

区間問い合わせを端点の移動量が小さい順に並べ、一要素の追加・削除で答えを更新する。

ABC242 Gでは値vの頻度f_vからΣ floor(f_v/2)を維持する。端の追加・削除では一つの頻度だけが変わるのでO(1)で差分更新できる。ABC293 Gでは同じ枠組みでΣ C(f_v,3)を保つ。まず端点操作を定義し、その後にquery順の並べ替えで総移動量を抑える。

ABC405 GではMoで現在区間を動かしながら、別の軸である値をbucketに分ける。値vの頻度が変わるたび所属bucketの頻度和と逆階乗積をO(1)で修正し、値prefix [1,X)の完全bucketと端数からk! / ∏ f_v!を求める。区間端の移動がO(N√Q)回、答えの取得がQ回なので、更新側からlog因子を外す効果が大きい。

Moはquery順の再配置、値bucketは座標軸のblock分割、heavy/lightは対象を頻度や次数で分類する技法である。平方根が現れるという共通点だけで同一視せず、何を分け、どの操作の総回数を減らしたかを説明する。

### 習得する技能

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

## 考え方

すべての区間queryを並べ替え、隣のqueryへ移る際の端点移動を少なくする。add/removeで現在区間の答えを保てれば、毎回最初から計算する必要がない。


### query順と端点の更新規則

半開区間[l,r)を左端block floor(l/B)の昇順、同block内では右端rの昇順へsortする。blockごとに右端を逆順へ交互に変えると定数倍を抑えられる。現在区間[L,R)を空の[0,0)から始め、L>lならLを減らしてその要素をadd、R<rならRの要素をaddしてRを増やす。範囲を広げ終えてから、L<lならLをremoveして増やし、R>rならRを減らしてremoveする。全更新後の集約を元のquery IDへ保存する。

頻度f_vに対し答えがΣg(f_v)なら、addは `ans+=g(f_v+1)−g(f_v)`、removeは `ans+=g(f_v−1)−g(f_v)` として頻度も同時に変える。左端は同block内のquery間でO(B)、block切替え全体でO(N)、右端は一blockでO(N)動く。よってQ>0ではO(QB+N²/B+N)回の移動（Qが0なら走査しない）にsort O(Q log Q)と答え取得費用を加える。

## 成立条件と計算量

block幅Bなら端点移動は典型的にO(QB+N²/B)、一回の更新費用を掛ける。offlineと可逆な端点更新が前提。時間軸の更新を含むMoは状態と上界が変わる。removeが正しく逆操作になるか確認する。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

区間への要素の追加・削除を定義し、問い合わせ順を並べ替えて端点移動の総量を抑える。

### このUnitでは扱わないもの

- オンラインのpriority queue・multiset、および単調stack・queue。

## 問題一覧

- [ABC242 G「Range Pairing Query」](https://atcoder.jp/contests/abc242/tasks/abc242_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。
- [ABC293 G「Triple Index」](https://atcoder.jp/contests/abc293/tasks/abc293_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)（値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。

## 根拠

- [ABC242 G 公式解説](https://atcoder.jp/contests/abc242/editorial/3517)
- [ABC242 G 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC293 G 公式解説](https://atcoder.jp/contests/abc293/editorial/5947)
- [ABC293 G 公式問題文](https://atcoder.jp/contests/abc293/tasks/abc293_g)
- [ABC384 G 公式解説](https://atcoder.jp/contests/abc384/editorial/11548)
- [ABC384 G 公式問題文](https://atcoder.jp/contests/abc384/tasks/abc384_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-mo-offline-range`
