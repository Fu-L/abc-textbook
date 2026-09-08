---
title: "graph core・leaf peeling"
description: "前提からgraph core・leaf peelingを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 138
---

# graph core・leaf peeling

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- graph core・leaf peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### graph core・leaf peeling

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。

検索語: 2-core、graph peeling、葉刈り

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC266 F「Well-defined Path Queries on a Namori」](https://atcoder.jp/contests/abc266/tasks/abc266_f)

選定理由: leaf pruning後に残る2-coreはこのグラフでは唯一のcycleそのものである。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。連結unicyclic graphの唯一cycle上の頂点を求めたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- なもりグラフの二頂点間simple pathが一意かを、cycle根componentの一致で即答できる。

#### 観察

- 連結N頂点N辺の無向グラフは閉路をちょうど一つ持ち、その各閉路頂点へ木が付いたなもりグラフである。
- 同じ閉路頂点に付く木の中の二頂点間は一意pathだが、異なる閉路根に属すれば閉路を回る二方向がある。

#### 候補を比較する

- **採用**: 次数1頂点を反復削除してcycle頂点を抽出し、各cycle頂点からcycle辺を越えない探索で全頂点へ根labelを付ける。 — queryの一意性は二頂点の所属cycle根labelが等しいかだけで判定できる。
- **棄却**: 各queryで一方からDFSし、単純pathを二本以上見つけるまで探索する。 — Q回の全グラフ探索は大きく、単純path列挙自体も不要である。

#### 鍵となる着眼

- leaf pruning後に残る2-coreはこのグラフでは唯一のcycleそのものである。

#### アルゴリズムへ接続する

unicyclic graphをcore cycleとrooted-tree componentsへ分解し、path multiplicity queryをcomponent label equalityへ圧縮する。


## 転用するときの確認

- **次数1除去によるcycle抽出**: 連結unicyclic graphの唯一cycle上の頂点を求めたいとき。 適用: degree 1をqueueへ入れ、削除に伴い新たにdegree 1になった頂点を反復処理する。
- **core頂点を根とする成分labeling**: cycleやcoreの各頂点に木が付いた構造で、どの根へ属すかを多数照会するとき。 適用: 各core頂点を異なるsourceとして、core間辺を使わずDFS/BFSしてroot labelを配る。
- core+branches分解ではcore要素も各branch componentの代表として含めると境界caseを統一できる。
- N頂点N辺の連結グラフを見たら、唯一cycleと付属木へ分解してqueryの本質を探す。
- path本数を直接数えず、cycleへ入るrootが同じかどうかで代替できないか確認する。

## 到達確認

### 到達確認 1 — 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)

**課題**: ABC267 E「Erasing Vertices 2」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 単調な頂点peeling: 頂点削除により残存頂点の制約値が減少し、許可状態から不許可へ戻らないとき。 適用: 初期許可頂点をqueueへ入れ、削除差分で新たに許可された隣接頂点を追加する。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 単調な頂点peeling: 頂点削除により残存頂点の制約値が減少し、許可状態から不許可へ戻らないとき。 適用: 初期許可頂点をqueueへ入れ、削除差分で新たに許可された隣接頂点を追加する。

- 対象技能が担う箇所: 単調な頂点peeling: 頂点削除により残存頂点の制約値が減少し、許可状態から不許可へ戻らないとき。 適用: 初期許可頂点をqueueへ入れ、削除差分で新たに許可された隣接頂点を追加する。
- 転移題材の解法接続: minimize maximum elimination costをparametric searchへ変え、monotone eligibilityを持つweighted degeneracy peelingでfeasibilityを判定する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-graph-core`
