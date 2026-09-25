---
title: "bit列をTrieで索引化する"
description: "「bit列をTrieで索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 54
---

# bit列をTrieで索引化する

習得対象の目安: **水色（1200–1599）**。整数の大小とXORを上位bitからの分岐に写して検索する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第53単元。技能の説明を学んでから問題一覧へ進んでください。

前: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/) ／ 次: [推移閉包](/learn/graph/transitive-closure/)

## 概要

### binary Trieによるbit列索引

整数を上位bitから分岐するTrieへ格納し、XOR・大小・距離条件に合う候補をbitごとに選ぶ。

観察: bit bでXORが0になる候補があれば、XORが1になる候補の下位bitを全て0にしても優劣は逆転しない。2^b>2^b-1だからである。

設計: W bitに幅を揃えてAをTrieへ挿入し、各部分木の要素数を保つ。query xは上位bitから、xと同じbitの子が非空ならそこへ、空なら逆の子へ進んで答えに2^bを加える。

例: A={1,6}, x=3を3 bitで考える。最上位は0側の001を選び、結果は011 XOR 001=010、すなわち2。反対側110とのXORは5である。構築O(NW)、一query O(W)。

大小queryへの接続: x XOR a<Kの個数を求める。Kのbitが1ならXORのbitを0にする子の個数を全て加え、1にする子で等号prefixを継続する。Kのbitが0なら0にする子だけを辿る。最後の等号は数えない。

境界: 空の子へは進まず、重複は部分木個数に重ねて数える。ABC425 Gではこの同じ分岐をxの区間全体へ共有する。

### 習得する技能

- 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。

### このUnitでは扱わないもの

- 文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。

## 問題一覧

1. [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
2. [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)。既習技能: 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC425 G 公式解説](https://atcoder.jp/contests/abc425/editorial/14087)
- [ABC425 G 公式問題文](https://atcoder.jp/contests/abc425/tasks/abc425_g)
- [ABC451 G 公式解説](https://atcoder.jp/contests/abc451/editorial/18047)
- [ABC451 G 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-binary-trie`
