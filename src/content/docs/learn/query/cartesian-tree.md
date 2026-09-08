---
title: "大小関係をCartesian treeへ変換する"
description: "前提から大小関係をCartesian treeへ変換するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 83
---

# 大小関係をCartesian treeへ変換する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 支配関係から不要な候補を単調stack・queueで削る
- この位置で学ぶ理由: 単調stackの支配関係を親子関係へ持ち上げ、配列の区間極値を部分木境界として分割処理へ使う。

### この単元では扱わない範囲

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 発動条件と見分け方

### Cartesian treeによる区間極値分解

配列順と値のheap順を同時に保つ木を構成し、区間極値を根とする再帰分割へ変換する。

検索語: Cartesian tree、min Cartesian tree、デカルト木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる

題材: [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)

#### このOutcomeを支える根拠

- 最大値課金の区間攻撃最適化をCartesian tree上の離散凸関数mergeへ変換し、巨大な体力軸をbreakpointだけで扱える。

#### 観察

- 操作順は総費用に影響せず、同じ最大 shield 値のままなら区間を広げても損をしないため、候補区間は B の極大支配区間へ絞れる。
- 各 B_i を区間最大の代表とし、同値では右側を代表にする規約を置くと、候補区間は max Cartesian tree の部分木区間になる。

#### 候補を比較する

- **採用**: B の Cartesian tree 上で、区間全体が既に j 回攻撃済みのときの最小追加費用 F_i(j) を子から合成し、離散凸な折れ線の変化点だけを small-to-large で管理する。 — A_i,j が 10^9 でも関数の傾き変化は部分木頂点数程度であり、全 j を列挙せず再帰式を評価できる。
- **棄却**: 各 node について j=0,…,max A の DP 配列を明示して recurrence の最小 k を調べる。 — A_i≤10^9 のため添字範囲だけで不可能で、各 k の探索も重い。

#### 鍵となる着眼

- node i で追加の全区間攻撃を k 回行うと、k≥max(A_i-j,0) かつ費用は kB_i+F_left(j+k)+F_right(j+k) になる。
- 子関数の限界削減量が j とともに減る離散凸性により、最適な到達高さ j_0 は『子側の次の1回の節約が B_i を下回る最初』という閾値になる。
- F_i の全値ではなく F_i(0)、初期傾き、二階差分が非零になる位置の multiset を持てば、子の和は集合併合、node追加は prefix傾きの置換として処理できる。

#### アルゴリズムへ接続する

単調 stack等で tie規約付き max Cartesian treeを構築する。postorderで子の折れ線event集合を大きい方へ併合し、j≥A_i かつ子の限界節約<B_iとなる j_0 までeventを消費する。prefix slopeをB_iへ置換するbreakpointを挿入し、rootのF(0)を答える。


## 転用するときの確認

- **Cartesian tree**: 各区間の最大値で操作費用が決まり、最大要素を境に左右が独立するとき。 適用: shield B の最大位置を根にし、最大値支配区間の包含関係を二分木へする。
- **離散凸関数のbreakpoint表現**: 巨大な整数引数上のDP関数が単調な傾きを持ち、和・prefix切替で更新されるとき。 適用: 初期値・傾き・二階差分eventだけを保持してmin-plus recurrenceを評価する。
- **small-to-large merge**: 木DPで各部分木のordered event集合を親へ併合し、要素の移動回数を抑えたいとき。 適用: 左右の小さい集合を大きい集合へ挿入して折れ線を合成する。
- 階層的な一括操作では、親操作の単価と子解の限界差分を比較し、最適回数を傾きの閾値として探す。
- 葉のF(j)=max(A_i-j,0)B_iから一階差分を描き、親で子の限界節約とB_iが交差するj_0、および同値Bの代表規約を小例で検証する。

## 到達確認

### 到達確認 1 — 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる

転移題材: [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f)

**課題**: ABC420 F「kirinuki」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 最大500万cellのgridで、all-dotかつarea≤Kの全rectangleをO(NM)で数えられる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 最大500万cellのgridで、all-dotかつarea≤Kの全rectangleをO(NM)で数えられる。

- 対象技能が担う箇所: 最大500万cellのgridで、all-dotかつarea≤Kの全rectangleをO(NM)で数えられる。
- 転移題材の解法接続: 各bottom rowでh_jを更新し、(h_j,j)などの一意順序によるnearest smaller境界からa=i-l+1,b=r-i+1を得る。h_i=0はskipし、gの三rangeをd=K/h_iでも分割して、h_iΣ(αw+β)またはαΣwq_w+βΣq_wを足す。全rowの寄与を64 bitで合計する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

</details>


## 根拠

- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC420 F 公式解説](https://atcoder.jp/contests/abc420/editorial/13741)
- [ABC420 F 公式問題文](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC435 F 公式解説](https://atcoder.jp/contests/abc435/editorial/14734)
- [ABC435 F 公式問題文](https://atcoder.jp/contests/abc435/tasks/abc435_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-cartesian-tree`
