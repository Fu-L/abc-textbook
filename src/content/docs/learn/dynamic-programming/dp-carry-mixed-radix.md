---
title: "繰り上がり・借り・混合基数を状態にするDP"
description: "「繰り上がり・借り・混合基数を状態にするDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 74
---

# 繰り上がり・借り・混合基数を状態にするDP

習得対象の目安: **青色（1600–1999）**。繰り上がりや借りだけを次の桁へ渡し、通常の桁DPと異なる走査方向を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 繰り上がり・混合基数DP

整除鎖の丸め、支払いと釣銭、複数項の加算を下位桁から処理し、次の桁へ渡すcarry・borrowだけを状態に保つ。

### 習得する技能

- 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。

## 考え方

加減算を桁ごとに処理し、下位から渡るcarryを状態にする。混合基数なら各桁の基数を使って剰余と繰上がりを定める。carryの取り得る範囲を先に証明する。


整除鎖A_0=1,A_{i+1}=b_i A_i（b_i≥2）の支払いを考える。目標Xの混合基数桁をd_i=floor(X/A_i) mod b_iとし、下位からのcarry c∈{0,1}だけを持つ。初期dp[0][0]=0、他∞。r=d_i+cについて、下位をそのまま払う候補はr枚で次carry0、上位一枚を余分に払い釣りを戻す候補はb_i−r枚で次carry1となる。各候補費用を足してmin更新する。r=b_iなら後者は0枚でcarry1。最上位の額A_Lでは残るfloor(X/A_L)+c枚を足し、二carryの最小を取る。

加算式を扱う場合も、桁の選択値の総和とcからnewDigit=総和 mod b_i、newCarry=floor(総和/b_i)を得る。支払いの二carryへ任意の多項加算のcarry数を流用せず、選択数から範囲を界する。

## 成立条件と計算量

L桁・carry数C・各桁の選択数DならO(LCD)。負数の除算・剰余の規約を固定し、最後のcarryを消す桁まで処理する。上位の大小条件と同時に扱うなら、処理方向の違いを解決する必要がある。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: なし。

状態設計を土台に、整除鎖の丸めや複数項の加算で次の桁へ渡すcarryだけを有限状態として保つ。

### このUnitでは扱わないもの

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 問題一覧

- [ABC231 E「Minimal payments」](https://atcoder.jp/contests/abc231/tasks/abc231_e) — 主題: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)（整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。）。
- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g) — 主題: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)（整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。）。追加で学ぶ技能: [potential・weighted DSU](/learn/graph/potential-dsu/)（DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC231 E 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_e)
- [ABC231 E 公式解説](https://atcoder.jp/contests/abc231/editorial/3062)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-carry-mixed-radix`
