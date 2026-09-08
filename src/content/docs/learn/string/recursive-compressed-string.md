---
title: "圧縮・反復・再帰文字列へ問い合わせる"
description: "前提から圧縮・反復・再帰文字列へ問い合わせるを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 109
---

# 圧縮・反復・再帰文字列へ問い合わせる

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。

### この単元では扱わない範囲

- 明示された文字列への接尾辞索引の構築。

## 発動条件と見分け方

### 再帰・圧縮・入れ子文字列の走査

明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。

検索語: compressed strings、圧縮文字列

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる

題材: [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)

#### このOutcomeを支える根拠

- g(T,k)がf(S,N)のsubsequenceとなる最大非負整数kを求められる。

#### 観察

- kを大きくしてg(T,k)がsubsequenceでなくなれば、それ以上も不可能なので答えは単調判定を二分探索できる。固定kではTの各文字をk回ずつ、f(S,N)内の最早位置へgreedy matchingすればよい。

#### 候補を比較する

- **採用**: 文字別出現位置と周期countを使うsubsequence判定＋k二分探索 — 巨大なS^Nを構築せず、各T文字についてk個先の出現をO(log |S|)またはO(1)算術で飛べる。
- **棄却**: f(S,N)とg(T,k)を実際に生成する — Nは10^12で繰返し文字列長が巨大になりmemory/timeとも不可能である。

#### 鍵となる着眼

- 現在absolute位置a以降で文字cのb回目出現は、S一周期内のc個数cnt_cでfull cyclesをまとめ、S+S内の出現位置またはposition vectorのlower_boundで残りを決められる。最早出現を選ぶgreedyは後続に最大の余地を残す。

#### アルゴリズムへ接続する

S内の各文字の出現positionを前計算し、TにS不在文字があれば0を返す。feasible(k)ではpos=0から各c∈Tについて、pos mod |S|以降のc出現数、必要なfull cycle数、周期内indexを算術とbinary searchで求めてposをk個目の直後へ進め、pos≤N|S|か判定する。0…floor(N|S|/|T|)で最大kを二分探索する。


## 転用するときの確認

- **周期文字列上のk-th occurrence jump**: 有限base stringの巨大反復上で、指定文字の多数回先の出現位置が欲しい。 適用: 一周期countで商を飛ばし、周期内position listで余りを定位する。
- **答えの二分探索**: k回のblock反復がsubsequenceなら、それより小さい回数も必ずsubsequenceである。 適用: feasible(k)を単調predicateとして最大の真を探す。
- 似た二種類のrepeat定義は展開順序を明示し、要求run単位のjumpへ合わせる。
- TにS不在文字、k=0、S一周期境界を跨ぐrun、同じ文字が疎なSを小さい反復文字列の直接matchingと比較する。

## 到達確認

### 到達確認 1 — 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる

転移題材: [ABC350 F「Transpose」](https://atcoder.jp/contests/abc350/tasks/abc350_f)

**課題**: ABC350 F「Transpose」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 全matched parenthesis操作後に一意に得られる最終文字列をO(|S|)で構成できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全matched parenthesis操作後に一意に得られる最終文字列をO(|S|)で構成できる。

- 対象技能が担う箇所: 全matched parenthesis操作後に一意に得られる最終文字列をO(|S|)で構成できる。
- 転移題材の解法接続: stackで全parenthesis pair matchを求める同時にdepthを走査し、letterはdepth oddならcase toggleして保存する。i=0,dir=+1から、letterなら出力、parenthesisならi=match[i],dir=-dirとし、その後i+=dirする。範囲外へ出るまで続ける。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

</details>


## 根拠

- [ABC346 F 公式解説](https://atcoder.jp/contests/abc346/editorial/9644)
- [ABC346 F 公式問題文](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC350 F 公式解説](https://atcoder.jp/contests/abc350/editorial/9820)
- [ABC350 F 公式問題文](https://atcoder.jp/contests/abc350/tasks/abc350_f)
- [ABC417 G 公式解説](https://atcoder.jp/contests/abc417/editorial/13580)
- [ABC417 G 公式問題文](https://atcoder.jp/contests/abc417/tasks/abc417_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-recursive-compressed-string`
