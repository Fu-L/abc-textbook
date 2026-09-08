---
title: "線形方程式・rank"
description: "前提から線形方程式・rankを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 145
---

# 線形方程式・rank

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 線形方程式・rank

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。

検索語: Gaussian elimination、matrix rank、掃き出し法

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)

選定理由: prefix xor p_{i,j}を使うとrectangle parityはp_{b,d}⊕p_{a-1,d}⊕p_{b,c-1}⊕p_{a-1,c-1}で、queryに現れるcorner以外は0に固定してよい。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。有限体の非零元が小さな巡回群をなし、積条件を加法条件へ変えられるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 長方形積mod3の構成問題を、非零部のcorner xor方程式とzero配置可能領域の検査へ分解できる。

#### 観察

- 積が1または2 mod 3の長方形には0を置けず、要素を1=2^0,2=2^1と書けば積条件は2の個数のparity、すなわちF_2上の長方形xorになる。
- 積が0の条件は長方形内に少なくとも1個0があることなので、非零条件を満たす領域と0を置ける領域を分離して考えられる。

#### 候補を比較する

- **採用**: 非零queryを2D prefix xorの4 corner変数によるF_2連立方程式にし、出現cornerだけをbitset Gaussian eliminationで解く。非零queryに覆われないcellを0にする。 — cell N²個ではなく高々4Q個のprefix変数で方程式を表し、zero条件もcoverageで最大限満たせる構成になる。
- **棄却**: 各x_{i,j}を変数とするN²変数の連立方程式を直接掃き出す。 — N,Q≤2000では変数が最大4×10^6となり、bitsetを使っても掃き出し法が重すぎる。

#### 鍵となる着眼

- prefix xor p_{i,j}を使うとrectangle parityはp_{b,d}⊕p_{a-1,d}⊕p_{b,c-1}⊕p_{a-1,c-1}で、queryに現れるcorner以外は0に固定してよい。
- 非零queryのunion外のcellはどの非零積も壊さないので全て0にできる。これで満たせない0-queryは全cellがunion内であり、どの解でもそこへ0を置けないため不可能である。

#### アルゴリズムへ接続する

e=1,2のqueryだけからcorner prefix変数と右辺(e=2なら1)を作り、F_2掃き出しで一解を得る。未使用prefixは0として2D差分から1/2 matrixを復元し、2D imosで非零queryに覆われないcellを0化する。最後に全queryを検証する。


## 転用するときの確認

- **multiplicative conditionの指数化**: 有限体の非零元が小さな巡回群をなし、積条件を加法条件へ変えられるとき。 適用: mod3の1,2を2の指数0,1へ写し、積をxorへする。
- **rectangle queryのprefix corner化**: 長方形和/xorの線形制約が多数あり、cell変数を減らしたいとき。 適用: 各式を4 cornerだけで表し、全queryに現れる高々4Q個のcorner座標をsort-uniqueしてdenseな変数IDへ写す。
- **bitset Gaussian elimination**: F_2上の変数・式が数千規模で、密な連立方程式の可解性と一解が必要なとき。 適用: rowをbitset化してpivot消去し、矛盾行を検出する。pivot情報から一解を復元し、2D差分で出力matrixへ戻す。
- 制約が『禁止領域』と『少なくとも1個のmarker』に分かれるとき、許可領域を全面marker化して残る条件だけを検査する。
- 2×2のprefix xorからcell値を復元する式と、非零rectangleのunion内へ1個でも0を置くと壊れる理由を別々に手計算する。

## 到達確認

### 到達確認 1 — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h)

**課題**: ABC278 Ex「make 1」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 初回span到達となるdistinct vector列を、q-binomialによるrank数え上げとStirling反転・畳み込みで計算できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 初回span到達となるdistinct vector列を、q-binomialによるrank数え上げとStirling反転・畳み込みで計算できる。

- 対象技能が担う箇所: 初回span到達となるdistinct vector列を、q-binomialによるrank数え上げとStirling反転・畳み込みで計算できる。
- 転移題材の解法接続: q=2のq-factorialと逆元を前計算し、rank式をconvolution形へ整理してG(1…N)をNTTで求める。必要なsigned Stirling係数でF(N),F(N-1)を反転し、distinct全列−Fからgood列を作って初回goodの差を取る。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC278 H 公式解説](https://atcoder.jp/contests/abc278/editorial/5210)
- [ABC278 H 公式問題文](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-linear-system-rank`
