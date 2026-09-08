---
title: "ancestor query・LCA"
description: "前提からancestor query・LCAを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 130
---

# ancestor query・LCA

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: doubling・binary lifting
- この位置で学ぶ理由: doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### ancestor query・LCA

根付き木の祖先関係を時刻またはbinary liftingで索引化し、LCAと木上距離を答える。

検索語: LCA、ancestor query、最小共通祖先

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる

題材: [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)

#### このOutcomeを支える根拠

- 辺重み更新と任意二頂点距離質問を処理できる。

#### 観察

- 根から頂点への距離はEuler tourで辺を入る時+w、戻る時-wと置いたprefix和になり、辺更新は二点更新にできる。

#### 候補を比較する

- **採用**: Euler tour BITと静的LCA — 木形は固定なのでLCAを前計算し、動的根距離だけをBITで更新して距離公式へ代入できる。
- **棄却**: 各更新後に全頂点距離を再計算 — Q回のDFSでO(NQ)になる。

#### 鍵となる着眼

- d(u,v)=distRoot(u)+distRoot(v)-2distRoot(lca)により、動く重み情報と動かない祖先構造を分離できる。

#### アルゴリズムへ接続する

DFSで各辺の進入・退出時刻とLCA用tourを作る。重み変更はBITの+位置/-位置を差分更新し、距離質問は三頂点のprefix和とLCAから答える。


## 転用するときの確認

- **Euler tour差分**: 部分木へ共通に効く辺重みを動的更新する。 適用: 進入+、退出-のprefix和で根距離を得る。
- **LCA距離公式**: 木上二点距離を根距離へ分解する。 適用: 静的LCAと動的距離を結合する。
- 動的木距離は形と重みの役割を分離する。
- 小木で経路和と比較し、根隣接辺・同頂点・祖先子孫・同辺の反復更新を確認する。

## 到達確認

### 到達確認 1 — binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる

転移題材: [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h)

**課題**: ABC298 Ex「Sum of Min of Length」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 各L,RについてΣ_j min(d(j,L),d(j,R))を高速に求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 各L,RについてΣ_j min(d(j,L),d(j,R))を高速に求められる。

- 対象技能が担う箇所: 各L,RについてΣ_j min(d(j,L),d(j,R))を高速に求められる。
- 転移題材の解法接続: 根付き木のdep,sz,subtree depth sum,祖先sz累積とLCA/LAを前計算する。各質問でMを求め、部分木距離和関数をR側とL側に適用して補集合と合算する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

</details>


## 根拠

- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC298 H 公式解説](https://atcoder.jp/contests/abc298/editorial/6218)
- [ABC298 H 公式問題文](https://atcoder.jp/contests/abc298/tasks/abc298_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-tree-ancestor-lca`
