---
title: "Lagrangian relaxation・Aliens trick"
description: "前提からLagrangian relaxation・Aliens trickを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 194
---

# Lagrangian relaxation・Aliens trick

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 一次元凸・単峰最適化
- この位置で学ぶ理由: 一次元凸・単峰最適化で得た考え方と実装を再利用し、Lagrangian relaxation・Aliens trickの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Lagrangian relaxation・Aliens trick

個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。

検索語: Aliens DP、Aliens trick、ラグランジュ緩和

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)

#### このOutcomeを支える根拠

- budget X内で必要なminimum practice daysと、そのdays数でのminimum total energyを求められる。

#### 観察

- 一日のproblem集合を固定すると、adjacent exchangeよりA>1の問題はB/(A−1)昇順、A=1の問題は最後に並べるのがminimum fatigueになる。
- segment cost c(l,r)=f({l+1,…,r})は集合costのincreasing marginal propertyからquadrangle inequalityを満たし、K segmentsのminimum d(K)はKについてdiscrete convexになる。

#### 候補を比較する

- **採用**: 一日ごとのpenalty pを加えたAliens DPでmin(cost+p×days)を求め、convex envelopeとternary searchからd(K)≤Xとなる最小Dを復元する。 — Monge性がdays別最適costの凸性を保証し、Xを超えるedgesを除く高速DPと合わせてO(N log^2 X)にできる。
- **棄却**: dp[k][r]=min_l dp[k−1][l]+c(l,r)を全K,l,rについて計算する。 — N^2以上のsegment transitionsとなりN=20万を扱えない。

#### 鍵となる着眼

- problem pの追加によるfatigue増分は、既存集合が大きいほど前後のaffine composition係数が大きくなり増加するため、fはsupermodularになる。
- penalty pで得るG(p)=min_K(d(K)+pK)から D=ceil(max_p((G(p)−X)/p)) と表せ、この比は探索可能なunimodal shapeを持つ。

#### アルゴリズムへ接続する

affine-composition orderingからsegment-cost Monge性を導き、partition shortest pathをLagrangian relaxation/Aliens DPとconvex dual searchで解く。


## 転用するときの確認

- **隣接交換による最適順序**: operationsの順序だけを変えられ、二操作の前後比較からscalar keyを導けるとき。 適用: B_p(A_q−1)とB_q(A_p−1)をcross multiplyし、B/(A−1)順で一日分のaffine transformsを合成する。
- **Monge分割DPとAliens trick**: segment partition costがquadrangle inequalityを満たし、最適costをsegment数制約と同時に求めたいとき。 適用: segment数へpenaltyを付けたunconstrained DPをoracleとし、convex dualから必要daysと元costを復元する。
- 個数別最適値がconvexなら、budgetとの最初の交点をLagrangian oracleの傾き情報から探せる。
- 区間内を並べ替えられるcostは、まず二要素交換でcanonical orderとset functionの性質を導く。
- 分割数ごとの最適値が凸なら、個数を直接DP dimensionにせずpenalty付き最適化のdualを見る。

## 到達確認

### 到達確認 1 — 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g)

**課題**: ABC355 G「Baseball」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 重み付き一次元 K-center 型目的を Monge DAG の固定辺数最短路へし、Aliens DP で大規模制約を処理できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 重み付き一次元 K-center 型目的を Monge DAG の固定辺数最短路へし、Aliens DP で大規模制約を処理できる。

- 対象技能が担う箇所: 重み付き一次元 K-center 型目的を Monge DAG の固定辺数最短路へし、Aliens DP で大規模制約を処理できる。
- 転移題材の解法接続: P と yP の prefix sum から c(i,j) oracle を作る。整数 λ に対し dp[j]=min_{i<j}(dp[i]+c(i,j)+λ) と使用辺数を lexicographic に計算し、分割統治＋monotone minima（または簡易LARSCH/CHT）で評価する。辺数が K+1 を跨ぐ λ を凸探索し、dp[N+1]−λ(K+1) の最大を答える。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC305 H 公式解説](https://atcoder.jp/contests/abc305/editorial/6534)
- [ABC305 H 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-lagrangian-relaxation`
