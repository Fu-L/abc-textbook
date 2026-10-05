---
title: "rerooting・全方位木DP"
description: "「rerooting・全方位木DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 133
---

# rerooting・全方位木DP

習得対象の目安: **青色（1600–1999）**。各辺の両側の情報を設計し、prefix・suffix合成で全根の答えを求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### rerooting・全方位木DP

辺の両側情報とprefix/suffix合成を用いて、全ての根に対する木DP値を線形または準線形時間で得る。

### 習得する技能

- 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

## 考え方

子から親へのmessageを計算した後、親側も含めた全隣接messageから各子へ送る値を作る。子自身の寄与を除いた合成をprefix/suffixで共有すれば全頂点を根とした答えを求められる。


有向message m(u→v)を、辺uvを切ったu側の情報をvへ渡す値とする。頂点uで入るmessageを⊗で集約し、その結果に頂点処理と辺を渡る変換F_{u,v}を行うなら `m(u→v)=F_{u,v}(⊗_{w∈N(u),w≠v}m(w→u))`。根を一つ決め、postorderで子→親を作り、その後preorderで親→子を作る。

隣接順に入る値a_0,…,a_{d−1}についてpref[0]=e,pref[j+1]=pref[j]⊗a_j、suff[d]=e,suff[j]=a_j⊗suff[j+1]とすれば、jだけを除く積はpref[j]⊗suff[j+1]。逆元のないminや非可換積にも使える。全入値の積へ答え用変換をかけると、その頂点を根にした答えになる。距離和の例ではmessage=(count,sumDist)、結合は成分和、u自身を一個加え、辺長wを渡るとsumDistへcount·wを足す。

## 成立条件と計算量

定数サイズの結合的合成ならO(N)。除外に逆元は不要で、prefix/suffixの積を使える。辺を渡る変換と頂点での合成を区別し、非可換なら隣接順も固定する。

概念上の親: [木DP・集約・rerooting](/learn/tree/tree-aggregation/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

根付き木DP・部分木集約で得た考え方と実装を再利用し、rerooting・全方位木DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC220 F「Distance Sums 2」](https://atcoder.jp/contests/abc220/tasks/abc220_f) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。
- [ABC348 E「Minimize Sum of Distances」](https://atcoder.jp/contests/abc348/tasks/abc348_e) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。
- [ABC223 G「Vertex Deletion」](https://atcoder.jp/contests/abc223/tasks/abc223_g) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC348 E 公式問題文](https://atcoder.jp/contests/abc348/tasks/abc348_e)
- [ABC348 E 公式解説](https://atcoder.jp/contests/abc348/editorial/9706)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-rerooting`
