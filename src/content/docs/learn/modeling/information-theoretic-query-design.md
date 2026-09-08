---
title: "情報量下界・query符号設計"
description: "前提から情報量下界・query符号設計を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 94
---

# 情報量下界・query符号設計

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 情報量下界・query符号設計の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 情報量下界・query符号設計

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。

検索語: binary incidence code、query code design、情報量下界

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる

題材: [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e)

#### このOutcomeを支える根拠

- 必要最小人数の友人への配布を提示し、返された体調patternから腐ったbottle番号を一意に特定できる。

#### 観察

- M人の体調結果はM bitの文字列なので区別できる候補は高々2^M個である。よってN本を必ず識別するにはM≥ceil(log2 N)が必要で、各bottle番号をそのM bit符号として配れば同じ人数で達成できる。

#### 候補を比較する

- **採用**: 0-based bottle番号のbinary bitごとに友人へ飲ませる — 各bottleに相異なるM-bit codeを割り当て、体調文字列をそのまま腐敗番号へ復号でき、情報量下界と一致する。
- **棄却**: 各友人に一つの連続区間だけを割り当てる二分探索的質問 — 結果は一晩後に一括で返りadaptiveに次の質問を選べないため、固定区間だけでは一般に最小人数で全番号を符号化できない。

#### 鍵となる着眼

- M=ceil(log2 N)なら0,…,N-1は全てM bitで一意である。友人iへi bit目が1のbottleだけ飲ませると、腐ったbottle xによる体調列Sはxのbinary表現と完全に一致する。

#### アルゴリズムへ接続する

最小のM with 2^M≥Nを出力する。各bit iについて、(j-1)のi bit目が1であるbottle jを昇順に列挙して人数と一覧を出しflushする。長さMのSを読み、S_iをbit iとして整数xを復号しx+1を出力する。


## 転用するときの確認

- **情報量下界**: 一回の非adaptive検査で各参加者から0/1だけが返る。 適用: 結果pattern数2^Mが候補数N以上必要というpigeonhole principleで最小人数を下から抑える。
- **binary incidence coding**: 各対象を、どの検査群へ含めるかのsubsetで識別したい。 適用: 対象indexのbit列をmembership vectorとして使い、観測vectorからindexを復元する。
- 欠陥がちょうど一つのgroup testingは、対象ごとのbinary code設計に一致する。
- Nが2の冪の場合と直後、全0のcodeに対応するbottle 1、bit順を逆に読んだ場合をlocal interactorで確認する。

## 到達確認

### 到達確認 1 — 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる

境界検証の元題材: [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e)

**課題**: ABC337 E「Bad Juice」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 必要最小人数の友人への配布を提示し、返された体調patternから腐ったbottle番号を一意に特定できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC337 E 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC337 E 公式解説](https://atcoder.jp/contests/abc337/editorial/9140)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-information-theoretic-query-design`
