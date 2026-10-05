---
title: "ABC283-G — Partial Xor Enumeration"
draft: true
authoringUnit: {"problemId":"abc283-g","docPath":"src/content/docs/problems/mathematics/outcome-maintain-xor-linear-basis/outcome-maintain-xor-linear-basis-shard-001/abc283-g.md","learningOutcomeIds":["outcome-maintain-xor-linear-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis"],"sourceRevisionIds":["source-abc283-editorial-5430-affe38163eed0a16411c251e484bd226d779be9a3b4ce68d334786d4c72afff4","source-abc283-g-problem-421a25e6e43a500d4c47305bf939cbea7c8edaba3eb10f08b58cb3abb5994a0d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"XORのdistinct集合は基底の全線形結合。基底を既約化して各pivotが他行で0になると、係数maskの最上位相違bitが出力値の最上位相違bitにもなる。pivot順に基底を並べれば係数mask順と数値順が一致するため、q=L−1..R−1の結合が要求区間の値を正しく生成する。","sourceRevisionIds":["source-abc283-editorial-5430-affe38163eed0a16411c251e484bd226d779be9a3b4ce68d334786d4c72afff4","source-abc283-g-problem-421a25e6e43a500d4c47305bf939cbea7c8edaba3eb10f08b58cb3abb5994a0d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

subsequence xor全体はAの60-bit vectorが張るF_2部分空間で、distinct値数はrank rに対して2^rである。

任意linear basisでは係数bit順と数値順が一致しないが、各pivot bitが他basis vectorで0になるreduced basisなら順序を制御できる。

採用する候補: Gaussian eliminationでpivot列を相互消去したreduced xor basisを作り、数値昇順に並べ、rank indexのbinary係数でxorを復元する。

2^r個を生成・sortせず、任意のL…R番目をbasis本数≤60の計算で直接得られる。

棄却する候補: 全basis coefficient 2^r通りのxorを列挙してsortする。

rは60まであり、列挙不能である。

basis vector e_tのmsbが全て異なり、そのpivot bitが他vectorで0なら、二つの係数maskの最高相違bitがxor値の大小も決める。

e_0<…<e_{r-1}と並べると、0-index index qのbit tが1なe_tをxorした値が、部分空間のq番目に小さい値になる。

Aを上位bitpivotでbasisへ挿入し、全pivotが他rowから消えるようbackward/forward消去する。非零basisを数値昇順に並べ、q=L-1,…,R-1ごとにset bitのbasisをxorして出力する。

## 典型の発動条件

### XOR linear basis

発動条件: subsequence xorのdistinct集合やrankを扱うとき。

F_2 Gaussian eliminationで独立vectorだけを残す。

### reduced basisによるk-th xor

発動条件: span要素を数値順に直接列挙・選択したいとき。

pivot列を相互消去し、係数maskのbinary順とxor値順を一致させる。

## 問題固有の要素

basisのpivot bitを他rowから消す追加消去が、単なるrepresentability判定用basisをorder-statistic用basisへ変える。

別の問題へ持ち帰る視点: linear basisでk-th値が必要なら、row echelonだけでなくreduced formとpivot順を整える。

## 正当性

XORのdistinct集合は基底の全線形結合。基底を既約化して各pivotが他行で0になると、係数maskの最上位相違bitが出力値の最上位相違bitにもなる。pivot順に基底を並べれば係数mask順と数値順が一致するため、q=L−1..R−1の結合が要求区間の値を正しく生成する。

## 実装上の注意

- 入力L,Rは1-indexedなので係数maskはL-1…R-1とし、rank60の2^60境界をsigned overflowさせない。
- dependentな0 vectorはbasisへ含めず、同じxorを複数subsequenceが作ってもdistinct集合では1回だけ出す。

## 復習の核

- 2本basisでpivot列の相互消去前後を比べ、mask00,01,10,11のxorが昇順になる条件を検証する。

## 計算量と制約

### 時間

O(NB+B²+(R−L+1)B)、B=60。

### 空間

O(B+R−L+1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 0\leq A _ i\lt2^{60}\ (1\leq i\leq N); 1\leq L\leq R\leq k; R-L\leq2\times10^5; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/editorial/5430) — source-abc283-editorial-5430-affe38163eed0a16411c251e484bd226d779be9a3b4ce68d334786d4c72afff4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/tasks/abc283_g) — source-abc283-g-problem-421a25e6e43a500d4c47305bf939cbea7c8edaba3eb10f08b58cb3abb5994a0d
