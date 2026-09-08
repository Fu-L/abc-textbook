---
title: "Segment Treeのcanonical区間分解"
description: "前提からSegment Treeのcanonical区間分解を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 161
---

# Segment Treeのcanonical区間分解

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 区間monoid要約
- この位置で学ぶ理由: 区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Segment Treeのcanonical区間分解

区間をO(log N)個のcanonical nodeへ分解し、range object・生存時間・range edgeを少数のnodeへ配置する。

検索語: Segment Tree canonical cover、canonical区間分解、segment tree graph、時間セグメント木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる

題材: [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h)

選定理由: 追加-only 集合は時刻 index の prefix なので、segment tree の range decomposition を使えば一つの query を O(log Q) 個の静的点集合 query へ分解できる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。固定点集合に対し、様々な方向 vector との最大内積を問うとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- segment tree of static structures: 時刻 prefix や index range ごとに、集合上の重い query を行いたいとき。 適用: 各 segment node に静的 data structure を前計算し、range を少数 node に分解する。

#### 観察

- Ax+By は query vector (A,B) と点 (x,y) の内積であり、最大値は点集合の convex hull 上で達成される。hull の頂点順では支持方向に対する内積が unimodal になる。
- i 回目に利用できる点は入力順 prefix [1,i] なので、online insertion と見なくても、全 query を先読みして index 区間への線形最大 query として処理できる。

#### 候補を比較する

- **採用**: index segment tree の各 node 区間に点の convex hull を前計算し、prefix [1,i] を覆う node 群の hull で最大内積を二分・三分探索する。 — 標準的な静的 hull と segment tree だけで、動的 hull 用の高度な平衡木を避けられる。
- **棄却**: 各 query 後に、それまでの全点を走査して内積最大を取る。 — prefix 長の総和が Q^2 になり、Q=2×10^5では間に合わない。
- **棄却**: convex hull を挿入ごとに動的更新する。 — 有効な方針だが、hull 上の順序統計と削除を扱う高機能な平衡木が必要なため、この record では offline 区間化を採用する。

#### 鍵となる着眼

- 追加-only 集合は時刻 index の prefix なので、segment tree の range decomposition を使えば一つの query を O(log Q) 個の静的点集合 query へ分解できる。

#### アルゴリズムへ接続する

全 Q 点を葉へ置く segment tree を作り、各 node の点を sort して上下 convex hull を構築する。時刻 i では range [1,i] を分解し、各 hull 上で A x+B y の最大頂点を unimodal search して全 node の最大を出力する。


## 転用するときの確認

- **convex hull trick for dot-product query**: 固定点集合に対し、様々な方向 vector との最大内積を問うとき。 適用: 内部点を捨てた convex hull 上で支持点を単峰探索する。
- **segment tree of static structures**: 時刻 prefix や index range ごとに、集合上の重い query を行いたいとき。 適用: 各 segment node に静的 data structure を前計算し、range を少数 node に分解する。
- 追加-only の online 風問題では、全入力が既知なら time/index 軸の区間 query 化を試す。
- 内積の等高線を query vector 方向へ動かす図を描き、内部点が最大にならないことと hull 上の支持点探索を結び付ける。

## 到達確認

### 到達確認 1 — 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる

転移題材: [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g)

**課題**: ABC342 G「Retroactive Range Chmax」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: segment tree区間分解: range objectをpoint queryで参照し、後から同じobjectを削除したい。 適用: rangeをO(log N) canonical nodeに登録し、point pathだけを走査する。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- segment tree区間分解: range objectをpoint queryで参照し、後から同じobjectを削除したい。 適用: rangeをO(log N) canonical nodeに登録し、point pathだけを走査する。

- 対象技能が担う箇所: segment tree区間分解: range objectをpoint queryで参照し、後から同じobjectを削除したい。 適用: rangeをO(log N) canonical nodeに登録し、point pathだけを走査する。
- 転移題材の解法接続: 各segment nodeにmultiset、または追加heapと削除heapのlazy deletion pairを置く。type 1の(l,r,x)をcanonical nodesへ挿入しoperation IDに情報を保存する。type 2では同じ分解nodeからxを削除する。type 3ではA_iとleafからrootまでの各node現在maxの最大を出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。

</details>


## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC342 G 公式解説](https://atcoder.jp/contests/abc342/editorial/9373)
- [ABC342 G 公式問題文](https://atcoder.jp/contests/abc342/tasks/abc342_g)
- [ABC363 G 公式解説](https://atcoder.jp/contests/abc363/editorial/10451)
- [ABC363 G 公式問題文](https://atcoder.jp/contests/abc363/tasks/abc363_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-segment-tree-canonical-decomposition`
