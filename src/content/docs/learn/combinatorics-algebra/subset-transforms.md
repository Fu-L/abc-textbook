---
title: "subset zeta・Möbius変換"
description: "前提からsubset zeta・Möbius変換を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 183
---

# subset zeta・Möbius変換

このページは **小節** です。同じ対象を扱う技能を比較し、どの発動条件・不変量・計算量の違いで使い分けるかを学びます。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 部分集合・bitmask状態DP、包除・Möbius反転で重複を補正する
- この位置で学ぶ理由: 集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元と学習順

以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。

1. [subset convolution](./subset-convolution.md)（標準順 207）— 畳み込み・相互相関・subset zeta・Möbius変換で得た考え方と実装を再利用し、subset convolutionの発動条件・正当化・境界を重複なく学ぶ。

## 発動条件と見分け方

### subset zeta・Möbius変換

Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。

検索語: subset Möbius transform、subset zeta transform、高速ゼータ変換

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)

選定理由: 左から最初に新しい連結が止まる0を境界にすると、prefix全1＋残りfrontier部分集合という互いに重ならない遷移分類になる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。幅が小さい格子を行単位で処理し、将来に影響する境界だけを保持する。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 条件を満たす0/1/?格子の完成方法数を求められる。

#### 観察

- 行を上から処理すると将来との接続可能性は各列の最下端bitだけで表せ、許される次行はfrontier maskの部分集合とprefixを1で埋める形に分類できる。

#### 候補を比較する

- **採用**: frontier mask DPとsubset zeta型遷移 — 幅M≤18なので2^M状態を持ち、次行候補の部分集合和を高速ゼータ変換の要領でまとめられる。
- **棄却**: 全?マスを列挙 — 最大324マスで指数が大きすぎる。

#### 鍵となる着眼

- 左から最初に新しい連結が止まる0を境界にすると、prefix全1＋残りfrontier部分集合という互いに重ならない遷移分類になる。

#### アルゴリズムへ接続する

各行でdp[mask]を入力0/1/?制約に合わせて変換し、部分集合和を一回のzeta sweepで計算しつつ各prefix全1ケースを次maskへ加える。

## 下位単元を使い分ける比較例

未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。

- **subset convolution** — 直接到達点: 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

**比較の到達点**: 未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。


## 転用するときの確認

- **bitmask frontier DP**: 幅が小さい格子を行単位で処理し、将来に影響する境界だけを保持する。 適用: 各列が上から伸長可能かをmaskにする。
- **subset zeta transform**: 全maskからその部分集合への和が必要。 適用: 行遷移の多数の部分集合和をO(M2^M)で求める。
- frontier遷移は重複しない境界イベントで分類する。
- 小格子の全?埋めと比較し、全0・全1、固定値が遷移を遮る行、M=1を確認する。

## 到達確認

### 到達確認 1 — Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f)

**課題**: ABC349 F「Subsequence LCM」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。

### 学習経路の選択

**課題**: 未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。

**合格条件**: 採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 非空subsequenceのうちLCMがちょうどMとなるものを位置の違い込みでmod 998244353により数えられる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 非空subsequenceのうちLCMがちょうどMとなるものを位置の違い込みでmod 998244353により数えられる。

- 対象技能が担う箇所: 非空subsequenceのうちLCMがちょうどMとなるものを位置の違い込みでmod 998244353により数えられる。
- 転移題材の解法接続: Mをfactorizeし、各A_iでM%A_i≠0なら捨てる。残りについて各primeのmax powerで割り切れるbit maskを作りcntへ加える。cntをsubset zetaして各maskのeligible個数を得てh=2^countとし、subset Möbius transformを行ってg[full]を出す。M=1はA_i=1の個数cから2^c-1。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>

<details><summary>学習経路の選択の解答基準</summary>

**検証状態**: `pending` — これは T057 の学習経路レビュー前に使う自己評価基準であり、検証済みとは扱いません。

正解は一つの単元名ではなく、問題構造と各候補の定義・対象外との照合である。下位単元のOutcome自体の到達確認はそれぞれの所有Unitで行う。

- 問題を対象・操作・保つ量・求める量へ分解する。
- 各下位単元の発動条件を一つずつ照合し、不足情報を明示する。
- 採用候補の成立理由と、近い候補の最初の破綻点を対にする。
- 前提DAGと標準順を確認し、選んだ経路の最初の単元を決める。

期待する到達点: 未知問に対する学習経路を、発動条件・棄却理由・前提順とともに再現できる。

</details>


## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC349 F 公式解説](https://atcoder.jp/contests/abc349/editorial/9771)
- [ABC349 F 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-subset-transforms`
