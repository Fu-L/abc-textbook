---
title: "包含木の構築とancestor・path分解"
description: "前提から包含木の構築とancestor・path分解を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 78
---

# 包含木の構築とancestor・path分解

このページは **節** です。下位単元が扱う技能を比較し、発動条件・不変量・計算量の違いから学習経路を選ぶための構造単元です。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 直接所有するOutcomeはありません。この単元では下位単元の選択と学習順を扱います。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 基本的な木DFSを土台に、laminar区間をstackで包含木へ変換し、binary liftingでancestor・LCAを問い合わせ、Euler in/outで部分木を区間化し、HLDでpathをheavy path列へ分け、対象頂点と必要なLCAだけをvirtual treeへ縮約する。

### この単元では扱わない範囲

- LCAという概念で対象を一意分類するだけで、ancestor query・Euler区間化・HLD・virtual treeを実装利用しない数え上げ、および重心による再帰分解。

## 下位単元と学習順

以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。

1. [Euler順による部分木区間化](./tree-euler-flattening.md)（標準順 130）— DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
2. [ancestor query・LCA](./tree-ancestor-lca.md)（標準順 131）— doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。
3. [Heavy-Light Decomposition](./heavy-light-decomposition.md)（標準順 160）— ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、Heavy-Light Decompositionの発動条件・正当化・境界を重複なく学ぶ。
4. [laminar区間族の包含木構築](./laminar-interval-containment-tree.md)（標準順 169）— 非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。
5. [virtual tree・auxiliary tree](./virtual-tree.md)（標準順 180）— ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

## 発動条件と見分け方

この構造単元はTagを直接所有しません。下位単元の定義と対象外を比較して学習経路を選びます。

## ガイド例

- 通常のOutcomeガイド例は下位単元で扱います。

## 下位単元を使い分ける比較例

未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。

- **Euler順による部分木区間化** — 直接到達点: Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。近いが対象外: Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **ancestor query・LCA** — 直接到達点: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。近いが対象外: ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **Heavy-Light Decomposition** — 直接到達点: heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。近いが対象外: Heavy-Light Decompositionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **laminar区間族の包含木構築** — 直接到達点: laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。近いが対象外: laminar区間族の包含木構築の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **virtual tree・auxiliary tree** — 直接到達点: 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。近いが対象外: virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

**比較の到達点**: 未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。


## 転用するときの確認

- なし

## 到達確認

- 直接所有するOutcomeの到達確認はありません。

### 学習経路の選択

**課題**: 未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。

**合格条件**: 採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。


## 解答と自己評価基準

- 直接所有するOutcomeの解答基準はありません。

<details><summary>学習経路の選択の解答基準</summary>

**検証状態**: `pending` — これは T057 の学習経路レビュー前に使う自己評価基準であり、検証済みとは扱いません。

正解は一つの単元名ではなく、問題構造と各候補の定義・対象外との照合である。下位単元のOutcome自体の到達確認はそれぞれの所有Unitで行う。

- 問題を対象・操作・保つ量・求める量へ分解する。
- 各下位単元の発動条件を一つずつ照合し、不足情報を明示する。
- 採用候補の成立理由と、近い候補の最初の破綻点を対にする。
- 前提DAGと標準順を確認し、選んだ経路の最初の単元を決める。

期待する到達点: 未知問に対する学習経路を、発動条件・棄却理由・前提順とともに再現できる。

</details>


## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-tree-decomposition`
