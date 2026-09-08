---
title: "線形matroid交差の乱択rank判定"
description: "前提から線形matroid交差の乱択rank判定を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 219
---

# 線形matroid交差の乱択rank判定

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 線形方程式・rank、matroid greedy、乱択の成功条件と誤り確率を設計する
- この位置で学ぶ理由: matroidの独立性・交換公理、線形方程式のrank計算、乱択誤り評価を学んだ後、二つの線形matroidの共通独立rankを一枚の乱択行列へ圧縮する。

### この単元では扱わない範囲

- 線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 線形matroid交差の乱択rank判定

二つの線形matroidの表現A₁,A₂からA₁diag(r)A₂ᵀを作り、有限体上の乱択rankを共通独立集合の最大sizeとして高確率で判定する。

検索語: linear matroid intersection、randomized intersection rank、線形マトロイド交差

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる

題材: [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)

選定理由: graphic matroidはoriented incidence columns、color cのpartition matroidはA_c行のVandermonde columnsで線形表現できる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。二つの線形matroidの最大common independent sizeだけが必要なとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- color上限付きspanning treeの全interval存在判定を、線形matroid交差のrandom rankへ変換して数えられる。

#### 観察

- color上限はpartition matroid、cycleを含まないedge集合はgraphic matroidであり、colorful spanning tree存在は両matroidのcommon independent set rankがN-1かに等しい。
- 両matroidを有限体上の線形表現A_1,A_2へ写すと、random diagonal Dを挟むM=A_1DA_2^Tのrankが高確率でintersection rankになる。color interval[L,R]はA_1の対応row blockだけを残すことに一致する。

#### 候補を比較する

- **採用**: partition/graphic matroidの線形表現からrandomized intersection matrixを作り、連続row区間のrank N-1可否をbasis sweepで数える — ΣA_c≤300,N≤150なので、各Lからrowを追加するGaussian basisまたはABC223H型offline basisで最小Rを求め、可否の単調性から全interval数を多項式時間で集計できる。
- **棄却**: 各(L,R)で一般matroid intersectionを独立に実行する — O(C²)区間×大きなedge集合で重く、colorが連続row blockになる線形構造を捨てている。

#### 鍵となる着眼

- graphic matroidはoriented incidence columns、color cのpartition matroidはA_c行のVandermonde columnsで線形表現できる。
- Schwartz–Zippelにより各edge変数へ大きな有限体の乱数を代入したrankは真のsymbolic rankを高確率で保つ。

#### アルゴリズムへ接続する

A_1のcolor別row blockとincidence A_2からrandomized Mを構成する。各Lについてrow S_L..をcolor順にbasisへ追加しrankが初めてN-1になるRを記録し、それ以降のRを加算する。必要ならoffline sliding-basis techniqueでO(N²ΣA)へ高速化する。


## 転用するときの確認

- **linear matroid intersectionのrandom rank**: 二つの線形matroidの最大common independent sizeだけが必要なとき。 適用: A_1 diag(random) A_2^Tのrankを計算する。
- **Vandermonde representation of partition matroid**: group cから高々A_c列を独立に選ばせたいとき。 適用: color blockのA_c行へedge indexの冪を置く。
- **連続row区間rank query**: color interval制約がmatrixの連続row選択に対応するとき。 適用: basis追加と可否単調性で最小右端を求める。
- matroid intersectionで両matroidが線形表現できるなら、構成不要のrank判定をrandomized matrix algebraへ落とす。
- N≤7,C≤5でedge subsetから全spanning treeを列挙し、各intervalの真値と複数seedのrank判定・最小R単調性を比較する。

## 到達確認

### 到達確認 1 — 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる

境界検証の元題材: [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)

**課題**: ABC399 G「Colorful Spanning Tree」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- color上限付きspanning treeの全interval存在判定を、線形matroid交差のrandom rankへ変換して数えられる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC399 G 公式解説](https://atcoder.jp/contests/abc399/editorial/12546)
- [ABC399 G 公式問題文](https://atcoder.jp/contests/abc399/tasks/abc399_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-linear-matroid-intersection`
