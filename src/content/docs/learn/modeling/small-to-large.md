---
title: "small-to-large・DSU on Tree"
description: "「small-to-large・DSU on Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 22
---

# small-to-large・DSU on Tree

習得対象の目安: **青色（1600–1999）**。併合時の倍増と分割時の半減を使い、重複が消える場合も総走査量を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第105単元。技能の説明を学んでから問題一覧へ進んでください。

前: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/) ／ 次: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)

## 概要

### small-to-large・DSU on Tree

小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。

重複も保持する併合で小さい側を大きい側へ移すと、移った要素の所属サイズは少なくとも倍増し、一要素O(log N)回しか移らない。重複を消すsetではこの倍増をそのまま使えない。重複が小さい側の半数以上なら走査費用を消える要素へ課金し、それ未満なら生存要素へ課金する。後者では併合後サイズが小さい側の3/2倍を超えるので、生存への課金も一要素O(log N)回となる。

ABC324 Gの分割は、分割前の各要素が一方だけに属し、小さい側だけを走査するから、走査された要素の所属サイズが半減する。併合の倍増、setの消滅、分割の半減で何を数えているかを区別し、操作一回あたりのデータ構造費用を最後に掛ける。

### 習得する技能

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC329 F「Colored Ball」](https://atcoder.jp/contests/abc329/tasks/abc329_f) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。
2. [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f) — 主題: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
3. [ABC411 F「Contraction」](https://atcoder.jp/contests/abc411/tasks/abc411_f) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。
4. [ABC454 G「Mode in the Subtree」](https://atcoder.jp/contests/abc454/tasks/abc454_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。
5. [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
6. [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC324 G 公式解説](https://atcoder.jp/contests/abc324/editorial/7399)
- [ABC324 G 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-small-to-large`
