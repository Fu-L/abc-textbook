---
title: "rake・compressで動的木DPを保つ"
description: "「rake・compressで動的木DPを保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 146
---

# rake・compressで動的木DPを保つ

習得対象の目安: **橙色（2400–2799）**。境界付きclusterのrake・compressを設計し、更新の影響を木DPの合成で伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Static Top Treeによる動的木DP

境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。

### 習得する技能

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

## 考え方

固定された根付き木で、`D_v=a_v+Π_{u:子}D_u` を保つ標準形を考える。空積は1とする。この形だけでも、子の集約とpath上の写像の合成を分ける手順が見える。

### 外部へ渡す要約を決める

部分木サイズが最大の子hをheavy childとし、それ以外をlight childとする。light側を `L_v=Π_{u:light child}D_u` と集約すると、heavy childの値zに対して `D_v=L_v z+a_v` となる。heavy childがない末端ではz=1を代入する。

path clusterはheavy pathの連続区間と、その区間に付くlight部分木を表す。上側・下側の境界を持ち、下側から入るzを上側へ渡すaffine写像 `Az+B` を要約(A,B)とする。上区間(A,B)と下区間(C,D)のcompressは `(AC,AD+B)`。上下の順序を入れ替えると別の値になる。

point clusterは同じ親へ付くlight部分木の束で、そのDの積Lを渡す。共通の取付点を持つ二つの束のrakeは `L_1 L_2`。それへ頂点vを追加するとpath要約(L,a_v)になる。完全なpathの末端へz=1を代入したA+Bを、親のpoint clusterへ渡す。

rakeは同じ取付点の枝だけ、compressは隣接する上下のpathだけを結ぶ。各a_vは頂点追加で一度だけ使う。空のpointの単位元は1、空のpathの単位元は(1,0)である。葉をD_v=a_vと定義する別の漸化式なら、末端写像を(0,a_v)に変更する必要がある。

### 重みを使って合成木を構築する

light部分木を下から処理し、各頂点でpointのrake木を作り、その後heavy pathのcompress木を作る。rakeの部品重みは各light部分木の頂点数。compressの頂点部品重みは `w_v=1+Σ_{u:light child}size(u)` とする。path全体の重みは、その先頭の部分木サイズに等しい。

どちらも、部品個数の中央ではなく累積重みの中央で分ける。具体的には、総重みWの半分をまたぐ部品をpivotとし、その左・pivot・右を別に処理して高々二回の二分合成でつなぐ。左右はそれぞれW/2以下になり、順序を保つのでcompressにも使える。重みwの部品の深さはO(1+log(W/w))となる。prefix重みと二分探索を使えばこの分割を実装できる。

ある元頂点から合成木の根までを追うと、各rake/compress段のlog(W/w)は入れ子の部分木サイズの比として望遠鏡和になる。さらに段を移るlight edgeではサイズが少なくとも倍になるので、定数項もO(log N)回しか増えない。したがって合成木全体の高さはO(log N)。単に各pathを部品個数で均等分割するだけでは、この証明にならない。

## 成立条件と計算量

一つのa_vを変更したら、それを所有する頂点追加nodeを更新し、合成木の親を根まで再計算する。要約と合成が定数時間なら更新O(log N)、根の値取得O(1)、空間O(N)。上記のprefix重みと二分探索による素直な構築はO(N log N)で十分である。

木の接続関係が固定されていることが条件で、link/cutはこの構築の対象外。多項式や行列を要約にする場合は各合成の費用を掛け直す。affine要約と重みによる構築は[ABC351 G公式解説](https://atcoder.jp/contests/abc351/editorial/9868)にもつながる。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。

### このUnitでは扱わないもの

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 問題一覧

- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)（heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。）。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 G 公式解説](https://atcoder.jp/contests/abc460/editorial/21012)
- [ABC460 G 公式問題文](https://atcoder.jp/contests/abc460/tasks/abc460_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-static-top-tree`
