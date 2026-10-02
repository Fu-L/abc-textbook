---
title: "ABC238-G — Cubic?"
draft: true
authoringUnit: {"problemId":"abc238-g","docPath":"src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc238-g.md","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prime-divisor","unit-randomized-algorithms"],"excludedTopics":["乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-randomized-algebraic-fingerprint","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc238-editorial-3358-0e7ddf62b5a984e913d0092536b369695921406bf4aa04b085c18c56765db4cc","source-abc238-g-problem-d954f62c0f399cfe89c60ca4be68feb1a93261e55d2deba9757ba8fe1185ab6f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"a_p XOR b_p XOR (a_p XOR b_p)=0 なので、連続する素因数出現を三個周期で符号化すると、任意区間の p の指数が 3 の倍数の場合だけ寄与が必ず消える。 区間 hash は prefixHash[R] XOR prefixHash[L−1] で得られ、少なくとも一素数の指数が非零 mod 3 なら独立一様乱数を含むため 0 との衝突確率は 2 の 64 乗分の 1 である。 同じ素数の三出現は XOR で 0 になり、非立方区間が偶然 hash 0 になる確率だけを 2 の 64 乗分の 1 に抑えて各クエリを O(1) 判定できる。","sourceRevisionIds":["source-abc238-editorial-3358-0e7ddf62b5a984e913d0092536b369695921406bf4aa04b085c18c56765db4cc","source-abc238-g-problem-d954f62c0f399cfe89c60ca4be68feb1a93261e55d2deba9757ba8fe1185ab6f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択代数fingerprint](src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)
- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)

対象外:

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

区間積が立方数であることは、区間内の各素数 p の指数合計が全て 3 の倍数であることと同値である。

素数ごとの指数 mod 3 ベクトルを全 prefix に保存すると次元とメモリが大きいが、ゼロベクトルかどうかだけなら乱択 fingerprint に圧縮できる。

棄却する候補: 各素数について指数の累積和を持ち、クエリごとに全素数の指数差が 3 の倍数か調べる。

10 の 6 乗以下の素数と N 個の prefix の積を保存・走査できず、Q=20 万にも対応できない。

採用する候補: 各素数 p に独立な 64 bit 値 a_p,b_p を与え、p の出現へ a_p,b_p,a_p XOR b_p を周期的に割り当て、要素ごとの XOR 累積 hash を作る。

同じ素数の三出現は XOR で 0 になり、非立方区間が偶然 hash 0 になる確率だけを 2 の 64 乗分の 1 に抑えて各クエリを O(1) 判定できる。

a_p XOR b_p XOR (a_p XOR b_p)=0 なので、連続する素因数出現を三個周期で符号化すると、任意区間の p の指数が 3 の倍数の場合だけ寄与が必ず消える。

区間 hash は prefixHash[R] XOR prefixHash[L−1] で得られ、少なくとも一素数の指数が非零 mod 3 なら独立一様乱数を含むため 0 との衝突確率は 2 の 64 乗分の 1 である。

各素数pについて全prefixを通じた出現位相を管理し、出現ごとにa_p,b_p,a_p XOR b_pを周期的にXORする。累積指数の剰余0,1,2はそれぞれ0,a_p,a_p XOR b_pに符号化され、区間積の完全三乗性は両端prefixの状態の等値判定になる。これは状態のランダム符号化であり、Z/3ZからXOR群への準同型ではない。異なる固定prefix状態の差にはa_p,b_pの少なくとも一方が奇数回現れる素数pがあり、他の乱数を固定すると一様な64 bit値が残るので衝突確率は2^(-64)。乱数と独立なQ個のquery全体ではunion boundでQ/2^64以下となる。

## 典型の発動条件

### 素因数指数 mod k の乱択 fingerprint

発動条件: 積が完全 k 乗かを多数区間で判定したいが、全素数の指数ベクトルを明示できないとき。

同じ素数の k 個分が打ち消し合う乱数表現を与え、全素数の状態を固定長 hash へ圧縮する。

### XOR 累積 hash

発動条件: 要素ごとの可換な XOR fingerprint があり、静的区間の fingerprint を高速に取得したいとき。

prefix XOR を構築し、左右 prefix の XOR 差で区間値を得る。

## 問題固有の要素

素因数 p の出現番号は配列全体で左から数え、三周期の割当を継続することで、任意の切り出し区間でも三個分の XOR が相殺する。

別の問題へ持ち帰る視点: 区間で個数 mod k を判定する周期 hash は、各要素内ではなく全 prefix を通じた出現位相を管理する。

## 正当性

a_p XOR b_p XOR (a_p XOR b_p)=0 なので、連続する素因数出現を三個周期で符号化すると、任意区間の p の指数が 3 の倍数の場合だけ寄与が必ず消える。 区間 hash は prefixHash[R] XOR prefixHash[L−1] で得られ、少なくとも一素数の指数が非零 mod 3 なら独立一様乱数を含むため 0 との衝突確率は 2 の 64 乗分の 1 である。 同じ素数の三出現は XOR で 0 になり、非立方区間が偶然 hash 0 になる確率だけを 2 の 64 乗分の 1 に抑えて各クエリを O(1) 判定できる。

## 実装上の注意

- 最小素因数表などで A_i を分解し、同じ素数の重複指数も一回ずつ出現として hash に反映する。
- 符号なし 64 bit 整数で XOR を行い、素数ごとの a_p,b_p を独立性の高い乱数生成器から用意する。

## 復習の核

- 完全 k 乗判定は積そのものを扱わず、各素因数の指数を mod k でゼロ判定する問題へ移す。
- 高次元状態を hash へ圧縮する解法では、真のケースが必ず通ることと偽陽性の確率上界を分けて確認する。

## 計算量と制約

### 時間

O(V log log V+N log V+Q)、Vは値上限、SPF factorizationとprefix hash。

### 空間

O(V+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N,Q \le 2 \times 10^5; 1 \le A_i \le 10^6; 1 \le L_i \le R_i \le N

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/editorial/3358) — source-abc238-editorial-3358-0e7ddf62b5a984e913d0092536b369695921406bf4aa04b085c18c56765db4cc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/tasks/abc238_g) — source-abc238-g-problem-d954f62c0f399cfe89c60ca4be68feb1a93261e55d2deba9757ba8fe1185ab6f
