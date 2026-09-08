---
title: "isotonic regression・PAV"
description: "前提からisotonic regression・PAVを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 202
---

# isotonic regression・PAV

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 一次元凸・単峰最適化
- この位置で学ぶ理由: 一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

検索語: PAV、pool-adjacent-violators、単調回帰

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f)

選定理由: 長さL・総和Sのblockを最も均す整数列は floor((S+t)/L), t=0..L-1 で、値は二つの隣接整数だけになる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。単調制約下で隣接違反をblock平均化して一意解を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 巨大回数の±1局所操作をsimulationせず、単調block mergeから一意な最終列と最小回数を線形に求められる。

#### 観察

- A_iをA_i-iへずらすと狭義増加化は広義増加化になる。隣接逆転を均す操作を前から繰り返した最終列は一意で、連続blockごとの総和をほぼ均等配分した形になる。

#### 候補を比較する

- **採用**: 各要素を一blockとしてstackへ入れ、直前blockの最終値が次blockの先頭値を超える間mergeし、block和と長さから floor((S+t)/len) の均し列を表す。 — 各block内の最適列は総和固定の最も平坦な広義単調列で、隣接block境界が逆転した場合は別々に保つ解が不可能なのでmergeが強制される。
- **棄却**: 最左の逆転位置へ操作を一回ずつ適用し、列が単調になるまでsimulationする。 — 値差が巨大だと操作回数も巨大になり、最終形は得られても逐次simulationは入力値に比例する。

#### 鍵となる着眼

- 長さL・総和Sのblockを最も均す整数列は floor((S+t)/L), t=0..L-1 で、値は二つの隣接整数だけになる。
- stack mergeは各blockを一度pushし一度popするだけなので、境界比較を定数時間にできれば全体線形である。

#### アルゴリズムへ接続する

shift後Aを左から処理し、blockに(l,r,sum)を持つ。top二blockの均し列境界値が非単調ならsum・lengthを合併する。確定blockごとにquotient/remainderから最終Bを復元し、元AからBへの必要操作数を公式に集計する。


## 転用するときの確認

- **pool adjacent violators**: 単調制約下で隣接違反をblock平均化して一意解を求めるとき。 適用: stack上で違反blockをmergeし、平坦な整数列へ均す。
- **index shiftによる単調制約変換**: 隣接差が少なくとも1の整数列を作りたいとき。 適用: A_i-iで狭義単調を広義単調へ変える。
- isotonic型問題では隣接blockの解が境界で両立しないとき、その二blockを一つの平均化問題へ統合する。
- 一blockのS,Lから均し列を復元し、隣接block境界違反ならmergeが必要な理由を交換法で確認する。

## 到達確認

### 到達確認 1 — 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f)

**課題**: ABC459 F「-1, +1」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 巨大回数の±1局所操作をsimulationせず、単調block mergeから一意な最終列と最小回数を線形に求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-isotonic-regression`
