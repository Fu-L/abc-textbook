---
title: "重み付き二部完全matching"
description: "前提から重み付き二部完全matchingを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 201
---

# 重み付き二部完全matching

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 二部matching・Hall・Kőnig
- この位置で学ぶ理由: 二部matching・Hall・Kőnigで得た考え方と実装を再利用し、重み付き二部完全matchingの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 重み付き二部完全matching

assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。

検索語: assignment problem、weighted bipartite matching、ハンガリアン法

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g)

#### このOutcomeを支える根拠

- 無交差完全対応を、交差交換で正当化された最小重み完全マッチングとして構成できる。

#### 観察

- 二本の対応線分が交差しているなら、交点を介した三角不等式により対応先を交換すると二本の長さの総和が真に減る。したがって距離総和が最小の完全マッチングは交差を持たない。

#### 候補を比較する

- **採用**: P_i と Q_j のユークリッド距離をコストとする最小重み完全二部マッチングを解き、その対応 permutation を出力する。 — 非共線条件により交差解の交換では距離が真に減るため、任意の最小費用マッチングが要求する無交差性を満たす。
- **棄却**: 角度順に二集合の点を並べ、同じ順位同士を貪欲に対応させる。 — 二集合の配置は共通の凸位置を持つとは限らず、局所的な角度順だけでは内部交差を排除できない。

#### 鍵となる着眼

- 交差点 X に対し |PaX|+|XQb|>|PaQb| と対称な不等式を足すと、交差辺の swap が距離和を改善する。
- 求めるのは最短距離値ではなく対応そのものなので、Hungarian 法または min-cost flow の復元情報を保持する。

#### アルゴリズムへ接続する

完全二部グラフの辺 (i,j) に点間距離を置き、Hungarian 法などで最小費用完全マッチングを求める。得られた Q 側の対応 index を各 P_i について出力する。


## 転用するときの確認

- **uncrossing と最小重みマッチング**: 幾何的な対応で交差二辺の付け替えが目的値を改善するとき。 適用: 無交差制約を直接管理せず、距離和最小化へ埋め込む。
- 幾何構築では局所交換で違反を消せるポテンシャルがないかを探す。
- 交差二辺を入れ替えた四点の図を描き、どの三角不等式を足すと真の改善になるかを自力で示す。

## 到達確認

### 到達確認 1 — assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g)

**課題**: ABC373 G「No Cross Matching」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 無交差完全対応を、交差交換で正当化された最小重み完全マッチングとして構成できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC373 G 公式解説](https://atcoder.jp/contests/abc373/editorial/11045)
- [ABC373 G 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-weighted-bipartite-matching`
