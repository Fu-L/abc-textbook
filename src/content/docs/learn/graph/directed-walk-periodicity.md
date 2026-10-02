---
title: "有向walkの周期・cycle差分gcd"
description: "「有向walkの周期・cycle差分gcd」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 122
---

# 有向walkの周期・cycle差分gcd

習得対象の目安: **黄色（2000–2399）**。SCC内の閉路長を差分のgcdでまとめ、巨大歩数の到達条件を周期へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向walkの周期・cycle差分gcd

往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。

### 習得する技能

- 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。

## 考え方

### edge差分から全closed walkのgcdへ

cycleを持つSCC内で始点sを根とし、s→vの一pathの長さd[v]を探索で取る。各辺u→vについてδ_e=d[u]+1−d[v]を計算し、全|δ_e|のgcdをgとする。walk上の差分を足すと長さ+d[始点]−d[終点]となるため、全closed walk長はgの倍数であり、s→tの長さKはK≡d[t] mod gを満たす必要がある。

逆向きgraphの探索でv→sのpath長h[v]も求める。B_v=d[v]+h[v]、A_e=d[u]+1+h[v]はいずれもsを始終点とするclosed walkの長さである。零長を除いたこれらのgcdをHとすると、A_e−B_v=δ_eだからH|g。一方gは全closed walk長を割るのでg|H。よってH=gで、edge差分だけで真の周期を計算できる。

### 十分大きい歩数の条件を実際のwalkへ戻す

上のB_v,A_eを連結すると、その非負整数結合の長さのclosed walkをsに作れる。長さをgで割って正整数生成元集合Lとすればgcd(L)=1。最小生成元aで剰余graphを作り、剰余rから(r+l) mod aへ重みlを張る。0からの最短距離dist[r]はその剰余で表せる最小長で、全剰余へ到達する。X≥dist[X mod a]なら、差をaの反復で埋めてXを作れる。

D=max_r dist[r]と置くと、 `K≥C=gD+d[t]` かつK≡d[t] mod gならX=(K−d[t])/g≥D。sでgX歩のclosed walkを行い、最後に選んだs→t pathを進めるので十分性が示せる。必要性と合わせてこの範囲の判定は合同だけでよい。K<Cでは、この生成元集合から作れないwalkが別に存在することもあるため、合同だけでは判定せず、長さ0のsだけを真とする到達DPを一辺ずつ進めて正確に調べる。

この議論は固定した一SCC内のwalkである。別SCCへ出て同じSCCへ戻ることは縮約DAG上で不可能だが、異なるSCCにあるs,t間では通る成分列と歩数配分を扱う必要があり、単一gcdへまとめない。cycleのない単点SCCは正長walkを持たずg=0なので、長さ0だけを別処理する。

## 成立条件と計算量

SCC分解、d,hと周期gだけならO(V+E)。上の明示的cutoffの構築は、a状態・O(V+E)生成元のDijkstraでO(a(V+E) log(a+1))、短い部分はO(CE)の到達DPとなる。探索pathは長さ≤V−1なので各closed walk長≤2V−1。剰余graphの最短pathは単純に取れ、D≤(a−1)max LだからC=O(V²)。合同判定を使うだけの費用と、例外範囲まで正確に構築する費用を区別する。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（後の章）、[SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

このUnitを直接前提とする単元: なし。

gcd不変量・差分構造・SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、有向walkの周期・cycle差分gcdの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g) — 主題: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)（往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。）。既習技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-directed-walk-periodicity`
