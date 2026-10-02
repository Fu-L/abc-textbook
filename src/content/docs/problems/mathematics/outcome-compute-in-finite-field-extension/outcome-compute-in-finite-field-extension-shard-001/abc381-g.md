---
title: "ABC381-G — Fibonacci Product"
draft: true
authoringUnit: {"problemId":"abc381-g","docPath":"src/content/docs/problems/mathematics/outcome-compute-in-finite-field-extension/outcome-compute-in-finite-field-extension-shard-001/abc381-g.md","learningOutcomeIds":["outcome-compute-in-finite-field-extension"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-polynomial-convolution","unit-polynomial-multipoint-evaluation","unit-recursive-divide-and-conquer"],"excludedTopics":["素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。"],"tagIds":["tag-finite-field-extension","tag-convolution","tag-polynomial-multipoint-evaluation","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc381-editorial-11378-fc0e9ce2494227f3061ddd831eb689f14c7134c7ca9f86103e1e55228518d544","source-abc381-g-problem-89af6156b09a9d47f79b2b5056c8a024009805911ae0079dd0845252b1b0ab46"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Fibonacci型の一般項を二次拡大体の二指数項へ分けても元の再帰と初期条件を満たすので同じ数列である。指数項の周期で積をblockへ分け、n=iL+jの式を多項式F_Lの等比点評価へ変える操作は各因子を単に再配置したもの。chirp-zはその全評価を畳み込みで正確に求め、周期blockを冪で戻して全N因子を復元する。","sourceRevisionIds":["source-abc381-editorial-11378-fc0e9ce2494227f3061ddd831eb689f14c7134c7ca9f86103e1e55228518d544","source-abc381-g-problem-89af6156b09a9d47f79b2b5056c8a024009805911ae0079dd0845252b1b0ab46"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [拡大有限体の表現と四則演算を構成する](src/content/docs/learn/number-theory/finite-field-extension.md)

- 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [多項式の多点評価・補間](src/content/docs/learn/combinatorics-algebra/polynomial-multipoint-evaluation.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。

## 考察

Fibonacci型数列の一般項は √5 を含む二つの指数項で表せるが、998244353 上に √5 はない。二次拡大体を使えば一般項と積の変形を体上の通常演算として扱える。

採用する候補: F_p(√5) 上で一般項を c1A^n+c2B^n とし、周期で N を縮約した後、積を √N×√N に分けて多項式構築と chirp-z 多点評価で求める。

二次拡大体で閉じた演算ができ、等比点上の積を baby-step/giant-step と畳み込みで O(√p log p) 程度に処理できる。

棄却する候補: a_n を漸化式で N 項生成しながら積を取る。

N は10^18で、法上の周期を使っても周期長が約2×10^9あり線形走査できない。

a+b√5 を係数対として加減乗除すれば F_{p^2} となり、A,B の 2(p+1) 乗が1なので数列積はその周期で分割できる。

D=A/B と置くと本質は Π(c1D^n+c2)。n=iM+j に分けると F(X)=Π_{j=1}^M(c1D^jX+c2) を等比点 D^{iM} で評価する問題になる。

拡大体要素を pair で実装して一般項係数と周期を求める。周期商の積を高速冪し、残りを平方分割する。F_M(X) を doubling と NTT で構築し、chirp-z transform で等比点評価して全値を掛ける。

## 典型の発動条件

### 有限体の二次拡大

発動条件: 必要な平方根や根が基礎体にないが代数式を使いたいとき。

a+b√d の係数対で体演算を実装する。

### baby-step/giant-stepとchirp-z transform

発動条件: 巨大な指数範囲を平方根幅へ分け、等比数列上の多数点で評価したいとき。

指数を√N×√Nに分割し、各blockの等比点評価を係数変形によるconvolutionへ落とす。

## 問題固有の要素

閉形式が法上で使えない時、平方根を諦めるのでなく最小拡大体へ移す。

別の問題へ持ち帰る視点: 巨大な連続積は指数を平方分割し、短い積多項式の等比多点評価へ変換できる。

## 正当性

Fibonacci型の一般項を二次拡大体の二指数項へ分けても元の再帰と初期条件を満たすので同じ数列である。指数項の周期で積をblockへ分け、n=iL+jの式を多項式F_Lの等比点評価へ変える操作は各因子を単に再配置したもの。chirp-zはその全評価を畳み込みで正確に求め、周期blockを冪で戻して全N因子を復元する。

## 実装上の注意

- x,y により一般項係数の除算が退化する場合と積中の0を処理する。拡大体積の最終結果は基礎体成分へ戻ることを確認する。

## 復習の核

- 拡大体へ移る目的、周期縮約、積の平方分割の三段を分け、それぞれの式がどの計算量を削るか説明する。

## 計算量と制約

### 時間

各case O(√P log P)規模の平方分割・chirp-zとO(log N)周期冪、P=998244353。より具体的にはO(L log²L+log N)、L=⌈√(2(P+1))⌉。

### 空間

O(L)。拡大体各要素を係数対で持つ。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 5; 1 \leq N \leq 10^{18}; 0 \leq x \leq 998244352; 0 \leq y \leq 998244352; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/editorial/11378) — source-abc381-editorial-11378-fc0e9ce2494227f3061ddd831eb689f14c7134c7ca9f86103e1e55228518d544
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/tasks/abc381_g) — source-abc381-g-problem-89af6156b09a9d47f79b2b5056c8a024009805911ae0079dd0845252b1b0ab46
