---
title: "bit列をTrieで索引化する"
description: "「bit列をTrieで索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 51
---

# bit列をTrieで索引化する

習得対象の目安: **水色（1200–1599）**。整数の大小とXORを上位bitからの分岐に写して検索する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

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

## 考え方

整数を上位bitから二分木へ入れ、部分木の個数を持つ。XOR最小・最大queryでは希望するbitへ進み、そこに要素がなければ反対側へ進む。


根と各子に通過要素数を持ち、挿入はB bitを高位からたどって数を一増やし、削除は存在を確認して同じpathを一減らす。count=0の枝は無いものとして扱う。XOR最大はqueryのbitと逆の枝を優先、最小は同じ枝を優先する。高位で一度有利なら低位全体より寄与が大きいのでgreedyで正しい。選んだbitを蓄積すれば相手の実値も復元できる。

x XOR y<Kの個数では高位から「ここまでKと同値」を保つ。Kのbitが1ならXOR bit0の枝の全countを答えへ加え、XOR bit1の枝へ降りる。Kのbitが0ならXOR bit0の枝だけへ降りる。最後の同値pathは厳密不等号なので加えない。枝が空なら停止する。K≤0は0、K≥2^Bは全要素数として先に扱う。

## 成立条件と計算量

bit数Bなら挿入・削除・query O(B)、N要素でO(NB)節点。空部分木、重複値、符号付き整数の表現を固定する。XORが閾値未満の個数は、上位prefixが小さくなる枝を集計する。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。

### このUnitでは扱わないもの

- 文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。

## 問題一覧

- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。
- [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。）。既習技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。） / [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。

## 根拠

- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC254 H 公式解説](https://atcoder.jp/contests/abc254/editorial/4053)
- [ABC254 H 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_h)
- [ABC425 G 公式解説](https://atcoder.jp/contests/abc425/editorial/14087)
- [ABC425 G 公式問題文](https://atcoder.jp/contests/abc425/tasks/abc425_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-binary-trie`
