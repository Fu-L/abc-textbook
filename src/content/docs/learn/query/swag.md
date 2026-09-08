---
title: "SWAG・two-stack queue aggregation"
description: "前提からSWAG・two-stack queue aggregationを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 181
---

# SWAG・two-stack queue aggregation

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 区間monoid要約
- この位置で学ぶ理由: 区間monoid要約で得た考え方と実装を再利用し、SWAG・two-stack queue aggregationの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### SWAG・two-stack queue aggregation

queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。

検索語: SWAG、sliding window aggregation、two-stack queue

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f)

#### このOutcomeを支える根拠

- 全連続windowの休日計画DPを、2×2 min-plus積とSWAGで線形時間に評価できる。

#### 観察

- 休日列の局所条件は、各日を休日にする/しない二状態のmin-cost DPで表せる。長さK windowごとに同じ2×2 min-plus遷移の積を求める問題になる。

#### 候補を比較する

- **採用**: 各A_iを写像 f_a(x,y)=(y,min(x,y)+a) または2×2 min-plus行列として表し、長さKのsliding productをSWAGで維持して全開始位置を評価する。 — 写像合成は結合的で固定4係数の形に閉じ、SWAGは非可換でもqueue前後stackの累積積により各要素を定数回だけ処理できる。
- **棄却**: 最初の休日候補 l ごとに長さKの二状態DPを最初から計算する。 — window数Nに各K段かかり Θ(NK) となる。

#### 鍵となる着眼

- 隣り合う休日間を2日以上空けない条件は、現在日を休まない状態が直前休日状態からだけ遷移する式 dp0'=dp1 を与える。
- 最初と最後の休日距離はK-1またはKだけ見ればよく、window境界の A_{l-1}=INF を含む初期vectorで二ケースを吸収できる。

#### アルゴリズムへ接続する

各日の min-plus matrix [[INF,0],[A_i,A_i]] を作る。SWAGで順序付き長さK積をslideし、初期vector (0,A_{l-1}) へ作用させた休日終了stateの最小を答えへ反映する。端点ケースを番兵INFで処理する。


## 転用するときの確認

- **DP遷移のmin-plus行列化**: 短い状態DPを多数の連続windowで再評価したいとき。 適用: 各要素の遷移を小行列として区間積へ変換する。
- **SWAG**: 非可換なassociative積をsliding windowごとに求めたいとき。 適用: front/back stackの向き付き累積積でqueue積を維持する。
- min-plus写像も結合則があれば通常のmonoid queueと同じdata structureで扱える。
- 一日遷移をmatrix×vectorへ書き、二日分の合成順とSWAGのfrontProduct⊗backProductを具体値で照合する。

## 到達確認

### 到達確認 1 — queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f)

**課題**: ABC456 F「Plan Holidays」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全連続windowの休日計画DPを、2×2 min-plus積とSWAGで線形時間に評価できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC456 F 公式解説](https://atcoder.jp/contests/abc456/editorial/19850)
- [ABC456 F 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-swag`
