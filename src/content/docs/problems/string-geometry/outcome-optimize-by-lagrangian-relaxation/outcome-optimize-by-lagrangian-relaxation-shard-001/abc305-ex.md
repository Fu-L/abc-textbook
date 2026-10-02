---
title: "ABC305-EX — Shojin"
draft: true
authoringUnit: {"problemId":"abc305-ex","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc305-ex.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-dp-prefix-partition","unit-greedy-exchange"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-dp-prefix-partition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2","source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二taskの順序を交換すると差はB_1(A_2−1)−B_2(A_1−1)なので比B/(A−1)昇順が最小fatigueを与える。集合への追加限界費用が増えるsupermodularityからsegment costはMonge、最適日数別費用d(K)は離散凸になる。penalty DPはmin_K(d(K)+pK)の支持線を正確に求め、凸dualで予算Xへ届く最小Kを復元する。tieの日数規約を固定する。","sourceRevisionIds":["source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2","source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一日のproblem集合を固定すると、adjacent exchangeよりA>1の問題はB/(A−1)昇順、A=1の問題は最後に並べるのがminimum fatigueになる。

segment cost c(l,r)=f({l+1,…,r})は集合costのincreasing marginal propertyからquadrangle inequalityを満たし、K segmentsのminimum d(K)はKについてdiscrete convexになる。

棄却する候補: dp[k][r]=min_l dp[k−1][l]+c(l,r)を全K,l,rについて計算する。

N^2以上のsegment transitionsとなりN=20万を扱えない。

採用する候補: 一日ごとのpenalty pを加えたAliens DPでmin(cost+p×days)を求め、convex envelopeとternary searchからd(K)≤Xとなる最小Dを復元する。

Monge性がdays別最適costの凸性を保証し、Xを超えるedgesを除く高速DPと合わせてO(N log^2 X)にできる。

problem pの追加によるfatigue増分は、既存集合が大きいほど前後のaffine composition係数が大きくなり増加するため、fはsupermodularになる。

penalty pで得るG(p)=min_K(d(K)+pK)から D=ceil(max_p((G(p)−X)/p)) と表せ、この比は探索可能なunimodal shapeを持つ。

affine-composition orderingからsegment-cost Monge性を導き、partition shortest pathをLagrangian relaxation/Aliens DPとconvex dual searchで解く。

## 典型の発動条件

### 隣接交換による最適順序

発動条件: operationsの順序だけを変えられ、二操作の前後比較からscalar keyを導けるとき。

B_p(A_q−1)とB_q(A_p−1)をcross multiplyし、B/(A−1)順で一日分のaffine transformsを合成する。

### Monge分割DPとAliens trick

発動条件: segment partition costがquadrangle inequalityを満たし、最適costをsegment数制約と同時に求めたいとき。

segment数へpenaltyを付けたunconstrained DPをoracleとし、convex dualから必要daysと元costを復元する。

## 問題固有の要素

求めるのはcost≤Xの最小DとそのDでのd(D)なので、convex sequence dそのものを全列挙せずsupporting-line queriesから交点を特定する。

別の問題へ持ち帰る視点: 個数別最適値がconvexなら、budgetとの最初の交点をLagrangian oracleの傾き情報から探せる。

## 正当性

二taskの順序を交換すると差はB_1(A_2−1)−B_2(A_1−1)なので比B/(A−1)昇順が最小fatigueを与える。集合への追加限界費用が増えるsupermodularityからsegment costはMonge、最適日数別費用d(K)は離散凸になる。penalty DPはmin_K(d(K)+pK)の支持線を正確に求め、凸dualで予算Xへ届く最小Kを復元する。tieの日数規約を固定する。

## 実装上の注意

- B/(A−1)比較はdivisionせずcross productし、fatigueがXを超えたaffine valuesはX+1へsaturateしてoverflowを防ぐ。
- Aliens DPではpenalized costとdays countをpairで持ち、同cost時のtie ruleをconvex-envelope復元の規約に合わせる。

## 復習の核

- 区間内を並べ替えられるcostは、まず二要素交換でcanonical orderとset functionの性質を導く。
- 分割数ごとの最適値が凸なら、個数を直接DP dimensionにせずpenalty付き最適化のdualを見る。

## 計算量と制約

### 時間

O(Toracle·I+N log N)。Iはpenalty探索回数、ToracleはMonge/Aliens partition DP一回の時間（segment評価を木でO(log N)とする実装はO(N log N)規模）。

### 空間

O(N)。segment評価とDP。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq X \leq 10^8; 1 \leq A_i \leq 10^5; 1 \leq B_i; \sum_{i=1}^N B_i \leq X; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/tasks/abc305_h) — source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/editorial/6534) — source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54
