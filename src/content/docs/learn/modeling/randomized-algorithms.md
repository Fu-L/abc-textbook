---
title: "乱択の成功条件と誤り確率を設計する"
description: "前提から乱択の成功条件と誤り確率を設計するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 77
---

# 乱択の成功条件と誤り確率を設計する

このページは **節** です。同じ対象を扱う技能を比較し、どの発動条件・不変量・計算量の違いで使い分けるかを学びます。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

### この単元では扱わない範囲

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 下位単元と学習順

以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。

1. [乱択代数fingerprint](./randomized-algebraic-fingerprint.md)（標準順 185）— 乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

## 発動条件と見分け方

### 乱択・Monte Carloアルゴリズム

乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。

検索語: Las Vegas algorithm、Monte Carlo algorithm、probabilistic method、乱択アルゴリズム

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる

題材: [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g)

選定理由: candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。未知のgood subsetが全体の半数超を占め、その中の少数sampleから答え候補を生成できるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- majority remainderを生むmodulusを高確率で発見し、存在しないcandidateは検証で排除できる。

#### 観察

- valid Mで同じremainder Xを持つmajority index set Sを考えると、任意のi,j∈SについてM divides |A_i−A_j|となる。
- |S|>N/2なのでrandomに二indexを選んだとき両方がSに入る確率は1/4より大きく、正しいdifferenceをconstant probabilityで得られる。

#### 候補を比較する

- **採用**: random pairsのdifferenceをfactorizeし、その3以上のdivisorsを候補Mとして全Aのremainder majorityを検証する。 — majority pairを引けば真のMがdifferenceのdivisorに現れ、反復でfailure probabilityが幾何的に減る。
- **棄却**: M=3,…,10^9を列挙してremainder frequenciesを調べる。 — modulus候補範囲が大きすぎる。

#### 鍵となる着眼

- candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。
- divisor closureより全divisorsの代わりにdifferenceのodd prime factorsと4だけを試しても、valid divisorがある場合のより小さいvalid candidateを拾える。

#### アルゴリズムへ接続する

hidden majority congruence classからrandom pair samplingでmodulus divisorを抽出し、factorization-generated candidatesをdeterministically verifyするMonte Carlo searchである。

## 下位単元を使い分ける比較例

未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。

- **乱択代数fingerprint** — 直接到達点: multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

**比較の到達点**: 未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。


## 転用するときの確認

- **majority集合からの乱択sampling**: 未知のgood subsetが全体の半数超を占め、その中の少数sampleから答え候補を生成できるとき。 適用: random pairを複数回選び、両方がmajority residue classに入るeventを利用する。
- **差の約数による合同類候補**: 複数整数が同じmodulo remainderを持つ未知modulusを探すとき。 適用: sample differenceをfactorizeし、3以上のdivisorsまたは必要十分なprime-factor candidatesを列挙する。
- majority構造はrandom pairが同じhidden classへ入る定数確率を与え、candidate generationのrandomizationに使える。
- 同じmodulo classの二値差はmodulusの倍数になるので、未知modulus候補をdifference factorizationへ移す。
- majorityが保証するconstant hit probabilityと、候補の完全検証を組み合わせてone-sided errorにする。

## 到達確認

### 到達確認 1 — 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる

転移題材: [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)

**課題**: ABC422 E「Colinear」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。

### 学習経路の選択

**課題**: 未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。

**合格条件**: 採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 過半数点を通るlineを高確率で発見・構成できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 過半数点を通るlineを高確率で発見・構成できる。

- 対象技能が担う箇所: 過半数点を通るlineを高確率で発見・構成できる。
- 転移題材の解法接続: 異なるindex p,qをrandom sampleしa=y_p-y_q,b=x_q-x_p,c=x_p y_q-x_q y_pを作る。全点でax+by+c=0をcountし2count>NならYesと係数を出す。100回失敗ならNo。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

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

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC272 G 公式解説](https://atcoder.jp/contests/abc272/editorial/4981)
- [ABC272 G 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)
- [ABC422 E 公式問題文](https://atcoder.jp/contests/abc422/tasks/abc422_e)
- [ABC422 E 公式解説](https://atcoder.jp/contests/abc422/editorial/13820)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-randomized-algorithms`
