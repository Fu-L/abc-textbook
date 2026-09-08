---
title: "Stern–Brocot木の経路と祖先"
description: "前提からStern–Brocot木の経路と祖先を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 118
---

# Stern–Brocot木の経路と祖先

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: gcd不変量・差分構造
- この位置で学ぶ理由: gcd不変量・差分構造で得た考え方と実装を再利用し、Stern–Brocot木の経路と祖先の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Stern–Brocot木の経路と祖先の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Stern–Brocot木の経路と祖先

隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。

検索語: Stern Brocot ancestor、mediant、連分数経路

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 正当化と転用の境界

- 隣接するa/b<c/dのbc-ad=1を不変量にmediant(a+c)/(b+d)を挿入する。左右への一歩を巨大回数繰り返す代わりにEuclidの商で一括移動する。ABC273 Exでは必要な祖先集合を合併して数える工程までが対象で、分母上限の最良近似は求めていない。

### 例 1 — 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)

選定理由: node interval内targetのoriginal indicesをsorted set Pとすると、そのnodeが必要なsubarraysは全subarraysからPを一つも含まないindex-gap内subarraysを引いて求められる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。coprime positive pairsがmediant operationsで生成され、naive tree depthが座標値まで伸びるとき。 問題全体への接続は併用技能を学んだ後に読む。

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

### 到達確認 1 — 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)

**課題**: ABC273 Ex「Inv(0,1)ving Insert(1,0)n」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全consecutive subarraysのmediant insertion minimum countsをcompressed fraction treeで合計できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-stern-brocot-ancestry`
