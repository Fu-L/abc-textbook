---
title: "2-SAT・含意グラフ"
description: "「2-SAT・含意グラフ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 104
---

# 2-SAT・含意グラフ

習得対象の目安: **青色（1600–1999）**。二値制約を含意へ変換し、literalと否定のSCCから可解性と代入を得る。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 2-SAT・含意グラフ

二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。

### 習得する技能

- 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。

## 考え方

### 節・含意・充足割当

Boolean変数の値またはその否定をliteralと呼ぶ。節(a∨b)は¬a→bと¬b→aの二辺へ写す。単項節aは(a∨a)である。変数xと¬xが同じSCCなら、どちらを真にしても両方を真にするため不可能。そうでなければ次の規則で必ず割り当てられる。

縮約DAGの辺の向きに沿うトポロジカル順で成分番号compを付け、literal aを `comp(a)>comp(¬a)` のとき真とする。否定同士は異なる成分なので、各変数の片方だけが真になる。含意a→bに対し、aが真、bが偽と仮定すると、対偶¬b→¬aもあるため `comp(¬a)<comp(a)≤comp(b)<comp(¬b)≤comp(¬a)` となり矛盾する。よって全含意と全節を満たす。逆順番号を返す実装では大小も逆になる。

### 整数をthreshold列にする

整数 `0≤X_i≤M` に対し `B(i,t)=[X_i≥t]` をt=0,…,M+1に作る。B(i,0)を真、B(i,M+1)を偽に固定し、t=0,…,Mで `B(i,t+1)⇒B(i,t)` を張る。真の列は先頭から連続するので、最大の真のtをX_iとすれば、Boolean列と整数が一対一に対応する。範囲外のthresholdはt≤0なら真、t≥M+1なら偽の定数として扱う。

和の下限 `X_i+X_j≥L` は、t=1,…,M+1について節 `B(i,t)∨B(j,L−t+1)` を張ることで表す。和がL以上ならX_i<tのときX_j≥L−t+1。一方、和がL未満ならt=X_i+1で両literalが偽になる。t≤0の節は自動的に真で、t>M+1の節はt=M+1の節より弱いため、この有限範囲だけで十分である。

和の上限 `X_i+X_j≤R` は、t=0,…,Mについて `¬B(i,t)∨¬B(j,R−t+1)` とする。和がRを超えるならt=X_iで両thresholdが真になり、逆に両方真なら和はR+1以上になる。範囲外のthresholdを定数へ置換し、真を含む節は捨て、残る単項節は値を固定する。偽∨偽なら即座に不可能である。SCCの割当から最大の真のthresholdを復元すれば、元の上下限制約を満たす整数列が得られる。

## 成立条件と計算量

符号化後のBoolean変数数をK、節数をCとするとO(K+C)時間・空間。元の整数変数N個、和の制約Q個、上限MではK=O(N(M+1))、C=O((N+Q)(M+1))となる。Mが巨大なら、この列挙では実用的にならない。任意の三項節・整数制約を2-SATへ移せるわけではなく、二literalの節との同値性を示してから使う。

概念上の親: [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

このUnitを直接前提とする単元: なし。

SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、2-SAT・含意グラフの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h) — 主題: [2-SAT・含意グラフ](/learn/graph/two-sat/)（整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC277 H 公式解説](https://atcoder.jp/contests/abc277/editorial/5207)
- [ABC277 H 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-two-sat`
