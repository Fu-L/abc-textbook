---
title: "potential・weighted DSU"
description: "前提からpotential・weighted DSUを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 179
---

# potential・weighted DSU

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: DSUによる連結成分管理・縮約、静的graph等式制約のpotential伝播
- この位置で学ぶ理由: DSUによる連結成分管理・縮約・静的graph等式制約のpotential伝播で得た考え方と実装を再利用し、potential・weighted DSUの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### potential・weighted DSU

親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。

検索語: potential DSU、weighted Union-Find、重み付きUnion-Find

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 正当化と転用の境界

- d[v]=potential(v)-potential(parent(v))と定義する。find時は旧親から根への差を加算してから親を根へ変更する。制約potential(y)-potential(x)=wで、根rx,ryへの差をdx,dyとすると、ryをrxの子にする辺差はw+dx-dy。逆向きに付けるなら符号を反転する。同根ならdy-dx=wとの整合性を検査する。
- ABC328 Fは制約を順次追加して矛盾する追加を棄却するので、この不変量を直接学べる。全辺が先に与えられるABC280 FのDFSによるpotential伝播と非零cycle判定は静的potentialの節で扱う。

### 例 1 — DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる

題材: [ABC328 F「Good Set Query」](https://atcoder.jp/contests/abc328/tasks/abc328_f)

選定理由: find時にparent pathの差も加算して圧縮すれば、pot[v]=X_v-X_rootを取得でき、同rootならX_a-X_b=pot[a]-pot[b]である。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。onlineに差分等式pot(a)-pot(b)=dを追加し整合性を判定するとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 入力順greedyで追加可能な差分constraint indexを、weighted DSUで整合性判定しながら求められる。

#### 観察

- accepted constraint X_a-X_b=dは頂点a,b間のpotential差を固定するedgeであり、同じconnected component内の任意2頂点差は既存constraintから一意に決まる。
- a,bが別componentなら両componentの絶対offsetは自由なので、新しいdは常に矛盾なく両者を接続できる。
- 同componentなら既に決まるX_a-X_bとdが一致するときだけconstraintを追加できる。

#### 候補を比較する

- **採用**: rootからのpotential差を持つweighted Union-Findで、各queryの既知差判定とconstraint unionを行う。 — 通常DSUの連結性に数値差を追加し、Q≤2×10^5をほぼ定数償却で順にsimulationできる。
- **棄却**: accepted constraint graphへedgeを追加し、queryごとにDFSしてa-bの差を求める。 — 長いcomponentを毎回辿るとNQ規模になり、過去queryの計算を再利用できない。
- **棄却**: 通常のUnion-Findでa,bが同componentかだけを見る。 — 同componentへ追加するconstraintが既知差と一致するかという矛盾判定にpotential値が必要である。

#### 鍵となる着眼

- find時にparent pathの差も加算して圧縮すれば、pot[v]=X_v-X_rootを取得でき、同rootならX_a-X_b=pot[a]-pot[b]である。
- 別rootをmergeするときはconstraint式から新しいroot間potentialを逆算し、union by sizeで向きを反転する場合はその符号も反転する。

#### アルゴリズムへ接続する

weighted DSUをN頂点で初期化する。query(a,b,d)ごとにfindして、rootが同じならpot[a]-pot[b]==dのときだけindexをanswerへ追加する。rootが異なるなら常にindexを追加し、X_a-X_b=dを満たすroot間差を設定してsizeの小さいrootを大きいrootへmergeする。最後にaccepted indexを順に出力する。


## 転用するときの確認

- **weighted Union-Find**: onlineに差分等式pot(a)-pot(b)=dを追加し整合性を判定するとき。 適用: parent edgeへpotential差を持たせ、rootからの差をpath compressionで集約する。
- **相対offsetの自由度**: 別connected component間にはまだ絶対基準関係がない差分constraint系。 適用: 最初の接続constraintは任意dでcomponent offsetを定められる。
- 差分方程式系では絶対値でなくroot基準potentialを管理するとonline unionと矛盾検出ができる。
- X_1-X_2=3、X_2-X_3=-1からX_1-X_3=2を導く三角形で、accepted/rejected queryとpotential符号を確認する。

## 到達確認

### 到達確認 1 — DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる

転移題材: [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g)

**課題**: ABC466 G「Segment Sum Constraints」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 少数変数の区間和制約解数を、weighted DSUの独立化とbitwise carry vector DPで有限・0・Infinityまで判定できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 少数変数の区間和制約解数を、weighted DSUの独立化とbitwise carry vector DPで有限・0・Infinityまで判定できる。

- 対象技能が担う箇所: 少数変数の区間和制約解数を、weighted DSUの独立化とbitwise carry vector DPで有限・0・Infinityまで判定できる。
- 転移題材の解法接続: 各Sから区間長を引き非負問題へ変換する。weighted DSUでB_{L-1},B_Rを差Sでunionし矛盾を検出、成分内隣接prefixから独立区間式を抽出する。carry vector DPをbit0..29で回し、各bitのN-bit maskからnext carryを更新する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。

</details>


## 根拠

- [ABC328 F 公式解説](https://atcoder.jp/contests/abc328/editorial/7656)
- [ABC328 F 公式問題文](https://atcoder.jp/contests/abc328/tasks/abc328_f)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-potential-dsu`
