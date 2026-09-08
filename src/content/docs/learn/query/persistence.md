---
title: "永続data structure・structural sharing"
description: "前提から永続data structure・structural sharingを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 176
---

# 永続data structure・structural sharing

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 永続data structure・structural sharing

変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。

検索語: path copying、persistent data structure、永続データ構造

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC273 E「Notebook」](https://atcoder.jp/contests/abc273/tasks/abc273_e)

選定理由: DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。push/popで変化する列の過去versionへ何度も戻りたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- SAVE/LOAD可能なsequenceを全version共有で管理し、各queryを定数期待時間で処理できる。

#### 観察

- sequence AへのADD/DELETEはstackのpush/popであり、SAVE時に必要なのは全要素のcopyではなくそのversionのtopを指す参照だけである。
- 各ADDで現在topをparentに持つimmutable nodeを一つ作れば、root-to-current pathがその時点のAを表し、過去versionも壊れない。

#### 候補を比較する

- **採用**: parent pointer付きnodeでpersistent stackを作り、page→top-nodeのmapだけを保存する。 — 各queryがnode一個の追加またはpointerの移動・保存だけになり、過去状態を共有できる。
- **棄却**: SAVEごとにsequence全体をnotebook pageへcopyし、LOADで復元する。 — sequence長とSAVE回数の積が二乗になり、memoryもtimeもQ=50万を扱えない。

#### 鍵となる着眼

- DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。
- value −1のsentinel rootをempty sequenceとすれば、emptyでのDELETEと出力−1を条件分岐なしに統一できる。

#### アルゴリズムへ接続する

versioned sequence operationsをstructural sharingするpersistent linked stackとして表し、notebook pagesをversion pointersにする。


## 転用するときの確認

- **永続stackとstructural sharing**: push/popで変化する列の過去versionへ何度も戻りたいとき。 適用: 各push nodeへvalueとprevious topを持たせ、version間で共通prefixを共有する。
- **疎なkey状態の連想配列**: key universeは巨大だが実際に保存・参照されるkey数がquery数以下のとき。 適用: 10^9 pagesを配列化せず、SAVEされたpageだけをmapでtop pointerへ対応させる。
- snapshot保存はdata本体ではなくimmutable representationのroot handleだけを記録する。
- 過去状態への復帰があるpush/pop列は、各状態をroot-to-node pathで表してsnapshotをpointer一つにする。
- 巨大なlogical address spaceでも実際に触れるkeysが少なければsparse mapで表す。

## 到達確認

### 到達確認 1 — 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g)

**課題**: ABC453 G「Copy Query」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 多数の配列copyと独立更新を、永続segment treeのroot共有で対数時間・省メモリに処理できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 多数の配列copyと独立更新を、永続segment treeのroot共有で対数時間・省メモリに処理できる。

- 対象技能が担う箇所: 多数の配列copyと独立更新を、永続segment treeのroot共有で対数時間・省メモリに処理できる。
- 転移題材の解法接続: 初期配列からrootを構築する。type1で roots[X]=roots[Y]、type2で persistent pointUpdate(roots[X],p,v) の新rootを代入、type3で rangeQuery(roots[X],l,r) を返す。node poolを配列で確保する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC273 E 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_e)
- [ABC273 E 公式解説](https://atcoder.jp/contests/abc273/editorial/5023)
- [ABC453 G 公式解説](https://atcoder.jp/contests/abc453/editorial/18526)
- [ABC453 G 公式問題文](https://atcoder.jp/contests/abc453/tasks/abc453_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-persistence`
