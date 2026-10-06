---
title: "標数pのFrobenius恒等式による反復高速化"
description: "「標数pのFrobenius恒等式による反復高速化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 179
---

# 標数pのFrobenius恒等式による反復高速化

習得対象の目安: **橙色（2400–2799）**。標数による二項係数の消滅を演算子へ適用し、反復と圧縮列の増大を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 標数pのFrobenius恒等式による反復高速化

標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。

シフトをSとすれば一行上がる操作はI+Sであり、標数7で(I+S)^(7^t)=I+S^(7^t)。有限体の元の軌道長を圧縮する話ではない。F7上ではa^7=aなので元のFrobeniusは恒等写像である。

初期列の長さN、目標長K、初期run数Mとする。ABC251 Exでは大きい7冪から各幅を高々6回適用する。同じ幅qでの反復は元の境界の高々7種類のシフトを作るだけ。幅qの処理終了時のrun数はO(MN/q)とO(K+q)の両方で抑えられる。小さい方の上界を使えば全体O((√(MN)+K) log N)。単にRLEを使うだけでは高速性の証明にならない。

### 習得する技能

- 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 二項係数が消える条件

素数pを法とし、有限列Aのshiftを(SA)_i=A_{i+1}とする。隣接和一回はT=I+Sである。IとSは可換なので二項展開でき、0<j<pのC(p,j)はpの倍数だから `T^p=I+S^p`。これを繰り返すと `T^(p^t)=I+S^(p^t)`。従ってq=p^t回の更新を、各iのA_i+A_{i+q}をmod pで取る一回の操作へ置き換えられる。出力範囲は0≤i<n−qであり、両方の入力が存在する部分だけを残す。

必要回数Rをp進表記R=Σ_t c_t p^tに分け、幅p^tをc_t回ずつ大きいtから適用する。0≤c_t<pなので各幅は高々p−1回。全段の合成は同じ演算子Tの累乗であり、求めるT^Rと一致する。恒等式は可換な演算子と標数pに依存し、任意の行列A,Bで(A+B)^p=A^p+B^pになるという主張ではない。

### 連長圧縮上のjumpとrun数

列を(value,length)のrunとして保持する。一方のcursorを位置0、他を位置qへ置き、残りrun長の小さい方だけ区間を消費して二値の和を出力する。両cursorのどちらかは必ず次の境界へ進むので、入力run数Mに対しO(M)で一jumpを作れる。出力の隣接同値runはその場で併合する。

初期長N、目標長K、初期run数Mとする。幅qのjumpをc≤p−1回行うと、境界候補は処理前の各境界を0,q,…,cqだけshiftした位置だからrun数は高々p倍となる。大きい幅から処理すると幅q完了時のrun数はO(MN/q)。一方、残り更新回数はq未満だから現在長はK+q未満で、run数もO(K+q)。両上界の小さい方はO(√(MN)+K)に収まり、段の和が全体費用を界する。RLEを採用した事実だけでは、この境界増大の評価を省けない。

## 成立条件と計算量

pを固定定数とすればO((√(MN)+K) log_p N)時間、各段のrun数に比例する空間。密な列のままならO(pN log_p N)で、圧縮の利益はrun数評価にある。R=0は初期列をそのまま返す。F_pの元自身の写像a→a^pは恒等写像で、この算法が加速する対象は隣接和の演算子である。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

法上の四則演算・高速累乗・逆元で得た考え方と実装を再利用し、標数pのFrobenius恒等式による反復高速化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)（標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC251 H 公式解説](https://atcoder.jp/contests/abc251/editorial/3954)
- [ABC251 H 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-finite-field-frobenius`
