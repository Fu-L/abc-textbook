---
title: "bit列をTrieで索引化する"
description: "bit列をTrieで索引化するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 49
---

# bit列をTrieで索引化する

## 概要

### binary Trieによるbit列索引

整数を上位bitから分岐するTrieへ格納し、XOR・大小・距離条件に合う候補をbitごとに選ぶ。

観察: bit bでXORが0になる候補があれば、XORが1になる候補の下位bitを全て0にしても優劣は逆転しない。2^b>2^b-1だからである。

設計: W bitに幅を揃えてAをTrieへ挿入し、各部分木の要素数を保つ。query xは上位bitから、xと同じbitの子が非空ならそこへ、空なら逆の子へ進んで答えに2^bを加える。

例: A={1,6}, x=3を3 bitで考える。最上位は0側の001を選び、結果は011 XOR 001=010、すなわち2。反対側110とのXORは5である。構築O(NW)、一query O(W)。

大小queryへの接続: x XOR a<Kの個数を求める。Kのbitが1ならXORのbitを0にする子の個数を全て加え、1にする子で等号prefixを継続する。Kのbitが0なら0にする子だけを辿る。最後の等号は数えない。

境界: 空の子へは進まず、重複は部分木個数に重ねて数える。ABC425 Gではこの同じ分岐をxの区間全体へ共有する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。

- 文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g)
2. [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g)

## 根拠

- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC425 G 公式解説](https://atcoder.jp/contests/abc425/editorial/14087)
- [ABC425 G 公式問題文](https://atcoder.jp/contests/abc425/tasks/abc425_g)
- [ABC451 G 公式解説](https://atcoder.jp/contests/abc451/editorial/18047)
- [ABC451 G 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-binary-trie`
