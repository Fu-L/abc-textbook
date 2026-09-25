---
title: "bitsetで集合演算をword並列化する"
description: "「bitsetで集合演算をword並列化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 53
---

# bitsetで集合演算をword並列化する

習得対象の目安: **水色（1200–1599）**。真偽配列の演算をbit演算へ写し、word幅を含めた計算量を見積もる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第52単元。技能の説明を学んでから問題一覧へ進んでください。

前: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/) ／ 次: [bit列をTrieで索引化する](/learn/query/binary-trie/)

## 概要

### bitsetによるword並列集合演算

真偽集合をbit列へ詰め、交差・和・shift・popcountをword単位で実行して遷移や組数計算を加速する。

### 習得する技能

- 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

集合の交差・和・shiftを機械語word単位で同時処理し、要素ごとの走査をword幅だけ短縮する。

### このUnitでは扱わないもの

- 集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。

## 問題一覧

1. [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
2. [ABC348 F「Oddly Similar」](https://atcoder.jp/contests/abc348/tasks/abc348_f) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。
3. [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h) — 主題: [推移閉包](/learn/graph/transitive-closure/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC258 G 公式解説](https://atcoder.jp/contests/abc258/editorial/4234)
- [ABC258 G 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_g)
- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bitset-word-parallel`
