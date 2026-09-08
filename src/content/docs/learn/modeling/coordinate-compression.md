---
title: "疎なkeyの順序を保ってdense indexへ圧縮する"
description: "前提から疎なkeyの順序を保ってdense indexへ圧縮するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 14
---

# 疎なkeyの順序を保ってdense indexへ圧縮する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 比較に必要なのが順序と等値性だけであることを確認し、疎な初期値・将来更新値・event座標をsort-uniqueしたdense indexへ写す。

### この単元では扱わない範囲

- 値・時刻順にactive集合を増減するevent sweep、および固定配列・行列を入力順のまま読むだけのscan。

## 発動条件と見分け方

### 座標・値の順序保存圧縮

疎な初期値・将来更新値・event座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写す。

検索語: coordinate compression、rank compression、値圧縮、座標圧縮

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる

題材: [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f)

#### このOutcomeを支える根拠

- 巨大な暦上の出荷計画を O(N^2) 個の必須候補日へ圧縮し、順序付き DP で最適化できる。

#### 観察

- 注文は到着時刻順にまとめて出荷する最適解がある。同じ注文集合を出す時刻は、最後の注文到着時刻を待つか、前回出荷から X 日後に即出すかのどちらかである。

#### 候補を比較する

- **採用**: 候補日 T_i+kX の O(N^2) 個だけをイベント化し、イベント日と最後に処理した注文数を状態とする DP で最大 K 件の連続注文を出荷する。 — 最適出荷日が候補集合に限定され、N≤100 なのでイベント・注文数・束サイズの多項式 DP が時間内に収まる。
- **棄却**: 日付を1日ずつ進め、各日にどの注文を出すか試す。 — T_N は10^12で日付走査が不可能であり、出荷集合の任意選択も指数的になる。

#### 鍵となる着眼

- 注文 j を i より先に出しても不満度は改善しないので、到着順の prefix を順番に処理する最適解へ交換できる。
- 固定した次の束では出荷日は max(束末尾の T, 前回日+X) まで早めてよく、これを繰り返すと T_i+kX しか現れない。

#### アルゴリズムへ接続する

全 T_i+kX (0≤k≤N) を sort unique する。dp[event][j] を j 件まで出した最小不満度とし、何もしない遷移と、その日に次の1..K件を出して X 日後以降の次 event へ進む遷移を行う。


## 転用するときの確認

- **連続時間のイベント圧縮**: 時刻上限は巨大だが、最適行動が入力時刻と固定間隔からしか起きないとき。 適用: T_i+kX の候補日に限って DP する。
- **順序保存の batch DP**: 到着順を崩さず高々 K 個をまとめて処理する問題。 適用: 処理済み prefix 長だけを集合状態として持つ。
- 束の中身を任意集合で持たず、交換論法で連続 prefix に限定する。
- 固定した出荷グループの時刻を早める議論から、なぜ候補日が T_i+kX に閉じるのかを再導出する。

## 到達確認

### 到達確認 1 — 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる

転移題材: [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)

**課題**: ABC221 E「LEQ」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 座標圧縮付き Fenwick Tree: 左からの走査中に、値が現在値以下または以上の過去要素の重み和が必要なとき。 適用: 値 rank 上の prefix sum と一点加算で不等号条件を処理する。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 座標圧縮付き Fenwick Tree: 左からの走査中に、値が現在値以下または以上の過去要素の重み和が必要なとき。 適用: 値 rank 上の prefix sum と一点加算で不等号条件を処理する。

- 対象技能が担う箇所: 座標圧縮付き Fenwick Tree: 左からの走査中に、値が現在値以下または以上の過去要素の重み和が必要なとき。 適用: 値 rank 上の prefix sum と一点加算で不等号条件を処理する。
- 転移題材の解法接続: 2 の冪と逆冪を法 998244353 で前計算する。j を左から走査し、Fenwick Tree の rank(A_j) 以下を query して 2^{j-1} 倍を答えへ加えた後、同じ rank に 2^{-j} を add する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。

</details>


## 根拠

- [ABC221 E 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 E 公式解説](https://atcoder.jp/contests/abc221/editorial/2718)
- [ABC231 F 公式解説](https://atcoder.jp/contests/abc231/editorial/3059)
- [ABC231 F 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC232 G 公式解説](https://atcoder.jp/contests/abc232/editorial/3141)
- [ABC232 G 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_g)
- [ABC374 F 公式解説](https://atcoder.jp/contests/abc374/editorial/11095)
- [ABC374 F 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-coordinate-compression`
