---
title: "値域集約による部分列DP"
description: "「値域集約による部分列DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 66
---

# 値域集約による部分列DP

習得対象の目安: **水色（1200–1599）**。列DPの遷移を値域の集約へ写し、Segment Treeと更新順を組み合わせる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 値域集約による部分列DP

末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。

処理済みprefixについて、末尾の値vごとの最良長best[v]を持つ。直前値として許される区間の最大値に1を足し、現在値へchmaxする。列の順序は左からの処理で守り、値の条件は区間queryで守る。

ABC339 Eでは直前値が[A_i−D,A_i+D]にあることが条件である。末尾が小さいほど有利とは限らず、LISのtailsには圧縮できない。ABC360 Gでは未変更・変更済みの状態を分け、各値域構造を同じ要素から二度遷移させない更新順も確かめる。

ABC354 Fの採用解法では左右から値域最大DPを行い、l_i+r_i−1=Lで最長解に属し得る位置を判定する。この所属条件とLISの計算法は別の観察であり、基本LISのtailsを使う別実装と区別する。ABC240 Exでは部分文字列を辞書順に処理し、選択済みの最後の右端位置を集約軸にする。ABC410 Gでは右端順に処理し、左端位置の範囲を集約する。集約する座標は入力の数値そのものとは限らず、次の候補との接続条件から決める。

### 習得する技能

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

直前値が区間[L(x),R(x)]にある状態の最大値や総和を使うなら、末尾値ごとのDPを区間構造へ入れる。列の時間順は左からの走査、値の制約はquery範囲で守る。


狭義増加部分列ならdp_i=1+max_{j<i,a_j<a_i}dp_j。値をsort-uniqueし、各rankの最良長を初期0でsegment treeへ持つ。位置iでrank(a_i)未満のprefix最大を取得し、一伸ばしてそのrankへchmaxする。queryをupdateより先に行うのでj<iを保ち、同値をquery範囲から除くので狭義性も保つ。非減少なら自分のrankを含める。時間の順と値の順の二制約を別々に守るのがこの設計の要点である。

## 成立条件と計算量

N要素・値域MならSegment TreeでO(N log M)。同じ値の更新を上書きか合成かはDPの意味による。遷移前にqueryして同じ要素の再利用を防ぐ。LISの最小末尾への圧縮とは適用条件が違う。

概念上の親: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)、[区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

区間monoid要約・列・subsequence DPで得た考え方と実装を再利用し、値域集約による部分列DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC339 E 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC339 E 公式解説](https://atcoder.jp/contests/abc339/editorial/9210)
- [ABC354 F 公式解説](https://atcoder.jp/contests/abc354/editorial/10027)
- [ABC354 F 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-value-range`
