---
title: "静的graph等式制約のpotential伝播"
description: "前提から静的graph等式制約のpotential伝播を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 171
---

# 静的graph等式制約のpotential伝播

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 状態グラフのモデリングと探索
- この位置で学ぶ理由: 通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

### この単元では扱わない範囲

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 静的graph等式制約のpotential伝播

可逆な加法・XOR演算で x_v=x_u⊙w と書ける辺等式をDFS/BFSで伝播し、cycle整合性を検査して各連結成分の解をroot offset一つで表す。

検索語: XOR potential graph、graph potential propagation、グラフpotential、静的差分等式制約

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる

題材: [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e)

#### このOutcomeを支える根拠

- xor等式graphの存在判定と最小和解構成を、component potentialとbit別選択で線形近くに行える。

#### 観察

- constraint A_x xor A_y=zはbitごとに独立で、連結成分内では一頂点の値を決めるとpath上のxorにより全頂点値が決まる。
- rootを0と仮定したpotential p_vをDFSで付けると、任意解はcomponent共通mask tに対してA_v=p_v xor tとなる。

#### 候補を比較する

- **採用**: xor potentialで整合性を検査し、各component・各bitで1の個数が少ないroot bitを選ぶ — bit bでt_bを反転するとcomponent全頂点のbitが反転するため、onesとsize-onesの小さい方を独立に選べばΣA_iを最小化できる。
- **棄却**: A_iを整数としてcomponentごとにgreedy決定する — 整数大小の局所選択はxor constraintを伝播し、各bitの独立な全体最適化を表せない。

#### 鍵となる着眼

- 既訪問vertexへ別pathから到達したとき、既存p_vとp_u xor zが異なればcycle xorが非零で解なしである。
- Z≤10^9なので必要bit範囲を覆えばよく、各bitの選択を組み合わせたmask tで全値を同時に構成できる。

#### アルゴリズムへ接続する

各未訪問rootをp=0としてDFS/BFSし、edge(u,v,z)でp_v=p_u xor zを割り当て矛盾検査する。componentごとに各bitのonesを数え、ones>size-onesならtのbitを1にし、A_v=p_v xor tを出す。


## 転用するときの確認

- **xor potential graph**: 辺が二頂点値のxor差を指定するとき。 適用: rootからpath xorをpotentialとして伝播しcycle整合性を判定する。
- **bitwise independent minimization**: 制約と目的がbitごとの重み付き和へ分離できるとき。 適用: component共通flipをbitごとに多数決の少数側へ選ぶ。
- 群差constraintではroot potential＋component共通shiftとして一般解を表し、残る自由度だけ最適化する。
- 小componentでroot maskを全探索し、非零cycle xor、tie bit、isolated vertexを比較して最小sumを確認する。

## 到達確認

### 到達確認 1 — 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる

転移題材: [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)

**課題**: ABC352 F「Estimate Order」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 差制約 component の平行移動: x_u−x_v が固定された制約 graph で絶対座標だけ未定なとき。 適用: DFS potential で相対値を求め、component を剛体として全 shift する。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 差制約 component の平行移動: x_u−x_v が固定された制約 graph で絶対座標だけ未定なとき。 適用: DFS potential で相対値を求め、component を剛体として全 shift する。

- 対象技能が担う箇所: 差制約 component の平行移動: x_u−x_v が固定された制約 graph で絶対座標だけ未定なとき。 適用: DFS potential で相対値を求め、component を剛体として全 shift する。
- 転移題材の解法接続: 無向差制約 graph を DFS し D_A=D_B+C を伝播して成分を作る。各成分について全 shift の occupancy mask と各頂点位置を列挙する。成分を順に配置する dp[mask] を行い、各対象成分を除いた配置可能 mask と候補 placement の disjoint/全被覆条件から人物ごとの可能順位集合を求め、一要素ならその順位、複数なら −1。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

</details>


## 根拠

- [ABC352 F 公式解説](https://atcoder.jp/contests/abc352/editorial/9924)
- [ABC352 F 公式問題文](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC396 E 公式問題文](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 E 公式解説](https://atcoder.jp/contests/abc396/editorial/12390)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-graph-potential-propagation`
