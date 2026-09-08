---
title: "指定次数parityの部分グラフ構成"
description: "前提から指定次数parityの部分グラフ構成を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 152
---

# 指定次数parityの部分グラフ構成

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: Euler trail・circuit
- この位置で学ぶ理由: Euler trail・circuitで得た考え方と実装を再利用し、指定次数parityの部分グラフ構成の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 指定次数parityの部分グラフ構成

選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。

検索語: T-join、degree parity subgraph、次数偶奇部分グラフ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)

#### このOutcomeを支える根拠

- exactly K個のlampをonにできるか判定し、可能ならM回以下のedge操作列を構成できる。

#### 観察

- 一edge操作は両端lampをtoggleするため、各connected component内のon個数parityは常に偶数である。size sのcomponentで到達可能な最大on数は最大の偶数2floor(s/2)で、全component合計をYとする。

#### 候補を比較する

- **採用**: DFS forestの帰りがけに必要なparent edgeだけ使い、on数がKになった時点で止める — 各edgeを高々一度使い、on数を0からYまで0または2ずつ単調に増やす構成が得られる。
- **棄却**: 任意edgeを選ぶ状態空間BFS — lamp状態は2^N通りで、N=2×10^5では探索できない。

#### 鍵となる着眼

- postorderで非root頂点vがoffならparent edgeをtoggleしてvをonに固定してからvを切り離す。この操作はvをoff→on、parentをtoggleするので全体on数は0または2増え、component終了時にはroot以外全てon、parityによりちょうど2floor(s/2)個onになる。

#### アルゴリズムへ接続する

全componentでDFS spanning treeとparent edgeを記録しY=Σ2floor(size/2)を計算する。Kが奇数またはK>YならNo。そうでなければ各treeをpostorder走査し、v≠rootがoffならparent edge IDを答えへ追加して両端stateをtoggleする。on countがKになった瞬間に停止してedge列を出す。


## 転用するときの確認

- **parity invariant**: 一操作が各component内のbitを二つ反転する。 適用: on個数の偶奇が0から変わらないことを必要条件として使う。
- **spanning tree上のleaf elimination**: 任意graphでedge操作構成が必要だがcycleは不要である。 適用: DFS treeを葉から処理し、各非root頂点の最終stateをparent edge一回で確定する。
- 単調な構成processが到達値を刻み幅ごとに通過するなら、途中停止で全中間目標を実現できる。
- 孤立頂点、奇数/偶数size componentの混在、K=0・Y、parentがonのため増分0となるstepをsimulationして最終個数を確認する。

## 到達確認

### 到達確認 1 — 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)

**課題**: ABC345 F「Many Lamps」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- exactly K個のlampをonにできるか判定し、可能ならM回以下のedge操作列を構成できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC345 F 公式解説](https://atcoder.jp/contests/abc345/editorial/9558)
- [ABC345 F 公式問題文](https://atcoder.jp/contests/abc345/tasks/abc345_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-degree-parity-subgraph`
