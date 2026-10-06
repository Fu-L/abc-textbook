---
title: "大容量unbounded knapsackのeventual linearity"
description: "「大容量unbounded knapsackのeventual linearity」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 83
---

# 大容量unbounded knapsackのeventual linearity

習得対象の目安: **橙色（2400–2799）**。交換論で例外部分を有限に界し、巨大容量を小さなDPと線形部分へ分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

ABC310 Exでは短いコンボの列挙までを固有の前処理とし、時間a・報酬bのitem集合が得られた後を比較する。最大密度item(a*,b*)より劣るitemの列に長さa*の剰余prefix衝突があれば、所要時間がa*の倍数となる部分を基準itemで置換して報酬を減らさずに済む。したがって例外itemを有限個へ界し、有限DPと基準itemの反復を併用する。

ABC415 Gの容量固定で価値を最大化する形式に対し、ABC310 Exは目標価値を満たす時間を最小化する。有限例外の時間・報酬を保持し、残り必要報酬を基準itemで切り上げて満たす。密度greedyだけでは端数を最適化できず、例外上界とceilの処理が正しさに必要である。

### 習得する技能

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

## 考え方

無制限knapsackの巨大容量では、最良の価値密度の品物が十分後の解の中心になる条件を調べる。剰余ごとの補正を有限範囲で求め、安定した後半を周期的な式へ移す。


### 有限例外の上界と復元式

正整数重さa_i≤A、非負価値b_iの通常の無制限knapsackを考える。最大密度b_i/a_iの基準品物(a*,b*)を選び、同価値最適解の中で非基準品物数が最少のものを取る。非基準品物がa*個以上なら、その先頭0,…,a*個の累積重さをmod a*で比較すると二つが衝突する。間の非空部分の重さはa*の倍数で、基準品物へ置換すると密度の最大性から価値が減らず、非基準数を減らせて矛盾する。

従って例外品物は高々a*−1個、例外重さは `L=(a*−1)A` 以下。全品物の「重さちょうどt」の最適価値D[t]を0≤t≤min(L,C)で無制限DPし、容量Cの答えを

`max_t (D[t]+floor((C−t)/a*)·b*)`

で復元する。D[t]が基準品物を含んでも各候補は実行可能であり、例外だけの最適形も必ず候補にあるため過不足がない。前処理O(品物数·L)、一容量query O(L)。十分大きいCでは同じ剰余の候補集合が揃うのでOPT(C+a*)=OPT(C)+b*となる。

目標価値Vを満たす最小重さなら、同じ例外のtに対して `t+max(0,ceil((V−D[t])/b*))·a*` を最小化する（b*>0）。品物の使用に必要な初期資源があるABC415 G型では、制約が消えるまでの開始部分も例外へ含め、その最大重さをLへ加える必要がある。通常knapsackのLをそのまま適用しない。

ABC415 Gでは0<B_i<A_i、D_i=A_i−B_i、K=max A_iとして逆向き過程を取る。資源xからx+D_iへ進めるのはx≥B_iのときで、報酬はB_i。初期xを自由に選べるので有限DPは全xの値を0から始め、合法遷移だけで更新する。x≥Kになれば全品物が合法になる。

初めてKを越えた時点のxは2K未満に取れる。その後の非基準品物はmod D*の交換で高々D*−1個へ減らせるため、開始部分と例外を合わせた資源はK(K+1)未満で足りる。開始部分を保持して、交換可能な後半の基準品物だけを末尾へ移すので合法性も失わない。Nが小さければx≤NのDPで終了し、大きければK≤x<K(K+1)の各有限DP値へfloor((N−x)/D*)·B*を足した最大値を取り、初期スコアNを加える。同じAの品物は最大Bだけを残せるため種類数≤K、有限DPはO(K³)となる。


### 資源制約を消してから密度交換へ進む

元問題の技が資源を増減させるなら、各技をそのまま独立な品物とはみなせない。まず0から実行できる有限個のコンボへ分解し、その連結が常に合法で、任意の元の解も長さと報酬を保って写せることを証明する。

ABC310 Exの変化幅上界をLとすると、魔力L以上で非負増分の直後に負増分を置く交換が合法である。非負が負に先行するpair数を停止量にし、停止後の最後の負技までが魔力2L未満になることを別に示す。その範囲でprefix収支の衝突を使えば、長さ2L以下の0から有効なコンボへ分解できる。ここまで証明してから小さな魔力DPを作り、得たコンボへ本Unitの長さ剰余と密度の交換を適用する。

「局所交換が合法」「交換が停止」「停止形に望む上界がある」「有限品物を連結できる」は別の段階である。最後の二段を省くと、巨大資源を切り捨てたDPや通常knapsackへの還元の完全性が保証できない。

## 成立条件と計算量

重さ・価値・同率品物によって安定開始点は変わる。有限prefix長Lが証明できたときだけO(NL)などのDPから後半へ外挿する。経験的に差分が繰り返したことを安定性の証明にしない。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)。

このUnitを直接前提とする単元: なし。

通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### このUnitでは扱わないもの

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)（剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC310 Ex「Negative Cost」](https://atcoder.jp/contests/abc310/tasks/abc310_h) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)（剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC310 H 公式解説](https://atcoder.jp/contests/abc310/editorial/6794)
- [ABC310 H 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_h)
- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-eventual-unbounded-knapsack`
