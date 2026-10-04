---
title: "ABC414-E — Count A%B=C"
draft: true
authoringUnit: {"problemId":"abc414-e","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc414-e.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc414-e-problem-400f0f5a756e09ebb4432cb50e469a67995ec6b0e14ffa8478b397a8336277d7","source-abc414-editorial-13450-d136759d73f4ca99697d477bf5234f4941176a74dc16534f312ecb3b38ebb37a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"相異なる正a,b,cのa mod b=cはb<aと非倍数条件に等しく、cは自動的に0<c<b<aで一意。bごとの候補N−bから倍数floor(N/b)−1を除いた和はN(N+1)/2−Σfloor(N/b)。同商区間[l,N/q]の一括加算は全bを一度覆うので、その差がexact個数になる。","sourceRevisionIds":["source-abc414-e-problem-400f0f5a756e09ebb4432cb50e469a67995ec6b0e14ffa8478b397a8336277d7","source-abc414-editorial-13450-d136759d73f4ca99697d477bf5234f4941176a74dc16534f312ecb3b38ebb37a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

この解説で扱わないこと:

- 素因数指数による整数条件の分解。

## 考察

a mod b=c>0かつa,b,cが相異なる条件は、1≤b<a≤Nかつaがbの倍数でないことと同値である。このとき0<c<b<aが自動的に成り立つ。

b固定で有効なaはN-b個からbの倍数 floor(N/b)-1個を除いた N-b+1-floor(N/b) 個である。

採用する候補: 全bの式を等差数列和 N(N+1)/2 と divisor summatory function Σ floor(N/b) の差にし、同じ商を区間ごとにまとめる

q=floor(N/l)はr=floor(N/q)まで一定なので、lをr+1へ飛ばせば相異なる商区間はO(sqrt N)個である。

棄却する候補: b=1..Nを全走査して有効a数を足す

一項はO(1)でもN=10^12のloopは不可能で、floor quotientが長い区間で一定になる性質を使っていない。

求める個数は Σ_b(N-b+1)-Σ_b floor(N/b)=N(N+1)/2-Σ_b floor(N/b) と簡潔に分離できる。

floor(N/b)の値がqである最大右端はfloor(N/q)。区間[l,r]の寄与はq(r-l+1)なので、商ごとにまとめて漏れなく加算できる。

S=0,l=1から、q=N/l、r=N/q、S+=q·(r-l+1)、l=r+1をNまで反復する。ans=N(N+1)/2-Sをmod 998244353で出力する。各項を適宜mod化し、O(sqrt N)区間を処理する。

## 典型の発動条件

### 商が一定な区間の列挙

発動条件: Σ floor(N/i)を巨大Nで求めるとき。

現在商qから右端N/qを逆算して添字をまとめて進める。

### 条件の二変数化

発動条件: remainder cがa,bから一意に決まり、distinct条件も大小へ簡約できるとき。

tupleを(a,b)へ射影し、c>0を非倍数条件として数える。

### 等差数列和

発動条件: 各bに対する全候補a数が線形に変化するとき。

Σ(N-b+1)をN(N+1)/2へ閉形式化する。

## 問題固有の要素

pairwise distinctは個別除外を数える必要がなく、正のremainderならc<b<aというstrict chainに自動変換される。

別の問題へ持ち帰る視点: 剰余tupleでは商・余りの基本不等式からdistinct条件が冗長になる領域を先に切り分ける。

## 正当性

相異なる正a,b,cのa mod b=cはb<aと非倍数条件に等しく、cは自動的に0<c<b<aで一意。bごとの候補N−bから倍数floor(N/b)−1を除いた和はN(N+1)/2−Σfloor(N/b)。同商区間[l,N/q]の一括加算は全bを一度覆うので、その差がexact個数になる。

## 実装上の注意

- N(N+1)は64 bitを超えるので128 bitまたはmod上のinv2を使う。r=N/qを整数除算し、減算結果を法の非負範囲へ戻す。

## 復習の核

- N=3..20を全(a,b,c)列挙し、b=1とb=Nの寄与0、完全平方数付近の商区間境界を確認する。

## 計算量と制約

### 時間

O(√N)。floor(N/b)の同商区間をまとめる。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 10^{12}; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/tasks/abc414_e) — source-abc414-e-problem-400f0f5a756e09ebb4432cb50e469a67995ec6b0e14ffa8478b397a8336277d7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/editorial/13450) — source-abc414-editorial-13450-d136759d73f4ca99697d477bf5234f4941176a74dc16534f312ecb3b38ebb37a
