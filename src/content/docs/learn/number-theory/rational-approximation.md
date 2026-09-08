---
title: "連分数・Stern–Brocotで有理近似する"
description: "前提から連分数・Stern–Brocotで有理近似するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 44
---

# 連分数・Stern–Brocotで有理近似する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。

### この単元では扱わない範囲

- 整除性や一次不定方程式の可解判定だけを行う問題、および合同類をCRTで統合する構成。

## 発動条件と見分け方

### 連分数・Stern–Brocot有理近似

Euclidの商列またはStern–Brocot区間を辿り、分母制約下の最良有理近似を求める。

検索語: Farey sequence、Stern–Brocot木、continued fraction、連分数

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる

題材: [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)

#### このOutcomeを支える根拠

- 全consecutive subarraysのmediant insertion minimum countsをcompressed fraction treeで合計できる。

#### 観察

- 隣接pairsの和を挿入する操作はStern–Brocot treeのinterval nodeでmediantを生成する操作そのもので、追加可能な(p,q)はprimitive pair gcd(p,q)=1である。
- あるStern–Brocot interval nodeの操作がsubarray Tに必要なのは、そのopen interval内にTのtarget fractionが一つ以上存在するときである。

#### 候補を比較する

- **採用**: 全targetsをfraction順にStern–Brocot intervalへ再帰分割し、各nodeを必要とするposition集合からsubarray数を数え、unary descentはまとめてskipする。 — 必要なtree部分だけを圧縮構築し、position setsをsmall-to-large mergeすることで全nodesの寄与を集約できる。
- **棄却**: 各subarrayについて必要なfractionsを一つずつStern–Brocot tree上で辿り、操作集合のunion sizeを求める。 — subarrayがΘ(N^2)個あり、単一fractionのdepthも座標値に比例し得る。

#### 鍵となる着眼

- node interval内targetのoriginal indicesをsorted set Pとすると、そのnodeが必要なsubarraysは全subarraysからPを一つも含まないindex-gap内subarraysを引いて求められる。
- targetsが片側childにしか入らない連続区間では、fraction boundsへ同じendpointをk回加える形をbinary searchし、そのk nodesは同じposition set寄与として一括加算できる。

#### アルゴリズムへ接続する

mediant insertion costをcompressed Stern–Brocot trie上のancestor-union countへ写し、ordered-position set mergingで全consecutive subarraysへのnode寄与を合計する。


## 転用するときの確認

- **Stern–Brocot treeと連分数的skip**: coprime positive pairsがmediant operationsで生成され、naive tree depthが座標値まで伸びるとき。 適用: 各nodeでtargetsを左右へ再帰分割し、全targetsが同じ側にある最大連続step数はinterval boundsからまとめて進める。
- **position集合のsmall-to-large merge**: 再帰tree各nodeでdescendant itemsのoriginal positions集合に依存する統計を求めたいとき。 適用: 小さいordered setを大きいsetへ挿入し、隣接gapの変化からnodeのsubarray coverageを維持する。
- 定義がimpossible caseを0にする集計では、invalid elementを含むrangesを単に除外し、valid runsへ分割する。
- 生成操作がmediantなら、各targetまでの共通操作列をStern–Brocot treeのancestor setsとして共有する。
- implicit treeの長いunary chainは、一方へ分岐し続ける最大stepを数論式でまとめて進める。

## 到達確認

### 到達確認 1 — Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる

転移題材: [ABC333 G「Nearest Fraction」](https://atcoder.jp/contests/abc333/tasks/abc333_g)

**課題**: ABC333 G「Nearest Fraction」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 0≤p≤q≤Nかつgcd(p,q)=1の中から、rへの絶対誤差が最小でtie時に値が小さいp/qを求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 0≤p≤q≤Nかつgcd(p,q)=1の中から、rへの絶対誤差が最小でtie時に値が小さいp/qを求められる。

- 対象技能が担う箇所: 0≤p≤q≤Nかつgcd(p,q)=1の中から、rへの絶対誤差が最小でtie時に値が小さいp/qを求められる。
- 転移題材の解法接続: 小数文字列から整数Rと10の冪Dを作りgcdで約分する。Euclid法で連分数係数を順に得つつconvergentの分子分母を更新し、次の完全convergentが分母Nを超える箇所では係数をfloor((N-q_prevprev)/q_prev)までに切って左右候補を構成する。|R/D-p/q|を整数cross積で比較し、tieは小さいp/qを選ぶ。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

</details>


## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC333 G 公式解説](https://atcoder.jp/contests/abc333/editorial/7937)
- [ABC333 G 公式問題文](https://atcoder.jp/contests/abc333/tasks/abc333_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-rational-approximation`
