---
title: "ABC276-EX — Construct a Matrix"
draft: true
authoringUnit: {"problemId":"abc276-ex","docPath":"src/content/docs/problems/mathematics/outcome-solve-linear-system-and-rank/outcome-solve-linear-system-and-rank-shard-001/abc276-ex.md","learningOutcomeIds":["outcome-solve-linear-system-and-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bitset-word-parallel","unit-constructive-witness","unit-coordinate-compression","unit-prefix-aggregate"],"excludedTopics":["線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-linear-system-rank","tag-bitset-word-parallel","tag-constructive-witness","tag-coordinate-compression","tag-prefix-difference"],"sourceRevisionIds":["source-abc276-editorial-5169-30499c5ad8dee84dc3313dc5030eb15318ac0f2c796eeb2d8ebbe00f6c34532c","source-abc276-ex-problem-9ff677eed53889aa49b0fdb815218f25f42392d1ebcf2d8b2595757bc6879c43"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非零queryのunion内には0を置けない。そこで1,2を2の指数0,1としてprefix XORを作ると各長方形条件は四cornerの線形方程式になる。任意の解から二次元差分でcellを復元しunion外を0化しても非零queryは変わらない。0queryがunion外cellを持てば成立し、持たなければどの解でも不可能。最後の全query確認で双方を保証する。","sourceRevisionIds":["source-abc276-editorial-5169-30499c5ad8dee84dc3313dc5030eb15318ac0f2c796eeb2d8ebbe00f6c34532c","source-abc276-ex-problem-9ff677eed53889aa49b0fdb815218f25f42392d1ebcf2d8b2595757bc6879c43"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)

- 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)
- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

積が1または2 mod 3の長方形には0を置けず、要素を1=2^0,2=2^1と書けば積条件は2の個数のparity、すなわちF_2上の長方形xorになる。

積が0の条件は長方形内に少なくとも1個0があることなので、非零条件を満たす領域と0を置ける領域を分離して考えられる。

採用する候補: 非零queryを2D prefix xorの4 corner変数によるF_2連立方程式にし、出現cornerだけをbitset Gaussian eliminationで解く。非零queryに覆われないcellを0にする。

cell N²個ではなく高々4Q個のprefix変数で方程式を表し、zero条件もcoverageで最大限満たせる構成になる。

棄却する候補: 各x_{i,j}を変数とするN²変数の連立方程式を直接掃き出す。

N,Q≤2000では変数が最大4×10^6となり、bitsetを使っても掃き出し法が重すぎる。

prefix xor p_{i,j}を使うとrectangle parityはp_{b,d}⊕p_{a-1,d}⊕p_{b,c-1}⊕p_{a-1,c-1}で、queryに現れるcorner以外は0に固定してよい。

非零queryのunion外のcellはどの非零積も壊さないので全て0にできる。これで満たせない0-queryは全cellがunion内であり、どの解でもそこへ0を置けないため不可能である。

e=1,2のqueryだけからcorner prefix変数と右辺(e=2なら1)を作り、F_2掃き出しで一解を得る。未使用prefixは0として2D差分から1/2 matrixを復元し、2D imosで非零queryに覆われないcellを0化する。最後に全queryを検証する。

## 典型の発動条件

### multiplicative conditionの指数化

発動条件: 有限体の非零元が小さな巡回群をなし、積条件を加法条件へ変えられるとき。

mod3の1,2を2の指数0,1へ写し、積をxorへする。

### rectangle queryのprefix corner化

発動条件: 長方形和/xorの線形制約が多数あり、cell変数を減らしたいとき。

各式を4 cornerだけで表し、全queryに現れる高々4Q個のcorner座標をsort-uniqueしてdenseな変数IDへ写す。

### bitset Gaussian elimination

発動条件: F_2上の変数・式が数千規模で、密な連立方程式の可解性と一解が必要なとき。

rowをbitset化してpivot消去し、矛盾行を検出する。pivot情報から一解を復元し、2D差分で出力matrixへ戻す。

## 問題固有の要素

非零積queryのunionは0を絶対に置けない領域であり、その外をすべて0にする構成が全zero queryを同時に満たすための最強の選択になる。

別の問題へ持ち帰る視点: 制約が『禁止領域』と『少なくとも1個のmarker』に分かれるとき、許可領域を全面marker化して残る条件だけを検査する。

## 正当性

非零queryのunion内には0を置けない。そこで1,2を2の指数0,1としてprefix XORを作ると各長方形条件は四cornerの線形方程式になる。任意の解から二次元差分でcellを復元しunion外を0化しても非零queryは変わらない。0queryがunion外cellを持てば成立し、持たなければどの解でも不可能。最後の全query確認で双方を保証する。

## 実装上の注意

- prefix cornerにはindex 0を含め、同じcornerを座標圧縮して1変数として共有する。
- 掃き出し後のmatrix復元だけで安心せず、0-queryにuncovered cellがあるか、または完成matrixの全queryを検証してNoを判定する。

## 復習の核

- 2×2のprefix xorからcell値を復元する式と、非零rectangleのunion内へ1個でも0を置くと壊れる理由を別々に手計算する。

## 計算量と制約

### 時間

O(N²+Q·C²/w+Q²)、C≤4Qは圧縮prefix変数数、wはbitset語長。素朴消去はO(QC²)。

### 空間

O(N²+QC/w)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,Q \leq 2000; 1 \leq a_i \leq b_i \leq N; 1 \leq c_i \leq d_i \leq N; e_i \in \{0,1,2 \}; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/editorial/5169) — source-abc276-editorial-5169-30499c5ad8dee84dc3313dc5030eb15318ac0f2c796eeb2d8ebbe00f6c34532c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/tasks/abc276_h) — source-abc276-ex-problem-9ff677eed53889aa49b0fdb815218f25f42392d1ebcf2d8b2595757bc6879c43
