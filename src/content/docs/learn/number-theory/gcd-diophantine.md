---
title: "gcdと整数解の成立条件"
description: "前提からgcdと整数解の成立条件を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 19
---

# gcdと整数解の成立条件

このページは **節** です。同じ対象を扱う技能を比較し、どの発動条件・不変量・計算量の違いで使い分けるかを学びます。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。

### この単元では扱わない範囲

- 連分数・Stern–Brocotによる有理近似、および複数の合同類をCRTで統合する構成。

## 下位単元と学習順

以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。

1. [gcd不変量・差分構造](./gcd-structure.md)（標準順 118）— 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 発動条件と見分け方

### Bézout等式・一次不定方程式

整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。

検索語: Bézout等式、extended Euclidean algorithm、一次不定方程式、拡張Euclid

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる

題材: [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)

選定理由: 非平行な二vector u,vではdeterminantから係数p,qを一意に求め、割り切れてp,q≥0ならp+qが候補になる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。多数種類の同価操作を可換に組み合わせ、vector relationで同じ結果をより少ない種類へ変形できるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 巨大座標へのminimum move countを、少数方向表現の定数個判定として求められる。

#### 観察

- 各moveは8方向のinteger vectorで、順序は結果に影響せず、必要なのは許可vectorごとの非負使用回数とその総和だけである。
- 局所的なvector恒等式でmove countsを交換すると、操作回数を増やさずsupportを高々2方向へ減らせる。ただし二つのdiagonalと一つのaxis directionを使い、axisをちょうど1回残す形だけが例外候補になる。

#### 候補を比較する

- **採用**: 許可された高々2方向の組を全列挙して非負整数係数を解き、さらに各axis moveを1回先に使った残targetでも同じpair列挙を行う。 — exchange argumentが少数supportのoptimal solutionの存在を保証し、方向数8は定数なので各caseを定数時間で判定できる。
- **棄却**: 座標平面上でBFSまたはtargetまでのdistance DPを行う。 — |A|,|B|が10^9で探索領域を列挙できない。

#### 鍵となる着眼

- 非平行な二vector u,vではdeterminantから係数p,qを一意に求め、割り切れてp,q≥0ならp+qが候補になる。
- 三方向例外もaxis vectorを一度引けば残りは二方向の非負整数結合になり、同じsolverを再利用できる。

#### アルゴリズムへ接続する

integer lattice shortest walkをexchange argumentでconstant-support representationsへ縮約し、小さなDiophantine systemsの全列挙で解く。

## 下位単元を使い分ける比較例

未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。

- **gcd不変量・差分構造** — 直接到達点: gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。近いが対象外: gcd不変量・差分構造の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

**比較の到達点**: 未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。


## 転用するときの確認

- **交換法によるsupport削減**: 多数種類の同価操作を可換に組み合わせ、vector relationで同じ結果をより少ない種類へ変形できるとき。 適用: 8方向moveの三種類以上の併用を置換し、定数個の二方向pairと限定された三方向例外を漏れなく全列挙する。
- **二変数一次Diophantine方程式**: target vectorを二つのinteger vectorsの非負整数結合で表せるか判定したいとき。 適用: determinantとdivisibilityで二係数を求め、nonnegativeなら使用回数和を比較する。
- 操作集合が小さくtargetが巨大な最短walkでは、探索空間よりoptimal representationのsupport boundを探す。
- 可換なvector操作では、三種類以上の使用を同じ変位・非増加costで置換するrelationを探す。
- support boundが得られたら、幾何的case分けをdeterminantによる統一solverへ落とす。

## 到達確認

### 到達確認 1 — 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる

転移題材: [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g)

**課題**: ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。

### 学習経路の選択

**課題**: 未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。

**合格条件**: 採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 三重列挙を一軸走査と一次不定方程式の区間解数へ分解し、N=10^6 を扱える。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 三重列挙を一軸走査と一次不定方程式の区間解数へ分解し、N=10^6 を扱える。

- 対象技能が担う箇所: 三重列挙を一軸走査と一次不定方程式の区間解数へ分解し、N=10^6 を扱える。
- 転移題材の解法接続: g,u,v=extgcd(B,C) を一度求める。i=1..N で Y=X−Ai とし、Y≤0 または Y%g≠0 なら skip。基準 j0=u(Y/g), k0=v(Y/g) を作り、二変数の上下限制約から signed floor_div/ceil_div で t の下限・上限を求め、その交差長を答えへ加える。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

</details>

<details><summary>学習経路の選択の解答基準</summary>

**検証状態**: `pending` — これは T057 の学習経路レビュー前に使う自己評価基準であり、検証済みとは扱いません。

正解は一つの単元名ではなく、問題構造と各候補の定義・対象外との照合である。下位単元のOutcome自体の到達確認はそれぞれの所有Unitで行う。

- 問題を対象・操作・保つ量・求める量へ分解する。
- 各下位単元の発動条件を一つずつ照合し、不足情報を明示する。
- 採用候補の成立理由と、近い候補の最初の破綻点を対にする。
- 前提DAGと標準順を確認し、選んだ経路の最初の単元を決める。

期待する到達点: 未知問に対する学習経路を、発動条件・棄却理由・前提順とともに再現できる。

</details>


## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G 公式解説](https://atcoder.jp/contests/abc248/editorial/3795)
- [ABC248 G 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_g)
- [ABC271 H 公式解説](https://atcoder.jp/contests/abc271/editorial/4932)
- [ABC271 H 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC315 G 公式解説](https://atcoder.jp/contests/abc315/editorial/6994)
- [ABC315 G 公式問題文](https://atcoder.jp/contests/abc315/tasks/abc315_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-gcd-diophantine`
