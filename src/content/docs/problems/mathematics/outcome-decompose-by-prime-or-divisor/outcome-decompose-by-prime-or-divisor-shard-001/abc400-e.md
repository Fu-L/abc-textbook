---
title: "ABC400-E — Ringo's Favorite Numbers 3"
draft: true
authoringUnit: {"problemId":"abc400-e","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc400-e.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc400-e-problem-0c4d02c2dcebc6cb631b724b729e0968a0f291ddae678ae91bd387a3003e31c2","source-abc400-editorial-12624-03cb010f7c808a65ab47555784b4fe0713e5db9d43effcda12e4f104f4523505"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"素因数指数が全て偶数の数はk²と一意に表される。k²とkの相異なるprime集合は同じなので種類数2のkだけ篩で列挙すれば全候補を得る。k昇順はk²昇順だからupper_bound直前がquery以下の最大候補になる。","sourceRevisionIds":["source-abc400-e-problem-0c4d02c2dcebc6cb631b724b729e0968a0f291ddae678ae91bd387a3003e31c2","source-abc400-editorial-12624-03cb010f7c808a65ab47555784b4fe0713e5db9d43effcda12e4f104f4523505"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"query A=90,100。","procedure":["k≤10の二prime値は6,10。候補平方は36,100。","90以下最大は36、100以下最大は100。"],"executionTarget":null,"expectedResult":"36,100。","verificationStatus":"not_applicable","learningUnitIds":["unit-prime-divisor"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"prerequisiteIds":[],"attainmentCondition":"k=12を三primeと数えてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"144は適格。"},"answer":{"reasoningOrVerification":"12=2²·3で相異なるprimeは2種類。指数は種類数を増やさないので144は候補。","procedure":["具体例の各状態・寄与を再計算する。","12=2²·3で相異なるprimeは2種類。指数は種類数を増やさないので144は候補。"],"expectedResult":"144は適格。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

各prime exponentが偶数である条件はNが完全平方数であることと同値である。N=k²とするとdistinct prime factor集合はkと同じなので、kの素因数種類数がちょうど2かだけ調べればよい。

A≤10^12よりk≤10^6で、全平方候補を事前列挙できる。

採用する候補: 1..10^6のdistinct prime factor countをsieveし、count=2のk²をsortしてqueryをupper_boundする

候補は高々10^6個、前計算O(V log log V相当)、各Q query O(log V)で処理できる。

棄却する候補: 各queryから下へ整数を減らしながらfactorizationする

400 number間のgapと素因数分解回数に十分な上界がなく、Q=2×10^5では重い。

prime pを見つけたらpの全multipleへ種類数+1することで指数に関係なくdistinct countを得る。

候補値k²は64 bitで作り、query A以下の最後の位置をupper_bound-1で取る。

spf/count配列を0初期化し、count[p]=0のpをprimeとしてp,2p,…へ+1する。count[k]=2ならk²を候補へ追加する。各Aにupper_bound(candidates,A)直前を答える。

## 典型の発動条件

### 平方根への構造変換

発動条件: 全素因数指数が偶数という条件があるとき。

N=k²としてprime factor種類条件をkへ移す。

### distinct prime divisor sieve

発動条件: 全n≤Vの素因数種類数を一括で求めたいとき。

各primeのmultipleへ一回ずつ加算する。

## 問題固有の要素

10^12という上限でも平方数条件により探索対象のrootは10^6へ落ち、query前計算型問題になる。

別の問題へ持ち帰る視点: 指数parity条件を見たら平方free partや平方根へ変数変換し、値域を縮める。

## 正当性

素因数指数が全て偶数の数はk²と一意に表される。k²とkの相異なるprime集合は同じなので種類数2のkだけ篩で列挙すれば全候補を得る。k昇順はk²昇順だからupper_bound直前がquery以下の最大候補になる。

## 実装上の注意

- 1は素因数0種で除外する。k*kは64 bitで計算し、保証によりupper_boundが先頭になるcaseはない。

## 復習の核

- k≤500をtrial divisionしてsieve countと比較し、p²q²、より高い偶数指数、三prime平方が正しく分類されるか確認する。

## 計算量と制約

### 時間

O(V log log V+Q log V)、V=10^6。素因数種類数の篩と候補二分探索。

### 空間

O(V+Q)、query逐次ならO(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq Q \leq 2 \times 10^5; For each query, 36 \leq A \leq 10^{12}.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

query A=90,100。

1. k≤10の二prime値は6,10。候補平方は36,100。
2. 90以下最大は36、100以下最大は100。

期待される結果: 36,100。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

k=12を三primeと数えてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

12=2²·3で相異なるprimeは2種類。指数は種類数を増やさないので144は候補。

確認結果: 144は適格。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/tasks/abc400_e) — source-abc400-e-problem-0c4d02c2dcebc6cb631b724b729e0968a0f291ddae678ae91bd387a3003e31c2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/editorial/12624) — source-abc400-editorial-12624-03cb010f7c808a65ab47555784b4fe0713e5db9d43effcda12e4f104f4523505
