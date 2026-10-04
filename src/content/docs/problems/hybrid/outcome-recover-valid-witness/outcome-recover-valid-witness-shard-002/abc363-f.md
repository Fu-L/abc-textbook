---
title: "ABC363-F — Palindromic Expression"
draft: true
authoringUnit: {"problemId":"abc363-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc363-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prime-divisor"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc363-editorial-10441-6343dfa8d3eb739cbdd3548d2c316644249356ca852bdc9634393c27fa3b6a93","source-abc363-f-problem-3275745df92b9f92ad4f647c61c6536ebaff0452c26dd65d5d4b7cf674d3e2ae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"数字0を含む整数はfactorとして使用できないため、x候補とbase caseのnをdecimal stringで検査する。 nがxで割れ、さらにn/xがrev(x)で割れるときだけmiddle=n/(x·rev(x))へ進み、成功文字列をx*middle*rev(x)で包む。 式の文字列回文性を外側から保証し、積n/(x·rev(x))だけを同じ問題として再帰できる。","sourceRevisionIds":["source-abc363-editorial-10441-6343dfa8d3eb739cbdd3548d2c316644249356ca852bdc9634393c27fa3b6a93","source-abc363-f-problem-3275745df92b9f92ad4f647c61c6536ebaff0452c26dd65d5d4b7cf674d3e2ae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

先に読む単元:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

回文な乗算式は、数N自身が0を含まない回文である形か、x*(中央の回文式)*rev(x)という左右対称な形へ再帰分解できる。

左右因子を探す際はx=1を省ける。またx>sqrt(n)の解があればrev(x)側を左へ置いた同値解があるため、xはsqrt(n)までで十分である。

採用する候補: 約数nを状態とするmemoized recursionで、回文base caseまたはxとrev(x)による左右因子分解を探す。

棄却する候補: Nの全乗法分割と因子順列を生成し、連結した式文字列が回文か調べる。

同じ残り積へ至る分割が重複し、factorizationの並べ方も爆発する。

関数f(n)をmemo化する。nの十進表記が0なしの回文ならその文字列を返す。そうでなければ2≤x≤floor(sqrt(n))を試し、xが0なしでn%x=0、y=rev(x)でも割れるならf(n/x/y)を呼ぶ。成功時は左右をx,yで包み、全候補失敗なら不存在を返す。

## 典型の発動条件

### 外側から作る回文再帰

発動条件: 式や列の全体が反転対称で、外側要素の対応が決まるとき。

左右にreverse関係のfactorを置き、中央だけを部分問題にする。

### 約数状態のmemoization

発動条件: 再帰分解で同じ残りの積へ複数経路から到達するとき。

nごとの成功文字列または失敗を保存して探索を共有する。

## 問題固有の要素

x*rev(x)だけの形も中央へ1を置いたx*1*rev(x)に含められ、再帰patternを一本化できる。

別の問題へ持ち帰る視点: 構成文法では冗長なbase patternを一般再帰の単位元で表せないか確認する。

## 正当性

数字0を含む整数はfactorとして使用できないため、x候補とbase caseのnをdecimal stringで検査する。 nがxで割れ、さらにn/xがrev(x)で割れるときだけmiddle=n/(x·rev(x))へ進み、成功文字列をx*middle*rev(x)で包む。 式の文字列回文性を外側から保証し、積n/(x·rev(x))だけを同じ問題として再帰できる。

## 実装上の注意

- rev(x)の先頭0に相当するx末尾0は「0を含まない」検査で除かれる。sqrt境界の乗算overflowと、失敗状態のmemo化を忘れない。

## 復習の核

- 返す文字列とその積がnである不変条件を再帰ごとに確認する。base case判定を因子探索より先に置き、N=1も試す。

## 計算量と制約

### 時間

O(Σ_{n∈S}√n log n)、Sはmemo化された残り整数集合。最悪は元Nの約数状態に限定。

### 空間

O(τ(N)log N)、memoと結果文字列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{12}; N is an integer.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/editorial/10441) — source-abc363-editorial-10441-6343dfa8d3eb739cbdd3548d2c316644249356ca852bdc9634393c27fa3b6a93
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/tasks/abc363_f) — source-abc363-f-problem-3275745df92b9f92ad4f647c61c6536ebaff0452c26dd65d5d4b7cf674d3e2ae
