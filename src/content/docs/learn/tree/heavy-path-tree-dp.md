---
title: "heavy pathによる木DP高速化"
description: "前提からheavy pathによる木DP高速化を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 187
---

# heavy pathによる木DP高速化

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 根付き木DP・部分木集約
- この位置で学ぶ理由: 根付き木DP・部分木集約で得た考え方と実装を再利用し、heavy pathによる木DP高速化の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- heavy pathによる木DP高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### heavy pathによる木DP高速化

heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。

検索語: HLRecDP、heavy-path tree DP

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)

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

転移題材: [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)

**課題**: ABC311 Ex「Many Illumination Plans」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: O(NX²) の木 knapsack merge を重軽再帰へ転換し、全根の答えを O(N^{log2 3}X)、空間 O(X log N) で列挙できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- O(NX²) の木 knapsack merge を重軽再帰へ転換し、全根の答えを O(N^{log2 3}X)、空間 O(X log N) で列挙できる。

- 対象技能が担う箇所: O(NX²) の木 knapsack merge を重軽再帰へ転換し、全根の答えを O(N^{log2 3}X)、空間 O(X log N) で列挙できる。
- 転移題材の解法接続: 部分木サイズから heavy child を決める。dfs(c,dp) で c を残す/削る場合の配列を O(X) で作り、heavy child は共有できる一方の経路を一回、各 light child は必要な二状態へ再帰させる。根1で全 heavy path を構成した後、各 heavy path 根から初期配列を渡すことで、その path 上の全 v の F(v) を同時に回収する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC269 H 公式解説](https://atcoder.jp/contests/abc269/editorial/4838)
- [ABC269 H 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC311 H 公式解説](https://atcoder.jp/contests/abc311/editorial/6814)
- [ABC311 H 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-heavy-path-tree-dp`
