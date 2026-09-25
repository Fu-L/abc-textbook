---
title: "Trieで共有接頭辞を索引化する"
description: "「Trieで共有接頭辞を索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 148
---

# Trieで共有接頭辞を索引化する

習得対象の目安: **水色（1200–1599）**。共有prefixを木にし、通過数・辞書順・文字遷移をnode上で管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第7単元。技能の説明を学んでから問題一覧へ進んでください。

前: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/) ／ 次: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)

## 概要

### Trieによる共有接頭辞の索引

文字列集合の各文字遷移を木として共有し、prefix通過数・prefix DP・辞書順探索をnode上で処理する。

### 習得する技能

- 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。

### このUnitでは扱わないもの

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 問題一覧

1. [ABC287 E「Karuta」](https://atcoder.jp/contests/abc287/tasks/abc287_e) — 主題: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。
2. [ABC437 E「Sort Arrays」](https://atcoder.jp/contests/abc437/tasks/abc437_e) — 主題: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。
3. [ABC377 G「Edit to Match」](https://atcoder.jp/contests/abc377/tasks/abc377_g) — 主題: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。
- [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e) — 主題: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G 公式解説](https://atcoder.jp/contests/abc268/editorial/4782)
- [ABC268 G 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC287 E 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_e)
- [ABC287 E 公式解説](https://atcoder.jp/contests/abc287/editorial/5609)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-trie-prefix`
