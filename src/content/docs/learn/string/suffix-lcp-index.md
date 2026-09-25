---
title: "接尾辞の順序とLCPを索引化する"
description: "「接尾辞の順序とLCPを索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 153
---

# 接尾辞の順序とLCPを索引化する

習得対象の目安: **青色（1600–1999）**。suffix arrayとLCPの意味を理解し、ライブラリで得た索引を部分文字列queryへ使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第92単元。技能の説明を学んでから問題一覧へ進んでください。

前: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/) ／ 次: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)

## 概要

### 接尾辞順序・LCP索引

全接尾辞の辞書順とLCPを索引化し、部分文字列の順序・出現範囲・順位・distinct数を求める。

### 習得する技能

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

全接尾辞の辞書順と隣接LCPを索引化し、部分文字列の出現範囲・順位・個数へ答える。

### このUnitでは扱わないもの

- rolling hashによる一致比較と回文半径。

## 問題一覧

1. [ABC362 G「Count Substring Query」](https://atcoder.jp/contests/abc362/tasks/abc362_g) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。
2. [ABC272 F「Two Strings」](https://atcoder.jp/contests/abc272/tasks/abc272_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。
3. [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
4. [ABC452 G「221 Substring」](https://atcoder.jp/contests/abc452/tasks/abc452_g) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。
5. [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
6. [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC272 F 公式解説](https://atcoder.jp/contests/abc272/editorial/4980)
- [ABC272 F 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-suffix-lcp-index`
