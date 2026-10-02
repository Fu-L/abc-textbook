---
title: "ABC336-G — 16 Integers"
draft: true
authoringUnit: {"problemId":"abc336-g","docPath":"src/content/docs/problems/mathematics/outcome-count-euler-circuits-by-best/outcome-count-euler-circuits-by-best-shard-001/abc336-g.md","learningOutcomeIds":["outcome-count-euler-circuits-by-best"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-determinant-counting","unit-euler-trail-circuit","unit-modular-arithmetic"],"excludedTopics":["BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euler-circuit-counting","tag-combinatorial-coefficients","tag-determinant-counting","tag-euler-trail-circuit","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc336-editorial-9060-e22600744a8d6453f620934ad27de12eafcaf2689d5edf2f68c5410a5b709f51","source-abc336-g-problem-9a54fbb0f49670a04b25f56425ed06eeff1244ece4d56f6af87da32441e5c4cb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各長さ4patternは重なる長さ3状態間の辺なので、binary列とpattern全数を使うEuler trailが全単射。degree条件を満たす始終点へ補助辺t→sを加え、その辺を先頭に固定して閉路を切れば線形trailを一度得る。BESTのarborescence数と次数階乗が区別辺の順序を数え、元pattern別X!を除くと同じ文字列の平行辺ラベル差を除ける。","sourceRevisionIds":["source-abc336-editorial-9060-e22600744a8d6453f620934ad27de12eafcaf2689d5edf2f68c5410a5b709f51","source-abc336-g-problem-9a54fbb0f49670a04b25f56425ed06eeff1244ece4d56f6af87da32441e5c4cb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [BEST定理によるEuler circuit数え上げ](src/content/docs/learn/combinatorics-algebra/euler-circuit-counting.md)

- 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [行列式による数え上げ](src/content/docs/learn/combinatorics-algebra/determinant-counting.md)
- [Euler trail・circuit](src/content/docs/learn/graph/euler-trail-circuit.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さ4のpattern(i,j,k,l)を、3bit状態(i,j,k)から(j,k,l)への有向辺と見る。各pattern出現回数Xはその多重辺数であり、条件を満たすbinary列は全辺を一度ずつ使うEuler trailと一対一対応する。

採用する候補: 8頂点多重有向graphのEuler trailをBEST定理と有向行列木定理で数える

辺総数Nが大きくても頂点数は8に固定され、degree・factorial・小行列式だけで計算できる。

棄却する候補: 16種類のpatternを置く順序をDPで列挙する

残個数vectorの状態数がXに対して指数的で、N=10^6を扱えない。

始点・終点候補を8通りずつ調べ、degree差がEuler trail条件を満たす場合は終点から始点への補助辺を加えてEuler閉路へ帰着できる。区別された辺の閉路数はBEST定理の有向全域木数×∏(outdeg(v)-1)!で、全域木数は有向Laplacian minorの行列式になる。

各始点s・終点tのdegree条件を調べ、辺を持つ頂点とs,tだけをVとする。元の辺と区別する補助辺e*:t→sをs=tでも一個加え、V上の連結性と入出次数一致を確認する。e*を最初の辺に固定した閉路からe*を切ると、sからtへの線形なtrailと一対一対応する。自己ループを除いたV上の有向Laplacianから根tの行・列を除き、その余因子の行列式を求める。一頂点なら空行列式は1。これに補助辺・自己ループを含む次数の∏(outdeg(v)-1)!を掛け、元の16種類のX_e!だけで割り、始終点について合計する。X0000=1だけなら答えは1であり、未使用の7頂点を行列へ残してはいけない。

## 典型の発動条件

### de Bruijn graphへの変換

発動条件: 固定長substringの出現回数を指定された列を数える。

長さ3のprefix/suffixを頂点、長さ4 patternをshift辺として、列をEuler trailに対応させる。

### BEST定理と有向行列木定理

発動条件: 頂点数が小さい多重有向graphで全辺を使うtrail数が必要である。

edge順序のfactorial積とLaplacian minor determinantからEuler閉路数を得る。

## 問題固有の要素

同じ4bit patternの辺は列から区別できないため、区別辺に対するBESTの数を各X_e!で割る正規化が必要である。

別の問題へ持ち帰る視点: substring頻度列挙ではEuler路化に加え、同label多重辺のindistinguishabilityをfactorialで補正する。

## 正当性

各長さ4patternは重なる長さ3状態間の辺なので、binary列とpattern全数を使うEuler trailが全単射。degree条件を満たす始終点へ補助辺t→sを加え、その辺を先頭に固定して閉路を切れば線形trailを一度得る。BESTのarborescence数と次数階乗が区別辺の順序を数え、元pattern別X!を除くと同じ文字列の平行辺ラベル差を除ける。

## 実装上の注意

- 辺が存在する頂点だけの連結性と、s=tのEuler circuit caseを分岐する。self-loopはdegreeとfactorialには含めるがarborescence用Laplacianでは適切に除外し、0!を1とする。

## 復習の核

- Nの小さい全binary列を列挙し、全辺がself-loop、open trail、closed trail、degree不整合、同pattern多重辺を公式計数と比較する。

## 計算量と制約

### 時間

O(L+8³·8²)、L=ΣX≤10^6。階乗前計算と固定サイズ行列木の全始終点。

### 空間

O(L+8²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: X_{i, j, k, l} are all non-negative integers.; 1 \leq \displaystyle \sum_{i=0}^1 \sum_{j=0}^1 \sum_{k=0}^1 \sum_{l=0}^1 X_{i,j,k,l} \leq 10^6

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/editorial/9060) — source-abc336-editorial-9060-e22600744a8d6453f620934ad27de12eafcaf2689d5edf2f68c5410a5b709f51
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/tasks/abc336_g) — source-abc336-g-problem-9a54fbb0f49670a04b25f56425ed06eeff1244ece4d56f6af87da32441e5c4cb
