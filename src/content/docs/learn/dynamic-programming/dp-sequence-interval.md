---
title: "列・区間・分割のDP"
description: "「列・区間・分割のDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 61
---

# 列・区間・分割のDP

導入対象の目安: **緑色（800–1199）**。prefix・最後の要素・区間という状態の違いを見渡す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

配列上のDPは、添字が似ていても依存関係で分ける。列DPは処理済みprefixへ一要素を追加し、prefix分割は最後のブロックを固定する。区間合成は独立な小区間の答えを合わせ、区間拡張は訪問済み区間の外へ一歩進む。

LISは列DPのうち、末尾の支配関係で状態を圧縮する流れとして独立に読む。問題名や配列という入力形式ではなく、「何を固定すると残りが同じ問題になるか」で節を選ぶ。

状態設計を土台に、列の選択、LISの支配関係、prefix分割、独立な区間の合成、訪問済み区間の拡張を別の依存構造として比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

### このUnitでは扱わないもの

- bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。

## 下位単元

- [列・subsequence DP](/learn/dynamic-programming/dp-sequence/) — 緑色
- [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/) — 水色
- [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/) — 水色
- [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/) — 水色
- [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/) — 水色
- [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 同じ文字の直前出現と隣接禁止から、末尾追加が重複しない直前状態の区間[L_i,R_i]を導く。その後dp[i]=Σ_{j=L_i}^{R_i}dp[j]をprefix差へ変形する。境界の正当化が計数の核心。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。 最後の切れ目jを列挙するdp[i]=Σ_{j<i}dp[j] value(j+1..i)にvalue=10·旧value+d_iを代入する。dp[0]=1,dp[1]=d_1を初期値とし、i≥2ではdp[i]=10dp[i−1]+d_iΣ_{j<i}dp[j]となる。前答えと累積和だけでO(N)。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 LISの末尾最小値と問い合わせのoffline処理を既習として、右端Rまでだけ更新したtailsから、値X以下で終わる最長長さを二分探索する。位置の制約を走査時刻、値の制約をtailsの境界へ分担させる。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-sequence-interval`
