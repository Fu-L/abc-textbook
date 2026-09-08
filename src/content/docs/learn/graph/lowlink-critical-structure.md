---
title: "lowlinkで橋・関節点を特定する"
description: "前提からlowlinkで橋・関節点を特定するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 116
---

# lowlinkで橋・関節点を特定する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 状態グラフのモデリングと探索
- この位置で学ぶ理由: DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。

### この単元では扱わない範囲

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 発動条件と見分け方

### lowlinkによる橋・関節点の検出

DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。

検索語: Low-Link、bridges and articulation points、橋・関節点

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる

題材: [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)

選定理由: w<Dなら更新後も≤D、w>Dなら最適pathは対象辺を使わない。w=Dだけ「D以下pathからその辺を除けるか」というbridge問題になる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。path costが最大辺重み。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 指定辺重みを1増やしたときS-T bottleneck距離が変化するか答えられる。

#### 観察

- bottleneck距離D(S,T)は重み≤wのsubgraphでの連結閾値であり、一辺重みを1増やして答えが変わるのはその辺重みがDと等しい場合だけである。

#### 候補を比較する

- **採用**: 重み別DSU縮約＋lowlink bridge判定 — 軽い辺成分を縮約した同重みgraphで対象辺がS-Tを分離するbridgeか判定すれば、その辺が全最適bottleneck pathに必須か分かる。
- **棄却**: 各queryで辺重み更新後にminimax shortest path — Q回graph探索で過大。

#### 鍵となる着眼

- w<Dなら更新後も≤D、w>Dなら最適pathは対象辺を使わない。w=Dだけ「D以下pathからその辺を除けるか」というbridge問題になる。

#### アルゴリズムへ接続する

辺を重み順に処理し、w未満辺をDSUで縮約する。同重み辺で作るcomponent graphへlowlinkとDFS順を構築し、queryのS,T連結閾値と対象edgeのbridge分離sideから距離増加有無を答える。


## 転用するときの確認

- **minimax pathと閾値連結**: path costが最大辺重み。 適用: 重み以下edgeのDSU連結で距離を捉える。
- **縮約graphのbridge**: 全最適pathに特定edgeが必須か判定する。 適用: 軽辺成分を縮約し同重み辺のlowlinkを求める。
- minimax感度解析はweight layerを縮約してbridgeを調べる。
- 小graphで更新前後minimax Dijkstraと比較し、同重みparallel経路、対象辺がbridgeでもS-Tを分けない例を確認する。

## 到達確認

### 到達確認 1 — DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる

転移題材: [ABC334 G「Christmas Color Grid 2」](https://atcoder.jp/contests/abc334/tasks/abc334_g)

**課題**: ABC334 G「Christmas Color Grid 2」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 一様に選んだ緑cellを赤へ変えた後の緑連結成分数の期待値をmod 998244353で求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 一様に選んだ緑cellを赤へ変えた後の緑連結成分数の期待値をmod 998244353で求められる。

- 対象技能が担う箇所: 一様に選んだ緑cellを赤へ変えた後の緑連結成分数の期待値をmod 998244353で求められる。
- 転移題材の解法接続: gridの#を無向graphとして各未訪問頂点からDFSし、ord・lowと初期成分数Cを求める。同時に各vの分離子数cを数え、rootならparts=c、非rootならparts=c+1とする。削除後全体はC-1+parts(v)なので全緑vで平均する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

</details>


## 根拠

- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC334 G 公式解説](https://atcoder.jp/contests/abc334/editorial/8980)
- [ABC334 G 公式問題文](https://atcoder.jp/contests/abc334/tasks/abc334_g)
- [ABC375 G 公式解説](https://atcoder.jp/contests/abc375/editorial/11133)
- [ABC375 G 公式問題文](https://atcoder.jp/contests/abc375/tasks/abc375_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-lowlink-critical-structure`
