---
title: "BEST定理によるEuler circuit数え上げ"
description: "前提からBEST定理によるEuler circuit数え上げを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 151
---

# BEST定理によるEuler circuit数え上げ

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 行列式による数え上げ、Euler trail・circuit
- この位置で学ぶ理由: 行列式による数え上げ・Euler trail・circuitで得た考え方と実装を再利用し、BEST定理によるEuler circuit数え上げの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### BEST定理によるEuler circuit数え上げ

有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。

検索語: BEST theorem、BEST定理、Euler circuit counting

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

#### このOutcomeを支える根拠

- 指定された全16種類の長さ4 substring出現回数を持つbinary列の個数をmod 998244353で求められる。

#### 観察

- 長さ4のpattern(i,j,k,l)を、3bit状態(i,j,k)から(j,k,l)への有向辺と見る。各pattern出現回数Xはその多重辺数であり、条件を満たすbinary列は全辺を一度ずつ使うEuler trailと一対一対応する。

#### 候補を比較する

- **採用**: 8頂点多重有向graphのEuler trailをBEST定理と有向行列木定理で数える — 辺総数Nが大きくても頂点数は8に固定され、degree・factorial・小行列式だけで計算できる。
- **棄却**: 16種類のpatternを置く順序をDPで列挙する — 残個数vectorの状態数がXに対して指数的で、N=10^6を扱えない。

#### 鍵となる着眼

- 始点・終点候補を8通りずつ調べ、degree差がEuler trail条件を満たす場合は終点から始点への補助辺を加えてEuler閉路へ帰着できる。区別された辺の閉路数はBEST定理の有向全域木数×∏(outdeg(v)-1)!で、全域木数は有向Laplacian minorの行列式になる。

#### アルゴリズムへ接続する

16本種のXから8頂点の入出次数を作る。各始点s・終点tについてdegree条件と非零辺部分の連結性を確認し、必要な補助辺t→sを加える。mod 998244353で8×8 Laplacian minorをGaussian eliminationしてarborescence数を求め、BESTのfactorial積を掛け、同一patternのX_e!による重複を割って該当する列数を合計する。


## 転用するときの確認

- **de Bruijn graphへの変換**: 固定長substringの出現回数を指定された列を数える。 適用: 長さ3のprefix/suffixを頂点、長さ4 patternをshift辺として、列をEuler trailに対応させる。
- **BEST定理と有向行列木定理**: 頂点数が小さい多重有向graphで全辺を使うtrail数が必要である。 適用: edge順序のfactorial積とLaplacian minor determinantからEuler閉路数を得る。
- substring頻度列挙ではEuler路化に加え、同label多重辺のindistinguishabilityをfactorialで補正する。
- Nの小さい全binary列を列挙し、全辺がself-loop、open trail、closed trail、degree不整合、同pattern多重辺を公式計数と比較する。

## 到達確認

### 到達確認 1 — 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

**課題**: ABC336 G「16 Integers」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 指定された全16種類の長さ4 substring出現回数を持つbinary列の個数をmod 998244353で求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-euler-circuit-counting`
