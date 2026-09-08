---
title: "推移閉包"
description: "前提から推移閉包を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 119
---

# 推移閉包

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 推移閉包

各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。

検索語: Warshall法、transitive closure、推移閉包

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる

題材: [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)

選定理由: 最大頂点番号を最小化する問題は、番号k以下を使用可能にする単調なthreshold判定として見ると、最初に到達可能になるkが答えになる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。path costが使用要素の最大keyで、許可thresholdに対し可否が単調なとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 有向path上の最大頂点番号の最小値を、多queryまとめてbitset Warshallの初回到達段階として求められる。

#### 観察

- Warshall法で中継頂点を1,2,…の順に許可すると、外側loop k終了時のreach[i][j]は中継に番号≤kの頂点だけを使うpathの存在を表す。
- path costには両端も含むため、query(s,t)の答えはk≥max(s,t)かつreach[s][t]になった最初のkである。
- boolean reachability rowをbitsetにすると、i→kがあるときの全j更新をrow[i] |= row[k]のword並列演算へ変えられる。

#### 候補を比較する

- **採用**: bitset版Warshallを番号順に進め、各段階で未確定queryの初回到達を記録する。 — minimax costをthreshold kの到達可能性へ変え、N≤2000のtransitive closureを64bit並列化できる。
- **棄却**: 各queryについてcost thresholdを二分探索し、許可頂点subgraphでDFSする。 — 最大10^4 queryごとに複数回graph探索が必要で、共通するreachability計算を再利用できない。
- **棄却**: boolean matrixをscalar三重loopでWarshall更新する。 — N=2000では約N^3のboolean更新が重く、row ORによるword並列化を使える。

#### 鍵となる着眼

- 最大頂点番号を最小化する問題は、番号k以下を使用可能にする単調なthreshold判定として見ると、最初に到達可能になるkが答えになる。
- Warshallの更新reach[i][j] |= reach[i][k] & reach[k][j]は、reach[i][k]がtrueなrowだけreach[k]を丸ごとORすれば同値である。

#### アルゴリズムへ接続する

各direct edge a→bにbit reach[a][b]を立てる。k=1..Nについて、reach[i][k]が立つ全iでreach[i] |= reach[k]をin-place実行する。その段階で未回答queryを走査し、k≥max(s,t)かつreach[s][t]ならanswer=kを記録する。最後まで未回答なら-1を出力する。


## 転用するときの確認

- **minimax値のthreshold sweep**: path costが使用要素の最大keyで、許可thresholdに対し可否が単調なとき。 適用: 頂点をkey順に追加し、初めて到達可能になる段階を答えにする。
- **bitset transitive closure**: boolean Warshallのj方向更新を集合unionとして表せるとき。 適用: 到達先集合をmachine word列で持ち、row ORで一括更新する。
- **Floyd–Warshallの段階不変条件**: 中継候補を順序付きで解禁し、その時点の情報へqueryしたいとき。 適用: 外側loop終了時に許可済み中継集合だけのpathを表す。
- DPの各段階が制約thresholdを表すなら、完成値だけでなく「初めて成立する段階」を回答として利用できる。
- 端点番号が大きいdirect edgeと、小さい中継だけで繋がるpathを比較し、reachが早くtrueでもmax(s,t)未満では回答しないことを確認する。

## 到達確認

### 到達確認 1 — 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる

転移題材: [ABC292 E「Transitivity」](https://atcoder.jp/contests/abc292/tasks/abc292_e)

**課題**: ABC292 E「Transitivity」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 推移律を満たすための最小追加辺数を求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 推移律を満たすための最小追加辺数を求められる。

- 対象技能が担う箇所: 推移律を満たすための最小追加辺数を求められる。
- 転移題材の解法接続: 各xから探索し、x以外の到達頂点数を合計して初期辺数Mを引く。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

</details>


## 根拠

- [ABC287 H 公式解説](https://atcoder.jp/contests/abc287/editorial/5635)
- [ABC287 H 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC292 E 公式問題文](https://atcoder.jp/contests/abc292/tasks/abc292_e)
- [ABC292 E 公式解説](https://atcoder.jp/contests/abc292/editorial/5874)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-transitive-closure`
