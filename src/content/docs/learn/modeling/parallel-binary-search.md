---
title: "parallel binary search・多数境界の判定共有"
description: "前提からparallel binary search・多数境界の判定共有を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 92
---

# parallel binary search・多数境界の判定共有

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 単調境界を証明して探索する
- この位置で学ぶ理由: 単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。

### この単元では扱わない範囲

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### parallel binary search・多数境界の判定共有

多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。

検索語: batched monotone search、parallel binary search、simultaneous binary search、並列二分探索

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる

題材: [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)

選定理由: 長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。二次元の |Δx|＋|Δy| 距離球を範囲数え上げへ変換したいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 多数のマンハッタン K 近傍距離を、回転・矩形計数・並列二分探索で一括処理できる。

#### 観察

- 座標を u＝x＋y、v＝x−y へ 45 度回転すると、元のマンハッタン距離は max(|Δu|,|Δv|) というチェビシェフ距離になる。
- 距離 r 以下の木は回転後の軸平行長方形 [u−r,u＋r]×[v−r,v＋r] 内の点であり、その個数が K 以上かは r に対して単調である。

#### 候補を比較する

- **採用**: 各クエリの答えを並列二分探索し、同じ反復の全長方形内点数を x sweep と y 座標 Fenwick tree でオフライン計算する。 — 距離判定を軸平行長方形数え上げへ変換し、全クエリを各反復でまとめて点・イベントの一走査にできる。
- **棄却**: 各クエリについて全 N 本の木とのマンハッタン距離を計算し、K 番目を選ぶ。 — N と Q がともに 10 万で、全点対距離を調べられない。

#### 鍵となる着眼

- 長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。

#### アルゴリズムへ接続する

K 番目距離を単調な個数判定へ変え、回転座標の矩形問合せを二つの x-prefix イベントへ分解して、parallel binary search と BIT sweep を重ねる。


## 転用するときの確認

- **マンハッタン距離の 45 度回転**: 二次元の |Δx|＋|Δy| 距離球を範囲数え上げへ変換したいとき。 適用: x＋y と x−y を座標にし、距離 r の菱形を軸平行正方形へ写す。
- **並列二分探索とオフライン矩形計数**: 多数のクエリがそれぞれ単調な閾値を持ち、一つの候補値集合を一括 sweep で判定できるとき。 適用: 各クエリの mid 長方形を左右二イベントにし、x 順に点を追加しながら BIT の y 区間和を取る。
- 順序統計量の幾何クエリは、閾値内の要素数を返す counting oracle を設計して答えの二分探索へつなげる。
- K 番目の幾何距離を見たら、半径内個数の単調性と、その距離球を数えやすい図形へ変える座標変換を探す。
- オフライン矩形数え上げでは、開区間・閉区間をイベントの座標と同値時の順序まで含めて検証する。

## 到達確認

### 到達確認 1 — 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる

転移題材: [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)

**課題**: ABC394 G「Dense Buildings」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 大量のgrid移動queryを最大通行高度のoffline connectivityへ変換し、最小階段回数を求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 大量のgrid移動queryを最大通行高度のoffline connectivityへ変換し、最小階段回数を求められる。

- 対象技能が担う箇所: 大量のgrid移動queryを最大通行高度のoffline connectivityへ変換し、最小階段回数を求められる。
- 転移題材の解法接続: 全grid隣接edgeをcapacity降順にsortする。各queryの[L,R) thresholdを持ち、mid別bucketを作るroundごとにDSUを初期化してedgeをthresholdまで追加し、endpoint連結ならL=mid、否ならR=midと更新する。確定Mから式を出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

</details>


## 根拠

- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC394 G 公式解説](https://atcoder.jp/contests/abc394/editorial/12282)
- [ABC394 G 公式問題文](https://atcoder.jp/contests/abc394/tasks/abc394_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-parallel-binary-search`
