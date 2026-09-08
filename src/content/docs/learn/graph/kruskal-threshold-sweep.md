---
title: "Kruskal順の閾値DSU sweep"
description: "前提からKruskal順の閾値DSU sweepを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 193
---

# Kruskal順の閾値DSU sweep

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: DSUによる連結成分管理・縮約、cut・cycle性質から最適全域木を構成する
- この位置で学ぶ理由: DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。

### この単元では扱わない範囲

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Kruskal順の閾値DSU sweep

辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。

検索語: Kruskal順DSU sweep、minimax connectivity threshold、weight-sorted offline connectivity sweep、重み順Union-Find

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる

題材: [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)

#### このOutcomeを支える根拠

- 独立な MST 候補辺判定を、共通の Kruskal sweep と Union-Find で一括処理できる。

#### 観察

- 追加辺 e=(u,v,w) が Kruskal 法で選ばれるかは、重み w 未満の元グラフ辺を処理した時点で u と v がまだ非連結かだけで決まる。
- 各クエリは独立で追加辺を実際には残さないため、全クエリの判定中に Union-Find を変化させるのは元グラフ辺だけである。

#### 候補を比較する

- **採用**: 元辺と全クエリを重み順に一緒に並べ、元辺では Union、クエリでは現在の連結性を読むだけの一回の sweep を行う。 — 各クエリを個別 Kruskal の重み w 時点まで進めた状態が、共通の元辺 sweep 上で完全に一致する。
- **棄却**: 各クエリで追加後の全辺をソートし直し、Kruskal 法で MST を再構築する。 — M と Q がともに 20 万で、各クエリに全辺走査を行えない。

#### 鍵となる着眼

- 答えを知るには完成した MST 自体は不要で、候補辺が現れる瞬間の軽い辺による連結性という途中状態だけで十分である。

#### アルゴリズムへ接続する

Kruskal の選択条件を重み閾値付き連結性クエリへ切り出し、独立クエリを元辺だけが更新するオフライン Union-Find sweep に並列化する。


## 転用するときの確認

- **Kruskal 順のオフラインクエリ**: 候補辺が MST に入るかを多数問われ、各候補追加は他クエリへ影響しないとき。 適用: 重み順イベント列で元辺を併合し、候補辺イベントでは端点 root の一致だけを判定する。
- 重み sweep の問合せでは、判定が「未満」か「以下」かを確認し、同値イベントの処理順を入力保証と合わせる。
- MST クエリでは完成木を毎回作る前に、Kruskal のどの瞬間で答えが確定するかを切り出す。
- クエリが独立なら、問合せイベントを更新せず観測だけにして全クエリを一つの sweep へ載せる。

## 到達確認

### 到達確認 1 — 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる

転移題材: [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)

**課題**: ABC250 Ex「Trespassing Takahashi」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 各閾値tについて、距離t以下の移動を繰り返して家xから家yへ到達できるかを答えられる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 各閾値tについて、距離t以下の移動を繰り返して家xから家yへ到達できるかを答えられる。

- 対象技能が担う箇所: 各閾値tについて、距離t以下の移動を繰り返して家xから家yへ到達できるかを答えられる。
- 転移題材の解法接続: K個の家を同時に始点としてDijkstraを行い、各辺の変換重みd[a]+c+d[b]を求めて昇順に並べる。質問もt順に処理し、重み≤tの辺をDSUへ追加して指定された家x,yの連結を判定する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

</details>


## 根拠

- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-kruskal-threshold-sweep`
