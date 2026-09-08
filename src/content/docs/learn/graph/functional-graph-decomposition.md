---
title: "関数グラフのcycle・tree分解"
description: "前提から関数グラフのcycle・tree分解を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 119
---

# 関数グラフのcycle・tree分解

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 状態グラフのモデリングと探索
- この位置で学ぶ理由: 状態グラフのモデリングと探索で得た考え方と実装を再利用し、関数グラフのcycle・tree分解の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 関数グラフのcycle・tree分解

各頂点の後続が一意なgraphをcycleと流入treeへ分解し、前周期・周期を処理する。

検索語: cycle-tree decomposition、functional graph、関数グラフ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる

題材: [ABC241 E「Putting Candies」](https://atcoder.jp/contests/abc241/tasks/abc241_e)

#### このOutcomeを支える根拠

- 剰余で駆動する巨大回数の加算過程を重み付き functional graph にし、tail/cycle 分解で総和を求められる。

#### 観察

- 次に参照する index は現在の総キャンディ数 X そのものではなく X mod N だけで決まり、residue r から (r+A_r) mod N へ移る N 状態の functional graph になる。
- 各状態の出辺は一つなので、0から進む residue 列は高々 N ステップで既出状態へ戻り、それ以降は同じ状態列と加算量を周期的に繰り返す。

#### 候補を比較する

- **採用**: residue の初出 step と、その時点までの累積キャンディ数を記録し、cycle 検出後に残り回数を cycle 単位で飛ばす。 — K は巨大でも cycle 前と一周期は合わせて N 状態以下で、加算値も prefix 差から一括計算できる。
- **棄却**: 2^b 回分の遷移先と加算量を全 residue について作る doubling を使う。 — 公式に示された有効な別解だが、query は一つなので、この record では N 状態を一度たどるだけの cycle 法を採用する。

#### 鍵となる着眼

- 同じ residue に戻った二時点 s<t の間では状態遷移だけでなく加算する A の列も同じになり、cycle gain は prefix[t]-prefix[s] である。

#### アルゴリズムへ接続する

state=0、prefix[0]=0 から、未訪問 state に step を記録し A_state を加えて次 residue へ進む。K 回前に repeat したら cycleStart s、length p、gain を求め、K-s を商と余りに分けて prefix[s]+商·gain+cycle prefix の余りを返す。


## 転用するときの確認

- **functional graph の周期検出**: 有限状態で各状態の次状態が一意、操作回数だけが非常に大きいとき。 適用: 初出時刻を記録し、tail と cycle に分けて反復を飛ばす。
- **重み付き cycle の prefix sum**: 状態遷移ごとに値を加算し、巨大回数後の総和が必要なとき。 適用: 初出時の累積値を保存し、cycle 一周の gain と余り区間を差分で得る。
- 状態決定に値の剰余しか使わない反復では、商を捨てて有限 automaton と重みへ分ける。
- サンプル1で residue 列と実際の X を別の行に書き、同じ residue の再訪が以後の加算列まで固定することを確認する。

## 到達確認

### 到達確認 1 — 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる

転移題材: [ABC256 E「Takahashi's Anguish」](https://atcoder.jp/contests/abc256/tasks/abc256_e)

**課題**: ABC256 E「Takahashi's Anguish」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 全ての人を並べたときに生じる不満度合計の最小値を求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全ての人を並べたときに生じる不満度合計の最小値を求められる。

- 対象技能が担う箇所: 全ての人を並べたときに生じる不満度合計の最小値を求められる。
- 転移題材の解法接続: 各頂点の入次数を求め、入次数0をキューに入れて辺を順に削除する。最後まで残る閉路頂点を未訪問ごとに一周し、その閉路上のC最小値を答えへ加える。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

</details>


## 根拠

- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC256 E 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_e)
- [ABC256 E 公式解説](https://atcoder.jp/contests/abc256/editorial/4135)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-functional-graph-decomposition`
