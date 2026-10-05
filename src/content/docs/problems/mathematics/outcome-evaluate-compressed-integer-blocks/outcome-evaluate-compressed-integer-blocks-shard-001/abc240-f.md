---
title: "ABC240-F — Sum Sum Max"
draft: true
authoringUnit: {"problemId":"abc240-f","docPath":"src/content/docs/problems/mathematics/outcome-evaluate-compressed-integer-blocks/outcome-evaluate-compressed-integer-blocks-shard-001/abc240-f.md","learningOutcomeIds":["outcome-evaluate-compressed-integer-blocks"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc240-editorial-3422-da9c3a17066cdd84cfc5e3411c49dd6aadc54c78c261e1c84ddb28ec19a8fe88","source-abc240-f-problem-b3212e7fd15de74ec261149e17a9350d880731402a4b747ff05d3ed92da9752b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"block内n項後の値はA_0+B_0n+xn(n+1)/2で、隣接差B_0+xnが一次式になる。x≥0なら最大は端点、x<0なら差が非負から負になる境界付近か端点に限られる。整数候補を範囲へ切って全て評価すればblock最大を取りこぼさない。block末尾のA,Bを次へ引き継ぐことで全体を覆う。","sourceRevisionIds":["source-abc240-editorial-3422-da9c3a17066cdd84cfc5e3411c49dd6aadc54c78c261e1c84ddb28ec19a8fe88","source-abc240-f-problem-b3212e7fd15de74ec261149e17a9350d880731402a4b747ff05d3ed92da9752b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 素因数指数による整数条件の分解。

## 考察

C の同値 block を一項ずつ展開すると M が10^9まであるが、block 開始時の累積値を A_0,B_0 とすれば、block 内 n 項後は B=B_0+xn、A=A_0+B_0n+x n(n+1)/2 と閉じた式になる。

block 内の A は整数 n 上の二次式で、隣接差は B_0+xn という等差数列である。したがって最大候補は端点、または差分の符号が正から負へ変わる付近に限られる。

採用する候補: 各 run の二次式を作り、x≥0 なら両端、x<0 なら離散差分が0を跨ぐ整数付近と両端だけを評価する。

y_i の大きさに依存せず、上凸・下凸という形から block 内最大を定数個の候補へ絞れる。

棄却する候補: 圧縮列 C を y_i 回ずつ展開し、B と A を逐次更新する。

総長 M は10^9であり、run 数 N が小さくても項単位の走査はできない。

A(n)-A(n-1)=B_0+xn なので、x<0 のとき最大点はこの値が非負である最後の n とその隣にあり、微分ではなく整数差分で境界を決められる。

各 (x,y) で f(n)=A+B n+x n(n+1)/2 を定義し、n=1,y と、x<0 なら -B/x 付近を [1,y] に clamp した候補を評価して全体最大を更新する。その後 A←f(y)、B←B+xy として次 block へ進む。

## 典型の発動条件

### run-length 圧縮列の閉形式更新

発動条件: 同じ値が巨大回数続く累積和を扱うとき。

等差数列和を使い、run 末尾の状態を項数に依存せず更新する。

### 離散凸・離散凹関数の極値

発動条件: 整数区間上の目的関数の一階差分が単調なとき。

端点と差分の符号反転点付近だけを候補にする。

## 問題固有の要素

C が一定な run では B が一次、A が二次になるため、二重 prefix sum を巨大列としてではなく放物線の区間として読める。

別の問題へ持ち帰る視点: 複数回 prefix sum を取る run-length 列では、run 内が何次多項式になるかを先に求める。

## 正当性

block内n項後の値はA_0+B_0n+xn(n+1)/2で、隣接差B_0+xnが一次式になる。x≥0なら最大は端点、x<0なら差が非負から負になる境界付近か端点に限られる。整数候補を範囲へ切って全て評価すればblock最大を取りこぼさない。block末尾のA,Bを次へ引き継ぐことで全体を覆う。

## 実装上の注意

- A,B と x·y(y+1)/2 は 64 bit で計算し、候補 n は必ず1..yへ clamp して前後も評価する。答えの対象は A_1..A_M なので各 block の n=0だけを新候補にしない。

## 復習の核

- x<0 の run で B が正から負へ変わる小例を書き、A の最大が B の値そのものではなく A の隣接差分の境界にあることを確認する。

## 計算量と制約

### 時間

全caseでO(ΣN)。各定数blockにつき候補を定数個調べる。

### 空間

O(1)の追加領域。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; The sum of N in a single file is at most 2 \times 10^5.; 1 \leq M \leq 10^9; |x_i| \leq 4 \, (1 \leq i \leq N); y_i \gt 0 \, (1 \leq i \leq N); \sum_{k = 1}^N y_k = M; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/editorial/3422) — source-abc240-editorial-3422-da9c3a17066cdd84cfc5e3411c49dd6aadc54c78c261e1c84ddb28ec19a8fe88
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/tasks/abc240_f) — source-abc240-f-problem-b3212e7fd15de74ec261149e17a9350d880731402a4b747ff05d3ed92da9752b
