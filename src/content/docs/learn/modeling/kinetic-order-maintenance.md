---
title: "kinetic sorting・交差event順序更新"
description: "前提からkinetic sorting・交差event順序更新を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 203
---

# kinetic sorting・交差event順序更新

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: event順にactive集合を更新する
- この位置で学ぶ理由: event・値順のオフライン走査で得た考え方と実装を再利用し、kinetic sorting・交差event順序更新の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### kinetic sorting・交差event順序更新

連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。

検索語: kinetic order maintenance、kinetic sorting、交差イベント順序更新

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる

題材: [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g)

選定理由: 現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。parameter Aの変化に伴いlinear keyのsorted orderが変わり、多数の同parameter queryがある。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 生成されるQ本の直線それぞれについて上側の点数を数え、その総和を求められる。

#### 観察

- query(A,B)は各点のscore_A(i)=-A X_i+Y_iがB以上かを数える問題である。Aを昇順に処理すれば各scoreはAの一次関数で、二点の順序は両点を結ぶslopeを跨ぐ時に高々一度だけ反転する。

#### 候補を比較する

- **採用**: queryをA順にsortし、点score順を隣接swap eventでkineticに維持する — 全pairの順序反転は高々O(N^2)回で、各queryは現在のsorted score列をbinary searchできる。
- **棄却**: 各queryでN点のinequalityを直接判定する — Qは10^7でNQは最大5×10^10となり実行できない。

#### 鍵となる着眼

- 現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。

#### アルゴリズムへ接続する

生成器からQ個の(A,B)を作りA昇順にsortする。点列はA→-∞での順序に対応する(X,Y)辞書順から始め、隣接crossing slopeをexact rational keyのheapへ入れる。各query A前にslope≤Aの有効eventを処理してswap・隣接event更新し、現在順のscore=-AX+Yへlower_boundしてscore≥Bの個数を加算する。


## 転用するときの確認

- **kinetic sorting**: parameter Aの変化に伴いlinear keyのsorted orderが変わり、多数の同parameter queryがある。 適用: 隣接要素の次crossingだけをevent queueで管理し、局所swapで全順序を更新する。
- **offline query sorting**: query同士は独立で、parameterを単調順に並べるとdata structure更新を共有できる。 適用: 生成した(A,B)をA昇順に処理し、点順序を戻さず進める。
- moving-order queryは隣接swap eventのkinetic data structureとして扱える。
- X同値でswapしないpair、複数pairが同slopeで交差、同A query、R_a=0をN小の全点sort真値と比較する。

## 到達確認

### 到達確認 1 — 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる

境界検証の元題材: [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g)

**課題**: ABC344 G「Points and Comparison」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 生成されるQ本の直線それぞれについて上側の点数を数え、その総和を求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC344 G 公式解説](https://atcoder.jp/contests/abc344/editorial/9491)
- [ABC344 G 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-kinetic-order-maintenance`
