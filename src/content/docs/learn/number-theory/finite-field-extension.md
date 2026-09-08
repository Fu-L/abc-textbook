---
title: "拡大有限体の表現と四則演算を構成する"
description: "前提から拡大有限体の表現と四則演算を構成するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 214
---

# 拡大有限体の表現と四則演算を構成する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 法上の四則演算・高速累乗・逆元
- この位置で学ぶ理由: 素体上の演算を土台に、既約関係で元を標準化し、加減乗除が閉じる拡大体として扱う。

### この単元では扱わない範囲

- 素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。

## 発動条件と見分け方

### 拡大有限体の表現と演算

素体上の多項式剰余または基底座標で有限体の元を表し、標準化された加減乗除を構成する。

検索語: Nim product、extension field、quadratic finite field、有限体拡大

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる

題材: [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)

選定理由: hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。多数のsubstring/virtual sequenceをlexicographically比較し、prefix equalityを高速判定できるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 二subarraysのelementwise XOR列と第三subarrayのlexicographic relationを高速に判定できる。

#### 観察

- lexicographic comparisonは二列のLCP長を求め、最初の不一致要素またはlengthだけを比較すればよい。
- 通常rolling hashはelementwise additionに線形だが、nimber fieldではfield additionがbitwise XORなので H(B xor C)=H(B) xor H(C) が成り立つ。

#### 候補を比較する

- **採用**: 64-bit nimbers上のrandom-base rolling hashを前計算し、virtual XOR sequenceとtargetのprefix equalityをbinary searchしてLCPを得る。 — 各substring hashとXOR-combined hashを定数時間で作れ、一queryをO(log N) hash comparisonsにできる。
- **棄却**: 各queryでXOR列を実際に生成し、target subarrayと先頭から比較する。 — query lengthの総和がNQ規模になり得る。

#### 鍵となる着眼

- hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。
- LCPがmin(leftLength,rightLength)未満なら実値A_{a+l} xor A_{c+l}とA_{e+l}を比較し、全prefix一致なら短い列だけがstrictly smallerである。

#### アルゴリズムへ接続する

XORを加法とするfinite fieldへrolling hashを移植し、linear hash compositionとLCP binary searchでvirtual arraysを比較する。


## 転用するときの確認

- **rolling hashによるLCP二分探索**: 多数のsubstring/virtual sequenceをlexicographically比較し、prefix equalityを高速判定できるとき。 適用: prefix length kのhash一致をpredicateとして最大共通prefix長をbinary searchする。
- **演算に線形なhash fieldの選択**: elementwise演算後のsequence hashをoperand hashesから直接合成したいとき。 適用: XORが加法になるnimber fieldとNim productをrolling-hashの係数演算に用いる。
- combined sequenceの演算とhash加法を一致させるには、その演算を加法に持つalgebraic fieldを探す。
- virtual elementwise sequenceの比較は、演算に線形なhashを作ってprefix equality oracleにする。
- lexicographic判定ではLCP探索後の不一致比較と、片方がprefixになったlength比較を分離する。

## 到達確認

### 到達確認 1 — 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる

転移題材: [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)

**課題**: ABC381 G「Fibonacci Product」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 巨大 N の Fibonacci型項積を、有限体拡大と平方分割・等比多点評価で高速に計算できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 巨大 N の Fibonacci型項積を、有限体拡大と平方分割・等比多点評価で高速に計算できる。

- 対象技能が担う箇所: 巨大 N の Fibonacci型項積を、有限体拡大と平方分割・等比多点評価で高速に計算できる。
- 転移題材の解法接続: 拡大体要素を pair で実装して一般項係数と周期を求める。周期商の積を高速冪し、残りを平方分割する。F_M(X) を doubling と NTT で構築し、chirp-z transform で等比点評価して全値を掛ける。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

</details>


## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-finite-field-extension`
