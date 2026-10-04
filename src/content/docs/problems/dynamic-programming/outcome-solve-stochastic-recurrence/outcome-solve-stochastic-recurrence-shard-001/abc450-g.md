---
title: "ABC450-G — Random Subtraction"
draft: true
authoringUnit: {"problemId":"abc450-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc450-g.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic","unit-normalization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43","source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各初期値の係数は、減算併合ごとに符号が掛かるだけなので±1であり、x²の対角項はΣA_i²。添字交換で操作の分布が変わらないため、異なる全pairの相関は共通e_Nである。\n\n初手の二係数は小問題の合成要素の符号dと−dになり、互いの積は−1、外部との二つの積は個々の操作列でも相殺する。外部N−2要素のpairだけが小問題の共通相関e_{N−1}を残すので、C_N=−1+C(N−2,2)e_{N−1}。N≥3ではpair数の比が(N−3)/(N−1)となる。基底C_1=0,C_2=−1からこの再帰は全相関和を計算し、全pairの共通値へ戻したe_Nを二次式へ代入すると求める期待値になる。","sourceRevisionIds":["source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43","source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

操作を展開すると最終xはΣc_iA_i、c_i∈{±1}となる。xの分布全体を求める代わりに、要求されたx²を展開して、どの相関が必要かを見る。

```text
x² = ΣA_i² + 2Σ_{i<j} c_i c_j A_iA_j
```

対角はc_i²=1で確定する。選ぶ添字に関する操作の対称性により、相異なる全pairの相関e_N=E[c_i c_j]は共通でNだけに依存する。Σ_{i<j}A_iA_j=((ΣA_i)²−ΣA_i²)/2なので、入力からは総和と二乗和だけを集計すれば足りる。

C_N=C(N,2)e_Nを相関の全pair和とし、最初に二要素a,bをa−bへ併合する場合で分ける。小さいN−1要素問題で合成要素に掛かる符号をdとすると、元の二係数はd,−d。そのpairの寄与は−1、外の一要素cとの二pairの和はdc+(−d)c=0である。残る外部N−2要素同士は、N−1要素問題の共通相関e_{N−1}を持つ。従ってN≥3では

```text
C_N = −1 + C(N−2,2)e_{N−1}
    = −1 + (N−3)/(N−1) C_{N−1}
```

となる。係数(N−3)/(N−1)は、残るpair数C(N−2,2)を小問題の全pair数C(N−1,2)で割った比である。N=1ではC_1=0、N=2では二符号が逆なのでC_2=−1を直接の基底とする。

1..Nの逆元を前計算し、CをNまで順に更新する。N≥2ではe_N=C_N/C(N,2)を取り、答えはsumSq+e_N(sum²−sumSq)。N=1ではA_1²を返す。法998244353よりN≤2×10^5が小さいので、使うN−1とC(N,2)は0にならない。小例N=3ではC_3=−1,e_3=−1/3となり、外部同士のpairがないことに対応する。

指数的な操作列全探索も値ごとの確率DPも不要であり、目的の次数に合わせて二次モーメントだけを残すのが鍵である。

## 典型の発動条件

### 交換対称性による期待値圧縮

発動条件: ランダム過程の最終係数が index permutation に対して対称なとき。

全 pair の相関を一つの N 依存値へまとめる。

### 一次 moment recurrence

発動条件: 最初の操作で二要素をまとめると小さい同型問題になるとき。

固定された交差項と残り問題の期待値を足して漸化式を作る。

## 問題固有の要素

最終値分布を求めず、目的関数を展開して必要な二次 moment だけを対称性で分類する。

別の問題へ持ち帰る視点: ランダム縮約過程では最初の一手を固定し、残った object が一サイズ小さい同分布になるかを見る。

## 正当性

各初期値の係数は、減算併合ごとに符号が掛かるだけなので±1であり、x²の対角項はΣA_i²。添字交換で操作の分布が変わらないため、異なる全pairの相関は共通e_Nである。

初手の二係数は小問題の合成要素の符号dと−dになり、互いの積は−1、外部との二つの積は個々の操作列でも相殺する。外部N−2要素のpairだけが小問題の共通相関e_{N−1}を残すので、C_N=−1+C(N−2,2)e_{N−1}。N≥3ではpair数の比が(N−3)/(N−1)となる。基底C_1=0,C_2=−1からこの再帰は全相関和を計算し、全pairの共通値へ戻したe_Nを二次式へ代入すると求める期待値になる。

## 実装上の注意

- N=1はA_1²、N=2はC_2=−1を基底にする。存在しないpairの逆元を取らない。
- ΣA_iとΣA_i²は法上で集計してよい。最後の式はsumSq+e_N(sum²−sumSq)なのでpair和用の除算2を別に重ねない。
- C_Nは全pairの相関和、e_Nは一pairの相関である。これらを取り違えるとN≥3で倍率が変わる。

## 復習の核

- 最初の二要素に関する三種類の pair（互い・片方と外部・外部同士）の寄与を分けて C_N の式を再導出する。

## 計算量と制約

### 時間

N 要素。整数逆元を1..Nで前計算すれば recurrenceと集約は O(N)。各stepでべき逆元を計算する実装は O(Nlog p)、p=998244353。

### 空間

逆元表O(N)、入力逐次sumとsumSq集約ならそれ以外O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i \leq 998244352; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/editorial/17336) — source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/tasks/abc450_g) — source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98
