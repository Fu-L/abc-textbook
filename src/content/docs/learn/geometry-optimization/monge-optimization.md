---
title: "Monge・monotone minima最適化"
description: "「Monge・monotone minima最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 228
---

# Monge・monotone minima最適化

習得対象の目安: **橙色（2400–2799）**。Monge性から最適位置の単調性を導き、分割統治やSMAWKの条件を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Monge・monotone minima最適化

quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。

ABC348 Gの分割統治で生じるmax-plus convolutionを考える。入力: x_jは左からj個選ぶAの最大和なので差分が非増加。y_kは右からk個選ぶ最適値で、凹性は仮定しない。z_i=max_k(x_{i-k}+y_k)を求める。

行列: 行を合計個数i、列を右選択数kとし、M[i,k]=x_{i-k}+y_k。両側から選ぶなら1≤k≤|right|かつ1≤i-k≤|left|が有効範囲となる。

正当化: 列kからk+1への差はy_{k+1}−y_k−(x_{i-k}−x_{i-k-1})で、iの増加につれて非減少。離れた列の差も和を取れば同じ性質を持ち、大きい列への優位性は失われない。同点は左優先とすると行最大位置kは非減少。有効列区間の両端も非減少である。

手順: 中央行の有効列を走査して最適kを求め、上半分はk以下、下半分はk以上に探索範囲を絞って再帰する。長さLのmergeはO(L log L)、問題全体はO(N log² N)。SMAWKなら有効域の扱いを保った全単調行列の探索へ接続できる。

境界: 単調なのはkで、左選択数j=i-kではない。無効な個数を有限値0で埋めず、片側だけの選択は別に比較する。xの差分が任意なら単調性は保証されない。

ABC348 Gでは行最大位置の単調性から探索区間を制限する。ABC305 ExでのMonge性の役割は、分割個数別の最適費用の凸性を保証してAliensの復元を正当化すること。行最小値探索を行う教材とは区別し、Lagrangian relaxation側の接続例として読む。

### 習得する技能

- quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。

このUnitを直接前提とする単元: なし。

DP遷移の集約・高速化で得た考え方と実装を再利用し、Monge・monotone minima最適化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Monge・monotone minima最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC348 G 公式解説](https://atcoder.jp/contests/abc348/editorial/9707)
- [ABC348 G 公式問題文](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC383 G 公式解説](https://atcoder.jp/contests/abc383/editorial/11500)
- [ABC383 G 公式問題文](https://atcoder.jp/contests/abc383/tasks/abc383_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-monge-optimization`
