---
title: "factorial convolutionによる多項式Taylor shift"
description: "前提からfactorial convolutionによる多項式Taylor shiftを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 207
---

# factorial convolutionによる多項式Taylor shift

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 組合せ係数と対称性で数える、NTT・FFTで畳み込みと相互相関を求める
- この位置で学ぶ理由: 畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。

### この単元では扱わない範囲

- factorial convolutionによる多項式Taylor shiftの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### factorial convolutionによる多項式Taylor shift

P(x+a) の全係数を二項展開し、階乗倍した係数列と a^i/i! の反転畳み込みへ変換して準線形時間で求める。

検索語: factorial convolution shift、polynomial Taylor shift、多項式Taylor shift、多項式平行移動

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる

題材: [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)

選定理由: 係数matrix Bが正則ならdet(A+xB)=det(B)det(xI+B^{-1}A)で、後半は−B^{-1}Aのcharacteristic polynomialになる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。spanning treeをedge属性の個数別に数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- polynomial reversalとshift: x係数matrixがsingularだが、ある評価点のconstant matrixは正則にできるとき。 適用: 変数をshiftし逆数変換で正則matrixを最高次係数側へ移す。

#### 観察

- 各inversion edgeへweight x、他edgeへweight 1を付けると、treeのweight積はx^{inversion数}であり、全spanning treeの重み和のx^K係数が求める答えになる。
- weighted Matrix-Tree theoremにより、この生成多項式はpolynomial Laplacianの任意のcofactor det(M_0+xM_1)として得られる。
- cofactor sizeはN-1で各entryがxの一次式なので、determinantのdegreeも高々N-1である。

#### 候補を比較する

- **採用**: det(M_0+xM_1)を正則な係数matrixへ変形し、characteristic polynomialをO(N^3)で求めて全係数を復元する。 — N≤500で、N点のdeterminant評価を繰り返さず1回の行列多項式計算へ帰着できる。
- **棄却**: xへN個の値を代入して各determinantをGaussian eliminationし、補間する。 — 1評価O(N^3)をN回行うO(N^4)となり、この制約では重い。
- **棄却**: Cayleyのtree列挙や全edge subsetからtreeだけを検査する。 — labelled treeだけでもN^{N-2}個あり列挙不能である。

#### 鍵となる着眼

- 係数matrix Bが正則ならdet(A+xB)=det(B)det(xI+B^{-1}A)で、後半は−B^{-1}Aのcharacteristic polynomialになる。
- M_1がsingularでもshift aを選んでC=M_0+aM_1を正則にし、E(z)=det(M_1+zC)をcharacteristic polynomialとして計算できる。
- Q(t)=det(C+tM_1)=t^dE(1/t)なので係数reverseでQを得て、元のD(x)=Q(x-a)へpolynomial shiftすればよい。

#### アルゴリズムへ接続する

全unordered pair u<vについてP_u>P_vならw=x、否则w=1としてpolynomial Laplacianを作り、1行1列を除いてM_0,M_1へ分ける。d=N-1とし、C=M_0+aM_1が正則になるfield要素aを選ぶ。C^{-1}M_1を求め、−C^{-1}M_1のcharacteristic polynomialからE(z)=det(C)det(zI+C^{-1}M_1)を得る。degree dで係数をreverseしてQ(t)=D(a+t)とし、t=x-aのTaylor shiftでD(x)へ戻し、x^0..x^{N-1}係数を出力する。


## 転用するときの確認

- **weighted Matrix-Tree theorem**: spanning treeをedge属性の個数別に数えたいとき。 適用: 属性edgeへ形式変数weightを付け、Laplacian cofactorを生成多項式にする。
- **matrix pencilのdeterminant**: entryがA+xBの一次matrixでdeterminant全係数が必要なとき。 適用: 正則係数を単位行列へ変えcharacteristic polynomialへ帰着する。
- **polynomial reversalとshift**: x係数matrixがsingularだが、ある評価点のconstant matrixは正則にできるとき。 適用: 変数をshiftし逆数変換で正則matrixを最高次係数側へ移す。
- 構造ごとの属性個数分布は、属性要素へ形式変数を付けたweighted countの係数として一括計算する。
- N=3で3本のedge weightからtree3通りの生成多項式を直接展開し、Laplacian cofactor、係数reverse、shift後の符号が一致するか確認する。

## 到達確認

### 到達確認 1 — 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる

境界検証の元題材: [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)

**課題**: ABC323 G「Inversion of Tree」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- polynomial reversalとshift: x係数matrixがsingularだが、ある評価点のconstant matrixは正則にできるとき。 適用: 変数をshiftし逆数変換で正則matrixを最高次係数側へ移す。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-polynomial-taylor-shift`
