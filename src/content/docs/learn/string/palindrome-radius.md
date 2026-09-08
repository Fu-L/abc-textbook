---
title: "回文半径と左右対称区間を特定する"
description: "前提から回文半径と左右対称区間を特定するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 50
---

# 回文半径と左右対称区間を特定する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。

### この単元では扱わない範囲

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 発動条件と見分け方

### 回文半径・Manacher

各中心の最大回文半径を左右対称性と既知区間の再利用で線形に求める。

検索語: Manacher's algorithm、Manacher法

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる

題材: [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)

#### このOutcomeを支える根拠

- 各中心の最大odd-palindrome radius条件を満たす正整数列の存在を判定し、存在すればlexicographically smallestなSを構成できる。

#### 観察

- 各iの内側palindrome条件は対称位置同士のequality、もう一つ外側までpalindromeでない条件は外側pairのinequalityになる。equality edgeをDSUで縮約し、inequality edgeをcomponent間の色違い制約として扱える。

#### 候補を比較する

- **採用**: Manacher型の再利用でO(N)本のequality unionだけ生成し、縮約graphをgreedy coloringする — 本来O(ΣA_i)本ある対称pairの連結性を線形に保ち、最終検証込みで大入力へ対応できる。
- **棄却**: 各iで距離1…A_iの全対称pairをunionする — A_iが大きいcenterが多数あるとequality edge数がO(N^2)になる。

#### 鍵となる着眼

- 既に処理したcenterのradius情報で重なるpalindrome内部のequalityをmirrorから再利用し、新しく右端を伸ばす対称pairだけunionすれば、Manacherと同じ償却でunion回数をO(N)にできる。得たcomponent内にinequality edge両端が入れば不可能である。

#### アルゴリズムへ接続する

modified Manacher走査で各center iの要求radius A_iまで、既知mirror範囲をskipしつつ新規対称位置をDSU unionする。境界内なら(i-A_i-1,i+A_i+1)をinequality edgeにする。自己loopがなければ元index昇順に未着色componentへ、既着色のinequality neighborが使わない最小正整数を割り当てる。生成Sを通常Manacherで検証し全radius=A_iなら出力、違えばNo。


## 転用するときの確認

- **Manacher型の対称制約圧縮**: 多数centerのpalindrome equality区間が大きく重複する。 適用: 既知の右端とmirror radiusを再利用し、未確認部分だけ対称pairを接続する。
- **equality縮約後のgreedy coloring**: 等しい変数群と、異なる必要がある群pairがあり、正整数color数に上限がない。 適用: DSU componentを最初の出現順に処理し、colored neighborのmexを割り当てる。
- unbounded graph coloringのlexicographic最小列はcomponent初出順のneighbor-color mexで構成できる。
- A_i=0、全体palindrome、重なるradiusが矛盾する配列、inequality self-loopを小Nのpartition/color全探索と比較し最終radiusを再計算する。

## 到達確認

### 到達確認 1 — 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる

転移題材: [ABC398 F「ABCBA」](https://atcoder.jp/contests/abc398/tasks/abc398_f)

**課題**: ABC398 F「ABCBA」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各中心の回文半径を求め、左右対称な区間の成立条件を判定できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 最短palindrome補完を最長palindromic suffixへ帰着し、線形時間で文字列を構成できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 最短palindrome補完を最長palindromic suffixへ帰着し、線形時間で文字列を構成できる。

- 対象技能が担う箇所: 最短palindrome補完を最長palindromic suffixへ帰着し、線形時間で文字列を構成できる。
- 転移題材の解法接続: S（またはseparator込み列）へManacher法を適用する。各centerの半径から右端がNに達するpalindromeの最小start kを求め、Sへprefix[0,k)のreverseを連結する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

</details>


## 根拠

- [ABC349 G 公式解説](https://atcoder.jp/contests/abc349/editorial/9782)
- [ABC349 G 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC398 F 公式解説](https://atcoder.jp/contests/abc398/editorial/12501)
- [ABC398 F 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-palindrome-radius`
