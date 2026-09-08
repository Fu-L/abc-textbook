---
title: "有向walkの周期・cycle差分gcd"
description: "前提から有向walkの周期・cycle差分gcdを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 195
---

# 有向walkの周期・cycle差分gcd

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: gcd不変量・差分構造、SCC・縮約DAG・トポロジカル順序
- この位置で学ぶ理由: gcd不変量・差分構造・SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、有向walkの周期・cycle差分gcdの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 有向walkの周期・cycle差分gcd

往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。

検索語: cycle-length gcd、directed graph period、有向グラフ周期

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる

題材: [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)

選定理由: 全edgesでd_v≡d_u+1 mod aなら任意closed walk長はaの倍数で、違反edgeがあればtree pathsと組み合わせてa非倍数のclosed walkを作れる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。同じvertexへ戻るwalkの可能lengthを巨大なexact値について判定したいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 指定された超巨大回数のdirected walkでvertex 1へ戻れるかをlinear graph processingで判定できる。

#### 観察

- walkがstart/endともvertex 1なら途中で使えるのは1から到達でき、かつ1へ戻れるverticesだけなので、1を含むSCC以外を削除できる。
- このSCC内のclosed-walk lengthsのgcd Gが巨大step数を割ることが必要十分であり、10^(10^100)のprime factorsは2と5だけである。

#### 候補を比較する

- **採用**: 1-rooted spanning treeのdepth dを作り、全SCC edges u→vについて|d_u+1−d_v|のgcdを取る。 — このgcdは全closed-walk lengthsのperiodと一致し、graph一走査で計算できる。
- **棄却**: 巨大回数までreachable length setsをDPまたはmatrix exponentiationで追う。 — 指数自体を保持できず、N×N matrixも総N=20万に不適切である。

#### 鍵となる着眼

- 全edgesでd_v≡d_u+1 mod aなら任意closed walk長はaの倍数で、違反edgeがあればtree pathsと組み合わせてa非倍数のclosed walkを作れる。
- 十分大きいlengthではcycle lengthsの非負結合がgcdの倍数をすべて表すため、exact huge lengthの存在はperiodのdivisibilityだけで決まる。

#### アルゴリズムへ接続する

strongly connected directed graphのperiodをDFS potentialsに対するedge discrepanciesのgcdとして計算し、target lengthのprime supportと照合する。


## 転用するときの確認

- **有向graphの周期gcd**: 同じvertexへ戻るwalkの可能lengthを巨大なexact値について判定したいとき。 適用: root distance potentialと各edgeのdepth差+1のgcdからSCC periodを得る。
- **往復可能領域の抽出**: startから出て同じstartへ戻るwalkだけが対象のとき。 適用: forward reachableとreverse reachableのintersection、すなわちstart SCCだけを残す。
- target整数が巨大でもprime factorizationが既知なら、divisibilityはcandidate gcdの余分なprime factorsだけ調べればよい。
- exact-length closed walk問題は、個々のcyclesではなくSCCのperiod gcdへ圧縮する。
- cycle length gcdは全cycles列挙を避け、spanning-tree potentialに対するnon-tree edge discrepancyから得る。

## 到達確認

### 到達確認 1 — 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる

境界検証の元題材: [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)

**課題**: ABC306 G「Return to 1」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 指定された超巨大回数のdirected walkでvertex 1へ戻れるかをlinear graph processingで判定できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-directed-walk-periodicity`
