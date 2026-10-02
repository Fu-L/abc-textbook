---
title: "数値半群のconductor以後を一括到達とみなす"
description: "「数値半群のconductor以後を一括到達とみなす」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 178
---

# 数値半群のconductor以後を一括到達とみなす

習得対象の目安: **橙色（2400–2799）**。非負整数結合が十分先を覆う条件を証明し、有限prefixだけを調べる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 数値半群・conductor

正の生成元の非負整数結合がconductor以後を全て覆うことを示し、巨大な到達判定を有限prefixへ縮約する。

### 習得する技能

- 正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。

## 考え方

非負係数でΣa_i x_iとして作れる数を、最小生成元aでの剰余へ分ける。各剰余の最小実現値を最短路で求めると、その値以上で同じ剰余の数はaを加えて作れる。


正の生成元のgcdをgとして、対象Xがgの倍数でなければ到達不能。以後全生成元とXをgで割る。最小生成元aを選び、剰余0,…,a−1を頂点とし、各生成元bにつきr→(r+b) mod aへ重みbの辺を張る。距離dist[0]=0、他は∞からDijkstraを行う。pathは生成元の列と同値なのでdist[r]は剰余rで作れる最小値である。

従ってXが作れる必要十分条件は `X≥dist[X mod a]`。十分性は差が非負のaの倍数であることからaを追加して構成できる。正規化後のgcdが1なら全剰余へ到達する。剰余の有限群で生成元の非負和は負の倍数も周期を使って表せるため、その生成部分群は全体になる。

D=max_r dist[r]ならX≥Dは全て作れる。正確な最大非到達値はF=max_r(dist[r]−a)、conductorはF+1である。各剰余でdist[r]−aが最後の非到達値だからで、a=1ではF=−1、conductor=0となる。元のg>1では、これ以後に覆うのはgの倍数だけである。

## 成立条件と計算量

a状態・生成元数kならDijkstraで典型的にO(ak log a)。gcdで割る前後を対応させ、到達不能剰余を残す。最小生成元が巨大ならこの状態数も巨大で、値域圧縮の効果を別に確認する。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。

このUnitを直接前提とする単元: なし。

生成元をgcdで正規化し、非負整数結合の到達集合がconductor以後の全整数を含むことを示して巨大距離を有限prefixへ縮約する。

### このUnitでは扱わないもの

- 負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。

## 問題一覧

- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)（正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC388 F 公式解説](https://atcoder.jp/contests/abc388/editorial/11910)
- [ABC388 F 公式問題文](https://atcoder.jp/contests/abc388/tasks/abc388_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-numerical-semigroup-reachability`
