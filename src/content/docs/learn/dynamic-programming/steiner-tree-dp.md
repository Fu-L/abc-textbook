---
title: "Steiner tree subset DP"
description: "前提からSteiner tree subset DPを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 149
---

# Steiner tree subset DP

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 部分集合・bitmask状態DP、最短路モデル
- この位置で学ぶ理由: 最短路モデル・部分集合・bitmask状態DPで得た考え方と実装を再利用し、Steiner tree subset DPの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Steiner tree subset DP

terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。

検索語: Dreyfus–Wagner法、Steiner tree DP、シュタイナー木DP

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)

#### このOutcomeを支える根拠

- 小さい固定terminal集合をsubset DPし、全候補vをroot軸に共有して各最小Steiner tree費用を求められる。

#### 観察

- 求める各答えは固定terminal 1..K−1と追加頂点vを含む最小Steiner treeの重みであり、K≤10なのでterminal集合をbit maskで持てる。
- 同じ頂点vで二つのterminal部分集合を結合する遷移と、辺を一つ延ばしてroot位置を移す遷移の二種類で任意の最適木を分解できる。

#### 候補を比較する

- **採用**: dp[mask][v]をmask内terminalとvを結ぶ最小木とし、subset merge後にmulti-source Dijkstraで辺延長を閉包する。 — Steiner treeの分岐を同一点での集合併合、path部分を最短路緩和として網羅できる。
- **棄却**: 各vについてSteiner頂点集合や木の辺集合を個別に列挙する。 — 非terminal候補がN個あり部分集合探索は巨大で、vごとに共通する固定terminalの計算も共有できない。

#### 鍵となる着眼

- dp[mask][v]←dp[sub][v]+dp[mask−sub][v]はvを共通接続点として二木を合併し、重複辺があれば最適解をさらに改善できるので上界遷移として安全である。
- 各maskでmergeを済ませた値を全頂点sourceの初期距離としてDijkstraすれば、dp[mask][v]←dp[mask][u]+wを循環なく最短路閉包できる。

#### アルゴリズムへ接続する

固定terminal i=1..K−1についてdp[1<<i][i]=0、他を∞とする。maskを昇順に処理し、全非空proper submaskとの和で各vをmin更新する。そのdp列を初期距離にmulti-source Dijkstraして全辺緩和する。full maskについてv=K..Nのdp[full][v]を出力する。


## 転用するときの確認

- **Dreyfus-Wagner型Steiner DP**: terminal数だけが小さいweighted graphの最小接続部分graph。 適用: terminal subsetと接続rootを状態にし、subset mergeとshortest-path closureを交互に行う。
- **multi-source Dijkstra閉包**: 同一mask内の辺遷移に循環があり、全rootの初期候補が既にあるとき。 適用: 全dp[mask][v]をqueueへ入れて最短距離として一括伝播する。
- 多数の追加terminal queryは、一点をroot parameterにした共通DPで同時計算できないか考える。
- 最適木のvが葉の場合は辺延長、分岐点の場合はsubset mergeのどちらで分解されるかを図示する。各maskのmerge後に必ず最短路閉包する順序を守る。

## 到達確認

### 到達確認 1 — terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)

**課題**: ABC395 G「Minimum Steiner Tree 2」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 固定terminalを共有する大量Steiner queryをsubset DPの再利用で一括前計算できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 固定terminalを共有する大量Steiner queryをsubset DPの再利用で一括前計算できる。

- 対象技能が担う箇所: 固定terminalを共有する大量Steiner queryをsubset DPの再利用で一括前計算できる。
- 転移題材の解法接続: 固定terminal bitmaskについてsubset merge→dense Dijkstra closureを昇順maskで計算する。さらに各s>Kを一つ追加したterminal stateを同じ遷移で計算し、そのstateからtへclosureしたdp値をquery答えとして参照する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC364 G 公式解説](https://atcoder.jp/contests/abc364/editorial/10547)
- [ABC364 G 公式問題文](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC395 G 公式解説](https://atcoder.jp/contests/abc395/editorial/12307)
- [ABC395 G 公式問題文](https://atcoder.jp/contests/abc395/tasks/abc395_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-steiner-tree-dp`
