---
title: "gcdと整数解の成立条件"
description: "「gcdと整数解の成立条件」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 165
---

# gcdと整数解の成立条件

習得対象の目安: **水色（1200–1599）**。拡張EuclidとBézoutから一次不定方程式の一解と全解を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Bézout等式・一次不定方程式

整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。

差や周期をgcdでまとめると整数解の必要条件が見える。ここでは一歩進め、Bézoutの等式からその条件が十分であることを示し、具体解と全解を構成する。gcd不変量の抽出とは数論章内の別の技能として学ぶ。

ABC340 Fの整数座標の三角形を例に、一次不定方程式へ帰着する。観察: 原点、(X,Y)、(A,B)の三角形の面積は|XB−YA|/2。面積1にはXB−YA=2または−2が必要で、符号反転で対応するから2を解けばよい。

可解性: g=gcd(|X|,|Y|)はXB−YAを割る。逆にgが2を割れば、拡張EuclidでXu+Yv=gを作り、B=2u/g,A=−2v/gとすれば解になる。ゼロ座標も扱い、両方0なら解なし。

一般解: 一解(A0,B0)からA=A0+(X/g)t、B=B0+(Y/g)t（tは整数）。二解の差の方程式と互いに素なX/g,Y/gから、これが全解だと示す。

確認: 元の外積に代入し、出力上限も確認する。符号付き入力には絶対値で求めた係数へ符号を戻す。EuclidはO(log max(|X|,|Y|))。

### 習得する技能

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

## 考え方

ax+by=cの整数解はgcd(a,b)がcを割るときに存在する。拡張Euclidで一つの解を作り、x=x₀+(b/g)t、y=y₀−(a/g)tで全解を表す。

拡張Euclidの更新も通常の余り列に係数を付けるだけで構成できる。非負a,bについてr0=a,r1=b、係数(s0,t0)=(1,0),(s1,t1)=(0,1)から始め、q=floor(r0/r1)を求めるたび、次の余りr2=r0−qr1と係数(s2,t2)=(s0−qs1,t0−qt1)を作り二組を進める。不変式r_j=a s_j+b t_jを保ち、最後の非零余りgとその係数がBézout等式になる。元の負の係数には対応するs,tの符号を戻す。g|cなら(s·c/g,t·c/g)が一解。a=b=0の場合はc=0のとき全整数対、それ以外は解なしとして先に分ける。

### 全解のparameterへ上下限を移す

一解からx=x₀+u t、y=y₀+v
t（u=b/g,v=−a/g）を作る。L≤x≤Rなら、u>0ではceil((L−x₀)/u)≤t≤floor((R−x₀)/u)、u<0ではceil((R−x₀)/u)≤t≤floor((L−x₀)/u)となる。u=0ではx₀が範囲内かを確認し、範囲内ならtへの制約はない。yも同じ規則で処理し、両整数区間の交差を取る。

交差が空なら制約付き解なし、有限な[lo,hi]ならhi−lo+1個で、任意のtから具体解を返せる。片方の係数が0でも同じ規則が使える。整数の0方向への切捨て除算をfloor/ceilへそのまま流用しない。線形目的αx+βyならtの係数αu+βvの符号で最適端点を選べるが、その向きへ非有界なら有限最適値はない。係数0なら全実行可能解の目的値が等しい。

## 成立条件と計算量

一解の構築O(log U)。符号つき係数、a=b=0、上下限制約を別に扱う。tの整数範囲を求める除算ではfloorとceilを使い分ける。非負解の存在は整数解の存在より強い条件になる。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)、[数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)。

最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。

### このUnitでは扱わないもの

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 問題一覧

- [ABC340 F「S = 1」](https://atcoder.jp/contests/abc340/tasks/abc340_f) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。
- [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [二変数の凸区分線形整数最適化](/learn/geometry-optimization/two-variable-convex-lattice-optimization/)（二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。）。追加で学ぶ技能: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

## 根拠

- [ABC271 H 公式解説](https://atcoder.jp/contests/abc271/editorial/4932)
- [ABC271 H 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC315 G 公式解説](https://atcoder.jp/contests/abc315/editorial/6994)
- [ABC315 G 公式問題文](https://atcoder.jp/contests/abc315/tasks/abc315_g)
- [ABC340 F 公式解説](https://atcoder.jp/contests/abc340/editorial/9250)
- [ABC340 F 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-gcd-diophantine`
