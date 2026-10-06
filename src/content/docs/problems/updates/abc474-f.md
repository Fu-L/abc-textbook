---
title: "ABC474 F — Increment All Divisors"
draft: true
authoringUnit: {"problemId":"abc474-f","docPath":"src/content/docs/problems/updates/abc474-f.md","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-divisor-mobius-inversion"],"sourceRevisionIds":["source-abc474-f-problem-3af2a255399efa7eaa49f908a253a3bc2f9d2d78a27a3b6541d243a663241bbc","source-abc474-editorial-25392-f074fa894b01973a6c924296ab85d73196242a4db0377e84336d15c6d0db6d0b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"約数への操作寄与は倍数和であり、降順の三角形連立系は各xに対して一意の操作回数を与える。全C_iが非負整数ならそれだけ各操作を行う構成があり、逆に実現可能操作列はこの回数条件を満たす。A_1の増加が総操作数と一致するため最小xが最小回数となる。","sourceRevisionIds":["source-abc474-f-problem-3af2a255399efa7eaa49f908a253a3bc2f9d2d78a27a3b6541d243a663241bbc","source-abc474-editorial-25392-f074fa894b01973a6c924296ab85d73196242a4db0377e84336d15c6d0db6d0b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

共通の最終値をx、操作iの回数をC_iとする。要素jの増加はjの倍数の操作回数の和なので A_j+Σ_{i:j|i}C_i=x。倍数側から解けば C_i=x−A_i−Σ_{k≥2,ki≤N}C_{ki} となり、xの一次式α_i x+β_iで一意に定まる。

Nから1へ降順に走査し、α_i=1−Σα_{ki}、β_i=−A_i−Σβ_{ki}を計算する。各C_i≥0という条件でxの許容整数区間を絞る。α_i>0なら x≥ceil(−β_i/α_i)、α_i<0なら x≤floor(β_i/(−α_i))、α_i=0ならβ_i≥0が必要。x≥max A_iも初期下限に置く。

全条件の共通区間が空なら−1。空でなければ最小整数xを選ぶ。どの操作もA_1を一度増やすので、総回数ΣC_i=x−A_1。目的値はxについて増えるから、許容区間の左端が最適になる。一次式の係数を探索してxごとに再計算する必要はない。

## 典型の発動条件

倍数寄与の連立式を降順に反転する。未知の共通値を一次式で残し、非負条件を整数不等式の共通区間へ変える。

## 問題固有の要素

全操作が要素1を増やすので、操作回数を別々に最小化せず最終値xだけを最小化できる。

## 正当性

約数への操作寄与は倍数和であり、降順の三角形連立系は各xに対して一意の操作回数を与える。全C_iが非負整数ならそれだけ各操作を行う構成があり、逆に実現可能操作列はこの回数条件を満たす。A_1の増加が総操作数と一致するため最小xが最小回数となる。

## 実装上の注意

負数を含むceil/floorを言語の切捨て除算と区別する。α=0を別処理する。係数とβの集計は十分広い整数型で保つ。

## 復習の核

目的値と操作数が同じ不変量で結ばれているか確認する。未知パラメータを先に消去せず式のまま伝播する。

## 計算量と制約

### 時間

倍数和の総項数 O(N log N)、区間交差 O(N)。

### 空間

α,βの配列 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc474/tasks/abc474_f)
- [公式解説](https://atcoder.jp/contests/abc474/editorial/25392)
