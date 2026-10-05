---
title: "分離凸・凹の単調限界値選択"
description: "「分離凸・凹の単調限界値選択」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 225
---

# 分離凸・凹の単調限界値選択

習得対象の目安: **青色（1600–1999）**。単調な限界費用の列を導き、heapや閾値計数で必要個数を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 分離凸・凹の単調限界値選択

各対象の限界費用が単調増加（または限界利益が単調減少）することを使い、複数の限界値列から必要な上位・下位K項をpriority queue mergeまたは値の閾値計数で選ぶ。

### 習得する技能

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

## 考え方

総資源量を固定しΣf_i(x_i)を最小化する。各f_iの整数差分が非減少なら、次の一単位を最も安い限界費用へ配ることで交換しても改善できない解を得る。


下限l_i、上限u_iからx_i=l_iで始め、残資源K−Σl_iを配る。各未満杯項の次費用Δ_i(x_i)=f_i(x_i+1)−f_i(x_i)をmin-heapへ入れ、最小の項を一増やしてその次費用へ更新する。各項でΔが非減少なので、選んだ費用はその項のprefixになり、全限界費用から必要個数の最小のものを選ぶ操作と一致する。従って制約を満たす任意配分より費用が小さい。

Kが巨大なら閾値λ以下の限界費用の個数c_i(λ)と和を各項で計算し、Σc_iが必要個数へ達する最小λを探索する。λ未満を全て取り、残りだけを費用λの同点候補へ配分する。countだけでなくsumの計算法と探索幅を導き、同点を全て取って資源を超過させない。Σl_i≤K≤Σu_iが可解条件である。

### 本数別の凹性を交換構造から証明する

限界利得mergeを使う前に、各本数の最適値F_kが凹である根拠を確認する。二次式の差分が非増加、木DPの初回bonusが非負など、遷移から直接帰納できる場合がある。最適列を複数の候補列の点ごとのmaxで作る場合、子列が凹であることだけでは親の凹性は保証されない。例えば(0,4,4,4)と(0,2,4,6)のmax=(0,4,4,6)で、差分4,0,2が非増加を満たさない。

排他制約がある場合は、k−1個とk+1個の最適解を二色で重ね、総利得を保存してk個ずつへ再分配できないか考える。それが可能なら、二つのk個解の値はそれぞれF_k以下なので2F_k≥F_{k−1}+F_{k+1}となる。等長区間の選択では各区間が他色と高々二つしか衝突せず、二部の衝突グラフが道・偶閉路へ分かれるため、一本多い色の成分を交換できる。matchingも交互路の辺の色交換で同じ証明になる。

この議論は許可候補を固定した各境界状態でも成立する。異なる長さの区間など、一つの候補が他色の三つ以上と衝突する場合は別の証明が必要である。exact個数の最適列は利得が負でも全実現可能個数まで保持し、at-most個数の問題なら非正の限界利得を追加する義務はない。

## 成立条件と計算量

資源総量Kと項数NならheapでO((N+K) log N)。Kが巨大なら限界費用の閾値と個数を二分探索し、同値費用の配分を補う。分離可能性と各変数の上下限が必要で、項間の追加制約があると単純greedyは成立しない。

概念上の親: [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。

### このUnitでは扱わないもの

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC359 F 公式解説](https://atcoder.jp/contests/abc359/editorial/10260)
- [ABC359 F 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC369 G 公式解説](https://atcoder.jp/contests/abc369/editorial/10843)
- [ABC369 G 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-separable-convex-marginals`
