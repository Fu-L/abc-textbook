---
title: "Baby-Step Giant-Step・可逆作用の反復到達探索"
description: "前提からBaby-Step Giant-Step・可逆作用の反復到達探索を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 97
---

# Baby-Step Giant-Step・可逆作用の反復到達探索

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 法上の四則演算・高速累乗・逆元
- この位置で学ぶ理由: 有限集合上の可逆な作用と逆作用を定義し、離散対数やaffine反復を含む反復到達時刻をbaby/giantの衝突へ変換して平方根時間で求める。合同算術が必要な問題では個別のreadinessとして接続する。

### この単元では扱わない範囲

- Baby-Step Giant-Step・可逆作用の反復到達探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Baby-Step Giant-Step・可逆作用の反復到達探索

有限群の累乗または有限集合上の可逆写像fについてf^t(s)=gをt=iB+jへ分け、target側のinverse baby stepとstart側のgiant stepをhash照合して到達時刻を平方根時間で求める。

検索語: BSGS、Baby-Step Giant-Step、baby-step giant-step

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる

題材: [ABC270 G「Sequence in mod P」](https://atcoder.jp/contests/abc270/tasks/abc270_g)

選定理由: affine mapsはpair(a,b)で表し、compositionによりf^MもO(M)またはbinary exponentiationで一つのaffine mapとして得られる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。invertible functionの反復でf^n(x)=yとなる最小nを、状態空間全走査より速く求めたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- affine modular sequenceがtargetへ初めて達するindexを平方根分割で判定・復元できる。

#### 観察

- A≠0ならf(x)=Ax+Bはfield modulo P上のbijectionで、inverseもaffine functionとして計算できる。
- 有限集合上のbijection orbitではGが現れるなら最初のP step以内なので、indexをiM+jへ分けてmeet-in-the-middleできる。

#### 候補を比較する

- **採用**: M≈√Pとし、G,f^{-1}(G),…,f^{-(M−1)}(G)をmapへ置き、S,f^M(S),…とのintersectionを探す。 — 一致 f^{iM}(S)=f^{-j}(G) から候補index iM+jを復元でき、各caseをO(√P log P)以内で処理できる。
- **棄却**: Sからrecurrenceを順にsimulationし、Gまたは重複状態に達するまで進める。 — 一caseでP=10^9 stepかかり得る。

#### 鍵となる着眼

- affine mapsはpair(a,b)で表し、compositionによりf^MもO(M)またはbinary exponentiationで一つのaffine mapとして得られる。
- baby valuesに重複がある場合は最小jを保持し、得られたiM+jの最小値を取らないと最初の到達時刻を保証できない。

#### アルゴリズムへ接続する

invertible affine recurrenceのorbit searchへBaby-Step Giant-Stepを適用し、forward giant stepsとbackward baby stepsを衝突させる。


## 転用するときの確認

- **Baby-Step Giant-Step**: invertible functionの反復でf^n(x)=yとなる最小nを、状態空間全走査より速く求めたいとき。 適用: targetからinverseをM回辿るbaby tableと、startからf^Mを反復するgiant sequenceを照合する。
- **affine mapの合成と逆写像**: modular recurrenceがax+bで、反復・逆向き遷移をまとめたいとき。 適用: pair(a,b)のcompositionでpower mapを作り、a^{-1}からinverse affine mapを導く。
- inverseを要求するorbit algorithmでは、非可逆parameterを先に分類して小さな直接解へ落とす。
- function iterationの到達時刻はindexをblock quotientとremainderに分け、inverse側とのmeet-in-the-middleを考える。
- BSGSで存在判定だけでなく最小indexが必要なら、tableのduplicateと候補の走査順を別途証明する。

## 到達確認

### 到達確認 1 — 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる

境界検証の元題材: [ABC270 G「Sequence in mod P」](https://atcoder.jp/contests/abc270/tasks/abc270_g)

**課題**: ABC270 G「Sequence in mod P」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- affine modular sequenceがtargetへ初めて達するindexを平方根分割で判定・復元できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC270 G 公式解説](https://atcoder.jp/contests/abc270/editorial/4847)
- [ABC270 G 公式問題文](https://atcoder.jp/contests/abc270/tasks/abc270_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-baby-step-giant-step`
