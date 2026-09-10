---
title: "small-to-large・DSU on Tree"
description: "small-to-large・DSU on Treeの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 144
---

# small-to-large・DSU on Tree

## 概要

### small-to-large・DSU on Tree

小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。

重複も保持する併合で小さい側を大きい側へ移すと、移った要素の所属サイズは少なくとも倍増し、一要素O(log N)回しか移らない。重複を消すsetではこの倍増をそのまま使えない。重複が小さい側の半数以上なら走査費用を消える要素へ課金し、それ未満なら生存要素へ課金する。後者では併合後サイズが小さい側の3/2倍を超えるので、生存への課金も一要素O(log N)回となる。

ABC324 Gの分割は、分割前の各要素が一方だけに属し、小さい側だけを走査するから、走査された要素の所属サイズが半減する。併合の倍増、setの消滅、分割の半減で何を数えているかを区別し、操作一回あたりのデータ構造費用を最後に掛ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC329 F「Colored Ball」](https://atcoder.jp/contests/abc329/tasks/abc329_f)
2. [ABC411 F「Contraction」](https://atcoder.jp/contests/abc411/tasks/abc411_f)
3. [ABC454 G「Mode in the Subtree」](https://atcoder.jp/contests/abc454/tasks/abc454_g)
4. [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)

## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC324 G 公式解説](https://atcoder.jp/contests/abc324/editorial/7399)
- [ABC324 G 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-small-to-large`
