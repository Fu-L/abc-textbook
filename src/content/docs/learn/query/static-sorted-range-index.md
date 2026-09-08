---
title: "静的sorted range index・Merge Sort Tree"
description: "前提から静的sorted range index・Merge Sort Treeを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 175
---

# 静的sorted range index・Merge Sort Tree

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: Segment Treeのcanonical区間分解
- この位置で学ぶ理由: Segment Treeのcanonical区間分解で得た考え方と実装を再利用し、静的sorted range index・Merge Sort Treeの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 静的sorted range index・Merge Sort Tree

各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。

検索語: Merge Sort Tree、merge sort tree、静的range tree

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g)

#### このOutcomeを支える根拠

- 前回答で暗号化された各online queryを復号し、A_L…A_RのうちX以下の値の総和を順に出力できる。

#### 観察

- queryはindex区間[L,R]と値上限Xの二次元条件を持つ。index区間をsegment treeのO(log N) nodeへ分解し、各node内で値≤Xの総和を返せればonlineに答えられる。

#### 候補を比較する

- **採用**: 各segment nodeにsorted valuesとprefix sumsを持つmerge-sort tree — 更新がなく、queryごとにO(log N) node×binary searchでO(log^2 N)に処理でき、前回答依存のonline復号にも対応する。
- **棄却**: queryをX順にoffline sortしてFenwick treeで答える — 次queryのL,R,Xが前answerとのXORで初めて判明するため、全queryを事前に並べ替えられない。

#### 鍵となる着眼

- 完全被覆nodeではsorted配列にupper_bound(X)を行い、そのindexまでのprefix sumを返せば、値≤Xの要素だけの和になる。segment分解されたnodeはindex集合が互いにdisjointなので和を単純加算できる。

#### アルゴリズムへ接続する

segment treeをbottom-upに構築し、各nodeで子のsorted listをmergeして同長のprefix sumを作る。prev=0から各encrypted queryをL=α xor prev等で復号し、[L,R]を被覆するnodeごとにupper_bound(X)とprefix参照を行って合計し、それを出力してprevへ代入する。


## 転用するときの確認

- **merge-sort tree**: 静的配列に対しindex範囲と値thresholdを同時に指定するqueryが多数ある。 適用: segment tree各nodeへ区間要素のsorted列と累積和を保存する。
- **online range query**: 次のquery parameterが直前のanswerに依存する。 適用: 事前並べ替えに頼らないdata structureで、入力順に復号・回答する。
- sorted bucket型range treeは、bucket内prefix aggregateを持つとthreshold以下のsumへ拡張できる。
- Xが全要素未満・以上、L=R、重複値、prevが大きくbitを跨ぐqueryをnaive filterと比較する。

## 到達確認

### 到達確認 1 — 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g)

**課題**: ABC339 G「Smaller Sum」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 前回答で暗号化された各online queryを復号し、A_L…A_RのうちX以下の値の総和を順に出力できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-static-sorted-range-index`
