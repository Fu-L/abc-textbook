---
title: "ABC476 F — Chebyshev Cafe"
draft: true
authoringUnit: {"problemId":"abc476-f","docPath":"src/content/docs/problems/updates/abc476-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates","outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-geometry-orientation-transform","tag-contribution-reordering"],"sourceRevisionIds":["source-abc476-f-problem-75f37bb15b57b68c201ee0f2363e55b7bc240a92f24141d46bcc89dbd01cf6ba","source-abc476-editorial-25806-522390241fec6c2719f57b3df9a682b0beef2c14850d03a7b220097335195538"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"実数a,bに対する |a+b|+|a−b|=2max(|a|,|b|) の恒等式で距離が二軸へ分離する。線形性から同じ軸座標の重みをまとめても各カフェへの寄与は変わらない。prefix重みと一次モーメントの式は絶対値の符号別展開なので、全人数の距離和を正確に計算できる。","sourceRevisionIds":["source-abc476-f-problem-75f37bb15b57b68c201ee0f2363e55b7bc240a92f24141d46bcc89dbd01cf6ba","source-abc476-editorial-25806-522390241fec6c2719f57b3df9a682b0beef2c14850d03a7b220097335195538"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

## 考察

Chebyshev距離を全点から全候補へ足すと O(N⁴)。45度座標変換u=i+j、v=i−jを使うと max(|Δi|,|Δj|)=(|Δu|+|Δv|)/2 になる。人数C_ij=(A_iB_j) mod Mを、uごとの重みU[u]とvごとの重みV[v]へ集約する。

各軸では全位置xの重み付き絶対距離 F(x)=Σ_t w_t|x−t| を求めればよい。xの左側と右側に分け、prefix重み和P(x)とprefix一次モーメントQ(x)を使うと、左寄与はxP−Q、右寄与は(Q_total−Q)−x(P_total−P)。u,vとも整数範囲の長さ O(N) なので全軸位置のFを O(N) で前計算できる。

各カフェ(i,j)の答えは (F_U(i+j)+F_V(i−j))/2。格子点由来のu,vの差には同じ偶奇があるため、分子は必ず偶数で整数になる。この値へ(i−1)N+(j−1)を足してXORする。入力人数の計算と出力候補走査はいずれも O(N²) なので全体 O(N²) に落ちる。

元の幾何では斜めimosでも解けるが、ここでは距離の座標変換により二つの一次元絶対値和へ分離する。

## 典型の発動条件

L∞距離を45度変換したL1距離へ分離する。重み付き絶対距離の全評価は個数和と一次モーメントのprefixで求める。

## 問題固有の要素

人数の積mod Mは先に各セルで計算してから軸へ集計する。A,Bの積のまま分離してはならない。

## 正当性

実数a,bに対する |a+b|+|a−b|=2max(|a|,|b|) の恒等式で距離が二軸へ分離する。線形性から同じ軸座標の重みをまとめても各カフェへの寄与は変わらない。prefix重みと一次モーメントの式は絶対値の符号別展開なので、全人数の距離和を正確に計算できる。

## 実装上の注意

i−jの負添字をずらす。距離総和は64 bit整数、積A_iB_jも先に広い型へ。2で割る前に偶数性を確認する。

## 復習の核

二次元の距離和では、何を回転すれば軸別の和になるか試す。重みが分離しなくても、距離が分離すればよい。

## 計算量と制約

### 時間

全人数と全カフェを一度走査して O(N²)。軸前計算 O(N)。

### 空間

軸重みとモーメント O(N)。人数行列を保存する必要はない。

### 制約との対応

Time limit: 3 sec; Memory limit: 2048 MiB; Constraints: 1 \leq N \leq 1500; 2 \leq M \leq 2 \times 10^6; 1 \leq A_i \leq M-1 (1 \leq i \leq N); 1 \leq B_j \leq M-1 (1 \leq j \leq N); All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc476/tasks/abc476_f)
- [公式解説](https://atcoder.jp/contests/abc476/editorial/25806)
