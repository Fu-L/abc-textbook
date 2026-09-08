---
title: "群作用・軌道数え上げ"
description: "前提から群作用・軌道数え上げを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 93
---

# 群作用・軌道数え上げ

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 同値な状態を正規化する
- この位置で学ぶ理由: 状態・配置の正規化で得た考え方と実装を再利用し、群作用・軌道数え上げの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 群作用・軌道数え上げ

群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。

検索語: Burnsideの補題、Pólyaの数え上げ、orbit counting

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる

題材: [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h)

#### このOutcomeを支える根拠

- 全K色を使う頂点彩色付きunlabeled simple graphの個数を、cycle type列挙とBurnside・包含排除でmod P計算できる。

#### 観察

- 頂点置換で同一視するunlabeled graphは、各graphを一律N!で割れないため、置換群S_Nの作用に対するBurnsideの補題で固定点を平均する。
- 置換のcycleごとに頂点色は一定でなければならず、edge集合もunordered pair上の置換orbitごとに採用・不採用が一定になる。
- 最初にc色を使用可能とする固定点数F(c)を数え、全K色を実際に使う条件は色集合の包含排除で課せる。

#### 候補を比較する

- **採用**: S_Nの置換をcycle typeでまとめ、固定される頂点彩色数とedge subset数をBurnsideで加算してから、使用色について包含排除する。 — N≤30ではinteger partitionだけを列挙すればよく、自己同型によるorbit sizeの差も正確に扱える。
- **棄却**: label付きの彩色graph数を数えてN!で割る。 — graphごとに自己同型群の大きさが異なり、labelingの個数が一律N!ではない。
- **棄却**: N!個の頂点置換を1つずつ列挙して固定点を数える。 — 同じcycle typeの置換は固定点数が等しいのに、N!列挙はN≤30で不可能である。

#### 鍵となる着眼

- cycle長列d_1..d_mに対し、固定されるc色彩色は各cycleの色を選ぶc^m通りである。
- edge orbit数は、同一cycle d_i内がfloor(d_i/2)、異なる2cycle d_i,d_j間がgcd(d_i,d_j)なので、その総和Eに対してedge集合は2^E通りである。
- 長さdのcycleがm_d個あるcycle typeの置換数はN!/(∏d^{m_d}m_d!)である。

#### アルゴリズムへ接続する

Nの各integer partitionをcycle長列として列挙する。cycle数m、edge orbit数E、type内の置換数を求め、各c=0..KのF(c)へtypeCount·c^m·2^Eを加える。全typeの和へ(N!)^{-1}を掛けてBurnside平均を取り、答えをΣ_c(-1)^(K-c) C(K,c)F(c)で求める。P>Nの素数なので必要なfactorial inverseが存在する。


## 転用するときの確認

- **Burnsideの補題**: labelの置換で同一視した構造を数え、自己同型の大きさが対象ごとに異なるとき。 適用: 各頂点置換が固定する彩色graph数を平均する。
- **cycle typeによる群要素圧縮**: 置換の固定点数がcycle構造だけで決まるとき。 適用: N!個の置換をinteger partitionごとの重み付き和へ置き換える。
- **包含排除**: K種類すべてを少なくとも1回使うsurjectiveな割当を数えるとき。 適用: 使用可能色をc色に制限したF(c)から欠けた色を除く。
- 置換で不変な部分集合を数えるときは、基礎要素上に誘導された作用のorbit数を求め、各orbitを丸ごと選ぶ2択へ変える。
- N=3のcycle type 1+1+1、2+1、3で、3-cycle内の3辺が1orbitになることと各typeの置換数の総和が3!になることを照合する。

## 到達確認

### 到達確認 1 — 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる

転移題材: [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g)

**課題**: ABC428 G「Necklace」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 積制約付きネックレスを、順序付き列 DP と回転の不動点集計から数えられる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 積制約付きネックレスを、順序付き列 DP と回転の不動点集計から数えられる。

- 対象技能が担う箇所: 積制約付きネックレスを、順序付き列 DP と回転の不動点集計から数えられる。
- 転移題材の解法接続: A(n)[x] を『長さ n、総積 x の順序付き列数』として、宝石の頻度との積約数 DP で n≤V まで前計算する。各 L≤V、d|L、各完全 d 乗 x=y^d≤U について φ(d)·A(L/d)[y]/L を答え[x]へ加える。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

</details>


## 根拠

- [ABC284 H 公式解説](https://atcoder.jp/contests/abc284/editorial/5481)
- [ABC284 H 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC428 G 公式解説](https://atcoder.jp/contests/abc428/editorial/14241)
- [ABC428 G 公式問題文](https://atcoder.jp/contests/abc428/tasks/abc428_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-orbit-counting`
