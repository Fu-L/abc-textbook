---
title: "列・編集距離・区間合成DP"
description: "「列・編集距離・区間合成DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 63
---

# 列・編集距離・区間合成DP

導入対象の目安: **緑色（800–1199）**。prefix・最後の要素・区間という状態の違いを見渡す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

配列上のDPは、添字が似ていても依存関係で分ける。列DPは処理済みprefixへ一要素を追加し、prefix分割は最後のブロックを固定する。区間合成は独立な小区間の答えを合わせ、区間拡張は訪問済み区間の外へ一歩進む。

LISは列DPのうち、末尾の支配関係で状態を圧縮する流れとして独立に読む。問題名や配列という入力形式ではなく、「何を固定すると残りが同じ問題になるか」で節を選ぶ。

状態設計を土台に、列の選択、二列の編集距離整列、LISの支配関係、prefix分割、独立な区間の合成、訪問済み区間の拡張を別の依存構造として比較する。

## 考え方

列を左から伸ばすDP、prefixを最後のblockで分けるDP、小区間を合成するDP、訪問区間を拡張するDPは別の依存構造を持つ。何を最後に固定すると残りが同じ問題になるかで選ぶ。

## 成立条件と計算量

列は典型的にN段、区間はO(N²)状態、全分割点を試す区間合成はO(N³)となる。状態が似た添字でも初期値と処理順を借用しない。子単元で依存の向きと必要な追加情報を確かめる。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。

## 下位単元

- [列・subsequence DP](/learn/dynamic-programming/dp-sequence/) — 緑色
- [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/) — 水色
- [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/) — 水色
- [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-sequence-interval`
