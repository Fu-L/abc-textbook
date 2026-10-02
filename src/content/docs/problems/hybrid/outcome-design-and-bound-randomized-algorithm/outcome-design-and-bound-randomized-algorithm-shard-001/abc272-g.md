---
title: "ABC272-G — Yet Another mod M"
draft: true
authoringUnit: {"problemId":"abc272-g","docPath":"src/content/docs/problems/hybrid/outcome-design-and-bound-randomized-algorithm/outcome-design-and-bound-randomized-algorithm-shard-001/abc272-g.md","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prime-divisor"],"excludedTopics":["誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。"],"tagIds":["tag-randomized-algorithm","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370","source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。 divisor closureより全divisorsの代わりにdifferenceのodd prime factorsと4だけを試しても、valid divisorがある場合のより小さいvalid candidateを拾える。 majority pairを引けば真のMがdifferenceのdivisorに現れ、反復でfailure probabilityが幾何的に減る。","sourceRevisionIds":["source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370","source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,4,7,2,8)、候補M=3。","procedure":["mod3は(1,1,1,2,2)。","剰余1の3個はN/2=2.5を超える。"],"executionTarget":null,"expectedResult":"M=3は有効。","verificationStatus":"not_applicable","learningUnitIds":["unit-randomized-algorithms"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"prerequisiteIds":["unit-prime-divisor"],"attainmentCondition":"random sampleで外れた候補を認証なしに出せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"出せない。各候補の全N residue頻度を確認してから出すのでfalse positiveはない。"},"answer":{"reasoningOrVerification":"出せない。各候補の全N residue頻度を確認してから出すのでfalse positiveはない。","procedure":["具体例の各状態・寄与を再計算する。","出せない。各候補の全N residue頻度を確認してから出すのでfalse positiveはない。"],"expectedResult":"出せない。各候補の全N residue頻度を確認してから出すのでfalse positiveはない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 考察

valid Mで同じremainder Xを持つmajority index set Sを考えると、任意のi,j∈SについてM divides |A_i−A_j|となる。

|S|>N/2なのでrandomに二indexを選んだとき両方がSに入る確率は1/4より大きく、正しいdifferenceをconstant probabilityで得られる。

棄却する候補: M=3,…,10^9を列挙してremainder frequenciesを調べる。

modulus候補範囲が大きすぎる。

採用する候補: random pairsのdifferenceをfactorizeし、その3以上のdivisorsを候補Mとして全Aのremainder majorityを検証する。

majority pairを引けば真のMがdifferenceのdivisorに現れ、反復でfailure probabilityが幾何的に減る。

candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。

divisor closureより全divisorsの代わりにdifferenceのodd prime factorsと4だけを試しても、valid divisorがある場合のより小さいvalid candidateを拾える。

hidden majority congruence classからrandom pair samplingでmodulus divisorを抽出し、factorization-generated candidatesをdeterministically verifyするMonte Carlo searchである。

## 典型の発動条件

### majority集合からの乱択sampling

発動条件: 未知のgood subsetが全体の半数超を占め、その中の少数sampleから答え候補を生成できるとき。

random pairを複数回選び、両方がmajority residue classに入るeventを利用する。

### 差の約数による合同類候補

発動条件: 複数整数が同じmodulo remainderを持つ未知modulusを探すとき。

sample differenceをfactorizeし、3以上のdivisorsまたは必要十分なprime-factor candidatesを列挙する。

## 問題固有の要素

入力値はdistinctなのでsampleした異なるindicesのdifferenceは正で、factorization対象0の例外を避けられる。

別の問題へ持ち帰る視点: majority構造はrandom pairが同じhidden classへ入る定数確率を与え、candidate generationのrandomizationに使える。

## 正当性

candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。 divisor closureより全divisorsの代わりにdifferenceのodd prime factorsと4だけを試しても、valid divisorがある場合のより小さいvalid candidateを拾える。 majority pairを引けば真のMがdifferenceのdivisorに現れ、反復でfailure probabilityが幾何的に減る。

## 実装上の注意

- 同一pair・同一factorから出るcandidateをdeduplicateし、M≥3かつM≤10^9を満たすものだけ検証する。
- 試行回数を要求failure probabilityから決め、random generatorのindex選択で同じindexを避ける。

## 復習の核

- 同じmodulo classの二値差はmodulusの倍数になるので、未知modulus候補をdifference factorizationへ移す。
- majorityが保証するconstant hit probabilityと、候補の完全検証を組み合わせてone-sided errorにする。

## 計算量と制約

### 時間

T回sample、差の試し割りO(T√D)、候補C個の検査O(CN)、D=maxA−minA。固定Tで失敗確率を制御する。

### 空間

O(N+√D)、候補とfrequency。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \le N \le 5000; 1 \le A_i \le 10^9; The elements of A are distinct.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,4,7,2,8)、候補M=3。

1. mod3は(1,1,1,2,2)。
2. 剰余1の3個はN/2=2.5を超える。

期待される結果: M=3は有効。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

random sampleで外れた候補を認証なしに出せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

出せない。各候補の全N residue頻度を確認してから出すのでfalse positiveはない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_g) — source-abc272-g-problem-ddd168bffdcf96e57760fa8e5da7e2cb2a407776125006901a509571a5ec8370
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4981) — source-abc272-editorial-4981-11a3815cb43ca9a01f77c8e7c479f8da8cc14d3f210287c9c2c57cc6254bd952
