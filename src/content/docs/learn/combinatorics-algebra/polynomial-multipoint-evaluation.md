---
title: "多項式の多点評価・補間"
description: "前提から多項式の多点評価・補間を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 216
---

# 多項式の多点評価・補間

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: FPS演算・多点評価・合成を行う、再帰分割・分割統治
- この位置で学ぶ理由: 形式的べき級数の基本演算・再帰分割・分割統治で得た考え方と実装を再利用し、多項式の多点評価・補間の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 多項式の多点評価・補間

product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。

検索語: multipoint evaluation、product tree、remainder tree、多点評価

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)

選定理由: indexを反転したDPの母関数f_iは f_i=x(f_{i−1}+f'_{i−1})+C_i f_{i−1} を満たし、g_i=f_i e^xなら係数ごとに g_{i,j}=(j+C_i)g_{i−1,j} と分離する。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。一つの高次polynomialを連続する多数の点で評価すればDP coefficientsを得られるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- random permutation後のface-up coin数の期待値を高速多項式演算で求められる。

#### 観察

- rotation symmetryにより全coinのface-up probabilityは等しく、期待face-up数はN倍のcoin N−1がface upである確率でよい。
- coin N−1をflipするassignment数Kの分布F(K)を直接数える代わりに、L個の指定条件を満たす総数G(L)を数えると G(L)=Σ_{K≥L}C(K,L)F(K) というbinomial transformになる。

#### 候補を比較する

- **採用**: DP generating functionへe^xを掛けてderivative termを対角化し、積polynomial h(x)=∏(x+C_i)を整数点0,…,Nでmultipoint evaluationする。 — N個のDP stepがh(j)の一括評価へ変わり、subproduct treeとNTTでO(N log^2 N)にできる。
- **棄却**: 条件を満たすindex数を状態にするpermutation DPでG(0),…,G(N)を求める。 — dp[i][j]の全遷移がO(N^2)となりN=20万を扱えない。

#### 鍵となる着眼

- indexを反転したDPの母関数f_iは f_i=x(f_{i−1}+f'_{i−1})+C_i f_{i−1} を満たし、g_i=f_i e^xなら係数ごとに g_{i,j}=(j+C_i)g_{i−1,j} と分離する。
- h(j)=∏_i(j+C_i)を全jで得た後、e^{-x}とのconvolutionでf_NとGを戻し、もう一度exponential generating-functionのbinomial inversionでFを復元できる。

#### アルゴリズムへ接続する

permutation counting DPをexponential generating functionsでdiagonalizeし、product polynomialのmultipoint evaluationとbinomial inversionへ変換する。


## 転用するときの確認

- **多項式の多点評価**: 一つの高次polynomialを連続する多数の点で評価すればDP coefficientsを得られるとき。 適用: subproduct treeでh(x)=∏(x+C_i)を作り、remainder treeでh(0),…,h(N)を求める。
- **指数母関数によるbinomial変換**: 二列がΣ C(K,L)F(K)型の包含count関係を持つとき。 適用: factorial scaling後のgenerating functionsにe^xまたはe^{-x}を掛けてGとFを相互変換する。
- 期待個数はindicatorの線形性と対称性で一対象の分布へ縮約し、最後に対象数を掛ける。
- 全要素が回転対称なら期待値の線形性で一要素のevent-count distributionへ落とす。
- derivativeを含むpolynomial DPはe^xを掛ける積の微分で係数ごとに独立化できないか試す。

## 到達確認

### 到達確認 1 — product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)

**課題**: ABC381 G「Fibonacci Product」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: baby-step/giant-stepとchirp-z transform: 巨大な指数範囲を平方根幅へ分け、等比数列上の多数点で評価したいとき。 適用: 指数を√N×√Nに分割し、各blockの等比点評価を係数変形によるconvolutionへ落とす。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- baby-step/giant-stepとchirp-z transform: 巨大な指数範囲を平方根幅へ分け、等比数列上の多数点で評価したいとき。 適用: 指数を√N×√Nに分割し、各blockの等比点評価を係数変形によるconvolutionへ落とす。

- 対象技能が担う箇所: baby-step/giant-stepとchirp-z transform: 巨大な指数範囲を平方根幅へ分け、等比数列上の多数点で評価したいとき。 適用: 指数を√N×√Nに分割し、各blockの等比点評価を係数変形によるconvolutionへ落とす。
- 転移題材の解法接続: 拡大体要素を pair で実装して一般項係数と周期を求める。周期商の積を高速冪し、残りを平方分割する。F_M(X) を doubling と NTT で構築し、chirp-z transform で等比点評価して全値を掛ける。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-polynomial-multipoint-evaluation`
