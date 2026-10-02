---
title: "ABC420-G — sqrt(n²+n+X)"
draft: true
authoringUnit: {"problemId":"abc420-g","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc420-g.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc420-editorial-13733-e64a00a448e785a6e17abd4176a44596ef536f2b5911f4ad0b3bcd8ade2a99c4","source-abc420-g-problem-2dff6a1126bda66a46d02fa7128a758855a0d61e22afc818f692e51469319fbf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"m²=n²+n+Xを平方完成するとd=2m+2n+1,e=2m−2n−1の積が4X−1となる。逆にsigned約数pairでm=(d+e)/4、n=(d−e−2)/4が整数かつm≥0なら元式を満たす。両方向の対応で全解を尽くし、setで同じnを除く。負Xでは異符号pairも必要になる。","sourceRevisionIds":["source-abc420-editorial-13733-e64a00a448e785a6e17abd4176a44596ef536f2b5911f4ad0b3bcd8ade2a99c4","source-abc420-g-problem-2dff6a1126bda66a46d02fa7128a758855a0d61e22afc818f692e51469319fbf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X=1。","procedure":["D=3。pair(d,e)=(3,1)から(m,n)=(1,0)、(1,3)から(1,−1)。","他のsigned pairはm<0なので除く。"],"executionTarget":null,"expectedResult":"n=−1,0。","verificationStatus":"not_applicable","learningUnitIds":["unit-prime-divisor"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"prerequisiteIds":[],"attainmentCondition":"X=−1なら正の約数だけでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"n=−2,1、signed pairが必要。"},"answer":{"reasoningOrVerification":"D=−5でpairは異符号。実際n=1,−2ではn²+n−1=1。","procedure":["具体例の各状態・寄与を再計算する。","D=−5でpairは異符号。実際n=1,−2ではn²+n−1=1。"],"expectedResult":"n=−2,1、signed pairが必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

m=sqrt(n^2+n+X)≥0を整数とすると、平方完成の差から(2m+2n+1)(2m-2n-1)=4X-1となる。

D=4X-1は0にならず、各整数解(n,m)はDのsigned divisor pair(d,D/d)へ一意に対応するため、有限個の約数を調べれば全解を列挙できる。

採用する候補: |D|の正約数をsqrtまで列挙して全signed divisor dを生成し、factor pairからm,nを復元して整数性とm≥0を検査する

d=2m+2n+1,e=D/dからm=(d+e)/4、n=(d-e-2)/4。全候補をsetに入れてsortすれば漏れも重複もない。

棄却する候補: nをある範囲で走査してn^2+n+Xが平方か判定する

nには入力から明示的な有限範囲がなく、解の有限性はdifference-of-squaresのfactorizationを使って初めて得られる。

Dはoddなのでdivisor pairもoddだが、/4の整数性は符号・順序に依存する。numeratorが4で割り切れることを明示確認するのが安全である。

negative XではDもnegativeでfactor二つの符号が逆になるため、positive divisorだけでなく±dを候補にし、m≥0で平方根の符号を選別する。

D=4X-1、V=|D|とする。q=1..floor(sqrt V)でV%q=0ならq,V/qの各positive divisorを集め、それぞれ±をdとしてe=D/dを計算する。d+eとd-e-2が4の倍数でm=(d+e)/4≥0ならnをsetへ加え、昇順に出力する。

## 典型の発動条件

### difference of squares

発動条件: 二次式が平方になるinteger解をfactor pairへ変換するとき。

4m^2-(2n+1)^2=4X-1として二因子に分ける。

### signed divisor enumeration

発動条件: 積が負にもなるDiophantine equationの全整数factor pairを調べるとき。

|D|の正約数から±dを作り、対応するe=D/dを得る。

### 合同条件による復元

発動条件: factor pairから線形連立で元変数を戻す際に整数性が必要なとき。

二つのnumeratorの4 divisibilityとm非負を確認する。

## 問題固有の要素

無限に見えるn探索を、常にoddで非零な定数4X-1の有限signed factorizationへ閉じ込める。

別の問題へ持ち帰る視点: 二次Diophantine式では平方完成後に(u-v)(u+v)=constantを作れると全解がdivisor列挙になる。

## 正当性

m²=n²+n+Xを平方完成するとd=2m+2n+1,e=2m−2n−1の積が4X−1となる。逆にsigned約数pairでm=(d+e)/4、n=(d−e−2)/4が整数かつm≥0なら元式を満たす。両方向の対応で全解を尽くし、setで同じnを除く。負Xでは異符号pairも必要になる。

## 実装上の注意

- X<0でも|D|を安全な64 bitで取り、q*q overflowを避けq≤V/qでloopする。平方約数の重複と異なるdからの重複nはsetで除く。

## 復習の核

- X=0、正負X、|D|が平方、m=0の解を広い小n範囲の直接square判定と比較する。

## 計算量と制約

### 時間

O(√|4X−1|+D log D)、D=τ(|4X−1|)。signed約数pairを列挙し結果をsort。

### 空間

O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: -10^{14} \le X\le 10^{14}; The input value is an integer.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X=1。

1. D=3。pair(d,e)=(3,1)から(m,n)=(1,0)、(1,3)から(1,−1)。
2. 他のsigned pairはm<0なので除く。

期待される結果: n=−1,0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

X=−1なら正の約数だけでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

D=−5でpairは異符号。実際n=1,−2ではn²+n−1=1。

確認結果: n=−2,1、signed pairが必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/editorial/13733) — source-abc420-editorial-13733-e64a00a448e785a6e17abd4176a44596ef536f2b5911f4ad0b3bcd8ade2a99c4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/tasks/abc420_g) — source-abc420-g-problem-2dff6a1126bda66a46d02fa7128a758855a0d61e22afc818f692e51469319fbf
