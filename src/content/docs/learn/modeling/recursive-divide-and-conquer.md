---
title: "再帰分割・分割統治"
description: "前提から再帰分割・分割統治を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 132
---

# 再帰分割・分割統治

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 再帰分割・分割統治

pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。

検索語: CDQ分割統治、divide and conquer、分割統治

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる

題材: [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h)

#### このOutcomeを支える根拠

- subarray minimumと非負sumの複合閾値を、minimum pivot分割・短辺列挙・prefix二分探索で数えられる。

#### 観察

- B_i≥0なのでprefix sum PBは非減少で、区間minimumが固定されればsumB≤S-minという条件の相手endpoint範囲を二分探索できる。
- 区間[L,R]のA最小位置Mを選ぶと、Mを含む全subarrayのminimumはA_Mに固定され、残りは左右再帰へ重複なく分割できる。

#### 候補を比較する

- **採用**: range minimum位置でdivide-and-conquerし、Mを含むintervalは短い側のendpointだけ列挙して、長い側の有効範囲をPB上のbinary searchで数える。 — minimumの変化を消し、各indexの列挙回数をsmall-side規則で対数回に抑えられる。
- **棄却**: 全(l,r)を列挙し、RMQとprefix sumで条件を定数/対数時間判定する。 — interval自体が二次個あるためN≤2×10^5に間に合わない。

#### 鍵となる着眼

- l≤M≤rなら条件はPB[r]-PB[l-1]≤S-A_Mとなり、l固定ではrのvalid集合がprefix、r固定ではlのvalid集合がsuffixになる。
- [L,M]と[M,R]の短い方だけendpointを固定すると、再帰treeで各indexが短い側に入るたび担当区間sizeが少なくとも半減する。
- 最小位置で左右へ再帰すれば、各subarrayはその最小要素を代表とするnodeで一度だけcross intervalとして数えられる。

#### アルゴリズムへ接続する

RMQまたはmin Cartesian treeで各区間の最小位置Mを得る。leftが短ければ各l∈[L,M]についてPB上で最大r∈[M,R]を探し、rightが短ければ各rについて最小lを探す。cross数を加え、[L,M-1],[M+1,R]へ再帰する。


## 転用するときの確認

- **minimum-pivot divide-and-conquer**: subarray costにminimum/maximumが含まれ、そのextremum位置を含む区間で値を固定できるとき。 適用: range最小位置をpivotにcross intervalを数え、左右へ再帰する。
- **smaller-side enumeration**: divide-and-conquerのpivotが偏り得るが、cross pairの片側endpointだけ列挙できるとき。 適用: 短い側を走査して各要素の担当回数を対数に抑える。
- **monotone prefix sum binary search**: 非負列の区間和上限からendpointの境界を求めるとき。 適用: 非減少PBにlower/upper_boundしてvalid endpoint数を取る。
- extremumと加法量が混ざる区間条件では、extremumを固定する分割とprefix sum queryを組み合わせる。
- 同じminimumが複数ある列でtie規約を固定し、あるsubarrayがどのpivot nodeで一度だけ数えられるかCartesian tree上で確認する。

## 到達確認

### 到達確認 1 — pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる

転移題材: [ABC413 E「Reverse 2^i」](https://atcoder.jp/contests/abc413/tasks/abc413_e)

**課題**: ABC413 E「Reverse 2^i」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 指数的に見えるdyadic反転の到達集合から、再帰二分だけで辞書順最小permutationを構成できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 指数的に見えるdyadic反転の到達集合から、再帰二分だけで辞書順最小permutationを構成できる。

- 対象技能が担う箇所: 指数的に見えるdyadic反転の到達集合から、再帰二分だけで辞書順最小permutationを構成できる。
- 転移題材の解法接続: 長さ1ならその要素を返す。区間を等分して左右を再帰的に最小化し、left[0]<right[0]ならleft+right、逆ならright+leftを返す。根の結果を出力し、各levelでのcopyを含め O(N·2^N) とする。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

</details>


## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC282 H 公式解説](https://atcoder.jp/contests/abc282/editorial/5404)
- [ABC282 H 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_h)
- [ABC413 E 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_e)
- [ABC413 E 公式解説](https://atcoder.jp/contests/abc413/editorial/13406)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-recursive-divide-and-conquer`
