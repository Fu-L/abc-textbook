---
title: "heavy path上の多項式木DP"
description: "前提からheavy path上の多項式木DPを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 194
---

# heavy path上の多項式木DP

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: NTT・FFTで畳み込みと相互相関を求める、根付き木DP・部分木集約
- この位置で学ぶ理由: 畳み込み・相互相関・根付き木DP・部分木集約で得た考え方と実装を再利用し、heavy path上の多項式木DPの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### heavy path上の多項式木DP

heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。

検索語: heavy-path polynomial DP、heavy-path tree DP

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 正当化と転用の境界

- ABC269 Exではheavy path上の多項式漸化式を積と合成へまとめ、畳み込みと分割統治で評価する。必要なのは通常の多項式積を高速化できる代数構造であり、一般のmax-plus convolutionをNTTへ置き換えることはできない。

### 例 1 — heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)

選定理由: heavy path上でg_iをlight childrenのfの積と置くと f_i=x+g_i f_{i+1} となり、path先頭のfはprefix productsの和としてまとめて計算できる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。subtreeごとの選び方が子間で独立に直積され、選択個数別の全答えが必要なとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 全サイズKのtree antichain数をheavy-path polynomial DPで一括計算できる。

#### 観察

- subtree vのantichain generating functionをempty set込みでf_v(x)とすると、vを選ぶ場合はxだけ、選ばない場合は各childから独立に選べるため f_v=x+∏f_child となる。
- このtree DPを素朴なpolynomial convolutionで行うと、細長い木やcentipede型で総次数処理が二乗に達する。

#### 候補を比較する

- **採用**: 最大subtreeのchildをheavyとし、各heavy pathではlight-child積g_iを使う一次元漸化式をdivide-and-conquer polynomial productsで評価する。 — light edgeを跨ぐ部分木サイズ総和がO(N log N)で、NTTによる積とpath評価を全体O(N log^3 N)に抑えられる。
- **棄却**: 各頂点で子のpolynomialを順に畳み込み、f_vを明示的に構築する。 — 部分木サイズに比例する配列を多数の祖先で作り直し、最悪Θ(N^2)となる。

#### 鍵となる着眼

- heavy path上でg_iをlight childrenのfの積と置くと f_i=x+g_i f_{i+1} となり、path先頭のfはprefix productsの和としてまとめて計算できる。
- light edgeを子側へ渡るたびsubtree sizeは半分以下なので、light-rooted subproblemのサイズ総和には対数回分しか課金されない。

#### アルゴリズムへ接続する

antichainのtree generating-function DPをheavy pathsへ分解し、path recurrenceをNTT付きdivide and conquer、light subtreesをsize-aware mergingで合成する。


## 転用するときの確認

- **木DPの母関数化**: subtreeごとの選び方が子間で独立に直積され、選択個数別の全答えが必要なとき。 適用: 係数[x^K]をK頂点のantichain数とするpolynomialを持ち、子の独立選択を積で表す。
- **heavy-path分解によるDP高速化**: tree DPの大きな状態を最大childへ再利用し、それ以外のsubtree処理だけを対数回に償却できるとき。 適用: heavy childのpath representationをmoveし、light childrenの結果だけをpolynomialとしてmergeする。
- **NTTと分割統治積**: 多数のpolynomial積やprefix-product weighted sumを次数準線形で求める必要があるとき。 適用: heavy pathのg列とlight-child polynomialsをproduct treeで畳み込む。
- 長いchain上のaffine recurrenceは、係数の区間積とweighted sumを組にしてdivide and conquerで合成する。
- tree polynomial DPが二乗になるときは、最大childに沿うchainだけを残してlight subproblemsへ計算量を課金する。
- chain recurrenceは各頂点を逐次展開せず、区間を表す積と和が結合的にmergeできるかを見る。

## 到達確認

### 到達確認 1 — heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)

**課題**: ABC269 Ex「Antichain」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全サイズKのtree antichain数をheavy-path polynomial DPで一括計算できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC269 H 公式解説](https://atcoder.jp/contests/abc269/editorial/4838)
- [ABC269 H 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-heavy-path-tree-dp`
