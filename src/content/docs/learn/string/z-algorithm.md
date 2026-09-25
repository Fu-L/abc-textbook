---
title: "Z algorithmによるprefix matching"
description: "「Z algorithmによるprefix matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 150
---

# Z algorithmによるprefix matching

習得対象の目安: **水色（1200–1599）**。Z-boxの不変量と再利用範囲を理解し、prefixとの一致長を線形時間で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第36単元。技能の説明を学んでから問題一覧へ進んでください。

前: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/) ／ 次: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)

## 概要

### Z algorithmによるprefix matching

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。

### 習得する技能

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC430 E「Shift String」](https://atcoder.jp/contests/abc430/tasks/abc430_e) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。
2. [ABC284 F「ABCBAC」](https://atcoder.jp/contests/abc284/tasks/abc284_f) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。
3. [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
4. [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

## 根拠

- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC284 F 公式解説](https://atcoder.jp/contests/abc284/editorial/5469)
- [ABC284 F 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_f)
- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-z-algorithm`
