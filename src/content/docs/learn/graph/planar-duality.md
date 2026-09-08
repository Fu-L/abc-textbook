---
title: "平面graph双対・cut/path対応"
description: "前提から平面graph双対・cut/path対応を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 181
---

# 平面graph双対・cut/path対応

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 最大流・最小カット、最短路モデル
- この位置で学ぶ理由: 最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

検索語: cut–path duality、planar duality、平面双対グラフ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

選定理由: 外側faceはsource-target間のboundary arcで二つにsplitし、top+right側を一端子、left+bottom側を他端子とする。この二端子を結ぶdual pathがprimalのs-t cutになる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。平面graphの二点間path存在を、cutを横切るdual pathで判定したいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 最大4×10^10 cellのgridでも、20万障害物が作るdual zero-edge connectivityだけから到達可能性を判定できる。

#### 観察

- free-cell graphでsourceからtargetへpathがあることは、各隣接edgeを両端freeなら容量1、どちらかblockedなら0としたnetworkのmax flowが正であることと同値である。
- planar max-flow/min-cut dualityにより、到達不能はsource-targetを分ける容量0 cut、すなわち分割した外側face二端子を0-weight dual edgeだけで結ぶpathの存在に一致する。

#### 候補を比較する

- **採用**: 障害物に接するcapacity0 primal edgeだけをdual face間のunionとして処理し、二つの外側arc terminalの連結性をDSUで判定する — 各障害物は高々4本の隣接edgeを0にするので、巨大なHW個のcell/faceを生成せずO(K)個の関連faceだけhash mapで持てる。
- **棄却**: H×W全cellを頂点として通常BFSする — H,Wは各2×10^5でHWは4×10^10になり得る一方、障害物は2×10^5個しかなく疎性を使う必要がある。

#### 鍵となる着眼

- 外側faceはsource-target間のboundary arcで二つにsplitし、top+right側を一端子、left+bottom側を他端子とする。この二端子を結ぶdual pathがprimalのs-t cutになる。
- horizontal primal edgeの上下face、vertical edgeの左右faceを、そのedgeの少なくとも一端が障害物ならunionする。内部faceは障害物近傍だけ遅延生成すればよい。

#### アルゴリズムへ接続する

dual terminal U=top/right outer arc、D=left/bottom outer arcを作る。各obstacleと上下左右のgrid内neighborが作るprimal edgeを一度ずつ見て、horizontalなら上・下face、verticalなら左・右faceをDSUで結ぶ。boundary側faceはU/Dへ対応させる。最後にU,Dが同componentならNo、そうでなければYes。


## 転用するときの確認

- **planar duality**: 平面graphの二点間path存在を、cutを横切るdual pathで判定したいとき。 適用: 0容量s-t cutを、0-weight dual edgeだけの外側arc間pathへ変換する。
- **疎なdual graphのDSU**: 巨大gridで非零eventが少なく、必要なのが特定edge集合のconnectivityだけのとき。 適用: 障害物に接するedge周辺のfaceだけ座標mapで生成しunionする。
- **outer face splitting**: sourceとtargetが平面graphの外周にあり、s-t cutをdual shortest pathへ写すとき。 適用: 外周をsからtへの二arcに分けて別dual terminalとして扱う。
- 巨大領域の到達性では、通行可能領域を圧縮するほか、障害物側のseparator connectivityをplanar dualで調べる方向もある。
- H=1/W=1、source隣接二cellの斜め障害物、top-bottom barrier、top-rightだけを結ぶ非separatorを小grid BFSと比較する。

## 到達確認

### 到達確認 1 — 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

**課題**: ABC413 G「Big Banned Grid」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 最大4×10^10 cellのgridでも、20万障害物が作るdual zero-edge connectivityだけから到達可能性を判定できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-planar-duality`
