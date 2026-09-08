---
title: "2-SAT・含意グラフ"
description: "前提から2-SAT・含意グラフを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 170
---

# 2-SAT・含意グラフ

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: SCC・縮約DAG・トポロジカル順序
- この位置で学ぶ理由: SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、2-SAT・含意グラフの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 2-SAT・含意グラフ

二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。

検索語: 2-SAT、implication graph、含意グラフ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる

題材: [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h)

#### このOutcomeを支える根拠

- bounded整数列のpair-sum区間制約をthreshold 2-SATへ変換し、可否判定と具体解構成を行える。

#### 観察

- 各X_iは0,…,Mの小さな整数だが、Q個のsum区間制約がcycleを作るため、変数順に決める単純DPにはならない。
- threshold命題P_{i,j}: j≤X_iを導入すると、整数値1個がjに関してtrueからfalseへ一度だけ切り替わるboolean列になる。

#### 候補を比較する

- **採用**: 各threshold P_{i,j}を2-SAT変数にし、上下界のsum条件を全tに対する2-literal clauseへ変換してSCCで解く。 — M≤100によりNM変数を持て、二変数和の整数不等式をthreshold ORへ正確に線形化できる。
- **棄却**: 各X_iのM+1候補を頂点にした一般CSPをbacktrackingする。 — constraint graphに木構造の保証がなく、候補割当ては指数的になる。

#### 鍵となる着眼

- L≤X_A+X_Bは全整数tについて P_{A,t}∨P_{B,L-t+1}、X_A+X_B≤Rは ¬P_{A,t}∨¬P_{B,R-t+1} と同値になる。
- P_{i,0}=true、P_{i,M+1}=false、P_{i,j}⇒P_{i,j-1}を加えると、satisfying assignmentから最大true thresholdをX_iとして復元できる。

#### アルゴリズムへ接続する

iごとにthreshold 0,…,M+1を用意し、端のunit clauseと単調clauseを張る。各queryと関連tについてlower/upperの2-SAT clauseを追加し、implication graphのSCCで矛盾を判定する。可解なら各iの最大true jを出力する。


## 転用するときの確認

- **threshold boolean化**: 小範囲整数変数への大小・和不等式をboolean制約へ落としたいとき。 適用: j≤Xという単調命題列を作り、値をtrue prefixの長さとして表す。
- **2-SAT**: 各制約が二つのboolean literalのORへ表せ、全体の可解性と一解が必要なとき。 適用: clauseを2本のimplicationへし、literalと否定が同SCCか調べる。
- 整数和制約では閾値を一方へ配分するcutを全列挙し、forbiddenな同時閾値を二項clauseにできないか考える。
- L=5のlower boundでt=X_A+1を選ぶ反証と、true thresholdがprefixになる単調clauseを小さなMで確認する。

## 到達確認

### 到達確認 1 — 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる

境界検証の元題材: [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h)

**課題**: ABC277 Ex「Constrained Sums」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- bounded整数列のpair-sum区間制約をthreshold 2-SATへ変換し、可否判定と具体解構成を行える。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC277 H 公式解説](https://atcoder.jp/contests/abc277/editorial/5207)
- [ABC277 H 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-two-sat`
