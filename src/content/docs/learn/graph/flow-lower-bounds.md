---
title: "下限制約付きflowの実現可能性"
description: "前提から下限制約付きflowの実現可能性を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 193
---

# 下限制約付きflowの実現可能性

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 最大流・最小カット
- この位置で学ぶ理由: 最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

検索語: circulation with demands、lower-bound flow、下限付きフロー

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)

選定理由: 左側頂点ではsourceからの辺、右側頂点ではsinkへの辺を流量1に強制すれば、そのcellがちょうど1本のdominoに含まれる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。隣接cellを重ならないpairへ分けるtile配置問題。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 1・2・?の指定を満たすmonomino/domino敷き詰めの存在を、lower-bound付き二部flowの実行可能性として判定できる。

#### 観察

- 1×2 tileを置くことは、1でない隣接2cellを1本のmatching edgeで結ぶことに対応し、残った?は1×1 tileで覆える。
- 文字2のcellは必ずmatchingに含める必要がある一方、?のcellはmatchedでもunmatchedでもよい。
- grid隣接graphはcheckerboard parityで二部graphになるため、matching条件をunit-capacity flowへ変換できる。

#### 候補を比較する

- **採用**: 二部matching networkの必須頂点にlower bound 1を設定し、lower-bound付きflowのfeasibilityを最大流へ帰着する。 — 左右どちら側にある2も必ず飽和する条件をflow conservationとして同時に表現できる。
- **棄却**: 2のcellから順に空いている隣接cellへ貪欲にdominoを置く。 — 局所選択が別の必須cellの唯一の相手を奪う場合があり、matching全体の組替えが必要になる。
- **棄却**: 通常の最大matchingを1回求め、cardinalityだけで可否を決める。 — 最大本数が同じでも、特定の2頂点をすべてcoverしているかというlower-bound条件をcardinalityだけでは表せない。

#### 鍵となる着眼

- 左側頂点ではsourceからの辺、右側頂点ではsinkへの辺を流量1に強制すれば、そのcellがちょうど1本のdominoに含まれる。
- lower bound Lを先に流したとみなして各頂点の需要差へ変換し、super source/sinkと元sink→元sourceの辺を加えるとcirculation feasibilityになる。

#### アルゴリズムへ接続する

文字1のcellを除き、偶奇で左右に分けて隣接辺を容量1で張る。source→左cellと右cell→sinkも容量1とし、文字2ならその辺のlower boundを1、?なら0にする。lower bound分を頂点需要へ移し、super sourceから需要超過頂点、供給超過頂点からsuper sinkへ辺を張り、sink→sourceへ十分大きい辺を追加する。最大流でsuper sourceからの全辺を飽和できればYes。


## 転用するときの確認

- **gridの二部matching**: 隣接cellを重ならないpairへ分けるtile配置問題。 適用: checkerboard parityを二部にしてdominoをmatching edgeとみなす。
- **lower-bound flow feasibility**: 一部の辺に最低流量があり、指定頂点の飽和を強制したいとき。 適用: 需要差とsuper source/sinkを導入して通常の最大流へ帰着する。
- 混在tile問題では、大きいtileだけをpackingとして選び、小さいtileで埋められる残余を自由状態として消去する。
- 左右それぞれに文字2がある小さなgridで、どのsource/sink辺にlower boundが付くか、需要変換後に全必須cellが1本ずつmatchingされるかを追う。

## 到達確認

### 到達確認 1 — 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)

**課題**: ABC285 G「Tatami」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 1・2・?の指定を満たすmonomino/domino敷き詰めの存在を、lower-bound付き二部flowの実行可能性として判定できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-flow-lower-bounds`
