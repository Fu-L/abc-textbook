---
title: "virtual tree・auxiliary tree"
description: "「virtual tree・auxiliary tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 138
---

# virtual tree・auxiliary tree

習得対象の目安: **黄色（2000–2399）**。Euler順と隣接LCAで必要な分岐点だけを残し、小さな木上で計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### virtual tree・auxiliary tree

選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。

### 習得する技能

- 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。

## 考え方

### 頂点集合を閉じてから辺を張る

根付き木でDFS入場順tin、退場時刻tout、深さとLCAを前計算する。指定頂点の重複を除いたk個をtin順に並べ、隣接するk−1組のLCAを追加する。その集合を再びtinでsortしuniqueした列Vを作る。指定頂点の印はLCAとして追加した頂点の印と区別する。k=0なら空、k=1ならその頂点だけである。

Vを左から処理し、祖先の鎖をstackに保つ。頂点vに対し、末尾uがvの祖先でない間popする。祖先判定は `tin[u]≤tin[v]<tout[u]`。stackが非空なら末尾をvの親にして辺を張り、最後にvをpushする。全指定頂点のLCAはVに入るため、最初の頂点がvirtual treeの根となる。stackに残る末尾はV内で最も深い祖先なので、余分な辺も誤った兄弟接続も生じない。

### 隣接LCAだけで十分な理由とサイズ

指定頂点を含む子部分木を二つ以上持つ分岐uを考える。各子部分木の指定頂点はDFS順で連続するため、隣の子部分木との境界で隣接する二指定頂点のLCAがuになる。必要な分岐は全て追加され、指定頂点でも分岐でもない中間頂点は一本のpathへ縮められる。追加候補はk−1個なので、unique後の頂点数は高々2k−1である。

virtual edge u→vは元の祖先pathを表す。無重み長さはdepth[v]−depth[u]、重み付き距離はrootDist[v]−rootDist[u]。pathのmin・maxなどが必要なら、LCA前計算の集約またはHLD queryから辺属性を付ける。省略pathの途中の頂点も答えへ寄与する場合は、その個数や寄与を要約へ含める。指定頂点だけを選択可能にするDPでは、追加LCAを指定頂点として数えない。

## 成立条件と計算量

LCAがO(log N)なら構築O(k log k+k log N)、構築した小木の走査はO(k)。全N頂点の配列を毎query初期化せず、今回使ったVの辺と印だけを初期化・解放する。省略pathの属性queryの費用も加える。指定点をつなぐpathの構造を保存する手法で、元木の全頂点の任意DPを自動的にO(k)にできるわけではない。

概念上の親: [木のancestor・部分木・pathを索引化する](/learn/tree/tree-decomposition/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)、[Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。

このUnitを直接前提とする単元: なし。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)（対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC340 G 公式解説](https://atcoder.jp/contests/abc340/editorial/9249)
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-virtual-tree`
