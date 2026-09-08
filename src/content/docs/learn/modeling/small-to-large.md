---
title: "small-to-large・DSU on Tree"
description: "前提からsmall-to-large・DSU on Treeを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 137
---

# small-to-large・DSU on Tree

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### small-to-large・DSU on Tree

小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。

検索語: DSU on Tree、sack technique、small-to-large

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g)

#### このOutcomeを支える根拠

- position suffix splitとvalue threshold splitが混在する全sequence生成を、短い側だけのelement移動で処理できる。

#### 観察

- 全sequenceは元permutation Aの部分列なので、各elementは一意な(original position,value)を持ち、sequence内順序はoriginal position順のままである。
- 各splitで2つに分かれるうち短い側だけのelementを別containerへ移し、長い側には既存containerを割り当てれば、1 queryの移動数をmin(両length)にできる。
- position splitとvalue splitの両方を扱うには、各sequenceで(position,value)をposition順とvalue順の2つのbalanced setに同期保持すればよい。

#### 候補を比較する

- **採用**: sequenceごとにposition順・value順の2 setを持ち、短いresult側だけを移すreverse small-to-large simulation。 — 各elementの移動回数を逆向きmergeの倍増論法でlog N回に抑え、両種類のsplitを同じ枠組みで処理できる。
- **棄却**: 各operationで新sequenceに属する全elementを常にsourceからコピー・削除する。 — 毎回大きい側が新sequenceになるcaseを繰り返すと同じ多数要素を何度も走査してNQ規模になる。
- **棄却**: 各sequenceをvectorとして保持し、type 2で全要素をvalue比較する。 — value thresholdがposition上で連続とは限らず、長いsequence全scanを避けられない。

#### 鍵となる着眼

- type 1ではprefix長min(x,L)とsuffix長L-min(x,L)が既知で、短い方をposition setの端から列挙できる。
- type 2ではvalue x以下とx超のsizeをorder-statisticまたは中央値管理で判定し、短い方をvalue setの端から列挙できる。
- 短い側が元sequence sに残る場合はcontainer handleを交換し、既存の大containerを新sequence iへ割り当てることで、仕様上のIDを保ったまま移動量を小さくする。

#### アルゴリズムへ接続する

各sequence handleにposition-ordered setとvalue-ordered setを持ち、element移動時は両方からeraseして相手containerへinsertする。type 1はcut=min(x,length)からprefix/suffixの小さい側をposition端から移す。type 2はvalue rankで≤x側と>x側のsizeを得て、小さい側をvalue端から移す。移動した側・残った側が仕様のs,iへ対応するようhandleを必要ならswapし、新sequence iのsizeを出力する。


## 転用するときの確認

- **reverse small-to-large**: partition操作列で毎回2集合のどちらかを新containerへ分離できるとき。 適用: 短い側だけを動かし、逆時間では小集合を大集合へmergeする倍増解析を使う。
- **複数key indexの同期管理**: 同じ要素集合を位置thresholdと値thresholdの両方で分割するとき。 適用: position setとvalue setを同時更新する。
- **container handle swap**: logical IDが要求する側と、物理的に残したい大container側が逆になるとき。 適用: pointer/handleだけ交換し、大量要素の移動を避ける。
- 分割操作が多い問題では逆時間のmergeとして見て、短いresultだけを物理移動する設計を検討する。
- 短い側がsourceに残るcaseでhandle swap後のsequence IDを追い、同じelementがposition/value setの両方で同じcontainerへ所属するか確認する。

## 到達確認

### 到達確認 1 — 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC329 F「Colored Ball」](https://atcoder.jp/contests/abc329/tasks/abc329_f)

**課題**: ABC329 F「Colored Ball」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 全ball移動query後のdestination boxのdistinct color数を、償却的なset mergeで出力できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全ball移動query後のdestination boxのdistinct color数を、償却的なset mergeで出力できる。

- 対象技能が担う箇所: 全ball移動query後のdestination boxのdistinct color数を、償却的なset mergeで出力できる。
- 転移題材の解法接続: 初期box iのsetへC_iを1つ入れる。query(a,b)でsize(set[a])>size(set[b])なら2つのset handleをswapする。その後set[a]の全colorをset[b]へinsertし、set[a]をclearする。size(set[b])を出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 小さいcontainerだけを大きいcontainerへ移し、各要素の移動先sizeが倍増することから総仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC324 G 公式解説](https://atcoder.jp/contests/abc324/editorial/7399)
- [ABC324 G 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_g)
- [ABC329 F 公式解説](https://atcoder.jp/contests/abc329/editorial/7729)
- [ABC329 F 公式問題文](https://atcoder.jp/contests/abc329/tasks/abc329_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-small-to-large`
