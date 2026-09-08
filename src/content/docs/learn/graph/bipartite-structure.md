---
title: "二部彩色と成分構造を扱う"
description: "前提から二部彩色と成分構造を扱うを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 35
---

# 二部彩色と成分構造を扱う

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 無向グラフを探索できることを前提に、辺をまたぐたび色を反転し、矛盾検出と成分ごとの二部サイズ集約を行う。

### この単元では扱わない範囲

- 重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。

## 発動条件と見分け方

### 二部グラフの彩色と成分構造

無向グラフを二色に塗れる条件を探索で検証し、各連結成分の二部サイズ・反転対称性を集約する。

検索語: 2-coloring、bipartite graph、二部グラフ、二部彩色

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる

題材: [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)

#### このOutcomeを支える根拠

- odd-cycle禁止edge追加gameを固定cross-part候補のparity gameとして完全に解ける。

#### 観察

- 木はconnected bipartiteで、その二部分彩色はswapを除き一意である。odd cycleを作らず追加できるのは異なる色間の未存在edgeだけである。
- どの合法edgeを加えても部集合は変わらず、合法手数総数は|L||R|-(N-1)に固定される。

#### 候補を比較する

- **採用**: 二部分彩色して残り合法edge数のparityを求め、同じ色分割間の未edgeを応答用setに持つ — ゲームは固定された候補辺を交互に一つ消費するだけなので、残手数がoddなら先手、evenなら後手を選べば任意応答で必勝する。
- **棄却**: 各局面で相手の手に応じたgame DPを行う — 合法手同士に相互作用がなく、状態数だけを指数的に増やす過剰な方法である。

#### 鍵となる着眼

- connected bipartite graphへcross-part edgeを追加しても同じ二部分彩色が有効なので、別候補の合法性は変化しない。
- 初期tree edgeN-1は全てcross-partに既に存在するため、残候補数は積からN-1を引く。

#### アルゴリズムへ接続する

DFS/BFSでcolorとpart sizeを求め、未edgecross pairをsetへ列挙する。size parityでFirst/Secondを宣言し、自手番ではsetから一辺を出し、相手入力edgeをsetから削除する。


## 転用するときの確認

- **impartial gameの手数parity化**: 各手が独立な候補を一つ消し、他候補の可否を変えないとき。 適用: 残候補数の偶奇だけで勝者を決める。
- **bipartite graphの一意彩色**: connected graphでodd cycle禁止edgeを特徴付けるとき。 適用: 二部集合間だけを合法候補とする。
- ゲームでは操作が残り選択肢集合へ及ぼす影響を確認し、単なるtoken取りゲームへ退化しないか調べる。
- path/starのpart sizeから候補を手列挙し、任意順で全候補を消費しても合法性が保たれることと手数parityを確認する。

## 到達確認

### 到達確認 1 — 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる

転移題材: [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)

**課題**: ABC398 G「Not Only Tree Game」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 一般bipartite graphのedge追加gameを、component彩色sizeのparity分類だけで線形時間判定できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 一般bipartite graphのedge追加gameを、component彩色sizeのparity分類だけで線形時間判定できる。

- 対象技能が担う箇所: 一般bipartite graphのedge追加gameを、component彩色sizeのparity分類だけで線形時間判定できる。
- 転移題材の解法接続: 全componentをBFS二色塗りしpart sizes(a,b)、size、edge数を集計してx,ee,oo,eo,isoを求める。公式の四caseを適用し、奇数ならAoki、偶数ならTakahashiを出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

</details>


## 根拠

- [ABC327 G 公式解説](https://atcoder.jp/contests/abc327/editorial/7557)
- [ABC327 G 公式問題文](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC398 E 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G 公式解説](https://atcoder.jp/contests/abc398/editorial/12480)
- [ABC398 E 公式解説](https://atcoder.jp/contests/abc398/editorial/12483)
- [ABC398 G 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-bipartite-structure`
