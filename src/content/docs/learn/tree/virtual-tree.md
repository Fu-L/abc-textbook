---
title: "virtual tree・auxiliary tree"
description: "前提からvirtual tree・auxiliary treeを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 179
---

# virtual tree・auxiliary tree

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: ancestor query・LCA、Euler順による部分木区間化
- この位置で学ぶ理由: ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### virtual tree・auxiliary tree

選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。

検索語: auxiliary tree、virtual tree、仮想木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる

題材: [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g)

#### このOutcomeを支える根拠

- 連結な非空誘導subtreeで、degree 1の全頂点が同色となるvertex subset数をmod 998244353で求められる。

#### 観察

- 頂点数2以上の連結誘導subtreeは少なくとも二つのleafを持ち、その共通色cは一意である。色cを固定すると、使われ得るbranch端は色c頂点だけで、必要な分岐関係はそれらとLCAからなるvirtual treeへ圧縮できる。

#### 候補を比較する

- **採用**: 色ごとにvirtual treeを構築し、leaf条件を数える木DPを行う — 色cの出現数mに対しO(m)頂点へ縮約でき、全色のvirtual treeサイズ総和をO(N)に抑えられる。
- **棄却**: 各色について元のN頂点tree全体をDPする — 色数がO(N)あり、合計O(N^2)になる。

#### 鍵となる着眼

- virtual treeで親辺も選ばれるopen状態g_vを考える。子branch選択積P=∏(1+g_child)、ちょうど一子を選ぶ和Q=Σg_childとすると、親接続時は子0ならvがleafなのでg_v=(P-1)+[A_v=c]。vをtopmostとする閉subtreeは子1の時だけvの色条件が必要で、(P-1-Q)+[A_v=c]Qとなる。

#### アルゴリズムへ接続する

元treeをEuler tourしLCA前計算する。各色cの頂点をtin順に並べ隣接LCAを追加・再sortしてstackでvirtual treeを作る。postorderでP,Q,gを計算し、各vのclosed countを色cの答えへ加算する。全色分のsize≥2 subtree数を合計し、degree 0で条件を満たすN個のsingletonを一度だけ加える。


## 転用するときの確認

- **virtual tree**: 特定色の頂点間の祖先・分岐関係だけが必要で、全元頂点を色ごとに走査したくない。 適用: 対象頂点と隣接Euler順LCAを残し、元pathを圧縮辺にする。
- **境界degreeを持つ木DP**: connected subtreeのleafだけにmark条件があり、親辺を選ぶかで頂点degreeが変わる。 適用: 親へopenな状態とtopmostで閉じる寄与を分け、選択child数0・1・2以上を積と一次和で集計する。
- path内部が制約対象外のdegreeになる場合、terminalとbranching LCAだけを残す圧縮が数え上げも保つ。
- N=1、pathで両端同色/異色、starで選ぶleaf色、同色頂点一つ、virtual edgeが長い例を全subset列挙と比較する。

## 到達確認

### 到達確認 1 — 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる

境界検証の元題材: [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g)

**課題**: ABC340 G「Leaf Color」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 連結な非空誘導subtreeで、degree 1の全頂点が同色となるvertex subset数をmod 998244353で求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC340 G 公式解説](https://atcoder.jp/contests/abc340/editorial/9249)
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-virtual-tree`
