---
title: "ABC444-G — Kyoen"
draft: true
authoringUnit: {"problemId":"abc444-g","docPath":"src/content/docs/problems/mathematics/outcome-represent-integers-as-two-squares/outcome-represent-integers-as-two-squares-shard-001/abc444-g.md","learningOutcomeIds":["outcome-represent-integers-as-two-squares"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-functional-graph-decomposition","unit-prime-divisor"],"excludedTopics":["Gaussian整数・二平方和の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-gaussian-integers-two-squares","tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc444-editorial-15201-d228d4461c46b04252b60ee63c43fb2dd9e131c229df9f41bbff0d67a09d9f88","source-abc444-g-problem-54f848db5319c94c96ca2f9e9ea24336f3101577b8689d492467f1e10e9beb0f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"円周条件はu=Cx−A,v=Cy−Bと置くとu²+v²=Nかつ(u,v)≡(−A,−B) mod Cになる。norm NのGaussian整数はprime分類で構成できる。p≡3 mod4の奇指数はnorm表現を持たず、偶指数は実因子を固定する。p≡1 mod4はπ,共役πへの指数分配が自由で、p=2と単元4通りも含めると全表現を尽くす。mod Cの乗法状態は有限なので巨大指数を先頭と周期の頻度で一括し、剰余積分布を合成して指定合同座標の全解を数える。逆変換x=(u+A)/C,y=(v+B)/Cは合同条件により整数で一意なので円周格子点数と一致する。","sourceRevisionIds":["source-abc444-editorial-15201-d228d4461c46b04252b60ee63c43fb2dd9e131c229df9f41bbff0d67a09d9f88","source-abc444-g-problem-54f848db5319c94c96ca2f9e9ea24336f3101577b8689d492467f1e10e9beb0f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Gaussian整数・二平方和](src/content/docs/learn/number-theory/gaussian-integers-two-squares.md)

- Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- Gaussian整数・二平方和の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

円周条件はu=Cx−A,v=Cy−Bとしてu²+v²=N、(u,v)≡(−A,−B) mod Cへ変換する。Gaussian整数のnormに基づき素数を分類する。p≡3 (mod 4) の指数が奇数なら二平方和表現はない。偶数なら実因子p^(e/2)を固定する。p≡1 (mod 4) はGaussian素因数πと共役πへの指数分配、p=2は1+i、単元は±1,±iとして全表現を構成する。

## 典型の発動条件

Gaussian整数の素因数分解、mod Cの座標状態に対する周期集計と分布の乗法合成。

## 問題固有の要素

p≡3 (mod 4) とp≡1 (mod 4) の合同類を区別する。座標の符号と順序を持つ解を数えるため、単元4通りを維持する。

## 正当性

円周条件はu=Cx−A,v=Cy−Bと置くとu²+v²=Nかつ(u,v)≡(−A,−B) mod Cになる。norm NのGaussian整数はprime分類で構成できる。p≡3 mod4の奇指数はnorm表現を持たず、偶指数は実因子を固定する。p≡1 mod4はπ,共役πへの指数分配が自由で、p=2と単元4通りも含めると全表現を尽くす。mod Cの乗法状態は有限なので巨大指数を先頭と周期の頻度で一括し、剰余積分布を合成して指定合同座標の全解を数える。逆変換x=(u+A)/C,y=(v+B)/Cは合同条件により整数で一意なので円周格子点数と一致する。

## 実装上の注意

指数が巨大でも剰余状態の先頭と周期に分けて頻度を数える。normが同じでも指定座標合同条件が異なるので状態は実部・虚部の組で保持する。 最終照会の剰余は(−A mod C,−B mod C)。対称性を使って(A,B)を照会するなら、全単元込みの同時符号反転が個数を保つ理由を明示する。

## 復習の核

N=3で0、N=5かつC=1で8を確認する。素数分類の合同式を逆に表記しない。

## 計算量と制約

### 時間

O(sC^4+sC² log Emax)を上界とする。sは素因数数、剰余分布mergeと各因子の周期集計。

### 空間

O(C²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N \geq 1; 2 \leq P_i \leq 100; P_i are distinct primes.; 1 \leq E_i \leq 10^{18}; 1 \leq C \leq 50; 0 \leq A,B \lt C; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/editorial/15201) — source-abc444-editorial-15201-d228d4461c46b04252b60ee63c43fb2dd9e131c229df9f41bbff0d67a09d9f88
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/tasks/abc444_g) — source-abc444-g-problem-54f848db5319c94c96ca2f9e9ea24336f3101577b8689d492467f1e10e9beb0f
