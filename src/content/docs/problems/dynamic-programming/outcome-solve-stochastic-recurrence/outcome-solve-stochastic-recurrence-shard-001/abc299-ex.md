---
title: "ABC299-EX — Dice Sum Infinity"
draft: true
authoringUnit: {"problemId":"abc299-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc299-ex.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-linear-recurrence","unit-linear-system-rank","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-linear-recurrence-matrix","tag-linear-system-rank","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6","source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"補助過程の基底は既に閾値へ到達した状態、遷移は六出目の全確率を分割したものなので、eとpは到達時間と出口分布を表す。出目が高々6であるため、残距離sから真の目標へ達する前に必ず残距離1,…,6のいずれかへ入る。補助過程の残差tを6+tへ対応させるGの式は、そこまでの時間とその後の期待時間を足している。手前状態では出目a=iだけが終了、a>iは次周期へ接続するため、六本の式は真の過程の一歩遷移そのものである。有限の剰余状態から停止点へ到達でき、期待停止時間は有限で一意。この連立を法998244353上で解き、初期残距離Rに接続した値が回答になる。","sourceRevisionIds":["source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6","source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md) — 一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。
- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md) — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

和がR以上になったら終わる問題なら残距離のDPで済む。しかし真の停止条件は和≡R (mod T)、T=10^9であり、Rを飛び越すと次周期まで進み直す。全T状態は大き過ぎる。一方、一回の出目は高々6なので、目標の手前6状態を必ず通ることに注目する。

E_i（1≤i≤6）を、目標までの残距離がi (mod T)の状態から、真の停止条件を満たすまでの期待回数とする。残距離0なら既に終了で、期待値は0である。

まず通常の補助過程を作る。残距離rから出目を引き、r≤0になった時点で終える。e(r)をその期待回数、p_t(r)を終了時の残距離がt∈{0,−1,…,−5}となる確率とする。基底と遷移は

e(r)=0、p_t(r)=1_{r=t} （r≤0）、

e(r)=1+(1/6)Σ_{a=1}^6 e(r−a)、p_t(r)=(1/6)Σ_{a=1}^6 p_t(r−a) （r>0）。

必要な負のrは−5までである。eは[ e(r),e(r−1),…,e(r−5),1 ]の7成分で更新できる。第一行は最初の6成分へ1/6、定数成分へ1、次の5行は一つ前の成分をコピーし、最終行は定数1を保つ。r=0の初期ベクトルは[0,0,0,0,0,0,1]。p_tも同じシフトの6成分で、第一行の6係数を1/6、初期ベクトルを[1_{0=t},1_{−1=t},…,1_{−5=t}]とする。行列累乗で各rをO(log r)で評価する。

残距離s≥1からまず目標の手前6以下へ入るまで進む。補助過程をr=s−6で開始すると、終了残差tは真の残距離6+t（1,…,6）に対応する。そこで

G(s)=e(s−6)+Σ_{t=−5}^0 p_t(s−6)E_{6+t}

と定義する。s≤6でも基底によりG(s)=E_sとなる。

手前状態iから一回振ると、a<iはE_{i−a}へ、a=iは真の終了へ、a>iは次周期の残距離T+i−aへ移る。従って六本の方程式は

E_i=1+(1/6)Σ_{a=1}^{i−1}E_{i−a}+(1/6)Σ_{a=i+1}^6 G(T+i−a) （i=1,…,6）。

Gの式を代入してE_1,…,E_6の係数を左へ移し、6×6の連立一次方程式を法998244353上で解く。a=iの項を次周期に接続してはいけない。これが停止とovershootを区別する箇所である。

求める回答はG(R)=e(R−6)+Σ_{t=−5}^0 p_t(R−6)E_{6+t}。R≤6なら直接E_Rを返してもよい。

## 典型の発動条件

### 有限Markov renewal

発動条件: 大きな周期閾値を越えると少数のovershoot状態へ再生する。

一周期の到達時間と出口分布から残差期待値方程式を作る。

### 線形漸化式の行列累乗

発動条件: 固定幅dice recurrenceを巨大indexで評価する。

状態ベクトルを高速累乗する。

## 問題固有の要素

mod 10^9の停止条件は巨大でも、dice最大目6が周期境界の情報を6残差へ圧縮する。

別の問題へ持ち帰る視点: 周期境界を跨ぐ確率過程はovershoot幅を状態にする。

## 正当性

補助過程の基底は既に閾値へ到達した状態、遷移は六出目の全確率を分割したものなので、eとpは到達時間と出口分布を表す。出目が高々6であるため、残距離sから真の目標へ達する前に必ず残距離1,…,6のいずれかへ入る。補助過程の残差tを6+tへ対応させるGの式は、そこまでの時間とその後の期待時間を足している。手前状態では出目a=iだけが終了、a>iは次周期へ接続するため、六本の式は真の過程の一歩遷移そのものである。有限の剰余状態から停止点へ到達でき、期待停止時間は有限で一意。この連立を法998244353上で解き、初期残距離Rに接続した値が回答になる。

## 実装上の注意

- overshootの添字はt=0,−1,…,−5で、接続先はE_{6+t}。残距離0への到達そのものを真の終了と取り違えない。
- R≤6を直接E_Rで扱えば、行列の負の指数を呼ぶ必要がない。
- 法998244353上の1/6を使い、Gauss消去で非零pivotの行を選ぶ。確率過程の実数解の一意性と、法上の消去を区別する。

## 復習の核

- 小周期へ縮小した逐次DP/連立方程式と比較し、R=1..6相当境界と各overshoot確率総和1を確認する。

## 計算量と制約

### 時間

O(log 10⁹)、6〜7次の固定行列累乗と6元方程式。

### 空間

O(1)、固定次元行列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0\lt R\lt10^9; R is an integer.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6260) — source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_h) — source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516
