---
title: "列・文字列のrolling fingerprint"
description: "前提から列・文字列のrolling fingerprintを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 140
---

# 列・文字列のrolling fingerprint

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 列・文字列のrolling fingerprint

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。

検索語: polynomial hash、rolling hash、ローリングハッシュ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)

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

### 到達確認 1 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f)

**課題**: ABC331 F「Palindrome Query」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: Rolling Hashの結合monoid: 文字列の連結順を保つ区間情報を、更新可能な木へ載せたいとき。 適用: 両向きhashと基数冪をnodeに持ち、区間結合を定数時間にする。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- Rolling Hashの結合monoid: 文字列の連結順を保つ区間情報を、更新可能な木へ載せたいとき。 適用: 両向きhashと基数冪をnodeに持ち、区間結合を定数時間にする。

- 対象技能が担う箇所: Rolling Hashの結合monoid: 文字列の連結順を保つ区間情報を、更新可能な木へ載せたいとき。 適用: 両向きhashと基数冪をnodeに持ち、区間結合を定数時間にする。
- 転移題材の解法接続: 各文字をhash nodeとしてsegment treeを構築する。更新queryでは対応葉を置換し、判定queryでは[L,R]のnodeを取得してforward hashとbackward hashを全採用modulusで比較する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-sequence-fingerprint`
