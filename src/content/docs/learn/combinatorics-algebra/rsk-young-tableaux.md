---
title: "Robinson–Schensted対応・Young tableau"
description: "前提からRobinson–Schensted対応・Young tableauを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 113
---

# Robinson–Schensted対応・Young tableau

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Robinson–Schensted対応・Young tableau

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。

検索語: RSK correspondence、Robinson–Schensted対応、Young tableau

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g)

選定理由: 末尾に n+0.5 を加えて長方形へなる挿入過程は、元 tableau で t_{i+1,A-1}<t_{i,A} という追加順序制約に翻訳できる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。permutation の LIS/LDS を同時に固定して数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- LIS/LDS と末尾挿入条件を tableau の形と順序制約へ翻訳し、状態 DP で数えられる。

#### 観察

- RSK 対応では permutation の LIS と LDS が Young 図形の第一行・第一列長になる。長さ AB-1 で両者が A,B なら、形は A×B 長方形から右下1マスを除いたものに一意に定まる。

#### 候補を比較する

- **採用**: 条件を満たす標準 Young tableau を、1..AB-1 を置く順の ideal 状態 DP で数え、末尾追加条件に対応する右端列の不等式も遷移可否へ組み込む。 — AB≤120 でも可能な Young 図形 ideal の状態数は制約内で50万程度に抑えられ、RSK の一対一対応から permutation 数を復元できる。
- **棄却**: (AB-1)! 個の permutation を列挙して LIS/LDS と追加後の条件を検査する。 — AB は120まであり階乗列挙は不可能で、LIS/LDS だけの DP も追加条件の tableau 情報を失う。

#### 鍵となる着眼

- 末尾に n+0.5 を加えて長方形へなる挿入過程は、元 tableau で t_{i+1,A-1}<t_{i,A} という追加順序制約に翻訳できる。
- 小さい数から埋める途中状態は左上に閉じた ideal で、行ごとの充填長という境界 path だけで表せる。

#### アルゴリズムへ接続する

長方形欠損形の各行の充填長を状態にし、標準 tableau の行列増加条件と追加の右端不等式を壊さない外角へ次の数を置く DP を行う。得た tableau 数を RSK のもう一方の tableau 数と組み合わせる。


## 転用するときの確認

- **Robinson–Schensted 対応**: permutation の LIS/LDS を同時に固定して数えたいとき。 適用: LIS/LDS 条件を Young 図形の形へ変換する。
- **Young 図形 ideal DP**: 小さな面積の標準 tableau に追加順序制約があるとき。 適用: 埋め済み領域の境界だけを状態として数える。
- 追加要素の row insertion を追うと、難しい第三条件が既存セル間の局所不等式になる。
- RSK の P,Q tableau のどちらが何通り寄与するかと、末尾 n+0.5 の bumping path が右端不等式を生む過程を図で復習する。

## 到達確認

### 到達確認 1 — 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g)

**課題**: ABC378 G「Everlasting LIDS」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- LIS/LDS と末尾挿入条件を tableau の形と順序制約へ翻訳し、状態 DP で数えられる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC378 G 公式解説](https://atcoder.jp/contests/abc378/editorial/11283)
- [ABC378 G 公式問題文](https://atcoder.jp/contests/abc378/tasks/abc378_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-rsk-young-tableaux`
