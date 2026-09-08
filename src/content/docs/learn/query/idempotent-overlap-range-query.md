---
title: "冪等演算のoverlap range query・Sparse Table"
description: "前提から冪等演算のoverlap range query・Sparse Tableを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 146
---

# 冪等演算のoverlap range query・Sparse Table

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 区間monoid要約
- この位置で学ぶ理由: 区間monoid要約で得た考え方と実装を再利用し、冪等演算のoverlap range query・Sparse Tableの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 冪等演算のoverlap range query・Sparse Tableの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 冪等演算のoverlap range query・Sparse Table

冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。

検索語: Sparse Table、sparse table、冪等RMQ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)

#### このOutcomeを支える根拠

- 任意区間を事前登録したpower-of-two区間2個のunionとして即時構成できる。

#### 観察

- 任意query区間を事前登録2区間のunionで表すには、重なりを許せることが重要で、disjoint分解を2個に限定する必要はない。
- 長さlenに対し最大の2^k≤lenを選ぶと、左端からの長さ2^k区間と右端までの長さ2^k区間が重なりつつ全[L,R]を覆う。

#### 候補を比較する

- **採用**: 長さ1,2,4,…の全開始位置区間を登録し、queryを同じ長さの左prefix区間と右suffix区間の2個で答える。 — 登録数N(logN+1)が50000以内で、各queryをlog tableから定数時間で復元できる。
- **棄却**: 全N(N+1)/2区間を登録してquery自身を1個選ぶ。 — N=4000でM上限50000を大きく超える。

#### 鍵となる着眼

- 2^k≤len<2^{k+1}なので、左右2区間の合計長2^{k+1}はlen以上となりgapがなく、どちらも[L,R]内なのでunionが正確にquery区間になる。
- 各(power,start)に出力indexを記録すれば、phase2は二つのtable lookupだけでよい。

#### アルゴリズムへ接続する

k=0…floor(log2N)、l=1…N-2^k+1の区間[l,l+2^k-1]を列挙しid[k][l]を保存して出力する。query[L,R]ではk=floor(log2(R-L+1))としてid[k][L]とid[k][R-2^k+1]を返す。


## 転用するときの確認

- **sparse tableのoverlapping decomposition**: idempotent queryやunion表現で、区間を同長power-of-two区間2個へ分けられるとき。 適用: 最大2冪長の左・右blockを重ねて全区間を覆う。
- **offline family design**: query前に制限個数の集合族を提示し、後から任意区間を少数集合で表すとき。 適用: 全power-of-two intervalをuniversal familyとして登録する。
- 二つの集合で区間を表す問題では、重なり許容なら最大2冪の両端coverを試す。
- len=5,6,7とlen=8で左右の長さ4/8区間を描き、gapがなく外へはみ出さないことを確認する。

## 到達確認

### 到達確認 1 — 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)

**課題**: ABC282 F「Union of Two Sets」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 任意区間を事前登録したpower-of-two区間2個のunionとして即時構成できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-idempotent-overlap-range-query`
