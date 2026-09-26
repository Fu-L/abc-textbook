---
title: "列・subsequence DP"
description: "「列・subsequence DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 62
---

# 列・subsequence DP

習得対象の目安: **緑色（800–1199）**。選ぶ・選ばない遷移と最後の要素を状態にし、同じ要素の重複利用を避ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 編集距離・sequence alignment DP

二つの列prefixを状態にし、一致・挿入・削除・置換の局所遷移から最小編集費用を求める。閾値がある場合は長さ差の下界で対角帯へ状態を絞る。

### 列・subsequence DP

列のprefixや最後に選んだ要素を状態にし、順序を保つ選択を組み立てる。

左から処理し、未来の延長可能性が等しい履歴を同じ状態へまとめる。ABC327 Eでは選択個数jと重み付き得点の最大値を持ち、各要素で選ぶ・選ばないを更新する。同じ要素を再使用しないようjを降順に走査する。

最後の位置、選択数、差分など、未来の可否や報酬に影響する情報を残す。LISの長さ別最小末尾への圧縮は、この一般の状態設計に支配関係を追加して導く。

### 習得する技能

- 二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。
- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)、[値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)、[半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。

DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。）。
- [ABC327 E「Maximize Rating」](https://atcoder.jp/contests/abc327/tasks/abc327_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC362 E「Count Arithmetic Subsequences」](https://atcoder.jp/contests/abc362/tasks/abc362_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 同じ文字の直前出現と隣接禁止から、末尾追加が重複しない直前状態の区間[L_i,R_i]を導く。その後dp[i]=Σ_{j=L_i}^{R_i}dp[j]をprefix差へ変形する。境界の正当化が計数の核心。
- [ABC238 F「Two Exams」](https://atcoder.jp/contests/abc238/tasks/abc238_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC299 F「Square Subsequence」](https://atcoder.jp/contests/abc299/tasks/abc299_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC225 F 公式解説](https://atcoder.jp/contests/abc225/editorial/2833)
- [ABC225 F 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC238 F 公式解説](https://atcoder.jp/contests/abc238/editorial/3354)
- [ABC238 F 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-dp-sequence`
