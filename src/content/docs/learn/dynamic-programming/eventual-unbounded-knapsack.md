---
title: "大容量unbounded knapsackのeventual linearity"
description: "前提から大容量unbounded knapsackのeventual linearityを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 203
---

# 大容量unbounded knapsackのeventual linearity

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 集合・資源軸のDP
- この位置で学ぶ理由: 通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### この単元では扱わない範囲

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

検索語: best-density item、eventual linearity knapsack、大容量unbounded knapsack

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる

題材: [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)

#### このOutcomeを支える根拠

- 最大Aが300という小ささを使い、10^15本からの最大drink数をO(M+K^3)で求められる。

#### 観察

- 一本飲んでexchange iを一回行うと最終的な瓶総数をD_i=A_i-B_iだけ消費し、追加でB_i本飲める。逆向きに見ると、容量Nでweight D_i・value B_iのunbounded knapsackに近い。
- ただし初期段階にはx≥B_iという実行条件がある。x≥K=max A_iになれば全B_i<Kなので条件は自動的に満たされ、以後は通常のunbounded knapsackになる。

#### 候補を比較する

- **採用**: best ratio B_i/D_i のitem i*以外を使う総weightがK(K+1)未満の最適解を利用し、小容量DP後をi*の反復で埋める — prefix x<K(K+1)だけ全itemでDPし、各到達xから残容量へi*を可能なだけ使う。鳩の巣原理でK個以上の非i* item blockは同weightのi*群へ価値を下げず交換できる。
- **棄却**: 常にB_i/D_i最大のexchangeだけを最初から繰り返す — 小さいxではx≥B_iを満たさないことがあり、容量の剰余調整でもratioが劣るitemを有限回使う方が総価値を増やす場合がある。

#### 鍵となる着眼

- 同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。
- 非i* itemがK個あればprefix weight和K+1個のmod D_{i*} residueに一致pairがあり、そのblockを同weightのi*複数へ交換できる。best ratioにより価値は減らない。

#### アルゴリズムへ接続する

同じAを最大Bだけにdeduplicateし、cross multiplicationでi*を選ぶ。limit=K(K+1)付近まで、開始xを自由に選べる基底0と条件x≥B_iを反映したunbounded DPで最大追加drink数を求める。各DP state xからi*をfloor((N-x)/D*)回追加する候補を評価し、初期N本を足す。


## 転用するときの確認

- **best density itemによる大容量knapsack**: capacityが巨大だがitem weightが小さく、best ratio以外の使用量をboundedにできるとき。 適用: 有限prefixだけDPし、残りをbest-density itemで埋める。
- **鳩の巣原理による交換**: 非基準itemが多数並び、prefix weight residueを基準weight moduloで比較できるとき。 適用: 同余りの区間を同総weightの基準itemへ置換して非基準総weightを制限する。
- **支配optionの除去**: 同じ必要量parameterを持つ選択肢で一方が常に多い返却を与えるとき。 適用: 同じAでは最大Bだけ残して種類数をK以下へ減らす。
- 巨大capacityのunbounded knapsackではbest ratio解との差分をcycle交換でboundedにし、短いprefix DP＋周期的tailへ分ける。
- 一種類、best ratioが初期に使えない、同A重複、残容量の剰余で別itemが必要な小Nを状態全探索と比較する。

## 到達確認

### 到達確認 1 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる

境界検証の元題材: [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)

**課題**: ABC415 G「Get Many Cola」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 最大Aが300という小ささを使い、10^15本からの最大drink数をO(M+K^3)で求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-eventual-unbounded-knapsack`
