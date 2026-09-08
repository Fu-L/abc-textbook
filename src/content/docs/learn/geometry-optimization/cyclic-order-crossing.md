---
title: "円環順序・chord交差"
description: "前提から円環順序・chord交差を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 170
---

# 円環順序・chord交差

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 幾何の基本判定と座標変換
- この位置で学ぶ理由: 幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、円環順序・chord交差の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 円環順序・chord交差

円周上の端点順をcutで線形化し、二chordの端点交互配置またはlaminar括弧構造として交差を判定・数え上げる。

検索語: chord crossing、円環順序、端点交互配置

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる

題材: [ABC338 E「Chords」](https://atcoder.jp/contests/abc338/tasks/abc338_e)

選定理由: 左端を見たchordをpushし、右端iを見た時にstack topがiでなければ、iの内側で開始した別chordがまだ閉じておらずA_i<A_j<B_i<B_jとなる。逆にtopが常に一致すれば全区間は正しくnestedし交差しない。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。円周上の端点の交互配置を線形順序で判定したい。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 円内のN本のchordのうち、少なくとも二本が交差するかを判定できる。

#### 観察

- 各chordの端点をA_i<B_iに揃え、円を1と2Nの間で切る。二本が交差するのは端点がA_i<A_j<B_i<B_jのように交互に現れる場合であり、交差がなければ開いたchord区間は互いにdisjointか完全にnestedになる。

#### 候補を比較する

- **採用**: 端点を順に走査し、open中のchordをstackで照合する — 非交差ならnested区間の閉じ順は必ずLIFOであり、一度の線形走査で交差を検出できる。
- **棄却**: 全chord pairの端点順を比較する — pair数がO(N^2)でN=2×10^5に対応できない。

#### 鍵となる着眼

- 左端を見たchordをpushし、右端iを見た時にstack topがiでなければ、iの内側で開始した別chordがまだ閉じておらずA_i<A_j<B_i<B_jとなる。逆にtopが常に一致すれば全区間は正しくnestedし交差しない。

#### アルゴリズムへ接続する

各chordで端点をmin/maxにし、位置1,…,2Nにchord IDと左/右種別を記録する。左端ならIDをpush、右端ならpopしたIDと比較し、不一致ならYesを即出力する。最後まで一致すればNo。


## 転用するときの確認

- **円環のcut展開**: 円周上の端点の交互配置を線形順序で判定したい。 適用: 端点間の切れ目で円を開き、各chordを区間の開閉eventとして扱う。
- **括弧列としてのstack判定**: 区間族が交差せずnested/disjointであるかを調べたい。 適用: chord IDを括弧種類とみなし、closeが直近openと一致するか確認する。
- 区間の部分重なり検出は、laminar族なら開閉eventがLIFOになることを使える。
- disjoint、完全nested、端点が交互の二本、外側chordを跨いで複数交差する例でstack列を確認する。

## 到達確認

### 到達確認 1 — 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる

転移題材: [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)

**課題**: ABC263 Ex「Intersection 2」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 実数二分探索、直線と円の交点、偏角ソート、BITによる区間加算・一点取得を扱えること。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 実数二分探索、直線と円の交点、偏角ソート、BITによる区間加算・一点取得を扱えること。

- 対象技能が担う箇所: 実数二分探索、直線と円の交点、偏角ソート、BITによる区間加算・一点取得を扱えること。
- 転移題材の解法接続: geometric order statistic を parametric counting にし、line-circle dualization で chord intersection、さらに circular order の interval crossing count へ段階的に落とす。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

</details>


## 根拠

- [ABC263 H 公式解説](https://atcoder.jp/contests/abc263/editorial/4547)
- [ABC263 H 公式問題文](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC338 E 公式問題文](https://atcoder.jp/contests/abc338/tasks/abc338_e)
- [ABC338 E 公式解説](https://atcoder.jp/contests/abc338/editorial/9172)
- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-cyclic-order-crossing`
