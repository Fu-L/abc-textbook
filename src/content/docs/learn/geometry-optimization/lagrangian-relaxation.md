---
title: "Lagrangian relaxation・Aliens trick"
description: "「Lagrangian relaxation・Aliens trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 229
---

# Lagrangian relaxation・Aliens trick

習得対象の目安: **橙色（2400–2799）**。罰則係数による個数単調性に加え、双対ギャップなく復元できる条件を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Lagrangian relaxation・Aliens trick

個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。

最小化でg(λ)=min_k(f(k)+λk)と置くと、g(λ)-λK≤f(K)は常に下界に過ぎない。f(k+1)-f(k)が単調非減少など、Kで支持直線に接する根拠を証明して初めて等号で復元できる。整数λだけを探す場合は必要な支持傾きが探索範囲にあることも確認する。

反例f(0)=0,f(1)=10,f(2)=0では、どのλでもk=1は選ばれず、K=1の最大双対下界は0。個数の単調性や同点時の個数優先だけでは真の値10を復元できない。

### 習得する技能

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

個数Kなどの制約を、一単位の採用ごとに罰金λを加える無制約最適化へ移す。λを増やすと最適解の採用個数が減ることを使い、目標個数を挟む罰金を探す。


oracleは費用だけでなく採用数も保持し、各採用遷移へλを足す。λ_1<λ_2で選ばれた個数k_1,k_2に対し、二つの最適性不等式を加えると `(λ_2−λ_1)(k_2−k_1)≤0`。従って個数は非増加で、同費用で最小個数を選ぶか最大個数を選ぶかを全遷移で統一すれば、その個数を二分探索に使える。

離散凸なfではΔ_k=f(k)−f(k−1)が非減少。内部のKについて `−Δ_(K+1)≤λ≤−Δ_K` を取ればf(K)+λKは全kに対して最小になる。左右への差をΔの和で書けば各項の符号から確認でき、g(λ)−λK=f(K)を証明できる。同点でoracleの個数がKを飛び越しても、この支持条件の下では値は正確に戻る。具体解まで必要ならKを満たす同点解の復元も別に示し、値の復元だけで完了としない。

## 成立条件と計算量

一回の最適化費用をTとして罰金範囲幅UならO(T log U)。同値最適解の個数をどう選ぶかを定める。個数ごとの最適値の離散凸性や双対ギャップ0の証明なしに、罰金探索だけで任意のKの値を復元してはいけない。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

一次元凸・単峰最適化で得た考え方と実装を再利用し、Lagrangian relaxation・Aliens trickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC305 H 公式解説](https://atcoder.jp/contests/abc305/editorial/6534)
- [ABC305 H 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-lagrangian-relaxation`
