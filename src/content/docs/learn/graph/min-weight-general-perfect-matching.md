---
title: "一般グラフの最小重み完全matching"
description: "前提から一般グラフの最小重み完全matchingを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 211
---

# 一般グラフの最小重み完全matching

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 二部matching・Hall・Kőnig
- この位置で学ぶ理由: 二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。

### この単元では扱わない範囲

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 一般グラフの最小重み完全matching

奇cycleを含む一般グラフで全頂点をpairにし、weighted blossomまたは重み付きTutte多項式の最小次数からperfect matchingの重みを最小化する。

検索語: minimum-weight perfect matching、weighted blossom、一般グラフ最小重み完全マッチング

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる

題材: [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

選定理由: matching中に同じlabel pair間のweight1 edgeが二本あれば、その4 copyを各label内のweight0二辺へ交換して費用を下げられる。よって最小解は元simple graphの同じedgeを重複使用しない。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。各頂点degreeに上限とparity制約があり、総上限が小さいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- degree上限とparityを満たす最小辺spanning subgraphを、150 stub以下の最小重みperfect matchingとして判定・最適化できる。

#### 観察

- 良いsubgraphのdegree d_iは、A_i個のstubのうちd_i個を他labelと組ませ、残りA_i-d_i個を同label内でpairにする、と解釈できる。後者が可能な条件はd_i≤A_iかつparity一致である。
- X=ΣA_i≤150個のcopy頂点を作れば、このstub pairing全体は一般graphのperfect matchingになる。異label pairのweight1が元subgraphのedge数に対応し、同label pairはweight0で余剰を吸収する。

#### 候補を比較する

- **採用**: 各label i のcopyをA_i個作った0/1重みgraph Hの最小重みperfect matchingへ帰着する — 同label copiesをweight0で完全接続し、元Gにedge i-jがあるlabel間をweight1で完全接続する。perfect matchingの最小weightが良いgraphの最小edge数になり、存在しなければ-1。
- **棄却**: 元graphの各edgeを選ぶ／選ばないでdegree parityと上限をDPする — Mは最大約N^2でedge subsetは指数的になり、頂点ごとのdegree制約を局所状態だけでは分離できない。

#### 鍵となる着眼

- matching中に同じlabel pair間のweight1 edgeが二本あれば、その4 copyを各label内のweight0二辺へ交換して費用を下げられる。よって最小解は元simple graphの同じedgeを重複使用しない。
- Xが奇数ならperfect matchingは不可能。偶数ならEdmonds blossomで直接解け、またTutte行列へ辺weightをyの次数として埋め込む乱択判定・補間でも最小weightだけを得られる。

#### アルゴリズムへ接続する

Xが奇数なら-1。X頂点のHを構築し、一般graph用minimum-weight perfect matching（blossom等）を実行する。matchingなしなら-1、あればweight0/1辺の総和を出力する。Tutte行列を使う場合はentryを乱数·y^{w}とし、detの最小非零次数の半分を同じ答えとして求める。


## 転用するときの確認

- **degree stub の展開**: 各頂点degreeに上限とparity制約があり、総上限が小さいとき。 適用: A_i個のcopyを作り、cross-label pairを採用edge、same-label pairを未使用stub二個に対応させる。
- **一般graphの最小重みperfect matching**: 二部とは限らないgraphで全頂点をpairingし、辺重み和を最小化するとき。 適用: 0/1重みexpanded graph Hへblossom algorithmを適用する。
- **Tutte行列と多項式次数**: perfect matchingの存在や最小weightだけを代数的・乱択的に求めたいとき。 適用: 辺変数へy^{weight}を掛け、detの最小非零次数をmatching weightの2倍として読む。
- 小さいdegree総和があるfactor問題では、各許容量をcopy頂点に展開し、未使用単位を内部pairで吸収するmatching模型を検討する。
- X奇数、M=0、A_i=1だけ、同じlabel pairのcross edgeが二本現れ得るexpanded matchingを小graphの全subgraph列挙と比較する。

## 到達確認

### 到達確認 1 — 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる

境界検証の元題材: [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

**課題**: ABC412 G「Degree Harmony」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- degree上限とparityを満たす最小辺spanning subgraphを、150 stub以下の最小重みperfect matchingとして判定・最適化できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-min-weight-general-perfect-matching`
