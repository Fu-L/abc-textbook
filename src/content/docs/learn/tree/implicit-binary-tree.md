---
title: "対称性・深さ・label区間で巨大な完全二分木を数える"
description: "前提から対称性・深さ・label区間で巨大な完全二分木を数えるを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 38
---

# 対称性・深さ・label区間で巨大な完全二分木を数える

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 指数個の頂点を持つ完全二分木を展開せず、深さごとの対称性と2冪で集約するか、heap番号の祖先移動と深さ別子孫label区間で数える。

### この単元では扱わない範囲

- 子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。

## 発動条件と見分け方

### 暗黙・対称な完全二分木の深さ算術

巨大な完全二分木を展開せず、同じ深さの対称性と2冪で集約するか、heap番号の祖先移動と深さdの子孫label区間を使って数える。

検索語: heap index tree、implicit complete binary tree、symmetric complete binary tree、完全二分木の深さ集約、暗黙の完全二分木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる

題材: [ABC321 E「Complete Binary Tree」](https://atcoder.jp/contests/abc321/tasks/abc321_e)

#### このOutcomeを支える根拠

- 最大10^18頂点のimplicit binary treeで、Xから距離Kの頂点数をancestor列挙とlabel区間計数で求められる。

#### 観察

- heap番号のtreeでは頂点vから下へd段の子孫labelが連続区間[v·2^d,(v+1)·2^d)になる。
- Xから距離Kの頂点Yは、そのLCAがX自身か、Xの各ancestorのいずれかという高々tree高さ個のcaseへ一意に分かれる。
- ancestor zをLCAとするcaseは、zから残りd段の全子孫からXへ向かうchild subtree分を引けば数えられる。

#### 候補を比較する

- **採用**: Xからrootまでancestorを算術で列挙し、各ancestorをpathの折返し点とするcaseを子孫label区間の長さでO(1)計数する。 — Nが10^18でもtree高さは約60で、頂点やedgeを生成せず各testを処理できる。
- **棄却**: 頂点Xから通常のBFSをK layer行う。 — Nが最大10^18でtreeを明示できず、Kも非常に大きい。
- **棄却**: 深さがdepth(X)±Kの全labelを数える。 — 同じ深さ差でもLCA位置によりXからの距離が異なり、不要な別subtreeを含む。

#### 鍵となる着眼

- countDesc(v,d)はmax(0,min(N+1,(v+1)2^d)-v2^d)で、label上限Nとの区間intersectionだけになる。
- Xからu段上のancestor zについてd=K-uが0ならz自身1個、d>0ならcountDesc(z,d)-countDesc(child,d-1)が寄与する。
- u=0、すなわちLCA=XのcaseはcountDesc(X,K)として最初に数える。

#### アルゴリズムへ接続する

overflowを避けるcountDesc(v,d)を用意し、まずanswer=countDesc(X,K)とする。child=X,z=floor(X/2),u=1からz=0またはu>Kまで上る。d=K-uが0なら1を加え、正ならcountDesc(z,d)-countDesc(child,d-1)を加える。その後child=z,z=floor(z/2)へ更新し、各testのanswerを出力する。


## 転用するときの確認

- **implicit complete binary tree**: 親i/2・子2i,2i+1で巨大treeが番号だけ与えられるとき。 適用: 子孫levelを連続label区間として数える。
- **ancestor位置での距離case分解**: 固定始点から距離Kの頂点をrooted treeで数えるとき。 適用: pathが上へ何段進んでから別の枝へ下るかをancestorごとに分ける。
- **全体subtreeから進入branchを引く**: LCAを特定ancestorに固定し、始点側branchを除外したいとき。 適用: ancestorのd段子孫数からpath childのd-1段子孫数を引く。
- implicit treeの番号規則から、depth固定のsubtreeがinterval・等差列などの数えやすい集合にならないか確認する。
- Xの子孫case、親自身case、祖先の反対側subtree caseを小さいheap treeに色分けし、同じ頂点を重複せず全て数えるか確認する。

## 到達確認

### 到達確認 1 — 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる

転移題材: [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e)

**課題**: ABC220 E「Distance on Large Perfect Binary Tree」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 対称構造の深さ集約: 完全木などで、頂点に依存する量が深さだけで決まるとき。 適用: 一頂点分の数を深さから求め、その深さの頂点数を掛けて明示的な木を消す。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 対称構造の深さ集約: 完全木などで、頂点に依存する量が深さだけで決まるとき。 適用: 一頂点分の数を深さから求め、その深さの頂点数を掛けて明示的な木を消す。

- 対象技能が担う箇所: 対称構造の深さ集約: 完全木などで、頂点に依存する量が深さだけで決まるとき。 適用: 一頂点分の数を深さから求め、その深さの頂点数を掛けて明示的な木を消す。
- 転移題材の解法接続: 2 の冪を法 998244353 で前計算する。各深さ d で H=N-1-d とし、D≤H なら片端が LCA の 2×2^D を加え、内部 split 区間の長さに 2^{D-1} を掛けて加える。その一頂点分へ 2^d を掛け、全深さを合計する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。

</details>


## 根拠

- [ABC220 E 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 E 公式解説](https://atcoder.jp/contests/abc220/editorial/2679)
- [ABC321 E 公式問題文](https://atcoder.jp/contests/abc321/tasks/abc321_e)
- [ABC321 E 公式解説](https://atcoder.jp/contests/abc321/editorial/7267)
- [ABC424 E 公式問題文](https://atcoder.jp/contests/abc424/tasks/abc424_e)
- [ABC424 E 公式解説](https://atcoder.jp/contests/abc424/editorial/13858)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-implicit-binary-tree`
