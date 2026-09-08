---
title: "rake・compressで動的木DPを保つ"
description: "前提からrake・compressで動的木DPを保つを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 213
---

# rake・compressで動的木DPを保つ

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 根付き木DP・部分木集約
- この位置で学ぶ理由: 木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。

### この単元では扱わない範囲

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 発動条件と見分け方

### Static Top Treeによる動的木DP

境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。

検索語: Static Top Tree、Top Tree、rake-compress tree

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる

題材: [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)

選定理由: point cluster は virtual root 配下の子積、path cluster は遠端に値 x の subtree を接続したとき近端 hash が ax+b になる二係数を持てば、rake は積、compress は affine composition にできる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 任意形状の固定木に対する hash 木 DP を平衡 cluster 計算へ載せ、構築 O(N log N) 以内・各更新 O(log N) で処理できる。

#### 観察

- 一回の A_v 更新が通常の木 DP f(v)=A_v+∏f(child) を変えるのは v の祖先全体で、鎖なら深さ N、星なら一頂点再計算に次数 N がかかる。単純な祖先更新では両方を同時に避けられない。
- 木 DP は vertex/add-edge/rake/compress という cluster の結合演算として表せ、根側・遠端側の boundary を持つ path cluster の作用は affine function ax+b に閉じる。

#### 候補を比較する

- **採用**: 重さで平衡化した Static Top Tree に木 DP の cluster 情報を載せ、葉 A_v 更新から根まで再計算する。 — merge tree の深さが O(log N) で各 cluster 合成が定数時間なので、任意形状の木でも一点更新・全体値取得を O(log N) にできる。
- **棄却**: 更新頂点から根まで f を再計算し、各親で全子の積を取り直す。 — 鎖の祖先数または高次数頂点の子走査が O(N) になり、Q=2×10^5 で O(NQ) に達する。

#### 鍵となる着眼

- point cluster は virtual root 配下の子積、path cluster は遠端に値 x の subtree を接続したとき近端 hash が ax+b になる二係数を持てば、rake は積、compress は affine composition にできる。
- HLD の heavy path と light subtrees を単なる segment tree 連鎖にせず、cluster 含有頂点数で二分 merge を平衡化することで全 merge tree 深さを O(log N) にする。

#### アルゴリズムへ接続する

元木を heavy/light 分解し、path cluster の compress と point cluster の rake を頂点数 balance で組み上げた Static Top Tree を構築する。各 leaf vertex に A_v を持たせ、五種の cluster constructor/merge で hash 情報を計算する。query では leaf を更新し merge-tree 祖先だけ再計算し、root cluster の値を出力する。


## 転用するときの確認

- **Static Top Tree による動的木 DP**: 木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。 適用: 木を深さ O(log N) の二分 cluster merge tree に変換し、DP 合成則を載せる。
- **path cluster の affine 作用**: 一つの未確定 boundary 値を通じて cluster 外部と接続し、DP 式が一次式に閉じるとき。 適用: cluster を ax+b として表し、compress を関数合成にする。
- 静的構造・動的ラベルの全体 DP では、再計算依存 DAG を balance できないか考える。
- まず五つの cluster 操作ごとに情報の意味を式で検証し、その後に平衡化へ進む。特に葉の例と一子の鎖で affine 係数を手計算する。

## 到達確認

### 到達確認 1 — 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる

転移題材: [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g)

**課題**: ABC460 G「Vertex Flip Query」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 頂点flipを伴う任意root tree DP queryを、方向付きstatic top treeで更新・取得とも対数時間に処理できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 頂点flipを伴う任意root tree DP queryを、方向付きstatic top treeで更新・取得とも対数時間に処理できる。

- 対象技能が担う箇所: 頂点flipを伴う任意root tree DP queryを、方向付きstatic top treeで更新・取得とも対数時間に処理できる。
- 転移題材の解法接続: compress/rake等でstatic top treeを構築し、問題のvertex stateに対するpath/point cluster DPと両方向merge式を定義する。flipでleaf値を反転してcluster祖先を更新し、query root v周囲をcoverするcluster要約を方向を揃えてmergeして答える。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

</details>


## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 G 公式解説](https://atcoder.jp/contests/abc460/editorial/21012)
- [ABC460 G 公式問題文](https://atcoder.jp/contests/abc460/tasks/abc460_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-static-top-tree`
