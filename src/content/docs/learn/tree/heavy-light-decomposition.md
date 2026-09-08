---
title: "Heavy-Light Decomposition"
description: "前提からHeavy-Light Decompositionを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 166
---

# Heavy-Light Decomposition

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: ancestor query・LCA、Euler順による部分木区間化
- この位置で学ぶ理由: ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、Heavy-Light Decompositionの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Heavy-Light Decompositionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Heavy-Light Decomposition

木上pathをO(log N)本の連続区間へ分解し、配列data structure上のqueryへ変換する。

検索語: HLD、HL分解、Heavy-Light Decomposition

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる

題材: [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)

選定理由: point cluster は virtual root 配下の子積、path cluster は遠端に値 x の subtree を接続したとき近端 hash が ax+b になる二係数を持てば、rake は積、compress は affine composition にできる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 重軽分解

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

### 到達確認 1 — heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる

境界検証の元題材: [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)

**課題**: ABC351 G「Hash on Tree」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 重軽分解

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-heavy-light-decomposition`
