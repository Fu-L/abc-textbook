---
title: "BEST定理によるEuler circuit数え上げ"
description: "「BEST定理によるEuler circuit数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 212
---

# BEST定理によるEuler circuit数え上げ

習得対象の目安: **橙色（2400–2799）**。有向全域木と出辺順列への対応を導き、BEST定理の数え方を適用する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### BEST定理によるEuler circuit数え上げ

有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。

### 習得する技能

- 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

辺を区別する有向多重graphを考える。辺を持つ頂点だけを残し、強連結で、各頂点vの入次数と出次数d_vが等しいとする。根rとrから出る最初の辺eを固定し、Euler巡回をeから始まる辺の列として数える。

### 根を除いたlast-exit tree

巡回から、**r以外**の各頂点vについて、最後にvを出る辺e_vを選ぶ。このV−1本がrへ向かう有向全域木になる。根には最後の出辺を選ばない。

選んだ辺v→wでw≠rなら、そこへ到着した後、巡回をrで終えるためにwからもう一度出る。そのためe_wを使う時刻はe_vより後である。選んだ辺に有向閉路があれば、時刻が閉路に沿って厳密に増加して元へ戻ることになり矛盾する。根以外にはちょうど一本の出辺があり、根にはないので、辺をたどると必ずrへ到達する。たとえばr→v→rではv→rだけを選び、閉路全体を木とみなさない。

### 木と出辺順序からの復元

逆に、rへ向かう有向全域木Tを一つ選ぶ。v≠rでは木の辺を最後に置いて残りの出辺を自由に並べ、rではeを最初に置いて残りを自由に並べる。rから各頂点の未使用出辺をこの順に使えば巡回が一意に復元できる。

次数の釣り合いにより、途中で出辺を使い切って停止できるのはrだけである。rで止まったのに未使用辺が残ると仮定する。使った辺の列は閉じているため、未使用辺の入次数・出次数も各頂点で等しい。未使用出辺があるvでは、最後に置いた木の辺も未使用であり、その行き先にも未使用出辺がある。この議論をTに沿って繰り返すとrにも未使用出辺があることになり、停止したという仮定に矛盾する。よって全辺を使い、元のlast-exit treeと出辺順序を取り戻せる。

rを根とするこの向きの全域木数をt_rとすると、各頂点の自由に並べる辺はd_v−1本なので、BEST定理は次の式になる。

`最初の辺eを固定した巡回数 = t_r ∏_v (d_v−1)!`

根rだけを固定し、最初の辺を自由に選ぶ辺列を数えるなら、さらにd_rを掛ける。

`根rから始まる巡回数 = t_r d_r! ∏_{v≠r}(d_v−1)!`

辺列を巡回回転で同一視する場合は、区別される特定の辺を先頭にすることで各同値類の代表を一つ選べる。元の問題が多重辺を区別しない場合には、まずどの辺列を一つと数えるかを定め、その対応に基づいてラベル付けの重複を除く。始点固定・先頭辺固定の規約を混ぜない。

## 成立条件と計算量

t_rは有向行列木定理で計算する。自己ループを除き、u≠vには`L_{u,v}=−(u→vの辺数)`、対角には自己ループを除いた出次数を置く。rの行と列を除いた行列式がt_rであり、体上の消去でO(V³)、空間O(V²)。自己ループは木には入らないが、BEST定理のd_vと出辺の順列には含める。一頂点の場合は空の木と0×0行列の行列式を1とする。

辺数をEとすると、次数の集計・階乗前計算はO(E)。次数0の頂点は積から除き、辺がない場合の空の巡回は問題の定義で別に扱う。法上で計算する場合は階乗や重複除去の除算が使える条件も確認する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)、[Euler trail・circuit](/learn/graph/euler-trail-circuit/)。

このUnitを直接前提とする単元: なし。

行列式による数え上げ・Euler trail・circuitで得た考え方と実装を再利用し、BEST定理によるEuler circuit数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)（有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-euler-circuit-counting`
